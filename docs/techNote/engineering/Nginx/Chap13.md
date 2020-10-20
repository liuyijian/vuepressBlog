# Chap13 进阶活动监控

#### 简介

* Nginx Plus 提供监控面板，能监控请求，上游服务器，缓存，健康等等，也提供获取信息的API

#### Nginx 开源 Stub Status

```nginx
location /stub_status {
  stub_status;
  allow 127.0.0.1;
  deny all;
}
```

```bash
$ curl localhost/stub_status
Active connections: 1
server accepts handled requests
1 1 1
Reading: 0 Writing: 1 Waiting: 0
```

#### Nginx Plus 监控面板

```nginx
server {
  # ...
  location /api {
    api [write=on];
  }
  location = /dashboard.html {
    root /usr/share/nginx/html;
  }
}
```

![image-20191205150738021](https://tva1.sinaimg.cn/large/007S8ZIlly1gjuvsnh2u9j30x40hqafx.jpg)

#### Nginx Plus API 收集信息

```bash
$ curl "demo.nginx.com/api/3" | json_pp  # 显示底下的api
{
	"nginx",
	"processes",
	"connections",
	"ssl",
	"slabs",
	"http",
	"stream"
}

$ curl "demo.nginx.com/api/3/nginx" | json_pp
{
	"version": "1.15.2",
	"ppid": 79909,
	"build": "nginx-plus-r16",
	"pid": 77242,
	"address": "206.251.255.64",
	"timestamp": "2018-09-29T23:12:20.525Z",
	"load_timestamp": "2018-09-29T10:00:00.404Z",
	"generation": 2
}

$ curl "demo.nginx.com/api/3/connections" | json_pp
{
	"active": 3,
	"idle": 34,
	"dropped": 0,
	"accepted": 33614951
}

$ curl "demo.nginx.com/api/3/http/requests" | json_pp
{
	"total": 53107833,
	"current": 2
}
# 不一一列举
...
```

