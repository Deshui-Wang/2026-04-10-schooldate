<template>
  <div class="decision-support">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon class="title-icon"><Lightbulb /></el-icon>
          智能决策支持
        </h1>
        <p class="page-subtitle">基于AI的智能决策建议与方案推荐</p>
      </div>
    </div>

    <div class="decision-content">
      <!-- 决策概览 -->
      <el-row :gutter="24" class="overview-section">
        <el-col :span="6">
          <el-card class="decision-card">
            <div class="card-content">
              <div class="card-icon">
                <el-icon><Lightbulb /></el-icon>
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
              <div class="card-icon">
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
              <div class="card-icon">
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
              <div class="card-icon">
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

      <!-- 决策场景 -->
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
        
        <el-row :gutter="24">
          <el-col :span="8" v-for="scenario in scenarios" :key="scenario.id">
            <div class="scenario-item" @click="viewScenario(scenario)">
              <div class="scenario-icon">
                <el-icon><component :is="scenario.icon" /></el-icon>
              </div>
              <div class="scenario-content">
                <h4>{{ scenario.name }}</h4>
                <p>{{ scenario.description }}</p>
                <div class="scenario-stats">
                  <span class="stat-item">
                    <el-icon><Lightbulb /></el-icon>
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
          </el-col>
        </el-row>
      </el-card>

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
          <div class="suggestion-item" v-for="(suggestion, index) in filteredSuggestions" :key="index">
            <div class="suggestion-priority">
              <el-tag :type="getPriorityType(suggestion.priority)" size="small">
                {{ suggestion.priority }}
              </el-tag>
            </div>
            <div class="suggestion-content">
              <h4>{{ suggestion.title }}</h4>
              <p>{{ suggestion.description }}</p>
              <div class="suggestion-meta">
                <span class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  {{ suggestion.createTime }}
                </span>
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ suggestion.category }}
                </span>
                <span class="meta-item">
                  <el-icon><TrendCharts /></el-icon>
                  预期效果: {{ suggestion.expectedEffect }}
                </span>
              </div>
            </div>
            <div class="suggestion-actions">
              <el-button type="success" size="small" @click="adoptSuggestion(suggestion)">
                <el-icon><Check /></el-icon>
                采纳
              </el-button>
              <el-button size="small" @click="viewDetails(suggestion)">
                <el-icon><View /></el-icon>
                详情
              </el-button>
              <el-button type="danger" size="small" @click="rejectSuggestion(suggestion)">
                <el-icon><Close /></el-icon>
                拒绝
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

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

    <!-- 新建场景弹层 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建决策场景"
      width="600px"
      :before-close="handleClose"
      class="create-scenario-dialog"
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
            <el-icon><Magic /></el-icon>
            生成建议
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'DecisionSupport',
  setup() {
    const selectedCategory = ref('all')
    const showCreateDialog = ref(false)
    const submitting = ref(false)
    const scenarioFormRef = ref()
    
    // 条件配置相关
    const showConditionDialog = ref(false)
    const savingCondition = ref(false)
    const generatingWithConditions = ref(false)
    const conditionFormRef = ref()
    
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
    
    const scenarios = ref([
      {
        id: 1,
        name: '教学优化',
        description: '基于学生学习数据优化教学策略',
        icon: 'School',
        suggestions: 12,
        adopted: 8,
        status: '活跃'
      },
      {
        id: 2,
        name: '学生管理',
        description: '智能分析学生行为，提供管理建议',
        icon: 'User',
        suggestions: 8,
        adopted: 5,
        status: '活跃'
      },
      {
        id: 3,
        name: '资源分配',
        description: '优化教学资源配置，提高利用效率',
        icon: 'Box',
        suggestions: 6,
        adopted: 4,
        status: '正常'
      },
      {
        id: 4,
        name: '系统优化',
        description: '基于使用数据优化系统性能',
        icon: 'Setting',
        suggestions: 4,
        adopted: 3,
        status: '正常'
      },
      {
        id: 5,
        name: '课程规划',
        description: '智能推荐课程安排和内容调整',
        icon: 'Calendar',
        suggestions: 10,
        adopted: 7,
        status: '活跃'
      },
      {
        id: 6,
        name: '评估改进',
        description: '分析评估结果，提供改进建议',
        icon: 'TrendCharts',
        suggestions: 7,
        adopted: 5,
        status: '正常'
      }
    ])

    const suggestions = ref([
      {
        title: '优化数学课程教学节奏',
        description: '根据学生掌握情况，建议调整数学课程的教学进度，增加练习时间',
        category: 'teaching',
        priority: '高',
        createTime: '2024-01-15 14:30',
        expectedEffect: '提高15%学习效果'
      },
      {
        title: '调整班级座位安排',
        description: '基于学生互动数据分析，建议重新安排座位以促进学习交流',
        category: 'student',
        priority: '中',
        createTime: '2024-01-15 13:20',
        expectedEffect: '提升20%课堂参与度'
      },
      {
        title: '增加实验设备投入',
        description: '根据实验课程需求分析，建议增加物理实验设备配置',
        category: 'resource',
        priority: '高',
        createTime: '2024-01-15 12:15',
        expectedEffect: '改善30%实验效果'
      },
      {
        title: '优化系统响应速度',
        description: '基于用户使用数据分析，建议优化系统查询性能',
        category: 'system',
        priority: '中',
        createTime: '2024-01-15 11:45',
        expectedEffect: '提升40%响应速度'
      }
    ])

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

    const filteredSuggestions = computed(() => {
      if (selectedCategory.value === 'all') {
        return suggestions.value
      }
      return suggestions.value.filter(s => s.category === selectedCategory.value)
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

    const getPriorityType = (priority) => {
      const priorityMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'success'
      }
      return priorityMap[priority] || 'info'
    }

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
          createTime: new Date().toLocaleString()
        }
        
        scenarios.value.unshift(newScenario)
        
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

    const generateSuggestions = () => {
      ElMessage.success('正在生成新的决策建议...')
    }

    const adoptSuggestion = (suggestion) => {
      ElMessage.success(`已采纳建议: ${suggestion.title}`)
    }

    const viewDetails = (suggestion) => {
      ElMessage.info(`查看详情: ${suggestion.title}`)
    }

    const rejectSuggestion = (suggestion) => {
      ElMessage.warning(`已拒绝建议: ${suggestion.title}`)
    }

    const exportHistory = () => {
      ElMessage.success('决策历史导出功能开发中...')
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
        suggestions.value.unshift(...newSuggestions)
        
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
        
        suggestions.push({
          title: `${typeMap[type]}建议 ${i + 1}`,
          description: `基于${conditionForm.value.algorithmModel}算法，结合${conditionForm.value.dataSources.join('、')}数据，通过${conditionForm.value.analysisDimensions.join('、')}分析生成的智能建议`,
          category: type,
          priority: priorityMap[priority],
          createTime: new Date().toLocaleString(),
          expectedEffect: `预期提升${Math.floor(Math.random() * 30) + 10}%效果`,
          confidence: conditionForm.value.confidenceThreshold,
          conditions: conditionForm.value
        })
      }
      
      return suggestions
    }

    const formatConfidenceTooltip = (val) => {
      return `${Math.round(val * 100)}%`
    }

    return {
      selectedCategory,
      scenarios,
      suggestions,
      decisionHistory,
      filteredSuggestions,
      showCreateDialog,
      submitting,
      scenarioFormRef,
      scenarioForm,
      scenarioRules,
      // 条件配置相关
      showConditionDialog,
      savingCondition,
      generatingWithConditions,
      conditionFormRef,
      conditionForm,
      conditionRules,
      getStatusType,
      getPriorityType,
      getDecisionType,
      getResultType,
      createScenario,
      resetForm,
      handleClose,
      handleSubmit,
      getScenarioIcon,
      viewScenario,
      generateSuggestions,
      adoptSuggestion,
      viewDetails,
      rejectSuggestion,
      exportHistory,
      // 条件配置方法
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
.decision-support {
  padding: 0;
  animation: fadeInUp 0.8s ease-out;
}

.page-header {
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.page-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
}

.decision-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
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

.scenario-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  height: 200px;
  margin-bottom: 20px;
}

.scenario-item:hover {
  background: rgba(102, 126, 234, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.scenario-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-bottom: 16px;
}

.scenario-content {
  flex: 1;
}

.scenario-content h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
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
  margin-top: 12px;
}

.suggestions-card {
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
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
}

.suggestion-content h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
  font-size: 16px;
  font-weight: 600;
}

.suggestion-content p {
  margin: 0 0 12px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
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
}

.history-card {
  margin-bottom: 24px;
}

/* 弹层样式 */
:deep(.create-scenario-dialog),
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

.scenario-form,
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
