# docs

本目录用于存放 Codex 侧项目文档。所有文档应按类型进入对应子目录，避免 PRD、计划、设计、验收和运维材料混放。

## 子目录

1. `prd/`：产品需求、范围定义、用户故事、MVP 边界。
2. `plans/`：执行计划、阶段拆解、任务清单、排期安排。
3. `design/`：技术方案、架构决策、接口设计、实现设计。
4. `acceptance/`：验收标准、测试记录、验证报告、回归证据。
5. `operations/`：发布流程、Git/PR 规范、部署说明、运行手册。

## 编写规范

1. 新文档先判断类型，再放入对应子目录。
2. 文档标题和文件名应能表达主题，避免使用 `new.md`、`temp.md` 等模糊命名。
3. 文档内容应保持 MVP 风格，只写当前阶段需要的信息。
4. OpenSpec proposal、tasks、spec delta 仍放在 `openspec/`，不要混入 `docs/`。

## 收录边界

1. `docs/` 只收录会对项目产生长期真实影响的文档。
2. 可收录内容包括需求边界、产品决策、技术方案、验收标准、发布流程、Git/PR 规范和长期维护说明。
3. 不收录执行 todo、临时任务清单、过程性进展记录、一次性排查记录、会议流水账或仅服务当前一次执行的中间材料。
4. 过程性任务应写入 OpenSpec change 的 `tasks`，执行完成后随 change 归档，不额外沉淀为 docs 文档。
5. 如果文档不能影响后续开发、验收、发布或维护决策，默认不应放入 `docs/`。

## 必要信息

每一份正式文档都应以 YAML frontmatter 写入必要信息：

1. `layer`：文档层级，例如 `PRD`、`Plan`、`Design`、`Acceptance`、`Operations`。
2. `doc_no`：文档编号，便于排序和引用。
3. `audience`：目标读者，例如 PM、Dev、QA、Ops。
4. `feature_area`：文档所属功能域。
5. `purpose`：一句话说明文档目的。
6. `canonical_path`：本文档在仓库中的标准路径。
7. `status`：使用 `draft`、`review`、`accepted`、`archived` 之一。
8. `version`：文档版本号。
9. `owner`：文档负责人或维护人。
10. `inputs`：输入或前置文档。
11. `outputs`：本文档产出的长期决策或交付物。
12. `triggers`：什么情况下需要阅读或更新本文档。
13. `downstream`：下游计划、设计、验收或运维文档。

## 推荐文档结构

正式文档建议按以下结构编写：

1. `背景`：为什么需要这份文档。
2. `目标`：本文件要解决什么问题，可用 BDD 场景描述关键目标。
3. `非目标`：明确不做事项，避免范围膨胀。
4. `核心内容`：按文档类型展开主体内容。
5. `关联文档`：列出输入、输出和下游文档。
6. `验收门禁`：说明如何判断文档完整、可执行、可验证。
7. `风险与边界`：列出风险、约束和延期事项。
8. `待确认问题`：列出需要用户或团队确认的问题。
9. `变更记录`：记录重要修改历史。

## 关联规则

1. PRD 应关联后续 plans、design、acceptance 文档。
2. plans 应关联来源 PRD、相关 design 和 acceptance 文档。
3. design 应关联来源 PRD、执行 plans 和验证 acceptance 文档。
4. acceptance 应关联被验收的 PRD、plans、design 或 OpenSpec change。
5. operations 应关联对应的发布、提交、PR、部署或回滚流程。

## 模板

新建正式文档时，优先复制 `TEMPLATE.md`，再根据文档类型删减无关部分。
