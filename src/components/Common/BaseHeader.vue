<template>
  <div class="header">
    <div class="logo">
      <span class="title">admin</span>
    </div>
    <div class="tools">
      <img src="@/assets/img/系统设置-normal.png" alt="" @click="toLink('setting')" />
      <img src="@/assets/img/消息-normal.png" alt="" class="message" @click="toLink('message')" />
      <div class="badge">{{ message }}</div>

      <!-- 用户名下拉菜单 -->
      <el-dropdown class="user-name" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          {{ username }}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="user">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
// import { useRouter } from 'vue-router'
import { clearToken } from '@/utils/storage'

const message = ref('0'),
  username = ref('张三')
// router = useRouter()

const handleCommand = (command) => {
  if (command === 'loginout') {
    clearToken()
    // TODO: 跳转到登录页
  } else if (command === 'user') {
    console.log('跳转到个人中心')
    // TODO: 跳转到个人中心
    // router.push('/user')
  }
}
// 跳转
const toLink = (type) => {
  console.log(type)
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: flex-end;
  line-height: 50px;
  height: 100%;
  .logo {
    margin-right: auto;
    img {
      margin-right: 10px;
    }
    .title {
      font-size: 21px;
      font-family: PingFangSC-Medium;
      font-size: 21px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 500;
      vertical-align: super;
    }
  }
  .tools {
    position: relative;
    img {
      vertical-align: middle;
      cursor: pointer;
      margin-right: 20px;
      width: 18px;
      height: 16px;
    }
    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
    :deep(.user-name) {
      color: #fff;
    }

    .badge {
      position: absolute;
      top: 10px;
      left: 50px;
      // width: 12px;
      height: 12px;
      border-radius: 50%;
      font-size: 12px;
      line-height: 12px;
      background-color: red;
      padding: 2px 4px;
    }
  }
}
</style>
