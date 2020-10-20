# Chap3 流量管理

#### 简介

* Nginx作为一个流量管理器，能百分比分割用户请求，使用用户的地理信息，并控制流量的速度，连接数，限制带宽，这些特征能混合起来创造无数可能

#### A/B Testing

* 需要将用户分割到两个或多个的文件或者应用去完成在线测试
* 在电商网站的前端A/B测试，验证市场
* 此功能可以实现应用的灰度发布，减少错误的影响范围

```nginx
split_clients "${remote_addr}AAA" $variant {
  20.0% "backendv2";
  *			"backendv1";
}
location / {
  proxy_pass http://$variant
}
```

* 根据用户的IP地址来哈希，将20%的用户分到第二版的后端，剩下的用户分到第一版的后端
* 其中，backendv1和backendv2代表两个上游服务器集群，再按照上一篇讲的分别配置两个集群即可

#### GeoIP 模块和数据库

* 用于记录和校验用户连接的位置，关于数据库更新升级的问题，参见[这里](https://github.com/maxmind/geoipupdate)
* 此模块能提供以下变量
  *  ``geoip_country_code``：两个字母的国家编码，如CN，US
  *  ``geoip_country_code3``:三个字母的国家编码，如CHN，USA
  *  ``geoip_country_name`` ：国家全称，如'China', 'United States'
  * ``geoip_city_country_code``
  * ``geoip_city_country_code3``
  * ``geoip_city_country_name``
  * ``geoip_city_continent_code``
  * ``geoip_latitude``
  * ``geoip_longtitude``
  * ``geoip_postal_code``
  * ``geoip_region``
  * ``geoip_region_name``
  * ``geoip_area_code``:仅在美国有效，返回三位的电话区号

```bash
# 安装geoip模块 Debian/Ubuntu or RHEL/CentOS， 商业版的装 nginx-plus-module-geoip
apt-get install nginx-module-geoip  or   yum install nginx-module-geoip
```

```bash
# 安装geoip的国家和城市数据库
mkdir /etc/nginx/geoip
cd /etc/nginx/geoip
wget "http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz"
gunzip GeoIP.dat.gz
wget "http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz"
gunzip GeoLiteCity.dat.gz
```

```nginx
# 在Nginx配置文件中添加

load_module "/usr/lib61/nginx/modules/ngx_http_geoip_module.so";

http {
  geoip_country /etc/nginx/geoip/GeoIP.dat;
  geoip_city /etc/nginx/geoip/GeoLiteCity.dat;
  ...
}
```

#### 根据国家限流

* 这是根据geoip模块的一个字段进行映射限流，可以尝试使用其他字段，达到组合拳的效果

```nginx
load_module "/usr/lib61/nginx/modules/ngx_http_geoip_module.so";

http {
  map $geoip_country_code $country_access {
    "US" 0;
    "RU" 0; 
    default 1;
  }
}
```

```nginx
server {
  if($country_access = '1') {
    return 403; # 仅美国和俄罗斯可以访问
  }
}
```

#### 定位原始用户

```nginx
load_module "/usr/lib64/nginx/modules/ngx_http_geoip_module.so";
http {
        geoip_country /etc/nginx/geoip/GeoIP.dat;
        geoip_city /etc/nginx/geoip/GeoLiteCity.dat;
  			# 单IP定义或者使用CIDR方式定义可信地址，对于可信地址，nginx通过请求头中的 X-Forwarded-For 来寻找用户IP
        geoip_proxy 10.0.16.0/26;  
        geoip_proxy_recursive on;  # 递归找下去，直到第一个不可信的地址
... 
}
```

#### 限制连接

* 根据预定义的关键字，如用户IP，来限制连接的数量，一定程度上避免资源滥用
* limit_conn,limit_conn_status字段在http，server，location的context中有效
* limit_conn_zone字段只在http的context中有效

```nginx
http {
	limit_conn_zone $binary_remote_addr zone=limitbyaddr:10m; # 建造了10MB大小的共享内存
  limit_conn_status 429;  # 429代表请求过多，建议用这个取代默认值503，因为503代表服务不可用
  ...
  server {
  	...
    limit_conn limitbyaddr 40;
    ...
  }
}
```

#### 限制速度

* 根据预定义关键字，如用户IP，限制请求速度，避免DNS攻击
* 可定义字段``limit_req_log_level``,默认级别为error，可定义为info，notice，warn，error，记录超速访问的事件
* 关于burst 和 nodelay 的精确[解释](https://blog.csdn.net/hellow__world/article/details/78658041)
  * burst=5：burst爆发的意思，这个配置的意思是设置一个大小为5的缓冲区当有大量请求（爆发）过来时，超过了**访问频次**限制的**请求可以先放到这个缓冲区内等待，但是这个等待区里的位置只有5个**，超过的请求会直接报错返回
  * nodelay：
    - **如果设置，会在瞬时提供处理(burst + rate)个请求的能力**，请求超过（**burst + rate）**的时候就会直接返回503，永远**不存在请求需要等待的情况**。（这里的rate的单位是：r/s）
    - 如果没有设置，则所有请求会依次等待排队

```nginx
http {
	limit_req_zone $binary_remote_addr zone=limitbyaddr:10m rate=1r/s;
  limit_req_status 429;
  ...
  server {
  	...
		# burst默认为0，nodelay是可选参数
    limit_req zone=limitbyaddr burst=10 nodelay; 
    ...
  }
}
```

#### 限制带宽

* 对于你的资源，限制单个用户的下载带宽
* 以下代码：对于下载download文件夹下的资源，在下载10MB过后，将被限速为1MB/s

```nginx
location /download/ {
  limit_rate_after 10m; # 默认值为0，无限制
  limit_rate 1m; # 默认值为0，无限制
}
```

