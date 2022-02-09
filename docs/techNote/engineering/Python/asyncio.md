# Asyncio

## Preface

* Python3.4引入了asyncio库，Python3.5增加了async和await关键字以提高其可用性，这些条件为异步编程提供了基础，但Python的asyncio API用起来比较复杂
* 使用asyncio库的原因有两个，一是提高并发，二是线程安全
  * 当你想获取1000个url的连接时，使用同步网络请求库requests会带来阻塞
  * 更容易避开race condition bugs
* 本书内容如下
  * 并发网络编程下，asyncio和threading的详细对比
  * 对async/await语法的介绍
  * asyncio带来的新feature的概览
  * 提供与asyncio兼容的流行三方库的详细可扩展的代码用例，

## Chapter1 Asyncio介绍

#### 餐厅的小故事

餐厅的角色（一个角色对应一个线程）：

* GreetBot：前台迎宾结账
* WaitBot：端茶倒水
* ChefBot：后台煮饭
* WineBot：管理酒吧

餐厅运作流程：

* 宾客被GreetBot引到桌子坐下，WaitBot会记录他们的点菜，并传给ChefBot，ChefBot开始做菜，WaitBot会定时检查有没有做好的菜，有就将它们端上桌子，当宾客吃完后，会到GreetBot处结账离开

餐厅出现的问题和解决办法：

* 问题一：宾客被引导到一张还没收拾干净的桌子，菜没做好就端上桌，繁忙时段缺人手，加人手则餐厅变挤且记录机器人行为的工作变得更多，在某些时刻所有机器人都在等待（类似于CPU空转等网络IO的request.get()返回）

* 解决一：只请一个机器人，让它干所有事；
* 问题二：但当一个爱唠嗑的客人一直和他聊天时，他没办法进厨房，导致蛋糕糊了（长时间无法切换任务）

#### Asyncio试图解决的问题

对于IO负载高的程序，使用async-based的并发与使用thread-based的并发相比，有两个优势

* 提供安全性更高的抢占式任务调度，避免大部分的竞争条件
* 支持数千同时发生的socket连接，包括websocket，mqtt等新长连接技术

几个常见误区

* 误区一：asyncio会让代码加速得非常快：想快去用Cython！
* 误区二：asyncio导致threading多余：
  * threading的价值在于能编写多核CPU程序，不同计算任务能共享内存，numpy也使用此技术加速矩阵运算，对于CPU密集型的任务，线程模型是最佳选择

* 误区三：asyncio解决了GIL锁的问题：
  * GIL影响的是多线程程序，GIL锁阻止的是多线程程序中真正的多核并行，但Asyncio是单线程的
  * GIL锁问题参考PyCon 2010报告《Understanding the Python GIL》
* 误区四：asyncio避免全部的竞争条件
  * asyncio能消除特定类别的竞争条件，如进程内共享内存访问，但不能消除分布式微服务架构中常见的进程间共享资源访问竞争
  * asyncio与多线程程序相比，执行控制在协程间的转移是可见的（await关键字），更容易追踪共享资源的访问

并发处理的难点

* 应用程序如何支持健康检查
* 如何通过有限的连接数访问数据库
* 如何在接受到信号后，优雅的关闭连接
* 如何处理磁盘访问和日志记录等阻塞的场景



## Chap2 线程的真相

线程是操作系统提供的一个特性，它允许软件开发者告知操作系统程序的哪些部分可以并行执行，操作系统决定如何为每部分分配CPU资源

#### 线程的好处

* 代码可读性强：代码书写时仍采用自顶向下的线性命令结构

* 基于共享内存的并行：使用共享内存避免数据在不同进程存储空间移动的花销

* 已有最佳实践和讲解

Python解释器使用GIL，保护解释器的内部状态，避免线程间的竞争条件带来的灾难性后果。GIL导致了多个进程不会被你分配到单个CPU上，消除了并行的性能增益（除非使用Cython或Numba等工具绕开）

编写线程程序的最佳实践是使用concurrent.futures模块的ThreadPoolExecutor类，简易代码如下

```python
from concurrent.futures import ThreadPoolExecutor as Executor

def worker(data):
  <process your data, do not operate global variables>

with Executor(max_workers=10) as exe:
  future = exe.submit(worker, data)
```

#### 线程的坏处

* 线程很难控制：线程bug和竞争条件很难de出来，代码逻辑难以推理
* 线程是资源密集型的：线程需要调用额外的操作系统资源去创建，预分配线程栈会消耗虚拟内存，但在64位系统中，此问题被缓解了
* 线程会影响吞吐量：在高并发情况下，上下文切换的开销会带来一定影响
* 线程是不灵活的：操作系统会将CPU时间分配给每个线程，无论线程工作与否（如线程A可能在等待socket返回数据包），使用协程则能避免此问题）



## Chap3 Asyncio概览

asyncio的底层细节：[Talk: Python Concurrency from the Ground Up: LIVE!](https://www.youtube.com/watch?v=MCs5OvhV9S4)  PyCon2015

介绍asyncio：[Talk:async/await in Python 3.5 and Why It is Awesome](https://m.youtube.com/watch?v=m28fiN9y_r8&feature=youtu.be) PyCon2016

Asyncio API可以概括为以下流程：

* 开始asyncio 事件循环
* 调用 async/await 函数
* 创建一个任务在事件循环中执行
* 等待多个任务执行完成
* 所有并行任务执行完毕后关闭循环

#### 应用开发者参考

```python
import asyncio
import time

async def main():
  print(f'{time.ctime()} Hello!')
  await asyncio.sleep(1.0)
  print(f'{time.ctime()} Goodbye!')

# 在运行协程前，需要一个循环实例，在任何地方调用get_event_loop()会返回同一个循环实例，因为只使用了一个线程，但如果在async def 函数内，则应该使用get_running_loop()方法
loop = asyncio.get_event_loop()
# create_task(coro)将要运行的协程注册进事件循环，返回的task对象可用于监控任务状态并获取结果输出，也可用于取消任务
task = loop.create_task(main())
# run_until_complete(coro)会阻塞当前线程（通常是主线程），循环将在coro执行完毕后马上结束,asyncio.run()函数内部也调用了此方法，故同样会阻塞当前线程
loop.run_until_complete(task)
pending = asyncio.all_tasks(loop=loop)
for task in pending:
  task.cancel()

# 
group = asyncio.gather(*pending, return_exceptions=True)
loop.run_until_complete(group)
# 关闭循环实例，如再用可以通过run()重新申请
loop.close()
```

```python
import time
import asyncio

async def main():
  print(f'{time.ctime()} Hello!')
  await asyncio.sleep(1.0)
  print(f'{time.ctime()} Goodbye!')

def blocking():
  # 使用传统的睡眠函数会阻塞线程
  time.sleep(0.5)
  print(f'{time.ctime()} Hello from a thread')

loop = asyncio.get_event_loop()
task = loop.create_task(main())

# 在executor里执行不会阻塞主线程，函数返回一个Future对象，而非Task对象，故不会出现在all_tasks函数的返回中
loop.run_in_executor(None, blocking)
loop.run_until_complete(task)

pending = asyncio.all_tasks(loop=loop)
for task in pending:
  task.cancel()
group = asyncio.gather(*pending, return_exceptions=True)
loop.run_until_complete(group)
loop.close()
```

#### 框架开发者参考

* 对于框架开发者而言，关心的问题是如何建造一个async兼容的三方库，下面给出asyncio的层次结构

| Level        | Concept                | Implmentation                                                |
| ------------ | ---------------------- | ------------------------------------------------------------ |
| Tier 9       | Network:streams        | StreamReader,StreamWriter,asyncio.open_connection(),asyncio.start_server() |
| Tier 8       | Network:TCP&UDP        | Protocol                                                     |
| Tier 7       | Network:transports     | BaseTransport                                                |
| Tier 6       | Tools                  | asyncio.Queue                                                |
| Tier 5       | Subprocesses & threads | run_in_executor(), asyncio.subprocess                        |
| Tier 4       | Tasks                  | asyncio.Task, asyncio.create_task()                          |
| Tier 3       | Futures                | asyncio.Future                                               |
| Tier 2       | Event loop             | asyncio.run(), BaseEventLoop                                 |
| Tier 1(Base) | Coroutines             | async def, async with, async for, wait                       |

* 市面上流行的基于Python原生协程的异步框架有Curio，Trio

* asyncio在Tier2提供loop的规格定义AbstractEventLoop和一种实现BaseEventLoop，所以框架开发者可以实现自己的EventLoop，如uvloop项目就提供一个更高效的loop实现

* Tier3和Tier4比较相近，Task是Future的一个子类，一个Future实例代表某种在事件循环中会通过notification返回结果的活动；而Task代表在事件循环中运行的协程

* Tier5代表需要在单独线程/进程中运行的工作，对于在async应用中使用blocking code提供帮助（如数据库连接，SQLAlchemy）

* Tier6提供额外的async-aware 工具，如asyncio.Queue，它与queue模块里定义的Queue具有相似的API，但在get()和put()调用时，要加上await关键字，在协程中无法使用queue.Queue中带阻塞的get()和put()功能

* Tier7～Tier9涉及网络IO，如aiohttp就提供好这些功能，若要使用原生，尽量看Tier9就行了

#### 协程

* 如何定义一个协程？
  * 使用关键字async def可以定义一个协程函数，当调用协程函数时，才会返回一个协程对象

* 协程是什么？
  * 一个具备恢复已挂起函数的能力的对象

```python
# 使用inspect模块与使用type()函数相比，能返回更详细的信息
>>> import inspect

>>> async def f():
  		return 123

>>> coro = f()

>>> type(f)
<class 'function'>

>>> inspect.iscoroutinefunction(f)
True

>>> type(coro)
<class 'coroutine'>

>>> inspect.iscoroutine(coro)
True

>>> def g():
  		yield 123

>>> type(g)
<class 'function'>

>>> gen = g()
>>> type(gen)
<class 'generator'>
```

* 协程的开始和结束
  * 开始：通过向协程对象发送None来初始化其执行（现实中由loop对象自动管理，无需人工执行）
  * 结束：协程返回时，会报一个StopIteration错误，协程的正常返回值可通过错误对象的value获取

```python
>>> async def f():
  		return 123

>>> coro = f()

>>> try:
  		coro.send(None)
		except StopIteration as e:
  		print('Answer was ',e.value)

123
```

#### await关键字

* await关键字接受一个awaitable对象作为参数，awaitable对象有以下几种
  * 一个协程
  * 定义了\__await__()方法的对象，此方法需要返回一个迭代器

* 当调用task.cancel()时，事件循环内部会调用coro.throw()在协程内部去raise一个asyncio.CancelledError

```python
import asyncio
async def f():
  try:
    while True: await asyncio.sleep(0)
  except asyncio.CancelledError:
    print('I was cancelled!')
  else:
    return 111

>>> coro = f()
>>> coro.send(None)
>>> coro.send(None)
>>> coro.throw(asyncio.CancelledError)
I was cancelled!
StopIteration
```

* 使用run_until_complete函数去让event loop帮我们自动完成.send(None)并检出StopIteration中的返回值

#### 事件循环

事件循环处理所有的协程切换，并捕获所有的StopIteration错误，监听socket和文件描述符发生的事件

Python3.7后生成一个async task的代码如下

```python
import asyncio

async def f():
  for i in range()"
  asyncio.create_task(<some other coro>)
```

#### Tasks 和 Futures

* 一个Future实例能通过.set_result(value)设置值并通过.result()去获取其返回值；能通过.cancel()取消并通过.cancelled()检查其状态；能在完成后执行回调函数

```python
from asyncio import Future
>>> f = Future()
>>> f.done()
False
```

```python
import asyncio

async def main(f: asyncio.Future):
  await asyncio.sleep(1)
  # set_result 在Python3.8后不能对Task用了，因为Task不能从外部注入值
  f.set_result('I have finished')

>>> loop = asyncio.get_event_loop()
>>> fut = asyncio.Future()
>>> print(fut.done())
False
>>> loop.create_task(main(fut))
<Task pending name='Task-1' coro=<main() running at <console>:1>>
>>> loop.run_until_complete(fut)
'I have finished'
>>> print(fut.done())
True
>>> print(fut.result())
I have finished
```

* asyncio.ensure_future()函数对于Task和Future对象原样返回，对于coroutine对象则包装成Task对象返回
* asyncio.gather(*aws, loop=None, ...)函数内部会先调用ensure_future()函数对传入的awaitable对象进行处理

#### Async Context Managers：async with

* 下载网页和更新数据库状态都会带来阻塞，使用async改造

```python
from contextlib import contextmanager

@contextmanager
def web_page(url):
  data = download_webpage(url)
  yield data
  update_stats(url)

with web_page('google.com') as data:
  process(data)
```

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def web_page(url):
  data = await download_page(url)
  yield data
  await update_stats(url)

async with web_page('google.com') as data:
  process(data)
```

* 但现实中，像requests之类的库是同步的，改造它不太现实，所以一般采用更简易的方法迁移

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def web_page(url):
  loop = asyncio.get_event_loop()
  data = await loop.run_in_executor(None, download_webpage, url)
  yield data
  await loop.run_in_executor(None, update_stats, url)

async with web_page('google.com') as data:
  process(data)
```

#### Async Iterators: async for

* 一个标准的可迭代对象需要定义\__iter\_\_() 和 \_\_next\_\_()方法，\_\_iter\_\_() 方法用于状态初始化，返回一个可迭代对象，每次迭代会调用\_\_next\_\_()方法

```python
class A:
  def __iter__(self):
    self.x = 0
    return x
 	def __next__(self):
    if self.x > 2:
      raise StopIteration
    else:
      self.x += 1
      return self.x

for i in A():
  print(i)
```

* 一个async的可迭代对象需要定义\__aiter\_\_() 和 \_\_anext\_\_()方法

```python
import asyncio
from aioredis import create_redis

async def main():
  redis = await create_redis(('localhost', 6379))
  keys = ['America', 'Africa', 'Asia']
  
  async for value in OneAtTime(redis, keys):
    await do_something_with(value)

class OneAtTime:
  def __init__(self, redis, keys):
    self.redis = redis
    self.keys = keys
  def __aiter__(self):
    self.ikeys = iter(self.keys)
    return self
 	async def __anext__(self):
    try:
      k = next(self.ikeys)
    except StopIteration:
      raise StopAsyncIteration
    value = await redis.get(k)
    return value

asynciooo.run(main())
```

#### Async Generators

* async generator是用async def定义的函数，且内部带有yield关键字的

#### Async Comprehensions

* async对于列表推导同样有用，使用async for

```python
>>> import asyncio

>>> async def f(x):
  		await asyncio.sleep(0.1)
  		return x+100

>>> async def factory(n):
  		for x in range(n):
    		await asyncio.sleep(0.1)
    		yield f, x

>>> async def main():
  		results = [await f(x) async for f, x in factory(3)]
    	print('results = ', results)

>>> asyncio.run(main())
results = [100,101,102]
```

#### 优雅地启动和关闭

* 启动：最简单的办法是定义一个main()协程函数并用asyncio.run()执行它
* 关闭：当main()协程函数退出时，asyncio.run()会先收集所有挂起的task对象，并取消这些任务，组成一个group task，然后对这个group task使用run_until_complete()去等待他们完成

* Python3.9中，asyncio.run()函数支持等待executor shutdown了

## Chap4 Asyncio三方库

* 使用asyncio里面的streams API构建socket应用程序
* twisted项目，从06年开始，一直引导着异步编程的潮流，内部提供高质量的协议实现（HTTP、XMPP、NNTP、IMAP、SSH、FTP、DNS、SMTP等等）
* Janus queue，提供了线程和协程间信息互通的队列，python原生的queue.Queue和asyncio.Queue不能满足这一点
* aiohttp提供异步的HTTP客户端和服务端，包括websocket支持；可搭配splash来写爬虫
* zeromq消息队列
* asynpg & Sanic用于构建应用缓存