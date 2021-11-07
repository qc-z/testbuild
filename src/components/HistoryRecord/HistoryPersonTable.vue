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
        align="center"
      >
        <el-table-column type="selection" label="" width="60"></el-table-column>
        <el-table-column type="index" label="序号" width="60">
          <template #default="scope">
            <span>{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hjpcs"
          label="户籍派出所"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="xm" label="姓名" width="100"></el-table-column>
        <el-table-column prop="sfzh" label="身份证号" width="250">
          <template #default="scope">
            <span class="underline-link" @click.stop="openDetail(scope.row.sfzh)">{{
              scope.row.sfzh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hjdzxzq" label="户籍地址行政区" width="200"></el-table-column>
        <el-table-column prop="ejgkdq" label="二级管辖地区划" width="200"></el-table-column>
        <el-table-column prop="ejzt" label="二级状态" width="150">
          <template #default="scope">
            <span
              class="unstart-state"
              v-if="scope.row.ejzt"
              :class="{
                'zk-state': scope.row.ejzt?.includes('在控'),
                'sk-state': scope.row.ejzt?.includes('失控')
              }"
              >{{ scope.row.ejzt }}</span
            >
          </template>
        </el-table-column>

        <el-table-column prop="hjszd" label="户籍所在地" width="180"></el-table-column>
        <el-table-column prop="aqfxdj" label="风险等级" width="180"></el-table-column>
        <el-table-column prop="lxdh" label="联系电话" width="180"></el-table-column>

        <el-table-column
          header-align="center"
          align="center"
          prop="rylr"
          label="人员核查现状"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              style="text-decoration: underline"
              type="text"
              size="mini"
              @click="checkPerson(scope.row)"
              >查看</el-button
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
    <VerificationDetail ref="VerificationDetailRef"></VerificationDetail>
  </div>
</template>

<script setup>
import { getHistoryPersonApi } from '@/api/history-record'
import usePersonDetailDialog from '@/use/usePersonDetailDialog.js'

const emits = defineEmits(['total-change'])

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
  getHistoryPersonApi({
    page: table.currentPage,
    size: table.pageSize,
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
// 新增人员
const VerificationDetailRef = ref(null)

const checkPerson = (row) => {
  VerificationDetailRef.value.closed(true, row)
}
// 批量导入

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
      background: #05b67b;
    }
    .ing-state {
      background: #167cf3;
    }
    .unstart-state {
      background: #f57500;
    }
    .zk-state {
      background: #1bc2a0;
    }
    .sk-state {
      background: #e70000;
    }
    .progress-text {
      margin-left: 10px;
      vertical-align: top;
      line-height: 32px;
    }
  }
}
</style>
