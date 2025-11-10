    <!-- 分析结果对比-教师分析报告 -->
<template>
  <div class="teacher-report-container">
    <!-- AI智能分析对话框 -->
    <el-dialog
      v-model="aiAnalysisDialogVisible"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="ai-analysis-dialog"
      :modal="true"
      :modal-class="'analysis-modal'"
    >
      <template #header>
        <div class="analysis-header">
          <div class="header-icon">
            <el-icon class="rotating"><Loading /></el-icon>
          </div>
          <div class="header-content">
            <h3>AI智能分析中</h3>
            <p>正在深度分析教师数据，请稍候...</p>
          </div>
        </div>
      </template>
      
      <div class="analysis-content">
        <!-- 教师信息 -->
        <div class="candidate-info">
          <div class="info-item">
            <span class="label">姓名：</span>
            <span class="value">{{ teacherData.teacherName }}</span>
          </div>
          <div class="info-item">
            <span class="label">部门：</span>
            <span class="value">{{ teacherData.department || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="label">职称：</span>
            <span class="value">{{ teacherData.title || '未知' }}</span>
          </div>
        </div>
        
        <!-- 进度条 -->
        <div class="progress-section">
          <div class="progress-header">
            <span>分析进度</span>
            <span class="progress-percent">{{ Math.round(aiAnalysisProgress) }}%</span>
          </div>
          <el-progress 
            :percentage="aiAnalysisProgress" 
            :stroke-width="8"
            :show-text="false"
            color="#667eea"
          />
        </div>
        
        <!-- 分析步骤列表 -->
        <div class="analysis-steps">
          <div 
            v-for="(step, index) in analysisSteps" 
            :key="index"
            class="step-item"
            :class="{
              'step-active': index === currentAnalysisStep,
              'step-completed': index < currentAnalysisStep,
              'step-pending': index > currentAnalysisStep
            }"
          >
            <div class="step-icon">
              <el-icon v-if="index < currentAnalysisStep" class="step-check">
                <CircleCheck />
              </el-icon>
              <el-icon v-else-if="index === currentAnalysisStep" class="step-loading rotating">
                <Loading />
              </el-icon>
              <el-icon v-else class="step-pending-icon">
                <component :is="getIconComponent(step.icon)" />
              </el-icon>
            </div>
            <div class="step-content">
              <div class="step-title">{{ step.title }}</div>
              <div class="step-description">{{ step.description }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 报告头部 -->
    <div class="report-header">
      <div class="header-content">
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{ teacherData.overallScore }}</span>
            <span class="stat-label">综合评分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ maxScore }}</span>
            <span class="stat-label">最高分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ minScore }}</span>
            <span class="stat-label">最低分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ dimensionCount }}</span>
            <span class="stat-label">评估维度</span>
          </div>
        </div>
        <div class="header-actions">
          <el-button @click="handleDownload">
            <el-icon><Download /></el-icon>
            下载
          </el-button>
          <el-button @click="handleShare">
            <el-icon><Share /></el-icon>
            分享
          </el-button>
          <el-button @click="handlePrint">
            <el-icon><Printer /></el-icon>
            打印
          </el-button>
        </div>
      </div>
    </div>

    <!-- 性能概览 -->
    <div class="performance-overview">
      <div class="overview-left">
        <div class="radar-chart-container">
          <div ref="radarChartRef" class="radar-chart"></div>
        </div>
      </div>
      <div class="overview-right">
        <div class="score-cards-grid">
          <div 
            v-for="(card, index) in scoreCards" 
            :key="index"
            class="score-card"
          >
            <div class="card-icon">
              <el-icon><component :is="card.icon" /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-header">
                <h5>{{ card.title }}</h5>
                <div class="card-score">
                  <span class="score-value">{{ card.score }}</span>
                  <span class="score-rating">{{ card.rating }}</span>
                </div>
              </div>
              <p class="card-desc">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 智能分析 -->
    <div class="ai-analysis-section">
      <h3>教学行为智能分析</h3>
      <div class="analysis-grid">
        <div class="analysis-category voice-analysis">
          <div class="category-header">
            <el-icon class="category-icon"><Microphone /></el-icon>
            <h4>语音分析</h4>
          </div>
          <div class="analysis-metrics">
            <div 
              v-for="metric in aiAnalysis.voice" 
              :key="metric.name"
              class="metric-chip"
            >
              <span class="metric-value">{{ metric.value }}%</span>
              <span class="metric-name">{{ metric.name }}</span>
            </div>
          </div>
        </div>
        <div class="analysis-category behavior-analysis">
          <div class="category-header">
            <el-icon class="category-icon"><User /></el-icon>
            <h4>行为分析</h4>
          </div>
          <div class="analysis-metrics">
            <div 
              v-for="metric in aiAnalysis.behavior" 
              :key="metric.name"
              class="metric-chip"
            >
              <span class="metric-value">{{ metric.value }}%</span>
              <span class="metric-name">{{ metric.name }}</span>
            </div>
          </div>
        </div>
        <div class="analysis-category interaction-analysis">
          <div class="category-header">
            <el-icon class="category-icon"><ChatDotRound /></el-icon>
            <h4>互动分析</h4>
          </div>
          <div class="analysis-metrics">
            <div 
              v-for="metric in aiAnalysis.interaction" 
              :key="metric.name"
              class="metric-chip"
            >
              <span class="metric-value">{{ metric.value }}%</span>
              <span class="metric-name">{{ metric.name }}</span>
            </div>
          </div>
        </div>
        <div class="analysis-category content-analysis">
          <div class="category-header">
            <el-icon class="category-icon"><Document /></el-icon>
            <h4>内容分析</h4>
          </div>
          <div class="analysis-metrics">
            <div 
              v-for="metric in aiAnalysis.content" 
              :key="metric.name"
              class="metric-chip"
            >
              <span class="metric-value">{{ metric.value }}%</span>
              <span class="metric-name">{{ metric.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 总结和建议 -->
    <div class="summary-section">
      <div class="summary-grid">
        <div class="summary-card advantages">
          <h4>优势亮点</h4>
          <p class="card-subtitle">教学表现突出的方面</p>
          <ul>
            <li v-for="(item, index) in summary.advantages" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="summary-card improvements">
          <h4>改进建议</h4>
          <p class="card-subtitle">智能推荐的优化方向</p>
          <ul>
            <li v-for="(item, index) in summary.improvements" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="summary-card forecast">
          <h4>发展预测</h4>
          <p class="card-subtitle">基于数据的成长轨迹</p>
          <ul>
            <li v-for="(item, index) in summary.forecast" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="summary-card keypoints">
          <h4>关注要点</h4>
          <p class="card-subtitle">需要重点改进的领域</p>
          <ul>
            <li v-for="(item, index) in summary.keypoints" :key="index">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 深度分析 -->
    <div class="deep-analysis-section">
      <h3>教学表现详细解读</h3>
      <div class="deep-analysis-content">
        <div class="analysis-item">
          <h4>教学效果</h4>
          <p>{{ deepAnalysis.teachingEffect }}</p>
        </div>
        <div class="analysis-item">
          <h4>学生参与度</h4>
          <p>{{ deepAnalysis.studentParticipation }}</p>
        </div>
        <div class="analysis-item">
          <h4>改进建议</h4>
          <ol>
            <li v-for="(suggestion, index) in deepAnalysis.suggestions" :key="index">
              {{ suggestion }}
            </li>
          </ol>
        </div>
        <div class="analysis-item">
          <h4>发展方向</h4>
          <ol>
            <li v-for="(direction, index) in deepAnalysis.directions" :key="index">
              {{ direction }}
            </li>
          </ol>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="report-footer">
      <el-button type="primary" @click="handleDownload">
        <el-icon><Download /></el-icon>
        下载报告
      </el-button>
      <el-button @click="handleShare">
        <el-icon><Share /></el-icon>
        分享报告
      </el-button>
      <el-button @click="handlePrint">
        <el-icon><Printer /></el-icon>
        打印报告
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  ArrowLeft,
  Download,
  Share,
  Printer,
  Document,
  School,
  User,
  Microphone,
  Key,
  Clock,
  ChatDotRound,
  Trophy,
  Setting,
  Loading,
  CircleCheck,
  DataAnalysis,
  Cpu
} from '@element-plus/icons-vue'

export default {
  name: 'TeacherAnalysisReport',
  components: {
    ArrowLeft,
    Download,
    Share,
    Printer,
    Document,
    School,
    User,
    Microphone,
    Key,
    Clock,
    ChatDotRound,
    Trophy,
    Setting,
    Loading,
    CircleCheck,
    DataAnalysis,
    Cpu
  },
  props: {
    teacherData: {
      type: Object,
      required: true
    },
    showAnalysisDialog: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const radarChartRef = ref(null)
    let chartInstance = null
    
    // AI分析对话框相关状态
    const aiAnalysisDialogVisible = ref(false)
    const aiAnalysisProgress = ref(0)
    const currentAnalysisStep = ref(0)
    const analysisSteps = [
      { 
        title: '基础信息分析', 
        description: '分析教师基本信息和履历',
        icon: 'User',
        duration: 800
      },
      { 
        title: '教学能力评估', 
        description: '深入分析教学成果和课程质量',
        icon: 'Document',
        duration: 1000
      },
      { 
        title: '科研实力评估', 
        description: '评估学术研究和创新成果',
        icon: 'Trophy',
        duration: 900
      },
      { 
        title: '管理能力分析', 
        description: '分析领导力和团队管理能力',
        icon: 'Setting',
        duration: 850
      },
      { 
        title: '综合能力评价', 
        description: '整合多维度进行综合评价',
        icon: 'DataAnalysis',
        duration: 1000
      },
      { 
        title: '生成分析报告', 
        description: '生成AI智能分析报告',
        icon: 'Cpu',
        duration: 1200
      }
    ]

    // 计算属性
    const maxScore = computed(() => {
      const scores = [
        props.teacherData.teachingScore,
        props.teacherData.researchScore,
        props.teacherData.studentScore,
        props.teacherData.peerScore,
        props.teacherData.achievementScore,
        props.teacherData.developmentScore
      ].filter(s => s !== undefined)
      return Math.max(...scores, props.teacherData.overallScore)
    })

    const minScore = computed(() => {
      const scores = [
        props.teacherData.teachingScore,
        props.teacherData.researchScore,
        props.teacherData.studentScore,
        props.teacherData.peerScore,
        props.teacherData.achievementScore,
        props.teacherData.developmentScore
      ].filter(s => s !== undefined)
      return Math.min(...scores, props.teacherData.overallScore)
    })

    const dimensionCount = computed(() => {
      return props.teacherData.dimensions?.length || 0
    })

    // 评分卡片数据
    const scoreCards = computed(() => {
      const cards = []
      
      // 优先使用 teachingDimensions（如果存在），否则使用 dimensions
      const dimensions = props.teacherData.teachingDimensions || props.teacherData.dimensions || []
      
      // 过滤掉"时间管理"和"互动质量"
      const excludedNames = ['时间管理', '互动质量']
      const excludedKeys = ['time', 'interaction']
      
      dimensions.forEach(dim => {
        // 跳过"时间管理"和"互动质量"
        if (excludedNames.includes(dim.name) || excludedKeys.includes(dim.key)) {
          return
        }
        
        let icon = 'Document'
        let description = '表现卓越,值得推广'
        let rating = '优秀'
        
        if (dim.score < 85) {
          description = '表现良好,稳步提升'
          rating = '良好'
        }
        
        const iconMap = {
          teaching: 'Document',
          research: 'School',
          student: 'User',
          peer: 'User',
          achievement: 'Trophy',
          development: 'Setting',
          content: 'Document',
          method: 'School',
          management: 'User',
          participation: 'User',
          expression: 'Microphone',
          board: 'Key',
          time: 'Clock',
          interaction: 'ChatDotRound',
          '教学内容': 'Document',
          '教学方法': 'School',
          '课堂管理': 'User',
          '学生参与度': 'User',
          '语言表达': 'Microphone',
          '板书设计': 'Key',
          '时间管理': 'Clock',
          '互动质量': 'ChatDotRound'
        }
        icon = iconMap[dim.key] || 'Document'
        
        cards.push({
          title: dim.name,
          description,
          score: dim.score,
          rating,
          icon
        })
      })
      
      // 如果 teachingDimensions 不存在，使用默认的教学维度数据
      if (!props.teacherData.teachingDimensions && cards.length < 8) {
        const defaultDims = [
          { name: '教学内容', key: 'content', score: props.teacherData.teachingScore || 95 },
          { name: '教学方法', key: 'method', score: (props.teacherData.teachingScore || 95) - 3 },
          { name: '课堂管理', key: 'management', score: (props.teacherData.teachingScore || 95) - 5 },
          { name: '学生参与度', key: 'participation', score: props.teacherData.studentScore || 94 },
          { name: '语言表达', key: 'expression', score: (props.teacherData.teachingScore || 95) - 2 },
          { name: '板书设计', key: 'board', score: (props.teacherData.teachingScore || 95) - 6 }
        ]
        
        defaultDims.forEach(dim => {
          if (!cards.find(c => c.title === dim.name)) {
            const description = dim.score >= 85 ? '表现卓越,值得推广' : '表现良好,稳步提升'
            const rating = dim.score >= 90 ? '优秀' : '良好'
            const iconMap = {
              content: 'Document',
              method: 'School',
              management: 'User',
              participation: 'User',
              expression: 'Microphone',
              board: 'Key',
              time: 'Clock',
              interaction: 'ChatDotRound'
            }
            
            cards.push({
              title: dim.name,
              description,
              score: dim.score,
              rating,
              icon: iconMap[dim.key] || 'Document'
            })
          }
        })
      }
      
      return cards.slice(0, 8) // 最多显示8个
    })

    // AI分析数据
    const aiAnalysis = computed(() => {
      const baseScore = props.teacherData.overallScore || 90
      const variation = (val) => Math.max(80, Math.min(100, baseScore + val))
      
      return {
        voice: [
          { name: '语音清晰度', value: variation(4) },
          { name: '语速适中度', value: variation(2) },
          { name: '音量适宜度', value: variation(0) },
          { name: '情感语调', value: variation(-2) },
          { name: '停顿频率', value: variation(-5) }
        ],
        behavior: [
          { name: '手势自然度', value: variation(1) },
          { name: '眼神交流', value: variation(3) },
          { name: '移动有效性', value: variation(-1) },
          { name: '姿态端正', value: variation(2) },
          { name: '面部表情', value: variation(0) }
        ],
        interaction: [
          { name: '提问频率', value: variation(5) },
          { name: '学生回应率', value: variation(-2) },
          { name: '反馈质量', value: variation(4) },
          { name: '讨论引导', value: variation(2) }
        ],
        content: [
          { name: '知识准确性', value: variation(8) },
          { name: '逻辑结构', value: variation(6) },
          { name: '难度适宜', value: variation(3) },
          { name: '举例相关性', value: variation(4) }
        ]
      }
    })

    // 总结数据
    const summary = computed(() => {
      return {
        advantages: [
          '教学内容准确性极高,知识点讲解清晰透彻',
          '师生互动频繁,课堂氛围活跃',
          '语言表达流畅,逻辑性强',
          '能够及时给予学生有效反馈',
          '教学方法多样化,适合不同层次学生'
        ],
        improvements: [
          '建议在重点概念讲解时适当放慢语速,给学生更多思考时间',
          '优化板书布局,采用分区域书写方式',
          '增加生活化实例,帮助学生理解抽象概念',
          '可以设计更多小组讨论环节,提高学生参与度'
        ],
        forecast: [
          '持续保持当前教学水平,预计下次评价可达到95分以上',
          '在板书和语速方面改进后,整体教学效果将显著提升',
          '建议参与高级教师培训,向专家级教师发展',
          '可以承担教学示范课任务,分享优秀教学经验'
        ],
        keypoints: [
          '板书设计可以更加规范整洁',
          '语速偶尔过快,需要适当放慢',
          '可以增加更多实际应用案例'
        ]
      }
    })

    // 深度分析数据
    const deepAnalysis = computed(() => {
      return {
        teachingEffect: `${props.teacherData.teacherName}在教学方面表现优秀，教学内容准确性极高(98%)，知识点讲解清晰透彻。教学方法多样化，能够根据学生反应及时调整教学策略。课堂管理能力强，能够维持良好的课堂秩序，同时激发学生的学习兴趣。整体教学效果优秀，学生接受度高。`,
        studentParticipation: `学生参与度良好(94%)，课堂互动频繁，学生积极响应。AI分析显示，学生在课堂上的注意力集中度较高，问答环节参与率达到88%。建议继续保持互动式教学模式，适当增加小组合作学习环节。`,
        suggestions: [
          '板书设计需要更加规范化,建议采用模块化布局',
          '语速控制需要优化,在重点内容讲解时适当放慢',
          '可以增加更多实际应用案例,提高学生的实践能力',
          '时间管理可以进一步精细化,确保每个教学环节都有充足时间'
        ],
        directions: [
          '继续深化教学内容研究,保持知识更新',
          '参与高级教师培训项目,提升教学理论水平',
          '可以承担新教师指导工作,分享教学经验',
          '建议申请教学创新项目,探索新的教学模式',
          '预计在持续改进下,下学期可以达到专家级教师水平'
        ]
      }
    })

    // 初始化雷达图
    const initRadarChart = () => {
      if (!radarChartRef.value) return
      
      chartInstance = echarts.init(radarChartRef.value)
      
      // 优先使用 teachingDimensions，否则使用 dimensions
      const dimensions = props.teacherData.teachingDimensions || props.teacherData.dimensions || []
      
      // 过滤掉"时间管理"和"互动质量"
      const excludedNames = ['时间管理', '互动质量']
      const excludedKeys = ['time', 'interaction']
      const filteredDimensions = dimensions.filter(dim => 
        !excludedNames.includes(dim.name) && !excludedKeys.includes(dim.key)
      )
      
      // 如果维度少于6个，使用默认的教学维度
      let displayDimensions = filteredDimensions
      if (displayDimensions.length < 6) {
        displayDimensions = [
          { name: '教学内容', score: props.teacherData.teachingScore || 95 },
          { name: '教学方法', score: (props.teacherData.teachingScore || 95) - 3 },
          { name: '课堂管理', score: (props.teacherData.teachingScore || 95) - 5 },
          { name: '学生参与度', score: props.teacherData.studentScore || 94 },
          { name: '语言表达', score: (props.teacherData.teachingScore || 95) - 2 },
          { name: '板书设计', score: (props.teacherData.teachingScore || 95) - 6 }
        ]
      }
      
      const indicators = displayDimensions.slice(0, 6).map(dim => ({
        name: dim.name,
        max: 100
      }))
      
      const values = displayDimensions.slice(0, 6).map(dim => dim.score)
      
      const option = {
        radar: {
          indicator: indicators,
          center: ['50%', '50%'],
          radius: '75%',
          name: {
            textStyle: {
              color: '#666',
              fontSize: 12
            }
          },
          splitArea: {
            areaStyle: {
              color: ['rgba(84, 112, 198, 0.1)', 'rgba(84, 112, 198, 0.05)']
            }
          },
          splitLine: {
            lineStyle: {
              color: '#5470c6',
              width: 1
            }
          },
          axisLine: {
            lineStyle: {
              color: '#5470c6'
            }
          }
        },
        series: [{
          type: 'radar',
          data: [{
            value: values,
            name: props.teacherData.teacherName,
            areaStyle: {
              color: 'rgba(84, 112, 198, 0.3)'
            },
            lineStyle: {
              color: '#5470c6',
              width: 2
            },
            itemStyle: {
              color: '#5470c6'
            }
          }]
        }]
      }
      
      chartInstance.setOption(option)
    }

    // 获取进度条颜色
    const getProgressColor = (score) => {
      if (score >= 90) return '#10b981'
      if (score >= 80) return '#3b82f6'
      if (score >= 70) return '#f59e0b'
      return '#ef4444'
    }
    
    // 获取图标组件
    const getIconComponent = (iconName) => {
      const iconMap = {
        User: User,
        Document: Document,
        Trophy: Trophy,
        Setting: Setting,
        DataAnalysis: DataAnalysis,
        Cpu: Cpu
      }
      return iconMap[iconName] || Document
    }
    
    // 执行AI分析动画
    const performAIAnalysis = async () => {
      const totalSteps = analysisSteps.length
      
      // 逐步执行分析
      for (let i = 0; i < totalSteps; i++) {
        currentAnalysisStep.value = i
        const step = analysisSteps[i]
        const stepDuration = step.duration
        
        // 更新进度条
        const progressPerStep = 100 / totalSteps
        const startProgress = i * progressPerStep
        const endProgress = (i + 1) * progressPerStep
        
        // 动画更新进度
        await animateProgress(startProgress, endProgress, stepDuration)
      }
      
      // 确保进度条到达100%
      aiAnalysisProgress.value = 100
      
      // 等待一小段时间让用户看到完成效果
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 分析完成，关闭分析对话框
      aiAnalysisDialogVisible.value = false
    }
    
    // 动画更新进度条
    const animateProgress = (start, end, duration) => {
      return new Promise(resolve => {
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          aiAnalysisProgress.value = start + (end - start) * progress
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        }
        animate()
      })
    }

    // 处理返回
    const handleBack = () => {
      emit('close')
    }

    // 处理下载
    const handleDownload = () => {
      ElMessage.success('报告下载功能开发中...')
    }

    // 处理分享
    const handleShare = () => {
      ElMessage.success('报告分享功能开发中...')
    }

    // 处理打印
    const handlePrint = () => {
      window.print()
    }

    // 窗口大小变化处理
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize()
      }
    }

    onMounted(() => {
      nextTick(() => {
        initRadarChart()
        window.addEventListener('resize', handleResize)
        
        // 如果 showAnalysisDialog 为 true，显示分析对话框并执行分析
        if (props.showAnalysisDialog) {
          aiAnalysisDialogVisible.value = true
          aiAnalysisProgress.value = 0
          currentAnalysisStep.value = 0
          performAIAnalysis()
        }
      })
    })

    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
      }
      window.removeEventListener('resize', handleResize)
    })

    return {
      radarChartRef,
      maxScore,
      minScore,
      dimensionCount,
      scoreCards,
      aiAnalysis,
      summary,
      deepAnalysis,
      getProgressColor,
      handleBack,
      handleDownload,
      handleShare,
      handlePrint,
      // AI分析相关
      aiAnalysisDialogVisible,
      aiAnalysisProgress,
      currentAnalysisStep,
      analysisSteps,
      getIconComponent
    }
  }
}
</script>

<style scoped>
.teacher-report-container {
  background: #fff;
  min-height: 100vh;
  padding: 24px;
}

/* 报告头部 */
.report-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 8px;
}

/* 性能概览 */
.performance-overview {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 32px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  align-items: center;
}

.radar-chart-container {
  width: 100%;
  height: 400px;
}

.radar-chart {
  width: 100%;
  height: 100%;
}

.score-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.score-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f1f5fa 0%, #aab5e8 100%);
  border-radius: 12px;
  color: #667eea;
  font-size: 24px;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.card-content h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.card-desc {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #6b7280;
}

.card-score {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-left: 12px;
}

.score-value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.score-rating {
  font-size: 14px;
  color: #10b981;
  font-weight: 500;
}

.performance-index {
  margin-top: 8px;
}

.index-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

/* AI 智能分析 */
.ai-analysis-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.ai-analysis-section h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.analysis-category {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.category-icon {
  font-size: 20px;
}

.analysis-category h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

/* 语音分析 - 紫色主题 */
.voice-analysis .category-icon {
  color: #9333ea;
}

.voice-analysis h4 {
  color: #9333ea;
}

.voice-analysis .metric-chip {
  background: rgba(147, 51, 234, 0.1);
}

.voice-analysis .metric-value {
  color: #9333ea;
}

.voice-analysis .metric-name {
  color: #9333ea;
}

/* 行为分析 - 绿色主题 */
.behavior-analysis .category-icon {
  color: #10b981;
}

.behavior-analysis h4 {
  color: #10b981;
}

.behavior-analysis .metric-chip {
  background: rgba(16, 185, 129, 0.1);
}

.behavior-analysis .metric-value {
  color: #10b981;
}

.behavior-analysis .metric-name {
  color: #10b981;
}

/* 互动分析 - 蓝色主题 */
.interaction-analysis .category-icon {
  color: #3b82f6;
}

.interaction-analysis h4 {
  color: #3b82f6;
}

.interaction-analysis .metric-chip {
  background: rgba(59, 130, 246, 0.1);
}

.interaction-analysis .metric-value {
  color: #3b82f6;
}

.interaction-analysis .metric-name {
  color: #3b82f6;
}

/* 内容分析 - 黄色主题 */
.content-analysis .category-icon {
  color: #f59e0b;
}

.content-analysis h4 {
  color: #f59e0b;
}

.content-analysis .metric-chip {
  background: rgba(245, 158, 11, 0.1);
}

.content-analysis .metric-value {
  color: #f59e0b;
}

.content-analysis .metric-name {
  color: #f59e0b;
}

.analysis-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-chip {
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
}

.metric-name {
  font-size: 13px;
  line-height: 1.4;
}

/* 总结和建议 */
.summary-section {
  margin-bottom: 32px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.summary-card {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.summary-card h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.summary-card.advantages {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
  border-color: #10b981;
}

.summary-card.advantages h4 {
  color: #10b981;
}

.summary-card.improvements {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-color: #f59e0b;
}

.summary-card.improvements h4 {
  color: #f59e0b;
}

.summary-card.forecast {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border-color: #3b82f6;
}

.summary-card.forecast h4 {
  color: #3b82f6;
}

.summary-card.keypoints {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border-color: #ef4444;
}

.summary-card.keypoints h4 {
  color: #ef4444;
}

.card-subtitle {
  margin: 0 0 12px 0;
  font-size: 13px;
  color: #6b7280;
}

.summary-card ul {
  margin: 0;
  padding-left: 20px;
}

.summary-card li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

.summary-card li:last-child {
  margin-bottom: 0;
}

/* 深度分析 */
.deep-analysis-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.deep-analysis-section h3 {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.deep-analysis-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.analysis-item h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.analysis-item p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.8;
}

.analysis-item ol {
  margin: 0;
}

.analysis-item li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.8;
}

.analysis-item li:last-child {
  margin-bottom: 0;
}

/* 底部操作栏 */
.report-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .performance-overview {
    grid-template-columns: 1fr;
  }
  
  .analysis-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  
  .score-cards-grid {
    grid-template-columns: 1fr;
  }
  
  .report-footer {
    flex-direction: column;
  }
}

/* AI智能分析对话框样式 */
.ai-analysis-dialog :deep(.el-dialog__header) {
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0;
  border-radius: 8px 8px 0 0;
}

.ai-analysis-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.analysis-header {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.header-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  flex-shrink: 0;
}

.header-icon .el-icon {
  font-size: 24px;
  color: #ffffff;
}

.header-content {
  flex: 1;
}

.header-content h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.header-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.rotating {
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.analysis-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.candidate-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item .label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  min-width: 60px;
}

.info-item .value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-header span:first-child {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.progress-percent {
  font-size: 16px;
  color: #667eea;
  font-weight: 700;
}

.analysis-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background: #ffffff;
  transition: all 0.3s ease;
}

.step-item.step-pending {
  opacity: 0.6;
  background: #f9fafb;
}

.step-item.step-active {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.step-item.step-completed {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
}

.step-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
  background: #f3f4f6;
  transition: all 0.3s ease;
}

.step-item.step-active .step-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.step-item.step-completed .step-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.step-check {
  font-size: 20px;
  color: #ffffff;
}

.step-loading {
  font-size: 20px;
  color: #ffffff;
}

.step-pending-icon {
  font-size: 20px;
  color: #9ca3af;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  transition: color 0.3s ease;
}

.step-item.step-pending .step-title {
  color: #9ca3af;
}

.step-item.step-active .step-title {
  color: #667eea;
}

.step-item.step-completed .step-title {
  color: #10b981;
}

.step-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.step-item.step-pending .step-description {
  color: #9ca3af;
}

/* 打印样式 */
@media print {
  .back-btn,
  .header-actions,
  .report-footer {
    display: none;
  }
  
  .teacher-report-container {
    padding: 0;
  }
}
</style>

