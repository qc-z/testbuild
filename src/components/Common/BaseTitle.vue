<template>
  <div class="title">
    <div class="header">
      <div class="header-text">
        {{ title }}
      </div>
      <div class="header-count">
        <slot name="count"></slot>
      </div>

      <div class="header-button">
        <slot name="button"></slot>
      </div>
    </div>
    <div class="title-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String
})
const { title } = toRefs(props)
</script>

<style lang="scss" scoped>
.title {
  padding: 0 20px;
  height: 100%;
  background-color: #fff;
  .header {
    display: flex;
    flex-direction: column;
    // height: 100%;
    position: relative;
    &-text {
      font-family: PingFangSC-Medium;
      font-size: 18px;
      color: #333333;
      font-weight: 500;
      padding-left: 8px;
      position: relative;
      padding: 16px 20px 16px 8px;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0px;
        width: 3px;
        height: 18px;
        background-color: red;
        transform: translateX(0%) translateY(-50%);
        background-image: linear-gradient(180deg, #2f90f1 0%, #1a58d0 100%);
        border-radius: 8px;
      }
    }
    &-count {
      position: absolute;
      top: 50%;
      left: 100px;
      transform: translateX(0%) translateY(-50%);
      font-size: 14px;
    }
    &-button {
      position: absolute;
      top: 50%;
      right: 0px;
      transform: translateX(0%) translateY(-50%);
    }
  }
  &-content {
    flex: 1;
    height: calc(100% - 57px);
  }
}
</style>
