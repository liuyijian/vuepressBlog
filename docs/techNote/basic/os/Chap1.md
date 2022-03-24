# 现代操作系统——原理与实现

## Chap1 操作系统概述

#### 操作系统的作用

* 对硬件进行管理和抽象
  * 管理硬件：将功能不同，参数不同的硬件纳入统一管理（如硬盘、内存、显卡）
  * 对硬件进行抽象：将有限的、离散的资源高效抽象为无限的，连续的资源，开发者无需关心硬件具体细节（如面向虚拟地址空间编程而非物理内存）
* 为应用提供服务并进行管理
  * 服务于应用：提供不同层次、不同功能的接口满足应用需求（如系统调用），提供访问控制，应用间交互服务等
  * 管理应用：负责应用生命周期的管理，如应用加载、启动、切换、调度、销毁等，从全局角度分配系统资源，保证公平性、性能和安全的隔离性

#### 操作系统的必要性

* 避免应用直接控制硬件不当带来的计算机直接崩溃，提供诊断和调试的机会
* 从全局角度合理调度应用，高效利用硬件资源

#### 操作系统接口

* 系统调用接口：系统调用是用户态应用向操作系统内核请求服务的方法
* POSIX接口：可移植操作系统接口，保证同一个应用程序在不同操作系统上的可移植性（基于不同操作系统的系统调用存在差异），其标准常通过（C library，libc）来实现，常见的libc包括glibc、musl、bionic（Android）
* 领域应用接口：在POSIX基础上封装面向不同领域的领域应用接口，如Android应用框架、IOS应用框架、ROS

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gsxtrk71wmj30sd0pwahp.jpg" style="zoom:50%;" />

#### 实验操作系统 - ChCore

* 采取微内核架构的设计理念

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gsxs50aei6j30xz0n3dj6.jpg" style="zoom:50%;" />

## Chap2 硬件结构

#### 冯诺伊曼结构的组成

* 中央处理单元：负责运算和逻辑控制，按照程序中的指令进行计算
* 存储器：负责存储指令与数据，保存程序执行中间结果和最终结果，包括寄存器、CPU缓存、内存、硬盘等存储层次
* 输入输出：负责与外界进行交互，从外界获得输入（键盘、鼠标），将结果向外界输出（显示器、打印机）

#### 指令集架构

* 指令集架构（ISA）：CPU和软件之间的桥梁
  * 指令集：一系列不同功能的指令，用于数据搬移、计算、访存、过程调用等（本书是AArch64平台的RISC，每条指令长度固定为4字节）
  * 特权级：又称为异常级别（EL）
    * EL0：用户态，应用程序通常运行的特权级，最低的特权级
    * EL1：内核态，操作系统通常运行的特权级
    * EL2：虚拟机监控器（VMM）通常运行的特权级
    * EL3：和TrustZone相关，负责普通世界和安全世界之间的切换（TrustZone是Armv6引入的安全特性，安全世界不受限制访问所有计算资源，普通世界不能访问划分到安全世界的计算资源）
    * EL0 -> EL1的三种经典场景（前两个是同步的CPU特权级切换，最后的是异步的）
      * 1、应用程序需要调用操作系统提供的系统调用
      * 2、应用程序执行了一条指令触发了异常（如访存指令触发缺页异常），内核通过查找异常向量表来做适当处理后返回用户态
      * 3、应用程序执行过程中，CPU收到来自外设的中断
  * 寄存器
    * AArch64中，有31个64位通用寄存器（X0~X30）
      * X29是帧指针寄存器（FP），一般保存函数调用过程中栈顶的地址
      * X30是链接指针寄存器（LP），一般保存函数调用后的返回地址
    * 在EL1特权级下，有2个页表基地址寄存器（TTBR），负责翻译虚拟地址空间中不同的地址段
      * TTBR0_EL1：一般用于负责用户地址空间的地址映射
      * TTBR1_EL1：一般用于负责内核地址空间的地址映射
  * 执行模式、安全扩展、性能加速扩展等

#### CPU缓存

* 访问CPU缓存比访问物理内存快，由于软件运行具有局部性（时间、空间），缓存能有效提升性能
* 以下为256组，2路组相连缓存，缓存行大小64字节，缓存总大小为32KB，查找时，将物理地址切成三段，先进入对应set的编号里，再根据tag找到特定的缓存行，再根据valid位置决定是否直接读取或更新缓存行

![](https://tva1.sinaimg.cn/large/008i3skNly1gsxtt40cw2j313w0mg78l.jpg)

#### 设备与中断

内存映射输入输出（MMIO）：

* 把输入输出设备和物理内存放到同一个地址空间，为设备内部的内存和寄存器也分配相应地址
* CPU能使用访存指令操作设备，设备会通过总线监听CPU分配给自己的地址，完成相应的访问请求

CPU如何得知输入事件发生了：

* 1、轮询（polling）：CPU不断通过MMIO查看设备是否有输入（会使CPU长期处于等待状态，浪费资源）
* 2、中断（interrupt）：设备通过向CPU发出中断来打断CPU执行，使CPU去处理这个中断



## Chap3 操作系统结构

#### 操作系统复杂度

控制系统复杂度的设计原则：策略与机制分离

* 策略（policy）：表示要做什么
* 机制（mechanism）：表示该如何做

操作系统可以通过多种不同策略来适应不同应用需求，也可以通过持续优化具体的机制来不断完善一个策略的实现

管理复杂度的重要方法：MALH方法

* 模块化（modularity）：将系统分解为通过明确定义接口交互的模块，要求模块高内聚、低耦合
* 抽象（abstraction）：在模块化基础上，将接口与内部实现分离
* 分层（layering）：将模块进行层次的划分，约束每层内部模块间的交互方式与跨层模块间的交互方式（一般不准跨两层交互），有效减少模块交互
* 层级（hierarchy）：将功能相近的模块组成一个自包含的子系统，再将其递归组成一个大系统

#### 操作系统内核架构

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gsxuco4kgmj31cv0m37ay.jpg" style="zoom:50%;" />

| 架构种类         | 代表系统               | 特性                                                         | 优点                                                         | 缺点                                                         |
| ---------------- | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 简要结构         | MS-DOS、FreeRTOS、uCOS |                                                              | 轻量化，适用于在微控制器单元上运行                           | 应用程序和操作系统放置在同一个地址空间，特权级隔离能力较弱甚至无，单个应用或模块出错会导致系统崩溃 |
| 宏内核（单内核） | UNIX、Linux、Windows   | 一切皆是文件的抽象                                           | 提供可加载内核模块（LKM）机制，使设备驱动开发和加载更方便灵活；调度子系统对进程优先级进行分类 | 通用大型系统难以满足特定场景下安全性、可靠性、实时性等需求；内核单点错误会导致系统崩溃或被攻破；在庞大系统中创新非常困难 |
| 微内核           | Mach、L4、EROS、seL4   | 将单个功能（如文件系统、设备驱动）从宏内核中拆分出来，作为一个独立的服务部署到独立的运行环境中；内核仅保留进程间通信（IPC）等极少数基础功能 | 服务间完全隔离，便于为不同场景定制不同的服务,弹性扩展能力强，支持硬件异构程度高，时延相对可控 | 进程间通信（IPC）可能成为性能瓶颈                            |
| 外核             | UniKernel，容器架构    | 过度的硬件资源抽象可能带来较大的性能损失，且对一些如数据库，web服务器等具体应用，抽象往往不是最优选择。故提出让应用尽可能控制对硬件资源的抽象，提出库操作系统的概念（libos），将硬件的抽象封装至libos中，与应用直接链接，而内核至负责对硬件资源在多个libos之间的多路复用的支持，管理libos的生命周期 | 可根据应用领域的特点和需求，动态组装libos，最小化非必要代码，获取更高性能；内核可以做到非常小，libos之间的强隔离带来系统的安全性和可靠性 | libos缺乏跨场景的通用性，应用生态差；不同的libos常会实现类似功能容易造成代码冗余 |
| 多内核           |                        | 每个CPU核上运行一个独立的操作系统节点，节点间交互通过进程间通信完成，通过多内核管理异构多核设备 | 避免了处理器核之间通过共享内存实现隐式共享带来的性能可扩展性瓶颈 | 不同节点间可能存在状态冗余，需要移植应用适配多内核架构       |

## Chap4 内存管理

#### 虚拟地址与物理地址

* 虚拟内存（virtual memory）：
  
* 操作系统为了让不同应用程序高效又安全地共同使用物理内存资源，在应用程序和物理内存之间加入的一个新的抽象
  
* 访存流程：

  * 应用程序运行时只能使用虚拟地址

  * CPU中的内存管理单元（MMU）负责将虚拟地址翻译成物理地址

    * 为了加速地址翻译过程，MMU内部引入了转址旁路缓存（Translation Lookaside Buffer，TLB）

  * 操作系统负责设置虚拟地址和物理地址之间的映射

    ![](https://tva1.sinaimg.cn/large/008i3skNgy1gt2jp747e7j31cm0e5afz.jpg)

* 分段与分页机制

  * 分段机制（x86-64架构前的主流，当下硬件仍然兼容）
    * 描述：操作系统以段（一段连续物理内存）的形式管理/分配物理内存；应用程序的虚拟地址空间由若干不同大小的段组成（代码段、数据段），虚拟地址空间的相邻段在物理空间不一定相邻，故操作系统可以实现物理内存资源的离散分配
    * 虚拟地址的构成：段号、段内偏移
    * 翻译地址过程：MMU先通过**段表基址寄存器**找到段表（段表存储虚拟地址空间中每一个分段的段起始物理地址和段长）的位置，根据段号和段内偏移获取最终物理地址（段内偏移和段长结合可检查地址是否超出合法范围）
    * 评价：容易造成物理上的**外部碎片（段与段间不足以映射给虚拟地址空间的段）**，从而降低物理内存资源利用率
  * 分页机制（主流）
    * 描述：将虚拟地址空间划分为连续的、等长的虚拟页；物理内存也划分为连续的、等长的物理页；虚拟页和物理页的页长固定且相等
    * 虚拟地址的构成：虚拟页号、页内偏移
    * 翻译地址过程：MMU先通过**页表基地址寄存器**找到页表（虚拟页到物理页的映射关系表），用物理页起始地址加上页内偏移获取最终物理地址
    * 评价：有效避免外部碎片问题

#### 基于分页的虚拟内存

* 对于64位虚拟地址空间，若页大小为4KB，页表中每项大小为8字节，则页表大小为$2^{64}/4KB * 8B \approx 30PB$，需要压缩！
* 使用$k$级页表，虚拟页号被划分为$k$个部分，当任意一级页表的某一个条目为空时，该条目对应的下一级页表不需要存在，即多级页表允许结构空洞的存在
* 考虑到应用程序的虚拟地址空间绝大部份处于未分配状态，多级页表在实际使用中，可以部分创建，从而极大节约空间

##### AArch64体系结构下基于4级列表的地址翻译

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gt2jotvbspj30wu0rtn2k.jpg" style="zoom:50%;" />

##### 加速地址翻译的重要硬件：TLB

* TLB缓存了虚拟页号和物理页的映射关系（键值对哈希表），一般而言，TLB分成L1和L2两层，L1又分为数据TLB和指令TLB，分别用于缓存数据和指令的地址翻译；L2不区分数据和指令
* 当TLB未命中时，硬件将通过页表基地址查询页表，找到对应的页表项，并将翻译结果写入TLB中；若TLB已满，则根据预设策略替换掉其中一项
* 由于TLB是使用虚拟地址查询（每个应用程序有自己的虚拟空间）的，故操作系统在进行系统调用、页表切换（应用程序切换）、页表修改时，TLB需要做相应处理，否则会出错
  * 系统调用：在AArch64体系结构上，通常应用程序和操作系统使用不同页表，由于硬件提供TTBR0_EL1和TTBR1_EL1两个不同的页表基地址寄存器，故在系统调用的过程中不需要切换页表，避免TLB刷新的开销
  * 页表切换：在AArch64体系结构上，提供了（Address Space IDSpecifier，ASID）功能，为不同的应用程序分配不同的ASID作为应用程序的身份标签（x86中，这个功能叫PCID）将这个标签写入页表基地址寄存器中的空闲位，同时，TLB中的缓存项也包含ASID这个标签，使得TLB中属于不同应用程序的缓存项可以被区分开，切换页表不需刷新TLB
  * 页表修改：当修改页表内容后，操作系统需要主动刷新TLB以保证一致性，刷新TLB的粒度包括，刷新全部，刷新指定ASID，刷新指定虚拟地址等等；可根据不同场景选用合适指令最小化TLB刷新的开销

##### 换页与缺页异常

* 换页机制基本思想：当物理内存容量不够的时候，操作系统应该将若干物理页的内容写到类似磁盘这种容量更大且更加便宜的存储设备中，就可以回收物理页并继续使用了
* 换出（swap out）：将物理页的内容写入磁盘特定位置，并在应用程序的页表中取出虚拟页的映射，同时记录物理页在磁盘上的位置，此时虚拟页处于**已分配但未映射**的状态
* 换入（swap in）：当应用程序访问已分配但未映射的虚拟页时，会引发**缺页异常**，CPU会运行操作系统预设的缺页异常处理函数，该函数会找到空闲的物理页，将之前写入磁盘的数据重新加载到物理页中，并在页表中填写虚拟页到该物理页的映射
* 预取机制（prefetching）：发生换入操作时，预测哪些页将被访问，提前换入物理内存，减少发生缺页异常的次数，从而降低磁盘操作的耗时。
* 按需页分配（demand paging）：应用程序申请分配内存时，操作系统可选择将新分配的虚拟页标记成已分配但未映射状态，当应用程序真正需要物理内存时才分配物理页，从而提高资源利用率
  * 操作系统记录虚拟页分配状态

##### 页替换策略

目标：最小化缺页异常次数

* MIN/OPT策略：优先选择未来最长时间不会再访问的页换出（理论最优策略，但因为无法预知页访问顺序，故实际中难以实现）
* FIFO策略：优先选择最先换入的页换出（时间开销低，但因为页换入顺序与使用是否频繁无关，故实际表现差）
* Second Chance策略：除了维护一个页队列外，还为每个物理页维护一个标志位，若访问的页面已在队列中，则设置标志位；从队头寻找将要换出的物理页时，若标记位非空，则将标志位记空并将此页塞回队尾再继续找队头（二次机会）；若标志位为空，则替换此页；改良FIFO
* LRU策略：优先选择最久未被访问的页面换出（效果接近MIN策略，但实现此策略需要时刻记录CPU访问了哪些物理页，开销较大）
* MRU策略：优先选择最近访问的页面换出（基于程序不重复访问假设，如看视频不回看）
* 时钟算法策略：Second Chance策略的循环队列版本（想象针臂一圈圈地在检查），较高效

##### 工作集模型

* 定义：应用程序在时刻t的工作集W是它在时间区间[t-x, t]使用的内存页集合，也被视为下一段x时间内会访问的内存页集合
* 意义：指导操作系统的换页策略，优先将非工作集中的页换出
* 追踪方法：工作集时钟算法
  * 操作系统经过固定时间间隔调用工作集追踪函数，追踪函数为每个内存页维护两个状态，上次使用时间和访问位，均初始化为0；
  * 调用时，函数检查内存页状态，若访问位为1，则说明本次时间间隔内页面被访问过，故用当前系统时间更新上次使用时间，并重置访问位；若访问位为0，则函数会计算该页的年龄（当前时间 - 上次使用时间），超出阈值x则说明此页不在工作集，替换之

#### 虚拟内存功能

虚拟内存抽象除了使应用程序拥有独立而连续的虚拟地址空间外，还带来许多有用的功能

* 共享内存（shared memory）
  * 机制：应用程序$A$的虚拟页 $V_A$和应用程序$B$的虚拟页$V_B$被映射到同一物理页 $P$，不同应用程序之间可以相互通信，传递数据
* 写时拷贝（copy-on-write）
  * 场景适用性：
    * 1、当两个应用程序拥有很多相同的内存数据（如相同的动态链接库），若仅在物理内存存储一份，然后以只读方式映射给两个应用程序，能节约内存资源
    * 2、应用程序通过fork系统调用创建子程序，初始时，父子程序的全部内存资源和地址空间完全一样，避免内存拷贝操作带来的时间空间开销
  * 机制：
    * 写时拷贝技术允许应用程序A和应用程序B以只读方式共享一段物理内存
    * 一旦某个应用程序修改，会触发缺页异常（违反权限导致的），操作系统会在物理内存中将缺页异常的物理页重新拷贝一份，新拷贝的物理页以可读可写的方式给触发异常的应用程序使用，并恢复应用程序执行
* 内存去重（memory deduplication）
  * 原理：操作系统可以定期在内存中扫描具有相同内容的物理页，找到映射到这些物理页的虚拟页，然后只保留其中一个物理页，将其他虚拟页都用写时拷贝的方式映射到该物理页，释放其他物理页
  * 案例：Linux中的KSM机制
  * 缺点：
    * 1、内存去重功能会对应用程序访存时延造成影响（当应用程序写一个被去重的内存页时，会触发缺页异常，又会导致内存拷贝，使性能下降）
    * 2、内存去重可能带来安全问题，攻击者在内存中通过穷举的方式构造数据，然后通过访问延迟确认操作系统是否发生了去重，从而通过这种猜测的方式确认系统中是否存在特定敏感数据，一种防御办法是以应用程序粒度来进行内存去重（无法猜其他程序的数据）
* 内存压缩
  * 机制：当内存资源不足时，操作系统选择最近不太会使用的内存页，压缩其中数据，从而释放空闲内存，当应用程序访问时，再解压即可（在内存中操作，不落盘，保证速度）
  * 案例：Linux中的zswap机制
    * zswap机制在内存中为换页过程提供缓冲区（zswap区域，依然是内存）
    * 此机制使内存数据写到磁盘的操作可以延迟完成，拥有高效的磁盘批量I/O，甚至可能避免磁盘I/O
    * 图4-8
* 大页
  * 案例：Linux中的透明大页机制，能自动将一个应用程序中连续的4kB内存页合并成2MB的内存页
  * 优点：
    * 1、减少TLB缓存项的使用，提高TLB命中率
    * 2、减少页表的级数，提升查询页表的效率
  * 缺点：
    * 1、应用程序未使用整个大页造成物理内存资源浪费
    * 2、使用大页会增加操作系统管理内存的复杂度

#### 物理内存分配与管理

##### 目标与评价维度

* 更高的内存资源利用率（减少内存碎片）
  * 外部碎片：多次分配和回收后，物理内存上空闲的部分处于离散分布状态，无法被使用
  * 内部碎片：分配的内存空间大于实际所需
  * ![](https://tva1.sinaimg.cn/large/008i3skNly1gt684jjhdxj31510gmjvz.jpg)
* 更好的性能（降低分配延迟，节约CPU资源）

##### 伙伴系统

* 场景：分配连续的物理内存页
* 思想：将物理内存划分成连续的块，以块为基本单位进行分配，基于伙伴块分裂合并的物理内存分配与回收
* 实现：空闲链表数组
* ![](https://tva1.sinaimg.cn/large/008i3skNly1gt75mjof8bj30yy0d2mzt.jpg)
* ![](https://tva1.sinaimg.cn/large/008i3skNly1gt75n6lzw5j30wo0amjte.jpg)
* 优点：
  * 1、资源利用率：分裂和合并操作是级联的，能有效缓解外部碎片；但最小分配单位是一个物理页（4KB），会出现严重的内部碎片问题
  * 2、性能：确认一个块的伙伴块很简单，因为互为伙伴块的两个块的物理地址仅有一位不同，且该位由块大小决定

##### SLAB分配器

* 场景：分配小内存
* SLAB分配器是一个家族，包括最开始的SLAB分配器，简化设计和复杂度但性能相当的SLUB分配器（Linux2.6后内核的默认分配器），满足内存资源稀缺场景需求但碎片处理方面较弱的SLOB分配器
* SLUB分配器将伙伴系统分配的大块内存进一步细分成小块内存进行管理。为避免外部碎片问题，SLUB分配器只分配固定大小的内存块，一般是$2^n (3 \le n \lt 12)$字节，对于每一种块大小，SLUB分配器会使用独立的内存资源池进行分配
* 具体实现有个体差异，略

##### 空闲链表

* 在用户态的内存分配器（如堆）中常被用到

| 名称         | 特性                                                         | 分配                                                         | 回收                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 隐式空闲链表 | 每个内存块头部存储关于块的空闲状态、大小信息；通过块大小，可找到下一个块的位置 | 分配器查询链表，找到第一块大小足够的空闲内存块返回（若有足量剩余、则分裂块，仅取一部分服务请求，缓解内部碎片问题） | 分配器检查内存块紧邻前后两个内存块是否空闲，若有空闲，则进行合并，产生更大的空闲块 |
| 显式空闲链表 | 仅把空闲的内存块放在链表里，每个空闲块需要额外维护两个指针指向前后空闲块（分配时间仅与空闲块数量正相关，在内存使用率高的情况下优势明显） |                                                              |                                                              |
| 分离空闲链表 | 维护多条不同的显式空闲链表，每条链表服务固定范围大小的请求（分配时间进一步减小，更好地支持并发操作，近似于best-fit策略） |                                                              |                                                              |

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gt76ijze8qj31080r047b.jpg" style="zoom:50%;" />

##### 物理内存与CPU缓存

* 动机：操作系统给应用程序分配物理页时，若能分配尽量不会造成缓存冲突的物理页，就能将更多的应用数据存在缓存中，提升访存性能
* 方案：
  * 软件：采用缓存着色（cache coloring）机制，可能造成缓存冲突的物理页染上同一种颜色，在为连续虚拟内存页分配物理页时，优先选择不同颜色的物理页进行分配
  * 硬件：如Intel缓存分配技术（CAT）和AArch64上的MPAM技术，通过限制应用程序能使用的最末级缓存（每个CPU核心能同时运行不同程序），避免应用程序互相竞争带来性能抖动

## Chap5 进程与线程

#### 进程

##### 进程的状态

* 新生状态-预备状态-运行状态-阻塞状态-终止状态

![](https://tva1.sinaimg.cn/large/008i3skNly1gtcpwd34gmj61970bj0xf02.jpg)

##### 进程的内存空间布局

* 进程具有独立的虚拟内存空间，典型的布局包括如下元素

  * 用户栈：栈保存进程需要使用的各种临时数据（如临时变量的值），栈的扩展方向是自顶向下，栈底在高地址上
  * 代码库：进程执行需要依赖共享的代码库（如libc），代码库会被映射到用户栈下方，并被标记为只读
  * 用户堆：堆管理进程动态分配的内存，堆的扩展方向是自底向上的
  * 数据与代码段：在进程执行前，操作系统会将二进制文件载入虚拟地址空间，其中，数据段主要保存全局变量的值，代码段保存的是进程执行所需的代码
  * 内核部分：处于进程地址空间最顶端，每个进程的虚拟地址空间都映射了相同的内核内存；用户态运行时，内核内存是不可见的；内核态运行时，才能访问内核部分的代码和数据段以及内核栈

  <img src="https://tva1.sinaimg.cn/large/008i3skNly1gtcq701s9fj60os11ethz02.jpg" style="zoom:40%;" />

* 在Linux中，可以使用``cat /proc/${PID}/maps``查看某个进程的内存空间布局，返回六列，其中vdso和vvar是与系统调用相关的内存区域
  * address: 0085d000-00872000 虚拟内存区域的起始和终止地址文件所占的地址空间
  * perms:rw-p 权限：r=read, w=write, x=execute, s=shared, p=private(copy on write)
  * offset: 00000000 虚拟内存区域在被映射文件中的偏移量
  * dev: 03:08 文件的主设备号和次设备号
  * inode: 设备的节点号，0表示没有节点与内存相对应
  * name: /lib/ld-2.3.4.so 被映射文件的文件名

##### 进程控制块和上下文切换

* 在内核中，每个进程都通过一个叫做进程控制块（Process Control Block，PCB）的数据结构保存相关状态，如进程标识符（PID），进程状态，虚拟内存状态，打开的文件等等。Linux4.14中的PCB是名为task_struct的结构体
* 进程的上下文（context）：进程运行时的寄存器状态，用于保存和恢复上一个进程在处理器上运行的状态
* 进程上下文切换机制：在进程切换时，将进程的寄存器状态写到待切出进程的PCB中，然后读入待切入进程的PCB，载入到寄存器
* 随着操作系统发展，调度和上下文切换的基本单位从进程变为线程

#### Linux的进程操作

##### 进程的创建：fork

```c
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>

char str[11] = {0};

int main(int argc, char* argv[]){
  int x = 42;
  int fd = open("test.txt", O_RDWR);
  int rc = fork();
  if (rc < 0){
    // 子进程创建失败
    fprintf(stderr, "Fork failed\n");
  } else if(rc == 0){
    // 子进程
    ssize_t cnt = read(fd, str, 10);
    printf("Child Process: rc is: %d; The value of x is: %d; str is %s\n", rc, x, str);
  } else{
    // 父进程
    ssize_t cnt = read(fd, str, 10);
    printf("Parent Process: rc is: %d; The value of x is: %d; str is %s\n", rc, x, str);
  }
}
```

```
Parent Process: rc is 8283; The value of x is 42; str is abcdefghij
Child Process: rc is 0; The value of x is 42; str is klmnopqrst
```

* fork接口不接受任何参数，返回值是当前进程的PID，在子进程中返回值为0
* 当一个进程调用fork时，操作系统会为该进程创建一个几乎一样的新进程，两个进程的内存、寄存器、程序计数器等状态完全一致，但拥有不同的PID和虚拟内存空间，fork完成后独立执行，互不干扰
* 父子进程执行的顺序是不确定的，因为在操作系统调度器的视角下，他们是完全独立的个体
* 子进程在fork的时候拿到父进程的文件描述符（file descriptor, fd）表，所以会指向相同的文件抽象，而Linux在实现read操作时会对文件抽象加锁，故父子进程不会读到相同的字符串；由此可见，fork后父子进程存在大量共享，造成很多不确定行为，POSIX标准列出了调用fork的25中特殊情况的处理方法
* 系统中的第一个进程是操作系统创建，特定且唯一的

##### 进程的执行：exec

* Linux提供了exec接口用于执行用户指定的二进制文件，其中最全面的是execve，接受三个参数
  * pathname：进程需要载入的可执行文件路径
  * argv：进程执行所需要的参数（用于给main函数）
  * envp：进程定义的环境变量

```
#include <unistd.h>
int execve(const char* pathname, char* const argv[], char* const envp[]);
```

* 当execve被调用时，先从可执行文件中载入数据段和代码段到当前进程的地址空间，再重新初始化堆栈，将PC寄存器设置到可执行文件代码段定义的入口点

##### 进程管理

###### 进程树

* Linux中，由于进程是fork创建的，且每个进程的PCB都记录了父进程和子进程，故构成了进程树结构
* Linux下有2个特殊的进程：init进程(PID = 1)和kthreadd(PID = 2)

###### 进程间监控：wait

```c
#include <sys/types.h>
#include <sys/wait.h>

pid_t waitpid(pid_t pid, int* wstatus, int options);
```

* 进程可以使用wait操作来对其子进程进行监控，第一个参数是子进程id，第二个参数用于保存子进程状态，若子进程退出，则返回设置wstatus指针对应的值，否则会阻塞等待。
* 若父进程没有调用wait操作，就算子进程已经终止，也不会完全释放资源，内核会为僵尸进程保留其进程描述符（PID）和终止时的信息（wstatus）；当父进程退出时，其创建的僵尸进程都会被内核的第一个进程init通过调用wait的方式回收

###### 进程组和会话

* 进程组：进程的集合，由一个或多个进程组成，其作用体现在对信号的处理上，应用程序可以调用killpg向一个进程组发送信号，这个信号会被发送给这个进程组的每个进程
* 会话：进程组的集合，由一个或多个进程组组成，根据执行状态，分为前台进程组、后台进程组
* 控制终端（controlling terminal）进程是会话与外界进行交互的窗口，启用一个终端（shell）对应一个会话

##### fork过时了吗

* fork的评价

  * 优点：
    * 1、设计简洁，和exec组合将进程创建进一步解耦（在fork调用后，exec调用前，对子进程进行各种设定）
    * 2、强调了进程间的联系：如同一个shell创建的进程虽然功能不同，但都属于同一个用户，因此可以共享很多状态；又如web服务器可以通过fork创建多个进程应对逻辑相似的用户请求
  * 缺点：
    * 1、实现复杂：需要考虑特殊情况越来越多以修正父进程与子进程的共享状态问题
    * 2、性能太差：尽管写时拷贝技术已经大大提高效率，但在大内存应用的今天，建立内存映射的耗时使得fork不能满足效率需要
    * 3、安全隐患：fork建立的父子进程之间的联系可能成为攻击切入点，如BROP攻击

* fork的替代方案

  * 合二为一：posix_spawn：近似为fork和exec的功能结合，性能更佳，灵活度较低
  * 限定场景：vfork：从父进程中创建出子进程，但不为子进程创建独立地址空间，而是共享地址空间，一个进程对内存的修改会影响另一进程，为了保证正确性，vfork会在结束后阻塞父进程，直到子进程调用exec或退出为止，在大内存应用程序场景下，性能有提升
  * 精密控制：rfork/clone：允许父进程和子进程共享部分特定资源

  ```c
  #include <spawn.h>
  
  int posix_spawn(pid_t *pid, 
                  const char *path, 
                  const posix_spawn_file_actions_t *file_actions,
                  const posix_spawnattr_t *attrp,
                 	char *const argv[],
                  char * const envp[]);
  ```

  ```c
  #include <sys/types.h>
  #include <unistd.h>
  
  pid_t vfork(void);
  ```

  ```c
  #include <sched.h>
  
  int clone(int (*fn)(void*), //fn是进程创建完成后需要执行的函数
           	void *stack, //子进程栈的位置
           	int flags, // 指定不需要复制的部分
           	void *arg, // arg是提供给子进程的参数
            ...);
  ```

#### 线程

* 随着CPU核心数增加，程序可并行度提高，进程这一抽象太笨重
  * 1、创建进程开销大（独立地址空间，载入数据段代码段，初始化堆栈等）
  * 2、进程间数据共享和同步麻烦（共享虚拟内存页粒度过粗，进程间通信开销大）
* 线程：进程内部可独立执行的单元，共享地址空间，但各自保存运行时所需状态（上下文）

##### 多线程地址空间布局

* 内核栈和用户栈分离，共享除栈外的其他区域
* malloc的实现需要使用同步原语

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gtd4jwk5trj60dp0z2gp202.jpg" style="zoom:33%;" />

##### 用户态线程和内核态线程

* 用户态线程：由应用创建，内核不可见，不直接受操作系统调度器管理，轻量级，与内核态相关的操作需要内核态线程协助完成
* 内核态线程：由内核创建，受操作系统调度器直接管理
* 多线程模型：操作系统会建立的用户态线程和内核态线程的关系，让二者协作，主要有以下三种
  * 多对一：将多个用户态线程映射给单一的内核态线程，每次仅有一个用户态线程进入内核，其他被阻塞，模型较简单
  * 一对一：每个用户态线程有对应的内核态线程执行相关逻辑，无需担心阻塞其他线程，创建内核态线程开销随用户态线程增加而增大，故通过限制用户态线程总数来避免性能下降，模型扩展性更好（主流模型，Linux、Windows采用此模型）
  * 多对多：将N个用户态线程映射到M个内核态线程中（N > M），M可以设为核心数，缓解了多对一的阻塞问题和一对一的开销问题，但管理起来会更复杂

##### 线程控制块与线程本地存储

* 线程控制块（TCB）：
  * 主流一对一线程模型中，内核态线程和用户态线程各自保存自己的TCB
  * 内核态TCB：存储线程运行状态、内存映射、标识符等信息
  * 用户态TCB：内核态TCB的扩展，具体结构由线程库决定，一个重要的功能是线程本地存储
* 线程本地存储（Thread Local Storage, TLS）
  * 可定义线程私有全局变量（一个名字，多份拷贝）如：``__thread int count;``

##### 线程基本接口——以POSIX线程库为例

* 线程创建：pthread_create函数，通过clone函数来实现，创建出一个从属于原进程，共享大量数据结构，拥有私有栈的实例（即对应一个线程）
* 线程退出：pthread_exit函数，会被隐式调用，若如此，线程主函数返回值即线程返回值
* 出让资源：pthread_yield函数，允许线程主动暂停，让出当前CPU给其他线程使用，如等待外部事件时
* 合并操作：pthread_join函数，允许一个线程等待另一个线程的执行，并获取其执行结果
* 挂起与唤醒：使线程挂起（进入阻塞状态）的机制有两种
  * 等待固定时间：sleep函数
  * 等待具体事件：pthread_cond_wait函数，使用条件变量作为同步的方式
  * 二者结合：pthread_cond_timedwait函数，等待超过固定时间或接受到信号都唤醒线程
* sleep和yield的区别
  * 线程调用sleep后进入阻塞状态，线程调用yield后进入预备状态
  * yield适合等待条件很快被满足的情况，yield可以看作sleep(0)

##### Chcore中上下文切换的实现

* 进入内核态，保存上下文；切换页表和内核栈；恢复上下文和返回用户态

![](https://tva1.sinaimg.cn/large/008i3skNly1gte2v7hhrtj61al0dsn1n02.jpg)

#### 纤程

* 背景：
  * 1、与操作系统调度器相比，应用程序对线程的语义和执行状态更了解，能作出更优的调度决策
  * 2、用户态线程（纤程，fiber）更轻量级，合理使用有利于提高系统可扩展性
* POSIX的纤程支持

```c
#include <ucontext.h>

int getcontext(ucontext_t *ucp); // 保存当前上下文
int setcontext(const ucontext_t *ucp); // 切换到另一个上下文
void makecontext(ucontext_t *ucp, void (*func)(), int argc, ...); // 创建一个全新的上下文，并保存在参数ucp中
```

```c
// 一个生产者消费者模型
#include <signal.h>
#include <stdio.h>
#include <ucontext.h>
#include <unistd.h>

ucontext_t ucontext1, ucontext2;
int current = 0;

void produce(){
  current++;
  setcontext(&ucontext2);
}

void consume(){
  printf("current value: %d \n", current);
  setcontext(&ucontext1);
}

int main(int argc, const char *argv[]){
  // 应用程序准备两个上下文的栈
  char func_stack1[SIGSTKSZ];
  char func_stack2[SIGSTKSZ];
  
  getcontext(&ucontext1);
  ucontext1.uc_link = NULL;
  ucontext1.uc_stack.ss_sp = func_stack1;
  ucontext1.uc_stack.ss_size = sizeof(func_stack1);
  makecontext(&ucontext1, (void(*)(void))produce, 0);
  
  getcontext(&ucontext2);
  ucontext2.uc_link = NULL;
  ucontext2.uc_stack.ss_sp = func_stack2;
  ucontext2.uc_stack.ss_size = sizeof(func_stack2);
  makecontext(&ucontext2, (void(*)(void))consume, 0);
  
  // 不需要操作系统调度器的参与，避免上下文切换的开销和调度时间等候间隔
  setcontext(&ucontext1);
  
  return 0;
}
```

* 操作系统可以通过中断的方式抢占CPU并进行上下文切换，此为抢占式多任务处理
* 纤程库一般提供yield接口，暂时放弃CPU，允许其他纤程调度，此为合作式多任务处理
* 一般程序语言提供的纤程支持称为协程（coroutine），方便应用程序创建和管理轻量级上下文，常用于上下文切换频繁的场景

## Chap6 操作系统调度

#### 计算机调度简介

##### 操作系统调度

* Linux上的htop命令
  * 1、查看系统每个CPU核，内存，交换区占用，当前任务数，线程数
  * 2、查看每个进程资源占用，和启动该进程的命令，以及方便的系列功能

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gte6vnrcbbj613y0npqff02.jpg" alt="image-20210812183810847" style="zoom:50%;" />

* 操作系统的任务调度器通过维护运行队列来管理任务（Linux通过红黑树实现运行队列）

##### 调度指标

* 性能指标：吞吐量、周转时间（任务从发起到执行结束）、响应时间
* 非性能指标：公平性、资源利用率
* 场景需求：实时性、能耗

##### 调度权衡

* 调度开销与调度效果：合理的调度决策需要大量的计算，耗时变长
* 优先级与公平性：保证高优先级任务优先执行、但不能让低优先级任务执行时间过短
* 性能与能耗：若调度器过分追求性能，使CPU高速运转，则会使电量迅速耗尽

#### 调度机制

##### 长期、中期、短期调度

* 长期调度：决定系统中真正被短期调度管理的进程数量

* 中期调度：换页机制的一部分，当系统进程占用了大量内存时，会根据策略挂起系统中被短期调度管理的特定进程（挂起阻塞状态、挂起预备状态，挂起后无法被短期调度），换页机制会倾向选择被挂起的进程的内存页替换入磁盘，并在适当时机重新激活进程

* 短期调度：负责进程在预备状态、运行状态、阻塞状态间的转换

![](https://tva1.sinaimg.cn/large/008i3skNly1gtebkc9xo6j61f40na0yz02.jpg)

* 长短期调度会考虑CPU、IO，中期调度会考虑内存

#### 单核调度策略

##### 经典调度

| 策略名称                                                     | 描述                                                         | 优点                       | 缺点                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------- | ------------------------------------------------------------ |
| 先到先得（First Come First Serve, FCFS）                     | 任务的执行顺序与其进入运行队列的顺序一致                     | 简单直观                   | 1、在长短任务混合场景下对短任务不友好<br>2、对IO密集型任务不友好 |
| 最短任务优先（Shortest Job First, SJF）                      | 调度时选择运行时间最短的任务执行                             | 平均周转时间较FCFS短       | 1、任务的运行时间是不可预判的<br>2、表现严重依赖于任务到达时间点 |
| 最短完成时间任务优先（Shortest Time-to-Completion First, STCF） | 最短任务优先的抢占式调度版本                                 | 表现对任务到达时间依赖减少 | 1、长任务难以被调度，公平性不足                              |
| 时间片轮转（Round Robin, RR）                                | 任务执行完时间片后，切换到预备队列的下一个任务，若任务未完成，则塞回队尾 | 关注响应时间，提升用户体验 | 1、任务运行时间相似的场景下平均周转时间高<br>2、需要选择合理的时间片值 |

##### 优先级调度

* 调度器应避免交互式任务被批处理任务阻塞，可通过设置优先级来实现
* 多级队列（Multi-Level Queue, MLQ）
  * 描述
    * 每个优先级一个队列
    * 一个任务必须等到所有优先级比它高的任务调度完才能被调度
    * 处于相同优先级队列的任务，可针对性采用不同调度策略，如FCFS、RR
  * 评价
    * 适合静态应用场景
    * 注意提高IO密集型任务的优先级
  * 问题
    * 低优先级任务饥饿：需要监控任务等待时间，过长则提升优先级
    * 优先级反转：低优先级任务B占了一把锁，导致高优先级任务A无法操作

* 多级反馈队列（Multi-Level Feedback Queue, MLFQ）
  * 目标
    * 在无法预知任务信息且任务类型动态变化（CPU密集/IO密集间转换）场景下，既能达到像STCF策略一样的周转时间，又能像RR策略一样降低响应时间
  * 改良（from MLQ）
    * 1、短任务拥有更高的优先级
      * 默认初始为短任务，最高优先级，若任务在当前队列运行总时间超过阈值，则判定为长任务，优先级降一级
    * 2、低优先级任务采用更长时间片
    * 3、定时将所有任务优先级提到最高
      * 避免饥饿现象
  * 参数
    * 优先级队列数，每个优先级队列的时间片，任务在每个优先级队列的最大运行时间，调度器定时提升优先级的时间间隔

##### 公平共享调度

* 优先级调度是为了优化任务周转时间、响应时间和资源利用率而设计的
* 基于份额的公平调度是为了让每个任务都能使用它应得的系统资源（符合用户预期的）

| 调度方法 | 描述                                                         | 优化方法                                                     | 潜在问题                                                     |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 彩票调度 | 任务份额作为其被调度的概率，使用随机数模拟                   | 1、彩票转让：将自己的份额借给别的任务，解决锁类的优先级反转问题<br>2、彩票货币：用户或任务组分配份额给子任务时，采用自己的计算方式，提高灵活性<br>3、彩票通胀：给任务一定自由度，允许任务根据当前对CPU资源需求决定自己的份额 | 1、随机数模拟公平调度器的公平性只有在调度次数足够多才有效    |
| 步幅调度 | 任务每次调度时增加一定的虚拟时间（步幅），每次调度时选择虚拟时间最少的任务去运行，那么经历相同虚拟时间的任务，任务的份额之比对应任务步幅的倒数之比（确定性公平共享调度策略） |                                                              | 1、任务可能在任意时间进入系统，任务的初始虚拟时间pass应设置为当前所有任务的最小pass值 |

##### 实时调度

* 实时任务分类
  * 硬实时任务/软实时任务：是否必须都在截止时间前完成
  * 周期任务/偶发任务/非周期任务：确定性周期，具有下界不确定周期（一般硬实时），完全随机（一般软实时）
* 实时任务调度存在性判断
  * 设有$m$个任务，任务$i$的运行时间是$C_i$，周期是 $T_i$，则单位时间CPU利用率为 $U=\sum\limits_{i=1}^{m}\frac{C_i}{T_i}$
  * 若 $U > 1$，则说明不存在这样的实时调度
* 面向周期任务的实时调度算法（简化假设：周期和截止时间一致，任务具有独立性）
  * 速率单调（RM）：
    * 基于静态优先级的实时调度策略中的最优（静态：即预知任务列表和每个任务周期$T$）
    * 抢占式优先调度 $T$ 较小的任务
    * 调度$N$个任务时，最坏情况下CPU利用率为 $\frac{N}{2^{1/N}-1}$，当 $N \rightarrow \infty$ 时，其值约为69%，即一组任务的$U$值若低于此，则RM策略能提供合法的调度
  * 最早截止时间有限（EDF）
    * 单核抢占式场景，任务互相无关下，EDF是基于动态优先级策略中的理论最优
    * 抢占式优先调度截止时间最近的任务（无需知道周期、运行时间等信息）
    * 对于$U \le 1$的任务组，EDF策略能提供合法的调度
    * 在$U \le 1$时，是最优实时调度策略；但$U \gt 1$时，会因一个任务错过截止时间而带来大量后续任务错过截止时间的多米诺效应

##### 通用调度

* 借用虚拟时间（BVT）

  * 整合步幅调度和优先级调度，既保证了公平共享调度又保证了实时任务的实时性
  * 对于需要尽快完成的任务，BVT策略允许任务将自己的pass值降低，以达到被优先调用的目的
  * 调度器根据通过实际生效的虚拟时间来选取下一个调度的任务

    * $VirtualTime_{effective}=VitrualTime_{Actual} - (Flag_{Wrap} \ ?\  W:0)$

  * 新任务、处于阻塞状态中的任务可能在任意时间进入系统，故其虚拟时间需要在进入系统时被重新设置
    * $VirtualTime_{Actual} = max (VirtualTime_{Actual}, SVT)$
    * $SVT$：Scheduler Vitrual Time，表示调度器中所有处于非阻塞和阻塞状态任务的最小VirtualTime_Actual
  * 防止恶意任务无端借用未来虚拟时间的措施

    * 1、限制任务最大可借用的虚拟时间量
    * 2、任务在一定物理时间后必须将借用的虚拟时间归还，并将Flag_wrap置为False

  * 例子
    * ![](https://tva1.sinaimg.cn/large/008i3skNly1gtk6dh1a5jj61d60t07bv02.jpg)

#### 多核调度策略

##### 负载分担

* 描述：多核共享一个全局运行队列，当一个CPU核心需要执行任务时，根据任意单核调度策略，决定从全局运行队列中下一个由它执行的任务
* 优点：
  * 1、设计实现简单、将多核调度问题规约为单核调度问题
  * 2、不会出现CPU资源浪费的情况
* 问题：
  * 1、多核之间的同步问题可能导致调度开销变得不可忽视
  * 2、任务在多个CPU核心间来回切换的开销（RR策略下，会出现大量开销，如重新载入缓存、刷新TLB等）

##### 协同调度

* 场景：多线程程序为了利用多核处理器，通常将大任务切成多个子任务，交给不同的CPU核心运行，但子任务之间可能存在依赖关系（不能同时执行）或关联关系（最好同时执行）
* 描述：尽可能让一组任务并行执行，避免同时调度有依赖关系的两组任务，避免关联任务执行效率降低的情况（通信开销），与并行计算中的整体同步并行计算（BSP）模型契合
* 群组调度：
  * 思想：将关联任务设置为一组，以组为单位调度任务在多个CPU核心上执行，使它们的开始时间和结束时间接近相同
  * 优点：提升特定应用场景任务执行性能，但因为要求无关联的任务必须同时进入或退出CPU核心，无关联任务之间的互相等待可能造成CPU资源的浪费
  * <img src="https://tva1.sinaimg.cn/large/008i3skNly1gtk6qvt9xjj617t0jp42n02.jpg" style="zoom:25%;" />

##### 两级调度

* <img src="https://tva1.sinaimg.cn/large/008i3skNly1gtk6ot1pp8j61e10omdmq02.jpg" style="zoom:25%;" />

* 线程无须在CPU核心间来回切换，提高缓存局部性，减少数据竞争的冲突

##### 负载追踪与负载均衡

* 负载追踪
  * 运行队列粒度的负载追踪：Linux3.8前，认为运行队列长则负载高，但任务迁移时由于缺乏每个任务的信息，故无法选出合适的任务迁移
  * 调度实体粒度的负载追踪（PELT）：Linux3.8后，PELT通过记录每个任务的历史执行情况来表示任务的当前负载，调度器以1024微秒为一个周期，记录任务处于可运行状态的时间为x微秒，则第i个周期内对当前CPU利用率为 $x / 1024$，对应的CPU负载 $L_i$ = CPU容量常数 * CPU利用率；任务负载随着时间动态变化，使用$ L' = yL + L_i$，进而统计出每个运行队列的负载

* 负载均衡

  * 基本思想：通过追踪每个CPU核心当前的负载情况，将处于高负载的CPU核心管理的任务迁移到低负载的CPU核心上

  * 基本要求：负载均衡决策开销尽量小，且让任务尽量在迁移开销小的CPU核心间迁移

  * 例子：非一致内存访问（Non-Uniform Memory Access, NUMA）的多核处理器系统架构

    * 结构：NUMA域->物理域->逻辑域
    * 特性：
      * 1、numa节点拥有本地内存，访问其他numa节点的远端内存时，时延高于访问本地内存
      * 2、任务在同属于一个物理核的逻辑核间切换的开销比在不同物理核之间切换小很多
    * 方法：调度域是拥有相同特性的CPU核心的集合，包含多个调度组；调度组是一个调度域内进行负载均衡的整体单位，每个CPU核心都维护一份只读的调度域和调度组数据拷贝。Linux通过自下而上的方式实现负载均衡，越高层级调度域间的负载均衡的开销越大，故Linux对不同层级的调度域设置了不同的负载均衡触发频率与阈值，减少负载均衡开销

    * <img src="https://tva1.sinaimg.cn/large/008i3skNly1gtk6ndxzz9j60wm0ogjwi02.jpg" style="zoom:33%;" />

##### 能耗感知调度（Energy Aware Scheduling，EAS）

* Linux当前使用的EAS调度器是在完全公平调度器（CFS）基础上扩展的，通过能耗模型了解每个CPU核心的容量（处理能力）和功率

  * 容量：在特定频率下的处理能力，被标准化到0-1024，
  * 功率：在特定频率下的功率，结合任务完成所需的时间计算出能耗
    * 能耗 = 任务负载 * 容量 / 功率，比较大小核的能耗决定在何处运行；也可以调节频率获取不同的容量功率参数组合（操作性能点OPP）

* EAS做出调度决策时，会选取每个性能域中剩余容量最大的CPU核心作为任务迁移备选，且计算出任务迁移后的总能耗，选取总能耗最低的CPU核心作为任务迁移目标

* 例子

  | 大核（PD0，core0+core1） |      | 小核（PD1，core2+core3） |      |
  | ------------------------ | ---- | ------------------------ | ---- |
  | 容量                     | 功率 | 容量                     | 功率 |
  | 384                      | 300  | 128                      | 80   |
  | 768                      | 900  | 256                      | 180  |
  | 1024                     | 1800 | 512                      | 440  |

  * 当前负载情况为core0：700，core1：500，core2：300，core3：100

  * 大核运行模式为1024/1800，小核运行模式为512/440，总能耗为1750

  * EAS决定调度core2上负载为100的任务，调动到core3时，会使小核进入256/180模式，从而总能耗为1688，最小，故采用此调度决策

* EAS适用于中低负载场景，因为在高负载场景下，两核都按最大模式运行，且缺乏迁移空间，此时Linux会关闭EAS并打开负载均衡；当负载下降时，Linux会关闭负载均衡而重新打开EAS

#### 调度进阶机制

* 操作系统为应用程序提供接口，可帮助有经验的开发者设定自己程序的调度行为

##### 处理器亲和性

* 处理器亲和性机制（processor affinity）：允许程序对任务可以使用的CPU核心进行配置

```c
#include <sched.h>

void CPU_ZERO(cpu_set_t *set); // 对set进行初始化，设置为空
void CPU_SET(int cpu, cpu_set_t *set); // 将对应CPU核心加入set中
void CPU_CLR(int cpu, cpu_set_t *set); // 将对应的CPU核心从set中删除
int CPU_ISSET(int cpu, cpu_set_t *set); //判断对应CPU核心是否在set中，是则返回1，否则返回0
int CPU_COUNT(cpu_set_t *set); // 返回当前set中的CPU核心数量

int sched_setaffinity(pid_t pid, size_t cpusetsize, const cpu_set_t *mask); //pid为Linux分配的线程标识符，0代表当前线程
int sched_getaffinity(pid_t pid, size_t cpusetsize, cpu_set_t *mask);
```

```c
#include <sched.h>
#include <stdio.h>
#include <sys/sysinfo.h>

int main(){
    cpu_set_t mask;
    CPU_ZERO(&mask);
    CPU_SET(0, &mask);
    CPU_SET(2, &mask);
    sched_setaffinity(0, sizeof(mask), &mask);
}
```

##### 调度策略配置

* Linux提供多种调度策略和调度器，允许程序根据不同场景进行选择，包括完全公平调度器（CFS），实时调度器（RT），截止时间调度器（DL），也支持对不同的任务设置不同调度策略
* Linux会优先调度DL管理器的任务，其次RT、最后是CFS，非实时任务的优先级必须设置为0，实时任务的优先级是[1,100)

| 调度器 | 调度策略       | 描述                               |
| ------ | -------------- | ---------------------------------- |
| CFS    | SCHED_OTHER    | 公平的分时调度策略                 |
| CFS    | SCHED_BATCH    | 针对不会与用户交互的批处理任务     |
| CFS    | SCHED_IDLE     | 针对优先级最低的后台任务           |
| RT     | SCHED_FIFO     | 执行直至结束或被更高优先级任务抢占 |
| RT     | SCHED_RR       | 执行一定时间片后不再执行           |
| DL     | SCHED_DEADLINE | 类似EDF                            |

#### 案例分析——现代调度器

##### Linux调度器

* Linux2.4之前，调度器是基于RR策略的运行队列
* Linux2.4引入了O(n)调度器，选取所有任务中动态优先级最高的任务进行调度，每次调度都需要重新计算队列内所有元素，但此设计调度开销过大，且多核扩展性差，缓存局部性也会受到影响
* Linux2.6引入了O(1)调度器，采用了两级调度的思想，每个本地运行队列实际上由两个多级队列，激活队列和过期队列组成，分别用于管理仍有时间片剩余的任务和时间片耗尽的任务，若当前激活队列无可调度任务，则交换这两个队列的角色；每个多级队列有140个优先级，0~100对应实时任务，100-140对应不同Nicess的非实时任务；每个多级队列维护一个位图，用于判断对应的优先级队列是否有任务等待调度，调度器能根据位图找到激活队列中首个不为空队列并取队头调度，故时间复杂度为O(1)，但此设计仍存在弊端如下：1、交互式任务的判定算法过于复杂；2、静态时间片带来的调度时延问题
* Linux2.6.23引入了完全公平调度器（CFS），具有动态时间片特性，使用红黑树作为运行队列，阻塞任务唤醒调整虚拟时间的机制

##### macOS/iOS调度器

* 面向用户体验的调度器GCD，使用公共线程池的方式管理线程，队列需要执行任务时，从线程池中选择一个空闲线程执行；GCD采用基于优先级的实时调度策略，使用QoS等级作为任务优先级（UserInteractive、UserInitiated、Default、Utility、Background），对应五个不同的优先级队列

## Chap7 进程间通信

* 多进程协作具有三点优势：功能模块化避免造轮子，增强模块间隔离提供安全保障，提高应用容错能力

#### 进程间通信基础

##### 数据传递方式

* 基于共享内存的信消息传递：多个进程在虚拟地址空间中映射了同一段物理内存，操作系统不参与后续通信过程
* 操作系统辅助的消息传递：内核对用户态提供通信接口，进程可以直接使用Send，Recv等接口将消息传递给另一进程

##### 控制流转移

![](https://tva1.sinaimg.cn/large/008i3skNly1gtna9yswhrj61bw0kd7c302.jpg)

##### 同步和异步

* 同步IPC指IPC操作会阻塞进程直至操作完成；异步IPC是非阻塞的，不需要等待完成
* 同步IPC有着更好的编程抽象，但高并发场景下，过少的工作线程会让大量用户进程被阻塞、过多的工作线程会浪费系统资源

#### 宏内核进程间通信

 <img src="https://tva1.sinaimg.cn/large/008i3skNly1gtne91e244j60t90zz7cf02.jpg" style="zoom:50%;" />

##### 微内核进程间通信

* Mach：通过进程间通信来传送端口，同步通信，由内核负责控制流的转移

  <img src="https://tva1.sinaimg.cn/large/008i3skNly1gtnew5rrm4j616a0fhn0q02.jpg" style="zoom:50%;" />

* L4：长短消息的传递使用不同方式

  ![](https://tva1.sinaimg.cn/large/008i3skNly1gtnews9idxj618q0gijvu02.jpg)

* LRPC：轻量级远程过程调用（迁移线程模型）
  * 在IPC过程中，内核不会阻塞调用者线程，但会让调用者线程执行被调用者的代码，不会唤醒被调用者线程，内核不会进行完整的上下文切换，仅切换地址空间和请求处理相关的系统状态，不会涉及线程和优先级切换，不会调用调度器
  * 迁移线程方案简化了控制流切换，通过共享参数栈和寄存器简化了数据传输，避免全局共享数据结构来优化并发

#### 案例分析：Android Binder、Chcore

* Android Binder IPC机制相比于Linux的通信机制，在性能、接口易用性上有提升
  * 大部分进程间通信实际上是远程过程调用，是同步的；客户端进程通过进程间通信发起请求，服务端进程负责提供具体服务，接受请求，返回结果。
  * Context Manager进程提供命名服务，任务是建立通信连接
  * 句柄是IPC对象（一个通信连接）的抽象，用户通过操作句柄完成IPC
  * 使用线程池模型
    * 
  * 匿名共享内存
    * 1、进程1打开匿名共享内存对应的字符设备
    * 2、设置内存段的大小
    * 3、通过mmap映射文件的方式，将创建的匿名共享内存映射到用户态空间
    * 4、进程1使用进程间通信传递文件描述符给进程2，以快速传递大量数据

## Chap8 同步原语

#### 互斥锁

##### 临界区问题

* 竞争冒险：程序的正确性依赖于特定执行顺序的情况，其本质原因是对于共享资源的竞争
* 互斥访问：任意时刻只允许最多一个线程访问的方式
* 临界区：保证互斥访问共享资源的代码区域
* 临界区问题：如何通过设计协议保证互斥访问临界区的问题，需要满足互斥访问、有限等待、空闲让进三个条件

##### 硬件实现：关闭中断

* 单核环境下，关闭中断可以满足互斥访问、有限等待、空闲让进三个条件；但多核环境下，互斥访问不满足

##### 软件实现：皮特森算法

```c
// 线程 x (x=0,1)
while(true){
  flag[x] = true;
  turn = 1-x;
  while(flag[1-x] == true && turn == 1-x);
  // 临界区部分
  flag[x] = false;
  // 其他代码
}
```

* Micha Hofri在1990年将皮特森算法扩展为任意数量线程，但皮特森算法要求访存操作严格按照程序顺序执行，但现代CPU允许乱序访存以获取高性能，故皮特森算法无法直接使用

##### 软硬件协同：使用原子操作实现互斥锁

* 原子操作：不可被打断的一个或一系列操作，常见的包括比较与置换（CAS），拿取并累加（FAA），这些是硬件保证的

* 互斥锁：

  * 利用原子CAS实现的自旋锁

    * 利用一个变量lock来表示锁的状态，1表示有人拿锁，0表示锁空闲
    * 加锁时会通过CAS判断lock是否空闲，若空闲则上锁，否则一遍遍重试；放锁时直接将lock值设为0
    * 自旋锁并不能保证有限等待，原子操作成功与否取决于硬件特性，自旋锁在竞争程度低时非常高效

    ```c
    void lock_init(int *lock){
      *lock = 0;
    }
    void lock(int *lock){
      while(atomic_CAS(lock, 0, 1) != 0);
    }
    void unlock(int *lock){
      *lock = 0;
    }
    ```

  * 利用原子FAA实现的排号自旋锁

    * 排号锁按照锁竞争者申请锁的顺序传递锁，保证有限等待的公平性

    ```c
    struct lock {
    	volatile int owner;
      volatile int next;
    }
    
    void lock_init(struct lock *lock){
      lock->owner = 0;
      lock->next = 0;
    }
    void lock(struct lock *lock){
      volatile int my_ticket = atomic_FAA(&lock->next, 1);
      while(lock->owner != my_ticket);
    }
    
    void unlock(struct lock *lock){
      lock->owner++;
    }
    ```

#### 条件变量

* 条件变量通过提供挂起/唤醒机制来避免循环等待，节省CPU资源，条件变量需要和互斥锁搭配使用
* 条件变量提供两个接口
  * cond_wait：挂起当前线程
    * 1、将当前线程加入等待队列
    * 2、原子地挂起当前线程并放锁 atomic_block_unlock
      * 若先放锁，再挂起，则在间隙间接受到唤醒信号时，无法被唤醒，导致挂起后再也无法被唤醒，出错
      * 若先挂起，则无法放锁
  * cond_signal：唤醒等待在该条件变量上的线程（一般在临界区内使用）

* 条件变量的实现

```c
struct cond {
  struct thread *wait_list;
};

void cond_wait(struct cond *cond, struct lock *mutex){
  list_append(cond->wait_list, thread_self());
  atomic_block_unlock(mutex);// 原子挂起并放锁
  lock(mutex); // 重新获取互斥锁
}

void cond_signal(struct cond *cond){
  if(!list.empty(cond->wait_list)){
    wakeup(list_remove(cond->wait_list));
  }
}

void cond_broadcast(struct cond *cond){
  while(!list.empty(cond->wait_list)){
    wakeup(list_remove(cond->wait_list));
  }
}
```

#### 信号量

* 信号量，又称PV原语，在不同的线程之间充当信号灯，根据剩余资源数量控制不同线程的执行与等待，一般使用wait和signal对应P操作和V操作
  * wait操作：在信号量的值小于等于0时进入循环等待，大于0时停止等待并消耗该资源
  * signal操作：增加信号量的值供wait的线程使用
* 信号量是由互斥锁、条件变量、计数器共同实现的

```c
struct sem {
  int value;
  int wakeup;
  struct lock sem_lock;
  struct cond sem_cond;
}

void wait(struct sem *S){
  lock(&S->sem_lock);
  S->value--;
  if (S->value < 0){
    do {
      cond_wait(&S->sem_cond, &S->sem_lock); //do-while确保调用signal后立刻调用wait的线程不会直接拿走资源
    }while(S->wakeup == 0);
  	S->wakeup--;
	}
  unlock(&S->sem_lock);
}

void signal(struct sem *S){
  lock(&S->sem_lock);
  S->value++;
  if (S->value <= 0){
    S->wakeup++;
    cond_signal(&S->sem_cond);
  }
  unlock(&S->sem_lock);
}
```

#### 读写锁

* 读读共享，读写互斥，写写互斥

* 读写锁允许多个读者进入读临界区，但当一些读者已经在读临界区时，若一个读者和一个写者同时申请进入临界区，会有两种选择
  * 偏向读者的读写锁：允许读者进入，直到没有读者时才允许写者进入，增加了读者并行性
  * 偏向写者的读写锁：等之前的读者离开临界区后，先允许写者进入，再允许读者进入，避免写者陷入无限等待

#### RCU

* 虽然读写锁允许多个读者同时进入读临界区，但写者会阻塞读者，且读者仍需要在关键路径上添加读者锁，会造成一定性能开销

* RCU：Read-Copy Update 是操作系统内核中广泛使用的同步原语，有效减少读者在关键路径上的性能开销
  * 允许多个读者同时进入临界区
  * 写者不会阻塞读者
  * 读者不需要额外的同步原语保护读临界区
* RCU引入了一种订阅发布机制，利用对64位指针的读写的原子性，让写者能原子地更新任意大小的数据，在写者更新指针前，读者读到旧数据；写者更新指针后，读者读到新数据，可以互不阻塞执行临界区内容
* 更新完指针后，旧数据可能处于被读状态，所以不能马上回收旧数据的内存，引入了宽限期的概念，用于描述从写者更新指针到最后一个可能观察到旧数据的读者离开的这段时间，
* 读者需要标明读临界区的开始与结束 ，以及使用订阅接口读取指针即可；但写者仍然需要使用互斥锁保证写者之间的互斥访问

#### 管程

* 线程安全：某个函数在多线程环境下被调用时，能正确使用同步原语保护多个线程对共享变量的访问与修改
* 管程（Monitor）：保证在同一时刻最多只有一个操作者能进入管程的保护区域访问共享数据，开发者只需调用管程提供的函数，无需使用额外的同步原语，从而减轻负担
  * Java程序中使用synchronized关键字及其对应管程来实现不同线程间的同步，Java的管程保证对于synchronized关键字保护的代码区域，最多只有一个Java线程能进入这些区域处理数据

#### 同步带来的问题

##### 死锁

* 定义：一组线程中的每一个都在等待组内其他线程释放资源从而造成的无限等待

* 案例：

  ```c
  void proc_A(void){
    lock(A);
    // t0
    lock(B);
    // critical area
    unlock(B);
    unlock(A);
  }
  
  void proc_B(void){
    lock(B);
    // t0
    lock(A);
    // critical area
    unlock(A);
    unlock(B);
  }
  ```

* 出现死锁的四个必要条件：互斥访问、持有并等待、资源非抢占、循环等待

* 死锁检测与恢复：

  * 死锁检测
    * 循环等待是死锁检测的关键，将资源和线程视为节点，维护一个资源分配表，若资源被线程占有，则画一条从资源到线程的实箭头，维护一个线程等待表，若线程等待资源，则画一条从线程到资源的虚箭头；若图中出现环，则出现死锁
    * 一般采用定时监测，超时等待检测的方法避免频繁检测带来严重的性能开销
  * 死锁预防
    * 避免互斥访问：需要增加代理线程处理共享数据；此法系统负担过大
    * 不允许持有并等待：要求线程在开始操作前一次性申请所有资源，若任一资源不可用，则必须放弃已经成功申请的资源；当资源竞争度高时，此法会陷入申请-释放循环，导致资源利用率低甚至饥饿的情况
    * 允许资源被抢占：允许线程抢占其他线程已经拥有的资源；此法的回滚恢复操作十分困难，仅适用于易于保存和恢复的场景
    * 避免循环等待：对所有资源进行编号，线程申请资源时需要按照资源编号递增的顺序申请；在任意时刻，系统总会有一个得到资源编号最大的线程，其之后申请的资源都未被占有，故线程可以继续执行，不会陷入循环等待
  * 死锁避免
    * 银行家算法：通过模拟分配资源后的状态，判断分配某个资源后系统是否处于安全状态，从而决定是否分配该资源
      * 初始化：设系统中存在M类资源，线程有N个，定义若干数据结构
        * 全局可用资源：$Available[M]$
        * 每个线程最大需求量：$Max[N][M]$
        * 已分配资源数量：$Allocation[N][M]$
        * 还需要资源数量：$Need[N][M]$

##### 活锁

* 活锁并未发生阻塞，而是线程不断重复尝试-失败-尝试的过程，有机会自行解开

##### 优先级反转

* 由于同步导致线程执行顺序违反预设优先级的问题，如下图案例，线程优先级 $t_1 \gt t_2 \gt t_3$，但因为$t_1$需要的资源被$t_3$先占了，导致$t_2$被优先调度执行完毕后，到$t_3$离开临界区，才是 $t_1$

![](https://tva1.sinaimg.cn/large/008i3skNly1gtv66vf8sqj619g0n5n1v02.jpg)

* 不可抢占临界区协议（NCP）：一旦线程进入临界区，不允许其他线程抢占；此法能解决优先级反转问题，但会因为阻塞影响到没有竞争关系的高优先级线程，导致其错过截止时间

* 优先级继承协议（PIP）：当高优先级线程等待锁时，会使锁的持有者继承其优先级，从而避免该锁的临界区被低优先级的任务打断，如下图所示（但有更高优先级线程到来时，会被打断）

  ![](https://tva1.sinaimg.cn/large/008i3skNly1gtv6b1c9mzj61bu0obagl02.jpg)
  
* 优先级置顶协议（PCP）：获取锁的线程的优先级置为可能竞争该锁的线程中的最高优先级，让临界区内的线程尽快执行完成

  * 即时优先级置顶协议（IPCP）：线程在获取锁时，就将自己的优先级提升
  * 原生优先级置顶协议（OPCP）：出现其他线程竞争资源时，才将自己的优先级提升

* NCP和IPCP实现难度较小，仅需禁止抢占和在获取锁时提升优先级；PIP和OPCP实现难度较大，需要监视已经被获取的锁，在其他线程尝试获取该锁时提升拥有者的优先级

#### 案例分析：Linux中的futex

* futex：fast user-space mutex 机制，使用futex机制实现的互斥锁在竞争程度低时，直接使用原子操作完成加锁，在竞争程度高时，通过系统调用挂起并等待被后续锁持有者唤醒。futex机制不仅用于避免互斥锁中的循环等待，还能用于实现条件变量等各类同步原语

## Chap9 文件系统

Linux内核的存储软件栈

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gu19a7pezoj60sn0sm7bc02.jpg" style="zoom:33%;" />

* 网络文件下载流程：
  * 1、文件内容暂存在下载工具的内存中
  * 2、下载工具向操作系统发生一系列系统调用（open、write），以持久保存下来
  * 3、Linux内核调用虚拟文件系统（VFS）处理文件请求，VFS是大管家，负责管理具体文件系统以及提供一系列缓存服务（页缓存、inode缓存、目录项缓存），VFS会调用具体文件系统处理请求（如EXT4）
  * 4、需要访问存储设备上的数据时，文件系统会创建对存储块的访问请求，并发送给IO调度器
  * 5、IO调度器根据预定策略调度请求，发送给设备驱动
  * 6、设备驱动与存储设备交互完成请求

#### 基于inode的文件系统

##### inode与文件

* 定义：index node，索引节点，记录了一个文件对应的所有存储块号

* 每个inode对应一个文件，采用分级的方式来组织存储块号（参考页表的方式），除此之外，inode还记录了文件元数据：文件模式、文件链接数、文件拥有者和用户组、文件大小、文件访问时间（注意：文件名不是文件的元数据！！！）

* Linux中支持的文件类型

  * | 文件类型     | 文件用途                           |
    | ------------ | ---------------------------------- |
    | 常规文件     | 保存数据                           |
    | 目录文件     | 表示和组织一组文件                 |
    | 符号链接文件 | 保存符号链接（指向目标文件的路径） |
    | FIFO文件     | 以队列形式传递数据，又称命名管道   |
    | 套接字文件   | 用于传递数据，比FIFO文件更灵活     |
    | 字符设备文件 | 表示和访问字符设备                 |
    | 块设备文件   | 表示和访问块设备                   |

##### 文件名与目录

* 文件系统增加了字符串形式的文件名，并增加一层从文件名字符串到inode号之间的映射，便于记忆，且解耦合
* 目录是一种特殊类型的文件，保存的是目录项，每个目录项代表一条文件信息，包括（inode、目录项长度、文件名长度、文件名）
* Linux中使用tree命令可以查看目录结构，每个目录中有两个特殊的目录项，``.``和``..``，对应当前目录和上级目录
* 对目录的操作包括
  * 查找：依次比较目录项中的文件名，在对应的inode上进行若干操作
  * 遍历：依次检查，并通过回调函数返回有效的目录项
  * 增加：重用无效的目录项或追加新的目录项在文件结尾
  * 删除：通过将inode号变为0来标记此目录项无效，高效利用空间；同时，文件删除时，可以将相邻的无效目录项进行合并，以允许更长的新目录项重新利用这些空间

##### 硬链接与符号链接

* 由于文件名不是文件的元数据，故一个文件可以对应多个文件名，即多个目录项指向同一个inode，Linux中使用``ln [file] [link]``命令创建出一个硬链接，硬链接与原文件具有同等地位
* 当一个目录项被删除时，其对应的inode的链接数-1，当链接数为0时，inode及其索引的结构和数据可以被销毁，空间得以释放
* 文件系统层面的操作只允许删除空的目录文件，所以``rm -r [dir]``命令，是自底向上依次删除遇到的文件，最后才将已经删空的dir目录删除
* 符号链接（软链接）是一种特殊的文件类型，保存的不是目录项，而是一个表示文件路径的字符串，Linux中使用``ln -s [file] [link]``创建，符号链接文件除了创建删除外，只支持读取操作
* 硬链接和符号链接的差别
  * 符号链接中，用户可以随便存放路径，仅当真正解析时才会报路径不存在的错
  * 硬链接要求目标文件不能为目录，而软链接可以
  * 软链接不受文件系统边界的限制，但硬链接的目标文件只能在同一个文件系统内

##### 存储布局

* 文件系统通常将存储空间划分成不同区域，用于不同功能，如下图所示

<img src="https://tva1.sinaimg.cn/large/008i3skNly1gu1eq8fv6nj618z0nzn2r02.jpg" style="zoom:50%;" />

* 超级块：记录整个文件系统的全局元数据，如代表不同文件系统的魔法数字，文件系统的版本，文件系统管理的空间的大小，最后一次挂载时间和一些统计信息（支持的最大inode数量、当前可用inode数量，支持的最大块数量，当前可用块数量）
* 块分配信息：使用位图格式标记文件数据块区域中各个块的使用情况，1代表已分配使用，0代表空闲
* inode分配信息：与块分配信息类似，对应的是inode表中每个inode的使用情况
* inode表：以数组形式保存整个文件系统中所有的inode结构
* 文件数据块：保存数据的区域，故一个存储设备上创建一个新的文件系统后，系统显示可用大小往往比实际存储设备总容量小

#### 虚拟文件系统

* 计算机系统中可能存在多个文件系统，如用户分别使用NTFS和Ext4两个文件系统管理一块机械硬盘上的不同区域，如用户将FAT32文件系统格式的USB盘接入计算机系统中
* 虚拟文件系统管理和协调多种文件系统，使其在同一操作系统上共同工作，VFS定义了一系列内存数据结构，并要求底层不同文件系统提供指定方法，然后利用这些方法，将不同文件系统的元数据统一转换为VFS的内存数据结构，VFS通过这些数据结构，向上为应用程序提供统一的文件系统服务

##### 面向文件系统的接口

* Linux的VFS基于inode制定了一系列的内存数据结构，包括超级块，inode，目录项等
  * 超级块：保存文件系统通用元数据信息，如文件系统类型、版本、挂载点信息等，每个挂载的文件系统实例均在内存中维护一个VFS超级块结构，VFS超级块还包括一个指针，指向特有的超级块信息
  * inode：VFS维护了inode缓存icache，用哈希表保存操作系统中所有的inode结构
  * 文件数据管理：VFS的inode会使用基数树表示一个文件的数据，基数树中每个叶子节点为一个内存页
  * 目录项：VFS维护了目录项缓存dcache
* Linux的VFS以函数指针的方式定义了文件系统应提供的方法，Linux的VFS为其内存数据结构分别定义了不同的文件系统方法，下面是文件结构的例子，主要包括open、read、read_iter、write、write_iter、llseek（定位）、mmap（内存映射）、fsync（同步写回）等操作

##### 面向应用程序的接口

```c
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

#define DATA_SIZE 20

int main(){
  int fd;
  char data[DATA_SIZE+1];
  fd = open("/home/chcore/filesystem.tex"), O_RDWR|O_CREAT, S_IRUSR|S_IWUSR);
  read(fd, data, DATA_SIZE);
  data[DATA_SIZE] = '\0';
  printf("file data: %s\n", data);
  write(fd, "hello\n", 6);
  close(fd);
  return 0;
}
```

* 路径解析：程序调用open接口时，libc会将其转换为SYS_OPEN系统调用，由内核中的VFS进行处理，它需要先解析路径，解析时，会先从根目录开始查找home文件，缓存找不到则从具体文件系统接口找，若无法找到，则报错，若找到，会检查当前应用程序是否有访问该文件的权限，该文件是否为目录文件，是否为符号链接等等；若找到最后，没有filesystem.tex，则因为有 O_CREAT标记，故VFS会创建一个空文件并继续路径查找操作，路径解析完毕后，VFS获取了文件对应的inode，并返回文件描述符
* 文件描述符：实际上是一个由VFS维护的整数，VFS为每个进程维护一个文件描述符表，该表以文件描述符为索引，保存了一组文件描述结构，记录了一个被打开文件的各种信息，如目标inode、文件当前读写位置、文件打开的模式等等；后续的read、write操作都通过文件描述符进行（POSIX中，有3个文件描述符在进程创建时被默认打开，分别是标准输入流0，标准输出流1，标准错误流2）
* 文件的统计：无须打开文件，直接使用lstat和stat函数，通过路径读取文件的元数据信息，在目标文件为符号链接时，lstat返回符号链接的信息，而stat继续跟随符号链接，走到最后
* 文件读写：常规文件读写接口（read、write、pread、pwrite）需要提供文件描述符、用于读写的缓冲区、需要读写的字节数，且以p开头的接口需要额外提供一个读写偏移量表示开始读取或写入的位置；对于频繁地随机访问文件，使用p开头的接口比使用lseek再进行读写操作更省时
* 目录操作：mkdir、rmdir接口用于创建删除目录，应用程序可以通过文件描述符或路径打开一个目录流，随后调用readdir或readdir_r接口从目录流中读取目录项的信息，closedir用于关闭目录流
* 链接相关：symlink和symlinkat函数用于创建符号链接；link和linkat函数用于创建硬链接，unlink和unlinkat函数用于删除链接或符号链接；readlink和readlinkat函数用于读取符号链接中的目标路径

##### 页缓存、直接I/O与内存映射



## Chap10 设备管理

## Chap11 系统虚拟化
