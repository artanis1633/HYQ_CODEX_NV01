# LinkX 400G/NDR 线缆与模块提炼笔记

来源文件：
- `/Users/hyq/Documents/AI/NVIDIA原厂资料/设备官方DOC/linkx-400gbe-ndr-combo-main-portfolio-100g-pam4.pdf`
- 文档标题：`LinkX 400Gb/s Cables & Transceivers Main Deck`
- 版本日期：`Rev: Oct 7, 2024`

## 这份 PDF 对当前项目的适用边界

这份官方文档非常有价值，但必须注意它的覆盖范围：

- 它重点覆盖的是 `400G NDR InfiniBand / 400GbE Ethernet`
- 核心端口形态是：
  - `OSFP twin-port switch side`
  - `OSFP single-port adapter side`
  - `QSFP112 adapter/DPU side`
- 主要设备组合围绕：
  - `Quantum-2 / SN5600`
  - `ConnectX-7`
  - `BlueField-3`

因此它非常适合当前系统中的这些路径：
- `Quantum-2 <-> ConnectX-7`
- `Quantum-2 <-> BlueField-3`
- `Spectrum 400G twin-port OSFP switch <-> ConnectX-7 / BF3`

但它**不适合直接外推**到：
- `MSN4600 QSFP28 100G`
- 所有 `QSFP28` / `QSFP56` 老系统
- 非 100G-PAM4 体系的所有光模块规则

## 对系统最有价值的结论

### 1. 协议不是由线缆/模块决定，而是由交换机侧激活

文档多次明确：
- LinkX cables, transceivers, ConnectX-7 and BlueField-3 DPUs contain both InfiniBand and Ethernet protocols.
- Specific protocol is activated when inserted into the switch.

系统含义：
- 对 `ConnectX-7 / BF3 + 400G 光互连` 而言，`IB / Ethernet` 并不是换一套模块，而是由交换机技术路线决定。
- 所以前端新增的 `InfiniBand / ROCE` 选择是合理的，它会决定后续交换机与验证路径。

### 2. 距离是线缆/模块方案的第一分流条件

文档给出的最低成本分层很清楚：
- `DAC`：最短距离，通常到 `2-3m`
- `L-ACC / ACC`：比 DAC 稍长，通常到 `4-5m`
- `AOC / 多模 SR`：中距离，通常到 `50m`
- `单模 DR4`：更长距离，常见到 `100m / 500m`
- `FR4`：更远，`2km`

系统含义：
- 你提出“先让用户明确距离，再自动判断介质”的做法是正确的。
- 当前项目第一版规则完全可以先按这个粗粒度做：
  - `<= 3m -> DAC`
  - `4-5m -> ACC`
  - `6-50m -> AOC 或 SR4/SR8`
  - `50m 以上 -> DR4 / FR4`

### 3. BlueField-3 不能走 OSFP

文档明确提到：
- BlueField-3 only accepts `QSFP112`, `QSFP56`, and `QSFP28` devices, not `OSFP`

系统含义：
- 这条必须进规则库。
- 后续你说的“6 张 CX7 + 2 张 BF3”混编场景里：
  - `CX7/OSFP`
  - `CX7/QSFP112`
  - `BF3/QSFP112`
 需要分开建模。

### 4. OSFP 开关侧和适配器侧有散热器/高度差异

文档明确提到：
- `IHS = Integrated Heat Sink = Finned top`，主要给交换机侧 twin-port OSFP
- `RHS = Riding Heat Sink = Flat top`，主要给 `CX7 / BF3 / DGX`
- Switch cages and DGX cages have different OSFP heights and are not interchangeable

系统含义：
- 不能只记录“OSFP 模块”，还要区分：
  - `switch-side IHS finned top`
  - `adapter-side RHS flat top`
- 否则后面会把看似相同的 OSFP 光模块错误混用。

### 5. 400G transceiver 可以通过 splitter 服务 200G 场景

文档明确提到：
- Use 400G transceivers for 200G links
- 2 fibers on split ends creates 200G and reduces power
- no separate 200G parts offered

系统含义：
- 200G 并不一定有单独的 200G 光模块 SKU
- 在当前规则设计里，`200G` 需要支持：
  - `400G transceiver + splitter`
  - `QSFP112/QSFP56` 分支链路

### 6. 100G-PAM4 optics 不能下切到 50G-PAM4 / 25G-NRZ

文档明确提到：
- 100G-PAM4 cables and transceivers cannot downshift to 50G-PAM4 or 25G-NRZ
- Must use DAC or AOC for legacy systems

系统含义：
- 这是后续兼容性校验的关键规则。
- 老系统互通时，不能让 AI 随意“猜测兼容”。

### 7. 连接器类型必须纳入规则

文档明确提到：
- `NDR / 400GbE` 使用 `MPO-12/APC`
- `HDR / EDR` 使用 `MPO/UPC`
- `MPO/APC` 与 `MPO/UPC` 不兼容
- `FR4` 走 `LC duplex`

系统含义：
- 后续模块/线缆规则不能只存 `SR4/DR4/FR4`
- 至少还要存：
  - `connector_type`
  - `polish_type`
  - `fiber_type`

## 对当前 demo 最值得先纳入的 SKU

### OSFP 双口交换机侧 800G/2x400G 光模块

- `MMA4Z00-NS`
  - 2x400G SR8
  - 50m
  - OSFP finned-top
- `MMS4X00-NS`
  - 2x400G DR8
  - 100m
  - OSFP finned-top
- `MMS4X00-NM`
  - 2x400G DR8
  - 500m
  - OSFP finned-top
- `MMS4X50-NM`
  - 2x400G FR4
  - 2km
  - LC duplex
  - OSFP closed finned-top

### 单口 400G 适配器侧模块

- `MMA4Z00-NS400`
  - OSFP
  - SR
  - 50m
- `MMS4X00-NS400`
  - OSFP
  - DR
  - 100m
- `MMA1Z00-NS400`
  - QSFP112
  - SR
  - 50m
- `MMS1X00-NS400`
  - QSFP112
  - DR
  - 文档里出现 100m/500m 表述，需要后续再核

### 铜缆 / 直连

- `MCP7Y00-*`
  - OSFP -> 2xOSFP DAC
  - 1m~3m
- `MCA7J60-*`
  - OSFP -> 2xOSFP ACC
  - 4m~5m
- `MCP7Y10-*`
  - OSFP -> 2xQSFP112 DAC
  - 1m~3m
- `MCA7J65-*`
  - OSFP -> 2xQSFP112 ACC
  - 4m~5m
- `MCP7Y40-*`
  - OSFP -> 4xQSFP112 DAC
  - 1m~3m
- `MCA7J75-*`
  - OSFP -> 4xQSFP112 ACC
  - 4m~5m

### 光纤

- `MFP7E10-*`
  - 多模 straight fiber
  - 3m~50m
- `MFP7E20-*`
  - 多模 splitter fiber
  - 3m~50m
- `MFP7E30-*`
  - 单模 straight fiber
  - 3m~150m
- `MFP7E40-*`
  - 单模 splitter fiber
  - 3m~50m

## 建议直接写入规则库的规则

1. `fabric_type` 决定交换机技术路线，但 400G LinkX 光互连本身可同时支持 IB / Ethernet。
2. `BlueField-3` 不能直接使用 `OSFP`。
3. `switch-side OSFP` 与 `adapter-side OSFP` 需要区分 `IHS / RHS`。
4. `100G-PAM4 optics` 不能下切到 `50G-PAM4 / 25G-NRZ`。
5. `MPO/APC` 与 `MPO/UPC` 不兼容。
6. `FR4` 使用 `LC duplex`，而 `DR4/SR4` 主要使用 `MPO/APC`。
7. 对 `200G` 场景，要支持“400G 模块 + splitter”规则。

## 对当前项目的直接影响

### 当前可以直接推进的

- `H100/H200/A100/L40S -> ConnectX-7 / BF3 -> Quantum/Spectrum` 主路径 demo
- 距离驱动的 DAC/AOC/模块化决策
- 单机混编 ConnectX + BF3 的预览结构

### 当前还不能直接定死的

- `MSN4600 QSFP28` 的模块与线缆精细规则
- 非 400G PAM4 主路径的完整模块矩阵
- 所有老系统互通规则

这部分仍需要你后续继续补更匹配 `QSFP28 / QSFP56 / QSFP-DD` 的官方资料。
