<template>
  <div class="smart-recommendation">
    <!-- 页面头部 -->
    <div class="section-header">
      <h3>智能推荐</h3>
      <p>基于AI算法的职称评选和人才推荐系统</p>
    </div>
    <!-- 评选配置 -->
    <el-card class="selection-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Setting /></el-icon>
            <span>评选配置</span>
          </div>
        </template>
        
        <div class="config-content">
          <!-- 评选类型配置 -->
          <div class="config-section">
            <h3 class="section-title">评选类型配置</h3>
            <el-form :model="selectionConfig" label-width="100px">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-form-item label="评选类型">
                    <el-select v-model="selectionConfig.type" placeholder="选择评选类型" @change="onSelectionTypeChange">
                      <el-option label="职称评选" value="title_evaluation" />
                      <el-option label="人才评选" value="talent_evaluation" />
                      <el-option label="优秀教师" value="excellent_teacher" />
                      <el-option label="学科带头人" value="subject_leader" />
                      <el-option label="教学名师" value="teaching_master" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="推荐数量">
                    <el-input-number v-model="selectionConfig.count" :min="1" :max="20" />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="评选级别">
                    <el-select v-model="selectionConfig.level" placeholder="选择评选级别">
                      <el-option label="校级" value="school" />
                      <el-option label="市级" value="city" />
                      <el-option label="省级" value="province" />
                      <el-option label="国家级" value="national" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="学科领域">
                    <el-select v-model="selectionConfig.subject" placeholder="选择学科领域" multiple>
                      <el-option label="计算机科学" value="computer" />
                      <el-option label="数学" value="mathematics" />
                      <el-option label="物理" value="physics" />
                      <el-option label="化学" value="chemistry" />
                      <el-option label="生物" value="biology" />
                      <el-option label="文学" value="literature" />
                      <el-option label="历史" value="history" />
                      <el-option label="哲学" value="philosophy" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          
          <!-- 评选标准配置 -->
          <div class="config-section">
            <h3 class="section-title">评选标准配置</h3>
            <el-row :gutter="12">
              <el-col :span="4">
                <div class="criteria-item">
                  <h4>教学能力 ({{ criteriaWeights.teaching }}%)</h4>
                  <el-slider v-model="criteriaWeights.teaching" :min="0" :max="100" />
                  <div class="criteria-details">
                    <el-checkbox v-model="criteriaDetails.teaching.courseQuality">课程质量</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.teaching.studentEvaluation">学生评价</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.teaching.teachingAward">教学获奖</el-checkbox>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="criteria-item">
                  <h4>科研能力 ({{ criteriaWeights.research }}%)</h4>
                  <el-slider v-model="criteriaWeights.research" :min="0" :max="100" />
                  <div class="criteria-details">
                    <el-checkbox v-model="criteriaDetails.research.paperCount">论文数量</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.research.projectCount">项目数量</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.research.patentCount">专利数量</el-checkbox>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="criteria-item">
                  <h4>管理能力 ({{ criteriaWeights.management }}%)</h4>
                  <el-slider v-model="criteriaWeights.management" :min="0" :max="100" />
                  <div class="criteria-details">
                    <el-checkbox v-model="criteriaDetails.management.leadership">领导力</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.management.teamBuilding">团队建设</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.management.decisionMaking">决策能力</el-checkbox>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="criteria-item">
                  <h4>创新能力 ({{ criteriaWeights.innovation }}%)</h4>
                  <el-slider v-model="criteriaWeights.innovation" :min="0" :max="100" />
                  <div class="criteria-details">
                    <el-checkbox v-model="criteriaDetails.innovation.innovationAward">创新奖项</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.innovation.techTransfer">技术转化</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.innovation.startup">创业项目</el-checkbox>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="criteria-item">
                  <h4>社会影响 ({{ criteriaWeights.socialImpact }}%)</h4>
                  <el-slider v-model="criteriaWeights.socialImpact" :min="0" :max="100" />
                  <div class="criteria-details">
                    <el-checkbox v-model="criteriaDetails.socialImpact.mediaCoverage">媒体报道</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.socialImpact.publicService">公共服务</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.socialImpact.industryInfluence">行业影响</el-checkbox>
                  </div>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="criteria-item">
                  <h4>综合表现 ({{ criteriaWeights.overall }}%)</h4>
                  <el-slider v-model="criteriaWeights.overall" :min="0" :max="100" />
                  <div class="criteria-details">
                    <el-checkbox v-model="criteriaDetails.overall.workEthic">工作态度</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.overall.colleagueRelation">同事关系</el-checkbox>
                    <el-checkbox v-model="criteriaDetails.overall.professionalDevelopment">专业发展</el-checkbox>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          
          <!-- 操作按钮 -->
          <div class="config-actions">
            <el-button type="primary" size="large" @click="generateRecommendations" :disabled="!canGenerate">
              <el-icon><Magic /></el-icon>
              智能推荐
            </el-button>
            <el-button size="large" @click="resetConfig">
              <el-icon><RefreshLeft /></el-icon>
              重置
            </el-button>
          </div>
        </div>
      </el-card>
      
      <!-- 智能处理对话框 -->
      <el-dialog
        v-model="processingDialogVisible"
        title="智能推荐处理中"
        width="500px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        center
        class="recommendation-modal"
      >
        <div class="processing-content">
          <div class="processing-icon">
            <el-icon class="rotating-icon"><Loading /></el-icon>
          </div>
          <h3>AI正在处理推荐请求...</h3>
          <p class="processing-description">正在使用智能算法进行多维度分析与推荐</p>
          
          <div class="progress-section">
            <div class="progress-steps">
              <div 
                v-for="(step, index) in processingSteps" 
                :key="index"
                class="step-item"
                :class="{ 
                  'active': currentProcessingStep === index, 
                  'completed': currentProcessingStep > index 
                }"
              >
                <div class="step-icon">
                  <el-icon v-if="currentProcessingStep > index"><Check /></el-icon>
                  <el-icon v-else-if="currentProcessingStep === index"><Loading /></el-icon>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div class="step-content">
                  <div class="step-title">{{ step.title }}</div>
                  <div class="step-desc">{{ step.description }}</div>
                </div>
              </div>
            </div>
            
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${processingProgress}%` }"></div>
            </div>
            <div class="progress-text">{{ processingProgress }}%</div>
          </div>
          
          <div class="processing-tips">
            <el-icon><Lightbulb /></el-icon>
            <span>{{ currentTip }}</span>
          </div>
        </div>
      </el-dialog>

      <!-- AI智能分析对话框 -->
      <el-dialog
        v-model="analysisDialogVisible"
        :title="`AI智能分析报告 - ${currentCandidate?.name || ''}`"
        width="700px"
        :close-on-click-modal="false"
        center
        class="analysis-modal"
      >
        <!-- 分析进行中 -->
        <div v-if="analysisInProgress" class="processing-content">
          <div class="processing-icon">
            <el-icon class="rotating-icon"><Loading /></el-icon>
          </div>
          <h3>AI正在深度分析候选人...</h3>
          <p class="processing-description">正在使用智能算法进行多维度分析与评估</p>
          
          <div class="progress-section">
            <div class="progress-steps">
              <div 
                v-for="(step, index) in analysisSteps" 
                :key="index"
                class="step-item"
                :class="{ 
                  'active': currentAnalysisStep === index, 
                  'completed': currentAnalysisStep > index 
                }"
              >
                <div class="step-icon">
                  <el-icon v-if="currentAnalysisStep > index"><Check /></el-icon>
                  <el-icon v-else-if="currentAnalysisStep === index"><Loading /></el-icon>
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
        </div>

        <!-- 分析报告 -->
        <div v-else class="analysis-report">
          <div class="report-header">
            <div class="candidate-summary">
              <el-avatar :size="60" :src="getAvatarUrl(currentCandidate?.name || '')">
                {{ currentCandidate?.name?.charAt(0) }}
              </el-avatar>
              <div class="summary-info">
                <h3>{{ currentCandidate?.name }}</h3>
                <p>{{ currentCandidate?.department }} · {{ currentCandidate?.title }}</p>
              </div>
            </div>
            <div class="overall-score">
              <div class="score-label">综合评分</div>
              <div class="score-value">{{ currentCandidate?.totalScore }}</div>
              <div class="score-rank">{{ getScoreLevel(currentCandidate?.totalScore || 0) }}</div>
            </div>
          </div>

          <div class="report-sections">
            <!-- 分项评分 -->
            <div class="section">
              <h4 class="section-title">
                <el-icon><PieChart /></el-icon>
                分项评分详情
              </h4>
              <div class="score-breakdown">
                <div class="breakdown-item" v-for="(score, key) in currentCandidate?.scores" :key="key">
                  <div class="breakdown-header">
                    <span class="breakdown-label">{{ getScoreLabel(key) }}</span>
                    <span class="breakdown-value">{{ score}}分</span>
                  </div>
                  <el-progress 
                    :percentage="score" 
                    :color="getScoreColor(score)"
                    :stroke-width="8"
                    :show-text="false"
                  />
                  <div class="breakdown-detail">{{ getScoreAnalysis(key, score) }}</div>
                </div>
              </div>
            </div>

            <!-- AI推荐理由 -->
            <div class="section">
              <h4 class="section-title">
                <el-icon><ChatLineRound /></el-icon>
                AI推荐理由
              </h4>
              <div class="recommendation-reasons">
                <div 
                  v-for="(reason, index) in analysisReport?.recommendationReasons" 
                  :key="index"
                  class="reason-item"
                >
                  <div class="reason-number">{{ index + 1 }}</div>
                  <div class="reason-content">
                    <div class="reason-title">{{ reason.title }}</div>
                    <div class="reason-text">{{ reason.description }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 优势分析 -->
            <div class="section">
              <h4 class="section-title">
                <el-icon><TrendCharts /></el-icon>
                优势分析
              </h4>
              <div class="advantages-list">
                <div 
                  v-for="(advantage, index) in analysisReport?.advantages" 
                  :key="index"
                  class="advantage-item"
                >
                  <el-icon class="advantage-icon"><CircleCheck /></el-icon>
                  <span>{{ advantage }}</span>
                </div>
              </div>
            </div>

            <!-- 提升建议 -->
            <div class="section">
              <h4 class="section-title">
                <el-icon><Lightbulb /></el-icon>
                提升建议
              </h4>
              <div class="suggestions-list">
                <div 
                  v-for="(suggestion, index) in analysisReport?.suggestions" 
                  :key="index"
                  class="suggestion-item"
                >
                  <el-icon class="suggestion-icon"><TrendCharts /></el-icon>
                  <span>{{ suggestion }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="report-footer">
            <el-button type="primary" @click="closeAnalysis">关闭</el-button>
            <el-button type="success" @click="selectCandidateFromAnalysis">确认推荐</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 推荐结果 -->
      <el-card class="results-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Star /></el-icon>
            <span>智能推荐结果</span>
            <el-tag type="success" style="margin-left: 10px;">{{ recommendations.length }} 位候选人</el-tag>
          </div>
        </template>
        
        <div v-if="recommendations.length === 0" class="empty-state">
          <el-empty description="暂无推荐结果，请先选择评选类型并生成推荐" />
        </div>
        
        <div v-else class="recommendations-list">
          <div v-for="(candidate, index) in recommendations" :key="index" class="candidate-item">
            <div class="candidate-rank">
              <el-tag :type="getRankType(index + 1)" size="large">{{ index + 1 }}</el-tag>
            </div>
            
            <div class="candidate-avatar">
              <el-avatar :size="80" :src="getAvatarUrl(candidate.name)">
                {{ candidate.name.charAt(0) }}
              </el-avatar>
            </div>
            
            <div class="candidate-info">
              <div class="candidate-header">
                <h3>{{ candidate.name }}</h3>
                <div class="candidate-tags">
                  <el-tag type="primary" size="small">{{ candidate.department }}</el-tag>
                  <el-tag type="success" size="small">{{ candidate.title }}</el-tag>
                  <el-tag type="warning" size="small">{{ candidate.experience }}年经验</el-tag>
                </div>
              </div>
              
              <div class="candidate-scores">
                <div class="score-grid">
                  <div class="score-item">
                    <div class="score-label">教学</div>
                    <div class="score-value">{{ candidate.scores.teaching }}</div>
                  </div>
                  <div class="score-item">
                    <div class="score-label">科研</div>
                    <div class="score-value">{{ candidate.scores.research }}</div>
                  </div>
                  <div class="score-item">
                    <div class="score-label">管理</div>
                    <div class="score-value">{{ candidate.scores.management }}</div>
                  </div>
                  <div class="score-item">
                    <div class="score-label">创新</div>
                    <div class="score-value">{{ candidate.scores.innovation }}</div>
                  </div>
                  <div class="score-item">
                    <div class="score-label">影响</div>
                    <div class="score-value">{{ candidate.scores.socialImpact }}</div>
                  </div>
                  <div class="score-item total-score">
                    <div class="score-label">总分</div>
                    <div class="score-value">{{ candidate.totalScore }}</div>
                  </div>
                </div>
              </div>
              
              <div class="candidate-highlights">
                <h4>突出表现</h4>
                <ul>
                  <li v-for="highlight in candidate.highlights" :key="highlight">{{ highlight }}</li>
                </ul>
              </div>
            </div>
            
            <div class="candidate-actions">
              <el-button type="primary" size="small" @click="viewCandidateDetail(candidate)">查看</el-button>
              <el-button size="small" @click="compareCandidate(candidate)">分析</el-button>
              <el-button type="success" size="small" @click="selectCandidate(candidate)">推荐</el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 推荐统计 -->
      <el-card class="stats-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><DataAnalysis /></el-icon>
            <span>推荐统计</span>
          </div>
        </template>
        
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalCandidates }}</div>
              <div class="stat-label">候选人数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.avgScore }}</div>
              <div class="stat-label">平均分数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.highScoreCount }}</div>
              <div class="stat-label">高分人数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.recommendationRate }}%</div>
              <div class="stat-label">推荐成功率</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- 智能推荐历史 -->
      <el-card class="history-card" shadow="never">
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>智能推荐历史</span>
            <el-tag type="info" style="margin-left: 10px;">{{ recommendationHistory.length }} 条记录</el-tag>
          </div>
        </template>

        <div v-if="recommendationHistory.length === 0" class="empty-state">
          <el-empty description="暂无历史记录" />
        </div>

        <div v-else class="history-list">
          <div v-for="(item, idx) in recommendationHistory" :key="item.id || idx" class="history-item">
            <div class="history-header">
              <span class="history-time">{{ new Date(item.timestamp).toLocaleString() }}</span>
              <el-tag size="small">{{ getTypeLabel(item.config.type) }}</el-tag>
              <el-tag size="small">{{ getLevelLabel(item.config.level) }}</el-tag>
              <el-tag size="small">{{ item.recommendations.length }}人</el-tag>
            </div>
            <div class="history-recommendations">
              <div class="history-avatars">
                <el-avatar
                  v-for="(cand, i) in item.recommendations"
                  :key="i"
                  :size="32"
                  :src="getAvatarUrl(cand.name)"
                  style="margin-right: 6px;"
                >{{ cand.name?.charAt(0) }}</el-avatar>
              </div>
              <div class="history-topline" v-if="item.recommendations[0]">
                <span class="topline-name">{{ item.recommendations[0].name }}</span>
                <span class="topline-score">{{ item.recommendations[0].totalScore }}分</span>
              </div>
            </div>
            <div class="history-actions">
              <el-button size="small" @click="recommendations = item.recommendations; updateStats(); $message.success('已载入该次推荐结果')">载入结果</el-button>
            </div>
          </div>
        </div>
      </el-card>
  </div>
</template>

<script>
import { addRecommendedCandidate, setRecommendedCandidates } from '@/store/recommendationStore.js'
export default {
  name: 'SmartRecommendation',
  data() {
    return {
      loading: false,
      selectionConfig: {
        type: 'title_evaluation',
        count: 5,
        level: 'school',
        subject: []
      },
      criteriaWeights: {
        teaching: 30,
        research: 25,
        management: 20,
        innovation: 15,
        socialImpact: 5,
        overall: 5
      },
      originalWeights: {
        teaching: 30,
        research: 25,
        management: 20,
        innovation: 15,
        socialImpact: 5,
        overall: 5
      },
      processingDialogVisible: false,
      processingStep: 0,
      processingComplete: false,
      currentProcessingStep: 0,
      processingProgress: 0,
      currentTip: '正在初始化推荐环境...',
      processingSteps: [
        { title: '数据收集', description: '正在从各个系统收集候选教师数据' },
        { title: '数据预处理', description: '清洗和标准化候选人数据' },
        { title: '多维特征提取', description: '提取教学、科研、管理等多维特征' },
        { title: '智能评分计算', description: '根据评选标准进行智能评分' },
        { title: '算法推荐生成', description: '应用AI算法计算最佳推荐方案' },
        { title: '结果优化排序', description: '优化和排序推荐结果' }
      ],
      tips: [
        '正在初始化推荐环境...',
        '正在从各个系统收集候选教师数据...',
        '正在清洗和标准化候选人数据...',
        '正在提取多维特征...',
        '正在根据评选标准进行智能评分...',
        '正在应用AI算法生成推荐...',
        '正在优化和排序推荐结果...',
        '推荐即将完成...'
      ],
      criteriaDetails: {
        teaching: {
          courseQuality: true,
          studentEvaluation: true,
          teachingAward: true
        },
        research: {
          paperCount: true,
          projectCount: true,
          patentCount: true
        },
        management: {
          leadership: true,
          teamBuilding: true,
          decisionMaking: true
        },
        innovation: {
          innovationAward: true,
          techTransfer: true,
          startup: true
        },
        socialImpact: {
          mediaCoverage: true,
          publicService: true,
          industryInfluence: true
        },
        overall: {
          workEthic: true,
          colleagueRelation: true,
          professionalDevelopment: true
        }
      },
      recommendations: [],
      stats: {
        totalCandidates: 0,
        avgScore: 0,
        highScoreCount: 0,
        recommendationRate: 0
      },
      // 智能推荐历史（前端本地持久化）
      recommendationHistory: [],
      analysisDialogVisible: false,
      analysisInProgress: false,
      currentAnalysisStep: 0,
      analysisProgress: 0,
      currentCandidate: null,
      analysisReport: null,
      analysisSteps: [
        { title: '基础信息分析', description: '分析候选人基本信息和履历' },
        { title: '教学能力评估', description: '深入分析教学成果和课程质量' },
        { title: '科研实力评估', description: '评估学术研究和创新成果' },
        { title: '管理能力分析', description: '分析领导力和团队管理能力' },
        { title: '综合能力评价', description: '整合多维度进行综合评价' },
        { title: '生成推荐报告', description: '生成AI推荐理由和评估报告' }
      ]
    }
  },
  created() {
    this.loadRecommendationHistory()
  },
  computed: {
    canGenerate() {
      // 检查评选类型是否已选择
      return !!this.selectionConfig.type
    }
  },
  methods: {
    onSelectionTypeChange() {
      // 根据评选类型调整默认权重
      const typeWeights = {
        title_evaluation: { teaching: 40, research: 30, management: 15, innovation: 10, socialImpact: 3, overall: 2 },
        talent_evaluation: { teaching: 25, research: 35, management: 20, innovation: 15, socialImpact: 3, overall: 2 },
        excellent_teacher: { teaching: 50, research: 20, management: 15, innovation: 10, socialImpact: 3, overall: 2 },
        subject_leader: { teaching: 30, research: 40, management: 20, innovation: 8, socialImpact: 1, overall: 1 },
        teaching_master: { teaching: 60, research: 15, management: 15, innovation: 8, socialImpact: 1, overall: 1 }
      }
      
      if (typeWeights[this.selectionConfig.type]) {
        this.criteriaWeights = { ...typeWeights[this.selectionConfig.type] }
        this.originalWeights = { ...typeWeights[this.selectionConfig.type] }
      }
    },
    
    async generateRecommendations() {
      if (!this.canGenerate) {
        this.$message.warning('请先选择评选类型')
        return
      }
      
      // 打开处理对话框
      this.processingDialogVisible = true
      this.currentProcessingStep = 0
      this.processingProgress = 0
      this.processingComplete = false
      this.currentTip = this.tips[0]
      
      // 更新提示信息
      const tipTimer = setInterval(() => {
        const tipIndex = Math.floor(Math.random() * this.tips.length)
        this.currentTip = this.tips[tipIndex]
      }, 300)
      
      // 模拟智能处理过程
      const totalSteps = this.processingSteps.length
      const stepDuration = 1500
      
      for (let i = 0; i < totalSteps; i++) {
        this.currentProcessingStep = i
        this.processingProgress = Math.round(((i + 1) / totalSteps) * 100)
        
        await new Promise(resolve => setTimeout(resolve, stepDuration))
      }
      
      clearInterval(tipTimer)
      
      // 延迟关闭弹窗并显示结果
      setTimeout(() => {
        // 生成推荐结果
        this.recommendations = this.generateMockCandidates()
        this.updateStats()
        // 保存本次推荐到历史
        this.saveRecommendationHistory()
        
        // 关闭弹窗
        this.processingDialogVisible = false
        this.$message.success('推荐完成！')
      }, 500)
    },
    
    // 保存推荐历史（前端模拟：写入 localStorage）
    saveRecommendationHistory() {
      try {
        const historyItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          config: { ...this.selectionConfig },
          weights: { ...this.criteriaWeights },
          recommendations: JSON.parse(JSON.stringify(this.recommendations))
        }
        this.recommendationHistory.unshift(historyItem)
        // 仅前端本地持久化
        localStorage.setItem('smart_recommendation_history', JSON.stringify(this.recommendationHistory))
      } catch (e) {
        // ignore
      }
    },
    
    // 加载历史记录（组件创建时）
    loadRecommendationHistory() {
      try {
        const raw = localStorage.getItem('smart_recommendation_history')
        this.recommendationHistory = raw ? JSON.parse(raw) : []
      } catch (e) {
        this.recommendationHistory = []
      }
    },
    
    generateMockCandidates() {
      const candidates = [
        {
          name: '张教授',
          department: '计算机学院',
          title: '教授',
          experience: 15,
          scores: { teaching: 95, research: 88, management: 82, innovation: 90, socialImpact: 75 },
          highlights: ['发表SCI论文20篇', '获得国家教学成果奖', '主持国家级项目3项', '指导学生获得国际竞赛金奖']
        },
        {
          name: '李副教授',
          department: '数学学院',
          title: '副教授',
          experience: 12,
          scores: { teaching: 92, research: 85, management: 78, innovation: 88, socialImpact: 70 },
          highlights: ['发表核心期刊论文15篇', '获得省级教学名师', '主持省部级项目2项', '出版教材2部']
        },
        {
          name: '王老师',
          department: '物理学院',
          title: '讲师',
          experience: 8,
          scores: { teaching: 88, research: 82, management: 75, innovation: 85, socialImpact: 65 },
          highlights: ['发表SCI论文8篇', '获得校级优秀教师', '主持校级项目1项', '指导学生获得省级竞赛一等奖']
        },
        {
          name: '陈教授',
          department: '化学学院',
          title: '教授',
          experience: 18,
          scores: { teaching: 90, research: 92, management: 85, innovation: 87, socialImpact: 80 },
          highlights: ['发表SCI论文25篇', '获得国家自然科学基金', '主持国家级项目4项', '获得发明专利5项']
        },
        {
          name: '刘副教授',
          department: '生物学院',
          title: '副教授',
          experience: 10,
          scores: { teaching: 85, research: 90, management: 80, innovation: 92, socialImpact: 75 },
          highlights: ['发表SCI论文12篇', '获得省级科技进步奖', '主持省部级项目2项', '技术转化项目1项']
        }
      ]
      
      // 根据推荐数量返回候选人
      return candidates.slice(0, this.selectionConfig.count).map((candidate, index) => {
        const totalScore = Math.round(
          candidate.scores.teaching * this.criteriaWeights.teaching / 100 +
          candidate.scores.research * this.criteriaWeights.research / 100 +
          candidate.scores.management * this.criteriaWeights.management / 100 +
          candidate.scores.innovation * this.criteriaWeights.innovation / 100 +
          candidate.scores.socialImpact * this.criteriaWeights.socialImpact / 100 +
          candidate.scores.teaching * this.criteriaWeights.overall / 100
        )
        
        return {
          ...candidate,
          totalScore,
          id: index + 1
        }
      }).sort((a, b) => b.totalScore - a.totalScore)
    },
    
    updateStats() {
      if (this.recommendations.length === 0) {
        this.stats = { totalCandidates: 0, avgScore: 0, highScoreCount: 0, recommendationRate: 0 }
        return
      }
      
      const totalScore = this.recommendations.reduce((sum, candidate) => sum + candidate.totalScore, 0)
      const avgScore = Math.round(totalScore / this.recommendations.length)
      const highScoreCount = this.recommendations.filter(candidate => candidate.totalScore >= 85).length
      const recommendationRate = Math.round((highScoreCount / this.recommendations.length) * 100)
      
      this.stats = {
        totalCandidates: this.recommendations.length,
        avgScore,
        highScoreCount,
        recommendationRate
      }
    },
    
    getRankType(rank) {
      if (rank === 1) return 'danger'
      if (rank === 2) return 'warning'
      if (rank === 3) return 'success'
      return 'info'
    },
    
    viewCandidateDetail(candidate) {
      this.$message.info(`查看 ${candidate.name} 的详细信息`)
      // 这里可以打开详情弹窗或跳转到详情页面
    },
    
    async compareCandidate(candidate) {
      this.currentCandidate = candidate
      this.analysisDialogVisible = true
      this.analysisInProgress = true
      this.currentAnalysisStep = 0
      this.analysisProgress = 0
      
      // 模拟AI分析过程
      const totalSteps = this.analysisSteps.length
      const stepDuration = 1200
      
      for (let i = 0; i < totalSteps; i++) {
        this.currentAnalysisStep = i
        this.analysisProgress = Math.round(((i + 1) / totalSteps) * 100)
        await new Promise(resolve => setTimeout(resolve, stepDuration))
      }
      
      // 生成分析报告
      this.analysisReport = this.generateAnalysisReport(candidate)
      this.analysisInProgress = false
    },

    generateAnalysisReport(candidate) {
      // 根据候选人信息生成个性化的分析报告
      const recommendationReasons = this.generateRecommendationReasons(candidate)
      const advantages = this.generateAdvantages(candidate)
      const suggestions = this.generateSuggestions(candidate)
      
      return {
        recommendationReasons,
        advantages,
        suggestions
      }
    },

    generateRecommendationReasons(candidate) {
      const reasons = []
      
      // 根据分数生成推荐理由
      if (candidate.scores.teaching >= 90) {
        reasons.push({
          title: '卓越的教学能力',
          description: `在15年教学工作中，始终致力于提升教学质量，课程质量评分达到${candidate.scores.teaching}分。${candidate.highlights.find(h => h.includes('教学成果奖') || h.includes('优秀教师')) ? '曾获得国家级教学成果奖，是教学领域的佼佼者。' : '在教学方法和课程改革方面表现突出，深受学生好评。'}`
        })
      }
      
      if (candidate.scores.research >= 85) {
        reasons.push({
          title: '突出的科研实力',
          description: `科研能力评分${candidate.scores.research}分，${candidate.highlights.find(h => h.includes('论文')) || '在学术研究方面贡献突出。'}学术成果丰富，具有较强的科研潜力。`
        })
      }
      
      if (candidate.scores.management >= 80) {
        reasons.push({
          title: '优秀的管理能力',
          description: `管理能力评分${candidate.scores.management}分，在${candidate.department}担任重要管理角色，具有较强的团队领导和协调能力。`
        })
      }
      
      if (candidate.scores.innovation >= 85) {
        reasons.push({
          title: '显著的创新能力',
          description: `创新能力评分${candidate.scores.innovation}分，${candidate.highlights.find(h => h.includes('专利') || h.includes('技术转化') || h.includes('创业')) || '在技术创新和成果转化方面表现突出'}，具有前瞻性的研究视野。`
        })
      }
      
      // 综合优势
      if (candidate.totalScore >= 85) {
        reasons.push({
          title: '综合素质优秀',
          description: `综合评分${candidate.totalScore}分，在教学、科研、管理等多个方面协调发展，是该评选类型理想的候选人。`
        })
      }
      
      return reasons
    },

    generateAdvantages(candidate) {
      const advantages = []
      
      if (candidate.scores.teaching >= 90) {
        advantages.push('教学经验丰富，教学方法先进')
      }
      if (candidate.scores.research >= 85) {
        advantages.push('科研成果丰硕，学术影响力强')
      }
      if (candidate.experience >= 10) {
        advantages.push(`${candidate.experience}年工作经验，专业基础扎实`)
      }
      if (candidate.scores.innovation >= 85) {
        advantages.push('创新能力突出，有前瞻性思维')
      }
      if (candidate.highlights.some(h => h.includes('奖'))) {
        advantages.push('多次获得重要奖项和荣誉')
      }
      if (candidate.scores.management >= 80) {
        advantages.push('具备良好的领导和管理能力')
      }
      
      return advantages.length > 0 ? advantages : ['各方面表现均衡，综合素质良好']
    },

    generateSuggestions(candidate) {
      const suggestions = []
      
      if (candidate.scores.teaching < 85) {
        suggestions.push('建议加强教学方法和课程创新，提升教学质量评价')
      }
      if (candidate.scores.research < 85) {
        suggestions.push('建议增加科研投入，发表更多高质量的学术论文')
      }
      if (candidate.scores.innovation < 80) {
        suggestions.push('建议提升创新能力，关注学科前沿和技术转化')
      }
      if (candidate.scores.socialImpact < 70) {
        suggestions.push('建议增强社会影响力，参与更多公共服务活动')
      }
      if (candidate.experience < 10) {
        suggestions.push('建议积累更多工作经验，提升专业能力')
      }
      
      return suggestions.length > 0 ? suggestions : ['继续保持当前优势，在薄弱环节寻求突破']
    },

    getScoreLabel(key) {
      const labels = {
        teaching: '教学能力',
        research: '科研能力',
        management: '管理能力',
        innovation: '创新能力',
        socialImpact: '社会影响'
      }
      return labels[key] || key
    },

    getScoreColor(score) {
      if (score >= 90) return '#67c23a'
      if (score >= 80) return '#409eff'
      if (score >= 70) return '#e6a23c'
      return '#f56c6c'
    },

    getScoreAnalysis(key, score) {
      if (score >= 90) return '优秀'
      if (score >= 80) return '良好'
      if (score >= 70) return '中等'
      return '待提升'
    },

    getScoreLevel(score) {
      if (score >= 90) return '优秀'
      if (score >= 85) return '良好'
      if (score >= 80) return '中等'
      return '一般'
    },

    // 历史标签映射
    getTypeLabel(key) {
      const map = {
        title_evaluation: '职称评选',
        talent_evaluation: '人才评选',
        excellent_teacher: '优秀教师',
        subject_leader: '学科带头人',
        teaching_master: '教学名师'
      }
      return map[key] || key
    },
    getLevelLabel(level) {
      const map = {
        school: '校级',
        city: '市级',
        province: '省级',
        national: '国家级'
      }
      return map[level] || level
    },

    closeAnalysis() {
      this.analysisDialogVisible = false
      this.analysisReport = null
      this.currentCandidate = null
    },

    selectCandidateFromAnalysis() {
      if (this.currentCandidate) {
        this.selectCandidate(this.currentCandidate)
        this.closeAnalysis()
      }
    },
    
    selectCandidate(candidate) {
      this.$confirm(`确定推荐 ${candidate.name} 吗？`, '确认推荐', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$message.success(`已推荐 ${candidate.name}`)
        // 写入全局共享（单个追加）
        try {
          addRecommendedCandidate({
            id: candidate.id,
            name: candidate.name,
            department: candidate.department,
            title: candidate.title,
            score: candidate.totalScore ?? candidate.score ?? 0,
            avatar: this.getAvatarUrl(candidate.name)
          })
        } catch (e) {
          // ignore
        }
      })
    },
    
    resetConfig() {
      this.selectionConfig = {
        type: 'title_evaluation',
        count: 5,
        level: 'school',
        subject: []
      }
      this.criteriaWeights = {
        teaching: 30,
        research: 25,
        management: 20,
        innovation: 15,
        socialImpact: 5,
        overall: 5
      }
      this.originalWeights = {
        teaching: 30,
        research: 25,
        management: 20,
        innovation: 15,
        socialImpact: 5,
        overall: 5
      }
      this.recommendations = []
      this.stats = { totalCandidates: 0, avgScore: 0, highScoreCount: 0, recommendationRate: 0 }
      this.$message.success('配置已重置')
    },
    
    getAvatarUrl(name) {
      // 从本地 teacher 文件夹中选择头像
      // 基于名字的字符编码确保每个教师都有固定的头像
      const teacherAvatars = [
        '/images/teacher/083.png',
        '/images/teacher/28.png',
        '/images/teacher/66.jpg',
        '/images/teacher/7b.jpeg',
        '/images/teacher/85.jpeg',
        '/images/teacher/c5.png',
        '/images/teacher/cc.png'
      ]
      
      // 将名字转换为数字来选择头像（确保每个教师都有固定的头像）
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) - hash) + name.charCodeAt(i)
        hash = hash & hash // Convert to 32bit integer
      }
      
      const index = Math.abs(hash) % teacherAvatars.length
      return teacherAvatars[index]
    }
  }
}
</script>

<style scoped>
.smart-recommendation {
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

.card-header {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.card-header .el-icon {
  margin-right: 8px;
  color: #409EFF;
}

.selection-card,
.criteria-card,
.results-card,
.stats-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.config-content {
  padding: 20px 0;
}

.config-section {
  margin-bottom: 20px;
}

.config-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: '';
  display: block;
  width: 3px;
  height: 16px;
  background: #409EFF;
  border-radius: 2px;
}

.config-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
  padding-top: 10px;
}

.criteria-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 0;
}

.criteria-item h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 13px;
  font-weight: 600;
}

.criteria-details {
  margin-top: 10px;
}

.criteria-details .el-checkbox {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.recommendations-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.candidate-item {
  position: relative;
  flex: 0 0 calc((100% - 40px) / 3);
  max-width: calc((100% - 40px) / 3);
  min-width: 300px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .candidate-item {
    flex: 0 0 calc((100% - 20px) / 2);
    max-width: calc((100% - 20px) / 2);
    min-width: 320px;
  }
}

@media screen and (max-width: 768px) {
  .candidate-item {
    flex: 0 0 100%;
    max-width: 100%;
    min-width: 0;
  }
}

.candidate-item:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.candidate-rank {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.candidate-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  margin-top: 8px;
}

.candidate-info {
  flex: 1;
}

.candidate-header {
  text-align: center;
  margin-bottom: 12px;
}

.candidate-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.candidate-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.candidate-tags .el-tag {
  margin: 0;
}

.candidate-scores {
  margin-bottom: 12px;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
}

.score-item {
  text-align: center;
  padding: 8px 4px;
  background: #f8f9fa;
  border-radius: 6px;
}

.score-item.total-score {
  background: #e8f4fd;
  border: 1px solid #409EFF;
  grid-column: span 5;
}

.score-label {
  font-size: 11px;
  color: #909399;
  margin-bottom: 4px;
}

.score-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.candidate-highlights {
  margin-bottom: 12px;
}

.candidate-highlights h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 13px;
  font-weight: 600;
}

.candidate-highlights ul {
  margin: 0;
  padding-left: 18px;
}

.candidate-highlights li {
  margin-bottom: 4px;
  color: #606266;
  font-size: 12px;
  line-height: 1.5;
}

.candidate-actions {
  display: flex;
  flex-direction: row-reverse;
  gap: 8px;
}

.stat-item {
  text-align: center;
  padding: 20px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-slider {
  margin: 10px 0;
}

.criteria-item .el-slider {
  margin: 8px 0;
}

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 推荐弹窗样式 */
.recommendation-modal :deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

.recommendation-modal :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  margin: 0;
}

.recommendation-modal :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.recommendation-modal :deep(.el-dialog__body) {
  padding: 0;
}

.processing-content {
  padding: 32px 24px;
  text-align: center;
}

.processing-icon {
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

.processing-content h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #2d3748;
}

.processing-description {
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

.processing-tips {
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

.processing-tips .el-icon {
  color: #f6ad55;
  font-size: 16px;
}

/* AI分析对话框样式 */
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
  max-height: 70vh;
  overflow-y: auto;
}

.analysis-report {
  padding: 24px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.candidate-summary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.summary-info h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.summary-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.overall-score {
  text-align: center;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.score-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
  color: #409EFF;
  margin-bottom: 4px;
}

.score-rank {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

.report-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.section-title .el-icon {
  font-size: 18px;
  color: #409EFF;
}

/* 分项评分 */
.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.breakdown-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.breakdown-value {
  font-size: 14px;
  font-weight: 700;
  color: #409EFF;
}

.breakdown-detail {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* AI推荐理由 */
.recommendation-reasons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reason-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #409EFF;
}

.reason-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: #409EFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.reason-content {
  flex: 1;
}

.reason-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.reason-text {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

/* 优势分析 */
.advantages-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advantage-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f0f9ff;
  border-radius: 6px;
  border-left: 3px solid #67c23a;
}

.advantage-icon {
  color: #67c23a;
  font-size: 16px;
}

.advantage-item span {
  font-size: 14px;
  color: #303133;
}

/* 提升建议 */
.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fef9e7;
  border-radius: 6px;
  border-left: 3px solid #e6a23c;
}

.suggestion-icon {
  color: #e6a23c;
  font-size: 16px;
}

.suggestion-item span {
  font-size: 14px;
  color: #303133;
}

/* 报告底部按钮 */
.report-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 智能推荐历史样式 */
.history-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 12px 16px;
  border: 1px solid #e4e7ed;
}

.history-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  margin-bottom: 8px;
  color: #909399;
}

.history-time {
  color: #409EFF;
  font-weight: 600;
}

.history-recommendations {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-avatars {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.history-topline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.topline-name {
  font-size: 14px;
  color: #303133;
  font-weight: 600;
}

.topline-score {
  font-size: 13px;
  color: #409EFF;
}

.history-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}
</style>