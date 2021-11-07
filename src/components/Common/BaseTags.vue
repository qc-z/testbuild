<template>
  <div class="tags">
    <ul>
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
        @click="goToLink(item)"
      >
        <!-- <router-link :to="item.path" class="tags-li-title">{{ item.title }}</router-link> -->

        <span>{{ item.title }}</span>
        <span class="tags-li-icon" @click.stop="closeTags(index)">
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <!-- <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script setup>
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
const route = useRoute(),
  router = useRouter(),
  tagsList = ref([])

onMounted(() => {
  const item = {
    name: route.name,
    title: route.meta.title,
    path: route.path,
    id: route.query.id
  }
  addTags(item)
})
const addTags = (item) => {
  tagsList.value.push(item)
}

// 关闭单个标签
const closeTags = (index) => {
  if (tagsList.value.length === 1) return
  tagsList.value.splice(index, 1)
  const item = tagsList.value[index] ? tagsList.value[index] : tagsList.value[index - 1]
  if (item) {
    route.path && router.push(item.path)
  } else {
    router.push('/')
  }
}
// 高亮标签
const isActive = (path) => {
  return path === route.path
}
//
// const store = useStore()
// const tagsList = computed(() => store.state.tagsList)
// const showTags = computed(() => tagsList.value.length > 0)

// 关闭单个标签
// const closeTags = (index) => {
//   if (tagsList.value.length === 1) return
//   const delItem = tagsList.value[index]
//   store.commit('delTagsItem', { index })
//   const item = tagsList.value[index] ? tagsList.value[index] : tagsList.value[index - 1]
//   if (item) {
//     delItem.path === route.path && router.push(item.path)
//   } else {
//     router.push('/')
//   }
// }

// 设置标签
// const setTags = (route) => {
//   const isExist = tagsList.value.some((item) => {
//     return item.path === route.path
//   })
//   //
//   //
//   //
//   if (!isExist) {
//     if (tagsList.value.length >= 8) {
//       store.commit('delTagsItem', { index: 0 })
//     }
//     store.commit('setTagsItem', {
//       name: route.name,
//       title: route.meta.title,
//       path: route.path,
//       id: route.query.id
//     })
//   }
// }
// setTags(route)
onBeforeRouteUpdate((to) => {
  const index = tagsList.value.findIndex((item) => item.path === to.path)

  // 不存在，push
  // 存在，替换id
  const item = {
    name: to.name,
    title: to.meta.title,
    path: to.path,
    id: to.query.id
  }
  if (index === -1) {
    tagsList.value.push(item)
  } else {
    tagsList.value.splice(index, 1, item)
  }
  // const item = {
  //   name: to.name,
  //   title: to.meta.title,
  //   path: to.path,
  //   id: to.query.id
  // }
  // !flag && tagsList.value.push(item)
})

// 关闭全部标签
// const closeAll = () => {
//   store.commit('clearTags')
//   router.push('/')
// }
// // 关闭其他标签
// const closeOther = () => {
//   const curItem = tagsList.value.filter((item) => {
//     return item.path === route.path
//   })
//   store.commit('closeTagsOther', curItem)
// }
// const handleTags = (command) => {
//   command === 'other' ? closeOther() : closeAll()
// }

const goToLink = (data) => {
  router.push({
    path: data.path,
    query: {
      id: data.id
    }
  })
}
// 关闭当前页面的标签页
// store.commit("closeCurrentTag", {
//     $router: router,
//     $route: route
// });
</script>

<style scoped>
.tags {
  position: relative;
  height: 30px;
  overflow: scroll;
  background: #dbdde8;
}

.tags ul {
  box-sizing: border-box;
  width: max-content;
  height: 100%;
}

.tags-li {
  font-family: PingFangSC-Regular;
  float: left;
  font-size: 14px;
  overflow: hidden;
  cursor: pointer;
  height: 100%;
  line-height: 30px;
  vertical-align: middle;
  color: #333;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
  background: #dbdde8;
  width: 260px;
  text-indent: 16px;
  border-right: 2px solid #e8ebf6;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #167cf3;
  background-color: #e8ebf6;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}
.tags-li-icon {
  float: right;
  margin-right: 10px;
}

.tags-li.active .tags-li-title {
  color: #167cf3;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
