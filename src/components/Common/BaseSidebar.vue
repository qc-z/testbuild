<template>
  <div class="collapse-btn" @click="isCollapse = !isCollapse">
    <i v-if="!isCollapse" class="el-icon-s-fold"></i>
    <i v-else class="el-icon-s-unfold"></i>
  </div>
  <el-menu
    :default-openeds="['1']"
    :default-active="active"
    class="el-menu-vertical-demo"
    background-color="transparent"
    :collapse="isCollapse"
    unique-opened
    router
  >
    <el-sub-menu index="1">
      <template #title>
        <img src="@/assets/img/admin-click.png" alt="" />
        <span>admin</span>
      </template>
      <el-menu-item index="/">one</el-menu-item>
      <el-menu-item index="personnel-approval">two</el-menu-item>
      <el-menu-item index="my-task">three</el-menu-item>
      <el-menu-item index="history-record">fourth</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const emits = defineEmits(['expand-change'])

const isCollapse = ref(false)
const active = ref('')

watch(isCollapse, (val) => {
  emits('expand-change', val ? '63px' : '190px')
})
function toggleActive() {
  active.value = route.path.split('/')[1] || '/'
}

watch(
  route,
  () => {
    toggleActive()
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.collapse-btn {
  cursor: pointer;
  color: #fff;
  height: 35px;
  margin-left: 27px;
}
.el-menu {
  border-right: solid 1px #3f51b5;
  .el-menu-item {
    color: #62a8ff;
    padding-left: 55px !important;
    border-bottom: 1px solid;
    border-image: linear-gradient(90deg, #5275ca 0%, #010d4c 100%) 1 1;
    &.is-active {
      color: #fff;
      &:after {
        content: '';
        position: absolute;
        top: 0px;
        left: 0px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #fff;
        left: 33px;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
    }
    &:hover {
      background-color: #5275ca;
      color: #fff;
      // background-image: linear-gradient(90deg, #5275ca 0%, #010d4c 100%);
    }
  }
  :deep(.el-sub-menu__title) {
    color: #9fcbff;
    opacity: 0.68;
    background-image: linear-gradient(90deg, #5275ca 0%, #010d4c 100%);
    span {
      margin-left: 11px;
    }
    img {
      margin-left: 7px;
    }
  }
  :deep(.el-sub-menu__icon-arrow) {
    display: none;
  }
}
</style>
<style>
.el-popper:not(.el-select__popper, .el-picker__popper, .el-cascader__dropdown) {
  background-color: #010d4c !important;
}
</style>
