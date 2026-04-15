from typing import Dict, Any, List

from app.knowledge.rules_repository import (
    choose_link_bundle,
    estimate_switch_count,
    get_catalog_link,
    get_recommended_nic,
    get_switch_for_fabric,
)


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
    switch_to_switch_distance = input_config.get("switch_to_switch_distance_meters", 5)
    link_preference = input_config.get("link_preference", "auto")
    total_ports = total_nics * nic_recommendation.get("port_count", 2)
    nic = get_recommended_nic(input_config)
    switch = get_switch_for_fabric(fabric_type, nic)
    switch_name = "InfiniBand交换机" if fabric_type == "InfiniBand" else "RoCE以太网交换机"
    switch_model = switch.get("sku") or switch.get("full_model", "待补充交换机型号")
    switch_link = get_catalog_link(switch, "https://docs.nvidia.com/dgx-basepod/reference-architecture-infrastructure-foundation-enterprise-ai/latest/core-components.html")
    switch_port_count = switch.get("port_count", 64)
    switch_count = estimate_switch_count(total_ports, switch_port_count)
    server_bundle = choose_link_bundle(
        speed=speed,
        port_type=port_type,
        distance_meters=server_to_switch_distance,
        link_preference=link_preference,
        endpoint_role="服务器到交换机"
    )
    switch_bundle = choose_link_bundle(
        speed=switch.get("speed", speed),
        port_type=switch.get("port_type", port_type),
        distance_meters=switch_to_switch_distance,
        link_preference=link_preference,
        endpoint_role="交换机之间"
    )
    inter_switch_links = max(0, switch_count - 1) * 2

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
            "link": nic_recommendation.get("official_links", ["https://docs.nvidia.com/networking/display/connectx7vpi"])[0],
            "isEditable": True
        },
        {
            "id": "2",
            "type": "switch",
            "name": switch_name,
            "full_model": switch_model,
            "quantity": switch_count,
            "port_count": switch_port_count,
            "port_type": switch.get("port_type", port_type),
            "speed": switch.get("speed", speed),
            "link": switch_link,
            "isEditable": True
        }
    ]

    if server_bundle["mode"] == "transceiver":
        transceiver = server_bundle["transceiver"]
        bom.extend([
            {
                "id": "3",
                "type": "transceiver",
                "name": "交换机侧光模块",
                "full_model": transceiver.get("sku") or transceiver.get("full_model", "待补充模块 SKU"),
                "quantity": total_ports,
                "port_type": transceiver.get("port_type", port_type),
                "speed": speed,
                "distance": transceiver.get("distance", f"{server_to_switch_distance}m"),
                "link": get_catalog_link(transceiver, "https://www.nvidia.com/en-us/networking/interconnect/"),
                "isEditable": True
            },
            {
                "id": "4",
                "type": "cable",
                "name": "光纤跳线",
                "full_model": "LC/MPO 光纤跳线（待补充精确 SKU）",
                "quantity": max(1, total_ports // 2),
                "cable_type": "无源光纤",
                "length": f"{server_to_switch_distance}m",
                "interface_type": f"{transceiver.get('port_type', port_type)}-{transceiver.get('port_type', port_type)}",
                "link": "https://www.nvidia.com/en-us/networking/interconnect/",
                "isEditable": True
            }
        ])
    else:
        server_cable = server_bundle["cable"]
        bom.append({
            "id": "3",
            "type": "cable",
            "name": "服务器到交换机线缆",
            "full_model": server_cable.get("sku") or server_cable.get("full_model", "待补充线缆 SKU"),
            "quantity": total_ports,
            "cable_type": server_cable.get("local_label", server_cable.get("cable_type", "线缆")),
            "length": f"{server_to_switch_distance}m",
            "interface_type": server_cable.get("interface_type", f"{port_type}-{port_type}"),
            "link": get_catalog_link(server_cable, "https://www.nvidia.com/en-us/networking/interconnect/"),
            "isEditable": True
        })

    if inter_switch_links > 0:
        if switch_bundle["mode"] == "transceiver":
            inter_transceiver = switch_bundle["transceiver"]
            bom.extend([
                {
                    "id": "5",
                    "type": "transceiver",
                    "name": "交换机互联模块",
                    "full_model": inter_transceiver.get("sku") or inter_transceiver.get("full_model", "待补充互联模块 SKU"),
                    "quantity": inter_switch_links * 2,
                    "port_type": inter_transceiver.get("port_type", switch.get("port_type", port_type)),
                    "speed": switch.get("speed", speed),
                    "distance": inter_transceiver.get("distance", f"{switch_to_switch_distance}m"),
                    "link": get_catalog_link(inter_transceiver, "https://www.nvidia.com/en-us/networking/interconnect/"),
                    "isEditable": True
                },
                {
                    "id": "6",
                    "type": "cable",
                    "name": "交换机互联光纤",
                    "full_model": "交换机互联光纤（待补充精确 SKU）",
                    "quantity": inter_switch_links,
                    "cable_type": "无源光纤",
                    "length": f"{switch_to_switch_distance}m",
                    "interface_type": f"{switch.get('port_type', port_type)}-{switch.get('port_type', port_type)}",
                    "link": "https://www.nvidia.com/en-us/networking/interconnect/",
                    "isEditable": True
                }
            ])
        else:
            inter_cable = switch_bundle["cable"]
            bom.append({
                "id": "5",
                "type": "cable",
                "name": "交换机互联线缆",
                "full_model": inter_cable.get("sku") or inter_cable.get("full_model", "待补充互联线缆 SKU"),
                "quantity": inter_switch_links,
                "cable_type": inter_cable.get("local_label", inter_cable.get("cable_type", "线缆")),
                "length": f"{switch_to_switch_distance}m",
                "interface_type": inter_cable.get("interface_type", f"{switch.get('port_type', port_type)}-{switch.get('port_type', port_type)}"),
                "link": get_catalog_link(inter_cable, "https://www.nvidia.com/en-us/networking/interconnect/"),
                "isEditable": True
            })

    return bom
