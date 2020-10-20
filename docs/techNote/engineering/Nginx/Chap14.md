# Chap14  调试、错误定位、请求追踪

#### 简介

* Nginx 允许将访问日志切分到不同格式的不同文件中，可以将默认的错误级别记录转变成低级别的记录，使开发者或者运维人员更清楚发生的情况，也便于市场分析
* Nginx允许追踪请求的身份

#### 配置访问日志

```nginx
http {
  # 仅在 http 的 context 下有这个log_format的配置
  log_format geoproxy
    				 '[$time_local] $remote_addr '
    				 '$realip_remote_addr $remote_user '
    				 '$request_method $server_protocol '
    				 '$scheme $server_name $uri $status '
    				 '$request_time $body_bytes_sent '
    				 '$geoip_city_country_code3 $geoip_region '
    				 '"$geoip_city" $http_x_forwarded_for '
    				 '$upstream_status $upstream_response_time '
    				 '"$http_referer" "$http_user_agent"';
  ...
}
```

```bash
# 一条日志样式记录
[25/Nov/2016:16:20:42 +0000] 10.0.1.16 192.168.0.122 Derek
    GET HTTP/1.1 http www.example.com / 200 0.001 370 USA MI
    "Ann Arbor" - 200 0.001 "-" "curl/7.47.0"
```

```nginx
server {
  # server级别的日志路径和日志格式配置
  access_log /var/log/nginx/access.log geoproxy;
}
```

#### 配置错误日志

* 若出现错误，应该首先查看错误日志，能快速定位，错误日志的格式不能自己定义

```nginx
# log level 从低至高级别如下：debug, info, notice, warn, error, crit, alert, emerg
error_log /var/log/nginx/error.log warn;
```

#### 收集到系统级别日志

* 我们需要将Nginx的日志重定向到一个系统日志监听器，将日志集中到一个中心化服务
* 一个典型的日志收集技术栈是ElasticSearch+Logstash+Kibanna

```nginx
error_log syslog:server=10.0.1.42 debug;
access_log syslog:server=10.0.1.42, tag=nginx, severity=info, geoproxy;
```

#### 请求追踪

```nginx
logformat trace '$remote_addr - $remote_user [$time_local] '
								'"$request" $status $body_bytes_sent '
								'"$http_referer" "$http_user_agent" '
								'"$http_x_forwarded_for" $request_id';
upstream backend {
  server 10.0.0.42;
}
server {
  listen 80;
  # $request_id提供一个随机生成的32位十六进制的唯一编码，用于识别用户身份，日志格式中带上这个变量，便于搜索
  # 在应用服务器的日志中，也从header中记录下这个id，实现端到端的日志协同
  add_header X-Request-ID $request_id; # nginx发回给client的时候带上这个header
  location / {
    proxy_pass http://backend;
    proxy_set_header X-Request-ID $request_id; # 通过header发送到上游服务器
    access_log /var/lig/nginx/access_trace.log trace;
  }
}
```