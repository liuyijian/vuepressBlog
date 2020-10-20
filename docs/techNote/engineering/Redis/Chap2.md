# Chap2 原理

## 线程IO模型

* Redis和Nodejs，Nginx一样，都是单线程程序
* Redis所有数据都在内存中，运算速度是内存级别的，故要避免一些O(n)的指令导致卡顿
* Redis会将每个客户端套接字都关联一个指令队列，客户端的指令通过队列来排队进行顺序处理，先到先服务
* Redis同样为每个客户端套接字关联一个响应队列，Redis服务器通过响应队列来将指令的返回结果回复给客户端，若队列为空，意味着链接暂时处于空闲状态，不需要获取写事件，可以将当前客户端描述符从write-fds里面移出来，等到队列有数据了，再将描述符放进去，避免select系统调用立即返回写事件，结果发现无数据可写，令CPU消耗飙升
* Redis的定时任务记录在一个称为最小堆的数据结构中，最快要执行的任务排在最上方，在每个循环周期里，Redis对最小堆里面已经到时间点的任务进行处理，处理完毕后，将最快要执行的任务还需要的时间记录下来，这个时间就是select系统调用的timeout参数，Redis知道未来一段时间没有定时任务要处理，就可以安心睡眠timeout的值的时间

## 通信协议

* 数据库瓶颈一般不在于网络流量，而在于数据库本身内部处理逻辑，故Redis使用了浪费流量的文本协议，单节点跑慢一个CPU核心下，可达到10w/s的超高QPS
* Redis序列化协议RESP将传输的结构数据分为5个最小单元类型，单元结束时统一加上回车换行符号``\r\n``
  * 1、单行字符串以+号开头
    *  ``+hello world\r\n``
  * 2、多行字符串以$号开头，后跟字符串长度 
    * ``$11\r\nhello world\r\n``
    * NULL用多行字符串表示 ``$-1\r\n``
    * 空串用多行字符串表示``$0\r\n\r\n``
  * 3、整数值以:号开头，后跟整数的字符串形式
    * ``:1024\r\n``
  * 4、错误消息以-号开头
    * ``-WRONGTYPE Operation against a key holding the wrong kind of value\r\n``
  * 5、数组以 * 号开头，后跟数组的长度
    * ``*3\r\n:1\r\r:2\r\n:3\r\n``

## 持久化

* Redis持久化机制有两种
  * 快照（snapshot）：
    * 一次全量备份
    * 是内存数据的二进制序列化，在存储上非常紧凑
    * 使用操作系统的多进程COW（Copy On Write）机制实现
  * AOF日志：
    * 连续增量备份
    * Redis收到客户端修改指令后，进行参数校验、逻辑处理、若没问题，就立即将指令文本存储到AOF日志中（先执行，再存盘）
    * 数据库重启时需要加载AOF日志进行指令重放，时间漫长，故需要定期重写AOF日志完成瘦身效果
    * 若机器宕机，日志内容没来得及写回磁盘，会出现日志丢失，通过linux的glibc提供的fsync函数可以将指定文件的内容强制从内核缓存到磁盘，在生产环境中，一般每隔1s执行一次fsync操作，此值可根据性能和安全性做出折衷的自定义配置
* 运维
  * 快照通过子进程进行，比较耗资源，AOF的fsync也是耗时的IO操作
  * 通常Redis的主节点不会进行持久化操作，而在从节点进行
* 混合持久化
  * 重启Redis时，用rdb恢复内存会丢失大量数据，我们通常使用AOF日志重放，但又太慢了
  * Redis4.0为了解决这个问题，将rdb文件的内容和增量的AOF日志文件存在一起，于是Redis重启时，可以先加载rdb的内容，然后再重放增量AOF日志，提升效率

## 管道

* Redis管道技术本质上是由客户端提供的，与服务器没啥关系
* 管道操作的本质是客户端通过对管道中的指令列表改变读写顺序以大幅度节省IO时间
  * 正常连续执行多条指令，顺序是request-response-request-response，客户端经历了write-read-write-read过程，现在将其调整为 write-write-read-read
  * 两个连续的写操作和两个连续的读操作只花费一次网络来回
* 使用redis自带的压力测试工具redis-benchmark进行性能测试（机子为macbook pro 2018）

```bash
> redis-benchmark -t set -q
SET: 96153.85 requests per second
> redis-benchmark -t set -P 2 -q # 增加了P参数，表示单个管道内并行的请求数量
SET: 182481.77 requests per second
# P参数继续提升，终有一天会因为CPU处理能力而到达瓶颈
```

* 深入理解管道本质
  * 网络传输流程
    * 1、客户端进程调用write将信息写到操作系统内核为套接字分配的发送缓冲send buffer中
    * 2、客户端操作系统内核将发送缓冲的内容发送到网卡，网卡硬件将数据通过网际路由送到服务器的网卡
    * 3、服务器操作系统内核将网卡的数据放到内核为套接字分配的接收缓冲recv buffer中
    * 4、服务器进程调用read从接收缓冲中取出消息进行处理
    * 5、服务器进程调用write将响应消息写到内核为套接字分配的发送缓冲send buffer中
    * 6、服务器操作系统内核将发送缓冲的内容发送到网卡，网卡硬件将数据通过网际路由送到客户端的网卡
    * 7、客户端操作系统内核将网卡数据放到内核为套接字分配的接收缓冲recv buffer中
    * 8、客户端进程调用read 从接收缓冲中取出消息返回给上层业务逻辑进行处理
  * write操作的耗时在于等待缓冲空出空闲空间，read操作的耗时在于等待数据到来，使缓冲不为空；故连续的write操作根本没有耗时

## 事务

* Redis事务指令分别是multi（指示事务开始），exec（指示事务执行），discard（丢弃事务缓存队列中的所有指令，在exec执行之前）

```bash
> multi
OK
> incr books
QUEUED
> incr books
QUEUED
> exec # 服务器一旦收到exec指令，才开始整个事务队列，执行完毕后一次返回所有指令的运行结果
(integer) 1
(integer) 2
```

* Redis的事务不具备原子性，仅仅满足事务的隔离性中的串行化——当前执行的事务有着不被其他事务打断的权利（事务在遇到执行指令失败后，后面的指令还会继续执行，下面是一个例子）

```bash
> multi
OK
> set books java
QUEUED
> incr books
QUEUED
> set poorman Ben
QUEUED
> exec
1) OK
2) (error) ERR value is not an integer or out of range
3) OK
> get books
"java"
> get poorman
"Ben"
```

* 通常Redis的客户端在执行事务时都会结合pipeline一起使用，可以将多次IO操作压缩为单次

```python
import redis
pipe = redis.pipeline(transaction=True)
pipe.multi()
pipe.incr("books")
pipe.incr("books")
value = pipe.execute()
```

* Redis提供watch机制，是一种乐观锁
  * watch会在事务开始之前盯住变量，当事务执行时，Redis会检查关键变量自watch之后是否被修改，若关键变量已经被修改，exec指令会返回NULL回复告知客户端事务执行失败，此时客户端一般会选择重试
  * 禁止在multi和exec之间使用watch指令，必须在multi之前盯住关键变量

```python
while True:
	do_watch()
  commands()
  multi()
  send_commands()
  try:
    exec()
    break
  except WatchError:
    continue
```

```bash
> watch books
OK
> incr books # 被修改了
(integer) 1
> multi
OK
> incr books
QUEUED
> exec # 事务执行失败
(nil)
```

```python
import redis

def key_for(user_id):
  return "account_{}".format(user_id)

def double_account(client, user_id):
  key = key_for(user_id)
  while True:
    client.watch(key)
    value = int(client.get(key))
    value *= 2
    pipe = client.pipeline(transaction=True)
    pipe.multi()
    pipe.set(key, value)
    try:
      pipe.execute()
      break
    except redis.WatchError:
      continue
  return int(client.get(key))

client = redis.StrictRedis()
user_id = "abc"
client.setnx(key_for(user_id), 5)
print(double_account(client, user_id))
```

## 小道消息——PubSub

* 消息多播允许生产者只生产一次消息，由中间件负责将消息复制到多个消息队列，每个消息队列由相应的消费组进行消费，这是分布式系统常用的解耦方式
* PublisherSubscriber（发布者/订阅者模式）代码
  * 必须先启动消费者，然后再执行生产者
  * 消费者可以启动多个，PubSub保证它们收到相同的消息序列

* 消费者

```python
import time
import redis

client = redis.StrictRedis()
p = client.pubsub()
p.subscribe('lyj')
# 休眠轮询可能导致消息处理不及时
while True:
  msg = p.get_message()
  if not msg:
    time.sleep(1)
    continue
   print(msg)
# 使用阻塞监听的办法来改进
for msg in p.listen():
  print(msg)
```

* 生产者

```python
import redis

client = redis.StrictRedis()
client.publish('lyj', 'java')
client.publish('lyj', 'python')
client.publish('lyj', 'go')
```

* Redis提供了模式订阅功能Pattern Subscribe，``psubscribe lyj.*``，这样即使生产者新增加了同模式的主题，如lyj.image，消费者也可以立即收到消息
* data是消息内容字符串，channel表示当前订阅主题的名称，type表示消息类型，若是普通类型，就是message，若是控制消息，比如订阅指令的反馈，它的类型就是subscribe，若是模式订阅的反馈，它的类型就是psubscribe，此外，还有取消订阅指令的反馈``unsubscribe``和``punsubscribe``

```python
{'pattern':None, 'type':'subscribe', 'channel':'lyj', 'data':'python'}
```

* pubsub的缺点
  * 若没有消费者，消息会被直接丢弃；
  * 消费者断线重连，会丢失消息
  * redis停机重启，所有消息直接被丢弃
* 2018年6月Redis5.0新增了Stream数据结构，为Redis带来持久化消息队列的功能（mmp！害我看那么久）

## 小对象压缩

* Redis若使用32bit进行编译，内部所有数据结构所使用的指针空间占用会少一半，若你的Redis使用内存小于4G，考虑使用此法节约内存，4G作为小站的缓存绰绰有余，不足还能通过增加实例来解决

* 若Redis内部管理的集合数据结构很小，它会使用紧凑存储形式压缩存储
* Redis并不总是将空闲内存立即归还给操作系统，好比，来看戏的人坐不下就加凳子，看完一场凳子暂时不收，等下一波观众来；Redis为了保存自身结构的简单性，将内存分配的细节丢给第三方库去实现，目前使用jemalloc库来管理内存,可使用``info memory``指令来查看具体信息

