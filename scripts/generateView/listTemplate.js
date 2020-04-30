module.exports = componentName => {
  return `<template>
  <div>
    <tables
      v-loading="listLoading"
      :data="tableData"
      :col-configs="colConfigs"
      :border="true"
      :table-height="tableHeight"
      :headercellstyle="headercellstyle"
      stripe
      fit
      tooltip-effect="dark"
    >
      <el-table-column
        slot="operate"
        label="操作"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </tables>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="pagination.pageIndex"
      :limit.sync="pagination.pageSize"
      @pagination="pageTo"
    />
    <formPop
      v-if="isShow"
      :title="title"
      :obj-props="objProps"
      @handleConfirm="handleConfirm"
    />
  </div>
</template>

<script>
import Tables from '@/components/Table'
import Pagination from '@/components/Pagination'
import formPop from './component/formPop'

export default {
  name: '${componentName}',
  components: {
    Tables,
    Pagination,
    formPop
  },
  data () {
    return {
      isShow: false,
      title: '新增',
      listLoading: false,
      tableData: [{}],
      total: 0,
      tableHeight: window.innerHeight * 0.50,
      headercellstyle: {
        background: 'rgb(247, 247, 251)'
      },
      pagination: {
        pageIndex: 1, // 当前页
        count: 10, // 总条数
        pageSize: 10, // 一页显示多少条数据
        pageSizes: [10, 20, 30, 40] // 每页显示多少条
      },
      colConfigs: [
        { prop: 'id', label: '文章ID', align: 'center' },
        { prop: 'title', label: '文章标题', align: 'center' },
        { prop: 'articleResourceType', label: '文章类型', align: 'center' },
        { slot: 'status' },
        { slot: 'isTop' },
        { prop: 'createdTime', label: '新增时间', align: 'center' },
        { slot: 'operate', align: 'center' }
      ],
      objProps: {}
    }
  },
  methods: {
    /**
     * @method _ajax_webApi xxx列表
     */
    _ajax_webApi () {
      this.listLoading = true
      const params = {}
      this.$http.webApi(params)
        .then(res => {
          this.listLoading = false
          this.tableData = res.data.data
          this.total = res.datad.data.recordsTotal
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    /**
     * @method _ajax_deleteWebApi 删除xxx
     */
    _ajax_deleteWebApi (id) {
      const params = {
        id
      }
      this.$http.webApi(params)
        .then(res => {
          this._ajax_webApi()
        })
    },
    onEdit (row) {
      this.title = '编辑'
      this.isShow = true
      this.objProps = row
    },
    onDel (row) {
      this.$confirm('删除之后不可恢复，是否确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this._ajax_deleteTest(row.id)
      }).catch(() => {})
    },
    pageTo (val) {
      this.pagination.pageIndex = val.page
      this.pagination.pageSize = val.limit
      this._ajax_webApi()
    },
    handleConfirm () {
      this.isShow = false
      this._ajax_webApi()
    },
    handleClose () {
      this.isShow = false
    }
  }
}
</script>
<style scoped lang="scss">
  .${componentName} {
    color: #ccc;
  }
</style>
`
}
