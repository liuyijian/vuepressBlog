(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{466:function(t,a,e){"use strict";e.r(a);var s=e(15),n=Object(s.a)({},(function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("h1",{attrs:{id:"chap16-实用操作建议和总结"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#chap16-实用操作建议和总结"}},[t._v("#")]),t._v(" Chap16 实用操作建议和总结")]),t._v(" "),e("h4",{attrs:{id:"使用include命令保持配置整洁"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#使用include命令保持配置整洁"}},[t._v("#")]),t._v(" 使用include命令保持配置整洁")]),t._v(" "),e("ul",[e("li",[e("a",{attrs:{href:"www.baidu.com"}},[t._v("使用include命令详解")])]),t._v(" "),e("li",[t._v("配置文件分组管理，避免成百上千行的单个文件，模块化管理，避免重复")]),t._v(" "),e("li",[t._v("SSL 配置 大多相同，书写一个，别处include即可")])]),t._v(" "),e("div",{staticClass:"language-nginx extra-class"},[e("pre",{pre:!0,attrs:{class:"language-nginx"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("http")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n\t"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("include")]),t._v(" config"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("d"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("compression"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("conf"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("include")]),t._v(" sites"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("enabled"),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("*")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("conf"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("h4",{attrs:{id:"配置调试文件"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#配置调试文件"}},[t._v("#")]),t._v(" 配置调试文件")]),t._v(" "),e("ul",[e("li",[t._v("Nginx根据最特别的匹配规则处理请求")]),t._v(" "),e("li",[t._v("为了得到调试信息，要使用 "),e("code",[t._v("--with-debug")]),t._v("标志，然后指明"),e("code",[t._v("error_log")]),t._v("的级别是 "),e("code",[t._v("debug")])]),t._v(" "),e("li",[t._v("可以为某些特定的连接配置调试，在"),e("code",[t._v("events")]),t._v("模块里使用 "),e("code",[t._v("debug_connection")]),t._v("命令，参数为IP或者CIDR，在生产环境中，只下调部分连接为debug级别")]),t._v(" "),e("li",[e("code",[t._v("error_log")]),t._v("命令可以在main，HTTP，mail，stream，server，location的context底下，所以可以部分接口使用debug模式")]),t._v(" "),e("li",[t._v("使用命令 "),e("code",[t._v("rewrite_log on")]),t._v("来记录rewrite statements过程中发生了什么")])]),t._v(" "),e("h4",{attrs:{id:"总结"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#总结"}},[t._v("#")]),t._v(" 总结")]),t._v(" "),e("ul",[e("li",[t._v("本书关注高性能负载均衡，安全，部署维护Nginx和Nginx Plus服务器")]),t._v(" "),e("li",[t._v("Nginx是现代web体系的核心，不仅仅是一个web服务器，而是一个完整的应用分发平台")])])])}),[],!1,null,null,null);a.default=n.exports}}]);