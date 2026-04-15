from typing import Dict, Any

from app.chains.ai_bandwidth_reasoning import summarize_bandwidth_assessment
from app.knowledge.rules_repository import (
    choose_link_bundle,
    get_catalog_link,
    get_recommended_nic,
    get_switch_for_fabric,
)


def get_network_design(input_config: Dict[str, Any], nic_recommendation: Dict[str, Any]) -> Dict[str, Any]:
    fabric_type = input_config.get("fabric_type", "InfiniBand")
    server_to_switch_distance = input_config.get("server_to_switch_distance_meters", 3)
    switch_to_switch_distance = input_config.get("switch_to_switch_distance_meters", 5)
    link_preference = input_config.get("link_preference", "auto")
    nic = get_recommended_nic(input_config)
    switch = get_switch_for_fabric(fabric_type, nic)
    server_bundle = choose_link_bundle(
        speed=nic_recommendation.get("speed", "400G"),
        port_type=nic_recommendation.get("port_type", "OSFP"),
        distance_meters=server_to_switch_distance,
        link_preference=link_preference,
        endpoint_role="服务器到交换机"
    )
    switch_bundle = choose_link_bundle(
        speed=switch.get("speed", nic_recommendation.get("speed", "400G")),
        port_type=switch.get("port_type", nic_recommendation.get("port_type", "OSFP")),
        distance_meters=switch_to_switch_distance,
        link_preference=link_preference,
        endpoint_role="交换机之间"
    )
    switch_label = switch.get("sku") or switch.get("full_model", "待补充交换机型号")
    switch_family_label = "Quantum-2 / NDR" if fabric_type == "InfiniBand" else f"Spectrum / {switch.get('speed', '400G')}"
    analysis = summarize_bandwidth_assessment(input_config, nic_recommendation)
    assessment = analysis["assessment"]

    return {
        "fabric_type": fabric_type,
        "switch_type": f"{switch_family_label} · {switch_label}",
        "architecture_type": "胖树拓扑" if fabric_type == "InfiniBand" else "两层 Leaf-Spine",
        "architecture_description": f"当前 demo 已优先映射到 {switch_label}，并依据用户选择的 {fabric_type} 技术路线生成主路径交换方案。",
        "high_availability_design": "默认按双链路与交换机冗余预留进行规划，后续可在 BOM 编辑后再次校验。",
        "performance_estimate": {
            "bandwidth": f"{nic_recommendation.get('speed', '400G')} per port",
            "latency": "sub-microsecond"
        },
        "scalability_suggestions": "后续建议在规则库中继续补充分层拓扑、交换机级别冗余和 DPU 混编设计。",
        "gpu_context_summary": analysis["gpu_context_summary"],
        "bandwidth_analysis_summary": analysis["bandwidth_analysis_summary"],
        "bandwidth_tier": assessment.get("bandwidth_tier", "high"),
        "single_server_network_bandwidth": analysis["single_server_network_bandwidth"],
        "nic_sizing_rationale": analysis["nic_sizing_rationale"],
        "analysis_source": assessment.get("source", "heuristic"),
        "cabling_guidance": [
            f"服务器到交换机距离按 {server_to_switch_distance}m 处理，建议链路方式：{server_bundle['guidance']}",
            f"交换机之间距离按 {switch_to_switch_distance}m 处理，建议链路方式：{switch_bundle['guidance']}",
            f"当前链路策略为 {link_preference}。"
        ],
        "reference_links": [
            get_catalog_link(switch, "https://docs.nvidia.com/dgx-basepod/reference-architecture-infrastructure-foundation-enterprise-ai/latest/core-components.html")
        ]
    }
