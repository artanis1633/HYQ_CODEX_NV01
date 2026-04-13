# NVIDIA 产品兼容性规则表

## 一、网卡与GPU兼容性

### 1.1 主流GPU与网卡搭配推荐

| GPU型号 | 推荐网卡系列 | 说明 |
|---------|------------|------|
| H100 SXM5 | ConnectX-7, ConnectX-8 | 最高性能，支持PCIe 5.0 |
| H100 PCIe | ConnectX-7, ConnectX-8 | 平衡性能与成本 |
| H800 | ConnectX-7, ConnectX-8 | 中国特供版本，性能与H100相当 |
| A100 SXM4 | ConnectX-6, ConnectX-7 | 成熟稳定方案 |
| A100 PCIe | ConnectX-6, ConnectX-7 | 平衡方案 |
| A800 | ConnectX-6, ConnectX-7 | 中国特供版本 |
| A10 | ConnectX-6 Lx, ConnectX-7 | 推理优化方案 |
| L40 | ConnectX-6 Lx, ConnectX-7 | 推理优化方案 |
| L40S | ConnectX-6 Lx, ConnectX-7 | 新一代推理卡 |
| RTX 6000 | ConnectX-6 Lx, ConnectX-7 | 工作站级GPU |

### 1.2 GPU互联模式与网卡推荐

| GPU互联模式 | 推荐网卡代数 | 说明 |
|-----------|------------|------|
| NVSwitch (H100) | ConnectX-7, ConnectX-8 | 高速互联，需要高性能网卡 |
| NVLink (A100) | ConnectX-6, ConnectX-7 | 中等速度互联 |
| PCIe | ConnectX-6 Lx, ConnectX-7 | 通用互联，经济型方案 |

---

## 二、网卡与交换机兼容性

### 2.1 ConnectX-8 网卡与交换机搭配

| 网卡型号 | 兼容交换机 | 端口类型匹配 | 说明 |
|---------|-----------|------------|------|
| ConnectX-8 MCX85310AAS-HEAT | NVIDIA Quantum-2 QM9700 | OSFP ↔ OSFP | 最佳InfiniBand方案 |
| ConnectX-8 MCX85310AAS-HEAT | NVIDIA Spectrum-X SN4600 | OSFP ↔ OSFP | 最佳以太网方案 |
| ConnectX-8 MCX853105AAS-HEAT | NVIDIA Quantum-2 QM8790 | OSFP ↔ OSFP | 中小规模集群 |

### 2.2 ConnectX-7 网卡与交换机搭配

| 网卡型号 | 兼容交换机 | 端口类型匹配 | 说明 |
|---------|-----------|------------|------|
| ConnectX-7 MCX75310AAS-HEAT | NVIDIA Quantum-2 QM9700 | OSFP ↔ OSFP | 主流InfiniBand方案 |
| ConnectX-7 MCX75310AAS-HEAT | NVIDIA Spectrum-X SN4600 | OSFP ↔ OSFP | 主流以太网方案 |
| ConnectX-7 MCX75310AAS-HEAT | NVIDIA Spectrum-3 SN3700 | QSFP56适配 | 需要QSFP56版本 |
| ConnectX-7 MCX753105AAS-HEAT | NVIDIA Quantum QM8700 | QSFP56适配 | 需要QSFP56版本 |

### 2.3 ConnectX-6 系列网卡与交换机搭配

| 网卡型号 | 兼容交换机 | 端口类型匹配 | 说明 |
|---------|-----------|------------|------|
| ConnectX-6 Lx MCX623106AN-CDAT | NVIDIA Spectrum-3 SN3700 | QSFP56 ↔ QSFP56 | 经济型以太网方案 |
| ConnectX-6 MCX653106A-ECAT | NVIDIA Quantum QM8700 | QSFP56 ↔ QSFP56 | 成熟InfiniBand方案 |

---

## 三、光模块与网卡兼容性

### 3.1 OSFP端口光模块

| 光模块型号 | 兼容网卡 | 速率匹配 | 说明 |
|---------|---------|---------|------|
| 400G DR4 OSFP | ConnectX-7, ConnectX-8 | 400G ↔ 400G | 单模500m |
| 400G FR4 OSFP | ConnectX-7, ConnectX-8 | 400G ↔ 400G | 单模2km |
| 400G SR8 OSFP | ConnectX-7, ConnectX-8 | 400G ↔ 400G | 多模100m |

### 3.2 QSFP56端口光模块

| 光模块型号 | 兼容网卡 | 速率匹配 | 说明 |
|---------|---------|---------|------|
| 200G FR4 QSFP56 | ConnectX-6, ConnectX-7 | 200G ↔ 200G | 单模2km |
| 200G SR4 QSFP56 | ConnectX-6, ConnectX-7 | 200G ↔ 200G | 多模100m |

### 3.3 QSFP28端口光模块

| 光模块型号 | 兼容网卡 | 速率匹配 | 说明 |
|---------|---------|---------|------|
| 100G SR4 QSFP28 | ConnectX-6, ConnectX-6 Lx | 100G ↔ 100G | 多模100m |
| 100G LR4 QSFP28 | ConnectX-6, ConnectX-6 Lx | 100G ↔ 100G | 单模10km |

---

## 四、光模块与交换机兼容性

### 4.1 OSFP端口交换机光模块

| 交换机型号 | 兼容光模块 | 端口类型匹配 | 说明 |
|---------|-----------|------------|------|
| NVIDIA Quantum-2 QM9700 | 400G DR4 OSFP | OSFP ↔ OSFP | InfiniBand专用 |
| NVIDIA Quantum-2 QM9700 | 400G FR4 OSFP | OSFP ↔ OSFP | 长距离方案 |
| NVIDIA Quantum-2 QM8790 | 400G DR4 OSFP | OSFP ↔ OSFP | 中小规模 |
| NVIDIA Spectrum-X SN4600 | 400G DR4 OSFP | OSFP ↔ OSFP | 以太网方案 |

### 4.2 QSFP56端口交换机光模块

| 交换机型号 | 兼容光模块 | 端口类型匹配 | 说明 |
|---------|-----------|------------|------|
| NVIDIA Quantum QM8700 | 200G FR4 QSFP56 | QSFP56 ↔ QSFP56 | InfiniBand专用 |
| NVIDIA Quantum QM8700 | 200G SR4 QSFP56 | QSFP56 ↔ QSFP56 | 短距离方案 |
| NVIDIA Spectrum-3 SN3700 | 200G FR4 QSFP56 | QSFP56 ↔ QSFP56 | 以太网方案 |
| NVIDIA Spectrum-3 SN3700 | 100G SR4 QSFP28 | QSFP28适配 | 需要QSFP28版本 |

---

## 五、线缆与光模块兼容性

### 5.1 有源光缆（AOC）

| 线缆型号 | 兼容光模块 | 速率匹配 | 长度选项 |
|---------|-----------|---------|--------|
| NVIDIA 400G AOC | 400G DR4 OSFP, 400G FR4 OSFP | 400G ↔ 400G | 3m, 5m, 10m |
| NVIDIA 200G AOC | 200G FR4 QSFP56 | 200G ↔ 200G | 3m, 5m, 10m |
| NVIDIA 100G AOC | 100G SR4 QSFP28 | 100G ↔ 100G | 3m, 5m, 10m |

### 5.2 直连铜缆（DAC）

| 线缆型号 | 兼容光模块/端口 | 速率匹配 | 长度选项 |
|---------|----------------|---------|--------|
| NVIDIA 400G DAC | 400G DR4 OSFP（直连） | 400G ↔ 400G | 1m, 2m, 3m |
| NVIDIA 200G DAC | 200G FR4 QSFP56（直连） | 200G ↔ 200G | 1m, 2m, 3m |
| NVIDIA 100G DAC | 100G SR4 QSFP28（直连） | 100G ↔ 100G | 1m, 2m, 3m |

---

## 六、速率匹配规则

### 6.1 向下兼容原则

| 设备速率 | 兼容速率 | 说明 |
|---------|---------|------|
| 400G | 400G | 仅支持相同速率（不向下兼容） |
| 200G | 200G, 100G | 支持100G（但不推荐） |
| 100G | 100G | 仅支持相同速率 |

### 6.2 不推荐的速率组合

❌ 不推荐：
- 200G网卡 ↔ 100G交换机
- 400G网卡 ↔ 200G交换机（除非特殊适配器）

---

## 七、端口数量匹配规则

### 7.1 基本规则

1. **网卡端口数 ≤ 交换机可用端口数**
2. **每台服务器的网卡端口数 × 服务器数量 ≤ 交换机总端口数 - 冗余端口**
3. **冗余预留：至少预留10%端口或2个端口（取较大值）**

### 7.2 计算公式

```
所需交换机端口数 = (每台服务器网卡端口数 × 服务器数量) × (1 + 冗余比例)
推荐冗余比例 = 10% - 20%
```

### 7.3 示例

| 配置 | 计算 | 所需端口数 |
|-----|------|----------|
| 8台服务器，每台2个400G端口 | 8 × 2 × 1.1 = 17.6 | 20端口（预留2.4端口冗余） |
| 16台服务器，每台2个200G端口 | 16 × 2 × 1.15 = 36.8 | 40端口（预留3.2端口冗余） |

---

## 八、高可用性（HA）配置规则

### 8.1 N+1冗余

| 设备类型 | N+1配置规则 |
|---------|------------|
| 交换机 | 交换机数量 = 集群规模需要的数量 + 1（备用） |
| 管理网卡 | 每台服务器至少2个管理端口（主备） |
| 数据网卡 | 关键应用每台服务器至少2个数据网卡（主备或负载均衡） |

### 8.2 网络架构冗余

| 架构类型 | 冗余设计 |
|---------|---------|
| 胖树拓扑 | 至少2层交换机，每层N+1冗余 |
| CLOS架构 | Spine层和Leaf层都要冗余 |
| 直连架构 | 双网卡双连接到不同交换机 |

---

## 九、验证检查清单

### 9.1 配置验证步骤

✅ **步骤1：GPU-网卡兼容性检查**
- 确认GPU型号在网卡兼容列表中
- 确认互联模式匹配

✅ **步骤2：网卡-交换机兼容性检查**
- 确认端口类型匹配（OSFP/QSFP56/QSFP28）
- 确认速率匹配
- 确认交换机型号在兼容列表中

✅ **步骤3：光模块-网卡/交换机兼容性检查**
- 确认光模块端口类型匹配
- 确认速率匹配
- 确认传输距离满足需求

✅ **步骤4：线缆-光模块兼容性检查**
- 确认线缆类型匹配（AOC/DAC）
- 确认速率匹配
- 确认长度满足机房布局

✅ **步骤5：端口数量匹配检查**
- 计算所需总端口数
- 确认交换机端口数足够
- 确认冗余预留足够

✅ **步骤6：高可用性检查**
- 确认N+1冗余配置
- 确认网络架构冗余设计
