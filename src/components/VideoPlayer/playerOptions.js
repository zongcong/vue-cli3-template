export default {
  playerOptions: {
    autoplay: false, // 如果true,浏览器准备好时开始回放。(好像微信浏览器不太行)
    techOrder: ['html5'], // 需要加载的插件，如果是要兼容flash的话，必须先加载flash。顺序不能错：['flash','html5']
    flash: {
      hls: { withCredentials: false }
    },
    html5: { hls: { withCredentials: false }},
    muted: true, // 默认情况下将会消除任何音频。
    loop: false, // 导致视频一结束就重新开始。
    language: 'en', // 提示的语言 中文的话是 zh-CN
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度 0.7倍...
    // 播放的资源列表，虽然不知为何是个数组，可能是，轮流播放？
    sources: [
      // {
      //   type: 'video/mp4', // 类型。
      //   src: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm' // 视频流路径
      // },
      // {
      //   withCredentials: false, // 直播是否有播放令牌，反正我是没有
      //   type: 'application/x-mpegURL', // m3u8/Hls 的视频流类型
      //   src: 'https://us-2.wl-cdn.com/hls/20200308/a9e9c7b577d4bb05d2a66508e63f5a17/index.m3u8' // 对应播放的m3u8 路径
      // }
    ],
    poster: '', // 你的封面地址
    notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
    controls: true, // 是否显示操作条
    controlBar: {
      // 播放的操作
      timeDivider: true, // 时间分割线
      durationDisplay: true, // 总时间
      remainingTimeDisplay: false,
      fullscreenToggle: true // 全屏按钮
    }
  }
}
