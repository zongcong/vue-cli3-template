<template>
  <div class="table">
    <el-table
      ref="multipleTable"
      :data="data"
      :border="border"
      :fold-list="foldList"
      :row-style="toggleDisplayTr"
      :height="tableHeight"
      style="width: 100%;"
      :header-cell-style="headercellstyle"
      class-name="small-padding fixed-width"
      highlight-current-row
      v-bind="tableOthersProps"
      @selection-change="handleSelectionChange"
      @select="handlselection"
      @cell-click="handlRowclick"
      @expand-change="toggleRowExpansion"
    >
      <template v-for="colConfig in colConfigs">
        <slot v-if="colConfig.slot" :name="colConfig.slot" />
        <!-- 插入编辑删除等 -->
        <el-table-column :key="colConfig[0]" show-overflow-tooltip v-bind="colConfig" />
      </template>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    // 表头
    colConfigs: {
      type: Array,
      default: () => []
    },
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    // 表格边宽
    border: {
      type: Boolean,
      default: false
    },
    // 表格自适应高度,在需要的地方通过tableHeight: window.innerHeight * 0.65,控制*后的数字自适应，如果不需要这个功能，则写tableHeight:null,不可写空字符串
    tableHeight: {
      type: Number,
      default: 0
    },
    // 表头的样式
    // headercellstyle: {
    //   type: Object,
    //   default: () => {}
    // },
    // 树形表格折叠数组
    foldList: {
      type: Array,
      default: () => []
    },
    // 树形表格方法
    toggleDisplayTr: {
      type: Function,
      default: () => {}
    },
    tableOthersProps: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      headercellstyle: {
        background: '#ccc'
      }
    }
  },
  methods: {
    toggleRowExpansion (row) {
      this.$emit('toggleRowExpansion', row)
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    // 点击某一行触发
    handlRowclick (row, event, column) {
      this.$emit('handlRowclick', row, event, column)
    },
    handlselection (row, selected) {
      this.$emit('handlselection', row, selected)
    },
    // 清空多选状态
    clearSelection () {
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>
