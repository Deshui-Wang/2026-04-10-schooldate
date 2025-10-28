<template>
  <div class="class-management">
    <div class="section-header">
      <h3>班级管理</h3>
      <p>管理班级信息和学生分配</p>
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
        
        <el-form-item label="年级">
          <el-select v-model="filterForm.grade" placeholder="请选择年级" clearable>
            <el-option
              v-for="grade in gradeOptions"
              :key="grade"
              :label="grade"
              :value="grade"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="班主任">
          <el-input
            v-model="filterForm.teacherName"
            placeholder="请输入班主任姓名"
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

    <!-- 班级列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>班级列表</span>
          <el-button type="primary" @click="addClass">
            <el-icon><Plus /></el-icon>
            添加班级
          </el-button>
        </div>
      </template>

      <el-table :data="filteredClasses" stripe>
        <el-table-column prop="college" label="学院" min-width="170" />
        <el-table-column prop="major" label="专业" min-width="210" />
        <el-table-column prop="className" label="班级名称" min-width="170" />
        <el-table-column prop="grade" label="年级" min-width="120" />
        <el-table-column prop="teacherName" label="班主任" min-width="120" />
        <el-table-column prop="studentCount" label="学生人数" min-width="100" />
        <el-table-column prop="maxStudents" label="最大人数" min-width="100" />
        <el-table-column prop="classroom" label="教室" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '正常' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editClass(scope.row)">编辑</el-button>
            <el-button size="small" type="info" @click="viewStudents(scope.row)">学生</el-button>
            <el-button size="small" type="danger" @click="deleteClass(scope.row)">删除</el-button>
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
  name: 'ClassManagement',
  setup() {
    const classes = ref([
      {
        id: 1,
        className: '计算机1班',
        grade: '2021级',
        college: '计算机学院',
        major: '计算机科学与技术',
        teacherName: '张明华',
        studentCount: 35,
        maxStudents: 40,
        classroom: 'A101',
        status: '正常'
      },
      {
        id: 2,
        className: '计算机2班',
        grade: '2021级',
        college: '计算机学院',
        major: '计算机科学与技术',
        teacherName: '李雅琴',
        studentCount: 32,
        maxStudents: 40,
        classroom: 'A102',
        status: '正常'
      },
      {
        id: 3,
        className: '软件1班',
        grade: '2022级',
        college: '计算机学院',
        major: '软件工程',
        teacherName: '王建国',
        studentCount: 28,
        maxStudents: 35,
        classroom: 'B201',
        status: '正常'
      },
      {
        id: 4,
        className: '网络1班',
        grade: '2022级',
        college: '计算机学院',
        major: '网络工程',
        teacherName: '赵丽娟',
        studentCount: 30,
        maxStudents: 35,
        classroom: 'B202',
        status: '正常'
      },
      {
        id: 5,
        className: '软件2班',
        grade: '2022级',
        college: '计算机学院',
        major: '软件工程',
        teacherName: '陈志强',
        studentCount: 26,
        maxStudents: 35,
        classroom: 'B203',
        status: '正常'
      },
      {
        id: 6,
        className: '网络2班',
        grade: '2022级',
        college: '计算机学院',
        major: '网络工程',
        teacherName: '刘美玲',
        studentCount: 29,
        maxStudents: 35,
        classroom: 'B204',
        status: '正常'
      },
      {
        id: 7,
        className: '计算机3班',
        grade: '2021级',
        college: '计算机学院',
        major: '计算机科学与技术',
        teacherName: '孙建华',
        studentCount: 33,
        maxStudents: 40,
        classroom: 'A103',
        status: '正常'
      },
      {
        id: 8,
        className: '数据1班',
        grade: '2023级',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        teacherName: '周晓敏',
        studentCount: 31,
        maxStudents: 35,
        classroom: 'C301',
        status: '正常'
      },
      {
        id: 9,
        className: '数据2班',
        grade: '2023级',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        teacherName: '吴志勇',
        studentCount: 28,
        maxStudents: 35,
        classroom: 'C302',
        status: '正常'
      },
      {
        id: 10,
        className: '人工智能1班',
        grade: '2023级',
        college: '计算机学院',
        major: '人工智能',
        teacherName: '郑丽华',
        studentCount: 25,
        maxStudents: 30,
        classroom: 'C303',
        status: '正常'
      },
      {
        id: 11,
        className: '信息安全1班',
        grade: '2021级',
        college: '计算机学院',
        major: '信息安全',
        teacherName: '马文涛',
        studentCount: 27,
        maxStudents: 35,
        classroom: 'A104',
        status: '正常'
      },
      {
        id: 12,
        className: '信息安全2班',
        grade: '2021级',
        college: '计算机学院',
        major: '信息安全',
        teacherName: '林雪梅',
        studentCount: 24,
        maxStudents: 35,
        classroom: 'A105',
        status: '正常'
      },
      {
        id: 13,
        className: '物联网1班',
        grade: '2022级',
        college: '计算机学院',
        major: '物联网工程',
        teacherName: '黄志明',
        studentCount: 26,
        maxStudents: 35,
        classroom: 'B205',
        status: '正常'
      },
      {
        id: 14,
        className: '物联网2班',
        grade: '2022级',
        college: '计算机学院',
        major: '物联网工程',
        teacherName: '徐雅芳',
        studentCount: 29,
        maxStudents: 35,
        classroom: 'B206',
        status: '正常'
      },
      {
        id: 15,
        className: '计算机4班',
        grade: '2020级',
        college: '计算机学院',
        major: '计算机科学与技术',
        teacherName: '何建军',
        studentCount: 38,
        maxStudents: 40,
        classroom: 'A106',
        status: '正常'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      college: '',
      major: '',
      grade: '',
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
    const gradeOptions = ref(['2020级', '2021级', '2022级', '2023级'])

    // 筛选后的班级数据
    const filteredClasses = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredClasses.value = classes.value.filter(classItem => {
        return (
          (!filterForm.college || classItem.college === filterForm.college) &&
          (!filterForm.major || classItem.major === filterForm.major) &&
          (!filterForm.grade || classItem.grade === filterForm.grade) &&
          (!filterForm.teacherName || classItem.teacherName.includes(filterForm.teacherName)) &&
          (!filterForm.status || classItem.status === filterForm.status)
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.college = ''
      filterForm.major = ''
      filterForm.grade = ''
      filterForm.teacherName = ''
      filterForm.status = ''
      filteredClasses.value = classes.value
    }

    // 初始化时显示所有班级
    filteredClasses.value = classes.value

    const addClass = () => {
      ElMessage.info('添加班级功能开发中...')
    }

    const editClass = (row) => {
      ElMessage.info(`编辑班级 ${row.className}`)
    }

    const viewStudents = (row) => {
      ElMessage.info(`查看班级 ${row.className} 的学生列表`)
    }

    const deleteClass = (row) => {
      ElMessageBox.confirm(
        `确定要删除班级 "${row.className}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = classes.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          classes.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      classes,
      filteredClasses,
      filterForm,
      collegeOptions,
      majorOptions,
      gradeOptions,
      applyFilter,
      resetFilter,
      addClass,
      editClass,
      viewStudents,
      deleteClass
    }
  }
}
</script>

<style scoped>
.class-management {
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
</style>
