module.exports = componentName => {
  return `<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="viewDialog"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :append-to-body="true"
      width="700px"
      class="app-container"
    >
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
      >
        <el-form-item label="图片类型：" prop="imageTypeId">
          <type-drop
            v-if="title === '新增'"
            v-model="formData.imageTypeId"
            image-placeholder="请选择"
            class="el-input-w"
          />
          <span v-else>{{ objProps.imageResourceName }}</span>
        </el-form-item>
        <el-form-item label="图片名称：" prop="name">
          <el-input v-model="formData.name" class="el-input-w" />
          <span class="tips">20位以内</span>
        </el-form-item>
        <el-form-item label="状态：" prop="enable">
          <qka-switch v-model="formData.enable" />
        </el-form-item>
        <el-form-item label="选择图片：" prop="imageUrl">
          <upload v-model="formData.imageUrl" />
        </el-form-item>
        <el-form-item label="跳转URL：">
          <span class="tips-top">1024位以内</span>
          <div class="flex-box ai-s">
            <el-input
              v-model="formData.jumpUrl"
              :rows="3"
              type="textarea"
              class="el-input-w"
            />
            <el-select v-model="formData.openTabType" class="jump">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <div class="text-center">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" :loading="loading" @click="saveData">确定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import QkaSwitch from '@/components/QkaSwitch'
import TypeDrop from '@/components/TypeDrop'
import Upload from '@/components/Upload'

export default {
  name: '${componentName}',
  components: {
    QkaSwitch,
    TypeDrop,
    Upload
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    objProps: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      viewDialog: true,
      formData: {
        imageTypeId: '',
        name: '',
        enable: true,
        imageUrl: '',
        jumpUrl: '',
        openTabType: 1
      },
      rules: {
        imageTypeId: [
          { required: true, message: '图片类型为必须', trigger: 'change' }
        ],
        name: [
          { required: true, message: '图片名称为必须', trigger: 'blur' },
          { max: 20, message: '图片名称最多20位', trigger: 'blur' }
        ],
        enable: [
          { required: true, message: '状态为必须', trigger: 'blur' }
        ],
        imageUrl: [
          { required: true, message: '图片为必须', trigger: 'blur' }
        ],
        jumpUrl: [
          { max: 1024, message: '跳转URL最多1024位', trigger: 'blur' }
        ]
      },
      options: [
        {
          label: '本标签页打开',
          value: 1
        },
        {
          label: '新标签页打开',
          value: 2
        }
      ]
    }
  },
  created () {
    if (this.title !== '新增') {
      this._ajax_getTest()
    }
  },
  methods: {
    /**
     * @method _ajax_getTest xx详情
     */
    _ajax_getTest () {
      const params = {
        id: this.objProps.id
      }
      this.$http.webApi(params)
        .then(res => {
          this.formData = { ...res.data.data, ...{ name: res.data.data.imageName } }
        })
    },
    /**
     * @method _ajax_updateTest 修改xxx
     */
    _ajax_updateTest () {
      this.loading = true
      const { imageTypeId, name, enable, imageUrl, jumpUrl, openTabType } = this.formData
      const params = {
        id: this.objProps.id,
        imageTypeId,
        name,
        enable,
        imageUrl,
        jumpUrl,
        openTabType
      }
      console.log(params)
      this.$http.webApi(params)
        .then(res => {
          console.log(res)
          this.loading = false
          this.handleConfirm()
          this.handleClose()
        })
        .catch(() => {
          this.loading = false
        })
    },
    /**
     * @method _ajax_addTest 添加xxx
     */
    _ajax_addTest () {
      const { imageTypeId, name, enable, imageUrl, jumpUrl, openTabType } = this.formData
      const params = {
        imageTypeId,
        name,
        enable,
        imageUrl,
        jumpUrl,
        openTabType
      }
      console.log(params)
      this.$http.webApi(params)
        .then(res => {
          console.log(res)
          this.handleConfirm()
          this.handleClose()
        })
    },
    saveData () {
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.title === '新增' ? this._ajax_addTest() : this._ajax_updateTest()
        }
      })
    },
    handleConfirm () {
      this.$emit('handleConfirm')
    },
    handleClose () {
      this.$emit('handleClose')
    }
  }
}
</script>

<style scoped lang="scss">
  .jump {
    width: 20%;
    margin-left: 10px;
  }
</style>
`
}
