# Chap5 知识图谱推理

* 面向知识图谱的推理主要围绕关系的推理展开，基于已有事实关系推断未知事实关系
* 知识图谱的推理的主要技术手段主要分为两类
  * 基于演绎的知识图谱推理：如基于描述逻辑、Datalog、产生式规则等
  * 基于归纳的知识图谱推理：如路径推理、表示学习、规则学习、基于强化学习的推理等

#### 基于演绎的知识图谱推理

###### 本体推理

* 本体推理通常仅支持预定义的本体公理上的推理

* 基于表运算（Tableaux）的本体推理方法是描述逻辑知识库一致性检测的最常用方法

| 工具名称 | 支持本体语言   | 编程语言 | 算法          |
| -------- | -------------- | -------- | ------------- |
| FACT++   | OWL DL         | C++      | tableau-based |
| Racer    | OWL DL         | Lisp     | Tableau-based |
| Pellet   | OWL DL         | Java     | Tableau-based |
| HermiT   | OWL 2 Profiles | Java     | Hypertableau  |

###### 基于逻辑编程的推理方法

* 逻辑编程是一族基于规则的知识表示语言，可根据特定场景定制规则，在工业界应用广泛
* 逻辑编程始于Prolog语言，多用于实现专家系统，为了得到完全的声明式规则语言，研发人员开发了一系列Datalog语言
* 目前，最主要的Datalog工具包括DLV和Clingo，在知识图谱领域，也有KAON2，HermiT，Pellet，Stardog，RDFox等系统，支持RL或SWRL推理

###### 基于查询重写的方法

* 若知识图谱已经存在：执行本体介导的查询回答（OMQ），查询重写的任务是将一个本体TBox T上的查询$q$重写为查询$q_T$，使得对于任意的ABox A，$q_T$在A上的执行结果等价于$q$在$(T,A)$上的执行结果
* 若知识图谱不存在（例：存于关系数据库中）：执行基于本体的数据访问（OBDA），使用查询重写的方法，将SPARQL转化为SQL查询语句再执行，在工业界有广泛应用

###### 基于产生式规则的方法

* 产生式系统是一种前向推理系统，可应用于自动规划和专家系统等领域
* 产生式系统由事实集合、产生式集合和推理引擎三部分组成
* 高效的模式匹配算法是产生式规则引擎的核心，目前最流行的算法是Rete算法，由Charles Forgy在1979年提出，Drools、Jena、GraphDB都是基于Rete算法或其改进的，用Java写的，产生式规则的系统

#### 基于归纳的知识图谱推理

###### 基于图结构的推理

* 典型算法：
  * PRA（利用实体节点之间的路径当作特征从而进行链接预测推理）(EMNLP 2011)
  * CoR-PRA（通过改变PRA的路径特征搜索策略，促使其能够涵盖更多种语义信息的特征，主要是包含常量的图结构特征）(ACL 2015)
  * SFE（Subgrpah Feature Extraction 子图特征抽取）：PRA可能导致路径特征爆炸，用此法提升搜索效率（EMNLP 2015）
* [JAVA版本的PRA系列工具集](https://github.com/noon99jaki/pra)
* 前景：
  * 已有的研究多关注与路径相关的结构特征，其中重要的问题是如何有效搜索到路径（精度和速度）
  * 路径不能完全覆盖知识图谱中包含的所有语义信息，非路径形式的图结构特征有待挖掘分析

###### 基于规则学习的推理

* 规则层次

  * 一般规则：$rule:head \leftarrow body^+ \and body^-$
  * 霍恩规则：$rule:head \leftarrow body^+$ or $a_0 \leftarrow a_1 \and a_2 \and \dots a_n$
  * 路径规则：$r_o(e_1,e_{n+1}) \leftarrow r_1(e_1,e_2) \and r_2(e_2,e_3) \and \dots r_n(e_n,e_{n+1})$

* 规则评估指标（越高越好，三者权衡）

  * 支持度$S(R)$：满足规则主体和规则头的实例个数
  * 基于部分完整假设的置信度$C(R)$：规则支持度和满足规则主体的实例个数的比值$C(R) = \frac{S(R)}{B(R) \and r_0(x,y')}$
    * 说明：$r_0(x,y)$是规则头，$r_0(x,y')$说明在知识图谱中，只要当规则头中的头实体 $x$ 通过关系 $r_0$ 链接到除 $y$ 以外的实体才能算进分母的计数 ，因为$r_0(x,y)$只是在知识图谱中缺失而不是错误的三元组
  * 规则头覆盖度$HC(R) = \frac{S(R)}{H(R)}$：规则支持度和满足规则头的实例个数的比值

* 常用算法简介

  * AMIE

    * AMIE是一种霍恩规则，也是一种闭环规则，即整条规则可以在图中构成一个闭环结构，能挖掘的规则形如： $FathorOf(f,c) \leftarrow motherOf(m,c) \and marriedTo(m,f)$

    * AMIE定义了3个挖掘算子，通过不断在规则中增加挖掘算子来探索图上的搜索空间，且融入了对应的剪枝策略

      * 挖掘算子

        * 增加悬挂原子：在规则中增加一个原子，这个原子包含一个新变量，和一个已经在规则中出现的变量或实体
        * 增加实例化原子：在规则中增加一个原子，这个原子包含一个实例化的实体以及一个已经在规则中出现的变量或实体
        * 增加闭合原子：在规则中增加一个原子，这个原子包含的两个元素都是已经出现在规则中的变量或实体，增加闭合原子后，规则算构建完成了

      * 剪枝策略

        * 设置最低规则头覆盖度过滤，实践中一般设置为0.01
        * 在一条规则中，每在规则主体中增加一个算子，都应该使得规则的置信度增加，否则剪掉

      * 算法流程

        * ```python
          def AMIE()
          	q = <[]>
          	@parallel
          	while !q.isEmpty():
          		r = q.dequeue()
          		if r is closed and r is not pruned for output:
                Output r
              for all operators o do:
              	for all rules r' in o(r) do:
                	if r' is not pruned:
                  	q.enqueue(r')     
          ```

    * AMIE+进一步提升了AMIE的效率

###### 基于表示学习的推理

* 思想：将知识图谱中包括实体和关系的元素映射到一个连续的向量空间中，让算法在学习向量表示的过程中自动捕捉、推理所需要的特征，不需要显式的推理步骤
* 常用算法简介
  * TransE（NIPS 2013）
    * 理想情况下，对每一个存在知识图谱中的三元组$(h,r,t)$都满足 $\vec h + \vec r = \vec t$，训练的目标是对正样本三元组，$\vec h + \vec r \approx \vec t$，对负样本则不等，故TransE的三元组得分函数设计为 $f(h,r,t)= ||\vec h + \vec r - \vec t||_{L1 / L2}$ 对于正样本三元组，得分函数值尽可能小，对于负样本三元组，得分函数值尽可能大，然后通过一个正负样本之间最大间隔的损失函数 $L = \sum_{(h,r,t) \in S}\sum_{(h',r',t') \in S'_{h,r,t}}{max(0,\ \gamma + f(h,r,t) - f(h',r',t'))}$，其中$S$表示知识图谱中正样本的集合，$S'$表示负样本，通过随机替换头或尾实体得到
    * TransE能较好捕捉一对一的关系，却无法很好地表示一对多，多对多的关系；如$ \vec v(china) + \vec v(hasProvince) = \vec v(Province \ x)$，但无法很好地区分不同省份
  * TransH（AAAI 2014）
    * 改进点：为每个关系设计一个投影平面，然后，利用投影向量进行三元组得分的计算
  * TransR（AAAI 2015）
    * 改进点：通过拆分实体向量表示空间和关系向量表示空间来提升TransE的表达能力
    * $f(\vec h,\vec r,\vec t) = || \vec hM_r + \vec r -\vec tM_r||_{L1/L2}$，其中，$M_r$为关系投影矩阵
    * 每个关系除拥有一个表示向量外，还对应一个$d \times d$的矩阵，这增加了很多参数
  * TransD（ACL 2015）
    * 改进点：为减少TransR的参数并保留其表达能力，提出用一个与实体相关的向量以及一个与关系相关的向量进行外积计算，动态地得到关系投影矩阵
    * $M_{rh_i} = r_ph_{ip}^T + I^{m \times n}, M_{rt_i}=r_pt_{ip}^T+I_{m \times n}$，其中，m，n为关系和实体的向量表示维度
  * DistMult（ICLR 2015）
    * 采用了更灵活的线性映射的假设 $\vec h \vec M_r = \vec t$，三元组的得分函数设计为 $f(\vec h,\vec r,\vec t)= \vec h \vec M_r \vec t^T$
    * 弊端在于天然地假设了所有关系是对称关系 $hM_rt^T = tM_rh^T$
  * ComplEx（ICML 2016）
    * 将基于实数的表示学习拓展到复数（复数乘法不满足交换律），克服了DistMult的弊端
* 工具集
  * 清华开源的OpenKE，涵盖了常见的表示学习模型，有Python和C++版本

###### 知识图谱推理新进展

* 时序预测推理
  * 传统的数据流学习主要从连续和快速更新的数据记录中提取知识结构
  * 通过将传统机器学习中的特征嵌入扩展到本体语义嵌入，将语义推理和机器学习结合起来，捕获本体流中的一致性和知识蕴含的向量，然后在有监督的流学习的上下文中利用这种嵌入来学习模型。
  * 实验表明，具有语义嵌入的模型对知识推理和预测起到重要作用
  * 参考论文：Learning from Ontology Streams with Semantic Concept Drift (IJCAI 2017)
* 基于强化学习的知识推理
  * 参考论文
    * A Reinforcement Learning Method for Knowledge Graph Reasoning (EMNLP 2017)
    * Go for a walk and Arrive at the answer:Reasoning over paths in Knowledge Bases using Reinforcement Learning (ICLR 2018)
  * 论文1：将“判断一个三元组$(h,r,t)$是否成立”这个问题看作是“寻找一条能连接$h$和$t$的路径”，将此问题建模为序列决策问题，利用基于策略梯度的强化学习方法求解，智能体的动作是从当前节点的出边中选一条然后更新状态，奖励函数同时考虑准确率、路径效率、路径多样性，相比基于表示学习的方法，有更好的可解释性和推理效果
  * 论文2：考虑“查询回答”问题，提出MINERVA模型，远胜于未使用强化学习的随机游走模型。此类问题需要从知识图谱中寻找作为答案的尾实体，在此类知识推理问题中，需要尽可能避免大规模遍历带来的效率影响。
* 基于元学习的少量样本推理
  * 真实知识图谱中，大量的关系仅仅具有非常少的三元组实例，俗称长尾关系，此类关系多被以往研究忽略，事实上对于某一个关系，具有的三元组实例越少，对知识图谱的补全越有利用价值
  * 元学习的目的是解决“学习如何学习”，旨在通过少量样本迅速完成学习，当前主要元学习方法分为三类：基于度量、基于模型、基于优化。
  * 元学习一开始用于图像分类，近年来有人尝试用于长尾关系推理，研究尚少，待挖掘
  * 参考论文：
    * 1、One-Shot Relational Learning for Knowledge Graphs (EMNLP 2018)：基于度量的方法对长尾关系做少样本的链接预测
    * 2、A Large-Scale Supervised Few-Shot Relation Classification Dataset with State-of-the-art Evaluation (EMNLP 2018) : 提出一个用于测试少样本关系分类的数据集FewRel，将近来效果突出的少样本学习模型应用于此数据集后，对少样本知识图谱推理难点进行了分析
* 图神经网络与知识图谱推理
  * 图神经网络主要用于处理图结构的数据，随着信息在节点之间的传播以捕捉图中节点间的依赖关系，其图结构的表示方式使得模型可以基于图进行管理。
  * 参考论文：
    * 1、Knowledge Transfer for Out-Of-Knowledge-Base Entities: A Graph Neural Network Approach (IJCAI 2017)
    * 2、Modeling Relational Data with Graph Convolutional Networks (ESWC 2018)

#### 小结

* 演绎推理方法的效率是阻碍其被广泛应用的瓶颈之一，通过并行技术、模块化技术、递推式推理技术和其他优化技术，实现高效推理机是演绎推理研究的趋势。目前，在处理流数据和移动数据方面缺乏完善理论和实用算法，如何处理动态性和时序性是值得研究方向
* 归纳推理融入先验语义信息作为约束从而达到更精准的推理
* 任何知识图谱都具有不完整性，仅仅基于知识图谱本身的推理无法突破不完整性的限制，因此外部信息、如文本图像等信息可能是更好地补充