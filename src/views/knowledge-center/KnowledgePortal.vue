<template>
  <div class="knowledge-portal">
    <div class="section-header">
      <h3>知识门户</h3>
      <p>构建 "教育教学"、"科研申报中心"、"招生政策库" 等场景门户，将散落在各全宗的知识、工具、模板一站式聚合</p>
    </div>

    <!-- 新建门户按钮 -->
    <el-button type="primary" icon="plus" @click="handleCreatePortal" style="margin-bottom: 20px">
      新建门户
    </el-button>

    <!-- 门户列表 -->
    <el-row :gutter="20">
      <el-col v-for="portal in portals" :key="portal.id" :span="8" style="margin-bottom: 20px;">
        <el-card shadow="hover" class="portal-card">
          <template #header>
            <div class="portal-header">
              <h4>{{ portal.name }}</h4>
              <el-tag type="success" v-if="portal.status === '已发布'">已发布</el-tag>
              <el-tag type="warning" v-else>未发布</el-tag>
            </div>
          </template>
          <div class="portal-content">
            <p class="description">{{ portal.description }}</p>
            <div class="integration-info-display">
                <div class="integration-methods">
                    <span class="label">集成方式:</span>
                    <el-tag v-if="portal.apiEndpoint" size="small" type="info">API</el-tag>
                    <el-tag v-if="portal.externalLink" size="small" type="info">外链</el-tag>
                    <el-tag v-if="portal.embedCode" size="small" type="info">嵌入</el-tag>
                </div>
                <div class="integrated-platforms">
                    <span class="label">已集成:</span>
                    <el-tag v-for="platform in portal.integratedPlatforms" :key="platform" size="small" style="margin-left: 5px;">
                        {{ platform }}
                    </el-tag>
                </div>
            </div>
            <el-divider />
            <div class="stats">
              <div class="stat-item">
                <div class="value">{{ portal.knowledgeItems.length }}</div>
                <div class="label">知识条目</div>
              </div>
              <div class="stat-item">
                <div class="value">{{ portal.templates.length }}</div>
                <div class="label">模板</div>
              </div>
              <div class="stat-item">
                <div class="value">{{ portal.applications.length }}</div>
                <div class="label">应用</div>
              </div>
            </div>
          </div>
          <template #footer>
            <div class="portal-actions">
              <el-button type="success" size="small" @click="handlePreviewPortal(portal)">预览</el-button>
              <el-button type="primary" size="small" @click="handleEditPortal(portal)">编辑</el-button>
              <el-button type="warning" size="small" @click="handleConfigurePortal(portal)">配置内容</el-button>
              <el-button :type="portal.status === '已发布' ? 'info' : 'success'" size="small" @click="handleTogglePublish(portal)">
                {{ portal.status === '已发布' ? '下架' : '发布' }}
              </el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>

    <!-- 创建/编辑门户弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-form :model="portalForm" label-width="120px" style="padding: 20px 0;">
            <el-form-item label="门户名称">
              <el-input v-model="portalForm.name" placeholder="请输入门户名称" />
            </el-form-item>
            <el-form-item label="门户场景">
              <el-select v-model="portalForm.scene" placeholder="请选择场景" style="width: 100%">
                <el-option v-for="scene in scenes" :key="scene" :label="scene" :value="scene" />
              </el-select>
            </el-form-item>
            <el-form-item label="门户描述">
              <el-input v-model="portalForm.description" type="textarea" :rows="3" placeholder="请输入描述" />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="portalForm.status">
                <el-radio label="已发布">已发布</el-radio>
                <el-radio label="未发布">未发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="集成信息" name="integration">
          <div class="integration-info" style="padding: 20px 0;">
            <el-descriptions title="API 信息" :column="1" border>
              <el-descriptions-item label="API 端点">{{ portalForm.apiEndpoint }}</el-descriptions-item>
              <el-descriptions-item label="认证方式">{{ portalForm.auth }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="外链信息" :column="1" border>
              <el-descriptions-item label="外链 URL">{{ portalForm.externalLink }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="嵌入代码" :column="1" border>
              <el-descriptions-item label="Embed Code">
                <pre><code>{{ portalForm.embedCode }}</code></pre>
              </el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="已集成平台" :column="1" border>
                <el-descriptions-item label="平台列表">
                    <el-tag v-for="platform in portalForm.integratedPlatforms" :key="platform" style="margin-right: 5px;">
                        {{ platform }}
                    </el-tag>
                </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePortal">保存</el-button>
      </template>
    </el-dialog>

    <!-- 配置内容抽屉 -->
    <el-drawer v-model="configDrawerVisible" title="配置门户内容" size="80%" direction="rtl">
      <div v-if="currentPortal" class="config-drawer-content">
        <el-tabs v-model="configActiveTab">
          <el-tab-pane label="知识条目" name="knowledge">
            <PortalConfigPanel
              :items="currentPortal.knowledgeItems"
              :all-items="allKnowledgeItems"
              item-key="title"
              @update:items="currentPortal.knowledgeItems = $event"
            />
          </el-tab-pane>
          <el-tab-pane label="模板" name="templates">
            <PortalConfigPanel
              :items="currentPortal.templates"
              :all-items="allTemplates"
              item-key="name"
              @update:items="currentPortal.templates = $event"
            />
          </el-tab-pane>
          <el-tab-pane label="应用" name="applications">
            <PortalConfigPanel
              :items="currentPortal.applications"
              :all-items="allApplications"
              item-key="name"
              @update:items="currentPortal.applications = $event"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>

    <!-- 预览门户弹窗 -->
    <el-dialog v-model="previewVisible" :title="`门户预览 - ${previewPortal?.name}`" width="1000px" custom-class="portal-preview-dialog">
      <div v-if="previewPortal" class="preview-container">
        <div class="preview-banner">
          <div class="banner-content">
            <h2>{{ previewPortal.name }}</h2>
            <p>{{ previewPortal.description }}</p>
            <div class="banner-tags">
              <el-tag size="small" effect="dark">{{ previewPortal.scene }}</el-tag>
              <el-tag v-if="previewPortal.apiEndpoint" type="info" size="small">API 支持</el-tag>
            </div>
          </div>
        </div>

        <div class="preview-sections">
          <el-row :gutter="20">
            <el-col :span="16">
              <div class="preview-section">
                <div class="section-title">
                  <el-icon><Reading /></el-icon> 知识条目
                </div>
                <div class="item-grid">
                  <div v-for="item in previewPortal.knowledgeItems" :key="item.id" class="preview-item">
                    <el-icon><Document /></el-icon>
                    <span>{{ item.title }}</span>
                  </div>
                  <el-empty v-if="previewPortal.knowledgeItems.length === 0" description="暂无知识条目" :image-size="60" />
                </div>
              </div>

              <div class="preview-section">
                <div class="section-title">
                  <el-icon><Files /></el-icon> 模板资源
                </div>
                <div class="item-grid">
                  <div v-for="item in previewPortal.templates" :key="item.id" class="preview-item template">
                    <el-icon><Collection /></el-icon>
                    <span>{{ item.name }}</span>
                  </div>
                  <el-empty v-if="previewPortal.templates.length === 0" description="暂无模板资源" :image-size="60" />
                </div>
              </div>
            </el-col>
            
            <el-col :span="8">
              <div class="preview-section">
                <div class="section-title">
                  <el-icon><Menu /></el-icon> 关联应用
                </div>
                <div class="app-list">
                  <div v-for="item in previewPortal.applications" :key="item.id" class="preview-app">
                    <div class="app-icon">{{ item.name.charAt(0) }}</div>
                    <div class="app-info">
                      <div class="app-name">{{ item.name }}</div>
                      <div class="app-type">应用系统</div>
                    </div>
                  </div>
                  <el-empty v-if="previewPortal.applications.length === 0" description="暂无关联应用" :image-size="60" />
                </div>
              </div>

              <div class="preview-section integration">
                <div class="section-title">集成平台</div>
                <div class="platform-tags">
                  <el-tag v-for="platform in previewPortal.integratedPlatforms" :key="platform" size="small" type="success" effect="plain">
                    {{ platform }}
                  </el-tag>
                  <span v-if="previewPortal.integratedPlatforms.length === 0" class="no-data">暂未集成外部平台</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        
        <div class="preview-footer">
          <el-button type="primary" @click="visitPortal">立即进入门户</el-button>
          <el-button @click="previewVisible = false">关闭预览</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Reading, Document, Files, Collection, Menu } from '@element-plus/icons-vue'
import PortalConfigPanel from './components/PortalConfigPanel.vue'

const scenes = ['教育教学', '科研申报中心', '招生政策库', '实验室管理', '学生服务', '教师发展']

const allKnowledgeItems = ref([
    { id: 1, title: '教学大纲' },
    { id: 2, title: '科研项目申请指南' },
    { id: 3, title: '招生简章' },
    { id: 4, title: '实验室安全手册' },
    { id: 5, title: '学生手册' },
    { id: 6, title: '教师发展规划' },
])

const allTemplates = ref([
    { id: 1, name: '课程设计模板' },
    { id: 2, name: '项目申报书模板' },
    { id: 3, name: '招生宣传PPT模板' },
    { id: 4, name: '实验报告模板' },
    { id: 5, name: '请假条模板' },
    { id: 6, name: '个人发展计划模板' },
])

const allApplications = ref([
    { id: 1, name: '在线教学平台' },
    { id: 2, name: '科研管理系统' },
    { id: 3, name: '招生管理系统' },
    { id: 4, name: '设备预约系统' },
    { id: 5, name: '学生服务中心' },
    { id: 6, name: '教师评价系统' },
])

const portals = ref([
  { id: 1, name: '教育教学门户', scene: '教育教学', description: '整合课程素材、教学资源、教学工具，一站式服务教学人员', knowledgeItems: [allKnowledgeItems.value[0]], templates: [allTemplates.value[0]], applications: [allApplications.value[0]], status: '已发布', apiEndpoint: '/api/portal/edu', auth: 'OAuth2', externalLink: 'https://edu.example.com', embedCode: '<iframe src="https://edu.example.com/embed"></iframe>', integratedPlatforms: ['OA系统', '企微'] },
  { id: 2, name: '科研申报中心', scene: '科研申报中心', description: '聚合科研政策、项目指南、申报模板和常用工具', knowledgeItems: [allKnowledgeItems.value[1]], templates: [allTemplates.value[1]], applications: [allApplications.value[1]], status: '未发布', apiEndpoint: '/api/portal/research', auth: 'API Key', externalLink: 'https://research.example.com', embedCode: '<iframe src="https://research.example.com/embed"></iframe>', integratedPlatforms: ['钉钉'] },
  { id: 3, name: '招生政策库', scene: '招生政策库', description: '汇总招生政策、历年招生数据、招生宣传素材等内容', knowledgeItems: [allKnowledgeItems.value[2]], templates: [allTemplates.value[2]], applications: [allApplications.value[2]], status: '已发布', apiEndpoint: '/api/portal/admissions', auth: 'OAuth2', externalLink: 'https://admissions.example.com', embedCode: '<iframe src="https://admissions.example.com/embed"></iframe>', integratedPlatforms: ['OA系统'] },
  { id: 4, name: '实验室安全管理门户', scene: '实验室管理', description: '提供实验室安全规范、操作手册、培训视频等内容', knowledgeItems: [allKnowledgeItems.value[3]], templates: [allTemplates.value[3]], applications: [allApplications.value[3]], status: '未发布', apiEndpoint: '/api/portal/lab', auth: 'API Key', externalLink: 'https://lab.example.com', embedCode: '<iframe src="https://lab.example.com/embed"></iframe>', integratedPlatforms: [] },
  { id: 5, name: '教师发展门户', scene: '教师发展', description: '汇集教师培训、教学研究、职业发展资源', knowledgeItems: [allKnowledgeItems.value[5]], templates: [allTemplates.value[5]], applications: [allApplications.value[5]], status: '已发布', apiEndpoint: '/api/portal/dev', auth: 'OAuth2', externalLink: 'https://dev.example.com', embedCode: '<iframe src="https://dev.example.com/embed"></iframe>', integratedPlatforms: ['企微', 'iPortal'] },
  { id: 6, name: '学生服务门户', scene: '学生服务', description: '集中学生服务指南、常用流程、表格下载等内容', knowledgeItems: [allKnowledgeItems.value[4]], templates: [allTemplates.value[4]], applications: [allApplications.value[4]], status: '未发布', apiEndpoint: '/api/portal/student', auth: 'API Key', externalLink: 'https://student.example.com', embedCode: '<iframe src="https://student.example.com/embed"></iframe>', integratedPlatforms: ['钉钉'] }
])

const dialogVisible = ref(false)
const isEditMode = ref(false)
const activeTab = ref('basic')
const portalForm = ref({ id: null, name: '', scene: '', description: '', status: '未发布', apiEndpoint: '', auth: '', externalLink: '', embedCode: '', integratedPlatforms: [] })
const configDrawerVisible = ref(false)
const currentPortal = ref(null)
const configActiveTab = ref('knowledge')

const previewVisible = ref(false)
const previewPortal = ref(null)

const dialogTitle = computed(() => (isEditMode.value ? '编辑门户' : '新建门户'))

const handleCreatePortal = () => {
  portalForm.value = { id: null, name: '', scene: '', description: '', status: '未发布', apiEndpoint: '', auth: '', externalLink: '', embedCode: '', integratedPlatforms: [], knowledgeItems: [], templates: [], applications: [] }
  isEditMode.value = false
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleEditPortal = (portal) => {
  portalForm.value = JSON.parse(JSON.stringify(portal))
  isEditMode.value = true
  activeTab.value = 'basic'
  dialogVisible.value = true
}

const handleSavePortal = () => {
  if (isEditMode.value) {
    // 更新
    const idx = portals.value.findIndex(p => p.id === portalForm.value.id)
    if (idx > -1) {
      portals.value[idx] = { ...portals.value[idx], ...portalForm.value }
      ElMessage.success('门户已更新')
    }
  } else {
    // 新增
    portalForm.value.id = portals.value.length + 1
    portals.value.push({ ...portalForm.value })
    ElMessage.success('门户已创建')
  }
  dialogVisible.value = false
}

const handleConfigurePortal = (portal) => {
  currentPortal.value = portal
  configDrawerVisible.value = true
}

const handleTogglePublish = (portal) => {
  if (portal.status === '已发布') {
    ElMessageBox.confirm('确定要下架该门户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      portal.status = '未发布'
      ElMessage.success('门户已下架')
    }).catch(() => {})
  } else {
    portal.status = '已发布'
    ElMessage.success('门户已发布')
  }
}

const handlePreviewPortal = (portal) => {
  previewPortal.value = portal
  previewVisible.value = true
}

const visitPortal = () => {
  if (previewPortal.value?.externalLink) {
    window.open(previewPortal.value.externalLink, '_blank')
  } else {
    ElMessage.info('门户进入功能正在开发中...')
  }
}
</script>

<style scoped>
.knowledge-portal {
  padding: 0;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #606266;
  font-size: 14px;
}

.portal-card {
  transition: all 0.3s;
}

.portal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.portal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.portal-content .description {
  min-height: 60px;
  color: #606266;
  font-size: 14px;
}

.integration-info-display {
    font-size: 12px;
    color: #909399;
    margin-top: 10px;
}

.integration-methods,
.integrated-platforms {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 8px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
}

.stat-item {
  text-align: center;
}

.stat-item .value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.stat-item .label {
  font-size: 12px;
  color: #909399;
}

.portal-actions {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}

pre {
    background-color: #f5f7fa;
    padding: 10px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

code {
    font-family: 'Courier New', Courier, monospace;
    color: #303133;
}

.config-drawer-content {
  padding: 0 20px;
}

/* 预览样式 */
.preview-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #fdfdfd;
}

.preview-banner {
  background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
  padding: 40px;
  border-radius: 12px;
  color: #fff;
}

.banner-content h2 {
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 700;
}

.banner-content p {
  margin: 0 0 20px 0;
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.6;
}

.banner-tags {
  display: flex;
  gap: 12px;
}

.preview-sections {
  padding: 0 10px;
}

.preview-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid #f0f0f0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .el-icon {
  color: #1890ff;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.preview-item {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.preview-item:hover {
  background: #fff;
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.preview-item.template {
  border-left: 4px solid #fa8c16;
}

.preview-item .el-icon {
  font-size: 20px;
  color: #1890ff;
}

.preview-item.template .el-icon {
  color: #fa8c16;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-app {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #f0f0f0;
}

.app-icon {
  width: 40px;
  height: 40px;
  background: #e6f7ff;
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: bold;
  font-size: 18px;
}

.app-name {
  font-weight: 500;
  color: #262626;
  font-size: 14px;
}

.app-type {
  font-size: 12px;
  color: #8c8c8c;
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.no-data {
  font-size: 12px;
  color: #bfbfbf;
}

.preview-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
}
</style>
