/* API */
import { bathAddPersonApi } from '@/api/task'

let itemRefs = [] // ref
const ID = ref(''), // 要添加人员的id
  dialogVisible = ref(false), // 新增人员弹窗的显示隐藏状态
  loadingForm = ref(false), // 提交按钮状态
  lists = ref([{ id: new Date().getTime() }]) // 人员添加表单的个数

export default function userAddPerson(emits) {
  // 遍历ref
  const setItemRef = (el) => {
    if (el) {
      itemRefs.push(el)
    }
  }

  // 串行调用新增接口
  const runPromisesSerially = async (tasks) => {
    for (const [index, task] of tasks.entries()) {
      const data = new FormData()
      data.append('id', ID.value)
      for (const item in task) {
        if (item === 'files') {
          for (const file of task[item]) {
            data.append('file', file.file)
          }
        } else {
          data.append(item, task[item])
        }
      }
      try {
        await bathAddPersonApi(data)
        if (index === tasks.length - 1) {
          Message.success('新增成功')
          emits('reload-table')
          loadingForm.value = false
          dialogVisible.value = false
        }
      } catch (err) {
        loadingForm.value = false
        Message.error(err.message)
      }
    }
  }
  // 提交表单
  const submitForm = () => {
    const data = []
    const result = itemRefs.map((item) => {
      data.push(item.form)
      return item.submit()
    })
    Promise.all(result).then(() => {
      loadingForm.value = true
      runPromisesSerially(data)
    })
  }

  // 弹窗打开
  const closed = (state = true, id) => {
    dialogVisible.value = state
    ID.value = id
    // 这里已经重新复制key
    lists.value = reactive([{ id: Math.ceil(Math.random() * 10000000) }])
  }

  // 增加人员表单
  const addPersonForm = () => {
    itemRefs = []
    lists.value.push({ id: new Date().getTime() })
  }

  // 删除人员表单
  const removePersonForm = (index) => {
    itemRefs = []
    lists.value.splice(index, 1)
    itemRefs.splice(index, 1)
  }
  return {
    dialogVisible,
    lists,
    loadingForm,
    setItemRef,
    submitForm,
    closed,
    addPersonForm,
    removePersonForm
  }
}
