<template>
  <div class="upload" :class="{'mb28': tips}" :style="{width: width + 'px', height: height + 'px'}">
    <el-upload
      v-if="!url"
      class="img-uploader"
      :action="`${action}&type=${data}`"
      :show-file-list="false"
      :on-progress="onProgress"
      :before-upload="beforeUpload"
      :on-success="handleIcoSuccess"
    >
      <i class="el-icon-plus img-uploader-icon" />
    </el-upload>
    <el-progress v-if="percentage" type="circle" :width="height" :percentage="percentage" class="progress" :style="{padding: paddStyle}" />
    <ul
      v-show="url"
      class="el-upload-list el-upload-list--picture-card"
    >
      <li tabindex="0" class="el-upload-list__item is-success">
        <img v-show="!isVideo" ref="img" :src="url" alt="" width="100%">
        <div v-show="isVideo" class="rel video-box" @click="openVideo">
          <span class="play"><i class="el-icon-caret-right" /></span>
          <video
            ref="video"
            :src="url"
            :poster="poster"
            width="100%"
            class="video"
          >
            您的浏览器不支持 video 标签。
          </video>
        </div>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-check" />
        </label>
        <i class="el-icon-close" />
        <div class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete">
            <i class="el-icon-delete" @click="onRemove" />
          </span>
        </div>
      </li>
    </ul>
    <div v-show="tips" class="font-red">{{ tips }}</div>
    <qka-dialog
      v-if="dialogVisible"
      :url="url"
      :is-video="true"
      :poster="poster"
      @handleClose="handleClose"
    />
    <!--<video
      ref="videoElement"
      class="video-component"
      controls
      autoplay
    >Your browser is too old which doesn't support HTML5 video.</video>-->
  </div>
</template>

<script>
import { uploadURL } from '@/utils/config'
import QkaDialog from './dialog'

export default {
  components: {
    QkaDialog
  },
  // TODO 优化一下 on-success、before-upload、on-progress 支持自定义事件，参考 https://github.com/ElemeFE/element/tree/dev/packages/upload
  model: {
    prop: 'url', // 绑定的值，通过父组件传递
    event: 'input' // 自定义事件
  },
  props: {
    // 文件链接
    url: {
      type: String,
      default: ''
    },
    // 上传地址
    action: {
      type: String,
      default: uploadURL
    },
    // 文件类型
    fileType: {
      type: Array,
      default: () => {
        return ['image/jpeg', 'image/png', 'image/x-icon']
      }
    },
    // 文件宽高度限制
    imgSize: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 是否上传视频
    isVideo: {
      type: Boolean,
      default: false
    },
    // 限制文件大小
    fileSize: {
      type: Number,
      default: 0
    },
    // 文件上传参数 -1 不限(包含jpg、png、ico) 0-ioc 1-png 2-jpg 3-mp4 4-flv
    data: {
      type: String,
      default: '-1'
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    // 预览图
    poster: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 进度条
      percentage: 0,
      // 提示
      tips: '',
      // 预览框
      dialogVisible: false
    }
  },
  computed: {
    paddStyle () {
      return `0 ${(this.width - this.height) / 2}px`
    }
  },
  methods: {
    beforeUpload (file) {
      // this.$emit('before-upload', file)
      console.log(file)
      // 判断大小
      if (this.fileSize) {
        const isFileSize = file.size / 1024 / 1024 < this.fileSize
        if (!isFileSize) {
          this.tips = this.isVideo ? '视频过大' : '图片过大'
          return false
        }
      }

      // 判断视频格式 会出现视频类型为空情况
      if (!file.type) {
        const fileArr = file.name.split('.')
        const index = fileArr.length - 1
        const IS_TYPE = this.fileType.includes(fileArr[index])
        if (!IS_TYPE) {
          this.tips = this.isVideo ? '视频格式不正确' : '图片格式不正确'
          return false
        }
      } else {
        if (JSON.stringify(this.fileType) !== '[]') {
          const IS_TYPE = this.fileType.includes(file.type)
          if (!IS_TYPE) {
            this.tips = this.isVideo ? '视频格式不正确' : '图片格式不正确'
            return false
          }
        }
      }
      /*
      * 图片大小要返回 promise 才会阻止上传
      * */
      /* eslint-disable */
      if (JSON.stringify(this.imgSize) !== '{}') {
        const _URL = window.URL || window.webkitURL
        const { width, height } = this.imgSize
        const IS_SIZE = new Promise((resolve, reject) => {
          const img = new Image()
          img.onload = () => {
            const valid = img.width === width && img.height === height
            valid ? resolve() : reject()
          }
          img.src = _URL.createObjectURL(file)
        }).then(
          () => {
            return file
          },
          () => {
            this.tips = this.isVideo ? '视频尺寸不正确' : '图片尺寸不正确'
            return Promise.reject()
          }
        )
        return IS_SIZE
      }
      return true
    },
    // 删除文件
    onRemove () {
      this.$emit('input', '')
      this.tips = ''
    },
    handleIcoSuccess (res, file, fileList) {
      // this.$emit('on-success', res, file, fileList)
      // 图片加载完成之后设置进度条为0，隐藏进度条
      if (this.isVideo) {
        this.$refs['video'].onloadstart = () => {
          this.percentage = 0
        }
      } else {
        this.$refs['img'].onload = () => {
          this.percentage = 0
        }
      }

      if (res.success) {
        // this.url = res.data[0] && res.data[0].fileName
        this.$emit('input', res.data[0] && res.data[0].fileName)
      } else {
        this.$message.error(res.error || '')
      }
      this.tips = ''
    },
    onProgress (event, file, fileList) {
      this.$emit('on-progress', event, file, fileList)
      this.percentage = Math.ceil(event.percent)
    },
    openVideo () {
      this.dialogVisible = true
    },
    handleClose () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang="scss">
  .mb28 {
    margin-bottom: 28px;
  }

  .img-uploader::v-deep {
    .el-upload {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .el-upload:hover {
      border-color: #409EFF;
    }
  }

  .icon {
    position: relative;
    width: 100px;
    > img {
      width: 100px;
      height: 100px;
      display: block;
    }
    &:hover .icon-bg {
      opacity: 1;
    }
    .icon-bg {
      border-radius: 6px;
      overflow: hidden;
      text-align: center;
      position: absolute;
      opacity: 0;
      content: '';
      top: 0;
      left: 0;
      z-index: 1000;
      width: 100px;
      line-height: 100px;
      color: #fff;
      height: 100px;
      background-color: rgba(0, 0, 0, 0.4);
      transition: opacity 0.3s;
      cursor: pointer;
    }
  }

  .el-icon-delete:before {
    font-size: 20px !important;
  }

  .upload::v-deep {
    width: 100px;
    height: 100px;
    .el-upload {
      width: 100%;
      height: 100%;
    }

    .img-uploader-icon {
      position: relative;
      width: 100%;
      height: 100%;
      font-size: 28px;
      color: #8c939d;
      &:before {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .img-uploader {
    width: 100%;
    height: 100%;
    line-height: 0;
  }

  .el-upload-list {
    width: 100%;
    height: 100%;
  }

  .el-upload-list__item  {
    width: 100%;
    height: 100%;
    margin-bottom: 36px;
  }

  .upload {
    position: relative;
    z-index: 1;
  }

  .progress {
    position: absolute;
    z-index: 1000;
    top: 0;
    left: 0;
    padding: 0 23px;
    background-color: #fff;
  }

  .el-upload-list {
    display: inline-block;
  }

  /* 以下是 hover 删除按钮 style 修改内容 */
  .el-upload-list__item-actions {
    opacity: 1;
    top: auto;
    bottom: 0;
    padding-right: 10px;
    text-align: right;
    height: 30px;
    line-height: 30px;
  }

  .el-upload-list__item-actions span {
    display: inline-block;
  }

  .el-upload-list__item.is-success .el-upload-list__item-status-label {
    display: block;
  }

  .font-red {
    font-size: 12px;
  }

  .video {
    width: 100%;
    height: 100%;
  }

  .play {
    width: 45px;
    height: 45px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    border: 1px solid #fff;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, .5);
  }

  .el-icon-caret-right {
    font-size: 30px;
    color: #fff;
    line-height: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  .video-box {
    width: 100%;
    height: 100%;
  }

</style>
