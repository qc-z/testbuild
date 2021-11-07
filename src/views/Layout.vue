<template>
  <div class="layout">
    <el-container>
      <el-header height="50px">
        <BaseHeader></BaseHeader>
      </el-header>
      <el-container>
        <el-aside :width="asideWidth">
          <BaseSidebar @expand-change="(val) => (asideWidth = val)"></BaseSidebar>
        </el-aside>
        <el-main>
          <BaseTags></BaseTags>
          <div class="content">
            <router-view v-slot="{ Component }">
              <transition name="move" mode="out-in">
                <keep-alive>
                  <component :is="Component" />
                </keep-alive>
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
const asideWidth = ref('190px')
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  width: 100%;
  min-width: 1200px;

  > .el-container {
    height: 100%;
    width: 100%;
  }
  .el-container:not(.is-vertical) {
    height: calc(100% - 50px);
    width: 100%;
  }
  .el-aside {
    overflow: hidden;
    background-image: linear-gradient(179deg, #010225 0%, #022369 100%);
  }
  .el-header {
    background-color: #010225;
    color: #fff;
  }
  .el-main {
    padding: 0px;
    .content {
      width: 100%;
      height: calc(100% - 30px);
      padding: 16px;
      overflow-y: scroll;
      box-sizing: border-box;
      background-color: #f4f5f9;
    }
  }
}
</style>
