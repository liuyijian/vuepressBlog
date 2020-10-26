# Chap4 FFmpeg转码

## FFmpeg软编码H.264和H.265

* 支持H.264编码的封装格式有很多，包括FLV、MP4、HLS、MKV、TS等格式
* FFmpeg自身不支持H.264编码，而是由三方模块进行支持，如x264，OpenH264，前者具有先发优势仍是主流
* 使用x264进行编码时，支持的像素格式主要包含yuv420p、yuvj420p、yuv422p、yuvj422p、yuv444p、yuvj444p、nv12、nv16、nv21等等，通过 ``ffmpeg -h encoder=libx264``可以查看到
* h.264编码与h.265编码类似，下面只介绍h.264方式的案例

#### x264编码参数简介

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk2p6pyt46j30v20u0arj.jpg" alt="image-20201026140147998" style="zoom:50%;" />

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk2p718bvrj313e0ecq8y.jpg" alt="image-20201026140204055" style="zoom:50%;" />

#### x264编码举例

* 预设参数preset
  * 参数选项：ultrafast、superfast、veryfast、faster、fast、medium、slow、slower、veryslow、placebo(编码快则图像质量低)
  * 使用案例：``ffmpeg -i input.mp4 -vcodec libx264 -preset ultrafast -b:v 2000k output.mp4``

* 优化参数tune
  * 参数选项：film、animation、grain、stillimage、psnv、ssim、fastdecode、zerolatency
  * 使用案例：只使用tune参数的zerolatency能降低H.264直播编码推流的延迟

* profile（档次）与level（等级）设置
  * ![image-20201026142537741](https://tva1.sinaimg.cn/large/0081Kckwly1gk2pvh9s4aj30wq0u04pr.jpg)
  * ![image-20201026142624094](https://tva1.sinaimg.cn/large/0081Kckwly1gk2pw9tq47j30u00wrkfl.jpg)
  * ![image-20201026142644841](https://tva1.sinaimg.cn/large/0081Kckwly1gk2pwmxg53j30y10u07kh.jpg)
  * 进行实时流媒体直播时，采用baseline编码（无B帧）相对main或high的profile会更可靠，但适当地加入B帧能够有效地降低码率，应根据需要与具体的业务场景进行选择 [视频中的I、P、B帧](https://blog.csdn.net/qq_37053885/article/details/83539352)

* 控制场景切换关键帧插入参数sc_threshold
* 设置x264内部参数x264opts
* CBR恒定码率设置参数nal-hrd

## FFmpeg硬编解码

* 当使用FFmpeg进行软编码时，常见的基于CPU进行H.264或H.265编码其相对成本会比较高，CPU编码时的性能也很低，所以出于编码效率及成本考虑，很多时候都会考虑采用硬编码，常见的硬编码包含Nvidia GPU与Intel QSV两种，还有常见的嵌入式平台，如树莓派、瑞芯微等，本节将重点介绍常见的Nvidia、Intel、树莓派、OSX的硬编码。但关于硬件相关环境的搭建操作可以在官网找到，此处不讲。
* hwaccel :hardware acceleration ???

#### Nvidia GPU硬编解码

* Nvidia在图像处理技术方面非常强悍，FFmpeg继承Nvidia显卡视频处理模块后，能快速编解码，使用h264_nvenc进行编码（yuv420p、nv12、p0101e、yuv444p、yuv444p16le、bgr0、rgb0、cuda），使用h264_cuvid进行解码（cuda、nv12）, 转换前最好先查看支持的像素格式（括号内就是了）

![image-20201026153800990](https://tva1.sinaimg.cn/large/0081Kckwly1gk2ryse7phj31190u04b1.jpg)

* 命令：``ffmpeg -hwaccel cuvid -vcodec h264_cuvid -i input.mp4 -vf scale_npp=1920:1080 -vcodec h264_nvenc -acodec copy -f mp4 -y output.mp4``

#### Intel QSV硬编码

* FFmpeg通过``--enable-libmfx``编译开启对Intel QSV的支持，下面看H.264和H.265的参数相关支持与操作

![image-20201026155206079](https://tva1.sinaimg.cn/large/0081Kckwly1gk2sdg83ecj30u00uyasc.jpg)

![image-20201026155602913](https://tva1.sinaimg.cn/large/0081Kckwly1gk2shjydv1j311s09madl.jpg)

* h264_qsv只支持nv12和qsv的像素格式，所以在使用yuv420p时需要将其转换成nv12才可以，FFmpeg能自动进行该操作的转换
* h264命令示例：``ffmpeg -i input.MP4 -pix_fmt nv12 -vcodec h264_qsv -an -y output.mp4``
* h265命令示例：``ffmpeg -hide_banner -y -hwaccel qsv -i 10M1080P.mp4 -an -c:v hevc_qsv -load_plugin hevc_hw -b:v 5M -maxrate 5M out.mp4``

#### 树莓派硬编码

* 树莓派常应用于边缘智能计算场景，FFmpeg支持树莓派的H.264编码采用的是OpenMAX框架，在编译ffmpeg前配置编译时，需要使用``--enable-omx-pi``支持，h264_omx编码参数如下，omx_libname和omx_libprefix均是运行ffmpeg时加载omx所使用的参数，zerocopy则用于提升编码时的性能（怎么用？？？）

![image-20201026152506453](https://tva1.sinaimg.cn/large/0081Kckwly1gk2rld09izj311s074jtj.jpg)

* 使用h264_omx和libx264在树莓派上编码效率方面，前者的速度是后者的7倍（书中结论，1.35x vs 0.198x，具体要进一步测试）
* 软编码效率低下，长此以往，CPU升温，效率会越来越低

#### OS X 系统硬编解码

* 在苹果电脑的OS X系统下，通常硬编码采用h264_videotoolbox、硬解码采用h264_vda为最快捷、最节省CPU资源的方式
* h264_videotoolbox的码率控制情况并不完美，因为h264_videotoolbox做硬编码时目前仅支持VBR/ABR模式，而不支持CBR模式
* OS X 硬编解码参数
  * ![image-20201026144351550](https://tva1.sinaimg.cn/large/0081Kckwly1gk2qefva4cj312k0a6794.jpg)

* OS X 硬编解码使用示例
  * 描述：先用h264_vda对input.mp4视频进行解码，然后使用h264_videotoolbox进行编码，输出码率为2MB/s的文件
  * 代码：``ffmpeg -vcodec h264_vda -i input.mp4 vcodec h264_videotoolbox -b:v 2000k output.mp4``

## FFmpeg输出MP3

* FFmpeg可以解码MP3，也可以使用第三方库libmp3lame编码MP3格式，支持多种采样率和采样格式，声道布局支持单声道和环绕立体声模式

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk309yfmeqj312c0g0dlm.jpg" alt="image-20201026202532489" style="zoom:50%;" />

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk312swd5dj31260j643y.jpg" alt="image-20201026205315764" style="zoom:50%;" />

* 控制编码质量：``ffmpeg -i input.mp3 -acodec libmp3lame -q:a 8 output.mp3``
* 控制码率CBR：``ffmpeg -i input.mp3 -acodec libmp3lame -b:a 64k output.mp3``
* 使用平均码率ABR，编码速度比VBR高，但质量略低于VBR、略高于CBR：``ffmpeg -i input.mp3 -acodec libmp3lame -b:a 64k -abr 1 output.mp3``

## FFmpeg输出AAC

* AAC是常见音频编码格式，见于RTMP、HLS、RTSP、FLV、MP4等文件中，与MP3相比，编码效率更高，音质更好，常见文件存储形式为m4a
* FFmpeg支持AAC的三种编码器：aac（自带）、libfaac（新版本已移除）、libfdk_aac（质量最高的三方库）

* 样例：``ffmpeg -i input.wav -c:a aac -q:a 2 output.m4a``
  * ``-q``	参数范围是0.1～2.0

* 使用libfdk_aac三方编码器

  * 恒定码率（CBR）模式
    * 可以根据音频设置的经验设置码率，双声道*2，立体声\*6
    * ``ffmpeg -i input.wav -c:a libfdk_aac -b:a 128k output.m4a``
    * ``ffmpeg -i input.mp4 -c:v copy -c:a libfdk_aac -b:a 384k output.mp4``
  * 动态码率（VBR）模式
    * 可以设置5个级别，第二列是每通道编码后的码率<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk325ishdbj31160oetgm.jpg" alt="image-20201026213028355" style="zoom:50%;" />
    * ``ffmpeg -i input.wav -c:a libfdk_aac -vbr 3 output.m4a``

* 高质量AAC设置

  * HE-AAC：用编码参数 ``-profile:a aac_he``

  * HEv2-AAC：用编码参数``-profile:a aac_he_v2``