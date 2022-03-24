(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{437:function(t,a,s){"use strict";s.r(a);var v=s(15),r=Object(v.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"安全生产智能监控平台"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#安全生产智能监控平台"}},[t._v("#")]),t._v(" 安全生产智能监控平台")]),t._v(" "),s("h2",{attrs:{id:"需求和痛点"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#需求和痛点"}},[t._v("#")]),t._v(" 需求和痛点")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("角色")]),t._v(" "),s("th",[t._v("需求")]),t._v(" "),s("th",[t._v("痛点")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("政府")]),t._v(" "),s("td",[t._v("监管企业合法合规生产，降低安全事故发生率")]),t._v(" "),s("td",[t._v("用于监管的数据形式和来源单一，以事后总结性质的文本为主，缺乏"),s("strong",[t._v("事前预警")]),t._v("能力")])]),t._v(" "),s("tr",[s("td",[t._v("企业")]),t._v(" "),s("td",[t._v("保障高效生产过程中的员工安全")]),t._v(" "),s("td",[t._v("企业数据产出能力与政府数字化监管需求存在矛盾")])]),t._v(" "),s("tr",[s("td",[t._v("工人")]),t._v(" "),s("td",[t._v("增强生产安全意识")]),t._v(" "),s("td",[t._v("缺乏系统性安全培训的时间和渠道")])])])]),t._v(" "),s("h2",{attrs:{id:"模块设计"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#模块设计"}},[t._v("#")]),t._v(" 模块设计")]),t._v(" "),s("table",[s("thead",[s("tr",[s("th",[t._v("模块")]),t._v(" "),s("th",[t._v("功能")])])]),t._v(" "),s("tbody",[s("tr",[s("td",[t._v("智能监控")]),t._v(" "),s("td",[t._v("政府/企业：能查看权限范围内企业的厂区监控，获取"),s("strong",[t._v("异常告警")]),t._v("信息")])]),t._v(" "),s("tr",[s("td",[t._v("安全学习")]),t._v(" "),s("td",[t._v("政府：能发布相关政策文件和安全生产的视频课程"),s("br"),t._v("企业：获取工人学习情况报告"),s("br"),t._v("工人：完成相应学习任务（设定激励机制）")])]),t._v(" "),s("tr",[s("td",[t._v("隐患排查")]),t._v(" "),s("td",[t._v("政府：督促企业进行隐患整改"),s("br"),t._v("企业：获取企业内隐患数据信息"),s("br"),t._v("工人：上传隐患图像和描述文字（设定激励机制）")])])])]),t._v(" "),s("h2",{attrs:{id:"智能监控模块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#智能监控模块"}},[t._v("#")]),t._v(" 智能监控模块")]),t._v(" "),s("h3",{attrs:{id:"架构设计"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#架构设计"}},[t._v("#")]),t._v(" 架构设计")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku1d6v61j21280h9q6x.jpg",alt:"image-20220324115512417"}})]),t._v(" "),s("h3",{attrs:{id:"功能介绍"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#功能介绍"}},[t._v("#")]),t._v(" 功能介绍")]),t._v(" "),s("h4",{attrs:{id:"实时监控"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#实时监控"}},[t._v("#")]),t._v(" 实时监控")]),t._v(" "),s("p",[s("img",{attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku2n139gj213e0kt0zk.jpg",alt:"image-20220324115625680"}})]),t._v(" "),s("ul",[s("li",[t._v("支持省市区粒度的企业筛选和厂区摄像头分布卫星地图")]),t._v(" "),s("li",[t._v("支持多格式视频源接入（video/mp4，http/flv，hls/m3u8，webrtc）")])]),t._v(" "),s("h4",{attrs:{id:"智能识别"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#智能识别"}},[t._v("#")]),t._v(" 智能识别")]),t._v(" "),s("p",[s("img",{staticStyle:{width:"65%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku8jnw4tj20mb0bct9u.jpg",alt:"image-20220324120206643"}}),s("img",{staticStyle:{width:"33%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku8u7g8fj20cx0dyq37.jpg",alt:"image-20220324120223829"}})]),t._v(" "),s("p",[s("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuibceofj20i10i3q46.jpg",alt:"image-20220324121129906"}}),s("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kujb6c6rj20i10i3tae.jpg",alt:"image-20220324121227072"}})]),t._v(" "),s("ul",[s("li",[t._v("支持识别12类工业场景实体/行为\n"),s("ul",[s("li",[t._v("红色警报类：吸烟、火焰、烟雾、裸露转轴")]),t._v(" "),s("li",[t._v("黄色异常类：玩手机、杂服、裸露头部")]),t._v(" "),s("li",[t._v("蓝色正常类：人体、头盔、安全服、保护罩、引擎")])])]),t._v(" "),s("li",[t._v("支持实时接入和异常告警\n"),s("ul",[s("li",[t._v("带检测结果的800毫秒低延时直播，像素为1080x1080，码率为1Mbps （效果受限于当地网络上行带宽）")]),t._v(" "),s("li",[t._v("使用企业微信API进行异常信息推送")])])])]),t._v(" "),s("h2",{attrs:{id:"安全学习模块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#安全学习模块"}},[t._v("#")]),t._v(" 安全学习模块")]),t._v(" "),s("h3",{attrs:{id:"功能介绍-2"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#功能介绍-2"}},[t._v("#")]),t._v(" 功能介绍")]),t._v(" "),s("h4",{attrs:{id:"法律法规文件学习"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#法律法规文件学习"}},[t._v("#")]),t._v(" 法律法规文件学习")]),t._v(" "),s("img",{attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kumtlzghj20tc090t99.jpg",alt:"image-20220324121550008"}}),t._v(" "),s("p",[s("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuqz63zpj20v80k2wjo.jpg",alt:"image-20220324121949310"}}),s("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuprjkbaj20v80k240l.jpg",alt:"image-20220324121839696"}}),s("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuolu97gj20ve0k9gn4.jpg",alt:"image-20220324121732290"}}),s("img",{staticStyle:{width:"50%",height:"25%"},attrs:{src:"https://tva1.sinaimg.cn/large/e6c9d24ely1h0kunayr8aj20ji0g4dgp.jpg",alt:"image-20220324121617442"}})]),t._v(" "),s("ul",[s("li",[t._v("支持多字段搜索，快速定位文件")]),t._v(" "),s("li",[t._v("支持多格式文件在线预览（docx，pptx，xlsx，pdf）")])])])}),[],!1,null,null,null);a.default=r.exports}}]);