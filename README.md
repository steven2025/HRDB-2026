# 全球劳务外派智能平台

- 答辩汇报：https://steven2025.github.io/HRDB-2026/
- 程序主页：https://steven2025.github.io/HRDB-2026/platform.html

## 汇报页面

团队及成果概要 → 项目背景 → 需求挖掘梳理 → 开发技术及过程 → 成果展示 → 成果评价。

首页右侧使用本地地球背景；项目背景有四张动图和静态阅读版；需求页一次呈现；开发页使用四列技术表；成果评价包含视频与两张使用截图。视频和部分图片来自 COS，项目背景动图与地球脚本随仓库发布。

## 模块入口

module.html 统一提供返回 platform.html 的入口。

- 智能简历匹配：modules/resume/index.html，使用既有腾讯云函数。
- 多语言AI面试：https://steven2025.github.io/haiwai/ 。
- 合规签约：heguiqianyue.html 。

## 部署与本地预览

GitHub Pages 使用 main 分支仓库根目录。无需 npm 构建。修改 index.html 和所依赖的 assets/、cailiao/ 后同步提交。

本地可使用 python -m http.server 8080，再打开 http://localhost:8080/ 。

## 检查范围

2026-11-10：本轮汇报页脚本语法、数据结构、页面顺序、地球背景依赖及 COS 视频/图片 HTTP 检查通过。开发视频的 COS 大小与本地新版一致。未据此宣称所有业务流程、摄像头麦克风或全部浏览器均已完整验收。
