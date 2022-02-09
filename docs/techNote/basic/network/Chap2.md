# Chap2 应用层

## 2.1 应用层协议原理

### 2.1.1 网络应用程序体系结构

* 网络体系结构是固定的，为应用程序提供了特定的服务集合，应用程序体系结构由应用程序研发者设计，规定了如何在各种端系统上组织该应用程序，主流的体系结构包括客户-服务器（Client-Server）结构和对等（P2P）体系结构
  * P2P结构具有自扩展性，成本较低，但它也面临三个主要挑战：ISP的非对称性（下载带宽>上传带宽）对P2P不友好，高度分布和开放特性带来应用安全问题，激励用户自愿向应用提供带宽、存储和计算资源的机制有待设计和加强

### 2.1.2 进程通信

* 进程通过套接字（socket）的软件接口向网络收发报文；应用程序开发者可以控制套接字在应用层端的一切，但对运输层的控制仅限于选择运输层协议和指定几个运输层参数（最大缓存、最大报文段长度）
* socket通过IP地址和端口号寻到对应的进程

![image-20210423131934042](https://tva1.sinaimg.cn/large/008i3skNly1gq0kaf4402j313q0j6ac0.jpg)

### 2.1.3 可供应用程序使用的运输服务

* 应用程序服务要求可以根据以下几点分类：可靠数据传输、吞吐量、定时和安全性
  * 可靠数据传输：邮件、文件等数据必须保证可靠性，而音视频应用则允许出现少量数据丢失
  * 吞吐量：多媒体应用是带宽敏感的应用，具有特定吞吐量的要求，而文件传输、Web传送属于弹性应用，能根据情况或多或少利用可供使用的吞吐量
  * 定时：运输层协议能提供定时保证，如电话会议，多方游戏的应用具有实时交互的性质
  * 安全性：运输协议能为应用程序提供多种安全性服务，如加密由发送进程传输的所有数据，还有数据完整性和端点鉴别

### 2.1.4 因特网提供的运输服务

* 因特网为应用程序提供两个运输层协议：TCP和UDP
* TCP服务模型包括面向连接服务和可靠数据传输服务
  * 面向连接的服务：通过握手，在两个进程的套接字之间建立TCP连接，双方进程可以在此连接上同时进行报文收发（全双工），在报文发送结束后，必须拆除该连接
  * 可靠的数据传送服务：通信进程能依靠TCP，无差错，按适当顺序交付所有发送的数据
  * TLS，传输层安全协议，实现了对TCP的加强，提供了进程到进程的安全性服务，TLS的套接字负责加密明文，传输，解密密文，[参考](https://zhuanlan.zhihu.com/p/158714109)
* UDP
  * 提供最小服务，无连接、没有可靠性保证，没有拥塞控制机制，报文可能乱序到达

### 2.1.5 应用层协议

* 应用层协议定义了交换的报文类型，各种报文类型的语法，字段的语义，一个进程何时以及如何发送报文，对报文进行响应的规则
* web应用的应用层协议是HTTP，文件传输的应用层协议是FTP，因特网目录服务的应用层协议是DNS

## 2.2 Web和HTTP

### 2.2.1 HTTP概况

* Web的应用层协议是超文本传输协议（HyperText Transfer Protocol），客户程序和服务器程序运行在不同的端系统中，通过交换HTTP报文进行会话
* Web浏览器实现了HTTP的客户端，Web服务器实现了HTTP的服务器端
* HTTP是一个无状态协议，并不保存关于客户的任何信息，并使用TCP作为它的支撑运输协议

### 2.2.2 非持续连接和持续连接

* 每个请求/响应对是经过一个单独的TCP连接发送（非持续连接）还是所有的请求/响应经相同的TCP连接发送（持续连接）呢？
* HTTP 1.1 开始引入持续连接的实践
* 往返时间（Round-Trip Time，RTT）是指一个短分组从客户到服务器然后再返回客户所花费的时间，下面展示的是TCP连接建立的“三次握手”，客户向服务器发送一个小TCP报文段，服务器用小TCP报文段作出确认和响应，最后，客户向服务器返回确认，第三次确认时就会附带发送HTTP请求报文，所以你总响应时间等于两个RTT加上服务器传输HTML文件的时间

![image-20210425190037921](https://tva1.sinaimg.cn/large/008i3skNly1gq0kagm8e7j30xs0r8wfw.jpg)

* 非持续连接有一些缺点，客户和服务器需要为每个连接分配TCP缓冲区和保持TCP变量，为Web服务器带来严重负担，且每个对象需要经受两倍RTT的交付时延；持续连接则可以使用一条TCP请求多个对象，一定时间间隔没有使用后就会由HTTP服务器自动关闭连接

### 2.2.3 HTTP报文格式

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gpw7wwrpf8j30j4062my1.jpg" alt="image-20210425193251068" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/008i3skNly1gpw9adgo8gj30re0am75z.jpg" alt="image-20210425202021951" style="width:50%;" />

* 上面是一个典型的HTTP请求报文，由ascii文本书写，每行由一个回车和换行符结束``\r\n``，报文第一行叫请求行（request line），后继的行叫做首部行（header line），请求行有3个字段：方法字段、URL字段、HTTP版本字段

* 方法字段包括GET、POST、HEAD、PUT、DELETE

* Host字段指明对象所在的主机，Connection字段close值要求服务器发送完被请求的对象后关闭这条连接

* 下面是请求报文的通用格式，使用GET方法时实体体为空，使用POST方法时才使用实体体（常用于表单提交），服务器收到HEAD请求时，将会用一个HTTP报文进行响应，但不返回请求对象，常用于调试追踪，PUT方法常用于上传对象到服务器，DELETE方法常用于删除服务器上的对象

* <img src="https://tva1.sinaimg.cn/large/008i3skNly1gpw8fujzduj30wg0j8dhx.jpg" alt="image-20210425195103266"  style="width:50%"><img src="https://tva1.sinaimg.cn/large/008i3skNly1gpw9mfybhtj30wc0j876d.jpg" alt="image-20210425203157703" style="width:50%;" />

* 响应报文，包括三部分

  * 状态行（协议版本、状态码、相应状态信息）

    * 状态码（补全！）

      ![image-20210425210437131](https://tva1.sinaimg.cn/large/008i3skNly1gq0kagzvz0j31220pwgsm.jpg)

  * 首部行

    * Date指示服务器生成此报文的时间
    * Last-Modified指示对象最后修改的日期和时间

  * 实体体

### 2.2.4 用户与服务器的交互：cookie

* RFC6265中定义，HTTP使用cookie以允许站点对用户进行跟踪，cookie会出现在HTTP请求/响应报文的首部行，用户端系统保留有cookie文件由用户浏览器进行管理，web站点也有一个后端数据库保存cookie，下图是一个流程

  ![image-20210425204735938](https://tva1.sinaimg.cn/large/008i3skNly1gq0kajb6icj30vf0u0tb9.jpg)

### 2.2.5 Web缓存

* Web缓存器也叫代理服务器（proxy server），有自己的存储空间，保存最近请求过的对象的副本

  <img src="https://tva1.sinaimg.cn/large/008i3skNly1gpwa9enkchj30t60hotef.jpg" alt="image-20210425205402561" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/008i3skNly1gpwaf2ki01j30n60tywkx.jpg" alt="image-20210425205923469" style="width:50%;" />

* Web缓存器能减少响应时间，减少因特网上的Web流量，改善所有应用的性能

* CDN（内容分发网络）公司在因特网上安装许多地理上分散的缓存器，使大量流量实现本地化

* 放在缓存器的对象副本可能是旧的，可以通过条件GET方法（GET请求报文中包含一个“If-Modified-Since:”首部行），仅当自指定日期后对象被修改过，才发送过该对象，若无修改，返回状态码304 Not Modified

### 2.2.6 HTTP/2

* HTTP/2 标准发布于2015年，是自1997年发布的HTTP/1.1以来的首个新版本
* 截至2020，全球访问量前千万的网站中，40%实现了对HTTP/2的支持；主流浏览器也实现了对HTTP/2的支持
* HTTP/2的初衷是通过在单条TCP连接中支持多路复用（多个请求合并），以减少响应延迟
* HTTP/2增加了请求优先级的设定，提供了服务器推送的功能
  * 优先级通过在每条信息上附带1～256的权重实现，并可指明此信息依赖另一条具体信息
  * 服务器推送是指允许服务器对于单个客户请求，返回多个应答（比如一个页面有多个资源，服务器直接推过去，而非客户端发起二次请求再推，节约一个RTT）
* HTTP/2 改变了数据的格式定义和传输方式，但没有改变methods，status codes，URLs，header fields
* 通过单条TCP连接传输页面的所有对象会带来队头阻塞问题（Head-Of-Line blocking），某个资源若过大会堵住后面小资源的传送。HTTP/1.1通过使用多个并行的TCP连接解决这个问题，开多个并行TCP连接能吃到更多的带宽，减少响应时间。而HTTP/2的解决方式是将对象的请求切分为若干个小帧去并行化请求，帧请求会在对象列表上轮询，确保小对象尽早被接收，而帧会使用二进制编码的方式压缩，减少了传输大小，也降低了出错率
* QUIC是基于UDP的一个新的应用层上实现的“传输”协议，包括消息多路复用，单连接流量控制，低延迟连接建立等特性，HTTP/3标准将建立在QUIC上，

## 2.3 电子邮件

* 电子邮件具有以下特征：正文+附件，超链接，HTML格式文本，嵌入图片等等，是一种廉价的异步通信方式
* 因特网邮件系统中有三个组成元素：用户代理，邮件服务器，SMTP协议
  * 用户代理：允许用户阅读，回复，转发，保存，编写邮件，常见实现包括MicroSoft Outlook，Apple Mail， Gmail
  * 邮件服务器：每个用户在邮件服务器中有一个自己的邮箱，邮箱里保存着发给它的邮件
  * SMTP：使用TCP协议在用户A/B的邮件服务器中构建可靠连接，SMTP协议里也有client和server的区分（SMTP建立的直接连接，使得邮件不会被中间服务器存留）SMTP是一个推送协议，用于发邮件
  * IMAP：收邮件，用于下图步骤6

![image-20210425214819829](https://tva1.sinaimg.cn/large/008i3skNly1gq0kaiwf9ij313g0e0gnb.jpg)

* 若Bob's mail server down掉了，则邮件会停在Alice‘s mail server 中等待重新发送
* SMTP协议会连接到服务器的25端口（默认），下面演示SMTP客户端（C）和服务器（S）的交互过程，就是TCP中发送的数据，可以使用``telnet serverName 25`` 模拟下面的操作

```bash
S: 220 hamburger.edu
C: HELO crepes.fr
S: 250 Hello crepes.fr, pleased to meet you
C: MAIL FROM: <alice@crepes.fr>
S: 250 alice@crepes.fr ... Sender ok
C: RCPT TO: <bob@hamburger.edu>
S: 250 bob@hamburger.edu ... Recipient ok
C: DATA
S: 354 Enter mail, end with "." on a line by itself
C: Do you like ketchup?
C: How about pickles?
C: .
S: 250 Message accepted for delivery
C: QUIT
S: 221 hamburger.edu closing connection
```

## 2.4 DNS-因特网目录服务

* 主机的标识之一是域名，但域名未能提供位置信息，且域名长短不一，难以被路由器处理，所以通过IP地址标识主机

### 2.4.1 DNS工作机理

* DNS：domain name system，域名系统，用于将域名映射成IP地址
* DNS包括以下组件
  * 通过DNS服务器组建出的分布式数据库
    * DNS服务器通常是Unix系统上运行Berkley Internet Name Domain（BIND）软件
    * DNS服务器有3种类型
      * 根DNS服务器：有13个不同的根DNS服务器，但有多于1000个副本分布在世界各地，提供顶级域DNS服务器的IP地址
      * 顶级域DNS服务器：负责顶级域名，国家域名的维护（如com, org, net, edu, gov等等），提供权威DNS服务器的IP地址
      * 权威DNS服务器：维护具体网站的DNS记录
  * 允许用户访问分布式数据库的应用层协议
    * DNS协议在UDP上运行，默认端口为53
* 当用户访问一个网址时，先会从就近的DNS服务器中拿到对应的IP，再建立TCP连接，若一个网址对应多个服务器，则DNS服务器会轮询返回其中的某个IP
* 下面是一个请求流程，从请求主机到本地DNS服务器的查询是递归的，其他的查询是迭代的

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gpwygqyy0mj30tc0y80zf.jpg" alt="image-20210426105129158" style="zoom:50%;" />

* DNS缓存技术可以改善时延并减少因特网上的DNS报文流量，本地DNS服务器可以直接返回而非查询其他DNS服务器，但缓存期限一般设置为两天

### 2.4.2 DNS记录与报文

* DNS服务器存储了资源记录，提供了主机名到IP地址的映射，每个DNS回答报文包含一条或多条资源记录
* 资源记录是一个四元组（Name，Value，Type，TTL）
  * TTL：记录的生存时间，决定何时从缓存中删除此记录
  * Type：
    * A：Name是主机名，Value是IP地址
    * NS：Name是个域，Value是知道如何获取该域中主机IP地址的权威DNS服务器的主机名
    * CNAME：Name是主机名，Value是别名为Name的规范主机名
    * MX：Name是主机名，Value是别名为Name的邮件服务器的规范主机名
* DNS报文：查询报文和回答报文具有相同的格式
  * 首部区域（前12字节）
    * Identification：2字节的标识符，会被复制到对查询的回答报文中，以便客户匹配请求和应答
    * Flags：
      * 1比特的报文类型标志位，查询是0，回答是1
      * 1比特的权威标志位：若该服务器是权威DNS服务器，则该位为1
      * 1比特的希望递归标志位：若希望DNS服务器进行递归查询，则该位为1
    * Numbers
      * 指出首部后的4类数据区域出现的数量
  * 问题区域：包含名字字段（正在被查询的主机名字），类型字段（如主机地址是与一个名字关联还是与某个邮件服务器关联）
  * 回答区域：若干条四元组形式的资源记录
  * 权威区域：包含其他权威服务器的记录
  * 附加区域：包含其他有帮助的记录

![image-20210426111629885](https://tva1.sinaimg.cn/large/008i3skNly1gq0kahx0rrj30rq0i0gni.jpg)

* DNS查询：使用nslookup命令,如 ``nslookup -qt=[type] [domain] [dns-server]``
  * mac默认的dns-server在系统偏好设置网络-高级-DNS那一栏可以找到

* 往DNS数据库中插入记录
  * 当向注册登记机构注册域名时，需要提供基本和辅助权威DNS服务器的名字和IP地址，插入记录如下
  * ``(lyj.com, dns1.lyj.com, NS) (dns1.lyj.com, 212.212.212.1, A)``
  * 还要确保Web服务器的A资源记录在自己的权威DNS服务器下，插入记录
  * ``(www.lyj.com, 212.212.212.74, A)``

* DNS的脆弱性
  * DDOS带宽洪泛攻击：往DNS服务器发送大量分组，使得多数合法DNS请求无法得到回答，攻击根服务器效果不大，因为本地DNS服务器已经有缓存，
  * 中间人攻击：截获DNS请求包并返回伪造的数据包，此法很难，因为它需要截获分组并扼制服务器
* DNSSEC，一个安全版的DNS，被用于解决潜在的安全问题 [参考](https://imlonghao.com/41.html)
  * 原理：权威服务器使用私钥对资源记录进行签名，递归服务器利用权威服务器的公钥对应答报文进行验证
  * 实现方式：增加四种资源记录类型
    * RPSIG：存储资源记录集合的数字签名
    * DNSKEY：存储公开密钥
    * DS：存储DNSKEY的散列值，用于验证DNSKEY的真实性，从而建立信任链
    * NSEC：响应不存在的资源记录

## 2.5 P2P 文件传输

### 2.5.1 P2P 架构的可扩展性

* 考虑将一个大文件从单一服务器分发到多个主机上，若全都由server发，对于server带宽要求很高；在P2P文件分发中，每个对等结点（peer）可以将文件任意部分二次分发给其他对等结点

* 2020年，最流行的P2P 文件分发协议是BitTorrent

  ![image-20210427174654782](https://tva1.sinaimg.cn/large/008i3skNly1gq0kahgfvsj30rq0omq4a.jpg)

* 假设：所有瓶颈都在接入网，网络核心带宽无限，文件大小为$F$ bits，$u_n$ 为上传速率，$d_n$ 为下载速率

* 分发时间：定义为$N$个对等结点全部获取到文件所花费的时间

| Client-Server 架构                                           | P2P 架构                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| $D_{CS} \ge \max\{\frac{NF}{u_s}, \frac{F}{\min\{d_1, d_2, \dots, d_N\}}\}$ | $D_{P2P} = \max \{\frac{F}{u_s}, \frac{F}{\min \{d_1, d_2, \dots, d_N\}}, \frac{NF}{u_s + \sum\limits_{i=1}^{N}u_i}\}$ |

* 假设 $F/u = 1$ hour, $u_s=10u$，$d_{min} \ge u_s$，随着$N$增大，分发时间如下图

![image-20210427180121646](https://tva1.sinaimg.cn/large/008i3skNly1gq0kaepmi9j30si0is75b.jpg)

### 2.5.2 BitTorrent协议

* BitTorrent是2011年提出的文件分发协议，参与文件分发的节点组成一个torrent
* torrent中的每个节点从另一节点中下载相同大小的文件块（典型值：256KB）
* 新加入torrent的节点会随时间堆积，慢慢下载完所有的块，此时它可以离开torrent，或为其他节点提供分发服务，在torrent中的节点可能下载完了一部分块后断线重连
* torrent中有一个tracker节点，用于登记torrent成员地址；成员加入时需要向其注册，获取torrent中一部分成员的IP地址用于下载文件（如下图，只有3个），成员还需要周期性向tracker汇报存活

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gpygrsl8iej30xq0qothm.jpg" alt="image-20210427181023441" style="zoom:50%;" />

* 新成员

  * 下载哪个块？遵从rarest first原则，在它的邻居节点已有块的记录中，哪个块最少，就先下载它

  * 向谁请求下载？从谁那里下载块，就从谁那里下载，会维护一个网速列表，并周期性pick其他节点来测速，踢掉网速变垃圾的那些连接

* BitTorrent协议还有一些额外机制，如最小chunks，管道化，随机选择，终结模式，反冷落机制等等

## 2.6 视频流和内容分发网络

### 2.6.1 互联网视频

* 衡量视频流的一个重要方法是端到端吞吐量，可以根据网速差异发送不同的压缩视频版本

### 2.6.2 HTTP Streaming 和 DASH

* HTTP Streaming中，视频文件会正常存储在HTTP服务器上，客户通过建立TCP连接并往特定URL发送GET请求，在客户端，会维护一个缓存，视频应用从客户端缓存中定期获取帧并放映；但此法没有考虑到不同客户的带宽差异，这催生了一种新的基于HTTP的流传输技术，叫做Dynamic Adaptive Streaming over HTTP（DASH）
* DASH中，视频会编码成不同码率的版本（不同清晰度），用户会周期性地根据当前网速和缓存量请求几秒的不同版本的视频

### 2.6.3 内容分发网络（CDN）

* 传统大数据中心存储视频并分发具有以下三个缺点
  * 环球传输可能的端到端延迟取决于瓶颈链路，故延迟较高
  * 流行视频可能会在同一条链路上传输多遍，带来带宽浪费和高昂的ISP服务费用
  * 数据中心的单点故障影响较大
* 为了应对视频数据分发的挑战，采用内容分发网络技术。一个内容分发网络包含不同地域分布的服务器，服务器上存着资源副本（视频、文档、图像、音频等等），内容分发网络可以是私有的，也可以是第三方的
* CDN的设计遵循以下思想之一
  * Enter Deep：尽可能靠近接入网，以降低延迟并提高吞吐量，但高度分布式的设计使得维护和管理变成难题
  * Bring Home：将服务器集群放在IXPs上
* CDN的同步
  * 一般不会进行全量同步（考虑低频点击资源），采用边缘cache+按需pull模式+踢除最低频资源
  * 也可以使用空闲时段push的操作
* CDN的使用方法：一般优先选择地理距离最近的CDN集群（也有不足）

![image-20210429104028782](https://tva1.sinaimg.cn/large/008i3skNly1gq0kaihbfxj30ry0m0wg0.jpg)

## 2.7 socket编程

### 2.7.1 UDPClient.py

```python
from socket import *
serverName = 'hostname'
serverPort = '12000'
clientSocket = socket(AF_INET, SOCK_DGRAM)
message = input('Input lowercase sentence:')
clientSocket.sendto(message.decode(), (serverName, serverPort))
moodifiedMessage, serverAddress = clientSocket.recvfrom(2048)
print(modifiedMessage.decode())
clientSocket.close()
```

### 2.7.2 UDPServer.py

```python
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET, SOCK_DGRAM)
serverSocket.bind(('', serverPort))
print('The Server is ready to receive')
while True:
  message, clientAddress = serverSocket.recvfrom(2048)
  modifiedMessage = message.decode().upper()
  serverSocket.sendto(modifiedMessage.encode(), clientAddress)
```

### 2.7.3 TCPClient.py

```python
from socket import *
serverName = 'servername'
serverPort = 12000
clientSocket = socket(AF_INET, SOCK_STREAM)
clientSocket.connect((serverName, serverPort))
sentence = input('Input lowercase sentence: ')
clientSocket.send(sentence.encode())
modifiedSentencce = clientSocket.recv(1024)
print('From Server: ', modifiedSentence.decode())
clientSocket.close()
```

### 2.7.4 TCPServer.py

```python
from socket import *
serverPort = 12000
serverSocket = socket(AF_INET, SOCK_STREAM)
serverSocket.bind(('', serverPort))
serverSocket.listen(1)
print('The Server is ready to receive')
while True:
	connectionSocket, addr = serverSocket.accept()
  sentence = connectionSocket.recv(1024).decode()
  capitalizedSentence = sentence.upper()
  connectionSocket.send(capitalizedSentence.encode())
  connectionSocket.close()
```