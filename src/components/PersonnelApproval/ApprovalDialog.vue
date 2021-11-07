<template>
  <el-dialog title="审批" v-model="dialogVisible" width="1058px" v-if="dialogVisible">
    <div
      class="verification"
      v-loading="loading"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <BaseTitle title="人员信息">
        <PersonTemplate ref="PersonTemplateRef" is-readonly></PersonTemplate>
      </BaseTitle>
      <el-form
        label-suffix=":"
        size="small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <BaseTitle title="新增原因描述信息">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="新增单位" prop="cjdw">
                <el-input v-model="form.cjdw" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="6">
              <el-form-item label="负责人" prop="cjr">
                <el-input v-model="form.cjr" disabled> </el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="22">
              <el-form-item label="新增原因描述" prop="xzyy">
                <el-input
                  disabled
                  v-model="form.xzyy"
                  type="textarea"
                  show-word-limit
                  :autosize="{ minRows: 4, maxRows: 10 }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </BaseTitle>
        <BaseTitle title="审批信息">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="审批单位" prop="spdw">
                <el-input v-model="form.spdw" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="6">
              <el-form-item label="负责人" prop="spr">
                <el-input v-model="form.spr" disabled> </el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="审批描述" prop="spyj">
                <el-input
                  :disabled="row.type === 1"
                  v-model="form.spyj"
                  type="textarea"
                  show-word-limit
                  :autosize="{ minRows: 4, maxRows: 10 }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="2">
              <el-form-item label="审批结果" prop="spzt">
                <el-select
                  v-model="form.spzt"
                  placeholder="请选择审批结果"
                  :disabled="row.type === 1"
                >
                  <el-option
                    v-for="option in resultOptions"
                    :label="option.name"
                    :value="option.code"
                    :key="option.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </BaseTitle>
      </el-form>
    </div>
    <template #footer>
      <div style="text-align: center">
        <el-button
          @click="submitForm"
          size="small"
          type="primary"
          v-if="row.type === 0"
          :loading="loading"
          >确定</el-button
        ><el-button @click="dialogVisible = false" size="small" plain type="primary"
          >关闭</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getMyTaskDetailApi } from '@/api/my-task'
import { getApprovalApi } from '@/api/personnel-approval'
const emits = defineEmits(['reload-table'])

const dialogVisible = ref(false),
  loading = ref(false),
  PersonTemplateRef = ref(null),
  row = ref(null),
  resultOptions = ref([
    {
      name: '已通过',
      code: '已通过'
    },
    {
      name: '未通过',
      code: '未通过'
    }
  ])

// 弹窗打开
function closed(state = true, res) {
  dialogVisible.value = state
  if (res.type === 0) {
    form.spzt = ''
  }
  row.value = res
  loading.value = true
  getMyTaskDetailApi(res.id)
    .then(({ data }) => {
      formRef.value.resetFields()
      const { cjdw, cjr, xzyy, spdw, spr, spyj, spzt } = data

      Object.assign(
        form,
        { cjdw, cjr, xzyy, spdw, spr, spyj },
        row.value.type === 1 ? { spzt } : {}
      )
      PersonTemplateRef.value.send(data)
    })
    .finally(() => {
      loading.value = false
    })
}

const form = reactive({})
const rules = {
  spzt: [
    {
      required: true,
      message: '请选择审批结果',
      trigger: 'change'
    }
  ]
}

// 表单实例
const formRef = ref(null)

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      getApprovalApi({ spzt: form.spzt, spyj: form.spyj, id: row.value.id })
        .then(() => {
          Message.success('审批成功')
          formRef.value.resetFields()
          emits('reload-table')
          dialogVisible.value = false
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
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
  .el-select {
    width: 100%;
  }
}
</style>
