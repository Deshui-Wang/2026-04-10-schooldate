<template>
  <div class="archive-list">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">2,456</div>
          <div class="stat-label">档案总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">156</div>
          <div class="stat-label">本月新增</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">89</div>
          <div class="stat-label">待归档</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">12</div>
          <div class="stat-label">借阅中</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索文件号/标题/责任者" style="width: 300px" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedYear" placeholder="年度" style="width: 120px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="2024" value="2024" />
        <el-option label="2023" value="2023" />
        <el-option label="2022" value="2022" />
      </el-select>
      <el-select v-model="selectedCategory" placeholder="类别" style="width: 150px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="党群类" value="党群类" />
        <el-option label="行政类" value="行政类" />
        <el-option label="教学类" value="教学类" />
        <el-option label="财务类" value="财务类" />
      </el-select>
      <el-button type="primary" style="margin-left: 12px" @click="handleSearch">查询</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>

    <!-- 档案列表 -->
    <el-table :data="archiveList" stripe style="width: 100%" height="100%">
      <el-table-column prop="fileNo" label="文件号" width="150" fixed />
      <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
      <el-table-column prop="category" label="类别" width="100" />
      <el-table-column prop="responsiblePerson" label="责任者" width="120" />
      <el-table-column prop="formationDate" label="形成日期" width="120" />
      <el-table-column prop="retention" label="保管期限" width="100">
        <template #default="scope">
          <el-tag :type="getRetentionType(scope.row.retention)" size="small">
            {{ scope.row.retention }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === '已归档' ? 'success' : 'warning'" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
          <el-button link type="warning" @click="handleBorrow(scope.row)">借阅</el-button>
          <el-button link type="info" @click="handleDownload(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const selectedYear = ref('')
const selectedCategory = ref('')

const archiveList = ref([
  { fileNo: 'WS-2024-001', title: '关于开展2024年度教学评估工作的通知', category: '教学类', responsiblePerson: '教务处', formationDate: '2024-01-15', retention: '永久', status: '已归档' },
  { fileNo: 'WS-2024-002', title: '2024年度工作计划', category: '行政类', responsiblePerson: '校办', formationDate: '2024-01-10', retention: '永久', status: '已归档' },
  { fileNo: 'WS-2024-003', title: '党委会议纪要（第5期）', category: '党群类', responsiblePerson: '党办', formationDate: '2024-02-20', retention: '永久', status: '已归档' },
  { fileNo: 'WS-2024-004', title: '2024年度财务预算报告', category: '财务类', responsiblePerson: '财务处', formationDate: '2024-01-08', retention: '30年', status: '已归档' },
  { fileNo: 'WS-2024-005', title: '教职工代表大会决议', category: '党群类', responsiblePerson: '工会', formationDate: '2024-03-15', retention: '永久', status: '待归档' },
  { fileNo: 'WS-2023-089', title: '2023年度工作总结', category: '行政类', responsiblePerson: '校办', formationDate: '2023-12-28', retention: '永久', status: '已归档' },
  { fileNo: 'WS-2023-088', title: '关于调整院系设置的批复', category: '行政类', responsiblePerson: '校办', formationDate: '2023-11-20', retention: '永久', status: '已归档' },
  { fileNo: 'WS-2023-087', title: '本科教学质量报告', category: '教学类', responsiblePerson: '教务处', formationDate: '2023-10-15', retention: '30年', status: '已归档' }
])

const getRetentionType = (retention) => {
  if (retention === '永久') return 'danger'
  if (retention === '30年') return 'warning'
  return 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleExport = () => {
  ElMessage.success('正在导出档案列表...')
}

const viewDetail = (row) => {
  ElMessage.info(`查看档案: ${row.title}`)
}

const handleBorrow = (row) => {
  ElMessage.info(`申请借阅: ${row.title}`)
}

const handleDownload = (row) => {
  ElMessage.success(`下载档案: ${row.fileNo}`)
}
</script>

<style scoped>
.archive-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.stat-row {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.el-table {
  flex: 1;
}
</style>
