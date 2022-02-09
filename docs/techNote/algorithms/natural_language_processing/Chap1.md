# Chap 1 简介

* 本文是《speech and language processing 2020.12》图书的阅读摘要

# Chap2 正则表达式&文本规范化&编辑距离

#### 2.1 正则表达式

##### 2.1.1 基础正则表达式

![image-20210705192335957](https://tva1.sinaimg.cn/large/008i3skNly1gs6an6217rj60s2053q4802.jpg)

![image-20210705192323837](https://tva1.sinaimg.cn/large/008i3skNly1gs6amyjwqtj30s5059abh.jpg)

![image-20210705192309761](https://tva1.sinaimg.cn/large/008i3skNly1gs6ampn4lcj30s4054jsx.jpg)

![image-20210705192253927](https://tva1.sinaimg.cn/large/008i3skNly1gs6amfw4e5j30xk07cac8.jpg)

![image-20210705192236119](https://tva1.sinaimg.cn/large/008i3skNly1gs6am4imm5j30xm04dq3w.jpg)

![image-20210705192158038](https://tva1.sinaimg.cn/large/008i3skNly1gs6alh6zrlj30s603idgi.jpg)

![image-20210705192138952](https://tva1.sinaimg.cn/large/008i3skNly1gs6al4ze1oj30sc069t9l.jpg)

##### 2.1.2 分隔、分组、符号优先级

![image-20210705192108600](https://tva1.sinaimg.cn/large/008i3skNly1gs6akn63wkj30en045q3f.jpg)

正则表达式的匹配是贪心的，如 ``[a-z]*``会覆盖尽可能多的串，如once这个词，会完全覆盖

若需要非贪心匹配，使用``*?``和``+?``符号，尽可能少地匹配文本

##### 2.1.3 更多操作符

![image-20210705193134512](https://tva1.sinaimg.cn/large/008i3skNly1gs6avgv6h8j30s8086q55.jpg)![image-20210705193731977](https://tva1.sinaimg.cn/large/008i3skNly1gs6b1oe8fuj30s50940v4.jpg)

![](https://tva1.sinaimg.cn/large/008i3skNly1gs6b2xjjeaj30s7076wfx.jpg)

##### 2.1.4 替换，捕获分组，提前观察

替换：![image-20210706121120550](https://tva1.sinaimg.cn/large/008i3skNly1gs73rv4moqj307r01iq2t.jpg)

分组重现：![image-20210706121636268](https://tva1.sinaimg.cn/large/008i3skNly1gs73x769bcj30hd01hdfr.jpg)

![image-20210706121848032](https://tva1.sinaimg.cn/large/008i3skNly1gs73zh6dmnj30jh01rjrd.jpg)

提前观察：![image-20210706122146965](https://tva1.sinaimg.cn/large/008i3skNly1gs742kze76j30ao017t8m.jpg)

#### 2.2 字词

语料集（corpus / corpora）

* 文本语料集：
  * 标点符号（punctuation）：有利于区分语段（句号、逗号），识别特定含义（引号、问号、冒号）
* 语音语料集：
  * 碎片（fragment）：说错话或说一个词卡壳
  * 停顿（filled pause）：语气词等、作为讲着思想的重启，可用于预测后续词，也可根据停顿习惯识别讲者身份

语言统计学三大定律：

* Zipf law：在给定的语料中，对于任意一个词，其频度(freq)的排名（rank）和freq的乘积大致是一个常数
* Heaps law：在给定的语料中，其词汇集 $V$ 与语料大小 $N$ ，存在大致关系$\vert V \vert =kN^\beta$，$0 \lt \beta \lt 1$
* Benford law：在$b$进位制中，以数$n$起头的数出现概率为 $\log_b(1+\frac{1}{n})$，常用于检测数据是否造假

#### 2.3 语料集

语料集说明文档

* 动机：为何建立这个语料集，谁建的，谁出钱支持
* 情况：文本的写/说 是在何种环境下进行的，是专门的任务吗，文本是对话还是印刷稿/社交媒体通信/独白或对白
* 语言：语言种类，包括地域方言
* 讲者特征：性别/年龄等
* 收集过程：数据量大小，若是采样数据（如何采样？）数据采集被同意否，数据如何被预处理，是否有元数据
* 标注过程：标注是什么，标注者的特征是什么，标注者经过如何的训练，数据如何被标注
* 分发限制：是否有版权或存在私人财产限制

#### 2.4 文本规范化

文本规范化（text normalization）

* 标记化（tokenization）：多语言、表情和标签
* 词形还原（lemmatization）：判断词语的词根是否一致，如 sing（sang、sung、singing）
  * 词干提取（stemming）：朴素的词形还原方法，通常剪去后缀
* 句子划分（sentence segmentation）

##### 2.4.1 使用Unix工具进行简易标记化

* 词频统计
  * Linux [tr](https://www.runoob.com/linux/linux-comm-tr.html) 命令用于转换或删除文件中的字符
  * Linux [sort](https://www.runoob.com/linux/linux-comm-sort.html) 命令用于将文本文件内容加以排序
  * Linux [uniq](https://www.runoob.com/linux/linux-comm-sort.html) 命令检查及删除文本文件中重复出现的行列，配合sort使用

##### 2.4.2 词标记

* 命名实体识别（NER）：处理价格，日期，链接，邮箱地址，专业长词时需要整体标记
* 缩写还原：what's = what is

* 词标记是自然语言处理的第一步，所以需要高效处理，标准的方法是使用正则表达式编译出的有限状态机去决定每个标记，python中可以使用nltk.regexp_tokenize()函数

![image-20210706221647208](https://tva1.sinaimg.cn/large/008i3skNgy1gs7l9t8yddj30s70e2juq.jpg)

* 对于汉字，使用单字作为标记单位更佳，因为单字是大多数场景下的语义单位能避免大量陌生词的出现，

##### 2.4.3 Byte Pair Encoding（BPE）算法

* tokenization模式
  * token learner：从训练语料中归纳出词汇表（token的集合）
  * token segmenter：将测试语料标记化
* tokenization常用算法（[参考](https://zhuanlan.zhihu.com/p/86965595)）
  * byte-pair encoding（BPE,2016）
    * ![image-20210707174246196](https://tva1.sinaimg.cn/large/008i3skNgy1gs8iyyriy4j30sc0cn0vj.jpg)
  * unigram language modeling(2018)
  * WordPiece(2012)
  * SentencePiece（2018）

##### 2.4.4 word normalization, lemmatization, stemming

* Word normalization: 将 words/tokens 变成标准格式（如 US，USA）

* Lemmatization：将词的词干和词缀分离，简易的方法叫stemming，直接砍掉后缀

* [Porter stemmer](https://tartarus.org/martin/PorterStemmer/) 是1980年提出的，至今广泛使用的stemming方法，此法基于重写规则，较为简单，但可能会遇到误判（commission不同的判为相同，omission相同的判为不同），如下

  ![image-20210707202707393](https://tva1.sinaimg.cn/large/008i3skNly1gs8npymlhmj30hf058js3.jpg)

##### 2.4.5 sentence segmentation



#### 2.5 最小编辑距离

两个字符串的最小编辑距离：一个字符串通过插入，删除，替换操作变成另一字符串的最小次数

动态递推式：

![image-20210722145550569](https://tva1.sinaimg.cn/large/008i3skNly1gspqfumfwgj30fu02st8s.jpg)

例子（记录backtrace）

![image-20210722150352454](https://tva1.sinaimg.cn/large/008i3skNly1gspqo5sufkj30lc08sq51.jpg)



自然语言处理中的动态规划

* Viterbi算法：最小编辑距离的概率扩展，计算maximum probability alignment（https://zhuanlan.zhihu.com/p/40208596）
* CKY算法

# Chap3 N-gram 语言模型

* 动机：如何预测下一个词

* 方法：通过模型为接下来可能出现的词分配概率

* 场景：语音识别中的纠错，文本语法纠错，机器翻译的正确表达，输入法提示

* 术语定义：
  * 语言模型（LM）：为词序列分配概率的模型
  * n-gram：一个包含n个单词的序列（n=2，bigram；n=3，trigram）

#### 3.1 N-Grams

* 使用全部上文进行估计
  * 公式：$P(w_n \ | \ w_1w_2 \dots w_{n-1}) =\frac{Count(w_1w_2 \dots w_{n})}{Count(w_1w_2 \dots w_{n-1})}$ 
  * 问题：数据集中可能没有包含新奇句子的样本，导致分子或分母为0
* 使用历史距离最近的N-1个词，形成N个词的小组，来进行近似估计
  * 公式：$P(w_n \ | \ w_1w_2 \dots w_{n-1}) \approx P(w_n \ | \ w_{n-N+1} \dots w_{n-1})   = \frac{Count(w_{n-N+1:n})}{Count(w_{n-N+1:n-1})}$
  * 链式法则：$P(w_{1:n})=\prod_{k=1}^{n}P(w_k \vert w_{1:k-1}) \approx \prod_{k=1}^{n}P(w_k \vert w_{k-N+1:k-1})$
    * 问题：一直相乘会导致长句的概率极小，导致数值无法被表示（underflow），
    * 改良方法：使用对数概率 $\prod_{i=1}^{n}p_i = e^{\sum\limits_{i=1}^{n}\log p_i}$

#### 3.2 评价语言模型

* 数据集切分：80%训练，10%验证，10%测试
* 评价指标：迷惑度（Perplexity, PP）
  * 公式：$ PP(W)=P(w_1w_2, \dots w_N)^{-\frac{1}{N}} = \sqrt[N]{\prod\limits_{i=1}^{N}\frac{1}{P(w_i \vert w_1 \dots w_{i-1})}} \approx \sqrt[N]{\prod\limits_{i=1}^{N}\frac{1}{P(w_i \vert w_{i-n+1} \dots w_{i-1})}}$
  * 思想：测试集中的句子都是正常的句子，那么训练好的模型在测试集上的概率越高越好，即最大化$P(w_1 \dots w_N)$，最小化$PP$
  * 注意事项：
    * 1、词表相同的模型对比才有意义
    * 2、涉及句首词预测需要增加前置padding

#### 3.3 泛化、零概率问题

* 假设一个语料库长度为$N$，有$V$个不同的词汇，n较大时，按概率生成的句子效果较好，但也有一些问题
  * 存储空间占用较大，n-gram模型需要计算的概率有$V^n$个
  * 稀疏性问题（较多的概率值为0），当测试集出现训练集未曾出现过的词串模式时，会导致整体预测概率变为0，PP无穷大
  * 训练数据需要与测试数据具有相同的体裁，方言，语言模型才会表现得好

* 稀疏性问题
  * 定义：当测试集出现训练集未曾出现过的词串模式时，会导致整体预测概率变为0
  * 原因及处理办法
    * 情况一：测试集出现未知词汇
      * 处理办法：使用固定的词典，使用 <UNK> 代表训练集中不在词典的词（或出现次数小于阈值的词），将 <UNK> 当成一个普通词，用同样的方法预测概率
    * 情况二：测试集中出现了训练集不存在的上下文模式
      * 处理办法：平滑化、减少n-gram的n值（backoff）

#### 3.4 平滑

* k-平滑：
  * 公式：$ \frac{C(w_{n-N+1:n})}{C(w_{n-N+1:n-1})} \rightarrow \frac{C(w_{n-N+1:n})+k}{C(w_{n-N+1:n-1})+kV}$ ($k=1$时又叫拉普拉斯平滑)
  * 评价：对于语言模型而言效果不好，概率分布的方差不好，不合适的平滑

* 使用低阶n-gram的概率做插值来达到高阶n-gram的效果

  * 公式：$\hat{P}(w_n \ | \ w_{n-N+1} \dots w_{n-1}) =  \sum\limits_{i=1}^{N} \lambda_i P(w_n \ | \ w_{n-N+i} \dots w_{n-1}) \quad s.t. \  \sum_i \lambda_i = 1$

  * 评价：使用EM算法来学习$\lambda_i$的最优值，有一种叫Katz backoff

* Kneser-Ney 平滑
  * 公式：
    * $P_{KN}(w_i \vert w_{i-1}) = \frac{\max (C(w_{i-1}w_i)-d, \ 0)}{C(w_{i-1})} + \lambda(w_{i-1})P_{CONTINUATION}(w_i)$
    * $P_{CONTINUATION}(w) = \frac{\vert \{v: \ C(vw)>0\}\vert}{\sum_{w'} \vert \{ v: \ C(vw')>0 \}\vert}$
    * $\lambda(w_{i-1}) = \frac{d}{\sum_vC(w_{i-1}, v)}\vert \{w:C(w_{i-1}w\} > 0\vert$
    * $P_{KN}(w_i \vert w_{i-n+1:i-1}) = \frac{\max(C_{KN}(w_{i-n+1:i})-d, \ 0)}{\sum_vC_{KN}(w_{i-n+1:i-1} \ v)}+\lambda(w_{i-n+1:i-1})P_{KN}(w_i \vert w_{i-n+2:i-1})$
    * $C_{KN}(.) = \begin{cases} count(.) \quad for \ the \ highest\ order \\ continuation-count(.) \quad for \ the \ lower \ cases \end{cases}$
  * 评价：最常用、表现最好的n-gram平滑方法之一
  * 例子：https://medium.com/@dennyc/a-simple-numerical-example-for-kneser-ney-smoothing-nlp-4600addf38b8
  * 改良版：modified Kneser-Ney Smoothing（对于n-gram的不同n，使用不同的discount，而非原版固定的discount）

#### 3.5 大语言模型和stupid backoff

* n-gram模型在语料库很大时需要考虑效率问题，有一些改良办法
  * 将单词本身的存储改成int64型的哈希值
  * 剪枝
    * 设置n-gram计数的阈值，仅存储大于阈值的n-gram
    * 用布隆过滤器设置近似的语言模型
* 大语言模型下，一个名为stupid backoff 的简单算法往往就足够了。
  * $S(w_i \vert w_{i-k+1}^{i-1}) = \begin{cases} \frac{count(w_{i-k+1}^{i})}{count(w_{i-k+1}^{i-1})} \quad if \ count(w_{i-k+1}^{i})>0 \\ \lambda S(w_i \vert w_{i-k+2}^{i-1}) \quad otherwise \end{cases}$
  * 起始条件unigram：$S(w) = \frac{count(w)}{N}$
  * 经验值：$\lambda=0.4$

#### 3.6 Perplexity 和 Entropy 的关系

* 熵（Entropy）：
  * 给定一个随机变量$X$，其分布的集合为 $\chi$，概率函数为$p(x)$，定义熵为 $H(X)=-\sum\limits_{x \in \chi}p(x)\log_2p(x)$
  * 将语言看作一个生成词序列的随机过程$L$，则$H(L)=-\lim\limits_{n \rightarrow \infty} \frac{1}{n}\sum\limits_{W \in L} p(w_1,\dots,w_n)\log p(w_1, \dots, w_n)$
  * 假设语言具有平稳性（概率与序列时刻无关，实际并不是的）和遍历性，可近似简化为$H(L)=\lim\limits_{n \rightarrow \infty} -\frac{1}{n}\log p(w_1, \dots, w_n)$

* 交叉熵（Cross-Entropy）：
  * 在我们不知道数据生成的概率分布p时，依然有用，可以衡量简单模型$m$和复杂的概率分布$p$之间的交叉熵，并通过最小化这个值使模型$m$去拟合$p$
  * $H(p) \le H(p,m) = \lim\limits_{n \rightarrow \infty} -\frac{1}{n}\log m(w_1w_2\dots w_n)$
* Perplexity 和 Cross-Entropy的关系
  * $H(W) = -\frac{1}{N} \log P(w_1w_2\dots w_N)$
  * $PP(W) = 2^{H(W)}$

# Chap 4 朴素贝叶斯和情绪分类

#### 4.1 贝叶斯分类器

* 多元贝叶斯分类器（multinomial naive Bayes Classifier）
  * 贝叶斯推断公式：$P(x | y)= \frac{P(y | x)P(x)}{P(y)}$
  * 两个假设
    * 词袋假设：词的作用与词所处位置无关
    * 朴素贝叶斯假设：特征$f_1,f_2, \dots, f_n$互相独立
  * 给定类别集合 $C$，对于由特征$f_1,f_2,\dots,f_n$表示的文档 $d$，预估分类 $\hat{c}= \arg\max\limits_{c \in C}P(c | d)=\arg \max\limits_{c \in C} \frac{P(d|c)P(c)}{P(d)} = \arg \max\limits_{c \in C} P(d|c)P(c) = \arg \max\limits_{c \in C} P(c)\prod\limits_{f \in F}P(f|c)$
  * 若特征 $f$ 即为词本身，则$c_{NB} = \arg\max\limits_{c \in C}P(c) \prod\limits_{i \in positions} P(w_i | c)$
  * 实际运算时常采用对数形式以提速且避免溢出：$c_{NB}=\arg\max\limits_{c \in C}\log P(c) + \sum\limits_{i \in positions} \log P(w_i | c)$

#### 4.2 训练朴素贝叶斯分类器

* 使用最大似然估计，用频率估计概率

  * 假设$N_c$ 为训练数据中类别为 $c$ 的文档个数，$N_{doc}$为训练集中文档总数，则$\hat{P}(c) = \frac{N_c}{N_{doc}}$
  * 同理，有 $\hat{P}(w_i | c) = \frac{count(w_i,c)}{\sum_{w \in V} count(w,c)}$
  * 但为了避免0概率的问题，使用Laplace平滑，有$\hat{P}(w_i | c) = \frac{1 + count(w_i,c)}{|V| +\sum_{w \in V} count(w,c)}$

  * 对于测试集中发现的，训练集词表中没有的新词，忽略之
  * 对于无意义的高频词，忽略之

![image-20211122125758399](https://tva1.sinaimg.cn/large/008i3skNly1gwnu94de0tj30la0gtdhk.jpg)

#### 4.3 情绪分类优化

* 改进1：一个词在文档中是否出现，比它出现多少次重要，故限制词频在每个文档的取值为0或1
* 改进2：否定词的出现可能会翻转整个句子的情感类别，故在词正则化阶段，对否定词后的词语添加NOT_前缀，直到出现标点符号

* 改进3：对于标注的训练数据不足时，可从专用的情绪词汇表中抽取正负倾向情绪特征来使用，四大流行情绪词表为 General Inquirer（1966），LIWC（2007），opinion lexicon（2004），MPQA Subjectivity Lexicon（2005）；MPQA中包含6885个词语，2718个正向、4912个负向；使用词表的时候，添加特征“该词出现在（正/负）向词表中”；当训练数据稀疏且与测试集分布差异较大时，可使用“出现在正负向词表中的词的个数”来代替单个词语的特征，以达到更好的泛化效果

#### 4.4 朴素贝叶斯用于其他分类任务

* 对于垃圾邮件分类，使用预定义的短语作为特征，并结合一些非语言学特征，如HTML中的text部分占比，能达到更好的效果
* 对于语言种类分类，使用字母n-grams是比单个词汇更有效的特征
* 对于句子情感分类，使用基于单词的朴素贝叶斯即可

#### 4.5 评价指标：准确率，召回率，F-指标

![image-20211122144957307](https://tva1.sinaimg.cn/large/008i3skNly1gwnxhll6i1j30jr06tq3m.jpg)

$F_{\beta} = \frac{(\beta^2+1)PR}{\beta^2P+R}$，其中，当$\beta=1$时，对于准确率和召回率具有同等重要性，故常用指标$F_1$作为衡量指标，里面体现的是加权几何平均的思想，多分类的混淆矩阵如下

![image-20211122150130937](https://tva1.sinaimg.cn/large/008i3skNly1gwnxtm617lj30gt07y74y.jpg)

MacroAveraging：计算每个分类的性能指标，再求平均作为总体性能指标（类别重要性一致，更合适）

MicroAveraging：收集所有类至一个混淆矩阵，然后计算准确率和召回率（受大类影响较大）

![image-20211122150553583](https://tva1.sinaimg.cn/large/008i3skNly1gwnxy6i0zwj30or08pmyd.jpg)

使用训练-验证-测试集划分，并使用交叉验证技术来衡量模型性能

![image-20211122150937638](https://tva1.sinaimg.cn/large/008i3skNly1gwny21y9hkj30jh09eab1.jpg)

#### 4.6 统计显著性检测

* 在测试数据集x上，用评价指标M，比较两个分类器A和B的表现：$\delta(x) = M(A,x) - M(B,x)$
* 形式化两个假设 $H_0 : \delta(x) \le 0 \quad H_1:\delta(x) \gt 0$
* NLP领域有两个常用的非参数化检验： approximate randomization（1989），bootstrap test（1993）

##### 配对bootstrap test

* 考虑一个文档二分类问题，给定真实测试集$x$中包含10个文档，给定两个分类器A和B，A和B对于文档存在分类正确错误的4种组合情况，构造b个虚拟测试集的方法是每次从真实测试集中随机抽样并放回，如下表所示

![image-20211122155433552](https://tva1.sinaimg.cn/large/008i3skNly1gwnzctd8brj30l205jgmq.jpg)

* $p-value(x) = \sum\limits_{i=1}^{b} \mathbb{I}(\delta(x^{(i)})\ge 2\delta(x))$，若该值小于一定阈值，则表明$\delta(x)$足够显著，可以说明两个分类器表现的好和坏

  ![image-20211122161211917](https://tva1.sinaimg.cn/large/008i3skNly1gwnzv5vbqgj30le08zmyb.jpg)

# Chap 5 逻辑回归

* 逻辑回归是NLP分类问题中的baseline算法，是判别式的分类器，它包含两部分
  * 训练：使用随机梯度下降（SGD）算法和交叉熵损失函数（cross-entropy loss）来训练
  * 测试：给定测试样例 $x$，模型计算$P(y|x)$ ，并返回较高概率的类别 $y$

#### 5.1 分类：sigmoid

* 输入样例 $x$ 可以表示为一个特征向量 $x = [x_1,x_2, \dots, x_n]$
* 逻辑回归学习一个权重向量$w = [w_1,w_2, \dots, w_n]$ 和截距 $b$
  * $z = w \cdot x + b$
  * 使用sigmoid函数将实数域输入映射到$[0,1]$区间的输出 $y = \sigma(z) =  \frac{1}{1+e^{-z}}$

* 逻辑回归方法需要手工设计特征交叉，对于大多数任务，我们需要大量特征（从特征模版中构建出来），为了避免特征设计的人力浪费，NLP中有专门研究表示学习的方向，使用无监督方法自动学习输入的特征
* 逻辑回归对于特征相关性强的问题较为鲁棒，而贝叶斯方法假设特征互不相关；故对于大数据集，逻辑回归表现一般较好，对于小数据集，朴素贝叶斯一般表现较好；朴素贝叶斯易于实现且训练快速（无需优化步骤），在某些情况下，依然是合理的方法

#### 5.2 交叉熵损失函数

* $L(\hat{y},y)$：衡量模型估计值 $\hat{y}$ 与真实值 $y$ 的差异
* 通过学习权重，最大化正确标签的概率 $p(y|x)$，这是一个伯努利分布，$p(y|x)=\hat{y}^{y}(1-\hat{y})^{1-y}$

* $L_{CE}(\hat{y},y) = - \log p(y|x) = -[y \log \sigma(w \cdot x+b)+(1-y) \log (1-\sigma(w \cdot x + b))]$

#### 5.3 梯度下降

* 求解目标是一组参数，使得 $\hat{\theta} = \arg \min \limits_{\theta} \frac{1}{m} \sum\limits_{i=1}^{m}L_{CE}(f(x^{(i)}; \theta), y^{(i)})$

* 对于逻辑回归，损失函数是凸的，仅有一个极小值点为全局最小值
* 但对于神经网络，损失函数是非凸的，故容易陷入局部极小值点而无法找到全局最小值
* 拓展到多维空间，学习过程为 $\theta^{t+1} = \theta^t - \eta \nabla_\theta L(f(x;\theta),y)$
  * 梯度：$\nabla_\theta L(f(x;\theta),y) = \left[ \begin{matrix} \frac{\partial}{\partial w_1}L(f(x;\theta),y) \\ \frac{\partial}{\partial w_2}L(f(x;\theta),y)  \\ \dots \\\frac{\partial}{\partial w_n}L(f(x;\theta),y)  \end{matrix} \right]$
  * 学习率：$\eta$，过大则训练阶段损失函数的值不收敛，过小则学习时间过长

* 使用mini-batch training，梯度下降方向为当前batch样例梯度的算术平均

##### 逻辑回归的梯度

$\frac{\partial L_{CE}(\hat{y},y)}{\partial w_j} = [\sigma(w \cdot x+b)-y]x_j$

##### 随机梯度下降算法

![image-20211123161930655](https://tva1.sinaimg.cn/large/008i3skNly1gwp5p44d6nj30jo0agdh7.jpg)

#### 5.4 正则化

训练集中，若某特征仅恰巧在单一类别中出现，它在逻辑回归的训练过程中，会被赋予很大的权重，而这有可能是巧合，从而导致过拟合问题，为了避免过拟合，在目标函数中引入正则项 $R(\theta)$，用于惩罚大权重值

* $\hat{\theta} = \arg \max \limits_{\theta} \sum\limits_{i=1}^{m} \log P(y^{(i)}|x^{(i)}) - \alpha R(\theta)$

正则项可以分为L2正则和L1正则，L2正则的逻辑回归又称岭回归，L1正则的逻辑回归又称Lasso回归；L2回归因为连续可导而易于优化，L1在零点不连续；L2的结果一般是多项小权重向量，L1的结果一般是一些权重值较大，一些权重值为0的权重向量

* L2正则： $R(\theta)= || \theta ||_2^2 = \sum\limits_{j=1}^{n} {\theta_j}^2$

* L1正则：$R(\theta)= || \theta ||_1 = \sum\limits_{i=1}^{n} |\theta_i |$

**L1正则化可通过假设权重w的先验分布为拉普拉斯分布，由最大后验概率估计导出**

* $P(w_j) = \frac{1}{\sqrt{2a}}exp(-\frac{|w_j|}{a})$
* $\log P(w) = \log \prod_j P(w_j) = -\frac{1}{a}\sum_j |w_j| + C'$

**L2正则化可通过假设权重w的先验分布为高斯分布，由最大后验概率估计导出**

* $w_j \sim N(0,{\sigma}^2)$

* $\log P(w) = \log \prod_j P(w_j) = \log \prod_j [\frac{1}{\sqrt{2 \pi} \sigma} exp(-\frac{{w_j}^2}{2{\sigma}^2})] = -\frac{1}{2 \sigma^2}\sum_j {w_j}^2 + C'$

#### 5.5 多元逻辑回归

* softmax操作：
  * $softmax(z_i) = \frac{exp(z_i)}{\sum_{j=1}^{k}exp(z_j)} \quad 1 \le i \le k$

* 损失函数：
  * $L_{CE}(\hat{y},y) = - \sum\limits_{k=1}^{K}y_k \log \hat{y_k} =  - \sum\limits_{k=1}^{K} \mathbb{I}\{y=k\} \log \hat{p}(y=k | x) =  - \log \frac{exp(w_k \cdot x +b_k)}{\sum_{j=1}^{K} exp(w_j \cdot x + b_j)}$ (其中k是正确类别)

* 梯度：
  * $\frac{\partial L_{CE}}{\partial w_{k,i}} = -(\mathbb{I}\{y=k\}-p(y=k|x))x_i = -(\mathbb{I}\{y=k\}- \frac{exp(w_k \cdot x +b_k)}{\sum_{j=1}^{K}exp(w_j \cdot x +b_j)})x_i$

# Chap 6 向量语义和嵌入表示

#### 6.1 词汇语义

* 词相似度：SimLex-999数据集（2015）给词对赋予0-10的相似度分值
* 词相关性：两个词是否属于一个语义场，如医院（医生，护士，急救）
* 语义帧和角色：语义帧是某个特定活动的观点和参与者构成的词集合，语义帧中存在角色，句子中的词可以扮演这些角色，如A从B那里买了一本书（A是买家，B是卖家）

#### 6.2 词向量语义学

* 词向量语义学的任务是在多维语义空间中找到一个点来表示词语，这个词语在多维空间中的向量表示叫做嵌入（embeddings）

  ![image-20211123184423750](https://tva1.sinaimg.cn/large/008i3skNly1gwp9vvbetrj30gl075jrr.jpg)

* 信息检索：给定文档集 $D$ 和查询 $q$，从文档集中返回最佳适配的文档 $d$；

#### 6.3 词和向量

* 词-文档矩阵：行数为词表大小 $|V|$，列数为文档个数 $|D|$，$M_{i,j}$ 表示词 $i$在文档 $j$ 中出现的次数
  * ![image-20211123190236374](https://tva1.sinaimg.cn/large/008i3skNly1gwpaes49wjj30l503kmxe.jpg)
  * 从词语的角度而言，battle可以表示为向量[1,0,7,13]
  * 从文档的角度而言，As you Like It 可以表示为向量 [1, 114,36,20]

* 词-词共现矩阵：行列数均为词表大小，$M_{i,j}$ 表示词 $i$ 和词 $j$ 在上下文（篇章、段落、句子等粒度皆可）中同时出现的次数

  * ![image-20211123190804238](https://tva1.sinaimg.cn/large/008i3skNly1gwpakgvhqej30l403k74r.jpg)

  * 矩阵稀疏程度非常高

#### 6.4 相似性衡量指标：余弦函数

* 内积：$(\textbf{v}, \textbf{w}) = \textbf{v} \cdot \textbf{w} = \sum\limits_{i=1}^{N}v_iw_i = v_1w_1 + v_2w_2 + \dots + v_Nw_N$
  * 向量越长，则内积越大，但为了衡量相似性，需要对其进行归一化
* 余弦：$\cos \theta = \frac{\textbf{a} \cdot \textbf{b}}{|\textbf{a}||\textbf{b}|}$
  * 对于单位向量，它们的余弦相似度即为它们的内积

#### 6.5 TF-IDF

* 算法
  * 词频（Term Frequency，TF） = 某个词在文档中出现的次数 / 文档的总词数 （在Lucene的实现中对TF开根号归一化）
  * 逆文档频率（Inverted Document Frequency，IDF） = log(语料库文档总数/(包含该词的文档数+1))
  * $TF-IDF = TF * IDF$，代表某个词在某个文档中的权重值（比直接用词频效果好）
* 应用
  * 在摘要场景下，根据文档中所有词语的TF-IDF值的大小，可以确定文档的关键词
  * 在搜索场景下，可根据查询 $q$ 涉及的关键词$(k_1, \dots k_n)$在文档 $d$ 中的TF-IDF值，建立相似度函数，$Similarity(q, d) = \sum_{i=1}^{n}TF-IDF(k_i, d)$
  * 常用做NLP任务的baseline算法

#### 6.6 Pointwise Mutual Information（PMI）

* 点互信息：衡量两个事件的相关性

  * $PMI(x,y) = \log_2 \frac{P(x,y)}{P(x)P(y)}$

  * 对于两个低概率事件，训练样本集不一定有同时出现的样本，容易导致$I(x,y)$ 趋向负无穷，所以提出改进，正点互信息

* 正点互信息

  * $PPMI(x,y) = \max (PMI(x,y), 0)$

  * 例子：词-词共现矩阵（上面的是频率，下面的是PPMI）

    * ![image-20211123200210881](https://tva1.sinaimg.cn/large/008i3skNly1gwpc4rpae4j30la04yjrw.jpg)
    * ![image-20211123200925909](https://tva1.sinaimg.cn/large/008i3skNly1gwpcd0nyzfj30l803ogly.jpg)
    * 计算过程
      * $P(w=information, c=data) = \frac{3982}{11716}=0.3399$
      * $P(w=information)=\frac{7703}{11716}=0.6575$
      * $P(c=data)=\frac{5673}{11716}=0.4842$
      * $PPMI(information,data)=\log_2 \frac{0.3399}{0.6575*0.4842}=0.0944$

    * 能反应较好的词-词关联性，但存在一定偏见，即对于罕见事件，会赋予较高的PPMI值

  * 改良

    * $PPMI_{\alpha}(w,c) = \max(\log_2 \frac{P(w,c)}{P(w)P_{\alpha}c}, 0) \quad P_{\alpha}(c) = \frac{count(c)^{\alpha}}{\sum_c count(c)^{\alpha}}$

    * 取经验值 $\alpha =0.75$ 能在大多数下游任务中改善模型表现，本质是降低了罕见事件的$PPMI$值
    * 另一个方法是对词频采用k-smoothing再进行PPMI计算，经验值是0.1～3

#### 6.7 TF-IDF和PPMI向量模型的应用

* TF-IDF模型常用于衡量两个文档的相似度，将文档的所有词向量做算术平均得到文档向量，再使用余弦相似度衡量两个文档向量的相似度；用于信息检索、作弊检测、新闻推荐等下游任务
* PPMI模型可以寻找语料集中的近义词

#### 6.8 Word2vec

* embeddings是较短的，稠密的向量，而非之前提及的维度为词汇表大小或文档集基数的稀疏向量；但embeddings并没有直观的解释
* 稠密向量需要学习较少的权重值，且对于同义的捕获更为鲁棒

* word2vec是一个运用自监督方法的语言向量表示方法
  * skip-gram的思想：
    * 1、将目标词和它的邻居上下文词作为正样本$(w,c)$
    * 2、从词汇表中随机采样其他词作为负样本（下图正负样本采样比例为2）
    * 3、使用逻辑回归去训练一个二分类器
    * 4、使用学习好的权重作为embedding

* Word2vec可以看作是PPMI矩阵的一个隐式优化版本

##### 分类器

![image-20211124144036123](https://tva1.sinaimg.cn/large/008i3skNgy1gwq8gi0xgij30hx01tq2v.jpg)

![image-20211124194745416](https://tva1.sinaimg.cn/large/008i3skNly1gwqhc3qqr8j30hx04t0t4.jpg)

* skip-gram 模型：
  * 假设：一个词 $c$ 若经常出现在目标词 $w$ 周围，则 $c$ 的词嵌入和 $w$ 的词嵌入是相似的
  * 算法：给定一个目标词$w$，和它的上下文窗口里的 $L$ 个词（该超参数需要调节，小了容易捕获句法相关，大了容易捕获话题相关）
    * $P(+|w,c) = \sigma(c \cdot w) = \frac{1}{1+exp(-c \cdot w)}$
    * $\log P(+|w,c_{1:L}) = \sum\limits_{i=1}^{L} \log \sigma(-c_i \cdot w)$

  * 结果：得到两类embedding，一类是作为目标词的，一类是作为上下文词的；每一类embedding都包含 $|V|$ 个词，实际中，可以将两类embedding加起来，或者抛弃上下文词embedding，作为最终embedding

* 负采样
  * 根据加权的unigram-frequency进行负采样： $p_{\alpha}(w) = \frac{count(w)^{\alpha}}{\sum_{w'}count(w')^\alpha}$
  * 经验值 $\alpha=0.75$ 表现较好，因为它能给罕见的词语赋予较高的概率， $P_{\alpha}(w) \gt P(w)$

* 训练目标：最大化正样本对的相似度，最小化负样本对的相似度
* 损失函数：$L_{CE} = - \log[P(+|w,c_{pos})\prod\limits_{i=1}^{k}P(-|w,c_{neg_i})] = - [\log \sigma(c_{pos} \cdot w) + \sum\limits_{i=1}^{k} \log \sigma(-c_{neg_i}\cdot w)]$

* 求解梯度：
  * $\frac{\partial L_{CE}}{\partial c_{pos}} = [\sigma(c_{pos} \cdot w)-1]w \quad \quad \frac{\partial L_{CE}}{\partial c_{neg}} = [\sigma(c_{pos} \cdot w)]w$
  * $\frac{\partial L_{CE}}{\partial w} = [\sigma(c_{pos}\cdot w) -1]c_{pos} + \sum\limits_{i=1}^{k}[\sigma(c_{neg_i} \cdot w)]c_{neg_{i}}$

##### 其他静态词嵌入

* fasttext（2017）使用subword models 去处理未知词汇和稀疏性问题，如where可以表示为自身和连续的n-gram组合 <wh, whe, her, ere, re>；对于每个连续的n-gram，通过skipgram学习它的embedding，最后，将该词所有n-gram的embedding加起来作为该词的embedding；[fasttext](https://fasttext.cc)提供157种语言的预训练embeddings

* Glove（2014）,Global Vectors的简称，是广泛使用的embedding模型，Glove是基于词词共现矩阵中的概率分布，结合如PPMI的count-based 模型，且能捕获线性结构

#### 6.9 词嵌入可视化

* 最简单的办法：根据词嵌入向量的相似性分数，列出最相近的词语列表
* 另一种办法：使用聚类算法反应词嵌入空间中的层次化表示
* 最常用的办法：使用t-SNE等投影算法，将高维向量投影到二维空间

#### 6.10 评价词向量模型

* 相似度测试：WordSim-353数据集（2002），SimLex-999数据集（2015）
* 上下文测试：Stanford Contextual Word Similarity数据集（2012），Word-in-Context数据集（2019）
* 类比测试： 给定 a-b，求解a* - b*的问题，如SemEval-2012 Task 2 dataset
* 考虑到词向量模型训练的随机性，可以通过在文档中采取bootstrap sampling训练多个embeddings，并求平均的方法，以达到更好的效果

# Chap 7 神经网络和神经语言模型

#### 7.1 神经元和前向神经网络

![image-20211125002208743](https://tva1.sinaimg.cn/large/008i3skNgy1gwqp9lg9e6j308j080t8p.jpg)

* $y=Activation(z) \quad z = w \cdot x + b$

* 激活函数
  * 常见种类：
    * Sigmoid：$\sigma{z} = \frac{1}{1+e^{-z}}$
    * Tanh：$\tanh(z) = \frac{e^z-e^{-z}}{e^z+e^{-z}}$
    * Relu：$RELU(z) = \max (z, 0)$
  * 常见问题：
    * 关注斜率，太靠近0会导致梯度消失问题，如sigmoid和tanh都会有该问题
    * 异或问题是线性不可分的，单个神经元不能解决这个问题

* 前向神经网络（feedforward network）：无环的多层网络，又名多层感知机（MLP）

* 计算图：

  <img src="https://tva1.sinaimg.cn/large/008i3skNgy1gwrc5lkv50j30f306ojrp.jpg" alt="image-20211125133404877" style="zoom:67%;" /><img src="https://tva1.sinaimg.cn/large/008i3skNgy1gwrc67zbecj30dl09h3z5.jpg" alt="image-20211125133441473" style="zoom:67%;" />

#### 7.2 神经语言模型

![image-20211125141117768](https://tva1.sinaimg.cn/large/008i3skNgy1gwrd8bug57j30km0hyq5b.jpg)

* 一般使用one-hot encoding 作为原始输入，通过反向传播去train一个one hot encoding到特定维数embedding的矩阵E
* 训练过程为 $\theta^{s+1} = \theta^{s} - \eta \frac{\partial(-\log P(w_t | w_{t-1} \cdots {w_{t-n+1}}))}{\partial \theta}$

# Chap 8 词性标注和命名实体识别

#### 8.1 英语词汇分类

![image-20211125215640991](https://tva1.sinaimg.cn/large/008i3skNly1gwrqokbr17j30p80e0n10.jpg)

* closed class：多为语法上的功能词汇，较短，高频出现
* open class：能被持续创造或引申

![image-20211126042135761](https://tva1.sinaimg.cn/large/008i3skNly1gws1t0ta0oj30p909wdin.jpg)

* 另一种词性分类体系

#### 8.2 词性标注

![image-20211126042219002](https://tva1.sinaimg.cn/large/008i3skNly1gws1trsp1vj30an05saac.jpg)

* 词性标注：给定序列$x_1, \dots, x_n$，和标签集，输出每个元素对应的标签$y_1,\cdots,y_n$

  * 考虑到某些词，如book，既可以是名词，也可以是动词，词性标注就是通过上下文来精确定性词汇，避免模棱两可的情况

  * 对于词性标注任务，HMMs，CRFs，BERT等算法和人类表现基本一致，准确率约为97%
  * 给定测试集中一个词，选择它在训练集中最频繁的标注类型，准确率能有92%（baseline）

#### 8.3 命名实体和命名实体识别

![image-20211126043120817](https://tva1.sinaimg.cn/large/008i3skNly1gws236fccxj30k201xmxh.jpg)

![image-20211126043137869](https://tva1.sinaimg.cn/large/008i3skNly1gws23h49bcj30l808jjsg.jpg)

* 命名实体识别（NER）：寻找特定类型实体
  * BIO 标注方法（1995）：将寻找离散实体段的任务转化为序列连续标注任务

#### 8.4 隐马尔可夫模型（HMM）

* 马尔可夫假设：未来与过去无关，仅与当下相关
  
* $P(q_i=a | q_1 \dots q_{i-1})=P(q_i=a|q_{i-1})$
  
* 马尔可夫链：包含状态集、转移概率矩阵、初始概率分布三个要素
  
* ![image-20211126043633466](https://tva1.sinaimg.cn/large/008i3skNly1gws28lpknjj309r05iglp.jpg)
  
* 隐马尔可夫模型
  * 很多情况下，我们关注的事件是隐藏的，隐马尔可夫模型允许我们将观测到的事件和隐藏的事件作为概率模型的作用因子，它是一个生成式模型
  * 隐马尔可夫模型组成元素
    * ![image-20211127143801717](https://tva1.sinaimg.cn/large/008i3skNly1gwtp8rq9mlj30ob08m76f.jpg)

* 隐马尔可夫标签模型

  * 标签tag转移概率 $P(t_i|t_{i-1})=\frac{C(t_{i-1},t_i)}{C(t_{i-1})}$ （频率估计概率），常从大语料集中抽取出来

  * HMM表示的两部分，A为标签转移概率矩阵，用于计算先验概率，B为与每个标签关联的词语观测概率

    ![image-20211127181603445](https://tva1.sinaimg.cn/large/008i3skNly1gwtvjmdyroj30il0a9jsc.jpg)
    
    * 标签转移概率矩阵A（从大语料集中获得，通用）![image-20211130120957553](https://tva1.sinaimg.cn/large/008i3skNly1gwx1tmd9qxj30go05iq3v.jpg)
  
    * 标签关联词语观测概率B（从训练集中获得）![image-20211130121134267](https://tva1.sinaimg.cn/large/008i3skNly1gwx1v9g01rj30gq04vjrq.jpg)
  
      
  
    * 两个假设及序列估计公式
  
      * 假设一：一个词出现的概率依赖于它自己的标签，和上下文的词和标签无关：$P(w_1 \dots w_n | t_1 \dots t_n) \approx \prod\limits_{i=1}^{n}P(w_i|t_i)$
      * 假设二：一个词的标签仅依赖于上一个词的标签（bigram）$P(t_1 \dots t_n)\approx \prod\limits_{i=1}^{n}P(t_i|t_{i-1})$
      * 序列估计（最后分别对应概率矩阵A和B）：$\hat{t_{1:n}}=\arg \max\limits_{t_1 \dots t_n}P(t_1 \dots t_n|w_1 \dots w_n) = \arg \max\limits_{t_1 \dots t_n} \frac{P(w_1 \dots w_n|t_1 \dots t_n)P(t_1 \dots t_n)}{P(w_1 \dots w_n)} \\ = \arg \max\limits_{t_1 \dots t_n} P(w_1 \dots w_n|t_1 \dots t_n)P(t_1 \dots t_n) \\ \approx \arg \max\limits_{t_1 \dots t_n}\prod\limits_{i=1}^{n}P(w_i | t_i)P(t_i | t_{i-1}) $
  
  * 不足之处
  
    * 需要对概率矩阵做平滑处理；难以融合其他特征；无法处理未知词汇
  
* 维特比算法：通过动态规划的方式寻找最优标签序列（先将概率从左推到右，再回溯产生最大概率的标签路径）

  * ![image-20211130122047547](https://tva1.sinaimg.cn/large/008i3skNly1gwx24v164hj30fq09j3zf.jpg)

#### 8.5 条件随机场（CRFs）

* 条件随机场：判别式模型，直接计算，概率是 $K$ 个全局特征 $F$ 的加权softmax值，每个全局特征是由对应的函数 $f$ 在运用完整输入$X$ ，窗口为2的标签序列，标签位置求和得到的，这种又叫线性链随机场，局部特征函数 $f$ 可以自由定义并组合多种人工特征
  * $F_K(X,Y) = \sum\limits_{i=1}^{n}f_k(y_{i-1},y_i,X,i)$
  * $P(Y|X) = \frac{exp(\sum\limits_{k=1}^{K}w_kF_k(X,Y))}{\sum\limits_{Y' \in \mathcal{Y}}exp(\sum\limits_{k=1}^{K}w_kF_k(X,Y'))}$
  * $\hat{Y} = \arg \max\limits_{y \in \mathcal{Y}} P(Y|X) = \arg \max\limits_{Y \in \mathcal{Y}}\sum\limits_{i=1}^{n}\sum\limits_{k=1}^{K}w_kf_k(y_{i-1},y_i,X,i)$

# Chap 9 序列处理的深度学习架构

#### 9.1 循环神经网络（RNN）

* 结构特点：网络连接中有环，训练较难
  * <img src="/Users/lyj-newy/Library/Application Support/typora-user-images/image-20211130204950424.png" alt="image-20211130204950424" style="zoom:50%;" /><img src="https://tva1.sinaimg.cn/large/008i3skNly1gwxgxrmm0ej30o40bbaah.jpg" alt="image-20211130205257551" style="zoom:50%;" />

* 数学表达：
  * 给定词表大小 $|V|$，输入维度$d_{in}$；隐藏层维度 $d_{h}$ ；输出维度 $d_{out}$；one-hot输入 $x_t \in \{0,1\}^{|V| \times 1}$ 权重矩阵 $ E \in \mathbb{R}^{|V| \times d_{in}} \quad  W \in \mathbb{R}^{d_h \times d_{in}}$；$U \in \mathbb{R}^{d_h \times d_h}$；$V \in \mathbb{R}^{d_{out} \times d_h}$
  * $e_t = E^T x_t \quad h_t=g(Uh_{t-1}+We_t) \quad y_t = Softmax(Vh_t) \quad P(w_{t+1}=i |w_{1:t})=y_t^{i}$

* 自回归
  * ![image-20211205124245392](https://tva1.sinaimg.cn/large/008i3skNly1gx2uvadka8j30ki0br3z6.jpg)

* 序列分类：使用最后一个隐状态作为分类器的输入，可进行端到端训练
  * <img src="https://tva1.sinaimg.cn/large/008i3skNly1gx2uzmh4wgj30k40c4aaa.jpg" alt="image-20211205124657042" style="zoom:50%;" />

* Stacked RNNs
  * <img src="https://tva1.sinaimg.cn/large/008i3skNly1gx2v1nupmyj30kd0bomxl.jpg" alt="image-20211205124855230" style="zoom:100%;" />

* Bidirectional RNNs
  * ![image-20211205125139196](https://tva1.sinaimg.cn/large/008i3skNly1gx2v4ieouzj30kd0afgm4.jpg)

#### 9.2 管理RNN的上下文：LSTMs 和 GRUs

* 朴素RNN的两个问题：难以同时为当前节点提供决策支持且携带信息用于后续节点决策；容易出现梯度消失的问题

* 关键应对措施是学习如何管理上下文，而非将一种策略硬编码进网络结构中

* LSTM通过在结构中加入显式的上下文层，起到管理上下文的作用；通过使用特殊的神经元（通过门的方式控制信息流入流出）

  * LSTM unit示意图，输入为上一时刻的上下文向量$s_{t-1}$，上一时刻的隐状态向量$h_{t-1}$，当前时刻的输入 $x_t$，输出当前上下文向量 $s_t$，当前隐状态向量 $h_t$

    ![image-20211206224656851](https://tva1.sinaimg.cn/large/008i3skNly1gx4hy91jdcj30l30eymxo.jpg)

  * 遗忘门：删除上下文中不再需要的信息。计算上一个隐藏层和当前输入的加权和，过sigmoid，然后再将结果与上下文向量相乘

    * $f_t=\sigma(U_fh_{t-1}+W_fx_t)$
    * $k_t = s_{t-1} \odot f_t$

  * 加法门：选择信息加在当前上下文上面，得到新的上下文向量$c_t$
    * $g_t=\tanh(U_gh_{t-1}+W_gx_t)$ （计算单元）
    * $i_t=\sigma(U_ih_{t-1}+W_ix_t)$
    * $j_t = g_t \odot i_t$
    * $s_t = j_t+k_t$

  * 输出门：决定当前隐藏状态需要什么信息（即需要为未来决策保留何种信息）
    * $o_t=\sigma(U_oh_{t-1}+W_ox_t)$
    * $h_t=o_t \odot \tanh(s_t)$

* LSTM引入了相当多的附加参数(8组)，$U_f,U_g,U_i,U_o,W_f,W_g,W_i,W_o$，导致训练成本较高，GRU则通过分离上下文向量，并将门的个数精简为2来缩减训练成本，包括一个重置门$r$，和一个更新门$z$

  * 重置门：决定过去隐状态中哪些信息是与当前上下文相关，哪些信息可以被忽略
    * $r_t=\sigma(U_rh_{t-1}+W_rx_t)$
  * 更新门：
    * $z_t=\sigma(U_zh_{t-1}+W_zx_t)$
  * $\widetilde{h}_t = \tanh(U(r_t \odot h_{t-1})+Wx_t)$ (计算单元)
  * $h_t=(1-z_t)h_{t-1}+z_t \widetilde{h}_t$

* 前向神经网络，普通RNN，LSTM，GRU的单元结构图
  
  * ![image-20211206230902441](https://tva1.sinaimg.cn/large/008i3skNly1gx4il7hv0ij30k409rt97.jpg)

#### 9.3 自注意力网络：Transformers

* RNNs通过循环结构传递信息会导致信息丢失且难以训练，且序列一步一步的推断不允许并行计算，这些问题使得Transformers结构得以发展，消除循环结构，回归全连接网络

* 自注意力机制允许网络从任意长度的上下文中直接抽取信息并使用，无需通过中间的循环连接结构；自注意力机制的核心是能够比较一个实体对于实体集中其他实体的兴趣程度，从而揭示上下文的相关性，但这种简单的机制不能用于学习，需要设定不同role

  ![image-20211207105634867](https://tva1.sinaimg.cn/large/008i3skNly1gx531e2jf7j30ly0953z9.jpg)

* Transformer中的Self-Attention机制

  * <img src="https://tva1.sinaimg.cn/large/008i3skNly1gx55l7s6qbj30kv0iu0u3.jpg" alt="image-20211207122449476" style="zoom:75%;" />
  * 给定$x_i \in \mathbb{R}^{d_m \times 1}$ ，则 $W^Q \in \mathbb{R}^{d_q \times d_m}$，$W^K \in \mathbb{R}^{d_k \times d_m}$，$W^V \in \mathbb{R}^{d_v \times d_m}$
  * $q_i = W^Q x_i \quad k_i =W^Kx_i \quad v_i=W^Vx_i$
  * $score(x_i,x_j) = \frac{q_i \cdot k_j}{\sqrt{d_k}}$
  * $\alpha_{ij} = softmax(score(x_i,x_j)) \quad \forall j \le i \\ \quad \  = \frac{exp(score(x_i,x_j))}{\sum\limits_{k=1}^{i}exp(score(x_i,x_k))} \quad \forall j \le i$
  * $y_i = \sum\limits_{j \le i} \alpha_{ij}v_j$

  * 使用向量形式表达：$SelfAttention(Q,K,V)=softmax(\frac{QK^T}{\sqrt{d_k}})V$ （记住要mask掉上三角，避免使用未来函数）

* Transformer中的Multihead Attention
  * ![image-20211207155523412](https://tva1.sinaimg.cn/large/008i3skNly1gx5bob1p6cj30pa0exwfq.jpg)
  * 两个词之间可能存在多种关系，一个单独的transformer block难以同时捕捉这些关系，故使用多个head（即self-attention layer） ，将不同head的输出concat起来，在使用一个线性投影矩阵恢复成原来的维度
  * $ MultiHeadAttn(Q,K,V)=W^O (head_1 \oplus head_2 \dots \oplus head_n)$
  * $head_i = SelfAttention(W_i^QX,W_i^KX,W_i^VX)$
* Transformer中的Block
  * ![image-20211207155424500](https://tva1.sinaimg.cn/large/008i3skNly1gx5bna2tboj30oy0hoq43.jpg)
  * 包括自注意力力层，正则化层，前向层，以及残差连接

* 训练一个Transformer语言模型
  
* ![image-20211207155754367](https://tva1.sinaimg.cn/large/008i3skNly1gx5bqx9nc2j30p40blt9r.jpg)
  
* Transformer语言模型完成摘要任务
  
  * ![image-20211207160100785](https://tva1.sinaimg.cn/large/008i3skNly1gx5bu5wes4j30p30ad756.jpg)

# Chap10 上下文嵌入

* 原书还没更新本章，跳过

# Chap 11 机器翻译和编解码模型

#### 11.1 编解码模型

* encoder-decoder模型
  * ![image-20211207162008971](https://tva1.sinaimg.cn/large/008i3skNly1gx5ce29azvj30g8058749.jpg)
  * encoder的作用是对输入生成一个带有上下文信息的表示

* 基于RNN的encoder-decoder架构
  * 描述：以encoder最后的隐状态代表encoder和decoder的桥梁，即context，并用于decoder的初始隐状态，并通过自回归生成输出序列，但生成过程中会导致信息丢失，一个改良办法是将context变量引入到每一步推断中
  * 架构图：![image-20211207192418568](https://tva1.sinaimg.cn/large/008i3skNly1gx5hppxjkrj30kt082js3.jpg)![image-20211208124221131](https://tva1.sinaimg.cn/large/008i3skNly1gx6bpr5by6j306d0380sm.jpg)
  * 数学公式：
    * $h_n^e = c = h_0^d$
    * $h_t^d = g(\hat{y}_{t-1},h_{t-1}^d, c)$
    * $y_t = softmax(f(h_t^d))$

  * 训练方法：使用标准译文作为decoder的输入，而不选用上一时刻decoder的输出

#### 11.2 注意力机制

* 基于RNN的ecoder-decoder架构中，context变量始终是一个information bottleneck，对于长句，context变量不能保存长距离信息，注意力机制是一个解决办法，使用encoder所有隐状态向量的加权和来作为context变量，权重由每个encoder state与当前decoder的隐状态$h_{i-1}^d$的相关性分数决定，评分函数可以更复杂一些

* decoder翻译时，权重使得decoder更关注输入的特定部分，在decode过程中，context vector是动态变化的

  * ![image-20211208151857328](https://tva1.sinaimg.cn/large/008i3skNly1gx6g8pmtevj307303d0sn.jpg)<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gx6gtc7r1nj30n40ayab9.jpg" alt="image-20211208153843781" style="zoom:67%;" />

  *  $score(h_{i-1}^d,h_j^e) = h_{i-1}^d \cdot h_j^e$
  * $\alpha_{ij}=softmax(score(h_{i-1}^d,h_j^e) \quad \forall j \in e)$
  * $c_i = \sum\limits_j \alpha_{ij}h_j^e$

#### 11.3 Beam Search

* greedy decoding：decode的过程中，选择经过softmax运算后的单个最高概率的token
* greedy decoding不是最优的，不一定能找到最大概率的完整翻译；但像viterbi算法等动态规划方式并不适用，保证最优结果只有穷举这种办法；但实际操作中，会过慢
  * ![image-20211208154808945](https://tva1.sinaimg.cn/large/008i3skNgy1gx6h33puwmj30b408m0t4.jpg)

* 对于序列生成问题，常用的方法叫做beam search，decode的每步保留k个可能的token，k叫做beam width，下一步decode时，会出现$k * |V|$个待选序列，根据概率裁剪剩k个即可，故能一直保持k个假设序列。当某个序列到达终止符时，k减1，然后继续搜索，直到k=0为止；下图为k=2的beam search实例
  * ![image-20211208160642915](https://tva1.sinaimg.cn/large/008i3skNly1gx6hme6a0yj30ov0hxq5c.jpg)

* beams search的k值一般取5到10，生成的最终k个假设序列可能会出现长度不一致的问题，采用长度归一化的方式选出最终的结果
  * $score(y) = - \log P(y|x) = \frac{1}{T}\sum\limits_{i=1}^{t} - \log P(y_i|y_1,\dots y_{i-1},x)$

#### 11.4 基于Transformers的编解码模型

#### 11.5 开发机器翻译系统的实用细节

* 使用BPE或wordpiece算法生成一个词典，包括现有语言和目标语言的词汇

* 段落对齐（sentence alignment）

* Backtranslation：使用反向翻译的句对增强训练数据集
  * https://blog.csdn.net/feifei3211/article/details/103344445
  * https://arxiv.org/pdf/1808.09381.pdf

#### 11.6 机器翻译评估方法

* 翻译结果可以使用两个维度去进行评价，恰当性（adequacy）和流畅性（fluency）

* 人工的评估方法可以根据恰当行和流畅性等指标进行绝对打分或相对排序

* 自动的评估方法中，最流行的是BLEU（BiLingual Evaluation Understudy，2002），它是基于一个假设：好的机器翻译会包含正确人工翻译中的词语和短语；故考察真实翻译和候选机翻的n-gram准确率（n=1，2，3，4的加权平均），以及根据候选翻译和参考翻译的句子长度的关系作为惩罚因子

  * 计算过程讲解：https://blog.csdn.net/guolindonggld/article/details/56966200

  * 局限性：BLEU具有局部性，难以评价跨句段的翻译效果

* 自动评估方法中，Bertscore: Evaluating text generation with BERT. *ICLR 2020*. 提出可以使用BERT去评价真实翻译和候选翻译的语义相似度BERTScore，作为一种新的自动评估指标；后续衍生工作包括BLEURT ACL2020，MoverScore等
  * ![image-20211208180716389](https://tva1.sinaimg.cn/large/008i3skNly1gx6l3vms12j30kh04w74v.jpg)
* 文本生成评价指标的进化
  * https://blog.csdn.net/hwaust2020/article/details/106997321

# Chap 12 成分结构语法

* 本章比较理论化，跳过

# Chap 13 成分结构解析

* 本章比较理论化，跳过

# Chap 14 依赖解析

* 本章比较理论化，跳过

# Chap 15 句义的逻辑表示

* 本章比较理论化，跳过

# Chap 16 计算语义学和语义解析

* 本章尚未更新

# Chap 17 信息抽取

* 

# Chap 21 共指消歧

# Chap 22 语篇连贯

# Chap 23 自动问答

# Chap 24 聊天机器人和对话系统

# Chap 25 语音学

# Chap 26 自动语音识别和文本语音生成

