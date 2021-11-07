<template>
  <div class="my-filter">
    <el-form :inline="true" label-suffix=":" :model="query" size="small" ref="refForm">
      <el-form-item v-for="item in form" :key="item.value" :label="item.label" :prop="item.value">
        <el-input
          v-if="item.type === 'input'"
          v-model="query[item.value]"
          :placeholder="`请输入${item.placeholder || ''}`"
          clearable
        ></el-input>
        <el-select
          v-if="item.type === 'select'"
          v-model="query[item.value]"
          :placeholder="`请选择${item.placeholder || ''}`"
          clearable
          @change="submit"
        >
          <el-option
            v-for="option in item.options"
            :label="option.label"
            :value="option.value"
            :key="option.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-if="item.type === 'datePicker'"
          @change="submit"
          clearable
          :placeholder="item.placeholder"
          v-model="query[item.value]"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
        >
        </el-date-picker>
        <el-date-picker
          v-if="item.type === 'datetimerange'"
          :placeholder="item.placeholder"
          @change="submit"
          clearable
          v-model="query[item.value]"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        >
        </el-date-picker>
        <el-cascader
          v-if="item.type === 'cascader'"
          :ref="item.ref"
          clearable
          filterable
          v-model="query[item.value]"
          :options="item.options"
          :props="item.props"
          @change="submit"
          :show-all-levels="false"
        ></el-cascader>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit">查询</el-button>
        <el-button plain @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { filterParams } from '@/utils/utils'
const emits = defineEmits(['submit', 'reset'])
const props = defineProps({
  form: {
    type: Array,
    required: true
  }
})
let query = ref({})

const { form } = toRefs(props)
watch(form, (val) => {
  query.value = initModel(val)
})
/**
 * @description: 动态生成reactive数据
 * @param {*}
 * @return {*}
 */
function initModel(form) {
  const obj = {}
  for (const key in form) {
    const value = form[key].value
    const defaultProp = form[key].default ?? ''
    obj[value] = defaultProp
  }
  return obj
}

const refForm = ref(null)
/**
 * @description: 重置
 * @param {*}
 * @return {*}
 */
function reset() {
  refForm.value.resetFields()
  submit()
  emits('reset')
}
/**
 * @description: 提交
 * @param {*}
 * @return {*}
 */
function submit() {
  emits('submit', filterParams(query.value))
}
// 工具函数(今天以前的日期)
// function getTimeRange(time) {
//   return time.getTime() > Date.now()
// }
</script>

<style lang="scss" scoped>
$borderColor: #c1d7f3;
.my-filter {
  :deep(.el-form) {
    .el-form-item {
      margin-right: 6.2rem;
      &:nth-last-child(2) {
        margin-right: 4rem;
      }
      &:last-child {
        margin-right: 0px;
        float: right;
      }
    }
    .el-form-item__label {
      color: #666;
    }
    .el-input__inner,
    .el-date-editor--date {
      border-color: $borderColor;
      width: 11.5rem;
    }
    .el-date-editor--date {
      .el-input__suffix {
        display: none;
      }
    }
    .el-input__suffix {
      border-left: 1px solid $borderColor;
    }
    .el-range-editor--small {
      width: 23rem;
    }
    .el-icon-arrow-up {
      color: $borderColor;
    }
    .el-button {
      width: 68px;
    }
    .el-button--primary {
      background-image: linear-gradient(135deg, #1287ff 0%, #2261d5 100%);
    }
    .is-plain {
      color: #167cf3;
      border-color: #167cf3;
    }
    @media screen and (min-width: 1000px) and (max-width: 1600px) {
      .el-form-item {
        margin-right: 1.2rem;
      }
    }
    @media screen and (min-width: 600px) and (max-width: 1200px) {
      .el-form-item {
        margin-right: 1.2rem;
      }
      .el-input__inner {
        border-color: $borderColor;
        width: 160px;
      }
    }
  }
}
</style>
