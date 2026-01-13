<template>
  <div class="knowledge-classification">
    <div class="section-header">
      <h3>知识分类</h3>
      <p>支持学科、职能、项目、资源类型等多种分类法，知识条目可归属于多个分类节点。</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">4</div>
            <div class="stat-label">分类法</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ totalNodes }}</div>
            <div class="stat-label">分类节点</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ allKnowledgeList.length }}</div>
            <div class="stat-label">知识条目</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ pendingCount }}</div>
            <div class="stat-label">待审核</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分类树和内容区域 -->
    <el-row :gutter="20">
      <!-- 左侧分类树 -->
      <el-col :span="7">
        <el-card shadow="never" class="tree-card">
          <el-tabs v-model="activeTab" class="classification-tabs">
            <el-tab-pane label="学科分类" name="discipline">
              <ClassificationTree
                :tree-data="disciplineTree"
                @node-click="handleNodeClick"
                @add-category="handleAddCategory('学科')"
              />
            </el-tab-pane>
            <el-tab-pane label="职能分类" name="function">
              <ClassificationTree
                :tree-data="functionTree"
                @node-click="handleNodeClick"
                @add-category="handleAddCategory('职能')"
              />
            </el-tab-pane>
            <el-tab-pane label="项目分类" name="project">
              <ClassificationTree
                :tree-data="projectTree"
                @node-click="handleNodeClick"
                @add-category="handleAddCategory('项目')"
              />
            </el-tab-pane>
            <el-tab-pane label="资源类型" name="resource">
              <ClassificationTree
                :tree-data="resourceTypeTree"
                @node-click="handleNodeClick"
                @add-category="handleAddCategory('资源')"
              />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>

      <!-- 右侧内容列表 -->
      <el-col :span="17">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{ currentCategory ? currentCategory.label : '全部知识' }}</span>
              <div>
                <el-button type="primary" @click="handleAddKnowledge">新增知识</el-button>
                <el-button @click="handleExport">导出</el-button>
              </div>
            </div>
          </template>

          <!-- 搜索筛选 -->
          <div class="search-bar">
            <el-input v-model="searchQuery" placeholder="搜索知识标题/内容" style="width: 300px" clearable>
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedStatus" placeholder="状态" style="width: 120px; margin-left: 12px">
              <el-option label="全部" value="" />
              <el-option label="已发布" value="published" />
              <el-option label="待审核" value="pending" />
              <el-option label="已下架" value="offline" />
            </el-select>
            <el-button type="primary" style="margin-left: 12px" @click="handleSearch">查询</el-button>
          </div>

          <!-- 知识列表 -->
          <el-table :data="filteredKnowledgeList" stripe style="width: 100%; margin-top: 20px" v-loading="loading">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="title" label="知识标题" min-width="250" show-overflow-tooltip />
            <el-table-column prop="categories" label="所属分类" min-width="200">
              <template #default="scope">
                <div class="category-tags">
                  <el-tag v-for="(cat, type) in scope.row.categories" :key="type" size="small" class="category-tag">
                    {{ type }}: {{ cat.join(', ') }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="创建人" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="160" />
            <el-table-column prop="viewCount" label="浏览量" width="100" align="center"/>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" size="small">
                  {{ getStatusLabel(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
                <el-button link type="warning" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import ClassificationTree from './components/ClassificationTree.vue'

const activeTab = ref('discipline')
const searchQuery = ref('')
const selectedStatus = ref('')
const currentCategory = ref(null)
const loading = ref(false)

// --- 分类树数据 ---
const disciplineTree = ref([
  { id: 1, label: '理学', children: [
    { id: 11, label: '数学', children: [{ id: 111, label: '基础数学' }, { id: 112, label: '应用数学' }] },
    { id: 12, label: '物理学', children: [{ id: 121, label: '理论物理' }, { id: 122, label: '凝聚态物理' }] },
    { id: 13, label: '化学' },
  ] },
  { id: 2, label: '工学', children: [
    { id: 21, label: '计算机科学', children: [{ id: 211, label: '人工智能' }, { id: 212, label: '软件工程' }] },
    { id: 22, label: '材料科学' },
    { id: 23, label: '机械工程' },
  ] },
  { id: 3, label: '管理学', children: [
    { id: 31, label: '工商管理' },
    { id: 32, label: '公共管理' },
  ] },
  { id: 4, label: '文学' },
])

const functionTree = ref([
  { id: 1, label: '教学管理', children: [
    { id: 11, label: '课程管理' },
    { id: 12, label: '学籍管理' },
    { id: 13, label: '考试管理' },
  ] },
  { id: 2, label: '科研管理', children: [
    { id: 21, label: '项目管理' },
    { id: 22, label: '成果管理' },
  ] },
  { id: 3, label: '人事管理', children: [
    { id: 31, label: '招聘管理' },
    { id: 32, label: '薪酬管理' },
    { id: 33, label: '绩效考核' },
  ] },
  { id: 4, label: '财务管理' },
])

const projectTree = ref([
  { id: 1, label: '国家级项目', children: [
    { id: 11, label: '自然科学基金' },
    { id: 12, label: '社会科学基金' },
  ] },
  { id: 2, label: '省部级项目', children: [
    { id: 21, label: '省重点研发' },
    { id: 22, label: '省教育厅项目' },
  ] },
  { id: 3, label: '校级项目', children: [
    { id: 31, label: '青年教师基金' },
    { id: 32, label: '教学改革项目' },
  ] },
  { id: 4, label: '横向项目' },
])

const resourceTypeTree = ref([
  { id: 1, label: '文档', children: [
    { id: 11, label: '制度规范' },
    { id: 12, label: '报告' },
    { id: 13, label: '论文' },
  ] },
  { id: 2, label: '多媒体', children: [
    { id: 21, label: '视频' },
    { id: 22, label: '音频' },
    { id: 23, label: '图片' },
  ] },
  { id: 3, label: '数据集' },
  { id: 4, label: '软件' },
])

// --- 知识列表数据 ---
const allKnowledgeList = ref([
  { id: 1, title: '基于项目式学习的教学方法研究', categories: { discipline: ['工学'], function: ['教学管理'], project: ['教学改革项目'], resource: ['报告'] }, author: '张教授', createTime: '2024-01-15 10:30', viewCount: 256, status: 'published' },
  { id: 2, title: '深度学习在图像识别中的应用', categories: { discipline: ['计算机科学', '人工智能'], function: ['科研管理'], project: ['自然科学基金'], resource: ['论文'] }, author: '李教授', createTime: '2024-01-20 14:20', viewCount: 189, status: 'published' },
  { id: 3, title: '高校学生管理创新实践', categories: { discipline: ['管理学'], function: ['人事管理'], project: ['校级项目'], resource: ['制度规范'] }, author: '王老师', createTime: '2024-02-01 09:15', viewCount: 123, status: 'pending' },
  { id: 4, title: '课程思政教学设计案例', categories: { discipline: ['工学', '管理学'], function: ['课程管理'], project: ['教学改革项目'], resource: ['视频'] }, author: '赵老师', createTime: '2024-02-10 16:45', viewCount: 345, status: 'published' },
  { id: 5, title: '凝聚态物理前沿进展', categories: { discipline: ['物理学', '凝聚态物理'], function: ['科研管理'], project: ['自然科学基金'], resource: ['论文'] }, author: '孙教授', createTime: '2024-02-15 11:00', viewCount: 412, status: 'published' },
  { id: 6, title: '软件工程中的敏捷开发实践', categories: { discipline: ['软件工程'], function: ['项目管理'], project: ['横向项目'], resource: ['文档'] }, author: '周工程师', createTime: '2024-02-20 18:00', viewCount: 567, status: 'published' },
  { id: 7, title: '关于调整薪酬体系的通知', categories: { discipline: ['管理学'], function: ['薪酬管理'], project: [], resource: ['制度规范'] }, author: '人事处', createTime: '2024-03-01 09:00', viewCount: 890, status: 'published' },
  { id: 8, title: '2024年度财务预算报告', categories: { discipline: ['管理学'], function: ['财务管理'], project: [], resource: ['报告'] }, author: '财务处', createTime: '2024-03-05 14:00', viewCount: 765, status: 'pending' },
  { id: 9, title: '机器学习入门视频教程', categories: { discipline: ['人工智能'], function: ['教学管理'], project: [], resource: ['视频'] }, author: '吴老师', createTime: '2024-03-10 20:00', viewCount: 1024, status: 'published' },
  { id: 10, title: '校园招聘管理系统操作手册', categories: { discipline: [], function: ['招聘管理'], project: [], resource: ['软件'] }, author: '信息中心', createTime: '2024-03-12 13:30', viewCount: 321, status: 'published' },
])

const countNodes = (nodes) => {
  let count = 0;
  for (const node of nodes) {
    count++;
    if (node.children) {
      count += countNodes(node.children);
    }
  }
  return count;
}

const totalNodes = computed(() => {
    return countNodes(disciplineTree.value) + countNodes(functionTree.value) + countNodes(projectTree.value) + countNodes(resourceTypeTree.value)
})

const pendingCount = computed(() => {
    return allKnowledgeList.value.filter(item => item.status === 'pending').length
})

const filteredKnowledgeList = computed(() => {
  let result = allKnowledgeList.value

  // 分类筛选
  if (currentCategory.value) {
    const categoryTypeMap = {
      discipline: 'discipline',
      function: 'function',
      project: 'project',
      resource: 'resource'
    }
    const categoryType = categoryTypeMap[activeTab.value]
    const categoryLabel = currentCategory.value.label
    result = result.filter(item => 
      item.categories[categoryType] && item.categories[categoryType].includes(categoryLabel)
    )
  }

  // 状态筛选
  if (selectedStatus.value) {
    result = result.filter(item => item.status === selectedStatus.value)
  }

  // 关键词搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(query))
  }

  return result
})

const handleNodeClick = (data) => {
  if (currentCategory.value && currentCategory.value.id === data.id) {
    currentCategory.value = null // 再次点击取消选中
    ElMessage.info('已取消分类筛选')
  } else {
    currentCategory.value = data
    ElMessage.info(`查看分类: ${data.label}`)
  }
}

const handleAddCategory = (type) => {
  ElMessage.info(`打开新增${type}分类对话框`)
}

const handleAddKnowledge = () => {
  ElMessage.info('打开新增知识对话框')
}

const handleExport = () => {
  ElMessage.success('正在导出...')
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const getStatusType = (status) => {
  const map = { published: 'success', pending: 'warning', offline: 'info' }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = { published: '已发布', pending: '待审核', offline: '已下架' }
  return map[status] || status
}

const viewDetail = (row) => {
  ElMessage.info(`查看知识: ${row.title}`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑知识: ${row.title}`)
}

const handleDelete = (row) => {
  ElMessage.warning(`删除知识: ${row.title}`)
}

</script>

<style scoped>
.knowledge-classification {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.stats-cards .stat-card .stat-content {
  text-align: center;
}

.stats-cards .stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.stats-cards .stat-label {
  font-size: 14px;
  color: #909399;
}

.tree-card {
  height: calc(100vh - 300px);
}

.classification-tabs :deep(.el-tabs__content) {
  height: calc(100vh - 400px);
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.category-tag {
  margin-bottom: 4px;
}
</style>
