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
          <el-button @click="importCourses">
            <el-icon><Upload /></el-icon>
            导入
          </el-button>
        </div>
      </template>

      <el-table :data="filteredCourses" stripe>
        <el-table-column prop="courseCode" label="课程代码" min-width="100" fixed="left" />
        <el-table-column prop="courseName" label="课程名称" min-width="150" />
        <el-table-column prop="classTime" label="上课时间" min-width="120" />
        <el-table-column prop="location" label="上课地点" min-width="150" />
        <el-table-column prop="teacherName" label="教师" min-width="100" />
        <el-table-column prop="className" label="班级" min-width="120" />
        <el-table-column prop="major" label="所属专业" min-width="160" />
        <el-table-column prop="college" label="所属学院" min-width="150" />
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <div class="operation-buttons">
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
        className: '计算机21-1班',
        teacherName: '张明华',
        location: '教学楼A-101',
        classTime: '周一 1-2节',
        status: '正常'
      },
      {
        id: 2,
        courseCode: 'CS102',
        courseName: 'C语言程序设计',
        college: '计算机学院',
        major: '计算机科学与技术',
        className: '计算机21-2班',
        teacherName: '李雅琴',
        location: '教学楼A-102',
        classTime: '周二 3-4节',
        status: '正常'
      },
      {
        id: 3,
        courseCode: 'SE201',
        courseName: 'Java程序设计',
        college: '计算机学院',
        major: '软件工程',
        className: '软件22-1班',
        teacherName: '王建国',
        location: '教学楼B-201',
        classTime: '周三 5-6节',
        status: '正常'
      },
      {
        id: 4,
        courseCode: 'SE202',
        courseName: 'Web前端开发',
        college: '计算机学院',
        major: '软件工程',
        className: '软件22-2班',
        teacherName: '赵丽娟',
        location: '教学楼B-202',
        classTime: '周四 7-8节',
        status: '正常'
      },
      {
        id: 5,
        courseCode: 'NE301',
        courseName: '网络基础',
        college: '计算机学院',
        major: '网络工程',
        className: '网络22-1班',
        teacherName: '陈志强',
        location: '教学楼B-203',
        classTime: '周五 1-2节',
        status: '正常'
      },
      {
        id: 6,
        courseCode: 'NE302',
        courseName: '路由与交换技术',
        college: '计算机学院',
        major: '网络工程',
        className: '网络22-2班',
        teacherName: '刘美玲',
        location: '教学楼B-204',
        classTime: '周一 3-4节',
        status: '正常'
      },
      {
        id: 7,
        courseCode: 'DS401',
        courseName: '数据结构',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        className: '数据23-1班',
        teacherName: '孙建华',
        location: '教学楼A-103',
        classTime: '周二 1-2节',
        status: '正常'
      },
      {
        id: 8,
        courseCode: 'DS402',
        courseName: '数据库原理',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        className: '数据23-2班',
        teacherName: '周晓敏',
        location: '实验楼C-301',
        classTime: '周三 7-8节',
        status: '正常'
      },
      {
        id: 9,
        courseCode: 'AI501',
        courseName: 'Python程序设计',
        college: '计算机学院',
        major: '人工智能',
        className: '人工智能23-1班',
        teacherName: '吴志勇',
        location: '实验楼C-302',
        classTime: '周四 1-2节',
        status: '正常'
      },
      {
        id: 10,
        courseCode: 'AI502',
        courseName: '机器学习基础',
        college: '计算机学院',
        major: '人工智能',
        className: '人工智能23-1班',
        teacherName: '郑丽华',
        location: '实验楼C-303',
        classTime: '周五 3-4节',
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

    const viewSchedule = (row) => {
      ElMessage.info(`查看课程 ${row.courseName} 的课表安排`)
    }

    const importCourses = () => {
      ElMessage.info('排课数据导入功能开发中...')
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
      viewSchedule,
      importCourses,
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
