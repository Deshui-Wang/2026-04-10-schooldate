<template>
  <div id="app">
    <el-container class="warp">
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <img src="/images/logo.png" alt="平台Logo" class="logo-img" />
          <h2 class="logo">教师档案智能管理平台</h2>
        </div>
        <div class="header-right">
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
            
            <el-sub-menu index="/data-integration">
              <template #title>
                <el-icon><Connection /></el-icon>
                <span>数据对接</span>
              </template>
              <el-menu-item index="/data-integration/api">API接口对接</el-menu-item>
              <el-menu-item index="/data-integration/database">数据库直连</el-menu-item>
              <el-menu-item index="/data-integration/file-import">文件导入</el-menu-item>
              <el-menu-item index="/data-integration/mcp-service">MCP服务</el-menu-item>
              <el-menu-item index="/data-integration/web-scraping">爬虫</el-menu-item>
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
            </el-sub-menu>
          </el-menu>
        </el-aside>
        
        <!-- 右侧内容区域 -->
        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
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
}
.content{
  overflow: auto;
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
</style>
