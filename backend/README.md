# NVIDIA 智算设备配置系统 - 后端

## 项目概述

这是NVIDIA智算设备配置系统的后端服务，使用FastAPI + LangChain构建。

## 技术栈

- **FastAPI** - Web框架
- **LangChain** - LLM编排
- **ChromaDB** - 向量数据库
- **SQLAlchemy** - ORM
- **SQLite/PostgreSQL** - 关系数据库

## 环境要求

- Python 3.11+
- pip

## 安装步骤

### 1. 创建虚拟环境

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. 安装依赖

```bash
pip install -r requirements.txt
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并填入配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的OpenAI API Key等配置。

## 运行服务

### 开发模式

```bash
python -m app.main
```

或使用uvicorn直接运行：

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 访问API文档

服务启动后，访问以下地址查看API文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 健康检查

```bash
curl http://localhost:8000/health
```

## 项目结构

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI应用入口
│   ├── config.py            # 配置管理
│   ├── api/                 # API路由
│   ├── chains/              # LangChain Chains
│   ├── db/                  # 数据库模型和CRUD
│   └── knowledge/           # 知识库相关
├── knowledge_base/
│   └── source_documents/    # 源文档
├── chroma_db/               # ChromaDB数据（自动生成）
├── requirements.txt
├── .env.example
└── README.md
```

## 当前阶段

✅ **阶段一：后端项目初始化** - 进行中

## API端点

### 公开端点
- `GET /` - 服务信息
- `GET /health` - 健康检查
- `GET /api/v1/health` - API健康检查

### 待实现端点
- `POST /api/v1/configure` - 提交配置任务
- `GET /api/v1/status/{task_id}` - 查询任务状态
- `GET /api/v1/history` - 查询历史记录

## 开发说明

### 代码规范
- 遵循PEP 8
- 使用类型注解
- 编写docstring

### 下一步
完成阶段一后，继续阶段二：数据库和Pydantic模型
