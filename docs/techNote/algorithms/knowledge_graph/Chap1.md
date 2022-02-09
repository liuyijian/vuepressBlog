# Chap1 知识图谱表示与建模

#### 词的向量表示方法

* 独热编码（One-hot Encoding）：一个词表示成一个长向量，向量维度为词表大小

* 词袋模型（Bag-of-Words）：一个文本可以表示为每个词出现次数的向量
* 词向量（Word Embedding）：基于上下文的稠密向量表示
  * 基于计数的方法：记录文本中词出现的次数
  * 基于预测的方法：
    * 通过上下文预测中心词：连续词袋模型（CBoW），适用于小型数据库
    * 通过中心词预测上下文：跳字模型（skip-gram），在大型语料表现更好
    * CBoW和skip-gram是开源工具Word2Vec中的两个模型 
      * [数学原理](https://www.cnblogs.com/peghoty/p/3857839.html)
      * python包[pip install word2vec]
  * 基于任务的方法：通过对词向量在具体任务上的表现效果对词向量进行学习

#### 知识图谱嵌入

* 定义：将知识图谱中包括实体和关系的内容映射到连续向量空间方法的研究领域
* 优点：提高计算效率，增加下游应用设计多样性，作为预训练为下游模型提供语义支持
* 方法：
  * 转移距离模型：
    * 核心思想：将衡量向量化后的知识图谱中三元组的合理性问题转化为衡量头实体和尾实体的距离问题，head + relation = tail
  * 语义匹配模型：（主要是RESCAL以及它的延伸模型）
    * 核心思想：将整个知识图谱编码为一个三维张量，由这个张量分解出一个核心张量和一个因子矩阵，核心张量中每个二维矩阵切片代表一种关系，因子矩阵中每一行代表一个实体；由核心张量和因子矩阵还原的结果被看作对应三元组成立的概率，阈值法来判断三元组正误
  * 考虑附加信息模型：

* 应用：
  * 链接预测（三元组挖掉一个并预测它），得分最高的实体作为预测结果，常用于评测知识图谱嵌入
  * 三元组分类（判断真假）
  * 实体对齐（验证两个实体是否指代相同事物，用于冗余消除和异构数据源融合）
  * 问答系统（设计一种得分函数，使问题的向量表示和正确答案的向量表示得分较高，如 $S(q,a)=(W\phi(q))^T(W\phi(a))$，$\phi(q)$为词语出现的稀疏向量，$\phi(a)$为实体和关系出现的稀疏向量，$W\phi(q)$和$W\phi(a)$分别表示问题和答案的向量表示
  * 推荐系统
    * 知识图谱中抽取出具有语义编码的向量表示，使用协同过滤算法对用户进行向量表示，两个向量相乘得到分数，越高说明用户越喜好该商品