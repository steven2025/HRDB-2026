# 智能简历匹配

这是原 app.html 的独立发布包。index.html 就是原工作台，不再使用三板块总首页。

已移除组合程序总首页、面试翻译和合规模块、单独的智能体运行台及其链接；仅保留工作台实际加载的脚本和样式，排除备份、重复文件和未使用资源。原目录不修改。

## 发布 GitHub Pages

1. 新建仓库，建议名 smart-resume-matching。
2. 将本文件夹内的全部文件和子目录上传到仓库根目录，包含 .nojekyll；不要仅上传 ZIP，也不要套一层目录。
3. Settings → Pages → Deploy from a branch → main → / (root) → Save。
4. 等待发布完成，访问 https://你的用户名.github.io/smart-resume-matching/ 。

## 保留的必要依赖

- index.html：原 app.html 工作台，名称统一为“智能简历匹配”。
- login.html：原身份验证页面，登录后返回本包 index.html。
- match.html：工作台的双向匹配展示依赖。
- globe-offline.html：工作台全球态势展示依赖。
- js/、css/：主程序实际加载的脚本和样式。
- demo/：原始缺失动画的提示页及匹配演示兼容入口。

首次打开未登录时仍会进入本包登录页。这是程序必要的身份验证，不是跳回原组合程序。没有移除权限控制。

本包可以独立托管前端，但不是离线版：登录、业务数据、AI 和翻译继续使用 js/hp-config.js 配置的原腾讯云接口。后端、数据库及模型服务未包含，新域名需由后端支持跨域访问。

原文件缺少开机动画和简历分析动画，本包提供明确提示页，使用上方“跳过开机”继续；匹配演示转到现有 match.html。未伪造缺失的分析结果。

本地预览：在本目录执行 python -m http.server 8080，访问 http://localhost:8080/ 。

已检查静态依赖与 JavaScript 语法；未测试真实账号登录、业务写入或云端 AI，尚未上传 GitHub。
