<template>
  <div class="resource-management">
    <div class="section-header">
      <h3>资源管理</h3>
      <p>管理题库、作业、考试等教学资源</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="学院">
          <el-select v-model="filterForm.college" placeholder="请选择学院" clearable>
            <el-option
              v-for="college in collegeOptions"
              :key="college"
              :label="college"
              :value="college"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="专业">
          <el-select v-model="filterForm.major" placeholder="请选择专业" clearable>
            <el-option
              v-for="major in majorOptions"
              :key="major"
              :label="major"
              :value="major"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="课程">
          <el-select v-model="filterForm.courseName" placeholder="请选择课程" clearable>
            <el-option
              v-for="course in courseOptions"
              :key="course"
              :label="course"
              :value="course"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="资源类型">
          <el-select v-model="filterForm.resourceType" placeholder="请选择资源类型" clearable>
            <el-option
              v-for="type in resourceTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="创建者">
          <el-input
            v-model="filterForm.creator"
            placeholder="请输入创建者姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="审核中" value="审核中" />
            <el-option label="已停用" value="已停用" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 资源列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>资源列表</span>
          <el-button type="primary" @click="addResource">
            <el-icon><Plus /></el-icon>
            创建资源
          </el-button>
        </div>
      </template>

      <el-table :data="filteredResources" stripe style="width: 100%">
        <el-table-column prop="resourceName" label="资源名称" min-width="200" fixed="left" show-overflow-tooltip />
        <el-table-column prop="courseName" label="所属课程" min-width="120" show-overflow-tooltip />
        <el-table-column prop="college" label="学院" min-width="100" />
        <el-table-column prop="major" label="专业" min-width="140" show-overflow-tooltip />
        <el-table-column prop="resourceType" label="资源类型" min-width="100" />
        <el-table-column prop="questionCount" label="题目数量" min-width="90" align="right" />
        <el-table-column prop="difficulty" label="难度等级" min-width="100">
          <template #default="scope">
            <el-tag :type="getDifficultyType(scope.row.difficulty)">
              {{ scope.row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator" label="创建者" min-width="90" />
        <el-table-column prop="createTime" label="创建时间" min-width="110" />
        <el-table-column prop="usageCount" label="使用次数" min-width="90" align="right" />
        <el-table-column prop="status" label="状态" min-width="90">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="previewResource(scope.row)">预览</el-button>
              <el-button size="small" @click="editResource(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteResource(scope.row)">删除</el-button>
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
  name: 'ResourceManagement',
  setup() {
    const resources = ref([
      {
        id: 1,
        resourceName: '计算机基础-选择题题库',
        courseName: '计算机基础',
        college: '计算机学院',
        major: '计算机科学与技术',
        resourceType: '题库',
        questionCount: 150,
        difficulty: '简单',
        creator: '张明华',
        createTime: '2024-01-15',
        usageCount: 45,
        status: '正常'
      },
      {
        id: 2,
        resourceName: 'C语言程序设计-编程题作业',
        courseName: 'C语言程序设计',
        college: '计算机学院',
        major: '计算机科学与技术',
        resourceType: '作业',
        questionCount: 25,
        difficulty: '中等',
        creator: '李雅琴',
        createTime: '2024-01-20',
        usageCount: 38,
        status: '正常'
      },
      {
        id: 3,
        resourceName: 'Java程序设计-期末考试试卷',
        courseName: 'Java程序设计',
        college: '计算机学院',
        major: '软件工程',
        resourceType: '考试试卷',
        questionCount: 50,
        difficulty: '中等',
        creator: '王建国',
        createTime: '2024-02-01',
        usageCount: 12,
        status: '正常'
      },
      {
        id: 4,
        resourceName: 'Web前端开发-项目作业',
        courseName: 'Web前端开发',
        college: '计算机学院',
        major: '软件工程',
        resourceType: '作业',
        questionCount: 8,
        difficulty: '困难',
        creator: '赵丽娟',
        createTime: '2024-02-05',
        usageCount: 22,
        status: '正常'
      },
      {
        id: 5,
        resourceName: '网络基础-综合测试题库',
        courseName: '网络基础',
        college: '计算机学院',
        major: '网络工程',
        resourceType: '题库',
        questionCount: 200,
        difficulty: '中等',
        creator: '陈志强',
        createTime: '2024-02-10',
        usageCount: 67,
        status: '正常'
      },
      {
        id: 6,
        resourceName: '路由与交换技术-实验报告',
        courseName: '路由与交换技术',
        college: '计算机学院',
        major: '网络工程',
        resourceType: '作业',
        questionCount: 15,
        difficulty: '困难',
        creator: '刘美玲',
        createTime: '2024-02-15',
        usageCount: 29,
        status: '正常'
      },
      {
        id: 7,
        resourceName: '数据结构-算法题题库',
        courseName: '数据结构',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        resourceType: '题库',
        questionCount: 180,
        difficulty: '困难',
        creator: '孙建华',
        createTime: '2024-02-20',
        usageCount: 89,
        status: '正常'
      },
      {
        id: 8,
        resourceName: '数据库原理-期中考试试卷',
        courseName: '数据库原理',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        resourceType: '考试试卷',
        questionCount: 40,
        difficulty: '中等',
        creator: '周晓敏',
        createTime: '2024-02-25',
        usageCount: 18,
        status: '正常'
      },
      {
        id: 9,
        resourceName: 'Python程序设计-编程练习',
        courseName: 'Python程序设计',
        college: '计算机学院',
        major: '人工智能',
        resourceType: '作业',
        questionCount: 30,
        difficulty: '简单',
        creator: '吴志勇',
        createTime: '2024-03-01',
        usageCount: 56,
        status: '正常'
      },
      {
        id: 10,
        resourceName: '机器学习基础-综合题库',
        courseName: '机器学习基础',
        college: '计算机学院',
        major: '人工智能',
        resourceType: '题库',
        questionCount: 120,
        difficulty: '困难',
        creator: '郑丽华',
        createTime: '2024-03-05',
        usageCount: 34,
        status: '正常'
      },
      {
        id: 11,
        resourceName: '信息安全基础-安全测试题',
        courseName: '信息安全基础',
        college: '计算机学院',
        major: '信息安全',
        resourceType: '题库',
        questionCount: 100,
        difficulty: '中等',
        creator: '马文涛',
        createTime: '2024-03-10',
        usageCount: 41,
        status: '正常'
      },
      {
        id: 12,
        resourceName: '网络安全技术-期末试卷',
        courseName: '网络安全技术',
        college: '计算机学院',
        major: '信息安全',
        resourceType: '考试试卷',
        questionCount: 45,
        difficulty: '困难',
        creator: '林雪梅',
        createTime: '2024-03-15',
        usageCount: 15,
        status: '正常'
      },
      {
        id: 13,
        resourceName: '物联网概论-概念题作业',
        courseName: '物联网概论',
        college: '计算机学院',
        major: '物联网工程',
        resourceType: '作业',
        questionCount: 20,
        difficulty: '简单',
        creator: '黄志明',
        createTime: '2024-03-20',
        usageCount: 33,
        status: '正常'
      },
      {
        id: 14,
        resourceName: '传感器技术-实验题库',
        courseName: '传感器技术',
        college: '计算机学院',
        major: '物联网工程',
        resourceType: '题库',
        questionCount: 80,
        difficulty: '中等',
        creator: '徐雅芳',
        createTime: '2024-03-25',
        usageCount: 27,
        status: '正常'
      },
      {
        id: 15,
        resourceName: '计算机组成原理-综合考试',
        courseName: '计算机组成原理',
        college: '计算机学院',
        major: '计算机科学与技术',
        resourceType: '考试试卷',
        questionCount: 60,
        difficulty: '困难',
        creator: '何建军',
        createTime: '2024-03-30',
        usageCount: 21,
        status: '正常'
      },
      {
        id: 16,
        resourceName: '软件工程-需求分析作业',
        courseName: '软件工程',
        college: '计算机学院',
        major: '软件工程',
        resourceType: '作业',
        questionCount: 12,
        difficulty: '困难',
        creator: '张明华',
        createTime: '2024-04-01',
        usageCount: 19,
        status: '审核中'
      },
      {
        id: 17,
        resourceName: '网络安全-渗透测试题库',
        courseName: '网络安全',
        college: '计算机学院',
        major: '网络工程',
        resourceType: '题库',
        questionCount: 90,
        difficulty: '困难',
        creator: '李雅琴',
        createTime: '2024-04-05',
        usageCount: 24,
        status: '正常'
      },
      {
        id: 18,
        resourceName: '大数据技术-实践作业',
        courseName: '大数据技术',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        resourceType: '作业',
        questionCount: 6,
        difficulty: '困难',
        creator: '王建国',
        createTime: '2024-04-10',
        usageCount: 16,
        status: '正常'
      },
      {
        id: 19,
        resourceName: '深度学习-期末综合测试',
        courseName: '深度学习',
        college: '计算机学院',
        major: '人工智能',
        resourceType: '考试试卷',
        questionCount: 35,
        difficulty: '困难',
        creator: '赵丽娟',
        createTime: '2024-04-15',
        usageCount: 8,
        status: '正常'
      },
      {
        id: 20,
        resourceName: '密码学-基础概念题库',
        courseName: '密码学',
        college: '计算机学院',
        major: '信息安全',
        resourceType: '题库',
        questionCount: 70,
        difficulty: '中等',
        creator: '陈志强',
        createTime: '2024-04-20',
        usageCount: 31,
        status: '已停用'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      college: '',
      major: '',
      courseName: '',
      resourceType: '',
      creator: '',
      status: ''
    })

    // 筛选选项
    const collegeOptions = ref(['计算机学院'])
    const majorOptions = ref([
      '计算机科学与技术',
      '软件工程',
      '网络工程',
      '数据科学与大数据技术',
      '人工智能',
      '信息安全',
      '物联网工程'
    ])
    const courseOptions = ref([
      '计算机基础',
      'C语言程序设计',
      'Java程序设计',
      'Web前端开发',
      '网络基础',
      '路由与交换技术',
      '数据结构',
      '数据库原理',
      'Python程序设计',
      '机器学习基础',
      '信息安全基础',
      '网络安全技术',
      '物联网概论',
      '传感器技术',
      '计算机组成原理',
      '软件工程',
      '网络安全',
      '大数据技术',
      '深度学习',
      '密码学'
    ])
    const resourceTypeOptions = ref([
      '题库',
      '作业',
      '考试试卷'
    ])

    // 筛选后的资源数据
    const filteredResources = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredResources.value = resources.value.filter(resource => {
        return (
          (!filterForm.college || resource.college === filterForm.college) &&
          (!filterForm.major || resource.major === filterForm.major) &&
          (!filterForm.courseName || resource.courseName === filterForm.courseName) &&
          (!filterForm.resourceType || resource.resourceType === filterForm.resourceType) &&
          (!filterForm.creator || resource.creator.includes(filterForm.creator)) &&
          (!filterForm.status || resource.status === filterForm.status)
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.college = ''
      filterForm.major = ''
      filterForm.courseName = ''
      filterForm.resourceType = ''
      filterForm.creator = ''
      filterForm.status = ''
      filteredResources.value = resources.value
    }

    // 初始化时显示所有资源
    filteredResources.value = resources.value

    // 获取难度标签类型
    const getDifficultyType = (difficulty) => {
      switch (difficulty) {
        case '简单':
          return 'success'
        case '中等':
          return 'warning'
        case '困难':
          return 'danger'
        default:
          return 'info'
      }
    }

    // 获取状态标签类型
    const getStatusType = (status) => {
      switch (status) {
        case '正常':
          return 'success'
        case '审核中':
          return 'warning'
        case '已停用':
          return 'danger'
        default:
          return 'info'
      }
    }

    const addResource = () => {
      ElMessage.info('创建资源功能开发中...')
    }

    const previewResource = (row) => {
      ElMessage.info(`预览资源 ${row.resourceName}`)
    }

    const useResource = (row) => {
      ElMessage.success(`开始使用资源 ${row.resourceName}`)
      // 更新使用次数
      row.usageCount++
    }

    const editResource = (row) => {
      ElMessage.info(`编辑资源 ${row.resourceName}`)
    }

    const deleteResource = (row) => {
      ElMessageBox.confirm(
        `确定要删除资源 "${row.resourceName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = resources.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          resources.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      resources,
      filteredResources,
      filterForm,
      collegeOptions,
      majorOptions,
      courseOptions,
      resourceTypeOptions,
      applyFilter,
      resetFilter,
      getDifficultyType,
      getStatusType,
      addResource,
      previewResource,
      useResource,
      editResource,
      deleteResource
    }
  }
}
</script>

<style scoped>
.resource-management {
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
  gap: 6px;
  align-items: center;
  justify-content: flex-start;
}

.operation-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
  padding: 8px 12px;
}
</style>
