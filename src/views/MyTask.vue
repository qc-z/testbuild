<template>
  <div
    class="taskDetail"
    v-loading="initLoading"
    element-loading-text="数据加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <div class="taskDetail-select">
      <span class="taskDetail-select__title">当前执行任务</span>
      <span class="taskDetail-select__count">({{ cases.length }})</span>
      <el-select v-model="currentId" placeholder="请选择当前执行任务" size="small">
        <el-option
          v-for="option in cases"
          :label="option.rwmc"
          :value="option.id"
          :key="option.rwmc"
        ></el-option>
      </el-select>
    </div>
    <div class="taskDetail-base" v-show="cases.length > 0">
      <el-row :gutter="18">
        <el-col :span="16">
          <BaseInfo :data="originData"></BaseInfo>
        </el-col>
        <el-col :span="4">
          <SecurityCount :count="originData?.abrs ?? '0'"></SecurityCount>
        </el-col>
        <el-col :span="4">
          <SecurityCharts ref="SecurityChartsRef"></SecurityCharts>
        </el-col>
      </el-row>
    </div>

    <div class="taskDetail-city" v-show="cases.length > 0">
      <BaseInfo title="各地市人员在控情况">
        <div class="wrapper">
          <template :span="3" v-for="item in citys" :key="item">
            <div class="wrapper-city" @click="chooseCity(item)">
              <TaskCitys
                :data="item"
                :selected="selectState.selected && selectState.areaCode === item.areaCode"
              ></TaskCitys>
            </div>
          </template>
        </div>
      </BaseInfo>
    </div>

    <div class="taskDetail-filter" v-show="cases.length > 0">
      <BaseTitle title="筛选条件">
        <el-radio-group v-model="spzt" size="small" style="margin-bottom: 20px">
          <el-radio-button label="0">安保人员列表</el-radio-button>
          <el-radio-button label="1">新增人员列表</el-radio-button>
        </el-radio-group>
        <BaseFilter :form="form" @submit="submit" @reset="reset"></BaseFilter>
      </BaseTitle>
    </div>
    <div class="taskDetail-table" v-show="cases.length > 0">
      <BaseTitle title="安保人员" v-show="spzt === '0'">
        <template #count>
          <div class="tools-count">
            共计 <span>{{ total }}</span> 条
          </div>
        </template>
        <template #button>
          <div class="tools-btn">
            <el-button
              size="small"
              plain
              v-for="item in btns"
              :type="item.type"
              :key="item.label"
              @click="operation(item.label)"
            >
              {{ item.label }}
            </el-button>
          </div>
        </template>
        <DetailTable ref="tableRef" @total-change="(value) => (total = value)"></DetailTable>
      </BaseTitle>
      <BaseTitle title="新增人员" v-show="spzt === '1'">
        <template #count>
          <div class="tools-count">
            共计 <span>{{ myTaskTable.total }}</span> 条
          </div>
        </template>
        <template #button>
          <div class="tools-btn">
            <el-button
              size="small"
              plain
              v-for="item in myTaskTable.btns"
              :type="item.type"
              :key="item.label"
              @click="operationAdd(item.label)"
            >
              {{ item.label }}
            </el-button>
          </div>
        </template>
        <MyTaskTable
          ref="myTaskTableRef"
          @total-change="(value) => (myTaskTable.total = value)"
        ></MyTaskTable>
      </BaseTitle>
    </div>
    <AddPerson ref="addPersonRef" @reload-table="reloadTable" v-show="cases.length > 0"></AddPerson>
    <el-empty description="暂时没有数据" v-show="cases.length === 0"></el-empty>
  </div>
</template>

<script setup>
import { getMyCasesSelectApi } from '@/api/my-task.js'
import useTaskDetail from '@/use/useTaskDetail.js'
import { useDownload } from '@/use/useTools.js'

const currentId = ref(''),
  cases = ref([]),
  spzt = ref('0'),
  myTaskTableRef = ref(null),
  myTaskTable = reactive({
    total: 0,
    btns: [
      {
        label: '新增人员',
        type: 'primary',
        action: 'add'
      },
      {
        label: '批量导出',
        type: 'success',
        action: 'export'
      }
    ]
  })
onMounted(async () => {
  const res = await getMyCasesSelectApi()
  cases.value = res.data
  currentId.value = cases.value?.[0]?.id
})
const {
  SecurityChartsRef,
  initLoading,
  total,
  btns,
  form,
  originData,
  citys,
  selectState,
  tableRef,
  submit,
  chooseCity,
  operation,
  reset,
  changeId,
  gobalTableParams
} = useTaskDetail()

watch(currentId, (val) => {
  if (val) {
    changeId(val)
    isLock = false
    updateTable({ rwid: currentId.value })
  }
})
const updateTable = (params) => {
  if (spzt.value === '1' && !isLock) {
    myTaskTableRef.value.loadData(params)
    isLock = true
  }
}
let isLock = false
// tab变化
watch(spzt, () => {
  if (spzt.value === '1' && !isLock) {
    updateTable({ rwid: currentId.value })
    isLock = true
  }
})
// 筛选条件变化
watch(gobalTableParams, (val) => {
  isLock = false

  updateTable({ ...val, rwid: currentId.value })
})
const addPersonRef = ref(null)

const operationAdd = (type) => {
  if (type === '批量导出') {
    const search = {
      ...gobalTableParams.value,
      rwid: currentId.value,
      spzt: '未审批'
    }
    useDownload('/jdab/jdabRw/rwZkryExPort', '新增人员列表', search)
  } else if (type === '新增人员') {
    addPersonRef.value.closed(true, currentId.value)
  }
}
const reloadTable = () => {
  isLock = false
  updateTable()
}
</script>

<style lang="scss" scoped>
.taskDetail {
  &-select {
    width: 100%;
    height: 72px;
    line-height: 72px;
    margin-bottom: 19px;
    background-color: #fff;
    &__title {
      font-size: 14px;
      color: #666;
      margin-left: 20px;
    }
    &__count {
      font-size: 14px;
      color: #ff7f00;
      margin-right: 10px;
    }
  }

  &-base {
    width: 100%;
    // height: 178px;
    margin-bottom: 19px;
    .el-row {
      height: 100%;
    }
  }
  &-city {
    // height: 410px;
    margin-bottom: 19px;
    background-color: #fff;
    padding-bottom: 30px;
    .wrapper {
      display: flex;
      flex-wrap: wrap;

      &-city {
        height: 158px;
        // background-color: #f3f8ff;
        margin-bottom: 16px;
        margin-right: 16px;
        width: calc(12.5% - 18px);
      }
    }
  }
  &-filter {
    margin-bottom: 16px;
  }
  &-table {
    height: 626px;
    margin-bottom: 16px;
  }
}
</style>
