<template>
  <div class="city" :class="{ city__select: selected }">
    <div class="city-header">
      <img src="@/assets/img/位置normal.png" alt="" />
      {{ data.area || '-' }}
    </div>
    <div class="city-item">
      <span class="city-item">总人数</span>
      <span class="city-item__count">{{ data.zrs }}人</span>
    </div>
    <div class="city-item">
      <span>在控人数</span>
      <span class="city-item__count orange">{{ data.zkrs }}人</span>
    </div>
    <div class="city-item">
      <span>未反馈</span>
      <span class="city-item__count red">{{ data.wfk }}人</span>
    </div>
  </div>
</template>

<script setup>
/* API */
/* 组件 */
/* 功能 */
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  selected: {
    type: Boolean,
    default: false
  }
})
const { data } = toRefs(props)
</script>

<style lang="scss" scoped>
.city {
  padding: 0.85rem;
  height: 100%;
  box-sizing: border-box;
  background: #f3f8ff;
  border: 1px solid #c1d7f3;
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    background-image: linear-gradient(180deg, #208eff 0%, #306edf 100%);
    box-shadow: 0 1px 6px 0 rgba(29, 98, 213, 0.68);
    .city-header {
      color: #fff;
      img {
        content: url('../../assets/img/位置-click.png');
      }
    }
    .city-item {
      color: #fff;
      .city-item__count {
        color: #fff;
      }
    }
  }
  &-header {
    font-size: 0.8rem;
    font-family: PingFangSC-Medium;
    font-size: 0.8rem;
    color: #1975eb;
    font-weight: 500;
    margin-bottom: 0.15rem;
    img {
      vertical-align: middle;
      margin-right: 0.5rem;
    }
  }
  &-item {
    font-size: 0.8rem;
    font-family: PingFangSC-Regular;
    color: #1975eb;
    line-height: 1.7rem;
    font-weight: 400;
    display: flex;
    &__count {
      flex: 1;
      text-align: right;
      font-family: Impact;
      font-size: 0.8rem;
      text-align: right;
      font-weight: 900;
    }
    .orange {
      color: #f57500;
    }
    .red {
      color: #e70000;
    }
  }
}
.city__select {
  background-image: linear-gradient(180deg, #208eff 0%, #306edf 100%);
  box-shadow: 0 1px 6px 0 rgba(29, 98, 213, 0.68);
  .city-header {
    color: #fff;
    img {
      content: url('../../assets/img/位置-click.png');
    }
  }
  .city-item {
    color: #fff;
    .city-item__count {
      color: #fff;
    }
  }
}
@media screen and (min-width: 1000px) and (max-width: 1600px) {
  .city-header {
    img {
      width: 13px;
      margin-right: 0px;
    }
    font-size: 14px;
    margin-bottom: 10px;
  }
  .city-item {
    line-height: 35px;
  }
}
</style>
