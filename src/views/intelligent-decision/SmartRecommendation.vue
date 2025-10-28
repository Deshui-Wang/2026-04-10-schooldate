<template>
  <div class="smart-recommendation">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon class="title-icon"><Star /></el-icon>
            智能推荐
          </h1>
          <p class="page-subtitle">基于AI算法的职称评选和人才推荐系统</p>
        </div>
        <div class="header-actions">
        </div>
      </div>
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
              <el-button type="primary" size="small" @click="viewCandidateDetail(candidate)">查看详情</el-button>
              <el-button size="small" @click="compareCandidate(candidate)">对比分析</el-button>
              <el-button type="success" size="small" @click="selectCandidate(candidate)">选择推荐</el-button>
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
  </div>
</template>

<script>
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
      }
    }
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
        
        // 关闭弹窗
        this.processingDialogVisible = false
        this.$message.success('推荐完成！')
      }, 500)
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
    
    compareCandidate(candidate) {
      this.$message.info(`对比分析 ${candidate.name}`)
      // 这里可以打开对比分析功能
    },
    
    selectCandidate(candidate) {
      this.$confirm(`确定推荐 ${candidate.name} 吗？`, '确认推荐', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$message.success(`已推荐 ${candidate.name}`)
        // 这里可以保存推荐结果
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
  font-size: 24px;
  color: #667eea;
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
</style>