<template>
  <div class="home fade-in-up">
    <!-- 现代化页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <span class="title-icon">🚀</span>
          智能数据管理平台
        </h1>
        <p class="page-subtitle">欢迎使用现代化的教育数据管理解决方案</p>
        <div class="header-stats">
          <div class="stat-badge">
            <span class="stat-number">{{ teacherTotal }}</span>
            <span class="stat-label">教师总数</span>
          </div>
          <div class="stat-badge">
            <span class="stat-number">{{ studentTotal }}</span>
            <span class="stat-label">学生总数</span>
          </div>
          <div class="stat-badge">
            <span class="stat-number">{{ reportTotal }}</span>
            <span class="stat-label">报告总数</span>
          </div>
          <div class="stat-badge">
            <span class="stat-number">{{ archiveTotal }}</span>
            <span class="stat-label">档案总数</span>
          </div>
          <div class="stat-badge">
            <span class="stat-number">{{ dataHealth }}%</span>
            <span class="stat-label">数据健康度</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 现代化快捷入口 -->
    <div class="quick-access-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><Grid /></el-icon>
          快捷入口
        </h2>
        <p class="section-desc">快速访问常用功能模块</p>
      </div>
      <el-row :gutter="24">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" :xl="6" v-for="item in quickAccessItems" :key="item.name">
          <el-card 
            class="quick-access-card" 
            :class="{ 'card-disabled': item.disabled }"
            @click="handleQuickAccess(item)"
            shadow="hover"
          >
            <div class="quick-access-content">
              <div class="quick-access-icon" :style="{ background: item.gradient }">
                <el-icon :style="{ color: item.iconColor }">
                  <component :is="item.icon" />
                </el-icon>
                <div class="icon-badge" v-if="item.badge">{{ item.badge }}</div>
              </div>
              <div class="quick-access-text">
                <div class="quick-access-title">{{ item.name }}</div>
                <div class="quick-access-desc">{{ item.desc }}</div>
                <div class="quick-access-status" v-if="item.status">
                  <el-tag :type="item.statusType" size="small">{{ item.status }}</el-tag>
                </div>
              </div>
              <div class="quick-access-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
            <div class="card-overlay" v-if="item.disabled">
              <el-icon><Lock /></el-icon>
              <span>暂未开放</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 现代化数据看板 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><DataAnalysis /></el-icon>
          数据看板
        </h2>
        <div class="section-actions">
          <el-button type="primary" size="small" :icon="Refresh">刷新数据</el-button>
        </div>
      </div>
      
      <el-row :gutter="24">
        <!-- 教师数据看板 -->
        <el-col :span="12">
          <el-card class="dashboard-card teacher-card">
            <template #header>
              <div class="card-header">
                <div class="card-icon teacher-icon">
                  <el-icon><User /></el-icon>
                </div>
                <div class="card-title">
                  <h3>教师数据</h3>
                  <p>Teacher Management</p>
                </div>
                <div class="card-trend">
                  <span class="trend-up">↗ +12%</span>
                </div>
              </div>
            </template>
            <div class="dashboard-content">
              <div class="stat-item">
                <div class="stat-number">{{ teacherStats.total }}</div>
                <div class="stat-label">总教师数</div>
                <div class="stat-progress">
                  <el-progress :percentage="85" :show-text="false" stroke-width="4" />
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ teacherStats.active }}</div>
                <div class="stat-label">在职教师</div>
                <div class="stat-progress">
                  <el-progress :percentage="91" :show-text="false" stroke-width="4" />
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ teacherStats.newThisMonth }}</div>
                <div class="stat-label">本月新增</div>
                <div class="stat-progress">
                  <el-progress :percentage="67" :show-text="false" stroke-width="4" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 学生数据看板 -->
        <el-col :span="12">
          <el-card class="dashboard-card student-card">
            <template #header>
              <div class="card-header">
                <div class="card-icon student-icon">
                  <el-icon><UserFilled /></el-icon>
                </div>
                <div class="card-title">
                  <h3>学生数据</h3>
                  <p>Student Management</p>
                </div>
                <div class="card-trend">
                  <span class="trend-up">↗ +8%</span>
                </div>
              </div>
            </template>
            <div class="dashboard-content">
              <div class="stat-item">
                <div class="stat-number">{{ studentStats.total }}</div>
                <div class="stat-label">总学生数</div>
                <div class="stat-progress">
                  <el-progress :percentage="92" :show-text="false" stroke-width="4" />
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ studentStats.active }}</div>
                <div class="stat-label">在校学生</div>
                <div class="stat-progress">
                  <el-progress :percentage="97" :show-text="false" stroke-width="4" />
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">{{ studentStats.newThisMonth }}</div>
                <div class="stat-label">本月新增</div>
                <div class="stat-progress">
                  <el-progress :percentage="78" :show-text="false" stroke-width="4" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 班级、课程和资源数据 -->
      <el-row :gutter="24" style="margin-top: 24px;">
        <el-col :span="8">
          <el-card class="dashboard-card class-card">
            <template #header>
              <div class="card-header">
                <div class="card-icon class-icon">
                  <el-icon><School /></el-icon>
                </div>
                <div class="card-title">
                  <h3>班级数据</h3>
                  <p>Class Management</p>
                </div>
              </div>
            </template>
            <div class="dashboard-content single-stat">
              <div class="stat-item">
                <div class="stat-number">{{ classStats.total }}</div>
                <div class="stat-label">总班级数</div>
                <div class="stat-progress">
                  <el-progress :percentage="88" :show-text="false" stroke-width="6" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="dashboard-card course-card">
            <template #header>
              <div class="card-header">
                <div class="card-icon course-icon">
                  <el-icon><Reading /></el-icon>
                </div>
                <div class="card-title">
                  <h3>课程数据</h3>
                  <p>Course Management</p>
                </div>
              </div>
            </template>
            <div class="dashboard-content single-stat">
              <div class="stat-item">
                <div class="stat-number">{{ courseStats.total }}</div>
                <div class="stat-label">总课程数</div>
                <div class="stat-progress">
                  <el-progress :percentage="76" :show-text="false" stroke-width="6" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card class="dashboard-card resource-card">
            <template #header>
              <div class="card-header">
                <div class="card-icon resource-icon">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="card-title">
                  <h3>资源数据</h3>
                  <p>Resource Management</p>
                </div>
              </div>
            </template>
            <div class="dashboard-content single-stat">
              <div class="stat-item">
                <div class="stat-number">{{ resourceStats.total }}</div>
                <div class="stat-label">总资源数</div>
                <div class="stat-progress">
                  <el-progress :percentage="83" :show-text="false" stroke-width="6" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 现代化最近活动 -->
    <div class="recent-activities-section">
      <div class="section-header">
        <h2 class="section-title">
          <el-icon class="title-icon"><Clock /></el-icon>
          最近活动
        </h2>
        <el-button type="text" size="small">查看全部</el-button>
      </div>
      <el-card class="activities-card">
        <el-timeline>
          <el-timeline-item
            v-for="activity in recentActivities"
            :key="activity.id"
            :timestamp="activity.time"
            :type="activity.type"
            :icon="activity.icon"
            size="large"
          >
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-desc">{{ activity.content }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()

    // 教师数据
    const teacherStats = ref({
      total: 156,
      active: 142,
      newThisMonth: 8
    })

    // 学生数据
    const studentStats = ref({
      total: 2847,
      active: 2756,
      newThisMonth: 156
    })

    // 班级数据
    const classStats = ref({
      total: 89
    })

    // 课程数据
    const courseStats = ref({
      total: 234
    })

    // 资源数据
    const resourceStats = ref({
      total: 1567
    })

    // 新增统计数据
    const teacherTotal = ref(156)
    const studentTotal = ref(2847)
    const reportTotal = ref(89)
    const archiveTotal = ref(234)
    const dataHealth = ref(96)

    // 现代化快捷入口
    const quickAccessItems = ref([
      {
        name: '教师管理',
        desc: '管理教师信息',
        icon: 'User',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        iconColor: '#ffffff',
        path: '/teacher-management/teacher',
        badge: 'NEW',
        status: '活跃',
        statusType: 'success',
        disabled: false
      },
      {
        name: '学生管理',
        desc: '管理学生学籍',
        icon: 'UserFilled',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        iconColor: '#ffffff',
        path: '/student-management/student',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '班级管理',
        desc: '管理班级信息',
        icon: 'School',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        iconColor: '#ffffff',
        path: '/teacher-management/class',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: '档案报告',
        desc: '管理学生档案',
        icon: 'Files',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        iconColor: '#ffffff',
        path: '/teacher-management/archive-report',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: 'API对接',
        desc: 'API接口对接',
        icon: 'Connection',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        iconColor: '#ffffff',
        path: '/data-integration/api',
        status: '维护中',
        statusType: 'warning',
        disabled: false
      },
      {
        name: '应用市场',
        desc: '浏览应用列表',
        icon: 'Shop',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        iconColor: '#ffffff',
        path: '/app-market/list',
        badge: 'HOT',
        status: '热门',
        statusType: 'danger',
        disabled: false
      },
      {
        name: '资源管理',
        desc: '管理教学资源',
        icon: 'Document',
        gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
        iconColor: '#ffffff',
        path: '/teacher-management/resource',
        status: '正常',
        statusType: 'success',
        disabled: false
      },
      {
        name: 'MCP服务',
        desc: 'MCP服务管理',
        icon: 'Connection',
        gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
        iconColor: '#ffffff',
        path: '/data-integration/mcp-service',
        disabled: false
      }
    ])

    // 现代化最近活动
    const recentActivities = ref([
      {
        id: 1,
        title: '教师信息更新',
        content: '新增教师：张老师',
        time: '2024-01-15 10:30',
        type: 'primary',
        icon: 'User'
      },
      {
        id: 2,
        title: '学生转班',
        content: '学生张三转入班级三年级1班',
        time: '2024-01-15 09:15',
        type: 'success',
        icon: 'UserFilled'
      },
      {
        id: 3,
        title: '课程更新',
        content: '课程《数学》已更新',
        time: '2024-01-14 16:45',
        type: 'warning',
        icon: 'Reading'
      },
      {
        id: 4,
        title: '应用授权',
        content: '新应用"在线考试系统"已授权',
        time: '2024-01-14 14:20',
        type: 'info',
        icon: 'Lock'
      }
    ])

    // 导航到指定页面
    const navigateTo = (path) => {
      router.push(path)
    }

    // 处理快捷入口点击
    const handleQuickAccess = (item) => {
      if (item.disabled) {
        ElMessage.warning('该功能暂未开放，敬请期待！')
        return
      }
      
      console.log('点击快捷入口:', item.name, '路径:', item.path)
      
      // 添加点击动画效果
      ElMessage.success(`正在进入${item.name}...`)
      
      // 延迟跳转，让用户看到消息
      setTimeout(() => {
        console.log('准备跳转到:', item.path)
        router.push(item.path).then(() => {
          console.log('路由跳转成功')
        }).catch(err => {
          console.error('路由跳转失败:', err)
          ElMessage.error('页面跳转失败，请检查路由配置')
        })
      }, 500)
    }

    return {
      teacherStats,
      studentStats,
      classStats,
      courseStats,
      resourceStats,
      teacherTotal,
      studentTotal,
      reportTotal,
      archiveTotal,
      dataHealth,
      quickAccessItems,
      recentActivities,
      navigateTo,
      handleQuickAccess
    }
  }
}
</script>

<style scoped>
.home {
  padding: 0;
  animation: fadeInUp 0.8s ease-out;
}

/* 现代化页面标题 */
.page-header {
  margin-bottom: 40px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header-content {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 18px;
  font-weight: 400;
}

.header-stats {
  display: flex;
  gap: 24px;
  margin-top: 16px;
}

.stat-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-badge .stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-badge .stat-label {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

/* 现代化章节标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title .title-icon {
  font-size: 20px;
  color: #667eea;
}

.section-desc {
  margin: 8px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.section-actions {
  display: flex;
  gap: 12px;
}

.dashboard-section,
.quick-access-section,
.recent-activities-section {
  margin-bottom: 48px;
}

/* 现代化数据卡片 */
.dashboard-card {
  height: 240px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.teacher-card::before {
  background: linear-gradient(90deg, #667eea, #764ba2);
}

.student-card::before {
  background: linear-gradient(90deg, #f093fb, #f5576c);
}

.class-card::before {
  background: linear-gradient(90deg, #4facfe, #00f2fe);
}

.course-card::before {
  background: linear-gradient(90deg, #43e97b, #38f9d7);
}

.resource-card::before {
  background: linear-gradient(90deg, #fa709a, #fee140);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.teacher-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.student-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.class-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.course-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.resource-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.card-title h3 {
  margin: 0 0 4px 0;
  color: #1f2937;
  font-size: 18px;
  font-weight: 600;
}

.card-title p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  font-weight: 400;
}

.card-trend {
  display: flex;
  align-items: center;
}

.trend-up {
  color: #10b981;
  font-size: 14px;
  font-weight: 600;
}

.dashboard-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 140px;
}

.dashboard-content.single-stat {
  justify-content: center;
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 8px;
}

.stat-progress {
  width: 100%;
}

/* 现代化快捷入口 */
.quick-access-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 160px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 16px;
}

.quick-access-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.2);
}

.quick-access-card.card-disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background: #f8f9fa;
}

.quick-access-card.card-disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: rgba(0, 0, 0, 0.06);
}

.quick-access-content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 24px;
  position: relative;
}

.quick-access-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.quick-access-card:hover .quick-access-icon {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.icon-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.quick-access-text {
  flex: 1;
}

.quick-access-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.2;
}

.quick-access-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 8px;
}

.quick-access-status {
  margin-top: 4px;
}

.quick-access-arrow {
  color: #9ca3af;
  font-size: 18px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.7;
}

.quick-access-card:hover .quick-access-arrow {
  color: #667eea;
  transform: translateX(6px);
  opacity: 1;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

.card-overlay .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
  color: #9ca3af;
}

/* 现代化活动时间线 */
.activities-card {
  padding: 32px;
}

.activity-content {
  padding-left: 16px;
}

.activity-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.activity-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }
  
  .header-stats {
    flex-direction: column;
    gap: 12px;
  }
  
  .stat-badge {
    flex-direction: row;
    justify-content: space-between;
    padding: 12px 16px;
  }
  
  .dashboard-content {
    flex-direction: column;
    gap: 16px;
    height: auto;
  }
  
  .quick-access-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 20px;
  }
  
  .quick-access-icon {
    margin-right: 0;
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
  
  .quick-access-title {
    font-size: 16px;
  }
  
  .quick-access-desc {
    font-size: 13px;
  }
  
  .quick-access-card {
    height: 140px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 20px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 20px;
  }
  
  .dashboard-card {
    height: auto;
    min-height: 200px;
  }
}
</style>