<template>
  <div class="knowledge-operation">
    <div class="section-header">
      <h3>运营分析</h3>
      <p>监控知识库增长量、活跃用户数、内容新鲜度，量化知识工作价值，洞察用户真实需求与使用痛点</p>
    </div>

    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <div class="stat-value">{{ summaryData.growth.toLocaleString() }}</div>
            <div class="stat-label">知识库增长量</div>
            <div class="stat-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>12.5%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <div class="stat-value">{{ summaryData.activeUsers.toLocaleString() }}</div>
            <div class="stat-label">活跃用户数</div>
            <div class="stat-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>8.3%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <div class="stat-value">{{ summaryData.freshness }}%</div>
            <div class="stat-label">内容新鲜度</div>
            <div class="stat-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>5.2%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <div class="stat-value">{{ summaryData.problemSolved.toLocaleString() }}</div>
            <div class="stat-label">解决问题数量</div>
            <div class="stat-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>15.8%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 知识增长趋势和活跃度 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>知识库增长趋势</span>
              <el-date-picker
                v-model="selectedDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px;"
              />
            </div>
          </template>
          <div ref="growthChart" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>活跃用户分布</span>
          </template>
          <div ref="userDistributionChart" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 多维度分析 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>多维度知识分析</span>
              <el-radio-group v-model="analysisDimension" size="small">
                <el-radio-button label="全宗">全宗</el-radio-button>
                <el-radio-button label="类目">类目</el-radio-button>
                <el-radio-button label="条目">条目</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="dimensionChart" class="chart-container" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 知识贡献和引用分析 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>知识贡献量TOP10</span>
          </template>
          <div ref="contributionChart" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>知识被引用量TOP10</span>
          </template>
          <div ref="referenceChart" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索关键词和热门路径 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>搜索关键词分析</span>
          </template>
          <div ref="keywordChart" class="chart-container" style="height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>热门知识路径</span>
          </template>
          <div ref="pathChart" class="chart-container" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 问题解决分析和消费场景 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>问题解决等级分布</span>
          </template>
          <div ref="problemLevelChart" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>知识消费场景分析</span>
          </template>
          <div ref="consumptionChart" class="chart-container" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户需求和痛点分析 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <span>用户需求与痛点分析</span>
          </template>
          <el-table :data="painPoints" stripe style="width: 100%">
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="scenario" label="使用场景" min-width="200" />
            <el-table-column prop="painPoint" label="痛点描述" min-width="300" />
            <el-table-column prop="occurrence" label="出现次数" width="120" align="center" />
            <el-table-column prop="severity" label="严重程度" width="120">
              <template #default="scope">
                <el-tag :type="getSeverityType(scope.row.severity)" size="small">
                  {{ scope.row.severity }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="trend" label="趋势" width="100">
              <template #default="scope">
                <span :class="scope.row.trend > 0 ? 'trend-up' : 'trend-down'">
                  {{ scope.row.trend > 0 ? '+' : '' }}{{ scope.row.trend }}%
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { CaretTop } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const selectedDateRange = ref([])
const analysisDimension = ref('全宗')

const summaryData = ref({
  growth: 3456,
  activeUsers: 1234,
  freshness: 85.6,
  problemSolved: 892
})

const painPoints = ref([
  { scenario: '知识搜索', painPoint: '搜索结果不够精准，需要多次筛选', occurrence: 234, severity: '高', trend: 12 },
  { scenario: '内容查看', painPoint: '文档加载速度较慢，影响使用体验', occurrence: 189, severity: '中', trend: -5 },
  { scenario: '知识分享', painPoint: '分享流程繁琐，需要多个步骤', occurrence: 156, severity: '中', trend: 8 },
  { scenario: '权限管理', painPoint: '权限设置不清晰，导致访问受限', occurrence: 134, severity: '高', trend: 15 },
  { scenario: '知识分类', painPoint: '分类体系不够直观，难以快速定位', occurrence: 98, severity: '低', trend: -3 }
])

let growthChartInstance = null
let userDistributionChartInstance = null
let dimensionChartInstance = null
let contributionChartInstance = null
let referenceChartInstance = null
let keywordChartInstance = null
let pathChartInstance = null
let problemLevelChartInstance = null
let consumptionChartInstance = null

const growthChart = ref(null)
const userDistributionChart = ref(null)
const dimensionChart = ref(null)
const contributionChart = ref(null)
const referenceChart = ref(null)
const keywordChart = ref(null)
const pathChart = ref(null)
const problemLevelChart = ref(null)
const consumptionChart = ref(null)

const getSeverityType = (severity) => {
  const map = {
    '高': 'danger',
    '中': 'warning',
    '低': 'info'
  }
  return map[severity] || 'info'
}

const initGrowthChart = () => {
  if (!growthChart.value) return
  growthChartInstance = echarts.init(growthChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['知识总量', '新增知识', '活跃用户']
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        position: 'left'
      },
      {
        type: 'value',
        name: '用户数',
        position: 'right'
      }
    ],
    series: [
      {
        name: '知识总量',
        type: 'line',
        smooth: true,
        data: [12000, 13200, 14500, 15800, 17200, 18600, 20100, 21700, 23400, 25200, 27100, 29000],
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '新增知识',
        type: 'bar',
        data: [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300],
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '活跃用户',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1210, 1220, 1234],
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
  
  growthChartInstance.setOption(option)
}

const initUserDistributionChart = () => {
  if (!userDistributionChart.value) return
  userDistributionChartInstance = echarts.init(userDistributionChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      left: 'center'
    },
    series: [
      {
        name: '活跃用户',
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}\n({d}%)'
        },
        data: [
          { value: 456, name: '计算机学院' },
          { value: 234, name: '经济学院' },
          { value: 189, name: '材料学院' },
          { value: 156, name: '信息学院' },
          { value: 199, name: '其他部门' }
        ]
      }
    ]
  }
  
  userDistributionChartInstance.setOption(option)
}

const initDimensionChart = () => {
  if (!dimensionChart.value) return
  dimensionChartInstance = echarts.init(dimensionChart.value)
  
  const dataMap = {
    '全宗': {
      categories: ['全宗A', '全宗B', '全宗C', '全宗D', '全宗E'],
      contribution: [1560, 1234, 980, 756, 623],
      reference: [890, 756, 623, 456, 345],
      problemSolved: [234, 189, 156, 123, 98]
    },
    '类目': {
      categories: ['教学类', '科研类', '管理类', '服务类', '其他类'],
      contribution: [2340, 1890, 1560, 980, 567],
      reference: [1234, 980, 756, 567, 345],
      problemSolved: [345, 289, 234, 178, 123]
    },
    '条目': {
      categories: ['条目A1', '条目A2', '条目B1', '条目B2', '条目C1'],
      contribution: [890, 756, 623, 456, 345],
      reference: [567, 456, 345, 234, 189],
      problemSolved: [156, 123, 98, 76, 56]
    }
  }
  
  const data = dataMap[analysisDimension.value]
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['贡献量', '被引用量', '解决问题数']
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '贡献量',
        type: 'bar',
        data: data.contribution,
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '被引用量',
        type: 'bar',
        data: data.reference,
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '解决问题数',
        type: 'bar',
        data: data.problemSolved,
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
  
  dimensionChartInstance.setOption(option)
}

const initContributionChart = () => {
  if (!contributionChart.value) return
  contributionChartInstance = echarts.init(contributionChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['知识条目10', '知识条目9', '知识条目8', '知识条目7', '知识条目6', '知识条目5', '知识条目4', '知识条目3', '知识条目2', '知识条目1']
    },
    series: [
      {
        type: 'bar',
        data: [1234, 1156, 1089, 1023, 956, 890, 823, 756, 689, 623],
        itemStyle: { color: '#409EFF' }
      }
    ]
  }
  
  contributionChartInstance.setOption(option)
}

const initReferenceChart = () => {
  if (!referenceChart.value) return
  referenceChartInstance = echarts.init(referenceChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['知识条目10', '知识条目9', '知识条目8', '知识条目7', '知识条目6', '知识条目5', '知识条目4', '知识条目3', '知识条目2', '知识条目1']
    },
    series: [
      {
        type: 'bar',
        data: [890, 823, 756, 689, 623, 556, 489, 423, 356, 289],
        itemStyle: { color: '#67C23A' }
      }
    ]
  }
  
  referenceChartInstance.setOption(option)
}

const initKeywordChart = () => {
  if (!keywordChart.value) return
  keywordChartInstance = echarts.init(keywordChart.value)
  
  const keywordData = [
    { name: '教学改革', value: 1234 },
    { name: '科研项目', value: 1089 },
    { name: '管理制度', value: 956 },
    { name: '课程设计', value: 823 },
    { name: '学生管理', value: 756 },
    { name: '质量评估', value: 689 },
    { name: '人才培养', value: 623 },
    { name: '创新创业', value: 556 },
    { name: '学术论文', value: 489 },
    { name: '实验室', value: 423 },
    { name: '教学评估', value: 356 },
    { name: '信息化', value: 289 },
    { name: '资产管理办法', value: 256 },
    { name: '就业指导', value: 234 },
    { name: '学科建设', value: 189 }
  ].sort((a, b) => b.value - a.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: keywordData.map(item => item.name)
    },
    series: [
      {
        type: 'bar',
        data: keywordData.map(item => item.value),
        itemStyle: {
          color: function(params) {
            const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
            return colors[params.dataIndex % colors.length]
          }
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
        }
      }
    ]
  }
  
  keywordChartInstance.setOption(option)
}

const initPathChart = () => {
  if (!pathChart.value) return
  pathChartInstance = echarts.init(pathChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: [
        '知识分类→知识图谱→知识详情',
        '知识图谱→知识空间→知识详情',
        '搜索→知识详情→相关知识',
        '知识分类→知识列表→知识详情',
        '知识空间→知识文档→知识详情',
        '知识图谱→相关节点→知识详情',
        '知识模版→创建知识→知识详情',
        '热门推荐→知识详情'
      ]
    },
    series: [
      {
        type: 'bar',
        data: [1234, 1089, 956, 823, 756, 689, 623, 556],
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
  
  pathChartInstance.setOption(option)
}

const initProblemLevelChart = () => {
  if (!problemLevelChart.value) return
  problemLevelChartInstance = echarts.init(problemLevelChart.value)
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '问题等级',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 234, name: '高等级问题' },
          { value: 345, name: '中等级问题' },
          { value: 313, name: '低等级问题' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
  
  problemLevelChartInstance.setOption(option)
}

const initConsumptionChart = () => {
  if (!consumptionChart.value) return
  consumptionChartInstance = echarts.init(consumptionChart.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['查看次数', '下载次数', '分享次数']
    },
    grid: {
      top: '15%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['教学场景', '科研场景', '管理场景', '学习场景', '协作场景']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '查看次数',
        type: 'bar',
        data: [3456, 2890, 2345, 1890, 1567],
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '下载次数',
        type: 'bar',
        data: [1234, 1089, 890, 756, 623],
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '分享次数',
        type: 'bar',
        data: [567, 489, 423, 356, 289],
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
  
  consumptionChartInstance.setOption(option)
}

const initAllCharts = () => {
  nextTick(() => {
    initGrowthChart()
    initUserDistributionChart()
    initDimensionChart()
    initContributionChart()
    initReferenceChart()
    initKeywordChart()
    initPathChart()
    initProblemLevelChart()
    initConsumptionChart()
    
    // 窗口大小改变时自动调整
    window.addEventListener('resize', () => {
      growthChartInstance?.resize()
      userDistributionChartInstance?.resize()
      dimensionChartInstance?.resize()
      contributionChartInstance?.resize()
      referenceChartInstance?.resize()
      keywordChartInstance?.resize()
      pathChartInstance?.resize()
      problemLevelChartInstance?.resize()
      consumptionChartInstance?.resize()
    })
  })
}

watch(analysisDimension, () => {
  initDimensionChart()
})

onMounted(() => {
  initAllCharts()
})
</script>

<style scoped>
.knowledge-operation {
  padding: 0;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card .card-content {
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.stat-trend.up {
  color: #67C23A;
}

.stat-trend.down {
  color: #F56C6C;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  width: 100%;
}

.trend-up {
  color: #67C23A;
  font-weight: 500;
}

.trend-down {
  color: #F56C6C;
  font-weight: 500;
}
</style>

