---
layer: Acceptance
doc_no: "A-003"
audience:
  - PM
  - Dev
  - QA
feature_area: mobile-im-experience
purpose: "记录 Taro 小程序端 demo.html 风格还原和 IM 主链路修正的验收结论。"
canonical_path: "docs/acceptance/A-003-demo-im-mobile-shell-acceptance.md"
status: complete
version: "0.1.0"
owner: "StephenQiu30"
inputs:
  - "../prd/P-001-mobile-im-experience-prd.md"
  - "../design/D-003-demo-im-ui-restoration.md"
  - "../plans/PL-001-demo-im-mobile-shell-plan.md"
  - "../../openspec/changes/archive/2026-05-19-restore-demo-im-mobile-shell"
outputs:
  - "Taro demo.html 还原验收结论"
triggers:
  - "检查 Taro 移动端 IM 体验改造是否通过"
downstream:
  - "../../openspec/specs/mobile-im-experience/spec.md"
---

# Taro demo.html 还原验收结论

## 1. 验收范围

- 联系人页点击好友先调用私聊房间接口，再使用返回的 `roomId` 进入聊天详情。
- 聊天详情输入栏补齐语音、表情、图片、更多入口。
- 文本发送、图片发送、历史消息、WebSocket 刷新和已读上报逻辑保持原有实现。
- OpenSpec change `restore-demo-im-mobile-shell` 已完成任务认领。

## 2. 验证命令

| 命令 | 结果 | 结论 |
| --- | --- | --- |
| `openspec validate restore-demo-im-mobile-shell --strict` | `Change 'restore-demo-im-mobile-shell' is valid` | 通过 |
| `bash scripts/validate-repository.sh` | 无错误退出 | 通过 |
| 红灯：`pnpm run test:unit` | helper 文件不存在导致 2 个 suites 失败 | 符合预期 |
| 绿灯：`pnpm run test` | 2 files passed, 6 tests passed | 通过 |
| `pnpm run build:weapp` | `built in 29.11s` | 通过 |

## 3. 已知警告

- Taro 构建输出 Dart Sass legacy JS API deprecation warning。
- Taroify `number-keyboard` 字体资源在构建期未解析，保留到运行时解析。

上述两类为既有依赖警告，本次改动未新增。

## 4. 测试覆盖

- `src/pages/contact/privateRoomNavigation.test.ts` 覆盖好友 ID 缺失、调用私聊房间 API、使用返回 roomId 跳转、API 失败消息。
- `src/pages/chat/composerTools.test.ts` 覆盖空输入显示工具入口、有文本显示发送动作、语音/表情/更多占位文案。
- CI 已新增 `pnpm run test`，后续推送会在 GitHub Actions 中自动运行单元测试。

## 5. 结论

Taro 小程序端已完成本轮 `demo.html` 风格还原相关的主链路修正，并通过红绿单测、OpenSpec 与 weapp 构建验证。需要说明的是，联系人私聊和输入栏入口的实现发生在用户追加“测试优先”要求之前；本轮已补充红灯与绿灯证据，后续功能必须严格先写失败测试再实现。

## 6. 残余风险

- 未在微信开发者工具或真机中截图验证。
- 语音消息、表情面板和更多工具为可点击占位入口，真实能力需后续 change 实现。
