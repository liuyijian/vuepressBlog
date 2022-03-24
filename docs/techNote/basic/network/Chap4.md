# Chap4 网络层——数据平面

## 4.1 网络层概览

数据平面中，路由器的首要任务是将数据报从输入链路转发到输出链路；

控制平面中，路由器的首要任务是协调局部的路由器的转发行为，确保数据报最终到达

* 转发（forwarding）：路由器局部行为，将一个包从输入链路转移到输出链路，耗时几纳秒，通常在硬件层实现
* 路由（routing）：网络全局行为，决定端到端路径，耗时几毫秒，通常在软件层实现

## 4.2 路由器结构

* 路由器概览图

![image-20220301185858774](https://tva1.sinaimg.cn/large/e6c9d24ely1gzul17mhm3j20re0d6gmq.jpg)

* 输入端口处理 / 终点导向的转发

![image-20220301205218204](https://tva1.sinaimg.cn/large/e6c9d24ely1gzuob5f57yj20nb05kgm0.jpg)

* 转发表-将key-value转化为前缀查找树，降低存储空间，若同时存在多个匹配，采取最长前缀匹配准则

<img src="https://tva1.sinaimg.cn/large/e6c9d24ely1gzuog4xz7ij20mt0bvdgt.jpg" alt="image-20220301205707330" style="zoom:40%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1gzuozu9f4yj20l8052jrl.jpg" alt="image-20220301211603455" style="zoom:40%;" />

* 转发结构（switching fabric）的三种实现方式，左边的是blocking的，右边的可以并行

  ![image-20220302151123786](https://tva1.sinaimg.cn/large/e6c9d24ely1gzvk2px41fj20p00g2dhb.jpg)

* 输出端口处理

  ![image-20220302153053619](https://tva1.sinaimg.cn/large/e6c9d24ely1gzvkn0024uj20k404waac.jpg)

* 输入队列的队头阻塞（Head-of-the-line blocking，HOL）

![image-20220302234019369](https://tva1.sinaimg.cn/large/e6c9d24ely1gzvysacpqgj20i40i50u3.jpg)

* 输出队列（满了会丢包，使用Random Early Detection算法进行主动的队列管理）

  ![image-20220303004209824](https://tva1.sinaimg.cn/large/e6c9d24egy1gzw0kly5awj20i30f63zn.jpg)

* 缓存设置
  * 双刃剑：较大的缓存能吸收短期的流量波动，降低丢包率，但会增加端到端延迟（bufferbloat现象）
  * 经验公式： $B = RTT \cdot C / \sqrt{N}$ ，其中，$B$ 代表缓存大小，$RTT$ 代表平均往返时间，$C$ 代表链路容量，$N$ 代表独立TCP流的数量（2004）

* 数据包调度（以何种方式发送输出队列中的数据包）
  
  * FIFO
  
  ![image-20220303155100788](https://tva1.sinaimg.cn/large/e6c9d24ely1gzwqu8s8nyj20os08c74v.jpg)
  
  * Priority Queuing（深色的高优先级）
  
  ![image-20220303155205536](https://tva1.sinaimg.cn/large/e6c9d24ely1gzwqvd5n6nj20os08474v.jpg)
  
  * Weighted Fair Queuing（深浅代表两类）
  
  ![image-20220303161832278](https://tva1.sinaimg.cn/large/e6c9d24ely1gzwrmvvmwoj20oq08baan.jpg)

## 4.3 互联网协议：IPv4，地址，IPv6

### 4.3.1 IPv4 数据报格式

![image-20220303162219344](https://tva1.sinaimg.cn/large/e6c9d24ely1gzwrqtrj4pj20hv0crq3q.jpg)

* Version number：IP协议的版本，路由器根据其处理剩余的数据报内容
* Header Length：因为Options的存在，需要说明头部长度以决定数据的起始位置，无options时，通常是20字节长
* Type of service：区分不同类型的数据报
* Datagram length：IP数据报（header+data）总字节数，此字段16比特，故IP数据报最大大小是65535字节，然而实际上，IP数据报一般小于1500字节，以适应以太网帧的大小
* Identifier，flags，fragmentation offset：用于标示一个大的数据报被拆分成若干小数据报的组装工作，IPv6不支持了
* Time to live：若TTL到达0，则路由器会丢弃这个数据报，确保数据报不会在网络中一直循环
* Protocol：当数据报到达目的地时，接收方会根据这个字段决定将数据交给哪个传输层协议去解析，如6代表TCP，17代表UDP，更多可能值，查看IANA Protocol Numbers 2016

* Header checksum：协助路由器检测IP数据报中的比特错误，若出错，则丢弃；注意每个路由器会因为TTL的变化，重新算一个checksum，一种快速算checksum的算法参考RFC 1071
* Source and destination IP address
* Options：IPv4中有，IPv6中没有
* Data：传输层报文，或者其他类型数据，如ICMP信息

### 4.3.2 IPv4 地址

* IPv4地址长度为4字节，32个比特，故理论上有 $2^{32}$ 个IP地址（约40亿）
* 每个主机和路由器的每个link都具有IP地址

* 互联网地址分配策略（Classless Interdomain Routing，CIDR，RFC4632），贯彻了子网的概念，将32位地址划分成前后两部分 a.b.c.d/x，其中，x代表前面一部分的位数，这样，就能形成层次化的消息传递机制

![image-20220303214024380](https://tva1.sinaimg.cn/large/e6c9d24ely1gzx0ya99wsj20g10gn0tm.jpg)

* IP地址中，255.255.255.255用于广播，数据包会发送给子网里的每一个用户，路由器选择性将此信息外发到相邻子网

* IP地址的块分配（分给ISP们）和DNS根服务器是由Internet Corporation for Assigned Names and Numbers，ICANN组织管理的，遵守RFC 7020中的规定
* IP地址的单机分配一般使用Dynamic Host Configuration Protocol，DHCP，[RFC2131]。DHCP会进行动态IP分配，并告知主机一些额外信息，如子网掩码，首个接入路由器的地址，本地DNS服务器IP。DHCP是一个零配置的协议，即插即用

![image-20220303223157696](https://tva1.sinaimg.cn/large/e6c9d24ely1gzx2ffa20rj20ly0gsmy4.jpg)

* 对于新入网的主机，DHCP协议的执行主要分为以下四步
  * 1、DHCP服务发现：入网主机发送广播，使用UDP发DHCP discover message数据包到67端口
  * 2、DHCP服务应答：DHCP服务器收到该信息后，广播一个DHCP offer message数据包，里面包含与discover包中相同的transaction ID，以及Lifetime（IP地址的有效时间，一般设为几个小时或几天）
  * 3、DHCP请求：入网主机会从单个或多个DHCP服务应答中选择一个，并朝那个DHCP服务器发送DHCP请求，包含该DHCP服务应答的配置信息
  * 4、DHCP应答：DHCP服务器会发送一个DHCP应答信息给入网主机

![image-20220303223403040](https://tva1.sinaimg.cn/large/e6c9d24ely1gzx2hlymfuj20gb0m8wgd.jpg)

* 入网主机收到DHCP应答后，可以使用DHCP分配的IP地址在有效期内进行通信，有效期结束后，DHCP提供更新有效期的机制

### 4.3.3 网络地址翻译（NAT）

![image-20220303230150504](https://tva1.sinaimg.cn/large/e6c9d24ely1gzx3ait5ozj20r10d6q4e.jpg)

* 支持NAT的路由器是一个子网对外的接口，使用相同的IP地址对外发出请求，NAT翻译表中，将广域网的IP地址+端口和局域网的IP地址+端口形成一一映射。这样，能使不同子网间可能存在相同的IP地址，从而节省IP地址资源，且不影响正常工作。
* 外网的机器如何连接一个躲在NAT服务器后面的主机（不知道其IP）呢？技术方案是使用NAT穿透工具，参见RFC5389

### 4.3.4 IPV6

* IPV4地址面临用尽的危机，故发展IPv6，RFC2460；（有过IPv5，但被放弃了）

* IPv6数据报格式

  ![image-20220303231529804](https://tva1.sinaimg.cn/large/e6c9d24ely1gzx3oq4o2uj20i109wgm1.jpg)
  * Version：4比特，IP版本标识号，IPv6是6
  * Traffic Class：8比特，设置流里的数据报优先级
  * Flow label：20比特，流标签，如音视频可被视作一个流，而文件传输则不被视为一个流
  * Payload length：16比特，unsigned int，表示Data的字节数
  * Next header：交付给什么上层协议解析（如TCP、UDP）
  * Hop limit：允许最大跳数，经过一个路由器就减1，到0就被丢包
  * Source/Destination Address：地址表示位数从32bit上升到128bit，且增加了一种新类型地址，叫做anycast address，允许一个数据报传递给任意一组主机

* IPv6的改动
  * 不再支持大数据报的切割和组装
  * 不设置校验和（TCP等上层协议已经有校验机制，且能避免每个路由器更新TTL带来的校验和计算耗时）
  * 删除了options字段，固定40字节的包头，使得路由器的处理更快速

* IPv4到IPv6的迁移
  * 主流方法是使用隧道【RFC 4213】，如下图所示，将整个IPv6数据报当成IPv4数据报的payload进行传输，并将IPv4的协议编号设为41【RFC 4213】
  * ![image-20220303235613312](https://tva1.sinaimg.cn/large/e6c9d24ely1gzx4v3pxp3j20lc0gata5.jpg)

## 4.4 广义的转发

