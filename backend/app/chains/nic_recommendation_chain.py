from typing import Dict, Any


def get_nic_recommendation(input_config: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "generation": "ConnectX-7",
        "full_model": "ConnectX-7 MCX75310AAS-HEAT",
        "count_per_server": 2,
        "port_count": 2,
        "port_type": "OSFP",
        "speed": "400G",
        "explanation": "占位网卡推荐结果，待实现LangChain集成",
        "official_links": [
            "https://www.nvidia.com/en-us/networking/ethernet/adapters/connectx-7/"
        ]
    }
