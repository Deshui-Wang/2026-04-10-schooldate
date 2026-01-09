<template>
  <div class="data-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>知识中心</h3>
        <p>构建校园知识生态，提供知识图谱、能力图谱及丰富的在线图书资源</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="horizontal-tabs">
        <el-tab-pane label="知识图谱" name="knowledge-graph">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无知识图谱数据" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="能力图谱" name="capability-map">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无能力图谱数据" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="在线图书馆" name="online-library">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无在线图书馆数据" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('knowledge-graph')
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

.placeholder-content {
  padding: 80px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
