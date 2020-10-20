# Chap7 安全控制

#### 简介

* 如何使用Nginx和Nginx Plus来确保web应用的安全，使用方法的堆叠来增加安全性
* 本章不会讲ModSecurity 3.0 NGINX module，此module有防火墙的作用，[参考](https://www.nginx.com/resources/library/modsecurity-3-nginx-quick-start-guide/)

#### 根据IP限制进入

```nginx
location /admin/ {
  deny 10.0.0.1;
  allow 10.0.0.0/20; # allow和deny命令在HTTP，server，location 的 context下均有效
  allow 2001:0db8::/32 # 这是IPV6的地址
  deny all; # 返回403
}
```

#### 允许跨域资源共享

```nginx
map $request_method $cors_method {
  OPTIONS 11;
  GET 1;
  POST 1;
  default 0;
}
server {
  ...
  location / {
    if($cors_method ~ '1'){
      add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS';
      add_header 'Access-Control-Allow-Origin' '*.example.com';
      add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
    }  
    if($cors_method = '11') {
      add_header 'Access-Control-Max-Age' 1728000;
      add_header 'Content-Type' 'text/plain; charset=UTF-8';
      add_header 'Content-Length' 0;
      return 204;
    }
  }
}
```

#### 客户端加密

```nginx
http {
  server {
    listen 8433 ssl;
    ssl_protocols TLSv1.2 TLSv1.3; # 只接受这两个版本的SSL协议,有高则用高
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_certificate /etc/nginx/ssl/example.pem;
    ssl_certificate_key /etc/nginx/ssl/example.key;
    ssl_certificate /etc/nginx/ssl/example.ecdsa.crt;
    ssl_certificate_key /etc/nginx/ssl/example.ecdsa.key;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
  }
}
```

* 在实际测试中，发现ECC的证书比相同强度的RSA证书来得更快，能同时接受更多的SSL/TLS连接，更快的握手
* nginx允许指定很多个证书和keys，然后选择最优的去为浏览器服务，这允许你用好新技术的优势，然后还能服务老用户

#### 上传加密

* 在Nginx和上游服务器的连接加密，需要上游服务器也有对应的设定，仅当上游服务器不在安全区内才有必要
* Nginx不核实上游证书，并接受所有TLS版本的连接，但可以通过附属的命令 ``proxy_ssl_certificate`` 和 ``proxy_ssl_certificate_key``能帮助你锁定上游的加密方式增强安全性，也可以通过指定``proxy_ssl_crl``来指定已经无效的证书

```nginx
location / {
  proxy_pass https://upstream.example.com;
  proxy_ssl_verify on;
  proxy_ssl_verify_depth 2;
  proxy_ssl_protocols TLSv1.2; # 
}
```

#### location block级别加密

* [参考1](https://www.jianshu.com/p/11d70e37de6b)
* [参考2](http://www.nginx.cn/doc/optional/securelink.html)

```nginx
location /resources { # 安全连接只能用于非根目录
  secure_link_secret mySecret;  # 只能用静态字符串，不能用变量
  if ($secure_link = ""){ return 403;} # 校验失败，secure_link变量为空，返回403
  rewrite ^ /secured/$secure_link; # 加了一层保护，就是 /resources/1 = /secured/djf98dfs4g7/1
}
location /secured/ {
  internal; # 仅限内部调用
  root /var/www;
}
```

#### 根据密钥生成安全连接

```bash
# 命令行openssl生成
$ echo -n 'index.htmlmySecret' | openssl md5 -hex
(stdin)= a53bee08a4bf0bbea978ddf736363a12
```

```python
# python库生成, 加密对象是 资源名字+秘钥
import hashlib
hashlib.md5.(b'index.htmlmySecret').hexdigest()
'a53bee08a4bf0bbea978ddf736363a12'
```

* 若我们通过`/resources` location 访问 ``/var/www/secured/index.html``,则全URL为 ``www.example.com/resources/a53bee08a4bf0bbea978ddf736363a12/index.html``

#### 指定过期时间的安全连接

```nginx
location /resources {
  root /var/www;
  # 第一次参数是存储md5哈希值的变量，第二个参数是存储连接过期的Unix时间
  secure_link $arg_md5,$arg_expires; 
  # 指明用于构建md5哈希值的字符串组成，使用客户标示的字段能更安全，如客户IP
  secure_link_md5 "$secre_link_expires$uri$remote_addr mySecret";
  if($secure_link = "") {return 403;}
  # 0代表过期
  if($secure_link = "0") {return 410;}
}
```

* 生成过期时间的Unix时间戳 

```bash
$ date -d "2020-12-31 00:00" +%s --utc
1609372800
```

* 生成md5值（有点不同）

```bash
$ echo -n '1609372800/resources/index.html127.0.0.1mySecret' \
	| openssl md5 -binary \
	| openssl base64 \
	| tr +/ -_ \
	| tr -d =
TG6ck3OpAttQ1d7jW3JOcw
```

* 故访问的地址应该为 ``/resources/index.html?md5=TG6ck3OpAttQ1d7jW3JOcw&expires=1609372800``

#### HTTPS 重定向

```nginx
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  server_name _;
  return 301 https://$host$request_uri;
}
```

#### 让浏览器发送https请求

* 浏览器访问本站前，先将请求改成https，这样才是真正的安全

```nginx
add_header Strict-Transport_Security max-age=31536000;
```

#### 安全组合

* 多种安全措施聚在一起，变得更安全

```nginx
location / {
  satisfy any; # 满足任一安全措施，若为all，则为全部
  
  allow 192.168.1.0/24;
  deny all;
  
  auth_basic "closed site";
  auth_basic_user_file conf/htpasswd;
}
```

#### DDOS防护

* 使用Nginx Plus来完成集群限速和自动化黑名单来减轻分布式拒绝服务攻击的影响

```nginx
limit_req_zone $remote_addr zone=per_ip:1M rate=100r/s sync;
limit_req_status 429;
keyval_zone zone=sinbin:1M timeout=600 sync; # 10分钟后将客户从sinbin黑名单中移除
keyval $remote_addr $in_sinbin zone=sinbin;

server {
  listen 80;
  location / {
    if($in_sinbin) {
      set $limit_rate 50;
    }
    limit_req zone=per_ip;
    error_page 429 = @send_to_sinbin;
    proxy_pass http://my_backend;
  }
  location @send_to_sinbin {
    rewrite ^ /api/3/http/keyvals/sinbin break; # 使用Nginx Plus API将此地址写入黑名单
    proxy_method POST;
    proxy_set_body '{"$remote_addr": "1"}';
    proxy_pass http://127.0.0.1:80;
  }
  location /api/ {
    api write=on;
  }
}
```

