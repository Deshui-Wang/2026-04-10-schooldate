<template>
  <div class="course-management">
    <div class="section-header">
      <h3>课程管理</h3>
      <p>管理课程安排和教学计划</p>
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
        
        <el-form-item label="课程类型">
          <el-select v-model="filterForm.courseType" placeholder="请选择课程类型" clearable>
            <el-option
              v-for="type in courseTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="授课教师">
          <el-input
            v-model="filterForm.teacherName"
            placeholder="请输入授课教师姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 课程列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>课程列表</span>
          <el-button type="primary" @click="addCourse">
            <el-icon><Plus /></el-icon>
            添加课程
          </el-button>
        </div>
      </template>

      <el-table :data="filteredCourses" stripe>
        <el-table-column prop="courseCode" label="课程代码" width="120" fixed="left" />
        <el-table-column prop="courseName" label="课程名称" width="200" />
        <el-table-column prop="college" label="学院" width="150" />
        <el-table-column prop="major" label="专业" width="190" />
        <el-table-column prop="courseType" label="课程类型" width="120" />
        <el-table-column prop="credits" label="学分" width="80" />
        <el-table-column prop="hours" label="学时" width="80" />
        <el-table-column prop="teacherName" label="授课教师" width="120" />
        <el-table-column prop="classroom" label="教室" width="120" />
        <el-table-column prop="semester" label="学期" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="editCourse(scope.row)">编辑</el-button>
              <el-button size="small" type="info" @click="viewSchedule(scope.row)">课表</el-button>
              <el-button size="small" type="danger" @click="deleteCourse(scope.row)">删除</el-button>
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
  name: 'CourseManagement',
  setup() {
    const courses = ref([
      {
        id: 1,
        courseCode: 'CS101',
        courseName: '计算机基础',
        college: '计算机学院',
        major: '计算机科学与技术',
        courseType: '专业基础课',
        credits: 3,
        hours: 48,
        teacherName: '张明华',
        classroom: 'A101',
        semester: '第1学期',
        status: '正常'
      },
      {
        id: 2,
        courseCode: 'CS102',
        courseName: 'C语言程序设计',
        college: '计算机学院',
        major: '计算机科学与技术',
        courseType: '专业基础课',
        credits: 4,
        hours: 64,
        teacherName: '李雅琴',
        classroom: 'A102',
        semester: '第1学期',
        status: '正常'
      },
      {
        id: 3,
        courseCode: 'SE201',
        courseName: 'Java程序设计',
        college: '计算机学院',
        major: '软件工程',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '王建国',
        classroom: 'B201',
        semester: '第2学期',
        status: '正常'
      },
      {
        id: 4,
        courseCode: 'SE202',
        courseName: 'Web前端开发',
        college: '计算机学院',
        major: '软件工程',
        courseType: '专业核心课',
        credits: 3,
        hours: 48,
        teacherName: '赵丽娟',
        classroom: 'B202',
        semester: '第3学期',
        status: '正常'
      },
      {
        id: 5,
        courseCode: 'NE301',
        courseName: '网络基础',
        college: '计算机学院',
        major: '网络工程',
        courseType: '专业基础课',
        credits: 3,
        hours: 48,
        teacherName: '陈志强',
        classroom: 'B203',
        semester: '第2学期',
        status: '正常'
      },
      {
        id: 6,
        courseCode: 'NE302',
        courseName: '路由与交换技术',
        college: '计算机学院',
        major: '网络工程',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '刘美玲',
        classroom: 'B204',
        semester: '第3学期',
        status: '正常'
      },
      {
        id: 7,
        courseCode: 'DS401',
        courseName: '数据结构',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        courseType: '专业基础课',
        credits: 4,
        hours: 64,
        teacherName: '孙建华',
        classroom: 'A103',
        semester: '第2学期',
        status: '正常'
      },
      {
        id: 8,
        courseCode: 'DS402',
        courseName: '数据库原理',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        courseType: '专业核心课',
        credits: 3,
        hours: 48,
        teacherName: '周晓敏',
        classroom: 'C301',
        semester: '第3学期',
        status: '正常'
      },
      {
        id: 9,
        courseCode: 'AI501',
        courseName: 'Python程序设计',
        college: '计算机学院',
        major: '人工智能',
        courseType: '专业基础课',
        credits: 3,
        hours: 48,
        teacherName: '吴志勇',
        classroom: 'C302',
        semester: '第1学期',
        status: '正常'
      },
      {
        id: 10,
        courseCode: 'AI502',
        courseName: '机器学习基础',
        college: '计算机学院',
        major: '人工智能',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '郑丽华',
        classroom: 'C303',
        semester: '第4学期',
        status: '正常'
      },
      {
        id: 11,
        courseCode: 'IS601',
        courseName: '信息安全基础',
        college: '计算机学院',
        major: '信息安全',
        courseType: '专业基础课',
        credits: 3,
        hours: 48,
        teacherName: '马文涛',
        classroom: 'A104',
        semester: '第2学期',
        status: '正常'
      },
      {
        id: 12,
        courseCode: 'IS602',
        courseName: '网络安全技术',
        college: '计算机学院',
        major: '信息安全',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '林雪梅',
        classroom: 'A105',
        semester: '第3学期',
        status: '正常'
      },
      {
        id: 13,
        courseCode: 'IoT701',
        courseName: '物联网概论',
        college: '计算机学院',
        major: '物联网工程',
        courseType: '专业基础课',
        credits: 3,
        hours: 48,
        teacherName: '黄志明',
        classroom: 'B205',
        semester: '第1学期',
        status: '正常'
      },
      {
        id: 14,
        courseCode: 'IoT702',
        courseName: '传感器技术',
        college: '计算机学院',
        major: '物联网工程',
        courseType: '专业核心课',
        credits: 3,
        hours: 48,
        teacherName: '徐雅芳',
        classroom: 'B206',
        semester: '第2学期',
        status: '正常'
      },
      {
        id: 15,
        courseCode: 'CS103',
        courseName: '计算机组成原理',
        college: '计算机学院',
        major: '计算机科学与技术',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '何建军',
        classroom: 'A106',
        semester: '第3学期',
        status: '正常'
      },
      {
        id: 16,
        courseCode: 'SE203',
        courseName: '软件工程',
        college: '计算机学院',
        major: '软件工程',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '张明华',
        classroom: 'B201',
        semester: '第4学期',
        status: '正常'
      },
      {
        id: 17,
        courseCode: 'NE303',
        courseName: '网络安全',
        college: '计算机学院',
        major: '网络工程',
        courseType: '专业核心课',
        credits: 3,
        hours: 48,
        teacherName: '李雅琴',
        classroom: 'B202',
        semester: '第4学期',
        status: '正常'
      },
      {
        id: 18,
        courseCode: 'DS403',
        courseName: '大数据技术',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '王建国',
        classroom: 'C301',
        semester: '第4学期',
        status: '正常'
      },
      {
        id: 19,
        courseCode: 'AI503',
        courseName: '深度学习',
        college: '计算机学院',
        major: '人工智能',
        courseType: '专业核心课',
        credits: 4,
        hours: 64,
        teacherName: '赵丽娟',
        classroom: 'C302',
        semester: '第5学期',
        status: '正常'
      },
      {
        id: 20,
        courseCode: 'IS603',
        courseName: '密码学',
        college: '计算机学院',
        major: '信息安全',
        courseType: '专业核心课',
        credits: 3,
        hours: 48,
        teacherName: '陈志强',
        classroom: 'A104',
        semester: '第4学期',
        status: '正常'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      college: '',
      major: '',
      courseType: '',
      teacherName: '',
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
    const courseTypeOptions = ref([
      '专业基础课',
      '专业核心课',
      '专业选修课',
      '公共基础课',
      '实践课程'
    ])

    // 筛选后的课程数据
    const filteredCourses = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredCourses.value = courses.value.filter(course => {
        return (
          (!filterForm.college || course.college === filterForm.college) &&
          (!filterForm.major || course.major === filterForm.major) &&
          (!filterForm.courseType || course.courseType === filterForm.courseType) &&
          (!filterForm.teacherName || course.teacherName.includes(filterForm.teacherName)) &&
          (!filterForm.status || course.status === filterForm.status)
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.college = ''
      filterForm.major = ''
      filterForm.courseType = ''
      filterForm.teacherName = ''
      filterForm.status = ''
      filteredCourses.value = courses.value
    }

    // 初始化时显示所有课程
    filteredCourses.value = courses.value

    const addCourse = () => {
      ElMessage.info('添加课程功能开发中...')
    }

    const editCourse = (row) => {
      ElMessage.info(`编辑课程 ${row.courseName}`)
    }

    const viewSchedule = (row) => {
      ElMessage.info(`查看课程 ${row.courseName} 的课表安排`)
    }

    const deleteCourse = (row) => {
      ElMessageBox.confirm(
        `确定要删除课程 "${row.courseName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = courses.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          courses.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      courses,
      filteredCourses,
      filterForm,
      collegeOptions,
      majorOptions,
      courseTypeOptions,
      applyFilter,
      resetFilter,
      addCourse,
      editCourse,
      viewSchedule,
      deleteCourse
    }
  }
}
</script>

<style scoped>
.course-management {
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
