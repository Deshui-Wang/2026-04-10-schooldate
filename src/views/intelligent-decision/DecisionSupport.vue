<template>
  <div class="decision-support">
    <div class="section-header">
      <h3>智能决策支持</h3>
      <p>基于AI的智能决策建议与方案推荐</p>
    </div>

    <div class="decision-content">
      <!-- 决策概览 -->
      <el-row :gutter="24" class="overview-section">
        <el-col :span="6">
          <el-card class="decision-card">
            <div class="card-content">
              <div class="card-icon suggestion">
                <el-icon><ReadingLamp /></el-icon>
              </div>
              <div class="card-info">
                <h3>决策建议</h3>
                <p class="card-value">15</p>
                <p class="card-desc">待处理建议</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="decision-card">
            <div class="card-content">
              <div class="card-icon adopted">
                <el-icon><Check /></el-icon>
              </div>
              <div class="card-info">
                <h3>已采纳</h3>
                <p class="card-value">8</p>
                <p class="card-desc">本月采纳数</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="decision-card">
            <div class="card-content">
              <div class="card-icon success-rate">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="card-info">
                <h3>成功率</h3>
                <p class="card-value">85%</p>
                <p class="card-desc">建议成功率</p>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="decision-card">
            <div class="card-content">
              <div class="card-icon satisfaction">
                <el-icon><Star /></el-icon>
              </div>
              <div class="card-info">
                <h3>满意度</h3>
                <p class="card-value">4.8</p>
                <p class="card-desc">用户满意度</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 评选类型配置 -->
      <el-card class="evaluation-type-card">
        <template #header>
          <div class="card-header">
            <h3>评选类型</h3>
          </div>
        </template>
        
        <div class="evaluation-types-list">
          <div 
            class="evaluation-type-item" 
            v-for="type in evaluationTypes" 
            :key="type.value"
            :class="{ 'has-config': type.selectedAssessmentItems && type.selectedAssessmentItems.length > 0 }"
          >
            <div class="type-content">
              <div class="type-header">
                <h4>{{ type.label }}</h4>
                <el-tag 
                  v-if="type.selectedAssessmentItems && type.selectedAssessmentItems.length > 0"
                  type="success" 
                  size="small"
                  class="config-badge"
                >
                  <el-icon><Check /></el-icon>
                  已配置
                </el-tag>
              </div>
              <p>{{ type.description }}</p>
              <div v-if="type.selectedAssessmentItems && type.selectedAssessmentItems.length > 0" class="assessment-items-preview">
                <div class="preview-header">
                  <span class="preview-label">已选考核内容（{{ type.selectedAssessmentItems.length }}项）：</span>
                </div>
                <div class="preview-tags">
                  <el-tag 
                    v-for="(item, index) in type.selectedAssessmentItems.slice(0, 3)" 
                    :key="index"
                    size="small"
                    type="info"
                    class="assessment-tag"
                  >
                    {{ item }}
                  </el-tag>
                  <el-tag 
                    v-if="type.selectedAssessmentItems.length > 3"
                    size="small"
                    type="info"
                    class="assessment-tag more-tag"
                  >
                    +{{ type.selectedAssessmentItems.length - 3 }}项
                  </el-tag>
                </div>
              </div>
            </div>
            <div class="type-actions">
              <el-button 
                size="small"
                @click.stop="editEvaluationType(type)"
                class="edit-btn"
              >
                <el-icon><Edit /></el-icon>
                {{ type.selectedAssessmentItems && type.selectedAssessmentItems.length > 0 ? '修改' : '编辑' }}
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 决策场景 -->
      <DecisionScenarios />

      <!-- 决策建议列表 -->
      <DecisionSuggestions @suggestion-adopted="handleSuggestionAdopted" />

      <!-- 决策历史 -->
      <el-card class="history-card">
        <template #header>
          <div class="card-header">
            <h3>决策历史</h3>
            <el-button @click="exportHistory">
              <el-icon><Download /></el-icon>
              导出历史
            </el-button>
          </div>
        </template>
        
        <el-table :data="decisionHistory" style="width: 100%">
          <el-table-column prop="date" label="决策时间" width="180" />
          <el-table-column prop="scenario" label="决策场景" width="150" />
          <el-table-column prop="suggestion" label="建议内容" min-width="200" />
          <el-table-column prop="decision" label="决策结果" width="120">
            <template #default="scope">
              <el-tag :type="getDecisionType(scope.row.decision)">
                {{ scope.row.decision }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="result" label="执行结果" width="120">
            <template #default="scope">
              <el-tag :type="getResultType(scope.row.result)">
                {{ scope.row.result }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="effectiveness" label="效果评分" width="120">
            <template #default="scope">
              <el-rate 
                v-model="scope.row.effectiveness" 
                disabled 
                show-score 
                text-color="#ff9900"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 新增/编辑评选配置弹层 -->
    <el-dialog
      v-model="showEvaluationDialog"
      :title="isEditMode ? '编辑评选类型' : '配置评选类型'"
      width="600px"
      :before-close="handleEvaluationClose"
      class="evaluation-dialog"
    >
      <el-form
        ref="evaluationFormRef"
        :model="evaluationForm"
        :rules="evaluationRules"
        label-width="100px"
        class="evaluation-form"
      >
        <el-form-item label="评选类型" prop="value">
          <el-select
            v-model="evaluationForm.value"
            placeholder="请选择评选类型"
            :disabled="isEditMode"
            style="width: 100%"
            @change="onEvaluationTypeChange"
          >
            <el-option
              v-for="type in evaluationTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="类型描述">
          <el-input
            :model-value="currentTypeDescription"
            type="textarea"
            :rows="2"
            readonly
            disabled
          />
        </el-form-item>

        <el-form-item label="考核内容" required>
          <div class="assessment-items-container">
            <el-checkbox-group v-model="evaluationForm.selectedAssessmentItems">
              <div
                v-for="(item, index) in availableAssessmentItems"
                :key="index"
                class="assessment-checkbox-item"
              >
                <el-checkbox :label="item">
                  {{ item }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
            <div v-if="availableAssessmentItems.length === 0" class="empty-assessment-tip">
              请先选择评选类型
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleEvaluationClose">取消</el-button>
          <el-button @click="resetEvaluationForm" v-if="!isEditMode">重置</el-button>
          <el-button type="primary" @click="saveEvaluationType" :loading="savingEvaluation">
            <el-icon><Check /></el-icon>
            {{ isEditMode ? '确认修改' : '确认配置' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ReadingLamp, 
  Check, 
  TrendCharts, 
  Star,
  Download,
  Notebook,
  School,
  DataAnalysis,
  Briefcase,
  Management,
  Edit
} from '@element-plus/icons-vue'
import { 
  useEvaluationTypes,
  updateEvaluationType
} from '@/store/decisionStore.js'
import DecisionSuggestions from './DecisionSuggestions.vue'
import DecisionScenarios from './DecisionScenarios.vue'

export default {
  name: 'DecisionSupport',
  components: {
    ReadingLamp,
    Check,
    TrendCharts,
    Star,
    Download,
    Notebook,
    School,
    DataAnalysis,
    Briefcase,
    Management,
    Edit,
    DecisionSuggestions,
    DecisionScenarios
  },
  setup() {
    // 评选类型图标映射
    const evaluationIconMap = ref({
      Notebook,
      School,
      DataAnalysis,
      Briefcase,
      Management
    })
    
    // 评选类型配置 - 从 store 获取
    const evaluationTypes = useEvaluationTypes()
    
    // 切换评选类型选择状态
    const toggleEvaluationType = (type) => {
      type.selected = !type.selected
      const selectedCount = evaluationTypes.value.filter(t => t.selected).length
      if (type.selected) {
        ElMessage.success(`已选择"${type.label}"`)
      } else {
        ElMessage.info(`已取消选择"${type.label}"`)
      }
    }
    
    // 重置评选类型选择
    const resetEvaluationTypes = () => {
      evaluationTypes.value.forEach(type => {
        type.selected = false
      })
      ElMessage.info('已重置评选类型选择')
    }
    
    // 评选配置对话框
    const showEvaluationDialog = ref(false)
    const savingEvaluation = ref(false)
    const evaluationFormRef = ref(null)
    const isEditMode = ref(false)
    const editingTypeIndex = ref(-1)
    
    // 评选表单数据
    const evaluationForm = ref({
      value: '',
      selectedAssessmentItems: []
    })
    
    // 当前选中的评选类型
    const currentEvaluationType = computed(() => {
      return evaluationTypes.value.find(type => type.value === evaluationForm.value.value) || null
    })
    
    // 当前类型的描述
    const currentTypeDescription = computed(() => {
      return currentEvaluationType.value?.description || ''
    })
    
    // 可用的考核内容选项（根据选中的类型）
    const availableAssessmentItems = computed(() => {
      return currentEvaluationType.value?.assessmentItems || []
    })
    
    // 评选类型改变时的处理
    const onEvaluationTypeChange = () => {
      // 重置选中的考核内容
      evaluationForm.value.selectedAssessmentItems = []
      
      // 如果是在编辑模式，加载该类型已选中的考核内容
      if (isEditMode.value && currentEvaluationType.value) {
        const type = evaluationTypes.value.find(t => t.value === evaluationForm.value.value)
        if (type && type.selectedAssessmentItems) {
          evaluationForm.value.selectedAssessmentItems = [...type.selectedAssessmentItems]
        }
      }
    }
    
    // 颜色预设
    const colorPresets = ref([
      { label: '紫色渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { label: '粉色渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { label: '蓝色渐变', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
      { label: '绿色渐变', value: 'linear-gradient(135deg, #43e97b 0%, #38d9a9 100%)' },
      { label: '橙黄渐变', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
      { label: '红橙渐变', value: 'linear-gradient(135deg, #fa8bff 0%, #2bd2ff 100%)' },
      { label: '青蓝渐变', value: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' },
      { label: '紫红渐变', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }
    ])
    
    // 评选表单验证规则
    const evaluationRules = ref({
      value: [
        { required: true, message: '请选择评选类型', trigger: 'change' }
      ]
    })
    
    // 重置评选表单
    const resetEvaluationForm = () => {
      evaluationForm.value = {
        value: '',
        selectedAssessmentItems: []
      }
      isEditMode.value = false
      editingTypeIndex.value = -1
      nextTick(() => {
        if (evaluationFormRef.value) {
          evaluationFormRef.value.clearValidate()
        }
      })
    }
    
    // 关闭评选对话框
    const handleEvaluationClose = () => {
      resetEvaluationForm()
      showEvaluationDialog.value = false
    }
    
    // 打开新增评选对话框
    const openAddEvaluationDialog = () => {
      resetEvaluationForm()
      showEvaluationDialog.value = true
    }
    
    // 编辑评选类型
    const editEvaluationType = (type) => {
      const index = evaluationTypes.value.findIndex(t => t.value === type.value)
      if (index === -1) return
      
      isEditMode.value = true
      editingTypeIndex.value = index
      
      // 填充表单数据
      evaluationForm.value = {
        value: type.value,
        selectedAssessmentItems: type.selectedAssessmentItems && type.selectedAssessmentItems.length > 0
          ? [...type.selectedAssessmentItems]
          : []
      }
      
      showEvaluationDialog.value = true
    }
    
    // 保存评选类型（新增或编辑）
    const saveEvaluationType = async () => {
      if (!evaluationFormRef.value) return
      
      try {
        await evaluationFormRef.value.validate()
        
        // 验证是否选择了考核内容
        if (!evaluationForm.value.selectedAssessmentItems || evaluationForm.value.selectedAssessmentItems.length === 0) {
          ElMessage.warning('请至少选择一个考核内容')
          savingEvaluation.value = false
          return
        }
        
        savingEvaluation.value = true
        
        // 模拟保存延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const selectedType = currentEvaluationType.value
        if (!selectedType) {
          ElMessage.error('未找到选中的评选类型')
          savingEvaluation.value = false
          return
        }
        
        // 使用 store 的更新方法保存数据（会自动保存到 localStorage）
        const success = updateEvaluationType(selectedType.value, {
          selectedAssessmentItems: [...evaluationForm.value.selectedAssessmentItems]
        })
        
        if (success) {
          // 确保数据已保存（由于 evaluationTypes 是响应式引用，修改会自动更新视图）
          console.log(`已保存评选类型"${selectedType.label}"的考核内容配置:`, evaluationForm.value.selectedAssessmentItems)
          
          ElMessage.success(`成功${isEditMode.value ? '修改' : '配置'}评选类型"${selectedType.label}"，已选择 ${evaluationForm.value.selectedAssessmentItems.length} 项考核内容`)
          
          handleEvaluationClose()
        } else {
          ElMessage.error('保存失败，未找到对应的评选类型')
        }
      } catch (error) {
        console.error('表单验证失败:', error)
        ElMessage.error('保存失败，请检查表单填写是否完整')
      } finally {
        savingEvaluation.value = false
      }
    }
    
    const decisionHistory = ref([
      {
        date: '2024-01-14 16:30',
        scenario: '教学优化',
        suggestion: '调整英语课程难度',
        decision: '已采纳',
        result: '成功',
        effectiveness: 4
      },
      {
        date: '2024-01-14 14:20',
        scenario: '学生管理',
        suggestion: '加强出勤管理',
        decision: '已采纳',
        result: '成功',
        effectiveness: 5
      },
      {
        date: '2024-01-14 10:15',
        scenario: '资源分配',
        suggestion: '调整图书馆开放时间',
        decision: '已拒绝',
        result: '-',
        effectiveness: 0
      }
    ])

    const getDecisionType = (decision) => {
      const decisionMap = {
        '已采纳': 'success',
        '已拒绝': 'danger',
        '待处理': 'warning'
      }
      return decisionMap[decision] || 'info'
    }

    const getResultType = (result) => {
      const resultMap = {
        '成功': 'success',
        '失败': 'danger',
        '进行中': 'warning',
        '-': 'info'
      }
      return resultMap[result] || 'info'
    }

    // 处理建议采纳事件
    const handleSuggestionAdopted = (historyItem) => {
      decisionHistory.value.unshift(historyItem)
    }

    const exportHistory = () => {
      ElMessage.success('决策历史导出功能开发中...')
    }

    return {
      decisionHistory,
      // 评选类型相关
      evaluationTypes,
      showEvaluationDialog,
      savingEvaluation,
      evaluationFormRef,
      evaluationForm,
      colorPresets,
      evaluationRules,
      isEditMode,
      resetEvaluationForm,
      handleEvaluationClose,
      openAddEvaluationDialog,
      editEvaluationType,
      saveEvaluationType,
      // 考核内容相关
      currentEvaluationType,
      currentTypeDescription,
      availableAssessmentItems,
      onEvaluationTypeChange,
      evaluationIconMap,
      getDecisionType,
      getResultType,
      exportHistory,
      handleSuggestionAdopted
    }
  }
}
</script>

<style scoped>
.decision-support {
  padding: 0;
  animation: fadeInUp 0.8s ease-out;
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

.decision-content {
  display: flex;
  flex-direction: column;
}

.overview-section {
  margin-bottom: 24px;
}

.decision-card {
  height: 140px;
  transition: all 0.3s ease;
}

.decision-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 20px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.card-icon.suggestion {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.card-icon.adopted {
  background: linear-gradient(135deg, #43e97b 0%, #38d9a9 100%);
}

.card-icon.success-rate {
  background: linear-gradient(135deg, #ffd43b 0%, #ffa726 100%);
}

.card-icon.satisfaction {
  background: linear-gradient(135deg, #feca57 0%, #ff9ff3 100%);
}

.card-info h3 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

.card-value {
  margin: 0 0 4px 0;
  color: #667eea;
  font-size: 28px;
  font-weight: 700;
}

.card-desc {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.evaluation-type-card {
  margin-bottom: 24px;
}

.evaluation-types-list {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.evaluation-type-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  flex: 1 1 calc((100% - 64px) / 5);
  min-width: 200px;
  max-width: calc((100% - 64px) / 5);
  box-sizing: border-box;
  position: relative;
}

.evaluation-type-item.has-config {
  border-color: rgba(67, 233, 123, 0.3);
  background: rgba(248, 255, 250, 0.9);
}

/* 响应式布局 */
@media screen and (max-width: 1600px) {
  .evaluation-type-item {
    flex: 1 1 calc((100% - 48px) / 4);
    max-width: calc((100% - 48px) / 4);
  }
}

@media screen and (max-width: 1200px) {
  .evaluation-type-item {
    flex: 1 1 calc((100% - 32px) / 3);
    max-width: calc((100% - 32px) / 3);
  }
}

@media screen and (max-width: 960px) {
  .evaluation-type-item {
    flex: 1 1 calc((100% - 16px) / 2);
    max-width: calc((100% - 16px) / 2);
  }
}

@media screen and (max-width: 600px) {
  .evaluation-type-item {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

.evaluation-type-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  border-color: rgba(102, 126, 234, 0.3);
}

.type-content {
  flex: 1;
  min-width: 0;
}

.type-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
}

.type-content h4 {
  margin: 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
}

.config-badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.config-badge .el-icon {
  font-size: 12px;
}

.type-content p {
  margin: 0 0 12px 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.4;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.assessment-items-preview {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.preview-header {
  margin-bottom: 8px;
}

.preview-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.assessment-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
}

.assessment-tag.more-tag {
  background-color: #e4e7ed;
  color: #606266;
  border-color: #dcdfe6;
}

.type-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
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

/* 按钮样式变量 - 可自定义调整 */
:root {
  --btn-gradient-start: #667eea;
  --btn-gradient-end: #764ba2;
  --btn-text-color: #ffffff;
  --btn-hover-opacity: 0.9;
  --btn-shadow: rgba(102, 126, 234, 0.3);
  --btn-border-radius: 8px;
  --btn-edit-gradient-start: #667eea;
  --btn-edit-gradient-end: #764ba2;
}


/* 编辑按钮样式 */
.type-actions .edit-btn {
  background: linear-gradient(135deg, var(--btn-edit-gradient-start), var(--btn-edit-gradient-end)) !important;
  border: none !important;
  color: var(--btn-text-color) !important;
  padding: 6px 14px !important;
  font-size: 13px !important;
  font-weight: 500 !important;
  border-radius: var(--btn-border-radius) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 6px var(--btn-shadow) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
}

.type-actions .edit-btn:hover {
  opacity: var(--btn-hover-opacity) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 3px 10px var(--btn-shadow) !important;
}

.type-actions .edit-btn:active {
  transform: translateY(0) !important;
}

.type-actions .edit-btn .el-icon {
  font-size: 14px !important;
}

.history-card {
  margin-bottom: 24px;
}

/* 弹层样式 */
:deep(.evaluation-dialog) {
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

.evaluation-form {
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

.assessment-items-container {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.assessment-checkbox-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f5f7fa;
    transform: translateX(4px);
  }
  
  &:last-of-type {
    margin-bottom: 0;
  }
  
  .el-checkbox {
    width: 100%;
    
    .el-checkbox__label {
      font-size: 14px;
      color: #606266;
      padding-left: 8px;
    }
  }
}

.empty-assessment-tip {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.assessment-item-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-of-type {
    margin-bottom: 0;
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

.color-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

.color-preset-item {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preset-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.color-preset-item.active {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.color-preset-item::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 18px;
  font-weight: bold;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.color-preset-item.active::after {
  opacity: 1;
}

.custom-color-input {
  margin-top: 16px;
}

.custom-color-input .el-input {
  width: 100%;
}

.color-preview {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  margin-top: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
