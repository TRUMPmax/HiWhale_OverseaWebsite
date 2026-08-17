# Stage 0: Monorepo 初始化设计文档

**日期**: 2026-08-17  
**对应开发指南**: 《Hiwhale_K3开发指南与功能需求.md》第四部分 阶段 0  
**目标**: 搭建 pnpm workspace + Turborepo + 两个 Next.js app 脚手架 + shared 包骨架，能同时启动。

## 1. 上下文

上一阶段已完成：

- Node.js / pnpm / Docker 环境准备
- 根目录 monorepo 配置骨架（`package.json`、`pnpm-workspace.yaml`、`turbo.json`、`tsconfig.base.json`、`.env.example`、`.gitignore`、`.dockerignore`）
- Docker 基础服务启动并验证（PostgreSQL + pgvector、Redis、MinIO）

本阶段在已有骨架上初始化具体应用与共享包。

## 2. 架构

```
hiwhale-platform/
├── apps/
│   ├── portal/          # Next.js 14 App Router + TypeScript + Tailwind CSS v3, port 3000
│   └── admin/           # Next.js 14 App Router + TypeScript + Tailwind CSS v3, port 3001
├── packages/
│   └── shared/          # @hiwhale/shared
│       └── src/
│           ├── types/
│           ├── api/
│           ├── constants/
│           └── utils/
├── api/                 # 后端服务目录，Stage 0 仅保留占位
├── package.json         # 根脚本与 devDependencies
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── .env.example
```

## 3. 技术选型

| 项            | 选型                       | 说明                                 |
| ------------- | -------------------------- | ------------------------------------ |
| Monorepo 工具 | pnpm workspace + Turborepo | 已有配置，保持沿用                   |
| 前端框架      | Next.js 14                 | App Router，React Server Components  |
| 语言          | TypeScript                 | strict 模式                          |
| 样式          | Tailwind CSS v3            | 后续按设计规范扩展品牌色             |
| 共享包        | `@hiwhale/shared`          | 通过 pnpm workspace + `exports` 暴露 |
| 代码规范      | ESLint + Prettier          | 根目录统一配置                       |

## 4. 实现要点

### 4.1 初始化 apps/portal

- 使用 `create-next-app@14`：TypeScript、Tailwind CSS、App Router、`@/` 别名，不使用 `src/` 目录
- 端口：`package.json` 中 `dev` 脚本设为 `next dev -p 3000`
- 保留默认首页作为占位，后续阶段替换

### 4.2 初始化 apps/admin

- 同样使用 `create-next-app@14`
- 端口：`next dev -p 3001`
- 后续阶段再引入 shadcn/ui

### 4.3 创建 packages/shared

- `package.json` name 为 `@hiwhale/shared`
- 通过 `exports` 暴露子目录：
  - `@hiwhale/shared/types`
  - `@hiwhale/shared/api`
  - `@hiwhale/shared/constants`
  - `@hiwhale/shared/utils`
- 每个子目录先有 `index.ts` 占位导出
- 根 `tsconfig.base.json` 已配置 `@hiwhale/shared/*` 路径映射

### 4.4 ESLint + Prettier

- 根目录创建 `.eslintrc.js`（或 `.eslintrc.json`）统一规则
- 根目录创建 `prettier.config.js`
- 各 app 继承根配置
- 规则：no-console（warn）、未使用 import 检测、TypeScript strict

### 4.5 根脚本

已预置：

- `dev:portal` / `dev:admin` / `dev:all`
- `build:portal` / `build:admin` / `build`
- `lint` / `type-check`

## 5. 数据流 / 依赖关系

- `apps/portal` 依赖 `@hiwhale/shared`
- `apps/admin` 依赖 `@hiwhale/shared`
- `@hiwhale/shared` 不依赖 app，可独立构建/类型检查

## 6. 验收标准

- `pnpm dev:portal` → `http://localhost:3000` 显示 Next.js 默认首页
- `pnpm dev:admin` → `http://localhost:3001` 显示 Next.js 默认首页
- `pnpm lint` 可执行且所有子项目无错误
- `pnpm type-check` 可执行且所有子项目无错误
- `shared` 包内的导出能被两个 app 正常 import

## 7. 质量要求

- 严格 TypeScript strict 模式，禁止 `any`
- 组件函数式，文件顶部加简短注释
- 样式使用 Tailwind，禁止写死 px 宽高
- 所有文案通过 next-intl 管理（本阶段先搭建框架，文案在阶段 1 完善）
- 图标使用 Lucide React，禁止 emoji
- 前端交互与动效后续阶段对标行业优秀案例，追求视觉冲击力
