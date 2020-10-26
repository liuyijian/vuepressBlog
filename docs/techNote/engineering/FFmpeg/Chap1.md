# Chap1 FFmpeg简介

## FFmpeg的定义

* [FFmpeg](https://ffmpeg.org)作为一组音视频编解码开发套件，提供了多种媒体格式的封装和解封装，包括多种音视频编码、多种协议的流媒体、多种色彩格式转换、多种采样率转换、多种码率转换等。FFmpeg是在LGPL/GPL协议下开源发布的，时至今天，它已被许多开源项目采用，如VLC、MPlayer、Google Chrome等。

## FFmpeg的基本组成

| 模块       | 功能                                                         |
| ---------- | ------------------------------------------------------------ |
| AVFormat   | 封装模块：实现多种媒体格式的封装和解封装，如MP4、FLV、KV、TS等文件格式，RTMP、RTSP、MMS、HLS等网络协议格式。在编译安装时，可根据实际需求，增加自定义的封装处理模块 |
| AVCodec    | 编解码模块：实现多种媒体的编解码格式，如MPEG4、AAC、MJPEG等自带的编解码器，H.264(AVC)、H.265(HEVC)、MP3等三方的编解码器。在编译安装时，可根据实际需求，增加自定义的编解码模块 |
| AVFilter   | 滤镜模块：提供通用的音频、视频、字幕等滤镜处理框架，支持多个输入和多个输出 |
| swscale    | 视频图像转换计算模块：允许进行图像缩放（1080p、720p、480p）和像素格式（YUV、RGB）转换 |
| swresample | 音频重采样模块：允许操作音频采样、音频通道布局转换与布局调整 |

## FFmpeg的编解码工具ffmpeg

#### 案例：视频格式转换

* 命令：``ffmpeg -i input.mp4 output.avi``

* 步骤：
  * 1、读取输入源
  * 2、进行音视频的解封装（Demuxing）
  * 3、解码每一帧的音视频数据（Decoding）
  * 4、编码每一帧的音视频数据（Encoding）
  * 5、进行音视频的重新封装（Muxing）
  * 6、输出到目标

## FFmpeg的播放器ffplay

## FFmpeg的多媒体分析器 ffprobe

#### 案例：分析媒体文件

* 命令： ``ffprobe -show_streams output.mp4``

* 输出：每个包的长度、包的类型、帧的信息等等，通过标签\[STREAM]...[/STREAM]进行多流分隔（如视频流和音频流），分隔后采用index进行流索引信息区分

## FFmpeg编译

* FFmpeg官网种提供编译好的可执行文件，官方建议用户自行编译最新版本，原因如下
  * 1、操作系统（Linux）提供的软件库（Ubuntu的apt，CentOS的yum）安装的版本相对较旧
  * 2、方便日后根据自身需求进行功能剪裁

#### FFmpeg在Windows上编译

略

#### FFmpeg在Linux上编译

略

#### FFmpeg在OS X上编译

``brew install ffmpeg`` 

``brew info ffmpeg``

## FFmpeg编码支持与定制

* 查看编解码器格式支持：``ffmpeg -decoders`` ``ffmpeg -encoders`` 
* 查看封装解封装格式支持：``ffmpeg -muxers`` ``ffmpeg -demuxers``

* 查看通信协议支持：``ffmpeg -protocols``

