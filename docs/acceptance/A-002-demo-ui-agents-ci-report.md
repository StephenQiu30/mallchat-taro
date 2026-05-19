---
layer: acceptance
doc_no: A-002
audience: Dev, QA, Ops
purpose: 记录 demo.html 视觉还原、AGENTS 规范迁移和 CI 门禁调整的验收结论
owner: StephenQiu30
inputs: demo.html, AGENTS.md, .github/workflows/ci.yml
outputs: Taro 小程序端 UI 验收结论与 CI 结论
triggers: 移动端 IM 主体验调整、规范入口迁移、CI 门禁变更
downstream: GitHub Actions, 小程序真机验收
---

# demo UI 与 AGENTS 迁移验收结论

## 1. 计划范围

本次变更只覆盖可提交、可复用的正式交付物：

1. 将项目规范入口从 `CLAUDE.md` / `CLAUDE.local.md` 迁移到 `AGENTS.md` / `AGENTS.local.md`。
2. 按 `demo.html` 还原 Taro 小程序端的消息、联系人、动态、聊天详情主界面。
3. 将 GitHub Actions 从不存在的 `npm test` 改为真实可执行的仓库门禁。
4. 不提交构建产物、临时排查记录或一次性过程日志。

## 2. 验收结论

| 验收项 | 结论 |
| --- | --- |
| 规范入口 | 已迁移到 `AGENTS.md` / `AGENTS.local.md`，脚本与文档引用已同步 |
| 消息页 | 已增加头像标题区、快捷操作、置顶/群聊/在线标签和在线状态点 |
| 联系人页 | 已增加居中标题、添加入口和群通知入口 |
| 动态页 | 已调整为蓝色顶部背景、个人卡片和统计信息区 |
| 聊天详情页 | 已增加返回、标题和设置顶部栏 |
| CI 门禁 | 已改为固定 pnpm 10.20.0、安装依赖、仓库结构校验和 `build:weapp` |

## 3. 已执行命令

```bash
npm run build:weapp
bash scripts/validate-repository.sh
```

## 4. 测试结论

1. `npm run build:weapp` 已通过，Taro 小程序端编译成功。
2. `bash scripts/validate-repository.sh` 已通过，规范入口、docs 结构和基础格式校验成功。
3. `npm run build:h5` 未纳入本次 CI 门禁；当前 H5 目标缺少 `src/index.html` 入口文件，需要作为独立 H5 配置任务处理。

## 5. 残余风险

1. 本次验证覆盖编译与结构门禁，尚未进行微信开发者工具真机视觉验收。
2. H5 入口配置缺口与小程序端提交解耦，不阻塞本次小程序 CI。

## 6. 变更记录

| 日期 | 作者 | 变更说明 |
| --- | --- | --- |
| 2026-05-19 | Stephen Qiu | 初始化 demo UI 与 AGENTS 迁移验收结论 |
