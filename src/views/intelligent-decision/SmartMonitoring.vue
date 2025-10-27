<template>
  <div class="smart-monitoring">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><Monitor /></el-icon>
            智能监测
          </h1>
          <p class="page-subtitle">教师成长过程数据多维管理与智能异常检测</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="refreshMonitoring">
            <el-icon><Refresh /></el-icon>
            刷新监测
          </el-button>
          <el-button @click="exportReport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </div>

    <!-- 监测概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon normal">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.normal }}</div>
              <div class="card-label">正常状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon warning">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.warning }}</div>
              <div class="card-label">预警状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon danger">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.danger }}</div>
              <div class="card-label">异常状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon total">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.total }}</div>
              <div class="card-label">总教师数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 监测配置 -->
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>监测配置</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="监测维度">
            <el-select v-model="config.monitoringDimensions" multiple placeholder="选择监测维度">
              <el-option label="教学表现" value="teaching" />
              <el-option label="科研产出" value="research" />
              <el-option label="工作态度" value="attitude" />
              <el-option label="成长轨迹" value="growth" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="异常阈值">
            <el-input-number v-model="config.threshold" :min="0" :max="100" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="监测频率">
            <el-select v-model="config.frequency" placeholder="选择监测频率">
              <el-option label="实时监测" value="realtime" />
              <el-option label="每日监测" value="daily" />
              <el-option label="每周监测" value="weekly" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="预警方式">
            <el-select v-model="config.alertMethod" multiple placeholder="选择预警方式">
              <el-option label="系统通知" value="system" />
              <el-option label="邮件通知" value="email" />
              <el-option label="短信通知" value="sms" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <!-- 异常检测结果 -->
    <el-card class="anomaly-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <span>异常检测结果</span>
          <el-tag type="danger" class="ml-2">{{ anomalyList.length }} 个异常</el-tag>
        </div>
      </template>
      
      <div v-if="anomalyList.length === 0" class="empty-state">
        <el-empty description="暂无异常检测结果">
          <el-button type="primary" @click="startDetection">开始检测</el-button>
        </el-empty>
      </div>

      <div v-else class="anomaly-list">
        <div 
          v-for="anomaly in anomalyList" 
          :key="anomaly.id"
          class="anomaly-item"
          :class="anomaly.level"
        >
          <div class="anomaly-header">
            <div class="anomaly-info">
              <div class="teacher-name">
                <h4>{{ anomaly.teacherName }}</h4>
                <el-tag :type="anomaly.level === 'danger' ? 'danger' : 'warning'">
                  {{ anomaly.level === 'danger' ? '严重异常' : '预警' }}
                </el-tag>
              </div>
              <div class="anomaly-time">{{ anomaly.detectedTime }}</div>
            </div>
            <div class="anomaly-score">
              <div class="score-value">{{ anomaly.anomalyScore }}</div>
              <div class="score-label">异常评分</div>
            </div>
          </div>
          
          <div class="anomaly-details">
            <div class="anomaly-type">
              <span class="label">异常类型：</span>
              <span class="value">{{ anomaly.type }}</span>
            </div>
            <div class="anomaly-description">
              <span class="label">异常描述：</span>
              <span class="value">{{ anomaly.description }}</span>
            </div>
            <div class="anomaly-factors">
              <span class="label">影响因素：</span>
              <div class="factors-list">
                <el-tag 
                  v-for="factor in anomaly.factors" 
                  :key="factor"
                  size="small"
                  class="factor-tag"
                >
                  {{ factor }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div class="anomaly-trend">
            <div class="trend-chart">
              <div class="trend-line">
                <div 
                  v-for="(point, index) in anomaly.trendData" 
                  :key="index"
                  class="trend-point"
                  :style="{ 
                    left: `${(index / (anomaly.trendData.length - 1)) * 100}%`,
                    bottom: `${point}%`
                  }"
                ></div>
              </div>
            </div>
            <div class="trend-label">趋势变化</div>
          </div>
          
          <div class="anomaly-actions">
            <el-button size="small" @click="viewDetails(anomaly)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button size="small" type="primary" @click="handleAnomaly(anomaly)">
              <el-icon><Tools /></el-icon>
              处理异常
            </el-button>
            <el-button size="small" type="success" @click="ignoreAnomaly(anomaly)">
              <el-icon><Check /></el-icon>
              忽略异常
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 教师成长轨迹 -->
    <el-card class="growth-track-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><TrendCharts /></el-icon>
          <span>教师成长轨迹</span>
        </div>
      </template>
      
      <div class="growth-filters">
        <el-select v-model="selectedTeacher" placeholder="选择教师" @change="updateGrowthChart">
          <el-option 
            v-for="teacher in teachers" 
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
        <el-select v-model="growthPeriod" placeholder="选择时间范围" @change="updateGrowthChart">
          <el-option label="最近3个月" value="3m" />
          <el-option label="最近6个月" value="6m" />
          <el-option label="最近1年" value="1y" />
        </el-select>
      </div>
      
      <div class="growth-chart-container">
        <div class="growth-chart">
          <div class="chart-placeholder">
            <el-icon><TrendCharts /></el-icon>
            <p>成长轨迹图表</p>
            <p>教学能力、科研产出、工作态度变化趋势</p>
          </div>
        </div>
        <div class="growth-metrics">
          <div class="metric-item">
            <div class="metric-label">教学能力</div>
            <div class="metric-value">{{ growthMetrics.teaching }}</div>
            <div class="metric-change positive">+5.2%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">科研产出</div>
            <div class="metric-value">{{ growthMetrics.research }}</div>
            <div class="metric-change negative">-2.1%</div>
          </div>
          <div class="metric-item">
            <div class="metric-label">工作态度</div>
            <div class="metric-value">{{ growthMetrics.attitude }}</div>
            <div class="metric-change positive">+3.8%</div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 预警设置 -->
    <el-card class="alert-settings-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Bell /></el-icon>
          <span>预警设置</span>
        </div>
      </template>
      
      <el-table :data="alertSettings" stripe>
        <el-table-column prop="dimension" label="监测维度" width="120" />
        <el-table-column prop="threshold" label="预警阈值" width="100" align="center">
          <template #default="scope">
            <el-input-number 
              v-model="scope.row.threshold" 
              :min="0" 
              :max="100" 
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="启用状态" width="100" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" />
          </template>
        </el-table-column>
        <el-table-column prop="alertMethods" label="预警方式" width="200">
          <template #default="scope">
            <el-checkbox-group v-model="scope.row.alertMethods">
              <el-checkbox label="system">系统通知</el-checkbox>
              <el-checkbox label="email">邮件</el-checkbox>
              <el-checkbox label="sms">短信</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" @click="saveAlertSetting(scope.row)">
              保存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 异常详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="异常详情" width="800px">
      <div v-if="selectedAnomaly" class="anomaly-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="教师姓名">{{ selectedAnomaly.teacherName }}</el-descriptions-item>
          <el-descriptions-item label="异常类型">{{ selectedAnomaly.type }}</el-descriptions-item>
          <el-descriptions-item label="异常评分">{{ selectedAnomaly.anomalyScore }}</el-descriptions-item>
          <el-descriptions-item label="检测时间">{{ selectedAnomaly.detectedTime }}</el-descriptions-item>
          <el-descriptions-item label="异常等级">
            <el-tag :type="selectedAnomaly.level === 'danger' ? 'danger' : 'warning'">
              {{ selectedAnomaly.level === 'danger' ? '严重异常' : '预警' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="selectedAnomaly.status === 'handled' ? 'success' : 'info'">
              {{ selectedAnomaly.status === 'handled' ? '已处理' : '待处理' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="detail-description">
          <h4>详细描述：</h4>
          <p>{{ selectedAnomaly.detailedDescription }}</p>
        </div>
        
        <div class="detail-suggestions">
          <h4>处理建议：</h4>
          <ul>
            <li v-for="suggestion in selectedAnomaly.suggestions" :key="suggestion">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'SmartMonitoring',
  setup() {
    const config = reactive({
      monitoringDimensions: ['teaching', 'research', 'attitude', 'growth'],
      threshold: 75,
      frequency: 'daily',
      alertMethod: ['system', 'email']
    })

    const overviewStats = reactive({
      normal: 156,
      warning: 12,
      danger: 3,
      total: 171
    })

    const selectedTeacher = ref(1)
    const growthPeriod = ref('3m')

    const teachers = ref([
      { id: 1, name: '张教授' },
      { id: 2, name: '李老师' },
      { id: 3, name: '王老师' },
      { id: 4, name: '陈老师' },
      { id: 5, name: '刘老师' }
    ])

    const growthMetrics = reactive({
      teaching: 85.2,
      research: 78.9,
      attitude: 92.1
    })

    const anomalyList = ref([
      {
        id: 1,
        teacherName: '李老师',
        type: '教学表现异常',
        level: 'warning',
        anomalyScore: 68,
        detectedTime: '2024-01-15 14:30',
        status: 'pending',
        description: '最近一周教学评价分数持续下降，学生满意度降低',
        detailedDescription: '李老师在过去一周的教学评价中，学生满意度从之前的92分下降到68分，主要问题集中在课堂互动不足、教学内容更新滞后等方面。',
        factors: ['课堂互动', '内容更新', '学生反馈'],
        trendData: [92, 89, 85, 78, 68],
        suggestions: [
          '建议增加课堂互动环节，提高学生参与度',
          '更新教学内容，结合最新案例和实践',
          '加强与学生的沟通，了解学习需求',
          '参加教学培训，提升教学技能'
        ]
      },
      {
        id: 2,
        teacherName: '王老师',
        type: '科研产出异常',
        level: 'danger',
        anomalyScore: 45,
        detectedTime: '2024-01-14 09:15',
        status: 'pending',
        description: '科研产出严重不足，论文发表数量急剧下降',
        detailedDescription: '王老师在过去3个月中，论文发表数量为0，相比去年同期下降了100%。科研项目进展缓慢，可能影响职称评定。',
        factors: ['论文发表', '项目进展', '学术活动'],
        trendData: [85, 78, 65, 52, 45],
        suggestions: [
          '制定科研计划，明确阶段性目标',
          '寻求合作机会，参与团队研究',
          '参加学术会议，拓展学术网络',
          '考虑申请科研资助，获得资源支持'
        ]
      },
      {
        id: 3,
        teacherName: '陈老师',
        type: '工作态度异常',
        level: 'warning',
        anomalyScore: 72,
        detectedTime: '2024-01-13 16:45',
        status: 'pending',
        description: '工作积极性下降，任务完成质量降低',
        detailedDescription: '陈老师最近工作积极性明显下降，任务完成质量不如以往，同事反馈其工作态度有所变化。',
        factors: ['工作积极性', '任务质量', '同事反馈'],
        trendData: [88, 85, 82, 76, 72],
        suggestions: [
          '了解工作压力来源，提供必要支持',
          '调整工作安排，避免过度负荷',
          '提供职业发展指导和建议',
          '加强团队沟通，改善工作环境'
        ]
      }
    ])

    const alertSettings = ref([
      {
        dimension: '教学表现',
        threshold: 75,
        enabled: true,
        alertMethods: ['system', 'email']
      },
      {
        dimension: '科研产出',
        threshold: 70,
        enabled: true,
        alertMethods: ['system', 'email', 'sms']
      },
      {
        dimension: '工作态度',
        threshold: 80,
        enabled: true,
        alertMethods: ['system']
      },
      {
        dimension: '成长轨迹',
        threshold: 65,
        enabled: false,
        alertMethods: ['system']
      }
    ])

    const showDetailDialog = ref(false)
    const selectedAnomaly = ref(null)

    const refreshMonitoring = () => {
      ElMessage.success('监测数据已刷新')
    }

    const exportReport = () => {
      ElMessage.success('监测报告已导出')
    }

    const startDetection = () => {
      ElMessage.info('正在启动异常检测...')
    }

    const viewDetails = (anomaly) => {
      selectedAnomaly.value = anomaly
      showDetailDialog.value = true
    }

    const handleAnomaly = (anomaly) => {
      ElMessage.success(`已处理异常：${anomaly.teacherName}`)
      anomaly.status = 'handled'
    }

    const ignoreAnomaly = (anomaly) => {
      ElMessage.success(`已忽略异常：${anomaly.teacherName}`)
      const index = anomalyList.value.findIndex(item => item.id === anomaly.id)
      if (index > -1) {
        anomalyList.value.splice(index, 1)
      }
    }

    const updateGrowthChart = () => {
      ElMessage.info('正在更新成长轨迹图表...')
    }

    const saveAlertSetting = (setting) => {
      ElMessage.success('预警设置已保存')
    }

    return {
      config,
      overviewStats,
      selectedTeacher,
      growthPeriod,
      teachers,
      growthMetrics,
      anomalyList,
      alertSettings,
      showDetailDialog,
      selectedAnomaly,
      refreshMonitoring,
      exportReport,
      startDetection,
      viewDetails,
      handleAnomaly,
      ignoreAnomaly,
      updateGrowthChart,
      saveAlertSetting
    }
  }
}
</script>

<style scoped>
.smart-monitoring {
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.title-icon {
  color: #667eea;
  font-size: 32px;
}

.page-subtitle {
  margin: 0;
  color: #718096;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.overview-cards {
  margin-bottom: 24px;
}

.overview-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-icon.normal {
  background: linear-gradient(135deg, #43e97b 0%, #38d9a9 100%);
}

.card-icon.warning {
  background: linear-gradient(135deg, #ffd43b 0%, #ffa726 100%);
}

.card-icon.danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.card-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #718096;
}

.config-card, .anomaly-card, .growth-track-card, .alert-settings-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2d3748;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.anomaly-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.anomaly-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #e2e8f0;
  transition: all 0.3s ease;
}

.anomaly-item.warning {
  border-left-color: #ffd43b;
}

.anomaly-item.danger {
  border-left-color: #ff6b6b;
}

.anomaly-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.anomaly-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.anomaly-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.teacher-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-name h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.anomaly-time {
  color: #718096;
  font-size: 14px;
}

.anomaly-score {
  text-align: center;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
}

.score-label {
  font-size: 12px;
  color: #718096;
}

.anomaly-details {
  margin-bottom: 16px;
}

.anomaly-type, .anomaly-description {
  margin-bottom: 8px;
}

.label {
  font-weight: 500;
  color: #4a5568;
}

.value {
  color: #2d3748;
}

.anomaly-factors {
  margin-top: 12px;
}

.factors-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.factor-tag {
  margin-right: 8px;
}

.anomaly-trend {
  margin-bottom: 16px;
}

.trend-chart {
  height: 60px;
  background: #f8fafc;
  border-radius: 8px;
  position: relative;
  margin-bottom: 8px;
}

.trend-line {
  position: relative;
  height: 100%;
}

.trend-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  transform: translate(-50%, 50%);
}

.trend-label {
  font-size: 12px;
  color: #718096;
  text-align: center;
}

.anomaly-actions {
  display: flex;
  gap: 12px;
}

.growth-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.growth-chart-container {
  display: flex;
  gap: 32px;
}

.growth-chart {
  flex: 1;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 8px;
}

.chart-placeholder {
  text-align: center;
  color: #718096;
}

.chart-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.growth-metrics {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.metric-label {
  font-size: 14px;
  color: #718096;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 20px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #43e97b;
}

.metric-change.negative {
  color: #ff6b6b;
}

.anomaly-detail {
  padding: 20px 0;
}

.detail-description, .detail-suggestions {
  margin-top: 20px;
}

.detail-description h4, .detail-suggestions h4 {
  margin-bottom: 12px;
  color: #2d3748;
}

.detail-description p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.detail-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.detail-suggestions li {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.6;
}

.ml-2 {
  margin-left: 8px;
}
</style>
