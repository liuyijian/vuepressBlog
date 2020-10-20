# Chap15 性能调优

#### 简介

* 性能调优往往依赖于环境，需求，物理因素等，应该优先解决瓶颈问题

#### 使用负载驱动器进行自动化测试

* 使用如JMeter，Locust，Gatling等HTTP 负载测试工具，精心构造测试样例，先默认配置直接测来了解基线水平，再逐渐增加用户并发量来模拟典型的生产环境，找到可优化的地方，再测试，通过控制变量法，直到达到预期效果

#### 与客户保持连接

```nginx
http {
	keepalive_requests 320; # 默认为100，单个连接最大允许的请求数
  keepalive_timeout 300s; # 默认为75秒，空闲链接被继续维持的时间
}
```

* 默认值一般能满足客户需求，因为现代浏览器允许单域名开多连接，但一般少于10条，所以，会发生请求共用单条连接的情况。一个在部署CDN时取巧的办法是使用多域名指向内容服务器，在源码中，random一个域名，这样，就会多开连接，在前端与后端实时交互场景下起到优化作用。（这段可能没太理解？）

#### 与上游服务器保持连接

* [慎用Nginx Upstream keepalive](https://www.cnblogs.com/kabi/p/7123354.html)

```nginx
proxy_http_version 1.1; # 1.1版本允许连接多路复用
proxy_set_header Connection # 让代理模块除去默认的close请求头，允许连接保持打开

upstream backend {
  server 10.0.0.42;
  server 10.0.2.56;
  
  keepalive 32; # 指定了每个Nginx Worker保持打开的“空闲连接”的数量（与连接数量不是一回事，不需要太大）
}
```

#### 应答缓冲区

* 大幅提高代理性能，也可能降低，要根据平均返回的body的大小来决定，彻底地重复地测试
* 不必要的大缓冲区设置能吃掉Nginx box的内存

```nginx
server {
  # 允许响应内容的缓冲
	proxy_buffering on; # 默认是on
  proxy_buffer_size 8k; # 默认值根据平台的不同，为4k或者8k
  proxy_buffers 8 32k; # 缓冲区的个数，默认是8，每个缓冲区的大小，默认是4k或者8k
  proxy_busy_buffer_size 64k; # 默认是buffer size的两倍，忙的定义是客户尚未完全接收发送的应答信息
  ...
}
```

#### 访问日志缓冲区

* 对于高访问站点和应用，这是对磁盘使用率和CPU使用率相当有益的调整

```nginx
http {
  # buffer参数指定了日志数据写入磁盘之前的缓冲区大小
  # flush参数指定了一条日志距离写入磁盘的最大时间（太久不写，挂了就不好的）
  access_log /var/log/nginx/access.log main buffer=32k flush=1m;
}
```

#### 操作系统调优

* 检查内核设置的Nginx的待服务连接的最大数量，最大字段名为``net.core.somaxconn``，若此字段被设置为大于512，则在listen 命令中要设置 ``backlog``参数，在大多数情况下，这个东西不用动
* 提高打开文件描述符的数量往往更实用，Nginx会为每一个连接开一个文件句柄，若使用代理或者负载均衡，则会开两个，为了应付大量连接，调整内核的参数 ``sys.fs.file_max``，查看 ``/etc/security/limits.conf``文件，同时，也要调节 ``worker_connections``和``worker_rlimit_nofile``参数

* 启用更多的临时端口；当Nginx作为反向代理或者负载均衡器时，每一个指向上游服务器的连接都会打开一个临时端口来接收应答，但系统可能没有那么多的临时端口可以开，检查内核设置``net.ipv4.ip_local_port_range`` ，一般地，将其设为 ``1024~65535``，记住，临时端口的下界要大于任一对外监听的端口(???)

* 操作系统调优不应该是热血上头的行为，要确保有效有意义，要根据日志信息来作出判断