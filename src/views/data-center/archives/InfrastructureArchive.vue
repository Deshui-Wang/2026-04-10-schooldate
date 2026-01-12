<template>
  <div class="archive-list">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">128</div>
          <div class="stat-label">建设项目</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">45</div>
          <div class="stat-label">在建工程</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">83</div>
          <div class="stat-label">已竣工项目</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">2,456</div>
          <div class="stat-label">图纸文件</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索项目名称/工程编号" style="width: 280px" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedType" placeholder="项目类型" style="width: 130px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="教学楼" value="教学楼" />
        <el-option label="实验楼" value="实验楼" />
        <el-option label="宿舍楼" value="宿舍楼" />
        <el-option label="体育场馆" value="体育场馆" />
        <el-option label="道路管网" value="道路管网" />
      </el-select>
      <el-select v-model="selectedStatus" placeholder="状态" style="width: 120px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="规划中" value="规划中" />
        <el-option label="建设中" value="建设中" />
        <el-option label="已竣工" value="已竣工" />
      </el-select>
      <el-button type="primary" style="margin-left: 12px" @click="handleSearch">查询</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>

    <!-- 档案列表 -->
    <el-table :data="archiveList" stripe style="width: 100%" height="100%">
      <el-table-column prop="projectNo" label="工程编号" width="140" fixed />
      <el-table-column prop="projectName" label="项目名称" min-width="220" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="location" label="位置" width="150" show-overflow-tooltip />
      <el-table-column prop="area" label="建筑面积(㎡)" width="120" />
      <el-table-column prop="startDate" label="开工日期" width="110" />
      <el-table-column prop="endDate" label="竣工日期" width="110" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
          <el-button link type="success" @click="viewDrawings(scope.row)">图纸</el-button>
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
const selectedType = ref('')
const selectedStatus = ref('')

const archiveList = ref([
  { projectNo: 'JJ-2024-001', projectName: '新建综合教学楼（A区）', type: '教学楼', location: '东校区', area: '25000', startDate: '2024-03-01', endDate: '-', status: '建设中' },
  { projectNo: 'JJ-2023-015', projectName: '学生公寓8号楼', type: '宿舍楼', location: '南校区', area: '12000', startDate: '2023-05-15', endDate: '2024-08-30', status: '已竣工' },
  { projectNo: 'JJ-2023-008', projectName: '体育馆扩建工程', type: '体育场馆', location: '西校区', area: '8500', startDate: '2023-03-01', endDate: '2024-06-15', status: '已竣工' },
  { projectNo: 'JJ-2024-003', projectName: '新能源实验楼', type: '实验楼', location: '北校区', area: '6800', startDate: '2024-01-10', endDate: '-', status: '建设中' },
  { projectNo: 'JJ-2024-005', projectName: '校园道路改造工程', type: '道路管网', location: '全校', area: '-', startDate: '2024-04-01', endDate: '-', status: '规划中' },
  { projectNo: 'JJ-2022-023', projectName: '图书馆新馆', type: '教学楼', location: '中心区', area: '35000', startDate: '2022-06-01', endDate: '2024-03-15', status: '已竣工' }
])

const getStatusType = (status) => {
  const map = { '规划中': 'info', '建设中': 'warning', '已竣工': 'success' }
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

const viewDrawings = (row) => {
  ElMessage.info(`查看图纸: ${row.projectName}`)
}

const handleDownload = (row) => {
  ElMessage.success(`下载档案: ${row.projectNo}`)
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
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  text-align: center;
}

.stat-card.infra {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
