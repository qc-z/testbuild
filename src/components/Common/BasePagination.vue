<template>
  <div class="my-pagination">
    <el-pagination
      v-bind="$attrs"
      layout="sizes, prev, pager, next, jumper,total,slot"
      popper-class="select_bottom"
    >
      <span class="pages-current">
        当前显示
        <b style="color: #167cf3">{{ $attrs['current-page'] }}</b
        >/
        <b>{{ Math.ceil($attrs.total / $attrs['page-size']) }}</b>
        页
      </span>
      <span class="pages-sure" @click="submit">确定</span>
    </el-pagination>
  </div>
</template>

<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()

const emits = defineEmits(['page-change'])
function submit() {
  emits('page-change', attrs[['page-size']])
}
</script>

<style lang="scss" scoped>
.my-pagination {
  // margin-top: 1rem;
  height: 58px;
  width: 100%;
  padding-top: 20px;
  :deep(.el-pagination) {
    text-align: right;
    position: relative;
    .el-input__inner {
      background-color: #fff;
      font-size: 0.6rem;
      color: #333;
      border: 1px solid #5699f7;
      border-radius: 2px;
    }
    .el-pagination__total {
      font-size: 14px;
      color: #333;
    }
    .el-pagination__sizes {
      position: absolute;
      left: 0px;
    }
    .el-pagination__total {
      position: absolute;
      left: 250px;
    }
    .pages-current {
      position: absolute;
      left: 130px;
      color: #333;
    }
    .el-pager {
      .number {
        color: #333;
      }
      .active {
        background: #64abf7;
        border-radius: 2px;
        color: #fff;
      }
    }

    .btn-prev,
    .btn-next,
    .el-icon-more,
    .el-pagination__jump {
      color: #333;
    }
    .el-pagination__jump {
      margin-right: 1rem;
      .el-input__inner {
        // height: 1.1rem;
      }
    }
    .pages-sure {
      color: #64abf7;
      // line-height: 1.1rem;
      border: 1px solid #64abf7;
      border-radius: 2px;
      text-align: center;
      vertical-align: middle;
      padding: 0px 14px;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss">
.select_bottom {
  .el-scrollbar__wrap {
    // background-color: #032e77;
    border: #032e77;
  }
  .el-select-dropdown__item {
    // color: #fff;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item.selected {
    // background-color: #0c6bb7;
    // color: #fff;
  }
}
</style>
