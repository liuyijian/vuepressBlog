# Chap5 网络层——控制平面

## 5.1 简介

* 本章介绍如何计算，维护，存储路由转发表
  * 路由器单位的控制：路由算法在每个路由器中运行，如OSPF协议，BGP协议
  * 逻辑中心的控制：路由算法在一个远程的逻辑中心中运行，通过控制代理在路由器生效，如Google的SDN，Microsoft的SWAN，用于控制广域网和其数据中心的链接

<img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h1ol4e6dn4j20mr0f0q49.jpg" alt="image-20220427210910108" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h1ol4nadr3j20nn0j975z.jpg" alt="image-20220427210934022" style="width:50%;" />

## 5.2 路由算法

* 目标：决定收发双方间的最小代价的网络通信路径

* 模型：带权值的无向有环图   <img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h1olhkufg9j20ck08hglr.jpg" alt="image-20220427212159940" style="zoom:50%;" />

* 算法：
  * 中心式：具有全局信息
  * 分布式：每个节点只具有局部信息，通过迭代计算和信息交换找到最佳路径
  * 静态：通常是人工干预修正，平时基本不变
  * 动态：根据网络拥塞情况和拓扑结构调整路由路径，但可能导致路由震荡问题

### 5.2.1 Link-State 路由算法

* 前提：网络拓扑结构和所有的边的权重都是已知的，作为LS路由算法的输入；通过使用LS广播算法，使得所有路由器都有相同的网络完整结构，每个路由器能运行LS算法计算和其他节点链接的最小代价路径
* 算法种类：Dijkstra算法，Prim算法

#### Dijkstra算法

迭代式算法，k轮迭代后，拥有k个目标节点的最短路径

* 变量定义
  * $D(v)$：本轮迭代中，从起点到终点$v$的最小代价路径的总花费
  * $p(v)$：从起点到终点$v$的最小代价路径中，$ v$的前一个节点
  * $N_{checked}$：结点集合，若从起点到$v$的最短路径已经确认，则$v$在集合$N_{checked}$中
  * $N$：结点全集

* 算法细节

  * ```python
    # 初始化，起点为u
    N_checked = {u}
    for v in N:
      if v in neighbor(u):
        D(v) = c(u, v)
      else:
        D(v) = float('inf')
    # 迭代
    while N_checked != N:
      find w not in N_checked such that D(w) is a minimum
      N_checked.add(w)
      for v in neightbor(w):
        if v not in N_checked:
          D(v) = min(D(v), D(w)+c(w, v))
    ```

  * 算法复杂度：$O(n^2)$

  * 算法优化：找新一轮迭代节点时，是通过最小值来确定，可以用最小堆数据结构，将查找时间从$O(n)$降到 $O(1)$

* 存在问题

  * 代价有向：若边是有向的，且不同向的代价不一致
  * 代价动态：选定最短路径后，新的流量影响下，出现新的代价
  * 路由震荡：结点执行算法的时间稍微错位即可改善
    * ![image-20220510155504384](https://tva1.sinaimg.cn/large/e6c9d24ely1h23d3h0395j20ks0k6myv.jpg)

### 5.2.2 Distance-Vector路由算法

* 算法特性
  * 分布：每个节点从邻居中接受信息，完成运算后，将信息回播到邻居
  * 迭代：上述过程会一直执行，直到结点间没有信息交换
  * 异步：不需要配对锁定等待

* 算法原理：Bellman-Ford方程
  * 设 $d_x({y})$是从节点$x$到节点$y$的最短路径的代价，$v$ 是节点$x$的邻居，则 $d_x(y)=min_v\{c(x, v)+d_v(y)\}$

* 算法实现

  * ```python
    # 初始化,当前节点为x
    for y in N:
      D[x][y] = c(x, y) # if y is not a neighbor of x, then c(x,y) is +inf
    for w in neighbor(x):
      for y in N:
      	D[w][y] = None
    send_neighbor(source=x, content=[D[x][y] for y in N])
    # 循环
    while True:
      wait_until( c(x, ?) changed or receive DV vector from neighbor)
      # 本地更新
      for y in N:
        D[x][y] = min([c(x,v)+D[v][y] for v in neighbor(x)])
    	# 更新结果广播
      if D[x][y] changed for any destination y:
        send_neighbor(source=x, content=[D[x][y] for y in N])
    ```

* 算法示例流程

  * 1、初始化收敛流程
    * 列一是初始化，列二是接受更新信息传入自更新，列三是有自更新的行广播到邻居节点
    * ![image-20220510170259975](https://tva1.sinaimg.cn/large/e6c9d24ely1h23f23pcbbj20go0n9tax.jpg)
  * 2、边的代价改变
    * ![image-20220511130153005](https://tva1.sinaimg.cn/large/e6c9d24ely1h24dpkvvc1j20gt05574c.jpg)
    * 情况a：关注y和z的distance table to x
      * 1、y检测到yx边代价从4变为1，更新$D[y][x]$，并通知x和z
      * 2、z收到y的更新，将$D[z][x]$从5变为2，并通知y
      * 3、y收到z的更新，无需再更新
    * 情况b：关注y和z的distance table to x
      * 1、y检测到yx边代价从4变为1，更新$D[y][x] = \min\{c(y,x)+D[x][x], c(y,z)+D[z][x]\} = \min\{60+0, 1+5\}=6$ ，并通知 $x$ 和 $z$
      * 2、z收到y的更新，更新$D[z][x] = \min\{c(z,x)+D[x][x], c(z,y)+D[y][x]\} = \min\{50+0, 1+6\}=7$，并通知 $x$ 和 $y$
      * 3、y收到z的更新，更新$D[y][x]=8$；然后 $z$ 收到 $y$ 的更新，更新 $D[z][x]=9$；一直循环下去，直到 $z$ 发现，$D[z][x]=50$，直接走是最短的，$z$不再向$y$更新，而$D[y][x]=51$
    * 问题：当代价变大很多，甚至出现断路时，路由算法迭代会很久，存在无穷计数问题
    * 解决办法：毒性逆转
      * 原理：只要z经过y去到达x，则z对y的广播中，$D[z][x] = inf$
      * 改良情况b：
        * 1、y检测到yx边代价从4变为1，更新$D[y][x] = \min\{c(y,x)+D[x][x], c(y,z)+D[z][x]\} = \min\{60+0, 1+inf\}=60$ ，并通知 $z$
        * 2、z收到y的更新，更新$D[z][x] = \min\{c(z,x)+D[x][x], c(z,y)+D[y][x]\} = \min\{50+0, 1+60\}=50$，此时z不再通过y到达x，通知 $y$
        * 3、y收到z的更新，更新$D[y][x] = \min\{c(y,x)+D[x][x], c(y,z)+D[z][x]\} = \min\{60+0, 1+50\}=51$ ，此时y通过z到达x，通知 $z$
        * 4、z收到y的更新，更新$D[z][x] = \min\{c(z,x)+D[x][x], c(z,y)+D[y][x]\} = \min\{50+0, 1+inf\}=50$，不再更新，算法终止
      * 不足之处：涉及3个或更多结点的环路无法用毒性逆转技术检测到

* 算法应用：用于互联网路由协议，如RIP、BGP、ISO IDRP等

## 5.3 Intra-AS 路由：OSPF

* 背景
  * 规模：当路由器数量规模变大，通信成本，计算成本，存储路由信息成本无法避免，DV算法无法收敛，必须采取措施降低网络复杂度
  * 管理：一个ISP能管理自己网络下的路由器，对外提供接口，对外隐藏细节
* 方案
  * 构建自治系统（Autonomous systems），每个AS下使用相同的管理控制，AS下运行的路由算法叫做Intra-AS routing protocol

### OSPF算法

* 定义
  * OSPF（Open Shortest Path First）是一种link-state协议，使用flooding of link-state 信息和Dijkstra最短代价路径算法，每个节点构建一个AS的拓扑网络图，并执行Dijkstra算法，去找到到不同子网的最短路径；单条路径的cost由网络管理员设定（可以都设为1，则变为最小跳路由）
* 优点
  * OSPF 路由器的信息交换（如：状态更新）可以被权限验证，避免伪造攻击，使用MD5算法
  * 当多条路径的代价相同时，允许使用多条路径
  * 支持单播/多播路由
  * 支持单个AS中定义层次结构

## 5.4、Inter-AS 路由：BGP

* 跨AS之间的网络传输，需要通过运行相同的inter AS routing protocol来交互
* 目前所有跨AS的路由协议都是BGP（Border Gateway Protocol）【RFC 4271】

### 5.4.1 BGP的作用

* BGP中，数据包并非传输到特定目的地址，而是CIDRized前缀，每个前缀代表一个子网或一个子网集合
* BGP为每个路由器提供以下能力
  * 从相邻AS获取前缀可到达信息：BGP允许子网将自己的存在广播到所有路由器
  * 决定到特定前缀的最佳路径：每个路由器会本地运行一个BGP路由选择进程

### 5.4.2 广播BGP路由信息

![image-20220512131131180](https://tva1.sinaimg.cn/large/e6c9d24ely1h25jlwxaehj20m208p0t2.jpg)

* 案例：上图为3个AS，router可以分为gateway router和internal router，前者是具有跨AS连接的，后者只有AS内连接；其中AS3有一个前缀为x的子网，正打算将其存在广播出去
* BGP连接：路由器之间通过运行在179端口上的半永久TCP连接交换路由信息，在AS内的BGP连接称作iBGP，跨AS的BGP连接称作eBGP
* 路由信息传递：路由器3d将iBGP信息 x 发送给AS3中所有路由器，路由器3a将eBGP信息AS3 x发送给路由器2c，路由器2c将iBGP信息 AS3 x发送给AS2中所有路由器，路由器2a将eBGP信息 AS2 AS3 x发送给路由器1c，路由器1c将iBGP信息 AS2 AS3 x发送给AS1中所有路由器，这样下来，所有路由器都意识到子网x的存在，且知道AS的连接路径

### 5.4.3 选择最佳路由

![image-20220513145844892](https://tva1.sinaimg.cn/large/e6c9d24ely1h26sbsl2eqj20k808dt91.jpg)

* BGP消息中，包含两个重要属性，AS-PATH记录了广播经过的AS列表，用于检测和避免循环广播（若已在AS-PATH中，则拒绝此信息），NEXT_HOP记录了跨AS通信的路由器节点的IP地址，如：![image-20220512151858639](https://tva1.sinaimg.cn/large/e6c9d24ely1h25nahwkl4j20de01iglk.jpg)

#### 热土豆路由

* 流程：![image-20220516113907544](https://tva1.sinaimg.cn/large/e6c9d24ely1h2a3ez6zz4j20ns03wt99.jpg)
* 思想：
  * 将像热土豆一样的数据包尽快传出AS，忽略AS外部的传递代价

#### 路由选择算法

* 实际上，BGP使用了比热土豆路由算法更复杂的算法

