# STL

* 本文挑选了一些实用但难以上手的标准库进行系统性学习，其中，标准库是基于Python3.7的。
* 时至今日，python3.9的出现，引入了很多新特性，所以，keep learning吧少年！

## multiprocessing

### 进程

```python
>>> import multiprocessing as ml
>>> import time

>>> def foo(a,b)
		time.sleep(10)
		print(a+b)

#新建一个进程，target为可调用对象，name为进程名字，args为位置参数元组
p = ml.Process(target = foo, name = 'lyj',args = (5,6))
#检查进程是否在运行
>>> p.is_alive()
	False
#进程的身份验证键，除非显式设定，否则由os.urandom()函数生成的32字符的字符串，为网络底层通讯安全提供保障
>>> p.authkey
	b'\x16\xe9\x19\xe0\xe3\xa3\\\xa9W\x9d\xa5\xf6\xd3\xb7\xf1?\xfd4\xe0\x85M|\t\xd3v\xc7\xf8J\xd3e\xed\xa4'
#指示进程是否为后台进程，当父进程终止时，后台进程自动终止，且后台进程不能创建自己的新进程，此值需在start()函数启动前设置
>>> p.daemon
	False
#进程名
>>> p.name
	'lyj'
#进程运行时的整数进程ID,不运行时没有
>>> p.pid
	22286
#启动子进程，进程名就是我们定义的name
>>> p.start()
#进程启动时运行的方法，并不启动一个新进程，就是在主线程中调用了一个普通函数而已。
>>> p.run()
```

### 工具函数

```python
>>> import multiprocessing as ml
>>> ml.active_children()
	[]
>>> ml.cpu_count()
	12
>>> ml.current_process()
	<_MainProcess(MainProcess, started)>
```

### 进程间通信-队列方式

```python
>>> import multiprocessing as ml

#创建共享的进程队列，参数为队列允许最大项数，若省略，则无大小限制。底层队列使用管道和锁实现
>>> q = ml.Queue(5)
#连接队列的后台进程，在q.close()后，等待所有队列项被消耗；默认情况下，此方法由不是q的原始创建者的所有进程调用
>>> q.join_thread()
#不会在进程退出时自动连接后台线程
>>> q.cancel_join_thread()
#关闭队列，防止队列加入更多数据，若q被垃圾回收，自动调用该方法
>>> q.close()
#检查队列满或空，及当前数量，但时间差导致结果不一定可靠
>>> q.full()
	False
>>> q.empty()
	True
>>> q.qsize()
	0
#返回q中的一个项，默认参数block = True，即若q为空，将阻塞至有项为止，若block = False， 将引发Queue.empty()异常；可选参数timeout为超时时间，用于阻塞模式，若一定时间内无项可用，则引发Queue.empty()异常
>>> q.get(block = True, timeout = 5)
>>> q.get_nowait()
#将item放入队列，若队列已满，则阻塞至有空间可用为止，block控制阻塞行为，timeout指定阻塞模式下可用空间的时间长短，超时后引发Queue.full()异常
>>> q.put(item = 'A',block = True, timeout = 3)
>>> q.put_nowait()
```

```python
#可连接的共享进程队列，允许项的消费者通知生产者，项已经被成功处理，除了普通Queue对象的方法外，还有以下方法
>>> q = ml.JoinableQueue(8)
#消费者使用此方法发出信号，表示q.get()返回的项已被处理
>>> q.task_done()
#生产者使用此方法进行阻塞，直到队列所有项已经被处理，阻塞将持续到每个项均调用task_done()方法为止
>>> q.join()
```

#### 案例——队列方式

* 放入队列的每个项会被序列化，通过管道或套接字连接发送给进程  
* 一般来说，发送数量较少的大对象比发送大量小对象更好

```python
import multiprocessing as ml

def consumer(input_q):
	while 1:
		item = input_q.get()
		if item is None:
			input_q.task_done()
			break
		#处理工作
		input_q.task_done()

def producer(sequence, output_q):
	for item in sequence:
		output_q.put(item)

#创建共享进程队列
q = ml.JoinableQueue()
#运行消费者进程
con_p = ml.Process(target = consumer, args = (q,))
con_p.daemon = True
con_p.start()
#生产多个项
sequence = [1,2,3,4]
producer(sequence, q)
#在队列上安置哨兵，发出完成信号,若存在n个消费者进程，则要放n个哨兵
q.put(None)
#等待项被处理,防止主程序被关闭后，消费被提前终止
q.join()
```

### 进程间通信-管道方式

```python
#创建一条管道，返回元组（conn1,conn2），表示管道两端的connection对象，默认情况下，管道为双向，若将默认参数duplex改为False，则conn1只能接收，conn2只能发送，必须在创建和启用使用管道的Process对象前调用pipe()方法
>>> (server_p,client_p) = ml.Pipe()

#Pipe()方法返回的两个connection对象，有以下方法属性

#关闭管道，可选任意一边关闭，若connection对象被垃圾回收，则会自动调用该方法
>>> c.close()
#返回连接使用的整数文件描述符
>>> c.fileno()
#若连接上的数据可用，返回True，timeout是指定等待最长时限，默认为0，马上返回结果，若将其置为None，则无限期等待数据到达
>>> c.poll([timeout])
#接收c.send()返回的对象，若连接的另一端已经关闭，不存在任何数据，则引发EOFError
>>> c.recv()
#接收c.send_bytes()方法发送的一条完整的字节信息，maxlength指定要接受的最大字节数，若进入的消息超过这个值，则引发IOError，若另一侧已关闭，则引发EOFError
>>> c.recv_bytes([maxlength])
#接收一条完整的字节信息，并把它保存在buffer对象中,offset指定缓冲区中放置消息处的字节位移，返回值是收到的字节数，若消息长于可用缓冲区空间，则引发BufferTooShort异常
>>> c.recv_bytes_into(buffer[,offset])
#通过连接发送对象，obj是与序列化兼容的任意对象
>>> c.send(obj)
#通过连接发送字节数据缓冲区，buffer是支持缓冲区接口的任意对象，offset是缓冲区中的字节偏移量，size是发送字节数，结果数据以单条消息的形式发出
>>> c.send_bytes(buffer[,offset[,size]])
```

#### 案例——管道方式

* 若生产者或消费者没有使用管道的某个端点，就应该关闭它，管道是由操作系统进行引用计数的，必须在所有进程中关闭管道后才能生成EOFError异常
* 不同进程的管道状态是独立的


```python
import multiprocessing as ml

def consumer(pipe):
	output_p,input_p = pipe
	input_p.close()
	while True:
		try:
			item = output_p.recv()
		except EOFError:
			break
		#处理项目
		print(item)
	print('consumer done')
	
def producer(sequence,input_p):
	for item in sequence:
		input_p.send(item)

output_p, input_p = ml.Pipe()
#启动消费者进程
cons_p = ml.Process(target = consumer, args = ((output_p,input_p),))
cons_p.start()
#关闭生产者中的输出管道
output_p.close()
#生产项目
sequence = [1,2,3,4]
producer(sequence, input_p)
#关闭输入管道，表示完成,不关则消费者一直循环
input_p.close()
#等待使用者进程关闭
cons_p.join()
```

### 进程池

* 可以把各种数据处理任务提交给进程池
* 只有池工作进程执行足够弥补额外通信开销的工作，使用进程池才有意义

```python
import multiprocessing as ml
#创建工作进程池，processes是要创建的进程数，省略则使用cpu_count()的值，initializer是每个工作进程启动时要执行的可调用对象，默认为None。initargs是要传递给initializer的参数元组
>>> p = ml.Pool([processes[,initializer[,initargs]]])
#在一个池的工作进程中（非并行）执行函数func(*args,**kwargs),然后返回结果；主进程会被阻塞
>>> p.apply(func[,args[,kwargs]])
# 在一个池的工作进程中并行执行函数，返回结果是AsyncResult类的实例，callback是可调用对象，接收输入参数，当func的结果变为可用时，立刻传递给callback，callback禁止执行任何阻塞操作，否则将阻塞接收其他异步操作中的结果，
>>> p.apply_async(func[,args[,kwargs[,callback]]]) 
#关闭进程池，防止进一步操作，若有挂起的操作，他们将在工作进程终止之前完成
>>> p.close()
#等待所有工作进程退出，只能在close()方法或terminate()方法之后调用
>>> p.join()
#立即终止所有工作进程，同时不执行任何清理或结束任何挂起工作，若p被垃圾回收，自动调用此函数
>>> p.terminate()
#将可调用对象func应用给iterable中的所有项，然后以课表形式返回结果，通过将iterable划分为多块并将工作分派给工作进程，可以并行执行，chunksize指定每块中的项数，若数据量较大，可提高chunksize来提升性能
>>> p.map(func,iterable,[,chunksize])
#同map()，返回AsyncResult类的实例，callback是可调用对象 
>>> p.map_async(func,iterable,[,chunksize[,callback]])
# 同map()，但返回迭代器而非列表
>>> p.imap(func,iterable[,chunksize])
# 同map(),但结果顺序根据完成时间任意确定
>>> p.imap_unordered(func,iterable[,chunksize])
'''
apply_async()和map_async()返回的值都是AsyncResult类的实例，拥有以下方法:
'''
#返回结果
>>> a.get([timeout])
#若调用完成，返回True 
>>> a.ready()
#若调用完成且没有引发任何异常，返回True，若在结果就绪前调用此方法，引发AssertionError异常
>>> a.successful()
#等待结果变为可用 
>>> a.wait([timeout])
>>> 
```

#### 案例—— apply(), apply_async(), map(), map_async()方法效率对比

```python
import multiprocessing
import time

def func(msg):
    return multiprocessing.current_process().name + '-' + str(msg)

def test(num,sign):

    pool = multiprocessing.Pool()
    start = time.time()
    if sign == 'normal':
        for i in range(num):
            msg = "hello %d" %(i)
            pool.apply(func, (msg, ))
    elif sign == 'async':
        for i in range(num):
            msg = "hello %d" %(i)
            pool.apply_async(func, (msg, ))
    elif sign == 'map':
        results = pool.map(func,range(num))
    elif sign == 'map-async':
        results = pool.map_async(func,range(num))
    else:
        pass
    pool.close() 
    pool.join()     
    end = time.time()
    print (str(num) + ' ' + str(sign) + ' '+ str(end-start)+'s')

sample = [1000,10000,100000,1000000]

for i in sample:

    test(i,'normal')
    test(i,'async')
    test(i,'map')
    test(i,'map-async')
    print('\n')


```

```
运行时间对比

	num			normal		async		map			map-async
	
	1000		0.21s		0.11s		0.11s		0.11s
	10000		1.01s		0.41s		0.11s		0.11s
	100000		8.98s		4.15s		0.11s		0.11s
	1000000		90.5s		44.3s	0.32s		0.32s
```

### 共享数据与同步

* 在共享内存创建ctypes对象
* multiprocessing.Value(typecode,arg1,...,argn,lock)
* 同value对象，但无锁
* multiprocessing.RawValue(typecode,arg1,...,argn)
* 在共享内存中创造ctypes数组,initializer为指定数组初始大小的整数或项序列
* multiprocessing.Array(typecode,initializer,lock)
* 同array对象，但无锁
* multiprocessing.RawArray(typecode,initializer)
* multiprocessing中还定义了一堆原语：
  Lock，RLock，Semaphore，BoundedSemaphore，Event，Condition	

#### 案例——共享队列，管道传输，共享内存的效率对比

```python
import multiprocessing as ml
import time



def share_queue(transmit_time, transmit_size):
    def consumer(input_q):
        while 1:
            item = input_q.get()
            if item is None:
                input_q.task_done()
                break
            #处理工作
            input_q.task_done()

    def producer(sequence, output_q):
        for item in sequence:
            output_q.put(item)

    def test(transmit_time,transmit_size):
        start = time.time()
        #创建共享进程队列
        q = ml.JoinableQueue()
        #运行消费者进程
        con_p = ml.Process(target = consumer, args = (q,))
        con_p.daemon = True
        con_p.start()
        #生产多个项
        sequence = [float(x) for x in range(transmit_size)]
        producer(sequence * transmit_time, q)
        #在队列上安置哨兵，发出完成信号,若存在n个消费者进程，则要放n个哨兵
        q.put(None)
        #等待项被处理,防止主程序被关闭后，消费被提前终止
        q.join()
        end = time.time()
        print('share_queue',transmit_size,'time:',(end-start)/transmit_time,'s')


    test(transmit_time,transmit_size)

def share_memory(transmit_time,transmit_size):
    class channel(object):
        def __init__(self,maxsize):
            self.buffer = ml.RawArray('d',maxsize)
            self.buffer_len = ml.Value('i')
            self.empty = ml.Semaphore(1)
            self.full = ml.Semaphore(0)
        def send(self,values):
            self.empty.acquire()
            nitems = len(values)
            self.buffer_len = nitems
            self.buffer[:nitems] = values
            self.full.release()
        def recv(self):
            self.full.acquire()
            values = self.buffer[:self.buffer_len.value]
            self.empty.release()
            return values

    def consumer(count,ch):
        for i in range(count):
            values = ch.recv()

    def producer(count,values,ch):
        for i in range(count):
            ch.send(values)

    def test(transmit_time, transmit_size):
        start = time.time()
        ch = channel(transmit_size)
        p = ml.Process(target = consumer, args = (transmit_time, ch))
        p.start()
        values = [float(x) for x in range(transmit_size)]
        producer(transmit_time,values,ch)
        p.join()
        end = time.time()
        print('share_memory',transmit_size,'time:',(end-start)/transmit_time,'s')

    test(transmit_time,transmit_size)

def pipe(transmit_time,transmit_size):
    
    def consumer(pipe):
        output_p,input_p = pipe
        input_p.close()
        while True:
            try:
                item = output_p.recv()
            except EOFError:
                break
    
    def producer(sequence,input_p):
        for item in sequence:
            input_p.send(item)

    def test(transmit_time,transmit_size):
        start = time.time()
        output_p, input_p = ml.Pipe()
        #启动消费者进程
        cons_p = ml.Process(target = consumer, args = ((output_p,input_p),))
        cons_p.start()
        #关闭生产者中的输出管道
        output_p.close()
        #生产项目
        sequence = [float(x) for x in range(transmit_size)]
        producer(sequence * transmit_time, input_p)
        #关闭输入管道，表示完成,不关则消费者一直循环
        input_p.close()
        #等待使用者进程关闭
        cons_p.join()
        end = time.time()
        print('pipe',transmit_size,'time:',(end-start)/transmit_time,'s')
    
    test(transmit_time,transmit_size)

#传输次数
transmit_time = 10
#单次传输大小
sample = [10000,100000,1000000]

for i in sample:
    #共享队列方式
    share_queue(transmit_time,i)
    #共享内存方法
    share_memory(transmit_time,i)
    #管道传输方法
    pipe(transmit_time,i)
    print('\n')
```

```
运行结果对比：

传输大小	share_queue()		pipe()		share_memory()
10000	   0.309s			   0.076s			0.003s
100000	   3.247s			   0.756s			0.005s
1000000		过慢               7.612s			   0.043s
```

### 托管对象

* 对更高级的python对象，multiprocessing没有自带的共享对象，但可以使他们运行在管理器的控制下，实现共享效果
* 管理器是独立的子进程，存在真实的对象，以服务器形式运行
* 其他进程采用代理商访问共享对象，这些代理作为管理器服务器的客户端运行

```python
import multiprocessing as ml
#在进程中创建运行的管理器，返回值是SyncManager类型的实例
m = ml.Manager()
'''
SyncManager类型的实例m具有一系列方法
'''
#在服务器上创建共享的对象实例并返回可访问它的代理
m.Array(typecode,sequence)
m.BoundedSemaphore([value])
m.Condition([lock])
m.dict([args])
m.Event()
m.list([Sequence])
m.Lock()
m.Namespace()
m.Queue()
m.RLock()
m.Semaphore([value])
m.Value(typecode,value)
```

* 对于更复杂类型的共享对象，如用户自定义的类，则必须创建自定义管理器对象，需要创建一个继承自BaseManager的类，并注册该数据类型

```python
import multiprocessing as ml
from multiprocessing.managers import BaseManager

class A(obj):
    def __init__(self,value):
        self.x = value
    def __repr__(self):
        return 'A (%s)' % self.x
    def getx(self):
        return self.x
    def setx(self,value):
        self.x = value
    def __add__(self,value):
        self.x += value
        return self

class MyManager(BaseManager):
    pass

MyManager.register('A',A)

m = MyManager()
m.start()
#创建托管对象
a = m.A(37)

```

#### 案例——托管对象

```python
import multiprocessing as ml
import time

def watch(d,evt):
    while 1:
        evt.wait()
        print(d)
        evt.clear()

m = ml.Manager()
d = m.dict()
evt = m.Event()

#启动监视字典的进程
p = ml.Process(target=watch,args=(d,evt))
p.daemon = True
p.start()

#更新字典并通知监视者
d['foo'] = 42
evt.set()
time.sleep(5)

#终止进程和管理器
p.terminate()
m.shutdown() 
```

### 连接

* 若要求程序不仅能在一个机器上运行，还能扩展到一个计算集群上，可以使用multiprocessing.connection模块
* 在mac上要先允许python.app能接入网络

```python
from multiprocessing.connection import Listener
from multiprocessing.connection import Client
import multiprocessing as ml

def listen():
    serv = Listener(('',8000),authkey=bytes('password',encoding = 'utf-8'))
    while True:
        conn = serv.accept()
        while True:
            try:
                x,y = conn.recv()
            except EOFError:
                break
            result = x + y
            conn.send(result)
        conn.close()

def client():
    conn = Client(('localhost',8000),authkey=bytes('password',encoding = 'utf-8'))
    conn.send((3,4))
    r = conn.recv()
    print(r)
    conn.send(('Hello','World'))
    r = conn.recv()
    print(r)
    conn.close()

server_p = ml.Process(target=listen)
server_p.daemon = True
server_p.start()
client()
```

### 注意事项及原则

* 确保进程之间传递的所有数据能够序列化

* 避免使用共享数据，尽量使用消息传递和队列

* 在必须运行在单独进程的函数内部，不要使用全局变量，而应当显式传递参数

* 显式关闭进程

* 让事情变简单

  

## re

```python
import re

#根据string的顺序找pattern，成功找到一个匹配pattern的，就是m.group()的值,若没找到pattern，返回的匹配对象m为None，关于m的一切方法都不存在
#当m不是None值时，m.groups()的值是一个列表，有多少个分组括号，列表就对应有多少项，且顺序是基于左括号的
pattern = '32(ab(?P<cd>c(?:d(e))))|f'
string = '23a12abcdeff'
```

### re.compile()函数

```python
#编译一个正则对象，以后用pat直接调用match(),search(),findall(),finditer()函数，可省略pattern参数,flags参数re.I表示忽略大小写，re.M表示将^和$应用到整个字符串的开始和结尾的每一行，不仅是开头和结尾
pat = re.compile(string,flags = re.I)
```

### re.match()函数

```python
#从字符串一开始匹配，若一开始就不对，则返回None
mm = re.match(pattern,string)
```

### re.search()函数

```python
m = re.search(pattern,string)
```

### re.findall()函数

```python
#从字符串中找到所有匹配pattern的，返回一个列表，列表每一项是一个元组，元组元素相当于每个m.groups()中的元素
lf = re.findall(pattern,string)
print('lf',lf)
```

### re.finditer()函数

```python
#返回一个迭代器，迭代的是匹配对象m
iterator = re.finditer(pattern,string)
for m in iterator:
    pass
```

### match对象的用法

```python
#以下属性，仅当匹配成功，m不为None时才存在，且下列属性都是基于匹配回来的东西去讨论，如此次匹配中的是第一个f，就不包含分组，所以分组为[None,None,None]

#根据string的顺序找pattern，成功找到最先能匹配pattern的，就是m.group()的值
print('m.group()',m.group())
#m.groups()的值是一个列表，有多少个分组括号，列表就对应有多少项，且顺序是基于左括号的，
print('m.groups()',m.groups())
#第2个分组在string中的起始位置，若省略参数，则选用m.group()在string中的起始位置
print('m.start(2)',m.start(2))
#第3个分组在string中的结束位置，若省略参数，则选用m.group()在string中的结束位置
print('m.end(3)',m.end(3))
#第2个分组在string的起末位置的元组，若省略参数，则选用m.group()在string中的起末位置的元组
print('m.span()',m.span())
#传递给search()或match()函数的pos值
print('m.pos', m.pos)
#传递给search()或match()函数的endpos值
print('m.endpos', m.endpos)
#匹配对象所对应的正则对象
print('m.re',m.re)
#匹配对象所对应的输入字符串
print('m.string', m.string)
#返回标注了名称的分组的字典，key为组名，value为分组的字符串
print('m.groupdict()',m.groupdict())
```

### re.split()函数

```python
#根据pattern出现的位置拆分string，返回字符串列表，包括pattern中任何分组匹配的文本
ls = re.split(pattern,string)
# 例子
>>> print line
abc aa;bb,cc | dd(xx).xxx 12.12'	xxxx
# 按空格切
>>> re.split(r' ',line)
['abc', 'aa;bb,cc', '|', 'dd(xx).xxx', "12.12'\txxxx"]
# 加将空格放可选框内[]内
>>> re.split(r'[ ]',line)
['abc', 'aa;bb,cc', '|', 'dd(xx).xxx', "12.12'\txxxx"]
# 按所有空白字符来切割：\s（[\t\n\r\f\v]）\S（任意非空白字符[^\t\n\r\f\v]
>>> re.split(r'[\s]',line)
['abc', 'aa;bb,cc', '|', 'dd(xx).xxx', "12.12'", 'xxxx']
# 多字符匹配
>>> re.split(r'[;,]',line)
['abc aa', 'bb', "cc | dd(xx).xxx 12.12'\txxxx"]
>>> re.split(r'[;,\s]',line)
['abc', 'aa', 'bb', 'cc', '|', 'dd(xx).xxx', "12.12'", 'xxxx']
# 使用括号捕获分组的适合，默认保留分割符
>>> re.split('([;])',line)
['abc aa', ';', "bb,cc | dd(xx).xxx 12.12'\txxxx"]
# 去掉分隔符，加?:
>>> re.split(r'(?:;)',line)
['abc aa', "bb,cc | dd(xx).xxx 12.12'\txxxx"]
```

### re.sub()用法

```python
def deal(matched):
    intStr=matched.group("number")
    intValue=int(intStr)
    addValue=intValue+111
    addValueStr=str(addValue)
    return addValueStr

inputStr="hello 123 world 456"
replacedStr=re.sub("hello 123 world 456",deal,inputStr)
print(replacedStr)
```

