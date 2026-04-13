# NVIDIA 智算设备配置系统 - 后端实施计划 (v2.0)

## 更新说明

根据新需求进行架构升级：
- 支持用户手动编辑配置清单
- 支持添加/删除配置项
- AI自动校验配置合理性
- 多智能体架构进行多轮校验
- 关联设备自动重算

---

## 部署组件清单

### 1. 核心服务
| 组件 | 技术选型 | 说明 |
|------|----------|------|
| Web服务 | FastAPI | RESTful API服务 |
| LLM集成 | LangChain Core + LangChain OpenAI | 编排LLM逻辑 |
| 多智能体框架 | LangGraph / 自定义协调器 | Agent编排 |
| 向量数据库 | ChromaDB | 本地向量检索 |
| 关系数据库 | SQLite (开发) / PostgreSQL (生产) | 配置历史存储 |

### 2. 依赖包
| 包名 | 版本 | 用途 |
|------|------|------|
| fastapi | ^0.104.0 | Web框架 |
| uvicorn | ^0.24.0 | ASGI服务器 |
| langchain | ^0.1.0 | LLM编排 |
| langchain-openai | ^0.0.5 | OpenAI集成 |
| langgraph | ^0.0.20 | 多智能体编排 |
| chromadb | ^0.4.18 | 向量数据库 |
| sqlalchemy | ^2.0.23 | ORM |
| pydantic | ^2.5.0 | 数据验证 |
| pydantic-settings | ^2.1.0 | 配置管理 |
| python-dotenv | ^1.0.0 | 环境变量管理 |
| openpyxl | ^3.1.2 | Excel导出 |
| beautifulsoup4 | ^4.12.0 | 网页爬虫 |
| playwright | ^1.40.0 | 浏览器自动化 |
| python-multipart | ^0.0.6 | 文件上传 |

---

## 多智能体架构设计

### Agent 定义

| Agent | 角色 | 职责 |
|-------|------|------|
| **Coordinator** | 协调器 | 任务调度、Agent通信、状态管理 |
| **NIC Recommender** | 网卡推荐专家 | ConnectX网卡配置推荐 |
| **Network Architect** | 组网架构师 | 网络拓扑和高可用设计 |
| **BOM Specialist** | BOM专家 | 设备清单生成和计算 |
| **Validator** | 校验专家 | 配置合理性验证 |
| **Critic** | 评论家 | 多轮反馈和优化建议 |

### 工作流程

```
用户输入
    ↓
[Coordinator] 初始化任务
    ↓
┌─────────────────────────────────────────┐
│  并行执行                                 │
│  ├─ NIC Recommender → 网卡推荐           │
│  └─ Network Architect → 组网方案         │
└─────────────────────────────────────────┘
    ↓
[BOM Specialist] 生成初始清单
    ↓
[Validator] 第一轮校验
    ↓
[Critic] 反馈优化
    ↓
(可选) 用户手动编辑
    ↓
[Validator] 第二轮校验
    ↓
[Coordinator] 汇总输出
```

---

## 分阶段实施计划 (更新版)

### 阶段一：后端项目初始化 ✅
**目标：搭建基础项目框架**
- [x] 1.1 创建Python项目结构
- [x] 1.2 创建 requirements.txt
- [x] 1.3 创建 .env.example 配置文件
- [x] 1.4 初始化FastAPI应用
- [x] 1.5 添加健康检查API
- [x] 1.6 配置CORS支持
- [x] 1.7 创建README文档

---

### 阶段二：数据库和Pydantic模型
**目标：建立数据模型和数据库连接**
- [ ] 2.1 创建数据库模型 (SQLAlchemy)
  - ConfigHistory表
  - KnowledgeBase表
  - BOMEditHistory表（新增：记录编辑历史）
  - ValidationReport表（新增：校验报告）
- [ ] 2.2 创建Pydantic Schemas
  - ServerConfig (请求)
  - NICRecommendation (响应)
  - NetworkDesign (响应)
  - BOMItem (响应，支持编辑)
  - ConfigResult (完整响应)
  - BOMEditAction (编辑操作)
  - ValidationReport (校验报告)
- [ ] 2.3 初始化SQLite数据库
- [ ] 2.4 创建数据库CRUD操作函数

---

### 阶段三：LangChain基础配置
**目标：配置LLM和基础组件**
- [ ] 3.1 创建LLM配置模块
  - OpenAI GPT-4配置
  - 温度、token参数设置
- [ ] 3.2 创建Prompt模板模块
  - 网卡推荐Prompt
  - 组网设计Prompt
  - BOM清单Prompt
  - 校验Prompt（新增）
  - 评论家Prompt（新增）
- [ ] 3.3 创建输出解析器
  - PydanticOutputParser配置
  - 验证逻辑
- [ ] 3.4 集成环境变量管理

---

### 阶段四：多智能体框架
**目标：实现Agent协调和通信**
- [ ] 4.1 实现Coordinator协调器
  - 任务状态管理
  - Agent调度
  - 结果汇总
- [ ] 4.2 实现基础Agent类
  - 通用Agent接口
  - 消息传递机制
  - 工具调用
- [ ] 4.3 实现NIC Recommender Agent
  - 知识库检索
  - 网卡推荐逻辑
- [ ] 4.4 实现Network Architect Agent
  - 拓扑设计逻辑
  - 高可用设计
- [ ] 4.5 实现BOM Specialist Agent
  - 设备清单生成
  - 数量计算逻辑
- [ ] 4.6 实现Validator Agent
  - 配置校验逻辑
  - 问题检测
- [ ] 4.7 实现Critic Agent
  - 优化建议生成
  - 多轮反馈

---

### 阶段五：网卡推荐Chain实现
**目标：实现第一个核心功能模块**
- [ ] 5.1 创建静态知识库
  - 准备NVIDIA网卡文档（Markdown格式）
  - 创建示例数据集
- [ ] 5.2 实现文档加载器
  - TextLoader / MarkdownLoader
  - 文档分割器
- [ ] 5.3 实现向量存储
  - ChromaDB初始化
  - 文档向量化
  - 持久化存储
- [ ] 5.4 实现Retriever
  - 相似度检索
  - 过滤和排序
- [ ] 5.5 集成NIC Recommender Agent
- [ ] 5.6 添加单元测试

---

### 阶段六：API接口开发
**目标：暴露后端功能给前端**
- [ ] 6.1 创建配置提交API (POST /api/v1/configure)
  - 接收前端请求
  - 异步处理
  - 返回task_id
- [ ] 6.2 创建状态查询API (GET /api/v1/status/{task_id})
  - 任务状态管理
  - 轮询支持
- [ ] 6.3 创建历史查询API (GET /api/v1/history)
  - 分页支持
  - 会话过滤
- [ ] 6.4 创建BOM编辑API (POST /api/v1/bom/{task_id}/edit)
  - 支持add/edit/delete/recalculate操作
  - 自动重算关联设备
- [ ] 6.5 创建校验API (POST /api/v1/bom/{task_id}/validate)
  - 触发多智能体验证
  - 返回校验报告
- [ ] 6.6 创建Excel导出API (GET /api/v1/bom/{task_id}/export)
  - Excel文件生成
  - 文件下载
- [ ] 6.7 实现异步任务处理
  - 使用BackgroundTasks
  - 任务状态存储
- [ ] 6.8 添加请求验证和错误处理
- [ ] 6.9 API文档 (Swagger UI)

---

### 阶段七：前端-后端联调
**目标：连接前后端**
- [ ] 7.1 前端添加API客户端
  - 创建api.ts
  - 类型定义
- [ ] 7.2 修改前端页面
  - 替换mock数据为真实API调用
  - 添加加载状态
  - 错误处理
- [ ] 7.3 配置CORS
- [ ] 7.4 端到端测试
- [ ] 7.5 修复bug和优化

---

### 阶段八：组网设计Agent实现
**目标：实现第二个核心功能模块**
- [ ] 8.1 创建组网架构知识库
  - 胖树拓扑文档
  - CLOS架构文档
  - 高可用设计文档
- [ ] 8.2 更新向量数据库
- [ ] 8.3 实现Network Architect Agent
  - 接收网卡推荐结果作为输入
  - 生成组网架构描述
  - 性能预估计算
- [ ] 8.4 集成到主流程
- [ ] 8.5 添加测试用例

---

### 阶段九：BOM Specialist和Validator Agent
**目标：实现清单生成和校验**
- [ ] 9.1 创建设备知识库
  - 交换机产品目录
  - 光模块产品目录
  - 线缆产品目录
- [ ] 9.2 更新向量数据库
- [ ] 9.3 实现BOM Specialist Agent
  - 计算设备数量
  - 匹配产品型号
  - 生成官网链接
- [ ] 9.4 实现关联设备重算逻辑
  - 修改交换机 → 重算模块和线缆
  - 修改服务器数量 → 重算全套
- [ ] 9.5 实现Validator Agent
  - 数量合理性校验
  - 兼容性校验
  - 性能校验
- [ ] 9.6 实现Critic Agent
  - 优化建议
  - 多轮反馈
- [ ] 9.7 实现Excel导出功能
  - openpyxl集成
  - 格式化输出
  - 文件下载API
- [ ] 9.8 集成到主流程
- [ ] 9.9 添加测试用例

---

### 阶段十：知识库爬虫和更新
**目标：自动化知识库维护**
- [ ] 10.1 创建网页爬虫
  - Playwright配置
  - NVIDIA官网文档抓取
  - 内容提取和清理
- [ ] 10.2 实现增量更新
  - 变更检测
  - 向量数据库更新
- [ ] 10.3 创建更新脚本
  - 手动触发更新
  - 定时任务配置
- [ ] 10.4 添加知识库管理API
- [ ] 10.5 测试爬虫稳定性

---

### 阶段十一：优化和部署
**目标：生产环境准备**
- [ ] 11.1 性能优化
  - 结果缓存 (Redis可选)
  - 常见配置预计算
  - 异步优化
- [ ] 11.2 添加日志系统
  - 结构化日志
  - 请求追踪
- [ ] 11.3 监控和告警
  - 健康检查
  - 指标收集
- [ ] 11.4 Docker容器化
  - 创建Dockerfile
  - docker-compose配置
- [ ] 11.5 部署文档
  - 环境变量说明
  - 部署步骤

---

## 当前进度

✅ **已完成：**
- 前端界面开发
- 设计SPEC文档 (v2.0更新)
- 阶段一：后端项目初始化

🔄 **下一个阶段：**
- 阶段二：数据库和Pydantic模型

---

## 前端功能更新清单

### 配置清单增强
- [ ] 1. 可编辑的BOM表格
  - 行内编辑（型号、数量）
  - 添加新配置项按钮
  - 删除配置项按钮
- [ ] 2. 配置项类型选择
  - 交换机
  - 光模块
  - 线缆
- [ ] 3. 自动重算按钮
  - 手动修改后触发重算
  - 显示重算进度

### AI校验功能
- [ ] 1. 校验按钮
  - 触发AI校验
  - 显示校验进度
- [ ] 2. 校验结果展示
  - 总体评分（1-10分）
  - 问题列表（warning/error/info）
  - 优化建议
- [ ] 3. 一键应用建议
  - 快速应用AI建议

### 确认流程
- [ ] 1. 配置确认状态
  - 编辑中 / 已校验 / 已确认
- [ ] 2. 最终确认按钮
  - 锁定配置
  - 导出Excel

---

## 下一步行动

设计文档已更新！是否继续进行以下工作：
1. **调整前端页面** - 实现可编辑清单和AI校验UI
2. **继续阶段二** - 数据库和Pydantic模型

请选择下一步操作！
