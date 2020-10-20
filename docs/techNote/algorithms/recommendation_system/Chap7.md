# Chap7 推荐系统中的数据挖掘方法

## 简介

<img src="https://tva1.sinaimg.cn/large/007S8ZIlly1gjuosvkir4j30sh0pgwss.jpg" style="zoom:50%;" />

## 数据预处理

#### 相似度度量

##### 闵可夫斯基距离

$d(x,y)=\left( \sum\limits_{k=1}^{n}{\vert x_k-y_k \vert^r} \right)^\frac{1}{r}$

* $r=1$ 时，称为曼哈顿距离，城市街区距离，L1范数
* $r=2$ 时，称为欧几里得距离，L2范数
* $r=\infty$时，称为上确界，是任意维度对象属性间的最大距离

##### 马氏距离

$d(x,y)=\sqrt{(x-y)\sigma^{-1}(x-y)^T}$

##### 余弦相似度

$cos(x,y)=\frac{\vec{x} \cdot \vec{y}}{\Vert \vec{x} \Vert \Vert \vec{y} \Vert}$

##### 皮尔逊相关系数

$Peason(x,y) = \frac{Cov(x,y)}{\sigma_x \sigma_y}$

#### 抽样

##### n折交叉验证

* 数据集分成n份，一份用于测试，其他用于训练，共有n种可能性，如此操作，取n次测试的平均性能

#### 降维

##### 主成分分析（PCA）

* 经典统计方法，用于发现高维数据集中的模式
* 可以获取一组有序的成分列表，其根据最小平方误差计算出变化最大的值

##### 矩阵分解和奇异值分解

* 假设存在分解：$A = U\lambda V^T$

![](/Users/lyj-newy/github/resource-list/application/推荐系统学习笔记/pic3.jpeg)

* 在 $\lambda$ 中特征值 $r$ 是有序递减的，因此，初始矩阵 $A$ 可以通过截取前 $k$ 个特征值来近似构造，截取的SVD构造了一个近似的 $k$ 秩矩阵 $A_k=U_k \lambda_k V_k^T$ ，成功降维
* SVD的一大优势是有增量算法来计算近似的分解

#### 去噪

* 预处理去噪
* 区分自然噪声和恶意噪声

## 监督学习

#### 分类（有空将这些算法实现一遍）

* 最近邻（KNN）
  * 最简单的机器学习方法
* 决策树
  * 算法：Hunt，CART，ID3，C4.5，SLIQ，SPRINT
  * 不纯度衡量指标：Gini指标，熵，非分类错误
  * 拓展：随机森林（RF），梯度提升树（GBDT）
* 贝叶斯分类器
  * 朴素贝叶斯分类器
    * 受孤立噪声点和不相关属性影响小
  * 贝叶斯信念网络（BBN）
    * 使用非循环图表示属性之间的依赖性
    * 使用概率表表示节点与直接父亲之间的联系
    * 擅长处理不完整数据，对模型过拟合有健壮性
* 逻辑回归（LR）
  * 最基础的概率分类模型，简单有效，常用于工业界
* 支持向量机（SVM）
  * 发现数据的线性超平面，以边界最大化的方式分离数据
* 人工神经网络（ANN）

#### 分类器的集成

* 常用技术（[bagging和boosting的区别](https://www.cnblogs.com/earendil/p/8872001.html)）
  * Bagging：采用带替换的抽样，在每一个自举样本上建立分类
  * Boosting：关注错误的分类记录
    * AdaBoost算法
    * RankBoost算法
    * GBDT是基于树的Boosting集成方法

#### 评估分类器

* ROC曲线

## 无监督学习

#### 聚类分析

* k-means算法
* 基于密度的聚类算法（DBSCAN）
  * 此算法定义了三种点
    * 核心点：给定距离内邻居数超过阈值的点
    * 边界点：给定距离内邻居数低于阈值，但属于核心点邻居的点
    * 噪声点：剩下的点
  * 算法迭代移除噪声数据，在剩下的点上聚类
* 消息传递聚类算法
  * 一种基于图聚类的算法
  * 相似传播是这类算法的代表，用于DNA序列聚类，人脸聚类，文本摘要等不同问题中
* 分层聚类
  * 按照层级树的结构产生一系列嵌套聚类
* 局部敏感哈希（LSH）
  * 在高维空间中解决近邻搜索问题的方法
  * 性能好，伸缩性强，在工业界推荐系统的预处理阶段用于分组相似用户
  * LinkedIn公开说明采用了LSH算法
* 潜在狄利克雷分布（LDA）
  * 每个数据可以被分到多个类别
  * 典型应用：找到文档集合的话题
  * 依赖隐语义分析技术
  * 工业界中运用于基于内容和协同过滤的混合推荐系统
* 贝叶斯非参数模型
  * 一个算法族
  * 融合了LDA混合类别模型的优点以及动态类别个数的聚类方法的灵活性
  * 工业界中有实际应用

#### 关联规则挖掘

* Apriori算法 [参考文章链接](https://blog.csdn.net/qq_36523839/article/details/82191677)
  * 频繁项集：经常出现在一块的物品的集合
  * 关联规则：暗示两种物品之间可能存在很强的关系
  * 支持度：一个项集的支持度被定义为数据集中包含该项集的记录所占的比例
  * 应用：个性化营销
  * 代码如下：

```python
from numpy import *

class Apriori(object):
    def __init__(self, dataSet=[[1, 3, 4], [2, 3, 5], [1, 2, 3, 5], [2, 5]], minSupport=0.5, minConf=0.7):
        self.dataSet = dataSet
        self.minSupport = minSupport
        self.minConf = minConf
        self.L, self.suppData = self.apriori()
        self.rule = self.generateRules()
        print('初始化成功')

    def __str__(self):
        return '支持度：\n'+ str(self.minSupport) + '\n置信度： \n' + str(self.minConf) + '\n频繁集: \n' + str(self.L) + '\n带支持度的频繁集: \n' + str(self.suppData) + '\n规则: \n' + str(self.rule)

    def createC1(self):
        C1 = []
        for transaction in self.dataSet:
            for item in transaction:
                if not [item] in C1:
                    C1.append([item])
        C1.sort()
        # 使用frozenset是为了后面可以将这些值作为字典的键,frozenset一种不可变的集合，set可变集合
        return list(map(frozenset, C1))

    def scanD(self, Ck):
        ssCnt = {}
        # 转换列表记录为字典  [{1, 3, 4}, {2, 3, 5}, {1, 2, 3, 5}, {2, 5}]
        D = list(map(set, self.dataSet)) 
        for tid in D:
            for can in Ck:
              	# 判断can是否是tid的《子集》 （这里使用子集的方式来判断两者的关系）
                if can.issubset(tid):   
                  	# 统计该值在整个记录中满足子集的次数（以字典的形式记录，frozenset为键）
                    if can not in ssCnt:    
                        ssCnt[can] = 1
                    else:
                        ssCnt[can] += 1
        numItems = float(len(D))
        retList = []        # 重新记录满足条件的数据值（即支持度大于阈值的数据）
        supportData = {}    # 每个数据值的支持度
        for key in ssCnt:
            support = ssCnt[key] / numItems
            if support >= self.minSupport:
                retList.insert(0, key)
            supportData[key] = support
        # 排除不符合支持度元素后的元素 每个元素支持度
        return retList, supportData 

    def aprioriGen(self, Lk, k):
        retList = []
        lenLk = len(Lk)
        for i in range(lenLk): # 两层循环比较Lk中的每个元素与其它元素
            for j in range(i+1, lenLk):
                L1 = list(Lk[i])[:k-2]  # 将集合转为list后取值
                L2 = list(Lk[j])[:k-2]
                L1.sort()
                L2.sort()        
                # 这里说明一下：该函数每次比较两个list的前k-2个元素，如果相同则求并集得到k个元素的集合
                if L1==L2:
                    retList.append(Lk[i] | Lk[j]) # 求并集
        return retList  # 返回频繁项集列表Ck

    def apriori(self):
        C1 = self.createC1()
        L1, supportData = self.scanD(C1)  # 过滤数据
        L = [L1]
        k = 2
        while (len(L[k-2]) > 0):    # 若仍有满足支持度的集合则继续做关联分析
            Ck = self.aprioriGen(L[k-2], k)  # Ck候选频繁项集
            Lk, supK = self.scanD(Ck) # Lk频繁项集
            supportData.update(supK)    # 更新字典（把新出现的集合:支持度加入到supportData中）
            L.append(Lk)
            k += 1  # 每次新组合的元素都只增加了一个，所以k也+1（k表示元素个数）
        return L, supportData

    # 获取关联规则的封装函数
    def generateRules(self):  # supportData 是一个字典
        bigRuleList = []
        for i in range(1, len(self.L)):  # 从为2个元素的集合开始
            for freqSet in self.L[i]:
                # 只包含单个元素的集合列表
                H1 = [frozenset([item]) for item in freqSet]   
                # frozenset({2, 3}) 转换为 [frozenset({2}), frozenset({3})]
                
                # 如果集合元素大于2个，则需要处理才能获得规则
                if (i > 1):
                    self.rulesFromConseq(freqSet, H1, self.suppData, bigRuleList) 
                    # 集合元素 集合拆分后的列表 。。。
                else:
                    self.calcConf(freqSet, H1, self.suppData, bigRuleList)
        return bigRuleList
    
    # 对规则进行评估 获得满足最小可信度的关联规则
    def calcConf(self, freqSet, H, supportData, brl):
        prunedH = []  # 创建一个新的列表去返回
        for conseq in H:
            conf = supportData[freqSet]/supportData[freqSet-conseq]  # 计算置信度
            if conf >= self.minConf:
                # 按行打印规则
                # print(freqSet-conseq,'-->',conseq,'conf:',conf)
                brl.append((freqSet-conseq, conseq, conf))
                prunedH.append(conseq)
        return prunedH
    
    # 生成候选规则集合
    def rulesFromConseq(self, freqSet, H, supportData, brl):
        m = len(H[0])
        if (len(freqSet) > (m + 1)): # 尝试进一步合并
            Hmp1 = self.aprioriGen(H, m+1) # 将单个集合元素两两合并
            Hmp1 = self.calcConf(freqSet, Hmp1, supportData, brl)
            if (len(Hmp1) > 1):    #need at least two sets to merge
                self.rulesFromConseq(freqSet, Hmp1, supportData, brl)

a = Apriori()
print(a)
```



