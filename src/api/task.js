import request from '../utils/request'

export const addTaskApi = (data) =>
  request({
    url: '/jdab/jdabRw',
    method: 'post',
    data,
    name: '新增task',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

export const taskListApi = (data) =>
  request({
    url: '/jdab/jdabRw',
    data,
    name: 'task lists'
  })

export const deleteListApi = (data) =>
  request({
    url: '/jdab/jdabRw',
    method: 'DELETE',
    data,
    name: 'delete lists'
  })

export const taskSendApi = (data) =>
  request({
    url: '/jdab/jdabRw/pull',
    method: 'post',
    name: '任务下发',
    data
  })

export const taskDetailApi = (data) =>
  request({
    url: '/jdab/jdabRw/' + data,
    name: '任务详情'
  })
export const uploadListApi = (data) =>
  request({
    url: '/jdab/jdabRw',
    method: 'PUT',
    data,
    name: 'update lists'
  })

export const bathUploadApi = (data) =>
  request({
    url: '/jdab/jdabRw/importRy',
    method: 'post',
    name: '批量上传',
    data
  })

export const addPersonApi = (data) =>
  request({
    url: '/jdab/jdabRw/addperson',
    method: 'post',
    name: '新增人员',
    data
  })

export const getInfoByIdApi = (data) =>
  request({
    url: '/jdab/jdabRy/ryxxBySfzh',
    name: 'getInfoByIdApi',
    data
  })

export const bathAddPersonApi = (data) =>
  request({
    url: '/jdab/jdabRy',
    method: 'post',
    name: 'getInfoByIdApi',
    data
  })

export const getAreaDictApi = (data) =>
  request({
    url: '/jdab/jdabRw/areaDict',
    name: '获取区划字典',
    data
  })
