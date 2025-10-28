<template>
  <div class="smart-analysis-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><TrendCharts /></el-icon>
            智能分析
          </h1>
          <p class="page-subtitle">针对特定教师进行深度综合分析，提供全面的评估报告</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="startAnalysis" :loading="isAnalyzing">
            <el-icon><Search /></el-icon>
            开始分析
          </el-button>
        </div>
      </div>
    </div>

    <!-- 教师选择区域 -->
    <el-card class="teacher-selection-card" v-if="!selectedTeacher" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>选择分析对象</h3>
          <p>请选择需要进行分析的教师</p>
        </div>
      </template>
      
      <div class="teacher-search-section">
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="输入教师姓名、工号或部门进行搜索"
            @input="handleSearch"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="teacher-list" v-if="filteredTeachers.length > 0">
          <div 
            v-for="teacher in filteredTeachers" 
            :key="teacher.id"
            class="teacher-item"
            @click="selectTeacher(teacher)"
          >
            <div class="teacher-avatar">
              <img :src="teacher.avatar || '/images/default-avatar.png'" :alt="teacher.name" />
            </div>
            <div class="teacher-info">
              <h4 class="teacher-name">{{ teacher.name }}</h4>
              <p class="teacher-details">
                <span class="teacher-id">工号：{{ teacher.id }}</span>
                <span class="teacher-department">{{ teacher.department }}</span>
              </p>
              <div class="teacher-tags">
                <el-tag v-for="tag in teacher.tags" :key="tag" size="small">{{ tag }}</el-tag>
              </div>
            </div>
            <div class="teacher-stats">
              <div class="stat-item">
                <span class="stat-value">{{ teacher.teachingYears }}</span>
                <span class="stat-label">教龄</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ teacher.studentCount }}</span>
                <span class="stat-label">学生数</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="empty-state" v-else-if="searchQuery">
          <el-empty description="未找到匹配的教师" />
        </div>
      </div>
    </el-card>

    <!-- 分析配置区域 -->
    <el-card class="analysis-config-card" v-if="selectedTeacher && !isAnalyzing" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>分析配置</h3>
          <p>配置分析维度和参数</p>
        </div>
      </template>
      
      <div class="selected-teacher-info">
        <div class="teacher-summary">
          <img :src="selectedTeacher.avatar || '/images/default-avatar.png'" :alt="selectedTeacher.name" />
          <div class="summary-content">
            <h4>{{ selectedTeacher.name }}</h4>
            <p>{{ selectedTeacher.department }} · {{ selectedTeacher.position }}</p>
          </div>
          <el-button text @click="clearSelection">重新选择</el-button>
        </div>
      </div>
      
      <div class="analysis-dimensions">
        <h4>分析维度</h4>
        <div class="dimensions-grid">
          <div 
            v-for="dimension in analysisDimensions" 
            :key="dimension.key"
            class="dimension-item"
            :class="{ active: selectedDimensions.includes(dimension.key) }"
            @click="toggleDimension(dimension.key)"
          >
            <div class="dimension-icon">
              <el-icon><component :is="dimension.icon" /></el-icon>
            </div>
            <div class="dimension-content">
              <h5>{{ dimension.name }}</h5>
              <p>{{ dimension.description }}</p>
            </div>
            <div class="dimension-check">
              <el-icon v-if="selectedDimensions.includes(dimension.key)"><Check /></el-icon>
            </div>
          </div>
        </div>
      </div>
      
      <div class="analysis-settings">
        <h4>分析设置</h4>
        <div class="settings-row">
          <div class="setting-item">
            <label>分析时间范围</label>
            <el-select v-model="analysisSettings.timeRange" placeholder="选择时间范围">
              <el-option label="最近一年" value="1year" />
              <el-option label="最近半年" value="6months" />
              <el-option label="最近三个月" value="3months" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </div>
          <div class="setting-item">
            <label>分析深度</label>
            <el-select v-model="analysisSettings.depth" placeholder="选择分析深度">
              <el-option label="基础分析" value="basic" />
              <el-option label="深度分析" value="deep" />
              <el-option label="全面分析" value="comprehensive" />
            </el-select>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 分析进度区域 -->
    <el-card class="analysis-progress-card" v-if="isAnalyzing" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>分析进行中</h3>
          <p>正在对 {{ selectedTeacher.name }} 进行综合分析</p>
        </div>
      </template>
      
      <div class="progress-content">
        <div class="progress-steps">
          <div 
            v-for="(step, index) in analysisSteps" 
            :key="step.key"
            class="progress-step"
            :class="{ 
              active: currentStep === index,
              completed: currentStep > index,
              pending: currentStep < index
            }"
          >
            <div class="step-icon">
              <el-icon v-if="currentStep > index"><Check /></el-icon>
              <el-icon v-else-if="currentStep === index"><Loading /></el-icon>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-content">
              <h5>{{ step.name }}</h5>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="progress-bar">
          <el-progress 
            :percentage="analysisProgress" 
            :stroke-width="8"
            :show-text="false"
          />
          <div class="progress-text">
            <span>{{ analysisProgress }}%</span>
            <span>{{ currentStepName }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 分析结果区域 -->
    <div class="analysis-results" v-if="analysisResults">
      <el-card class="results-summary-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3>分析概览</h3>
            <div class="header-actions">
              <el-button @click="exportReport">
                <el-icon><Download /></el-icon>
                导出报告
              </el-button>
            </div>
          </div>
        </template>
        
        <div class="summary-content">
          <div class="overall-score">
            <div class="score-circle">
              <div class="score-value">{{ analysisResults.overallScore }}</div>
              <div class="score-label">综合评分</div>
            </div>
            <div class="score-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">教学能力</span>
                <div class="breakdown-bar">
                  <div class="breakdown-fill" :style="{ width: analysisResults.teachingScore + '%' }"></div>
                </div>
                <span class="breakdown-value">{{ analysisResults.teachingScore }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">科研能力</span>
                <div class="breakdown-bar">
                  <div class="breakdown-fill" :style="{ width: analysisResults.researchScore + '%' }"></div>
                </div>
                <span class="breakdown-value">{{ analysisResults.researchScore }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">学生评价</span>
                <div class="breakdown-bar">
                  <div class="breakdown-fill" :style="{ width: analysisResults.studentScore + '%' }"></div>
                </div>
                <span class="breakdown-value">{{ analysisResults.studentScore }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">同事评价</span>
                <div class="breakdown-bar">
                  <div class="breakdown-fill" :style="{ width: analysisResults.peerScore + '%' }"></div>
                </div>
                <span class="breakdown-value">{{ analysisResults.peerScore }}</span>
              </div>
            </div>
          </div>
          
          <div class="key-insights">
            <h4>关键洞察</h4>
            <div class="insights-list">
              <div 
                v-for="insight in analysisResults.insights" 
                :key="insight.id"
                class="insight-item"
                :class="insight.type"
              >
                <div class="insight-icon">
                  <el-icon><component :is="insight.icon" /></el-icon>
                </div>
                <div class="insight-content">
                  <h5>{{ insight.title }}</h5>
                  <p>{{ insight.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      
      <div class="detailed-results">
        <el-card class="dimension-result-card" v-for="dimension in analysisResults.dimensions" :key="dimension.key" shadow="never">
          <template #header>
            <div class="card-header">
              <h3>{{ dimension.name }}</h3>
              <div class="dimension-score">
                <span class="score">{{ dimension.score }}</span>
                <span class="label">分</span>
              </div>
            </div>
          </template>
          
          <div class="dimension-content">
            <div class="dimension-chart">
              <div class="chart-placeholder">
                <el-icon><TrendCharts /></el-icon>
                <p>{{ dimension.name }}趋势图</p>
              </div>
            </div>
            
            <div class="dimension-details">
              <div class="detail-section">
                <h5>详细分析</h5>
                <p>{{ dimension.analysis }}</p>
              </div>
              
              <div class="detail-section">
                <h5>改进建议</h5>
                <ul class="suggestions-list">
                  <li v-for="suggestion in dimension.suggestions" :key="suggestion">{{ suggestion }}</li>
                </ul>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { 
  TrendCharts, 
  Search, 
  Check, 
  Loading, 
  Download,
  User,
  Trophy,
  Star,
  DataAnalysis,
  Message,
  Document,
  Setting
} from '@element-plus/icons-vue'

export default {
  name: 'SmartAnalysis',
  components: {
    TrendCharts,
    Search,
    Check,
    Loading,
    Download,
    User,
    Trophy,
    Star,
    DataAnalysis,
    Message,
    Document,
    Setting
  },
  setup() {
    // 响应式数据
    const searchQuery = ref('')
    const selectedTeacher = ref(null)
    const isAnalyzing = ref(false)
    const analysisProgress = ref(0)
    const currentStep = ref(0)
    const analysisResults = ref(null)
    
    // 教师数据
    const teachers = ref([
      {
        id: 'T001',
        name: '张教授',
        department: '计算机学院',
        position: '教授',
        avatar: '/images/teacher1.jpg',
        teachingYears: 15,
        studentCount: 120,
        tags: ['优秀教师', '科研骨干']
      },
      {
        id: 'T002',
        name: '李老师',
        department: '数学学院',
        position: '副教授',
        avatar: '/images/teacher2.jpg',
        teachingYears: 8,
        studentCount: 80,
        tags: ['教学能手', '青年才俊']
      },
      {
        id: 'T003',
        name: '王博士',
        department: '物理学院',
        position: '讲师',
        avatar: '/images/teacher3.jpg',
        teachingYears: 3,
        studentCount: 60,
        tags: ['新锐教师', '创新教学']
      }
    ])
    
    // 分析维度
    const analysisDimensions = ref([
      {
        key: 'teaching',
        name: '教学能力',
        description: '课堂教学、课程设计、教学方法等',
        icon: 'User'
      },
      {
        key: 'research',
        name: '科研能力',
        description: '学术研究、论文发表、项目申请等',
        icon: 'Trophy'
      },
      {
        key: 'student',
        name: '学生评价',
        description: '学生满意度、学习效果、师生关系等',
        icon: 'Star'
      },
      {
        key: 'peer',
        name: '同事评价',
        description: '团队协作、专业素养、工作态度等',
        icon: 'Message'
      },
      {
        key: 'achievement',
        name: '成果产出',
        description: '教学成果、科研成果、获奖情况等',
        icon: 'Document'
      },
      {
        key: 'development',
        name: '职业发展',
        description: '培训学习、职业规划、成长轨迹等',
        icon: 'Setting'
      }
    ])
    
    const selectedDimensions = ref(['teaching', 'research', 'student', 'peer'])
    
    // 分析设置
    const analysisSettings = reactive({
      timeRange: '1year',
      depth: 'deep'
    })
    
    // 分析步骤
    const analysisSteps = ref([
      {
        key: 'data_collection',
        name: '数据收集',
        description: '收集教师相关数据'
      },
      {
        key: 'teaching_analysis',
        name: '教学分析',
        description: '分析教学能力和效果'
      },
      {
        key: 'research_analysis',
        name: '科研分析',
        description: '分析科研能力和成果'
      },
      {
        key: 'evaluation_analysis',
        name: '评价分析',
        description: '分析学生和同事评价'
      },
      {
        key: 'comprehensive_analysis',
        name: '综合分析',
        description: '生成综合分析报告'
      }
    ])
    
    // 计算属性
    const filteredTeachers = computed(() => {
      if (!searchQuery.value) return teachers.value
      return teachers.value.filter(teacher => 
        teacher.name.includes(searchQuery.value) ||
        teacher.id.includes(searchQuery.value) ||
        teacher.department.includes(searchQuery.value)
      )
    })
    
    const currentStepName = computed(() => {
      return analysisSteps.value[currentStep.value]?.name || ''
    })
    
    // 方法
    const handleSearch = () => {
      // 搜索逻辑已在计算属性中处理
    }
    
    const selectTeacher = (teacher) => {
      selectedTeacher.value = teacher
    }
    
    const clearSelection = () => {
      selectedTeacher.value = null
    }
    
    const toggleDimension = (dimensionKey) => {
      const index = selectedDimensions.value.indexOf(dimensionKey)
      if (index > -1) {
        selectedDimensions.value.splice(index, 1)
      } else {
        selectedDimensions.value.push(dimensionKey)
      }
    }
    
    const startAnalysis = async () => {
      if (!selectedTeacher.value || selectedDimensions.value.length === 0) {
        ElMessage.warning('请选择教师和分析维度')
        return
      }
      
      isAnalyzing.value = true
      analysisProgress.value = 0
      currentStep.value = 0
      
      // 模拟分析过程
      for (let i = 0; i < analysisSteps.value.length; i++) {
        currentStep.value = i
        
        // 模拟每个步骤的进度
        for (let progress = 0; progress <= 100; progress += 10) {
          analysisProgress.value = Math.round((i * 100 + progress) / analysisSteps.value.length)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      // 生成分析结果
      analysisResults.value = generateAnalysisResults()
      isAnalyzing.value = false
    }
    
    const generateAnalysisResults = () => {
      return {
        overallScore: 85,
        teachingScore: 88,
        researchScore: 82,
        studentScore: 90,
        peerScore: 85,
        insights: [
          {
            id: 1,
            type: 'strength',
            icon: 'Trophy',
            title: '教学优势',
            description: '在课堂教学方面表现突出，学生满意度高'
          },
          {
            id: 2,
            type: 'improvement',
            icon: 'TrendCharts',
            title: '改进空间',
            description: '科研产出有提升空间，建议加强学术研究'
          },
          {
            id: 3,
            type: 'opportunity',
            icon: 'Star',
            title: '发展机会',
            description: '具备成为学科带头人的潜力'
          }
        ],
        dimensions: [
          {
            key: 'teaching',
            name: '教学能力',
            score: 88,
            analysis: '该教师在教学方面表现优秀，课堂组织能力强，教学方法多样，能够有效激发学生学习兴趣。',
            suggestions: [
              '继续保持现有的教学风格',
              '可以尝试更多创新教学方法',
              '加强与学生的互动交流'
            ]
          },
          {
            key: 'research',
            name: '科研能力',
            score: 82,
            analysis: '科研能力良好，有一定的学术产出，但还有提升空间。',
            suggestions: [
              '增加科研项目申请',
              '提高论文发表质量',
              '加强学术交流合作'
            ]
          }
        ]
      }
    }
    
    const exportReport = () => {
      ElMessage.success('报告导出功能开发中...')
    }
    
    return {
      searchQuery,
      selectedTeacher,
      isAnalyzing,
      analysisProgress,
      currentStep,
      analysisResults,
      teachers,
      analysisDimensions,
      selectedDimensions,
      analysisSettings,
      analysisSteps,
      filteredTeachers,
      currentStepName,
      handleSearch,
      selectTeacher,
      clearSelection,
      toggleDimension,
      startAnalysis,
      exportReport
    }
  }
}
</script>

<style scoped>
.smart-analysis-container {
  min-height: 100vh;
}

/* 页面标题 */
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

/* 卡片样式 */
.el-card {
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: none;
}

.card-header h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.card-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* 教师选择区域 */
.teacher-search-section {
  margin-top: 24px;
}

.search-bar {
  margin-bottom: 24px;
}

.teacher-list {
  display: grid;
  gap: 16px;
}

.teacher-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.teacher-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.teacher-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-info {
  flex: 1;
}

.teacher-name {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.teacher-details {
  margin: 0 0 12px 0;
  color: #6b7280;
  font-size: 14px;
}

.teacher-id {
  margin-right: 16px;
}

.teacher-tags {
  display: flex;
  gap: 8px;
}

.teacher-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

/* 分析配置区域 */
.selected-teacher-info {
  margin-bottom: 32px;
}

.teacher-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
}

.teacher-summary img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.summary-content h4 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.summary-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.analysis-dimensions {
  margin-bottom: 32px;
}

.analysis-dimensions h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dimension-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.dimension-item.active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(102, 126, 234, 0.02) 100%);
}

.dimension-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  font-size: 20px;
}

.dimension-content {
  flex: 1;
}

.dimension-content h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.dimension-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.dimension-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 16px;
}

.analysis-settings h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.settings-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* 分析进度区域 */
.progress-content {
  margin-top: 24px;
}

.progress-steps {
  margin-bottom: 32px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e5e7eb;
}

.progress-step:last-child {
  border-bottom: none;
}

.step-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.progress-step.pending .step-icon {
  background: #f3f4f6;
  color: #9ca3af;
}

.progress-step.active .step-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.progress-step.completed .step-icon {
  background: #10b981;
  color: white;
}

.step-content h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.step-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.progress-bar {
  margin-top: 24px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #6b7280;
}

/* 分析结果区域 */
.analysis-results {
  margin-top: 32px;
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-top: 24px;
}

.overall-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.score-circle {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  color: white;
}

.score-value {
  font-size: 32px;
  font-weight: 700;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.breakdown-label {
  width: 80px;
  font-size: 14px;
  color: #374151;
}

.breakdown-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.breakdown-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.breakdown-value {
  width: 40px;
  text-align: right;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.key-insights h4 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.insight-item.strength {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-left: 4px solid #10b981;
}

.insight-item.improvement {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-left: 4px solid #f59e0b;
}

.insight-item.opportunity {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-left: 4px solid #3b82f6;
}

.insight-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 16px;
}

.insight-item.strength .insight-icon {
  background: #10b981;
  color: white;
}

.insight-item.improvement .insight-icon {
  background: #f59e0b;
  color: white;
}

.insight-item.opportunity .insight-icon {
  background: #3b82f6;
  color: white;
}

.insight-content h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.insight-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* 详细结果 */
.detailed-results {
  display: grid;
  gap: 24px;
  margin-top: 24px;
}

.dimension-result-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dimension-score {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.dimension-score .score {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.dimension-score .label {
  font-size: 14px;
  color: #6b7280;
}

.dimension-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 24px;
}

.dimension-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
}

.chart-placeholder {
  text-align: center;
  color: #6b7280;
}

.chart-placeholder .el-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.dimension-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.detail-section p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;
}

.suggestions-list {
  margin: 0;
  padding-left: 20px;
}

.suggestions-list li {
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .smart-analysis-container {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .dimension-content {
    grid-template-columns: 1fr;
  }
  
  .dimensions-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-row {
    grid-template-columns: 1fr;
  }
}
</style>
