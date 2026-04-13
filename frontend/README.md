# NVIDIA 智算设备配置系统 - 前端

这是NVIDIA智算设备配置系统的前端部分，使用Next.js 14 + TypeScript + Tailwind CSS构建。

## 技术栈

- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 环境要求

- Node.js 18+
- npm, yarn 或 pnpm

## 安装和运行

### 1. 安装依赖

```bash
cd frontend
npm install
```

或者使用 yarn：
```bash
yarn install
```

或者使用 pnpm：
```bash
pnpm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

或者：
```bash
yarn dev
```

或者：
```bash
pnpm dev
```

### 3. 访问应用

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

## 项目结构

```
frontend/
├── app/
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页（配置输入/结果展示）
│   └── history/
│       └── page.tsx         # 历史记录页
├── components/
│   ├── Header.tsx           # 顶部导航栏
│   ├── Card.tsx             # 卡片组件
│   ├── Button.tsx           # 按钮组件
│   ├── ConfigForm.tsx       # 配置表单组件
│   ├── NICCard.tsx          # 网卡推荐卡片
│   ├── NetworkDiagram.tsx   # 组网方案卡片
│   └── BOMTable.tsx         # 设备清单表格
├── lib/
│   ├── types.ts             # TypeScript类型定义
│   └── mockData.ts          # 模拟数据
└── package.json
```

## 功能预览

### 1. 配置输入页面
- 输入服务器数量
- 选择应用场景
- 配置GPU型号、数量、互联模式
- 支持快速加载示例配置

### 2. 结果展示页面
- **网卡推荐方案**：显示推荐的ConnectX网卡型号和数量，包含技术解释和官方文档链接
- **智算组网方案**：展示组网架构、高可用设计、性能预估和扩展性建议
- **设备配置清单**：完整的BOM表格，包含交换机、光模块、线缆等设备信息

## 当前状态

前端界面已完成，可以独立预览。使用模拟数据演示完整的用户流程。

后续将连接后端LangChain服务，实现真实的智能配置生成。
