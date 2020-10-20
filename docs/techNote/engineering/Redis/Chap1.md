# Chap 1 基础和应用

## 简介

##### 背景简介

* Redis （Remote Dictionary Service 远程字典服务），是当今使用最广泛的存储中间件
* 性能高、文档好、源码易懂、客户端支持丰富
* 系统并发量没到一定量级基本不会用上
* 由意大利人Antirez开发，四十多岁的老男人，Redis默认端口6379对应手机键盘的MERZ，是愚蠢的意思

##### 业务功能简介

* 1、记录帖子点赞数、评论数、点击数（hash）
* 2、记录用户帖子ID列表（排序），便于快速显示用户的帖子列表（zset）
* 3、记录帖子的标题、摘要、作者和封面信息，用于列表页展示（hash）

* 4、缓存近期热帖内容，减少数据库压力
* 5、收藏集和帖子之间的关系
* 6、缓存用户行为历史、过滤恶意行为（zset、hash）

##### 安装

###### docker

```bash
docker pull redis
docker run --name myredis -d -p6379:6379 redis
docker exec -it myredis redis-cli
```

###### linux

```bash
brew install redis    # for mac
apt-get install redis # for ubuntu
yum install redis			# for redhat
redis-cli             # 运行客户端
```

## 5种基础数据结构

以唯一key字符串名称获取相应的value数据，不同类型数据结构的差异在于value的结构不一样

##### string字符串

* 动态字符串，采用预分配冗余空间方式减少内存频繁分配
* 当字符长度小于1MB时，每次扩容翻倍，若字符串超过1MB，每次扩容增加1MB
* 字符串最大长度为512MB

```bash
# 键值对
> set name hello
OK
> get name
"hello"
> exists name
(integer) 1
> del name
(integer) 1
> get name
(nil)
# 批量键值对 （节省网络耗时开销）
> mset name1 boy name2 girl name3 unknown
> mget name1 name2 name3
1) "boy"
2) "girl"
3) "unknown"
# 设置key的过期时间
> set name hello
OK
> expire name 5   # 5s后过期，再get就是nil了
> setex name 5 hello  # 等价于set+expire
> ttl name # 查看剩余时间
(integer) 4
> set name hello2
OK
> ttl name # 若用set方法修改一个字符串，则它的过期时间会消失
(integer) -1
# 唯一创建
> setnx name hello 
(integer) 1
> setnx name hello2
(integer) 0 # 因为name已经存在，所以创建不成功
# 计数
> set age 30 # 若value是一个整数，可以进行自增操作，范围是signed long，越界会报错
OK
> incr age
(integer) 31
> incrby age 5
(integer) 36
> incrby age -5
(integer) 31
```

##### list列表

* 相当于Java中的LinkedList，是链表而非数组
* 插入和删除操作为O(1)，索引定位很慢，为O(n)
* 列表中每个元素都使用双向指针顺序，支持前后向遍历
* 列表元素个数为零时，自动回收内存
* 常用于异步队列，将需要延后处理的任务结构体序列化成字符串，塞进Redis的列表，另一个线程从列表中轮询数据进行处理
* 列表元素较少时，会使用一块连续的内存存储，结构称为ziplist
* 当数据量增多时，才会改成quicklist，将多个ziplist使用双向指针串起来使用

```bash
# 右进左出：队列
> rpush books python java golang
(integer) 3
> llen books
(integer) 3
> lpop books
"python"
> lpop books
"java"
> lpop books
"golang"
> lpop books
(nil)
# 右进右出：栈
> rpush books python java golang
(integer) 3
> rpop books
"golang"
> rpop books
"java"
> rpop books
"python"
> rpop books
(nil)
# 慢操作
> rpush books python java golang
(integer) 3
> lindex books 1 # O(n)慎用
"java"
> lrange books 0 -1 # 获取所有元素，O(n)慎用
1) "python"
2) "java"
3) "golang"
> ltrim books 1 -1 # 定义一个区间，去裁剪列表，O(n)慎用
OK
> lrange books 0 -1 
1) "java"
2) "golang"
> ltrim books 1 0 # 其实清空了列表
OK
> llen books
(integer) 0
```

##### hash字典

* 相当于Java中的HashMap，是无序字典，是“数组+链表”的二维结构
* redis的字典的值只能是字符串
* java的rehash一次性全部rehash，而redis为了追求高性能，采用渐进式rehash策略，即会保留新旧两个hash结构，查询同时查，在后续的定时任务以及hash操作指令中，循序渐进从旧结构往新结构迁移
* hash结构可用于存储用户信息，且可以分字段单独存储，若以字符串形式保存用户信息的话，就不能按需获取，浪费网络流量；但是hash的存储消耗高于单个字符串，所以怎么存，是一个balance

```bash
> hset books java "think in java" # 若命令行的字符串包含空格，需要引号引起来
(integer) 1
> hset books golang "concurrency in go"
(integer) 1
> hset books python "python cookbook"
(integer) 1
> hgetall books # key和value间隔出现
1) "java"
2) "think in java"
3) "golang"
4) "concurrency in go"
5) "python"
6) "python cookbook"
> hlen books
(integer) 3
> hget books java
"think in java"
> hset books golang "learning go" # 更新操作
(integer) 0
> hmset books java "think in java" golang "concurrency in go" python "python cookbook"
OK
> hset user-lyj age 22 #lyj 老了一岁
(integer) 1
> hincrby user-lyj age 1
(integer) 23
```

##### set集合

* 相当于Java中的HashSet，内部键值对无序、唯一

```bash
> sadd books python
(integer) 1
> sadd books python # 重复
(integer) 0
> sadd books java golang
(integer) 2
> smembers books # 无序的
1) "java"
2) "python"
3) "golang"
> sismember books java
(integer) 1
> sismember books rust
(integer) 0
> scard books # 获取长度
(integer) 3
> spop books # 弹出一个
"java"
```

##### zset有序集合

* 类似Java的SortedSet和HashMap的结合体
* 对每个value赋予一个score，代表这个value的排序权重
* 内部实现使用“跳跃列表的方式”

```bash
> zadd books 9.0 "think in java"
(integer) 1
> zadd books 8.9 "java concurrency"
(integer) 1
> zadd books 8.6 "java cookbook"
(integer) 1
> zrange books 0 -1 # 参数区间为排名范围
1) "java cookbook"
2) "java concurrency"
3) "think in java"
> zrevrange books 0 -1 # 按score逆序输出
1) "think in java"
2) "java concurrency"
3) "java cookbook"
> zcard books
(integer) 3
> zscore books "java concurrency" # 获取指定value的score，score用double类型存储
"8.900000004"
> zrank books "java concurrency" # 排名
(integer) 1
> zrangebyscore books 0 8.91 # 根据分值区间遍历zset
1) "java cookbook"
2) "java concurrency"
> zrangebyscore books -inf 8.91 withscores
1) "java cookbook"
2) "8.59999999996"
3) "java concurrency"
4) "8.90000000004"
> zrem books "java concurrency" # 删除value
(integer) 1
```

## 分布式锁

* 原子操作：不会被线程调度机制打断的操作
* 分布式锁实现的目标就是挖坑占坑弃坑

* redis分布式锁不能解决超时问题，不适用于时间较长的任务

```bash
> set lock:name true ex 5 nx #若能拿到锁，拿5秒，之后自动释放，不会导致死锁
OK
... do something critical
> del lock:name
```

* 可重入性是指线程在持有锁的情况下再次请求加锁，如Java中的ReentrantLock
* 若Redis分布式锁要支持可重入，需要对客户端的set方法进行包装，使用线程的ThreadLocal变量存储当前持有锁的计数（比较复杂，一般不建议使用，下面是一个demo）

```python
import redis
import threading

locks = threading.local()
locks.redis = {}

def key_for(user_id):
  return "account_{}".format(user_id)

def _lock(client, key):
  return bool(client.set(key, True, nx=True, ex=5))

def _unlock(client, key):
  client.delete(key)

def lock(client, user_id):
  key = key_for(user_id)
  if key in locks.redis:
    locks.redis[key] += 1
    return True
  ok = _lock(client, key)
  if not ok:
    return False
  locks.redis[key] = 1
  return True

def unlock(client, user_id):
  key = key_for(user_id)
  if key in locks.redis:
    locks.redis[key] -= 1
    if locks.redis[key] <= 0:
      del lock.redis[key]
    return True
  return False

client = redis.StrictRedis()
print("lock", lock(client, "name"))
print("lock", lock(client, "name"))
print("unlock", unlock(client, "name"))
print("unlock", unlock(client, "name"))
```

## 延时队列

##### 异步消息队列

* RabbitMQ和Kafka是专业的消息队列中间件，但应用起来相对复杂
* 对于只有一组消费者的消息队列，使用Redis即可，但没有ack保证

* 使用阻塞读的方法 ``blpop/brpop``，在队列没有数据的时候，会立即进入休眠状态，数据到来即苏醒，消息延迟几乎为零，但若数据迟迟未到，客户端链接将被服务器主动断开，会抛出异常，故客户端逻辑应该捕获异常后继续尝试

##### 延时队列的实现

* 通过zset来实现。将消息序列化成一个字符串作为zset的value，这个消息的到期处理时间作为score，然后用多个线程轮询zset获取到期任务进行处理。多线程是为了保障可用性，但同时也要考虑并发争抢任务的问题。

```python
def delay(msg):
  msg.id = str(uuid.uuid4())
	value = json.dumps(msg)
  retry_ts = time.time() + 5
  redis.zadd("delay-queue", retry_ts, value)

def loop():
  while True:
    # 最多取一条
    values = redis.zrangebyscore("delay-queue", 0, time.time(), start=0, num=1)
    if not values:
      time.sleep(1)
      continue
    value = values[0] # 拿第一条，也只有一条
    success = redis.zrem("delay-queue", value) # loop方法可能被多线程进程调用，zrem决定谁处理消息
    if success:
      # 因为有多进程并发的可能，最终只有一个进程可以抢到消息
      msg = json.loads(value)
      # 要对handle_msg方法进行异常捕获
      handle_msg(msg)
```

* 上面实现中，同一个任务可能会被多个进程取到之后再使用zrem进行争抢，那些没抢到的进程都白取了一次任务，这是浪费，可使用lua scripting优化逻辑，将zrangebyscore和zrem一同挪到服务器端进行原子化操作，避免浪费的发生

## 位图

* 位图的内容其实是普通的字符串，byte数组，只不过是赋予的意义不一样，能大大节省存储空间
* Redis的位数组是自动扩展的，若设置了某个偏移位置超出了现有的内容范围，自动将位数组按零填充

```bash
>>> bin(ord('h'))
'0b1101000'   # 高 -> 低
# 零存整取
> setbit s 1 1
(integer) 0
> setbit s 2 1
(integer) 0
> setbit s 4 1
(integer) 0
> get s
"h"
# 整存零取
> set w h
(integer) 0
> getbit w 1
(integer) 1
> getbit w 2
(integer) 1
> getbit w 5
(integer) 0
# 位图统计
> set w hello
OK
> bitcount w # 统计指定范围内1的位数
(integer) 21
> bitcount w 0 0 # 第一个字符中1的位数
(integer) 3
> bitcount w 0 1 # 前两个字符中1的位数
(integer) 7
# 位图查找
> bitpos w 0 # 第一个0位
(integer) 0
> bitpos w 1 # 第一个1位
(integer) 1
> bitpos w 1 1 1 # 从第二个字符算起，第一个1位 ,后面是范围参数[start, end]
(integer) 9
> bitpos w 1 2 2 # 从第三个字符算起
(integer) 17
# 魔术指令bitfield
> set w hello  # 01101000 01100101
OK
> bitfield w get u4 0 # 从第一个位开始取4个位，结果是无符号数（u） (0110)
(integer) 6
> bitfield w get u3 2 # 从第三个位开始取3个位，结果是无符号数（u）（101）
(integer) 5
> bitfield w get i4 0 # 结果为有符号数,有符号数最多可以取64位，无符号数最多可以取63位
1）(integer) 6
> bitfield w get i3 2
(integer) -3
> bitfield w get u4 0 get u3 2 get i3 2 # 一次执行多个子指令
1) (integer) 6
2) (integer) 5
3) (integer) 6
4) (integer) -3
> bitfield w set u8 8 97 # 从第9个位开始，接下来的8位用无符号数97替换
1) (integer) 101
> get w
"hallo"
> set w hello
OK
> bitfield w incrby u4 2 1 # 从第3个位开始，对接下来的4位无符号数 +1
1) (integer) 11
# ... 重复5次之后，下面三种是并行的

> bitfield w incrby u4 2 1 # 溢出折返了，默认是折返（wrap），还可以选择失败（fail），以及饱和截断（sat），超出范围则停留在最大最小值处
1) (integer) 0
> bitfield w overflow sat incrby u4 2 1
(integer) 15
> bitfield w overflow fail incrby u4 2 1 # 不执行
(nil)
```

## 四两拨千斤——HyperLogLog

* HyperLogLog提供不精确的去重计数方案，虽然不精确，但标准误差是0.81%，能满足UV统计需求
* 使用sadd加scard方法是简单可行的，但量大会浪费空间
* 等价地，使用pfadd将用户ID塞进去，然后用pfcount指令统计个数
* 使用pfmerge指令将多个计数值累加在一起形成一个新的pf值
* HyperLogLog数据结构需要12KB的存储空间，不适合统计单个用户相关的数据，但Redis对它做了优化，计数较小时使用稀疏矩阵存储，当超过阈值时才会转为稠密矩阵，真正需要12KB空间
* why 12KB？
  * 给定一系列随机整数，记录低位连续零位的最大长度K，通过K值估算随机数数量N，通过实验得知 $ N\approx 2^K$
  * HyperLogLog使用16384个桶来计数，每个桶的maxbits需要6个bit来存储，最大可以表示maxbits=63，总占用内存是 $2^{14} \times 6 \  / \ 8 = 12KB$
  * 详细数学原理参考[这里](https://www.cnblogs.com/linguanh/p/10460421.html)

```python
import math
import random

# 计算低位零个数
def low_zeros(value):
  for i in range(1,32):
    if value >> i << i != value:
      break
  return i-1

# 通过随机数记录最大的低位零的个数
class BitKeeper(object):
  def __init__(self):
    self.maxbits = 0
  def random(self):
    value = random.randint(0,2**32-1)
    bits = low_zeros(value)
    if bits > self.maxbits:
    	self.maxbits = bits

class Experiment(object):
  def __init__(self, n, k=1024):
    self.n = n
    self.keepers = [BitKeeper() for i in range(k)]
  def do(self):
    for i in range(self.n):
      m = random.randint(0, 1 << 32 - 1)
      keeper = self.keepers[((m & 0xfff0000) >> 16) % len(self.keepers)]
      keeper.random(m)
  def estimate(self):
    # 使用调和平均
    sumbits_inverse = 0 # 零位数倒数
    for keeper in self.keepers:
      sumbits_inverse += 1.0 / float(keeper.maxbits)
    avgbits = float(self.k) / sumbits_inverse # 平均零位数
    return 2 ** avgbits * self.k # 根据桶的数量对估计值进行放大
    
# 实验误差均在10%以内，真实的HyperLogLog更复杂更精确
for i in range(1000,100000,100):
  exp = Experiment(i)
  exp.do()
  est = exp.estimate()
  print(i, '%.2f' % est, '%.2f' % (abs(est-i)/i) )
```

## 布隆过滤器

* HyperLogLog能进行估数，但我们无法判断一个值是否已经在HyperLogLog结构中

* 新闻客户端推荐系统如何实现推送去重呢？

  * 服务器记录用户历史然后筛选过滤？-- 频繁查询数据库会扛不住
  * 缓存？ --需要线性增长的存储空间，迟早爆炸
  * 使用BloomFilter， 能起到去重作用，空间上节省90%，但存在误判概率：它说你在，你可能不在，但它说你不在，你就一定不在；故能准确过滤掉用户已经看过的内容，保证100%去重推荐
  * 原理是每个值都使用多个哈希函数分到不同位置，置位为1；检查值是否存在时，就检查这些位置是否均为1，均为1则说明可能在（因为这些位可能被其他哈希函数共享），若不为1则一定不在，故需要根据元素的量来预留空间，来维持较低的错误率，这是个balance

* 空间占用估计

  * 布隆过滤器有两个参数输入，第一个是预计元素的数量n，第二个是错误率f；得到两个输出，第一个是位数组的长度l，第二个输出是hash函数的最佳数量k
  * $k = 0.7 * (l / n)$  $f = 0.6185 ^ {l/n}$
  * [具体计算网站](https://krisives.github.io/bloom-calculator)

  * 当实际元素超出预计元素时，引入参数 $t$ 表示实际元素和预计元素的倍数，则错误率为 $f = (1-0.5^t)^k$，当 $t = 1 ～ 2$ 的过程中，f从0.1%～5%，从1%～15%，从10%～40%

## 断尾求生——简单限流

* 控制流量，控制用户行为，避免垃圾请求，如一分钟最多调用10次接口，用zset结构记录用户行为历史，一个用户一个zset，每一个行为作为一个key保存下来

```python
import time
import redis

client = redis.StrictRedis()

def is_action_allowed(user_id, action_key, period, max_count):
  key = 'hist:%s:%s' % (user_id, action_key)
  now_ts = int(time.time() * 1000) # 毫秒时间戳
  with client.pipeline() as pipe:
    # value和score都使用毫秒时间戳
    pipe.zadd(key, now_ts, now_ts)
    # 移除时间窗口前的行为记录，剩下时间窗口内
    pipe.zremrangebyscore(key, 0, now_ts - period * 1000)
    # 获取窗口内的行为数量
    pipe.zcard(key)
    # 设置zset过期时间，避免冷用户持续占用内存， 过期时间应该等于时间窗口长度，再多宽限1s
    pipe.expire(key, period+1)
    # 批量执行
    _, _, current_count, _ = pipe.execute()
  # 比较数量是否超标
  return current_count <= max_count

for i in range(20):
  print(is_action_allowed("lyj", "reply", 60, 5))    
```

## 一毛不拔——漏斗限流

* 漏斗容量有限，若出水速率大于进水速率，就永远装不满；反之，则需要暂停进水等待漏斗腾出一部分空间
* 漏斗的剩余空间代表当前行为可持续进行的数量，漏嘴的流水速率代表系统允许该行为的最大速率
* 下面是一个单机版的漏斗限流算法

```python
import time

class Funnel(object):
  def __init__(self, capacity, leaking_rate):
    self.capacity = capacity # 漏斗容量
    self.leaking_rate = leaking_rate # 漏嘴流水速率
    self.left_quota = capacity # 漏斗剩余空间
    self.leaking_ts = time.time() # 上一次漏水时间
  
  def make_space(self):
    now_ts = time.time()
    delta_ts = now_ts - self.leaking_ts
    delta_quota = delta_ts * self.leaking_rate
    if delta_quota > 1: # 已经腾出了足够的空间
      self.left_quota += delta_quota # 增加剩余空间
      self.leaking_ts = now_ts # 记录漏水时间
    # 剩余空间不得高于容量 
    self.left_quota = min(self.left_quota, self.capacity)
  
  def watering(self, quota):
    self.make_space()
    if self.left_quota >= quota:
        self.left_quota -= quota
        return True
    return False

# 所有的漏斗集合
funnels = {}

def is_action_allowed(user_id, action_key, capacity, leaking_rate):
  key = '%s:%s' % (user_id, action_key)
  funnel = funnels.get(key)
  if not funnel:
    funnel = Funnel(capacity, leaking_rate)
    funnels[key] = funnel
  return funnel.watering(1)

for i in range(20):
  time.sleep(0.3)
  print(is_action_allowed('lyj', 'reply', 5, 0.5))
```

* Redis4.0提供了一个限流Redis模块，叫做``Redis-Cell``，该模块只有一条指令``cl.throttle``，用法如下

```bash
> cl.throttle lyj:reply 15 30 60 1 # 漏斗初始容量15单位，漏水速率为30单位/60秒，每次操作灌水1个单位（默认值也是1）
1) (integer) 0 # 0表示允许，1表示拒绝
2) (integer) 15 # 漏斗容量
3) (integer) 14 # 漏斗剩余空间
4) (integer) -1 # 若被拒绝，需要多长时间后再试（漏斗有空间了，单位秒）
5) (integer) 2 # 多长时间，漏斗完全空出来
```

* 在执行限流指令时，若被拒绝，就需要丢弃或重试，我们可以直接取返回结果数组的第四个值进行sleep即可，若不想阻塞线程，可异步定时任务来重试
* [详细参考](https://www.jianshu.com/p/1b026b874c40?from=timeline&isappinstalled=0)

## 近水楼台——GeoHash

* Redis3.2后增加了地理位置模块Geo模块，能实现类似摩拜单车的附近的MoBike，美团的附近餐馆等功能
* 地图元素的位置数据使用二维的经纬度表示，经度范围[-180,180]，纬度范围[-90,90]，北正南负
* GeoHash算法将二维的经纬度数据映射到一维的整数，Redis使用52位整数进行编码，放进zset里面，value是元素的key，score是GeoHash的52位整数值，可以还原score来恢复原始地理坐标
* 在Redis集群环境中，单个key对应的数据量不宜超过1MB，否则会导致集群迁移出现卡顿，建议Geo数据用单独的Redis实例部署，不使用集群环境；若数据量上亿，则需要对Geo 数据进行拆分，降低单个zset集合的大小

```bash
# 添加指令
> geoadd company 116.48105 39.996794 juejin
(integer) 1
> geoadd company 116.514203 39.905409 ireader 116.489033 40.007669 meituan 116.562108 39.787602 jd 116.334255 40.027400 xiaomi
(integer) 4
# 删除指令
> zrem company haha
(integer) 0
# 计算两个元素之间的距离,距离单位可以是m,km,ml(英里),ft（尺）
> geodist company juejin ireader km
"10.5501"
# 获取集合中任意元素的经纬度坐标(微小误差可以接受)
> geopos company juejin ireader
1) 1) "116.48104995489120483"
   2) "39.99679348858259686"
2) 1) "116.5142020583152771"
   2) "39.90540918662494363"
# 获取元素的经纬度编码字符串
> geohash company ireader
1) "wx4g52e1ce0"
> geohash company juejin
1) "wx4gd94yjn0"
# 查询附近（参数较为复杂）
# 20km范围内最多3个元素按距离正排，不排除自身
> georadiusbymember company ireader 20 km count 3 asc
1) "ireader"
2) "juejin"
3) "meituan"
# 20km范围内最多3个元素按距离倒排
> georadiusbymember company ireader 20 km count 3 desc
1) "jd"
2) "meituan"
3) "juejin"
# 三个可选参数 withcoord、withdist、withhash 用来携带附加参数
> georadiusbymember company ireader 20 km withcoord withdist withhash count 3 asc
1) 1) "ireader"
   2) "0.0000"										# 距离，withdist的作用
   3) (integer) 4069886008361398  # hash值，withhash的作用
   4) 1) "116.5142020583152771"   # 坐标值，withcoord的作用
      2) "39.90540918662494363"
2) 1) "juejin"
   2) "10.5501"
   3) (integer) 4069887154388167
   4) 1) "116.48104995489120483"
      2) "39.99679348858259686"
3) 1) "meituan"
   2) "11.5748"
   3) (integer) 4069887179083478
   4) 1) "116.48903220891952515"
      2) "40.00766997707732031"
# 根据坐标值来查询附近的元素
> georadius company 116.514202 39.905409 20 km withdist count 3 asc
1) 1) "ireader"
   2) "0.0000"
2) 1) "juejin"
   2) "10.5501"
3) 1) "meituan"
   2) "11.5748"
```

## 大海捞针——scan

* Redis日常维护，可能需要从实例中成千上万个key中找到特定前缀的key列表来手动处理数据
* Redis提供一个简单粗暴的指令 ``keys *`` 来列出所有满足特定正则字符串规则的key，但有两个显著缺点
  * 没有offset和limit参数，输出过多会刷屏
  * keys算法是遍历算法，会导致Redis服务卡顿，因为Redis是单线程程序，顺序执行所有指令，其他指令必须等到当前的keys指令执行完才能继续

```bash
> mset code1 a code2 b code3 c
OK
> keys *
1) "code3"
2) "code1"
3) "code2"
```

* 为了解决这个问题，Redis2.8引入了scan指令
  * 通过游标分步进行，不会阻塞线程
  * 提供limit参数，控制每次返回结果的最大条数（限定的是服务器单次遍历的字典槽位数量，但不是每个槽位都会挂接链表，详细见书本82页图片）
  * 提供模式匹配功能
  * 服务器不需要为游标保存状态，游标的唯一状态是scan返回给客户端的游标整数
  * 返回的结果可能重复，需要客户端去重
  * 遍历过程中若有数据修改，改动后的数据不能确定会被遍历到
  * 单次返回的结果是空不意味遍历结束，要看返回的游标值是否为0
  * 采用高位进位加法遍历顺序，避免字典扩容缩容时槽位的重复和遗漏，rehash后的槽位在遍历顺序上是相邻的

* scan是一系列的指令，可以使用zscan遍历zset集合元素，hscan遍历hash字典的元素，sscan遍历set集合的元素

* 平时业务开发中，要避免使用大key，因为扩缩容时申请或释放内存过大会导致卡顿，可以使用官方指令扫描大keys，每隔100条scan指令休眠0.1s，ops不会剧烈抬升，但扫描时间会变长

  ```bash
  redis-cli -h 127.0.0.1 -p 7001 --bigkeys -i 0.1
  ```

