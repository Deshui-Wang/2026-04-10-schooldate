<template>
  <div class="evaluation-management">
    <div class="section-header">
      <h3>评价管理</h3>
      <p>管理教学评价和学生评估</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="评价类型">
          <el-select v-model="filterForm.evaluationType" placeholder="请选择评价类型" clearable>
            <el-option
              v-for="type in evaluationTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="评价对象">
          <el-select v-model="filterForm.evaluationTarget" placeholder="请选择评价对象" clearable>
            <el-option
              v-for="target in evaluationTargetOptions"
              :key="target"
              :label="target"
              :value="target"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="评价状态">
          <el-select v-model="filterForm.status" placeholder="请选择评价状态" clearable>
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已关闭" value="已关闭" />
            <el-option label="待审核" value="待审核" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="学期">
          <el-select v-model="filterForm.semester" placeholder="请选择学期" clearable>
            <el-option
              v-for="semester in semesterOptions"
              :key="semester"
              :label="semester"
              :value="semester"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="课程名称">
          <el-input
            v-model="filterForm.courseName"
            placeholder="请输入课程名称"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="教师姓名">
          <el-input
            v-model="filterForm.teacherName"
            placeholder="请输入教师姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 评价列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>评价列表</span>
          <el-button type="primary" @click="addEvaluation">
            <el-icon><Plus /></el-icon>
            创建评价
          </el-button>
        </div>
      </template>

      <el-table :data="filteredEvaluations" stripe>
        <el-table-column prop="evaluationCode" label="评价编号" min-width="120" />
        <el-table-column prop="evaluationName" label="评价名称" min-width="200" />
        <el-table-column prop="evaluationType" label="评价类型" min-width="120" />
        <el-table-column prop="evaluationTarget" label="评价对象" min-width="100" />
        <el-table-column prop="courseName" label="课程名称" min-width="150" />
        <el-table-column prop="teacherName" label="教师姓名" min-width="100" />
        <el-table-column prop="semester" label="学期" min-width="100" />
        <el-table-column prop="startDate" label="开始时间" min-width="120" />
        <el-table-column prop="endDate" label="结束时间" min-width="120" />
        <el-table-column prop="participantCount" label="参与人数" min-width="100" />
        <el-table-column prop="averageScore" label="平均分" min-width="80">
          <template #default="scope">
            <span v-if="scope.row.averageScore">{{ scope.row.averageScore.toFixed(1) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="viewEvaluation(scope.row)">查看</el-button>
              <el-button size="small" type="success" @click="viewResults(scope.row)">结果</el-button>
              <el-button size="small" type="warning" @click="manageEvaluation(scope.row)">管理</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'EvaluationManagement',
  setup() {
    const evaluations = ref([
      {
        id: 1,
        evaluationCode: 'EVAL-001',
        evaluationName: 'Java程序设计课程教学评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: 'Java程序设计',
        teacherName: '张明华',
        semester: '2023-2',
        startDate: '2023-12-01',
        endDate: '2023-12-15',
        participantCount: 45,
        averageScore: 4.2,
        status: '已完成'
      },
      {
        id: 2,
        evaluationCode: 'EVAL-002',
        evaluationName: 'Web前端开发实践评价',
        evaluationType: '实践评价',
        evaluationTarget: '学生',
        courseName: 'Web前端开发',
        teacherName: '李雅琴',
        semester: '2023-2',
        startDate: '2023-12-10',
        endDate: '2023-12-25',
        participantCount: 38,
        averageScore: 3.8,
        status: '进行中'
      },
      {
        id: 3,
        evaluationCode: 'EVAL-003',
        evaluationName: '数据库原理课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '数据库原理',
        teacherName: '王建国',
        semester: '2023-2',
        startDate: '2023-11-20',
        endDate: '2023-12-05',
        participantCount: 42,
        averageScore: 4.5,
        status: '已完成'
      },
      {
        id: 4,
        evaluationCode: 'EVAL-004',
        evaluationName: '软件工程实训评价',
        evaluationType: '实训评价',
        evaluationTarget: '学生',
        courseName: '软件工程',
        teacherName: '赵丽娟',
        semester: '2023-2',
        startDate: '2023-12-15',
        endDate: '2023-12-30',
        participantCount: 35,
        averageScore: null,
        status: '进行中'
      },
      {
        id: 5,
        evaluationCode: 'EVAL-005',
        evaluationName: '计算机网络课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '计算机网络',
        teacherName: '陈志强',
        semester: '2023-2',
        startDate: '2023-11-15',
        endDate: '2023-11-30',
        participantCount: 40,
        averageScore: 4.0,
        status: '已完成'
      },
      {
        id: 6,
        evaluationCode: 'EVAL-006',
        evaluationName: '移动应用开发项目评价',
        evaluationType: '项目评价',
        evaluationTarget: '学生',
        courseName: '移动应用开发',
        teacherName: '刘美玲',
        semester: '2023-2',
        startDate: '2023-12-20',
        endDate: '2024-01-05',
        participantCount: 28,
        averageScore: null,
        status: '进行中'
      },
      {
        id: 7,
        evaluationCode: 'EVAL-007',
        evaluationName: '操作系统课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '操作系统',
        teacherName: '孙建华',
        semester: '2023-2',
        startDate: '2023-11-10',
        endDate: '2023-11-25',
        participantCount: 36,
        averageScore: 3.9,
        status: '已完成'
      },
      {
        id: 8,
        evaluationCode: 'EVAL-008',
        evaluationName: '数据结构与算法评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '数据结构与算法',
        teacherName: '周晓敏',
        semester: '2023-2',
        startDate: '2023-12-05',
        endDate: '2023-12-20',
        participantCount: 48,
        averageScore: 4.3,
        status: '已完成'
      },
      {
        id: 9,
        evaluationCode: 'EVAL-009',
        evaluationName: '人工智能基础课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '人工智能基础',
        teacherName: '吴志勇',
        semester: '2023-2',
        startDate: '2023-12-01',
        endDate: '2023-12-16',
        participantCount: 32,
        averageScore: 4.1,
        status: '已完成'
      },
      {
        id: 10,
        evaluationCode: 'EVAL-010',
        evaluationName: '计算机图形学实践评价',
        evaluationType: '实践评价',
        evaluationTarget: '学生',
        courseName: '计算机图形学',
        teacherName: '郑丽华',
        semester: '2023-2',
        startDate: '2023-12-18',
        endDate: '2024-01-02',
        participantCount: 25,
        averageScore: null,
        status: '进行中'
      },
      {
        id: 11,
        evaluationCode: 'EVAL-011',
        evaluationName: '软件测试课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '软件测试',
        teacherName: '马文涛',
        semester: '2023-2',
        startDate: '2023-11-25',
        endDate: '2023-12-10',
        participantCount: 41,
        averageScore: 3.7,
        status: '已完成'
      },
      {
        id: 12,
        evaluationCode: 'EVAL-012',
        evaluationName: '云计算技术实训评价',
        evaluationType: '实训评价',
        evaluationTarget: '学生',
        courseName: '云计算技术',
        teacherName: '林雪梅',
        semester: '2023-2',
        startDate: '2023-12-22',
        endDate: '2024-01-08',
        participantCount: 30,
        averageScore: null,
        status: '进行中'
      },
      {
        id: 13,
        evaluationCode: 'EVAL-013',
        evaluationName: '信息安全课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '信息安全',
        teacherName: '黄志明',
        semester: '2023-2',
        startDate: '2023-11-30',
        endDate: '2023-12-15',
        participantCount: 37,
        averageScore: 4.4,
        status: '已完成'
      },
      {
        id: 14,
        evaluationCode: 'EVAL-014',
        evaluationName: '大数据分析项目评价',
        evaluationType: '项目评价',
        evaluationTarget: '学生',
        courseName: '大数据分析',
        teacherName: '徐雅芳',
        semester: '2023-2',
        startDate: '2023-12-25',
        endDate: '2024-01-10',
        participantCount: 22,
        averageScore: null,
        status: '进行中'
      },
      {
        id: 15,
        evaluationCode: 'EVAL-015',
        evaluationName: '机器学习课程评价',
        evaluationType: '课程评价',
        evaluationTarget: '教师',
        courseName: '机器学习',
        teacherName: '何建军',
        semester: '2023-2',
        startDate: '2023-12-08',
        endDate: '2023-12-23',
        participantCount: 29,
        averageScore: 4.6,
        status: '已完成'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      evaluationType: '',
      evaluationTarget: '',
      status: '',
      semester: '',
      courseName: '',
      teacherName: ''
    })

    // 筛选选项
    const evaluationTypeOptions = ref([
      '课程评价',
      '实践评价',
      '实训评价',
      '项目评价',
      '综合评价'
    ])
    
    const evaluationTargetOptions = ref([
      '教师',
      '学生',
      '课程',
      '教学'
    ])

    const semesterOptions = ref([
      '2023-1',
      '2023-2',
      '2024-1',
      '2024-2'
    ])

    // 筛选后的评价数据
    const filteredEvaluations = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredEvaluations.value = evaluations.value.filter(evaluation => {
        return (
          (!filterForm.evaluationType || evaluation.evaluationType === filterForm.evaluationType) &&
          (!filterForm.evaluationTarget || evaluation.evaluationTarget === filterForm.evaluationTarget) &&
          (!filterForm.status || evaluation.status === filterForm.status) &&
          (!filterForm.semester || evaluation.semester === filterForm.semester) &&
          (!filterForm.courseName || evaluation.courseName.includes(filterForm.courseName)) &&
          (!filterForm.teacherName || evaluation.teacherName.includes(filterForm.teacherName))
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.evaluationType = ''
      filterForm.evaluationTarget = ''
      filterForm.status = ''
      filterForm.semester = ''
      filterForm.courseName = ''
      filterForm.teacherName = ''
      filteredEvaluations.value = evaluations.value
    }

    // 初始化时显示所有评价
    filteredEvaluations.value = evaluations.value

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '进行中': 'warning',
        '已完成': 'success',
        '已关闭': 'info',
        '待审核': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const addEvaluation = () => {
      ElMessage.info('创建评价功能开发中...')
    }

    const viewEvaluation = (row) => {
      ElMessage.info(`查看评价 ${row.evaluationName} 详细信息`)
    }

    const viewResults = (row) => {
      ElMessage.info(`查看评价结果 ${row.evaluationName}`)
    }

    const manageEvaluation = (row) => {
      ElMessage.info(`管理评价 ${row.evaluationName}`)
    }

    return {
      evaluations,
      filteredEvaluations,
      filterForm,
      evaluationTypeOptions,
      evaluationTargetOptions,
      semesterOptions,
      applyFilter,
      resetFilter,
      getStatusType,
      addEvaluation,
      viewEvaluation,
      viewResults,
      manageEvaluation
    }
  }
}
</script>

<style scoped>
.evaluation-management {
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

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header .el-icon {
  margin-right: 8px;
}

.operation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
}

.operation-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
}
</style>
