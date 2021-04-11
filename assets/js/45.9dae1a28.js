(window.webpackJsonp=window.webpackJsonp||[]).push([[45],{473:function(a,t,v){"use strict";v.r(t);var e=v(15),i=Object(e.a)({},(function(){var a=this,t=a.$createElement,v=a._self._c||t;return v("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[v("h1",{attrs:{id:"chap4-ffmpeg转码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#chap4-ffmpeg转码"}},[a._v("#")]),a._v(" Chap4 FFmpeg转码")]),a._v(" "),v("h2",{attrs:{id:"ffmpeg软编码h-264和h-265"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ffmpeg软编码h-264和h-265"}},[a._v("#")]),a._v(" FFmpeg软编码H.264和H.265")]),a._v(" "),v("ul",[v("li",[a._v("支持H.264编码的封装格式有很多，包括FLV、MP4、HLS、MKV、TS等格式")]),a._v(" "),v("li",[a._v("FFmpeg自身不支持H.264编码，而是由三方模块进行支持，如x264，OpenH264，前者具有先发优势仍是主流")]),a._v(" "),v("li",[a._v("使用x264进行编码时，支持的像素格式主要包含yuv420p、yuvj420p、yuv422p、yuvj422p、yuv444p、yuvj444p、nv12、nv16、nv21等等，通过 "),v("code",[a._v("ffmpeg -h encoder=libx264")]),a._v("可以查看到")]),a._v(" "),v("li",[a._v("h.264编码与h.265编码类似，下面只介绍h.264方式的案例")])]),a._v(" "),v("h4",{attrs:{id:"x264编码参数简介"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#x264编码参数简介"}},[a._v("#")]),a._v(" x264编码参数简介")]),a._v(" "),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2p6pyt46j30v20u0arj.jpg",alt:"image-20201026140147998"}}),a._v(" "),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2p718bvrj313e0ecq8y.jpg",alt:"image-20201026140204055"}}),a._v(" "),v("h4",{attrs:{id:"x264编码举例"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#x264编码举例"}},[a._v("#")]),a._v(" x264编码举例")]),a._v(" "),v("ul",[v("li",[v("p",[a._v("预设参数preset")]),a._v(" "),v("ul",[v("li",[a._v("参数选项：ultrafast、superfast、veryfast、faster、fast、medium、slow、slower、veryslow、placebo(编码快则图像质量低)")]),a._v(" "),v("li",[a._v("使用案例："),v("code",[a._v("ffmpeg -i input.mp4 -vcodec libx264 -preset ultrafast -b:v 2000k output.mp4")])])])]),a._v(" "),v("li",[v("p",[a._v("优化参数tune")]),a._v(" "),v("ul",[v("li",[a._v("参数选项：film、animation、grain、stillimage、psnv、ssim、fastdecode、zerolatency")]),a._v(" "),v("li",[a._v("使用案例：只使用tune参数的zerolatency能降低H.264直播编码推流的延迟")])])]),a._v(" "),v("li",[v("p",[a._v("profile（档次）与level（等级）设置")]),a._v(" "),v("ul",[v("li",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2pvh9s4aj30wq0u04pr.jpg",alt:"image-20201026142537741"}})]),a._v(" "),v("li",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2pw9tq47j30u00wrkfl.jpg",alt:"image-20201026142624094"}})]),a._v(" "),v("li",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2pwmxg53j30y10u07kh.jpg",alt:"image-20201026142644841"}})]),a._v(" "),v("li",[a._v("进行实时流媒体直播时，采用baseline编码（无B帧）相对main或high的profile会更可靠，但适当地加入B帧能够有效地降低码率，应根据需要与具体的业务场景进行选择 "),v("a",{attrs:{href:"https://blog.csdn.net/qq_37053885/article/details/83539352",target:"_blank",rel:"noopener noreferrer"}},[a._v("视频中的I、P、B帧"),v("OutboundLink")],1)])])]),a._v(" "),v("li",[v("p",[a._v("控制场景切换关键帧插入参数sc_threshold")])]),a._v(" "),v("li",[v("p",[a._v("设置x264内部参数x264opts")])]),a._v(" "),v("li",[v("p",[a._v("CBR恒定码率设置参数nal-hrd")])])]),a._v(" "),v("h2",{attrs:{id:"ffmpeg硬编解码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ffmpeg硬编解码"}},[a._v("#")]),a._v(" FFmpeg硬编解码")]),a._v(" "),v("ul",[v("li",[a._v("当使用FFmpeg进行软编码时，常见的基于CPU进行H.264或H.265编码其相对成本会比较高，CPU编码时的性能也很低，所以出于编码效率及成本考虑，很多时候都会考虑采用硬编码，常见的硬编码包含Nvidia GPU与Intel QSV两种，还有常见的嵌入式平台，如树莓派、瑞芯微等，本节将重点介绍常见的Nvidia、Intel、树莓派、OSX的硬编码。但关于硬件相关环境的搭建操作可以在官网找到，此处不讲。")]),a._v(" "),v("li",[a._v("hwaccel :hardware acceleration ???")])]),a._v(" "),v("h4",{attrs:{id:"nvidia-gpu硬编解码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#nvidia-gpu硬编解码"}},[a._v("#")]),a._v(" Nvidia GPU硬编解码")]),a._v(" "),v("ul",[v("li",[a._v("Nvidia在图像处理技术方面非常强悍，FFmpeg继承Nvidia显卡视频处理模块后，能快速编解码，使用h264_nvenc进行编码（yuv420p、nv12、p0101e、yuv444p、yuv444p16le、bgr0、rgb0、cuda），使用h264_cuvid进行解码（cuda、nv12）, 转换前最好先查看支持的像素格式（括号内就是了）")])]),a._v(" "),v("p",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2ryse7phj31190u04b1.jpg",alt:"image-20201026153800990"}})]),a._v(" "),v("ul",[v("li",[a._v("命令："),v("code",[a._v("ffmpeg -hwaccel cuvid -vcodec h264_cuvid -i input.mp4 -vf scale_npp=1920:1080 -vcodec h264_nvenc -acodec copy -f mp4 -y output.mp4")])])]),a._v(" "),v("h4",{attrs:{id:"intel-qsv硬编码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#intel-qsv硬编码"}},[a._v("#")]),a._v(" Intel QSV硬编码")]),a._v(" "),v("ul",[v("li",[a._v("FFmpeg通过"),v("code",[a._v("--enable-libmfx")]),a._v("编译开启对Intel QSV的支持，下面看H.264和H.265的参数相关支持与操作")])]),a._v(" "),v("p",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2sdg83ecj30u00uyasc.jpg",alt:"image-20201026155206079"}})]),a._v(" "),v("p",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2shjydv1j311s09madl.jpg",alt:"image-20201026155602913"}})]),a._v(" "),v("ul",[v("li",[a._v("h264_qsv只支持nv12和qsv的像素格式，所以在使用yuv420p时需要将其转换成nv12才可以，FFmpeg能自动进行该操作的转换")]),a._v(" "),v("li",[a._v("h264命令示例："),v("code",[a._v("ffmpeg -i input.MP4 -pix_fmt nv12 -vcodec h264_qsv -an -y output.mp4")])]),a._v(" "),v("li",[a._v("h265命令示例："),v("code",[a._v("ffmpeg -hide_banner -y -hwaccel qsv -i 10M1080P.mp4 -an -c:v hevc_qsv -load_plugin hevc_hw -b:v 5M -maxrate 5M out.mp4")])])]),a._v(" "),v("h4",{attrs:{id:"树莓派硬编码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#树莓派硬编码"}},[a._v("#")]),a._v(" 树莓派硬编码")]),a._v(" "),v("ul",[v("li",[a._v("树莓派常应用于边缘智能计算场景，FFmpeg支持树莓派的H.264编码采用的是OpenMAX框架，在编译ffmpeg前配置编译时，需要使用"),v("code",[a._v("--enable-omx-pi")]),a._v("支持，h264_omx编码参数如下，omx_libname和omx_libprefix均是运行ffmpeg时加载omx所使用的参数，zerocopy则用于提升编码时的性能（怎么用？？？）")])]),a._v(" "),v("p",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2rld09izj311s074jtj.jpg",alt:"image-20201026152506453"}})]),a._v(" "),v("ul",[v("li",[a._v("使用h264_omx和libx264在树莓派上编码效率方面，前者的速度是后者的7倍（书中结论，1.35x vs 0.198x，具体要进一步测试）")]),a._v(" "),v("li",[a._v("软编码效率低下，长此以往，CPU升温，效率会越来越低")])]),a._v(" "),v("h4",{attrs:{id:"os-x-系统硬编解码"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#os-x-系统硬编解码"}},[a._v("#")]),a._v(" OS X 系统硬编解码")]),a._v(" "),v("ul",[v("li",[v("p",[a._v("在苹果电脑的OS X系统下，通常硬编码采用h264_videotoolbox、硬解码采用h264_vda为最快捷、最节省CPU资源的方式")])]),a._v(" "),v("li",[v("p",[a._v("h264_videotoolbox的码率控制情况并不完美，因为h264_videotoolbox做硬编码时目前仅支持VBR/ABR模式，而不支持CBR模式")])]),a._v(" "),v("li",[v("p",[a._v("OS X 硬编解码参数")]),a._v(" "),v("ul",[v("li",[v("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk2qefva4cj312k0a6794.jpg",alt:"image-20201026144351550"}})])])]),a._v(" "),v("li",[v("p",[a._v("OS X 硬编解码使用示例")]),a._v(" "),v("ul",[v("li",[a._v("描述：先用h264_vda对input.mp4视频进行解码，然后使用h264_videotoolbox进行编码，输出码率为2MB/s的文件")]),a._v(" "),v("li",[a._v("代码："),v("code",[a._v("ffmpeg -vcodec h264_vda -i input.mp4 vcodec h264_videotoolbox -b:v 2000k output.mp4")])])])])]),a._v(" "),v("h2",{attrs:{id:"ffmpeg输出mp3"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ffmpeg输出mp3"}},[a._v("#")]),a._v(" FFmpeg输出MP3")]),a._v(" "),v("ul",[v("li",[a._v("FFmpeg可以解码MP3，也可以使用第三方库libmp3lame编码MP3格式，支持多种采样率和采样格式，声道布局支持单声道和环绕立体声模式")])]),a._v(" "),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk309yfmeqj312c0g0dlm.jpg",alt:"image-20201026202532489"}}),a._v(" "),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk312swd5dj31260j643y.jpg",alt:"image-20201026205315764"}}),a._v(" "),v("ul",[v("li",[a._v("控制编码质量："),v("code",[a._v("ffmpeg -i input.mp3 -acodec libmp3lame -q:a 8 output.mp3")])]),a._v(" "),v("li",[a._v("控制码率CBR："),v("code",[a._v("ffmpeg -i input.mp3 -acodec libmp3lame -b:a 64k output.mp3")])]),a._v(" "),v("li",[a._v("使用平均码率ABR，编码速度比VBR高，但质量略低于VBR、略高于CBR："),v("code",[a._v("ffmpeg -i input.mp3 -acodec libmp3lame -b:a 64k -abr 1 output.mp3")])])]),a._v(" "),v("h2",{attrs:{id:"ffmpeg输出aac"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#ffmpeg输出aac"}},[a._v("#")]),a._v(" FFmpeg输出AAC")]),a._v(" "),v("ul",[v("li",[v("p",[a._v("AAC是常见音频编码格式，见于RTMP、HLS、RTSP、FLV、MP4等文件中，与MP3相比，编码效率更高，音质更好，常见文件存储形式为m4a")])]),a._v(" "),v("li",[v("p",[a._v("FFmpeg支持AAC的三种编码器：aac（自带）、libfaac（新版本已移除）、libfdk_aac（质量最高的三方库）")])]),a._v(" "),v("li",[v("p",[a._v("样例："),v("code",[a._v("ffmpeg -i input.wav -c:a aac -q:a 2 output.m4a")])]),a._v(" "),v("ul",[v("li",[v("code",[a._v("-q")]),a._v("\t参数范围是0.1～2.0")])])]),a._v(" "),v("li",[v("p",[a._v("使用libfdk_aac三方编码器")]),a._v(" "),v("ul",[v("li",[a._v("恒定码率（CBR）模式\n"),v("ul",[v("li",[a._v("可以根据音频设置的经验设置码率，双声道*2，立体声*6")]),a._v(" "),v("li",[v("code",[a._v("ffmpeg -i input.wav -c:a libfdk_aac -b:a 128k output.m4a")])]),a._v(" "),v("li",[v("code",[a._v("ffmpeg -i input.mp4 -c:v copy -c:a libfdk_aac -b:a 384k output.mp4")])])])]),a._v(" "),v("li",[a._v("动态码率（VBR）模式\n"),v("ul",[v("li",[a._v("可以设置5个级别，第二列是每通道编码后的码率"),v("img",{staticStyle:{zoom:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gk325ishdbj31160oetgm.jpg",alt:"image-20201026213028355"}})]),a._v(" "),v("li",[v("code",[a._v("ffmpeg -i input.wav -c:a libfdk_aac -vbr 3 output.m4a")])])])])])]),a._v(" "),v("li",[v("p",[a._v("高质量AAC设置")]),a._v(" "),v("ul",[v("li",[v("p",[a._v("HE-AAC：用编码参数 "),v("code",[a._v("-profile:a aac_he")])])]),a._v(" "),v("li",[v("p",[a._v("HEv2-AAC：用编码参数"),v("code",[a._v("-profile:a aac_he_v2")])])])])])])])}),[],!1,null,null,null);t.default=i.exports}}]);