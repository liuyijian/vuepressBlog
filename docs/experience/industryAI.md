# 安全生产智能监控平台

## 需求和痛点

| 角色 | 需求                                     | 痛点                                                         |
| ---- | ---------------------------------------- | ------------------------------------------------------------ |
| 政府 | 监管企业合法合规生产，降低安全事故发生率 | 用于监管的数据形式和来源单一，以事后总结性质的文本为主，缺乏**事前预警**能力 |
| 企业 | 保障高效生产过程中的员工安全             | 企业数据产出能力与政府数字化监管需求存在矛盾                 |
| 工人 | 增强生产安全意识                         | 缺乏系统性安全培训的时间和渠道                               |

## 模块设计

| 模块     | 功能                                                         |
| -------- | ------------------------------------------------------------ |
| 智能监控 | 政府/企业：能查看权限范围内企业的厂区监控，获取**异常告警**信息 |
| 安全学习 | 政府：能发布相关政策文件和安全生产的视频课程<br>企业：获取工人学习情况报告<br>工人：完成相应学习任务（设定激励机制） |
| 隐患排查 | 政府：督促企业进行隐患整改<br>企业：获取企业内隐患数据信息<br>工人：上传隐患图像和描述文字（设定激励机制） |

## 智能监控模块

### 架构设计

![image-20220324115512417](https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku1d6v61j21280h9q6x.jpg)

### 功能介绍

#### 实时监控

![image-20220324115625680](https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku2n139gj213e0kt0zk.jpg)

* 支持省市区粒度的企业筛选和厂区摄像头分布卫星地图
* 支持多格式视频源接入（video/mp4，http/flv，hls/m3u8，webrtc）

#### 智能识别

<img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku8jnw4tj20mb0bct9u.jpg" alt="image-20220324120206643" style="width:65%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0ku8u7g8fj20cx0dyq37.jpg" alt="image-20220324120223829" style="width:33%;" />

<img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuibceofj20i10i3q46.jpg" alt="image-20220324121129906" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kujb6c6rj20i10i3tae.jpg" alt="image-20220324121227072" style="width:50%;" />

* 支持识别12类工业场景实体/行为
  * 红色警报类：吸烟、火焰、烟雾、裸露转轴
  * 黄色异常类：玩手机、杂服、裸露头部
  * 蓝色正常类：人体、头盔、安全服、保护罩、引擎
* 支持实时接入和异常告警
  * 带检测结果的800毫秒低延时直播，像素为1080x1080，码率为1Mbps （效果受限于当地网络上行带宽）
  * 使用企业微信API进行异常信息推送

## 安全学习模块

### 功能介绍

#### 法律法规文件学习

<img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kumtlzghj20tc090t99.jpg" alt="image-20220324121550008" />

<img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuqz63zpj20v80k2wjo.jpg" alt="image-20220324121949310" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuprjkbaj20v80k240l.jpg" alt="image-20220324121839696" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kuolu97gj20ve0k9gn4.jpg" alt="image-20220324121732290" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/e6c9d24ely1h0kunayr8aj20ji0g4dgp.jpg" alt="image-20220324121617442" style="width:50%;height:25%" />

* 支持多字段搜索，快速定位文件
* 支持多格式文件在线预览（docx，pptx，xlsx，pdf）