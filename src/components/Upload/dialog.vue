<template>
  <div>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="850px"
      append-to-body
    >
      <div>
        <video ref="video" :src="url" controls autoplay width="100%" class="video">
          您的浏览器不支持 video 标签。
        </video>
        <!--<video-player
          v-model="url"
          :poster="poster"
        />-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import VideoPlayer from '@/components/VideoPlayer'

export default {
  components: {
    // VideoPlayer
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    isVideo: {
      type: Boolean,
      default: false
    },
    poster: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose () {
      this.$emit('handleClose')
    }
  }
}
</script>

<style scoped lang="scss">
  .video {
    width: 100%;
  }
</style>
