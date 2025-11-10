<template>
  <div class="decision-scenarios">
    <!-- 决策场景列表 -->
    <el-card class="scenarios-card">
      <template #header>
        <div class="card-header">
          <h3>决策场景</h3>
          <el-button type="primary" @click="createScenario">
            <el-icon><Plus /></el-icon>
            新建场景
          </el-button>
        </div>
      </template>
      
      <div class="scenarios-list">
        <div class="scenario-item" v-for="scenario in scenarios" :key="scenario.id" @click="viewScenario(scenario)">
          <div class="scenario-header">
            <div class="scenario-icon" :style="{ background: scenario.iconColor }">
              <el-icon><component :is="iconMap[scenario.icon]" /></el-icon>
            </div>
            <h4>{{ scenario.name }}</h4>
          </div>
          <div class="scenario-content">
            <p>{{ scenario.description }}</p>
            <div class="scenario-stats">
              <span class="stat-item">
                <el-icon><ReadingLamp /></el-icon>
                {{ scenario.suggestions }} 建议
              </span>
              <span class="stat-item">
                <el-icon><Check /></el-icon>
                {{ scenario.adopted }} 采纳
              </span>
            </div>
          </div>
          <div class="scenario-status">
            <el-tag :type="getStatusType(scenario.status)">{{ scenario.status }}</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 新建场景弹层 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建决策场景"
      width="600px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        ref="scenarioFormRef"
        :model="scenarioForm"
        :rules="scenarioRules"
        label-width="100px"
        class="scenario-form"
      >
        <el-form-item label="场景名称" prop="name">
          <el-input
            v-model="scenarioForm.name"
            placeholder="请输入场景名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="场景描述" prop="description">
          <el-input
            v-model="scenarioForm.description"
            type="textarea"
            :rows="3"
            placeholder="请描述该决策场景的用途和目标"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="场景类型" prop="type">
          <el-select v-model="scenarioForm.type" placeholder="请选择场景类型" style="width: 100%">
            <el-option label="教学优化" value="teaching" />
            <el-option label="学生管理" value="student" />
            <el-option label="资源分配" value="resource" />
            <el-option label="系统优化" value="system" />
            <el-option label="课程规划" value="curriculum" />
            <el-option label="评估改进" value="evaluation" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="scenarioForm.priority">
            <el-radio label="high">高</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="low">低</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="触发条件">
          <el-checkbox-group v-model="scenarioForm.triggers">
            <el-checkbox label="data_change">数据变化</el-checkbox>
            <el-checkbox label="time_schedule">定时触发</el-checkbox>
            <el-checkbox label="manual">手动触发</el-checkbox>
            <el-checkbox label="threshold">阈值触发</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="分析维度">
          <el-checkbox-group v-model="scenarioForm.dimensions">
            <el-checkbox label="performance">绩效分析</el-checkbox>
            <el-checkbox label="behavior">行为分析</el-checkbox>
            <el-checkbox label="trend">趋势分析</el-checkbox>
            <el-checkbox label="comparison">对比分析</el-checkbox>
            <el-checkbox label="prediction">预测分析</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="通知设置">
          <el-switch
            v-model="scenarioForm.notifications"
            active-text="启用通知"
            inactive-text="禁用通知"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="scenarioForm.notes"
            type="textarea"
            :rows="2"
            placeholder="其他备注信息（可选）"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon>
            创建场景
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ReadingLamp, 
  Check, 
  Plus,
  School,
  User,
  Box,
  Setting,
  Calendar,
  Document,
  TrendCharts
} from '@element-plus/icons-vue'
import { 
  useDecisionScenarios, 
  addDecisionScenario
} from '@/store/decisionStore.js'

export default {
  name: 'DecisionScenarios',
  components: {
    ReadingLamp,
    Check,
    Plus,
    School,
    User,
    Box,
    Setting,
    Calendar,
    Document,
    TrendCharts
  },
  setup() {
    const showCreateDialog = ref(false)
    const submitting = ref(false)
    const scenarioFormRef = ref()
    
    // 图标映射
    const iconMap = {
      School,
      User,
      Box,
      Setting,
      Calendar,
      TrendCharts,
      Document
    }
    
    // 从共享 store 获取决策场景
    const scenarios = useDecisionScenarios()
    
    // 场景表单数据
    const scenarioForm = ref({
      name: '',
      description: '',
      type: '',
      priority: 'medium',
      triggers: [],
      dimensions: [],
      notifications: true,
      notes: ''
    })
    
    // 表单验证规则
    const scenarioRules = ref({
      name: [
        { required: true, message: '请输入场景名称', trigger: 'blur' },
        { min: 2, max: 50, message: '场景名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入场景描述', trigger: 'blur' },
        { min: 10, max: 200, message: '场景描述长度在 10 到 200 个字符', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择场景类型', trigger: 'change' }
      ],
      priority: [
        { required: true, message: '请选择优先级', trigger: 'change' }
      ]
    })

    const getStatusType = (status) => {
      const statusMap = {
        '活跃': 'success',
        '正常': 'primary',
        '维护': 'warning',
        '停用': 'info'
      }
      return statusMap[status] || 'info'
    }

    const createScenario = () => {
      showCreateDialog.value = true
      // 重置表单
      resetForm()
    }

    const resetForm = () => {
      scenarioForm.value = {
        name: '',
        description: '',
        type: '',
        priority: 'medium',
        triggers: [],
        dimensions: [],
        notifications: true,
        notes: ''
      }
      // 清除验证
      nextTick(() => {
        if (scenarioFormRef.value) {
          scenarioFormRef.value.clearValidate()
        }
      })
    }

    const handleClose = () => {
      if (submitting.value) {
        ElMessage.warning('正在提交中，请稍候...')
        return
      }
      
      ElMessageBox.confirm(
        '确定要关闭吗？未保存的数据将丢失。',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        showCreateDialog.value = false
        resetForm()
      }).catch(() => {
        // 用户取消
      })
    }

    const handleSubmit = async () => {
      if (!scenarioFormRef.value) return
      
      try {
        await scenarioFormRef.value.validate()
        submitting.value = true
        
        // 模拟提交延迟
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 创建新场景
        const newScenario = {
          id: Date.now(),
          name: scenarioForm.value.name,
          description: scenarioForm.value.description,
          icon: getScenarioIcon(scenarioForm.value.type),
          suggestions: 0,
          adopted: 0,
          status: '正常',
          type: scenarioForm.value.type,
          priority: scenarioForm.value.priority,
          triggers: scenarioForm.value.triggers,
          dimensions: scenarioForm.value.dimensions,
          notifications: scenarioForm.value.notifications,
          notes: scenarioForm.value.notes,
          createTime: new Date().toLocaleString(),
          // 添加 value 字段以兼容 SmartDecision.vue
          value: `${scenarioForm.value.type}_${Date.now()}`
        }
        
        // 使用 store 方法添加场景
        addDecisionScenario(newScenario)
        
        ElMessage.success(`场景"${scenarioForm.value.name}"创建成功！`)
        showCreateDialog.value = false
        resetForm()
        
      } catch (error) {
        console.error('表单验证失败:', error)
        ElMessage.error('请检查表单填写是否完整')
      } finally {
        submitting.value = false
      }
    }

    const getScenarioIcon = (type) => {
      const iconMap = {
        'teaching': 'School',
        'student': 'User',
        'resource': 'Box',
        'system': 'Setting',
        'curriculum': 'Calendar',
        'evaluation': 'TrendCharts',
        'other': 'Document'
      }
      return iconMap[type] || 'Document'
    }

    const viewScenario = (scenario) => {
      ElMessage.info(`查看场景: ${scenario.name}`)
    }

    return {
      scenarios,
      showCreateDialog,
      submitting,
      scenarioFormRef,
      scenarioForm,
      scenarioRules,
      iconMap,
      getStatusType,
      createScenario,
      resetForm,
      handleClose,
      handleSubmit,
      getScenarioIcon,
      viewScenario
    }
  }
}
</script>

<style scoped>
.decision-scenarios {
  width: 100%;
}

.scenarios-card {
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

.scenarios-list {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
}

.scenario-item {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 0 0 auto;
  width: calc((100% - 48px) / 4);
  min-width: 240px;
  max-width: 300px;
}

/* 当每行只有3个卡片时 */
@media (max-width: 1200px) {
  .scenario-item {
    width: calc((100% - 32px) / 3);
  }
}

/* 当每行只有2个卡片时 */
@media (max-width: 960px) {
  .scenario-item {
    width: calc((100% - 16px) / 2);
  }
}

/* 当每行只有1个卡片时 */
@media (max-width: 600px) {
  .scenario-item {
    width: 100%;
  }
}

.scenario-item:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.scenario-header {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.scenario-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.scenario-item:hover .scenario-icon {
  transform: scale(1.1);
}

.scenario-header h4 {
  margin: 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.scenario-content {
  flex: 1;
  width: 100%;
}

.scenario-content p {
  margin: 0 0 12px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.4;
}

.scenario-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
}

.scenario-status {
  flex-shrink: 0;
}

.scenario-form {
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
  
  .el-select {
    width: 100%;
  }
  
  .el-select .el-input__wrapper {
    border-radius: 8px;
  }
  
  .el-select__wrapper {
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .el-select__wrapper:hover {
    box-shadow: 0 0 0 1px #667eea;
  }
  
  .el-radio-group {
    display: flex;
    gap: 16px;
  }
  
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .el-switch {
    --el-switch-on-color: #667eea;
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


