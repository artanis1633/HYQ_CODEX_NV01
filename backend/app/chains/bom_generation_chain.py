from typing import Dict, Any, List


def get_bom_list(
    network_design: Dict[str, Any],
    nic_recommendation: Dict[str, Any],
    input_config: Dict[str, Any]
) -> List[Dict[str, Any]]:
    return [
        {
            "id": "1",
            "type": "nic",
            "name": "ConnectX-7网卡",
            "full_model": "ConnectX-7 MCX75310AAS-HEAT",
            "quantity": 8,
            "port_count": 2,
            "port_type": "OSFP",
            "speed": "400G",
            "link": "https://www.nvidia.com/en-us/networking/ethernet/adapters/connectx-7/",
            "isEditable": True
        },
        {
            "id": "2",
            "type": "switch",
            "name": "Quantum-2交换机",
            "full_model": "NVIDIA Quantum-2 QM9700",
            "quantity": 2,
            "port_count": 64,
            "port_type": "OSFP",
            "speed": "400G",
            "link": "https://www.nvidia.com/en-us/networking/ethernet/switches/quantum-2/",
            "isEditable": True
        }
    ]
