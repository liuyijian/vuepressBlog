# Chap6 认证

#### 简介

* Nginx可以认证用户，避免未授权用户访问应用服务器
* 开源版本提供basic认证，和 authentication subrequests
* 商业版提供JWT认证和第三方OpenID授权集成

#### HTTP Basic Authentication

* 生成一个文件，内容如下

```bash
# comment
name1:password1 # 密码要求加密过或者哈希过
name2:password2:comment
name3:password3
```

* 使用命令行加密密码原文`openssl passwd MyPassword`，得到密文，写入文件 ；Apache的htpasswd命令使用apr1算法加密，也能被Nginx识别

```nginx
# 启用basic认证
location / {
  auth_basic "Private site"; # 用户到达页面时弹出的标题
  auth_basic_user_file conf.d/passwd; # 用户账户和密码文件的路径
}
```

* basic authentication 不能替代web应用的用户认证，网络传输请求头Authorization中，传的是Basic和username:password的base64编码，建议用https协议传输，会安全一点

#### Authentication Subrequests

* 第三方认证，使用http_auth_request_module 来向认证服务发送请求，核实身份后再处理下一步请求
* 要访问/private，就要先访问/auth，若返回200，才允许接着访问/private/，

```nginx
location /private/ {
  auth_request /auth;
  auth_request_set $auth_status $upstream_status; # 设置基于子请求结果的变量值
}

location = /auth {
  internal;
  proxy_pass http://auth-server;
  proxy_pass_request_body off;
  proxy_set_header Content-Length "";
  proxy_set_header X-Original-URI $request_uri;
}
```

#### Validating JWTs

* Nginx Plus提供JWT支持

```nginx
location /api/ {
  auth_jwt "api";
  auth_jwt_key_file conf/keys.json;
}
```

#### 使用已有的OpenID 连接单点登录 认证用户

* Nginx Plus 提供
* OpenID1.0协议是在OAuth2.0协议之上添加了身份的jwt认证

```nginx
location /private/ {
  auth_jwt "Google Oauth" token=$cookie_auth_token;
  auth_jwt_key_file /etc/nginx/google_certs.jwk;
}
```

* 需要从Google拉取JSON Web Key来验证OpenID Connect Tokens

```bash
# crontab 文件中的一行，每小时通过请求来刷新一次key
0 * * * * root wget https://www.googleapis.com/oauth2/v3/certs-O /etc/nginx/google_certs.jwk
```