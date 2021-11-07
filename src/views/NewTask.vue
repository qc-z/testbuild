<template>
  <div class="newTask">
    <div class="newTask-filter">
      <BaseTitle title="筛选条件">
        <BaseFilter :form="form" @submit="submit"></BaseFilter>
      </BaseTitle>
    </div>
    <div class="newTask-table">
      <BaseTitle title="任务列表">
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
              <img :src="getImageUrl(item.label)" alt="" />{{ item.label }}
            </el-button>
          </div>
        </template>
        <NewTaskTable ref="tableRef" @total-change="(value) => (total = value)"></NewTaskTable>
      </BaseTitle>
    </div>
    <AddTasks ref="addRef" @reload-table="tableRef.loadData()" :key="dialogResetKey"></AddTasks>

    <teleport to="body">
      <div v-if="modalOpen" class="modal">
        <div class="modal-content">
          <div class="modal-title">下发中</div>
          <div class="modal-progress">
            <el-progress
              type="circle"
              :percentage="percentage"
              color="#2261D5"
              :stroke-width="4"
              :width="60"
            />
            <div class="tip">正在下发中，请稍等…</div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
<script setup>
// These two components are manually imported and packaged,the packaging time is 20 seconds
// These two components are automatically imported and packaged,the packaging time is 80 seconds
import AddTasks from '@/components/NewTask/AddTasks.vue'
import NewTaskTable from '@/components/NewTask/NewTaskTable.vue'

/* API */
import { deleteListApi, taskSendApi, getAreaDictApi } from '@/api/task'
import { useDownload } from '@/use/useTools.js'

import { ElMessageBox } from 'element-plus'

const total = ref(0), // 总条数
  percentage = ref(0), // 下发进度
  modalOpen = ref(false), // 下发框状态
  tableRef = ref(null), // 表格ref
  addRef = ref(null), // 新增ref
  dialogResetKey = ref(new Date().getTime()), // 重置dialog key
  // 操作按钮数据
  btns = [
    { label: '模板下载', type: 'primary' },
    { label: '新建', type: 'success' },
    { label: '编辑', type: 'info' },
    { label: '删除', type: 'warning' },
    { label: '下发', type: 'danger' }
  ],
  abqyOptions = ref([])

provide('abqyOptions', readonly(abqyOptions))

getAreaDictApi()
  .then((res) => {
    abqyOptions.value = res.data
  })
  .catch((err) => {
    console.log(err)
  })
const form = computed(() => {
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
      props: {
        label: 'name',
        value: 'id',
        emitPath: false,
        checkStrictly: true
      }
    },
    {
      type: 'datetimerange',
      label: '任务时间',
      value: 'time',
      default: []
    }
  ]
})
/**
 * @description: 获取图片
 * @param {*} name
 * @return {*}
 */
const getImageUrl = (name) => {
  return new URL(`../assets/img/${name}normal.png`, import.meta.url).href
}

/**
 * @description: 表单提交
 * @param {*}
 * @return {*}
 */

const submit = (query) => {
  const params = {
    rwmc: query.rwmc,
    abqy: query.abqy,
    rwkssj: query?.time?.[0],
    rwjssj: query?.time?.[1]
  }
  tableRef.value.loadData(params)
}

/**
 * @description: 按钮操作
 * @param {*}
 * @return {*}
 */
const operation = (type) => {
  const multipleSelection = tableRef.value.multipleSelection
  switch (type) {
    case '新建':
      toAdd()
      break
    case '模板下载':
      toDownload()
      break
    case '下发':
      toSend(multipleSelection)
      break
    case '编辑':
      toEdit(multipleSelection)
      break
    case '删除':
      toDelete(multipleSelection)
      break
    default:
      throw new Error('没有该条件')
  }
}

/**
 * @description: 新建
 * @param {*}
 * @return {*}
 */
// 重置dialog
const toAdd = () => {
  dialogResetKey.value = new Date().getTime()
  nextTick(() => {
    addRef.value.closed()
  })
}
const limitLength = (data, length = 1) => {
  if (data.length === 0) {
    Message.info('请最少选择一条数据')
    return false
  }
  if (data.length > length) {
    Message.info(`最多只能选择${length}条数据`)
    return false
  }
  return true
}
/**
 * @description: 删除列表
 * @param {*}
 * @return {*}
 */
const toDelete = (data) => {
  if (!limitLength(data, 10000)) return

  ElMessageBox.confirm('此操作将删除数据?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteListApi({ id: data.join(',') }).then((res) => {
      console.log(res)
      Message.success('删除成功')
      tableRef.value.loadData()
    })
  })
}
/**
 * @description: 模板下载
 * @param {*}
 * @return {*}
 */
const toDownload = () => {
  useDownload('/jdab/jdabRw/downTemplate', '模板', {}, 'post')
}
/**
 * @description: 下发
 * @param {*}
 * @return {*}
 */
const toSend = (data) => {
  if (!limitLength(data)) return
  modalOpen.value = true
  setInterval(() => {
    if (percentage.value >= 99) return
    percentage.value = percentage.value + 1
  }, 5)
  taskSendApi({ id: data.join(',') }).then(() => {
    percentage.value = 100
    // 太快效果不好
    setTimeout(() => {
      Message.success('下发成功')
      modalOpen.value = false
    }, 1000)
  })
}
/**
 * @description: 编辑
 * @param {*}
 * @return {*}
 */
const toEdit = (data) => {
  if (!limitLength(data)) return
  dialogResetKey.value = new Date().getTime()
  nextTick(() => {
    addRef.value.closed(true, data.join(','))
  })
}
</script>

<style lang="scss" scoped>
.newTask {
  width: 100%;
  height: 100%;
  // display: flex;
  flex-direction: column;
  &-filter {
    width: 100%;
    height: 110px;
    margin-bottom: 16px;
  }
  &-table {
    width: 100%;
    // height: 842px;
    height: calc(100% - 124px);
    background-color: #fff;
    .tools-count {
      color: #333;
      span {
        color: #167cf3;
        font-weight: 900;
        margin: 0 5px;
      }
    }
    .tools-btn {
      img {
        vertical-align: text-bottom;
        margin-right: 4px;
      }
      .el-button {
        background-color: #fff;
      }
      .el-button--primary {
        color: #773fdd;
        border-color: #773fdd;
      }
      .el-button--success {
        color: #2482f3;
        border-color: #2482f3;
      }
      .el-button--info {
        color: #268d6b;
        border-color: #268d6b;
      }
      .el-button--warning {
        color: #f57500;
        border-color: #f57500;
      }
      .el-button--danger {
        color: #2d87f4;
        border-color: #2d87f4;
      }
    }
  }
  :deep(.el-dialog) {
    .el-dialog__body {
      padding: 10px 5px;
      background: #fbfcff;
    }

    .el-dialog__title {
      font-size: 18px;
      color: #333333;
      font-weight: 500;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e0ecfc;
      padding-top: 10px;
    }
    .el-dialog__headerbtn {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #dee4f5;
      .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__footer {
      text-align: center;
      background: #fbfcff;
    }
  }
}
</style>
