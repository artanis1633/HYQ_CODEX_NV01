from typing import Dict, Any, List


def get_validation_report(
    input_config: Dict[str, Any],
    nic_recommendation: Dict[str, Any],
    network_design: Dict[str, Any],
    bom_list: List[Dict[str, Any]]
) -> Dict[str, Any]:
    fabric_type = input_config.get("fabric_type", "InfiniBand")
    use_case = input_config.get("use_case", "AI_training")
    server_to_switch_distance = input_config.get("server_to_switch_distance_meters", 3)
    switch_to_switch_distance = input_config.get("switch_to_switch_distance_meters", 5)
    gpu_models = [gpu.get("model", "") for gpu in input_config.get("gpu_configs", [])]
    nic_port_type = nic_recommendation.get("port_type")
    switch_port_types = {item.get("port_type") for item in bom_list if item.get("type") == "switch" and item.get("port_type")}

    issues = []
    score = 9.1
    optimization_suggestions: List[str] = []
    switch_items = [item for item in bom_list if item.get("type") == "switch"]
    cable_items = [item for item in bom_list if item.get("type") == "cable"]
    has_dpu = any(item.get("type") == "dpu" for item in bom_list)

    if len(switch_items) > 1:
        optimization_suggestions.append("当前已按多台交换机展开 BOM，后续可继续细化 Leaf/Spine 比例与冗余端口预算。")

    if server_to_switch_distance > 30:
        score -= 0.4
        issues.append({
            "severity": "warning",
            "message": "服务器到交换机距离较长，当前方案已切换为模块化光连接。",
            "suggestion": "建议后续补充交换机侧与服务器侧光模块 SKU，并确认单模/多模纤芯类型。"
        })

    if switch_to_switch_distance > 50:
        score -= 0.3
        issues.append({
            "severity": "warning",
            "message": "交换机之间距离较长，可能需要单模 FR4 / 更长距离链路规划。",
            "suggestion": "建议优先补充 Spine/Leaf 间长距模块规则。"
        })

    if fabric_type == "RoCE":
        score -= 0.2
        issues.append({
            "severity": "info",
            "message": "当前 ROCE 路线已按 Spectrum 交换设备输出，但部分线缆与模块细节仍基于 400G LinkX 主路径经验规则。",
            "suggestion": "后续继续补充 QSFP28 / QSFP56 / QSFP-DD 官方资料，以增强 ROCE 路线的精细度。"
        })

    if any("L20" in model or "L40" in model or "RTX PRO 6000D" in model for model in gpu_models):
        optimization_suggestions.append("推理型 GPU 默认无需强制双网卡冗余，可根据预算手动减少链路数量。")

    if not has_dpu:
        optimization_suggestions.append("当前默认未自动加入 DPU，若后续需要存储卸载、安全隔离或服务编排能力，可在单机预览中手动混编 BlueField。")

    if nic_port_type and switch_port_types and nic_port_type not in switch_port_types:
        score -= 0.8
        issues.append({
            "severity": "warning",
            "message": f"当前服务器侧端口类型为 {nic_port_type}，而交换机侧为 {', '.join(sorted(switch_port_types))}，后续需确认是否存在明确的分拆或适配路径。",
            "suggestion": "若暂未掌握官方适配矩阵，建议优先选择端口类型一致的交换机型号。"
        })

    if any("光纤" in (item.get("name") or "") for item in cable_items):
        issues.append({
            "severity": "info",
            "message": "当前 BOM 已引入模块化光链路，但交换机侧与服务器侧模块的精确 SKU 仍可继续细化。",
            "suggestion": "后续根据单模/多模、MPO/LC 以及 IHS/RHS 方向性补足精确模块型号。"
        })

    if use_case == "AI_training":
        optimization_suggestions.append("训练场景建议继续保留高带宽双链路，并优先使用短距 DAC/ACC 或标准化光模块方案。")
    else:
        optimization_suggestions.append("推理场景可优先简化网络规模，后续按吞吐与隔离需求再决定是否混编 DPU。")

    configuration_rationale = (
        f"当前方案依据用户选择的 {fabric_type} 组网路线、GPU 形态、业务场景和距离约束生成。"
        " DPU 默认不自动纳入推荐，系统优先提供一条可演示、可编辑、可后续扩展到混编的主路径方案。"
    )

    return {
        "validation_score": max(0.0, round(score, 1)),
        "issues": issues,
        "optimization_suggestions": optimization_suggestions,
        "configuration_rationale": configuration_rationale,
    }
