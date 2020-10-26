# Chap2 FFmpeg工具使用基础

FFmpeg中常用工具主要是ffmpeg（编解码工具）、ffprobe（内容分析工具）、ffplay（播放器），介绍如下。

## ffmpeg常用命令

#### 简介

* 使用 ``ffmpeg -h`` 命令可看到ffmpeg常见的命令主要分为6个部分：信息查询、公共操作参数、文件主要操作参数、视频操作参数、音频操作参数、字幕操作参数，若希望获得全部帮助信息，可以通过使用``ffmpeg --help long`` 及 ``ffmpeg --help full``命令查看。

#### 信息查询

##### 通用信息

* 使用``ffmpeg -version`` 查看ffmpeg及其各个子模块的详细版本信息

* 使用``ffmpeg -formats`` 查看是否支持对应的视频文件格式，输出三列
  * 第一列是多媒体封装格式Demuxing和Muxing支持（用字母D、E指示）
  * 第二列是多媒体文件格式
  * 第三列是文件格式的详细说明
* 使用``ffmpeg -codecs`` 查看是否支持对应的编解码方式，输出三列
  * 第一列有六个字段
    * 第一个字段用于表示此编码器是音频、视频还是字幕
    * 第二个字段表示帧级别的多线程支持
    * 第三个字段表示分片级别的多线程
    * 第四个字段表示编码为实验版本
    * 第五个字段表示draw horiz band支持
    * 第六个字段表示直接渲染模式支持
  * 第二列是编码格式
  * 第三列是编码格式的详细说明
* 使用``ffmpeg -filters`` 查看滤镜支持，输出四列
  * 第一列有三个字段
    * 第一个字段是时间轴支持
    * 第二个字段是分片线程处理支持
    * 第三个字段是命令支持
  * 第二列是滤镜名
  * 第三列是转换方式
  * 第四列是滤镜作用说明

##### 特定信息

* 特定muxer
  * 命令：``ffmpeg -h muxer=flv``
  * 输出：
    * 第一部分为FLV封装的默认配置描述，如扩展名、MIME类型、默认的视频编码格式、默认的音频编码格式
    * 第二部分为FLV封装时可以支持的配置参数及相关说明
* 特定demuxer
  * 命令：``ffmpeg -h demuxer=flv``
  * 输出：
    * 第一部分为FLV解封装默认的扩展文件名
    * 第二部分为FLV解封装设置的参数及相关说明
* 特定encoder
  * 命令：``ffmpeg -h encoder=h264``
  * 输出：
    * 第一部分为H.264所支持的基本编码方式、支持的多线程编码方式（例如帧级别多线程编码或Slice级别多线程编码）、编码器所支持的像素的色彩格式
    * 第二部分为H.264编码的具体配置参数及相关说明
* 特定decoder
  * 命令：``ffmpeg -h decoder=h264``
  * 输出：
    * 第一部分为解码H.264时可以采用的常规支持、多线程方式支持（帧级别多线程解码或Slice级别多线程解码）
    * 第二部分为解码H.264时可以采用的解码参数及相关说明
* 特定filter
  * 命令：``ffmpeg -h filter=colorkey``
  * 输出：
    * 第一部分为colorkey所支持的色彩格式信息，colorkey所支持的多线程处理方式，输入或输出支持
    * 第二部分为colorkey所支持的参数及说明

#### 封装转换

* ffmpeg的封装转换功能包含在AVFormat模块中，通过libavformat库进行Mux和Demux操作

#### 转码参数

* ffmpeg的编解码功能包含在AVCodec模块中，通过libavcodec库进行Encode和Decode操作

#### 转码原理

##### 案例

* 命令：``ffmpeg -i input.MOV -vcodec libx265 -an output.mp4``

* 命令行输出的信息：

  * 原视频信息

    ![image-20201023161900414](https://tva1.sinaimg.cn/large/0081Kckwly1gjzcajzzarj31uk0pwak1.jpg)

  * 新视频信息

    ![image-20201023162120024](https://tva1.sinaimg.cn/large/0081Kckwly1gjzccy0tsmj31i60mmthv.jpg)

  * 信息解读：

    * 封装格式从MOV变为MP4
    * 视频编码从h264变为h265，音频编码原来为pcm_s16le
    * 视频码率从8284kb/s变为1379.6kb/s
    * 视频帧率从23.62fps变为29.97fps
    * 转码后的文件中不包括音频（-an参数）

## ffprobe

* 查看多媒体数据包信息 ``ffprobe -show_packets input.MOV``
* 查看多媒体数据包中的具体数据 ``ffprobe -show_data -show_packets input.MOV``
* 查看多媒体的封装格式 ``ffprobe -show_format input.MOV``
* 查看视频文件中的帧信息 ``ffprobe -show_frames input.MOV``
* 查看多媒体文件中的流信息 ``ffprobe -show_streams input.MOV``
* 使用``-of <format>``参数指定输出格式为xml、ini、json、csv、flat等
* 下面是packet、format、frame、stream字段的说明

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjze9vd32uj312s0hcgs9.jpg" alt="image-20201023172734528" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzealej2mj312y0ewn1z.jpg" alt="image-20201023172817039" style="width:50%;" />

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzeazxxm5j312e0qqai0.jpg" alt="image-20201023172840158" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzebeci8qj312g0o0qa0.jpg" alt="image-20201023172903373" style="width:50%;" />

​	         

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzebyxj6hj31260bw0w4.jpg" alt="image-20201023172936172" style="width:50%;" />

## ffplay

* ffplay不仅仅是播放器，同时也是测试ffmpeg的codec引擎、format引擎、filter引擎的工具，且还可以进行可视化的媒体参数分析，可通过``ffplay -h`` 进行查看

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzeefhvagj31260nyn53.jpg" alt="image-20201023173157854" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/0081Kckwly1gjzejkzau6j312a0r0wpy.jpg" alt="image-20201023173654895" style="width:50%;" />

#### 案例

* 从视频的第30秒开始播放，播放10秒钟的文件：``ffplay -ss 30 -t 10 output.mp4``
* 窗口自定义标题播放网络直播流：``ffplay -window_title "test" rtmp://up.v.test.com/live/stream``
* 视频流中出现多个项目时，需要手动指定：``ffplay -vst 4 -ast 5 input.ts``
* 通过filter加载字幕文件：``ffplay -vf "subtitles=input.rst" output.mp4``

* 播放音频时显示音频波形：``ffplay -showmode 1 output.mp3``