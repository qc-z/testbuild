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
        <el-table-column prop="rwbh" label="任务编号" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            <span class="underline-link" @click.stop="openDetail(scope.row.id)">{{
              scope.row.rwbh
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rwmc"
          label="任务名称"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="rwnr"
          label="任务内容"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="abrs" label="安保人数" width="100"></el-table-column>
        <el-table-column prop="abqy" label="安保区域" width="200"></el-table-column>
        <el-table-column prop="rwkssj" label="任务开始时间" width="180"></el-table-column>
        <el-table-column prop="rwjssj" label="任务结束时间" width="180"></el-table-column>
        <el-table-column prop="rwzt" label="任务状态" width="150">
          <template #default="scope">
            <span class="unstart-state" v-if="scope.row.rwzt === '未开始'">{{
              scope.row.rwzt
            }}</span>
            <span class="ing-state" v-if="scope.row.rwzt === '进行中'">{{ scope.row.rwzt }}</span>
            <span class="done-state" v-if="scope.row.rwzt === '已完成'">{{ scope.row.rwzt }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="zkzt" label="在控情况" width="150">
          <template #default="scope">
            <el-progress
              type="circle"
              :percentage="Number(scope.row.zkzt)"
              :stroke-width="4"
              :width="32"
              :show-text="false"
              :color="customColorMethod"
            />
            <span class="progress-text" :style="{ color: customColorMethod(scope.row.zkzt) }"
              >{{ scope.row.zkzt }}%</span
            >
          </template>
        </el-table-column>
        <el-table-column prop="rwfbsj" label="任务发布时间" width="180"></el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          prop="rylr"
          label="人员录入"
          width="120"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              style="text-decoration: underline"
              type="text"
              size="mini"
              @click="addPersonBtn(scope.row)"
              >新增</el-button
            >

            <el-upload
              style="display: inline; margin-left: 30px"
              action=""
              class="my-upload"
              :multiple="false"
              :auto-upload="false"
              :on-change="handleChange"
              :show-file-list="false"
              accept="application/vnd.ms-excel.template.macroEnabled.12,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12"
            >
              <el-button
                style="color: #268d6b; text-decoration: underline"
                type="text"
                size="mini"
                @click="batch(scope.row)"
                >批量</el-button
              >
            </el-upload>
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
    <AddPerson ref="addPersonRef"></AddPerson>
  </div>
</template>

<script setup>
import { taskListApi, bathUploadApi } from '@/api/task'
import { useRouter } from 'vue-router'
const router = useRouter()
const emits = defineEmits(['total-change'])

// 表格初始值
const table = reactive({
  tableData: [],
  pageSize: 10,
  currentPage: 1,
  total: 0
})
// 环形颜色
const customColorMethod = (percentage) => {
  if (percentage <= 50) {
    return '#FB3E1F'
  }
  if (percentage < 100) {
    return '#167CF3'
  }
  return '#01B178'
}

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
  taskListApi({
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
  router.push('/task-detail?id=' + id)
}
// 新增人员
const addPersonRef = ref(null)
// const addPersonReset = ref(new Date().getTime())
//MARK: 测试

const addPersonBtn = (row) => {
  // addPersonReset.value = new Date().getTime()
  // console.log(addPersonReset.value)
  addPersonRef.value.closed(true, row.id)
}
// 批量导入
const rwid = ref(null)
const batch = (row) => {
  console.log('批量', row.id)
  rwid.value = row.id
}

// 批量导入文件上传变动
const handleChange = async (file) => {
  const data = new FormData()
  data.append('file', file.raw)
  data.append('rwid', rwid.value)
  try {
    await bathUploadApi(data)
    Message.success('导入成功')
  } catch (err) {
    console.log(err)
    Message.error(err.message)
  }
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
      background: #05b67b;
    }
    .ing-state {
      background: #167cf3;
    }
    .unstart-state {
      background: #f57500;
    }
    .progress-text {
      margin-left: 10px;
      vertical-align: top;
      line-height: 32px;
    }
  }
}
</style>
