# NVIDIA设备配置系统 - 设计SPEC

## 1. 项目概述

### 1.1 项目名称
NVIDIA 智算设备配置系统 (NVIDIA Intelligent Computing Configurator)

### 1.2 项目背景
为搭载NVIDIA GPU的服务器提供智能化的设备配置方案，包括网卡推荐、组网设计和完整设备清单。系统支持用户手动编辑配置，并通过多智能体架构进行多轮校验确保配置准确性。

### 1.3 项目目标
- 智能推荐ConnectX网卡配置
- 生成智算组网方案
- 提供完整设备配置清单
- 支持用户手动编辑和添加配置项
- AI自动校验配置合理性
- 多智能体架构进行多轮校验
- 集成NVIDIA官方文档链接

---

## 2. 系统架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                      前端层 (React/Next.js)                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ 配置输入   │  │ 方案展示   │  │ 可编辑清单 │  │ AI校验面板 │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API网关层 (FastAPI)                               │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ 配置API    │  │ 方案API    │  │ 校验API    │  │ 清单API    │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    LangChain 多智能体编排层                           │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    任务协调器 (Coordinator)                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐  │
│  │ 推荐Agent  │  │ 组网Agent  │  │ BOM生成Agent│  │ 校验Agent  │  │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                   多轮校验循环 (Multi-Round)                    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  本地知识库      │     │  NVIDIA官网     │     │  配置数据库      │
│  (向量数据库)    │     │  爬虫/API       │     │  (SQLite/PG)    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### 2.2 多智能体架构设计

#### 智能体列表

| Agent名称 | 职责 | 输入 | 输出 |
|----------|------|------|------|
| **推荐Agent** | 网卡推荐 | 服务器配置 | ConnectX网卡建议 |
| **组网Agent** | 网络架构设计 | 网卡配置+集群规模 | 组网方案 |
| **BOM生成Agent** | 设备清单生成 | 组网方案 | 设备清单 |
| **校验Agent** | 配置合理性校验 | 用户编辑后的清单 | 校验报告 |
| **协调器** | 任务调度和协调 | 全局状态 | 执行计划 |

#### 多轮校验流程
1. 初始配置生成
2. 用户手动编辑配置
3. 触发多智能体验证
4. 各Agent并行校验
5. 生成校验报告
6. 用户确认或继续修改
7. 最终确认配置

### 2.3 技术栈

| 层级 | 技术选型 |

### 2.2 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端 | Next.js 14 + React 18 + TypeScript + Tailwind CSS |
| 后端 | FastAPI + Python 3.11+ |
| LangChain | LangChain Core + LangChain OpenAI |
| 向量数据库 | ChromaDB / FAISS |
| 关系数据库 | SQLite (开发) / PostgreSQL (生产) |
| LLM | OpenAI GPT-4 / Claude 3 / 本地LLM (可选) |
| 爬虫 | Playwright / BeautifulSoup4 |

---

## 3. 功能模块详细设计

### 3.1 模块一：网卡推荐系统

#### 3.1.1 输入参数
- 服务器数量
- 每台服务器GPU型号
- 每台服务器GPU数量
- GPU互联模式 (NVLink/NVSwitch/PCIe)
- 应用场景 (AI训练/推理/HPC等)

#### 3.1.2 LangChain 链路设计

```
用户输入 → 输入验证器 → 知识库检索器 → LLM推荐器 → 结果格式化器 → 输出
```

**Prompts 设计：**

1. **知识库检索Prompt**
```
根据以下配置信息，检索最相关的NVIDIA网卡配置文档：
服务器配置：{server_config}
GPU型号：{gpu_models}
GPU互联：{interconnect_mode}
```

2. **网卡推荐Prompt**
```
角色：NVIDIA网络架构专家

任务：根据以下服务器配置，推荐最合适的ConnectX网卡配置

输入配置：
{server_config}

请提供：
1. 推荐的ConnectX网卡代数 (ConnectX-6/7/8等)
2. 每台服务器需要的网卡数量
3. 详细的技术解释
4. NVIDIA官方文档链接

参考信息：
{reference_docs}
```

#### 3.1.3 知识库内容
- NVIDIA ConnectX网卡产品规格文档
- GPU与网卡搭配最佳实践
- 不同应用场景的网络需求
- NVIDIA官方技术博客

### 3.2 模块二：智算组网方案

#### 3.2.1 输入参数
- 网卡推荐结果（来自模块一）
- 集群规模
- 预算限制（可选）
- 可用性要求

#### 3.2.2 LangChain 链路设计

```
网卡推荐结果 → 拓扑分析器 → 架构设计器 → 性能评估器 → 方案生成器
```

**组网架构类型：**
1. 单机多卡 (单机)
2. 多机直连 (小规模)
3. 胖树拓扑 (中大规模)
4. 2层/3层CLOS架构 (超大规模)

**Prompts 设计：**

```
角色：NVIDIA智算网络架构师

任务：基于以下配置设计智算组网方案

服务器配置：{server_config}
网卡配置：{nic_config}
集群规模：{cluster_size}

请提供：
1. 组网架构图描述
2. 高可用性设计
3. 性能预估（带宽、延迟）
4. 扩展性建议
5. NVIDIA参考架构链接
```

### 3.3 模块三：设备配置清单

#### 3.3.1 输入参数
- 组网方案（来自模块二）
- 网卡配置（来自模块一）

#### 3.3.2 LangChain 链路设计

```
组网方案 → BOM计算器 → 交换机选型 → 模块线缆配置 → 文档链接生成
```

**清单包含内容：**
- IB/ROCE交换机（型号、数量）
- 光模块（类型、数量）
- 线缆（类型、长度、数量）
- 所有设备的NVIDIA官网查询链接

**Prompts 设计：**

```
角色：NVIDIA数据中心BOM专家

任务：生成完整的设备配置清单

组网方案：{network_design}
服务器数量：{server_count}
网卡配置：{nic_config}

请提供：
1. 交换机清单（型号、数量、官网链接）
2. 光模块清单（类型、数量、官网链接）
3. 线缆清单（类型、长度、数量、官网链接）
4. 总价估算（可选）
```

### 3.4 模块四：可编辑配置清单与多智能体验证系统

#### 3.4.1 功能概述
- 支持用户编辑AI生成的配置清单
- 支持手动添加/删除配置项（交换机、光模块、线缆、网卡）
- 支持修改数量、型号、端口数、长度等详细参数
- 根据用户修改自动重新计算关联设备数量
- 产品型号必须完整准确（禁用简称）
- 多智能体架构进行配置验证和优化
- 支持导出Excel表格

#### 3.4.2 配置项详细规格要求

| 设备类型 | 必需字段 | 示例 |
|---------|---------|------|
| **网卡** | 完整型号、端口数量、端口类型、速率 | ConnectX-7 MCX75310AAS-HEAT, 2x400G, OSFP |
| **交换机** | 完整型号、端口数量、端口类型、层数 | NVIDIA Quantum-2 QM9700, 64x400G, OSFP, 1U |
| **光模块** | 完整型号、速率、接口类型、传输距离 | 400G DR4 OSFP, 400Gbps, OSFP, 500m |
| **线缆** | 完整型号、类型、长度、接口类型 | NVIDIA 400G AOC, 有源光缆, 5m, OSFP-OSFP |

**禁用简称示例：**
- ❌ ConnectX-7 → ✅ ConnectX-7 MCX75310AAS-HEAT
- ❌ QM9700 → ✅ NVIDIA Quantum-2 QM9700
- ❌ 400G 模块 → ✅ 400G DR4 OSFP
- ❌ 5m 线缆 → ✅ NVIDIA 400G AOC, 5m

#### 3.4.3 多智能体验证架构

| Agent名称 | 角色 | 职责 |
|-----------|------|------|
| **Best Practice Agent** | 最佳实践专家 | 基于NVIDIA官方最佳实践生成初始推荐配置 |
| **Feasibility Validator** | 可行性校验专家 | 检查配置的技术可行性、端口匹配、兼容性 |
| **Data & Reference Agent** | 数据和依据专家 | 提供配置依据、详细规格参数、官方参考文档 |
| **Quantity Calculator** | 数量计算专家 | 根据配置变更自动重算关联设备数量 |

#### 3.4.4 智能体验证流程

```
用户输入配置
    ↓
[Best Practice Agent] 生成初始推荐配置
    ↓
(用户编辑配置)
    ↓
[Quantity Calculator] 自动重算关联设备数量
    ↓
┌─────────────────────────────────────┐
│  并行验证                             │
│  ├─ Feasibility Validator           │
│  │  - 端口匹配检查                   │
│  │  - 设备兼容性检查                 │
│  │  - 带宽匹配验证                   │
│  └─ Data & Reference Agent          │
│     - 提供配置依据                   │
│     - 提供详细规格                   │
│     - 提供官方文档链接               │
└─────────────────────────────────────┘
    ↓
[汇总] 生成验证报告和配置依据
    ↓
用户确认或继续编辑
    ↓
导出Excel
```

#### 3.4.5 配置项编辑功能
| 操作类型 | 说明 |
|---------|------|
| 编辑 | 修改已有配置项的完整型号、数量、端口数、长度 |
| 添加 | 新增网卡/交换机/光模块/线缆（完整规格） |
| 删除 | 删除配置项 |
| 重新计算 | 修改后触发智能重算关联设备 |

#### 3.4.6 Excel导出功能
导出内容包含：
- 配置摘要（服务器数量、GPU配置）
- 网卡清单（完整型号、数量、详细规格）
- 交换机清单（完整型号、数量、端口数）
- 光模块清单（完整型号、数量、速率、距离）
- 线缆清单（完整型号、数量、类型、长度）
- 配置依据和参考文档链接
- 校验报告

#### 3.4.7 Feasibility Validator Prompt设计
```
角色：NVIDIA配置可行性校验专家

任务：校验配置的技术可行性

当前配置：
{current_bom}

请进行以下校验：
1. 端口数量匹配检查
   - 交换机端口数 vs 光模块数量
   - 网卡端口数 vs 线缆数量
2. 设备兼容性检查
   - 光模块与交换机接口兼容性
   - 线缆与光模块接口兼容性
   - 速率匹配检查
3. 冗余度检查
   - N+1冗余检查
   - 单点故障风险

输出格式：
- 总体可行性评分 (1-10分)
- 具体问题列表（error/warning）
- 修复建议
```

#### 3.4.8 Data & Reference Agent Prompt设计
```
角色：NVIDIA配置数据和依据专家

任务：为配置提供详细依据和参考

配置项：
{config_item}

请提供：
1. 产品完整规格说明
2. NVIDIA官方产品页面链接
3. 技术规格文档链接
4. 相关最佳实践文档链接
5. 在配置中的作用说明
```

#### 3.4.9 关联设备自动重算规则
- **修改服务器数量** → 重算网卡、光模块、线缆数量
- **修改交换机数量/端口数** → 重算所需光模块和线缆数量
- **修改网卡数量/端口数** → 重算所需线缆数量
- **修改光模块类型** → 检查线缆兼容性，提示可能的变更
- **修改线缆长度/类型** → 检查光模块兼容性

---

## 4. 数据库设计

### 4.1 配置历史表 (config_history)
```sql
CREATE TABLE config_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    input_config JSON,
    nic_recommendation JSON,
    network_design JSON,
    bom_list JSON,
    session_id VARCHAR(100)
);
```

### 4.2 知识库元数据表 (knowledge_base)
```sql
CREATE TABLE knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_url VARCHAR(500),
    title VARCHAR(500),
    category VARCHAR(100),
    last_updated TIMESTAMP,
    vector_id VARCHAR(100)
);
```

---

## 5. API 设计

### 5.1 配置提交 API
```
POST /api/v1/configure
Request:
{
    "server_count": 4,
    "gpu_configs": [
        {"model": "H100", "count": 8, "interconnect": "NVSwitch"}
    ],
    "use_case": "AI_training"
}

Response:
{
    "task_id": "uuid",
    "status": "processing"
}
```

### 5.2 状态查询 API
```
GET /api/v1/status/{task_id}

Response:
{
    "status": "completed",
    "result": {
        "nic_recommendation": {...},
        "network_design": {...},
        "bom_list": {...}
    }
}
```

### 5.3 历史查询 API
```
GET /api/v1/history?session_id={session_id}
```

### 5.4 清单编辑 API
```
POST /api/v1/bom/{task_id}/edit
Request:
{
    "action": "add|edit|delete|recalculate",
    "item_id": "optional_item_id",
    "item": {
        "type": "switch|transceiver|cable",
        "name": "设备名称",
        "model": "设备型号",
        "quantity": 4,
        "link": "官网链接"
    }
}

Response:
{
    "status": "ok",
    "updated_bom": [...],
    "auto_recalculated": true
}
```

### 5.5 AI校验 API
```
POST /api/v1/bom/{task_id}/validate
Request:
{
    "current_bom": [...]
}

Response:
{
    "validation_score": 8.5,
    "issues": [
        {
            "severity": "warning|error|info",
            "message": "光模块数量不足",
            "suggestion": "建议增加8个光模块"
        }
    ],
    "optimization_suggestions": [...]
}
```

### 5.6 导出Excel API
```
GET /api/v1/bom/{task_id}/export
Response: Excel文件下载
```

---

## 6. LangChain 实现详细设计

### 6.1 目录结构
```
backend/
├── app/
│   ├── api/
│   │   ├── router.py
│   │   └── schemas.py
│   ├── chains/
│   │   ├── nic_recommendation_chain.py
│   │   ├── network_design_chain.py
│   │   └── bom_generation_chain.py
│   ├── knowledge/
│   │   ├── loader.py
│   │   └── retriever.py
│   ├── db/
│   │   └── models.py
│   └── main.py
├── knowledge_base/
│   └── source_documents/
└── requirements.txt
```

### 6.2 核心Chain实现

**网卡推荐链 (nic_recommendation_chain.py)**
```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List

class NICRecommendation(BaseModel):
    generation: str = Field(description="ConnectX网卡代数，如ConnectX-7")
    count_per_server: int = Field(description="每台服务器网卡数量")
    explanation: str = Field(description="详细解释")
    official_links: List[str] = Field(description="NVIDIA官方文档链接")

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是NVIDIA网络架构专家..."),
    ("user", "服务器配置：{server_config}\n参考文档：{context}")
])

chain = prompt | llm | PydanticOutputParser(pydantic_object=NICRecommendation)
```

---

## 7. 前端页面设计

### 7.1 页面结构
1. **配置输入页** - 表单输入服务器配置
2. **方案展示页** - 展示网卡推荐、组网方案
3. **设备清单页** - 展示BOM清单，支持导出

### 7.2 核心组件
```
frontend/
├── app/
│   ├── page.tsx (配置输入)
│   ├── result/[taskId]/page.tsx (结果展示)
│   └── layout.tsx
├── components/
│   ├── ConfigForm.tsx
│   ├── NICCard.tsx
│   ├── NetworkDiagram.tsx
│   └── BOMTable.tsx
└── lib/
    └── api.ts
```

---

## 8. 实施计划

### 阶段一：项目搭建 (1-2周)
- [ ] 初始化前后端项目
- [ ] 配置LangChain环境
- [ ] 搭建向量数据库
- [ ] 基础API框架

### 阶段二：知识库构建 (1周)
- [ ] 收集NVIDIA官方文档
- [ ] 文档向量化
- [ ] 构建检索器
- [ ] 爬虫脚本开发

### 阶段三：核心功能开发 (2-3周)
- [ ] 网卡推荐Chain
- [ ] 组网设计Chain
- [ ] BOM清单生成
- [ ] 前端页面开发

### 阶段四：集成测试 (1周)
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 文档完善

---

## 9. 关键技术点

### 9.1 知识库更新策略
- 定期爬虫抓取NVIDIA官网
- 增量更新向量数据库
- 版本管理

### 9.2 LLM输出结构化
- 使用PydanticOutputParser
- 输出验证和纠错
- Fallback机制

### 9.3 性能优化
- 缓存常见配置结果
- 异步处理
- 知识库预加载

---

## 10. 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| NVIDIA官网结构变化 | 知识库失效 | 设计灵活的爬虫框架，监控变更 |
| LLM输出不稳定 | 结果不准确 | 实现输出验证、多轮对话确认 |
| 响应速度慢 | 用户体验差 | 结果缓存、流式输出、异步处理 |
