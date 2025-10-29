<template>
  <div class="analysis-results">
    <!-- 头部操作栏 -->
    <div class="results-header">
      <h3>分析结果对比</h3>
      <el-button @click="handleExport" type="primary">
        <el-icon><Download /></el-icon>
        导出报告
      </el-button>
    </div>
    
    <!-- 并排对比展示 -->
    <div class="comparison-container">
      <div 
        v-for="(teacherResult, index) in results.teacherResults" 
        :key="teacherResult.teacherId"
        class="comparison-card"
      >
        <!-- 教师信息头部 -->
        <div class="card-header-section">
          <div class="teacher-profile">
            <img :src="teacherResult.teacherAvatar" :alt="teacherResult.teacherName" class="teacher-avatar" />
            <div class="teacher-details">
              <h4>{{ teacherResult.teacherName }}</h4>
              <p>{{ teacherResult.department }} · {{ teacherResult.position }}</p>
            </div>
          </div>
          <div class="overall-score-badge">
            <div class="score-number">{{ teacherResult.overallScore }}</div>
            <div class="score-text">综合评分</div>
          </div>
        </div>
        
        <!-- 详细评分 -->
        <div class="card-body-section">
          <!-- 指标卡片 - 单列垂直排列（根据所选维度动态渲染） -->
          <div class="metrics-list">
            <div 
              v-for="metricKey in metricKeysToShow" 
              :key="metricKey" 
              class="metric-item" 
              :class="metricKey"
            >
              <div class="metric-icon">
                <el-icon><component :is="getMetricIcon(metricKey)" /></el-icon>
              </div>
              <div class="metric-content">
                <span class="metric-label">{{ getMetricLabel(metricKey) }}</span>
                <div class="metric-bar">
                  <div class="metric-bar-fill" :style="{ width: getMetricScore(teacherResult, metricKey) + '%' }"></div>
                </div>
              </div>
              <div class="metric-score">{{ getMetricScore(teacherResult, metricKey) }}</div>
            </div>
          </div>
          
          <!-- 关键洞察 -->
          <div class="insights-block">
            <h5>关键洞察</h5>
            <div class="insights-list">
              <div 
                v-for="insight in teacherResult.insights" 
                :key="insight.id"
                class="insight-item"
                :class="insight.type"
              >
                <div class="insight-icon-wrapper">
                  <el-icon><component :is="insight.icon" /></el-icon>
                </div>
                <div class="insight-text">
                  <h6>{{ insight.title }}</h6>
                  <p>{{ insight.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 改进建议 -->
          <div v-if="teacherResult.recommendations" class="recommendations-block">
            <div 
              v-for="(recommendations, dimension) in teacherResult.recommendations" 
              :key="dimension"
              class="recommendation-category"
            >
              <h6>{{ getRecommendationTitle(dimension) }}：</h6>
              <ul>
                <li v-for="(rec, idx) in recommendations" :key="idx">{{ rec }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Download,
  User,
  Trophy,
  Star,
  DataAnalysis,
  Document,
  Connection,
  TrendCharts,
  Monitor,
  Share,
  Clock,
  Warning,
  InfoFilled,
  Bell,
  School,
  Promotion
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'AnalysisResults',
  components: {
    Download,
    User,
    Trophy,
    Star,
    DataAnalysis,
    Document,
    Connection,
    TrendCharts,
    Monitor,
    Share,
    Clock,
    Warning,
    InfoFilled,
    Bell,
    School,
    Promotion
  },
  props: {
    results: {
      type: Object,
      required: true,
      default: () => ({
        teacherResults: [],
        comparisonMode: false
      })
    },
    selectedDimensions: {
      type: Array,
      default: () => []
    },
    dimensionMap: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const handleExport = () => {
      ElMessage.success('报告导出功能开发中...')
    }
    
    const getDimensionName = (dimensionKey) => {
      return props.dimensionMap[dimensionKey] || dimensionKey
    }
    
    // 获取指定教师在指定维度下的分析数据
    const getDimensionForTeacher = (teacherResult, dimensionKey) => {
      return teacherResult.dimensions?.find(d => d.key === dimensionKey)
    }
    
    const getRecommendationTitle = (dimension) => {
      const titleMap = {
        teaching: '教学能力',
        research: '科研能力',
        student: '学生评价',
        peer: '同事评价',
        achievement: '成果产出',
        development: '职业发展'
      }
      return titleMap[dimension] || dimension
    }
    
    // 动态指标 keys：优先采用已选维度，否则使用默认四项
    const metricKeysToShow = computed(() => {
      if (props.selectedDimensions && props.selectedDimensions.length > 0) {
        return props.selectedDimensions
      }
      return ['teaching', 'research', 'student', 'peer']
    })
    
    // 获取指标中文标签
    const getMetricLabel = (key) => {
      return getRecommendationTitle(key) || props.dimensionMap[key] || key
    }
    
    // 获取指标 icon 组件名（使用已导入的图标，避免新增依赖）
    const getMetricIcon = (key) => {
      const iconMap = {
        teaching: 'User',
        research: 'DataAnalysis',
        student: 'Star',
        peer: 'Trophy',
        achievement: 'DataAnalysis',
        development: 'User'
      }
      return iconMap[key] || 'DataAnalysis'
    }
    
    // 统一读取分数：优先 teacherResult[`${key}Score`]；否则从 dimensions 数组中读取 score 字段
    const getMetricScore = (teacherResult, key) => {
      const direct = teacherResult?.[`${key}Score`]
      if (typeof direct === 'number') return direct
      const fromDim = teacherResult?.dimensions?.find(d => d.key === key)
      if (fromDim && typeof fromDim.score === 'number') return fromDim.score
      return 0
    }
    
    return {
      handleExport,
      getDimensionName,
      getDimensionForTeacher,
      getRecommendationTitle,
      metricKeysToShow,
      getMetricLabel,
      getMetricIcon,
      getMetricScore
    }
  }
})
</script>

<style scoped>
.analysis-results {
  margin-top: 24px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

/* 并排对比容器 - 三列网格布局 */
.comparison-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.comparison-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.comparison-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 卡片头部 */
.card-header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  background: #fafafa;
  border-bottom: 1px solid #e5e7eb;
}

.teacher-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.teacher-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-details h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.teacher-details p {
  margin: 2px 0 0 0;
  font-size: 13px;
  color: #6b7280;
}

/* 综合评分圆圈 */
.overall-score-badge {
  width: 68px;
  height: 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #8b5cf6;
  border-radius: 50%;
  color: white;
}

.score-number {
  font-size: 22px;
  font-weight: 700;
}

.score-text {
  font-size: 11px;
  opacity: 0.95;
}

/* 卡片主体 */
.card-body-section {
  padding: 18px;
}

/* 指标列表 - 单列垂直排列 */
.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0;
}

.metric-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 18px;
  flex-shrink: 0;
}

.metric-item.teaching .metric-icon {
  background: #3b82f6;
  color: white;
}

.metric-item.research .metric-icon {
  background: #10b981;
  color: white;
}

.metric-item.student .metric-icon {
  background: #f59e0b;
  color: white;
}

.metric-item.peer .metric-icon {
  background: #8b5cf6;
  color: white;
}

/* 新增：成果产出、职业发展 */
.metric-item.achievement .metric-icon {
  background: #06b6d4; /* cyan-500 */
  color: white;
}

.metric-item.development .metric-icon {
  background: #ef4444; /* red-500 */
  color: white;
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.metric-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.metric-item.teaching .metric-bar-fill {
  background: #3b82f6;
}

.metric-item.research .metric-bar-fill {
  background: #10b981;
}

.metric-item.student .metric-bar-fill {
  background: #f59e0b;
}

.metric-item.peer .metric-bar-fill {
  background: #8b5cf6;
}

/* 新增进度条颜色 */
.metric-item.achievement .metric-bar-fill {
  background: #06b6d4;
}

.metric-item.development .metric-bar-fill {
  background: #ef4444;
}

.metric-score {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  min-width: 32px;
  text-align: right;
}

/* 关键洞察区域 */
.insights-block {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.insights-block h5 {
  margin: 0 0 14px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
}

.insight-item.strength {
  background: rgba(16, 185, 129, 0.08);
}

.insight-item.improvement {
  background: rgba(245, 158, 11, 0.08);
}

.insight-icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-size: 14px;
  flex-shrink: 0;
}

.insight-item.strength .insight-icon-wrapper {
  background: #10b981;
  color: white;
}

.insight-item.improvement .insight-icon-wrapper {
  background: #f59e0b;
  color: white;
}

.insight-item.opportunity {
  background: rgba(139, 92, 246, 0.08);
}

.insight-item.opportunity .insight-icon-wrapper {
  background: #8b5cf6;
  color: white;
}

.insight-item.warning {
  background: rgba(239, 68, 68, 0.08);
}

.insight-item.warning .insight-icon-wrapper {
  background: #ef4444;
  color: white;
}

.insight-text {
  flex: 1;
}

.insight-text h6 {
  margin: 0 0 2px 0;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.insight-text p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

/* 改进建议区域 */
.recommendations-block {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.recommendation-category {
  margin-bottom: 14px;
}

.recommendation-category:last-child {
  margin-bottom: 0;
}

.recommendation-category h6 {
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
}

.recommendation-category ul {
  margin: 0;
  padding-left: 20px;
}

.recommendation-category li {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 4px;
}

.recommendation-category li:last-child {
  margin-bottom: 0;
}

/* 维度分析对比 */
.dimension-analysis-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}

.dimension-header {
  margin-bottom: 24px;
}

.dimension-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* 纵列通列列表 */
.dimension-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dimension-lane-column {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.lane-column-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.lane-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.lane-teacher-name {
  font-size: 15px;
  font-weight: 600;
}

.lane-column-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dimension-card {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dimension-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 单行卡片样式（纵列） */
.dimension-row-card {
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.dimension-row-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dimension-row-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dimension-row-teacher {
  font-weight: 600;
  color: #111827;
}

.dimension-row-sep {
  color: #9ca3af;
}

.dimension-row-title {
  color: #4b5563;
}

.dimension-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.dimension-details {
  padding: 12px 0;
}

.dimension-analysis {
  margin-bottom: 16px;
}

.dimension-analysis p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.dimension-suggestions {
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.dimension-suggestions h6 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.dimension-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.dimension-suggestions li {
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.5;
}

.dimension-suggestions li:last-child {
  margin-bottom: 0;
}

/* 响应式优化 */
@media (max-width: 1400px) {
  .comparison-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dimension-lanes-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1000px) {
  .comparison-container {
    grid-template-columns: 1fr;
  }
  
  .dimension-lanes-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .card-header-section {
    flex-direction: column;
    gap: 16px;
    align-items: center;
    text-align: center;
  }
  
  .teacher-profile {
    flex-direction: column;
    width: 100%;
  }
  
  .metrics-list {
    gap: 12px;
  }
  
  .metric-item {
    gap: 10px;
  }
  
  .metric-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
  
  .dimension-lanes-container {
    grid-template-columns: 1fr;
  }
  
  .lane-column-content {
    padding: 16px;
    gap: 12px;
  }
}
</style>

