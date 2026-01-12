<template>
  <div class="archive-list">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">856</div>
          <div class="stat-label">科研项目档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">1,234</div>
          <div class="stat-label">论文专利档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">423</div>
          <div class="stat-label">科技成果档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">67</div>
          <div class="stat-label">设备仪器档案</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索项目名称/课题编号/负责人" style="width: 300px" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="科研项目" value="科研项目" />
        <el-option label="论文专利" value="论文专利" />
        <el-option label="科技成果" value="科技成果" />
        <el-option label="设备仪器" value="设备仪器" />
      </el-select>
      <el-select v-model="selectedLevel" placeholder="项目级别" style="width: 130px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="国家级" value="国家级" />
        <el-option label="省部级" value="省部级" />
        <el-option label="校级" value="校级" />
      </el-select>
      <el-button type="primary" style="margin-left: 12px" @click="handleSearch">查询</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>

    <!-- 档案列表 -->
    <el-table :data="archiveList" stripe style="width: 100%" height="100%">
      <el-table-column prop="projectNo" label="课题编号" width="150" fixed />
      <el-table-column prop="projectName" label="项目名称" min-width="280" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="level" label="级别" width="100">
        <template #default="scope">
          <el-tag :type="getLevelType(scope.row.level)" size="small">
            {{ scope.row.level }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="leader" label="负责人" width="100" />
      <el-table-column prop="department" label="承担单位" width="180" show-overflow-tooltip />
      <el-table-column prop="startDate" label="立项时间" width="110" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)" size="small">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
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
const selectedLevel = ref('')

const archiveList = ref([
  { projectNo: 'NSFC-2024-001', projectName: '基于深度学习的智能教育系统研究', type: '科研项目', level: '国家级', leader: '张教授', department: '计算机学院', startDate: '2024-01', status: '进行中' },
  { projectNo: 'NSFC-2023-015', projectName: '新型纳米材料在能源领域的应用研究', type: '科研项目', level: '国家级', leader: '李教授', department: '材料学院', startDate: '2023-06', status: '已结题' },
  { projectNo: 'PROV-2024-008', projectName: '区域经济协调发展政策研究', type: '科研项目', level: '省部级', leader: '王教授', department: '经济学院', startDate: '2024-03', status: '进行中' },
  { projectNo: 'PAT-2024-023', projectName: '一种新型智能传感器及其应用方法', type: '论文专利', level: '国家级', leader: '赵教授', department: '电子学院', startDate: '2024-02', status: '已授权' },
  { projectNo: 'ACH-2023-056', projectName: '人工智能辅助医疗诊断系统', type: '科技成果', level: '省部级', leader: '陈教授', department: '信息学院', startDate: '2023-12', status: '已鉴定' },
  { projectNo: 'SCH-2024-012', projectName: '高校创新创业教育模式探索', type: '科研项目', level: '校级', leader: '刘副教授', department: '创业学院', startDate: '2024-01', status: '进行中' }
])

const getLevelType = (level) => {
  const map = { '国家级': 'danger', '省部级': 'warning', '校级': 'info' }
  return map[level] || 'info'
}

const getStatusType = (status) => {
  const map = { '进行中': 'primary', '已结题': 'success', '已授权': 'success', '已鉴定': 'success' }
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

.stat-card.tech {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
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
