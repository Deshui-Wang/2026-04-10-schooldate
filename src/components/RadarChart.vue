<template>
  <div class="radar-chart-wrapper">
    <div ref="radarChartRef" class="radar-chart"></div>
    <div class="radar-legend">
      <div 
        v-for="(candidate, index) in candidates" 
        :key="candidate.id"
        class="legend-item"
      >
        <div class="legend-color" :style="{ backgroundColor: colors[index] }"></div>
        <span>{{ candidate.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  candidates: {
    type: Array,
    default: () => []
  },
  dimensions: {
    type: Array,
    default: () => [
      { name: '教学能力', max: 100 },
      { name: '科研能力', max: 100 },
      { name: '工作态度', max: 100 },
      { name: '创新能力', max: 100 },
      { name: '团队协作', max: 100 },
      { name: '沟通能力', max: 100 }
    ]
  }
})

const radarChartRef = ref(null)
let chartInstance = null

// 定义颜色方案
const colors = [
  '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'
]

// 生成模拟数据
const generateRadarData = () => {
  return props.candidates.map((candidate, index) => {
    const data = props.dimensions.map(() => {
      // 生成60-95之间的随机分数，确保有差异
      return Math.floor(Math.random() * 35) + 60
    })
    
    return {
      name: candidate.name,
      value: data,
      itemStyle: {
        color: colors[index % colors.length]
      },
      areaStyle: {
        color: colors[index % colors.length],
        opacity: 0.1
      }
    }
  })
}

// 初始化图表
const initChart = () => {
  if (!radarChartRef.value) return
  
  chartInstance = echarts.init(radarChartRef.value)
  
  const option = {
    title: {
      text: '多维度能力对比',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        let result = `<strong>${params.name}</strong><br/>`
        params.value.forEach((value, index) => {
          result += `${props.dimensions[index].name}: ${value}分<br/>`
        })
        return result
      }
    },
    legend: {
      show: false // 使用自定义图例
    },
    radar: {
      center: ['50%', '55%'],
      radius: '70%',
      indicator: props.dimensions,
      name: {
        textStyle: {
          color: '#666',
          fontSize: 12
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.1)']
        }
      },
      splitLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      }
    },
    series: [{
      name: '能力对比',
      type: 'radar',
      data: generateRadarData(),
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 2
      },
      emphasis: {
        areaStyle: {
          opacity: 0.3
        }
      }
    }]
  }
  
  chartInstance.setOption(option)
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return
  
  const option = {
    series: [{
      data: generateRadarData()
    }]
  }
  
  chartInstance.setOption(option)
}

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  nextTick(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// 监听候选人数据变化
watch(() => props.candidates, () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.radar-chart-wrapper {
  width: 100%;
  height: 400px;
  position: relative;
}

.radar-chart {
  width: 100%;
  height: 100%;
}

.radar-legend {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .radar-chart-wrapper {
    height: 350px;
  }
  
  .radar-legend {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>
