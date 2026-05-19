<template>
  <div class="home fade-in-up">
    <!-- 现代化页面标题 -->
    <!-- 官方严谨风格页面标题 -->
    <div class="official-header">
      <div class="header-title-area">
        <div class="system-logo">
          <el-icon><School /></el-icon>
        </div>
        <div class="system-title-box">
          <h1 class="system-name">校企 · 智能管理系统</h1>
          <div class="system-sub-name">Enterprise-University Intelligent Data Platform</div>
        </div>
      </div>
      
      <div class="header-data-strip">
        <div class="header-stat-item">
          <div class="h-label">教师总数</div>
          <div class="h-value">{{ teacherTotal }}</div>
        </div>
        <div class="h-divider"></div>
        <div class="header-stat-item">
          <div class="h-label">学生总数</div>
          <div class="h-value">{{ studentTotal }}</div>
        </div>
        <div class="h-divider"></div>
        <div class="header-stat-item">
          <div class="h-label">档案归卷</div>
          <div class="h-value">{{ archiveTotal }}</div>
        </div>
        <div class="h-divider"></div>
        <div class="header-stat-item">
          <div class="h-label">分析报告</div>
          <div class="h-value">{{ reportTotal }}</div>
        </div>
        <div class="h-divider"></div>
        <div class="header-stat-item">
          <div class="h-label">数据健康度</div>
          <div class="h-value highlight">{{ dataHealth }}%</div>
        </div>
      </div>
    </div>

    <!-- 现代化快捷入口 -->
    <div class="quick-access-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><Grid /></el-icon>
          快捷入口
        </h2>
        <p class="section-desc">快速访问常用功能模块</p>
      </div>
      <div class="quick-access-grid">
        <el-card 
          class="quick-access-card" 
          :class="{ 'card-disabled': item.disabled }"
          @click="handleQuickAccess(item)"
          shadow="hover"
          v-for="item in quickAccessItems" 
          :key="item.name"
        >
          <div class="quick-access-content">
            <div class="quick-access-icon" :style="{ borderColor: item.color, color: item.color }">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <div class="icon-badge" v-if="item.badge">{{ item.badge }}</div>
            </div>
            <div class="quick-access-text">
              <div class="quick-access-title">{{ item.name }}</div>
            </div>
          </div>
          <div class="card-overlay" v-if="item.disabled">
            <el-icon><Lock /></el-icon>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 本月教师之星 -->
    <div class="teacher-star-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><Star /></el-icon>
          本月教师之星
        </h2>
        <p class="section-desc">表彰本月优秀教师风采</p>
      </div>
      <div class="teacher-star-container">
        <el-card 
          class="teacher-star-card"
          shadow="hover"
          v-for="teacher in teacherStars"
          :key="teacher.id"
        >
          <div class="teacher-avatar-wrapper">
            <img :src="teacher.avatar" :alt="teacher.name" class="teacher-avatar" />
            <div class="teacher-badge" :class="teacher.badgeType">{{ teacher.badge }}</div>
          </div>
          <div class="teacher-info">
            <div class="teacher-name">{{ teacher.name }}</div>
            <div class="teacher-desc">{{ teacher.description }}</div>
            <div class="teacher-award">
              <el-tag :type="teacher.tagType" size="small" effect="light">{{ teacher.award }}</el-tag>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 档案数据看板 -->
    <div class="dashboard-section">

      <!-- 全集团档案管理关键指标 -->
      <div class="group-archive-section fade-in-up">
        <div class="section-sub-header">
          <h3 class="sub-title">
            <el-icon class="title-icon"><DataLine /></el-icon>
            档案概览
          </h3>
          <span class="sub-desc">Group Archive Overview</span>
        </div>

        <!-- 关键指标卡片 -->
        <el-row :gutter="20" class="archive-metrics-row">
          <el-col :span="6" v-for="(metric, index) in archiveMetrics" :key="index">
            <div class="metric-card" :class="metric.type">
              <div class="metric-icon-wrapper">
                <el-icon><component :is="metric.icon" /></el-icon>
              </div>
              <div class="metric-content">
                <div class="metric-label">{{ metric.label }}</div>
                <div class="metric-value-group">
                  <span class="metric-value">{{ metric.value }}</span>
                  <span class="metric-unit" v-if="metric.unit">{{ metric.unit }}</span>
                </div>
                <div class="metric-trend" :class="metric.trendType">
                  <span>{{ metric.trendLabel }}</span>
                  <span class="trend-val">
                    <el-icon v-if="metric.trend === 'up'"><Top /></el-icon>
                    <el-icon v-else-if="metric.trend === 'down'"><Bottom /></el-icon>
                    <el-icon v-else><Minus /></el-icon>
                    {{ metric.trendValue }}
                  </span>
                </div>
              </div>
              <!-- 背景装饰 -->
              <div class="metric-bg-icon">
                <el-icon><component :is="metric.icon" /></el-icon>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 图表与监控区域 -->
        <el-row :gutter="20" style="margin-top: 20px; margin-bottom: 24px;">
          <!-- 左侧：图表分析 -->
          <el-col :span="16">
            <el-card class="archive-chart-card" shadow="hover">
              <template #header>
                <div class="card-header-flex">
                  <div class="header-title">档案数据分析</div>
                  <div class="header-legend">
                    <span class="legend-item"><span class="dot line"></span>新增趋势</span>
                    <span class="legend-item"><span class="dot bar"></span>总量分布</span>
                    <span class="legend-item"><span class="dot mix"></span>数字化率</span>
                  </div>
                </div>
              </template>
              <el-row :gutter="0">
                <el-col :span="12" style="border-right: 1px solid #f0f2f5;">
                  <div class="chart-wrapper">
                    <div class="chart-title">年度新增数量趋势</div>
                    <div ref="archiveTrendChartRef" style="width: 100%; height: 280px;"></div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="chart-wrapper">
                    <div class="chart-title">各院校总量与数字化率</div>
                    <div ref="archiveCollegeChartRef" style="width: 100%; height: 280px;"></div>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>

          <!-- 右侧：监控预警 -->
          <el-col :span="8">
            <el-card class="archive-monitor-card" shadow="hover">
              <el-tabs v-model="activeArchiveTab" class="monitor-tabs">
                <el-tab-pane label="业务监控" name="business">
                  <div class="monitor-list">
                    <div class="monitor-section">
                      <div class="section-label">业务完成度</div>
                      <div class="task-item" v-for="task in archiveTasks" :key="task.name">
                        <div class="task-info">
                          <span class="task-name">{{ task.name }}</span>
                          <el-tag :type="task.statusType" size="small" effect="plain">{{ task.status }}</el-tag>
                        </div>
                        <el-progress 
                          :percentage="task.progress" 
                          :status="task.progressStatus" 
                          :stroke-width="6"
                        />
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="利用排名" name="ranking">
                  <div class="ranking-list">
                    <div class="ranking-item" v-for="(item, index) in utilizationRankings" :key="index">
                      <div class="ranking-index" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</div>
                      <div class="ranking-content">
                        <div class="ranking-header">
                          <span class="ranking-name">{{ item.name }}</span>
                          <span class="ranking-val">{{ item.count }} 次</span>
                        </div>
                        <el-progress 
                          :percentage="item.percentage" 
                          :format="() => ''"
                          :stroke-width="6"
                          :color="index < 3 ? '#667eea' : '#909399'"
                        />
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="存储空间预警" name="storage">
                  <div class="monitor-list">
                    <div class="monitor-section">
                      <div class="section-label">存储空间预警</div>
                      <div class="storage-item" v-for="storage in storageStatus" :key="storage.name">
                        <div class="storage-info">
                          <span class="storage-name">{{ storage.name }}</span>
                          <span class="storage-val" :class="{ 'warning-text': storage.isWarning }">{{ storage.usage }}%</span>
                        </div>
                        <el-progress 
                          :percentage="storage.usage" 
                          :color="storage.color" 
                          :stroke-width="8"
                          :show-text="false"
                        />
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><DataAnalysis /></el-icon>
          师生·教学数据概览
        </h2>
        <div class="section-actions">
          <el-button type="primary" size="small" :icon="Refresh">刷新数据</el-button>
        </div>
      </div>

      <!-- 教师数据 - 官方严谨风格 -->
      <div class="data-governance-section">
        <el-card class="governance-card" shadow="never">
          <template #header>
            <div class="governance-header">
              <div class="header-left">
                <span class="header-line"></span>
                <span class="header-text">教师队伍概况</span>
                <span class="header-en">Teaching Staff Overview</span>
              </div>
              <div class="header-right">
                <el-tag type="info" size="small" effect="plain">数据更新于: 2024-01-15</el-tag>
              </div>
            </div>
          </template>
          
          <el-row :gutter="24">
            <!-- 左侧：核心指标摘要 -->
            <el-col :span="6" class="summary-col">
              <div class="summary-panel">
                <div class="total-metric">
                  <div class="metric-title">在职教师总数</div>
                  <div class="metric-num-row">
                    <span class="metric-num">{{ teacherStats.total }}</span>
                    <span class="metric-unit">人</span>
                  </div>
                  <div class="metric-trend-row">
                    <span>较上月</span>
                    <span class="trend-value up">+12% <el-icon><Top /></el-icon></span>
                  </div>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="composition-metric">
                  <div class="sub-title">性别结构</div>
                  <div class="gender-bar-box">
                    <div class="gender-info">
                      <span class="gender-label"><el-icon><Male /></el-icon> 男</span>
                      <span class="gender-val">{{ teacherStats.gender.male }}人</span>
                    </div>
                    <el-progress :percentage="52" :stroke-width="8" :show-text="false" color="#409EFF" />
                  </div>
                  <div class="gender-bar-box">
                    <div class="gender-info">
                      <span class="gender-label"><el-icon><Female /></el-icon> 女</span>
                      <span class="gender-val">{{ teacherStats.gender.female }}人</span>
                    </div>
                    <el-progress :percentage="48" :stroke-width="8" :show-text="false" color="#F56C6C" />
                  </div>
                </div>
              </div>
            </el-col>
            
            <!-- 右侧：结构分布图表 -->
            <el-col :span="18">
              <div class="charts-panel">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <div class="chart-box">
                      <div class="chart-header">学历分布情况</div>
                      <div ref="educationChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="chart-box bordered">
                      <div class="chart-header">职称结构分析</div>
                      <div ref="titleChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="chart-box">
                      <div class="chart-header">学科专业分布</div>
                      <div ref="majorChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <!-- 学生数据 - 官方严谨风格 -->
      <div class="data-governance-section">
        <el-card class="governance-card" shadow="never">
          <template #header>
            <div class="governance-header">
              <div class="header-left">
                <span class="header-line"></span>
                <span class="header-text">学生学籍概况</span>
                <span class="header-en">Student Enrollment Overview</span>
              </div>
              <div class="header-right">
                <el-tag type="info" size="small" effect="plain">数据更新于: 2024-01-15</el-tag>
              </div>
            </div>
          </template>
          
          <el-row :gutter="24">
            <!-- 左侧：核心指标摘要 -->
            <el-col :span="6" class="summary-col">
              <div class="summary-panel">
                <div class="total-metric">
                  <div class="metric-title">在校学生总数</div>
                  <div class="metric-num-row">
                    <span class="metric-num">{{ studentStats.total }}</span>
                    <span class="metric-unit">人</span>
                  </div>
                  <div class="metric-trend-row">
                    <span>较上月</span>
                    <span class="trend-value up">+8% <el-icon><Top /></el-icon></span>
                  </div>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="composition-metric">
                  <div class="sub-title">性别结构</div>
                  <div class="gender-bar-box">
                    <div class="gender-info">
                      <span class="gender-label"><el-icon><Male /></el-icon> 男</span>
                      <span class="gender-val">{{ studentStats.gender.male }}人</span>
                    </div>
                    <el-progress :percentage="50" :stroke-width="8" :show-text="false" color="#409EFF" />
                  </div>
                  <div class="gender-bar-box">
                    <div class="gender-info">
                      <span class="gender-label"><el-icon><Female /></el-icon> 女</span>
                      <span class="gender-val">{{ studentStats.gender.female }}人</span>
                    </div>
                    <el-progress :percentage="50" :stroke-width="8" :show-text="false" color="#F56C6C" />
                  </div>
                </div>
              </div>
            </el-col>
            
            <!-- 右侧：结构分布图表 -->
            <el-col :span="18">
              <div class="charts-panel">
                <el-row :gutter="16">
                  <el-col :span="8">
                    <div class="chart-box">
                      <div class="chart-header">年级分布情况</div>
                      <div ref="studentGradeChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="chart-box bordered">
                      <div class="chart-header">学院分布统计</div>
                      <div ref="studentCollegeChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="chart-box">
                      <div class="chart-header">主要专业分布</div>
                      <div ref="studentMajorChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <!-- 资源数据 - 官方严谨风格 -->
      <div class="data-governance-section">
        <el-card class="governance-card" shadow="never">
          <template #header>
            <div class="governance-header">
              <div class="header-left">
                <span class="header-line"></span>
                <span class="header-text">教学资源概览</span>
                <span class="header-en">Teaching Resources Overview</span>
              </div>
              <div class="header-right">
                <el-tag type="info" size="small" effect="plain">数据更新于: 2024-01-15</el-tag>
              </div>
            </div>
          </template>
          
          <el-row :gutter="24">
            <!-- 左侧：核心指标摘要 -->
            <el-col :span="6" class="summary-col">
              <div class="summary-panel">
                <div class="total-metric">
                  <div class="metric-title">教学数字资产总量</div>
                  <div class="metric-num-row">
                    <span class="metric-num">2,759</span>
                    <span class="metric-unit">个</span>
                  </div>
                  <div class="metric-trend-row">
                    <span>持续增长</span>
                    <span class="trend-value up">+15.4% <el-icon><Top /></el-icon></span>
                  </div>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="resource-list-box">
                  <div class="sub-title">资产明细</div>
                  <div class="resource-stat-list">
                    <div class="resource-stat-item" v-for="stat in resourceStats" :key="stat.key">
                      <div class="stat-row-header">
                        <span class="stat-label">{{ stat.label }}</span>
                        <span class="stat-val">{{ stat.value }}</span>
                      </div>
                      <el-progress 
                        :percentage="stat.percentage" 
                        :show-text="false" 
                        :stroke-width="6" 
                        :color="stat.percentage > 80 ? '#67C23A' : '#409EFF'"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
            
            <!-- 右侧：结构分布图表 -->
            <el-col :span="18">
              <div class="charts-panel">
                <!-- 第一行：基础教学资源 -->
                <div class="chart-section-title">基础教学资源分布</div>
                <el-row :gutter="16" style="margin-bottom: 24px;">
                  <el-col :span="8">
                    <div class="chart-box">
                      <div class="chart-header">课件与课程对比</div>
                      <div ref="coursewareCourseComparisonRef" class="chart-body"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="chart-box bordered">
                      <div class="chart-header">知识库分类统计</div>
                      <div ref="knowledgeBaseChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="chart-box">
                      <div class="chart-header">数字人资源统计</div>
                      <div ref="digitalHumanChartRef" class="chart-body"></div>
                    </div>
                  </el-col>
                </el-row>

                <!-- 第二行：AI 智能资产 -->
                <div class="chart-section-title">AI 智能资产构建</div>
                <el-row :gutter="16">
                  <el-col :span="12">
                    <div class="chart-box">
                      <div class="chart-header">工作流与智能体对比</div>
                      <div ref="workflowAgentComparisonRef" class="chart-body" style="height: 250px;"></div>
                    </div>
                  </el-col>
                  <el-col :span="12">
                    <div class="chart-box bordered-left">
                      <div class="chart-header">图谱建设情况 (知识/能力)</div>
                      <div ref="knowledgeAbilityComparisonRef" class="chart-body" style="height: 250px;"></div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>

    <!-- 现代化最近活动 -->
    <div class="recent-activities-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><Clock /></el-icon>
          最近活动
        </h2>
        <el-button type="text" size="small">查看全部</el-button>
      </div>
      <el-card class="activities-card">
        <el-timeline>
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :timestamp="activity.time"
            :type="activity.type"
            :icon="activity.icon"
            size="large"
          >
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-desc">{{ activity.content }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { Star, Grid, DataAnalysis, Clock, User, Refresh, DataLine, Files, Top, Bottom, Minus, Warning, UserFilled, Male, Female, School, Monitor } from '@element-plus/icons-vue'



export default {
  name: 'Home',
  components: {
    Star,
    Grid,
    DataAnalysis,
    Clock,
    User,
    Refresh,
    DataLine,
    Files,
    Top,
    Bottom,
    Minus,
    Warning,
    UserFilled,
    Male,
    Female,
    School,
    Monitor
  },
  setup() {
    const router = useRouter()
    
    // ECharts 图表实例
    const educationChartRef = ref(null)
    const titleChartRef = ref(null)
    const majorChartRef = ref(null)
    const studentGradeChartRef = ref(null)
    const studentCollegeChartRef = ref(null)
    const studentMajorChartRef = ref(null)
    const workflowChartRef = ref(null)
    const knowledgeBaseChartRef = ref(null)
    const digitalHumanChartRef = ref(null)
    const agentChartRef = ref(null)
    const workflowAgentComparisonRef = ref(null)
    const knowledgeAbilityComparisonRef = ref(null)
    const coursewareCourseComparisonRef = ref(null)
    const archiveTrendChartRef = ref(null)
    const archiveCollegeChartRef = ref(null)
    
    // 全集团档案数据
    const activeArchiveTab = ref('business')
    const archiveMetrics = ref([
      {
        label: '档案总量',
        value: '125,890',
        unit: '卷',
        icon: 'Files',
        type: 'blue-gradient',
        trendLabel: '年度新增',
        trendValue: '15.2%',
        trend: 'up',
        trendType: 'trend-up'
      },
      {
        label: '平均数字化率',
        value: '88.5',
        unit: '%',
        icon: 'DataAnalysis',
        type: 'purple-gradient',
        trendLabel: '同比提升',
        trendValue: '5.3%',
        trend: 'up',
        trendType: 'trend-up'
      },
      {
        label: '近期利用次数',
        value: '5,678',
        unit: '次',
        icon: 'Clock',
        type: 'green-gradient',
        trendLabel: '环比增长',
        trendValue: '12.4%',
        trend: 'up',
        trendType: 'trend-up'
      },
      {
        label: '存储空间使用',
        value: '78',
        unit: '%',
        icon: 'Warning',
        type: 'orange-gradient',
        trendLabel: '剩余空间',
        trendValue: '2.4TB',
        trend: 'down',
        trendType: 'trend-warning'
      }
    ])

    const archiveTasks = ref([
      { name: '2023年度归档', status: '进行中', statusType: 'primary', progress: 85, progressStatus: '' },
      { name: '数字化加工', status: '正常', statusType: 'success', progress: 92, progressStatus: 'success' },
      { name: '档案销毁审核', status: '待审核', statusType: 'warning', progress: 30, progressStatus: 'warning' },
      { name: '年度库房盘点', status: '延迟', statusType: 'danger', progress: 15, progressStatus: 'exception' }
    ])

    const storageStatus = ref([
      { name: '主存储区 (NAS-01)', usage: 88, color: '#e6a23c', isWarning: true },
      { name: '备份存储区 (NAS-02)', usage: 45, color: '#67c23a', isWarning: false },
      { name: '冷存储区 (Tape)', usage: 92, color: '#f56c6c', isWarning: true }
    ])

    const utilizationRankings = ref([
      { name: '计算机学院', count: 1205, percentage: 90 },
      { name: '工程学院', count: 980, percentage: 75 },
      { name: '经管学院', count: 856, percentage: 65 },
      { name: '人文学院', count: 654, percentage: 50 },
      { name: '艺术学院', count: 432, percentage: 35 }
    ])
    
    let educationChartInstance = null
    let titleChartInstance = null
    let majorChartInstance = null
    let studentGradeChartInstance = null
    let studentCollegeChartInstance = null
    let studentMajorChartInstance = null
    let workflowChartInstance = null
    let knowledgeBaseChartInstance = null
    let digitalHumanChartInstance = null
    let agentChartInstance = null
    let workflowAgentComparisonInstance = null
    let knowledgeAbilityComparisonInstance = null
    let coursewareCourseComparisonInstance = null
    let archiveTrendChartInstance = null
    let archiveCollegeChartInstance = null

    // 教师数据
    const teacherStats = ref({
      total: 156,
      gender: {
        male: 82,
        female: 74
      },
      education: {
        undergraduate: 45,
        master: 78,
        doctor: 33
      },
      title: {
        assistant: 12,
        lecturer: 65,
        associateProfessor: 55,
        professor: 24
      },
      major: {
        computerScience: 42,
        informationManagement: 18,
        economics: 35,
        finance: 25,
        chineseLanguage: 28,
        english: 22,
        mechanicalEngineering: 40,
        electronicEngineering: 25
      }
    })

    // 学生数据
    const studentStats = ref({
      total: 2847,
      gender: {
        male: 1423,
        female: 1424
      },
      grade: {
        freshman: 712,
        sophomore: 712,
        junior: 711,
        senior: 712
      },
      college: {
        computer: 842,
        economics: 623,
        literature: 456,
        engineering: 926
      },
      major: {
        computerScience: 623,
        informationManagement: 219,
        economics: 423,
        finance: 200,
        chineseLanguage: 256,
        english: 200,
        mechanicalEngineering: 626,
        electronicEngineering: 300
      }
    })

    // 资源数据 - 模拟数据按专业统计
    const resourceStats = ref([
      { key: 'courseware', label: '课件数据', value: 1245, percentage: 85 },
      { key: 'course', label: '课程总数', value: 289, percentage: 78 },
      { key: 'workflow', label: '工作流', value: 156, percentage: 88 },
      { key: 'knowledgeBase', label: '知识库', value: 423, percentage: 75 },
      { key: 'digitalHuman', label: '数字人', value: 89, percentage: 65 },
      { key: 'agent', label: '智能体', value: 234, percentage: 82 },
      { key: 'knowledgeGraph', label: '知识图谱', value: 178, percentage: 70 },
      { key: 'abilityGraph', label: '能力图谱', value: 145, percentage: 68 }
    ])

    // 新增统计数据
    const teacherTotal = ref(156)
    const studentTotal = ref(2847)
    const reportTotal = ref(89)
    const archiveTotal = ref('125,890')
    const dataHealth = ref(96)

    // 现代化快捷入口
    const quickAccessItems = ref([
      {
        name: '教师管理',
        desc: '管理教师信息',
        icon: 'User',
        color: '#667eea',
        path: '/teacher-management/teacher',
        badge: 'NEW',
        status: '活跃',
        statusType: 'success',
        disabled: false
      },
      {
        name: '学生管理',
        desc: '管理学生学籍',
        icon: 'UserFilled',
        color: '#f5576c',
        path: '/student-management/student',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '班级管理',
        desc: '管理班级信息',
        icon: 'School',
        color: '#4facfe',
        path: '/teacher-management/class',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '课程管理',
        desc: '管理全校课程',
        icon: 'Reading',
        color: '#43e97b',
        path: '/teacher-management/course',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '资源管理',
        desc: '管理教学资源',
        icon: 'Document',
        color: '#f97316',
        path: '/teacher-management/resource',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '学校管理',
        desc: '组织架构管理',
        icon: 'School',
        color: '#10b981',
        path: '/school-management/school',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '档案工作台',
        desc: '管理师生档案',
        icon: 'Files',
        color: '#fa709a',
        path: '/archive-center/workbench',
        status: '活跃',
        statusType: 'success',
        disabled: false
      },
      {
        name: '智能分析',
        desc: 'AI数据分析',
        icon: 'TrendCharts',
        color: '#6366f1',
        path: '/intelligent-decision/smart-analysis',
        badge: 'AI',
        status: '活跃',
        statusType: 'success',
        disabled: false
      },
      {
        name: '智能推荐',
        desc: '个性化推荐',
        icon: 'Star',
        color: '#f43f5e',
        path: '/intelligent-decision/smart-recommendation',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '应用市场',
        desc: '浏览应用列表',
        icon: 'Shop',
        color: '#8b5cf6',
        path: '/app-market/list',
        badge: 'HOT',
        status: '热门',
        statusType: 'danger',
        disabled: false
      }
    ])

    // 本月教师之星数据
    const teacherStars = ref([
      {
        id: 1,
        name: '张教授',
        avatar: '/images/teacher/cc.png',
        description: '计算机科学教授，AI专家',
        award: '发表S级论文3篇',
        badge: '🏆',
        badgeType: 'gold',
        tagType: 'danger'
      },
      {
        id: 2,
        name: '李副教授',
        avatar: '/images/teacher/28.png',
        description: '经济学副教授，金融研究',
        award: '获得省部级奖项',
        badge: '⭐',
        badgeType: 'silver',
        tagType: 'success'
      },
      {
        id: 3,
        name: '王博士',
        avatar: '/images/teacher/083.png',
        description: '信息管理讲师，数据科学',
        award: '本月最忙碌教师',
        badge: '🔥',
        badgeType: 'bronze',
        tagType: 'warning'
      },
      {
        id: 4,
        name: '陈老师',
        avatar: '/images/teacher/c5.png',
        description: '中文系讲师，古典文学',
        award: '教学竞赛一等奖',
        badge: '💎',
        badgeType: 'bronze',
        tagType: 'success'
      },
      {
        id: 5,
        name: '刘教授',
        avatar: '/images/teacher/66.jpg',
        description: '机械工程教授，智能制造',
        award: '主持国家级项目',
        badge: '🎖️',
        badgeType: 'gold',
        tagType: 'danger'
      },
      {
        id: 6,
        name: '赵老师',
        avatar: '/images/teacher/7b.jpeg',
        description: '英语系讲师，文化研究',
        award: '指导学生获奖',
        badge: '🌟',
        badgeType: 'silver',
        tagType: 'warning'
      }
    ])

    // 现代化最近活动
    const recentActivities = ref([
      {
        id: 1,
        title: '教师信息更新',
        content: '新增教师：张老师',
        time: '2024-01-15 10:30',
        type: 'primary',
        icon: 'User'
      },
      {
        id: 2,
        title: '学生转班',
        content: '学生张三转入班级三年级1班',
        time: '2024-01-15 09:15',
        type: 'success',
        icon: 'UserFilled'
      },
      {
        id: 3,
        title: '课程更新',
        content: '课程《数学》已更新',
        time: '2024-01-14 16:45',
        type: 'warning',
        icon: 'Reading'
      },
      {
        id: 4,
        title: '应用授权',
        content: '新应用"在线考试系统"已授权',
        time: '2024-01-14 14:20',
        type: 'info',
        icon: 'Lock'
      }
    ])

    // 导航到指定页面
    const navigateTo = (path) => {
      router.push(path)
    }

    // 处理快捷入口点击
    const handleQuickAccess = (item) => {
      if (item.disabled) {
        ElMessage.warning('该功能暂未开放，敬请期待！')
        return
      }
      
      console.log('点击快捷入口:', item.name, '路径:', item.path)
      
      // 添加点击动画效果
      ElMessage.success(`正在进入${item.name}...`)
      
      // 延迟跳转，让用户看到消息
      setTimeout(() => {
        console.log('准备跳转到:', item.path)
        router.push(item.path).then(() => {
          console.log('路由跳转成功')
        }).catch(err => {
          console.error('路由跳转失败:', err)
          ElMessage.error('页面跳转失败，请检查路由配置')
        })
      }, 500)
    }

    // 初始化学历环形图
    const initEducationChart = () => {
      if (!educationChartRef.value) {
        console.log('educationChartRef 为空')
        return
      }
      
      educationChartInstance = echarts.init(educationChartRef.value)
      const option = {
        title: {
          text: '学历分布',
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: '{total|总计: {c}}\n{value|{b}}',
            rich: {
              total: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#333'
              },
              value: {
                fontSize: 12,
                color: '#666'
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: teacherStats.value.education.undergraduate, name: '本科', itemStyle: { color: '#5470c6' } },
            { value: teacherStats.value.education.master, name: '硕士', itemStyle: { color: '#91cc75' } },
            { value: teacherStats.value.education.doctor, name: '博士', itemStyle: { color: '#fac858' } }
          ]
        }]
      }
      educationChartInstance.setOption(option)
      console.log('学历分布图表初始化成功')
    }

    // 初始化职称环形图
    const initTitleChart = () => {
      if (!titleChartRef.value) {
        console.log('titleChartRef 为空')
        return
      }
      
      titleChartInstance = echarts.init(titleChartRef.value)
      const option = {
        title: {
          text: '职称分布',
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: '{total|总计: {c}}\n{value|{b}}',
            rich: {
              total: {
                fontSize: 14,
                fontWeight: 'bold',
                color: '#333'
              },
              value: {
                fontSize: 12,
                color: '#666'
              }
            }
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: teacherStats.value.title.assistant, name: '助教', itemStyle: { color: '#ee6666' } },
            { value: teacherStats.value.title.lecturer, name: '讲师', itemStyle: { color: '#73c0de' } },
            { value: teacherStats.value.title.associateProfessor, name: '副教授', itemStyle: { color: '#3ba272' } },
            { value: teacherStats.value.title.professor, name: '教授', itemStyle: { color: '#fc8452' } }
          ]
        }]
      }
      titleChartInstance.setOption(option)
      console.log('职称分布图表初始化成功')
    }

    // 初始化专业环形图
    const initMajorChart = () => {
      if (!majorChartRef.value) {
        console.log('majorChartRef 为空')
        return
      }
      
      majorChartInstance = echarts.init(majorChartRef.value)
      const option = {
        title: {
          text: '专业分布',
          left: 'center',
          textStyle: {
            fontSize: 14,
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'middle',
          textStyle: {
            fontSize: 11
          }
        },
        series: [{
          type: 'pie',
          radius: ['30%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}\n{c}',
            fontSize: 11
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            { value: teacherStats.value.major.computerScience, name: '计算机科学', itemStyle: { color: '#5470c6' } },
            { value: teacherStats.value.major.informationManagement, name: '信息管理', itemStyle: { color: '#91cc75' } },
            { value: teacherStats.value.major.economics, name: '经济学', itemStyle: { color: '#fac858' } },
            { value: teacherStats.value.major.finance, name: '金融学', itemStyle: { color: '#ee6666' } },
            { value: teacherStats.value.major.chineseLanguage, name: '中文', itemStyle: { color: '#73c0de' } },
            { value: teacherStats.value.major.english, name: '英语', itemStyle: { color: '#3ba272' } },
            { value: teacherStats.value.major.mechanicalEngineering, name: '机械工程', itemStyle: { color: '#fc8452' } },
            { value: teacherStats.value.major.electronicEngineering, name: '电子工程', itemStyle: { color: '#9a60b4' } }
          ]
        }]
      }
      majorChartInstance.setOption(option)
      console.log('专业分布图表初始化成功')
    }

    // 初始化学生年级图表
    const initStudentGradeChart = () => {
      if (!studentGradeChartRef.value) {
        console.log('studentGradeChartRef 为空')
        return
      }
      
      studentGradeChartInstance = echarts.init(studentGradeChartRef.value)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}\n{c}'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            { value: studentStats.value.grade.freshman, name: '大一', itemStyle: { color: '#5470c6' } },
            { value: studentStats.value.grade.sophomore, name: '大二', itemStyle: { color: '#91cc75' } },
            { value: studentStats.value.grade.junior, name: '大三', itemStyle: { color: '#fac858' } },
            { value: studentStats.value.grade.senior, name: '大四', itemStyle: { color: '#ee6666' } }
          ]
        }]
      }
      studentGradeChartInstance.setOption(option)
    }

    // 初始化学生学院图表
    const initStudentCollegeChart = () => {
      if (!studentCollegeChartRef.value) {
        console.log('studentCollegeChartRef 为空')
        return
      }
      
      studentCollegeChartInstance = echarts.init(studentCollegeChartRef.value)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}\n{c}'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            { value: studentStats.value.college.computer, name: '计算机', itemStyle: { color: '#5470c6' } },
            { value: studentStats.value.college.economics, name: '经济', itemStyle: { color: '#91cc75' } },
            { value: studentStats.value.college.literature, name: '文学院', itemStyle: { color: '#fac858' } },
            { value: studentStats.value.college.engineering, name: '工程', itemStyle: { color: '#ee6666' } }
          ]
        }]
      }
      studentCollegeChartInstance.setOption(option)
    }

    // 初始化学生专业图表
    const initStudentMajorChart = () => {
      if (!studentMajorChartRef.value) {
        console.log('studentMajorChartRef 为空')
        return
      }
      
      studentMajorChartInstance = echarts.init(studentMajorChartRef.value)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          top: 'middle',
          textStyle: {
            fontSize: 11
          }
        },
        series: [{
          type: 'pie',
          radius: ['30%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}\n{c}',
            fontSize: 11
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: [
            { value: studentStats.value.major.computerScience, name: '计算机科学', itemStyle: { color: '#5470c6' } },
            { value: studentStats.value.major.informationManagement, name: '信息管理', itemStyle: { color: '#91cc75' } },
            { value: studentStats.value.major.economics, name: '经济学', itemStyle: { color: '#fac858' } },
            { value: studentStats.value.major.finance, name: '金融学', itemStyle: { color: '#ee6666' } },
            { value: studentStats.value.major.chineseLanguage, name: '中文', itemStyle: { color: '#73c0de' } },
            { value: studentStats.value.major.english, name: '英语', itemStyle: { color: '#3ba272' } },
            { value: studentStats.value.major.mechanicalEngineering, name: '机械工程', itemStyle: { color: '#fc8452' } },
            { value: studentStats.value.major.electronicEngineering, name: '电子工程', itemStyle: { color: '#9a60b4' } }
          ]
        }]
      }
      studentMajorChartInstance.setOption(option)
    }

    // 初始化工作流图表（按专业统计）- 柱状图
    const initWorkflowChart = () => {
      if (!workflowChartRef.value) return
      
      workflowChartInstance = echarts.init(workflowChartRef.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'bar',
          data: [45, 32, 28, 15, 18, 12, 4, 2],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#43e97b' },
              { offset: 1, color: '#38f9d7' }
            ])
          },
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      }
      workflowChartInstance.setOption(option)
    }

    // 初始化知识库图表（按专业统计）- 柱状图
    const initKnowledgeBaseChart = () => {
      if (!knowledgeBaseChartRef.value) return
      
      knowledgeBaseChartInstance = echarts.init(knowledgeBaseChartRef.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'bar',
          data: [98, 72, 65, 58, 76, 35, 14, 5],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#fa709a' },
              { offset: 1, color: '#fee140' }
            ])
          },
          barWidth: '50%',
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      }
      knowledgeBaseChartInstance.setOption(option)
    }

    // 初始化数字人图表（按专业统计）- 折线图
    const initDigitalHumanChart = () => {
      if (!digitalHumanChartRef.value) return
      
      digitalHumanChartInstance = echarts.init(digitalHumanChartRef.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: [24, 18, 15, 12, 10, 6, 3, 1],
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#667eea',
            width: 3
          },
          itemStyle: {
            color: '#667eea'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      }
      digitalHumanChartInstance.setOption(option)
    }

    // 初始化智能体图表（按专业统计）- 折线图
    const initAgentChart = () => {
      if (!agentChartRef.value) return
      
      agentChartInstance = echarts.init(agentChartRef.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: [56, 42, 38, 34, 32, 18, 8, 6],
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#f093fb',
            width: 3
          },
          itemStyle: {
            color: '#f093fb'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(240, 147, 251, 0.3)' },
              { offset: 1, color: 'rgba(240, 147, 251, 0.1)' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      }
      agentChartInstance.setOption(option)
    }

    // 初始化知识图谱图表（按专业统计）- 折线图
    const initKnowledgeGraphChart = () => {
      if (!knowledgeGraphChartRef.value) return
      
      knowledgeGraphChartInstance = echarts.init(knowledgeGraphChartRef.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: [42, 32, 28, 25, 26, 15, 7, 3],
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#4facfe',
            width: 3
          },
          itemStyle: {
            color: '#4facfe'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(79, 172, 254, 0.3)' },
              { offset: 1, color: 'rgba(79, 172, 254, 0.1)' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      }
      knowledgeGraphChartInstance.setOption(option)
    }

    // 初始化能力图谱图表（按专业统计）- 折线图
    const initAbilityGraphChart = () => {
      if (!abilityGraphChartRef.value) return
      
      abilityGraphChartInstance = echarts.init(abilityGraphChartRef.value)
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '15%',
          right: '10%',
          bottom: '15%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          type: 'line',
          data: [35, 28, 24, 21, 20, 12, 4, 1],
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#43e97b',
            width: 3
          },
          itemStyle: {
            color: '#43e97b'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(67, 233, 123, 0.3)' },
              { offset: 1, color: 'rgba(67, 233, 123, 0.1)' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 10
          }
        }]
      }
      abilityGraphChartInstance.setOption(option)
    }

    // 初始化工作流 vs 智能体对比图表
    const initWorkflowAgentComparison = () => {
      if (!workflowAgentComparisonRef.value) return
      
      workflowAgentComparisonInstance = echarts.init(workflowAgentComparisonRef.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['工作流', '智能体'],
          top: 10,
          textStyle: { fontSize: 12 }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '25%',
          top: '20%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { 
            rotate: 45, 
            fontSize: 10,
            interval: 0,
            formatter: function(value) {
              return value
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '工作流',
            type: 'bar',
            data: [45, 32, 28, 15, 18, 12, 4, 2],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#43e97b' },
                { offset: 1, color: '#38f9d7' }
              ])
            },
            barWidth: '35%',
            label: {
              show: true,
              position: 'top',
              fontSize: 9
            }
          },
          {
            name: '智能体',
            type: 'line',
            data: [56, 42, 38, 34, 32, 18, 8, 6],
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#f093fb',
              width: 3
            },
            itemStyle: {
              color: '#f093fb'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(240, 147, 251, 0.3)' },
                { offset: 1, color: 'rgba(240, 147, 251, 0.1)' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 9
            }
          }
        ]
      }
      workflowAgentComparisonInstance.setOption(option)
    }

    // 初始化知识图谱 vs 能力图谱对比图表
    const initKnowledgeAbilityComparison = () => {
      if (!knowledgeAbilityComparisonRef.value) return
      
      knowledgeAbilityComparisonInstance = echarts.init(knowledgeAbilityComparisonRef.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['知识图谱', '能力图谱'],
          top: 10,
          textStyle: { fontSize: 12 }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '25%',
          top: '20%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { 
            rotate: 45, 
            fontSize: 10,
            interval: 0,
            formatter: function(value) {
              return value
            }
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '知识图谱',
            type: 'bar',
            data: [42, 32, 28, 25, 26, 15, 7, 3],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#4facfe' },
                { offset: 1, color: '#00f2fe' }
              ])
            },
            barWidth: '35%',
            label: {
              show: true,
              position: 'top',
              fontSize: 9
            }
          },
          {
            name: '能力图谱',
            type: 'line',
            data: [35, 28, 24, 21, 20, 12, 4, 1],
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#43e97b',
              width: 3
            },
            itemStyle: {
              color: '#43e97b'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(67, 233, 123, 0.3)' },
                { offset: 1, color: 'rgba(67, 233, 123, 0.1)' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 9
            }
          }
        ]
      }
      knowledgeAbilityComparisonInstance.setOption(option)
    }

    // 初始化课件vs课程对比图表（按专业统计）
    const initCoursewareCourseComparison = () => {
      if (!coursewareCourseComparisonRef.value) return
      
      coursewareCourseComparisonInstance = echarts.init(coursewareCourseComparisonRef.value)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['课件', '课程'],
          top: 10,
          textStyle: { fontSize: 12 }
        },
        grid: {
          left: '10%',
          right: '10%',
          bottom: '15%',
          top: '20%'
        },
        xAxis: {
          type: 'category',
          data: ['计算机科学', '信息管理', '经济学', '金融学', '中文', '英语', '机械工程', '电子工程'],
          axisLabel: { rotate: 30, fontSize: 10 }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '课件',
            type: 'bar',
            data: [245, 189, 156, 134, 198, 156, 112, 55],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ])
            },
            barWidth: '35%',
            label: {
              show: true,
              position: 'top',
              fontSize: 9
            }
          },
          {
            name: '课程',
            type: 'line',
            data: [67, 45, 38, 32, 42, 35, 20, 10],
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#f5576c',
              width: 3
            },
            itemStyle: {
              color: '#f5576c'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(245, 87, 108, 0.3)' },
                { offset: 1, color: 'rgba(245, 87, 108, 0.1)' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              fontSize: 9
            }
          }
        ]
      }
      coursewareCourseComparisonInstance.setOption(option)
    }

    // 初始化集团档案相关图表
    const initArchiveCharts = () => {
      // 1. 年度新增趋势
      if (archiveTrendChartRef.value) {
        archiveTrendChartInstance = echarts.init(archiveTrendChartRef.value)
        const trendOption = {
           tooltip: { trigger: 'axis' },
           grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
           xAxis: {
             type: 'category',
             boundaryGap: false,
             data: ['2019', '2020', '2021', '2022', '2023', '2024'],
             axisLabel: { color: '#666' },
             axisLine: { lineStyle: { color: '#ddd' } }
           },
           yAxis: { 
             type: 'value',
             splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
           },
           series: [
             {
               name: '新增档案',
               type: 'line',
               smooth: true,
               data: [8500, 9200, 10500, 12800, 15600, 18500],
               areaStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(102, 126, 234, 0.4)' },
                    { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
                  ])
               },
               itemStyle: { color: '#667eea' },
               lineStyle: { width: 3 }
             }
           ]
        }
        archiveTrendChartInstance.setOption(trendOption)
      }

      // 2. 各院校总量与数字化率
      if (archiveCollegeChartRef.value) {
        archiveCollegeChartInstance = echarts.init(archiveCollegeChartRef.value)
        const collegeOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' }
          },
          legend: { 
            data: ['档案总量', '数字化率'],
            bottom: 0
          },
          grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
          xAxis: {
            type: 'category',
            data: ['计算机', '经管', '人文', '工程', '艺术'],
            axisPointer: { type: 'shadow' },
            axisLine: { lineStyle: { color: '#ddd' } }
          },
          yAxis: [
            { 
              type: 'value', 
              name: '总量', 
              min: 0, 
              max: 20000,
              splitLine: { show: false }
            },
            { 
              type: 'value', 
              name: '率(%)', 
              min: 0, 
              max: 100,
              splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
            }
          ],
          series: [
            {
              name: '档案总量',
              type: 'bar',
              data: [15000, 12000, 8000, 18000, 5000],
              itemStyle: { 
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4facfe' },
                  { offset: 1, color: '#00f2fe' }
                ])
              },
              barWidth: 20
            },
            {
              name: '数字化率',
              type: 'line',
              yAxisIndex: 1,
              data: [95, 88, 75, 92, 60],
              itemStyle: { color: '#f5576c' },
              lineStyle: { width: 3 }
            }
          ]
        }
        archiveCollegeChartInstance.setOption(collegeOption)
      }
    }

    // 处理窗口大小变化
    const handleResize = () => {
      if (educationChartInstance) educationChartInstance.resize()
      if (titleChartInstance) titleChartInstance.resize()
      if (majorChartInstance) majorChartInstance.resize()
      if (studentGradeChartInstance) studentGradeChartInstance.resize()
      if (studentCollegeChartInstance) studentCollegeChartInstance.resize()
      if (studentMajorChartInstance) studentMajorChartInstance.resize()
      if (knowledgeBaseChartInstance) knowledgeBaseChartInstance.resize()
      if (digitalHumanChartInstance) digitalHumanChartInstance.resize()
      if (workflowAgentComparisonInstance) workflowAgentComparisonInstance.resize()
      if (knowledgeAbilityComparisonInstance) knowledgeAbilityComparisonInstance.resize()
      if (coursewareCourseComparisonInstance) coursewareCourseComparisonInstance.resize()
      if (archiveTrendChartInstance) archiveTrendChartInstance.resize()
      if (archiveCollegeChartInstance) archiveCollegeChartInstance.resize()
    }

    onMounted(() => {
      nextTick(() => {
        initEducationChart()
        initTitleChart()
        initMajorChart()
        initStudentGradeChart()
        initStudentCollegeChart()
        initStudentMajorChart()
        initKnowledgeBaseChart()
        initDigitalHumanChart()
        initWorkflowAgentComparison()
        initKnowledgeAbilityComparison()
        initCoursewareCourseComparison()
        initArchiveCharts()
        window.addEventListener('resize', handleResize)
      })
    })

    onUnmounted(() => {
      if (educationChartInstance) educationChartInstance.dispose()
      if (titleChartInstance) titleChartInstance.dispose()
      if (majorChartInstance) majorChartInstance.dispose()
      if (studentGradeChartInstance) studentGradeChartInstance.dispose()
      if (studentCollegeChartInstance) studentCollegeChartInstance.dispose()
      if (studentMajorChartInstance) studentMajorChartInstance.dispose()
      if (knowledgeBaseChartInstance) knowledgeBaseChartInstance.dispose()
      if (digitalHumanChartInstance) digitalHumanChartInstance.dispose()
      if (workflowAgentComparisonInstance) workflowAgentComparisonInstance.dispose()
      if (knowledgeAbilityComparisonInstance) knowledgeAbilityComparisonInstance.dispose()
      if (coursewareCourseComparisonInstance) coursewareCourseComparisonInstance.dispose()
      if (archiveTrendChartInstance) archiveTrendChartInstance.dispose()
      if (archiveCollegeChartInstance) archiveCollegeChartInstance.dispose()
      window.removeEventListener('resize', handleResize)
    })

    return {
      teacherStats,
      studentStats,
      resourceStats,
      teacherTotal,
      studentTotal,
      reportTotal,
      archiveTotal,
      dataHealth,
      quickAccessItems,
      teacherStars,
      recentActivities,
      navigateTo,
      handleQuickAccess,
      educationChartRef,
      titleChartRef,
      majorChartRef,
      studentGradeChartRef,
      studentCollegeChartRef,
      studentMajorChartRef,
      knowledgeBaseChartRef,
      digitalHumanChartRef,
      workflowAgentComparisonRef,
      knowledgeAbilityComparisonRef,
      coursewareCourseComparisonRef,
      archiveTrendChartRef,
      archiveCollegeChartRef,
      archiveMetrics,
      activeArchiveTab,
      archiveTasks,
      storageStatus,
      utilizationRankings
    }
  }
}
</script>

<style scoped>
.home {
  padding: 0;
  animation: fadeInUp 0.8s ease-out;
}

/* 官方风格页面标题 */
.official-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 24px;
  border-left: 5px solid #0052cc;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.header-title-area {
  display: flex;
  align-items: center;
  gap: 20px;
}

.system-logo {
  width: 56px;
  height: 56px;
  background: #eff6ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0052cc;
  font-size: 32px;
}

.system-title-box {
  display: flex;
  flex-direction: column;
}

.system-name {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #172b4d;
}

@supports ((-webkit-background-clip: text) or (background-clip: text)) {
  .system-name {
    background: linear-gradient(
      105deg,
      #0f2740 0%,
      #172b4d 42%,
      #1a4d8c 78%,
      #0052cc 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}

.system-sub-name {
  font-size: 13px;
  color: #6b778c;
  text-transform: uppercase;
  margin-top: 4px;
  font-weight: 500;
  letter-spacing: 1px;
}

.header-data-strip {
  display: flex;
  align-items: center;
  gap: 32px;
}

.header-stat-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.h-label {
  font-size: 12px;
  color: #7a869a;
  margin-bottom: 4px;
}

.h-value {
  font-size: 24px;
  font-weight: 700;
  color: #172b4d;
  font-family: 'DIN Alternate', 'Helvetica Neue', Arial, sans-serif;
  line-height: 1;
}

.h-value.highlight {
  color: #0052cc;
}

.h-divider {
  width: 1px;
  height: 32px;
  background: #dfe1e6;
}

@media (max-width: 992px) {
  .official-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    padding: 20px;
  }
  
  .header-data-strip {
    width: 100%;
    justify-content: space-between;
    gap: 16px;
  }
  
  .h-value {
    font-size: 20px;
  }
  
  .system-logo {
    width: 48px;
    height: 48px;
    font-size: 28px;
  }
  
  .system-name {
    font-size: 20px;
  }
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, transparent 100%);
  border-radius: 20px;
  z-index: 1;
  pointer-events: none;
}

.page-header .header-content {
  position: relative;
  z-index: 2;
}

.header-content {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b46c1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 12px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 18px;
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(3px);
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-badge:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
  background: rgba(255, 255, 255, 1);
}

.stat-badge .stat-number {
  font-size: 34px;
  font-weight: 400;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
}

.stat-badge .stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

/* 现代化章节标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  color: #1f2937;
  font-size: 18px;
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

.section-actions {
  display: flex;
  gap: 12px;
}

.dashboard-section,
.quick-access-section,
.teacher-star-section,
.recent-activities-section {
  margin-bottom: 48px;
}

/* 教师之星样式 */
.teacher-star-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.teacher-star-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: auto;
  position: relative;
}

.teacher-star-card .el-card__body {
  padding: 12px;
}

.teacher-star-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.teacher-avatar-wrapper {
  position: relative;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.teacher-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e4e7ed;
  transition: all 0.3s ease;
}

.teacher-star-card:hover .teacher-avatar {
  border-color: #409eff;
  transform: scale(1.05);
}

.teacher-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.teacher-badge.gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
}

.teacher-badge.silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%);
}

.teacher-badge.bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #8B4513 100%);
}

.teacher-info {
  text-align: center;
}

.teacher-name {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.teacher-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 6px;
  line-height: 1.4;
  height: 34px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  padding: 0 2px;
}

.teacher-award {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
}

.teacher-award .el-tag {
  height: 20px;
  padding: 0 6px;
  font-size: 11px;
}

/* 现代化数据卡片 */
.dashboard-card {
  height: 240px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-card.horizontal-card {
  height: auto;
  min-height: 180px;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.teacher-card::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.student-card::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.class-card::before {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.course-card::before {
  background: linear-gradient(90deg, #43e97b, #38f9d7);
}

.resource-card::before {
  background: linear-gradient(90deg, #fa709a, #fee140);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.teacher-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.student-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.class-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.course-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.resource-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.card-title h3 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.card-title p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 400;
}

.card-trend {
  display: flex;
  align-items: center;
}

.trend-up {
  color: #10b981;
  font-size: 14px;
  font-weight: 600;
}

.dashboard-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 140px;
}

.dashboard-content.single-stat {
  justify-content: center;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-progress {
  width: 100%;
}

/* 水平看板内容 */
.horizontal-dashboard-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  flex-wrap: wrap;
  gap: 24px;
}

.stat-group {
  flex: 1;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.group-title {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  text-align: center;
}

.group-value {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  text-align: center;
}

.group-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.group-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-label-name {
  font-size: 12px;
  color: #9ca3af;
}

.stat-label-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: linear-gradient(180deg, transparent, #e5e7eb, transparent);
  margin: 0 12px;
}

.group-stats.multiple-rows {
  max-width: 400px;
  justify-content: flex-start;
}

/* 现代化快捷入口 */
.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.quick-access-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: auto;
  min-height: 100px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
}

.quick-access-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: rgba(102, 126, 234, 0.2);
}

.quick-access-card.card-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #f8f9fa;
}

.quick-access-card.card-disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.06);
}

.quick-access-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 12px 8px;
  position: relative;
}

.quick-access-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  margin-bottom: 8px;
  font-size: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: #ffffff;
  border: 2px solid currentColor;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.quick-access-card:hover .quick-access-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.icon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
  transform: scale(0.8);
}

@keyframes pulse {
  0%, 100% { transform: scale(0.8); }
  50% { transform: scale(0.9); }
}

.quick-access-text {
  width: 100%;
  text-align: center;
}

.quick-access-title {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
}

.card-overlay .el-icon {
  font-size: 20px;
  margin-bottom: 4px;
  color: #9ca3af;
}

/* 现代化活动时间线 */
.activities-card {
  padding: 32px;
}

.activity-content {
  padding-left: 16px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  /* Removed quick-access-grid override to keep 10 columns */
  .chart-card {
    height: 350px;
  }
}

@media (max-width: 992px) {
  .quick-access-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  
  .teacher-star-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-badge {
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px;
  }
  
  .dashboard-content {
    flex-direction: column;
    gap: 16px;
    height: auto;
  }
  
  .quick-access-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .teacher-star-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .quick-access-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 20px;
  }
  
  .quick-access-icon {
    margin-right: 0;
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
  
  .quick-access-title {
    font-size: 16px;
  }
  
  .quick-access-desc {
    font-size: 13px;
  }
  
  .quick-access-card {
    height: 110px;
  }
  
  .horizontal-dashboard-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .stat-group {
    width: 100%;
    min-width: auto;
  }
  
  .stat-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
    margin: 8px 0;
  }
  
  .group-stats {
    gap: 16px;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;
  }
  
  .group-stats.multiple-rows {
    max-width: 100%;
  }
  
  .group-value {
    font-size: 28px;
  }
  
  .stat-label-value {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .dashboard-card {
    height: auto;
    min-height: 200px;
  }
  
  .teacher-star-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .teacher-star-card {
    height: auto;
    min-height: 220px;
  }
  
  .teacher-star-card .el-card__body {
    padding: 16px;
  }
  
  .teacher-avatar {
    width: 60px;
    height: 60px;
  }
  
  .teacher-name {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  .teacher-desc {
    font-size: 11px;
    min-height: 40px;
    margin-bottom: 8px;
    line-height: 1.5;
  }
}

/* 图表卡片样式 */
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

@media (max-width: 1200px) {
}

/* 官方严谨数据风格 */
.data-governance-section {
  margin-bottom: 32px;
}

.governance-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px; /* 较小的圆角体现严谨 */
  background: #fff;
}

.governance-card :deep(.el-card__header) {
  padding: 16px 24px;
  background: #f8f9fa; /* 极淡的灰色背景 */
  border-bottom: 1px solid #ebeef5;
}

.governance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-line {
  width: 4px;
  height: 18px;
  background: #0052cc; /* 官方蓝 */
  border-radius: 2px;
}

.header-text {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  letter-spacing: 0.5px;
}

.header-en {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  margin-left: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 摘要面板 */
.summary-col {
  border-right: 1px solid #f0f2f5;
  padding-right: 24px !important;
}

.summary-panel {
  padding: 10px 0;
}

.metric-title {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
  font-weight: 500;
}

.metric-num-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.metric-num {
  font-size: 36px;
  font-weight: 700;
  color: #303133;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  line-height: 1;
}

.metric-unit {
  font-size: 14px;
  color: #909399;
}

.metric-trend-row {
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-value.up {
  color: #f56c6c;
  display: flex;
  align-items: center;
  font-weight: 600;
  gap: 2px;
}

.summary-divider {
  height: 1px;
  background: #ebeef5;
  margin: 24px 0;
}

/* 性别结构 */
.sub-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.gender-bar-box {
  margin-bottom: 16px;
}

.gender-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.gender-label {
  color: #606266;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gender-val {
  color: #303133;
  font-weight: 600;
}

/* 图表网格 */
.charts-panel {
  padding: 10px 0;
}

.chart-box {
  background: #fff;
  padding: 0 12px;
}

.chart-box.bordered {
  border-left: 1px dashed #e4e7ed;
  border-right: 1px dashed #e4e7ed;
}

.chart-header {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #f2f6fc;
  display: inline-block;
  width: 100%;
}

.chart-body {
  width: 100%;
  height: 220px; /* 图表高度适度缩减，更紧凑 */
}

/* 资源列表样式 */
.resource-list-box {
  margin-top: 20px;
}

.resource-stat-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-stat-item {
  width: 100%;
}

.stat-row-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.stat-label {
  color: #606266;
}

.stat-val {
  color: #303133;
  font-weight: 600;
}

.chart-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #909399;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid #ebeef5;
}

.bordered-left {
  border-left: 1px dashed #e4e7ed;
}

/* 集团档案概览样式 */
.group-archive-section {
  margin-bottom: 32px;
}

.section-sub-header {
  display: flex;
  align-items: baseline;
  margin-bottom: 20px;
  gap: 12px;
}

.sub-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.sub-title .title-icon {
  color: #667eea;
  font-size: 20px;
}

.sub-desc {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

/* 关键指标卡片 */
.metric-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 140px;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.metric-card.blue-gradient::before { background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)); }
.metric-card.purple-gradient::before { background: linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.1)); }
.metric-card.green-gradient::before { background: linear-gradient(135deg, rgba(67, 233, 123, 0.1), rgba(56, 249, 215, 0.1)); }
.metric-card.orange-gradient::before { background: linear-gradient(135deg, rgba(250, 112, 154, 0.1), rgba(254, 225, 64, 0.1)); }

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.metric-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
  position: relative;
  z-index: 1;
}

.metric-card.blue-gradient .metric-icon-wrapper { background: rgba(102, 126, 234, 0.1); color: #667eea; }
.metric-card.purple-gradient .metric-icon-wrapper { background: rgba(245, 87, 108, 0.1); color: #f5576c; }
.metric-card.green-gradient .metric-icon-wrapper { background: rgba(67, 233, 123, 0.1); color: #10b981; }
.metric-card.orange-gradient .metric-icon-wrapper { background: rgba(250, 112, 154, 0.1); color: #f97316; }

.metric-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.metric-value-group {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.metric-unit {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.metric-trend .trend-val {
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;
}

.metric-trend.trend-up .trend-val { color: #f5576c; }
.metric-trend.trend-down .trend-val { color: #10b981; }
.metric-trend.trend-warning .trend-val { color: #f97316; }

.metric-bg-icon {
  position: absolute;
  right: -20px;
  bottom: -20px;
  font-size: 100px;
  opacity: 0.05;
  color: #000;
  z-index: 0;
  transform: rotate(-15deg);
}

/* 图表与监控卡片 */
.archive-chart-card, .archive-monitor-card {
  height: 380px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.archive-chart-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.header-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-item .dot.line { background: #667eea; }
.legend-item .dot.bar { background: #4facfe; }
.legend-item .dot.mix { background: #f5576c; }

.chart-wrapper {
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 12px;
}

/* 监控列表样式 */
.monitor-tabs :deep(.el-tabs__header) {
  margin: 0;
}
.monitor-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.monitor-list {
  padding: 20px;
  height: 320px;
  overflow-y: auto;
}

.monitor-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-item, .storage-item {
  margin-bottom: 16px;
}

.task-info, .storage-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.task-name, .storage-name {
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
}

.storage-val {
  font-size: 12px;
  color: #6b7280;
}
.storage-val.warning-text { color: #f56c6c; font-weight: bold; }

.monitor-divider {
  height: 1px;
  background: #f0f2f5;
  margin: 16px 0;
}

.ranking-list {
  padding: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-bottom: 1px dashed #f0f2f5;
}

.ranking-item:last-child {
  border-bottom: none;
}

.ranking-index {
  width: 24px;
  height: 24px;
  background: #f3f4f6;
  color: #9ca3af;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.ranking-index.top-3 {
  background: #e0e7ff;
  color: #667eea;
}

.ranking-content {
  flex: 1;
}

.ranking-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 6px;
}

.ranking-name { color: #374151; font-weight: 500; }
.ranking-val { color: #667eea; font-weight: 600; }

@media (max-width: 768px) {
  .metric-card {
    height: auto;
    flex-direction: column;
    padding: 16px;
  }
  .metric-icon-wrapper {
    margin-bottom: 12px;
  }
}
</style>