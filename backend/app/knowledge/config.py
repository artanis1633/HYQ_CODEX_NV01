from enum import Enum
from typing import List, Dict, Any


class DocumentCategory(str, Enum):
    NIC = "nic"
    SWITCH = "switch"
    TRANSCEIVER = "transceiver"
    CABLE = "cable"
    BEST_PRACTICE = "best_practice"
    ARCHITECTURE = "architecture"
    GENERAL = "general"


class DocumentSource(str, Enum):
    NVIDIA_OFFICIAL = "nvidia_official"
    NVIDIA_TECH_BLOG = "nvidia_tech_blog"
    NVIDIA_PRODUCT_SPEC = "nvidia_product_spec"
    COMMUNITY = "community"
    INTERNAL = "internal"


DOCUMENT_CATEGORY_LABELS = {
    DocumentCategory.NIC: "网卡",
    DocumentCategory.SWITCH: "交换机",
    DocumentCategory.TRANSCEIVER: "光模块",
    DocumentCategory.CABLE: "线缆",
    DocumentCategory.BEST_PRACTICE: "最佳实践",
    DocumentCategory.ARCHITECTURE: "架构设计",
    DocumentCategory.GENERAL: "通用文档"
}


DOCUMENT_SOURCE_LABELS = {
    DocumentSource.NVIDIA_OFFICIAL: "NVIDIA官网",
    DocumentSource.NVIDIA_TECH_BLOG: "NVIDIA技术博客",
    DocumentSource.NVIDIA_PRODUCT_SPEC: "NVIDIA产品规格",
    DocumentSource.COMMUNITY: "社区",
    DocumentSource.INTERNAL: "内部文档"
}


class ProductNamingRules:
    NIC_GENERATIONS = ["ConnectX-6", "ConnectX-6 Lx", "ConnectX-7", "ConnectX-8"]
    
    NIC_MODELS = [
        "ConnectX-6 MCX653106A-ECAT",
        "ConnectX-6 MCX653105A-ECAT",
        "ConnectX-6 Lx MCX623106AN-CDAT",
        "ConnectX-7 MCX75310AAS-HEAT",
        "ConnectX-7 MCX753105AAS-HEAT",
        "ConnectX-8 MCX85310AAS-HEAT"
    ]
    
    SWITCH_MODELS = [
        "NVIDIA Quantum-2 QM9700",
        "NVIDIA Quantum-2 QM8790",
        "NVIDIA Quantum QM8700",
        "NVIDIA Spectrum-X SN4600",
        "NVIDIA Spectrum-3 SN3700"
    ]
    
    TRANSCEIVER_MODELS = [
        "400G DR4 OSFP",
        "400G FR4 OSFP",
        "200G FR4 QSFP56",
        "100G SR4 QSFP28"
    ]
    
    CABLE_MODELS = [
        "NVIDIA 400G AOC",
        "NVIDIA 200G AOC",
        "NVIDIA 100G DAC",
        "NVIDIA 400G DAC"
    ]
    
    FORBIDDEN_ABBREVIATIONS = {
        "ConnectX-7": ["ConnectX7", "CX7", "CX-7"],
        "ConnectX-6": ["ConnectX6", "CX6", "CX-6"],
        "Quantum-2": ["Quantum2", "Q2"],
        "Quantum": ["Q"],
        "Spectrum-X": ["SpectrumX", "SX"],
        "Spectrum-3": ["Spectrum3", "S3"],
        "OSFP": ["ospf", "OSPF"],
        "QSFP": ["qsfp"],
        "AOC": ["aoc"],
        "DAC": ["dac"]
    }


class CompatibilityRules:
    NIC_PORT_TYPES = ["OSFP", "QSFP56", "QSFP28", "QSFP+"]
    SWITCH_PORT_TYPES = ["OSFP", "QSFP56", "QSFP28"]
    
    NIC_GPU_COMPATIBILITY = {
        "H100": ["ConnectX-7", "ConnectX-8"],
        "A100": ["ConnectX-6", "ConnectX-7"],
        "A10": ["ConnectX-6 Lx", "ConnectX-7"],
        "L40": ["ConnectX-6 Lx", "ConnectX-7"],
        "H800": ["ConnectX-7", "ConnectX-8"],
        "A800": ["ConnectX-6", "ConnectX-7"]
    }
    
    NIC_SWITCH_COMPATIBILITY = {
        "ConnectX-7": ["NVIDIA Quantum-2", "NVIDIA Spectrum-X", "NVIDIA Spectrum-3"],
        "ConnectX-6": ["NVIDIA Quantum", "NVIDIA Spectrum-3"],
        "ConnectX-6 Lx": ["NVIDIA Spectrum-3"],
        "ConnectX-8": ["NVIDIA Quantum-2", "NVIDIA Spectrum-X"]
    }
    
    TRANSCEIVER_NIC_COMPATIBILITY = {
        "OSFP": ["ConnectX-7", "ConnectX-8"],
        "QSFP56": ["ConnectX-6", "ConnectX-7"],
        "QSFP28": ["ConnectX-6", "ConnectX-6 Lx"]
    }
    
    TRANSCEIVER_SWITCH_COMPATIBILITY = {
        "OSFP": ["NVIDIA Quantum-2", "NVIDIA Spectrum-X"],
        "QSFP56": ["NVIDIA Quantum-2", "NVIDIA Quantum", "NVIDIA Spectrum-3"],
        "QSFP28": ["NVIDIA Quantum", "NVIDIA Spectrum-3"]
    }
    
    CABLE_TRANSCEIVER_COMPATIBILITY = {
        "AOC": ["400G DR4 OSFP", "400G FR4 OSFP", "200G FR4 QSFP56"],
        "DAC": ["100G SR4 QSFP28", "400G DR4 OSFP"]
    }
    
    SPEED_MATCH_RULES = {
        "400G": ["400G"],
        "200G": ["200G", "400G"],
        "100G": ["100G", "200G", "400G"]
    }


class KnowledgeBaseConfig:
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    EMBEDDING_MODEL = "text-embedding-ada-002"
    
    NVIDIA_OFFICIAL_URLS = {
        "nic": "https://www.nvidia.com/en-us/networking/ethernet/adapters/",
        "switch": "https://www.nvidia.com/en-us/networking/ethernet/switches/",
        "transceiver": "https://www.nvidia.com/en-us/networking/ethernet/transceivers/",
        "cable": "https://www.nvidia.com/en-us/networking/ethernet/cables/",
        "best_practice": "https://www.nvidia.com/en-us/networking/solutions/",
        "architecture": "https://www.nvidia.com/en-us/networking/solutions/hpc/"
    }


REQUIRED_DOCUMENT_FIELDS = [
    "title",
    "content",
    "category",
    "source",
    "source_url"
]

OPTIONAL_DOCUMENT_FIELDS = [
    "product_models",
    "keywords",
    "last_updated",
    "version"
]
