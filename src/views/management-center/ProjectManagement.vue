<template>
  <div class="project-management">
    <div class="section-header">
      <h3>项目管理</h3>
      <p>管理学校项目和活动</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="项目类型">
          <el-select v-model="filterForm.projectType" placeholder="请选择项目类型" clearable>
            <el-option
              v-for="type in projectTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="项目状态">
          <el-select v-model="filterForm.status" placeholder="请选择项目状态" clearable>
            <el-option label="筹备中" value="筹备中" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已暂停" value="已暂停" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属部门">
          <el-select v-model="filterForm.department" placeholder="请选择所属部门" clearable>
            <el-option
              v-for="dept in departmentOptions"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-select v-model="filterForm.priority" placeholder="请选择优先级" clearable>
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="项目名称">
          <el-input
            v-model="filterForm.projectName"
            placeholder="请输入项目名称"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="负责人">
          <el-input
            v-model="filterForm.manager"
            placeholder="请输入负责人姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 项目列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>项目列表</span>
          <el-button type="primary" @click="addProject">
            <el-icon><Plus /></el-icon>
            新建项目
          </el-button>
        </div>
      </template>

      <el-table :data="filteredProjects" stripe>
        <el-table-column prop="projectCode" label="项目编号" width="120" />
        <el-table-column prop="projectName" label="项目名称" width="200" />
        <el-table-column prop="projectType" label="项目类型" width="120" />
        <el-table-column prop="manager" label="负责人" width="100" />
        <el-table-column prop="department" label="所属部门" width="120" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column prop="budget" label="预算(万元)" width="120">
          <template #default="scope">
            <span>{{ scope.row.budget.toFixed(1) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="进度" width="100">
          <template #default="scope">
            <el-progress :percentage="scope.row.progress" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="100">
          <template #default="scope">
            <el-tag :type="getPriorityType(scope.row.priority)">
              {{ scope.row.priority }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="viewProject(scope.row)">查看</el-button>
              <el-button size="small" @click="editProject(scope.row)">编辑</el-button>
              <el-button size="small" type="success" @click="manageProject(scope.row)">管理</el-button>
              <el-button size="small" type="warning" @click="reportProject(scope.row)">报告</el-button>
              <el-button size="small" type="danger" @click="deleteProject(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'ProjectManagement',
  setup() {
    const projects = ref([
      {
        id: 1,
        projectCode: 'PROJ-001',
        projectName: '智慧校园信息化建设项目',
        projectType: '信息化建设',
        manager: '张明华',
        department: '信息中心',
        startDate: '2023-09-01',
        endDate: '2024-06-30',
        budget: 150.0,
        progress: 65,
        priority: '高',
        status: '进行中'
      },
      {
        id: 2,
        projectCode: 'PROJ-002',
        projectName: '产教融合实训基地建设',
        projectType: '基础设施建设',
        manager: '李雅琴',
        department: '教务处',
        startDate: '2023-10-15',
        endDate: '2024-08-31',
        budget: 300.0,
        progress: 45,
        priority: '高',
        status: '进行中'
      },
      {
        id: 3,
        projectCode: 'PROJ-003',
        projectName: '教师专业能力提升培训',
        projectType: '师资培训',
        manager: '王建国',
        department: '人事处',
        startDate: '2023-11-01',
        endDate: '2024-03-31',
        budget: 80.0,
        progress: 30,
        priority: '中',
        status: '进行中'
      },
      {
        id: 4,
        projectCode: 'PROJ-004',
        projectName: '学生创新创业孵化园',
        projectType: '创新创业',
        manager: '赵丽娟',
        department: '学生处',
        startDate: '2023-12-01',
        endDate: '2024-12-31',
        budget: 200.0,
        progress: 15,
        priority: '中',
        status: '进行中'
      },
      {
        id: 5,
        projectCode: 'PROJ-005',
        projectName: '校园安全监控系统升级',
        projectType: '安全建设',
        manager: '陈志强',
        department: '保卫处',
        startDate: '2023-08-01',
        endDate: '2023-12-31',
        budget: 120.0,
        progress: 100,
        priority: '高',
        status: '已完成'
      },
      {
        id: 6,
        projectCode: 'PROJ-006',
        projectName: '图书馆数字化改造',
        projectType: '文化建设',
        manager: '刘美玲',
        department: '图书馆',
        startDate: '2023-09-15',
        endDate: '2024-05-31',
        budget: 180.0,
        progress: 55,
        priority: '中',
        status: '进行中'
      },
      {
        id: 7,
        projectCode: 'PROJ-007',
        projectName: '校企合作人才培养项目',
        projectType: '校企合作',
        manager: '孙建华',
        department: '就业指导中心',
        startDate: '2023-10-01',
        endDate: '2024-09-30',
        budget: 250.0,
        progress: 40,
        priority: '高',
        status: '进行中'
      },
      {
        id: 8,
        projectCode: 'PROJ-008',
        projectName: '校园环境美化工程',
        projectType: '环境建设',
        manager: '周晓敏',
        department: '后勤处',
        startDate: '2023-11-15',
        endDate: '2024-04-30',
        budget: 90.0,
        progress: 25,
        priority: '低',
        status: '进行中'
      },
      {
        id: 9,
        projectCode: 'PROJ-009',
        projectName: '教学质量评估体系构建',
        projectType: '教学改革',
        manager: '吴志勇',
        department: '教务处',
        startDate: '2023-09-01',
        endDate: '2024-01-31',
        budget: 60.0,
        progress: 80,
        priority: '中',
        status: '进行中'
      },
      {
        id: 10,
        projectCode: 'PROJ-010',
        projectName: '学生心理健康服务体系',
        projectType: '学生服务',
        manager: '郑丽华',
        department: '学生处',
        startDate: '2023-10-01',
        endDate: '2024-06-30',
        budget: 70.0,
        progress: 35,
        priority: '中',
        status: '进行中'
      },
      {
        id: 11,
        projectCode: 'PROJ-011',
        projectName: '实验室设备更新改造',
        projectType: '设备更新',
        manager: '马文涛',
        department: '实验中心',
        startDate: '2023-08-15',
        endDate: '2023-12-15',
        budget: 400.0,
        progress: 100,
        priority: '高',
        status: '已完成'
      },
      {
        id: 12,
        projectCode: 'PROJ-012',
        projectName: '校园文化节系列活动',
        projectType: '文化活动',
        manager: '林雪梅',
        department: '团委',
        startDate: '2023-12-01',
        endDate: '2024-01-31',
        budget: 30.0,
        progress: 20,
        priority: '低',
        status: '进行中'
      },
      {
        id: 13,
        projectCode: 'PROJ-013',
        projectName: '国际交流合作项目',
        projectType: '国际合作',
        manager: '黄志明',
        department: '国际交流处',
        startDate: '2023-09-01',
        endDate: '2024-08-31',
        budget: 180.0,
        progress: 50,
        priority: '中',
        status: '进行中'
      },
      {
        id: 14,
        projectCode: 'PROJ-014',
        projectName: '学生宿舍改造升级',
        projectType: '基础设施建设',
        manager: '徐雅芳',
        department: '后勤处',
        startDate: '2023-11-01',
        endDate: '2024-07-31',
        budget: 500.0,
        progress: 10,
        priority: '高',
        status: '进行中'
      },
      {
        id: 15,
        projectCode: 'PROJ-015',
        projectName: '科研平台建设',
        projectType: '科研建设',
        manager: '何建军',
        department: '科研处',
        startDate: '2023-10-15',
        endDate: '2024-10-15',
        budget: 350.0,
        progress: 30,
        priority: '高',
        status: '进行中'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      projectType: '',
      status: '',
      department: '',
      priority: '',
      projectName: '',
      manager: ''
    })

    // 筛选选项
    const projectTypeOptions = ref([
      '信息化建设',
      '基础设施建设',
      '师资培训',
      '创新创业',
      '安全建设',
      '文化建设',
      '校企合作',
      '环境建设',
      '教学改革',
      '学生服务',
      '设备更新',
      '文化活动',
      '国际合作',
      '科研建设'
    ])
    
    const departmentOptions = ref([
      '信息中心',
      '教务处',
      '人事处',
      '学生处',
      '保卫处',
      '图书馆',
      '就业指导中心',
      '后勤处',
      '实验中心',
      '团委',
      '国际交流处',
      '科研处'
    ])

    // 筛选后的项目数据
    const filteredProjects = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredProjects.value = projects.value.filter(project => {
        return (
          (!filterForm.projectType || project.projectType === filterForm.projectType) &&
          (!filterForm.status || project.status === filterForm.status) &&
          (!filterForm.department || project.department === filterForm.department) &&
          (!filterForm.priority || project.priority === filterForm.priority) &&
          (!filterForm.projectName || project.projectName.includes(filterForm.projectName)) &&
          (!filterForm.manager || project.manager.includes(filterForm.manager))
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.projectType = ''
      filterForm.status = ''
      filterForm.department = ''
      filterForm.priority = ''
      filterForm.projectName = ''
      filterForm.manager = ''
      filteredProjects.value = projects.value
    }

    // 初始化时显示所有项目
    filteredProjects.value = projects.value

    // 获取优先级类型
    const getPriorityType = (priority) => {
      const priorityMap = {
        '高': 'danger',
        '中': 'warning',
        '低': 'success'
      }
      return priorityMap[priority] || 'info'
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '筹备中': 'info',
        '进行中': 'warning',
        '已完成': 'success',
        '已暂停': 'danger',
        '已取消': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const addProject = () => {
      ElMessage.info('新建项目功能开发中...')
    }

    const viewProject = (row) => {
      ElMessage.info(`查看项目 ${row.projectName} 详细信息`)
    }

    const editProject = (row) => {
      ElMessage.info(`编辑项目 ${row.projectName}`)
    }

    const manageProject = (row) => {
      ElMessage.info(`管理项目 ${row.projectName}`)
    }

    const reportProject = (row) => {
      ElMessage.info(`项目报告 ${row.projectName}`)
    }

    const deleteProject = (row) => {
      ElMessageBox.confirm(
        `确定要删除项目 "${row.projectName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = projects.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          projects.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      projects,
      filteredProjects,
      filterForm,
      projectTypeOptions,
      departmentOptions,
      applyFilter,
      resetFilter,
      getPriorityType,
      getStatusType,
      addProject,
      viewProject,
      editProject,
      manageProject,
      reportProject,
      deleteProject
    }
  }
}
</script>

<style scoped>
.project-management {
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
