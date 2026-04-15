from typing import Dict, Any


def get_nic_recommendation(input_config: Dict[str, Any]) -> Dict[str, Any]:
    fabric_type = input_config.get("fabric_type", "InfiniBand")
    use_case = input_config.get("use_case", "AI_training")
    gpu_configs = input_config.get("gpu_configs", [])
    high_perf = use_case == "AI_training" or any(
        gpu.get("interconnect") in {"NVSwitch", "NVLink"} for gpu in gpu_configs
    )

    if fabric_type == "InfiniBand" or high_perf:
        full_model = "ConnectX-7 MCX75310AAS-HEAT"
        generation = "ConnectX-7"
        speed = "400G"
        port_type = "OSFP"
        port_count = 2
        count_per_server = 2 if high_perf else 1
        links = [
            "https://www.nvidia.com/en-us/networking/ethernet/adapters/connectx-7/"
        ]
    else:
        full_model = "ConnectX-6 Lx MCX623106AN-CDAT"
        generation = "ConnectX-6 Lx"
        speed = "200G"
        port_type = "QSFP56"
        port_count = 2
        count_per_server = 1
        links = [
            "https://www.nvidia.com/en-us/networking/ethernet/adapters/connectx-6-lx/"
        ]

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
                "role": "主数据网卡" if use_case == "AI_training" else "主业务网卡",
                "speed": speed,
                "port_type": port_type,
            }
        ],
        "planning_notes": [
            "默认不自动纳入 DPU，由用户后续在单机预览和可编辑 BOM 中手动混编。",
            f"当前方案已按 {fabric_type} 技术路线约束后续交换与链路设备。"
        ],
        "explanation": "占位网卡推荐结果，已按组网类型和训练/推理场景区分基础推荐路径。",
        "official_links": links
    }
