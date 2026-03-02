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
          <div class="stat-value">{{ constructionCount }}</div>
          <div class="stat-label">建设项目档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">{{ drawingCount }}</div>
          <div class="stat-label">设计图纸档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">{{ processCount }}</div>
          <div class="stat-label">施工档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card infra">
          <div class="stat-value">{{ acceptanceCount }}</div>
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
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="建设项目" value="建设项目" />
              <el-option label="设计图纸" value="设计图纸" />
              <el-option label="施工档案" value="施工档案" />
              <el-option label="验收档案" value="验收档案" />
            </el-select>
            <el-select v-model="selectedStatus" placeholder="项目状态" style="width: 130px; margin-right: 15px" clearable @change="handleSearch">
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
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
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
const selectedStatus = ref('')
const loading = ref(false)

const fullArchiveList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const generateMockData = () => {
  const data = []
  const types = ['建设项目', '设计图纸', '施工档案', '验收档案']
  const statuses = ['在建', '已竣工', '已验收']
  const locations = ['新校区A区', '主校区', '新校区B区']
  const projectNames = ['教学楼', '图书馆', '学生宿舍', '实验楼', '体育馆', '食堂']

  for (let i = 1; i <= 95; i++) {
    const year = 2021 + (i % 4)
    const startMonth = (i % 12) + 1
    const endMonth = (startMonth + 5) % 12 + 1
    const endYear = startMonth > endMonth ? year + 1 : year
    const type = types[i % types.length]
    const hasPhysical = Math.random() > 0.4;
    
    data.push({
      projectNo: `JJ-${year}-${String(i).padStart(3, '0')}`,
      projectName: `${projectNames[i % projectNames.length]} - ${type}`,
      type: type,
      location: locations[i % locations.length],
      startDate: `${year}-${String(startMonth).padStart(2, '0')}-01`,
      endDate: `${endYear}-${String(endMonth).padStart(2, '0')}-28`,
      status: statuses[i % statuses.length],
      physicalStatus: hasPhysical ? 'stocked' : 'only_digital',
      location: hasPhysical ? `综合库/基建区/${String(Math.floor(Math.random()*20)+1).padStart(2,'0')}柜` : ''
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
      item.projectNo.includes(searchQuery.value)
    const typeMatch = selectedType.value ? item.type === selectedType.value : true
    const statusMatch = selectedStatus.value ? item.status === selectedStatus.value : true
    return searchMatch && typeMatch && statusMatch
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const constructionCount = computed(() => fullArchiveList.value.filter(i => i.type === '建设项目').length)
const drawingCount = computed(() => fullArchiveList.value.filter(i => i.type === '设计图纸').length)
const processCount = computed(() => fullArchiveList.value.filter(i => i.type === '施工档案').length)
const acceptanceCount = computed(() => fullArchiveList.value.filter(i => i.type === '验收档案').length)

const getStatusType = (status) => {
  const map = { '在建': 'primary', '已竣工': 'warning', '已验收': 'success' }
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

const handlePageChange = (page) => {
  currentPage.value = page
}

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.projectNo }
  })
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

.physical-location {
  cursor: pointer;
  transition: opacity 0.2s;
}
.physical-location:hover {
  opacity: 0.8;
}
</style>
