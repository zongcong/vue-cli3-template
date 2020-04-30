<template>
  <div>
    <el-switch
      v-model="isOpen"
      class="radioButton-switch"
      v-bind="otherProps"
      @change="switchChange"
    />
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value', // 绑定的值，通过父组件传递
    event: 'update' // 自定义事件
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    otherProps: {
      type: Object,
      default: () => {
        return {
          'inactive-color': '#8f949a',
          'active-text': '启用',
          'inactive-text': '禁用'
        }
      }
    }
  },
  data () {
    return {
      isOpen: this.value
    }
  },
  watch: {
    value (val) {
      this.isOpen = val
    }
  },
  methods: {
    switchChange (value) {
      this.$emit('update', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .radioButton-switch::v-deep .el-switch__label {
    position: absolute;
    display: none;
    color: #fff;
  }

  .radioButton-switch::v-deep .el-switch__label--right {
    z-index: 1;
  }

  .radioButton-switch::v-deep .el-switch__label--left {
    z-index: 1;
    left: 19px;
  }

  .radioButton-switch::v-deep .el-switch__core {
    width: 60px !important
  }

  .radioButton-switch::v-deep .el-switch__label.is-active {
    display: block;
  }

  .radioButton-switch >>> .el-switch .el-switch__core,
  .el-switch .el-switch__label {
    width: 50px !important;
  }
</style>
