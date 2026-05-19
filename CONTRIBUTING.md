# Contributing

感谢你愿意改进 Codex Agent 规范模板。

## 贡献范围

1. 修正或补充 `AGENTS.md`、`AGENTS.local.md` 中的协作规范。
2. 优化 `.claude/agents/` 中的角色职责。
3. 补充 `docs/` 下的 PRD、计划、设计、验收或运维文档。
4. 改进 OpenSpec 使用说明和验收流程。

## 贡献原则

1. 遵循 MVP，不引入当前没有使用场景的复杂流程。
2. 保持 TDD、SMART、OpenSpec、Git/PR 规范之间的一致性。
3. 修改 README 或 docs 时，应基于真实目录结构，不描述不存在的文件。
4. 单个文件原则上保持在 200-500 行以内。

## 提交流程

1. 提交前检查改动范围，避免混入无关文件。
2. 功能 PR 必须先提交测试，再提交实现，推荐顺序为 `test:`、`impl:`、`refactor:`、`chore:`。
3. `test:` commit 只包含测试、fixtures、mocks、期望结果和测试辅助工具；`impl:` commit 只包含让测试通过的最小实现。
4. 中间产物、临时文件、测试输出、调试日志和本地缓存不提交到 GitHub。
5. 使用中文提交信息说明修改内容。
6. 创建 PR 时使用中文标题和描述，并填写 Test-first Evidence、测试命令、前后结果和 Agent 使用情况。
7. PR 合并前先给目标分支打 tag，保留合并前回滚点。
