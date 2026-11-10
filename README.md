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

## PWA 安装

电脑使用 Chrome / Edge 打开网站，点击“安装到桌面”或地址栏安装图标。iPhone / iPad 使用 Safari 分享菜单“添加到主屏幕”。安装后独立窗口打开答辩页，内置程序主页可继续进入三个模块。

首次联网打开并完成缓存后，断网可打开答辩页框架和程序主页；视频、完整背景素材、简历云端业务和外部面试仍需联网。Service Worker 仅缓存白名单内主页文件和图标，不缓存 API、简历数据、COS 视频和其他 GitHub 项目。

更新时主页优先联网读取；检测到新 Service Worker 时点击“更新应用”刷新。更改离线文件列表或缓存策略时递增 sw.js 的 CACHE 版本。PWA 需要 HTTPS 或 localhost；直接双击 file:// 页面不支持安装。
