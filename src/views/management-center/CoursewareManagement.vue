<template>
  <div class="courseware-management">
    <div class="section-header">
      <h3>课件管理</h3>
      <p>管理教学课件和多媒体资源</p>
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
        
        <el-form-item label="课件类型">
          <el-select v-model="filterForm.coursewareType" placeholder="请选择课件类型" clearable>
            <el-option
              v-for="type in coursewareTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="上传者">
          <el-input
            v-model="filterForm.uploader"
            placeholder="请输入上传者姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="审核中" value="审核中" />
            <el-option label="已下架" value="已下架" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 课件列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>课件列表</span>
          <el-button type="primary" @click="addCourseware">
            <el-icon><Plus /></el-icon>
            上传课件
          </el-button>
        </div>
      </template>

      <el-table :data="filteredCoursewares" stripe>
        <el-table-column prop="coursewareName" label="课件名称" min-width="200" fixed="left" />
        <el-table-column prop="courseName" label="所属课程" min-width="150" />
        <el-table-column prop="college" label="学院" min-width="120" />
        <el-table-column prop="major" label="专业" min-width="150" />
        <el-table-column prop="coursewareType" label="课件类型" min-width="120" />
        <el-table-column prop="fileSize" label="文件大小" min-width="100" />
        <el-table-column prop="fileFormat" label="文件格式" min-width="100" />
        <el-table-column prop="uploader" label="上传者" min-width="100" />
        <el-table-column prop="uploadTime" label="上传时间" min-width="120" />
        <el-table-column prop="downloadCount" label="下载次数" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="previewCourseware(scope.row)">预览</el-button>
              <el-button size="small" type="success" @click="downloadCourseware(scope.row)">下载</el-button>
              <el-button size="small" @click="editCourseware(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteCourseware(scope.row)">删除</el-button>
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
  name: 'CoursewareManagement',
  setup() {
    const coursewares = ref([
      {
        id: 1,
        coursewareName: '计算机基础-第一章',
        courseName: '计算机基础',
        college: '计算机学院',
        major: '计算机科学与技术',
        coursewareType: 'PPT课件',
        fileSize: '15.2MB',
        fileFormat: 'PPTX',
        uploader: '张明华',
        uploadTime: '2024-01-15',
        downloadCount: 156,
        status: '正常'
      },
      {
        id: 2,
        coursewareName: 'C语言程序设计-基础语法',
        courseName: 'C语言程序设计',
        college: '计算机学院',
        major: '计算机科学与技术',
        coursewareType: 'PPT课件',
        fileSize: '22.8MB',
        fileFormat: 'PPTX',
        uploader: '李雅琴',
        uploadTime: '2024-01-20',
        downloadCount: 203,
        status: '正常'
      },
      {
        id: 3,
        coursewareName: 'Java程序设计-面向对象',
        courseName: 'Java程序设计',
        college: '计算机学院',
        major: '软件工程',
        coursewareType: 'PPT课件',
        fileSize: '18.5MB',
        fileFormat: 'PPTX',
        uploader: '王建国',
        uploadTime: '2024-02-01',
        downloadCount: 189,
        status: '正常'
      },
      {
        id: 4,
        coursewareName: 'Web前端开发-HTML5',
        courseName: 'Web前端开发',
        college: '计算机学院',
        major: '软件工程',
        coursewareType: '视频教程',
        fileSize: '125.6MB',
        fileFormat: 'MP4',
        uploader: '赵丽娟',
        uploadTime: '2024-02-05',
        downloadCount: 98,
        status: '正常'
      },
      {
        id: 5,
        coursewareName: '网络基础-OSI模型',
        courseName: '网络基础',
        college: '计算机学院',
        major: '网络工程',
        coursewareType: 'PPT课件',
        fileSize: '12.3MB',
        fileFormat: 'PPTX',
        uploader: '陈志强',
        uploadTime: '2024-02-10',
        downloadCount: 134,
        status: '正常'
      },
      {
        id: 6,
        coursewareName: '路由与交换技术-实验指导',
        courseName: '路由与交换技术',
        college: '计算机学院',
        major: '网络工程',
        coursewareType: '实验指导书',
        fileSize: '8.7MB',
        fileFormat: 'PDF',
        uploader: '刘美玲',
        uploadTime: '2024-02-15',
        downloadCount: 87,
        status: '正常'
      },
      {
        id: 7,
        coursewareName: '数据结构-算法分析',
        courseName: '数据结构',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        coursewareType: 'PPT课件',
        fileSize: '19.4MB',
        fileFormat: 'PPTX',
        uploader: '孙建华',
        uploadTime: '2024-02-20',
        downloadCount: 167,
        status: '正常'
      },
      {
        id: 8,
        coursewareName: '数据库原理-SQL语句',
        courseName: '数据库原理',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        coursewareType: '实验代码',
        fileSize: '5.2MB',
        fileFormat: 'ZIP',
        uploader: '周晓敏',
        uploadTime: '2024-02-25',
        downloadCount: 145,
        status: '正常'
      },
      {
        id: 9,
        coursewareName: 'Python程序设计-基础语法',
        courseName: 'Python程序设计',
        college: '计算机学院',
        major: '人工智能',
        coursewareType: 'PPT课件',
        fileSize: '16.8MB',
        fileFormat: 'PPTX',
        uploader: '吴志勇',
        uploadTime: '2024-03-01',
        downloadCount: 178,
        status: '正常'
      },
      {
        id: 10,
        coursewareName: '机器学习基础-算法实现',
        courseName: '机器学习基础',
        college: '计算机学院',
        major: '人工智能',
        coursewareType: 'Jupyter Notebook',
        fileSize: '35.6MB',
        fileFormat: 'IPYNB',
        uploader: '郑丽华',
        uploadTime: '2024-03-05',
        downloadCount: 92,
        status: '正常'
      },
      {
        id: 11,
        coursewareName: '信息安全基础-加密技术',
        courseName: '信息安全基础',
        college: '计算机学院',
        major: '信息安全',
        coursewareType: 'PPT课件',
        fileSize: '14.7MB',
        fileFormat: 'PPTX',
        uploader: '马文涛',
        uploadTime: '2024-03-10',
        downloadCount: 123,
        status: '正常'
      },
      {
        id: 12,
        coursewareName: '网络安全技术-防火墙配置',
        courseName: '网络安全技术',
        college: '计算机学院',
        major: '信息安全',
        coursewareType: '实验视频',
        fileSize: '89.3MB',
        fileFormat: 'MP4',
        uploader: '林雪梅',
        uploadTime: '2024-03-15',
        downloadCount: 76,
        status: '正常'
      },
      {
        id: 13,
        coursewareName: '物联网概论-传感器应用',
        courseName: '物联网概论',
        college: '计算机学院',
        major: '物联网工程',
        coursewareType: 'PPT课件',
        fileSize: '21.2MB',
        fileFormat: 'PPTX',
        uploader: '黄志明',
        uploadTime: '2024-03-20',
        downloadCount: 89,
        status: '正常'
      },
      {
        id: 14,
        coursewareName: '传感器技术-实验指导',
        courseName: '传感器技术',
        college: '计算机学院',
        major: '物联网工程',
        coursewareType: '实验指导书',
        fileSize: '11.5MB',
        fileFormat: 'PDF',
        uploader: '徐雅芳',
        uploadTime: '2024-03-25',
        downloadCount: 67,
        status: '正常'
      },
      {
        id: 15,
        coursewareName: '计算机组成原理-CPU设计',
        courseName: '计算机组成原理',
        college: '计算机学院',
        major: '计算机科学与技术',
        coursewareType: 'PPT课件',
        fileSize: '17.9MB',
        fileFormat: 'PPTX',
        uploader: '何建军',
        uploadTime: '2024-03-30',
        downloadCount: 112,
        status: '正常'
      },
      {
        id: 16,
        coursewareName: '软件工程-需求分析',
        courseName: '软件工程',
        college: '计算机学院',
        major: '软件工程',
        coursewareType: '案例分析',
        fileSize: '6.8MB',
        fileFormat: 'PDF',
        uploader: '张明华',
        uploadTime: '2024-04-01',
        downloadCount: 95,
        status: '审核中'
      },
      {
        id: 17,
        coursewareName: '网络安全-渗透测试',
        courseName: '网络安全',
        college: '计算机学院',
        major: '网络工程',
        coursewareType: '实验工具',
        fileSize: '45.2MB',
        fileFormat: 'ZIP',
        uploader: '李雅琴',
        uploadTime: '2024-04-05',
        downloadCount: 58,
        status: '正常'
      },
      {
        id: 18,
        coursewareName: '大数据技术-Hadoop集群',
        courseName: '大数据技术',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        coursewareType: '实验环境',
        fileSize: '156.8MB',
        fileFormat: 'ZIP',
        uploader: '王建国',
        uploadTime: '2024-04-10',
        downloadCount: 43,
        status: '正常'
      },
      {
        id: 19,
        coursewareName: '深度学习-神经网络',
        courseName: '深度学习',
        college: '计算机学院',
        major: '人工智能',
        coursewareType: 'PPT课件',
        fileSize: '28.4MB',
        fileFormat: 'PPTX',
        uploader: '赵丽娟',
        uploadTime: '2024-04-15',
        downloadCount: 81,
        status: '正常'
      },
      {
        id: 20,
        coursewareName: '密码学-对称加密算法',
        courseName: '密码学',
        college: '计算机学院',
        major: '信息安全',
        coursewareType: 'PPT课件',
        fileSize: '13.6MB',
        fileFormat: 'PPTX',
        uploader: '陈志强',
        uploadTime: '2024-04-20',
        downloadCount: 74,
        status: '已下架'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      college: '',
      major: '',
      courseName: '',
      coursewareType: '',
      uploader: '',
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
    const coursewareTypeOptions = ref([
      'PPT课件',
      '视频教程',
      '实验指导书',
      '实验代码',
      'Jupyter Notebook',
      '实验视频',
      '案例分析',
      '实验工具',
      '实验环境'
    ])

    // 筛选后的课件数据
    const filteredCoursewares = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredCoursewares.value = coursewares.value.filter(courseware => {
        return (
          (!filterForm.college || courseware.college === filterForm.college) &&
          (!filterForm.major || courseware.major === filterForm.major) &&
          (!filterForm.courseName || courseware.courseName === filterForm.courseName) &&
          (!filterForm.coursewareType || courseware.coursewareType === filterForm.coursewareType) &&
          (!filterForm.uploader || courseware.uploader.includes(filterForm.uploader)) &&
          (!filterForm.status || courseware.status === filterForm.status)
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.college = ''
      filterForm.major = ''
      filterForm.courseName = ''
      filterForm.coursewareType = ''
      filterForm.uploader = ''
      filterForm.status = ''
      filteredCoursewares.value = coursewares.value
    }

    // 初始化时显示所有课件
    filteredCoursewares.value = coursewares.value

    // 获取状态标签类型
    const getStatusType = (status) => {
      switch (status) {
        case '正常':
          return 'success'
        case '审核中':
          return 'warning'
        case '已下架':
          return 'danger'
        default:
          return 'info'
      }
    }

    const addCourseware = () => {
      ElMessage.info('上传课件功能开发中...')
    }

    const previewCourseware = (row) => {
      ElMessage.info(`预览课件 ${row.coursewareName}`)
    }

    const downloadCourseware = (row) => {
      ElMessage.success(`开始下载课件 ${row.coursewareName}`)
      // 更新下载次数
      row.downloadCount++
    }

    const editCourseware = (row) => {
      ElMessage.info(`编辑课件 ${row.coursewareName}`)
    }

    const deleteCourseware = (row) => {
      ElMessageBox.confirm(
        `确定要删除课件 "${row.coursewareName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = coursewares.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          coursewares.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      coursewares,
      filteredCoursewares,
      filterForm,
      collegeOptions,
      majorOptions,
      courseOptions,
      coursewareTypeOptions,
      applyFilter,
      resetFilter,
      getStatusType,
      addCourseware,
      previewCourseware,
      downloadCourseware,
      editCourseware,
      deleteCourseware
    }
  }
}
</script>

<style scoped>
.courseware-management {
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
}

.operation-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
}
</style>
