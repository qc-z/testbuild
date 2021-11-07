<template>
  <div class="base" v-if="data">
    <BaseTitle title="任务基本信息">
      <el-row :gutter="20" class="item-row">
        <el-col :span="8">
          <span class="des-label">任务名称：</span>
          <span class="des-value">{{ data.rwmc }}</span>
        </el-col>
        <el-col :span="6">
          <span class="des-label">安保区域：</span>
          <span class="des-value">{{ data.abqy }}</span>
        </el-col>
        <el-col :span="10">
          <span class="des-label">任务时效：</span>
          <span class="des-value">{{ data.rwkssj }} 到 {{ data.rwjssj }}</span>
        </el-col>
      </el-row>
      <div class="item-row">
        <span class="des-label">任务描述：</span>
        <span class="des-value">
          {{ data.rwnr }}
        </span>
      </div>
      <div class="item-row">
        <span class="des-label">附件：</span>
        <span
          class="des-value des-files"
          v-for="item in data.files"
          :key="item"
          @click="downLoadFile(item)"
        >
          <i class="el-icon-document"></i>
          {{ item.filename }}</span
        >
        <span
          class="des-value des-files"
          @click="downLoadFile(data.files)"
          v-if="data.files.length"
        >
          <i class="el-icon-download no-decoration"></i>
          一键下载({{ data.files.length }})
        </span>
      </div>
    </BaseTitle>
  </div>
</template>

<script setup>
/* API */
import axios from 'axios'
import { API_HOST } from '@/constant'
/* 组件 */

/* 功能 */

const props = defineProps({
  data: { type: Object }
})
const { data } = toRefs(props)

const downLoadFile = (files) => {
  console.log(files)
  if (!Array.isArray(files)) {
    toDownload(files.path, files.filename)
  } else {
    files.forEach((n) => {
      toDownload(n.path, n.filename)
    })
  }
}
const toDownload = (data, name) => {
  const formData = new FormData()
  formData.append('downloadUrl', data)
  formData.append('fileName', name)
  axios({
    method: 'post',
    url: API_HOST + '/jdab/downloadFile',
    headers: {
      Authorization: sessionStorage.getItem('token'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob',
    data: formData
  }).then((res) => {
    const content = res.data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = name
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, name)
    }
  })
}
</script>

<style lang="scss" scoped>
.base {
  height: 100%;
  .item-row {
    margin-bottom: 10px;
  }
  .des-label {
    font-size: 14px;
    color: #666666;
  }
  .des-value {
    font-size: 14px;
    color: #333;
  }
  .des-files {
    margin-right: 10px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #167cf3;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
    margin-right: 20px;
  }
  .no-decoration {
    text-decoration: none;
  }
}
</style>
