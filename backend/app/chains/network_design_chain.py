from typing import Dict, Any


def get_network_design(input_config: Dict[str, Any], nic_recommendation: Dict[str, Any]) -> Dict[str, Any]:
    fabric_type = input_config.get("fabric_type", "InfiniBand")
    server_to_switch_distance = input_config.get("server_to_switch_distance_meters", 3)
    switch_to_switch_distance = input_config.get("switch_to_switch_distance_meters", 5)
    link_preference = input_config.get("link_preference", "auto")

    return {
        "fabric_type": fabric_type,
        "switch_type": "Quantum InfiniBand" if fabric_type == "InfiniBand" else "Spectrum Ethernet",
        "architecture_type": "胖树拓扑" if fabric_type == "InfiniBand" else "两层 Leaf-Spine",
        "architecture_description": "占位组网方案，已加入按 InfiniBand / RoCE 路线切换交换技术的基础能力。",
        "high_availability_design": "默认按双链路与交换机冗余预留进行规划，后续可在 BOM 编辑后再次校验。",
        "performance_estimate": {
            "bandwidth": f"{nic_recommendation.get('speed', '400G')} per port",
            "latency": "sub-microsecond"
        },
        "scalability_suggestions": "后续建议在规则库中继续补充分层拓扑、交换机级别冗余和 DPU 混编设计。",
        "cabling_guidance": [
            f"服务器到交换机距离按 {server_to_switch_distance}m 处理。",
            f"交换机之间距离按 {switch_to_switch_distance}m 处理。",
            f"当前链路策略为 {link_preference}。"
        ],
        "reference_links": [
            "https://www.nvidia.com/en-us/networking/solutions/hpc/"
        ]
    }
