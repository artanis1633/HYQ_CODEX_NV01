from __future__ import annotations

from functools import lru_cache
from math import ceil
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

import yaml


ROOT_DIR = Path(__file__).resolve().parents[2]
RULES_DIR = ROOT_DIR / "knowledge_base" / "rules"
PRODUCTS_PATH = RULES_DIR / "products_catalog.yaml"
COMPATIBILITY_PATH = RULES_DIR / "compatibility_rules.yaml"


def _normalize(value: Optional[str]) -> str:
    return (value or "").strip().lower()


@lru_cache(maxsize=1)
def load_products_catalog() -> Dict[str, Any]:
    with PRODUCTS_PATH.open("r", encoding="utf-8") as file:
        return yaml.safe_load(file) or {}


@lru_cache(maxsize=1)
def load_compatibility_rules() -> Dict[str, Any]:
    with COMPATIBILITY_PATH.open("r", encoding="utf-8") as file:
        return yaml.safe_load(file) or {}


def get_products(group: str) -> List[Dict[str, Any]]:
    return list(load_products_catalog().get("products", {}).get(group, []))


def _matches_any(value: str, keywords: Iterable[str]) -> bool:
    normalized_value = _normalize(value)
    return any(_normalize(keyword) in normalized_value for keyword in keywords if keyword)


def get_effective_interconnect(model: str, requested_interconnect: Optional[str]) -> str:
    if _matches_any(model, ("pcie",)):
        return "PCIe"
    if _matches_any(model, ("sxm",)):
        return "NVLink"
    return requested_interconnect or "PCIe"


def _find_best_family_for_request(input_config: Dict[str, Any]) -> str:
    gpu_configs = input_config.get("gpu_configs", [])
    gpu_models = [gpu.get("model", "") for gpu in gpu_configs]
    use_case = input_config.get("use_case", "AI_training")
    fabric_type = input_config.get("fabric_type", "InfiniBand")

    if fabric_type == "InfiniBand":
        return "ConnectX-7"

    if use_case == "AI_training":
        return "ConnectX-7"

    workstation_keywords = ("l20", "l40", "a40", "rtx pro 6000d")
    if gpu_models and all(_matches_any(model, workstation_keywords) for model in gpu_models):
        return "ConnectX-6 Lx"

    hopper_keywords = ("h100", "h200", "h800", "h20")
    if any(_matches_any(model, hopper_keywords) for model in gpu_models):
        return "ConnectX-7"

    return "ConnectX-6 Lx"


def get_total_gpu_count(input_config: Dict[str, Any]) -> int:
    gpu_configs = input_config.get("gpu_configs", [])
    return sum(int(gpu.get("count", 0) or 0) for gpu in gpu_configs)


def is_sxm_nvlink_reference_node(input_config: Dict[str, Any]) -> bool:
    gpu_configs = input_config.get("gpu_configs", [])
    if not gpu_configs:
        return False

    has_nvscale_interconnect = any(
        get_effective_interconnect(gpu.get("model", ""), gpu.get("interconnect")) == "NVLink"
        for gpu in gpu_configs
    )
    has_sxm_gpu = any(_matches_any(gpu.get("model", ""), ("sxm",)) for gpu in gpu_configs)
    has_data_center_gpu = any(
        _matches_any(gpu.get("model", ""), ("h100", "h200", "h800", "a100", "a800"))
        for gpu in gpu_configs
    )
    return has_nvscale_interconnect and has_sxm_gpu and has_data_center_gpu


def get_recommended_nic(input_config: Dict[str, Any]) -> Dict[str, Any]:
    if is_sxm_nvlink_reference_node(input_config):
        gpu_models = [gpu.get("model", "") for gpu in input_config.get("gpu_configs", [])]
        nic_family = "ConnectX-7" if any(_matches_any(model, ("h100", "h200", "h800", "h20")) for model in gpu_models) else "ConnectX-6"
        nic_speed = "400G" if nic_family == "ConnectX-7" else "200G"
        single_port_nic = next(
            (
                nic for nic in get_products("nics")
                if nic.get("family") == nic_family and nic.get("port_count") == 1 and nic.get("speed") == nic_speed
            ),
            None,
        )
        if single_port_nic:
            return single_port_nic

    family = _find_best_family_for_request(input_config)
    nics = get_products("nics")
    exact_match = next((nic for nic in nics if nic.get("family") == family), None)
    fallback = next((nic for nic in nics if nic.get("family") == "ConnectX-7"), nics[0] if nics else {})
    return exact_match or fallback


def find_nic_by_full_model(full_model: str) -> Optional[Dict[str, Any]]:
    normalized = _normalize(full_model)
    for nic in get_products("nics"):
        if _normalize(nic.get("full_model")) == normalized:
            return nic
    return None


def _find_switch_by_full_model(full_model: str) -> Optional[Dict[str, Any]]:
    normalized_full_model = _normalize(full_model)
    for switch in get_products("switches"):
        if _normalize(switch.get("full_model")) == normalized_full_model:
            return switch
    return None


def get_count_per_server(input_config: Dict[str, Any], nic: Dict[str, Any]) -> int:
    if is_sxm_nvlink_reference_node(input_config) and nic.get("port_count") == 1:
        return max(1, get_total_gpu_count(input_config))

    use_case = input_config.get("use_case", "AI_training")
    gpu_configs = input_config.get("gpu_configs", [])
    gpu_models = [gpu.get("model", "") for gpu in gpu_configs]
    interconnects = {
        get_effective_interconnect(gpu.get("model", ""), gpu.get("interconnect"))
        for gpu in gpu_configs
    }

    high_density_gpu = any(_matches_any(model, ("h100", "h200", "h800", "a100")) for model in gpu_models)
    sxm_or_nvlink = any(_matches_any(model, ("sxm",)) for model in gpu_models) or bool(interconnects & {"NVLink", "NVSwitch"})
    if use_case == "AI_training" and (high_density_gpu or sxm_or_nvlink):
        return 2
    if nic.get("family") == "ConnectX-7" and high_density_gpu:
        return 2
    return 1


def get_switch_for_fabric(fabric_type: str, nic: Dict[str, Any]) -> Dict[str, Any]:
    switches = get_products("switches")
    preferred_sku = "MQM9790-NS2F" if fabric_type == "InfiniBand" else "MSN4700-WS2F"
    by_sku = next(
        (
            item for item in switches
            if item.get("sku") == preferred_sku
            and item.get("speed") == nic.get("speed")
            and item.get("port_type") == nic.get("port_type")
        ),
        None,
    )
    if by_sku:
        return by_sku

    compatibility = load_compatibility_rules().get("compatibility", {})
    nic_model = nic.get("full_model")
    switch_rules = compatibility.get("nic_to_switch_models", [])
    preferred_keyword = "quantum" if fabric_type == "InfiniBand" else "spectrum"

    exact_rules = [
        rule for rule in switch_rules
        if _normalize(rule.get("nic_model")) == _normalize(nic_model)
        and preferred_keyword in _normalize(rule.get("switch_model"))
    ]
    for rule in exact_rules:
        matched_switch = _find_switch_by_full_model(rule.get("switch_model", ""))
        if matched_switch:
            return matched_switch

    protocol = "InfiniBand" if fabric_type == "InfiniBand" else "Ethernet"
    preferred_speed = nic.get("speed")
    candidates = [
        switch for switch in switches
        if switch.get("protocol") == protocol and switch.get("speed") == preferred_speed
    ]
    if candidates:
        return candidates[0]
    return next((switch for switch in switches if switch.get("protocol") == protocol), switches[0] if switches else {})


def estimate_switch_count(total_ports: int, switch_port_count: int) -> int:
    if switch_port_count <= 0:
        return 2
    reserved_ports = max(2, ceil(switch_port_count * 0.1))
    usable_ports = max(1, switch_port_count - reserved_ports)
    return max(2, ceil(total_ports / usable_ports))


def _distance_to_int(value: str) -> int:
    digits = "".join(char for char in value if char.isdigit())
    return int(digits or "0")


def choose_link_bundle(
    *,
    speed: str,
    port_type: str,
    distance_meters: int,
    link_preference: str,
    endpoint_role: str,
) -> Dict[str, Any]:
    cables = get_products("cables")
    transceivers = get_products("transceivers")

    def cable_match(item: Dict[str, Any], cable_type: str) -> bool:
        return item.get("speed") == speed and item.get("cable_type") == cable_type

    if link_preference == "transceiver_priority":
        mode = "transceiver"
    elif link_preference == "direct_attach_priority":
        mode = "direct_attach"
    elif distance_meters <= 3:
        mode = "direct_attach"
    elif distance_meters <= 30:
        mode = "aoc"
    else:
        mode = "transceiver"

    if mode == "direct_attach":
        cable = next((item for item in cables if cable_match(item, "DAC")), None)
        if cable:
            return {
                "mode": "direct_attach",
                "cable": cable,
                "guidance": f"{endpoint_role} 距离为 {distance_meters}m，优先采用 DAC 直连铜缆。"
            }

    if mode in {"aoc", "direct_attach"}:
        cable = next((item for item in cables if cable_match(item, "AOC")), None)
        if cable:
            return {
                "mode": "aoc",
                "cable": cable,
                "guidance": f"{endpoint_role} 距离为 {distance_meters}m，采用 AOC 减少模块数量。"
            }

    eligible_transceivers = [
        item for item in transceivers
        if item.get("speed") == speed and item.get("port_type") == port_type
    ]
    eligible_transceivers.sort(key=lambda item: _distance_to_int(item.get("distance", "0m")))
    transceiver = next(
        (item for item in eligible_transceivers if _distance_to_int(item.get("distance", "0m")) >= distance_meters),
        eligible_transceivers[-1] if eligible_transceivers else None,
    )

    return {
        "mode": "transceiver",
        "transceiver": transceiver or {},
        "guidance": f"{endpoint_role} 距离为 {distance_meters}m，采用模块化光链路以覆盖更长距离和介质差异。"
    }


def get_catalog_link(product: Dict[str, Any], fallback: str) -> str:
    return product.get("official_url") or fallback
