<template>
  <div
    class="taskDetail"
    v-loading="initLoading"
    element-loading-text="数据加载中..."
    element-loading-spinner="el-icon-loading"
  >
    <div class="taskDetail-base">
      <el-row :gutter="18">
        <el-col :span="16">
          <BaseInfo :data="originData"></BaseInfo>
        </el-col>
        <el-col :span="4">
          <SecurityCount :count="originData?.abrs ?? '0'"></SecurityCount>
        </el-col>
        <el-col :span="4">
          <SecurityCharts ref="SecurityChartsRef"></SecurityCharts>
        </el-col>
      </el-row>
    </div>

    <div class="taskDetail-city">
      <BaseTitle title="各地市人员在控情况">
        <div class="wrapper">
          <template :span="3" v-for="item in citys" :key="item">
            <div class="wrapper-city" @click="chooseCity(item)">
              <TaskCitys
                :data="item"
                :selected="selectState.selected && selectState.areaCode === item.areaCode"
              ></TaskCitys>
            </div>
          </template>
        </div>
      </BaseTitle>
    </div>

    <div class="taskDetail-filter">
      <BaseTitle title="筛选条件">
        <BaseFilter :form="form" @submit="submit" @reset="reset"></BaseFilter>
      </BaseTitle>
    </div>
    <div class="taskDetail-table">
      <BaseTitle title="情况列表">
        <template #count>
          <div class="tools-count">
            共计 <span>{{ total }}</span> 条
          </div>
        </template>
        <template #button>
          <div class="tools-btn">
            <el-button
              size="small"
              plain
              v-for="item in btns"
              :type="item.type"
              :key="item.label"
              @click="operation(item.label)"
            >
              {{ item.label }}
            </el-button>
          </div>
        </template>
        <DetailTable ref="tableRef" @total-change="(value) => (total = value)"></DetailTable>
      </BaseTitle>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

import useTaskDetail from '@/use/useTaskDetail.js'
const {
  SecurityChartsRef,
  tableRef,
  initLoading,
  total,
  btns,
  form,
  selectState,
  originData,
  citys,
  submit,
  chooseCity,
  operation,
  reset,
  changeId
} = useTaskDetail()
let id
onActivated(() => {
  // console.log(route.query.id, 'route.query.id')
  // console.log(id, 'id')
  if (id !== route.query.id) {
    changeId(route.query.id)
    id = route.query.id
  }
})
</script>

<style lang="scss" scoped>
.taskDetail {
  &-base {
    width: 100%;
    // height: 178px;
    margin-bottom: 19px;
    .el-row {
      height: 100%;
    }
  }
  &-city {
    // height: 410px;
    margin-bottom: 19px;
    background-color: #fff;
    padding-bottom: 30px;
    .wrapper {
      display: flex;
      flex-wrap: wrap;

      &-city {
        height: 158px;
        // background-color: #f3f8ff;
        margin-bottom: 16px;
        margin-right: 16px;
        width: calc(12.5% - 18px);
      }
    }
  }
  &-filter {
    height: 110px;
    margin-bottom: 16px;
  }
  &-table {
    height: 626px;
    margin-bottom: 16px;
  }
}
</style>
