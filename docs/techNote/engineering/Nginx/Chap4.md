# Chap4  大规模可扩展的内容缓存

#### 简介

* 内容缓存减少上游服务器的压力，避免重复的计算过程
* 可扩展的分布式缓存服务器在用户体验上有战略性意义，让缓存离用户近一点，这就是内容分发网络的模式（CDN）
* 当上游服务器失效时，仍能通过缓存服务用户请求

#### 缓存区域

* 我们需要定义缓存的位置和内容：在指定路径下创建一个名为CACHE的60MB大小的共享内存区域，文件目录层级为两级，3小时无访问即将对应缓存释放，目录最大大小为20G，参考[此处](https://www.cnblogs.com/crazymagic/p/11029487.html)
* ``proxy_cache_path``:仅在HTTP的context下有效
* ``proxy_cache``在HTTP，server，location的context下均有效

```nginx
proxy_cache_path /var/nginx/cache
								 keys_zone=CACHE:60m
								 levels=1:2
								 inactive=3h
								 max_size=20g;
proxy_cache CACHE;
```

#### 缓存的哈希键

* 可以根据不同需求指定缓存的键值，能判断是否命中

```nginx
# Nginx会根据host和URI和cookie来生成哈希键，相当于每个用户都有自己的缓存，类似OA系统的员工个人页面
# 默认值是 "$scheme$proxy_host$request_uri"，就是浏览器那串鬼东西
proxy_cache_key "$host$request_uri $cookie_user";
```

#### 缓存绕道

* 在某些情况下，请求不应该读取cache而是直接从后端的服务器上获取资源
* 或者直接设置``proxy_cache off;``来完全关闭cache

```nginx
# 当HTTP请求头中的cache_bypass字段被设置为任意非0值时，会绕过缓存
proxy_cache_bypass $http_cache_bypass;
```

#### 缓存表现

* 客户端缓存可以提高性能
* 下面的配置指定缓存CSS和JS文件，缓存时间为一年，会在应答头中加上Cache-Control字段，值为public，意思是允许Nginx到客户端中间的任何服务器缓存此内容，若值为private，则仅允许客户端缓存此内容

```nginx
location ~* \.(css|js)$ {
  expires 1y;
  add_header Cache-Control "public";
}
```

#### 缓存清除

* 我们需要能从缓存中清除一个对象，仅在Nginx Plus中提供此命令
* 若请求方法为PURGE，则指定对象的缓存会被清除，如 ``curl -XPURGE localhost/main.js``，可以通过与geoip相结合或者简单的认证机制结合，确保不是所有人都能随意清除缓存
* 可以使用通配符来指定清除特定目录下缓存，需要在``proxy_cache_path``配置中加入`purger=on`参数
* 一种常见办法是在静态文件名中加入文件内容的哈希信息，这样，改动过的文件会因为URI的变化而被认为是新的文件，

```nginx
map $request_method $purge_method {
  PURGE 1;
  default 0;
}
server {
  ...
  location / {
    ...
    proxy_cache_purge $purge_method; # 非0值均会清除缓存
  }
}
```

#### 缓存分片

* 通过切分文件来提高缓存效率
* 在视频传输方面，使用byte-range requests 传输数据流到浏览器中
* 若一个request要求的byte-range不在缓存中，Nginx会从origin请求整个文件，若使用了Cache Slice module，则只会从远端请求必要的部分，若Range requests比slice size都大，则会触发次级请求，当所有分段都缓存了，才会返回应答给客户，Cache slice module 适用于较大的不变的文件

```nginx
proxy_cache_path /tmp/mycache keys_zone=mycache:10m;
server {
  ...
  proxy_cache mycache;
  slice 1m; # 将应答切分为1MB大小的文件分片
  proxy_cache_key $host$uri$is_args$args$slice_range;
  proxy_set_header Range $slice_range;
  proxy_http_version 1.1; # HTTP 1.0 不支持 byte-range requests
  proxy_cache_valid 200 206 1h; # 206代表部分响应的意思
  
  location / {
    proxy_pass http://origin:80;
  }
}
```