# Chap 4 知识图谱融合

#### 概述

###### 异构问题

* 异构分类
  * 本体异构：本体描述的内容在语义上重叠或关联，带来信息交互问题
  * 实例异构：同名实例可能指代不同实体，不同名实例可能指代同一个实体
* 异构层次
  * 语言层不匹配
  * 模型层不匹配
* 解决办法
  * 分析异构的原因，明确融合的对象，建立何种映射，以及映射的复杂程度
  * 由于人类知识体系的复杂性和对世界的主观想法差异性，建议统一知识图谱并不现实
  * 知识融合的核心问题在于映射生成，目前的方法可以分为几类：基于NLP进行术语比较，基于本体结构进行匹配，基于实例的机器学习等

#### 本体概念层的融合方法与技术

* 通用方法：本体集成（n个小本体合并为一个大本体）、本体映射（建立n个小本体之间的映射规则）
* 本体集成缺乏自动方法支持，维护成本高，对不同应用不具有通用性，缺乏灵活性
* 本体映射形式灵活，适应分布动态的环境

###### 本体映射分类

* 映射的对象角度
* 映射的功能角度
* 映射的复杂程度角度

###### 本体映射方法与工具

* 基于术语的本体映射
  * 定义：比较与本体成分相关的名称、标签或注释，寻找异构本体间的相似性
  * 方法：
    * 基于字符串：先对字符串进行规范化，再度量字符串间的相似度（汉明距离、子串相似度、编辑距离、路径距离等度量方法）
    * 基于语言：内部方法利用词语形态和语法分析保证术语规范化，参考寻找词形变化的Stemming算法；外部方法利用词典等外部资源寻找映射，如WordNet
* 基于结构的本体映射
  * 定义：考虑本体的结构能弥补只进行术语比较的不足
  * 方法：
    * 内部结构：利用如属性或关系的定义域、基数、传递性或对称性来计算本体成分之间的相似度
    * 外部结构：若两个概念相似，则它们的邻居也很可能相似，相似的可能还有超类、子类、兄弟、叶子、从根节点到目标节点的路径，但此法无法解决建模观点不同带来的异构（如人分为老人和年轻人、或者分为男人和女人）
  * 工具：
    * PROMPT是斯坦福搞的一套本体工具集，现已集成到Protege系统中
      * iPROMPT：交互式本体集成工具
      * AnchorPROMPT：寻找本体间相似映射的工具
      * PROMPTDiff：本体版本工具
      * PROMPTFactor：从大本体抽取语义完全的子本体工具
    * MAFRA：处理语义网上分布式本体间映射的框架，处理表示并应用异构本体间的映射
    * ONION：解决本体互操作的系统，采用半自动算法生成本体互操作的映射规则，解决本体同构
    * S-MATCH：一个本体匹配系统，能发现异构本体间的映射
    * Cupid：实现了通用模式匹配算法，综合语言和结构的匹配技术以及预定义词典
* 基于实例的本体映射
  * 方法：
    * 共享实例的方法
      * 当来自不同本体的两概念A和B有共享实例时，寻找关系的最简单方法时测试实例集合的交
      * 对称差分相似度：$\delta(s,t)=\frac{\vert s \ \cup \ t - s \  \cap \ t \vert}{\vert s\  \cup \ t \vert}$
    * 无共享实例的方法
      * 根据连接聚合等数据分析方法获得实例集之间的关系
      * 常用连接聚合度量包括单连接、全连接、平均连接、Haussdorf距离
  * 工具：
    * GLUE：应用机器学习技术，用半自动方法发现异构本体间的映射，经典 （VLDB 2003）
    * 概念近似：通过概念近似来重写查询表达式，以获得准确结果
    * FCA：自底向上的本体合并方法FCA-Merge
    * IF-Map：基于信息流理论的自动本体映射发现系统

###### 综合方法

* QOM：采用综合方法发现本体映射的典型工作，兼顾质量与效率，可处理大规模本体间映射发现问题
* OLA：（不介绍）
* KRAFT：发现1:1的本体映射的体系结构
* OntoMap：知识表示的形式化、推理和Web接口
* OBSERVER：解决分布式数据库的异构问题
* InfoSleuth：基于主体的系统
* 基于虚拟文档的本体匹配

#### 实例层的融合与匹配

###### 实例匹配问题分析

* 空间复杂度挑战：图谱读入需要存储空间，匹配的主要数据结构（如相似矩阵）空间复杂度是 $O(n^2)$ ，对于5000实例的图谱，相似矩阵的数值取双精度，则此矩阵占用200MB存储空间
* 时间复杂度挑战：执行时间主要取决于匹配计算过程，早期计算异构实例相似度的方法的时间复杂度是$O(t \cdot n^2)$ ，存在 $O(nlogn)$ 的方法牺牲精度来换效率，而不同的匹配算法的 $t$ 不同，简单的编辑距离方法比语义描述文档的方法快1000倍
* 匹配结果质量挑战：分治策略会破坏某些实例语义信息的完整性
* 大规模知识图谱匹配方法分类
  * 基于快速相似度计算的方法
  * 基于规则的方法
  * 基于分治的方法

###### 基于快速相似度计算的方法

* 思想：降低每次相似度计算的时间复杂度
* 匹配器：
  * 文本匹配器
  * 结构匹配器
  * 基于实例的匹配器

######基于规则的方法

* 例子：基于EM算法的半监督学习框架自动寻找实例匹配规则  
* 论文：An Effective Rule Miner for Instance Matching in A Web of Data （ACM 2012）
* 应用：用于DBpedia，GeoNames，LinkedMDB，GeoSpecies等知识图谱间的实例匹配，解决了zhishi.me等知识图谱构建中的实例匹配问题

######基于分治的方法 

* 省略

###### 基于学习的实例匹配算法

* 省略

#### 开源工具

* LIMES：德国人用Java搞的链接发现框架，基于度量空间的特征实现了大规模链接发现的高效方法
* Dedupe：基于主动学习的方法，只需用户标注框架在计算过程选择的少量数据，即可有效训练出复合Blocking方法和record间相似度的计算方法，并通过聚类完成匹配
* 清华的RIMOM系统，南京大学的Falcon-AO系统，东南大学的Lily系统，在OAEI（知识融合评估竞赛）中获得优秀成绩