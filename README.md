# NVIDIA 智算设备配置系统

一个面向 NVIDIA GPU 服务器与网络设备适配的 B/S 架构 demo 系统。  
系统根据用户输入的 GPU 型号、GPU 形态、互联模式、应用场景、组网路线和距离约束，自动生成网卡推荐、组网方案、BOM 清单，并支持手动编辑、AI/规则解释、Excel 导出。

当前仓库以“**先可演示、再逐步增强规则严谨性**”为目标，适合做方案展示、流程验证和后续工程化迭代。

## 核心功能

- GPU 服务器配置输入
  - 服务器数量
  - GPU 型号与数量
  - GPU 互联模式（`PCIe` / `NVLink`）
  - 应用场景（训练 / 推理 / HPC）
  - 组网路线（`InfiniBand` / `RoCE`）
  - 服务器到交换机、交换机之间的距离约束
- 智能推荐单机网卡方案
  - 支持常见 `ConnectX` 主路径
  - 对 `SXM + NVLink` 参考节点支持 `GPU:NIC = 1:1` 的推荐逻辑
- 自动生成智算组网方案
  - 交换机类型与技术路线
  - 带宽级别判断
  - 单机对外网络理论带宽
  - 网卡数量配置依据
- 自动生成 BOM 清单
  - 网卡
  - DPU
  - 交换机
  - 光模块
  - 线缆
- BOM 手动编辑
  - 支持从内置产品清单中手动添加、编辑、删除设备
- 配置校验与依据展示
  - 展示带宽分析摘要
  - 展示链路规划提示
  - 展示风险和优化建议
- Excel 导出
  - 导出配置概览、配置依据、BOM 清单、校验结果

## 项目结构

```text
NVIDIA-Build/
├── README.md
├── DESIGN_SPEC.md
├── BACKEND_IMPLEMENTATION_PLAN.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/v1/
│   │   ├── chains/
│   │   ├── db/
│   │   └── knowledge/
│   ├── knowledge_base/
│   │   ├── rules/
│   │   └── source_documents/
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── package.json
    └── README.md
```

## 前端技术栈

- `Next.js 14`
- `React`
- `TypeScript`
- `Tailwind CSS`
- `Lucide React`

## 后端技术栈

- `FastAPI`
- `Pydantic`
- `SQLAlchemy`
- `SQLite`
- `LangChain`
- `langchain-openai`  
  说明：用于兼容 OpenAI 协议的模型接入，可接第三方服务
- `openpyxl`
- `ChromaDB`  
  当前仓库已预留知识库方向，向量检索仍在逐步增强

## 系统实现逻辑

系统当前采用“**规则优先 + AI 辅助解释/判断**”的实现方式。

### 1. 输入层

前端收集用户输入：

- GPU 型号
- GPU 数量
- GPU 互联模式
- 应用场景
- 组网类型
- 距离约束

其中部分字段带有前端约束逻辑：

- `SXM` 形态默认锁定为 `NVLink`
- `PCIe` 形态默认锁定为 `PCIe`

### 2. 带宽判断层

后端会把以下信息一起纳入判断：

- GPU 型号
- GPU 数量
- GPU 互联模式
- 应用场景
- 服务器数量
- 组网路线

当前支持两种模式：

- 未配置外部模型时：使用本地启发式规则
- 配置兼容 OpenAI 协议的模型服务时：可接入外部 LLM 参与带宽级别判断

### 3. 推荐层

后端根据带宽级别和 GPU 形态生成单机网络推荐：

- 选择 `ConnectX` 家族
- 判断单端口 / 双端口路径
- 估算每台服务器网卡数量

例如：

- 八卡 `H100/H200/H800 SXM + NVLink` 训练节点  
  会优先走 `GPU:NIC = 1:1`
- 推理型 `PCIe` 节点  
  默认优先更紧凑的网络方案

### 4. 组网方案层

根据用户选择的组网路线：

- `InfiniBand` -> `Quantum` 路线
- `RoCE` -> `Spectrum` 路线

同时输出：

- 架构说明
- 高可用设计
- 性能预估
- 单机理论带宽
- 网卡数量依据
- 参考链接

### 5. BOM 生成层

后端根据推荐结果自动展开：

- 服务器侧网卡数量
- 交换机数量
- 模块 / 线缆选型
- 交换机之间互联材料

并根据距离与策略在以下链路路径间切换：

- `DAC`
- `AOC`
- 模块化光链路

### 6. 可编辑层

前端支持对 BOM 进行手动编辑：

- 添加网卡
- 添加 DPU
- 添加交换机
- 添加模块
- 添加线缆
- 删除或修改已有项

### 7. 导出层

当前支持导出 `.xlsx` 文件，包含：

- 配置概览
- 配置依据
- BOM 清单
- 校验结果

## 规则与资料组织方式

仓库当前保留两类知识来源：

### 1. 结构化规则

目录：

- `backend/knowledge_base/rules/products_catalog.yaml`
- `backend/knowledge_base/rules/compatibility_rules.yaml`

用途：

- 产品目录
- 兼容关系
- 命名规范
- 推荐与校验的基础数据源

### 2. 文档资料

目录：

- `backend/knowledge_base/source_documents/official/`
- `backend/knowledge_base/source_documents/internal/`

用途：

- 存储人工整理资料
- 存储官方资料摘录
- 为后续知识库与规则补全提供依据

## 启动方式

### 前端

```bash
cd frontend
npm install
npm run dev -- --hostname 127.0.0.1 --port 3000
```

访问：

- [http://127.0.0.1:3000](http://127.0.0.1:3000)

### 后端

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

访问：

- Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 环境变量

后端当前支持兼容 OpenAI 协议的模型配置，推荐使用中性命名：

```env
LLM_API_KEY=your_api_key
LLM_BASE_URL=https://your-openai-compatible-endpoint/v1
LLM_MODEL=your_model_name
LLM_TEMPERATURE=0.2
LLM_MAX_TOKENS=1200
```

如未配置，系统会回退到本地规则/启发式逻辑。

## 当前状态

当前仓库已经具备以下可演示能力：

- 前后端页面可运行
- 表单输入与结果页联动
- 真实后端接口返回结果
- BOM 编辑
- Excel 导出
- 链接统一到较稳定的 NVIDIA 官方入口页

仍在持续增强的部分：

- 更细粒度的产品参数
- 更完整的模块 / 线缆规则
- 更严谨的 DPU 推荐逻辑
- 更完整的官方知识同步
- BOM 编辑后的后端二次重算与强校验

## 说明

这个项目当前定位是一个 **NVIDIA 网络产品适配决策系统 demo**。  
它已经具备完整展示链路，但仍会随着资料补充和规则完善继续演进。
