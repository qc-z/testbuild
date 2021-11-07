<template>
  <el-dialog title="核查详情" v-model="dialogVisible" width="956px" v-if="dialogVisible">
    <div
      class="verification"
      v-loading="loading"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-row>
        <el-col :span="4"> </el-col>
        <el-col :span="20">
          <el-timeline>
            <el-timeline-item
              hollow
              :type="index === 0 ? 'warning' : 'primary'"
              v-for="(i, index) in data"
              :key="i"
            >
              <div class="timestamp">
                <span class="timestamp-year" :class="{ 'last-year': index === 0 }">{{
                  i.hcsj.split(' ')[0]
                }}</span>
                <span class="timestamp-time">{{ i.hcsj.split(' ')[1] }}</span>
              </div>
              <div class="content">
                <el-row>
                  <el-col :span="12">核查单位：{{ i.hcdw }}</el-col>
                  <el-col :span="12">核查填报人：{{ i.hctbr }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">所在位置：{{ i.szwz }}</el-col>
                  <el-col :span="12">行程意向：{{ i.xcyx }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">配合情况：{{ i.phqk }}</el-col>
                  <el-col :span="12" v-if="i.skyy">失控原因：{{ i.skyy }}</el-col>
                </el-row>
                <div class="content-state" :class="{ 'content-under': i.gkqk === '在控' }">
                  {{ i.gkqk }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="dialogVisible = false" size="small" plain type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { addTaskHistoryApi } from '@/api/task-detail'
const dialogVisible = ref(false),
  loading = ref(false),
  data = ref()
// 弹窗打开
function closed(state = true, row) {
  dialogVisible.value = state
  init(row.id)
}

const init = (id) => {
  loading.value = true
  addTaskHistoryApi({ ryid: id })
    .then((res) => {
      data.value = res.data
      console.log(res)
    })
    .finally(() => {
      loading.value = false
    })
}

defineExpose({ closed })
</script>

<style lang="scss" scoped>
.el-timeline-item {
  position: relative;

  .timestamp {
    position: absolute;
    top: 0px;
    left: -130px;
    &-year {
      font-family: Impact;
      font-size: 14px;
      color: #666666;
      font-weight: 900;
      margin-right: 5px;
    }
    .last-year {
      color: #fe9b30;
    }

    &-time {
      font-size: 14px;
      font-family: Impact;
      color: #b0b8cf;
      letter-spacing: 0;
      line-height: 14px;
      font-weight: 900;
    }
  }
  .content {
    background: #eef2f9;
    border-radius: 4px;
    height: 125px;
    padding: 20px 40px 20px 70px;
    .el-row {
      &:first-child {
        .el-col {
          border-bottom: 1px solid #dee4f5;
          color: #333;
          font-weight: bold;
        }
      }
      .el-col {
        line-height: 42px;
        color: #666;
      }
    }
    &-state {
      position: absolute;
      left: 48px;
      top: 30px;
      padding: 1px 3px;
      background: #f57500;
      color: #fff;
    }
    &-under {
      background: #e70000;
    }
  }
}
.verification {
  max-height: 500px;
  overflow-y: scroll;
}
</style>
