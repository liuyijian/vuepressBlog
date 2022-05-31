# 论文阅读笔记

## CV

### ViT （ICLR 2021）

* 论文：《AN IMAGE IS WORTH 16X16 WORDS: TRANSFORMERS FOR IMAGE RECOGNITION AT SCALE》

* 模型结构/流程：

  * 图片尺寸：224*224
  * patchsize：16，
  * patchcount：(224/16)^2 = 196 （相当于NLP中的序列长度）
  * patch_dim：16 * 16 * 3 = 768 （可以用原图，也可以用CNN抽取得到的特征图）
  * 线性投射层：输入768维，输出768维 （线性投射层本文用全连接）
  * transformer_input_vector: 线性投射层的结果和768维的位置编码相加 （前置一个 [CLS] token，用于分类）
  * transformer：每个token的输入/输出维度是768
  * MLP Head：接受若干层transformer encoder后的[CLS] token对应的768维向量，输出图像类别维的向量，过softmax即是每个类别的预测概率

  ![image-20220501115102521](https://tva1.sinaimg.cn/large/e6c9d24ely1h1srgrwj33j20e107a0ta.jpg)

* 结论：

  * Transformer结构拥有全局建模的特性，对于图片出现**局部遮挡**，**数据分布偏移**，对抗，patch随机排列组合的场景下表现更好
  * 在图像分类任务问题中
    * 大规模数据集上（本文指JFT300M），ViT比传统CNN架构的准确率更高
    * 小规模数据集（本文指ImageNet-1K）上，由于CNN的归纳偏置（局部性，平移等变性）很强，CNN准确率更高
  * 位置编码问题上，通过无编码、1维编码、2维编码、相对位置编码的消融实验，得出结论1维位置编码+层共享能得到最好的结果

* 改进点：
  
  * Multi-Head Attention可以换为Pooling，参考论文Poolformer

### Swin Transformer（ICCV 2021 Best Paper）

* 挑战：真实图像的物体多尺度问题，高分辨率导致的序列过长问题
* 创新：
  * 滑动窗口机制：将自注意力计算限制在窗口内，且窗口间可以交互，计算复杂度和图片大小的关系从$O(n^2)$ 降低到 $O(n)$，且能产生多尺度特征图，用于检测、分割等下游任务
* 模型结构/流程：
  * Patch Partition：将224\*224\*3的图像变成56\*56\*48
  * Linear Embedding：输入56\*56\*48，输出56\*56\*96 （相当于序列长度为3136，每个token是96维向量表示）
  * Patch Merging：见图二，维度变化是是$H \times W \times C \rightarrow \frac{H}{2} \times \frac{W}{2} \times 2C $
  * Swin Transformer Blocks：先做一次窗口内self-attention，再做一次移动窗口的self-attention(因为有不相邻的情况，所以要mask掉一些区域，见图三、图四)
  * W-MSA：首先要将特征图划分到一个个窗口中，假设每个窗口的宽高都是$M$，那么总共会得到$\frac{h}{M} \times \frac{w}{M}$个窗口，
    然后对每个窗口内使用多头注意力模块。刚刚计算高为h，宽为w，深度为C的特征图的计算量为$4hwC^2+2(hw)^2C$，代入公式得总体计算量为$\frac{h}{M} \times \frac{w}{M} \times\left(4(M C)^{2}+2(M)^{4} C\right)=4 h w C^{2}+2 M^{2} h w C$，故相比于MSA模块而言节省计算量为$2(h w)^{2} C-2 M^{2} h w C$
* 模型图片
  * ![image-20220501135524086](https://tva1.sinaimg.cn/large/e6c9d24ely1h1sv24y5wlj20lh06ct9m.jpg)
  * ![image-20220501141916062](https://tva1.sinaimg.cn/large/e6c9d24ely1h1svqyvaf5j20pj0dmab8.jpg)
  * ![image-20220501140429000](https://tva1.sinaimg.cn/large/e6c9d24ely1h1svbkyw2dj20k605nq3e.jpg)
  * ![image-20220501140733770](https://tva1.sinaimg.cn/large/e6c9d24ely1h1svesmruzj20ln0b5gmw.jpg)
  * ![image-20220501141745669](https://tva1.sinaimg.cn/large/e6c9d24ely1h1svpe97qzj20qd08kdhx.jpg)
* 结论：
  * 套着resnet皮的transformer
  * Swin-T和Resnet50计算量相近，Swin-S和Resnet101计算量相近

### Swin Transformer v2

视觉类大模型面临的三个问题：训练稳定性、预训练和调优阶段的像素尺度差异、标注数据有限

本文提出的三个解决办法：

* 1、用residual-post-norm方法结合cosine attention去提高训练稳定性
* 2、用log-spaced continuous position bias方法去将低像素预训练模型适配到下游任务的高像素输入
* 3、用自监督训练方法，SimMIM去减少标注数据的需求

### CLIP

* 视觉模型的现状：基于预定义的固定类别进行分类，当出现新类别的时候，模型泛化性不足
* 解决办法：从文本里拿到监督信号，用多模态的对比学习做预训练（Constrative Language Image Pretraining）
* ![image-20220516004527314](https://tva1.sinaimg.cn/large/e6c9d24ely1h29kivezt5j20ng08qt9j.jpg)
* 数据集：4亿图像文本对 WIT
* 模型： 
  * 训练任务：判断图片和文本是否配对 



OpenAI 员工 博客 lilianweng.github.io

How to train really large models on Many GPUs

### appendix

https://github.com/open-mmlab/mmcv/blob/master/README_zh-CN.md

https://blog.csdn.net/Think88666/article/details/109362132

https://www.cnblogs.com/isLinXu/p/15880039.html

https://github.com/ChristophReich1996/Swin-Transformer-V2

https://github.com/Gumpest/YOLOv5-Multibackbone-Compression

https://github.com/rwightman/pytorch-image-models/releases/tag/v0.1-weights-swinv2

https://cloud.tencent.com/developer/article/1583186

https://openaccess.thecvf.com/content/ICCV2021W/VisDrone/papers/Zhu_TPH-YOLOv5_Improved_YOLOv5_Based_on_Transformer_Prediction_Head_for_Object_ICCVW_2021_paper.pdf

https://github.com/yl305237731/flexible-yolov5

https://github.com/hhaAndroid/mmdetection-mini

https://github.com/open-mmlab/mmdetection/tree/master/configs/yolox

![image-20220501221738651](https://tva1.sinaimg.cn/large/e6c9d24ely1h1t9kq2en2j20wj0k5n1a.jpg)

![image-20220501205609370](https://tva1.sinaimg.cn/large/e6c9d24ely1h1t77z2xmij20z20jldjz.jpg)

https://github.com/isLinXu/DatasetMarkerTool

![image-20220501213655407](https://tva1.sinaimg.cn/large/e6c9d24ely1h1t8ecez39j20mf069t9h.jpg)

Swin Transformer Faster RCNN 网络结构图



![](https://tva1.sinaimg.cn/large/e6c9d24ely1h1t8hz2nosj219y08ugn9.jpg)

Dynamic Head 网络结构图

![image-20220501222651370](https://tva1.sinaimg.cn/large/e6c9d24ely1h1t9uam7zfj20jd08iaaw.jpg)

- The simple setting serves as a minimum example to use DyHead in MMDetection. Specifically,
  - it adds `DyHead` to `neck` after `FPN`
  - it sets `stacked_convs=0` to `bbox_head`

- The `simple` setting achieves higher AP than the original implementation. We have not conduct ablation study between the two settings. `dict(type='Pad', size_divisor=128)` may further improve AP by prefer spatial alignment across pyramid levels, although large padding reduces efficiency.

HTC

* 提点很多，曾经的竞赛王者
* 改进Cascade-RCNN



### 方案

Swin-T + Cascade Mask R-CNN

Swin-T + HTC

Focal-T + HTC

Focal-T

| Method                                    | box mAP      | FLOPS           |
| ----------------------------------------- | ------------ | --------------- |
| yolov5l6(1280*1280)                       | 53.7         |                 |
| Swin-T + Cascade Mask R-CNN               | 50.4         | 86M/745GFlops   |
| Swin-S + Cascade Mask R-CNN               | 51.9         | 107M/838GFlops  |
| Swin-B + Cascade Mask R-CNN               | 51.9         | 145M/982GFlops  |
| Swin-T + RepPointsV2                      | 50.0         | 45M/283GFlops   |
| Swin-T + HTC                              |              |                 |
| Focal-T + RepPointsV2                     | 51.2         | 45M/491GFlops   |
| Focal-T + HTC                             |              |                 |
| DB-Swin-T + Mask R-CNN                    | 50.2         | 76M/357GFlops   |
| DB-Swin-S + Cascade Mask R-CNN(1600x1400) | 56.3(可以做) | 156M/1016GFlops |

*Compared to regular HTC, our HTC uses 4conv1fc in bbox head.*



https://github.com/VDIGPKU/CBNetV2/blob/main/model_zoo.md

https://github.com/VDIGPKU/CBNetV2/blob/main/configs/cbnet/cascade_mask_rcnn_cbv2_swin_small_patch4_window7_mstrain_400-1400_adamw_3x_coco.py

