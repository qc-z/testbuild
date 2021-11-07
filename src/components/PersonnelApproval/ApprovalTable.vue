<template>
  <div class="taskTable">
    <div class="my-table">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中..."
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        border
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
        ref="curPoint"
        height="100%"
      >
        <el-table-column type="selection" label="" width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="60">
          <template #default="scope">
            <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rwbh"
          label="关联任务"
          min-width="200"
          show-overflow-tooltip
          align="center"
        >
          <template #default="{ row }">
            <span class="underline-link" @click.stop="openTaskDetail(row.glrwid)">{{
              row.rwbh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hjdxq"
          label="户籍地详情"
          min-width="200"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="hjpcs"
          label="户籍派出所"
          min-width="200"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column prop="xm" label="姓名" width="100" align="center"></el-table-column>
        <el-table-column prop="sfzh" label="身份证号" width="200" align="center">
          <template #default="{ row }">
            <span class="underline-link" @click="openDetail(row.sfzh)">{{ row.sfzh }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="hjdzxzq"
          label="户籍地址行政区"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="ejgkdq"
          label="二级管控地区划"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          align="center"
          prop="hjszd"
          label="户籍所在地"
          width="180"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="xxdz"
          label="详细地址"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="aqfxdj" align="center" label="风险等级" width="180">
          <template #default="{ row }">
            <span class="unstart-state" v-if="row.aqfxdj === '高'">高</span>
            <span class="done-state" v-if="row.aqfxdj === '中'">中</span>
            <span class="ing-state" v-if="row.aqfxdj === '低'">低</span>
          </template>
        </el-table-column>
        <el-table-column prop="lxdh" align="center" label="联系电话" width="180"></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="rylr"
          label="操作"
          width="80"
          fixed="right"
        >
          <template #default="{ row }">
            <span
              @click="doApproval(row, 0)"
              class="underline-link"
              style="color: #ff6600"
              v-if="row.spzt === '待审批'"
              >审批</span
            >
            <span
              @click="doApproval(row, 1)"
              class="underline-link"
              :class="{ 'un-pass': row.spzt === '未通过' }"
              v-if="row.spzt !== '待审批'"
              >查看</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <BasePagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
    >
    </BasePagination>
    <ApprovalDialog ref="approvalDialogRef" @reload-table="loadData"></ApprovalDialog>
  </div>
</template>

<script setup>
import { getApprovalListsApi } from '@/api/personnel-approval'
import { useRouter } from 'vue-router'
import usePersonDetailDialog from '@/use/usePersonDetailDialog.js'

const router = useRouter()
const emits = defineEmits(['total-change'])
const props = defineProps({
  type: {
    type: String
  }
})

// 表格初始值
const table = reactive({
  tableData: [],
  pageSize: 10,
  currentPage: 1,
  total: 0
})

const { tableData, pageSize, currentPage, total } = toRefs(table)
// 变色表格样式
const tableRowClassName = ({ row, rowIndex }) => {
  // 点击复选框
  if (multipleSelection.value.includes(row.id)) {
    return 'click-row'
  } else {
    // 单行
    if (rowIndex % 2 === 1) {
      return 'odd-row'
    } else {
      return 'even-row'
    }
  }
}
const multipleSelection = ref([])
const curPoint = ref(null)
// 勾选
const handleSelectionChange = (val) => {
  multipleSelection.value = val.map((res) => res.id)
}
// 复选
const rowClick = (val) => {
  curPoint.value.toggleRowSelection(val)
}
// 页码发生变化
const handleSizeChange = (val) => {
  table.pageSize = val
  loadData()
}
// 条数发生变化
const handleCurrentChange = (val) => {
  table.currentPage = val
  loadData()
}
// 加载数据
const loading = ref(false)

let queryConditions
const loadData = (params) => {
  loading.value = true
  if (params) {
    queryConditions = params
  }
  getApprovalListsApi({
    page: table.currentPage,
    size: table.pageSize,
    spzt: props.type,
    ...queryConditions
  })
    .then((res) => {
      const { totalElements: total, content: tableData } = res.data
      emits('total-change', total)
      table.total = total

      table.tableData = tableData
    })
    .finally(() => {
      loading.value = false
    })
}
// 任务详情
const openDetail = (id) => {
  usePersonDetailDialog(id)
}

const openTaskDetail = (id) => {
  router.push('/task-detail?id=' + id)
}

const approvalDialogRef = ref(null)
const doApproval = (row, type) => {
  approvalDialogRef.value.closed(true, { id: row.id, type })
}

onMounted(() => {
  loadData()
})

defineExpose({ loadData, multipleSelection })
</script>

<style lang="scss" scoped>
.taskTable {
  height: 100%;
  :deep(.el-table) {
    .odd-row {
      --el-table-tr-background-color: #f6f9fd;
    }
    .even-row {
      --el-table-tr-background-color: #fff;
    }
    .click-row {
      --el-table-tr-background-color: #ebf3ff;
      color: #167cf3;
    }
    .el-table__cell {
      border-color: transparent;
    }
    thead {
      .cell {
        color: #333;
        font-weight: 500;
      }
      .el-checkbox {
        display: none;
      }
    }
    tr:hover {
      background: #ebf3ff;
      color: #167cf3;
    }
  }
  .my-table {
    height: calc(100% - 78px);
    .underline-link {
      color: #167cf3;
      text-decoration: underline;
      cursor: pointer;
    }
    .done-state,
    .ing-state,
    .unstart-state {
      font-size: 14px;
      color: #ffffff;
      padding: 2px 4px;
      border-radius: 2px;
    }
    .done-state {
      background: #f57500;
    }
    .ing-state {
      background: #167cf3;
    }
    .unstart-state {
      background: red;
    }
    .un-pass {
      color: red;
    }
    .progress-text {
      margin-left: 10px;
      vertical-align: top;
      line-height: 32px;
    }
  }
}
</style>
