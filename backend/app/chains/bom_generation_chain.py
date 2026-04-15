from typing import Dict, Any, List


def get_bom_list(
    network_design: Dict[str, Any],
    nic_recommendation: Dict[str, Any],
    input_config: Dict[str, Any]
) -> List[Dict[str, Any]]:
    server_count = input_config.get("server_count", 4)
    count_per_server = nic_recommendation.get("count_per_server", 2)
    total_nics = server_count * count_per_server
    fabric_type = input_config.get("fabric_type", "InfiniBand")
    port_type = nic_recommendation.get("port_type", "OSFP")
    speed = nic_recommendation.get("speed", "400G")
    server_to_switch_distance = input_config.get("server_to_switch_distance_meters", 3)
    link_preference = input_config.get("link_preference", "auto")
    total_ports = total_nics * nic_recommendation.get("port_count", 2)

    if fabric_type == "InfiniBand":
        switch_name = "InfiniBand交换机"
        switch_model = "NVIDIA Quantum-2 QM9700"
        switch_link = "https://www.nvidia.com/en-us/networking/infiniband/switches/quantum-2/"
    else:
        switch_name = "RoCE以太网交换机"
        switch_model = "NVIDIA Spectrum-X SN4600"
        switch_link = "https://www.nvidia.com/en-us/networking/ethernet/switches/spectrum-x/"

    bom = [
        {
            "id": "1",
            "type": "nic",
            "name": "服务器数据网卡",
            "full_model": nic_recommendation.get("full_model", "ConnectX-7 MCX75310AAS-HEAT"),
            "quantity": total_nics,
            "port_count": nic_recommendation.get("port_count", 2),
            "port_type": port_type,
            "speed": speed,
            "link": nic_recommendation.get("official_links", ["https://www.nvidia.com/en-us/networking/ethernet/adapters/connectx-7/"])[0],
            "isEditable": True
        },
        {
            "id": "2",
            "type": "switch",
            "name": switch_name,
            "full_model": switch_model,
            "quantity": 2,
            "port_count": 64,
            "port_type": port_type,
            "speed": speed,
            "link": switch_link,
            "isEditable": True
        }
    ]

    if link_preference == "transceiver_priority" or server_to_switch_distance > 30:
        bom.extend([
            {
                "id": "3",
                "type": "transceiver",
                "name": "交换机侧光模块",
                "full_model": "400G DR4 OSFP" if speed == "400G" else "200G FR4 QSFP56",
                "quantity": total_ports,
                "port_type": port_type,
                "speed": speed,
                "distance": f"{server_to_switch_distance}m",
                "link": "https://www.nvidia.com/en-us/networking/transceivers/",
                "isEditable": True
            },
            {
                "id": "4",
                "type": "cable",
                "name": "光纤跳线",
                "full_model": "待补充光纤跳线 SKU",
                "quantity": max(1, total_ports // 2),
                "cable_type": "无源光纤",
                "length": f"{server_to_switch_distance}m",
                "interface_type": f"{port_type}-{port_type}",
                "link": "https://www.nvidia.com/en-us/networking/cables/",
                "isEditable": True
            }
        ])
    else:
        bom.append({
            "id": "3",
            "type": "cable",
            "name": "服务器到交换机线缆",
            "full_model": "NVIDIA 400G DAC" if speed == "400G" and server_to_switch_distance <= 3 else "NVIDIA 400G AOC" if speed == "400G" else "NVIDIA 200G AOC",
            "quantity": total_ports,
            "cable_type": "直连铜缆" if server_to_switch_distance <= 3 else "有源光缆",
            "length": f"{server_to_switch_distance}m",
            "interface_type": f"{port_type}-{port_type}",
            "link": "https://www.nvidia.com/en-us/networking/cables/",
            "isEditable": True
        })

    return bom
