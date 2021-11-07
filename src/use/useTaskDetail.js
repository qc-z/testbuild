import { taskDetailApi, getAreaDictApi } from '@/api/task'
import { getCityApi } from '@/api/task-detail'
import { useDownload } from '@/use/useTools.js'
// form数据

const id = ref(null),
  tableRef = ref(null), // 表格ref
  total = ref(0), // 总条数
  // 操作按钮数据
  btns = [{ label: '批量导出', type: 'success' }],
  citys = ref([]),
  // 地区数据
  abqyOptions = ref([]),
  initLoading = ref(false),
  originData = ref(null),
  defaultCity = ref(''),
  cascader = ref(null),
  currentId = ref(''),
  SecurityChartsRef = ref(null),
  gobalTableParams = ref()

let filterQuery = {}
const form = computed(() => {
  return [
    {
      type: 'input',
      label: '关键字',
      value: 'keyword'
    },
    {
      type: 'cascader',
      label: '地区',
      value: 'ejgxdh',
      options: abqyOptions.value,
      props: {
        label: 'name',
        value: 'id',
        checkStrictly: true,
        emitPath: false
      },
      default: defaultCity.value,
      ref: cascader
    }
  ]
})
export default function userTaskDetail() {
  // 初始化数据
  function changeId(id) {
    currentId.value = id
    initData(id)
  }
  // 初始化数据
  const initData = (rwid) => {
    id.value = rwid
    initLoading.value = true
    // 基本信息
    taskDetailApi(rwid)
      .then(({ data }) => {
        originData.value = data
        SecurityChartsRef.value.init(data?.zkzt ?? '0')
      })
      .finally(() => {
        initLoading.value = false
      })

    // 列表数据
    handlerTable({ rwid: currentId.value })

    // 安保区域字典
    getAreaDictApi().then((res) => {
      //
      abqyOptions.value = res.data
    })

    // 地区数据
    getCityApi({ rwid }).then(({ data }) => {
      citys.value = data
    })
  }
  // 初始化数据
  // watch(id, (val) => {
  //   val && initData(val)
  // })

  /**
   * @description: 表单提交
   * @param {*}
   * @return {*}
   */
  const submit = (query) => {
    filterQuery = { ...query, ejgxdh: cascader.value.presentText, rwid: currentId.value }
    gobalTableParams.value = filterQuery
    handlerTable(filterQuery)
  }
  // 操作按钮
  const oldValue = ref('')
  const selectState = reactive({
    selected: false,
    areaCode: ''
  })
  const chooseCity = (data) => {
    selectState.selected = oldValue.value !== data.areaCode
    selectState.areaCode = data.areaCode
    const code = oldValue.value === data.areaCode ? '' : data.areaCode
    defaultCity.value = code
    gobalTableParams.value = {
      ejgxdh: oldValue.value === data.areaCode ? '' : data.area,
      keyword: filterQuery.keyword,
      rwid: currentId.value
    }
    handlerTable(gobalTableParams.value)
    oldValue.value = code
  }
  let tableParams = {}
  // 列表数据
  const handlerTable = (params) => {
    tableParams = { ...tableParams, ...params }
    tableRef.value.loadData(tableParams)
  }
  // 操作按钮
  const operation = (type) => {
    if (type === '批量导出') {
      const search = {
        ...filterQuery,
        ejgxdh: cascader.value.presentText,
        rwid: id.value
      }
      useDownload('/jdab/jdabRw/rwZkryExPort', '安保人员列表', search)
    }
  }
  // 重置选中
  const reset = () => {
    selectState.selected = false
    selectState.areaCode = ''
  }

  return {
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
  }
}
