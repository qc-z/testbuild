<template>
  <div class="approvel">
    <div class="approvel-filter">
      <BaseFilter :form="taskForm" @submit="submitTaskForm"></BaseFilter>
    </div>
    <div class="approvel-table">
      <BaseTitle title="审批列表">
        <template #count>
          <div class="tools-count">
            共计 <span>{{ total }}</span> 条
          </div>
        </template>
        <template #button>
          <div class="tools-btn">
            <el-button size="small" plain type="success" @click="exportExcel">
              <i class="el-icon-top"></i> 导出
            </el-button>
          </div>
        </template>
        <ApprovalTable
          ref="tableRef"
          :type="props.type"
          @total-change="(value) => (total = value)"
        ></ApprovalTable>
      </BaseTitle>
    </div>
  </div>
</template>

<script setup>
import { useDownload } from '@/use/useTools.js'

const props = defineProps({
  type: {
    type: String
  },
  gkdOptions: {
    type: Array,
    default: () => []
  },
  fileName: {
    type: String
  }
})
const { gkdOptions } = toRefs(props)

const total = ref(0),
  tableRef = ref(null)

const taskForm = computed(() => {
  return [
    {
      type: 'input',
      label: '任务名称',
      value: 'rwmc'
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
const params = ref({})
const submitTaskForm = (query) => {
  params.value = query
  tableRef.value.loadData(query)
}

// 导出
const exportExcel = () => {
  useDownload('/jdab/jdabRy/rysplbdc', props.fileName, {
    ...params.value,
    spzt: props.type
  })
}
</script>

<style lang="scss" scoped>
.approvel {
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
    height: calc(100% - 67px);
    background-color: #fff;
  }
}
</style>
