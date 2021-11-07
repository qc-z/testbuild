import request from '../utils/request'

export const getApprovalListsApi = (data) =>
  request({
    url: '/jdab/jdabRy',
    data,
    name: '任务详情-在控人员列表'
  })
export const getApprovalApi = (data) =>
  request({
    url: '/jdab/jdabRy/sp',
    method: 'post',
    data,
    name: '审批'
  })
