<template>
  <div class="video-player">
    <video-player
      ref="videoPlayer"
      custom-event-name="changed"
      class="vjs-custom-skin video"
      :options="playerOptions"
      :playsinline="true"
    />
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import 'videojs-flash'
// https://blog.csdn.net/Jioho_chen/article/details/104806803

export default {
  components: {
    videoPlayer
  },
  model: {
    prop: 'url', // 绑定的值，通过父组件传递
    event: 'input' // 自定义事件
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    poster: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      playerOptions: {}
      // playerOptions: {
      //   height: '360',
      //   autoplay: false,
      //   muted: false,
      //   language: 'en',
      //   playbackRates: [0.7, 1.0, 1.5, 2.0],
      //   sources: [{
      //     type: 'video/mp4',
      //     // mp4
      //     src: 'http://vjs.zencdn.net/v/oceans.mp4'
      //     // webm
      //     // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
      //   }],
      //   poster: 'https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg'
      // }
    }
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  created() {
    this.playerOptions = {
      height: '360',
      autoplay: true,
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
      playbackRates: [0.7, 1.0, 1.5, 2.0],
      sources: [],
      aspectRatio: '16:9',
      muted: false, // 默认情况下将会消除任何音频。
      preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
      fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
      language: 'zh-CN',
      techOrder: ['flash', 'html5'],
      poster: '',
      notSupportedMessage: '此视频暂无法播放，请稍后再试' // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
    }
    const arr = this.url.split('.')
    const len = arr.length
    this.playerOptions.sources.push(
      {
        type: arr[len - 1] === 'flv' ? 'video/x-flv' : 'video/mp4',
        src: this.url
      }
    )
    this.playerOptions.poster = this.poster
  }
}
</script>

<style scoped lang="scss">
  .video-player /deep/ {
    .vjs-big-play-button {
      width: 70px;
      height: 70px !important;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      margin-top: -35px;
      margin-left: -35px;
      background-color: rgba(0, 0, 0, .4);
      font-size: 46px;

      .vjs-icon-placeholder:before {
        line-height: 1;
        width: auto;
        height: auto;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
