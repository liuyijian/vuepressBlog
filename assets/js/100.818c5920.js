(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{528:function(n,t,a){"use strict";a.r(t);var e=a(15),s=Object(e.a)({},(function(){var n=this,t=n.$createElement,a=n._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[a("h1",{attrs:{id:"chap1-基础"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#chap1-基础"}},[n._v("#")]),n._v(" Chap1 基础")]),n._v(" "),a("h4",{attrs:{id:"debian-ubuntu上安装nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#debian-ubuntu上安装nginx"}},[n._v("#")]),n._v(" Debian/Ubuntu上安装Nginx")]),n._v(" "),a("p",[n._v("1、创建一个文件"),a("code",[n._v("/etc/apt/sources.list.d/nginx.list")]),n._v("，文件内容如下")]),n._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# URL倒数第二个分段根据实际系统设置为 ubuntu 或 debian")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# bionic代表Ubuntu18，可替换成别的Debian/Ubuntu发行版的名称,mainline代表主线版本，当前为1.17.6")]),n._v("\ndeb http://nginx.org/packages/mainline/ubuntu/ bionic nginx \ndeb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx\n")])])]),a("p",[n._v("2、用shell执行命令")]),n._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[n._v("wget")]),n._v(" http://nginx.org/keys/nginx_signing.key\napt-key "),a("span",{pre:!0,attrs:{class:"token function"}},[n._v("add")]),n._v(" nginx_signing.key\n"),a("span",{pre:!0,attrs:{class:"token function"}},[n._v("apt-get")]),n._v(" update\n"),a("span",{pre:!0,attrs:{class:"token function"}},[n._v("apt-get")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" -y nginx \n/etc/init.d/nginx start "),a("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# 启动Nginx")]),n._v("\n")])])]),a("h4",{attrs:{id:"redhat-centos上安装nginx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#redhat-centos上安装nginx"}},[n._v("#")]),n._v(" RedHat/CentOS上安装Nginx")]),n._v(" "),a("p",[n._v("1、创建一个文件"),a("code",[n._v("/etc/yum.repos.d/nginx.repo")]),n._v("，文件内容如下")]),n._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[n._v("# 具体替换规则参考Ubuntu安装")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("[")]),n._v("nginx"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("]")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[n._v("name")]),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("nginx repo\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[n._v("baseurl")]),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("http://nginx.org/packages/mainline/centos/7/"),a("span",{pre:!0,attrs:{class:"token variable"}},[n._v("$basearch")]),n._v("/\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[n._v("gpgcheck")]),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[n._v("0")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[n._v("enabled")]),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[n._v("1")]),n._v("\n")])])]),a("p",[n._v("2、用shell执行命令")]),n._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[n._v("yum -y "),a("span",{pre:!0,attrs:{class:"token function"}},[n._v("install")]),n._v(" nginx\nsystemctl "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[n._v("enable")]),n._v(" nginx\nsystemctl start nginx\nfirewall-cmd --permanent --zone"),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v("public --add-port"),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[n._v("80")]),n._v("/tcp\nfirewall-cmd --reload\n")])])]),a("h4",{attrs:{id:"安装信息和基本用法"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装信息和基本用法"}},[n._v("#")]),n._v(" 安装信息和基本用法")]),n._v(" "),a("ul",[a("li",[a("p",[n._v("查看版本 "),a("code",[n._v("nginx -v")])])]),n._v(" "),a("li",[a("p",[n._v("查看运行状态 "),a("code",[n._v("ps -ef | grep nginx")])])]),n._v(" "),a("li",[a("p",[n._v("检查Nginx是否返回正确(返回一段包含nginx的html代码) "),a("code",[n._v("curl localhost")])])]),n._v(" "),a("li",[a("p",[n._v("Nginx的配置文件目录 "),a("code",[n._v("/etc/nginx")])])]),n._v(" "),a("li",[a("p",[n._v("Nginx配置读取的进入点文件 "),a("code",[n._v("/etc/nginx/nginx.conf")])]),n._v(" "),a("ul",[a("li",[n._v("设置全局环境：如进程数，调优，日志，动态加载模块")]),n._v(" "),a("li",[n._v("链接到其余配置文件等等")])])]),n._v(" "),a("li",[a("p",[n._v("Nginx默认的http server的配置文件目录 "),a("code",[n._v("/etc/nginx/conf.d")])]),n._v(" "),a("ul",[a("li",[n._v("在"),a("code",[n._v("nginx.conf")]),n._v("中有一句话叫做"),a("code",[n._v("include /etc/nginx/conf.d/*.conf;")])]),n._v(" "),a("li",[n._v("加配置可以在"),a("code",[n._v("conf.d")]),n._v("目录下分文件加入，以保持配置的简洁性")])])]),n._v(" "),a("li",[a("p",[n._v("Nginx默认的日志记录目录 "),a("code",[n._v("/var/log/nginx")])]),n._v(" "),a("ul",[a("li",[a("code",[n._v("access.log")]),n._v(" : 包含Nginx处理的每个请求")]),n._v(" "),a("li",[a("code",[n._v("error.log")]),n._v("：包含错误信息，若debug模块被启用，还会包括调试信息")])])]),n._v(" "),a("li",[a("p",[n._v("发送信号给Nginx主进程")]),n._v(" "),a("ul",[a("li",[a("code",[n._v("nginx -s stop")]),n._v("： 马上停止")]),n._v(" "),a("li",[a("code",[n._v("nginx -s quit")]),n._v("： 处理完当前请求后停止")]),n._v(" "),a("li",[a("code",[n._v("nginx -s reload")]),n._v(":  重新加载配置文件, 但不会中断nginx服务")]),n._v(" "),a("li",[a("code",[n._v("nginx -s reopen")]),n._v("： 重新打开日志文件")])])]),n._v(" "),a("li",[a("p",[n._v("检查配置文件语法是否正确")]),n._v(" "),a("ul",[a("li",[a("code",[n._v("nginx -t")]),n._v(" : 简单检查正确错误")]),n._v(" "),a("li",[a("code",[n._v("nginx -T")]),n._v("： 将很多正确配置的示例打印出来")])])])]),n._v(" "),a("h4",{attrs:{id:"静态文件服务"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#静态文件服务"}},[n._v("#")]),n._v(" 静态文件服务")]),n._v(" "),a("ul",[a("li",[a("p",[a("a",{attrs:{href:"https://segmentfault.com/a/1190000015681272",target:"_blank",rel:"noopener noreferrer"}},[n._v("nginx的default server规则"),a("OutboundLink")],1)])]),n._v(" "),a("li",[a("p",[a("a",{attrs:{href:"https://www.cnblogs.com/xiaoliangup/p/9175932.html",target:"_blank",rel:"noopener noreferrer"}},[n._v("nginx的location详解"),a("OutboundLink")],1)])])])])}),[],!1,null,null,null);t.default=s.exports}}]);