<template>
  <div class="data-dashboard">
    <div class="section-header">
      <h2>数据大屏</h2>
      <p>实时展示数据对接与采集情况</p>
    </div>

    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card stat-card-primary" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><Connection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ totalConnections }}</div>
              <div class="stat-label">对接方式总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card stat-card-success" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ successfulConnections }}</div>
              <div class="stat-label">已对接成功</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card stat-card-info" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">98</div>
              <div class="stat-label">上报表单总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card stat-card-warning" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="40"><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ collectedTablesCount }}</div>
              <div class="stat-label">已采集表单数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 对接方式情况 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :span="12">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">五种对接方式情况</span>
              <el-tag type="success" effect="plain">实时</el-tag>
            </div>
          </template>
          <div class="integration-list">
            <div v-for="item in integrationMethods" :key="item.name" class="integration-item">
              <div class="integration-info">
                <el-icon :size="24" :style="{ color: item.color }"><component :is="iconMap[item.icon]" /></el-icon>
                <span class="integration-name">{{ item.name }}</span>
              </div>
              <div class="integration-stats">
                <el-progress 
                  :percentage="item.progress" 
                  :stroke-width="12"
                  :color="item.color"
                  style="width: 200px"
                />
                <span class="integration-count">{{ item.count }}/{{ item.total }} 个</span>
              </div>
              <el-tag :type="item.status === '正常' ? 'success' : 'warning'" size="small">
                {{ item.status }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">表单数据采集概览</span>
              <el-tag type="primary" effect="plain">共98张</el-tag>
            </div>
          </template>
          <div class="collection-overview">
            <div class="collection-chart">
              <div class="donut-chart">
                <div class="donut-inner">
                  <div class="donut-value">{{ Math.round(collectedTablesCount / 98 * 100) }}%</div>
                  <div class="donut-label">采集率</div>
                </div>
              </div>
            </div>
            <div class="collection-legend">
              <div class="legend-item">
                <span class="legend-dot" style="background: #67c23a;"></span>
                <span class="legend-label">数据拉取成功</span>
                <span class="legend-value">{{ tableStatusCounts.success }} 张</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: #e6a23c;"></span>
                <span class="legend-label">部分字段映射中</span>
                <span class="legend-value">{{ tableStatusCounts.mapping }} 张</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background: #909399;"></span>
                <span class="legend-label">数据待入库</span>
                <span class="legend-value">{{ tableStatusCounts.pending }} 张</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据列表 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :span="24">
        <el-card class="dashboard-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">各部门数据采集情况</span>
              <el-button type="primary" link @click="refreshData">
                <el-icon><Refresh /></el-icon>
                刷新数据
              </el-button>
            </div>
          </template>
          <el-table :data="departmentStats" stripe style="width: 100%">
            <el-table-column prop="department" label="部门" width="150" />
            <el-table-column prop="tableCount" label="负责表单数" width="120" align="center" />
            <el-table-column label="采集进度" min-width="200">
              <template #default="scope">
                <el-progress 
                  :percentage="scope.row.progress" 
                  :stroke-width="10"
                  :color="getProgressColor(scope.row.progress)"
                />
              </template>
            </el-table-column>
            <el-table-column prop="successCount" label="成功" width="80" align="center">
              <template #default="scope">
                <el-tag type="success" size="small">{{ scope.row.successCount }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="pendingCount" label="进行中" width="80" align="center">
              <template #default="scope">
                <el-tag type="warning" size="small">{{ scope.row.pendingCount }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === '正常' ? 'success' : 'info'" size="small">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Connection, 
  CircleCheck, 
  Document, 
  DataLine, 
  Refresh,
  Link,
  Coin,
  Upload,
  Service,
  Monitor
} from '@element-plus/icons-vue'

// 图标映射
const iconMap = {
  Link,
  Coin,
  Upload,
  Service,
  Monitor
}

// 对接方式数据
const integrationMethods = ref([
  { name: 'API接口对接', icon: 'Link', count: 12, total: 15, progress: 80, status: '正常', color: '#409eff' },
  { name: '数据库直连', icon: 'Coin', count: 8, total: 10, progress: 80, status: '正常', color: '#67c23a' },
  { name: '文件导入', icon: 'Upload', count: 25, total: 30, progress: 83, status: '正常', color: '#e6a23c' },
  { name: 'MCP服务', icon: 'Service', count: 5, total: 8, progress: 63, status: '配置中', color: '#909399' },
  { name: '网页抓取', icon: 'Monitor', count: 3, total: 5, progress: 60, status: '正常', color: '#f56c6c' },
])

// 计算属性
const totalConnections = computed(() => integrationMethods.value.length)
const successfulConnections = computed(() => 
  integrationMethods.value.reduce((sum, item) => sum + item.count, 0)
)

// 表单状态统计 (模拟98张表)
const tableStatusCounts = ref({
  success: 42,  // 数据拉取成功
  mapping: 28,  // 部分字段映射中
  pending: 28   // 数据待入库
})

const collectedTablesCount = computed(() => tableStatusCounts.value.success)

// 部门统计
const departmentStats = ref([
  { department: '教务处', tableCount: 22, successCount: 12, pendingCount: 10, progress: 55, status: '正常' },
  { department: '人事处', tableCount: 18, successCount: 10, pendingCount: 8, progress: 56, status: '正常' },
  { department: '学工处', tableCount: 20, successCount: 8, pendingCount: 12, progress: 40, status: '进行中' },
  { department: '科研处', tableCount: 15, successCount: 6, pendingCount: 9, progress: 40, status: '进行中' },
  { department: '资产处', tableCount: 12, successCount: 4, pendingCount: 8, progress: 33, status: '进行中' },
  { department: '信息中心', tableCount: 11, successCount: 2, pendingCount: 9, progress: 18, status: '进行中' },
])

const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 50) return '#e6a23c'
  return '#f56c6c'
}

const refreshData = () => {
  ElMessage.success('数据已刷新')
}
</script>

<style scoped>
.data-dashboard {
  padding: 0;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.stat-card-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: #fff;
}

.stat-card-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.stat-card-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  opacity: 0.8;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.dashboard-row {
  margin-bottom: 20px;
}

.dashboard-card {
  border-radius: 12px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.integration-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.integration-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.integration-item:hover {
  background: #eef2f7;
}

.integration-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 140px;
}

.integration-name {
  font-weight: 500;
  color: #303133;
}

.integration-stats {
  display: flex;
  align-items: center;
  gap: 16px;
}

.integration-count {
  font-size: 13px;
  color: #909399;
  min-width: 60px;
}

.collection-overview {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px;
}

.collection-chart {
  flex-shrink: 0;
}

.donut-chart {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    #67c23a 0% 43%,
    #e6a23c 43% 72%,
    #909399 72% 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.donut-inner {
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donut-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.donut-label {
  font-size: 12px;
  color: #909399;
}

.collection-legend {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  flex: 1;
  color: #606266;
}

.legend-value {
  font-weight: 600;
  color: #303133;
}
</style>
