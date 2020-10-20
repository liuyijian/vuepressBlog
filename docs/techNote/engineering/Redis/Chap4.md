# Chap4 拓展

## 耳听八方——Stream

* Redis5.0增加了数据结构stream，是一个新的强大的支持多播的可持久化消息队列
* 每个Stream有唯一名称，就是Redis的key，在首次使用xadd指令增加消息时创建
* 每个Stream可以挂多个消费组，每个消费组有游标last_delivered_id在Stream数组上前移，表示当前消费组已经消费到哪条消息
* 每个消费组在Stream内有唯一名称，消费组需要单独的xgroup create进行创建，需要制定从Stream的某个消息ID开始消费
* 每个消费组状态独立，同一份Stream内的消息会被每个消费组消费到
* 同一个消费组可以挂接多个消费者，这些消费者是竞争关系，任一消费者读取了消息都会将last_delivered_id前移，每个消费者在组内有唯一名称
* 消费者内部有一个状态变量pending_ids，记录了当前已经被客户端读取，但没有ACK的消息；此PEL变量确保客户端至少消费了信息一次，而不会因为网络传输丢失。若客户端重连，xreadgroup的起始消息ID一般设为0-0，表示读取所有的PEL消息以及自last_delivered_id之后的新消息。处理完消息之后记得ACK一下，否则PEL占用的内存就会一直放大
* Stream的消费模型借鉴了Kafka的消费分组概念，弥补了Redis PubSub不能持久化消息的缺陷，但Stream不能自动Partition，需要在客户端里对消息进行hash取模来手动partition

#### 消息ID和内容

* 形式是timestampInMillis-sequence，如1527846880572-5，表示当前消息在毫秒时间戳1527846880572下产生的第5条消息
* 消息ID可以由服务器生成，也可以客户制定，形式必须是“整数-整数”，且后入消息的ID要大于前入的消息ID
* 消息内容是键值对

#### 增删改查

```bash
# * 号表示服务器自动生成ID，后面顺序跟着key value [key value]...，返回消息ID
> xadd lyj * name lyj age 22
"1572927022918-0"
> xadd lyj * name fxy age 23
"1572927072170-0"
> xlen lyj
(integer) 2
# - 表示最小值，+ 表示最大值
> xrange lyj - +
1) 1) "1572927022918-0"
   2) 1) "name"
      2) "lyj"
      3) "age"
      4) "22"
2) 1) "1572927072170-0"
   2) 1) "name"
      2) "fxy"
      3) "age"
      4) "23"
# 指定列表范围
> xrange lyj 1572927022919-0 +
1) 1) "1572927072170-0"
   2) 1) "name"
      2) "fxy"
      3) "age"
      4) "23"
# 删除特定消息
> xdel lyj 1572927022918-0
(integer) 1
# 删除整个Stream
> del lyj
(integer) 1
```

#### 独立消费

* Redis设计了单独的消费指令xread，可以将Stream当成普通消息队列（list）来使用，完全忽略消费组的存在

```bash
# 从Stream头部读取两条消息
> xread count 2 streams lyj 0-0
1) 1) "lyj"
   2) 1) 1) "1572930110971-0"
         2) 1) "name"
            2) "lyj"
            3) "age"
            4) "22"
      2) 1) "1572930118081-0"
         2) 1) "name"
            2) "fxy"
            3) "age"
            4) "23"
# 从Stream尾部读取一条消息
> xread count 1 streams lyj $
(nil)
# 从尾部等待新消息到来，等待1000ms，若无，返回nil；若设为0，则一直阻塞
> xread block 1000 count 1 streams lyj $
(nil)
(1.16s)
```

#### 创建消费组

```bash
# 表示从头部开始消费
> xgroup create lyj lyj-head 0-0
OK
# 表示从尾部开始消费，只接受新消息，忽略当前已有消息
> xgroup create lyj lyj-back $
OK
# 获取stream消息
> xinfo stream lyj
 1) "length"
 2) (integer) 3
 3) "radix-tree-keys"
 4) (integer) 1
 5) "radix-tree-nodes"
 6) (integer) 2
 7) "groups"
 8) (integer) 2
 9) "last-generated-id"
10) "1572930125815-0"
11) "first-entry"
12) 1) "1572930110971-0"
    2) 1) "name"
       2) "lyj"
       3) "age"
       4) "22"
13) "last-entry"
14) 1) "1572930125815-0"
    2) 1) "name"
       2) "jyt"
       3) "age"
       4) "21"
# 获取stream的消费组信息
> xinfo groups lyj
1) 1) "name"
   2) "lyj-back"
   3) "consumers"
   4) (integer) 0
   5) "pending"
   6) (integer) 0  # 该消费组没有正在处理的消息
   7) "last-delivered-id"
   8) "1572930125815-0"
2) 1) "name"
   2) "lyj-head"
   3) "consumers"
   4) (integer) 0
   5) "pending"
   6) (integer) 0
   7) "last-delivered-id"
   8) "0-0"
```

#### 消费

```bash
# > 号表示从当前消费组的last_delivered_id 后面开始读，每当消费者读取一条消息，last_delivered_id 前移
> xreadgroup GROUP lyj-head c1 count 1 streams lyj >
1) 1) "lyj"
   2) 1) 1) "1572930110971-0"
         2) 1) "name"
            2) "lyj"
            3) "age"
            4) "22"
# 读三条，实际返回两条，证明已经读完
> xreadgroup GROUP lyj-head c1 count 3 streams lyj >
1) 1) "lyj"
   2) 1) 1) "1572930118081-0"
         2) 1) "name"
            2) "fxy"
            3) "age"
            4) "23"
      2) 1) "1572930125815-0"
         2) 1) "name"
            2) "jyt"
            3) "age"
            4) "21"
# 再读就nil
> xreadgroup GROUP lyj-head c1 count 1 streams lyj >
(nil)
# 也可以阻塞读，同理，t=0则永久等待
> xreadgroup GROUP lyj-head c1 block 1000 count 1 streams lyj >
(nil)
(1.12s)
# 观察消费组信息
> xinfo groups lyj
1) 1) "name"
   2) "lyj-back"
   3) "consumers"
   4) (integer) 0
   5) "pending"
   6) (integer) 0
   7) "last-delivered-id"
   8) "1572930125815-0"
2) 1) "name"
   2) "lyj-head"
   3) "consumers"
   4) (integer) 1  # 1个消费者
   5) "pending"
   6) (integer) 3  # 3条正在处理的信息还没有ack
   7) "last-delivered-id"
   8) "1572930125815-0"
# 观察消费者信息
>  xinfo consumers lyj lyj-head
1) 1) "name"
   2) "c1"
   3) "pending"
   4) (integer) 3 # 共3条待处理消息
   5) "idle"
   6) (integer) 266137 # 空闲了多长时间ms没有读取消息
# ACK所有消息,可以清空PEL了
> xack lyj lyj-head 1572930110971-0 1572930118081-0 1572930125815-0
(integer) 3
```

#### 定长Stream

* 指定消息队列窗口大小，满了则淘汰掉老消息

```bash
> xadd lyj-fix maxlen 3 * name lyj age 23
"1572933264742-0"
```

## 无所不知——info指令

* info 指令显示的信息繁多，分为9大块，每一块都有非常多的参数

```bash
> info server # 服务器运行环境参数
# Server
redis_version:5.0.1
redis_git_sha1:00000000
redis_git_dirty:0
redis_build_id:3113f469cbe716d3
redis_mode:standalone
os:Darwin 17.7.0 x86_64
arch_bits:64
multiplexing_api:kqueue
atomicvar_api:atomic-builtin
gcc_version:4.2.1
process_id:30549
run_id:489d87e4062a88b4196b9d67933d3d82b61920f0
tcp_port:6379
uptime_in_seconds:3253267
uptime_in_days:37
hz:10
configured_hz:10
lru_clock:12652562
executable:/usr/local/opt/redis/bin/redis-server
config_file:/usr/local/etc/redis.conf

> info clients # 客户端相关信息
# Clients
connected_clients:1 # 通过观察数量来确定是否存在意料之外的连接，若不对劲，可以使用client list指令列出所有客户端链接地址的源头
client_recent_max_input_buffer:2
client_recent_max_output_buffer:0
blocked_clients:0

> info memory # 服务器运行内存统计数据
# Memory
used_memory:1038304
used_memory_human:1013.97K # 内存分配器从操作系统分配的内存总量，若单个Redis内存占用过大，考虑集群
used_memory_rss:2166784
used_memory_rss_human:2.07M # 操作系统看到的内存占用
used_memory_peak:4424192
used_memory_peak_human:4.22M # Redis内存消耗的峰值
used_memory_peak_perc:23.47%
used_memory_overhead:1036694
used_memory_startup:987008
used_memory_dataset:1610
used_memory_dataset_perc:3.14%
allocator_allocated:1004960
allocator_active:2128896
allocator_resident:2128896
total_system_memory:17179869184
total_system_memory_human:16.00G
used_memory_lua:37888
used_memory_lua_human:37.00K # lua脚本引擎占用的内存大小
used_memory_scripts:0
used_memory_scripts_human:0B
number_of_cached_scripts:0
maxmemory:0
maxmemory_human:0B
maxmemory_policy:noeviction
allocator_frag_ratio:2.12
allocator_frag_bytes:1123936
allocator_rss_ratio:1.00
allocator_rss_bytes:0
rss_overhead_ratio:1.02
rss_overhead_bytes:37888
mem_fragmentation_ratio:2.16
mem_fragmentation_bytes:1161824
mem_not_counted_for_evict:0
mem_replication_backlog:0
mem_clients_slaves:0
mem_clients_normal:49686
mem_aof_buffer:0
mem_allocator:libc
active_defrag_running:0
lazyfree_pending_objects:0

> info persistence # 持久化信息
# Persistence
loading:0
rdb_changes_since_last_save:1
rdb_bgsave_in_progress:0
rdb_last_save_time:1572933276
rdb_last_bgsave_status:ok
rdb_last_bgsave_time_sec:0
rdb_current_bgsave_time_sec:-1
rdb_last_cow_size:0
aof_enabled:0
aof_rewrite_in_progress:0
aof_rewrite_scheduled:0
aof_last_rewrite_time_sec:-1
aof_current_rewrite_time_sec:-1
aof_last_bgrewrite_status:ok
aof_last_write_status:ok
aof_last_cow_size:0

> info stats # 通用统计数据
# Stats
total_connections_received:508
total_commands_processed:1004020
instantaneous_ops_per_sec:0 # 所有客户端每秒发送到服务器的指令数，若OPS过高，可以通过monitor指令快速观察哪些key访问频繁，并进行业务优化，减少IO次数
total_net_input_bytes:45181681
total_net_output_bytes:5119095
instantaneous_input_kbps:0.00
instantaneous_output_kbps:0.00
rejected_connections:0 # 表示因为超过最大连接数限制而拒绝的客户端连接次数，若此数据过大，则意味服务器的最大连接数设置得过低，应调整maxclients参数
sync_full:0
sync_partial_ok:0
sync_partial_err:0 # 主从半同步复制失败次数，根据此次数决定是否需要扩大积压缓冲区
expired_keys:1
expired_stale_perc:0.00
expired_time_cap_reached_count:0
evicted_keys:0
keyspace_hits:41
keyspace_misses:1
pubsub_channels:0
pubsub_patterns:0
latest_fork_usec:721
migrate_cached_sockets:0
slave_expires_tracked_keys:0
active_defrag_hits:0
active_defrag_misses:0
active_defrag_key_hits:0
active_defrag_key_misses:0

> info replication # 主从复制相关信息
# Replication
role:master
connected_slaves:0
master_replid:194e73217111b2a3f6ea4ea531c6c0da44d2e844
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576 # 积压缓冲区大小，影响主从复制的效率，若经常出现修改指令且网络环境一般，则应适当调大积压缓冲区，避免进入全量同步模式，设为几十MB就够了，闲的话，设为几MB
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0

> info CPU # CPU使用情况
# CPU
used_cpu_sys:232.367308
used_cpu_user:172.890471
used_cpu_sys_children:0.035690
used_cpu_user_children:0.008318

> info cluster # 集群信息
# Cluster
cluster_enabled:0

> info keyspace # 键值对统计数量信息
# Keyspace
db0:keys=1,expires=0,avg_ttl=0
```

## 拾遗补漏——再谈分布式锁

* Sentinel集群中，若客户端A在主节点申请成功了一把锁后，主节点突然挂掉了，从节点还不知道A这个操作，然后Sentinel会将从节点变成主节点，客户端B过来请求加锁时，会成功，这样，同一把锁被两个客户端同时拥有，产生不安全性
* 仅在主从发生failover下产生，且时间极短，业务系统多数情况下可以容忍
* 为了解决这个问题，Antirez发明了RedLock算法，加锁时，向过半节点发送指令，过半节点set成功，就认为加锁成功，释放锁时，需要向所有节点发送del指令，而且，还需要考虑出错重试，时钟漂移等细节问题，故性能会下降，应该根据业务谨慎考虑是否使用RedLock

```bash
pip3 install redlock-py
```

```python
import redlock

addrs = [{
  "host": "localhost",
  "port": 6379,
  "db": 0
},{
  "host": "localhost",
  "port": 6479,
  "db": 0
},{
  "host": "localhost",
  "port": 6579,
  "db": 0
}]

dim = redlock.Redlock(addrs)
success = dim.lock("user-lock-lyj", 5000)
if success:
  print('lock success')
  dim.unlock('user-lock-lyj')
else:
  print('lock failed')
```

## 朝生暮死——过期策略

#### 过期的key集合

* Redis会将每个设置了过期时间的key放在一个独立的字典中，以后会定时遍历来删除到期的key，除了定时遍历外，还使用惰性策略删除过期的key，即访问此key时对过期时间进行检查，若过期就立即删除

#### 定时扫描策略

* Redis默认每秒进行10次过期扫描，但不会遍历字典中所有key，而是采用简单的贪心策略
  * （1）从过期字典中随机选取20个key
  * （2）删除这20个key中过期的key
  * （3）若过期key的比例超过25%，则重复步骤（1）
  * 业务人员应该防止同时出现大量key过期，因为这会持续扫描，内存管理器需要频繁回收内存页，产生卡顿，那么，会出现大量链接因为超时而关闭，业务端会出现很多异常。
  * 一种解决办法是在目标过期时间上增加一天的随机时间``redis.expire_at(key, random.randint(86400) + expire_ts)``

#### 从节点的过期策略

* 从节点不会进行过期扫描，主节点在key到期时，会在AOF文件里增加一条del指令，同步到所有从节点，从节点通过执行del指令来删除过期的key，可能导致主从数据的不一致，加上redlock对应的问题，可能会带来安全问题

## 优胜劣汰——LRU

* Redis内存超出物理内存限制时，内存数据会和磁盘产生频繁交换，使Redis性能急剧下降
* 生产环境中不允许Redis出现交换行为，为了限制最大使用内存，Redis提供配置参数maxmemory来限制内存超出期望大小
* 当实际内存超出maxmemory时，Redis提供几种可选策略
  * noeviction（默认）：不会继续服务写请求（del除外），读请求可以继续进行，保证不会丢失数据
  * volatile-lru：尝试淘汰设置了过期时间的key，最少使用的key优先被淘汰，没有设置过期时间的key不会被淘汰
  * volatile-ttl：比较key的剩余寿命ttl的值，值越小，优先淘汰
  * volatile-random：淘汰过期key集合中的随机key
  * allkeys-lru：全体key集合中最少被使用的优先淘汰
  * allkeys-random：全体key集合中随机淘汰
* 若只拿Redis作缓存，应该使用allkeys-*策略，客户端写缓存时不必携带过期时间；若同时使用Redis的持久化功能，则使用volatile-\*策略，这样可以保留没有设置过期时间的key，它们是永久的key，不会被LRU算法淘汰

#### 近似LRU算法

* Redis为每个key增加了24bit的小字段，记录最后一次被访问的时间戳
* 当Redis执行写操作时，发现内存超出maxmemory，就执行一次LRU淘汰算法，随机采样出5（可设置maxmemory_samples）个key，淘汰掉最旧的key，如此反复，直到内存低于maxmemonry

## 平波缓进——懒惰删除

* Redis内部有几个异步线程专门来处理一些耗时操作，实际上并非完全单线程
* 删除指令del会释放对象的内存，大部分情况下都非常快，但当key是一个大对象时，删除操作会导致单线程卡顿
* 为了解决这个问题，Redis4.0引入了unlink指令，能对删除操作进行懒处理，丢给后台线程来异步回收内存，且unlink之后，主线程将无法再访问到key，不会出现线程问题；不是所有的unlink操作都会延后处理，当key占用的内存较小，会立即回收，等价于del

```bash
> unlink key
OK
```

* Redis提供了flushdb和flushall来清空数据库，也是慢操作，Redis4.0同样提供了异步化的指令

```
> flushall async
OK
```

* Redis需要每秒1次同步AOF日志到磁盘，确保信息尽量不丢失，需要调用sync函数，操作耗时，会导致主线程效率下降，所以，执行AOF sync操作的线程是另一个独立的异步线程
* Redis4.0也为以下删除点带来了异步删除机制
  * slave-lazy-flush： 从节点接受完rdb文件后的flush操作
  * lazyfree-lazy-eviction: 内存达到maxmemory时进行淘汰
  * lazyfree-lazy-expire key：过期删除
  * lazyfree-lazy-server-del rename：指令删除destKey

## 妙手仁心——优雅使用Jedis

* 我不懂Java，想看的话自己看书去

## 居安思危——保护Redis

#### 指令安全

* Redis有一些危险指令，一是像keys指令会卡顿Redis，二是像flushdb，flushall指令会清空redis所有数据，误操作可能带来灾难性后果
* Redis在配置文件中提供了rename-command指令用于将某些危险的指令修改成特别的名称

```bash
rename-command keys keysabc # 需要输入keysabc才能执行keys方法
rename-command flushall "" # rename成空串，无法再执行flushall方法
```

#### 端口安全

* Redis配置文件中应该指定监听的IP地址，避免外网直接访问

```bash
bind 10.100.20.13
```

* 可以增加密码访问限制，客户端必须使用auth指令，传入正确的密码才能访问Redis，密码控制会影响从节点复制，从节点也需要配置相应项

```bash
# 主节点
requirepass 123456
# 从节点
masterauth 123456
```

#### Lua 脚本安全

* 禁止Lua脚本由用户输入的内容（UGC）生成，因为黑客有可能植入恶意代码提权
* Redis应该以普通用户身份启动，被hack后也不会丢失root权限

#### SSL代理

* Redis不支持SSL链接，若数据在公网上传输，可能有被窃听的风险，可以考虑使用SSL代理，在客户端与服务器连接之间以及跨机房的主从节点间使用
* Redis官方推荐spiped工具

## 隔墙有耳——Redis安全通信

#### spiped原理

* spiped会在客户端和服务器各启动一个spiped进程，作为传输中间件
* 每一个spiped进程会有一个监听端口用来接收数据，同时还会作为客户端发送数据
* spiped进程需要成对出现，相互之间需要使用相同的共享密钥来加密消息
* spiped可以同时支持多个客户端链接的数据转发工作，能通过参数限定最大连接数，但对于服务器spiped，不能同时支持多个服务器之间的转发，意味着集群环境下，需要为每一个server节点启动一个spiped进程来接收消息，会带来繁琐的运维实践

#### spiped使用入门

##### 安装

###### mac安装

```bash
> brew install spiped
```

###### linux安装

```bash
> apt-get install spiped
> yum install spiped
```

###### docker安装

```bash
> docker run -d -p127.0.0.1:6379:6379 --name redis-server-6379 redis
```

##### 生成随机密钥文件

```bash
> dd if=/dev/urandom bs=32 count=1 of=spiped.key
> ls -l
(能看到spiped.key文件)
```

##### 使用密钥文件启动服务器spiped进程

```bash
# -d 表示decrypt（对输入数据进行解密） -s 为源监听地址，-t 为转发目标地址，172那串是公网IP
> spiped -d -s '[172.16.128.81]:6479' -t '[127.0.0.1]:6379' -k spiped.key

# 这个spiped进程监听公网IP的6479端口接收公网上的数据，将数据解密后转发到本机回环地址的6379端口，即redis-server监听的端口
> ps -ef|grep spiped
(能看到东西)
```

##### 使用密钥文件启动客户端spiped进程

```bash
# -e 表示encrypt（对输入数据进行加密）
> spiped -e -s '[127.0.0.1]:6579' -t '[172.16.128.81]:6479' -k spiped.key

# 这个spiped进程监听本机回环地址的6579端口，将接收到的数据加密后转发到spiped的服务器进程
> ps -ef|grep spiped
(能看到两个东西)
```

##### 启动客户端连接

```python
>>> import redis
# 若直接连接6379端口，会出现读超时
>>> c = redis.StrictRedis(host="localhost", port=6579)
>>> c.ping()
PONG
```

