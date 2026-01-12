<template>
  <div class="archive-list">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">256</div>
          <div class="stat-label">实物总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">89</div>
          <div class="stat-label">奖杯奖牌</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">45</div>
          <div class="stat-label">历史文物</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">122</div>
          <div class="stat-label">纪念品</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索名称/编号/来源" style="width: 280px" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedType" placeholder="类型" style="width: 130px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="奖杯奖牌" value="奖杯奖牌" />
        <el-option label="历史文物" value="历史文物" />
        <el-option label="纪念品" value="纪念品" />
        <el-option label="教学仪器" value="教学仪器" />
        <el-option label="艺术品" value="艺术品" />
      </el-select>
      <el-select v-model="selectedLocation" placeholder="存放位置" style="width: 140px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="校史馆" value="校史馆" />
        <el-option label="档案库房" value="档案库房" />
        <el-option label="展览厅" value="展览厅" />
      </el-select>
      <el-button type="primary" style="margin-left: 12px" @click="handleSearch">查询</el-button>
      <el-button @click="handleAdd">登记</el-button>
    </div>

    <!-- 档案列表 -->
    <el-table :data="archiveList" stripe style="width: 100%" height="100%">
      <el-table-column prop="itemNo" label="编号" width="130" fixed />
      <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="scope">
          <el-tag :type="getTypeColor(scope.row.type)" size="small">
            {{ scope.row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="来源" width="150" show-overflow-tooltip />
      <el-table-column prop="acquireDate" label="入馆日期" width="110" />
      <el-table-column prop="location" label="存放位置" width="100" />
      <el-table-column prop="condition" label="保存状况" width="100">
        <template #default="scope">
          <el-tag :type="getConditionType(scope.row.condition)" size="small">
            {{ scope.row.condition }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="viewDetail(scope.row)">详情</el-button>
          <el-button link type="success" @click="viewPhoto(scope.row)">照片</el-button>
          <el-button link type="warning" @click="handleMaintain(scope.row)">维护</el-button>
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
const selectedLocation = ref('')

const archiveList = ref([
  { itemNo: 'SW-2024-001', name: '建校50周年纪念铜牌', type: '纪念品', source: '校庆办公室', acquireDate: '2024-10-15', location: '校史馆', condition: '完好' },
  { itemNo: 'SW-2024-002', name: '全国教学成果一等奖奖杯', type: '奖杯奖牌', source: '教务处', acquireDate: '2024-05-20', location: '展览厅', condition: '完好' },
  { itemNo: 'SW-2023-015', name: '民国时期校训石碑拓片', type: '历史文物', source: '校史研究室', acquireDate: '2023-08-10', location: '档案库房', condition: '良好' },
  { itemNo: 'SW-2023-018', name: '老教授捐赠古籍善本', type: '历史文物', source: '图书馆', acquireDate: '2023-06-15', location: '校史馆', condition: '良好' },
  { itemNo: 'SW-2022-056', name: '1952年第一届毕业证书原件', type: '历史文物', source: '校友捐赠', acquireDate: '2022-10-01', location: '校史馆', condition: '较好' },
  { itemNo: 'SW-2024-003', name: '国际友好学校赠送纪念品', type: '纪念品', source: '国际处', acquireDate: '2024-03-20', location: '展览厅', condition: '完好' },
  { itemNo: 'SW-2021-089', name: '早期教学用经纬仪', type: '教学仪器', source: '测绘学院', acquireDate: '2021-09-01', location: '档案库房', condition: '一般' }
])

const getTypeColor = (type) => {
  const map = { '奖杯奖牌': 'warning', '历史文物': 'danger', '纪念品': 'primary', '教学仪器': 'info', '艺术品': 'success' }
  return map[type] || 'info'
}

const getConditionType = (condition) => {
  const map = { '完好': 'success', '良好': 'primary', '较好': 'warning', '一般': 'info', '需修复': 'danger' }
  return map[condition] || 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleAdd = () => {
  ElMessage.info('打开实物登记表单')
}

const viewDetail = (row) => {
  ElMessage.info(`查看详情: ${row.name}`)
}

const viewPhoto = (row) => {
  ElMessage.info(`查看照片: ${row.name}`)
}

const handleMaintain = (row) => {
  ElMessage.warning(`维护记录: ${row.name}`)
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
