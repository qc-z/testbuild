<template>
  <div class="addTemplate">
    <div class="photo">
      <div class="img">
        <i class="el-icon-close" v-if="files.length !== 0 && !isReadonly" @click="deletePhoto"></i>
        <img
          src="@/assets/img/人物照片.png"
          width="110"
          alt=""
          v-if="files.length === 0"
          @click="toUpload"
          style="cursor: pointer"
        />
        <img :src="files[current - 1].base64" width="110" alt="" v-else />
      </div>
      <div class="operator">
        <el-row :gutter="20">
          <el-col :span="6">
            <img src="@/assets/img/向左-可点击normal.png" alt="" @click="toLeft" />
          </el-col>
          <el-col :span="12"> {{ current }}/{{ files.length }} </el-col>
          <el-col :span="6">
            <img src="@/assets/img/向右-可点击normal.png" alt="" @click="toRight" />
          </el-col>
        </el-row>
      </div>
      <el-upload
        :disabled="isReadonly"
        :show-file-list="false"
        :multiple="true"
        action=""
        accept="image/jpeg,image/gif,image/png"
        ref="uploadRef"
        class="my-upload"
        :auto-upload="false"
        :on-change="handleChange"
      >
        <el-button size="small" type="primary" v-if="!isReadonly">上传附件</el-button>
        <template #tip>
          <div class="el-upload__tip" v-if="!isReadonly">不超过<span>500kb</span></div>
        </template>
      </el-upload>
    </div>
    <div class="form">
      <el-form
        label-suffix=":"
        size="small"
        ref="formRef"
        :model="form"
        :disabled="isReadonly"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="sfzh">
              <el-input v-model="form.sfzh" maxlength="100" @change="IDblur"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="姓名" prop="xm">
              <el-input v-model="form.xm" maxlength="100"></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="lxdh">
              <el-input v-model="form.lxdh" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="风险等级" prop="aqfxdj">
              <el-select v-model="form.aqfxdj" placeholder="请选择">
                <el-option label="高" value="高"></el-option>
                <el-option label="中" value="中"></el-option>
                <el-option label="低" value="低"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="户籍地详情" prop="hjdxq">
              <el-input v-model="form.hjdxq" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="户籍派出所" prop="hjpcs">
              <el-input v-model="form.hjpcs" maxlength="100"></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="户籍地行政区划" prop="hjdzxzq">
              <el-input v-model="form.hjdzxzq" maxlength="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            ><el-form-item label="户籍所在地" prop="hjszd">
              <el-input v-model="form.hjszd" maxlength="100"></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20" v-if="route.name === 'myTask'">
          <el-col :span="24">
            <el-form-item label="新增原因描述" prop="xzyy">
              <el-input
                v-model="form.xzyy"
                type="textarea"
                maxlength="500"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getInfoByIdApi } from '@/api/task'
import { toRefs } from 'vue-demi'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { API_HOST } from '@/constant'

const props = defineProps({
  isReadonly: {
    type: Boolean,
    default: () => {
      return false
    }
  }
})
const { isReadonly } = toRefs(props)

const route = useRoute()

const form = reactive({
  aqfxdj: '低'
})
const idTest =
  /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/

const rules = {
  xm: [
    {
      required: true,
      message: '请输入名字',
      trigger: 'blur'
    }
  ],
  sfzh: [
    { required: true, message: '请填写身份证号', trigger: 'blur' },
    { pattern: idTest, message: '身份证号格式有误', trigger: 'blur' }
  ]
}
// 身份证回填信息
function IDblur(ID) {
  if (!idTest.test(ID)) return
  getInfoByIdApi({ sfzh: ID }).then((res) => {
    form.hjdxq = res.data?.hjdxq
    form.hjpcs = res.data?.hjpcs
    form.hjdzxzq = res.data?.hjdzxzq
    form.hjszd = res.data?.hjszd
    form.xm = res.data?.xm
    form.lxdh = res.data?.lxdh
  })
}
// 点击默认图片触发上传
const formRef = ref(null)
function submit() {
  return formRef?.value?.validate()
}

const current = ref(0)
const files = ref([])
// 文件上传变动
const handleChange = (file) => {
  if (file.size > 1024 * 500) {
    Message.error(`文件大小不能超过500kb`)
    return
  }
  var reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = function (e) {
    files.value.push({
      base64: e.target.result,
      file: file.raw
    })
    form.files = files.value
    current.value = files.value.length
  }
}

// 向左
function toLeft() {
  if (files.value.length === 0 || current.value === 1) return
  console.log(current.value)
  current.value--
}
// 向右
function toRight() {
  if (files.value.length === 0 || current.value === files.value.length) return
  current.value++
}
// 移除photo
function deletePhoto() {
  files.value.splice(current.value - 1, 1)
  current.value = files.value.length
}
const uploadRef = ref(null)
function toUpload() {
  uploadRef.value.uploadRef.handleClick()
}
const send = (data) => {
  Object.assign(form, data)
  data.fjs.forEach((item) => {
    const formData = new FormData()
    formData.append('downloadUrl', item.path)
    formData.append('fileName', item.filename)
    axios({
      method: 'post',
      url: API_HOST + '/jdab/downloadFile',
      headers: {
        Authorization: sessionStorage.getItem('token'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      responseType: 'blob',
      data: formData
    }).then((res) => {
      var reader = new FileReader()
      reader.readAsDataURL(res.data)
      reader.onloadend = function () {
        files.value.push({
          base64: reader.result
        })
        current.value = 1
      }
    })
  })
}
defineExpose({ submit, form, send })
</script>

<style lang="scss" scoped>
.addTemplate {
  width: 938px;
  // height: 264px;
  background: #ffffff;
  box-shadow: 0 0 8px 0 rgba(214, 232, 255, 0.5);
  border-radius: 4px;
  padding-bottom: 25px;
  margin: 20px 90px 25px 30px;
  display: flex;
  .photo {
    width: 110px;
    margin: 0 20px;
    .img {
      position: relative;
      margin-top: 21px;
      width: 110px;
      height: 130px;
      line-height: 130px;
      background: #eef2f9;
      border: 1px solid #d4dcea;
      border-radius: 4px;
      img {
        vertical-align: middle;
      }
      .el-icon-close {
        position: absolute;
        right: 5px;
        top: 5px;
        display: none;
        cursor: pointer;
        // width: 20px;
        // height: 20px;
        border-radius: 50%;
        background: #dee4f5;
      }
      &:hover {
        .el-icon-close {
          display: block;
        }
      }
    }
    .operator {
      height: 16px;
      margin-top: 6px;
      .el-col-12 {
        text-align: center;
      }
      img {
        cursor: pointer;
      }
    }
    .my-upload {
      margin-top: 10px;

      .el-button {
        width: 100%;
      }
      :deep(.el-upload) {
        width: 100%;
      }
      .el-upload__tip {
        text-align: center;
        span {
          font-size: 12px;
          color: #ff6600;
        }
      }
    }
  }
  .form {
    flex: 1;
    padding: 21px 0px;
    .el-row {
      height: 48px;
    }
    .el-input,
    .el-select {
      width: 230px;
    }
    :deep(.el-form) {
      .el-form-item__label {
        color: #666;
      }
    }
  }
}
</style>
