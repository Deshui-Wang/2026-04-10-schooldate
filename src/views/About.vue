<template>
  <div class="about">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>关于项目</span>
            </div>
          </template>
          
          <div class="about-content">
            <h2>ZL Date 项目信息</h2>
            
            <el-descriptions :column="2" border>
              <el-descriptions-item label="项目名称">ZL Date</el-descriptions-item>
              <el-descriptions-item label="技术栈">Vue3 + JavaScript + Element Plus</el-descriptions-item>
              <el-descriptions-item label="构建工具">Vite</el-descriptions-item>
              <el-descriptions-item label="Node.js版本">18.20.5</el-descriptions-item>
              <el-descriptions-item label="路由管理">Vue Router</el-descriptions-item>
              <el-descriptions-item label="UI组件库">Element Plus</el-descriptions-item>
            </el-descriptions>
            
            <el-divider />
            
            <div class="features">
              <h3>项目特性</h3>
              <el-timeline>
                <el-timeline-item timestamp="2024-10-22" placement="top">
                  <el-card>
                    <h4>Vue3 组合式API</h4>
                    <p>使用最新的 Vue3 Composition API，提供更好的类型推导和代码组织</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2024-10-22" placement="top">
                  <el-card>
                    <h4>Element Plus 组件库</h4>
                    <p>集成完整的 Element Plus UI 组件库，提供丰富的界面组件</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2024-10-22" placement="top">
                  <el-card>
                    <h4>Vite 构建工具</h4>
                    <p>使用 Vite 作为构建工具，提供快速的开发体验和热重载</p>
                  </el-card>
                </el-timeline-item>
                <el-timeline-item timestamp="2024-10-22" placement="top">
                  <el-card>
                    <h4>Vue Router 路由</h4>
                    <p>集成 Vue Router 4，支持单页面应用路由管理</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            
            <el-divider />
            
            <div class="tech-stack">
              <h3>技术栈详情</h3>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-card class="tech-card">
                    <div class="tech-icon">
                      <el-icon size="40"><Platform /></el-icon>
                    </div>
                    <h4>Vue3</h4>
                    <p>渐进式 JavaScript 框架</p>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card class="tech-card">
                    <div class="tech-icon">
                      <el-icon size="40"><Grid /></el-icon>
                    </div>
                    <h4>Element Plus</h4>
                    <p>Vue3 UI 组件库</p>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card class="tech-card">
                    <div class="tech-icon">
                      <el-icon size="40"><Lightning /></el-icon>
                    </div>
                    <h4>Vite</h4>
                    <p>下一代前端构建工具</p>
                  </el-card>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.about-content h2 {
  color: #409eff;
  margin-bottom: 20px;
}

.features {
  margin: 30px 0;
}

.features h3 {
  color: #303133;
  margin-bottom: 20px;
}

.tech-stack {
  margin-top: 30px;
}

.tech-stack h3 {
  color: #303133;
  margin-bottom: 20px;
}

.tech-card {
  text-align: center;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tech-icon {
  margin-bottom: 10px;
  color: #409eff;
}

.tech-card h4 {
  margin: 10px 0;
  color: #303133;
}

.tech-card p {
  color: #909399;
  font-size: 14px;
}
</style>
