# CHICWAY 初始 GEO / SEO 记录

日期：2026-10-13；目标站点：https://chicway.app/；初始版本：e22351d。

## 已核验的初始情况

- GitHub API 确认发布方式为 GitHub Pages，`main` 分支根目录，域名 chicway.app，发布状态 built。
- 首页 HTTP 200；robots.txt 与 sitemap.xml 均为 HTTP 404。
- 本地页面没有 canonical、Open Graph、JSON-LD 或搜索站点地图。
- 产品列表与查询参数详情页由 shop.js 在浏览器中生成，源 HTML 没有完整产品介绍与购买链接。
- 用户确认 Google Search Console、Bing Webmaster Tools 和 GA4 尚未接入。
- 用户已提供三种香型的独立 Amazon 商品地址，并要求每包 3 个的文案。

## 第一轮建设

- 复用现有产品来源与渲染逻辑，生成 3 个静态产品详情页；目录同样提供静态产品卡。
- 为 8 个可索引网址生成 canonical、页面描述、社交分享信息和与正文一致的结构化数据。
- 为购物车、旧查询参数入口与图片型订单帮助设置 noindex；旧产品入口通过浏览器跳转保留可用性。
- 建立 robots、sitemap、IndexNow 验证文件、一个指南入口和一篇有来源的产品比较指南。
- 准备 Amazon 出站点击事件，未填 GA4 编号前不会把该钩子当作已连接统计。
- 每日 GitHub Actions 巡检及每周 AI 内容运营分别记录实际启用结果。

## 验证边界

本地校验通过、线上部署通过、搜索引擎收录、AI 引用、自然流量增长和 Amazon 订单增长是不同结果。后几项需要接入账户和持续观察，初始建设不能证明增长。

最终上线与自动化状态以本轮对话中的实际部署核验、GitHub Actions 运行和自动化工具返回结果为准。本文件是建设前基线，不是运行成功的替代证明。
