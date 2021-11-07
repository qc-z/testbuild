import { stringify } from '@/utils/utils'
import { ElLoading } from 'element-plus'
import axios from 'axios'
import { API_HOST } from '@/constant'

export function useDownload(url, filename, params, method = 'get') {
  const loadingInstance = ElLoading.service({
    text: '正在导出中'
  })
  axios({
    method,
    url: `${API_HOST}${url}?${stringify(params)}`,
    headers: {
      Authorization: sessionStorage.getItem('token')
    },
    responseType: 'blob'
  }).then((res) => {
    if (!res.data) {
      Message.info(res.message)
      return
    }
    const content = res.data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = `${filename}.xlsx`
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, name)
    }
    loadingInstance.close()
  })
}
