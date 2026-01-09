<template>
  <div class="data-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>成果中心</h3>
        <p>汇聚师生各类科研、竞赛及实践成果，全面展示校园创新能力</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="horizontal-tabs">
        <el-tab-pane label="论文成果" name="paper">
          <div class="tab-container">
            <TeacherAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="专利成果" name="patent">
          <div class="tab-container">
            <TeacherAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="证书管理" name="certificate">
          <div class="tab-container">
            <TeacherAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="认证体系" name="certification">
          <div class="tab-container">
            <TeacherAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="科研项目" name="project">
          <div class="tab-container">
            <TeacherAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="学科比赛" name="competition">
          <div class="tab-container">
            <StudentAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="社会实践" name="practice">
          <div class="tab-container">
            <StudentAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="科创成果" name="innovation">
          <div class="tab-container">
            <StudentAchievementManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="优秀教材" name="textbook">
          <div class="tab-container">
            <TeacherAchievementManagement />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TeacherAchievementManagement from '../management-center/AchievementManagement.vue'
import StudentAchievementManagement from '../student-management/AchievementManagement.vue'

const activeTab = ref('paper')
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
