<template>
  <div class="history">
    <div class="history-filter">
      <BaseTitle title="筛选条件">
        <el-radio-group v-model="radio" size="small" style="margin-bottom: 20px">
          <el-radio-button label="historyTask">历史任务</el-radio-button>
          <el-radio-button label="historyPerson">历史安保人员</el-radio-button>
        </el-radio-group>
        <BaseFilter
          :form="taskForm"
          @submit="submitTaskForm"
          v-show="radio === 'historyTask'"
        ></BaseFilter>
        <BaseFilter
          :form="personForm"
          @submit="submitPersonForm"
          v-show="radio === 'historyPerson'"
        ></BaseFilter>
      </BaseTitle>
    </div>
    <div class="history-table">
      <!-- 历史任务 -->
      <BaseTitle title="任务列表" v-show="radio === 'historyTask'">
        <template #count>
          <div class="tools-count">
            共计 <span>{{ historyTaskTable.total }}</span> 条
          </div>
        </template>
        <HistoryTaskTable
          ref="historyTaskTableRef"
          @total-change="(value) => (historyTaskTable.total = value)"
        ></HistoryTaskTable>
      </BaseTitle>

      <!-- 历史安保人员 -->
      <BaseTitle title="任务列表" v-show="radio === 'historyPerson'">
        <template #count>
          <div class="tools-count">
            共计 <span>{{ historyPersonTable.total }}</span> 条
          </div>
        </template>
        <template #button>
          <div class="tools-btn">
            <el-button size="small" plain type="success" @click="exportExcel">
              <i class="el-icon-top"></i> 导出
            </el-button>
          </div>
        </template>
        <HistoryPersonTable
          ref="historyPersonTableRef"
          @total-change="(value) => (historyPersonTable.total = value)"
        ></HistoryPersonTable>
      </BaseTitle>
    </div>
  </div>
</template>

<script setup>
import { getAreaDictApi } from '@/api/task'
import { useDownload } from '@/use/useTools.js'

const radio = ref('historyTask'),
  gkdOptions = ref([]),
  abqyOptions = ref([]),
  historyTaskTable = reactive({
    total: 0
  }),
  historyTaskTableRef = ref(null),
  historyPersonTable = reactive({
    total: 0
  }),
  historyPersonTableRef = ref(null),
  search = ref()

const taskForm = computed(() => {
  return [
    {
      type: 'input',
      label: '任务名称',
      value: 'rwmc'
    },
    {
      type: 'cascader',
      label: '安保区域',
      value: 'abqy',
      options: abqyOptions.value,
      props: { label: 'name', value: 'id', emitPath: false, checkStrictly: true }
    },
    {
      type: 'datePicker',
      label: '开始时间',
      value: 'rwkssj',
      placeholder: '请选择开始时间'
    },
    {
      type: 'datePicker',
      label: '结束时间',
      value: 'rwjssj',
      placeholder: '请选择结束时间'
    }
  ]
})
const personForm = computed(() => {
  return [
    {
      type: 'input',
      label: '关键字',
      value: 'keyword',
      placeholder: '名字/身份证/状态'
    },
    {
      type: 'select',
      label: '风险等级',
      value: 'fxdj',
      placeholder: '风险等级',
      options: [
        {
          label: '高',
          value: '高'
        },
        {
          label: '中',
          value: '中'
        },
        {
          label: '低',
          value: '低'
        }
      ]
    },
    {
      type: 'cascader',
      label: '管控地',
      value: 'gkd',
      options: gkdOptions.value,
      props: { label: 'name', value: 'id', emitPath: false, checkStrictly: true }
    }
  ]
})
const submitTaskForm = (query) => {
  historyTaskTableRef.value.loadData(query)
}

const submitPersonForm = (query) => {
  search.value = query
  historyPersonTableRef.value.loadData(query)
}

const exportExcel = () => {
  useDownload('/jdab/jdabRy/lsabryExPort', '历史安保人员列表', search.value)
}
onMounted(async () => {
  const res1 = await getAreaDictApi()
  abqyOptions.value = res1.data

  const res2 = await getAreaDictApi({ areaCode: '0' })
  gkdOptions.value = res2.data
})
</script>

<style lang="scss" scoped>
.my-filter {
  :deep(.el-form) {
    .el-form-item {
      margin-right: 3rem !important;
    }
  }
}
@media screen and (min-width: 1000px) and (max-width: 1600px) {
  .my-filter {
    :deep(.el-form) {
      .el-input__inner,
      .el-date-editor--date {
        width: 10.2rem !important;
      }
      .el-form-item {
        margin-right: 1rem !important;
      }
    }
  }
}
.history {
  width: 100%;
  height: 100%;
  // display: flex;
  flex-direction: column;
  &-filter {
    width: 100%;
    margin-bottom: 16px;
  }
  &-table {
    width: 100%;
    // height: 842px;
    height: calc(100% - 176px);
    background-color: #fff;
  }
}
</style>
