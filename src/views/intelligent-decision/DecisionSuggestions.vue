<template>
  <div class="decision-suggestions">
    <!-- 决策建议列表 -->
    <el-card class="suggestions-card">
      <template #header>
        <div class="card-header">
          <h3>决策建议</h3>
          <div class="header-actions">
            <el-select v-model="selectedCategory" placeholder="选择分类" style="width: 150px">
              <el-option label="全部" value="all" />
              <el-option label="教学优化" value="teaching" />
              <el-option label="学生管理" value="student" />
              <el-option label="资源分配" value="resource" />
              <el-option label="系统优化" value="system" />
            </el-select>
            <el-button type="primary" @click="generateSuggestions">
              <el-icon><Refresh /></el-icon>
              生成建议
            </el-button>
            <el-button type="success" @click="openConditionDialog">
              <el-icon><Setting /></el-icon>
              条件配置
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="suggestions-list">
        <div 
          class="suggestion-item" 
          v-for="(suggestion, index) in filteredSuggestions" 
          :key="index"
          :class="{ 'adopted': suggestion.adopted }"
        >
          <div class="suggestion-priority">
            <el-tag :type="getPriorityType(suggestion.priority)" size="small">
              {{ suggestion.priority }}
            </el-tag>
            <el-tag v-if="suggestion.adopted" type="success" size="small" style="margin-left: 8px;">
              <el-icon><Check /></el-icon>
              已采纳
            </el-tag>
          </div>
          <div class="suggestion-content">
            <h4>
              {{ suggestion.title }}
              <el-tooltip v-if="suggestion.adopted" content="该建议已被采纳，可在智能决策页面使用" placement="top">
                <el-icon class="adopted-icon"><InfoFilled /></el-icon>
              </el-tooltip>
            </h4>
            <p>{{ suggestion.description }}</p>
            <div class="suggestion-meta">
              <span class="meta-item">
                <el-icon><Calendar /></el-icon>
                {{ suggestion.createTime }}
              </span>
              <span class="meta-item">
                <el-icon><User /></el-icon>
                {{ getCategoryName(suggestion.category) }}
              </span>
              <span class="meta-item">
                <el-icon><TrendCharts /></el-icon>
                预期效果: {{ suggestion.expectedEffect }}
              </span>
              <span v-if="suggestion.adoptedTime" class="meta-item">
                <el-icon><Check /></el-icon>
                采纳时间: {{ suggestion.adoptedTime }}
              </span>
            </div>
          </div>
          <div class="suggestion-actions">
            <el-button 
              v-if="!suggestion.adopted"
              type="success" 
              size="small" 
              @click="adoptSuggestion(suggestion)"
            >
              <el-icon><Check /></el-icon>
              采纳
            </el-button>
            <el-button size="small" @click="viewDetails(suggestion)">
              <el-icon><View /></el-icon>
              详情
            </el-button>
            <el-button 
              v-if="!suggestion.adopted"
              type="danger" 
              size="small" 
              @click="rejectSuggestion(suggestion)"
            >
              <el-icon><Close /></el-icon>
              拒绝
            </el-button>
            <el-button 
              v-if="suggestion.adopted"
              type="primary" 
              size="small" 
              @click="goToSmartDecision(suggestion)"
            >
              <el-icon><Right /></el-icon>
              去使用
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 生成建议条件配置弹层 -->
    <el-dialog
      v-model="showConditionDialog"
      title="生成建议条件配置"
      width="700px"
      :before-close="handleConditionClose"
      class="condition-dialog"
    >
      <el-form
        ref="conditionFormRef"
        :model="conditionForm"
        :rules="conditionRules"
        label-width="120px"
        class="condition-form"
      >
        <el-form-item label="建议类型" prop="suggestionType">
          <el-select v-model="conditionForm.suggestionType" placeholder="选择建议类型" style="width: 100%">
            <el-option label="教学优化建议" value="teaching" />
            <el-option label="学生管理建议" value="student" />
            <el-option label="资源分配建议" value="resource" />
            <el-option label="系统优化建议" value="system" />
            <el-option label="课程规划建议" value="curriculum" />
            <el-option label="评估改进建议" value="evaluation" />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级范围" prop="priorityRange">
          <el-checkbox-group v-model="conditionForm.priorityRange">
            <el-checkbox label="high">高优先级</el-checkbox>
            <el-checkbox label="medium">中优先级</el-checkbox>
            <el-checkbox label="low">低优先级</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="数据来源">
          <el-checkbox-group v-model="conditionForm.dataSources">
            <el-checkbox label="student_performance">学生表现数据</el-checkbox>
            <el-checkbox label="teacher_feedback">教师反馈数据</el-checkbox>
            <el-checkbox label="system_logs">系统日志数据</el-checkbox>
            <el-checkbox label="survey_results">调研结果数据</el-checkbox>
            <el-checkbox label="historical_data">历史决策数据</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="分析维度">
          <el-checkbox-group v-model="conditionForm.analysisDimensions">
            <el-checkbox label="performance">绩效分析</el-checkbox>
            <el-checkbox label="behavior">行为分析</el-checkbox>
            <el-checkbox label="trend">趋势分析</el-checkbox>
            <el-checkbox label="comparison">对比分析</el-checkbox>
            <el-checkbox label="prediction">预测分析</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="时间范围" prop="timeRange">
          <el-date-picker
            v-model="conditionForm.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="建议数量" prop="suggestionCount">
          <el-input-number
            v-model="conditionForm.suggestionCount"
            :min="1"
            :max="20"
            controls-position="right"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #909399;">建议生成数量</span>
        </el-form-item>

        <el-form-item label="算法模型">
          <el-radio-group v-model="conditionForm.algorithmModel">
            <el-radio label="rule_based">基于规则</el-radio>
            <el-radio label="machine_learning">机器学习</el-radio>
            <el-radio label="deep_learning">深度学习</el-radio>
            <el-radio label="hybrid">混合模型</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="置信度阈值" prop="confidenceThreshold">
          <el-slider
            v-model="conditionForm.confidenceThreshold"
            :min="0.5"
            :max="1.0"
            :step="0.05"
            show-input
            :format-tooltip="formatConfidenceTooltip"
          />
        </el-form-item>

        <el-form-item label="特殊条件">
          <el-input
            v-model="conditionForm.specialConditions"
            type="textarea"
            :rows="3"
            placeholder="请输入特殊生成条件，如特定场景、约束条件等"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="自动执行">
          <el-switch
            v-model="conditionForm.autoExecute"
            active-text="启用自动执行"
            inactive-text="手动执行"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleConditionClose">取消</el-button>
          <el-button @click="resetConditionForm">重置</el-button>
          <el-button type="primary" @click="saveConditionConfig" :loading="savingCondition">
            <el-icon><Check /></el-icon>
            保存配置
          </el-button>
          <el-button type="success" @click="generateWithConditions" :loading="generatingWithConditions">
            <el-icon><MagicStick /></el-icon>
            生成建议
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Check, 
  Refresh,
  Setting,
  Calendar,
  User,
  TrendCharts,
  View,
  Close,
  Right,
  InfoFilled,
  MagicStick
} from '@element-plus/icons-vue'
import { 
  useDecisionSuggestions,
  addDecisionSuggestion,
  removeDecisionSuggestion,
  setDecisionSuggestions,
  incrementScenarioAdopted
} from '@/store/decisionStore.js'

export default {
  name: 'DecisionSuggestions',
  components: {
    Check,
    Refresh,
    Setting,
    Calendar,
    User,
    TrendCharts,
    View,
    Close,
    Right,
    InfoFilled,
    MagicStick
  },
  emits: ['suggestion-adopted'],
  setup(props, { emit }) {
    const router = useRouter()
    const selectedCategory = ref('all')
    
    // 从 store 获取决策建议
    const suggestions = useDecisionSuggestions()
    
    // 条件配置相关
    const showConditionDialog = ref(false)
    const savingCondition = ref(false)
    const generatingWithConditions = ref(false)
    const conditionFormRef = ref()
    
    // 条件表单数据
    const conditionForm = ref({
      suggestionType: '',
      priorityRange: ['high', 'medium'],
      dataSources: ['student_performance', 'teacher_feedback'],
      analysisDimensions: ['performance', 'trend'],
      timeRange: [],
      suggestionCount: 5,
      algorithmModel: 'hybrid',
      confidenceThreshold: 0.8,
      specialConditions: '',
      autoExecute: false
    })
    
    // 条件表单验证规则
    const conditionRules = ref({
      suggestionType: [
        { required: true, message: '请选择建议类型', trigger: 'change' }
      ],
      priorityRange: [
        { required: true, message: '请选择至少一个优先级范围', trigger: 'change' }
      ],
      timeRange: [
        { required: true, message: '请选择时间范围', trigger: 'change' }
      ],
      suggestionCount: [
        { required: true, message: '请输入建议数量', trigger: 'blur' }
      ]
    })
    
    // 过滤建议
    const filteredSuggestions = computed(() => {
      if (selectedCategory.value === 'all') {
        return suggestions.value
      }
      return suggestions.value.filter(s => s.category === selectedCategory.value)
    })
    
    // 获取分类名称
    const getCategoryName = (category) => {
      const categoryMap = {
        'teaching': '教学优化',
        'student': '学生管理',
        'resource': '资源分配',
        'system': '系统优化',
        'curriculum': '课程规划',
        'evaluation': '评估改进'
      }
      return categoryMap[category] || category
    }
    
    // 获取优先级类型
    const getPriorityType = (priority) => {
      const priorityMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'success'
      }
      return priorityMap[priority] || 'info'
    }
    
    // 生成建议（简单模式 - 使用默认配置）
    const generateSuggestions = async () => {
      try {
        ElMessage.info('正在生成新的决策建议...')
        
        // 模拟生成延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 生成一些默认建议
        const defaultSuggestions = [
          {
            title: '优化课程安排时间',
            description: '根据学生出勤率和学习效果数据，建议调整部分课程的上课时间以提高学生参与度',
            category: 'teaching',
            priority: '中',
            createTime: new Date().toLocaleString(),
            expectedEffect: '预期提升20%出勤率',
            value: `teaching_suggestion_${Date.now()}_1`,
            label: '优化课程安排时间'
          },
          {
            title: '加强学生个性化辅导',
            description: '基于学生成绩分析，建议为成绩波动较大的学生提供个性化辅导计划',
            category: 'student',
            priority: '高',
            createTime: new Date().toLocaleString(),
            expectedEffect: '预期提升15%学习效果',
            value: `student_suggestion_${Date.now()}_2`,
            label: '加强学生个性化辅导'
          },
          {
            title: '优化教学资源配置',
            description: '根据各课程选课人数和资源使用情况，建议重新分配教学资源以提高利用率',
            category: 'resource',
            priority: '中',
            createTime: new Date().toLocaleString(),
            expectedEffect: '预期提升25%资源利用率',
            value: `resource_suggestion_${Date.now()}_3`,
            label: '优化教学资源配置'
          }
        ]
        
        // 使用 store 方法添加建议
        defaultSuggestions.forEach(suggestion => {
          addDecisionSuggestion(suggestion)
        })
        
        ElMessage.success(`成功生成 ${defaultSuggestions.length} 条决策建议！提示：您也可以使用"条件配置"功能进行更精细的配置生成。`)
      } catch (error) {
        console.error('生成建议失败:', error)
        ElMessage.error('生成建议失败，请稍后重试')
      }
    }
    
    // 采纳建议
    const adoptSuggestion = (suggestion) => {
      ElMessageBox.confirm(
        `确定要采纳建议"${suggestion.title}"吗？采纳后该建议将被记录到决策历史中，并可在"智能决策"页面使用。`,
        '确认采纳',
        {
          confirmButtonText: '确定采纳',
          cancelButtonText: '取消',
          type: 'success',
        }
      ).then(() => {
        // 1. 标记建议为已采纳
        const suggestionIndex = suggestions.value.findIndex(s => 
          s.value === suggestion.value || s.title === suggestion.title
        )
        if (suggestionIndex !== -1) {
          suggestions.value[suggestionIndex] = {
            ...suggestions.value[suggestionIndex],
            adopted: true,
            adoptedTime: new Date().toLocaleString()
          }
          // 保存到 store
          setDecisionSuggestions(suggestions.value)
        }
        
        // 2. 更新对应场景的采纳数量
        incrementScenarioAdopted(suggestion.category)
        
        // 3. 通知父组件更新决策历史
        const categoryToScenarioName = {
          'teaching': '教学优化',
          'student': '学生管理',
          'resource': '资源分配',
          'system': '系统优化',
          'curriculum': '课程规划',
          'evaluation': '评估改进'
        }
        
        const historyItem = {
          date: new Date().toLocaleString(),
          scenario: categoryToScenarioName[suggestion.category] || suggestion.category,
          suggestion: suggestion.title,
          decision: '已采纳',
          result: '进行中',
          effectiveness: 0
        }
        
        emit('suggestion-adopted', historyItem)
        
        ElMessage.success(`已采纳建议: ${suggestion.title}。该建议已记录到决策历史，可在"智能决策"页面选择使用。`)
      }).catch(() => {
        // 用户取消
      })
    }
    
    // 查看建议详情
    const viewDetails = (suggestion) => {
      const details = `
建议标题：${suggestion.title}

建议描述：${suggestion.description}

建议分类：${getCategoryName(suggestion.category)}

优先级：${suggestion.priority}

创建时间：${suggestion.createTime}

预期效果：${suggestion.expectedEffect || '暂无'}

${suggestion.confidence ? `置信度：${Math.round(suggestion.confidence * 100)}%` : ''}
      `.trim()
      
      ElMessageBox.alert(details, '建议详情', {
        confirmButtonText: '关闭',
        type: 'info',
        customClass: 'suggestion-detail-dialog'
      })
    }
    
    // 拒绝建议
    const rejectSuggestion = (suggestion) => {
      ElMessageBox.confirm(
        `确定要拒绝建议"${suggestion.title}"吗？拒绝后该建议将从列表中移除。`,
        '确认拒绝',
        {
          confirmButtonText: '确定拒绝',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        // 从建议列表中移除
        removeDecisionSuggestion(suggestion.value)
        ElMessage.warning(`已拒绝建议: ${suggestion.title}`)
      }).catch(() => {
        // 用户取消
      })
    }
    
    // 跳转到智能决策页面使用建议
    const goToSmartDecision = (suggestion) => {
      router.push({
        path: '/intelligent-decision/smart-decision',
        query: {
          suggestion: suggestion.value || suggestion.title
        }
      })
    }
    
    // 条件配置相关方法
    const openConditionDialog = () => {
      showConditionDialog.value = true
      // 设置默认时间范围为最近30天
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      conditionForm.value.timeRange = [
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      ]
    }
    
    const handleConditionClose = () => {
      if (savingCondition.value || generatingWithConditions.value) {
        ElMessage.warning('正在处理中，请稍候...')
        return
      }
      
      ElMessageBox.confirm(
        '确定要关闭吗？未保存的配置将丢失。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        showConditionDialog.value = false
        resetConditionForm()
      }).catch(() => {
        // 用户取消
      })
    }
    
    const resetConditionForm = () => {
      conditionForm.value = {
        suggestionType: '',
        priorityRange: ['high', 'medium'],
        dataSources: ['student_performance', 'teacher_feedback'],
        analysisDimensions: ['performance', 'trend'],
        timeRange: [],
        suggestionCount: 5,
        algorithmModel: 'hybrid',
        confidenceThreshold: 0.8,
        specialConditions: '',
        autoExecute: false
      }
      // 清除验证
      nextTick(() => {
        if (conditionFormRef.value) {
          conditionFormRef.value.clearValidate()
        }
      })
    }
    
    const saveConditionConfig = async () => {
      if (!conditionFormRef.value) return
      
      try {
        await conditionFormRef.value.validate()
        savingCondition.value = true
        
        // 模拟保存延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        ElMessage.success('条件配置保存成功！')
        showConditionDialog.value = false
        
      } catch (error) {
        console.error('表单验证失败:', error)
        ElMessage.error('请检查表单填写是否完整')
      } finally {
        savingCondition.value = false
      }
    }
    
    const generateWithConditions = async () => {
      if (!conditionFormRef.value) return
      
      try {
        await conditionFormRef.value.validate()
        generatingWithConditions.value = true
        
        // 模拟生成延迟
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 根据条件生成建议
        const newSuggestions = generateConditionalSuggestions()
        // 使用 store 方法添加建议
        newSuggestions.forEach(suggestion => {
          addDecisionSuggestion(suggestion)
        })
        
        ElMessage.success(`根据配置条件成功生成 ${newSuggestions.length} 条建议！`)
        showConditionDialog.value = false
        
      } catch (error) {
        console.error('表单验证失败:', error)
        ElMessage.error('请检查表单填写是否完整')
      } finally {
        generatingWithConditions.value = false
      }
    }
    
    const generateConditionalSuggestions = () => {
      const typeMap = {
        'teaching': '教学优化',
        'student': '学生管理',
        'resource': '资源分配',
        'system': '系统优化',
        'curriculum': '课程规划',
        'evaluation': '评估改进'
      }
      
      const priorityMap = {
        'high': '高',
        'medium': '中',
        'low': '低'
      }
      
      const suggestions = []
      const count = conditionForm.value.suggestionCount
      
      for (let i = 0; i < count; i++) {
        const type = conditionForm.value.suggestionType
        const priority = conditionForm.value.priorityRange[Math.floor(Math.random() * conditionForm.value.priorityRange.length)]
        
        const title = `${typeMap[type]}建议 ${i + 1}`
        suggestions.push({
          title: title,
          description: `基于${conditionForm.value.algorithmModel}算法，结合${conditionForm.value.dataSources.join('、')}数据，通过${conditionForm.value.analysisDimensions.join('、')}分析生成的智能建议`,
          category: type,
          priority: priorityMap[priority],
          createTime: new Date().toLocaleString(),
          expectedEffect: `预期提升${Math.floor(Math.random() * 30) + 10}%效果`,
          confidence: conditionForm.value.confidenceThreshold,
          conditions: conditionForm.value,
          // 添加 value 和 label 字段以兼容 SmartDecision.vue
          value: `${type}_suggestion_${Date.now()}_${i}`,
          label: title
        })
      }
      
      return suggestions
    }
    
    const formatConfidenceTooltip = (val) => {
      return `${Math.round(val * 100)}%`
    }
    
    return {
      selectedCategory,
      suggestions,
      filteredSuggestions,
      showConditionDialog,
      savingCondition,
      generatingWithConditions,
      conditionFormRef,
      conditionForm,
      conditionRules,
      getCategoryName,
      getPriorityType,
      generateSuggestions,
      adoptSuggestion,
      viewDetails,
      rejectSuggestion,
      goToSmartDecision,
      openConditionDialog,
      handleConditionClose,
      resetConditionForm,
      saveConditionConfig,
      generateWithConditions,
      formatConfidenceTooltip
    }
  }
}
</script>

<style scoped>
.decision-suggestions {
  width: 100%;
}

.suggestions-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.suggestions-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  flex: 1 1 calc((100% - 48px) / 4);
  max-width: calc((100% - 48px) / 4);
  min-width: 0;
  box-sizing: border-box;
}

/* 响应式布局 */
/* 当每行只有3个卡片时 */
@media screen and (max-width: 1400px) {
  .suggestion-item {
    flex: 1 1 calc((100% - 32px) / 3);
    max-width: calc((100% - 32px) / 3);
  }
}

/* 当每行只有2个卡片时 */
@media screen and (max-width: 960px) {
  .suggestion-item {
    flex: 1 1 calc((100% - 16px) / 2);
    max-width: calc((100% - 16px) / 2);
  }
}

/* 当每行只有1个卡片时 */
@media screen and (max-width: 600px) {
  .suggestion-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

.suggestion-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.suggestion-priority {
  flex-shrink: 0;
}

.suggestion-content {
  flex: 1;
  width: 100%;
  min-width: 0;
  overflow: hidden;
}

.suggestion-content h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.4;
}

.suggestion-content p {
  margin: 0 0 12px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.suggestion-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.suggestion-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  width: 100%;
  flex-wrap: wrap;
}

.suggestion-item.adopted {
  border-left: 4px solid #67c23a;
  background: rgba(103, 194, 58, 0.05);
}

.suggestion-item.adopted:hover {
  background: rgba(103, 194, 58, 0.1);
}

.adopted-icon {
  margin-left: 8px;
  color: #67c23a;
  cursor: help;
}

/* 弹层样式 */
:deep(.condition-dialog) {
  .el-dialog {
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }
  
  .el-dialog__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16px 16px 0 0;
    padding: 20px 24px;
    margin: 0;
  }
  
  .el-dialog__title {
    color: white;
    font-size: 18px;
    font-weight: 600;
  }
  
  .el-dialog__headerbtn .el-dialog__close {
    color: white;
    font-size: 20px;
  }
  
  .el-dialog__body {
    padding: 24px;
    background: rgba(255, 255, 255, 0.95);
  }
  
  .el-dialog__footer {
    padding: 16px 24px;
    background: rgba(248, 250, 252, 0.8);
    border-radius: 0 0 16px 16px;
  }
}

.condition-form {
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-form-item__label {
    color: #374151;
    font-weight: 500;
  }
  
  .el-input__wrapper {
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .el-input__wrapper:hover {
    box-shadow: 0 0 0 1px #667eea;
  }
  
  .el-textarea__inner {
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .el-textarea__inner:hover {
    box-shadow: 0 0 0 1px #667eea;
  }
  
  .el-select .el-input__wrapper {
    border-radius: 8px;
  }
  
  .el-radio-group {
    display: flex;
    gap: 20px;
  }
  
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .el-checkbox {
    margin-right: 0;
  }
  
  .el-switch {
    --el-switch-on-color: #667eea;
  }
  
  .el-slider {
    margin: 10px 0;
  }
  
  .el-date-editor {
    border-radius: 8px;
  }
  
  .el-input-number {
    border-radius: 8px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
}

.dialog-footer .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.dialog-footer .el-button--primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>

