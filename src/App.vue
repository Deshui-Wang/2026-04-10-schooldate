<template>
  <div id="app">
    <el-container class="warp">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <img src="/images/logo.png" alt="平台Logo" class="logo-img" />
          <h2 class="logo">智慧校园管理系统</h2>
        </div>
        <div class="header-right">
          <el-button type="primary" class="ai-assistant-btn" @click="showAIAssistant = !showAIAssistant">
            <el-icon><ChatDotRound /></el-icon>
            {{ showAIAssistant ? '合收AI助手' : 'AI智能档案助手' }}
          </el-button>
          <el-dropdown>
            <span class="user-avatar">
              <img src="/images/user.png" alt="管理员头像" class="avatar-img" />
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人设置</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="content">
        <!-- 左侧菜单 -->
        <el-aside width="240px" class="sidebar">
          <el-menu
            :default-active="$route.path"
            router
            class="sidebar-menu"
            background-color="transparent"
            text-color="#4a5568"
            active-text-color="#ffffff"
          >
            <el-menu-item index="/">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </el-menu-item>
            
            <el-sub-menu index="/consultation-center">
              <template #title>
                <el-icon><Document /></el-icon>
                <span>资讯通知</span>
              </template>
              <el-menu-item index="/consultation-center/article-management">文章管理</el-menu-item>
              <el-menu-item index="/consultation-center/notice-management">通知管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/reporting-center">
              <template #title>
                <el-icon><Upload /></el-icon>
                <span>上报中心</span>
              </template>
              <el-menu-item index="/reporting-center/monitor">上报监控</el-menu-item>
              <el-menu-item index="/reporting-center/forms">表单管理</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/data-center">
              <template #title>
                <el-icon><DataAnalysis /></el-icon>
                <span>数据中心</span>
              </template>
              <el-menu-item index="/data-center/teaching">教学中心</el-menu-item>
              <el-menu-item index="/data-center/resource">资源中心</el-menu-item>
              <el-menu-item index="/data-center/achievement">成果中心</el-menu-item>
              <el-menu-item index="/data-center/evaluation">评价中心</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/archive-center">
              <template #title>
                <el-icon><Collection /></el-icon>
                <span>档案中心</span>
              </template>
              <el-menu-item index="/archive-center/workbench">档案工作台</el-menu-item>
              <el-menu-item index="/archive-center/documentary">文书档案</el-menu-item>
              <el-menu-item index="/archive-center/scientific">科技档案</el-menu-item>
              <el-menu-item index="/archive-center/personnel">人事档案</el-menu-item>
              <el-menu-item index="/archive-center/infrastructure">基建档案</el-menu-item>
              <el-menu-item index="/archive-center/student">学生档案</el-menu-item>
              <el-menu-item index="/archive-center/audiovisual">声像档案</el-menu-item>
              <el-menu-item index="/archive-center/physical">实物档案</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/knowledge-center">
              <template #title>
                <el-icon><Reading /></el-icon>
                <span>知识中心</span>
              </template>
              <el-menu-item index="/knowledge-center/graph">知识图谱</el-menu-item>
              <el-menu-item index="/knowledge-center/space">知识空间</el-menu-item>
              <el-menu-item index="/knowledge-center/portal">知识门户</el-menu-item>
              <el-menu-item index="/knowledge-center/classification">知识分类</el-menu-item>
              <el-menu-item index="/knowledge-center/template">知识模版</el-menu-item>
              <el-menu-item index="/knowledge-center/operation">运营分析</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/intelligent-decision">
              <template #title>
                <el-icon><Cpu /></el-icon>
                <span>智能决策</span>
              </template>
              <el-menu-item index="/intelligent-decision/smart-recommendation">智能推荐</el-menu-item>
              <el-menu-item index="/intelligent-decision/smart-analysis">智能分析</el-menu-item>
              <el-menu-item index="/intelligent-decision/smart-decision">智能决策</el-menu-item>
              <el-menu-item index="/intelligent-decision/smart-monitoring">智能监测</el-menu-item>
              <el-menu-item index="/intelligent-decision/decision-support">决策支持</el-menu-item>
            </el-sub-menu>

            <!-- 暂时隐藏
            <el-sub-menu index="/teacher-management">
              <template #title>
                <el-icon><User /></el-icon>
                <span>教师管理</span>
              </template>
              <el-menu-item index="/teacher-management/teacher">教师管理</el-menu-item>
              <el-menu-item index="/teacher-management/class">班级管理</el-menu-item>
              <el-menu-item index="/teacher-management/course">课程管理</el-menu-item>
              <el-menu-item index="/teacher-management/courseware">课件管理</el-menu-item>
              <el-menu-item index="/teacher-management/resource">资源管理</el-menu-item>
              <el-menu-item index="/teacher-management/asset">资产管理</el-menu-item>
              <el-menu-item index="/teacher-management/achievement">成果管理</el-menu-item>
              <el-menu-item index="/teacher-management/evaluation">评价管理</el-menu-item>
              <el-menu-item index="/teacher-management/archive-report">档案报告</el-menu-item>
              <el-menu-item index="/teacher-management/project">项目管理</el-menu-item>
            </el-sub-menu>
            -->

            <!-- 暂时隐藏
            <el-sub-menu index="/student-management">
              <template #title>
                <el-icon><User /></el-icon>
                <span>学生管理</span>
              </template>
              <el-menu-item index="/student-management/student">学生管理</el-menu-item>
              <el-menu-item index="/student-management/homework">作业管理</el-menu-item>
              <el-menu-item index="/student-management/grade">成绩管理</el-menu-item>
              <el-menu-item index="/student-management/attendance">出勤管理</el-menu-item>
              <el-menu-item index="/student-management/classroom-interaction">课堂互动</el-menu-item>
              <el-menu-item index="/student-management/achievement">成果管理</el-menu-item>
              <el-menu-item index="/student-management/evaluation">评价管理</el-menu-item>
            </el-sub-menu>
            -->

            <!-- 暂时隐藏
            <el-sub-menu index="/archive-center">
              <template #title>
                <el-icon><Collection /></el-icon>
                <span>档案中心</span>
              </template>
              <el-menu-item index="/archive-center/teacher">教师档案</el-menu-item>
              <el-menu-item index="/archive-center/student">学生档案</el-menu-item>
            </el-sub-menu>
            -->

            <el-sub-menu index="/app-market">
              <template #title>
                <el-icon><Shop /></el-icon>
                <span>应用市场</span>
              </template>
              <el-menu-item index="/app-market/list">应用列表</el-menu-item>
              <el-menu-item index="/app-market/purchase">应用采购</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/authorization-center">
              <template #title>
                <el-icon><Lock /></el-icon>
                <span>授权中心</span>
              </template>
              <el-menu-item index="/authorization-center/app-authorization">应用授权</el-menu-item>
              <el-menu-item index="/authorization-center/quota-authorization">额度授权</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/data-integration">
              <template #title>
                <el-icon><Connection /></el-icon>
                <span>数据对接</span>
              </template>
              <el-menu-item index="/data-integration/dashboard">数据大屏</el-menu-item>
              <el-menu-item index="/data-integration/api">API接口对接</el-menu-item>
              <el-menu-item index="/data-integration/database">数据库直连</el-menu-item>
              <el-menu-item index="/data-integration/file-import">文件导入</el-menu-item>
              <el-menu-item index="/data-integration/mcp-service">MCP服务</el-menu-item>
              <el-menu-item index="/data-integration/web-scraping">网页抓取</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="/school-management">
              <template #title>
                <el-icon><School /></el-icon>
                <span>学校管理</span>
              </template>
              <el-menu-item index="/school-management/school">学校管理</el-menu-item>
              <el-menu-item index="/school-management/college">学院管理</el-menu-item>
              <el-menu-item index="/school-management/department">部门管理</el-menu-item>
              <el-menu-item index="/school-management/staff">教职工管理</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <!-- 主体内容与AI助手容器 -->
        <div class="main-container-wrapper">
          <!-- 右侧内容区域 (主体) -->
          <el-main class="main-content" :class="{ 'with-ai-panel': showAIAssistant }">
            <router-view />
          </el-main>

          <!-- AI智能档案助手并列面板 -->
          <transition name="slide-panel">
            <div v-if="showAIAssistant" class="ai-side-panel">
              <div class="panel-header">
                <span class="title">AI智能档案助手</span>
                <el-icon class="close-btn" @click="showAIAssistant = false"><Close /></el-icon>
              </div>
              
              <div class="ai-chat-container">
                <!-- 对话内容区域 -->
                <div class="chat-messages">
                  <!-- 欢迎消息 -->
                  <div v-if="!aiAnswer && searchResults.length === 0" class="welcome-section">
                    <div class="welcome-icon">
                      <el-icon size="56"><ChatDotRound /></el-icon>
                    </div>
                    <h3>您好，我是AI档案助手</h3>
                    <p>我可以帮您查询档案信息、回答问题、搜索文档</p>
                  </div>

                  <!-- AI回答 -->
                  <div v-if="aiAnswer" class="message-item ai-message">
                    <div class="avatar">
                      <el-icon><ChatDotRound /></el-icon>
                    </div>
                    <div class="message-bubble">
                      <p>{{ aiAnswer }}</p>
                      <div class="message-actions">
                        <el-button text size="small" @click="copyAnswer">
                          <el-icon><DocumentCopy /></el-icon>复制
                        </el-button>
                        <el-button text size="small" @click="regenerateAnswer">
                          <el-icon><RefreshRight /></el-icon>重新生成
                        </el-button>
                      </div>
                    </div>
                  </div>

                  <!-- 搜索结果 -->
                  <div v-if="searchResults.length > 0" class="search-results-panel">
                    <div class="results-header">
                      <span>为您找到 {{ searchResults.length }} 个相关结果</span>
                    </div>
                    <div class="result-list">
                      <div v-for="result in searchResults" :key="result.id" class="result-card" @click="viewResult(result)">
                        <div class="icon-wrap" :style="{ background: result.iconColor + '15' }">
                          <el-icon :color="result.iconColor"><component :is="result.icon" /></el-icon>
                        </div>
                        <div class="info">
                          <h5>{{ result.title }}</h5>
                          <p>{{ result.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 快捷问题（在输入框上方） -->
                <div v-if="!aiAnswer && searchResults.length === 0" class="quick-suggestions">
                  <div 
                    v-for="q in quickQuestions" 
                    :key="q" 
                    class="suggestion-chip"
                    @click="askQuestion(q)"
                  >
                    {{ q }}
                  </div>
                </div>

                <!-- 底部输入区域 -->
                <div class="chat-input-area">
                  <div class="input-wrapper">
                    <el-input
                      v-model="textQuery"
                      :placeholder="isRecording ? '正在录音...' : '询问AI档案助手...'"
                      class="chat-input"
                      @keyup.enter="handleTextSearch"
                    >
                      <template #prefix>
                        <el-tooltip content="上传附件" placement="top">
                          <el-icon class="input-icon" @click="triggerFileUpload"><Paperclip /></el-icon>
                        </el-tooltip>
                      </template>
                    </el-input>
                    <div class="input-actions">
                      <el-tooltip content="语音输入" placement="top">
                        <el-icon 
                          class="action-icon" 
                          :class="{ recording: isRecording }"
                          @click="toggleRecording"
                        >
                          <Microphone />
                        </el-icon>
                      </el-tooltip>
                      <el-button 
                        type="primary" 
                        circle
                        class="send-btn"
                        :disabled="!textQuery.trim()"
                        :loading="searching"
                        @click="handleTextSearch"
                      >
                        <el-icon><Top /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  <!-- 隐藏的文件上传 -->
                  <input 
                    ref="fileInputRef"
                    type="file" 
                    style="display: none" 
                    accept="image/*,.pdf,.doc,.docx"
                    @change="handleFileSelect"
                  />
                </div>
              </div>
            </div>
          </transition>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ChatDotRound,
  Search,
  Delete,
  Microphone,
  Picture,
  DocumentCopy,
  RefreshRight,
  QuestionFilled,
  Close,
  User,
  Folder,
  Document,
  Paperclip,
  Top,
  Collection,
  House,
  Upload,
  DataAnalysis,
  Cpu,
  Shop,
  Lock,
  Connection,
  School,
  Reading
} from '@element-plus/icons-vue'

// AI 助手状态
const showAIAssistant = ref(false)
const searchMode = ref('文本搜索')
const searchModeOptions = ['文本搜索', '语音搜索', '图片搜索']

// 文本搜索
const textQuery = ref('')
const searching = ref(false)

// 语音搜索
const isRecording = ref(false)
const voiceText = ref('')

// 图片搜索
const uploadedImage = ref('')

// 搜索结果
const searchResults = ref([])
const aiAnswer = ref('')

// 快捷问题
const quickQuestions = ref([
  '张教授最近发表了哪些论文？',
  '帮我找一下AI研究项目的相关文档',
  '统计一下计算机学院的学生人数',
  '查询李副教授的科研成果',
  '本学期有哪些机器学习相关课程？'
])

// 文本搜索处理
const handleTextSearch = () => {
  if (!textQuery.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }

  searching.value = true
  
  // 模拟AI搜索
  setTimeout(() => {
    // 生成AI回答
    aiAnswer.value = `根据您的问题"${textQuery.value}"，我为您找到了以下信息：\n\n张教授是计算机科学教授，主要研究方向为人工智能。近期发表了3篇SCI论文，主持1项国家级AI研究项目，指导5名研究生。相关档案已为您列出，您可以点击查看详细信息。`
    
    // 生成搜索结果
    searchResults.value = [
      {
        id: 1,
        title: '张教授个人档案',
        description: '计算机科学教授，AI专家，发表论文30余篇',
        category: '教师档案',
        tagType: 'primary',
        icon: 'User',
        iconColor: '#667eea',
        time: '2024-01-15'
      },
      {
        id: 2,
        title: 'AI研究项目档案',
        description: '国家级AI研究项目，项目周期2023-2025',
        category: '项目档案',
        tagType: 'success',
        icon: 'Folder',
        iconColor: '#43e97b',
        time: '2023-06-01'
      },
      {
        id: 3,
        title: '深度学习论文',
        description: 'SCI一区论文，影响因子8.5',
        category: '学术成果',
        tagType: 'warning',
        icon: 'Document',
        iconColor: '#feca57',
        time: '2024-01-10'
      }
    ]
    
    searching.value = false
    ElMessage.success('搜索完成')
  }, 1500)
}

// 清空查询
const clearQuery = () => {
  textQuery.value = ''
}

// 切换录音
const toggleRecording = () => {
  isRecording.value = !isRecording.value
  
  if (isRecording.value) {
    ElMessage.info('开始录音...')
    // 模拟语音识别
    setTimeout(() => {
      isRecording.value = false
      voiceText.value = '张教授最近发表了哪些论文？'
      ElMessage.success('语音识别完成')
      // 自动搜索
      textQuery.value = voiceText.value
      handleTextSearch()
    }, 3000)
  }
}

// 图片上传处理
const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

// 移除图片
const removeImage = () => {
  uploadedImage.value = ''
}

// 以图搜索
const searchByImage = () => {
  ElMessage.info('正在分析图片内容...')
  
  setTimeout(() => {
    aiAnswer.value = '根据您上传的图片，我识别到这是一份学术论文的封面。为您找到了相关的论文档案和作者信息。'
    
    searchResults.value = [
      {
        id: 4,
        title: '相似论文档案',
        description: '基于图像识别找到的相似学术论文',
        category: '学术成果',
        tagType: 'success',
        icon: 'Document',
        iconColor: '#43e97b',
        time: '2024-01-12'
      }
    ]
    
    ElMessage.success('图片分析完成')
  }, 2000)
}

// 清空结果
const clearResults = () => {
  searchResults.value = []
  aiAnswer.value = ''
}

// 查看结果详情
const viewResult = (result) => {
  ElMessage.info(`查看档案：${result.title}`)
}

// 复制回答
const copyAnswer = () => {
  navigator.clipboard.writeText(aiAnswer.value)
  ElMessage.success('已复制到剪贴板')
}

// 重新生成回答
const regenerateAnswer = () => {
  ElMessage.info('正在重新生成回答...')
  setTimeout(() => {
    aiAnswer.value += '\n\n补充信息：张教授还参与了多个跨学科合作项目，与华为、阿里等企业建立了产学研合作关系。'
    ElMessage.success('回答已更新')
  }, 1000)
}

// 快捷提问
const askQuestion = (question) => {
  textQuery.value = question
  handleTextSearch()
}

// 文件上传 ref
const fileInputRef = ref(null)

// 触发文件上传
const triggerFileUpload = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    ElMessage.success(`已选择文件: ${file.name}`)
    // 这里可以处理文件上传逻辑
  }
}
</script>

<style>
/* 全局样式重置和现代化字体 */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.warp{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.content{
  flex: 1;
  overflow: auto;
  min-height: 0; /* 修复flex布局在某些浏览器中的问题 */
}

#app {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1a1a1a;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 现代化顶部导航栏 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
}

.header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.3), transparent);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-left .logo-img {
  height: 60px;
  width: 60px;
  object-fit: contain;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.header-left .logo-img:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.3);
}

.header-left .logo {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.header-right .user-avatar {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.6);
  border: 2px solid rgba(0, 0, 0, 0.05);
}

.header-right .user-avatar:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: rgba(64, 158, 255, 0.3);
}

.header-right .avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.header-right .user-avatar:hover .avatar-img {
  transform: scale(1.05);
}

/* AI助手按钮 */
.ai-assistant-btn {
  margin-right: 16px;
  border-radius: 20px;
  padding: 8px 20px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.ai-assistant-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.ai-assistant-btn .el-icon {
  margin-right: 6px;
}

/* 现代化左侧菜单 */
.sidebar {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06);
}

.sidebar-menu {
  border: none;
  height: 100%;
  background: transparent;
  padding: 4px 12px;
}

.sidebar-menu .el-menu-item,
.sidebar-menu .el-sub-menu__title {
  height: 56px;
  line-height: 56px;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: #4a5568;
  font-weight: 500;
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-sub-menu__title:hover {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.05) 100%) !important;
  color: #409EFF !important;
  transform: translateX(4px);
}

.sidebar-menu .el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.sidebar-menu .el-menu-item .el-icon,
.sidebar-menu .el-sub-menu__title .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

/* 现代化右侧内容区域 */
.main-content {
  background: #f5f7fb;
  padding: 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* 现代化卡片样式 */
.el-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 现代化按钮样式 */
.el-button {
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.el-button--primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 现代化输入框样式 */
.el-input__wrapper {
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.el-input__wrapper:hover {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.el-input__wrapper.is-focus {
  border-color: #409EFF;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 现代化响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    padding: 24px;
  }
  
  .header {
    padding: 0 24px;
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: 220px !important;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .header-left .logo {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 200px !important;
  }
  
  .header {
    padding: 0 16px;
  }
  
  .header-left .logo {
    font-size: 18px;
  }
  
  .header-left .logo-img {
    height: 36px;
    width: 36px;
  }
  
  .main-content {
    padding: 16px;
  }
  
  .sidebar-menu .el-menu-item,
  .sidebar-menu .el-sub-menu__title {
    height: 48px;
    line-height: 48px;
    margin: 2px 8px;
  }
}

@media (max-width: 576px) {
  .header {
    padding: 0 12px;
  }
  
  .header-left .logo-img {
    height: 32px;
    width: 32px;
  }
  
  .header-left .logo {
    font-size: 16px;
  }
  
  .header-right .user-avatar {
    padding: 2px;
  }
  
  .header-right .avatar-img {
    width: 32px;
    height: 32px;
  }
  
  .sidebar {
    width: 180px !important;
  }
  
  .main-content {
    padding: 12px;
  }
  
  .sidebar-menu .el-menu-item,
  .sidebar-menu .el-sub-menu__title {
    height: 44px;
    line-height: 44px;
    margin: 2px 6px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .header-left {
    gap: 8px;
  }
  
  .header-left .logo-img {
    height: 28px;
    width: 28px;
  }
  
  .header-left .logo {
    font-size: 14px;
  }
  
  .header-right .user-avatar {
    padding: 1px;
  }
  
  .header-right .avatar-img {
    width: 28px;
    height: 28px;
  }
  
  .sidebar {
    width: 160px !important;
  }
  
  .main-content {
    padding: 8px;
  }
}


/* 高分辨率屏幕适配 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .header-left .logo-img {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}

/* 深色模式适配（可选） */
@media (prefers-color-scheme: dark) {
  /* 保持浅色系，不启用深色模式 */
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* 现代化加载动画 */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(64, 158, 255, 0.3);
  border-radius: 50%;
  border-top-color: #409EFF;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 现代化动效 */
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.slide-in-left {
  animation: slideInFromLeft 0.6s ease-out;
}

.slide-in-right {
  animation: slideInFromRight 0.6s ease-out;
}

.scale-in {
  animation: scaleIn 0.5s ease-out;
}

.pulse {
  animation: pulse 2s infinite;
}

/* 现代化滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 4px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* 现代化选择文本样式 */
::selection {
  background: rgba(102, 126, 234, 0.2);
  color: #1f2937;
}

/* 现代化焦点样式 */
*:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 现代化过渡效果 */
.el-menu-item,
.el-sub-menu__title,
.el-card,
.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 现代化阴影效果 */
.modern-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.modern-shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.modern-shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* ==================== 统一弹层样式 ==================== */
/* 所有弹层的基础样式 */
.el-dialog {
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden !important;
  border: none !important;
  background: #ffffff !important;
}

/* 弹层遮罩层 */
.el-overlay {
  background-color: rgba(0, 0, 0, 0.5) !important;
  backdrop-filter: blur(4px);
}

/* 弹层头部 - 统一渐变背景 */
.el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #ffffff !important;
  border-radius: 16px 16px 0 0 !important;
  padding: 20px 24px !important;
  margin: 0 !important;
  border: none !important;
  border-bottom: none !important;
  position: relative;
}

.el-dialog__header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* 弹层标题 */
.el-dialog__title {
  color: #ffffff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  letter-spacing: 0.3px;
  margin: 0 !important;
  padding: 0 !important;
}

/* 弹层关闭按钮 */
.el-dialog__headerbtn {
  top: 20px !important;
  right: 24px !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s ease !important;
}

.el-dialog__headerbtn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  transform: rotate(90deg);
}

.el-dialog__headerbtn .el-dialog__close {
  color: #ffffff !important;
  font-size: 18px !important;
  font-weight: 600 !important;
}

/* 弹层内容区域 */
.el-dialog__body {
  padding: 24px !important;
  background: #ffffff !important;
  color: #1a1a1a !important;
  line-height: 1.6;
  max-height: calc(80vh - 140px);
  overflow-y: auto;
}

/* 弹层内容区域滚动条 */
.el-dialog__body::-webkit-scrollbar {
  width: 6px;
}

.el-dialog__body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.el-dialog__body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  border-radius: 3px;
}

.el-dialog__body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
}

/* 弹层底部 */
.el-dialog__footer {
  padding: 16px 24px !important;
  background: rgba(248, 250, 252, 0.95) !important;
  border-radius: 0 0 16px 16px !important;
  margin: 0 !important;
  border: none !important;
  border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 弹层底部按钮样式优化 */
.el-dialog__footer .el-button {
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-dialog__footer .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.el-dialog__footer .el-button--primary:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 弹层动画效果 */
.el-dialog {
  animation: dialogFadeIn 0.3s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 响应式弹层样式 */
@media (max-width: 768px) {
  .el-dialog {
    width: 95% !important;
    margin: 5vh auto !important;
  }
  
  .el-dialog__header {
    padding: 16px 20px !important;
  }
  
  .el-dialog__title {
    font-size: 16px !important;
  }
  
  .el-dialog__body {
    padding: 20px !important;
  }
  
  .el-dialog__footer {
    padding: 12px 20px !important;
    flex-direction: column;
  }
  
  .el-dialog__footer .el-button {
    width: 100%;
    margin: 0 !important;
  }
}

/* 大弹层样式（宽度超过800px） */
.el-dialog[style*="width: 80%"],
.el-dialog[style*="width: 90%"],
.el-dialog[style*="width: 95%"] {
  max-width: 1200px;
}

/* 小弹层样式（宽度小于500px） */
.el-dialog[style*="width: 400px"],
.el-dialog[style*="width: 450px"],
.el-dialog[style*="width: 500px"] {
  max-width: 90%;
}

/* 特殊弹层样式覆盖（如果需要保留某些特殊样式，可以在这里添加） */

/* ==================== AI智能档案助手并列面板样式 ==================== */
.main-container-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  background: #f5f7fb;
  padding: 32px;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}


.ai-side-panel {
  width: 380px;
  height: 100%;
  background: #ffffff;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.03);
  z-index: 10;
  overflow: hidden;
}

.panel-header {
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.panel-header .title {
  font-weight: 600;
  font-size: 16px;
}

.panel-header .close-btn {
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
}

.panel-header .close-btn:hover {
  transform: rotate(90deg);
  opacity: 0.8;
}

/* AI对话容器 */
.ai-chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f8fafc;
}

/* 对话消息区域 */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 欢迎区域 */
.welcome-section {
  text-align: center;
  padding: 60px 20px;
}

.welcome-icon {
  color: #667eea;
  margin-bottom: 16px;
}

.welcome-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 8px;
}

.welcome-section p {
  font-size: 14px;
  color: #718096;
}

/* 消息气泡 */
.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.message-item .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.message-bubble {
  background: #fff;
  padding: 16px;
  border-radius: 12px;
  border-top-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: calc(100% - 50px);
}

.message-bubble p {
  font-size: 14px;
  line-height: 1.6;
  color: #2d3748;
  margin: 0;
  white-space: pre-wrap;
}

.message-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 8px;
}

/* 搜索结果样式 */
.search-results-panel {
  margin-top: 16px;
}

.results-header {
  font-size: 13px;
  font-weight: 500;
  color: #667eea;
  margin-bottom: 12px;
}

.result-card {
  background: #fff;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.result-card:hover {
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.result-card .icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.result-card .info h5 {
  font-size: 13px;
  margin: 0 0 4px 0;
  color: #1a202c;
}

.result-card .info p {
  font-size: 11px;
  color: #718096;
  margin: 0;
  line-height: 1.4;
}

/* 快捷建议 */
.quick-suggestions {
  padding: 0 20px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-chip {
  background: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  color: #4a5568;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  white-space: nowrap;
}

.suggestion-chip:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f0f4ff;
}

/* 底部输入区域 */
.chat-input-area {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f1f5f9;
  border-radius: 24px;
  padding: 8px 16px;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input {
  flex: 1;
}

.chat-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0;
}

.chat-input :deep(.el-input__inner) {
  font-size: 14px;
}

.input-icon {
  font-size: 20px;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
}

.input-icon:hover {
  color: #667eea;
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-icon {
  font-size: 22px;
  color: #718096;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
}

.action-icon:hover {
  color: #667eea;
}

.action-icon.recording {
  color: #f5576c;
  animation: pulse-recording 1.5s infinite;
}

@keyframes pulse-recording {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.send-btn {
  width: 36px;
  height: 36px;
  padding: 0 !important;
}

.send-btn:disabled {
  opacity: 0.5;
}

/* 过渡动画 */
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
  width: 0;
  opacity: 0;
}

/* 针对原样式的清理 */
</style>
