(window.webpackJsonp=window.webpackJsonp||[]).push([[51],{479:function(v,t,_){"use strict";_.r(t);var a=_(15),e=Object(a.a)({},(function(){var v=this,t=v.$createElement,_=v._self._c||t;return _("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[_("h1",{attrs:{id:"chap2-ffmpeg工具使用基础"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#chap2-ffmpeg工具使用基础"}},[v._v("#")]),v._v(" Chap2 FFmpeg工具使用基础")]),v._v(" "),_("p",[v._v("FFmpeg中常用工具主要是ffmpeg（编解码工具）、ffprobe（内容分析工具）、ffplay（播放器），介绍如下。")]),v._v(" "),_("h2",{attrs:{id:"ffmpeg常用命令"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#ffmpeg常用命令"}},[v._v("#")]),v._v(" ffmpeg常用命令")]),v._v(" "),_("h4",{attrs:{id:"简介"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#简介"}},[v._v("#")]),v._v(" 简介")]),v._v(" "),_("ul",[_("li",[v._v("使用 "),_("code",[v._v("ffmpeg -h")]),v._v(" 命令可看到ffmpeg常见的命令主要分为6个部分：信息查询、公共操作参数、文件主要操作参数、视频操作参数、音频操作参数、字幕操作参数，若希望获得全部帮助信息，可以通过使用"),_("code",[v._v("ffmpeg --help long")]),v._v(" 及 "),_("code",[v._v("ffmpeg --help full")]),v._v("命令查看。")])]),v._v(" "),_("h4",{attrs:{id:"信息查询"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#信息查询"}},[v._v("#")]),v._v(" 信息查询")]),v._v(" "),_("h5",{attrs:{id:"通用信息"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#通用信息"}},[v._v("#")]),v._v(" 通用信息")]),v._v(" "),_("ul",[_("li",[_("p",[v._v("使用"),_("code",[v._v("ffmpeg -version")]),v._v(" 查看ffmpeg及其各个子模块的详细版本信息")])]),v._v(" "),_("li",[_("p",[v._v("使用"),_("code",[v._v("ffmpeg -formats")]),v._v(" 查看是否支持对应的视频文件格式，输出三列")]),v._v(" "),_("ul",[_("li",[v._v("第一列是多媒体封装格式Demuxing和Muxing支持（用字母D、E指示）")]),v._v(" "),_("li",[v._v("第二列是多媒体文件格式")]),v._v(" "),_("li",[v._v("第三列是文件格式的详细说明")])])]),v._v(" "),_("li",[_("p",[v._v("使用"),_("code",[v._v("ffmpeg -codecs")]),v._v(" 查看是否支持对应的编解码方式，输出三列")]),v._v(" "),_("ul",[_("li",[v._v("第一列有六个字段\n"),_("ul",[_("li",[v._v("第一个字段用于表示此编码器是音频、视频还是字幕")]),v._v(" "),_("li",[v._v("第二个字段表示帧级别的多线程支持")]),v._v(" "),_("li",[v._v("第三个字段表示分片级别的多线程")]),v._v(" "),_("li",[v._v("第四个字段表示编码为实验版本")]),v._v(" "),_("li",[v._v("第五个字段表示draw horiz band支持")]),v._v(" "),_("li",[v._v("第六个字段表示直接渲染模式支持")])])]),v._v(" "),_("li",[v._v("第二列是编码格式")]),v._v(" "),_("li",[v._v("第三列是编码格式的详细说明")])])]),v._v(" "),_("li",[_("p",[v._v("使用"),_("code",[v._v("ffmpeg -filters")]),v._v(" 查看滤镜支持，输出四列")]),v._v(" "),_("ul",[_("li",[v._v("第一列有三个字段\n"),_("ul",[_("li",[v._v("第一个字段是时间轴支持")]),v._v(" "),_("li",[v._v("第二个字段是分片线程处理支持")]),v._v(" "),_("li",[v._v("第三个字段是命令支持")])])]),v._v(" "),_("li",[v._v("第二列是滤镜名")]),v._v(" "),_("li",[v._v("第三列是转换方式")]),v._v(" "),_("li",[v._v("第四列是滤镜作用说明")])])])]),v._v(" "),_("h5",{attrs:{id:"特定信息"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#特定信息"}},[v._v("#")]),v._v(" 特定信息")]),v._v(" "),_("ul",[_("li",[v._v("特定muxer\n"),_("ul",[_("li",[v._v("命令："),_("code",[v._v("ffmpeg -h muxer=flv")])]),v._v(" "),_("li",[v._v("输出：\n"),_("ul",[_("li",[v._v("第一部分为FLV封装的默认配置描述，如扩展名、MIME类型、默认的视频编码格式、默认的音频编码格式")]),v._v(" "),_("li",[v._v("第二部分为FLV封装时可以支持的配置参数及相关说明")])])])])]),v._v(" "),_("li",[v._v("特定demuxer\n"),_("ul",[_("li",[v._v("命令："),_("code",[v._v("ffmpeg -h demuxer=flv")])]),v._v(" "),_("li",[v._v("输出：\n"),_("ul",[_("li",[v._v("第一部分为FLV解封装默认的扩展文件名")]),v._v(" "),_("li",[v._v("第二部分为FLV解封装设置的参数及相关说明")])])])])]),v._v(" "),_("li",[v._v("特定encoder\n"),_("ul",[_("li",[v._v("命令："),_("code",[v._v("ffmpeg -h encoder=h264")])]),v._v(" "),_("li",[v._v("输出：\n"),_("ul",[_("li",[v._v("第一部分为H.264所支持的基本编码方式、支持的多线程编码方式（例如帧级别多线程编码或Slice级别多线程编码）、编码器所支持的像素的色彩格式")]),v._v(" "),_("li",[v._v("第二部分为H.264编码的具体配置参数及相关说明")])])])])]),v._v(" "),_("li",[v._v("特定decoder\n"),_("ul",[_("li",[v._v("命令："),_("code",[v._v("ffmpeg -h decoder=h264")])]),v._v(" "),_("li",[v._v("输出：\n"),_("ul",[_("li",[v._v("第一部分为解码H.264时可以采用的常规支持、多线程方式支持（帧级别多线程解码或Slice级别多线程解码）")]),v._v(" "),_("li",[v._v("第二部分为解码H.264时可以采用的解码参数及相关说明")])])])])]),v._v(" "),_("li",[v._v("特定filter\n"),_("ul",[_("li",[v._v("命令："),_("code",[v._v("ffmpeg -h filter=colorkey")])]),v._v(" "),_("li",[v._v("输出：\n"),_("ul",[_("li",[v._v("第一部分为colorkey所支持的色彩格式信息，colorkey所支持的多线程处理方式，输入或输出支持")]),v._v(" "),_("li",[v._v("第二部分为colorkey所支持的参数及说明")])])])])])]),v._v(" "),_("h4",{attrs:{id:"封装转换"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#封装转换"}},[v._v("#")]),v._v(" 封装转换")]),v._v(" "),_("ul",[_("li",[v._v("ffmpeg的封装转换功能包含在AVFormat模块中，通过libavformat库进行Mux和Demux操作")])]),v._v(" "),_("h4",{attrs:{id:"转码参数"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#转码参数"}},[v._v("#")]),v._v(" 转码参数")]),v._v(" "),_("ul",[_("li",[v._v("ffmpeg的编解码功能包含在AVCodec模块中，通过libavcodec库进行Encode和Decode操作")])]),v._v(" "),_("h4",{attrs:{id:"转码原理"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#转码原理"}},[v._v("#")]),v._v(" 转码原理")]),v._v(" "),_("h5",{attrs:{id:"案例"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#案例"}},[v._v("#")]),v._v(" 案例")]),v._v(" "),_("ul",[_("li",[_("p",[v._v("命令："),_("code",[v._v("ffmpeg -i input.MOV -vcodec libx265 -an output.mp4")])])]),v._v(" "),_("li",[_("p",[v._v("命令行输出的信息：")]),v._v(" "),_("ul",[_("li",[_("p",[v._v("原视频信息")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzcajzzarj31uk0pwak1.jpg",alt:"image-20201023161900414"}})])]),v._v(" "),_("li",[_("p",[v._v("新视频信息")]),v._v(" "),_("p",[_("img",{attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzccy0tsmj31i60mmthv.jpg",alt:"image-20201023162120024"}})])]),v._v(" "),_("li",[_("p",[v._v("信息解读：")]),v._v(" "),_("ul",[_("li",[v._v("封装格式从MOV变为MP4")]),v._v(" "),_("li",[v._v("视频编码从h264变为h265，音频编码原来为pcm_s16le")]),v._v(" "),_("li",[v._v("视频码率从8284kb/s变为1379.6kb/s")]),v._v(" "),_("li",[v._v("视频帧率从23.62fps变为29.97fps")]),v._v(" "),_("li",[v._v("转码后的文件中不包括音频（-an参数）")])])])])])]),v._v(" "),_("h2",{attrs:{id:"ffprobe"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#ffprobe"}},[v._v("#")]),v._v(" ffprobe")]),v._v(" "),_("ul",[_("li",[v._v("查看多媒体数据包信息 "),_("code",[v._v("ffprobe -show_packets input.MOV")])]),v._v(" "),_("li",[v._v("查看多媒体数据包中的具体数据 "),_("code",[v._v("ffprobe -show_data -show_packets input.MOV")])]),v._v(" "),_("li",[v._v("查看多媒体的封装格式 "),_("code",[v._v("ffprobe -show_format input.MOV")])]),v._v(" "),_("li",[v._v("查看视频文件中的帧信息 "),_("code",[v._v("ffprobe -show_frames input.MOV")])]),v._v(" "),_("li",[v._v("查看多媒体文件中的流信息 "),_("code",[v._v("ffprobe -show_streams input.MOV")])]),v._v(" "),_("li",[v._v("使用"),_("code",[v._v("-of <format>")]),v._v("参数指定输出格式为xml、ini、json、csv、flat等")]),v._v(" "),_("li",[v._v("下面是packet、format、frame、stream字段的说明")])]),v._v(" "),_("p",[_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjze9vd32uj312s0hcgs9.jpg",alt:"image-20201023172734528"}}),_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzealej2mj312y0ewn1z.jpg",alt:"image-20201023172817039"}})]),v._v(" "),_("p",[_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzeazxxm5j312e0qqai0.jpg",alt:"image-20201023172840158"}}),_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzebeci8qj312g0o0qa0.jpg",alt:"image-20201023172903373"}})]),v._v(" "),_("p",[v._v("​")]),v._v(" "),_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzebyxj6hj31260bw0w4.jpg",alt:"image-20201023172936172"}}),v._v(" "),_("h2",{attrs:{id:"ffplay"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#ffplay"}},[v._v("#")]),v._v(" ffplay")]),v._v(" "),_("ul",[_("li",[v._v("ffplay不仅仅是播放器，同时也是测试ffmpeg的codec引擎、format引擎、filter引擎的工具，且还可以进行可视化的媒体参数分析，可通过"),_("code",[v._v("ffplay -h")]),v._v(" 进行查看")])]),v._v(" "),_("p",[_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzeefhvagj31260nyn53.jpg",alt:"image-20201023173157854"}}),_("img",{staticStyle:{width:"50%"},attrs:{src:"https://tva1.sinaimg.cn/large/0081Kckwly1gjzejkzau6j312a0r0wpy.jpg",alt:"image-20201023173654895"}})]),v._v(" "),_("h4",{attrs:{id:"案例-2"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#案例-2"}},[v._v("#")]),v._v(" 案例")]),v._v(" "),_("ul",[_("li",[_("p",[v._v("从视频的第30秒开始播放，播放10秒钟的文件："),_("code",[v._v("ffplay -ss 30 -t 10 output.mp4")])])]),v._v(" "),_("li",[_("p",[v._v("窗口自定义标题播放网络直播流："),_("code",[v._v('ffplay -window_title "test" rtmp://up.v.test.com/live/stream')])])]),v._v(" "),_("li",[_("p",[v._v("视频流中出现多个项目时，需要手动指定："),_("code",[v._v("ffplay -vst 4 -ast 5 input.ts")])])]),v._v(" "),_("li",[_("p",[v._v("通过filter加载字幕文件："),_("code",[v._v('ffplay -vf "subtitles=input.rst" output.mp4')])])]),v._v(" "),_("li",[_("p",[v._v("播放音频时显示音频波形："),_("code",[v._v("ffplay -showmode 1 output.mp3")])])])])])}),[],!1,null,null,null);t.default=e.exports}}]);