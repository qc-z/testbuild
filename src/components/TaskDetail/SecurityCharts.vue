<template>
  <div class="charts">
    <BaseTitle title="在控情况">
      <div ref="myEcharts" class="myEcharts"></div>
    </BaseTitle>
  </div>
</template>

<script setup>
/* API */
import * as echarts from 'echarts'
/* 组件 */

/* 功能 */

let echart = echarts
let colorSet = '#1975EB'
const myEcharts = ref(null)
const count = ref(0)
const option = computed(() => {
  return {
    backgroundColor: '#fff',
    xAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    yAxis: {
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      axisLine: {
        show: false
      }
    },
    series: [
      {
        name: '内部进度条',
        type: 'gauge',
        center: ['50%', '50%'],
        radius: '100%',
        splitNumber: 10,
        axisLine: {
          lineStyle: {
            color: [
              [0.5, '#FB3E1F'],
              [0.5, '#fff'],
              [0.52, '#fff'],
              [0.92, '#1975EB'],
              [0.92, '#fff'],
              [0.94, '#fff'],
              [1, '#01B178']
            ],
            width: 10
          }
        },
        z: 4,
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        itemStyle: {
          color: colorSet
        },
        detail: {
          show: true,
          fontSize: 18,
          offsetCenter: ['8%', '75%'],
          valueAnimation: true,
          color: '#1975EB',
          formatter: function (value) {
            return value + '%'
          }
        },
        label: {
          show: false
        },

        title: {
          //标题
          show: false,
          offsetCenter: ['0%', '70%'], // x, y，单位px
          axisName: {
            color: '#1975EB',
            fontSize: 18, //表盘上的标题文字大小
            fontWeight: 900,
            fontFamily: 'PingFangSC'
          }
        },
        data: [
          {
            name: count.value + '%',
            value: count.value
          }
        ],
        pointer: {
          show: true,
          length: '40%',
          radius: '120%',
          width: 4
        }
      },
      {
        //指针上的圆
        type: 'pie',
        tooltip: {
          show: false
        },
        z: 5,
        emphasis: { scale: false },
        legendHoverLink: false,
        radius: ['0%', '6%'],
        center: ['50%', '50%'],
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 10,
            itemStyle: {
              color: colorSet
            }
          }
        ]
      },
      // 外一层圈
      {
        type: 'pie',
        radius: '60%',
        startAngle: 220,
        endAngle: -40,
        emphasis: { scale: false },
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 1
          }
        ],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#17A1FF'
              },
              {
                offset: 1,
                color: 'rgba(17, 90, 233, 0.16)'
              }
            ]
          },
          opacity: 0.12
        }
      },
      // 内圆
      {
        type: 'pie',
        radius: ['0', '50%'],
        center: ['50%', '50%'],
        emphasis: { scale: false },
        z: 3,
        data: [
          {
            value: count.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#23A6FF'
                },
                {
                  offset: 1,
                  color: '#F6F9FD'
                }
              ]),
              opacity: 0.59
            },
            label: {
              show: false
            }
          }
        ],
        labelLine: {
          show: false
        }
      }
    ]
  }
})
const init = (num) => {
  count.value = num
  initChart(option.value)
}
// watch(
//   () => props.count,
//   (count, prevCount) => {
//     console.log('count', count)
//     console.log('prevCount', prevCount)
//     // initChart(option.value)
//   }
// )
const chart = ref(null)
// 基础配置一下Echarts
function initChart(option) {
  if (chart.value) {
    chart.value.dispose()
  }
  chart.value = echart.init(myEcharts.value)
  chart.value.resize()

  // 把配置和数据放这里
  chart.value.setOption(option)
  window.onresize = function () {
    //自适应大小
    chart.value.resize()
  }
}

onUnmounted(() => {
  chart.value.dispose(myEcharts.value)
})
defineExpose({ init })
</script>

<style lang="scss" scoped>
.charts {
  height: 100%;
  .myEcharts {
    height: 100px;
  }
}
</style>
