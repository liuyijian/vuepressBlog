# Chap2 高性能负载均衡

#### 简介

* 用户体验需要系统能即时响应，故出现了水平扩展的软件体系结构，就是请求分发到多个相同功能的服务器程序去处理
* 负载均衡策略是必要的点，Nginx能处理HTTP、TCP、UDP的负载均衡，以下会介绍
* 现代web架构大多部署了无状态的应用层（如restful），但事实是，很多还使用session技术来完成web交互的身份识别，当session存储在单一服务器上时，要确保后续的用户请求都由此服务器提供服务，还要确保交互期间此服务器不能掉线。
* 应用挂掉可能的原因有很多：网络传输中断，服务器错误，应用程序错误等等。故代理（负载均衡器）需要检查上游服务器健康状态， Nginx提供被动和主动检查两种方式，后者仅在Nginx Plus商业版中提供，被动检查带给上游服务器的压力相对较少，主动检查能更快地发现错误

#### HTTP 负载均衡

```nginx
upstream backend {
	server 10.10.12.45:80  weight=1;
	server app.example.com:80 weight=2;
}
server {
	location / {
		proxy_pass http://backend;
	}
}
```

#### TCP负载均衡

```nginx
# 新建文件夹 stream.conf.d， 并打开nginx.conf文件中的stream block，include这个文件夹内所有内容
stream {
  upstream mysql_read {
    server read1.example.com:3306 weight=5;
    server read2.example.com:3306;
    server 10.10.12.34:3306 backup;
  }
  server {
    listen 3306;
    proxy_pass mysql_read;
  }
}
```

#### UDP负载均衡

```nginx
stream {
  upstream ntp {
    server ntp1.example.com:123 weight=2;
    server ntp2.example.com:123
  }
  server {
    listen 123 udp;
    proxy_pass ntp;
  }
}
```

* UDP中的``proxy_response``配置：指定在``proxy_timeout``时间内从上游服务器返回的数据包个数，默认是无限制
* ``reuseport``参数可以让Nginx为每个工作进程新建独立的监听socket，能让内核在工作进程间分发到来的连接，当客户端和服务器需要来回发送多个packet的时候

#### 负载均衡策略

* Nginx 提供的负载均衡策略如下：

  * ``round robin``：默认策略，轮询server列表，会考虑weight
  * ``least_conn``：最少连接策略，同样考虑weight，优先考虑不同服务器已经拥有的连接数
  * ``least_time``:  最短时间策略，尽在Nginx Plus提供，倾向于分发到平均应答时间最短的服务器

  * ``hash``:  通用哈希策略，根据请求内容和运行时来哈希到不同服务器，当服务器上线或下线时会导致哈希过的请求重新分配，可以使用额外的参数``consistent``来减小重分配的负面影响
  * ``random``: 随机策略，会考虑weight
  * ``ip_hash``: 此方法仅对HTTP有效，使用客户端IP作为哈希输入，适用于session类型的服务器连接，会考虑weight

```nginx
# 例子
upstream backend {
	least_conn;
  server backend.example.com;
  server backend1.example.com;
}
```

#### Sticky Cookie

* 仅Nginx Plus提供，用于绑定上游服务器和下游客户端

```nginx
upstream backend {
  server backend1.example.com;
  server backend2.example.com;
  sticky cookie
    		 affinity # cookie的名字
    		 expires=1h # cookie的过期时间
    		 domain= .example.com # 为这个网站设置
    		 httponly
         secure # 只能通过https传输
         path=/; # 对于所有路径均有效
}
```

#### Sticky Learn

* 仅Nginx Plus提供，用于绑定上游服务器和下游客户端，使用现有的cookie
* 当应用创造了他们的session状态的cookie，Nginx Plus会在请求和应答中发现它们并跟踪

```nginx
upstream backend {
  server backend1.example.com:8080;
  server backend2.example.com:8081;
  
  sticky learn
    		 create=$upstream_cookie_cookiename # 在
    		 lookup=$cookie_cookiename
    		 zone=client_sessions:2m; # 在2MB的内存中存储session，约能存下16000个
}
```

#### Sticky Routing

* 仅Nginx Plus提供，对于持久化的session如何分发到上游服务器，需要细粒度的控制

```nginx
# 从cookie中抽取jsessionid
map $cookie_jsessionid $route_cookie {
  ~.+\.(?P<route>\w+)$ $route;
}
# 观察请求的URI去寻找一个叫做jsessionid的参数
map $request_uri $route_uri {
  ~jsessionid=.+\.(?P<route>\w+)$ $route;
}
upstream backend {
  server backend1.example.com route=a; # 若jsessionid的cookie被使用，导引到a路由
  server backend2.example.com route=b; # 若URI参数使用了，导引到b路由
  sticky route $route_cookie $route_uri; # 可以传递任意个参数（当前为两个）
}
```

#### 连接中断

* 仅Nginx Plus提供，关于如何优雅地下线尚存session的服务器
* 当设置了drain参数，Nginx Plus停止发送新的session给服务器，但允许已经建立好session的连接前往服务
* draining的过程就是安静地等待服务器的session自然过期，然后再将它移出

``curl -X POST -d '{"drain":true}' 'http://nginx.local/api/3/http/upstreams/backend/servers/0'``

#### 被动健康检查

```nginx
upstream backend {
  server backend1.example.com:1234 max_fails=3 fail_timeout=3s;
  server backend2.example.com:1234 max_fails=3 fail_timeout=3s;
}
```

* 定义了超时3s就算一次fail，fail三次服务器就被Nginx视为不可用
* 在stream 模块中或者http模块中皆可使用

#### 主动健康检查

```nginx
http {
  server {
    ...
    location / {
      proxy_pass http://backend;
      health_check interval=2s
      		fails=2
        	passes=5
        	uri=/
        	match=welcome;
    }
  }
  match welcome {
    status 200;
    header Content-Type = text/html;
    body ~ "Welcome to nginx!";
  }
}
```

* 通过每两秒向上游服务器的URI “/” 发送http请求，上游服务器必须能通过连续的五个检查请求才被视为健康，若连续不通过两次，则被视为不健康
* 上游服务器的应答必须与预设的match block中的内容相匹配，http 模块中的match block定义了status，header，body三个参数，而被动检查没有应答比对判断的功能

```nginx
# TCP的健康检查例子
stream {
  ...
  server {
  	listen 1234;
    proxy_pass stream_backend;
    health_check interval=10 passes=2 fails=3;
    health_check_timeout 5s;
  }
  ...
}
```

* stream servers 的 match block仅有两个参数，send和expect，对应发送和接收数据包的确切值或者正则表达式

#### 慢启动

* 在server命令中使用 ``slow_start``参数来在一段指定的时间内逐步增加连接到新进服务器的连接个数
* slow_start 参数的存在，允许应用服务器先连接好数据库，准备好缓存，再面对大压力，避免服务器被健康检查干掉又加回来反反复复

```nginx
upstream {
	zone backend 64k;
	server server1.example.com slow_start=20s;
	server server2.example.com slow_start=15s;
}
```

