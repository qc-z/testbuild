<template>
  <el-dialog title="查看" v-model="dialogVisible" width="1058px" v-if="dialogVisible">
    <div
      class="verification"
      v-loading="loading"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <BaseTitle title="人员信息">
        <PersonTemplate ref="PersonTemplateRef" is-readonly></PersonTemplate>
      </BaseTitle>
      <BaseTitle title="审批信息">
        <el-row>
          <el-col :span="4"> </el-col>
          <el-col :span="20">
            <el-timeline>
              <el-timeline-item
                hollow
                :type="index === 0 ? 'warning' : 'primary'"
                v-for="(i, index) in timeData"
                :key="i"
              >
                <div class="timestamp">
                  <span
                    class="timestamp-year"
                    :class="{ 'last-year': index === 0 }"
                    v-if="String(i.spsj)?.split(' ')[0] !== 'null'"
                    >{{ String(i.spsj)?.split(' ')[0] }}</span
                  >
                  <span class="timestamp-time">{{ String(i.spsj)?.split(' ')[1] }}</span>
                </div>
                <div class="content">
                  <el-row>
                    <el-col :span="12">审批人：{{ i.spr || '-' }}</el-col>
                    <el-col :span="12">审批单位：{{ i.spdw || '-' }}</el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">审批意见：{{ i.spyj || '-' }}</el-col>
                  </el-row>
                  <div class="content-state" :class="{ 'content-dp': i.spzt === '未审批' }">
                    {{ i.spzt }}
                  </div>
                  <div class="content-state" :class="{ 'content-tg': i.spzt === '已通过' }">
                    {{ i.spzt }}
                  </div>
                  <div class="content-state" :class="{ 'content-bh': i.spzt === '未通过' }">
                    {{ i.spzt }}
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </el-col>
        </el-row>
      </BaseTitle>
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="dialogVisible = false" size="small" plain type="primary">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getMyTaskDetailApi } from '@/api/my-task'

const dialogVisible = ref(false),
  loading = ref(false),
  timeData = ref([]),
  PersonTemplateRef = ref(null)

// 弹窗打开
function closed(state = true, id) {
  dialogVisible.value = state
  getMyTaskDetailApi(id).then(({ data }) => {
    timeData.value = []
    timeData.value.push({
      spr: data.spr,
      spsj: data.spsj,
      spdw: data.spdw,
      spzt: data.spzt,
      spyj: data.spyj
    })
    PersonTemplateRef.value.send(data)
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
    left: -162px;
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
    margin-right: 50px;
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
      left: 42px;
      top: 30px;
      padding: 1px 3px;
      background: #f57500;
      color: #fff;
    }
    &-under {
      background: #e70000;
    }
    &-dp {
      background: #1bc2a0;
    }
    &-tg {
      background: #167cf3;
    }
    &-bh {
      background: #f57500;
    }
  }
}
.verification {
  height: 500px;
  overflow-y: scroll;
  .addTemplate {
    margin: 0px;
  }
  .title {
    height: auto;
    margin-bottom: 20 px;
  }
}
</style>
