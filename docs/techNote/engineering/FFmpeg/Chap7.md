# Chap7 FFmpeg采集设备

## FFmpeg中Linux设备操作

#### Linux下查看设备列表

* 查看系统当前支持的设备：``ffmpeg -hide_banner -devices``

* 样例：![image-20201028125717729](https://tva1.sinaimg.cn/large/0081Kckwly1gk4yk6d02lj30oe0a0tb5.jpg)
* 系统支持设备（图）：
  * 输入设备：dv1934、fbdev、lavfi、oss、v4l2、x11grab
  * 输出设备：fbdev、sdl、v4l2

#### Linux采集设备fbdev

* 略

#### Linux采集设备v4l2

* Linux下常见的视频设备有video4linux2，缩写为v4l2，尤其是用于摄像头设备，其参数如下，支持设置帧率、时间戳、输入分辨率、视频帧大小等
* ![image-20201028130435337](https://tva1.sinaimg.cn/large/0081Kckwly1gk4ysrywk5j30xy0hktg0.jpg)

* 查看设备格式支持：``ffmpeg -hide_banner -f v4l2 -list_formats all -i /dev/video0``
* 采集视频文件：``ffmpeg -hide_banner -s 1920x1080 -i /dev/video output.avi``

#### Linux采集设备x11grab

* 使用FFmpeg采集Linux下面的图形部分桌面图像时，通常采用x11grab设备，参数如下，支持绘制鼠标光标，跟踪鼠标 轨迹，指定采集桌面区域，设置采集视频的分辨率等
* ![image-20201028131203308](https://tva1.sinaimg.cn/large/0081Kckwly1gk4yzkw3mpj31200bgwj2.jpg)
* 桌面录制：``ffmpeg -f x11grab -framerate 25 -video_size 1366x768 -i :0.0 out.mp4``
* 桌面录制指定起始位置：``ffmpeg -f x11grab -framerate 25 -video_size 352x288 -i :0.0+300,200 out.mp4``
* 桌面录制带鼠标记录的视频：``ffmpeg -f x11grab -video_size 1366x768 -follow_mouse 1 -i :0.0 out.mp4``

## FFmpeg中OS X设备操作

* 在FFmpeg中采集OS X系统的输入输出设备，常规方式采用的是OS X的avfoundation设备进行采集，参数如下，主要涉及枚举设备、音视频设备编号、像素格式、帧率、分辨率等等

* ![image-20201028131836791](https://tva1.sinaimg.cn/large/0081Kckwly1gk4z6d2i47j311k0iatf3.jpg)

* 查看avfoundation支持的输入设备（实测卡死？）

  * 命令：``ffmpeg -f avfoundation -list_devices true -i ""``

  * 效果：

    ```
    [AVFoundation input device @ 0x7f96a0500460] AVFoundation video devices:
    [AVFoundation input device @ 0x7f96a0500460] [0] FaceTime HD Camera (Built-in)
    [AVFoundation input device @ 0x7f96a0500460] [1] Capture screen 0
    [AVFoundation input device @ 0x7f96a0500460] AVFoundation audio devices:
    [AVFoundation input device @ 0x7f96a0500460] [0] Built-in Microphone
    ```

* 采集内置摄像头

  * ``ffmpeg -f avfoundation -i "FaceTime HD Camera (Built-in)" out.mp4``

* 采集OS X桌面

  * ``ffmpeg -f avfoundation -i "Capture screen 0" -r:v 30 out.mp4``

* 采集麦克风

  * 参数0:0 分别代表第0个视频设备和第0个音频设备
  * ``ffmpeg -f avfoundation -i "0:0" out.aac``

  * 使用设备索引参数指定设备采集
  * ``ffmpeg -f avfoundation -video_device_index 0 -audio_device_index 0 out.aac``

## FFmpeg中Windows设备操作

* Windows采集设备的主要方式是dshow、vfwcap、gdigrab，其中dshow可以用来抓取摄像头、采集卡、麦克风等，vfwcap主要用来采集摄像头类设备，gdigrab则是抓取Windows窗口程序。

* 具体看书～