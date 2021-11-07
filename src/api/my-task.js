import request from '../utils/request'

export const getMyCasesSelectApi = (data) =>
  request({
    url: '/jdab/jdabRw/dclrw',
    data,
    name: '我的任务下拉'
  })
export const getMyTaskDetailApi = (data) =>
  request({
    url: '/jdab/jdabRy/' + data,
    name: '人员查看'
  })
