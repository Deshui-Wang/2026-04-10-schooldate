<template>
  <div class="page-container">
    <div class="page-header">
      <h2>学院管理</h2>
      <div class="header-actions">
        <el-select v-model="filterSchool" placeholder="选择学校" style="width: 200px; margin-right: 15px">
          <el-option label="示范性高等职业技术学院" value="1" />
          <el-option label="工程技术职业大学" value="2" />
        </el-select>
        <el-button type="primary">新增学院</el-button>
      </div>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="code" label="学院代码" width="120" />
        <el-table-column prop="name" label="学院名称" min-width="180" />
        <el-table-column prop="school" label="所属学校" min-width="200" />
        <el-table-column prop="dean" label="院长" width="120" />
        <el-table-column prop="staffCount" label="教职工数" width="100" align="center" />
        <el-table-column prop="studentCount" label="学生数" width="100" align="center" />
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterSchool = ref('')

const tableData = ref([
  { code: '01', name: '信息工程学院', school: '示范性高等职业技术学院', dean: '刘教授', staffCount: 120, studentCount: 2500 },
  { code: '02', name: '机电工程学院', school: '示范性高等职业技术学院', dean: '陈教授', staffCount: 100, studentCount: 2200 },
  { code: '03', name: '经济管理学院', school: '示范性高等职业技术学院', dean: '杨教授', staffCount: 80, studentCount: 1800 },
  { code: '01', name: '智能制造学院', school: '工程技术职业大学', dean: '赵院长', staffCount: 150, studentCount: 3000 },
])
</script>

<style scoped>
.page-container {
  padding: 0;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
.header-actions {
  display: flex;
  align-items: center;
}
</style>
