import { ref } from 'vue'

// localStorage 键名
const STORAGE_KEYS = {
  EVALUATION_TYPES: 'decision_evaluation_types',
  DECISION_SCENARIOS: 'decision_scenarios',
  DECISION_SUGGESTIONS: 'decision_suggestions'
}

// localStorage 工具函数
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`保存到 localStorage 失败 (${key}):`, error)
  }
}

function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error(`从 localStorage 读取失败 (${key}):`, error)
  }
  return defaultValue
}

// 默认的评选类型数据
const defaultEvaluationTypes = [
  {
    value: 'teaching',
    label: '教学型教师',
    description: '专注于教学工作的评选类型',
    icon: 'Notebook',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    selected: false,
    assessmentItems: [
      '教学工作量',
      '教学工作质量',
      '教学完成度',
      '教学研究与改革',
      '学生评价',
      '学生学情分析数据',
      '督导评价',
      '科研成果',
      '证书与认证',
      '智能胜任力'
    ]
  },
  {
    value: 'teaching_research',
    label: '教学科研型教师',
    description: '教学与科研并重的评选类型',
    icon: 'School',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    selected: false,
    assessmentItems: [
      '教学工作量',
      '教学工作质量',
      '教学完成度',
      '教学研究与改革',
      '学生评价',
      '学生学情分析数据',
      '督导评价',
      '科研成果',
      '证书与认证',
      '智能胜任力'
    ]
  },
  {
    value: 'research',
    label: '科研型教师',
    description: '专注于科研工作的评选类型',
    icon: 'DataAnalysis',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    selected: false,
    assessmentItems: [
      '科研项目数量',
      '科研项目经费成本',
      '科研项目成果质量',
      '科研成果（论文、专著、专利等）',
      '科研获奖'
    ]
  },
  {
    value: 'social_service',
    label: '社会服务型教师',
    description: '注重社会服务和产教融合的评选类型',
    icon: 'Briefcase',
    color: 'linear-gradient(135deg, #43e97b 0%, #38d9a9 100%)',
    selected: false,
    assessmentItems: [
      '公共服务参与度',
      '产教融合项目',
      '技术成果转化',
      '横向课题'
    ]
  },
  {
    value: 'administrative',
    label: '行政管理人员',
    description: '行政管理岗位的评选类型',
    icon: 'Management',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    selected: false,
    assessmentItems: [
      '德能勤绩廉综合表现',
      '服务对象满意度',
      '管理效率与规范性',
      '工作失误与事故'
    ]
  }
]

// 全局共享的决策场景列表
const decisionScenarios = ref([
  {
    id: 1,
    name: '教学优化',
    description: '基于学生学习数据优化教学策略',
    icon: 'School',
    iconColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    suggestions: 12,
    adopted: 8,
    status: '活跃',
    value: 'teaching_optimization'
  },
  {
    id: 2,
    name: '学生管理',
    description: '智能分析学生行为，提供管理建议',
    icon: 'User',
    iconColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    suggestions: 8,
    adopted: 5,
    status: '活跃',
    value: 'student_management'
  },
  {
    id: 3,
    name: '资源分配',
    description: '优化教学资源配置，提高利用效率',
    icon: 'Box',
    iconColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    suggestions: 6,
    adopted: 4,
    status: '正常',
    value: 'resource_allocation'
  },
  {
    id: 4,
    name: '系统优化',
    description: '基于使用数据优化系统性能',
    icon: 'Setting',
    iconColor: 'linear-gradient(135deg, #43e97b 0%, #38d9a9 100%)',
    suggestions: 4,
    adopted: 3,
    status: '正常',
    value: 'system_optimization'
  },
  {
    id: 5,
    name: '课程规划',
    description: '智能推荐课程安排和内容调整',
    icon: 'Calendar',
    iconColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    suggestions: 10,
    adopted: 7,
    status: '活跃',
    value: 'curriculum_planning'
  },
  {
    id: 6,
    name: '评估改进',
    description: '分析评估结果，提供改进建议',
    icon: 'TrendCharts',
    iconColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    suggestions: 7,
    adopted: 5,
    status: '正常',
    value: 'evaluation_improvement'
  }
])

// 全局共享的决策建议列表
const decisionSuggestions = ref([
  {
    title: '优化数学课程教学节奏',
    description: '根据学生掌握情况，建议调整数学课程的教学进度，增加练习时间',
    category: 'teaching',
    priority: '高',
    createTime: '2024-01-15 14:30',
    expectedEffect: '提高15%学习效果',
    value: 'teaching_optimization',
    label: '优化数学课程教学节奏'
  },
  {
    title: '调整班级座位安排',
    description: '基于学生互动数据分析，建议重新安排座位以促进学习交流',
    category: 'student',
    priority: '中',
    createTime: '2024-01-15 13:20',
    expectedEffect: '提升20%课堂参与度',
    value: 'student_seating',
    label: '调整班级座位安排'
  },
  {
    title: '增加实验设备投入',
    description: '根据实验课程需求分析，建议增加物理实验设备配置',
    category: 'resource',
    priority: '高',
    createTime: '2024-01-15 12:15',
    expectedEffect: '改善30%实验效果',
    value: 'equipment_investment',
    label: '增加实验设备投入'
  },
  {
    title: '优化系统响应速度',
    description: '基于用户使用数据分析，建议优化系统查询性能',
    category: 'system',
    priority: '中',
    createTime: '2024-01-15 11:45',
    expectedEffect: '提升40%响应速度',
    value: 'system_performance',
    label: '优化系统响应速度'
  }
])

// 决策场景相关方法
export function setDecisionScenarios(scenarios) {
  if (!Array.isArray(scenarios)) return
  decisionScenarios.value = scenarios
  saveToStorage(STORAGE_KEYS.DECISION_SCENARIOS, scenarios)
}

export function addDecisionScenario(scenario) {
  if (!scenario) return
  const existingIndex = decisionScenarios.value.findIndex(s => s.id === scenario.id || s.value === scenario.value)
  if (existingIndex === -1) {
    // 添加到列表开头，保持与原有行为一致
    decisionScenarios.value.unshift(scenario)
  } else {
    decisionScenarios.value[existingIndex] = scenario
  }
  saveToStorage(STORAGE_KEYS.DECISION_SCENARIOS, decisionScenarios.value)
}

export function removeDecisionScenario(id) {
  const index = decisionScenarios.value.findIndex(s => s.id === id)
  if (index > -1) {
    decisionScenarios.value.splice(index, 1)
    saveToStorage(STORAGE_KEYS.DECISION_SCENARIOS, decisionScenarios.value)
  }
}

// 更新场景的采纳数量
export function incrementScenarioAdopted(category) {
  // 根据 category 找到对应的场景
  const categoryToScenarioMap = {
    'teaching': 'teaching_optimization',
    'student': 'student_management',
    'resource': 'resource_allocation',
    'system': 'system_optimization',
    'curriculum': 'curriculum_planning',
    'evaluation': 'evaluation_improvement'
  }
  
  const scenarioValue = categoryToScenarioMap[category]
  if (!scenarioValue) return
  
  const scenario = decisionScenarios.value.find(s => s.value === scenarioValue)
  if (scenario) {
    scenario.adopted = (scenario.adopted || 0) + 1
    saveToStorage(STORAGE_KEYS.DECISION_SCENARIOS, decisionScenarios.value)
  }
}

export function useDecisionScenarios() {
  return decisionScenarios
}

// 决策建议相关方法
export function setDecisionSuggestions(suggestions) {
  if (!Array.isArray(suggestions)) return
  decisionSuggestions.value = suggestions
  saveToStorage(STORAGE_KEYS.DECISION_SUGGESTIONS, suggestions)
}

export function addDecisionSuggestion(suggestion) {
  if (!suggestion) return
  const existingIndex = decisionSuggestions.value.findIndex(s => s.value === suggestion.value || s.title === suggestion.title)
  if (existingIndex === -1) {
    // 添加到列表开头，保持与原有行为一致
    decisionSuggestions.value.unshift(suggestion)
  } else {
    decisionSuggestions.value[existingIndex] = suggestion
  }
  saveToStorage(STORAGE_KEYS.DECISION_SUGGESTIONS, decisionSuggestions.value)
}

export function removeDecisionSuggestion(value) {
  const index = decisionSuggestions.value.findIndex(s => s.value === value || s.title === value)
  if (index > -1) {
    decisionSuggestions.value.splice(index, 1)
    saveToStorage(STORAGE_KEYS.DECISION_SUGGESTIONS, decisionSuggestions.value)
  }
}

export function useDecisionSuggestions() {
  return decisionSuggestions
}

// 全局共享的评选类型列表（从 localStorage 恢复或使用默认值）
const evaluationTypes = ref(loadFromStorage(STORAGE_KEYS.EVALUATION_TYPES, defaultEvaluationTypes))

// 评选类型相关方法
export function setEvaluationTypes(types) {
  if (!Array.isArray(types)) return
  evaluationTypes.value = types
  saveToStorage(STORAGE_KEYS.EVALUATION_TYPES, types)
}

export function addEvaluationType(type) {
  if (!type) return
  const existingIndex = evaluationTypes.value.findIndex(t => t.value === type.value)
  if (existingIndex === -1) {
    evaluationTypes.value.push(type)
  } else {
    evaluationTypes.value[existingIndex] = type
  }
  saveToStorage(STORAGE_KEYS.EVALUATION_TYPES, evaluationTypes.value)
}

export function removeEvaluationType(value) {
  const index = evaluationTypes.value.findIndex(t => t.value === value)
  if (index > -1) {
    evaluationTypes.value.splice(index, 1)
    saveToStorage(STORAGE_KEYS.EVALUATION_TYPES, evaluationTypes.value)
  }
}

// 更新单个评选类型的配置（用于保存考核内容配置）
export function updateEvaluationType(value, updates) {
  const index = evaluationTypes.value.findIndex(t => t.value === value)
  if (index > -1) {
    evaluationTypes.value[index] = {
      ...evaluationTypes.value[index],
      ...updates
    }
    saveToStorage(STORAGE_KEYS.EVALUATION_TYPES, evaluationTypes.value)
    return true
  }
  return false
}

export function useEvaluationTypes() {
  return evaluationTypes
}

