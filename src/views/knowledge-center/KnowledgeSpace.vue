<template>
  <div class="knowledge-space">
    <div class="section-header">
      <h3>知识空间</h3>
      <p>为项目组、临时任务团队创建专属知识空间，空间内可独立进行知识管理、协作和分享</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ spaces.length }}</div>
            <div class="stat-label">团队空间总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ activeSpacesCount }}</div>
            <div class="stat-label">活跃空间</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ totalDocuments }}</div>
            <div class="stat-label">知识文档</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ pendingReviewCount }}</div>
            <div class="stat-label">待审核</div>
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
              placeholder="搜索空间名称、项目名称或关键词"
              style="width: 300px; margin-right: 15px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedDepartment" placeholder="按部门" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="计算机学院" value="计算机学院" />
              <el-option label="经济学院" value="经济学院" />
              <el-option label="材料学院" value="材料学院" />
              <el-option label="信息学院" value="信息学院" />
              <el-option label="教务处" value="教务处" />
              <el-option label="校办" value="校办" />
              <el-option label="财务处" value="财务处" />
            </el-select>
            <el-select v-model="selectedType" placeholder="按类型" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="项目空间" value="项目空间" />
              <el-option label="任务空间" value="任务空间" />
              <el-option label="临时空间" value="临时空间" />
            </el-select>
            <el-select v-model="selectedDimension" placeholder="按维度" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="教学维度" value="教学维度" />
              <el-option label="科研维度" value="科研维度" />
              <el-option label="管理维度" value="管理维度" />
              <el-option label="创新维度" value="创新维度" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </div>
          <div class="right-panel">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="list">
                <el-icon><List /></el-icon>
                列表
              </el-radio-button>
              <el-radio-button label="card">
                <el-icon><Grid /></el-icon>
                卡片
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>

      <!-- 列表视图 -->
      <el-table v-if="viewMode === 'list'" :data="filteredSpaces" stripe style="width: 100%">
        <el-table-column prop="name" label="空间名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="projectName" label="项目名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="department" label="所属部门" min-width="150" />
        <el-table-column prop="type" label="空间类型" min-width="120">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dimension" label="维度" min-width="120">
          <template #default="scope">
            <el-tag size="small">{{ scope.row.dimension }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="documentCount" label="文档数" min-width="100" align="center" />
        <el-table-column prop="memberCount" label="成员数" min-width="100" align="center" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="150" />
        <el-table-column label="操作" width="300" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="handleManage(scope.row)">管理</el-button>
            <el-button link type="warning" @click="handleReview(scope.row)">审核</el-button>
            <el-button link type="success" @click="handlePublish(scope.row)">发布</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 卡片视图 -->
      <div v-else class="card-view">
        <el-row :gutter="20">
          <el-col v-for="space in filteredSpaces" :key="space.id" :span="6" style="margin-bottom: 20px">
            <el-card shadow="hover" class="space-card-item">
              <div class="card-header-space">
                <div class="card-title">{{ space.name }}</div>
                <el-tag :type="getStatusType(space.status)" size="small">{{ space.status }}</el-tag>
              </div>
              <div class="card-content">
                <div class="card-info-item">
                  <span class="label">项目名称：</span>
                  <span class="value">{{ space.projectName }}</span>
                </div>
                <div class="card-info-item">
                  <span class="label">所属部门：</span>
                  <span class="value">{{ space.department }}</span>
                </div>
                <div class="card-info-item">
                  <span class="label">空间类型：</span>
                  <el-tag :type="getTypeTag(space.type)" size="small">{{ space.type }}</el-tag>
                </div>
                <div class="card-info-item">
                  <span class="label">维度：</span>
                  <el-tag size="small">{{ space.dimension }}</el-tag>
                </div>
                <div class="card-stats">
                  <div class="stat-item">
                    <span class="stat-value">{{ space.documentCount }}</span>
                    <span class="stat-label">文档</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ space.memberCount }}</span>
                    <span class="stat-label">成员</span>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="create-time">{{ space.createTime }}</span>
                </div>
              </div>
              <div class="card-actions">
                <el-button type="primary" size="small" @click="handleManage(space)">管理</el-button>
                <el-button type="warning" size="small" @click="handleReview(space)">审核</el-button>
                <el-button type="success" size="small" @click="handlePublish(space)">发布</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-empty v-if="filteredSpaces.length === 0" description="暂无数据" />
      </div>
    </el-card>

    <!-- 管理弹窗 -->
    <el-drawer
      v-model="manageVisible"
      title="知识空间管理"
      size="60%"
      destroy-on-close
    >
      <div v-if="currentSpace" class="manage-content">
        <div class="manage-header">
          <h3>{{ currentSpace.name }}</h3>
          <el-tag :type="getStatusType(currentSpace.status)" size="large">{{ currentSpace.status }}</el-tag>
        </div>

        <el-tabs v-model="activeTab" class="manage-tabs">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions title="空间信息" :column="2" border>
              <el-descriptions-item label="空间名称">{{ currentSpace.name }}</el-descriptions-item>
              <el-descriptions-item label="空间状态">
                <el-tag :type="getStatusType(currentSpace.status)" size="small">{{ currentSpace.status }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="项目名称">{{ currentSpace.projectName }}</el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ currentSpace.department }}</el-descriptions-item>
              <el-descriptions-item label="空间类型">
                <el-tag :type="getTypeTag(currentSpace.type)" size="small">{{ currentSpace.type }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="维度">{{ currentSpace.dimension }}</el-descriptions-item>
              <el-descriptions-item label="创建时间">{{ currentSpace.createTime }}</el-descriptions-item>
              <el-descriptions-item label="最后更新">{{ currentSpace.lastUpdate || currentSpace.createTime }}</el-descriptions-item>
              <el-descriptions-item label="文档数量">{{ currentSpace.documentCount }} 个</el-descriptions-item>
              <el-descriptions-item label="成员数量">{{ currentSpace.memberCount }} 人</el-descriptions-item>
            </el-descriptions>
            <div class="manage-actions">
              <el-button type="primary" @click="handleEditSpace">编辑空间信息</el-button>
              <el-button type="warning" @click="handleArchiveSpace">归档空间</el-button>
              <el-button type="danger" @click="handleDeleteSpace">删除空间</el-button>
            </div>
          </el-tab-pane>

          <!-- 成员管理 -->
          <el-tab-pane label="成员管理" name="members">
            <div class="members-header">
              <el-input
                v-model="memberSearch"
                placeholder="搜索成员"
                style="width: 300px; margin-bottom: 15px"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="handleAddMember">添加成员</el-button>
            </div>
            <el-table :data="filteredMembers" stripe>
              <el-table-column prop="name" label="姓名" min-width="120" />
              <el-table-column prop="role" label="角色" min-width="120">
                <template #default="scope">
                  <el-tag :type="getRoleType(scope.row.role)" size="small">{{ scope.row.role }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="department" label="部门" min-width="150" />
              <el-table-column prop="joinTime" label="加入时间" min-width="150" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button link type="primary" @click="handleEditMember(scope.row)">编辑</el-button>
                  <el-button link type="danger" @click="handleRemoveMember(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 文档管理 -->
          <el-tab-pane label="文档管理" name="documents">
            <div class="documents-header">
              <el-input
                v-model="documentSearch"
                placeholder="搜索文档"
                style="width: 300px; margin-bottom: 15px"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="handleUploadDocument">上传文档</el-button>
            </div>
            <el-table :data="filteredDocuments" stripe>
              <el-table-column prop="name" label="文档名称" min-width="250" show-overflow-tooltip />
              <el-table-column prop="type" label="类型" min-width="100" />
              <el-table-column prop="size" label="大小" min-width="100" />
              <el-table-column prop="uploader" label="上传人" min-width="120" />
              <el-table-column prop="uploadTime" label="上传时间" min-width="150" />
              <el-table-column prop="status" label="状态" min-width="100">
                <template #default="scope">
                  <el-tag :type="getDocStatusType(scope.row.status)" size="small">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="250">
                <template #default="scope">
                  <el-button link type="primary" @click="handleViewDocument(scope.row)">查看</el-button>
                  <el-button link type="warning" @click="handleEditDocument(scope.row)">编辑</el-button>
                  <el-button link type="danger" @click="handleDeleteDocument(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- 权限设置 -->
          <el-tab-pane label="权限设置" name="permissions">
            <el-descriptions title="空间权限" :column="1" border>
              <el-descriptions-item label="查看权限">
                <el-radio-group v-model="permissions.view">
                  <el-radio label="public">公开</el-radio>
                  <el-radio label="department">部门内</el-radio>
                  <el-radio label="private">仅成员</el-radio>
                </el-radio-group>
              </el-descriptions-item>
              <el-descriptions-item label="编辑权限">
                <el-radio-group v-model="permissions.edit">
                  <el-radio label="members">所有成员</el-radio>
                  <el-radio label="admin">仅管理员</el-radio>
                </el-radio-group>
              </el-descriptions-item>
              <el-descriptions-item label="下载权限">
                <el-radio-group v-model="permissions.download">
                  <el-radio label="members">所有成员</el-radio>
                  <el-radio label="viewers">查看者及以上</el-radio>
                </el-radio-group>
              </el-descriptions-item>
            </el-descriptions>
            <div class="manage-actions">
              <el-button type="primary" @click="handleSavePermissions">保存权限设置</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, List, Grid } from '@element-plus/icons-vue'

const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedType = ref('')
const selectedDimension = ref('')
const viewMode = ref('list') // 'list' | 'card'
const manageVisible = ref(false)
const currentSpace = ref(null)
const activeTab = ref('basic')
const memberSearch = ref('')
const documentSearch = ref('')
const permissions = ref({
  view: 'department',
  edit: 'members',
  download: 'members'
})

// 生成大量mock数据
const generateSpaces = () => {
  const departments = ['计算机学院', '经济学院', '材料学院', '信息学院', '教务处', '校办', '财务处', '学生处', '科研处', '人事处']
  const types = ['项目空间', '任务空间', '临时空间']
  const dimensions = ['教学维度', '科研维度', '管理维度', '创新维度']
  const statuses = ['活跃', '待审核', '已发布', '已关闭']
  
  const spaceNames = [
    'AI研究项目空间', '教学改革任务空间', '校庆活动临时空间', '创新创业孵化空间', '实验室安全管理空间',
    '课程设计协作空间', '国际交流项目空间', '财务预算审核空间', '学生工作管理空间', '科研项目管理空间',
    '教学质量评估空间', '人才培养方案空间', '信息化建设空间', '资产管理办法空间', '学术论文规范空间',
    '就业指导手册空间', '学科建设报告空间', '教学评估报告空间', '校企合作协议空间', '国际交流方案空间',
    '招生政策文件空间', '财务管理制度空间', '质量评估标准空间', '教师培训计划空间', '学术研究项目空间',
    '课程体系建设空间', '实践教学改革空间', '教学方法创新空间', '学生管理服务空间', '校园文化建设空间',
    '网络安全管理空间', '数据管理分析空间', '系统集成优化空间', '平台运维管理空间', '技术研发创新空间',
    '产品设计开发空间', '市场推广策划空间', '客户服务管理空间', '业务运营优化空间', '战略规划研究空间'
  ]
  
  const projectNames = [
    '基于深度学习的智能教育系统研究', '2024年度教学改革方案', '80周年校庆筹备', '大学生创新创业项目孵化',
    '实验室安全管理制度修订', '2024级课程体系设计', '国际学术交流合作项目', '2024年度财务预算审核',
    '学生事务管理系统升级', '国家自然科学基金项目', '教学质量保障体系建设', '人才培养模式创新',
    '校园信息化三期建设', '固定资产管理系统', '学术论文写作规范培训', '毕业生就业服务优化',
    '重点学科建设规划', '教学效果评估体系', '产学研合作平台建设', '国际交流项目拓展',
    '招生宣传工作优化', '财务内控制度完善', '教学质量监控体系', '教师发展中心建设',
    '人工智能应用研究', '新工科课程体系建设', '实践教学基地建设', '翻转课堂教学改革',
    '学生综合素质评价', '校园文化品牌建设', '网络安全防护升级', '大数据分析平台',
    '系统集成与优化', '云平台运维管理', '技术创新与研发', '产品设计与开发',
    '市场推广策略制定', '客户服务体验优化', '业务流程再造', '战略规划与执行'
  ]
  
  const spaces = []
  for (let i = 0; i < 45; i++) {
    const dept = departments[i % departments.length]
    const type = types[i % types.length]
    const dimension = dimensions[i % dimensions.length]
    const status = statuses[i % statuses.length]
    const name = spaceNames[i % spaceNames.length] + (i > spaceNames.length - 1 ? ` ${Math.floor(i / spaceNames.length) + 1}` : '')
    const projectName = projectNames[i % projectNames.length]
    
    spaces.push({
      id: i + 1,
      name: name,
      projectName: projectName,
      department: dept,
      type: type,
      dimension: dimension,
      documentCount: Math.floor(Math.random() * 200) + 20,
      memberCount: Math.floor(Math.random() * 30) + 5,
      status: status,
      createTime: `2024-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      lastUpdate: `2024-${String(Math.floor(Math.random() * 3) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    })
  }
  
  return spaces
}

const spaces = ref(generateSpaces())

// Mock成员数据
const mockMembers = ref([
  { id: 1, name: '张教授', role: '管理员', department: '计算机学院', joinTime: '2024-01-15' },
  { id: 2, name: '李副教授', role: '编辑者', department: '计算机学院', joinTime: '2024-01-20' },
  { id: 3, name: '王老师', role: '查看者', department: '材料学院', joinTime: '2024-02-01' },
  { id: 4, name: '赵教授', role: '编辑者', department: '信息学院', joinTime: '2024-02-05' },
  { id: 5, name: '陈老师', role: '查看者', department: '经济学院', joinTime: '2024-02-10' }
])

// Mock文档数据
const mockDocuments = ref([
  { id: 1, name: '项目实施方案.docx', type: '文档', size: '2.5MB', uploader: '张教授', uploadTime: '2024-01-16', status: '已发布' },
  { id: 2, name: '技术调研报告.pdf', type: '报告', size: '5.8MB', uploader: '李副教授', uploadTime: '2024-01-18', status: '待审核' },
  { id: 3, name: '会议纪要.docx', type: '文档', size: '1.2MB', uploader: '王老师', uploadTime: '2024-01-20', status: '已发布' },
  { id: 4, name: '数据分析.xlsx', type: '表格', size: '3.4MB', uploader: '赵教授', uploadTime: '2024-01-22', status: '已发布' },
  { id: 5, name: '演示文稿.pptx', type: '演示', size: '8.9MB', uploader: '陈老师', uploadTime: '2024-01-25', status: '待审核' }
])

const activeSpacesCount = computed(() => {
  return spaces.value.filter(s => s.status === '活跃').length
})

const totalDocuments = computed(() => {
  return spaces.value.reduce((sum, s) => sum + s.documentCount, 0)
})

const pendingReviewCount = computed(() => {
  return spaces.value.filter(s => s.status === '待审核').length
})

const filteredSpaces = computed(() => {
  let result = spaces.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(space =>
      space.name.toLowerCase().includes(query) ||
      space.projectName.toLowerCase().includes(query) ||
      space.department.toLowerCase().includes(query)
    )
  }

  if (selectedDepartment.value) {
    result = result.filter(space => space.department === selectedDepartment.value)
  }

  if (selectedType.value) {
    result = result.filter(space => space.type === selectedType.value)
  }

  if (selectedDimension.value) {
    result = result.filter(space => space.dimension === selectedDimension.value)
  }

  return result
})

const filteredMembers = computed(() => {
  if (!memberSearch.value) return mockMembers.value
  const query = memberSearch.value.toLowerCase()
  return mockMembers.value.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.department.toLowerCase().includes(query)
  )
})

const filteredDocuments = computed(() => {
  if (!documentSearch.value) return mockDocuments.value
  const query = documentSearch.value.toLowerCase()
  return mockDocuments.value.filter(d => 
    d.name.toLowerCase().includes(query) || 
    d.uploader.toLowerCase().includes(query)
  )
})

const getStatusType = (status) => {
  const map = {
    '活跃': 'success',
    '待审核': 'warning',
    '已发布': 'info',
    '已关闭': 'danger'
  }
  return map[status] || 'info'
}

const getTypeTag = (type) => {
  const map = {
    '项目空间': 'primary',
    '任务空间': 'success',
    '临时空间': 'warning'
  }
  return map[type] || 'info'
}

const getRoleType = (role) => {
  const map = {
    '管理员': 'danger',
    '编辑者': 'warning',
    '查看者': 'info'
  }
  return map[role] || 'info'
}

const getDocStatusType = (status) => {
  const map = {
    '已发布': 'success',
    '待审核': 'warning',
    '已归档': 'info'
  }
  return map[status] || 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleManage = (row) => {
  currentSpace.value = row
  activeTab.value = 'basic'
  manageVisible.value = true
}

const handleReview = (row) => {
  ElMessage.info(`审核空间: ${row.name}`)
}

const handlePublish = (row) => {
  ElMessage.success(`发布空间: ${row.name}`)
}

const handleEditSpace = () => {
  ElMessage.info('编辑空间信息')
}

const handleArchiveSpace = () => {
  ElMessageBox.confirm('确定要归档该空间吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('空间已归档')
  }).catch(() => {})
}

const handleDeleteSpace = () => {
  ElMessageBox.confirm('确定要删除该空间吗？删除后无法恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('空间已删除')
    manageVisible.value = false
  }).catch(() => {})
}

const handleAddMember = () => {
  ElMessage.info('添加成员')
}

const handleEditMember = (member) => {
  ElMessage.info(`编辑成员: ${member.name}`)
}

const handleRemoveMember = (member) => {
  ElMessageBox.confirm(`确定要移除成员 ${member.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('成员已移除')
  }).catch(() => {})
}

const handleUploadDocument = () => {
  ElMessage.info('上传文档')
}

const handleViewDocument = (doc) => {
  ElMessage.info(`查看文档: ${doc.name}`)
}

const handleEditDocument = (doc) => {
  ElMessage.info(`编辑文档: ${doc.name}`)
}

const handleDeleteDocument = (doc) => {
  ElMessageBox.confirm(`确定要删除文档 ${doc.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('文档已删除')
  }).catch(() => {})
}

const handleSavePermissions = () => {
  ElMessage.success('权限设置已保存')
}
</script>

<style scoped>
.knowledge-space {
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

.right-panel {
  display: flex;
  align-items: center;
}

/* 卡片视图样式 */
.card-view {
  min-height: 400px;
}

.space-card-item {
  height: 100%;
  transition: all 0.3s;
}

.space-card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-header-space {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-content {
  min-height: 200px;
}

.card-info-item {
  margin-bottom: 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.card-info-item .label {
  color: #909399;
  min-width: 80px;
}

.card-info-item .value {
  color: #303133;
  flex: 1;
}

.card-stats {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px 0;
  border-top: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
}

.stat-item {
  text-align: center;
}

.stat-item .stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
}

.stat-item .stat-label {
  font-size: 12px;
  color: #909399;
}

.card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

.create-time {
  font-size: 12px;
  color: #909399;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

.card-actions .el-button {
  flex: 1;
}

/* 管理弹窗样式 */
.manage-content {
  padding: 0;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.manage-header h3 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.manage-tabs {
  margin-top: 20px;
}

.manage-actions {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  gap: 10px;
}

.members-header,
.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .card-view .el-col {
    width: 50% !important;
    max-width: 50% !important;
    flex: 0 0 50% !important;
  }
}

@media (max-width: 768px) {
  .card-view .el-col {
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .right-panel {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
