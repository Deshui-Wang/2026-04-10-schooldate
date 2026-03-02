<template>
  <div class="archive-list">
    <div class="section-header">
      <h3>实物档案</h3>
      <p>奖杯、证书、印章等实物档案的登记与管理</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">{{ trophyCount }}</div>
          <div class="stat-label">奖杯奖牌</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">{{ certificateCount }}</div>
          <div class="stat-label">证书证件</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">{{ sealCount }}</div>
          <div class="stat-label">印章档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">{{ otherCount }}</div>
          <div class="stat-label">其他实物</div>
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
              placeholder="搜索物品名称/编号/存放位置"
              style="width: 300px; margin-right: 15px"
              clearable
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="物品类型" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="奖杯奖牌" value="奖杯奖牌" />
              <el-option label="证书证件" value="证书证件" />
              <el-option label="印章档案" value="印章档案" />
              <el-option label="其他实物" value="其他实物" />
            </el-select>
            <el-select v-model="selectedLocation" placeholder="存放位置" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="档案室A区" value="档案室A区" />
              <el-option label="档案室B区" value="档案室B区" />
              <el-option label="展示厅" value="展示厅" />
              <el-option label="保险柜" value="保险柜" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="itemNo" label="物品编号" min-width="150" fixed />
        <el-table-column prop="name" label="物品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" min-width="120" />
        <el-table-column prop="awardDate" label="获得日期" min-width="120" />
        <el-table-column label="存放位置" min-width="180">
          <template #default="scope">
            <div class="physical-location" @click="goToSmartRoom(scope.row)">
               <el-tag type="success" effect="plain" size="small"><el-icon><OfficeBuilding /></el-icon> {{ scope.row.location }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="condition" label="保存状况" min-width="120">
          <template #default="scope">
            <el-tag :type="getConditionType(scope.row.condition)" size="small">
              {{ scope.row.condition }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在库' ? 'success' : 'warning'" size="small">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="warning" @click="handleBorrow(scope.row)">借出</el-button>
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
const selectedLocation = ref('')
const loading = ref(false)

const fullArchiveList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const generateMockData = () => {
  const data = []
  const types = ['奖杯奖牌', '证书证件', '印章档案', '其他实物']
  const locations = ['档案室A区', '档案室B区', '展示厅', '保险柜']
  const conditions = ['完好', '良好', '一般', '需修复']
  const statuses = ['在库', '借出']

  for (let i = 1; i <= 65; i++) {
    const type = types[i % types.length]
    const year = 2020 + (i % 5)
    const month = String((i % 12) + 1).padStart(2, '0')
    const day = String((i % 28) + 1).padStart(2, '0')

    data.push({
      itemNo: `SW-${year}-${String(i).padStart(3, '0')}`,
      name: `${type}_${i}`,
      type,
      awardDate: `${year}-${month}-${day}`,
      awardDate: `${year}-${month}-${day}`,
      location: `${locations[i % locations.length]}/${String(Math.floor(Math.random()*10)+1).padStart(2,'0')}柜`,
      condition: conditions[i % conditions.length],
      status: statuses[i % statuses.length],
      physicalStatus: 'stocked'
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
      item.name.toLowerCase().includes(query) ||
      item.itemNo.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
    const typeMatch = selectedType.value ? item.type === selectedType.value : true
    const locationMatch = selectedLocation.value ? item.location === selectedLocation.value : true
    return searchMatch && typeMatch && locationMatch
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const trophyCount = computed(() => fullArchiveList.value.filter(i => i.type === '奖杯奖牌').length)
const certificateCount = computed(() => fullArchiveList.value.filter(i => i.type === '证书证件').length)
const sealCount = computed(() => fullArchiveList.value.filter(i => i.type === '印章档案').length)
const otherCount = computed(() => fullArchiveList.value.filter(i => i.type === '其他实物').length)

const getConditionType = (condition) => {
  const map = { '完好': 'success', '良好': 'warning', '一般': 'info', '需修复': 'danger' }
  return map[condition] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleExport = () => {
  ElMessage.success('正在导出档案列表...')
}

const viewDetail = (row) => {
  ElMessage.info(`查看物品: ${row.name}`)
}

const handleBorrow = (row) => {
  ElMessage.info(`申请借出: ${row.name}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.itemNo }
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

.stat-card.physical {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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
  display: inline-block;
  transition: opacity 0.2s;
}
.physical-location:hover {
  opacity: 0.8;
}
</style>
