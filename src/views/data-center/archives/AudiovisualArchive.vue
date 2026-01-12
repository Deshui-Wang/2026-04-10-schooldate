<template>
  <div class="archive-list">
    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card av">
          <div class="stat-value">3,456</div>
          <div class="stat-label">照片档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card av">
          <div class="stat-value">892</div>
          <div class="stat-label">视频档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card av">
          <div class="stat-value">156</div>
          <div class="stat-label">音频档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card av">
          <div class="stat-value">1.2TB</div>
          <div class="stat-label">存储容量</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索筛选 -->
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索标题/拍摄者/活动名称" style="width: 280px" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="selectedType" placeholder="类型" style="width: 120px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="照片" value="照片" />
        <el-option label="视频" value="视频" />
        <el-option label="音频" value="音频" />
      </el-select>
      <el-select v-model="selectedEvent" placeholder="活动类型" style="width: 140px; margin-left: 12px">
        <el-option label="全部" value="" />
        <el-option label="校庆活动" value="校庆活动" />
        <el-option label="毕业典礼" value="毕业典礼" />
        <el-option label="学术会议" value="学术会议" />
        <el-option label="文体活动" value="文体活动" />
        <el-option label="领导视察" value="领导视察" />
      </el-select>
      <el-button type="primary" style="margin-left: 12px" @click="handleSearch">查询</el-button>
      <el-button @click="handleUpload">上传</el-button>
    </div>

    <!-- 档案列表 -->
    <el-table :data="archiveList" stripe style="width: 100%" height="100%">
      <el-table-column prop="fileNo" label="档号" width="140" fixed />
      <el-table-column prop="title" label="标题" min-width="250" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="80">
        <template #default="scope">
          <el-tag :type="getTypeColor(scope.row.type)" size="small">
            {{ scope.row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eventType" label="活动类型" width="120" />
      <el-table-column prop="photographer" label="拍摄者" width="100" />
      <el-table-column prop="shootDate" label="拍摄日期" width="110" />
      <el-table-column prop="fileSize" label="文件大小" width="100" />
      <el-table-column prop="duration" label="时长" width="80" />
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="previewFile(scope.row)">预览</el-button>
          <el-button link type="success" @click="handleDownload(scope.row)">下载</el-button>
          <el-button link type="warning" @click="handleEdit(scope.row)">编辑</el-button>
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
const selectedEvent = ref('')

const archiveList = ref([
  { fileNo: 'SX-2024-001', title: '2024年毕业典礼全程录像', type: '视频', eventType: '毕业典礼', photographer: '宣传部', shootDate: '2024-06-28', fileSize: '4.5GB', duration: '120分钟' },
  { fileNo: 'SX-2024-002', title: '校庆70周年文艺晚会', type: '视频', eventType: '校庆活动', photographer: '融媒体中心', shootDate: '2024-10-15', fileSize: '6.2GB', duration: '180分钟' },
  { fileNo: 'SX-2024-003', title: '国际学术会议开幕式照片集', type: '照片', eventType: '学术会议', photographer: '张摄影师', shootDate: '2024-05-20', fileSize: '850MB', duration: '156张' },
  { fileNo: 'SX-2024-004', title: '春季运动会精彩瞬间', type: '照片', eventType: '文体活动', photographer: '学生记者团', shootDate: '2024-04-12', fileSize: '1.2GB', duration: '320张' },
  { fileNo: 'SX-2024-005', title: '校史讲座录音', type: '音频', eventType: '校庆活动', photographer: '档案馆', shootDate: '2024-09-08', fileSize: '120MB', duration: '90分钟' },
  { fileNo: 'SX-2023-089', title: '教育部领导视察', type: '照片', eventType: '领导视察', photographer: '宣传部', shootDate: '2023-11-15', fileSize: '650MB', duration: '98张' }
])

const getTypeColor = (type) => {
  const map = { '照片': 'success', '视频': 'primary', '音频': 'warning' }
  return map[type] || 'info'
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleUpload = () => {
  ElMessage.info('打开上传对话框')
}

const previewFile = (row) => {
  ElMessage.info(`预览: ${row.title}`)
}

const handleDownload = (row) => {
  ElMessage.success(`下载: ${row.fileNo}`)
}

const handleEdit = (row) => {
  ElMessage.info(`编辑: ${row.title}`)
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

.stat-card.av {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
