<template>
  <div class="security">
    <BaseTitle title="安保人数">
      <span v-for="(i, index) in props.count" :key="index" class="security-count">{{ i }}</span>
    </BaseTitle>
  </div>
</template>

<script setup>
/* API */
/* 组件 */

/* 功能 */
const props = defineProps({
  count: {
    type: String
  }
})
const { count } = toRefs(props)

const width = computed(() => {
  return `calc(${Math.ceil(100 / count.value.length) + '%'} - 5px)`
})
</script>

<style lang="scss" scoped>
.security {
  height: 100%;
  &-count {
    background-image: linear-gradient(180deg, #42d8fa 0%, #178cb3 100%);
    border-radius: 4px;
    width: v-bind(width);
    height: 49px;
    line-height: 49px;
    display: inline-block;
    margin-right: 4px;
    text-align: center;
    font-family: Impact;
    font-size: 26px;
    color: #ffffff;
    font-weight: 900;
    margin-top: 25px;
  }
}
</style>
