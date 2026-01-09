import { createRouter, createWebHistory } from 'vue-router'

// 首页
import Home from '../views/Home.vue'

// 数据对接
import DataDashboard from '../views/data-integration/DataDashboard.vue'
import ApiIntegration from '../views/data-integration/ApiIntegration.vue'
import DatabaseConnection from '../views/data-integration/DatabaseConnection.vue'
import FileImport from '../views/data-integration/FileImport.vue'
import McpService from '../views/data-integration/McpService.vue'
import WebScraping from '../views/data-integration/WebScraping.vue'

// 管理中心
import TeacherManagement from '../views/management-center/TeacherManagement.vue'
import StudentManagement from '../views/student-management/StudentManagement.vue'
import ClassManagement from '../views/management-center/ClassManagement.vue'
import CourseManagement from '../views/management-center/CourseManagement.vue'
import CoursewareManagement from '../views/management-center/CoursewareManagement.vue'
import ResourceManagement from '../views/management-center/ResourceManagement.vue'
import AssetManagement from '../views/management-center/AssetManagement.vue'
import AchievementManagement from '../views/management-center/AchievementManagement.vue'
import EvaluationManagement from '../views/management-center/EvaluationManagement.vue'
import ArchiveReport from '../views/management-center/ArchiveReport.vue'
import ProjectManagement from '../views/management-center/ProjectManagement.vue'

// 学生管理子模块
import HomeworkManagement from '../views/student-management/HomeworkManagement.vue'
import GradeManagement from '../views/student-management/GradeManagement.vue'
import AttendanceManagement from '../views/student-management/AttendanceManagement.vue'
import ClassroomInteraction from '../views/student-management/ClassroomInteraction.vue'
import StudentAchievementManagement from '../views/student-management/AchievementManagement.vue'
import StudentEvaluationManagement from '../views/student-management/EvaluationManagement.vue'

// 应用市场
import AppList from '../views/app-market/AppList.vue'
import AppPurchase from '../views/app-market/AppPurchase.vue'

// 授权中心
import AppAuthorization from '../views/authorization-center/AppAuthorization.vue'
import QuotaAuthorization from '../views/authorization-center/QuotaAuthorization.vue'

// 咨询中心
import ArticleManagement from '../views/consultation-center/ArticleManagement.vue'
import NoticeManagement from '../views/consultation-center/NoticeManagement.vue'

// 档案中心
import TeacherArchive from '../views/archive-center/TeacherArchive.vue'
import StudentArchive from '../views/archive-center/StudentArchive.vue'

// 上报中心
import ReportingForms from '../views/reporting-center/ReportingForms.vue'
import ReportingMonitor from '../views/reporting-center/ReportingMonitor.vue'

// 智能决策
import DecisionSupport from '../views/intelligent-decision/DecisionSupport.vue'
import SmartDecision from '../views/intelligent-decision/SmartDecision.vue'
import SmartMonitoring from '../views/intelligent-decision/SmartMonitoring.vue'
import SmartRecommendation from '../views/intelligent-decision/SmartRecommendation.vue'
import SmartAnalysis from '../views/intelligent-decision/SmartAnalysis.vue'

// 学校管理
import SchoolManagement from '../views/school-management/SchoolManagement.vue'
import CollegeManagement from '../views/school-management/CollegeManagement.vue'
import DepartmentManagement from '../views/school-management/DepartmentManagement.vue'
import StaffManagement from '../views/school-management/StaffManagement.vue'

// 数据中心
import TeachingCenter from '../views/data-center/TeachingCenter.vue'
import ResourceCenter from '../views/data-center/ResourceCenter.vue'
import KnowledgeCenter from '../views/data-center/KnowledgeCenter.vue'
import AchievementCenter from '../views/data-center/AchievementCenter.vue'
import EvaluationCenter from '../views/data-center/EvaluationCenter.vue'
import ArchiveCenter from '../views/data-center/ArchiveCenter.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/data-integration/dashboard',
    name: 'DataDashboard',
    component: DataDashboard,
    meta: { title: '数据大屏' }
  },
  {
    path: '/data-integration/api',
    name: 'ApiIntegration',
    component: ApiIntegration,
    meta: { title: 'API接口对接' }
  },
  {
    path: '/data-integration/database',
    name: 'DatabaseConnection',
    component: DatabaseConnection,
    meta: { title: '数据库直连' }
  },
  {
    path: '/data-integration/file-import',
    name: 'FileImport',
    component: FileImport,
    meta: { title: '文件导入' }
  },
  {
    path: '/data-integration/mcp-service',
    name: 'McpService',
    component: McpService,
    meta: { title: 'MCP服务' }
  },
  {
    path: '/data-integration/web-scraping',
    name: 'WebScraping',
    component: WebScraping,
    meta: { title: '爬虫' }
  },
  // 学生管理相关路由
  {
    path: '/student-management/student',
    name: 'StudentManagement',
    component: StudentManagement,
    meta: { title: '学生管理' }
  },
  {
    path: '/student-management/homework',
    name: 'HomeworkManagement',
    component: HomeworkManagement,
    meta: { title: '作业管理' }
  },
  {
    path: '/student-management/grade',
    name: 'GradeManagement',
    component: GradeManagement,
    meta: { title: '成绩管理' }
  },
  {
    path: '/student-management/attendance',
    name: 'AttendanceManagement',
    component: AttendanceManagement,
    meta: { title: '出勤管理' }
  },
  {
    path: '/student-management/classroom-interaction',
    name: 'ClassroomInteraction',
    component: ClassroomInteraction,
    meta: { title: '课堂互动' }
  },
  {
    path: '/student-management/achievement',
    name: 'StudentAchievementManagement',
    component: StudentAchievementManagement,
    meta: { title: '成果管理' }
  },
  {
    path: '/student-management/evaluation',
    name: 'StudentEvaluationManagement',
    component: StudentEvaluationManagement,
    meta: { title: '评价管理' }
  },
  // 教师管理相关路由
  {
    path: '/teacher-management/teacher',
    name: 'TeacherManagement',
    component: TeacherManagement,
    meta: { title: '教师管理' }
  },
  {
    path: '/teacher-management/class',
    name: 'ClassManagement',
    component: ClassManagement,
    meta: { title: '班级管理' }
  },
  {
    path: '/teacher-management/course',
    name: 'CourseManagement',
    component: CourseManagement,
    meta: { title: '课程管理' }
  },
  {
    path: '/teacher-management/courseware',
    name: 'CoursewareManagement',
    component: CoursewareManagement,
    meta: { title: '课件管理' }
  },
  {
    path: '/teacher-management/resource',
    name: 'ResourceManagement',
    component: ResourceManagement,
    meta: { title: '资源管理' }
  },
  {
    path: '/teacher-management/asset',
    name: 'AssetManagement',
    component: AssetManagement,
    meta: { title: '资产管理' }
  },
  {
    path: '/teacher-management/achievement',
    name: 'AchievementManagement',
    component: AchievementManagement,
    meta: { title: '成果管理' }
  },
  {
    path: '/teacher-management/evaluation',
    name: 'EvaluationManagement',
    component: EvaluationManagement,
    meta: { title: '评价管理' }
  },
  {
    path: '/teacher-management/archive-report',
    name: 'ArchiveReport',
    component: ArchiveReport,
    meta: { title: '档案报告' }
  },
  {
    path: '/teacher-management/project',
    name: 'ProjectManagement',
    component: ProjectManagement,
    meta: { title: '项目管理' }
  },
  {
    path: '/app-market/list',
    name: 'AppList',
    component: AppList,
    meta: { title: '应用列表' }
  },
  {
    path: '/app-market/purchase',
    name: 'AppPurchase',
    component: AppPurchase,
    meta: { title: '应用采购' }
  },
  {
    path: '/authorization-center/app-authorization',
    name: 'AppAuthorization',
    component: AppAuthorization,
    meta: { title: '应用授权' }
  },
  {
    path: '/authorization-center/quota-authorization',
    name: 'QuotaAuthorization',
    component: QuotaAuthorization,
    meta: { title: '额度授权' }
  },
  {
    path: '/consultation-center/article-management',
    name: 'ArticleManagement',
    component: ArticleManagement,
    meta: { title: '文章管理' }
  },
  {
    path: '/consultation-center/notice-management',
    name: 'NoticeManagement',
    component: NoticeManagement,
    meta: { title: '通知管理' }
  },
  {
    path: '/archive-center/teacher',
    name: 'TeacherArchive',
    component: TeacherArchive,
    meta: { title: '教师档案' }
  },
  {
    path: '/archive-center/student',
    name: 'StudentArchive',
    component: StudentArchive,
    meta: { title: '学生档案' }
  },
  {
    path: '/reporting-center/forms',
    name: 'ReportingForms',
    component: ReportingForms,
    meta: { title: '上报表单' }
  },
  {
    path: '/reporting-center/monitor',
    name: 'ReportingMonitor',
    component: ReportingMonitor,
    meta: { title: '上报监控' }
  },
  {
    path: '/intelligent-decision/decision-support',
    name: 'DecisionSupport',
    component: DecisionSupport,
    meta: { title: '智能决策支持' }
  },
  {
    path: '/intelligent-decision/smart-recommendation',
    name: 'SmartRecommendation',
    component: SmartRecommendation,
    meta: { title: '智能推荐' }
  },
  {
    path: '/intelligent-decision/smart-decision',
    name: 'SmartDecision',
    component: SmartDecision,
    meta: { title: '智能决策' }
  },
  {
    path: '/intelligent-decision/smart-monitoring',
    name: 'SmartMonitoring',
    component: SmartMonitoring,
    meta: { title: '智能监测' }
  },
  {
    path: '/intelligent-decision/smart-analysis',
    name: 'SmartAnalysis',
    component: SmartAnalysis,
    meta: { title: '智能分析' }
  },
  // 学校管理相关路由
  {
    path: '/school-management/school',
    name: 'SchoolManagement',
    component: SchoolManagement,
    meta: { title: '学校管理' }
  },
  {
    path: '/school-management/college',
    name: 'CollegeManagement',
    component: CollegeManagement,
    meta: { title: '学院管理' }
  },
  {
    path: '/school-management/department',
    name: 'DepartmentManagement',
    component: DepartmentManagement,
    meta: { title: '部门管理' }
  },
  {
    path: '/school-management/staff',
    name: 'StaffManagement',
    component: StaffManagement,
    meta: { title: '教职工管理' }
  },
  // 数据中心相关路由
  {
    path: '/data-center/teaching',
    name: 'TeachingCenter',
    component: TeachingCenter,
    meta: { title: '教学中心' }
  },
  {
    path: '/data-center/resource',
    name: 'ResourceCenter',
    component: ResourceCenter,
    meta: { title: '资源中心' }
  },
  {
    path: '/data-center/knowledge',
    name: 'KnowledgeCenter',
    component: KnowledgeCenter,
    meta: { title: '知识中心' }
  },
  {
    path: '/data-center/achievement',
    name: 'AchievementCenter',
    component: AchievementCenter,
    meta: { title: '成果中心' }
  },
  {
    path: '/data-center/evaluation',
    name: 'EvaluationCenter',
    component: EvaluationCenter,
    meta: { title: '评价中心' }
  },
  {
    path: '/data-center/archive',
    name: 'ArchiveCenter',
    component: ArchiveCenter,
    meta: { title: '档案中心' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
