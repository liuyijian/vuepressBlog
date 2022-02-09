# Chap3 传输层

## 3.1 传输层服务简介

### 3.1.1 传输层和网络层的关系

* 传输层协议为不同主机的应用进程提供逻辑通信，无需考虑物理架构的细节
* 传输层协议是在端系统上实现的，在发送方，传输层将从应用层接收到的报文转化为传输层报文段（切成小块并添加传输层头）
* 网络层IP协议的传输模型是尽力而为的，并不可靠

### 3.1.2 传输层概览

* UDP（User Datagram Protocol）：提供不可靠，无连接的服务
* TCP（Transmission Control Protocol）：提供可靠的，有连接的服务

* 将主机到主机的传递扩展到进程到进程的传递的技术叫做传输层多路复用和多路分解
* UDP和TCP通过报文段头部的错误校验字段来提供完整性检查
* TCP使用流控制，序列号，确认机制，计时器等技术确保可靠数据传输

## 3.2 多路复用和多路分解

* 多路分解：将传输层收到的报文段转发到特定的应用层socket
* 多路复用：将不同socket的报文收集并封装上传输层报文段头，并发送到网络层

* 套接字有唯一标识符，每个报文段有特殊字段指示其所要交付到的套接字，特殊字段是源端口号字段和目的端口号字段，端口号大小在0～65535之间，但0～1023范围的端口号称为周知端口号（well-known hosts），是受限制的，即要保留给如HTTP（80），FTP（21）等应用层协议来使用
* TCP服务器应用会有一个欢迎套接字（welcoming socket）运行在12000端口，等待TCP客户端的申请建立连接请求，一旦接受到入连接报文段（目的端口12000，TCP首部特定"连接建立位"置位的TCP报文段，包含客户的源端口，源IP，目的IP和端口），服务器进程就会创建一个新的套接字与之相连接，若以后收到相同四元组的TCP包，则会分配给此套接字处理
* 下图是两个用户使用相同的目的端口号与同一个Web服务器应用通信的示意图，事实上，当今的高性能Web服务通常使用单进程，但为每个新客户连接创建一个新连接套接字的新线程

![image-20210504213504177](https://tva1.sinaimg.cn/large/008i3skNly1gq6q0w6twtj315u0u0gti.jpg)

* 使用nmap可以扫描因特网种任何地方的目的主机

## 3.3 无连接运输：UDP

* 许多应用适合使用UDP，原因主要以下几点
  * 1、何时、发送什么数据的应用层控制更为精细
    * UDP会将数据打包进报文段并立即传递给网络层，而TCP有拥塞控制机制可能遏制发送方
  * 2、无需连接建立
    * UDP不会引入建立连接的时延，如DNS、RIP、SNMP、NFS服务运行在UDP上
    * QUIC（Quick UDP Internet Connection）基于UDP协议实现了可靠传输，并在Google Chrome上使用了
  * 3、无连接状态
    * TCP需要在端系统中维护连接状态，如收发缓存、拥塞控制参数、序号与确认号的参数，故应用运行在UDP之上时能支持更多的活跃客户
  * 4、分组首部开销小
    * TCP报文段首部长20字节，而UDP报文段首部仅长8字节

### 3.3.1 UDP报文段结构

* Length字段指明整个报文段的长度，Checksum字段用于接收方校验报文段正确性
* ![image-20210504221130616](https://tva1.sinaimg.cn/large/008i3skNly1gq6r2srl4kj30eu0cwdgl.jpg)

### 3.3.2 UDP校验和

* 发送方的UDP对报文段计算校验和（需要将UDP伪首部一并计算，[详细解释](https://blog.csdn.net/fengdijiang/article/details/115357319)）
  * 1、将校验和字段清零
  * 2、把所有比特位按照16bit一组进行划分
  * 3、把2中划分好的组相加，若遇到进位，将进位值加到值的最低位上
  * 4、把所有的组加到一起后，得到一个16位的数，将其按位取反得到校验码
* 接收方将所有16比特字相加，若无差错，则相加得到的值应为1111111111111111

* 校验和并不提供纠错功能

## 3.4 可靠数据传输原理

![image-20210505002458193](https://tva1.sinaimg.cn/large/008i3skNly1gq6uxmszmtj310s0r0q79.jpg)

* rdt代表可靠传输，udt代表不可靠传输，假设分组将以它们发送的次序交付（可能丢失，但底层信道不会对分组重排序），仅考虑单向数据传输

### 3.4.1 构造可靠数据传输协议

#### rdt 1.0 经完全可靠信道的可靠数据传输

* 

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gq6vx9nyjxj30l809cmy9.jpg" alt="image-20210505005913415" style="width: 50%; zoom: 50%;" /><img src="https://tva1.sinaimg.cn/large/008i3skNly1gq6vxlvaimj30l409kjsi.jpg" alt="image-20210505005932495" style="zoom:50%;" />

#### rdt 2.0 经具有比特差错信道的可靠数据传输

* 基于重传机制的可靠数据传输协议称为自动重传请求（Automatic Repeat Request，ARQ）协议
* ARQ协议需要另外三种协议功能来处理存在比特差错的情况
  * 差错检测：需要一种机制使接收方检测到何时出现比特差错，如检验和
  * 接收方反馈：发送方要了解接收方是否正确接收分组的唯一途径是让接收方提供明确的反馈信息给发送方，即ACK、NAK
  * 重传：接收方收到有差错的分组时，发送方需要重传该分组
* rdt2.0在上一个分组未被确认时，不会传下一个分组，故这样的协议叫做停等协议（stop-and-wait）
* rdt2.0没有考虑到ACK/NAK分组受损的可能性，以下是3种解决方法
  * 1、接收方发出疑问，但因信道差错，发送方可能无法理解接收方发出的疑问，再次发问，陷入千层饼
  * 2、增加足够的校验和比特，使发送方不仅可以检测差错，还可恢复差错（对于不丢失分组的信道，这可以直接解决问题）
  * 3、当发送方收到含糊不清的ACK/NAK分组时，重传当前数据分组即可，此法引入了冗余分组，而冗余分组的根本困难在于接收方不知道它上次所发送的ACK/NAK是否被发送方正确地收到，故无法预知接收到的分组是新的还是一次重传，解决此问题的一个简单方法是在数据分组中添加一个新字段，让发送方对数据分组进行编号并填充在该字段内，接收方通过检查序号判断分组是否为一次重传（TCP用的此法）

![image-20210505010541447](https://tva1.sinaimg.cn/large/008i3skNly1gq6w3zwt7uj312k0i0di9.jpg)

![image-20210505010553804](https://tva1.sinaimg.cn/large/008i3skNly1gq6w47tjkmj30p60hwac3.jpg)

#### rdt 2.1 对数据分组进行编号，并引入重传机制

![image-20210505103648320](https://tva1.sinaimg.cn/large/008i3skNly1gq7cm9k5d1j31080putdl.jpg)

![image-20210505103703397](https://tva1.sinaimg.cn/large/008i3skNly1gq7cmiawt7j313i0o00yb.jpg)

#### rdt 2.2 无NAK化

* 若接收方收到受损分组，不发送当前分组的NAK，而是发送上个正确分组的ACK，能实现一样的效果
* 发送方接收到对分组 $t$ 的两个ACK，就知道接收方没有正确接收到分组 $t+1$

![image-20210505104422918](https://tva1.sinaimg.cn/large/008i3skNly1gq7cu4qg8ej310s0pw43h.jpg)

![image-20210505104435837](https://tva1.sinaimg.cn/large/008i3skNly1gq7cuckh0lj312u0lgn1k.jpg)

#### rdt 3.0 经具有比特差错的丢包信道的可靠数据传输

* 假设除了比特受损外，底层信道还会丢包，协议现在需要关注两个问题：怎样检测丢包以及发生丢包后该做什么
* 这里，我们让发送方负责检测和恢复丢包工作
* 若发送方传输一个数据分组，该分组或接收方对该分组的ACK丢失，都使发送方收不到应当到来的接收方的响应；若发送方愿意等待足够长的时间以便确定分组已丢失，则只需重传分组即可，若分组经历了一个特别大的时延，即分组其实并没有丢失，这会在信道中引入冗余数据分组，但rdt2.2中有足够的功能处理冗余分组的情况
* 为了实现基于时间的重传机制，需要一个倒计数定时器（countdown timer），发送方需要做到以下几点
  * 1、每次发送一个分组（包括第一次分组和重传分组），便启动一个定时器
  * 2、响应定时器中断（采取适当的动作）
  * 3、终止定时器
* rdt3.0因为分组序号在0，1之间交替，有时称为比特交替协议（alternating-bit protocol），下面给出rdt3.0 发送方的有限状态机，接收方的见课后习题答案

![image-20210505115550377](https://tva1.sinaimg.cn/large/008i3skNly1gq7ewheew5j31040ri7a1.jpg)

* rdt3.0的操作流

![image-20210505120331850](https://tva1.sinaimg.cn/large/008i3skNly1gq7f69wduaj30u00x9gxu.jpg)

### 3.4.2 流水线可靠数据传输协议

* rdt3.0是一个功能正确的协议，但其性能较低，根本原因在于它是一个停等协议，其带宽利用率非常低，$U_{sender}=\frac{L/R}{RTT+L/R}$

![image-20210505120650220](https://tva1.sinaimg.cn/large/008i3skNly1gq7f7x5vw5j310a0bq42r.jpg)

![image-20210505122438059](https://tva1.sinaimg.cn/large/008i3skNly1gq7fqfua5fj311g0ku0wu.jpg)

![image-20210505122448671](https://tva1.sinaimg.cn/large/008i3skNly1gq7fqm7u1ij311e0nitf3.jpg)

* 流水线技术对可靠数据传输协议会带来如下影响
  * 需要增加序号范围
  * 收发两端必须缓存多个分组
  * 所需序号范围和对缓冲的要求取决于数据传输协议如何处理丢失、损坏及延时过大的分组，解决流水线的差错恢复有两种基本方法：回退N步（Go-Back-N，GBN），和选择重传（Selective Repeat，SR）

### 3.4.3 回退N步（GBN）

* 在GBN协议（滑动窗口协议）中，允许发送方发送多个分组而不需等待确认，但未确认分组数不能超过窗口长度 $N$ ，如下图所示
  * base：基序号，最早的未确认分组的序号
  * nextseqnum：下一个待发分组的序号

![image-20210505124103488](https://tva1.sinaimg.cn/large/008i3skNly1gq7g7j9rkzj30zw094q4e.jpg)

* 下面是GBN的收发双方的有限状态机
  * 发送方需要响应三种类型的事件
    * 上层的调用：当上层调用rdt_send()时，发送方先检查发送窗口是否已满，若未满，则产生分组并发送，若已满，则等候一会再试
    * 收到ACK：对序号为n的分组的确认采取累积确认的方式
    * 超时事件：重传所有已发送但还未确认过的分组
  * 接收方需要响应两种类型事件
    * 正确接收到序号为 $n$ 的分组：交付分组到上层，并发送分组 $n$ 的ACK
    * 接收到其他序号的分组或错误的分组：丢弃分组，并发送分组 $n-1$ 的ACK（最近接收的）

![image-20210505124623817](https://tva1.sinaimg.cn/large/008i3skNly1gq7gd2w0asj311c0og42o.jpg)

![image-20210505124633513](https://tva1.sinaimg.cn/large/008i3skNly1gq7gd99kshj30qk0gijtv.jpg)

![image-20210505145650503](https://tva1.sinaimg.cn/large/008i3skNly1gq7k8hhu1fj30sa0yeagy.jpg)

### 3.4.4 选择重传（SR）

* 单个分组的差错会引起GBN重传大量分组，导致性能问题
* 选择重传协议（SR）通过让发送方仅重传那些它怀疑在接收方出错的分组
  * 发送方事件动作
    * 1、从上层收到数据：检查下一个可用该分组的序号，若在窗口内，则打包数据并发送，否则缓存或返回上层
    * 2、超时：每个分组拥有自己的逻辑定时器，超时发生后仅重传1个分组
    * 3、收到ACK：若收到ACK，且分组序号在窗口内，则在发送方标记此分组为已接收，若分组的序号等于send_base，则send_base移动到最小序号的未确认分组处，并发送新窗口覆盖下未发送过的分组
  * 接收方事件动作
    * 1、序号在$[rcv_{base}, rcv_{base}+N-1]$内的分组被正确接收，回复ACK，若分组没被收到过，则缓存，若分组序号等于$rcv_{base}$，则该分组及缓存的序号连续的分组将交付上层，接收窗口前移
    * 2、序号在$[rcv_{base}-N, rcv_base - 1]$内的分组被正确收到，也必须产生一个ACK，即使之前已经确认过（因为若此前接收方回复的ACK丢失，但接收方的窗口已经前移，若不二次ACK，会导致发送方一直重发而导致发送窗口卡住）
    * 3、其他情况，忽略此分组

![image-20210505145946887](/Users/lyj-newy/Library/Application Support/typora-user-images/image-20210505145946887.png)

![image-20210505154422365](https://tva1.sinaimg.cn/large/008i3skNly1gq7liaca5oj30vo0u0thr.jpg)

* 窗口长度必须小于等于序号空间大小的一半，否则编号一样时，无法区分是重传还是新分组（如下面两个例子）

![image-20210505160238715](https://tva1.sinaimg.cn/large/008i3skNly1gq7m1a96cjj30u016j7bi.jpg)

* 接收窗口需要大于等于发送窗口，保证不溢出
* 面对分组重新排序的情况（序号为x的上一轮回的分组突然出现），可以通过假定分组在网络存活时间不会超过特定阈值来避免，RFC7323定义了TCP中最长分组寿命为3分钟

## 3.5 面向连接的运输：TCP

### 3.5.1 TCP连接

* TCP连接是点对点的，提供的是全双工服务
* 客户进程通过套接字传递数据流，TCP将数据引导到该连接的发送缓存（send buffer）中，TCP不时从发送缓存里取出一块数据，取出的数据量受限于最大报文段长度（Maximum Segnemt Size，MSS）
* MSS指的是报文段里应用层数据的最大长度
* MSS通常由最初确定的由本地发送主机发送的最大链路层帧长度（即最大传输单元，Maximum Transmission Unit，MTU）来设置，需要保证一个TCP报文段加上TCP/IP首部长度适合单个链路层帧，以太网和PPP链路层协议具有1500字节的MTU，所以MSS的典型值为1460字节（TCP/IP首部长为40字节）

### 3.5.2 TCP报文段结构

* TCP报文段结构如下图

  * 源端口，目的端口，
  * 32比特长的序号字段和32比特长的确认号字段：用于实现可靠数据传输服务
  * 16比特的接收窗口字段：用于流量控制，表示接收方愿意接受的字节数量
  * 4比特的首部长度字段：指示了以32比特的字为单位的TCP首部长度（通常TCP选项字段为空，典型长度是20字节）
  * 6比特的标记字段：ACK（确认），RST，SYN，FIN（用于连接建立和拆除），PSH（若被设置，则接收方应立即将数据交付上层），URG（指示报文段存在被发送端上层实体置为紧急的数据）
  * 可选与变长的选项字段：用于发送方与接收方协商最大报文段长度（MSS），或在高速网络环境下作哦窗口调节因子时使用

  ![image-20210505162823240](https://tva1.sinaimg.cn/large/008i3skNly1gq7ms4w33gj30z00s6tbm.jpg)

* 序号与确认号
  * 序号：
    * TCP对序号的使用是建立在传送的字节流之上，而非建立在传送的报文段序列上
    * 一个报文段的序号是该报文段首字节的字节流编号
    * TCP连接的双方均可随机选择初始序号，因为若两台主机之间先去有过连接但终止了，但网络上可能还残存报文段，随机初始化能避免残存报文段被误认为是新建连接所产生的有效报文段的可能性
    * ![image-20210508135512235](https://tva1.sinaimg.cn/large/008i3skNly1gqaz7nbkdgj30za0bcwfm.jpg)
  * 确认号：
    * 主机A填充进报文段的确认号是主机A期望从主机B收到的下一字节的序号
    * TCP提供累积确认，即只确认流中至第一个丢失字节为止的字节
  * 例子：
    * 假设客户和服务器的起始序号是42和79，下面是一个Telnet应用程序中TCP流的说明
    * ![image-20210508141041419](https://tva1.sinaimg.cn/large/008i3skNly1gqaznq5wmcj30su0qkq7c.jpg)

### 3.5.3 往返事件的估计与超时

* TCP中实现超时/重传机制需要考虑超时间隔长度的设置

#### 1、估计往返时间

* 大多数TCP的实现仅在特定时刻做一次报文段SampleRTT的测量，用以更新Estimated RTT（此为判断超时与否的标准），$EstimatedRTT = (1 - \alpha) \cdot EstimatedRTT + \alpha \cdot SampleRTT$，RFC6298中给出的参考值是 $\alpha = 0.125$，加权平均对最近的样本赋予的权值大于对老样本赋予的权值，从而更好地反映网络的当前拥塞情况

  ![image-20210508144231655](https://tva1.sinaimg.cn/large/008i3skNgy1gqb0kvim2cj30yq0jqjva.jpg)

* 除了估算RTT外，测量RTT的变化也是有价值的，定义RTT偏差 $DevRTT$，用来估算$SampleRTT$ 一般会偏离 $EstimatedRTT$ 的程度，$\beta$ 的推荐值是0.25，$DevRTT = (1-\beta) \cdot DevRTT + \beta \cdot \vert SampleRTT - EstimatedRTT \vert$

#### 2、设置和管理重传超时间隔

* $TimeoutInterval = EstimatedRTT + 4 \cdot DevRTT$
* 推荐的初始$TimeoutInterval$值为1秒，当出现超时后，对于重传的包，此值将翻倍，以免后续报文段过早出现超时，当报文段收到并更新$EstmatedRTT$后，$TimeoutInterval$又将使用上述公式计算

### 3.5.4 可靠数据传输

* 超时触发重传存在的问题之一是超时周期可能相对较长，使得发送方延迟重传丢失的分组，增加端到端时延

* TCP产生ACK的建议（RFC 5681）

  ![image-20210508150531521](https://tva1.sinaimg.cn/large/008i3skNgy1gqb18vsyf9j31140batbj.jpg)

* TCP的快速重传：一旦收到3个冗余ACK，在该报文段的定时器过期之前重传丢失的报文段

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gqb15sp6stj30kq0pgtdd.jpg" alt="image-20210508150238039" style="zoom:50%;" />

### 3.5.5 流量控制

* TCP为应用程序服务提供流量控制服务，消除发送方使接收方缓存溢出的可能性
* TCP发送方可能因为IP网络的拥塞而被遏制，这种形式的发送方的控制被称为拥塞控制（congestion control）
* TCP通过让发送方维护一个称为**接收窗口**的变量来提供流量控制，接收窗口用于给发送方一个提示——接收方还有多少可用的缓存空间
  * $LastByteRead$：主机B上的应用进程从缓存读出的数据流的最后一个字节的编号
  * $LastByteRcvd$：从网络中到达的并且已放入主机B接收缓存中的数据流的最后一个字节的编号
  * $rwnd = RcvBuffer - [ LastByteRcvd - LastByteRead ]$
  * $rwnd$ 值被放入它发给主机A的报文段接收窗口字段中，告知主机A它在该连接的缓存中还有多少可用空间
  * ![image-20210508172858697](https://tva1.sinaimg.cn/large/008i3skNly1gqb5e13i8mj30mc0c0aar.jpg)
  * 主机A轮流跟踪两个变量，而$LastByteSent - LastByteACKed$ 代表的就是主机A发送到连接中但未被确认的数据量，此值应小于等于 $rwnd$，假设主机B的接收缓存已满，使得 $rwnd=0$，将此消息告知A后，而主机B没有任何数据再要发给A，则当B将缓存清空后，A并不知道这个事实，会导致阻塞，无法再发送数据，为了解决此问题，TCP规定，当主机B的接收窗口为0时，主机A继续发送只有1个字节数据的报文段，这些报文段将被接收方确认，最终缓存开始清空，确认报文里将包含一个非0的rwnd值

### 3.5.6 TCP连接管理

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gqb6yr4rgtj30s80m6whv.jpg" alt="image-20210508182328540" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/008i3skNly1gqb77u04jyj30tk0ki41q.jpg" alt="image-20210508183213339" style="width:50%;" />

* [TCP的三次握手和四次挥手](https://www.cnblogs.com/AhuntSun-blog/p/12028636.html)

* nmap端口扫描工具原理：向目标主机发送TCP SYN报文段，可能有三种结果
  * 1、接收到目标主机响应的TCP SYNACK 报文段：意味着目标主机上一个应用程序使用TCP端口xxxx运行
  * 2、接收到目标主机响应的TCP RST报文段：意味着SYN报文段能顺利到达目标主机，但该端口上没有运行的应用程序，但至少说明没有防火墙阻挡
  * 3、什么都没收到：意味着SYN报文段可能被中间的防火墙所阻挡，无法到达目标主机

* 学习nmap的使用方法，以及它的python包

## 3.6 拥塞控制原理

### 3.6.1 拥塞原因与代价

