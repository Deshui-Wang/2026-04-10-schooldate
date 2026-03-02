<template>
  <div class="archive-dashboard-section">
    <div class="section-header">
      <h2 class="section-title">
        <el-icon class="title-icon"><Files /></el-icon>
        全集团档案管理看板
      </h2>
      <p class="section-desc">集团档案数据实时概览</p>
    </div>

    <el-row :gutter="24">
      <!-- 各院校档案总量 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div style="text-align: center; font-weight: bold;">各院校档案总量</div>
          </template>
          <div ref="totalArchivesChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>

      <!-- 年度新增数量趋势图 -->
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div style="text-align: center; font-weight: bold;">年度新增数量趋势</div>
          </template>
          <div ref="yearlyTrendChartRef" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="margin-top: 24px;">
      <!-- 各院校数字化率 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div style="text-align: center; font-weight: bold;">各院校数字化率</div>
          </template>
          <div class="digitalization-rate-list">
            <div v-for="item in digitalizationRates" :key="item.name" class="digitalization-rate-item">
              <span>{{ item.name }}</span>
              <el-progress :percentage="item.rate" :color="item.color" />
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 近期档案利用情况排名 -->
      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <div style="text-align: center; font-weight: bold;">近期档案利用排名</div>
          </template>
          <el-table :data="archiveUsageRanking" style="width: 100%" height="280">
            <el-table-column type="index" label="排名" width="60" />
            <el-table-column prop="name" label="院校名称" />
            <el-table-column prop="usage" label="利用次数" />
          </el-table>
        </el-card>
      </el-col>

      <!-- 业务完成度与存储预警 -->
      <el-col :span="8">
        <el-row :gutter="24">
          <el-col :span="24" style="margin-bottom: 24px;">
            <el-card class="mini-card">
              <template #header><div>档案业务完成度</div></template>
              <div class="gauge-chart-container">
                <div ref="completionGaugeRef" style="width: 100%; height: 120px;"></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="24">
             <el-card class="mini-card">
              <template #header><div>存储空间使用预警</div></template>
               <div class="gauge-chart-container">
                <div ref="storageGaugeRef" style="width: 100%; height: 120px;"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Files } from '@element-plus/icons-vue'

export default {
  name: 'ArchiveDashboard',
  components: {
    Files
  },
  setup() {
    // Chart refs
    const totalArchivesChartRef = ref(null)
    const yearlyTrendChartRef = ref(null)
    const completionGaugeRef = ref(null)
    const storageGaugeRef = ref(null)

    // Chart instances
    let totalArchivesChartInstance = null
    let yearlyTrendChartInstance = null
    let completionGaugeInstance = null
    let storageGaugeInstance = null

    // Mock data
    const digitalizationRates = ref([
      { name: '北京校区', rate: 95, color: '#67C23A' },
      { name: '上海校区', rate: 88, color: '#67C23A' },
      { name: '广州校区', rate: 76, color: '#E6A23C' },
      { name: '深圳校区', rate: 92, color: '#67C23A' },
      { name: '成都校区', rate: 65, color: '#F56C6C' },
    ])

    const archiveUsageRanking = ref([
      { name: '上海校区', usage: 1258 },
      { name: '北京校区', usage: 1120 },
      { name: '深圳校区', usage: 980 },
      { name: '广州校区', usage: 750 },
      { name: '成都校区', usage: 640 },
    ]).sort((a, b) => b.usage - a.usage)

    const initTotalArchivesChart = () => {
      if (!totalArchivesChartRef.value) return
      totalArchivesChartInstance = echarts.init(totalArchivesChartRef.value)
      const option = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['北京', '上海', '广州', '深圳', '成都'], axisLabel: { interval: 0, rotate: 30 } },
        yAxis: { type: 'value' },
        series: [{
          name: '档案总量',
          type: 'bar',
          data: [12000, 15000, 9000, 11000, 8000],
          itemStyle: { color: '#5470c6' }
        }]
      }
      totalArchivesChartInstance.setOption(option)
    }

    const initYearlyTrendChart = () => {
      if (!yearlyTrendChartRef.value) return
      yearlyTrendChartInstance = echarts.init(yearlyTrendChartRef.value)
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['新增数量'] },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['2020', '2021', '2022', '2023', '2024'] },
        yAxis: { type: 'value' },
        series: [{
          name: '新增数量',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290],
          smooth: true,
          areaStyle: {},
          itemStyle: { color: '#91cc75' }
        }]
      }
      yearlyTrendChartInstance.setOption(option)
    }

    const initCompletionGauge = () => {
      if (!completionGaugeRef.value) return
      completionGaugeInstance = echarts.init(completionGaugeRef.value)
      const option = {
        series: [{
          type: 'gauge',
          progress: { show: true, width: 12 },
          axisLine: { lineStyle: { width: 12 } },
          axisTick: { show: false },
          splitLine: { length: 10, lineStyle: { width: 1, color: '#999' } },
          axisLabel: { distance: 15, color: '#999', fontSize: 10 },
          anchor: { show: true, showAbove: true, size: 15, itemStyle: { borderWidth: 8 } },
          title: { show: false },
          detail: { valueAnimation: true, fontSize: 16, offsetCenter: [0, '70%'] },
          data: [{ value: 85, name: '完成率' }]
        }]
      }
      completionGaugeInstance.setOption(option)
    }

    const initStorageGauge = () => {
      if (!storageGaugeRef.value) return
      storageGaugeInstance = echarts.init(storageGaugeRef.value)
      const option = {
        series: [{
          type: 'gauge',
          progress: { show: true, width: 12 },
          axisLine: { lineStyle: { width: 12 } },
          axisTick: { show: false },
          splitLine: { length: 10, lineStyle: { width: 1, color: '#999' } },
          axisLabel: { distance: 15, color: '#999', fontSize: 10 },
          anchor: { show: true, showAbove: true, size: 15, itemStyle: { borderWidth: 8 } },
          title: { show: false },
          detail: { valueAnimation: true, fontSize: 16, offsetCenter: [0, '70%'] },
          data: [{ value: 92, name: '使用率' }]
        }]
      }
      storageGaugeInstance.setOption(option)
    }

    const handleResize = () => {
      totalArchivesChartInstance?.resize()
      yearlyTrendChartInstance?.resize()
      completionGaugeInstance?.resize()
      storageGaugeInstance?.resize()
    }

    onMounted(() => {
      nextTick(() => {
        initTotalArchivesChart()
        initYearlyTrendChart()
        initCompletionGauge()
        initStorageGauge()
        window.addEventListener('resize', handleResize)
      })
    })

    onUnmounted(() => {
      totalArchivesChartInstance?.dispose()
      yearlyTrendChartInstance?.dispose()
      completionGaugeInstance?.dispose()
      storageGaugeInstance?.dispose()
      window.removeEventListener('resize', handleResize)
    })

    return {
      totalArchivesChartRef,
      yearlyTrendChartRef,
      completionGaugeRef,
      storageGaugeRef,
      digitalizationRates,
      archiveUsageRanking
    }
  }
}
</script>

<style scoped>
.archive-dashboard-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title .title-icon {
  font-size: 20px;
  color: #667eea;
}

.section-desc {
  margin: 8px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.chart-card {
  height: 380px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.chart-card :deep(.el-card__header) {
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 16px;
  border-bottom: none;
}

.chart-card :deep(.el-card__body) {
  padding: 20px;
}

.digitalization-rate-list {
  padding: 10px;
}

.digitalization-rate-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.digitalization-rate-item span {
  width: 80px;
  font-size: 14px;
}

.mini-card {
    height: 178px; /* (380 - 24) / 2 */
}

.mini-card :deep(.el-card__header) {
    text-align: center;
    font-weight: bold;
    padding: 10px 20px;
}

.gauge-chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
</style>