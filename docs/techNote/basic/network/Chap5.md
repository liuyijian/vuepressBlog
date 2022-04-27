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

