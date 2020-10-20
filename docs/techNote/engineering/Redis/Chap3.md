# Chap3 集群

## 主从同步

#### CAP原理

* 简介
  * C：Consistent 一致性
  * A：Availability 可用性
  * P：Partition tolerance  分区容忍性

* 当网络分区发生时，一致性和可用性两难全
* Redis的主从数据是异步同步的，所以分布式Redis不满足一致性需求，但它保证最终一致性，从节点会努力追赶主节点；若网络断开，主从节点数据会出现大量不一致，一旦网络回复，从节点就会采用多种策略追赶

#### 增量同步

* Redis同步的是指令流
  * 主节点会将那些对自己的状态产生修改影响的指令记录在本地内存buffer中，然后异步将指令同步到从节点
  * 从节点一边执行同步的指令流，一边向主节点反馈同步的进度（偏移量）
  * 内存的buffer本质是一个定长的环形数组，若从节点慢整整一圈，则再也跟不上了，此时需要快照同步

#### 快照同步

* 快照同步流程：
  * 主节点进行一次bgsave，将当前内存数据全部快照到磁盘文件（Redis2.8之后，主节点一边遍历内存，一边将序列化的内容发送到从节点，支持无盘复制操作，提高主节点服务效率）
  * 将快照文件的内容全部传送到从节点
  * 从节点将快照文件接收完毕后，清空当前内存数据，然后立即执行一次全量加载
  * 从节点加载完毕后通知主节点继续进行增量同步
* 若快照同步的过程时间过长，可能快照同步完成后已经不能进行增量复制了，又需要快照同步，从而陷入死循环（快照同步是非常耗资源的操作）

* 当从节点刚刚加入到集群中，它必须先进行一次快照同步，同步完成后再继续进行增量同步

#### wait指令

* Redis的复制是异步进行的，Redis3.0之后，使用wait指令可以将其变身为同步复制，确保系统强一致性
* wait指令
  * 参数1: N ：等待wait指令之前的所有写操作同步到N个从节点
  * 参数2：t：同步操作最多等待时间t秒，若t=0，表示无限等待，若此时出现网络分区，会永远阻塞，Redis服务丧失可用性

```
> set key value
OK
> wait 1 0
(integer) 1
```

## 李代桃僵——Sentinel（哨兵）

* 我们必须有一个高可用方案来抵抗节点故障，Redis官方提供了一种方案，Redis Sentinel
* Sentinel负责监控节点的健康情况，当主节点挂掉时，选一个最优从节点上升为主节点
* 客户端连接集群时，首先连接Sentinel，通过Sentinel查询主节点地址，再与主节点进行数据交互；当主节点挂掉，客户端重新向Sentinel询问新的主节点地址，如此做到无须重启的节点切换；旧的主节点恢复后，将变成集群中新的从节点
* Redis主从采用异步复制，所以，当主节点挂掉时，从节点可能没有收到全部的同步消息，这部分消息将丢失；Sentinel尽量保证信息少丢失，它可以组合两个选项来限制主从延迟过大
  * ``min-slaves-to-write 1``:主节点必须至少有一个从节点在进行正常复制，否则就停止对外写服务，丧失可用性
  * ``min-slaves-max-lag 10``：表示若10s内没有收到从节点的反馈，就意味着从节点同步不正常

```python
>>> from redis.sentinel import Sentinel
>>> sentinel = Sentinel([('localhost', 26379)], socket_timeout=0.1)
>>> sentinel.discover_master('mymaster')
('127.0.0.1', 6379)
>>> sentinel.discover_slaves('mymaster')
[('127.0.0.1', 6380)]
>>> master = sentinel.master_for('mymaster', socket_timeout=0.1)
# 从连接池中取出一个连接来使用，采用轮询方案
>>> slave = sentinel.slave_for('mymaster', socket_timeout=0.1)
>>> master.set('foo', 'bar')
>>> slave.get('foo')
'bar'
```

* [Redis Sentinel集群搭建1](https://blog.csdn.net/qq_37853817/article/details/78961462)
* [Redis Sentinel集群搭建2](https://blog.csdn.net/pengjunlee/article/details/81429119)

## 分而治之——Codis

* Codis是Redis集群方案之一，是中国人开发且开源的，使用Go语言开发，作为一个代理中间件，当客户端发送指令给Codis时，Codis负责将指令转发给后面的Redis实例来执行，并将结果返回给客户端
* Codis上挂接的所有Redis实例构成一个Redis集群，当集群空间不足时，可以通过动态增加Redis实例来实现扩容需求
* Codis是无状态的，我们可以启动多个Codis实例供客户端使用，每个Codis节点是对等的，这样，能显著增加整体QPS需求，还能起到容灾功能
* Codis负责将特定的key转发到特定的Redis实例，key进行crc32运算得到hash值再对1024取模得到的余数就是对应key的槽位；Codis的槽位映射关系存储在内存中，不同Codis实例的槽位关系使用zookeeper来进行同步和持久化
* Codis的优点和缺点：
  * 优点：
    * 比官方的Redis Cluster方案简单，因为它将分布式问题交给第三方（zookeeper或etcd）来负责，而Redis Cluster内部实现复杂，为了实现去中心化，混合使用了复杂的Raft协议和Gossip协议，还有大量需要调优的配置参数，难以维护
    * Codis具有强大的Dashboard功能，这是官方所欠缺的
    * Codis-fe工具可以用于对多个Codis集群进行管理
  * 缺点：
    * Codis中所有的key分散在不同的Redis实例中，故无法支持事务，事务只能在单个实例中完成
    * rename操作涉及到两个key，若两个key在不同Redis实例中，则无法完成
    * 单个集合结构的大小不要超过1MB，否则会卡顿，可以考虑分桶存储
    * 因为多增加了一层代理节点，网络开销变大，但可以通过增加Codis实例弥补这一点
    * Codis的集群配置中心使用zookeeper来实现，部署上增加了运维zookeeper的代价
    * Codis作为非官方解决方案，会被牵着鼻子走，有一定技术风险

## 众志成城——Redis Cluster

* Redis Cluster是官方的Redis集群化方案，是去中心化的，节点间通过一种特殊的二进制协议交互集群信息
* Redis Cluster将所有数据分为16384个槽位，每个节点负责其中一部分槽位，槽位的信息存储在每个节点中
* 当客户端连接Redis Cluster集群时，会得到一份集群的槽位配置信息，于是客户端可以将key的查找直接定位到目标节点
* Redis Cluster每个节点会将集群的配置信息持久化到配置文件中

#### 槽位定位算法

* 对key进行crc16运算得到hash值，使用此整数值对16384取模，得到具体槽位
* 用户可以强制将某个key挂在特定槽位上

#### 跳转

* 当客户端向错误的节点发出指令后，该节点会向客户端发送特殊的跳转指令携带目标操作的节点地址，告诉客户端去连接该节点以获取数据

#### 迁移

* 使用官方工具redis-trib来手动调整槽位分配
* Redis的迁移单位是槽，当一个槽在迁移时，槽在源节点的状态为migrating，在目标节点的状态为importing，表示数据正在流动

* 迁移步骤
  * 在源节点和目标节点设置好中间过渡状态，一次性获取源节点槽位的所有key列表，再挨个key迁移
  * 每个key的迁移过程是以源节点作为目标节点的“客户端”，源节点对当前的key执行dump指令获取序列化内容，然后通过“客户端”向目标节点发送restore指令携带序列化的内容作为参数
  * 目标节点进行反序列化将内容恢复到内存，然后返回“客户端”OK
  * 源节点“客户端”收到后再把当前节点的key删除掉，从而完成单个key的迁移过程
* 迁移过程出现网络故障，两个节点依旧处于过渡状态，待下次迁移工具重新连上时，会提示用户继续进行迁移
* 迁移过程中客户端的访问流程
  * 客户端先尝试防伪旧节点，若对应数据还在里面，旧节点正常处理返回；
  * 若数据不在，旧节点向客户端返回一个-ASK targetNodeAddr的重定向指令
  * 客户端收到这个重定向指令后，先去目标节点执行一个不带任何参数的ASKING指令（告诉目标节点下一条指令不能不理，否则目标节点会不受理此指令，将此指令又MOVED到旧节点，形成重定向循环），然后在目标节点再重新执行原先的操作指令

#### 网络抖动

* Redis Cluster提供了一种选项 cluster-node-timeout，表示当某个节点持续timeout的时间失联时，才可以认定该节点出现故障，需要进行主从切换，防止网络抖动导致主从频繁切换
* 可以通过cluster-slave-validify-factor作为倍乘系数放大这个超时时间来宽松容错的紧急程度，若系数为0，则主从切换不会抗拒网络抖动，若系数大于1，就成了主从切换的松弛系数（啥玩意？）

#### 可能下线与确定下线

* Redis Cluster是去中心化的，一个节点认为某个节点失联不代表所有的节点都认为它失联，当大多数节点认为它失联，集群才认定需要主从切换来容错
* Redis集群节点通过Gossip协议广播自己的状态来改变对整个集群的认知，若某节点发现另一节点失联，就广播寻人启事，若大多数人反馈说没找到，它就广播说，他挂了，别管他了，然后对该失联节点进行主从切换

#### Cluster基本用法

```bash
pip install redis-py-cluster # 此库依赖redis-py包
```

```python
from rediscluster import StrictRedisCluster
startup_nodes = [{"host": "127.0.0.1", "port": "7000"}]
rc = StrictRedisCluster(startup_nodes=startup_nodes, decode_responses=True)
rc.set("foo", "bar")
print(rc.get("foo"))
```

* Cluster不支持事务，mget方法慢很多，rename操作不再是原子的，涉及数据在节点间的迁移