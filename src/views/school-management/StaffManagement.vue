<template>
  <div class="page-container">
    <div class="page-header">
      <h2>教职工管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchQuery"
          placeholder="搜索姓名/工号"
          style="width: 250px; margin-right: 15px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary">新增教职工</el-button>
      </div>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="id" label="工号" width="120" sortable />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" align="center" />
        <el-table-column prop="college" label="所属学院" min-width="150" show-overflow-tooltip />
        <el-table-column prop="department" label="所属部门/系" min-width="150" show-overflow-tooltip />
        <el-table-column prop="title" label="职称" width="120" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在职' ? 'success' : 'info'" size="small">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          layout="total, prev, pager, next"
          :total="120"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')

const tableData = ref([
  { id: '20230001', name: '张三', gender: '男', college: '信息工程学院', department: '软件技术系', title: '教授', status: '在职' },
  { id: '20230002', name: '李四', gender: '女', college: '信息工程学院', department: '计算机网络技术系', title: '副教授', status: '在职' },
  { id: '20230003', name: '王五', gender: '男', college: '机电工程学院', department: '机械设计制造系', title: '讲师', status: '在职' },
  { id: '20230004', name: '赵六', gender: '女', college: '信息工程学院', department: '学生工作办公室', title: '讲师', status: '休假' },
  { id: '20230005', name: '孙七', gender: '男', college: '经济管理学院', department: '会计系', title: '助教', status: '在职' },
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
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
