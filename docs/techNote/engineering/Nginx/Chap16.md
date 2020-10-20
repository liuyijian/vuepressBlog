# Chap16 实用操作建议和总结

#### 使用include命令保持配置整洁

* [使用include命令详解](www.baidu.com)
* 配置文件分组管理，避免成百上千行的单个文件，模块化管理，避免重复
* SSL 配置 大多相同，书写一个，别处include即可

```nginx
http {
	include config.d/compression.conf;
  include sites-enabled/*.conf;
}
```

#### 配置调试文件

* Nginx根据最特别的匹配规则处理请求
* 为了得到调试信息，要使用 ``--with-debug``标志，然后指明``error_log``的级别是 ``debug``
* 可以为某些特定的连接配置调试，在``events``模块里使用 ``debug_connection``命令，参数为IP或者CIDR，在生产环境中，只下调部分连接为debug级别
* ``error_log``命令可以在main，HTTP，mail，stream，server，location的context底下，所以可以部分接口使用debug模式
* 使用命令 ``rewrite_log on``来记录rewrite statements过程中发生了什么

#### 总结

* 本书关注高性能负载均衡，安全，部署维护Nginx和Nginx Plus服务器
* Nginx是现代web体系的核心，不仅仅是一个web服务器，而是一个完整的应用分发平台