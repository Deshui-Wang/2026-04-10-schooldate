<template>
  <div class="archive-list">
    <div class="section-header">
      <h3>科技档案</h3>
      <p>科研项目、论文专利等科技档案的归档与管理</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">{{ projectCount }}</div>
          <div class="stat-label">科研项目档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">{{ patentCount }}</div>
          <div class="stat-label">论文专利档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">{{ achievementCount }}</div>
          <div class="stat-label">科技成果档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card tech">
          <div class="stat-value">{{ equipmentCount }}</div>
          <div class="stat-label">设备仪器档案</div>
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
              placeholder="搜索项目名称/课题编号/负责人"
              style="width: 300px; margin-right: 15px"
              clearable
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="科研项目" value="科研项目" />
              <el-option label="论文专利" value="论文专利" />
              <el-option label="科技成果" value="科技成果" />
              <el-option label="设备仪器" value="设备仪器" />
            </el-select>
            <el-select v-model="selectedLevel" placeholder="项目级别" style="width: 130px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="国家级" value="国家级" />
              <el-option label="省部级" value="省部级" />
              <el-option label="校级" value="校级" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="projectNo" label="课题编号" min-width="150" fixed />
        <el-table-column prop="projectName" label="项目名称" min-width="280" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" min-width="100" />
        <el-table-column prop="level" label="级别" min-width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)" size="small">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="leader" label="负责人" min-width="100" />
        <el-table-column prop="department" label="承担单位" min-width="180" show-overflow-tooltip />
        <el-table-column prop="startDate" label="立项时间" min-width="110" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="实体存放" min-width="200">
          <template #default="scope">
            <div v-if="scope.row.physicalStatus === 'stocked'" class="physical-location" @click="goToSmartRoom(scope.row)">
               <el-tag type="success" effect="plain" size="small"><el-icon><OfficeBuilding /></el-icon> {{ scope.row.location }}</el-tag>
            </div>
            <div v-else>
               <el-tag type="info" effect="plain" size="small">仅电子</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="info" @click="handleDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>

       <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next, total, jumper"
        :total="filteredList.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const selectedType = ref('')
const selectedLevel = ref('')
const loading = ref(false)

const fullArchiveList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const generateMockData = () => {
  const data = []
  const types = ['科研项目', '论文专利', '科技成果', '设备仪器']
  const levels = ['国家级', '省部级', '校级']
  const leaders = ['张教授', '李教授', '王教授', '赵教授', '陈教授', '刘副教授']
  const departments = ['计算机学院', '材料学院', '经济学院', '电子学院', '信息学院', '创业学院']
  const statuses = { 
    '科研项目': ['进行中', '已结题'], 
    '论文专利': ['已授权', '审核中'], 
    '科技成果': ['已鉴定', '已转化'],
    '设备仪器': ['在用', '报废']
  }

  for (let i = 1; i <= 125; i++) {
    const type = types[i % types.length]
    const level = levels[i % levels.length]
    const year = 2022 + (i % 3)
    const month = String(Math.floor(i / 12) + 1).padStart(2, '0')
    const prefix = type === '科研项目' ? 'PRO' : type === '论文专利' ? 'PAT' : 'ACH'
    const hasPhysical = Math.random() > 0.4;
    
    data.push({
      projectNo: `${prefix}-${year}-${String(i).padStart(3, '0')}`,
      projectName: `${departments[i % departments.length]}的${level}${type}研究与应用_${i}`,
      type: type,
      level: level,
      leader: leaders[i % leaders.length],
      department: departments[i % departments.length],
      startDate: `${year}-${month}`,
      status: statuses[type][i % statuses[type].length],
      physicalStatus: hasPhysical ? 'stocked' : 'only_digital',
      location: hasPhysical ? `二号库/科技区/${String(Math.floor(Math.random()*20)+1).padStart(2,'0')}柜` : ''
    })
  }
  return data
}

onMounted(() => {
  fullArchiveList.value = generateMockData()
})

const filteredList = computed(() => {
  return fullArchiveList.value.filter(item => {
    const searchMatch = 
      item.projectName.includes(searchQuery.value) ||
      item.projectNo.includes(searchQuery.value) ||
      item.leader.includes(searchQuery.value)
    const typeMatch = selectedType.value ? item.type === selectedType.value : true
    const levelMatch = selectedLevel.value ? item.level === selectedLevel.value : true
    return searchMatch && typeMatch && levelMatch
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const projectCount = computed(() => fullArchiveList.value.filter(item => item.type === '科研项目').length)
const patentCount = computed(() => fullArchiveList.value.filter(item => item.type === '论文专利').length)
const achievementCount = computed(() => fullArchiveList.value.filter(item => item.type === '科技成果').length)
const equipmentCount = computed(() => fullArchiveList.value.filter(item => item.type === '设备仪器').length)

const getLevelType = (level) => {
  const map = { '国家级': 'danger', '省部级': 'warning', '校级': 'info' }
  return map[level] || 'info'
}

const getStatusType = (status) => {
  const map = { '进行中': 'primary', '已结题': 'success', '已授权': 'success', '已鉴定': 'success', '审核中': 'warning', '已转化': 'success', '在用': 'primary', '报废': 'info' }
  return map[status] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
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

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.projectNo }
  })
}

const handlePageChange = (page) => {
  currentPage.value = page
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

.physical-location {
  cursor: pointer;
  transition: opacity 0.2s;
}
.physical-location:hover {
  opacity: 0.8;
}
</style>
