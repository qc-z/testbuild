<template>
  <div class="approval">
    <BaseTitle title="筛选条件"> </BaseTitle>

    <el-tabs type="card">
      <el-tab-pane v-for="item in components" :key="item.name" size="small">
        <template #label>
          <span> {{ item.name }} </span>
        </template>
        <keep-alive>
          <component :is="item.component" v-bind="item.props"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import ApprovalContent from '@/components/PersonnelApproval/ApprovalContent'
import { getAreaDictApi } from '@/api/task'

const components = computed(() => {
  return [
    {
      name: '全部',
      component: ApprovalContent,
      props: {
        type: '',
        gkdOptions: gkdOptions.value,
        fileName: '全部审批人员'
      }
    },
    {
      name: '待审批',
      component: ApprovalContent,
      props: {
        type: '待审批',
        gkdOptions: gkdOptions.value,
        fileName: '待审批人员'
      }
    },
    {
      name: '已审批',
      component: ApprovalContent,
      props: {
        type: '已通过',
        gkdOptions: gkdOptions.value,
        fileName: '已通过人员'
      }
    }
  ]
})
const gkdOptions = ref([])

onMounted(async () => {
  const res = await getAreaDictApi({ areaCode: '0' })
  gkdOptions.value = res.data
})
</script>

<style lang="scss" scoped>
.approval {
  height: 100%;
  width: 100%;
  > .title {
    height: 55px;
  }
  :deep(.my-filter) {
    background-color: #fff;
    padding: 20px 20px 0px 20px;
  }
  :deep(.el-tabs) {
    height: calc(100% - 55px);
    .el-tabs__content {
      height: calc(100% - 40px);
      .el-tab-pane {
        height: 100%;
      }
    }
    .el-tabs__header {
      background-color: #fff;
      margin-bottom: 0px;
      border-color: #fff;
      padding-left: 20px;
    }
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      color: #666;

      &.is-active {
        background-image: linear-gradient(135deg, #1287ff 0%, #2261d5 100%);
        color: #fff;
        border-bottom: 1px solid transparent;
      }
    }
    .el-tabs__nav {
      border-color: #c1d7f3;
      border-bottom: 1px solid #c1d7f3;
      border-radius: 4px;
    }
  }
}
</style>
