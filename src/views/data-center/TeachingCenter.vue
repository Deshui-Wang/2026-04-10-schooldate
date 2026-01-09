<template>
  <div class="data-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>教学中心</h3>
        <p>聚合全校教学相关数据，提供排课、班级、学生、作业及成绩等多维度管理</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="horizontal-tabs">
        <el-tab-pane label="排课管理" name="schedule">
          <div class="tab-container">
            <CourseManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="班级管理" name="class">
          <div class="tab-container">
            <ClassManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="学生管理" name="student">
          <div class="tab-container">
            <StudentManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="作业管理" name="homework">
          <div class="tab-container">
            <HomeworkManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="成绩管理" name="grade">
          <div class="tab-container">
            <GradeManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="出勤管理" name="attendance">
          <div class="tab-container">
            <AttendanceManagement />
          </div>
        </el-tab-pane>
        <el-tab-pane label="课堂互动" name="classroom">
          <div class="tab-container">
            <ClassroomInteraction />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CourseManagement from '../management-center/CourseManagement.vue'
import ClassManagement from '../management-center/ClassManagement.vue'
import StudentManagement from '../student-management/StudentManagement.vue'
import HomeworkManagement from '../student-management/HomeworkManagement.vue'
import GradeManagement from '../student-management/GradeManagement.vue'
import AttendanceManagement from '../student-management/AttendanceManagement.vue'
import ClassroomInteraction from '../student-management/ClassroomInteraction.vue'

const activeTab = ref('schedule')
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

/* 隐藏子组件内部的 header 避免重复 */
.tab-container :deep(.section-header) {
  display: none;
}
</style>
