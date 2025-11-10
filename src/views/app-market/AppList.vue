<template>
  <div class="app-list">
    <div class="section-header">
      <h3>应用列表</h3>
      <p>浏览和搜索可用的教育应用</p>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="应用名称">
          <el-input v-model="searchForm.name" placeholder="请输入应用名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option label="教学管理" value="教学管理" />
            <el-option label="学生管理" value="学生管理" />
            <el-option label="在线学习" value="在线学习" />
            <el-option label="考试系统" value="考试系统" />
            <el-option label="家校沟通" value="家校沟通" />
            <el-option label="数据分析" value="数据分析" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格">
          <el-select v-model="searchForm.price" placeholder="请选择价格" clearable>
            <el-option label="免费" value="免费" />
            <el-option label="付费" value="付费" />
            <el-option label="试用" value="试用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="search-btn" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 应用列表 -->
    <el-card class="apps-card">
      <el-row :gutter="20">
        <el-col 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6" 
          :xl="6"
          v-for="app in filteredApps" 
          :key="app.id"
        >
          <el-card class="app-card" shadow="hover">
            <div class="app-content">
              <div class="app-header">
                <div class="app-icon" :style="{ backgroundColor: app.iconBgColor }">
                  <el-image
                    :src="app.image"
                    :alt="app.name"
                    fit="cover"
                    class="icon-image"
                  >
                    <template #error>
                      <div class="icon-slot">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="app-info">
                  <h4 class="app-name">{{ app.name }}</h4>
                  <div class="app-type-source">
                    <span class="app-type">{{ app.type || '应用型' }}</span>
                    <span class="app-source">{{ app.source || '@官方' }}</span>
                  </div>
                </div>
              </div>
              <p class="app-description">{{ app.description }}</p>
              <div class="app-footer">
                <span class="app-users">用户量 {{ app.users || '0' }}</span>
                <el-button class="experience-btn" @click="viewDetails(app)">立即体验</el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 应用详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedApp?.name"
      width="800px"
    >
      <div v-if="selectedApp" class="app-detail">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-image
              :src="selectedApp.image"
              :alt="selectedApp.name"
              fit="cover"
              style="width: 100%; height: 300px; border-radius: 7px;"
            />
          </el-col>
          <el-col :span="16">
            <h3>{{ selectedApp.name }}</h3>
            <p class="app-desc">{{ selectedApp.description }}</p>
            <div class="app-info">
              <p><strong>分类：</strong>{{ selectedApp.category }}</p>
              <p><strong>价格：</strong>{{ selectedApp.price }}</p>
              <p><strong>版本：</strong>{{ selectedApp.version }}</p>
              <p><strong>开发商：</strong>{{ selectedApp.developer }}</p>
              <p><strong>评分：</strong>
                <el-rate v-model="selectedApp.rating" disabled show-score />
              </p>
            </div>
            <div class="app-features">
              <h4>功能特点：</h4>
              <ul>
                <li v-for="feature in selectedApp.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="installApp(selectedApp)">安装应用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'AppList',
  setup() {
    const detailDialogVisible = ref(false)
    const selectedApp = ref(null)

    const searchForm = reactive({
      name: '',
      category: '',
      price: ''
    })

    const apps = ref([
      {
        id: 1,
        name: '在线考试系统',
        description: '提供在线考试、自动阅卷、成绩分析等功能',
        category: '考试系统',
        price: '付费',
        version: 'v2.1.0',
        developer: '教育科技公司',
        rating: 4.5,
        image: '/images/applist/808.jpg',
        type: '应用型',
        source: '@官方',
        users: '4.1k',
        iconBgColor: '#6c757d',
        features: [
          '支持多种题型',
          '自动阅卷功能',
          '成绩统计分析',
          '防作弊机制',
          '移动端支持'
        ]
      },
      {
        id: 2,
        name: '家校沟通平台',
        description: '连接学校、教师、家长，实现高效沟通',
        category: '家校沟通',
        price: '免费',
        version: 'v1.5.2',
        developer: '家校通科技',
        rating: 4.2,
        image: '/images/applist/banner2.png',
        type: '应用型',
        source: '@官方',
        users: '3.3k',
        iconBgColor: '#409eff',
        features: [
          '消息推送',
          '作业通知',
          '成绩查询',
          '请假申请',
          '活动通知'
        ]
      },
      {
        id: 3,
        name: '智能排课系统',
        description: '智能排课，优化教学资源配置',
        category: '教学管理',
        price: '试用',
        version: 'v3.0.1',
        developer: '智能教育',
        rating: 4.8,
        image: '/images/applist/banner1.png',
        type: '应用型',
        source: '@官方',
        users: '5.2k',
        iconBgColor: '#409eff',
        features: [
          '智能算法排课',
          '冲突检测',
          '资源优化',
          '课表导出',
          '移动端查看'
        ]
      },
      {
        id: 4,
        name: '学生档案管理',
        description: '全面管理学生档案和成长记录',
        category: '学生管理',
        price: '免费',
        version: 'v2.0.3',
        developer: '档案管理公司',
        rating: 4.3,
        image: '/images/applist/97.png',
        type: '应用型',
        source: '@官方',
        users: '1.7k',
        iconBgColor: '#409eff',
        features: [
          '档案录入',
          '成长记录',
          '成绩跟踪',
          '行为评价',
          '数据导出'
        ]
      },
      {
        id: 5,
        name: '在线学习平台',
        description: '提供丰富的在线学习资源和工具',
        category: '在线学习',
        price: '付费',
        version: 'v4.2.0',
        developer: '学习科技',
        rating: 4.6,
        image: '/images/applist/212.jpg',
        type: '应用型',
        source: '@官方',
        users: '2.9k',
        iconBgColor: '#f56c6c',
        features: [
          '视频课程',
          '互动练习',
          '学习进度',
          '知识图谱',
          '个性化推荐'
        ]
      },
      {
        id: 6,
        name: '数据分析工具',
        description: '教育数据分析和可视化展示',
        category: '数据分析',
        price: '试用',
        version: 'v1.8.5',
        developer: '数据科技',
        rating: 4.4,
        image: '/images/applist/84.png',
        type: '应用型',
        source: '@官方',
        users: '9.6k',
        iconBgColor: '#409eff',
        features: [
          '数据可视化',
          '趋势分析',
          '报表生成',
          '预测模型',
          '多维度分析'
        ]
      },
      {
        id: 7,
        name: '智能作业批改',
        description: 'AI自动批改作业，提高教学效率',
        category: '教学管理',
        price: '付费',
        version: 'v2.3.1',
        developer: '智能教学科技',
        rating: 4.7,
        image: '/images/applist/42.jpeg',
        type: '应用型',
        source: '@官方',
        users: '3.8k',
        iconBgColor: '#6c5ce7',
        features: [
          '智能识别字迹',
          '自动评分',
          '错误分析',
          '批改报告',
          '教师审核'
        ]
      },
      {
        id: 8,
        name: '课堂互动工具',
        description: '增强课堂互动，提高学生参与度',
        category: '教学管理',
        price: '免费',
        version: 'v1.9.0',
        developer: '互动教育',
        rating: 4.5,
        image: '/images/applist/24.png',
        type: '应用型',
        source: '@官方',
        users: '5.4k',
        iconBgColor: '#409eff',
        features: [
          '签到打卡',
          '在线投票',
          '答题互动',
          '小组讨论',
          '课堂笔记'
        ]
      },
      {
        id: 9,
        name: '成长记录册',
        description: '记录学生成长历程，生成个性化档案',
        category: '学生管理',
        price: '免费',
        version: 'v3.2.0',
        developer: '成长科技',
        rating: 4.6,
        image: '/images/applist/0f0.jpeg',
        type: '应用型',
        source: '@官方',
        users: '4.2k',
        iconBgColor: '#2d3436',
        features: [
          '成长轨迹',
          '照片视频',
          '作品展示',
          '评价记录',
          '家长分享'
        ]
      },
      {
        id: 10,
        name: '班级管理助手',
        description: '轻松管理班级日常事务',
        category: '教学管理',
        price: '试用',
        version: 'v2.5.3',
        developer: '班级管理',
        rating: 4.4,
        image: '/images/applist/20.jpeg',
        type: '应用型',
        source: '@官方',
        users: '3.4k',
        iconBgColor: '#409eff',
        features: [
          '班级通知',
          '值日安排',
          '活动组织',
          '物资管理',
          '通讯录'
        ]
      },
      {
        id: 11,
        name: '在线答疑系统',
        description: '24小时在线答疑，及时解答学生问题',
        category: '在线学习',
        price: '付费',
        version: 'v1.7.2',
        developer: '答疑科技',
        rating: 4.8,
        image: '/images/applist/68.jpg',
        type: '应用型',
        source: '@官方',
        users: '2.1k',
        iconBgColor: '#409eff',
        features: [
          '即时答疑',
          '预约辅导',
          '录屏回看',
          '错题集',
          'AI推荐'
        ]
      },
      {
        id: 12,
        name: '考试监督系统',
        description: '远程监考，确保考试公平公正',
        category: '考试系统',
        price: '付费',
        version: 'v3.1.4',
        developer: '监考科技',
        rating: 4.3,
        image: '/images/applist/814.jpg',
        type: '应用型',
        source: '@官方',
        users: '1.8k',
        iconBgColor: '#409eff',
        features: [
          '人脸识别',
          '行为监测',
          '屏幕监控',
          '异常警告',
          '录像回放'
        ]
      },
      {
        id: 13,
        name: '教育资源库',
        description: '海量教学资源，随时随地获取',
        category: '在线学习',
        price: '试用',
        version: 'v2.0.8',
        developer: '资源库科技',
        rating: 4.6,
        image: '/images/applist/banner3.jpeg',
        type: '应用型',
        source: '@官方',
        users: '6.2k',
        iconBgColor: '#409eff',
        features: [
          '课件下载',
          '试卷题库',
          '视频教学',
          '素材库',
          '在线编辑'
        ]
      }
    ])

    const filteredApps = computed(() => {
      let result = apps.value

      if (searchForm.name) {
        result = result.filter(app => 
          app.name.includes(searchForm.name)
        )
      }
      if (searchForm.category) {
        result = result.filter(app => 
          app.category === searchForm.category
        )
      }
      if (searchForm.price) {
        result = result.filter(app => 
          app.price === searchForm.price
        )
      }

      return result
    })

    const getCategoryType = (category) => {
      const types = {
        '教学管理': 'primary',
        '学生管理': 'success',
        '在线学习': 'warning',
        '考试系统': 'danger',
        '家校沟通': 'info',
        '数据分析': 'success'
      }
      return types[category] || 'info'
    }

    const getPriceType = (price) => {
      const types = {
        '免费': 'success',
        '付费': 'danger',
        '试用': 'warning'
      }
      return types[price] || 'info'
    }

    const handleSearch = () => {
      // 搜索逻辑已在computed中处理
    }

    const resetSearch = () => {
      Object.assign(searchForm, {
        name: '',
        category: '',
        price: ''
      })
    }

    const viewDetails = (app) => {
      selectedApp.value = app
      detailDialogVisible.value = true
    }

    const installApp = (app) => {
      ElMessage.success(`正在安装 ${app.name}...`)
    }

    return {
      detailDialogVisible,
      selectedApp,
      searchForm,
      apps,
      filteredApps,
      getCategoryType,
      getPriceType,
      handleSearch,
      resetSearch,
      viewDetails,
      installApp
    }
  }
}
</script>

<style scoped>
.app-list {
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

.search-card,
.apps-card {
  margin-bottom: 20px;
}

.apps-card {
  background-color: #f5f5f5;
}

.apps-card :deep(.el-card__body) {
  background-color: #ffffff;
  padding: 20px;
}

.app-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.app-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.app-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  overflow: hidden;
}

.icon-image {
  width: 100%;
  height: 100%;
}

.icon-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 24px;
}

.app-info {
  flex: 1;
}

.app-name {
  margin: 0 0 6px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.app-type-source {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-type {
  color: #b19cd9;
  font-size: 12px;
}

.app-source {
  color: #909399;
  font-size: 11px;
}

.app-description {
  margin: 0 0 16px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
  min-height: 10px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.app-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.app-users {
  color: #909399;
  font-size: 12px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.app-detail h3 {
  margin: 0 0 15px 0;
  color: #303133;
}

.app-desc {
  margin: 0 0 20px 0;
  color: #606266;
  line-height: 1.6;
}

.app-info p {
  margin: 8px 0;
  color: #606266;
}

.app-features {
  margin-top: 20px;
}

.app-features h4 {
  margin: 0 0 10px 0;
  color: #303133;
}

.app-features ul {
  margin: 0;
  padding-left: 20px;
}

.app-features li {
  margin: 5px 0;
  color: #606266;
}

/* 按钮样式优化 */
.search-btn {
  background-color: #e6f4ff;
  border-color: #409eff;
  color: #ffffff;
}

.search-btn:hover {
  background-color: #b3d8ff;
  border-color: #409eff;
  color: #409eff;
}

.experience-btn {
  background-color: transparent;
  border: none;
  color: #606266;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 400;
}

.experience-btn:hover {
  background-color: transparent;
  border: none;
  color: #303133;
}
</style>
