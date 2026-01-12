<template>
  <div class="archive-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>档案中心</h3>
        <p>全校综合档案管理平台，涵盖文书、科技、人事、基建、学生、声像、实物等多类型档案</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="archive-tabs">
        <el-tab-pane label="文书档案" name="document">
          <div class="tab-content">
            <DocumentArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="科技档案" name="technology">
          <div class="tab-content">
            <TechnologyArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="人事档案" name="personnel">
          <div class="tab-content">
            <TeacherArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="基建档案" name="infrastructure">
          <div class="tab-content">
            <InfrastructureArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="学生档案" name="student">
          <div class="tab-content">
            <StudentArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="声像档案" name="audiovisual">
          <div class="tab-content">
            <AudiovisualArchive />
          </div>
        </el-tab-pane>
        <el-tab-pane label="实物档案" name="physical">
          <div class="tab-content">
            <PhysicalArchive />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'
import TeacherArchive from '../archive-center/TeacherArchive.vue'
import StudentArchive from '../archive-center/StudentArchive.vue'

// 使用异步组件加载新增的档案类型组件
const DocumentArchive = defineAsyncComponent(() => import('./archives/DocumentArchive.vue'))
const TechnologyArchive = defineAsyncComponent(() => import('./archives/TechnologyArchive.vue'))
const InfrastructureArchive = defineAsyncComponent(() => import('./archives/InfrastructureArchive.vue'))
const AudiovisualArchive = defineAsyncComponent(() => import('./archives/AudiovisualArchive.vue'))
const PhysicalArchive = defineAsyncComponent(() => import('./archives/PhysicalArchive.vue'))

const activeTab = ref('document')
</script>

<style scoped>
.archive-center-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.section-header {
  margin-bottom: 24px;
  flex-shrink: 0;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.content-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow: hidden;
}

.archive-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.archive-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.archive-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #edf2f7;
}

.archive-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  height: 48px;
  line-height: 48px;
}

.archive-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 700;
}

.archive-tabs :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.archive-tabs :deep(.el-tab-pane) {
  height: 100%;
}

.tab-content {
  height: 100%;
  overflow-y: auto;
}

.tab-content :deep(.section-header) {
  display: none;
}
</style>
