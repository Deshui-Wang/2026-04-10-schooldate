<template>
  <div class="smart-analysis-container">
    <!-- 页面标题 -->
    <div class="section-header">
      <h3>智能分析</h3>
      <p>配置分析维度，选择不同的分析方式，获取全面的分析报告</p>
    </div>

    <!-- 教师选择区域 -->
    <el-card class="teacher-selection-card" v-if="false" shadow="never">
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
            style="flex: 1;"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 筛选条件 -->
        <div class="filter-section">
          <div class="filter-header">
            <span class="filter-title">筛选条件</span>
            <el-button text type="primary" size="small" @click="clearFilters">
              清除筛选
            </el-button>
          </div>
          <div class="filter-group">
            <div class="filter-item">
              <label>教龄范围</label>
              <el-select v-model="filters.teachingYears" placeholder="请选择" clearable style="width: 100%">
                <el-option label="5年以下" value="0-5" />
                <el-option label="5-10年" value="5-10" />
                <el-option label="10-20年" value="10-20" />
                <el-option label="20年以上" value="20+" />
              </el-select>
            </div>
            <div class="filter-item">
              <label>年龄范围</label>
              <el-select v-model="filters.ageRange" placeholder="请选择" clearable style="width: 100%">
                <el-option label="30岁以下" value="0-30" />
                <el-option label="30-40岁" value="30-40" />
                <el-option label="40-50岁" value="40-50" />
                <el-option label="50岁以上" value="50+" />
              </el-select>
            </div>
            <div class="filter-item">
              <label>学历</label>
              <el-select v-model="filters.education" placeholder="请选择" clearable style="width: 100%">
                <el-option label="博士" value="博士" />
                <el-option label="硕士" value="硕士" />
                <el-option label="学士" value="学士" />
              </el-select>
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-item">
              <label>职称</label>
              <el-select v-model="filters.position" placeholder="请选择" clearable style="width: 100%">
                <el-option label="教授" value="教授" />
                <el-option label="副教授" value="副教授" />
                <el-option label="讲师" value="讲师" />
                <el-option label="助教" value="助教" />
              </el-select>
            </div>
            <div class="filter-item">
              <label>学院</label>
              <el-select v-model="filters.department" placeholder="请选择" clearable style="width: 100%">
                <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
              </el-select>
            </div>
            <div class="filter-item">
              <label>专业</label>
              <el-select v-model="filters.major" placeholder="请选择" clearable style="width: 100%">
                <el-option v-for="maj in majors" :key="maj" :label="maj" :value="maj" />
              </el-select>
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-item filter-item-full">
              <label>入职时间</label>
              <el-date-picker
                v-model="filters.joinDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
                style="width: 100%"
              />
            </div>
          </div>
        </div>
        
        <div class="empty-state">
          <el-empty description="暂时隐藏教师列表，专注于分析配置功能" />
        </div>
      </div>
    </el-card>

    <!-- 选择分析对象 -->
    <el-card class="analysis-object-card" v-if="!isAnalyzing" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>选择分析对象</h3>
          <p>请选择需要进行分析的教师</p>
        </div>
      </template>
      
      <div class="selected-teacher-info" v-if="selectedTeacher">
        <div class="teacher-summary">
          <img :src="selectedTeacher.avatar || '/images/default-avatar.png'" :alt="selectedTeacher.name" />
          <div class="summary-content">
            <h4>{{ selectedTeacher.name }}</h4>
            <p>{{ selectedTeacher.department }} · {{ selectedTeacher.position }}</p>
          </div>
          <el-button text @click="clearSelection">重新选择</el-button>
        </div>
      </div>
      
      <div class="analysis-object">
        <!-- 搜索框、筛选条件和筛选按钮统一在一行 -->
        <div class="object-filters-row">
          <!-- 搜索框 -->
          <div class="filter-search-item">
            <label>教师姓名</label>
            <el-input
              v-model="objectSearchQuery"
              placeholder="输入教师姓名"
              clearable
              @input="handleObjectSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <!-- 学院筛选 -->
          <div class="filter-item">
            <label>学院</label>
            <el-select v-model="objectFilters.department" placeholder="请选择学院" clearable style="width: 100%">
              <el-option v-for="dept in departments" :key="dept" :label="dept" :value="dept" />
            </el-select>
          </div>
          
          <!-- 专业筛选 -->
          <div class="filter-item">
            <label>专业</label>
            <el-select v-model="objectFilters.major" placeholder="请选择专业" clearable style="width: 100%">
              <el-option v-for="maj in majors" :key="maj" :label="maj" :value="maj" />
            </el-select>
          </div>
          
          <!-- 职称筛选 -->
          <div class="filter-item">
            <label>职称</label>
            <el-select v-model="objectFilters.position" placeholder="请选择职称" clearable style="width: 100%">
              <el-option label="教授" value="教授" />
              <el-option label="副教授" value="副教授" />
              <el-option label="讲师" value="讲师" />
              <el-option label="助教" value="助教" />
            </el-select>
          </div>
          
          <!-- 入职时间 -->
          <div class="filter-item">
            <label>入职时间</label>
            <el-date-picker
              v-model="objectFilters.joinDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              clearable
              style="width: 100%"
            />
          </div>
          
          <!-- 教龄范围 -->
          <div class="filter-item">
            <label>教龄范围</label>
            <el-select v-model="objectFilters.teachingYears" placeholder="请选择教龄" clearable style="width: 100%">
              <el-option label="5年以下" value="0-5" />
              <el-option label="5-10年" value="5-10" />
              <el-option label="10-20年" value="10-20" />
              <el-option label="20年以上" value="20+" />
            </el-select>
          </div>
          
          <!-- 筛选按钮 -->
          <div class="filter-action-item">
            <el-button type="primary" @click="applyFilters" :loading="isFiltering">
              <el-icon><Search /></el-icon>
              筛选
            </el-button>
          </div>
        </div>
        
        <!-- 筛选结果 - 教师列表 -->
        <div class="filtered-teachers" v-if="filteredTeacherList.length > 0">
          <div class="teachers-count">
            找到 {{ filteredTeacherList.length }} 位符合条件的教师
          </div>
          <div class="teacher-cards">
            <div 
              v-for="teacher in filteredTeacherList" 
              :key="teacher.id"
              class="teacher-card"
              :class="{ selected: selectedTeachers.includes(teacher.id) }"
              @click="toggleTeacherSelection(teacher.id)"
            >
              <div class="teacher-avatar">
                <img :src="teacher.avatar || '/images/default-avatar.png'" :alt="teacher.name" />
              </div>
              <div class="teacher-info">
                <h5>{{ teacher.name }}</h5>
                <p class="teacher-dept">{{ teacher.department }}</p>
                <p class="teacher-pos">{{ teacher.position }}</p>
                <div class="teacher-meta">
                  <span class="teacher-id">工号: {{ teacher.id }}</span>
                </div>
              </div>
              <div class="teacher-select">
                <el-icon v-if="selectedTeachers.includes(teacher.id)"><Check /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="hasFiltered" class="no-results">
          <el-empty description="暂无符合条件的教师" />
        </div>
      </div>
    </el-card>
    
    <!-- 选择分析维度 -->
    <el-card class="analysis-dimensions-card" v-if="!isAnalyzing" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>选择分析维度</h3>
          <p>选择要分析的数据维度</p>
        </div>
      </template>
      
      <div class="analysis-dimensions">
        <div class="dimensions-grid">
          <div 
            v-for="dimension in analysisDimensions" 
            :key="dimension.key"
            class="dimension-item"
            :class="{ active: selectedDimensions.includes(dimension.key) }"
            @click="toggleDimension(dimension.key)"
          >
            <div class="dimension-header">
              <div class="dimension-icon">
                <el-icon><component :is="dimension.icon" /></el-icon>
              </div>
              <div class="dimension-check">
                <el-icon v-if="selectedDimensions.includes(dimension.key)"><Check /></el-icon>
              </div>
            </div>
            <div class="dimension-content">
              <h5>{{ dimension.name }}</h5>
              <p>{{ dimension.description }}</p>
            </div>
          </div>
        </div>
        
        <!-- 智能分析按钮 -->
        <div class="analysis-action">
          <el-button 
            type="primary" 
            size="large" 
            @click="startAnalysis"
            :disabled="selectedDimensions.length === 0 || selectedTeachers.length === 0"
            :loading="isAnalyzing"
          >
            <el-icon><DataAnalysis /></el-icon>
            开始智能分析
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 分析进度区域 -->
    <el-card class="analysis-progress-card" v-if="isAnalyzing" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>分析进行中</h3>
          <p v-if="selectedTeacher">正在对 {{ selectedTeacher.name }} 进行综合分析</p>
          <p v-else>正在进行综合分析</p>
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

    <!-- 分析结果区域 - 泳道对比展示 -->
    <AnalysisResults 
      v-if="analysisResults && analysisResults.teacherResults"
      :results="analysisResults"
      :selectedDimensions="selectedDimensions"
      :dimensionMap="dimensionMap"
    />
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
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
import AnalysisResults from './AnalysisResults.vue'

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
    Setting,
    AnalysisResults
  },
  setup() {
    // 响应式数据
    const searchQuery = ref('')
    const selectedTeacher = ref(null)
    const isAnalyzing = ref(false)
    const analysisProgress = ref(0)
    const currentStep = ref(0)
    const analysisResults = ref(null)
    
    // 新增：对象搜索和筛选相关
    const objectSearchQuery = ref('')
    const selectedTeachers = ref([])
    const filteredTeacherList = ref([])
    const hasFiltered = ref(false)
    const isFiltering = ref(false)
    
    // 筛选条件
    const filters = reactive({
      teachingYears: '',
      ageRange: '',
      education: '',
      position: '',
      department: '',
      major: '',
      joinDate: null
    })
    
    // 分析对象筛选条件
    const objectFilters = reactive({
      department: '',
      major: '',
      position: '',
      joinDate: null,
      teachingYears: ''
    })
    
    // 学院和专业选项
    const departments = ref(['计算机学院', '数学学院', '物理学院', '化学学院', '生物学院', '经济学院', '文学院', '外国语学院'])
    const majors = ref(['计算机科学', '软件工程', '数据科学', '应用数学', '纯数学', '统计学', '基础物理', '应用物理', '理论物理'])
    
    // 教师头像列表
    const teacherAvatars = [
      '/images/teacher/cc.png',
      '/images/teacher/85.jpeg',
      '/images/teacher/c5.png',
      '/images/teacher/66.jpg',
      '/images/teacher/7b.jpeg',
      '/images/teacher/28.png',
      '/images/teacher/083.png'
    ]

    // 教师数据
    const teachers = ref([
      {
        id: 'T001',
        name: '张教授',
        department: '计算机学院',
        position: '教授',
        avatar: '/images/teacher/cc.png',
        teachingYears: 15,
        age: 45,
        education: '博士',
        major: '计算机科学',
        joinDate: '2009-01-15',
        studentCount: 120,
        tags: ['优秀教师', '科研骨干']
      },
      {
        id: 'T002',
        name: '李老师',
        department: '数学学院',
        position: '副教授',
        avatar: '/images/teacher/85.jpeg',
        teachingYears: 8,
        age: 35,
        education: '博士',
        major: '应用数学',
        joinDate: '2015-03-20',
        studentCount: 80,
        tags: ['教学能手', '青年才俊']
      },
      {
        id: 'T003',
        name: '王博士',
        department: '物理学院',
        position: '讲师',
        avatar: '/images/teacher/c5.png',
        teachingYears: 3,
        age: 30,
        education: '博士',
        major: '理论物理',
        joinDate: '2020-09-01',
        studentCount: 60,
        tags: ['新锐教师', '创新教学']
      },
      {
        id: 'T004',
        name: '刘教授',
        department: '计算机学院',
        position: '教授',
        avatar: '/images/teacher/66.jpg',
        teachingYears: 22,
        age: 52,
        education: '博士',
        major: '软件工程',
        joinDate: '2002-06-10',
        studentCount: 150,
        tags: ['学科带头人', '资深教授']
      },
      {
        id: 'T005',
        name: '陈老师',
        department: '经济学院',
        position: '副教授',
        avatar: '/images/teacher/7b.jpeg',
        teachingYears: 6,
        age: 32,
        education: '硕士',
        major: '经济学',
        joinDate: '2017-02-14',
        studentCount: 90,
        tags: ['教学骨干', '业务精湛']
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
      return teachers.value.filter(teacher => {
        // 搜索过滤
        const matchesSearch = !searchQuery.value || 
          teacher.name.includes(searchQuery.value) ||
          teacher.id.includes(searchQuery.value) ||
          teacher.department.includes(searchQuery.value)
        
        if (!matchesSearch) return false
        
        // 教龄过滤
        if (filters.teachingYears) {
          const range = filters.teachingYears.split('-')
          const min = parseInt(range[0])
          const max = range[1] === '+' ? Infinity : parseInt(range[1])
          if (teacher.teachingYears < min || teacher.teachingYears > max) {
            return false
          }
        }
        
        // 年龄过滤
        if (filters.ageRange) {
          const range = filters.ageRange.split('-')
          const min = parseInt(range[0])
          const max = range[1] === '+' ? Infinity : parseInt(range[1])
          if (teacher.age < min || teacher.age > max) {
            return false
          }
        }
        
        // 学历过滤
        if (filters.education && teacher.education !== filters.education) {
          return false
        }
        
        // 职称过滤
        if (filters.position && teacher.position !== filters.position) {
          return false
        }
        
        // 学院过滤
        if (filters.department && teacher.department !== filters.department) {
          return false
        }
        
        // 专业过滤
        if (filters.major && teacher.major !== filters.major) {
          return false
        }
        
        // 入职时间过滤
        if (filters.joinDate && filters.joinDate.length === 2) {
          const joinDate = new Date(teacher.joinDate)
          const startDate = new Date(filters.joinDate[0])
          const endDate = new Date(filters.joinDate[1])
          if (joinDate < startDate || joinDate > endDate) {
            return false
          }
        }
        
        return true
      })
    })
    
    const currentStepName = computed(() => {
      return analysisSteps.value[currentStep.value]?.name || ''
    })
    
    // 方法
    const handleSearch = () => {
      // 搜索逻辑已在计算属性中处理
    }
    
    // 新增：处理对象搜索
    const handleObjectSearch = () => {
      if (hasFiltered.value) {
        applyFilters()
      }
    }
    
    // 新增：应用筛选条件
    const applyFilters = () => {
      isFiltering.value = true
      
      // 模拟筛选过程
      setTimeout(() => {
        // 根据搜索词和筛选条件过滤教师
        let filtered = teachers.value.filter(teacher => {
          // 搜索词过滤
          if (objectSearchQuery.value) {
            const searchLower = objectSearchQuery.value.toLowerCase()
            if (!teacher.name.toLowerCase().includes(searchLower)) {
              return false
            }
          }
          
          // 学院过滤
          if (objectFilters.department && teacher.department !== objectFilters.department) {
            return false
          }
          
          // 专业过滤
          if (objectFilters.major && teacher.major !== objectFilters.major) {
            return false
          }
          
          // 职称过滤
          if (objectFilters.position && teacher.position !== objectFilters.position) {
            return false
          }
          
          // 教龄过滤
          if (objectFilters.teachingYears) {
            const range = objectFilters.teachingYears.split('-')
            const min = parseInt(range[0])
            const max = range[1] === '+' ? Infinity : parseInt(range[1])
            if (teacher.teachingYears < min || teacher.teachingYears > max) {
              return false
            }
          }
          
          // 入职时间过滤
          if (objectFilters.joinDate && objectFilters.joinDate.length === 2) {
            const joinDate = new Date(teacher.joinDate)
            const startDate = new Date(objectFilters.joinDate[0])
            const endDate = new Date(objectFilters.joinDate[1])
            if (joinDate < startDate || joinDate > endDate) {
              return false
            }
          }
          
          return true
        })
        
        filteredTeacherList.value = filtered
        hasFiltered.value = true
        isFiltering.value = false
        
        if (filtered.length > 0) {
          ElMessage.success(`找到 ${filtered.length} 位符合条件的教师`)
        } else {
          ElMessage.warning('暂无符合条件的教师')
        }
      }, 500)
    }
    
    // 新增：切换教师选中状态（限制最多3人）
    const toggleTeacherSelection = (teacherId) => {
      const index = selectedTeachers.value.indexOf(teacherId)
      if (index > -1) {
        selectedTeachers.value.splice(index, 1)
      } else {
        if (selectedTeachers.value.length >= 3) {
          ElMessage.warning('最多只能选择3位教师进行对比分析')
          return
        }
        selectedTeachers.value.push(teacherId)
      }
    }
    
    const clearFilters = () => {
      filters.value = {
        teachingYears: '',
        ageRange: '',
        education: '',
        position: '',
        department: '',
        major: '',
        joinDate: null
      }
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
    
    const generateInsights = (teacher, index, random) => {
      // 为每位教师生成 [2, 7] 条不定量洞察（去重，顺序稳定）
      const targetCount = random(2, 7)
      
      // 洞察内容池
      const strengthInsights = [
        {
          type: 'strength',
          icon: 'Trophy',
          title: '教学优势',
          description: `${teacher.name}在课堂教学方面表现突出，学生满意度高达92%以上，课堂互动活跃`
        },
        {
          type: 'strength',
          icon: 'Document',
          title: '科研产出优异',
          description: '近期发表多篇高质量论文，在${teacher.department}领域有重要学术贡献'
        },
        {
          type: 'strength',
          icon: 'User',
          title: '学生认可度高',
          description: '学生评价优秀，师生关系和谐，深受学生喜爱'
        },
        {
          type: 'strength',
          icon: 'Connection',
          title: '团队协作能力强',
          description: '在跨学科合作项目中表现突出，能够有效协调团队成员'
        },
        {
          type: 'strength',
          icon: 'School',
          title: '课程建设领军',
          description: '主导多门核心课程建设，课程体系完善，教学资源丰富且持续更新'
        },
        {
          type: 'strength',
          icon: 'Promotion',
          title: '教改成果显著',
          description: '在教学改革与教学成果转化方面表现突出，多次获得校院级表彰'
        },
        {
          type: 'strength',
          icon: 'Share',
          title: '同行影响力广',
          description: '在本学科内具有较高影响力，积极分享经验，带动团队整体提升'
        }
      ]
      
      const improvementInsights = [
        {
          type: 'improvement',
          icon: 'TrendCharts',
          title: '科研成果提升空间',
          description: '科研产出有提升空间，建议加大项目申请力度，提高论文质量'
        },
        {
          type: 'improvement',
          icon: 'Monitor',
          title: '教学方法创新',
          description: '建议尝试更多现代化教学方法，提升课堂效果和学生参与度'
        },
        {
          type: 'improvement',
          icon: 'Share',
          title: '学术交流待加强',
          description: '参与学术会议的频率较低，建议增加学术交流与合作机会'
        },
        {
          type: 'improvement',
          icon: 'Clock',
          title: '时间管理优化',
          description: '在教学与科研之间的时间分配需要更加合理，建议制定更科学的计划'
        },
        {
          type: 'improvement',
          icon: 'Connection',
          title: '产学研合作拓展',
          description: '建议主动对接企业与研究机构，拓展横向课题与实践基地'
        },
        {
          type: 'improvement',
          icon: 'Document',
          title: '论文发表质量优化',
          description: '聚焦高影响力刊物，完善研究设计与数据质量，缩短审稿周期'
        },
        {
          type: 'improvement',
          icon: 'School',
          title: '课程评价稳定性',
          description: '进一步打磨课程难度梯度与作业反馈机制，提升不同班级间一致性'
        },
        {
          type: 'improvement',
          icon: 'Trophy',
          title: '指导学生竞赛',
          description: '建议制定学生竞赛培养计划，提升竞赛参与度与获奖率'
        }
      ]
      
      const opportunityInsights = [
        {
          type: 'opportunity',
          icon: 'Star',
          title: '学科带头人潜力',
          description: '具备成为学科带头人的潜力，建议在重大项目申请中发挥领导作用'
        },
        {
          type: 'opportunity',
          icon: 'School',
          title: '课程建设机会',
          description: '可申请校级精品课程建设项目，提升课程质量和影响力'
        },
        {
          type: 'opportunity',
          icon: 'Promotion',
          title: '职称晋升机会',
          description: '各项指标符合职称晋升条件，建议积极准备相关材料'
        },
        {
          type: 'opportunity',
          icon: 'Trophy',
          title: '教学成果奖潜力',
          description: '长期教学效果显著，具备申报教学成果奖的基础条件'
        },
        {
          type: 'opportunity',
          icon: 'Connection',
          title: '跨学院联合课题',
          description: '具备跨学科研究基础，可牵头联合申请省部级或校级重点项目'
        },
        {
          type: 'opportunity',
          icon: 'Share',
          title: '国际合作与交流',
          description: '对接海外高校/实验室，开展联合研究与师生互访，提升国际影响力'
        },
        {
          type: 'opportunity',
          icon: 'Document',
          title: '教材与专著编写',
          description: '拥有成熟课程体系与资料沉淀，可组织编写高质量教材或专著'
        },
        {
          type: 'opportunity',
          icon: 'Monitor',
          title: '线上课程与慕课',
          description: '可建设精品在线课程/慕课，扩大课程影响力并促进教学资源共享'
        }
      ]
      
      const warningInsights = [
        {
          type: 'warning',
          icon: 'Warning',
          title: '关注教学与科研平衡',
          description: '需要更好地平衡教学工作和科研投入，避免偏重某一方'
        },
        {
          type: 'warning',
          icon: 'InfoFilled',
          title: '提升国际化水平',
          description: '国际化程度有待提高，建议加强国际交流与合作'
        },
        {
          type: 'warning',
          icon: 'Bell',
          title: '及时更新教学内容',
          description: '建议定期更新课程内容，跟上行业最新发展和趋势'
        },
        {
          type: 'warning',
          icon: 'Clock',
          title: '项目进度与节点风险',
          description: '部分科研/教改项目节点滞后，需优化进度管理与资源配置'
        },
        {
          type: 'warning',
          icon: 'Document',
          title: '论文周期与返修次数',
          description: '论文返修次数偏多，建议提升初稿质量与同行预评审环节'
        },
        {
          type: 'warning',
          icon: 'Share',
          title: '数据合规与伦理',
          description: '需关注数据采集合规、隐私保护与学术伦理，完善流程与记录'
        }
      ]
      
      // 根据教师相对表现设定类型优先级（决定填充顺序）
      const typePriorityOrders = {
        0: ['strength', 'opportunity', 'improvement', 'warning'],
        1: ['strength', 'improvement', 'opportunity', 'warning'],
        2: ['improvement', 'strength', 'warning', 'opportunity'],
        3: ['improvement', 'warning', 'opportunity', 'strength']
      }
      const priority = typePriorityOrders[index] || typePriorityOrders[1]
      
      // 构建类型到池的映射
      const poolByType = {
        strength: strengthInsights,
        improvement: improvementInsights,
        opportunity: opportunityInsights,
        warning: warningInsights
      }
      
      // 先根据优先级按顺序各取1条作为骨架，之后再按优先级补齐到 targetCount
      const usedTitles = new Set()
      const selected = []
      
      const pickFromPool = (type) => {
        const pool = poolByType[type]
        if (!pool || pool.length === 0) return false
        // 用 deterministic random 选择某一条
        const idx = random(0, pool.length - 1)
        const candidate = pool[idx]
        if (candidate && !usedTitles.has(candidate.title)) {
          usedTitles.add(candidate.title)
          selected.push(candidate)
          return true
        }
        // fallback: 顺序探测第一个未使用的
        for (let i = 0; i < pool.length; i++) {
          const item = pool[i]
          if (!usedTitles.has(item.title)) {
            usedTitles.add(item.title)
            selected.push(item)
            return true
          }
        }
        return false
      }
      
      // 骨架：按优先级各尝试取1条
      priority.forEach(t => pickFromPool(t))
      
      // 若不足，继续按优先级轮询补齐到 targetCount
      let guard = 0
      while (selected.length < targetCount && guard < 100) {
        for (let i = 0; i < priority.length && selected.length < targetCount; i++) {
          pickFromPool(priority[i])
        }
        guard++
      }
      
      // 如果超出（极少见），裁切
      const finalList = selected.slice(0, targetCount)
      
      // 添加稳定 ID
      return finalList.map((insight, idx) => ({
        ...insight,
        id: idx + 1
      }))
    }
    
    const startAnalysis = async () => {
      if (selectedDimensions.value.length === 0) {
        ElMessage.warning('请至少选择一个分析维度')
        return
      }
      
      if (selectedTeachers.value.length === 0) {
        ElMessage.warning('请至少选择一位教师进行分析')
        return
      }
      
      if (selectedTeachers.value.length > 3) {
        ElMessage.warning('最多只能选择3位教师进行对比分析')
        return
      }
      
      ElMessage.success(`开始分析 ${selectedTeachers.value.length} 位教师`)
      
      isAnalyzing.value = true
      analysisProgress.value = 0
      currentStep.value = 0
      
      // 模拟分析过程
      for (let i = 0; i < analysisSteps.value.length; i++) {
        currentStep.value = i
        
        // 模拟每个步骤的进度
        for (let progress = 0; progress <= 100; progress += 10) {
          analysisProgress.value = Math.round((i * 100 + progress) / analysisSteps.value.length)
          await new Promise(resolve => setTimeout(resolve, 150))
        }
      }
      
      // 生成分析结果
      analysisResults.value = generateAnalysisResults()
      isAnalyzing.value = false
      ElMessage.success('分析完成！')
    }
    
    const generateAnalysisResults = () => {
      // 为每个选中的教师生成独立的分析结果
      const teacherResults = selectedTeachers.value.map((teacherId, index) => {
        const teacher = teachers.value.find(t => t.id === teacherId)
        // 生成随机但稳定的分数（基于教师ID和索引）
        const seed = teacherId.charCodeAt(1) + teacherId.charCodeAt(2) + index * 13
        const random = (min, max) => {
          const range = max - min + 1
          const value = min + (seed * (index + 1)) % range
          return value
        }
        
        // 根据索引调整分数范围，让不同教师有更明显的差距
        const scoreRanges = {
          0: { overall: [85, 95], teaching: [85, 95], research: [82, 92], student: [88, 95], peer: [85, 93], achievement: [87, 95], development: [84, 92] },
          1: { overall: [75, 85], teaching: [78, 88], research: [75, 85], student: [80, 90], peer: [78, 88], achievement: [76, 86], development: [74, 84] },
          2: { overall: [70, 80], teaching: [72, 82], research: [70, 80], student: [75, 85], peer: [72, 82], achievement: [71, 81], development: [69, 79] },
          3: { overall: [65, 75], teaching: [68, 78], research: [65, 75], student: [70, 80], peer: [68, 78], achievement: [66, 76], development: [64, 74] }
        }
        
        const range = scoreRanges[index] || scoreRanges[0]
        
        return {
          teacherId: teacher.id,
          teacherName: teacher.name,
          teacherAvatar: teacher.avatar || '/images/default-avatar.png',
          department: teacher.department,
          position: teacher.position,
          overallScore: random(range.overall[0], range.overall[1]),
          teachingScore: random(range.teaching[0], range.teaching[1]),
          researchScore: random(range.research[0], range.research[1]),
          studentScore: random(range.student[0], range.student[1]),
          peerScore: random(range.peer[0], range.peer[1]),
          insights: generateInsights(teacher, index, random),
          dimensions: [
            {
              key: 'teaching',
              name: '教学能力',
              score: random(range.teaching[0], range.teaching[1]),
              analysis: `${teacher.name}在教学方面表现优秀，课堂组织能力强，教学方法多样，能够有效激发学生学习兴趣。`,
              suggestions: [
                '继续保持现有的教学风格',
                '可以尝试更多创新教学方法',
                '加强与学生的互动交流'
              ]
            },
            {
              key: 'research',
              name: '科研能力',
              score: random(range.research[0], range.research[1]),
              analysis: '科研能力良好，有一定的学术产出，但还有提升空间。',
              suggestions: [
                '增加科研项目申请',
                '提高论文发表质量',
                '加强学术交流合作'
              ]
            },
            {
              key: 'student',
              name: '学生评价',
              score: random(range.student[0], range.student[1]),
              analysis: '学生评价优秀，师生关系和谐，深受学生喜爱。',
              suggestions: [
                '继续保持良好的师生关系',
                '关注学生个体差异',
                '及时回应学生反馈'
              ]
            },
            {
              key: 'peer',
              name: '同事评价',
              score: random(range.peer[0], range.peer[1]),
              analysis: '同事评价良好，团队协作能力强，专业素养高。',
              suggestions: [
                '继续加强团队协作',
                '分享教学经验',
                '参与集体备课活动'
              ]
            },
            {
              key: 'achievement',
              name: '成果产出',
              score: random(range.achievement[0], range.achievement[1]),
              analysis: '在成果产出方面表现良好，教学和科研成果丰富。',
              suggestions: [
                '继续保持学术研究活跃度',
                '积极参与各类教学比赛和科研项目',
                '注重成果的积累和转化'
              ]
            },
            {
              key: 'development',
              name: '职业发展',
              score: random(range.development[0], range.development[1]),
              analysis: '职业发展路径清晰，具备良好的成长潜力。',
              suggestions: [
                '制定明确的职业发展规划',
                '持续学习和自我提升',
                '积极参与行业交流和学习'
              ]
            }
          ],
          // 为报告组件添加详细的教学维度数据
          teachingDimensions: [
            {
              key: 'content',
              name: '教学内容',
              score: random(range.teaching[0], range.teaching[1])
            },
            {
              key: 'method',
              name: '教学方法',
              score: random(range.teaching[0] - 3, range.teaching[1] - 3)
            },
            {
              key: 'management',
              name: '课堂管理',
              score: random(range.teaching[0] - 5, range.teaching[1] - 5)
            },
            {
              key: 'participation',
              name: '学生参与度',
              score: random(range.student[0], range.student[1])
            },
            {
              key: 'expression',
              name: '语言表达',
              score: random(range.teaching[0] - 2, range.teaching[1] - 2)
            },
            {
              key: 'board',
              name: '板书设计',
              score: random(range.teaching[0] - 6, range.teaching[1] - 6)
            },
            {
              key: 'time',
              name: '时间管理',
              score: random(range.teaching[0] - 4, range.teaching[1] - 4)
            },
            {
              key: 'interaction',
              name: '互动质量',
              score: random(range.student[0] + 2, range.student[1] + 2)
            }
          ]
        }
      })
      
      return {
        teacherResults: teacherResults,
        comparisonMode: teacherResults.length > 1
      }
    }
    
    const exportReport = () => {
      ElMessage.success('报告导出功能开发中...')
    }
    
    // 维度映射表，用于将维度key转换为名称
    const dimensionMap = computed(() => {
      const map = {}
      analysisDimensions.value.forEach(dim => {
        map[dim.key] = dim.name
      })
      return map
    })
    
    return {
      searchQuery,
      selectedTeacher,
      isAnalyzing,
      filters,
      objectFilters,
      analysisProgress,
      currentStep,
      analysisResults,
      teachers,
      departments,
      majors,
      analysisDimensions,
      selectedDimensions,
      analysisSettings,
      analysisSteps,
      filteredTeachers,
      currentStepName,
      dimensionMap,
      // 新增
      objectSearchQuery,
      selectedTeachers,
      filteredTeacherList,
      hasFiltered,
      isFiltering,
      handleSearch,
      clearFilters,
      selectTeacher,
      clearSelection,
      toggleDimension,
      startAnalysis,
      exportReport,
      // 新增方法
      handleObjectSearch,
      applyFilters,
      toggleTeacherSelection
    }
  }
}
</script>

<style scoped>
.smart-analysis-container {
  min-height: 100vh;
}

/* 页面标题 */
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

/* 分析对象卡片 */
.analysis-object-card {
  margin-bottom: 24px;
}

/* 分析维度卡片 */
.analysis-dimensions-card {
  margin-bottom: 24px;
}

/* 教师选择区域 */
.teacher-search-section {
  margin-top: 24px;
}

.search-bar {
  margin-bottom: 24px;
}

/* 筛选条件 */
.filter-section {
  margin: 16px 0 24px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item-full {
  grid-column: 1 / -1;
}

.filter-item label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
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
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.teacher-id, .teacher-department, .teacher-position {
  margin-right: 16px;
}

.teacher-details-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #9ca3af;
}

.detail-item {
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 4px;
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

.analysis-object {
  margin-bottom: 32px;
}

.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.analysis-object h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

/* 对象筛选行 - 所有筛选项在一行 */
.object-filters-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr 2fr 1fr auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 16px;
}

.filter-search-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-search-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-action-item {
  display: flex;
  align-items: flex-end;
  padding-bottom: 2px;
}

.filter-action-item .el-button {
  width: 100%;
}

/* 筛选结果 - 教师列表 */
.filtered-teachers {
  margin-top: 20px;
}

.teachers-count {
  margin-bottom: 16px;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
}

.teacher-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.teacher-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
}

.teacher-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.teacher-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(102, 126, 234, 0.02) 100%);
}

.teacher-card .teacher-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-card .teacher-info {
  flex: 1;
}

.teacher-card .teacher-info h5 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.teacher-card .teacher-dept {
  margin: 0 0 2px 0;
  color: #6b7280;
  font-size: 13px;
}

.teacher-card .teacher-pos {
  margin: 0;
  color: #9ca3af;
  font-size: 12px;
}

.teacher-card .teacher-meta {
  margin-top: 8px;
}

.teacher-card .teacher-id {
  font-size: 11px;
  color: #9ca3af;
}

.teacher-card .teacher-select {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 18px;
}

.no-results {
  margin-top: 20px;
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

/* 智能分析按钮 */
.analysis-action {
  margin-top: 24px;
  text-align: center;
}

.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.dimension-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: #fff;
}

.dimension-item:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.dimension-item.active {
  border-color: #667eea;
  background: #fff;
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 90%;
  margin-bottom: 16px;
}

.dimension-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 32px;
}

.dimension-check {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 20px;
  width: 24px;
  height: 24px;
}

.dimension-content {
  width: 100%;
  text-align: center;
  flex: 1;
}

.dimension-content h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.dimension-content p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
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
@media (max-width: 1400px) {
  .dimensions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .object-filters-row {
    grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 1.8fr 0.9fr auto;
  }
  
  .filter-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1200px) {
  .object-filters-row {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
  }
  
  .filter-search-item {
    grid-column: 1 / 3;
  }
  
  .filter-action-item {
    grid-column: 3;
    grid-row: 2;
  }
  
  .filter-group {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dimensions-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

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
  
  .section-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .object-filters-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-action-item {
    grid-column: 1 / -1;
  }
  
  .teacher-cards {
    grid-template-columns: 1fr;
  }
  
  .summary-content {
    grid-template-columns: 1fr;
  }
  
  .dimension-content {
    grid-template-columns: 1fr;
  }
  
  .dimensions-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .filter-row {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .filter-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .filter-group {
    grid-template-columns: 1fr;
  }
  
  .dimensions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
