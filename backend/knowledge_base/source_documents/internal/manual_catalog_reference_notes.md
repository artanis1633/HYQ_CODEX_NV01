# 手工产品名录提炼笔记

来源文件：
- `/Users/hyq/Documents/AI/NVIDIA原厂资料/英伟达产品名录.md`

## 当前可直接作为系统输入源的部分

### 1. GPU 下拉候选

这份文档已经足够支撑当前前端的 GPU 选型输入，不必再等更多资料。

优先可纳入系统的 GPU 族：
- H200
- H20
- L20
- A100
- A800
- H100
- H800
- A40
- L40
- RTX PRO 6000D

建议在规则层把同名不同形态拆开：
- `H100 SXM`
- `H100 PCIe`
- `A100 SXM`
- `A100 PCIe`
- `H200 SXM`
- `H200 PCIe (NVL)`

原因：
- 互联模式、功耗和推荐网络方案可能不同。
- 后续训练/推理推荐时，SXM 与 PCIe 不应被视为完全同类。

### 2. 交换机输入源

这份文档已经可以作为当前 demo 的交换机候选与技术路线依据。

可以直接采用的判断：
- `MQM9790-NS2F / MQM9790-NS2R` 归类为 `InfiniBand / Quantum-2`
- `MSN4600-*` 归类为 `RoCE / Spectrum`
- `MSN4700-*` 归类为 `RoCE / Spectrum`

## 对当前系统最重要的提炼

### 1. 前端输入不应该只选 GPU 型号

应该保留至少以下维度：
- GPU 型号
- GPU 形态：`SXM / PCIe`
- GPU 互联模式：`PCIe / NVLink / NVSwitch`
- 业务场景：`训练 / 推理`
- 组网类型：`InfiniBand / RoCE`

### 2. 交换机推荐不应该只输出一个家族名

后续推荐层至少要区分：
- 技术路线：`Quantum / Spectrum`
- 具体 SKU
- 端口形态：`OSFP / QSFP28 / QSFP-DD`
- 风向：`P2C / C2P`
- 软件栈：`MLNX-OS / Onyx / ONIE / Cumulus Linux`

当前 demo 阶段可先只输出：
- 家族
- SKU
- 速率
- 端口类型

### 3. 这份文档里的交换机列表和当前 400G PDF 并不完全同域

这是非常关键的一点：
- 你的手工名录中包含 `MSN4600`（QSFP28，100G）和 `MSN4700`（QSFP-DD，400G）
- 当前官方 PDF 主要围绕 `Quantum-2 / SN5600 / OSFP / QSFP112 / 400G-NDR`

所以后续规则接入时必须分开处理：
- `GPU + 交换机候选` 可以直接参考这份手工名录
- `线缆/模块规则` 不能一股脑套用到所有交换机，必须按端口形态区分

## 建议后续写入结构化字段

### GPU

- `gpu_model`
- `form_factor`
- `architecture`
- `memory_type`
- `memory_capacity`
- `memory_bandwidth`
- `mig_support`
- `power_watts`
- `preferred_scenarios`

### Switch

- `sku`
- `network_type`
- `family`
- `port_count`
- `port_form_factor`
- `throughput`
- `supported_rates`
- `airflow`
- `os`
- `rack_unit`
- `management_mode`

## 当前对项目最有价值的结论

1. 这份文档已经足够作为当前阶段 GPU 与交换机输入源，不必等待更多资料才能继续开发。
2. 系统必须按 `GPU形态 + 互联模式 + 场景 + 组网类型` 来做决策，不能只看 GPU 名称。
3. 后续线缆和模块规则必须按交换机端口类型分支处理，特别是：
   - `OSFP`
   - `QSFP112`
   - `QSFP-DD`
   - `QSFP56`
   - `QSFP28`
