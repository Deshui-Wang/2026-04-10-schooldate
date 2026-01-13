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
          <div class="stat-value">1,234</div>
          <div class="stat-label">照片档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">856</div>
          <div class="stat-label">视频档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">423</div>
          <div class="stat-label">音频档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card audio">
          <div class="stat-value">67</div>
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
              placeholder="搜索标题/活动名称/拍摄时间"
              style="width: 300px; margin-right: 15px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="照片" value="照片" />
              <el-option label="视频" value="视频" />
              <el-option label="音频" value="音频" />
              <el-option label="光盘" value="光盘" />
            </el-select>
            <el-date-picker
              v-model="selectedDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px; margin-right: 15px"
            />
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="archiveList" stripe style="width: 100%">
        <el-table-column prop="archiveNo" label="档案编号" min-width="150" fixed />
        <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" min-width="100" />
        <el-table-column prop="event" label="活动/事件" min-width="180" show-overflow-tooltip />
        <el-table-column prop="shootDate" label="拍摄日期" min-width="120" />
        <el-table-column prop="duration" label="时长/数量" min-width="120" />
        <el-table-column prop="format" label="格式" min-width="100" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="success" @click="handlePlay(scope.row)">播放</el-button>
            <el-button link type="info" @click="handleDownload(scope.row)">下载</el-button>
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
const selectedDate = ref('')

const archiveList = ref([
  { archiveNo: 'SX-2024-001', title: '2024年开学典礼', type: '视频', event: '开学典礼', shootDate: '2024-02-20', duration: '45分钟', format: 'MP4' },
  { archiveNo: 'SX-2024-002', title: '校庆80周年庆典活动', type: '照片', event: '校庆庆典', shootDate: '2024-03-15', duration: '156张', format: 'JPG' },
  { archiveNo: 'SX-2024-003', title: '学术报告会录音', type: '音频', event: '学术报告', shootDate: '2024-01-10', duration: '120分钟', format: 'MP3' },
  { archiveNo: 'SX-2023-089', title: '毕业典礼视频', type: '视频', event: '毕业典礼', shootDate: '2023-06-20', duration: '90分钟', format: 'MP4' },
  { archiveNo: 'SX-2023-088', title: '教学成果展照片', type: '照片', event: '教学成果展', shootDate: '2023-11-15', duration: '89张', format: 'JPG' },
  { archiveNo: 'SX-2024-004', title: '重要会议录音光盘', type: '光盘', event: '重要会议', shootDate: '2024-02-01', duration: '1张', format: 'DVD' }
])

const handleSearch = () => {
  ElMessage.success('查询成功')
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
</style>
