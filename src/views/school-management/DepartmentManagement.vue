<template>
  <div class="page-container">
    <div class="page-header">
      <h2>部门管理</h2>
      <div class="header-actions">
        <el-select v-model="filterCollege" placeholder="选择归属" style="width: 200px; margin-right: 15px">
          <el-option label="行政机关" value="行政机关" />
          <el-option label="教辅单位" value="教辅单位" />
          <el-option label="党群组织" value="党群组织" />
        </el-select>
        <el-button type="primary">新增部门</el-button>
      </div>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="code" label="部门代码" width="120" />
        <el-table-column prop="name" label="部门/专业系名称" min-width="180" />
        <el-table-column prop="college" label="所属学院" min-width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.type === '行政' ? 'info' : 'success'" size="small">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="manager" label="负责人" width="120" />
        <el-table-column prop="staffCount" label="人数" width="100" align="center" sortable />
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

const filterCollege = ref('')

const tableData = ref([
  // 行政部门
  { code: '1001', name: '教务处', college: '行政机关', type: '行政', manager: '张处长', staffCount: 45 },
  { code: '1002', name: '人事处', college: '行政机关', type: '行政', manager: '李处长', staffCount: 18 },
  { code: '1003', name: '学工处', college: '行政机关', type: '行政', manager: '王处长', staffCount: 32 },
  { code: '1004', name: '科研处', college: '行政机关', type: '行政', manager: '赵处长', staffCount: 12 },
  { code: '1005', name: '资产处', college: '行政机关', type: '行政', manager: '钱处长', staffCount: 15 },
  { code: '1006', name: '信息中心', college: '教辅单位', type: '教辅', manager: '孙主任', staffCount: 20 },
  { code: '1007', name: '财务处', college: '行政机关', type: '行政', manager: '周处长', staffCount: 14 },
  { code: '1008', name: '团委', college: '党群组织', type: '行政', manager: '吴书记', staffCount: 8 },
  // 教学系部 (同步自学院管理)
  { code: '2001', name: '软件技术系', college: '信息工程学院', type: '教学', manager: '刘主任', staffCount: 56 },
  { code: '2002', name: '计算机网络技术系', college: '信息工程学院', type: '教学', manager: '陈主任', staffCount: 42 },
  { code: '2003', name: '机械设计制造系', college: '机电工程学院', type: '教学', manager: '杨主任', staffCount: 48 },
  { code: '2004', name: '自动化系', college: '机电工程学院', type: '教学', manager: '黄主任', staffCount: 38 },
  { code: '2005', name: '会计系', college: '经济管理学院', type: '教学', manager: '周主任', staffCount: 35 },
  { code: '2006', name: '市场营销系', college: '经济管理学院', type: '教学', manager: '吴主任', staffCount: 28 },
  { code: '2007', name: '智能控制系', college: '智能制造学院', type: '教学', manager: '郑主任', staffCount: 40 },
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
