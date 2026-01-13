<template>
  <div class="knowledge-template">
    <div class="section-header">
      <h3>知识模版</h3>
      <p>预置知识类型模板库，支持自定义元数据字段、展示页面和关联关系</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ templates.length }}</div>
            <div class="stat-label">模板总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ templateTypes.length }}</div>
            <div class="stat-label">模板类型</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ totalUsage }}</div>
            <div class="stat-label">使用次数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ customTemplatesCount }}</div>
            <div class="stat-label">自定义模板</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索与筛选栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="left-panel">
            <el-input
              v-model="searchQuery"
              placeholder="搜索模板名称或关键词"
              style="width: 300px; margin-right: 15px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="模板类型" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option
                v-for="type in templateTypes"
                :key="type"
                :label="type"
                :value="type"
              />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="success" @click="handleCreateTemplate">新建模板</el-button>
          </div>
        </div>
      </template>

      <!-- 模板列表 -->
      <el-table :data="filteredTemplates" stripe style="width: 100%">
        <el-table-column prop="name" label="模板名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="模板类型" min-width="150">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="metadataFields" label="元数据字段" min-width="120" align="center">
          <template #default="scope">
            <span>{{ scope.row.metadataFields }} 个</span>
          </template>
        </el-table-column>
        <el-table-column prop="usageCount" label="使用次数" min-width="100" align="center" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" />
        <el-table-column label="操作" width="350" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleView(scope.row)">查看</el-button>
            <el-button link type="warning" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="success" @click="handleCopy(scope.row)">复制</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 模板详情/编辑弹窗 -->
    <el-drawer
      v-model="detailVisible"
      :title="drawerTitle"
      size="70%"
      destroy-on-close
    >
      <div v-if="currentTemplate" class="template-detail">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-form :model="currentTemplate" label-width="120px" style="max-width: 800px">
              <el-form-item label="模板名称">
                <el-input v-model="currentTemplate.name" placeholder="请输入模板名称" />
              </el-form-item>
              <el-form-item label="模板类型">
                <el-select v-model="currentTemplate.type" placeholder="请选择模板类型" style="width: 100%">
                  <el-option
                    v-for="type in templateTypes"
                    :key="type"
                    :label="type"
                    :value="type"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="模板描述">
                <el-input
                  v-model="currentTemplate.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入模板描述"
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-radio-group v-model="currentTemplate.status">
                  <el-radio label="启用">启用</el-radio>
                  <el-radio label="禁用">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 元数据字段 -->
          <el-tab-pane label="元数据字段" name="metadata">
            <div class="metadata-section">
              <div class="section-header-bar">
                <h4>字段配置</h4>
                <el-button type="primary" size="small" @click="handleAddField">添加字段</el-button>
              </div>
              <el-table :data="currentTemplate.metadataFieldsList" stripe border>
                <el-table-column prop="fieldName" label="字段名称" min-width="150" />
                <el-table-column prop="fieldType" label="字段类型" min-width="120">
                  <template #default="scope">
                    <el-tag size="small">{{ scope.row.fieldType }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="required" label="必填" min-width="80" align="center">
                  <template #default="scope">
                    <el-tag :type="scope.row.required ? 'danger' : 'info'" size="small">
                      {{ scope.row.required ? '是' : '否' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="defaultValue" label="默认值" min-width="150" />
                <el-table-column prop="description" label="字段说明" min-width="200" show-overflow-tooltip />
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" @click="handleEditField(scope.row, scope.$index)">编辑</el-button>
                    <el-button link type="danger" @click="handleDeleteField(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>

          <!-- 展示页面 -->
          <el-tab-pane label="展示页面" name="display">
            <el-form :model="currentTemplate" label-width="120px" style="max-width: 800px">
              <el-form-item label="页面布局">
                <el-radio-group v-model="currentTemplate.displayLayout">
                  <el-radio label="standard">标准布局</el-radio>
                  <el-radio label="compact">紧凑布局</el-radio>
                  <el-radio label="detailed">详细布局</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="显示字段">
                <el-checkbox-group v-model="currentTemplate.displayFields">
                  <el-checkbox
                    v-for="field in currentTemplate.metadataFieldsList"
                    :key="field.fieldName"
                    :label="field.fieldName"
                  >
                    {{ field.fieldName }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="排序字段">
                <el-select v-model="currentTemplate.sortField" placeholder="请选择排序字段" style="width: 300px">
                  <el-option
                    v-for="field in currentTemplate.metadataFieldsList"
                    :key="field.fieldName"
                    :label="field.fieldName"
                    :value="field.fieldName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="排序方式">
                <el-radio-group v-model="currentTemplate.sortOrder">
                  <el-radio label="asc">升序</el-radio>
                  <el-radio label="desc">降序</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 关联关系 -->
          <el-tab-pane label="关联关系" name="relations">
            <div class="relations-section">
              <div class="section-header-bar">
                <h4>关联规则配置</h4>
                <el-button type="primary" size="small" @click="handleAddRelation">添加关联</el-button>
              </div>
              <el-table :data="currentTemplate.relations" stripe border>
                <el-table-column prop="targetTemplate" label="关联模板" min-width="150" />
                <el-table-column prop="relationType" label="关联类型" min-width="120">
                  <template #default="scope">
                    <el-tag size="small">{{ scope.row.relationType }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceField" label="源字段" min-width="150" />
                <el-table-column prop="targetField" label="目标字段" min-width="150" />
                <el-table-column prop="description" label="关联说明" min-width="200" show-overflow-tooltip />
                <el-table-column label="操作" width="150" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" @click="handleEditRelation(scope.row, scope.$index)">编辑</el-button>
                    <el-button link type="danger" @click="handleDeleteRelation(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="drawer-actions">
          <el-button @click="detailVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveTemplate">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const selectedType = ref('')
const detailVisible = ref(false)
const currentTemplate = ref(null)
const activeTab = ref('basic')
const isEditMode = ref(false)

const templateTypes = ref([
  '最佳实践',
  '工作周报',
  '制度规范',
  '会议纪要',
  '操作手册',
  '复盘方案',
  '思维导图'
])

const templates = ref([
  {
    id: 1,
    name: '项目最佳实践模板',
    type: '最佳实践',
    description: '用于记录项目成功经验和最佳实践',
    metadataFields: 8,
    metadataFieldsList: [
      { fieldName: '项目名称', fieldType: '文本', required: true, defaultValue: '', description: '项目名称' },
      { fieldName: '项目背景', fieldType: '文本域', required: true, defaultValue: '', description: '项目背景介绍' },
      { fieldName: '实践内容', fieldType: '富文本', required: true, defaultValue: '', description: '具体实践内容' },
      { fieldName: '适用场景', fieldType: '多选', required: false, defaultValue: '', description: '适用场景' },
      { fieldName: '效果评估', fieldType: '文本域', required: false, defaultValue: '', description: '效果评估' },
      { fieldName: '创建人', fieldType: '用户', required: true, defaultValue: '', description: '创建人' },
      { fieldName: '创建时间', fieldType: '日期', required: true, defaultValue: '', description: '创建时间' },
      { fieldName: '标签', fieldType: '标签', required: false, defaultValue: '', description: '标签' }
    ],
    usageCount: 156,
    status: '启用',
    createTime: '2024-01-15',
    displayLayout: 'standard',
    displayFields: ['项目名称', '项目背景', '实践内容', '创建人', '创建时间'],
    sortField: '创建时间',
    sortOrder: 'desc',
    relations: [
      { targetTemplate: '项目文档模板', relationType: '关联', sourceField: '项目名称', targetField: '项目名称', description: '关联项目文档' }
    ]
  },
  {
    id: 2,
    name: '周报模板',
    type: '工作周报',
    description: '标准工作周报模板',
    metadataFields: 6,
    metadataFieldsList: [
      { fieldName: '周次', fieldType: '数字', required: true, defaultValue: '', description: '周次' },
      { fieldName: '本周工作', fieldType: '富文本', required: true, defaultValue: '', description: '本周完成的工作' },
      { fieldName: '下周计划', fieldType: '富文本', required: true, defaultValue: '', description: '下周工作计划' },
      { fieldName: '遇到的问题', fieldType: '文本域', required: false, defaultValue: '', description: '遇到的问题' },
      { fieldName: '汇报人', fieldType: '用户', required: true, defaultValue: '', description: '汇报人' },
      { fieldName: '汇报时间', fieldType: '日期', required: true, defaultValue: '', description: '汇报时间' }
    ],
    usageCount: 892,
    status: '启用',
    createTime: '2024-01-10',
    displayLayout: 'compact',
    displayFields: ['周次', '本周工作', '下周计划', '汇报人', '汇报时间'],
    sortField: '汇报时间',
    sortOrder: 'desc',
    relations: []
  },
  {
    id: 3,
    name: '制度规范模板',
    type: '制度规范',
    description: '制度规范文档模板',
    metadataFields: 7,
    metadataFieldsList: [
      { fieldName: '制度名称', fieldType: '文本', required: true, defaultValue: '', description: '制度名称' },
      { fieldName: '制度编号', fieldType: '文本', required: true, defaultValue: '', description: '制度编号' },
      { fieldName: '适用范围', fieldType: '文本域', required: true, defaultValue: '', description: '适用范围' },
      { fieldName: '主要内容', fieldType: '富文本', required: true, defaultValue: '', description: '主要内容' },
      { fieldName: '生效日期', fieldType: '日期', required: true, defaultValue: '', description: '生效日期' },
      { fieldName: '制定部门', fieldType: '部门', required: true, defaultValue: '', description: '制定部门' },
      { fieldName: '审核状态', fieldType: '单选', required: true, defaultValue: '待审核', description: '审核状态' }
    ],
    usageCount: 234,
    status: '启用',
    createTime: '2024-01-08',
    displayLayout: 'detailed',
    displayFields: ['制度名称', '制度编号', '适用范围', '主要内容', '生效日期', '制定部门', '审核状态'],
    sortField: '生效日期',
    sortOrder: 'desc',
    relations: []
  },
  {
    id: 4,
    name: '会议纪要模板',
    type: '会议纪要',
    description: '标准会议纪要模板',
    metadataFields: 8,
    metadataFieldsList: [
      { fieldName: '会议主题', fieldType: '文本', required: true, defaultValue: '', description: '会议主题' },
      { fieldName: '会议时间', fieldType: '日期时间', required: true, defaultValue: '', description: '会议时间' },
      { fieldName: '会议地点', fieldType: '文本', required: false, defaultValue: '', description: '会议地点' },
      { fieldName: '参会人员', fieldType: '用户组', required: true, defaultValue: '', description: '参会人员' },
      { fieldName: '会议内容', fieldType: '富文本', required: true, defaultValue: '', description: '会议内容' },
      { fieldName: '会议决议', fieldType: '富文本', required: false, defaultValue: '', description: '会议决议' },
      { fieldName: '待办事项', fieldType: '列表', required: false, defaultValue: '', description: '待办事项' },
      { fieldName: '记录人', fieldType: '用户', required: true, defaultValue: '', description: '记录人' }
    ],
    usageCount: 567,
    status: '启用',
    createTime: '2024-01-12',
    displayLayout: 'standard',
    displayFields: ['会议主题', '会议时间', '参会人员', '会议内容', '会议决议', '记录人'],
    sortField: '会议时间',
    sortOrder: 'desc',
    relations: []
  },
  {
    id: 5,
    name: '操作手册模板',
    type: '操作手册',
    description: '系统操作手册模板',
    metadataFields: 6,
    metadataFieldsList: [
      { fieldName: '手册名称', fieldType: '文本', required: true, defaultValue: '', description: '手册名称' },
      { fieldName: '系统名称', fieldType: '文本', required: true, defaultValue: '', description: '系统名称' },
      { fieldName: '操作步骤', fieldType: '富文本', required: true, defaultValue: '', description: '操作步骤' },
      { fieldName: '注意事项', fieldType: '文本域', required: false, defaultValue: '', description: '注意事项' },
      { fieldName: '适用版本', fieldType: '文本', required: false, defaultValue: '', description: '适用版本' },
      { fieldName: '编写人', fieldType: '用户', required: true, defaultValue: '', description: '编写人' }
    ],
    usageCount: 345,
    status: '启用',
    createTime: '2024-01-20',
    displayLayout: 'standard',
    displayFields: ['手册名称', '系统名称', '操作步骤', '编写人'],
    sortField: '手册名称',
    sortOrder: 'asc',
    relations: []
  },
  {
    id: 6,
    name: '复盘方案模板',
    type: '复盘方案',
    description: '项目复盘方案模板',
    metadataFields: 9,
    metadataFieldsList: [
      { fieldName: '项目名称', fieldType: '文本', required: true, defaultValue: '', description: '项目名称' },
      { fieldName: '复盘日期', fieldType: '日期', required: true, defaultValue: '', description: '复盘日期' },
      { fieldName: '项目目标', fieldType: '文本域', required: true, defaultValue: '', description: '项目目标' },
      { fieldName: '实际结果', fieldType: '文本域', required: true, defaultValue: '', description: '实际结果' },
      { fieldName: '成功因素', fieldType: '富文本', required: false, defaultValue: '', description: '成功因素' },
      { fieldName: '失败原因', fieldType: '富文本', required: false, defaultValue: '', description: '失败原因' },
      { fieldName: '经验教训', fieldType: '富文本', required: true, defaultValue: '', description: '经验教训' },
      { fieldName: '改进建议', fieldType: '富文本', required: false, defaultValue: '', description: '改进建议' },
      { fieldName: '复盘人', fieldType: '用户', required: true, defaultValue: '', description: '复盘人' }
    ],
    usageCount: 123,
    status: '启用',
    createTime: '2024-02-01',
    displayLayout: 'detailed',
    displayFields: ['项目名称', '复盘日期', '项目目标', '实际结果', '经验教训', '复盘人'],
    sortField: '复盘日期',
    sortOrder: 'desc',
    relations: []
  },
  {
    id: 7,
    name: '思维导图模板',
    type: '思维导图',
    description: '思维导图知识模板',
    metadataFields: 5,
    metadataFieldsList: [
      { fieldName: '主题名称', fieldType: '文本', required: true, defaultValue: '', description: '主题名称' },
      { fieldName: '主题分类', fieldType: '单选', required: true, defaultValue: '', description: '主题分类' },
      { fieldName: '导图内容', fieldType: '富文本', required: true, defaultValue: '', description: '导图内容' },
      { fieldName: '关联知识', fieldType: '关联', required: false, defaultValue: '', description: '关联知识' },
      { fieldName: '创建人', fieldType: '用户', required: true, defaultValue: '', description: '创建人' }
    ],
    usageCount: 89,
    status: '启用',
    createTime: '2024-02-05',
    displayLayout: 'standard',
    displayFields: ['主题名称', '主题分类', '导图内容', '创建人'],
    sortField: '主题名称',
    sortOrder: 'asc',
    relations: []
  }
])

const filteredTemplates = computed(() => {
  let result = templates.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(template =>
      template.name.toLowerCase().includes(query) ||
      template.type.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query)
    )
  }

  if (selectedType.value) {
    result = result.filter(template => template.type === selectedType.value)
  }

  return result
})

const totalUsage = computed(() => {
  return templates.value.reduce((sum, t) => sum + t.usageCount, 0)
})

const customTemplatesCount = computed(() => {
  return templates.value.length - templateTypes.value.length
})

const drawerTitle = computed(() => {
  return isEditMode.value ? '编辑模板' : '查看模板'
})

const getTypeTag = (type) => {
  const map = {
    '最佳实践': 'primary',
    '工作周报': 'success',
    '制度规范': 'warning',
    '会议纪要': 'info',
    '操作手册': 'danger',
    '复盘方案': '',
    '思维导图': 'success'
  }
  return map[type] || 'info'
}

const getStatusType = (status) => {
  return status === '启用' ? 'success' : 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleCreateTemplate = () => {
  currentTemplate.value = {
    name: '',
    type: '',
    description: '',
    status: '启用',
    metadataFieldsList: [],
    displayLayout: 'standard',
    displayFields: [],
    sortField: '',
    sortOrder: 'asc',
    relations: []
  }
  isEditMode.value = true
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleView = (row) => {
  currentTemplate.value = JSON.parse(JSON.stringify(row))
  isEditMode.value = false
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleEdit = (row) => {
  currentTemplate.value = JSON.parse(JSON.stringify(row))
  isEditMode.value = true
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleCopy = (row) => {
  const copied = JSON.parse(JSON.stringify(row))
  copied.id = templates.value.length + 1
  copied.name = copied.name + ' (副本)'
  copied.usageCount = 0
  copied.createTime = new Date().toISOString().split('T')[0]
  templates.value.push(copied)
  ElMessage.success('模板已复制')
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除模板 "${row.name}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = templates.value.findIndex(t => t.id === row.id)
    if (index > -1) {
      templates.value.splice(index, 1)
      ElMessage.success('模板已删除')
    }
  }).catch(() => {})
}

const handleAddField = () => {
  if (!currentTemplate.value.metadataFieldsList) {
    currentTemplate.value.metadataFieldsList = []
  }
  currentTemplate.value.metadataFieldsList.push({
    fieldName: '',
    fieldType: '文本',
    required: false,
    defaultValue: '',
    description: ''
  })
  ElMessage.info('请填写字段信息')
}

const handleEditField = (field, index) => {
  ElMessage.info(`编辑字段: ${field.fieldName}`)
}

const handleDeleteField = (index) => {
  currentTemplate.value.metadataFieldsList.splice(index, 1)
  currentTemplate.value.metadataFields = currentTemplate.value.metadataFieldsList.length
  ElMessage.success('字段已删除')
}

const handleAddRelation = () => {
  if (!currentTemplate.value.relations) {
    currentTemplate.value.relations = []
  }
  currentTemplate.value.relations.push({
    targetTemplate: '',
    relationType: '关联',
    sourceField: '',
    targetField: '',
    description: ''
  })
}

const handleEditRelation = (relation, index) => {
  ElMessage.info(`编辑关联: ${relation.targetTemplate}`)
}

const handleDeleteRelation = (index) => {
  currentTemplate.value.relations.splice(index, 1)
  ElMessage.success('关联已删除')
}

const handleSaveTemplate = () => {
  if (currentTemplate.value.metadataFieldsList) {
    currentTemplate.value.metadataFields = currentTemplate.value.metadataFieldsList.length
  }
  ElMessage.success('模板已保存')
  detailVisible.value = false
}
</script>

<style scoped>
.knowledge-template {
  padding: 0;
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

.stats-cards {
  margin-bottom: 20px;
}

.stat-card .stat-content {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.left-panel {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.template-detail {
  padding: 0;
}

.detail-tabs {
  margin-bottom: 20px;
}

.metadata-section,
.relations-section {
  margin-top: 20px;
}

.section-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header-bar h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.drawer-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>

