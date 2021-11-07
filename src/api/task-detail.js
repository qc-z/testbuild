import request from '../utils/request'

export const taskDetailListApi = (data) =>
  request({
    url: '/jdab/jdabRw/rwZkry',
    data,
    name: '任务详情-在控人员列表'
  })
export const getCityApi = (data) =>
  request({
    url: '/jdab/jdabRw/ryzkqk',
    data,
    name: '人员在控情况'
  })

export const addTaskRecordApi = (data) =>
  request({
    url: '/jdab/jdabRw/addHcls',
    method: 'post',
    data,
    name: '新增核查历史'
  })
export const addTaskHistoryApi = (data) =>
  request({
    url: '/jdab/jdabRw/hcls',
    method: 'post',
    data,
    name: '查看核查历史'
  })

export const getDictApi = (data) =>
  request({
    url: 'jdab/jdabRw/dict',
    data,
    name: '获取字典'
  })

export const getPersonListApi = (data) =>
  request({
    url: 'jdab/jdabRw/rwXzry',
    data,
    name: '获取新增人员列表'
  })
