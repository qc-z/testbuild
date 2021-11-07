<template>
  <el-dialog :title="title" v-model="dialogVisible" width="804px" v-if="dialogVisible">
    <div
      v-loading="loading"
      element-loading-text="提交中..."
      element-loading-spinner="el-icon-loading"
    >
      <el-form
        label-suffix=":"
        size="small"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <BaseTitle title="基本信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="安保对象" prop="abdx">
                <el-input v-model="form.abdx" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行程意向" prop="xcyx">
                <el-input
                  v-model="form.xcyx"
                  maxlength="100"
                  show-word-limit
                ></el-input> </el-form-item
            ></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="失控理由" prop="skyy">
                <el-select v-model="form.skyy" placeholder="请选择">
                  <el-option
                    v-for="option in skyyOptions"
                    :label="option.name"
                    :value="option.code"
                    :key="option.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="管控情况" prop="gkqk">
                <el-select v-model="form.gkqk" placeholder="请选择">
                  <el-option
                    v-for="option in gkqkOptions"
                    :label="option.name"
                    :value="option.code"
                    :key="option.name"
                  ></el-option>
                </el-select> </el-form-item
            ></el-col>
          </el-row>

          <el-form-item label="所在位置" prop="szwz">
            <el-input v-model="form.szwz" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="配合情况" prop="phqk">
            <el-input
              v-model="form.phqk"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-form-item>
        </BaseTitle>
        <BaseTitle title="核查信息">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="hcsj" label="核查时间">
                <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="form.hcsj"
                  type="datetime"
                  placeholder="核查时间"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="hctbr" label="核查填报人">
                <el-input v-model="form.hctbr" maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="fksj" label="反馈时间">
                <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="form.fksj"
                  type="datetime"
                  placeholder="核查时间"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row> -->
        </BaseTitle>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="submitForm" size="small" :disabled="loading"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false" size="small">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { getDictApi } from '@/api/task-detail'
import { addTaskRecordApi } from '@/api/task-detail'
const emits = defineEmits(['reload-table'])

const dialogVisible = ref(false),
  title = ref('新增核查记录'),
  loading = ref(false),
  skyyOptions = ref([]),
  gkqkOptions = ref([])
// 弹窗打开
function closed(state = true, row) {
  dialogVisible.value = state
  form.id = row.id
  form.abdx = row.xm
  getDictApi({ parentId: '3038' }).then(({ data }) => {
    gkqkOptions.value = data
  })

  getDictApi({ parentId: '3041' }).then(({ data }) => {
    skyyOptions.value = data
  })
}

const form = reactive({})
const rules = {
  xcyx: [
    {
      required: true,
      message: '请输入行程意向',
      trigger: 'blur'
    }
  ],
  szwz: [
    {
      required: true,
      message: '请输入所在位置',
      trigger: 'blur'
    }
  ],
  gkqk: [
    {
      required: true,
      message: '请选择管控情况',
      trigger: 'change'
    }
  ],
  phqk: [
    {
      required: true,
      message: '请输入配合情况',
      trigger: 'blur'
    }
  ],
  hctbr: [
    {
      required: true,
      message: '请输入核查填报人',
      trigger: 'blur'
    }
  ]
}

// 表单实例
const formRef = ref(null)

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      addTaskRecordApi(form)
        .then(() => {
          Message.success('新增成功')

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
.demo-ruleForm {
  :deep(.el-select) {
    width: 100%;
  }
  :deep(.dialog-footer) {
    text-align: center;
  }
}
</style>
