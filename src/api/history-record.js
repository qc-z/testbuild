import request from '../utils/request'

export const getHistoryRecordApi = (data) =>
  request({
    url: '/jdab/jdabRw/lsjl',
    data,
    name: '历史任务列表'
  })

export const getHistoryPersonApi = (data) =>
  request({
    url: '/jdab/jdabRy/lsabry',
    data,
    name: '历史安保人员列表'
  })
