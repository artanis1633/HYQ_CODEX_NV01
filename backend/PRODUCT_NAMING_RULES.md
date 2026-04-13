# NVIDIA 产品完整命名规则与禁用简称

## 一、网卡命名规则

### 1.1 ConnectX 网卡完整型号

| 产品系列 | 完整型号 | 端口数 | 速率 | 端口类型 | 说明 |
|---------|---------|-------|------|---------|------|
| ConnectX-8 | ConnectX-8 MCX85310AAS-HEAT | 2 | 400G | OSFP | 最新一代智能网卡 |
| ConnectX-8 | ConnectX-8 MCX853105AAS-HEAT | 1 | 400G | OSFP | 单端口版本 |
| ConnectX-7 | ConnectX-7 MCX75310AAS-HEAT | 2 | 400G | OSFP | 主流智能网卡 |
| ConnectX-7 | ConnectX-7 MCX753105AAS-HEAT | 1 | 400G | OSFP | 单端口版本 |
| ConnectX-7 | ConnectX-7 MCX71310AAS-HEAT | 2 | 200G | QSFP56 | 200G版本 |
| ConnectX-6 Lx | ConnectX-6 Lx MCX623106AN-CDAT | 2 | 200G | QSFP56 | 经济型200G网卡 |
| ConnectX-6 | ConnectX-6 MCX653106A-ECAT | 2 | 200G | QSFP56 | 200G版本 |
| ConnectX-6 | ConnectX-6 MCX653105A-ECAT | 1 | 200G | QSFP56 | 单端口版本 |

### 1.2 网卡禁用简称

| 完整名称 | 禁用简称（不允许使用） |
|---------|-------------------|
| ConnectX-8 | ConnectX8, CX8, CX-8, CX 8 |
| ConnectX-7 | ConnectX7, CX7, CX-7, CX 7 |
| ConnectX-6 Lx | ConnectX6Lx, CX6Lx, CX-6 Lx |
| ConnectX-6 | ConnectX6, CX6, CX-6, CX 6 |

---

## 二、交换机命名规则

### 2.1 NVIDIA 交换机完整型号

| 产品系列 | 完整型号 | 端口数 | 速率 | 端口类型 | 说明 |
|---------|---------|-------|------|---------|------|
| Quantum-2 | NVIDIA Quantum-2 QM9700 | 64 | 400G | OSFP | 64端口400G InfiniBand交换机 |
| Quantum-2 | NVIDIA Quantum-2 QM8790 | 40 | 400G | OSFP | 40端口400G InfiniBand交换机 |
| Quantum | NVIDIA Quantum QM8700 | 40 | 200G | QSFP56 | 40端口200G InfiniBand交换机 |
| Spectrum-X | NVIDIA Spectrum-X SN4600 | 64 | 400G | OSFP | 64端口400G以太网交换机 |
| Spectrum-3 | NVIDIA Spectrum-3 SN3700 | 64 | 200G | QSFP56 | 64端口200G以太网交换机 |

### 2.2 交换机禁用简称

| 完整名称 | 禁用简称（不允许使用） |
|---------|-------------------|
| NVIDIA Quantum-2 | Quantum2, Q2, Quantum 2 |
| NVIDIA Quantum | Quantum, Q |
| NVIDIA Spectrum-X | SpectrumX, SX, Spectrum X |
| NVIDIA Spectrum-3 | Spectrum3, S3, Spectrum 3 |
| QM9700 | （必须完整写NVIDIA Quantum-2 QM9700） |
| SN4600 | （必须完整写NVIDIA Spectrum-X SN4600） |

---

## 三、光模块命名规则

### 3.1 光模块完整型号

| 速率 | 完整型号 | 端口类型 | 传输距离 | 说明 |
|------|---------|---------|---------|------|
| 400G | 400G DR4 OSFP | OSFP | 500m | 400G单模光模块 |
| 400G | 400G FR4 OSFP | OSFP | 2km | 400G单模长距离 |
| 400G | 400G SR8 OSFP | OSFP | 100m | 400G多模 |
| 200G | 200G FR4 QSFP56 | QSFP56 | 2km | 200G单模 |
| 200G | 200G SR4 QSFP56 | QSFP56 | 100m | 200G多模 |
| 100G | 100G SR4 QSFP28 | QSFP28 | 100m | 100G多模 |
| 100G | 100G LR4 QSFP28 | QSFP28 | 10km | 100G单模 |

### 3.2 光模块禁用简称

| 完整名称 | 禁用简称（不允许使用） |
|---------|-------------------|
| 400G DR4 OSFP | 400G模块, DR4, OSFP模块 |
| 200G FR4 QSFP56 | 200G模块, FR4, QSFP56模块 |
| 100G SR4 QSFP28 | 100G模块, SR4, QSFP28模块 |

---

## 四、线缆命名规则

### 4.1 线缆完整型号

| 类型 | 完整型号 | 长度 | 接口类型 | 说明 |
|------|---------|------|---------|------|
| 有源光缆 | NVIDIA 400G AOC | 3m, 5m, 10m | OSFP-OSFP | 400G有源光缆 |
| 有源光缆 | NVIDIA 200G AOC | 3m, 5m, 10m | QSFP56-QSFP56 | 200G有源光缆 |
| 有源光缆 | NVIDIA 100G AOC | 3m, 5m, 10m | QSFP28-QSFP28 | 100G有源光缆 |
| 直连铜缆 | NVIDIA 400G DAC | 1m, 2m, 3m | OSFP-OSFP | 400G直连铜缆 |
| 直连铜缆 | NVIDIA 200G DAC | 1m, 2m, 3m | QSFP56-QSFP56 | 200G直连铜缆 |
| 直连铜缆 | NVIDIA 100G DAC | 1m, 2m, 3m | QSFP28-QSFP28 | 100G直连铜缆 |

### 4.2 线缆禁用简称

| 完整名称 | 禁用简称（不允许使用） |
|---------|-------------------|
| NVIDIA 400G AOC | 400G AOC, AOC线缆 |
| NVIDIA 200G DAC | 200G DAC, DAC线缆 |
| 5m线缆 | （必须完整写长度） |

---

## 五、端口类型命名规则

### 5.1 端口类型完整名称

| 完整名称 | 禁用简称 |
|---------|---------|
| OSFP | ospf, OSPF（注意与OSPF是路由协议，不是端口类型） |
| QSFP56 | qsfp56 |
| QSFP28 | qsfp28 |
| QSFP+ | qsfp+ |

---

## 六、通用命名规则

### 6.1 必须包含内容：
1. 网卡必须包含完整的产品系列名称 + 完整型号
2. 交换机必须包含 "NVIDIA" 前缀 + 产品系列 + 完整型号
3. 光模块必须包含速率 + 类型 + 端口类型
4. 线缆必须包含 "NVIDIA" 前缀 + 速率 + 类型 + 长度
5. 所有型号必须使用大写字母开头，使用正确的空格和连字符

### 6.2 验证示例：

✅ 正确示例：
- ConnectX-7 MCX75310AAS-HEAT
- NVIDIA Quantum-2 QM9700
- 400G DR4 OSFP
- NVIDIA 400G AOC, 5m

❌ 错误示例：
- ConnectX7
- QM9700
- 400G模块
- 5m线缆
