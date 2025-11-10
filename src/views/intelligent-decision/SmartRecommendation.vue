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
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="评选类型">
                    <div class="type-list">
                      <div
                        v-for="type in evaluationTypes"
                        :key="type.value"
                        class="type-card"
                        :class="{ selected: selectionConfig.type === type.value }"
                        @click="selectionConfig.type = type.value; onSelectionTypeChange()"
                      >
                        <div class="type-color" :style="{ background: type.color }"></div>
                        <div class="type-content">
                          <div class="type-title">{{ type.label }}</div>
                          <div class="type-desc">{{ type.description }}</div>
                        </div>
                        <div class="type-check" v-if="selectionConfig.type === type.value">
                          <el-icon><CircleCheck /></el-icon>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="推荐人数">
                    <el-input-number v-model="selectionConfig.count" :min="1" :max="20" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item label="评选级别">
                    <el-select v-model="selectionConfig.level" placeholder="选择评选级别">
                      <el-option label="校级" value="school" />
                      <el-option label="市级" value="city" />
                      <el-option label="省级" value="province" />
                      <el-option label="国家级" value="national" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
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
            <div v-if="!selectionConfig.type" class="empty-criteria-tip">
              <el-empty description="请先选择评选类型" :image-size="100" />
            </div>
            <div v-else-if="currentAssessmentItems.length === 0" class="empty-criteria-tip">
              <el-empty description="该评选类型尚未配置考核内容，请先在决策支持页面配置" :image-size="100" />
            </div>
            <div v-else class="criteria-list">
              <div 
                v-for="(item, index) in currentAssessmentItems" 
                :key="index"
                class="criteria-item"
              >
                <h4>{{ item }} ({{ getCriteriaWeight(item) }}%)</h4>
                <el-slider 
                  :model-value="getCriteriaWeight(item)" 
                  @input="(val) => updateCriteriaWeight(item, val)"
                  :min="0" 
                  :max="100" 
                />
              </div>
            </div>
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
            
            <div class="candidate-total-score">
              <div class="total-score-label">总分</div>
              <div class="total-score-value">{{ candidate.totalScore }}</div>
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
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.totalCandidates }}</div>
              <div class="stat-label">候选人数</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.avgScore }}</div>
              <div class="stat-label">平均分数</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.highScoreCount }}</div>
              <div class="stat-label">高分人数</div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="stat-item">
              <div class="stat-value">{{ stats.recommendationRate }}%</div>
              <div class="stat-label">推荐成功率</div>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <!-- AI智能分析对话框 -->
      <el-dialog
        v-model="aiAnalysisDialogVisible"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        class="ai-analysis-dialog"
        center
      >
        <template #header>
          <div class="analysis-header">
            <div class="header-icon">
              <el-icon class="rotating"><Loading /></el-icon>
            </div>
            <div class="header-content">
              <h3>AI智能分析中</h3>
              <p>正在深度分析候选人数据，请稍候...</p>
            </div>
          </div>
        </template>
        
        <div class="analysis-content">
          <!-- 候选人信息 -->
          <div class="candidate-info" v-if="analyzingCandidate">
            <div class="info-item">
              <span class="label">姓名：</span>
              <span class="value">{{ analyzingCandidate.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">部门：</span>
              <span class="value">{{ analyzingCandidate.department || '未知' }}</span>
            </div>
            <div class="info-item">
              <span class="label">职称：</span>
              <span class="value">{{ analyzingCandidate.title || '未知' }}</span>
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

      <!-- 教师分析报告对话框 -->
      <el-dialog
        v-model="reportDialogVisible"
        width="90%"
        :close-on-click-modal="false"
        class="report-dialog"
        destroy-on-close
        :show-close="false"
      >
        <template #header>
          <div class="dialog-header-content">
            <h3>{{ currentReportData?.teacherName }} 教师分析报告</h3>
            <el-button 
              text 
              @click="reportDialogVisible = false" 
              class="dialog-close-btn"
              circle
            >
              <el-icon><CircleClose /></el-icon>
            </el-button>
          </div>
        </template>
        <TeacherAnalysisReport 
          v-if="currentReportData"
          :teacher-data="currentReportData"
          @close="reportDialogVisible = false"
        />
      </el-dialog>

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
import { useEvaluationTypes } from '@/store/decisionStore.js'
import { CircleClose, CircleCheck, Loading, Cpu, DataAnalysis, Document, User, Trophy, Setting } from '@element-plus/icons-vue'
import TeacherAnalysisReport from './TeacherAnalysisReport.vue'
export default {
  name: 'SmartRecommendation',
  components: {
    TeacherAnalysisReport,
    CircleClose,
    CircleCheck,
    Loading,
    Cpu,
    DataAnalysis,
    Document,
    User,
    Trophy,
    Setting
  },
  data() {
    return {
      loading: false,
      selectionConfig: {
        type: '',
        count: 5,
        level: 'school',
        subject: []
      },
      // 动态权重：基于考核内容的键值对，key为考核内容名称，value为权重百分比
      criteriaWeights: {},
      originalWeights: {},
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
      // 教师分析报告对话框
      reportDialogVisible: false,
      currentReportData: null,
      // AI分析对话框
      aiAnalysisDialogVisible: false,
      aiAnalysisProgress: 0,
      currentAnalysisStep: 0,
      analyzingCandidate: null,
      analysisSteps: [
        { 
          title: '基础信息分析', 
          description: '分析候选人基本信息和履历',
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
    }
  },
  created() {
    this.loadRecommendationHistory()
  },
  watch: {
    // 监听当前选中类型的考核内容变化，自动更新权重
    currentAssessmentItems: {
      handler(newItems, oldItems) {
        // 如果评选类型已选择，且考核内容发生变化，更新权重
        if (this.selectionConfig.type && newItems.length > 0) {
          // 检查是否有新增或删除的考核内容
          const newItemsSet = new Set(newItems)
          const oldItemsSet = new Set(oldItems || [])
          
          // 如果有变化，重新初始化权重
          if (newItems.length !== (oldItems || []).length || 
              !newItems.every(item => oldItemsSet.has(item)) ||
              !(oldItems || []).every(item => newItemsSet.has(item))) {
            this.onSelectionTypeChange()
          }
        }
      },
      immediate: false
    }
  },
  computed: {
    // 从 store 获取评选类型（响应式）
    evaluationTypes() {
      return useEvaluationTypes().value
    },
    // 当前选中评选类型的已选中考核内容
    currentAssessmentItems() {
      if (!this.selectionConfig.type) {
        return []
      }
      const selectedType = this.evaluationTypes.find(type => type.value === this.selectionConfig.type)
      if (!selectedType) {
        return []
      }
      // 返回已选中的考核内容，如果没有配置则返回空数组
      return selectedType.selectedAssessmentItems || []
    },
    canGenerate() {
      // 检查评选类型是否已选择，且至少有一个考核内容
      return !!this.selectionConfig.type && this.currentAssessmentItems.length > 0
    }
  },
  methods: {
    onSelectionTypeChange() {
      // 根据当前选中类型的考核内容初始化权重
      const items = this.currentAssessmentItems
      if (items.length === 0) {
        this.criteriaWeights = {}
        this.originalWeights = {}
        return
      }
      
      // 平均分配权重，确保总和为100
      const avgWeight = Math.floor(100 / items.length)
      const remainder = 100 % items.length
      
      const newWeights = {}
      items.forEach((item, index) => {
        // 将余数分配给前几个项目
        newWeights[item] = avgWeight + (index < remainder ? 1 : 0)
      })
      
      this.criteriaWeights = { ...newWeights }
      this.originalWeights = { ...newWeights }
    },
    // 获取某个考核内容的权重
    getCriteriaWeight(item) {
      return this.criteriaWeights[item] || 0
    },
    // 更新某个考核内容的权重
    updateCriteriaWeight(item, value) {
      // Vue 3 中直接赋值即可，响应式系统会自动处理
      this.criteriaWeights[item] = value
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
      // 考核内容到候选人 scores 字段的映射关系
      const assessmentToScoreMap = {
        '教学工作量': 'teaching',
        '教学工作质量': 'teaching',
        '教学完成度': 'teaching',
        '教学研究与改革': 'teaching',
        '学生评价': 'teaching',
        '学生学情分析数据': 'teaching',
        '督导评价': 'teaching',
        '科研成果': 'research',
        '科研项目数量': 'research',
        '科研项目经费成本': 'research',
        '科研项目成果质量': 'research',
        '科研成果（论文、专著、专利等）': 'research',
        '科研获奖': 'research',
        '证书与认证': 'research',
        '智能胜任力': 'innovation',
        '公共服务参与度': 'socialImpact',
        '产教融合项目': 'socialImpact',
        '技术成果转化': 'innovation',
        '横向课题': 'research',
        '德能勤绩廉综合表现': 'management',
        '服务对象满意度': 'management',
        '管理效率与规范性': 'management',
        '工作失误与事故': 'management'
      }
      
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
        // 根据动态的考核内容和权重计算总分
        let totalScore = 0
        const assessmentItems = Object.keys(this.criteriaWeights)
        
        assessmentItems.forEach(item => {
          const scoreKey = assessmentToScoreMap[item] || 'teaching' // 默认使用 teaching
          const score = candidate.scores[scoreKey] || 70 // 如果字段不存在，使用默认值70
          const weight = this.criteriaWeights[item] || 0
          totalScore += score * weight / 100
        })
        
        return {
          ...candidate,
          totalScore: Math.round(totalScore),
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
    
    // 获取图标组件
    getIconComponent(iconName) {
      const iconMap = {
        User: User,
        Document: Document,
        Trophy: Trophy,
        Setting: Setting,
        DataAnalysis: DataAnalysis,
        Cpu: Cpu
      }
      return iconMap[iconName] || Document
    },
    
    async compareCandidate(candidate) {
      // 保存当前分析的候选人
      this.analyzingCandidate = candidate
      // 重置分析状态
      this.aiAnalysisProgress = 0
      this.currentAnalysisStep = 0
      // 显示AI分析对话框
      this.aiAnalysisDialogVisible = true
      // 开始执行分析动画
      await this.performAIAnalysis(candidate)
    },
    
    // 执行AI分析动画
    async performAIAnalysis(candidate) {
      const totalSteps = this.analysisSteps.length
      
      // 逐步执行分析
      for (let i = 0; i < totalSteps; i++) {
        this.currentAnalysisStep = i
        const step = this.analysisSteps[i]
        const stepDuration = step.duration
        
        // 更新进度条
        const progressPerStep = 100 / totalSteps
        const startProgress = i * progressPerStep
        const endProgress = (i + 1) * progressPerStep
        
        // 动画更新进度
        await this.animateProgress(startProgress, endProgress, stepDuration)
      }
      
      // 确保进度条到达100%
      this.aiAnalysisProgress = 100
      
      // 等待一小段时间让用户看到完成效果
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 分析完成，关闭分析对话框，显示报告
      this.aiAnalysisDialogVisible = false
      // 将 candidate 数据转换为 TeacherAnalysisReport 需要的格式
      const teacherData = this.convertCandidateToTeacherData(candidate)
      this.currentReportData = teacherData
      // 延迟一点显示报告，让过渡更自然
      await new Promise(resolve => setTimeout(resolve, 300))
      this.reportDialogVisible = true
    },
    
    // 动画更新进度条
    animateProgress(start, end, duration) {
      return new Promise(resolve => {
        const startTime = Date.now()
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          this.aiAnalysisProgress = start + (end - start) * progress
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        }
        animate()
      })
    },
    
    // 将候选人数据转换为教师分析报告数据格式
    convertCandidateToTeacherData(candidate) {
      const scores = candidate.scores || {}
      const totalScore = candidate.totalScore || 0
      
      // 生成教学维度数据
      const teachingDimensions = [
        { name: '教学内容', key: 'content', score: scores.teaching || 90 },
        { name: '教学方法', key: 'method', score: (scores.teaching || 90) - 3 },
        { name: '课堂管理', key: 'management', score: scores.management || 80 },
        { name: '学生参与度', key: 'participation', score: (scores.teaching || 90) - 2 },
        { name: '语言表达', key: 'expression', score: (scores.teaching || 90) - 1 },
        { name: '板书设计', key: 'board', score: (scores.teaching || 90) - 4 }
      ]
      
      return {
        teacherName: candidate.name || '未知教师',
        overallScore: totalScore,
        teachingScore: scores.teaching || 90,
        researchScore: scores.research || 85,
        studentScore: (scores.teaching || 90) - 2, // 学生评价基于教学分数
        peerScore: scores.management || 80, // 同事评价基于管理能力
        achievementScore: scores.innovation || 85, // 成果产出基于创新能力
        developmentScore: Math.round(((scores.research || 85) + (scores.innovation || 85)) / 2), // 职业发展综合科研和创新
        teachingDimensions: teachingDimensions,
        dimensions: teachingDimensions,
        department: candidate.department || '',
        title: candidate.title || '',
        experience: candidate.experience || 0,
        highlights: candidate.highlights || []
      }
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
      // 从 evaluationTypes 中查找对应的 label
      const type = this.evaluationTypes.find(t => t.value === key)
      return type ? type.label : key
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
        type: '',
        count: 5,
        level: 'school',
        subject: []
      }
      this.criteriaWeights = {}
      this.originalWeights = {}
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

.criteria-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
}

.empty-criteria-tip {
  padding: 40px 20px;
  text-align: center;
  width: 100%;
}

.criteria-item {
  flex: 1 1 calc((100% - 60px) / 6);
  max-width: calc((100% - 60px) / 6);
  min-width: 0;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.criteria-item:hover {
  background: #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.criteria-item h4 {
  margin: 0 0 10px 0;
  color: #303133;
  font-size: 13px;
  font-weight: 600;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

/* 响应式布局 - 超大屏：每行6个 */
@media screen and (min-width: 1920px) {
  .criteria-item {
    flex: 1 1 calc((100% - 60px) / 6);
    max-width: calc((100% - 60px) / 6);
  }
}

/* 响应式布局 - 大屏：每行4个 */
@media screen and (max-width: 1600px) {
  .criteria-item {
    flex: 1 1 calc((100% - 36px) / 4);
    max-width: calc((100% - 36px) / 4);
  }
}

/* 响应式布局 - 中屏：每行3个 */
@media screen and (max-width: 1200px) {
  .criteria-item {
    flex: 1 1 calc((100% - 24px) / 3);
    max-width: calc((100% - 24px) / 3);
  }
}

/* 响应式布局 - 小屏：每行2个 */
@media screen and (max-width: 768px) {
  .criteria-list {
    gap: 16px;
  }
  
  .criteria-item {
    flex: 1 1 calc((100% - 16px) / 2);
    max-width: calc((100% - 16px) / 2);
    margin-bottom: 0;
  }
  
  .criteria-item h4 {
    font-size: 14px;
  }
}

/* 响应式布局 - 超小屏：每行1个 */
@media screen and (max-width: 600px) {
  .criteria-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 0;
}

.recommendations-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.candidate-item {
  position: relative;
  flex: 1 1 calc((100% - 60px) / 4);
  max-width: calc((100% - 60px) / 4);
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  gap: 10px;
}

/* 响应式布局 */
/* 当每行只有3个卡片时 */
@media screen and (max-width: 1400px) {
  .candidate-item {
    flex: 1 1 calc((100% - 40px) / 3);
    max-width: calc((100% - 40px) / 3);
  }
}

/* 当每行只有2个卡片时 */
@media screen and (max-width: 960px) {
  .candidate-item {
    flex: 1 1 calc((100% - 20px) / 2);
    max-width: calc((100% - 20px) / 2);
  }
}

/* 当每行只有1个卡片时 */
@media screen and (max-width: 600px) {
  .candidate-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

.candidate-item:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
}

.candidate-rank {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.candidate-total-score {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  text-align: center;
  padding: 8px 12px;
  background: linear-gradient(135deg, #409EFF 0%, #67c23a 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.total-score-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2px;
  font-weight: 500;
}

.total-score-value {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
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
  padding-left: 18px;
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
  width: 100%;
  min-width: 0;
}

.criteria-item :deep(.el-slider__runway) {
  width: 100%;
}

.criteria-item :deep(.el-slider__button-wrapper) {
  width: 100%;
}

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 评选类型卡片样式 */
.type-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  width: 100%;
}

.type-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 72px;
}

.type-card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.type-card.selected {
  border-color: #409EFF;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.16);
}

.type-color {
  width: 8px;
  height: 48px;
  border-radius: 6px;
  flex-shrink: 0;
  margin-top: 2px;
}

.type-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.type-title {
  font-size: 14px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.type-desc {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.type-check {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #409EFF;
}

/* 评选类型卡片响应式 */
@media screen and (max-width: 1600px) {
  .type-list {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media screen and (max-width: 1200px) {
  .type-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media screen and (max-width: 900px) {
  .type-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 600px) {
  .type-list {
    grid-template-columns: 1fr;
  }
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
  font-size: 22px;
  font-weight: 500;
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

/* 教师分析报告对话框样式 */
.report-dialog {
  max-width: 1400px;
}

.report-dialog :deep(.el-dialog__body) {
  padding: 0;
  max-height: 80vh;
  overflow-y: auto;
}

.report-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  margin: 0;
}

.dialog-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.dialog-header-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
}

.dialog-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.dialog-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.dialog-close-btn .el-icon {
  font-size: 18px;
  font-weight: 600;
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
</style>