<template>
  <div class="archive-report">
    <div class="section-header">
      <h3>档案报告</h3>
      <p>管理学生档案和各类报告</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="档案类型">
          <el-select v-model="filterForm.archiveType" placeholder="请选择档案类型" clearable>
            <el-option
              v-for="type in archiveTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属学院">
          <el-select v-model="filterForm.college" placeholder="请选择所属学院" clearable>
            <el-option
              v-for="college in collegeOptions"
              :key="college"
              :label="college"
              :value="college"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="档案状态">
          <el-select v-model="filterForm.status" placeholder="请选择档案状态" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已归档" value="已归档" />
            <el-option label="已销毁" value="已销毁" />
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
        
        <el-form-item label="学生姓名">
          <el-input
            v-model="filterForm.studentName"
            placeholder="请输入学生姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="学号">
          <el-input
            v-model="filterForm.studentId"
            placeholder="请输入学号"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 档案列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>档案列表</span>
          <el-button type="primary" @click="addArchive">
            <el-icon><Plus /></el-icon>
            新建档案
          </el-button>
        </div>
      </template>

      <el-table :data="filteredArchives" stripe>
        <el-table-column prop="archiveCode" label="档案编号" width="120" />
        <el-table-column prop="studentName" label="学生姓名" width="100" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="archiveType" label="档案类型" width="120" />
        <el-table-column prop="college" label="所属学院" width="120" />
        <el-table-column prop="grade" label="年级" width="80" />
        <el-table-column prop="major" label="专业" width="150" />
        <el-table-column prop="createDate" label="创建日期" width="120" />
        <el-table-column prop="updateDate" label="更新日期" width="120" />
        <el-table-column prop="fileCount" label="文件数量" width="100" />
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
              <el-button size="small" @click="viewArchive(scope.row)">查看</el-button>
              <el-button size="small" @click="editArchive(scope.row)">编辑</el-button>
              <el-button size="small" type="success" @click="downloadArchive(scope.row)">下载</el-button>
              <el-button size="small" type="warning" @click="auditArchive(scope.row)">审核</el-button>
              <el-button size="small" type="danger" @click="deleteArchive(scope.row)">删除</el-button>
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
  name: 'ArchiveReport',
  setup() {
    const archives = ref([
      {
        id: 1,
        archiveCode: 'ARCH-001',
        studentName: '张小明',
        studentId: '2021001001',
        archiveType: '学籍档案',
        college: '计算机学院',
        grade: '2021级',
        major: '计算机科学与技术',
        createDate: '2021-09-01',
        updateDate: '2023-12-15',
        fileCount: 15,
        status: '正常'
      },
      {
        id: 2,
        archiveCode: 'ARCH-002',
        studentName: '李小红',
        studentId: '2021001002',
        archiveType: '成绩档案',
        college: '计算机学院',
        grade: '2021级',
        major: '软件工程',
        createDate: '2021-09-01',
        updateDate: '2023-12-10',
        fileCount: 8,
        status: '正常'
      },
      {
        id: 3,
        archiveCode: 'ARCH-003',
        studentName: '王小强',
        studentId: '2022002001',
        archiveType: '奖惩档案',
        college: '机械工程学院',
        grade: '2022级',
        major: '机械设计制造及其自动化',
        createDate: '2022-09-01',
        updateDate: '2023-11-20',
        fileCount: 5,
        status: '待审核'
      },
      {
        id: 4,
        archiveCode: 'ARCH-004',
        studentName: '赵小丽',
        studentId: '2022002002',
        archiveType: '实习档案',
        college: '计算机学院',
        grade: '2022级',
        major: '网络工程',
        createDate: '2022-09-01',
        updateDate: '2023-12-05',
        fileCount: 12,
        status: '正常'
      },
      {
        id: 5,
        archiveCode: 'ARCH-005',
        studentName: '陈小军',
        studentId: '2020001001',
        archiveType: '毕业档案',
        college: '计算机学院',
        grade: '2020级',
        major: '计算机科学与技术',
        createDate: '2020-09-01',
        updateDate: '2023-06-30',
        fileCount: 25,
        status: '已归档'
      },
      {
        id: 6,
        archiveCode: 'ARCH-006',
        studentName: '刘小芳',
        studentId: '2021003001',
        archiveType: '学籍档案',
        college: '设计学院',
        grade: '2021级',
        major: '视觉传达设计',
        createDate: '2021-09-01',
        updateDate: '2023-12-12',
        fileCount: 18,
        status: '正常'
      },
      {
        id: 7,
        archiveCode: 'ARCH-007',
        studentName: '孙小华',
        studentId: '2022003001',
        archiveType: '成绩档案',
        college: '设计学院',
        grade: '2022级',
        major: '环境设计',
        createDate: '2022-09-01',
        updateDate: '2023-12-08',
        fileCount: 10,
        status: '正常'
      },
      {
        id: 8,
        archiveCode: 'ARCH-008',
        studentName: '周小敏',
        studentId: '2021004001',
        archiveType: '奖惩档案',
        college: '音乐学院',
        grade: '2021级',
        major: '音乐表演',
        createDate: '2021-09-01',
        updateDate: '2023-11-25',
        fileCount: 6,
        status: '待审核'
      },
      {
        id: 9,
        archiveCode: 'ARCH-009',
        studentName: '吴小勇',
        studentId: '2022004001',
        archiveType: '实习档案',
        college: '机械工程学院',
        grade: '2022级',
        major: '机械电子工程',
        createDate: '2022-09-01',
        updateDate: '2023-12-18',
        fileCount: 14,
        status: '正常'
      },
      {
        id: 10,
        archiveCode: 'ARCH-010',
        studentName: '郑小丽',
        studentId: '2020002001',
        archiveType: '毕业档案',
        college: '设计学院',
        grade: '2020级',
        major: '产品设计',
        createDate: '2020-09-01',
        updateDate: '2023-06-25',
        fileCount: 22,
        status: '已归档'
      },
      {
        id: 11,
        archiveCode: 'ARCH-011',
        studentName: '马小涛',
        studentId: '2021005001',
        archiveType: '学籍档案',
        college: '传媒学院',
        grade: '2021级',
        major: '广播电视学',
        createDate: '2021-09-01',
        updateDate: '2023-12-20',
        fileCount: 16,
        status: '正常'
      },
      {
        id: 12,
        archiveCode: 'ARCH-012',
        studentName: '林小雪',
        studentId: '2022005001',
        archiveType: '成绩档案',
        college: '传媒学院',
        grade: '2022级',
        major: '新闻学',
        createDate: '2022-09-01',
        updateDate: '2023-12-14',
        fileCount: 9,
        status: '正常'
      },
      {
        id: 13,
        archiveCode: 'ARCH-013',
        studentName: '黄小明',
        studentId: '2021006001',
        archiveType: '奖惩档案',
        college: '艺术学院',
        grade: '2021级',
        major: '美术学',
        createDate: '2021-09-01',
        updateDate: '2023-11-30',
        fileCount: 7,
        status: '待审核'
      },
      {
        id: 14,
        archiveCode: 'ARCH-014',
        studentName: '徐小芳',
        studentId: '2022006001',
        archiveType: '实习档案',
        college: '艺术学院',
        grade: '2022级',
        major: '绘画',
        createDate: '2022-09-01',
        updateDate: '2023-12-22',
        fileCount: 13,
        status: '正常'
      },
      {
        id: 15,
        archiveCode: 'ARCH-015',
        studentName: '何小军',
        studentId: '2020003001',
        archiveType: '毕业档案',
        college: '音乐学院',
        grade: '2020级',
        major: '音乐学',
        createDate: '2020-09-01',
        updateDate: '2023-06-20',
        fileCount: 28,
        status: '已归档'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      archiveType: '',
      college: '',
      status: '',
      grade: '',
      studentName: '',
      studentId: ''
    })

    // 筛选选项
    const archiveTypeOptions = ref([
      '学籍档案',
      '成绩档案',
      '奖惩档案',
      '实习档案',
      '毕业档案',
      '健康档案',
      '家庭档案'
    ])
    
    const collegeOptions = ref([
      '计算机学院',
      '机械工程学院',
      '设计学院',
      '音乐学院',
      '传媒学院',
      '艺术学院'
    ])

    const gradeOptions = ref([
      '2020级',
      '2021级',
      '2022级',
      '2023级'
    ])

    // 筛选后的档案数据
    const filteredArchives = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredArchives.value = archives.value.filter(archive => {
        return (
          (!filterForm.archiveType || archive.archiveType === filterForm.archiveType) &&
          (!filterForm.college || archive.college === filterForm.college) &&
          (!filterForm.status || archive.status === filterForm.status) &&
          (!filterForm.grade || archive.grade === filterForm.grade) &&
          (!filterForm.studentName || archive.studentName.includes(filterForm.studentName)) &&
          (!filterForm.studentId || archive.studentId.includes(filterForm.studentId))
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.archiveType = ''
      filterForm.college = ''
      filterForm.status = ''
      filterForm.grade = ''
      filterForm.studentName = ''
      filterForm.studentId = ''
      filteredArchives.value = archives.value
    }

    // 初始化时显示所有档案
    filteredArchives.value = archives.value

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '正常': 'success',
        '待审核': 'warning',
        '已归档': 'info',
        '已销毁': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const addArchive = () => {
      ElMessage.info('新建档案功能开发中...')
    }

    const viewArchive = (row) => {
      ElMessage.info(`查看档案 ${row.studentName} 详细信息`)
    }

    const editArchive = (row) => {
      ElMessage.info(`编辑档案 ${row.studentName}`)
    }

    const downloadArchive = (row) => {
      ElMessage.info(`下载档案 ${row.studentName}`)
    }

    const auditArchive = (row) => {
      ElMessage.info(`审核档案 ${row.studentName}`)
    }

    const deleteArchive = (row) => {
      ElMessageBox.confirm(
        `确定要删除档案 "${row.studentName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = archives.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          archives.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      archives,
      filteredArchives,
      filterForm,
      archiveTypeOptions,
      collegeOptions,
      gradeOptions,
      applyFilter,
      resetFilter,
      getStatusType,
      addArchive,
      viewArchive,
      editArchive,
      downloadArchive,
      auditArchive,
      deleteArchive
    }
  }
}
</script>

<style scoped>
.archive-report {
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
