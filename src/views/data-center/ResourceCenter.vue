<template>
  <div class="data-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>资源中心</h3>
        <p>提供全方位的教学资源，包括课件、课程、题库以及先进的AI数字资产</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="horizontal-tabs">
        <el-tab-pane label="课件资源" name="courseware">
          <div class="tab-container">
            <CoursewareManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程资源" name="course">
          <div class="tab-container">
            <CourseManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="题库资源" name="questions">
          <div class="tab-container">
            <ResourceManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="作业模板" name="homework">
          <div class="tab-container">
            <HomeworkManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="学校资产" name="asset">
          <div class="tab-container">
            <AssetManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="工作流" name="workflow">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无工作流数据" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="智能体" name="agent">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无智能体数据" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数字人" name="digital-human">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无数字人数据" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="影音资源" name="media">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无影音资源数据" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CoursewareManagement from '../management-center/CoursewareManagement.vue'
import CourseManagement from '../management-center/CourseManagement.vue'
import ResourceManagement from '../management-center/ResourceManagement.vue'
import HomeworkManagement from '../student-management/HomeworkManagement.vue'
import AssetManagement from '../management-center/AssetManagement.vue'

const activeTab = ref('courseware')
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

.placeholder-content {
  padding: 40px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
}
</style>
