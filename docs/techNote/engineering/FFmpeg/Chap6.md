# Chap6 FFmpeg 滤镜使用

## FFmpeg滤镜Filter描述格式

#### Filter的参数排列方式

* [输入流or标记名]滤镜参数[临时标记名];[输入流or标记名]滤镜参数[临时标记名]...

* 举例：logo缩放到176*144并放在视频左上角
  * ``ffmpeg -i input.mp4 -i logo.png -filter_complex "[1:v]scale=176:144[logo];[0:v][logo]overlay=x=0:y=0" output.mp4``

#### Filter时间内置变量

* ![image-20201027150404269](https://tva1.sinaimg.cn/large/0081Kckwly1gk3wltl80rj30va09uwhk.jpg)

## FFmpeg为视频加水印

#### 文字水印

* 在视频中增加文字水印需要有字库处理的相关文件，且编译时需要支持FreeType、FontConfig、iconv，系统需要有相关字库，在FFmpeg中增加纯字母水印可以使用drawtext滤镜进行支持

*  ![image-20201027150614801](https://tva1.sinaimg.cn/large/0081Kckwly1gk3wo1qqrbj30zy0kqdlx.jpg)

* drawtext滤镜使用举例

  * 命令：``ffmpeg -i input.mp4 -vf "drawtext=fontsize=100:fontfile=FreeSeriif.ttf:text='hello world':x=20:y=20:fontcolor=green:box=1:boxcolor=yellow:enable=lt(mod(t\,3)\,1)" output.mp4``

  * 效果：（每三秒闪一下文字水印）

    ![image-20201027151014061](https://tva1.sinaimg.cn/large/0081Kckwly1gk3ws75eb4j312u0ncnoc.jpg)

#### 图片水印

* 水印图片最好是透明背景的

* ``ffmpeg -input.mp4 -vf "movie=logo.png[wm]; [in][wm]overlay=30:10[out]" output.mp4``

## FFmpeg生成画中画

* FFmpeg可以通过overlay将多个视频流、多个多媒体采集设备、多个视频文件合并到一个界面中，生成画中画的效果。overlay滤镜的基本参数如下：
* ![image-20201027153135730](https://tva1.sinaimg.cn/large/0081Kckwly1gk3xeg8rmqj30ym0mg0z5.jpg)
* 样例：
  * 将sub.mp4视频缩放成480x320，并显示在input.mp4左上角：
    * ``ffmpeg -re -i input.mp4 -vf "movie=sub.mp4,scale=480x320[test]; [in][test] overlay [out]" -vcodec libx264 output.flv``
  * 将sub.mp4视频缩放成480x320，并显示在input.mp4右下角：
    * ``ffmpeg -re -i input.mp4 -vf "movie=sub.mp4,scale=480x320[test]; [in][test] overlay=x=main_w-480:y=main_h-320 [out]" -vcodec libx264 output.flv``

## FFmpeg视频多宫格处理

* 样例：通过nullsrc创建一个overlay画布，画布的大小为宽640像素、高480像素，使用变量将输入的4个视频流去除，分别进行缩放处理，处理为宽320、高240的视频，然后基于nullsrc生成的画布进行视频平铺（input若改为rtmp则为直播流）

* 命令：``ffmpeg -re -i input1.mp4 -re -i input2.mp4 -re -i input3.m2t -re -i input4.mp4 -filter_complex "nullsrc=size=640*480 [base]; [0:v] setpts=PTS-STARTPTS, scale=320x240 [upperleft]; [1:v] setpts=PTS-STARTPTS, scale=320x240 [upperright]; [2:v] setpts=PTS-STARTPTS, scale=320x240 [lowerleft]; [3:v] setpts=PTS-STARTPTS, scale=320x240 [lowerright]; [base][upperleft] overlay=shortest=1 [tmp1]; [tmp1][upperright] overlay=shortest=1:x=320 [tmp2]; [tmp2][lowerleft] overlay=shortest=1:y=240 [tmp3]; [tmp3][lowerright] overlay=shortest=1:x=320:y=240" -c:v libx264 output.flv``

* 效果：

  <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3xwkn9e0j30jq0iu41k.jpg" alt="image-20201027154902406" style="zoom:25%;" /><img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3xwuxoxlj31200eo0wc.jpg" alt="image-20201027154918586" style="zoom: 33%;" /><img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3xxzhaqqj31210u0hdt.jpg" alt="image-20201027155023280" style="zoom:50%;" />

## FFmpeg音频流滤镜操作

#### 双声道合并单声道

* <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3yn86sf9j30le0scgps.jpg" alt="image-20201027161439290" style="zoom:25%;" />

* ``ffmpeg -i input.aac -ac 1 output.aac``

#### 双声道提取

* 将布局格式为stereo的``input.aac``转换为两个mono布局的``left.aac``与``right.aac``
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3ymhwty9j30rs0saq8b.jpg" alt="image-20201027161357818" style="zoom:25%;" />
  * ``ffmpeg -i input.aac -map_channel 0.0.0 left.aac -map_channel 0.0.1 right.aac``

#### 双声道转双音频流

* 将双声道音频提取出转为一个音频文件两个音频流（一个流一个声道，但大多数播放器在默认情况下会播放第一个stream但不会播放第二个）
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3ym4366cj30ui0sm441.jpg" alt="image-20201027161334912" style="zoom:25%;" />
  * ``ffmpeg -i input.aac -filter_complex channelsplit=channel_layout=stereo output.mka``

#### 单声道转双声道

* 将布局为mono的音频转换为stereo布局（单声道文件转多声道质量不会变好！）
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3yllqllij30ls0rwdk1.jpg" alt="image-20201027161305648" style="zoom:25%;" />
  * ``ffmpeg -i left.aac -ac 2 output.m4a``

#### 两个音频源合并双声道

* 将两个布局为mono的音频源合并为一个布局为stereo双声道的音频流
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3yl61t7lj30qw0rwafe.jpg" alt="image-20201027161241125" style="zoom:25%;" />
  * ``ffmpeg -i left.aac -i right.aac -filter_complex "[0:a][1:a]amerge=inputs=2[aout]" -map "[aout]" output.mka``

#### 多音频合并为多声道

* 将6个mono布局的音频流合并为一个多声道（5.1）的音频流
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3yphrmbqj31100hyn4u.jpg" alt="image-20201027161649747" style="zoom:25%;" />
  * ``ffmpeg -i front_left.wav -i front_right.wav -i front_center.wav -i lfe.wav -i back_left.wav -i back_right.wav -filter_complex "[0:a][1:a][2:a][3:a][4:a][5:a]amerge=inputs=6[aout]" -map "[aout]" output.wav``

## FFmpeg音频音量探测

* 音频音量可用于绘制音频波形，可作为过滤音频文件的依据

#### 音频音量获取

* ``ffmpeg -i output.wav -filter_complex volumedetect -c:v copy -f null /dev/null``

#### 绘制音频波形

* 生成音频波形图片
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3z1072ehj312o0ak79s.jpg" alt="image-20201027162753640" style="zoom:50%;" />
  * ``ffmpeg -i output.wav -filter_complex "showwavespic=s=640x120" -frames:v 1 output.png``
* 分声道波形
  * <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk3z18vhp0j312s0e4tsg.jpg" alt="image-20201027162807810" style="zoom:50%;" />
  * ``ffmpeg -i output.wav -filter_complex "showwavespic=s=640x240:split_channels=1" -frames:v 1 output.png``

## FFmpeg为视频加字幕

#### ASS字幕流写入视频流

* ``ffmpeg -i input.mp4 -vf ass=t1.ass -f mp4 output.mp4``

#### ASS字幕流写入封装容器

* 不改变编码下封装进output.mkv（视频流、音频流、字幕流）
  * ``ffmpeg -i input.mp4 -i t1.ass -acodec copy -vcodec copy -scodec copy output.mkv``
* 若原视频流已经有字幕且想替换时(第1个文件的stream0和stream1以及第2个文件的stream0写入新文件)
  * ``ffmpeg -i input.mp4 -i t1.ass -map 0:0 -map 0:1 -map 1:0 -acodec copy -vcodec copy -scodec copy output.mkv``

## FFmpeg视频抠图合并

* chromakey滤镜主要处理YUV数据，一般做绿幕处理更有优势，而colorkey处理纯色均可以，它以处理RGB数据为主
* 一个原视频input.mp4，一个为绿色背景的视频input_green.mp4，从后者中将人抠出来放到前者的背景下
  * ``ffmpeg -i input.mp4 -i input_green.mp4 -filter_complex "[1:v]chromakey=Green:0.1:0.2[ckout];[0:v][ckout]overlay[out]" -map "[out]" output.mp4``

## FFmpeg3D视频处理

#### stereo3d处理3D视频

![image-20201027181234299](https://tva1.sinaimg.cn/large/0081Kckwly1gk421wnqucj31280sk7f4.jpg)

![image-20201027181249796](https://tva1.sinaimg.cn/large/0081Kckwly1gk4226jk4ij311j0u0gzt.jpg)

#### 3D图像转换举例

* ``ffplay -vf "stereo3d=sbsl:aybd" input.mp4``

## FFmpeg定时视频截图

#### vframe参数截取一张图片

* ``ffmpeg -i input.flv -ss 00:00:7.435 -vframes 1 out.png``

#### fps滤镜定时获得图片

* 隔1秒生成一张PNG图片：``ffmpeg -i input.flv -vf fps=1 out%d.png``
* 隔1分钟生成一张JPEG图片：``ffmpeg -i input.flv =vf fps=1/60 img%03d.jpg``
* 隔10分钟生成一张BMP图片：``ffmpeg -i input.flv -vf fps=1/600 thumb%04d.bmp``
* 按关键帧截取图片：``ffmpeg -i input.flv -vf "select='eq(pict_type, PICT_TYPE_I)'" -vsync vfr thumb%04d.png``

## FFmpeg生成测试元数据

* FFmpeg不但可以处理音视频文件，还可以通过lavfi设备虚拟音视频源数据

#### FFmpeg生成音频测试流

* 根据abuffer中定义的采样率、格式、声道布局来生成音频
  * ``ffmpeg -re -f lavfi -i abuffer=sample_rate=44100:sample_fmt=s16p:channel_layout=stereo -acodec aac -y output.aac``
* 使用aevalsrc生成双通道音频
  * ``ffmpeg -re -f lavfi "aevalsrc=sin(420*2*PI*t)|cos(430*2*PI*t):c=FC|BC" -acodec aac output.aac``

#### FFmpeg生成视频测试流

* 根据testsrc生成长度为5.4秒，图像大小为QCIF分辨率、帧率为25fps的视频图像数据，并编码成为H.264
  * ``ffmpeg -re -f lavfi -i testsrc=duration=5.3:size=qcif:rate=25 -vcodec libx264 -r:v 25 output.mp4``
* 根据testsrc2生成一个视频图像内容，参数一致
  * ``ffmpeg -re -f lavfi -i testsrc2=duration=5.3:size=qcif:rate=25 -vcodec libx264 -r:v 25 output.mp4``
* 使用color作为视频源，图像纯红
  * ``ffmpeg -re -f lavfi -i color=c=red@0.2:s=qcif:r=25 -vcodec libx264 -r:v 25 output.mp4``
* 使用nullsrc作为视频源，数据为随机雪花
  * ``ffmpeg -re -f lavfi -i "nullsrc=s=256x256, geq=random(1)*255:128:128" -vcodec libx264 -r:v 25 output.mp4``

<img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk435g47j8j30ec0oq0za.jpg" alt="image-20201027185034200" style="width:50%;" /><img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk435pw8owj30fy0v8alp.jpg" alt="image-20201027185049905" style="width:50%;" />

## FFmpeg对音视频倍速处理

* 倍速处理（2倍速播放、4倍速播放）是常见的音视频处理模式，包括跳帧播放（体验稍差）和不跳帧播放两种，FFmpeg均支持

#### atempo音频倍速处理

* 唯一参数tempo取值范围从0.5到2
  * 半速播放：``ffmpeg -i input.wav -filter_complex "atempo=tempo=0.5" -acodec aac output.aac``

#### setpts视频倍速处理

* <img src="https://tva1.sinaimg.cn/large/0081Kckwly1gk4629ebw6j30vs08u0vh.jpg" alt="image-20201027203118312" style="zoom:50%;" />

* 唯一参数expr
  * 半速播放：``ffmpeg -re -i input.mp4 -filter_complex "setpts=PTS*2" output.mp4``
  * 两倍速播放：``ffmpeg -i input.mp4 -filter_complex "setpts=PTS/2" output.mp4``

