<template>
  <div class="archive-list">
    <div class="section-header">
      <h3>文书档案</h3>
      <p>学校各类文书档案的统一管理与查询</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ totalArchives }}</div>
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

    <!-- 搜索与操作栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="left-panel">
            <el-input
              v-model="searchQuery"
              placeholder="搜索文件号/标题/责任者"
              style="width: 300px; margin-right: 15px"
              clearable
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedYear" placeholder="年度" style="width: 120px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="2024" value="2024" />
              <el-option label="2023" value="2023" />
              <el-option label="2022" value="2022" />
            </el-select>
            <el-select v-model="selectedCategory" placeholder="类别" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="党群类" value="党群类" />
              <el-option label="行政类" value="行政类" />
              <el-option label="教学类" value="教学类" />
              <el-option label="财务类" value="财务类" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="fileNo" label="文件号" min-width="150" fixed />
        <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
        <el-table-column prop="category" label="类别" min-width="100" />
        <el-table-column prop="responsiblePerson" label="责任者" min-width="120" />
        <el-table-column prop="formationDate" label="形成日期" min-width="120" />
        <el-table-column prop="retention" label="保管期限" min-width="100">
          <template #default="scope">
            <el-tag :type="getRetentionType(scope.row.retention)" size="small">
              {{ scope.row.retention }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已归档' ? 'success' : 'warning'" size="small">
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
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="warning" @click="handleBorrow(scope.row)">借阅</el-button>
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
const selectedYear = ref('')
const selectedCategory = ref('')
const loading = ref(false)

// 模拟的完整数据列表
const fullArchiveList = ref([])

// 分页相关状态
const currentPage = ref(1)
const pageSize = ref(10)

// 生成模拟数据
const generateMockData = () => {
  const data = []
  const categories = ['党群类', '行政类', '教学类', '财务类']
  const responsiblePersons = ['教务处', '校办', '党办', '财务处', '工会']
  const retentions = ['永久', '30年', '10年']
  const statuses = ['已归档', '待归档']
  
  for (let i = 1; i <= 88; i++) {
    const hasPhysical = Math.random() > 0.4;
    const year = 2022 + (i % 3)
    const month = String(Math.floor(i / 8) + 1).padStart(2, '0')
    const day = String((i % 28) + 1).padStart(2, '0')
    data.push({
      fileNo: `WS-${year}-${String(i).padStart(3, '0')}`,
      title: `关于${year}年度第${i}号文件的通知`,
      category: categories[i % categories.length],
      responsiblePerson: responsiblePersons[i % responsiblePersons.length],
      formationDate: `${year}-${month}-${day}`,
      retention: retentions[i % retentions.length],
      status: statuses[i % statuses.length],
      physicalStatus: hasPhysical ? 'stocked' : 'only_digital',
      location: hasPhysical ? `一号库/文书区/${String(Math.floor(Math.random()*20)+1).padStart(2,'0')}柜` : ''
    })
  }
  return data
}

// 组件挂载时加载数据
onMounted(() => {
  fullArchiveList.value = generateMockData()
})

// 筛选后的列表
const filteredList = computed(() => {
  return fullArchiveList.value.filter(item => {
    const searchMatch = 
      item.fileNo.includes(searchQuery.value) ||
      item.title.includes(searchQuery.value) ||
      item.responsiblePerson.includes(searchQuery.value)
    const yearMatch = selectedYear.value ? item.formationDate.startsWith(selectedYear.value) : true
    const categoryMatch = selectedCategory.value ? item.category === selectedCategory.value : true
    return searchMatch && yearMatch && categoryMatch
  })
})

// 分页后的列表
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const totalArchives = computed(() => fullArchiveList.value.length)

const getRetentionType = (retention) => {
  if (retention === '永久') return 'danger'
  if (retention === '30年') return 'warning'
  return 'info'
}

const handleSearch = () => {
  currentPage.value = 1 // 查询时重置到第一页
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

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.fileNo }
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
