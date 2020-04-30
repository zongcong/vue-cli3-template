export default {
  height: '360',
  autoplay: false,
  flash: {
    hls: {
      withCredentials: false
    }
  },
  html5: {
    hls: {
      withCredentials: false
    }
  },
  sources: this.sources,
  aspectRatio: '16:9',
  preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
  fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
  language: 'zh-CN',
  techOrder: ['flash', 'html5'],
  poster: '',
  notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
}
