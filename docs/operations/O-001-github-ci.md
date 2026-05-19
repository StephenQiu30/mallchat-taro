# GitHub CI 说明

## 文档信息

- 文档类型：Operations
- 适用项目：Codex Agent 规范模板
- 作者：Stephen Qiu
- 创建日期：2026-05-08
- 更新时间：2026-05-08
- 状态：draft
- 关联 OpenSpec change：无

## 关联文档

1. 前置文档：`docs/README.md`
2. 后续文档：无
3. 配套文档：`.github/workflows/ci.yml`

## 背景

当前模板项目以文档规范、角色规范和 OpenSpec 目录为主要交付物，需要一个简单、可读、低维护成本的 GitHub CI 来守住基础结构质量，不额外引入测试脚本或依赖。

## 目标

在 GitHub push 和 pull request 时自动执行项目检查，确认基础文件、docs 分类目录、正式文档结构和 OpenSpec 配置存在。

## 范围

### 包含

1. GitHub Actions 工作流。
2. 仓库对应的运行环境（Node、Java 或 Flutter）。
3. 关键文件、规范入口和 Markdown 基础格式检查。
4. CI 失败时阻止无效文档结构进入主分支。

### 不包含

1. 构建产物发布或包发布。
2. 外部安全扫描平台接入。
3. 额外的接口测试、端到端测试和性能测试实现。

## 正文

### 工作流文件

CI 配置位于 `.github/workflows/ci.yml`。

### 触发条件

1. push 到 `main` 分支。
2. 面向当前默认分支的 pull request。

### 检查内容

1. 根目录基础文件存在：`README.md`、`AGENTS.md`、`AGENTS.local.md`、`package.json`。
2. `docs/`、`docs/prd/`、`docs/plans/`、`docs/design/`、`docs/acceptance/`、`docs/operations/` 目录存在并有 README。
3. `docs/TEMPLATE.md` 存在。
4. `openspec/config.yaml` 存在。
5. Markdown 文件没有尾随空格等基础格式问题。
6. 仓库对应的类型检查、编译、构建或分析命令通过。

## 验收或验证

1. GitHub Actions 中 `Check required files` 应通过。
2. 仓库对应的类型检查、编译、构建或分析步骤应通过。
3. GitHub PR 中 CI 应显示通过。
4. 删除任一必需文件后，CI 应能失败并提示对应步骤。

## 风险与后续事项

1. 当前 CI 覆盖仓库结构和基础构建门禁，不等价于完整业务验收。
2. 后续如果加入新的核心业务逻辑，应继续补充单元测试、接口测试或端到端测试。
3. 依赖变更必须同步提交 lockfile，保证 CI 可复现。

## 变更记录

| 日期 | 作者 | 变更说明 |
| --- | --- | --- |
| 2026-05-08 | Stephen Qiu | 初始化 GitHub CI 运维说明 |
| 2026-05-19 | Stephen Qiu | 将 CI 调整为仓库真实可执行的基础门禁 |
