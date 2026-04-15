import json
from typing import Any, Dict, List

from app.config import settings
from app.knowledge.rules_repository import (
    get_effective_interconnect,
    get_total_gpu_count,
    is_sxm_nvlink_reference_node,
)

try:
    from langchain_openai import ChatOpenAI
except Exception:  # pragma: no cover - graceful fallback when dependency is unavailable
    ChatOpenAI = None


def build_cluster_context(input_config: Dict[str, Any]) -> Dict[str, Any]:
    gpu_configs = input_config.get("gpu_configs", [])
    normalized_gpu_configs = [
        {
            "model": gpu.get("model", ""),
            "count": gpu.get("count", 0),
            "requested_interconnect": gpu.get("interconnect"),
            "effective_interconnect": get_effective_interconnect(gpu.get("model", ""), gpu.get("interconnect")),
        }
        for gpu in gpu_configs
    ]
    effective_interconnects = {gpu["effective_interconnect"] for gpu in normalized_gpu_configs}
    total_gpu_count = get_total_gpu_count(input_config)

    return {
        "server_count": input_config.get("server_count", 1),
        "use_case": input_config.get("use_case", "AI_training"),
        "fabric_type": input_config.get("fabric_type", "InfiniBand"),
        "server_to_switch_distance_meters": input_config.get("server_to_switch_distance_meters", 3),
        "switch_to_switch_distance_meters": input_config.get("switch_to_switch_distance_meters", 5),
        "gpu_configs": normalized_gpu_configs,
        "effective_interconnects": sorted(effective_interconnects),
        "total_gpu_count_per_server": total_gpu_count,
        "is_reference_sxm_node": is_sxm_nvlink_reference_node(input_config),
    }


def _heuristic_bandwidth_assessment(input_config: Dict[str, Any]) -> Dict[str, Any]:
    context = build_cluster_context(input_config)
    use_case = context["use_case"]
    effective_interconnects = set(context["effective_interconnects"])
    total_gpu_count = context["total_gpu_count_per_server"]
    is_reference_node = context["is_reference_sxm_node"]

    if is_reference_node:
        gpu_models = [gpu["model"] for gpu in context["gpu_configs"]]
        has_hopper = any(any(tag in model for tag in ["H100", "H200", "H800", "H20"]) for model in gpu_models)
        return {
            "source": "heuristic",
            "bandwidth_tier": "extreme",
            "recommended_nic_family": "ConnectX-7" if has_hopper else "ConnectX-6",
            "recommended_nic_model": "ConnectX-7 MCX753105AAS-HEAT" if has_hopper else "ConnectX-6 MCX653105A-ECAT",
            "recommended_count_per_server": max(1, total_gpu_count),
            "summary": "SXM + NVLink 参考节点优先采用单端口 HCA，并按 GPU:NIC 1:1 处理。",
            "reasoning": [
                "应用场景和 GPU 互联模式用于判断集群是否属于高带宽 scale-up / scale-out 参考架构。",
                "SXM + NVLink 节点通常具有更高的单机内带宽，需要更高密度的对外网络并行度。",
                "训练场景下优先保证每张 GPU 对应独立 HCA 的扩展能力。"
            ]
        }

    if use_case == "AI_training" and "NVLink" in effective_interconnects:
        return {
            "source": "heuristic",
            "bandwidth_tier": "high",
            "recommended_nic_family": "ConnectX-7",
            "recommended_nic_model": "ConnectX-7 MCX75310AAS-HEAT",
            "recommended_count_per_server": 2,
            "summary": "训练场景且存在 NVLink，默认采用双端口高带宽网卡。",
            "reasoning": [
                "训练作业对跨节点带宽和拥塞更敏感。",
                "NVLink 说明单机内部带宽较高，跨节点链路不能过于保守。",
                "双端口 400G 更适合作为演示阶段的主路径。"
            ]
        }

    if use_case == "AI_inference":
        return {
            "source": "heuristic",
            "bandwidth_tier": "medium",
            "recommended_nic_family": "ConnectX-6 Lx",
            "recommended_nic_model": "ConnectX-6 Lx MCX623106AN-CDAT",
            "recommended_count_per_server": 1,
            "summary": "推理场景优先控制单机网络复杂度，保留后续手工扩展空间。",
            "reasoning": [
                "推理流量通常更偏向吞吐和业务隔离，不一定需要极高的跨节点带宽。",
                "PCIe 型 GPU 默认以标准以太网或 RoCE 主路径为宜。",
                "后续可按租户隔离或存储卸载需求手动混编 DPU。"
            ]
        }

    return {
        "source": "heuristic",
        "bandwidth_tier": "high",
        "recommended_nic_family": "ConnectX-7",
        "recommended_nic_model": "ConnectX-7 MCX75310AAS-HEAT",
        "recommended_count_per_server": 2,
        "summary": "默认以高带宽训练/通用计算主路径估算网卡配置。",
        "reasoning": [
            "应用场景、GPU 互联模式和服务器规模共同参与带宽级别判断。",
            "当没有更精细的产品资料时，优先保证 demo 方案具备足够的扩展余量。"
        ]
    }


def summarize_bandwidth_assessment(input_config: Dict[str, Any], nic_recommendation: Dict[str, Any]) -> Dict[str, Any]:
    assessment = get_ai_bandwidth_assessment(input_config)
    context = build_cluster_context(input_config)
    gpu_summary_parts = [
        f"{gpu['model']} x{gpu['count']} ({gpu['effective_interconnect']})"
        for gpu in context["gpu_configs"]
    ]
    gpu_context_summary = " / ".join(gpu_summary_parts) if gpu_summary_parts else "未提供 GPU 配置"

    count_per_server = int(nic_recommendation.get("count_per_server", 1) or 1)
    port_count = int(nic_recommendation.get("port_count", 1) or 1)
    speed_text = str(nic_recommendation.get("speed", "400G"))
    speed_digits = int("".join(ch for ch in speed_text if ch.isdigit()) or "0")
    total_server_bandwidth_gbps = count_per_server * port_count * speed_digits
    single_server_bandwidth = f"{total_server_bandwidth_gbps} Gbps"

    context["effective_interconnects"]
    bandwidth_analysis_summary = (
        f"基于 {context['use_case']} 场景、互联模式 {', '.join(context['effective_interconnects'])}、"
        f"每台 {context['total_gpu_count_per_server']} 张 GPU，系统将当前跨节点带宽需求判断为 {assessment.get('bandwidth_tier', 'high')}。"
    )

    nic_sizing_rationale = list(assessment.get("reasoning", []))
    nic_sizing_rationale.append(
        f"当前推荐 {count_per_server} 张网卡，每张 {port_count} 个 {speed_text} 端口，单机理论对外网络带宽约为 {single_server_bandwidth}。"
    )

    return {
        "assessment": assessment,
        "gpu_context_summary": gpu_context_summary,
        "bandwidth_analysis_summary": bandwidth_analysis_summary,
        "single_server_network_bandwidth": single_server_bandwidth,
        "nic_sizing_rationale": nic_sizing_rationale,
    }


def _extract_json_block(content: str) -> Dict[str, Any]:
    cleaned = content.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        cleaned = cleaned.replace("json", "", 1).strip()
    return json.loads(cleaned)


def get_ai_bandwidth_assessment(input_config: Dict[str, Any]) -> Dict[str, Any]:
    if not settings.effective_llm_api_key or ChatOpenAI is None:
        return _heuristic_bandwidth_assessment(input_config)

    context = build_cluster_context(input_config)
    prompt = f"""
你是 NVIDIA 智算网络选型顾问。请根据下面的输入判断当前集群的跨节点带宽级别，并给出每台服务器推荐的网卡数量和候选型号。

必须重点考虑：
1. 应用场景（训练/推理/HPC）
2. GPU 型号与数量
3. GPU 互联模式（尤其 NVLink 与 PCIe 的区别）
4. 服务器数量
5. 组网技术路线（InfiniBand / RoCE）

请只输出 JSON，不要输出任何额外说明。字段固定为：
{{
  "bandwidth_tier": "low|medium|high|extreme",
  "recommended_nic_family": "string",
  "recommended_nic_model": "string",
  "recommended_count_per_server": 1,
  "summary": "string",
  "reasoning": ["string", "string", "string"]
}}

输入上下文：
{json.dumps(context, ensure_ascii=False, indent=2)}
""".strip()

    try:
        llm = ChatOpenAI(
            api_key=settings.effective_llm_api_key,
            base_url=settings.effective_llm_base_url,
            model=settings.effective_llm_model,
            temperature=settings.effective_llm_temperature,
            max_tokens=settings.effective_llm_max_tokens,
        )
        response = llm.invoke(prompt)
        parsed = _extract_json_block(response.content)
        parsed["source"] = "ai"
        return parsed
    except Exception:
        return _heuristic_bandwidth_assessment(input_config)
