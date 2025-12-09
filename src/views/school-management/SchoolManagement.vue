<template>
  <div class="page-container">
    <div class="page-header">
      <h2>学校管理</h2>
      <el-button type="primary">新增学校</el-button>
    </div>
    <el-card class="table-card">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="code" label="学校代码" width="120" />
        <el-table-column prop="name" label="学校名称" min-width="200" />
        <el-table-column prop="level" label="办学层次" width="120" />
        <el-table-column prop="address" label="地址" min-width="250" />
        <el-table-column prop="contact" label="联系人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="150" />
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

const tableData = ref([
  { code: '10001', name: '示范性高等职业技术学院', level: '高职(专科)', address: '北京市海淀区科技路1号', contact: '王校长', phone: '010-88886666' },
  { code: '10002', name: '工程技术职业大学', level: '本科层次职业教育', address: '上海市浦东新区创新大道88号', contact: '张书记', phone: '021-66668888' },
  { code: '10003', name: '现代服务职业学院', level: '高职(专科)', address: '广州市天河区智慧城5号', contact: '李院长', phone: '020-33339999' },
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
</style>
