# Chap1 基础

#### Debian/Ubuntu上安装Nginx

1、创建一个文件``/etc/apt/sources.list.d/nginx.list``，文件内容如下

```bash
# URL倒数第二个分段根据实际系统设置为 ubuntu 或 debian
# bionic代表Ubuntu18，可替换成别的Debian/Ubuntu发行版的名称,mainline代表主线版本，当前为1.17.6
deb http://nginx.org/packages/mainline/ubuntu/ bionic nginx 
deb-src http://nginx.org/packages/mainline/ubuntu/ bionic nginx
```

2、用shell执行命令

```bash
wget http://nginx.org/keys/nginx_signing.key
apt-key add nginx_signing.key
apt-get update
apt-get install -y nginx 
/etc/init.d/nginx start # 启动Nginx
```

#### RedHat/CentOS上安装Nginx

1、创建一个文件``/etc/yum.repos.d/nginx.repo``，文件内容如下

```bash
# 具体替换规则参考Ubuntu安装
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
```

2、用shell执行命令

```bash
yum -y install nginx
systemctl enable nginx
systemctl start nginx
firewall-cmd --permanent --zone=public --add-port=80/tcp
firewall-cmd --reload
```

#### 安装信息和基本用法

* 查看版本 ``nginx -v``
* 查看运行状态 ``ps -ef | grep nginx``
* 检查Nginx是否返回正确(返回一段包含nginx的html代码) ``curl localhost``

* Nginx的配置文件目录 ``/etc/nginx``

* Nginx配置读取的进入点文件 ``/etc/nginx/nginx.conf``
  * 设置全局环境：如进程数，调优，日志，动态加载模块
  * 链接到其余配置文件等等
* Nginx默认的http server的配置文件目录 ``/etc/nginx/conf.d``
  * 在``nginx.conf``中有一句话叫做``include /etc/nginx/conf.d/*.conf;``
  * 加配置可以在``conf.d``目录下分文件加入，以保持配置的简洁性

* Nginx默认的日志记录目录 ``/var/log/nginx``
  * ``access.log`` : 包含Nginx处理的每个请求
  * ``error.log``：包含错误信息，若debug模块被启用，还会包括调试信息

* 发送信号给Nginx主进程
  * ``nginx -s stop``： 马上停止
  * ``nginx -s quit``： 处理完当前请求后停止
  * ``nginx -s reload``:  重新加载配置文件, 但不会中断nginx服务
  * ``nginx -s reopen``： 重新打开日志文件

* 检查配置文件语法是否正确
  * ``nginx -t`` : 简单检查正确错误
  * ``nginx -T``： 将很多正确配置的示例打印出来

#### 静态文件服务

* [nginx的default server规则](https://segmentfault.com/a/1190000015681272)

* [nginx的location详解](https://www.cnblogs.com/xiaoliangup/p/9175932.html)

