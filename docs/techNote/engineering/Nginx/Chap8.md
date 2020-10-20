# Chap8 HTTP/2

#### 简介

* HTTP/2 是一个HTTP协议，主要工作在于传输层
  * 使用单个TCP连接来多路传输请求和响应	
  * HTTP header中使用了compression字段，通过压缩提效
  * 实现了处理请求的优先级
  * 允许服务器推送

#### 基础配置

* 某些客户端只支持加密的HTTP/2 协议连接，使用Chrome调试工具来判断一个网站是否开启HTTP/2传输

```nginx
server {
  listen 443 ssl http2 default_server;
  ssl_certificate server.crt;
  ssl_certificate_key server.key;
}
```

#### gRPC

* 在Nginx中，gRPC和restful能共存

```nginx
server {
  listen 80 http2;
  location / {
    grpc_pass grpc://backend.local:50051;
  }
}
```

```nginx
server {
	listen 443 ssl http2 default_server;
  ssl_certificate server.crt;
  ssl_certificate_key server.key;
  location / {
    grpc_pass grpcs://backend.local:50051; # nginx到gRPC服务的通信是加密的HTTP/2
  }
}
```

```nginx
upstream grpcservers {
	server backend1.local:50051; # 分流
  server backend2.local:50051;
}
server {
  listen 443 ssl http2 default_server;
  ssl_certificate server.crt;
  ssl_certificate_key server.key;
  location / {
    grpc_pass grpc://grpcservers; # 与http唯一不同的地方在于事grpc_pass
  }
}
```

#### HTTP/2 Server Push

```nginx
server {
  listen 443 ssl http2 default_server;
  ssl_certificate server.crt;
  ssl_certificate_key server.key;
  root /usr/share/nginx/html;
  
  location = /demo.html {
    http2_push /style.css;
    http2_push /image1.jpg;
  }
}
```

* NGINX can also automatically push resources to clients if proxied applications include an HTTP response header named Link. This header is able to instruct NGINX to preload the resources specified. To enable this feature, add http2_push_preload on; to the NGINX configuration(一段我不懂的鸟语)

