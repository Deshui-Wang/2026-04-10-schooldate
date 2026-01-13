<template>
  <div class="archive-list">
    <div class="section-header">
      <h3>基建档案</h3>
      <p>学校基建项目档案的全生命周期管理</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">156</div>
          <div class="stat-label">建设项目档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">89</div>
          <div class="stat-label">设计图纸档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">234</div>
          <div class="stat-label">施工档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">67</div>
          <div class="stat-label">验收档案</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索与操作栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="left-panel">
            <el-input
              v-model="searchQuery"
              placeholder="搜索项目名称/项目编号"
              style="width: 300px; margin-right: 15px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="建设项目" value="建设项目" />
              <el-option label="设计图纸" value="设计图纸" />
              <el-option label="施工档案" value="施工档案" />
              <el-option label="验收档案" value="验收档案" />
            </el-select>
            <el-select v-model="selectedStatus" placeholder="项目状态" style="width: 130px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="在建" value="在建" />
              <el-option label="已竣工" value="已竣工" />
              <el-option label="已验收" value="已验收" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="archiveList" stripe style="width: 100%">
        <el-table-column prop="projectNo" label="项目编号" min-width="150" fixed />
        <el-table-column prop="projectName" label="项目名称" min-width="250" show-overflow-tooltip />
        <el-table-column prop="type" label="档案类型" min-width="120" />
        <el-table-column prop="location" label="建设地点" min-width="150" />
        <el-table-column prop="startDate" label="开工日期" min-width="120" />
        <el-table-column prop="endDate" label="竣工日期" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="info" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')

const archiveList = ref([
  { projectNo: 'JJ-2024-001', projectName: '新校区教学楼建设项目', type: '建设项目', location: '新校区A区', startDate: '2024-01-15', endDate: '2024-12-31', status: '在建' },
  { projectNo: 'JJ-2023-015', projectName: '图书馆扩建工程', type: '建设项目', location: '主校区', startDate: '2023-06-01', endDate: '2023-12-20', status: '已竣工' },
  { projectNo: 'JJ-2023-008', projectName: '学生宿舍楼设计图纸', type: '设计图纸', location: '新校区B区', startDate: '2023-03-01', endDate: '2023-05-30', status: '已验收' },
  { projectNo: 'JJ-2024-002', projectName: '实验楼施工档案', type: '施工档案', location: '主校区', startDate: '2024-02-01', endDate: '2024-11-30', status: '在建' },
  { projectNo: 'JJ-2023-020', projectName: '体育馆验收档案', type: '验收档案', location: '主校区', startDate: '2023-01-01', endDate: '2023-10-15', status: '已验收' },
  { projectNo: 'JJ-2024-003', projectName: '食堂改造项目', type: '建设项目', location: '主校区', startDate: '2024-03-01', endDate: '2024-08-31', status: '在建' }
])

const getStatusType = (status) => {
  const map = { '在建': 'primary', '已竣工': 'warning', '已验收': 'success' }
  return map[status] || 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleExport = () => {
  ElMessage.success('正在导出档案列表...')
}

const viewDetail = (row) => {
  ElMessage.info(`查看项目: ${row.projectName}`)
}

const handleDownload = (row) => {
  ElMessage.success(`下载档案: ${row.projectNo}`)
}
</script>

<style scoped>
.archive-list {
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

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  text-align: center;
}

.stat-card.infra {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-panel {
  display: flex;
  align-items: center;
}
</style>
