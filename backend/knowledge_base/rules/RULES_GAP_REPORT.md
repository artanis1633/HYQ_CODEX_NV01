# Rules Gap Report

这份报告用于说明：基于现有两份 Markdown 文档，第一版 YAML 已经能表达“名录”和“互联关系”，但还不足以支撑一个长期稳定的自动决策系统。

## 当前已经能支撑的内容

- 规范命名与禁用简称
- 基础产品目录
- GPU 到网卡代际推荐
- 网卡到交换机的基础兼容关系
- 光模块和线缆的基础兼容关系
- 速率、端口容量、HA 的基础规则

## 当前明显缺失的字段

### 所有产品都建议补齐

- `official_url`
- `datasheet_url`
- `source_refs`
- `protocol`
  - 建议值：`InfiniBand`、`Ethernet`、`Both`
- `lifecycle_status`
  - 建议值：`active`、`preferred`、`legacy`、`deprecated`
- `region_availability`
  - 例如是否仅中国区、是否全球通用
- `confidence`
  - 建议值：`high`、`medium`、`low`
- `review_status`
  - 建议值：`official_verified`、`internally_confirmed`、`needs_review`

### NIC 建议补齐

- `bus_interface`
  - 例如 `PCIe Gen4 x16`、`PCIe Gen5 x16`
- `protocol`
  - 是否支持 `IB`、`RoCE`、`Ethernet`
- `form_factor`
- `cooling_or_thermal_notes`
- `supported_gpu_scenarios`
- `preferred_use_cases`

### Switch 建议补齐

- `switch_role`
  - 例如 `leaf`、`spine`、`both`
- `protocol`
  - `InfiniBand` 或 `Ethernet`
- `rack_unit`
- `max_fabric_scale`
- `management_ports`
- `power_profile`

### Transceiver 建议补齐

- `connector_type`
- `fiber_type`
  - 例如 `single-mode`、`multi-mode`
- `wavelength`
- `breakout_support`
- `protocol`

### Cable 建议补齐

- `connector_type`
- `is_direct_attach`
- `media_type`
  - 例如 `optical`、`copper`
- `length_sku_map`
  - 同一型号不同长度是否对应不同订货号
- `protocol`

### 兼容规则建议补齐

- `compatibility_level`
  - 建议值：`recommended`、`supported`、`conditional`、`discouraged`
- `conditions`
  - 例如“需要 QSFP56 版本”“需要适配器”“仅短距”
- `source_refs`
- `verified_by`
- `last_verified_on`

## 当前最需要你确认的几个点

1. `ConnectX-7 MCX75310AAS-HEAT -> NVIDIA Spectrum-3 SN3700`
   当前文档写的是“需要 QSFP56 版本”，但这个关系是否应该改成另一个更准确的 ConnectX-7 型号，需要你确认。
2. `ConnectX-7 MCX753105AAS-HEAT -> NVIDIA Quantum QM8700`
   同样存在“需要 QSFP56 版本”的条件，建议明确具体型号。
3. AOC/DAC 与“光模块”的关系目前文档混用了“光模块兼容”和“直连线缆直连”两种语义。
   后续建议拆成：
   - `transceiver_based_link`
   - `direct_attach_link`
4. `protocol` 维度当前没有显式字段。
   但对 NVIDIA 网络产品适配系统来说，这个字段很关键，因为它会直接影响 IB / Ethernet 的决策路径。
5. 每个产品缺少 `official_url`。
   这个字段后面做 demo 展示和引用依据时非常重要。

## 推荐的人工补全格式

你后续可以按下面这种 YAML 片段补齐信息，我再帮你合并到主规则文件：

```yaml
product_updates:
  - full_model: "ConnectX-7 MCX75310AAS-HEAT"
    official_url: ""
    datasheet_url: ""
    protocol: ""
    bus_interface: ""
    lifecycle_status: ""
    region_availability: []
    preferred_use_cases: []
    source_refs: []
    review_status: "needs_review"

compatibility_updates:
  - source_model: "ConnectX-7 MCX75310AAS-HEAT"
    target_model: "NVIDIA Spectrum-3 SN3700"
    compatibility_level: ""
    conditions: []
    source_refs: []
    review_status: "needs_review"
```

## 建议的资料整理目录

- `backend/knowledge_base/source_documents/official/`
- `backend/knowledge_base/source_documents/internal/`
- `backend/knowledge_base/source_documents/raw_md/`

如果你把后续材料按这个目录放好，我可以继续做第二轮结构化和自动补全。
