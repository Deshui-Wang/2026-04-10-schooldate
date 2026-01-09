<template>
  <div class="data-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>档案中心</h3>
        <p>全校师生的电子档案管理，提供便捷的查询与维护功能</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="horizontal-tabs">
        <el-tab-pane label="教师档案" name="teacher">
          <div class="tab-container">
            <TeacherArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="学生档案" name="student">
          <div class="tab-container">
            <StudentArchive />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TeacherArchive from '../archive-center/TeacherArchive.vue'
import StudentArchive from '../archive-center/StudentArchive.vue'

const activeTab = ref('teacher')
</script>

<style scoped>
.data-center-view {
  padding: 0;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.section-header p {
  color: #718096;
  font-size: 14px;
}

.content-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.horizontal-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.horizontal-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #edf2f7;
}

.horizontal-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  height: 50px;
  line-height: 50px;
}

.horizontal-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 700;
}

.tab-container {
  padding: 10px 0;
}

.tab-container :deep(.section-header) {
  display: none;
}
</style>
