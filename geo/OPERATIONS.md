# CHICWAY 自然搜索与 AI 搜索运营

目标：让有真实产品需求的美国英文用户发现 chicway.app，在产品页选择正确的 Amazon 商品购买。以搜索点击、有效进站、Amazon 出站点击及可核验的订单归因为结果；不承诺排名、AI 推荐或销售增长。

用户已委托本任务负责自动化 GEO/SEO，并确认先搭建未接入统计账号时的基础。可以自主完成网站范围内的技术修复、证据充分的内容更新、校验、提交与推送。新增付费服务、付费 API、广告、购买外链及账户或域名权限变更不在本阶段执行范围。

## 已有基础

- `geo/config.json`：网址、页面元数据、索引范围、修改日期及公开集成编号。
- `shop.js`：现有产品文案、价格、图片及用户提供的 Amazon 地址，是产品详情的来源。
- `geo/product-facts.json`：内容用产品事实与边界。这些是用户提供的资料，不是独立测试结论。
- `npm run build:geo`：生成静态产品页、目录、指南入口、页面元数据、JSON-LD、robots 与 sitemap。
- `npm run check:geo`：校验本地 HTML、页面索引、产品信息、购买链接及发现文件。
- `npm run check:geo:live`：检查线上可访问性与发布内容。
- `npm run notify:search -- changed-page.html`：仅在页面发布并核实后通知 IndexNow。HTTP 200/202 不是已收录的证明。
- `.github/workflows/geo.yml`：代码提交时校验，每天北京时间 09:15 执行线上技术巡检，实际启动时间以 GitHub 调度为准。

GitHub 云端巡检不依赖本机开机。当前对话中的每周 AI 运营任务使用本地项目，执行时需要电脑开机并保持桌面应用运行。

用户于 2026-10-13 进一步授权创建本站的 GA4 资源、网站数据流，并完成官网统计接入与验证。

## 每周执行流程

1. 读取本文件、产品事实、`geo/content-plan.json`、最近的 Git 记录和审计结果。先检查脏工作区；忽略无关文件，包括未跟踪的 `site-qr-code.png`。禁止覆盖用户未提交的工作。
2. 读取 GitHub 上的 Search Health 运行结果，确认线上核心页面、robots、sitemap、canonical 和 Amazon 链接。发现可复现的技术问题先修复。
3. 账号接入后读取真实 Search Console 查询与页面数据、GA4 的 `amazon_outbound_click`、Bing AI Performance 中实际可访问的引用数据。没有权限或数据就记录 `not_connected` / `not_available`，不写成 0，不通过几次手工提问推算 AI 排名。
   - Search Console 已通过 GSC Wizard 接入 https://chicway.app/。每轮先调用 list_sites 核验该资源仍为 readable=true、activated=true，再读取 get_site_summary 和所需查询/页面报告；保留实际来源、日期范围及数据成熟度。配置文件或历史成功记录不能替代本轮授权检查。
   - 如果 dailyRows 为空，记录 not_available / awaiting_data；汇总卡片显示的 0 不能据此当作真实零流量。已有数据但成熟度无法确定时，保留实际指标并标记 maturity_unknown，不推定其为完整稳定基线。
   - 网站巡检仅校验公开验证文件、网页与发现文件；requires_authenticated_check 表示还需执行上述账户报表读取，不是连接失败。
   - GA4 已通过 GSC Wizard 只读接入资源 properties/558742245，并关联 https://chicway.app/。每轮先调用 list_ga4_properties，确认 connected=true、资源编号正确且 linkedSiteUrls 包含本站，再读取 get_ga4_overview 与 query_ga4_report。Amazon 出站点击使用 dimension=event、filters.event=["amazon_outbound_click"]，需要逐日观察时加 secondaryDimension=date。
   - GA4 从 2026-10-13 开始采集；安装前的数据不是流量基线。当天的 QA 访问使用 utm_source=qa、utm_medium=setup、utm_campaign=ga4_verification_20261013，并测试了一次 Amazon 跳转。运营分析应识别测试访问；首个完整自然日从 2026-10-14 起等待处理完成后再使用。无历史比较数据时不计算增长，正式报表尚无事件行时记录 awaiting_processing，不以 0 代替实际未知流量。
   - Bing 普通搜索报表已通过 GSC Wizard 接入。每轮先调用 list_bing_sites，确认返回本站 https://chicway.app/ 且 dataSource=bing，再读取 get_bing_feeds、get_bing_traffic_stats 和 get_bing_crawl_stats。daily 为空且日期范围为 null 时记录 awaiting_data，不把缺少可核验覆盖范围的汇总 0 当成真实零流量或完整基线；有实际记录时保留指标、日期范围和数据成熟度。AI Performance 仍需单独检查实际界面或导出结果，普通 Bing API 连接不能替代 AI 引用核验。
4. 根据真实查询、内容缺口或可核验的产品问题，选择一个明确主题。每轮至多发布一篇新指南；也可以改进现有页面。主题必须有独立用途，不把近义问句扩成大量重复页面。
5. 内容只使用已提供的产品事实或新核验的官方来源。每个关键参数有来源。不得杜撰测试、用户评价、专家身份、奖项、医疗效果、降噪或隔音性能、价格与库存。未知功能写未确认，不写成不存在。不要把页面当提示词去要求 AI 推荐品牌。
6. 新指南用 `geo/articles/<slug>.html` 保存正文，配置页条目的 `contentFile` 指向该文件，`type` 为 `article`，并填写独立标题、描述、图片及真实日期。仅既有比较指南使用 `template: comparison`。正文使用现有 `guide-article` 样式与真实产品图片，包含实质回答、来源、适用的产品链接和 Amazon 购买入口。
7. 执行构建、校验及受影响脚本语法检查。检查手机和电脑上的实际显示。修改正文时才更新对应 `modified` 日期；不通过每天刷新日期制造新鲜感。
8. 只暂存本轮明确修改及生成的网页文件。检查暂存差异，通过后提交到现有仓库并正常推送，禁止强推。若主分支出现冲突，先隔离工作并检查，不覆盖他人改动。
9. 等待 GitHub Pages 发布，核实线上页面与本地版本一致，然后仅将新增或更新的索引页面提交 IndexNow。查看 GitHub Actions 的实际结果。
10. 完成有意义的更新、出现持续故障或需要用户提供信息时，用中文简报。说明已发布页面、实际检查结果与数据限制。没有变化或可行动事项时保持安静，不重复发送状态消息。

## 统计账户的一次性接入

2026-10-13 实测：Search Console 所有权已验证，GSC Wizard 返回 siteOwner、readable=true、activated=true，报表接口可读取。站点地图已提交并回读，Google 已下载并识别 8 个网址，当前无解析错误或警告；这不证明网址已收录。首次 28 天报表窗口为 2026-09-13 至 2026-10-10，dailyRows 为空，且无法确定数据成熟边界，因此暂不建立流量基线。GA4 采集和只读报表连接均已验收，当时正式统计仍需等待处理。截至 2026-10-15，Bing 网站验证、站点地图及 GSC Wizard 普通搜索报表连接均已验收；AI Performance 界面可访问，引用情况与普通搜索报表分别核验。每轮运行应重新确认这些状态。

1. Google 已使用 HTML 文件上传方式完成验证，必须保留根目录的 google763c32cbe9706793.html 及其原始内容。配置中的 googleSiteVerificationFile 指向该文件，searchConsoleSiteUrl 指向已接入资源；googleSiteVerification 是另一种 HTML 标记验证的 content 值，此处保持 null，不将验证文件名填入。站点地图 https://chicway.app/sitemap.xml 已通过 GSC Wizard 提交并回读；后续用 list_sitemaps 检查 Google 的实际下载和解析结果。
2. Bing 网站公开验证标记已配置并发布：`msvalidate.01` 的 content 为 `38686B8C11219C45487F48CAF4EB0B94`，这是公开验证值，不是 API Key。2026-10-15 在 [Bing Webmaster Tools](https://www.bing.com/webmasters/) 的 Sitemaps 页面回读确认：`https://chicway.app/sitemap.xml` 的 Last submit 与 Last crawl 均为 10/13/2026，状态为 Success，URLs discovered 为 8；汇总为 known=1、errors=0、warnings=0。网站验证和站点地图提交已完成，不需重复提交；成功处理站点地图及发现网址不等于这些网址已收录或已被 AI 引用。同期 Bing 首页仍显示数据 processing，不能据此覆盖站点地图的 Success，也不能写成真实零流量。
   - AI Performance 状态（2026-10-15）：界面已实测可访问，来源为 Microsoft Copilots and Partners；默认 3M 窗口为 2026-07-15 至 2026-10-14。界面显示 Total Citations=0、Average Cited Pages=0，Grounding Queries 显示 No data available、0 rows；页面提示这些数据是整体活动的样本，结果会随处理继续调整。这仅说明该 Bing 预览范围当前未呈现引用记录，新站仍需观察，不能推定所有 AI 平台引用均为 0。每轮应通过实际 AI Performance 界面或导出结果单独检查，保留来源、日期窗口、样本与处理状态；不能根据公开验证标记、站点地图或普通 Bing 搜索 API 推定 AI 引用自动报表已接通，配置 Bing API Key 也不能替代该项核验。
3. GA4 资源 CHICWAY 官网（558742245）及网站数据流 CHICWAY 官网 Web 已创建，报告时区为 America/Los_Angeles，币种为 USD，行业为购物，企业规模由用户确认为 1–10 名员工。数据流网址为 https://chicway.app，数据流 ID 为 16120935134，衡量编号为 G-J3MCCDN0LH。编号写入 ga4MeasurementId 后由构建生成各页统计代码；巡检检查代码是否正确且仅安装一次。2026-10-13 实时报告已核验 QA 产品页的 page_view 与一次 amazon_outbound_click，并在该点击的 asin 参数中确认 B0H8RZ65QK。本地 11 页及线上 8 个索引页的统计代码检查通过。Amazon 出站点击不得命名为 purchase 或当作已归因订单。
4. 需要自动读取账户报表时，使用用户授权的连接或受限凭据配置。账号密码、OAuth 令牌、服务账号私钥不能写入仓库、网页或本文件。
   - GSC Wizard 的 Search Console 连接已实测通过。用户已当次确认 Google Analytics 只读授权，资源列表回读确认 properties/558742245 的 linkedSiteUrls 包含 https://chicway.app/，概览及事件报告接口均正常返回 ga4-api。当天事件报告 rows=[]，标记 awaiting_processing；默认历史窗口结束于安装前，不能据其零值评价运营效果。只读连接成功与实时采集成功已分别验证。
   - 2026-10-15 用户明确授权生成 Bing Webmaster API Key 并存入 GSC Wizard。该 Key 属于账户级凭据，具备写操作能力；每周运营仅使用只读的站点列表、站点地图、搜索流量和抓取报表调用，不将此授权扩展为任意账户写入。Key 只存入服务的安全设置，不写入仓库、网页或聊天，本文件不记录其值或尾号。设置页面测试返回 API key valid、Found 1 site；保存后显示 Search Console、Bing、GA4 已连接，Key 以掩码显示已配置。接口回读 list_bing_sites 返回 count=1、sites=[https://chicway.app/]、dataSource=bing；get_bing_feeds 返回本站 sitemap 1 行、状态 Success、submitted 与 lastCrawled 均为 2026-10-13、urlCount=8、fileSize=1550。get_bing_traffic_stats 的 daily 为空、日期范围为 null 且汇总显示 0；get_bing_crawl_stats 的 daily 为空、rowCount=0、日期范围为 null，均记录 awaiting_data，不能解释为真实零流量、零抓取或完整基线。这已验证普通 Bing 报表连接，AI Performance 界面或导出仍按上面的独立范围检查。
   - 当前插件接口返回的试用截止时间为北京时间 2026-10-20 20:49，且未返回订阅信息。到期后的读取能力需实际核验，不自动升级或购买付费方案；报表不可用时仍可执行已有技术巡检与事实充分的内容维护。
5. Amazon 真实订单归因需接入账户支持的 Amazon Attribution 等实际归因工具，并使用其生成的链接；普通站外点击和任意 UTM 参数不等于已归因订单。

## 运营边界与后续优先级

- 2026-10-15 产品资料核验：用户确认便携款 PDF 与 Sleep Hub 两张说明书均对应当前版本，发生冲突时以说明书为准。当前功能与按键依据写入 `geo/product-facts.json`，包含原文件 SHA256；不要从旧网页或旧宣传图重新补回未确认的参数。
- Mom's Choice Awards 官方记录确认便携款 Gold Award；用户确认记录链接的 B0DDX2DZW1 与当前 B0H8RZ65QK 为同一硬件，仅更换商品链接。只将该奖用于便携款，不推定 Sleep Hub 获奖。官方记录未展示年份，不添加 2026 或“多个奖项”。
- 当前便携款声音清单使用说明书的 White Noise、Deep Ocean 等 18 项。Sleep Hub 投影使用说明书标注的模式名称 Stars / Nebula Cloud / Stars + Nebula Cloud；现有视频与宣传图可见环状行星图案，页面只把这些文字作为手册模式名，不将画面解释为另一套已确认功能。说明书未确认 Sleep Hub 声音数量、续航、充电时长或精确亮度档位，先留待核验。
- 已撤下含未核验 USA/FSC 标识或量化性能的相关宣传图引用，原资产文件保留。不得仅修改 alt 来掩盖图片内的声明；有依据后再恢复具体声明。移除公开产品数据中的两个隐藏示例商品，官网产品仅保留真实在售的三项。
- 本次 18 段原视频完成元数据与抽帧初筛，未完整核验口播或音乐。官网只使用 P03、S04 各前 28 秒的静音产品近景（各不足 4 MB），不将其作为录音流程、香薰间隔或性能测试的证据；完整步骤仍以手册为准。视频采用手动播放、preload=none 与本地封面。完整原片不上传，未经用户另行授权不发布 YouTube。

- 不采购外链，不发批量垃圾内容，不注册新付费服务，不新增广告支出。
- 首页当前存在自动打开的订单支持表单。是否影响访客阅读和 Amazon 点击尚无数据；先建立测量，再决定是否调整，不能宣称已经验证转化提升。
- 图片上的文字并不能替代重要产品说明的可读 HTML。后续按真实用户问题完善功能说明和产品使用图的文字解释。
- 奖项、续航条件、尺寸、配件、保修、退货以及香薰耗材使用步骤需要完整依据时，先核对用户资料或真实说明书，再发布更具体的结论。

## 官方依据

- [Google：面向生成式 AI 搜索的优化](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)。抓取、页面结构与有价值的内容仍是基础；不要把 llms.txt 或特殊 GEO 标记当成排名机制。
- [Google：垃圾内容政策](https://developers.google.com/search/docs/essentials/spam-policies#scaled-content)。不批量生产以操纵排名为主要目的的低价值页面。
- [OpenAI：爬虫说明](https://developers.openai.com/api/docs/bots)。搜索用 OAI-SearchBot，与训练用 GPTBot 分开管理。
- [Bing：AI Performance](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/)。引用量与搜索流量、实际订单分别记录。
- [IndexNow 协议](https://www.indexnow.org/documentation)。通知只代表接收网址，不代表已收录。
- [官方定时任务说明](https://learn.chatgpt.com/docs/automations?surface=app)。本地项目定时任务需要可用的电脑与桌面应用。
