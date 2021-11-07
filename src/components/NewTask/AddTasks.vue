<template>
  <el-dialog :title="title" v-model="dialogVisible" width="804px" v-if="dialogVisible">
    <div
      v-loading="loading"
      element-loading-text="数据加载中..."
      element-loading-spinner="el-icon-loading"
    >
      <BaseTitle title="任务信息">
        <el-form
          label-suffix=":"
          size="small"
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任务名称" prop="rwmc">
                <el-input v-model="form.rwmc" maxlength="100" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"
              ><el-form-item label="安保区域" prop="abqy">
                <!-- <el-input v-model="form.abqy" maxlength="100" show-word-limit></el-input> -->
                <el-cascader
                  filterable
                  v-model="form.abqy"
                  :options="abqyOptions"
                  :props="{ label: 'name', value: 'id', emitPath: false, checkStrictly: true }"
                  :show-all-levels="false"
                ></el-cascader> </el-form-item
            ></el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="rwkssj" label="开始时间">
                <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="form.rwkssj"
                  :disabled-date="getTimeRangeStar"
                  type="datetime"
                  placeholder="开始时间"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rwjssj" label="结束时间">
                <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="form.rwjssj"
                  :disabled-date="getTimeRangeEnd"
                  type="datetime"
                  placeholder="结束时间"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="任务描述" prop="rwnr">
            <el-input
              v-model="form.rwnr"
              type="textarea"
              maxlength="500"
              show-word-limit
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-form-item>
        </el-form>
      </BaseTitle>
      <BaseTitle title="附件信息">
        <el-upload
          multiple
          action=""
          ref="uploadRef"
          class="my-upload"
          :on-remove="handleChange"
          :auto-upload="false"
          :on-change="handleChange"
          :file-list="fileList"
        >
          上传附件: <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>
      </BaseTitle>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm" size="small" :disabled="loading"
          >保存</el-button
        >
        <el-button @click="dialogVisible = false" size="small">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { addTaskApi, taskDetailApi, uploadListApi } from '@/api/task'
const abqyOptions = inject('abqyOptions')
const emits = defineEmits(['reload-table'])

const dialogVisible = ref(false),
  title = ref('新建任务'),
  fileList = ref([]),
  loading = ref(false)
// 弹窗打开
function closed(state = true, id) {
  dialogVisible.value = state
  id && init(id)
}
// 回调数据
function init(id) {
  loading.value = true
  title.value = '编辑任务'
  taskDetailApi(id)
    .then((res) => {
      const { rwmc, abqy, rwkssj, rwjssj, rwnr, files } = res.data
      Object.assign(form, { rwmc, abqy, rwkssj, rwjssj, rwnr, id })
      fileList.value = files.map((n) => {
        return {
          name: n.filename,
          id: n.id
        }
      })
      filesRef = fileList.value.map((n) => n.id ?? n.raw)
    })
    .finally(() => {
      loading.value = false
    })
}

let form = reactive({
  rwmc: '',
  abqy: '',
  rwkssj: '',
  rwjssj: '',
  rwnr: ''
})
const rules = {
  rwmc: [
    {
      required: true,
      message: '请输入任务名称',
      trigger: 'blur'
    }
  ],
  abqy: [
    {
      required: true,
      message: '请选择安保区域',
      trigger: 'change'
    }
  ],
  rwkssj: [
    {
      type: 'date',
      required: true,
      message: '请选择开始时间',
      trigger: 'change'
    }
  ],
  rwjssj: [
    {
      type: 'date',
      required: true,
      message: '请选择开始时间',
      trigger: 'change'
    }
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change'
    }
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change'
    }
  ],
  rwnr: [
    {
      required: true,
      message: '请输入任务任务描述',
      trigger: 'blur'
    }
  ]
}
let filesRef = []
// 文件上传变动
const handleChange = (file, fileList) => {
  filesRef = fileList.map((n) => n.id ?? n.raw)
}
// 表单实例
const formRef = ref(null)

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true

      const data = new FormData()
      for (const item in filesRef) {
        const type = typeof filesRef[item] === 'string' ? 'fileid' : 'file'
        data.append(type, filesRef[item])
      }
      for (const item in form) {
        data.append(item, form[item])
      }

      const api = title.value === '编辑任务' ? uploadListApi : addTaskApi
      api(data)
        .then(() => {
          Message.success(title.value + '成功')
          emits('reload-table')
          dialogVisible.value = false
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
// 开始时间限制
function getTimeRangeStar(time) {
  if (form.rwjssj) {
    return time.getTime() >= new Date(form.rwjssj).getTime()
  }
}
// 结束时间限制
function getTimeRangeEnd(time) {
  if (form.rwkssj) {
    return time.getTime() <= new Date(form.rwkssj).getTime()
  }
}
defineExpose({ closed })
</script>

<style lang="scss" scoped>
.my-upload {
  :deep(.el-upload-list) {
    margin-left: 65px;
    .el-upload-list__item {
      width: 220px;
      display: inline-block;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #c1d7f3;
      margin-right: 10px;
      .el-upload-list__item-name {
        color: #167cf3;
      }
    }
  }
}
.demo-ruleForm {
  :deep(.el-cascader) {
    width: 100%;
  }
}
</style>
