from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class GPUInterconnect(str, Enum):
    NVLINK = "NVLink"
    NVSWITCH = "NVSwitch"
    PCIE = "PCIe"


class UseCase(str, Enum):
    AI_TRAINING = "AI_training"
    AI_INFERENCE = "AI_inference"
    HPC = "HPC"
    GENERAL_COMPUTING = "general_computing"


class FabricType(str, Enum):
    INFINIBAND = "InfiniBand"
    ROCE = "RoCE"


class DpuPolicy(str, Enum):
    DISABLED = "disabled"
    OPTIONAL = "optional"


class LinkPreference(str, Enum):
    AUTO = "auto"
    DIRECT_ATTACH_PRIORITY = "direct_attach_priority"
    TRANSCEIVER_PRIORITY = "transceiver_priority"


class GPUConfig(BaseModel):
    model: str = Field(..., description="GPU型号，如H100、A100等")
    count: int = Field(..., ge=1, description="每台服务器的GPU数量")
    interconnect: GPUInterconnect = Field(..., description="GPU互联模式")


class ConfigRequest(BaseModel):
    server_count: int = Field(..., ge=1, description="服务器数量")
    gpu_configs: List[GPUConfig] = Field(..., description="GPU配置列表")
    use_case: UseCase = Field(..., description="应用场景")
    fabric_type: FabricType = Field(default=FabricType.INFINIBAND, description="组网路线：InfiniBand 或 RoCE")
    dpu_policy: DpuPolicy = Field(default=DpuPolicy.DISABLED, description="默认是否自动纳入 DPU")
    server_to_switch_distance_meters: int = Field(default=3, ge=1, description="服务器到交换机距离（米）")
    switch_to_switch_distance_meters: int = Field(default=5, ge=1, description="交换机之间距离（米）")
    link_preference: LinkPreference = Field(default=LinkPreference.AUTO, description="线缆与模块优先策略")
    session_id: Optional[str] = Field(None, description="会话ID，用于关联历史记录")


class ConfigResponse(BaseModel):
    task_id: str = Field(..., description="任务ID，用于查询配置状态")
    status: str = Field(..., description="任务状态，如processing、completed、failed")
    message: Optional[str] = Field(None, description="状态消息")


class PerServerAdapter(BaseModel):
    device_type: str = Field(..., description="nic 或 dpu")
    full_model: str = Field(..., description="设备完整型号")
    quantity: int = Field(..., ge=1, description="单台服务器配置数量")
    role: str = Field(..., description="角色描述")
    speed: str = Field(..., description="设备速率")
    port_type: str = Field(..., description="端口类型")


class NICRecommendation(BaseModel):
    generation: str = Field(..., description="ConnectX网卡代数，如ConnectX-7")
    full_model: str = Field(..., description="完整型号，如ConnectX-7 MCX75310AAS-HEAT")
    count_per_server: int = Field(..., ge=1, description="每台服务器网卡数量")
    port_count: int = Field(..., description="端口数量")
    port_type: str = Field(..., description="端口类型，如OSFP")
    speed: str = Field(..., description="速率，如400G")
    fabric_type: FabricType = Field(..., description="当前选定的组网路线")
    per_server_adapters: List[PerServerAdapter] = Field(default_factory=list, description="单台服务器适配清单预览")
    planning_notes: List[str] = Field(default_factory=list, description="默认规划说明")
    explanation: str = Field(..., description="详细技术解释")
    official_links: List[str] = Field(..., description="NVIDIA官方文档链接列表")


class NetworkDesign(BaseModel):
    fabric_type: FabricType = Field(..., description="当前组网路线")
    switch_type: str = Field(..., description="交换技术类型，例如 Quantum 或 Spectrum")
    architecture_type: str = Field(..., description="组网架构类型，如胖树拓扑、CLOS架构等")
    architecture_description: str = Field(..., description="组网架构详细描述")
    high_availability_design: str = Field(..., description="高可用性设计说明")
    performance_estimate: Dict[str, Any] = Field(..., description="性能预估，包括带宽、延迟等")
    scalability_suggestions: str = Field(..., description="扩展性建议")
    cabling_guidance: List[str] = Field(default_factory=list, description="线缆与模块策略说明")
    reference_links: List[str] = Field(..., description="NVIDIA参考架构链接列表")


class BOMItemType(str, Enum):
    NIC = "nic"
    DPU = "dpu"
    SWITCH = "switch"
    TRANSCEIVER = "transceiver"
    CABLE = "cable"


class BOMItem(BaseModel):
    id: Optional[str] = Field(None, description="配置项ID")
    type: BOMItemType = Field(..., description="设备类型")
    name: str = Field(..., description="设备名称")
    full_model: str = Field(..., description="完整型号，禁止使用简称")
    quantity: int = Field(..., ge=0, description="数量")
    port_count: Optional[int] = Field(None, description="端口数量（网卡、交换机）")
    port_type: Optional[str] = Field(None, description="端口类型")
    speed: Optional[str] = Field(None, description="速率")
    distance: Optional[str] = Field(None, description="传输距离（光模块）")
    cable_type: Optional[str] = Field(None, description="线缆类型（线缆）")
    length: Optional[str] = Field(None, description="长度（线缆）")
    interface_type: Optional[str] = Field(None, description="接口类型（线缆）")
    link: str = Field(..., description="NVIDIA官网链接")
    isEditable: bool = Field(default=True, description="是否可编辑")


class ValidationIssueSeverity(str, Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"


class ValidationIssue(BaseModel):
    severity: ValidationIssueSeverity = Field(..., description="问题严重性")
    message: str = Field(..., description="问题描述")
    suggestion: Optional[str] = Field(None, description="修复建议")


class ValidationReport(BaseModel):
    validation_score: float = Field(..., ge=0, le=10, description="总体可行性评分（1-10分）")
    issues: List[ValidationIssue] = Field(..., description="问题列表")
    optimization_suggestions: List[str] = Field(default_factory=list, description="优化建议")
    configuration_rationale: Optional[str] = Field(None, description="配置依据说明")


class ConfigResult(BaseModel):
    nic_recommendation: NICRecommendation = Field(..., description="网卡推荐结果")
    network_design: NetworkDesign = Field(..., description="组网方案")
    bom_list: List[BOMItem] = Field(..., description="设备配置清单")
    validation_report: Optional[ValidationReport] = Field(None, description="校验报告")


class StatusResponse(BaseModel):
    status: str = Field(..., description="任务状态，如processing、completed、failed")
    result: Optional[ConfigResult] = Field(None, description="配置结果（当status为completed时）")
    error: Optional[str] = Field(None, description="错误信息（当status为failed时）")


class HistoryItem(BaseModel):
    id: int = Field(..., description="历史记录ID")
    created_at: datetime = Field(..., description="创建时间")
    input_config: Dict[str, Any] = Field(..., description="输入配置")
    session_id: Optional[str] = Field(None, description="会话ID")


class HistoryResponse(BaseModel):
    history: List[HistoryItem] = Field(..., description="历史记录列表")
    total_count: int = Field(..., ge=0, description="总记录数")


class BOMEditAction(str, Enum):
    ADD = "add"
    EDIT = "edit"
    DELETE = "delete"
    RECALCULATE = "recalculate"


class BOMEditRequest(BaseModel):
    action: BOMEditAction = Field(..., description="操作类型")
    item_id: Optional[str] = Field(None, description="配置项ID（编辑或删除时需要）")
    item: Optional[BOMItem] = Field(None, description="配置项数据（添加或编辑时需要）")


class BOMEditResponse(BaseModel):
    status: str = Field(..., description="操作状态")
    updated_bom: List[BOMItem] = Field(..., description="更新后的BOM清单")
    auto_recalculated: bool = Field(default=False, description="是否自动重新计算了关联设备数量")
    validation_report: Optional[ValidationReport] = Field(None, description="校验报告")


class ValidationRequest(BaseModel):
    current_bom: List[BOMItem] = Field(..., description="当前BOM清单")


class ValidationResponse(ValidationReport):
    pass


class KnowledgeBaseDocumentCreate(BaseModel):
    title: str = Field(..., description="文档标题")
    content: str = Field(..., description="文档内容")
    category: str = Field(..., description="文档分类")
    source: str = Field(..., description="文档来源")
    source_url: Optional[str] = Field(None, description="文档来源URL")
    product_models: Optional[List[str]] = Field(None, description="相关产品型号列表")
    keywords: Optional[List[str]] = Field(None, description="关键词列表")
    version: Optional[str] = Field(None, description="文档版本")


class KnowledgeBaseDocumentUpdate(BaseModel):
    title: Optional[str] = Field(None, description="文档标题")
    content: Optional[str] = Field(None, description="文档内容")
    category: Optional[str] = Field(None, description="文档分类")
    source: Optional[str] = Field(None, description="文档来源")
    source_url: Optional[str] = Field(None, description="文档来源URL")
    product_models: Optional[List[str]] = Field(None, description="相关产品型号列表")
    keywords: Optional[List[str]] = Field(None, description="关键词列表")
    version: Optional[str] = Field(None, description="文档版本")


class KnowledgeBaseDocumentResponse(BaseModel):
    id: int = Field(..., description="文档ID")
    title: str = Field(..., description="文档标题")
    content: str = Field(..., description="文档内容")
    category: str = Field(..., description="文档分类")
    source: str = Field(..., description="文档来源")
    source_url: Optional[str] = Field(None, description="文档来源URL")
    product_models: Optional[List[str]] = Field(None, description="相关产品型号列表")
    keywords: Optional[List[str]] = Field(None, description="关键词列表")
    last_updated: datetime = Field(..., description="最后更新时间")
    version: Optional[str] = Field(None, description="文档版本")
    vector_id: Optional[str] = Field(None, description="向量数据库ID")


class KnowledgeBaseDocumentListResponse(BaseModel):
    documents: List[KnowledgeBaseDocumentResponse] = Field(..., description="文档列表")
    total_count: int = Field(..., description="总文档数")
    page: int = Field(..., description="当前页码")
    page_size: int = Field(..., description="每页大小")


class KnowledgeBaseSearchRequest(BaseModel):
    query: str = Field(..., description="搜索查询")
    category: Optional[str] = Field(None, description="文档分类过滤")
    product_models: Optional[List[str]] = Field(None, description="产品型号过滤")
    top_k: int = Field(default=5, ge=1, le=20, description="返回结果数量")


class KnowledgeBaseSearchResponse(BaseModel):
    query: str = Field(..., description="搜索查询")
    results: List[KnowledgeBaseDocumentResponse] = Field(..., description="搜索结果")
    scores: Optional[List[float]] = Field(None, description="相关性分数")


class FileUploadResponse(BaseModel):
    file_id: str = Field(..., description="文件ID")
    filename: str = Field(..., description="文件名")
    file_size: int = Field(..., description="文件大小（字节）")
    content_type: str = Field(..., description="文件类型")
    upload_status: str = Field(..., description="上传状态")
    message: Optional[str] = Field(None, description="处理消息")
