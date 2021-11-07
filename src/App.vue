<template>
  <div id="app">
    <ElConfigProvider :locale="locale">
      <router-view></router-view>
    </ElConfigProvider>
  </div>
</template>
<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const locale = zhCn
function initFontSize() {
  const container = document.getElementById('app')
  if (!container) return
  const width = container.offsetWidth
  document.getElementsByTagName('html')[0].style.fontSize = Math.ceil(width / 100) + 'px'
}

initFontSize()
window.onresize = () => {
  initFontSize()
}
</script>
<style></style>
