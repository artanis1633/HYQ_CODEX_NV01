from typing import Dict, Any

from app.chains.ai_bandwidth_reasoning import get_ai_bandwidth_assessment
from app.knowledge.rules_repository import (
    find_nic_by_full_model,
    get_catalog_link,
    get_count_per_server,
    get_effective_interconnect,
    get_recommended_nic,
    get_total_gpu_count,
    is_sxm_nvlink_reference_node,
)


def get_nic_recommendation(input_config: Dict[str, Any]) -> Dict[str, Any]:
    fabric_type = input_config.get("fabric_type", "InfiniBand")
    use_case = input_config.get("use_case", "AI_training")
    gpu_configs = input_config.get("gpu_configs", [])
    ai_assessment = get_ai_bandwidth_assessment(input_config)
    nic = get_recommended_nic(input_config)
    ai_suggested_model = ai_assessment.get("recommended_nic_model")
    if not is_sxm_nvlink_reference_node(input_config) and isinstance(ai_suggested_model, str):
        ai_nic = find_nic_by_full_model(ai_suggested_model)
        if ai_nic:
            nic = ai_nic
    full_model = nic.get("full_model", "ConnectX-7 MCX75310AAS-HEAT")
    generation = nic.get("family", "ConnectX-7")
    speed = nic.get("speed", "400G")
    port_type = nic.get("port_type", "OSFP")
    port_count = nic.get("port_count", 2)
    count_per_server = get_count_per_server(input_config, nic)
    links = [get_catalog_link(nic, "https://docs.nvidia.com/networking/display/connectx7vpi")]
    role = "主数据网卡" if use_case == "AI_training" else "主业务网卡"
    is_reference_node = is_sxm_nvlink_reference_node(input_config)
    total_gpu_count = get_total_gpu_count(input_config)
    effective_interconnects = sorted({
        get_effective_interconnect(gpu.get("model", ""), gpu.get("interconnect"))
        for gpu in gpu_configs
    })

    if not is_reference_node:
        suggested_count = ai_assessment.get("recommended_count_per_server")
        if isinstance(suggested_count, int) and suggested_count >= 1:
            count_per_server = suggested_count

    ratio_note = (
        f"当前按参考架构采用 GPU:NIC = 1:1，单台服务器推荐 {count_per_server} 张单端口网卡，对应 {total_gpu_count} 张 GPU。"
        if is_reference_node and nic.get("port_count") == 1
        else f"单机默认推荐 {count_per_server} 块 {generation}，后续可以手动替换部分网卡为 BlueField DPU。"
    )

    return {
        "generation": generation,
        "full_model": full_model,
        "count_per_server": count_per_server,
        "port_count": port_count,
        "port_type": port_type,
        "speed": speed,
        "fabric_type": fabric_type,
        "per_server_adapters": [
            {
                "device_type": "nic",
                "full_model": full_model,
                "quantity": count_per_server,
                "role": role,
                "speed": speed,
                "port_type": port_type,
            }
        ],
        "planning_notes": [
            "默认不自动纳入 DPU，由用户后续在单机预览和可编辑 BOM 中手动混编。",
            f"当前方案已按 {fabric_type} 技术路线约束后续交换与链路设备。",
            f"当前已将应用场景 {use_case} 和 GPU 互联模式 {', '.join(effective_interconnects)} 纳入带宽判断。",
            ratio_note
        ],
        "explanation": (
            f"当前基于现有规则库选择 {generation} 作为 demo 主路径，并根据业务场景与 GPU 形态估算单机网卡数量。"
            f" 带宽评估来源：{ai_assessment.get('source', 'heuristic')}，级别为 {ai_assessment.get('bandwidth_tier', 'high')}。"
            f" {ai_assessment.get('summary', '')}"
            + (" 对于 SXM + NVLink/NVSwitch 的参考架构节点，系统优先采用单端口 HCA 并按 GPU:NIC 1:1 处理。" if is_reference_node else "")
        ),
        "official_links": links
    }
