# Chap3 FFmpeg转封装

## 音视频文件转MP4格式

* MP4格式的跨平台特性最好，兼容PC、Android、IOS，也是最常见的文件格式
* MP4文件由许多个Box与FullBox组成，每个Box由Header和Data两部分组成，FullBox是Box的扩展，在Box结构基础上，在Header中增加8位version标志和24位flags标志，Header中包含了整个Box的长度的大小（size）和类型（type），当size=0时，说明这个Box是文件的最后一个Box，当size=1时，后面会定义一个64位的largesize用来描述Box的长度，Data为Box的实际数据，可以是纯数据，也可以是更多的子Box
* 更多关于不同Box的数据格式请看书。

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzisnn8oej311s09un1z.jpg" alt="image-20201023200320854" style="zoom:50%;" />

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzj6zs1l9j30u00vuqnd.jpg" alt="image-20201023201745860" style="zoom:50%;" />

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzj7b1tnnj312w0hcq94.jpg" alt="image-20201023201804738" style="zoom:50%;" />

## 视频文件转flv

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzjrrf71sj312i0bkwjd.jpg" alt="image-20201023203746431" style="zoom:50%;" />

* 若封装FLV时，内部的音频或者视频不符合标准时，是无法封装成FLV的，而且还会报错，为了解决这类问题，可以进行转码，如``ffmpeg -i input.mp4 -vcodec copy -acodec aac -f flv output.flv``

* 在网络视频点播文件为FLV格式文件时，人们常用yamdi工具先对FLV文件进行一次转换，主要是将FLV文件中的关键帧建立一个索引，并将索引写入metadata头中，这个步骤用FFmpeg同样可以实现 ``ffmpeg -i input.mp4 -c copy -f flv -flvflags add_key_frame_index output.flv``
* 当生成的flv出现问题时，可以用flvparse，flvanalyzer这两种可视化分析工具，也可以使用ffprobe命令``ffprobe -v trace -i output.flv``

## 视频文件转M3U8

* M3U8是种常见的流媒体格式，主要以文件列表的形式存在，既支持点播又支持直播，尤其在Android、IOS等平台最为常用。下面是一个简单例子和一个复杂例子。[HLS的详细介绍](https://blog.csdn.net/aoshilang2249/article/details/82012187)
  * EXTM3U：M3U8文件必须包含的标签，且必须在首行
  * EXT-X-VERSION：M3U8文件的版本
  * EXT-X-TARGETDURATION：每个分片都会有一个分片自己的duration，这个标签是最大的那个分片的浮点数四舍五入后的整数值
  * EXT-X-MEDIA-SEQUENCE：M3U8直播时的直播切片序列
  * EXTINF：M3U8列表中每一个分片的duration，下面的信息为具体的存储路径（相对、绝对、互联网URL）

```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:4
#EXT-X-MEDIA-SEQUENCE:0
#EXTINF:3.760000,
out0.ts
#EXTINF:1.880000,
out1.ts
#EXTINF:1.760000,
out2.ts
#EXTINF:1.040000,
out3.ts
#EXTINF:1.560000,
out4.ts
```

```
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=1280000,AVERAGE-BANDWIDTH=1000000
http://example.com/low.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2560000,AVERAGE-BANDWIDTH=2000000
http://example.com/mid.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=7680000,AVERAGE-BANDWIDTH=6000000
http://example.com/hi.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=65000,CODECS="mp4a.40.5"
http://example.com/audio-only.m3u8
```

FFmpeg转HLS参数

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjznjp6zlrj312q0s6wuc.jpg" alt="image-20201023224825072" style="zoom:50%;" />

FFmpeg转HLS实例

* 常规文件转HLS直播：``ffmpeg -re -i input.mp4 -c copy -f hls -bsf:v h264_mp4toannexb output.m3u8``
  * 将MP4中的H.264数据转换为H.264AnnexB标准的编码，后者常见于实时传输流中，若源文件为FLV、TS等可以作为直播传输流的视频，则不需要这个参数

## 视频文件切片

* 视频文件切片与HLS基本类似，但是HLS切片在标准中只支持TS格式的切片，并且是直播与点播切片，既可以使用segment方式进行切片，也可以使用ss加上t参数进行切片。（参数见书）

#### segment举例

* segment_format指定切片文件的格式：
  * ``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 test_output-%d.mp4``
* segment_list和segment_list_type指定切片索引列表：
  * 生成ffconcat格式的索引文件（常见于虚拟轮播场景）：
    * ``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 -segment_list_type ffconcat -segment_list output.lst test_output-%d.mp4``
  * 生成FLAT格式索引文件(txt格式则只有文件名)
    * ``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 -segment_list_type flat -segment_list filelist.txt test_output-%d.mp4``
  * 生成csv格式索引文件（csv文件有三列，第一列是文件名，第二/三列是文件起始/结束时间)
    * ``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 -segment_list_type csv -segment_list filelist.csv test_output-%d.mp4``
  * 生成m3u8格式索引文件
    * ``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 -segment_list_type m3u8 -segment_list output.m3u8 test_output-%d.mp4``
* reset_timestamps使切片时间戳归0
  * 使每一个切片的时间戳从0开始：``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 -reset_timestamps 1 test_output-%d.mp4``

* segment_times按照时间点剪切(第3，9，12秒)
  * ``ffmpeg -re -i input.mp4 -c copy -f segment -segment_format mp4 -segment_times 3,9,12 test_output-%d.mp4``

#### ss与t参数举例

* ss指定剪切开头部分：(用于定位切片的起始时间点)
  * ``ffmpeg -ss 10 -i input.mp4 -c copy output.ts``

* t指定视频总长度：(用于指定截取数据的长度)
  * ``ffmpeg -i input.mp4 -c copy -t 10 output.ts``

* 使用output_ts_offset指定输出start_time：（当不希望时间戳归零，则可以使用此参数）
  * ``ffmpeg -i input.mp4 -c copy -t 10 -output_ts_offset 120 output.mp4``

## 音视频文件音视频流抽取

* 抽取AAC音频流 ``ffmpeg -i input.mp4 -vn -acodec copy output.aac``

* 抽取H.264视频流 ``ffmpeg -i input.mp4 -vcodec copy -an output.h264``

* 抽取H.265视频流 ``ffmpeg -i input.mp4 -vcode copy -an -bsf hevc_mp4toannexb -f hevc output.hevc``（视频存储格式转换为annexb，可以直接使用播放器进行观看）

## 系统资源使用情况

* 使用top命令查看CPU的使用率
* 封装转换主要以音视频数据读写为主，不涉及复杂计算，CPU使用率较低
* 编码转换涉及大量运算，CPU使用率较高

