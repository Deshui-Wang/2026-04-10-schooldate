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
          <div class="stat-value">234</div>
          <div class="stat-label">奖杯奖牌</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">156</div>
          <div class="stat-label">证书证件</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">89</div>
          <div class="stat-label">印章档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card physical">
          <div class="stat-value">67</div>
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
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="物品类型" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="奖杯奖牌" value="奖杯奖牌" />
              <el-option label="证书证件" value="证书证件" />
              <el-option label="印章档案" value="印章档案" />
              <el-option label="其他实物" value="其他实物" />
            </el-select>
            <el-select v-model="selectedLocation" placeholder="存放位置" style="width: 150px; margin-right: 15px">
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
      <el-table :data="archiveList" stripe style="width: 100%">
        <el-table-column prop="itemNo" label="物品编号" min-width="150" fixed />
        <el-table-column prop="name" label="物品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" min-width="120" />
        <el-table-column prop="awardDate" label="获得日期" min-width="120" />
        <el-table-column prop="location" label="存放位置" min-width="150" />
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
    </el-card>
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
  { itemNo: 'SW-2024-001', name: '全国优秀教师奖杯', type: '奖杯奖牌', awardDate: '2024-01-15', location: '展示厅', condition: '完好', status: '在库' },
  { itemNo: 'SW-2024-002', name: '国家级教学成果奖证书', type: '证书证件', awardDate: '2023-12-20', location: '档案室A区', condition: '完好', status: '在库' },
  { itemNo: 'SW-2024-003', name: '学校公章（旧版）', type: '印章档案', awardDate: '1950-01-01', location: '保险柜', condition: '完好', status: '在库' },
  { itemNo: 'SW-2023-089', name: '省级科技进步奖奖牌', type: '奖杯奖牌', awardDate: '2023-10-15', location: '展示厅', condition: '完好', status: '在库' },
  { itemNo: 'SW-2023-088', name: '办学许可证', type: '证书证件', awardDate: '1980-05-01', location: '档案室B区', condition: '良好', status: '在库' },
  { itemNo: 'SW-2024-004', name: '建校初期校徽', type: '其他实物', awardDate: '1950-09-01', location: '档案室A区', condition: '良好', status: '借出' }
])

const getConditionType = (condition) => {
  const map = { '完好': 'success', '良好': 'warning', '一般': 'info', '需修复': 'danger' }
  return map[condition] || 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
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
</style>
