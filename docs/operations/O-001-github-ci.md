# GitHub CI 说明

## 文档信息

- 文档类型：Operations
- 适用项目：Claude Agent 规范模板
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
2. Node 20 环境。
3. 关键文件和 Markdown 基础格式检查。
4. CI 失败时阻止无效文档结构进入主分支。

### 不包含

1. 依赖安装、构建产物发布或 npm 包发布。
2. 外部安全扫描平台接入。
3. 业务项目的单元测试、接口测试和端到端测试实现。

## 正文

### 工作流文件

CI 配置位于 `.github/workflows/ci.yml`。

### 触发条件

1. push 到 `main` 分支。
2. 面向 `main` 分支的 pull request。

### 检查内容

1. 根目录基础文件存在：`README.md`、`CLAUDE.md`、`CLAUDE.local.md`、`package.json`。
2. `docs/`、`docs/prd/`、`docs/plans/`、`docs/design/`、`docs/acceptance/`、`docs/operations/` 目录存在并有 README。
3. `docs/TEMPLATE.md` 存在。
4. `openspec/config.yaml` 存在。
5. Markdown 文件没有尾随空格等基础格式问题。

## 验收或验证

1. GitHub Actions 中 `Check required files` 应通过。
2. GitHub PR 中 CI 应显示通过。
3. 删除任一必需文件后，CI 应能失败并提示对应步骤。

## 风险与后续事项

1. 当前 CI 是模板仓库的结构检查，不等价于业务系统测试。
2. 后续如果加入真实代码，应在现有 CI 中补充 lint、单元测试和构建命令。
3. 如果引入依赖，应增加依赖安装步骤，并提交 lockfile 保证 CI 可复现。

## 变更记录

| 日期 | 作者 | 变更说明 |
| --- | --- | --- |
| 2026-05-08 | Stephen Qiu | 初始化 GitHub CI 运维说明 |
