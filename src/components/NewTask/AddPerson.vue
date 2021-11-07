<template>
  <div class="addPerson">
    <el-dialog title="新增人员" v-model="dialogVisible" width="1058px">
      <template v-for="(i, index) in lists" :key="i.id">
        <div class="person-form">
          <PersonTemplate :ref="setItemRef"></PersonTemplate>
          <div class="operator-btn">
            <img
              src="@/assets/img/person-add.png"
              width="16"
              alt=""
              style="margin-right: 8px"
              v-if="index === lists.length - 1"
              @click="addPersonForm"
            />
            <img
              src="@/assets/img/person-delete.png"
              width="16"
              alt=""
              v-if="index !== 0"
              @click="removePersonForm(index)"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="submitForm" size="small" :loading="loadingForm"
            >提交审批</el-button
          >
          <el-button @click="dialogVisible = false" size="small">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/* 组件 */
/* 功能模块 */
import useAddPerson from '@/use/useAddPerson'
const emits = defineEmits(['reload-table'])
// url框编辑下的相关变量及功能
const {
  dialogVisible,
  lists,
  loadingForm,
  setItemRef,
  submitForm,
  closed,
  addPersonForm,
  removePersonForm
} = useAddPerson(emits)

defineExpose({ closed })
</script>

<style lang="scss" scoped>
.addPerson {
  padding-right: 100px;
  .person-form {
    position: relative;
    .operator-btn {
      position: absolute;
      // transform: translateX(0%) translateY(-50%);

      right: 0%;
      top: 50%;
      cursor: pointer;
    }
  }
  :deep(.el-dialog__body) {
    max-height: 620px;
    overflow-y: scroll;
  }
}
.el-dialog {
  :deep(.el-dialog__footer) {
    text-align: center;
  }
}
</style>
