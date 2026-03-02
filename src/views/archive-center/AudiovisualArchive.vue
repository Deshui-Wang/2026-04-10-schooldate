<template>
  <div class="archive-list">
    <div class="section-header">
      <h3>声像档案</h3>
      <p>照片、视频、音频等声像档案的数字化存储</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">{{ photoCount }}</div>
          <div class="stat-label">照片档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">{{ videoCount }}</div>
          <div class="stat-label">视频档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">{{ audioCount }}</div>
          <div class="stat-label">音频档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">{{ discCount }}</div>
          <div class="stat-label">光盘档案</div>
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
              placeholder="搜索标题/活动名称"
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
              <el-option label="照片" value="照片" />
              <el-option label="视频" value="视频" />
              <el-option label="音频" value="音频" />
              <el-option label="光盘" value="光盘" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="archiveNo" label="档案编号" min-width="150" fixed />
        <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" min-width="100" />
        <el-table-column prop="event" label="活动/事件" min-width="180" show-overflow-tooltip />
        <el-table-column prop="shootDate" label="拍摄日期" min-width="120" />
        <el-table-column prop="duration" label="时长/数量" min-width="120" />
        <el-table-column prop="format" label="格式" min-width="100" />
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
            <el-button link type="success" @click="handlePlay(scope.row)">播放</el-button>
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
const loading = ref(false)

const fullArchiveList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const generateMockData = () => {
  const data = []
  const types = ['照片', '视频', '音频', '光盘']
  const events = ['开学典礼', '校庆庆典', '学术报告', '毕业典礼', '教学成果展', '重要会议']
  const formats = { '照片': 'JPG', '视频': 'MP4', '音频': 'MP3', '光盘': 'DVD' }

  for (let i = 1; i <= 78; i++) {
    const type = types[i % types.length]
    const year = 2022 + (i % 3)
    const month = String((i % 12) + 1).padStart(2, '0')
    const day = String((i % 28) + 1).padStart(2, '0')
    
    data.push({
      archiveNo: `SX-${year}-${String(i).padStart(3, '0')}`,
      title: `${year}年${events[i % events.length]} - ${type}`,
      type,
      event: events[i % events.length],
      shootDate: `${year}-${month}-${day}`,
      duration: type === '照片' ? `${50 + i}张` : type === '光盘' ? '1张' : `${30 + i}分钟`,
      format: formats[type],
      physicalStatus: ['光盘', '照片'].includes(type) ? 'stocked' : (Math.random() > 0.5 ? 'stocked' : 'only_digital'),
      location: `二号库/声像区/${String(Math.floor(Math.random()*20)+1).padStart(2,'0')}柜`
    })
  }
  return data
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    fullArchiveList.value = generateMockData()
    loading.value = false
  }, 500)
})

const filteredList = computed(() => {
  return fullArchiveList.value.filter(item => {
    const query = searchQuery.value.toLowerCase()
    const searchMatch = 
      item.title.toLowerCase().includes(query) ||
      item.event.toLowerCase().includes(query)
    const typeMatch = selectedType.value ? item.type === selectedType.value : true
    return searchMatch && typeMatch
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const photoCount = computed(() => fullArchiveList.value.filter(i => i.type === '照片').length)
const videoCount = computed(() => fullArchiveList.value.filter(i => i.type === '视频').length)
const audioCount = computed(() => fullArchiveList.value.filter(i => i.type === '音频').length)
const discCount = computed(() => fullArchiveList.value.filter(i => i.type === '光盘').length)

const handleSearch = () => {
  currentPage.value = 1
}

const handleExport = () => {
  ElMessage.success('正在导出档案列表...')
}

const viewDetail = (row) => {
  ElMessage.info(`查看档案: ${row.title}`)
}

const handlePlay = (row) => {
  ElMessage.info(`播放: ${row.title}`)
}

const handleDownload = (row) => {
  ElMessage.success(`下载档案: ${row.archiveNo}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.archiveNo }
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

.stat-card.audio {
  background: linear-gradient(135deg, #43e97b 0%, #38d9a9 100%);
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
