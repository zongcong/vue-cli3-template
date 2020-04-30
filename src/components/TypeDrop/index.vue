<template>
  <div class="merchant-box">
    <!-- 商户下拉列表 -->
    <el-form ref="forms" :model="form" class="index-form-content" @submit.native.prevent>
      <el-form-item v-if="isImage">
        <el-select v-model="form.imageType" filterable clearable :placeholder="imagePlaceholder" @change="imageTypeNameVal">
          <el-option v-for="(item, index) in imageTypeQuery" :key="index" :label="item.name" :value="item.id" highlight-current />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isArticle">
        <el-select v-model="form.articleType" filterable clearable :placeholder="articlePlaceholder" @change="articleTypeNameVal">
          <el-option v-for="(item, index) in aritcleTypeQuery" :key="index" :label="item.name" :value="item.id" highlight-current />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isVideo">
        <el-select v-model="form.videoType" filterable clearable :placeholder="videoPlaceholder" @change="videoTypeNameVal">
          <el-option v-for="(item, index) in videoTypeQuery" :key="index" :label="item.name" :value="item.id" highlight-current />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { imageDropdown, articleDropdown, videoDropdown } from '@/api/resourcesSystem'

export default {
  model: {
    prop: 'value', // 绑定的值，通过父组件传递
    event: 'update' // 自定义事件
  },
  props: {
    isImage: {
      type: Boolean,
      default: true
    },
    isArticle: {
      type: Boolean,
      default: false
    },
    isVideo: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    imagePlaceholder: {
      type: String,
      default: '图片类型'
    },
    articlePlaceholder: {
      type: String,
      default: '文章类型'
    },
    videoPlaceholder: {
      type: String,
      default: '视频类型'
    }
  },
  data () {
    return {
      form: {
        imageType: '',
        articleType: '',
        videoType: ''
      },
      imageTypeQuery: [],
      aritcleTypeQuery: [],
      videoTypeQuery: []
    }
  },
  watch: {
    value (val) {
      this.isImage && (this.form.imageType = val)
      this.isArticle && (this.form.articleType = val)
    }
  },
  created () {
    this.isImage && this._ajax_imageDropdown()
    this.isArticle && this._ajax_articleDropdown()
    this.isVideo && this._ajax_videoDropdown()
  },
  methods: {
    imageTypeNameVal (val) {
      this.$emit('update', val)
    },
    articleTypeNameVal (val) {
      this.$emit('update', val)
    },
    videoTypeNameVal (val) {
      this.$emit('update', val)
    },
    _ajax_imageDropdown () {
      this.$http.webApi()
        .then(res => {
          this.imageTypeQuery = res.data.data
          console.log(res.data.data)
        })
    },
    _ajax_articleDropdown () {
      this.$http.webApi()
        .then(res => {
          this.aritcleTypeQuery = res.data.data
          console.log(res.data.data)
        })
    },
    _ajax_videoDropdown () {
      this.$http.webApi()
        .then(res => {
          this.videoTypeQuery = res.data.data
          console.log(res.data.data)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .index-form-content .el-select {
    width: 100%;
  }
</style>
