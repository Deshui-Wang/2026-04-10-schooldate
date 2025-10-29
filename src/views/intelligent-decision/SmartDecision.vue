<template>
  <div class="smart-decision">
    <!-- 页面头部 -->
    <div class="section-header">
      <h3>智能决策</h3>
      <p>基于AI技术的候选人能力对比分析与智能评选</p>
    </div>

    <!-- 候选人选择区域 -->
    <el-card class="candidates-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><User /></el-icon>
          <span>候选人</span>
          <el-tag type="info" class="ml-2">{{ selectedCandidates.length }} 位候选人</el-tag>
          <span class="header-right-note">候选人来自【<router-link to="/intelligent-decision/smart-recommendation" class="header-link">智能推荐</router-link>】</span>
        </div>
      </template>
      
      <!-- 候选人列表 -->
      <div v-if="filteredCandidates.length > 0" class="candidates-grid">
        <div 
          v-for="candidate in filteredCandidates" 
          :key="candidate.id"
          class="candidate-item"
          :class="{ 'selected': selectedCandidates.includes(candidate.id) }"
          @click="toggleCandidate(candidate.id)"
        >
          <div class="candidate-avatar">
            <el-avatar :size="50" :src="candidate.avatar">
              {{ candidate.name.charAt(0) }}
            </el-avatar>
          </div>
          <div class="candidate-info">
            <h4 v-html="highlightText(candidate.name)"></h4>
            <p v-html="highlightText(candidate.department)"></p>
            <p v-html="highlightText(candidate.title)"></p>
          </div>
          <div class="candidate-score">
            <span>{{ candidate.score }}</span>
          </div>
        </div>
      </div>
      
      <!-- 搜索无结果状态 -->
      <div v-else-if="searchKeyword" class="search-empty-state">
        <el-empty description="未找到匹配的候选人">
          <template #image>
            <el-icon size="60" color="#cbd5e0"><Search /></el-icon>
          </template>
          <el-button type="primary" @click="searchKeyword = ''">
            清除搜索条件
          </el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- 分析配置区域 -->
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>分析配置</span>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="评选类型">
            <el-select v-model="config.evaluationType" placeholder="请选择评选类型">
              <el-option label="职称评选" value="title" />
              <el-option label="优秀教师" value="excellent" />
              <el-option label="教学能手" value="teaching" />
              <el-option label="科研标兵" value="research" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="分析维度">
            <el-select v-model="config.analysisDimensions" multiple placeholder="选择分析维度">
              <el-option label="教学能力" value="teaching" />
              <el-option label="科研能力" value="research" />
              <el-option label="工作态度" value="attitude" />
              <el-option label="创新能力" value="innovation" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="对比方式">
            <el-select v-model="config.comparisonMethod" placeholder="选择对比方式">
              <el-option label="综合评分" value="comprehensive" />
              <el-option label="单项对比" value="individual" />
              <el-option label="雷达图对比" value="radar" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="决策算法">
            <el-select v-model="config.algorithm" placeholder="选择决策算法">
              <el-option label="TOPSIS" value="topsis" />
              <el-option label="AHP层次分析" value="ahp" />
              <el-option label="模糊综合评价" value="fuzzy" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>

    <!-- 分析结果区域 -->
    <div v-if="analysisResults" class="analysis-results">
      <!-- 智能决策结果 -->
      <el-card class="decision-result-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Trophy /></el-icon>
            <span>智能决策结果</span>
          </div>
        </template>
        
        <div class="decision-results">
          <div class="winner-section">
            <div class="winner-card">
              <div class="winner-rank">🏆</div>
              <div class="winner-info">
                <h3>{{ analysisResults.winner.name }}</h3>
                <p>{{ analysisResults.winner.department }}</p>
                <div class="winner-score">{{ analysisResults.winner.totalScore }} 分</div>
              </div>
            </div>
            <div class="winner-reasons">
              <h4>推荐理由：</h4>
              <ul>
                <li v-for="reason in analysisResults.winner.reasons" :key="reason">
                  {{ reason }}
                </li>
              </ul>
            </div>
          </div>
          
          <div class="ranking-list">
            <h4>完整排名：</h4>
            <div class="ranking-items">
              <div 
                v-for="(candidate, index) in analysisResults.ranking" 
                :key="candidate.id"
                class="ranking-item"
                :class="{ 'top-three': index < 3 }"
              >
                <div class="rank-number">{{ index + 1 }}</div>
                <div class="candidate-info">
                  <span class="name">{{ candidate.name }}</span>
                  <span class="score">{{ candidate.totalScore }}分</span>
                </div>
                <div class="rank-badge" v-if="index < 3">
                  <el-icon v-if="index === 0"><Trophy /></el-icon>
                  <el-icon v-else-if="index === 1"><Medal /></el-icon>
                  <el-icon v-else><Award /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 综合评分对比 -->
      <el-card class="score-comparison-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><TrendCharts /></el-icon>
            <span>综合评分对比</span>
          </div>
        </template>
        
        <div class="score-chart">
          <div 
            v-for="(candidate, index) in analysisResults.candidates" 
            :key="candidate.id"
            class="score-bar"
          >
            <div class="candidate-name">{{ candidate.name }}</div>
            <div class="bar-container">
              <div 
                class="score-fill" 
                :style="{ width: `${candidate.totalScore}%` }"
                :class="`rank-${index + 1}`"
              ></div>
              <span class="score-value">{{ candidate.totalScore }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 多维度对比雷达图 -->
      <el-card class="radar-comparison-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><PieChart /></el-icon>
            <span>多维度能力对比</span>
          </div>
        </template>
        
        <div class="radar-comparison-content">
          <!-- 左侧雷达图 -->
          <div class="radar-chart-container">
            <RadarChart 
              :candidates="analysisResults.candidates"
              :dimensions="[
                { name: '教学能力', max: 100 },
                { name: '科研能力', max: 100 },
                { name: '工作态度', max: 100 },
                { name: '创新能力', max: 100 },
                { name: '团队协作', max: 100 },
                { name: '沟通能力', max: 100 }
              ]"
            />
          </div>
          
          <!-- 右侧对比分析描述 -->
          <div class="comparison-analysis">
            <div class="analysis-header">
              <h3>对比结果分析</h3>
              <p class="analysis-subtitle">基于多维度数据的智能分析结果</p>
            </div>
            
            <div class="analysis-sections">
              <!-- 综合排名分析 -->
              <div class="analysis-section">
                <div class="section-header">
                  <el-icon class="section-icon"><Trophy /></el-icon>
                  <h4>综合排名分析</h4>
                </div>
                <div class="ranking-analysis">
                  <div 
                    v-for="(candidate, index) in analysisResults.ranking.slice(0, 3)" 
                    :key="candidate.id"
                    class="rank-item"
                    :class="`rank-${index + 1}`"
                  >
                    <div class="rank-number">{{ index + 1 }}</div>
                    <div class="rank-info">
                      <div class="rank-name">{{ candidate.name }}</div>
                      <div class="rank-score">{{ candidate.totalScore }}分</div>
                    </div>
                    <div class="rank-trend">
                      <el-icon v-if="index === 0"><TrendCharts /></el-icon>
                      <span class="trend-text">{{ getRankTrendText(index) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 维度优势分析 -->
              <div class="analysis-section">
                <div class="section-header">
                  <el-icon class="section-icon"><Star /></el-icon>
                  <h4>维度优势分析</h4>
                </div>
                <div class="dimension-analysis">
                  <div 
                    v-for="dimension in analysisResults.dimensionAnalysis" 
                    :key="dimension.name"
                    class="dimension-item"
                  >
                    <div class="dimension-name">{{ dimension.name }}</div>
                    <div class="dimension-leader">
                      <span class="leader-name">{{ dimension.leader }}</span>
                      <span class="leader-score">{{ dimension.maxScore }}分</span>
                    </div>
                    <div class="dimension-gap">
                      领先第2名 {{ dimension.gap }}分
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 关键发现 -->
              <div class="analysis-section">
                <div class="section-header">
                  <el-icon class="section-icon"><Lightbulb /></el-icon>
                  <h4>关键发现</h4>
                </div>
                <div class="key-findings">
                  <div 
                    v-for="finding in analysisResults.keyFindings" 
                    :key="finding.id"
                    class="finding-item"
                    :class="finding.type"
                  >
                    <div class="finding-icon">
                      <el-icon v-if="finding.type === 'strength'"><Check /></el-icon>
                      <el-icon v-else-if="finding.type === 'weakness'"><Warning /></el-icon>
                      <el-icon v-else><InfoFilled /></el-icon>
                    </div>
                    <div class="finding-content">
                      <div class="finding-title">{{ finding.title }}</div>
                      <div class="finding-desc">{{ finding.description }}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 决策建议 -->
              <div class="analysis-section">
                <div class="section-header">
                  <el-icon class="section-icon"><ChatDotRound /></el-icon>
                  <h4>决策建议</h4>
                </div>
                <div class="decision-suggestions">
                  <div class="suggestion-item">
                    <div class="suggestion-label">推荐选择</div>
                    <div class="suggestion-content">{{ analysisResults.suggestions.recommendation }}</div>
                  </div>
                  <div class="suggestion-item">
                    <div class="suggestion-label">注意事项</div>
                    <div class="suggestion-content">{{ analysisResults.suggestions.risks }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 详细对比分析 -->
      <el-card class="detailed-comparison-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><List /></el-icon>
            <span>详细对比分析</span>
          </div>
        </template>
        
        <el-table :data="analysisResults.detailedComparison" stripe>
          <el-table-column prop="dimension" label="评价维度" width="120" />
          <el-table-column 
            v-for="candidate in analysisResults.candidates" 
            :key="candidate.id"
            :label="candidate.name"
            :prop="`candidate_${candidate.id}`"
            align="center"
          >
            <template #default="scope">
              <div class="score-cell">
                <span class="score">{{ scope.row[`candidate_${candidate.id}`] }}</span>
                <div class="score-bar-mini">
                  <div 
                    class="mini-bar" 
                    :style="{ width: `${scope.row[`candidate_${candidate.id}`]}%` }"
                  ></div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      

      <!-- 决策建议 -->
      <el-card class="suggestions-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Lightbulb /></el-icon>
            <span>决策建议</span>
          </div>
        </template>
        
        <div class="suggestions-content">
          <div class="suggestion-item">
            <h4>🎯 推荐选择</h4>
            <p>{{ analysisResults.suggestions.recommendation }}</p>
          </div>
          <div class="suggestion-item">
            <h4>⚠️ 风险提示</h4>
            <p>{{ analysisResults.suggestions.risks }}</p>
          </div>
          <div class="suggestion-item">
            <h4>💡 改进建议</h4>
            <p>{{ analysisResults.suggestions.improvements }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-empty description="针对候选人进行智能分析">
        <el-button type="primary" @click="startAnalysis" :disabled="selectedCandidates.length === 0">
          开始AI智能分析
        </el-button>
      </el-empty>
    </div>

    <!-- 智能分析进度弹窗 -->
    <el-dialog
      v-model="showAnalysisModal"
      title="智能分析进行中"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
      class="analysis-modal"
    >
      <div class="analysis-content">
        <div class="analysis-icon">
          <el-icon class="rotating-icon"><Loading /></el-icon>
        </div>
        <h3>AI正在分析候选人数据...</h3>
        <p class="analysis-description">正在使用{{ getAlgorithmName(config.algorithm) }}算法进行多维度智能分析</p>
        
        <div class="progress-section">
          <div class="progress-steps">
            <div 
              v-for="(step, index) in analysisSteps" 
              :key="index"
              class="step-item"
              :class="{ 
                'active': currentStep === index, 
                'completed': currentStep > index 
              }"
            >
              <div class="step-icon">
                <el-icon v-if="currentStep > index"><Check /></el-icon>
                <el-icon v-else-if="currentStep === index"><Loading /></el-icon>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-desc">{{ step.description }}</div>
              </div>
            </div>
          </div>
          
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${analysisProgress}%` }"></div>
          </div>
          <div class="progress-text">{{ analysisProgress }}%</div>
        </div>
        
        <div class="analysis-tips">
          <el-icon><Lightbulb /></el-icon>
          <span>{{ currentTip }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import RadarChart from '@/components/RadarChart.vue'
import { useRecommendedCandidates } from '@/store/recommendationStore.js'

export default {
  name: 'SmartDecision',
  components: {
    RadarChart
  },
  setup() {
    const config = reactive({
      evaluationType: 'title',
      analysisDimensions: ['teaching', 'research', 'attitude', 'innovation'],
      comparisonMethod: 'comprehensive',
      algorithm: 'topsis'
    })

    const selectedCandidates = ref([])
    const searchKeyword = ref('')

    const availableCandidates = ref([])

    const analysisResults = ref(null)

    // 读取“智能推荐”页的候选人（全局共享）并合并到可选列表，自动选中
    const recommendedCandidates = useRecommendedCandidates()

    const ensureUniqueId = () => {
      // 生成一个新的唯一 id（基于现有最大 id + 1）
      const ids = availableCandidates.value.map(c => c.id)
      const maxId = ids.length ? Math.max(...ids) : 0
      return maxId + 1
    }

    const mergeRecommendedIntoAvailable = (incoming) => {
      if (!Array.isArray(incoming)) return
      incoming.forEach(rec => {
        // 优先按 name 匹配到现有候选人，否则新增
        const existing = availableCandidates.value.find(c => c.name === rec.name)
        if (existing) {
          // 更新基础信息
          existing.department = rec.department || existing.department
          existing.title = rec.title || existing.title
          existing.score = typeof rec.score === 'number' ? rec.score : (existing.score || 0)
          existing.avatar = rec.avatar || existing.avatar
          // 自动选择
          if (!selectedCandidates.value.includes(existing.id)) {
            selectedCandidates.value.push(existing.id)
          }
        } else {
          const newId = ensureUniqueId()
          const appended = {
            id: newId,
            name: rec.name,
            department: rec.department || '',
            title: rec.title || '',
            score: typeof rec.score === 'number' ? rec.score : 0,
            avatar: rec.avatar || ''
          }
          availableCandidates.value.push(appended)
          if (!selectedCandidates.value.includes(appended.id)) {
            selectedCandidates.value.push(appended.id)
          }
        }
      })
    }

    // 初始合并一次
    mergeRecommendedIntoAvailable(recommendedCandidates.value)

    // 监听后续变更
    watch(recommendedCandidates, (val) => {
      mergeRecommendedIntoAvailable(val)
    }, { deep: true })
    
    // 弹窗相关数据
    const showAnalysisModal = ref(false)
    const analysisProgress = ref(0)
    const currentStep = ref(0)
    const currentTip = ref('正在初始化分析环境...')
    
    const analysisSteps = ref([
      {
        title: '数据预处理',
        description: '清洗和标准化候选人数据'
      },
      {
        title: '多维度评分',
        description: '计算教学、科研、态度、创新等维度得分'
      },
      {
        title: '算法分析',
        description: '应用选定算法进行智能决策分析'
      },
      {
        title: '结果生成',
        description: '生成分析报告和推荐结果'
      }
    ])
    
    // 过滤候选人
    const filteredCandidates = computed(() => {
      if (!searchKeyword.value.trim()) {
        return availableCandidates.value
      }
      
      const keyword = searchKeyword.value.toLowerCase().trim()
      return availableCandidates.value.filter(candidate => {
        return candidate.name.toLowerCase().includes(keyword) ||
               candidate.department.toLowerCase().includes(keyword) ||
               candidate.title.toLowerCase().includes(keyword)
      })
    })
    
    const analysisTips = ref([
      '正在初始化分析环境...',
      '正在清洗和标准化候选人数据...',
      '正在计算各维度评分...',
      '正在应用智能算法进行分析...',
      '正在生成分析报告...',
      '分析即将完成，请稍候...'
    ])

    const toggleCandidate = (candidateId) => {
      const index = selectedCandidates.value.indexOf(candidateId)
      if (index > -1) {
        selectedCandidates.value.splice(index, 1)
      } else {
        selectedCandidates.value.push(candidateId)
      }
    }

    // 快捷选择操作
    const selectAllFiltered = () => {
      const filteredIds = filteredCandidates.value.map(c => c.id)
      selectedCandidates.value = [...new Set([...selectedCandidates.value, ...filteredIds])]
    }

    const clearSelection = () => {
      selectedCandidates.value = []
    }

    const selectTopCandidates = () => {
      const topCandidates = filteredCandidates.value
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(c => c.id)
      selectedCandidates.value = [...new Set([...selectedCandidates.value, ...topCandidates])]
    }

    // 高亮搜索关键词
    const highlightText = (text) => {
      if (!searchKeyword.value.trim()) {
        return text
      }
      
      const keyword = searchKeyword.value.trim()
      const regex = new RegExp(`(${keyword})`, 'gi')
      return text.replace(regex, '<span class="highlight">$1</span>')
    }

    const startAnalysis = () => {
      if (selectedCandidates.value.length < 2) {
        ElMessage.warning('请至少选择2位候选人进行比较')
        return
      }

      // 显示分析弹窗
      showAnalysisModal.value = true
      analysisProgress.value = 0
      currentStep.value = 0
      currentTip.value = analysisTips.value[0]
      
      // 模拟分析过程
      simulateAnalysis()
    }
    
    const simulateAnalysis = () => {
      const totalSteps = analysisSteps.value.length
      const stepDuration = 1500 // 每个步骤1.5秒
      const tipInterval = 300 // 提示更新间隔300ms
      
      let stepIndex = 0
      let tipIndex = 0
      
      // 更新提示信息
      const tipTimer = setInterval(() => {
        tipIndex = (tipIndex + 1) % analysisTips.value.length
        currentTip.value = analysisTips.value[tipIndex]
      }, tipInterval)
      
      // 更新进度
      const progressTimer = setInterval(() => {
        stepIndex++
        currentStep.value = Math.min(stepIndex, totalSteps - 1)
        analysisProgress.value = Math.min((stepIndex / totalSteps) * 100, 100)
        
        if (stepIndex >= totalSteps) {
          clearInterval(progressTimer)
          clearInterval(tipTimer)
          
          // 延迟关闭弹窗并显示结果
          setTimeout(() => {
            showAnalysisModal.value = false
            generateAnalysisResults()
            ElMessage.success('分析完成！')
          }, 500)
        }
      }, stepDuration)
    }
    
    const generateAnalysisResults = () => {
      const selectedCandidatesData = availableCandidates.value.filter(c => selectedCandidates.value.includes(c.id))
      
      // 动态生成详细对比数据
      const detailedComparison = [
        {
          dimension: '教学能力',
          ...selectedCandidatesData.reduce((acc, candidate, index) => {
            acc[`candidate_${candidate.id}`] = Math.floor(Math.random() * 20) + 80 // 80-100分
            return acc
          }, {})
        },
        {
          dimension: '科研能力',
          ...selectedCandidatesData.reduce((acc, candidate, index) => {
            acc[`candidate_${candidate.id}`] = Math.floor(Math.random() * 20) + 80 // 80-100分
            return acc
          }, {})
        },
        {
          dimension: '工作态度',
          ...selectedCandidatesData.reduce((acc, candidate, index) => {
            acc[`candidate_${candidate.id}`] = Math.floor(Math.random() * 20) + 80 // 80-100分
            return acc
          }, {})
        },
        {
          dimension: '创新能力',
          ...selectedCandidatesData.reduce((acc, candidate, index) => {
            acc[`candidate_${candidate.id}`] = Math.floor(Math.random() * 20) + 80 // 80-100分
            return acc
          }, {})
        }
      ]
      
      // 根据评分排序
      const sortedCandidates = selectedCandidatesData.sort((a, b) => b.score - a.score)
      
      analysisResults.value = {
        candidates: selectedCandidatesData,
        detailedComparison,
        winner: {
          name: sortedCandidates[0].name,
          department: sortedCandidates[0].department,
          totalScore: sortedCandidates[0].score,
          reasons: [
            '教学能力突出，学生评价优秀',
            '科研产出质量高，学术影响力大',
            '工作态度认真，团队协作能力强',
            '创新能力强，教学方法新颖'
          ]
        },
        ranking: sortedCandidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          totalScore: candidate.score
        })),
        suggestions: {
          recommendation: `推荐选择${sortedCandidates[0].name}，其在教学、科研、工作态度和创新能力四个维度均表现优秀，综合评分最高。`,
          risks: `需要注意${sortedCandidates[0].name}当前工作负荷较重，建议合理安排其工作内容，避免过度疲劳。`,
          improvements: `建议为其他候选人提供针对性培训，特别是${sortedCandidates[sortedCandidates.length - 1].name}在科研能力方面有提升空间。`
        },
        dimensionAnalysis: [
          {
            name: '教学能力',
            leader: sortedCandidates[0].name,
            maxScore: Math.floor(Math.random() * 10) + 90,
            gap: Math.floor(Math.random() * 5) + 2
          },
          {
            name: '科研能力',
            leader: sortedCandidates[1]?.name || sortedCandidates[0].name,
            maxScore: Math.floor(Math.random() * 10) + 90,
            gap: Math.floor(Math.random() * 5) + 2
          },
          {
            name: '工作态度',
            leader: sortedCandidates[0].name,
            maxScore: Math.floor(Math.random() * 10) + 90,
            gap: Math.floor(Math.random() * 5) + 2
          },
          {
            name: '创新能力',
            leader: sortedCandidates[1]?.name || sortedCandidates[0].name,
            maxScore: Math.floor(Math.random() * 10) + 90,
            gap: Math.floor(Math.random() * 5) + 2
          }
        ],
        keyFindings: [
          {
            id: 1,
            type: 'strength',
            title: `${sortedCandidates[0].name}综合实力突出`,
            description: '在多个维度均保持领先，特别是在教学能力和工作态度方面表现优异'
          },
          {
            id: 2,
            type: 'strength',
            title: `${sortedCandidates[1]?.name || sortedCandidates[0].name}科研创新能力强`,
            description: '在科研能力和创新能力方面表现突出，具有较强的发展潜力'
          },
          {
            id: 3,
            type: 'weakness',
            title: `${sortedCandidates[sortedCandidates.length - 1].name}科研能力待提升`,
            description: '科研能力相对较弱，建议加强学术研究和论文发表'
          },
          {
            id: 4,
            type: 'info',
            title: '整体水平较为均衡',
            description: '候选人整体水平较为接近，竞争激烈，需要综合考虑各方面因素'
          }
        ]
      }
    }
    
    const getAlgorithmName = (algorithm) => {
      const algorithmNames = {
        'topsis': 'TOPSIS',
        'ahp': 'AHP层次分析',
        'fuzzy': '模糊综合评价'
      }
      return algorithmNames[algorithm] || 'TOPSIS'
    }

    const getRankTrendText = (index) => {
      const trendTexts = [
        '综合实力最强',
        '表现稳定优秀',
        '潜力值得关注'
      ]
      return trendTexts[index] || '表现良好'
    }

    const exportReport = () => {
      if (!analysisResults.value) {
        ElMessage.warning('请先完成分析')
        return
      }
      ElMessage.success('报告已导出')
    }

    return {
      config,
      selectedCandidates,
      availableCandidates,
      filteredCandidates,
      searchKeyword,
      analysisResults,
      showAnalysisModal,
      analysisProgress,
      currentStep,
      currentTip,
      analysisSteps,
      analysisTips,
      toggleCandidate,
      selectAllFiltered,
      clearSelection,
      selectTopCandidates,
      highlightText,
      startAnalysis,
      simulateAnalysis,
      generateAnalysisResults,
      getAlgorithmName,
      getRankTrendText,
      exportReport
    }
  }
}
</script>

<style scoped>
.smart-decision {
  min-height: 100vh;
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

.config-card, .candidates-card, .score-comparison-card, 
.radar-comparison-card, .detailed-comparison-card, 
.decision-result-card, .suggestions-card {
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

.header-right-note {
  margin-left: auto;
  font-weight: 400;
  color: #718096;
  font-size: 14px;
}

.header-right-note .header-link {
  color: #409EFF;
  text-decoration: none;
}

.header-right-note .header-link:hover {
  text-decoration: underline;
}

.candidates-search {
  margin-bottom: 20px;
  padding: 0 4px;
}

.search-input {
  margin-bottom: 12px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.search-stats {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats-text {
  font-size: 13px;
  color: #718096;
  background: #f7fafc;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.filtered-count {
  color: #667eea;
  font-weight: 500;
}

.search-empty-state {
  padding: 40px 20px;
  text-align: center;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.quick-actions .el-button {
  border-radius: 6px;
  font-size: 12px;
  padding: 6px 12px;
}

.highlight {
  background: linear-gradient(120deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-weight: 600;
}

.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.candidate-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.candidate-item:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.candidate-item.selected {
  border-color: #A5B4FC; /* lighter indigo */
  background: linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%); /* soft indigo/purple */
  color: #2d3748; /* dark text for readability */
}

.candidate-avatar {
  margin-right: 12px;
}

.candidate-info {
  flex: 1;
}

.candidate-info h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
}

.candidate-info p {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

.candidate-score {
  font-weight: bold;
  color: #667eea;
}

.candidate-item.selected .candidate-score {
  color: #5A67D8; /* softer indigo for contrast on light bg */
}

.score-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-bar {
  display: flex;
  align-items: center;
  gap: 16px;
}

.candidate-name {
  min-width: 100px;
  font-weight: 500;
}

.bar-container {
  flex: 1;
  position: relative;
  height: 30px;
  background: #f7fafc;
  border-radius: 15px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 15px;
  transition: width 0.8s ease;
}

.rank-1 {
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
}

.rank-2 {
  background: linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%);
}

.rank-3 {
  background: linear-gradient(135deg, #cd7f32 0%, #daa520 100%);
}

.score-value {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  color: #2d3748;
}

.radar-comparison-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: start;
}

.radar-chart-container {
  width: 100%;
  height: 400px;
}

.comparison-analysis {
  padding: 0 16px;
}

.analysis-header {
  margin-bottom: 24px;
  text-align: center;
}

.analysis-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

.analysis-subtitle {
  margin: 0;
  color: #718096;
  font-size: 14px;
}

.analysis-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.analysis-section {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.section-icon {
  color: #667eea;
  font-size: 16px;
}

.section-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.ranking-analysis {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.rank-item.rank-1 {
  border-color: #ffd700;
  background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
}

.rank-item.rank-2 {
  border-color: #c0c0c0;
  background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f4 100%);
}

.rank-item.rank-3 {
  border-color: #cd7f32;
  background: linear-gradient(135deg, #fdf6e3 0%, #fef7e0 100%);
}

.rank-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  color: white;
}

.rank-item.rank-1 .rank-number {
  background: #ffd700;
  color: #8b4513;
}

.rank-item.rank-2 .rank-number {
  background: #c0c0c0;
  color: #2d3748;
}

.rank-item.rank-3 .rank-number {
  background: #cd7f32;
  color: white;
}

.rank-info {
  flex: 1;
}

.rank-name {
  font-weight: 500;
  font-size: 13px;
  color: #2d3748;
}

.rank-score {
  font-size: 12px;
  color: #718096;
}

.rank-trend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-text {
  font-size: 11px;
  color: #4a5568;
}

.dimension-analysis {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.dimension-name {
  font-weight: 500;
  font-size: 13px;
  color: #2d3748;
}

.dimension-leader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.leader-name {
  font-size: 12px;
  font-weight: 500;
  color: #667eea;
}

.leader-score {
  font-size: 11px;
  color: #718096;
}

.dimension-gap {
  font-size: 11px;
  color: #4a5568;
}

.key-findings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.finding-item {
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.finding-item.strength {
  border-left: 3px solid #10b981;
}

.finding-item.weakness {
  border-left: 3px solid #f59e0b;
}

.finding-item.info {
  border-left: 3px solid #3b82f6;
}

.finding-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
}

.finding-item.strength .finding-icon {
  background: #d1fae5;
  color: #10b981;
}

.finding-item.weakness .finding-icon {
  background: #fef3c7;
  color: #f59e0b;
}

.finding-item.info .finding-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.finding-content {
  flex: 1;
}

.finding-title {
  font-weight: 500;
  font-size: 13px;
  color: #2d3748;
  margin-bottom: 2px;
}

.finding-desc {
  font-size: 11px;
  color: #4a5568;
  line-height: 1.4;
}

.decision-suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.suggestion-label {
  font-weight: 500;
  font-size: 12px;
  color: #667eea;
  margin-bottom: 4px;
}

.suggestion-content {
  font-size: 11px;
  color: #4a5568;
  line-height: 1.4;
}

.score-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.score {
  font-weight: bold;
  color: #2d3748;
}

.score-bar-mini {
  width: 60px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
}

.mini-bar {
  height: 100%;
  background: #667eea;
  border-radius: 2px;
}

.decision-results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

.winner-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.winner-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.winner-rank {
  font-size: 48px;
}

.winner-info h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
}

.winner-info p {
  margin: 0 0 8px 0;
  opacity: 0.9;
}

.winner-score {
  font-size: 20px;
  font-weight: bold;
}

.winner-reasons h4 {
  margin: 0 0 12px 0;
  color: #2d3748;
}

.winner-reasons ul {
  margin: 0;
  padding-left: 16px;
}

.winner-reasons li {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.6;
}

.ranking-list h4 {
  margin: 0 0 16px 0;
  color: #2d3748;
}

.ranking-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ranking-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.ranking-item.top-three {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.rank-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #667eea;
  color: white;
}

.candidate-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.name {
  font-weight: 500;
  color: #2d3748;
}

.score {
  color: #718096;
}

.rank-badge {
  color: #667eea;
}

.suggestions-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.suggestion-item h4 {
  margin: 0 0 8px 0;
  color: #2d3748;
}

.suggestion-item p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.ml-2 {
  margin-left: 8px;
}

/* 分析弹窗样式 */
.analysis-modal :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.analysis-modal :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  margin: 0;
}

.analysis-modal :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.analysis-modal :deep(.el-dialog__body) {
  padding: 0;
}

.analysis-content {
  padding: 32px 24px;
  text-align: center;
}

.analysis-icon {
  margin-bottom: 20px;
}

.rotating-icon {
  font-size: 48px;
  color: #667eea;
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

.analysis-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

.analysis-description {
  margin: 0 0 32px 0;
  color: #718096;
  font-size: 14px;
}

.progress-section {
  margin-bottom: 24px;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.step-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transform: scale(1.02);
}

.step-item.completed {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-item:not(.active):not(.completed) .step-icon {
  background: #e2e8f0;
  color: #718096;
}

.step-item.active .step-icon {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.step-item.completed .step-icon {
  background: #0ea5e9;
  color: white;
}

.step-content {
  flex: 1;
  text-align: left;
}

.step-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 12px;
  opacity: 0.8;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.5s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  font-size: 16px;
  font-weight: 600;
  color: #667eea;
}

.analysis-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  color: #4a5568;
  font-size: 14px;
}

.analysis-tips .el-icon {
  color: #f6ad55;
  font-size: 16px;
}
</style>
