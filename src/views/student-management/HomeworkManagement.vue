<template>
  <div class="homework-management">
    <div class="section-header">
      <h3>作业管理</h3>
      <p>管理学生作业布置、提交和批改</p>
    </div>

    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="课程名称">
          <el-input v-model="searchForm.courseName" placeholder="请输入课程名称" clearable />
        </el-form-item>
        <el-form-item label="作业标题">
          <el-input v-model="searchForm.homeworkTitle" placeholder="请输入作业标题" clearable />
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="searchForm.className" placeholder="请选择班级" clearable>
            <el-option label="一年级1班" value="一年级1班" />
            <el-option label="一年级2班" value="一年级2班" />
            <el-option label="二年级1班" value="二年级1班" />
            <el-option label="二年级2班" value="二年级2班" />
            <el-option label="三年级1班" value="三年级1班" />
            <el-option label="三年级2班" value="三年级2班" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已截止" value="已截止" />
            <el-option label="已批改" value="已批改" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作按钮 -->
    <el-card class="action-card">
      <div class="action-buttons">
        <el-button type="primary" @click="handleAddHomework">
          <el-icon><Plus /></el-icon>
          布置作业
        </el-button>
        <el-button type="success" @click="handleBatchGrade">
          <el-icon><Edit /></el-icon>
          批量批改
        </el-button>
        <el-button type="warning" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>
    </el-card>

    <!-- 作业列表 -->
    <el-card class="table-card">
      <el-table
        :data="homeworkList"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="homeworkId" label="作业ID" min-width="100" />
        <el-table-column prop="courseName" label="课程名称" min-width="130" />
        <el-table-column prop="homeworkTitle" label="作业标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="className" label="班级" min-width="110" />
        <el-table-column prop="teacherName" label="任课教师" min-width="100" />
        <el-table-column prop="publishDate" label="发布时间" min-width="110" />
        <el-table-column prop="deadline" label="截止时间" min-width="110" />
        <el-table-column prop="totalStudents" label="总人数" min-width="80" align="center" />
        <el-table-column prop="submittedCount" label="已提交" min-width="80" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.submittedCount === row.totalStudents ? '#67c23a' : '#e6a23c' }">
              {{ row.submittedCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="gradedCount" label="已批改" min-width="80" align="center">
          <template #default="{ row }">
            <span :style="{ color: row.gradedCount === row.submittedCount && row.submittedCount > 0 ? '#67c23a' : '#909399' }">
              {{ row.gradedCount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" fixed="right">
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleView(row)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button type="success" size="small" @click="handleGrade(row)">
                <el-icon><Edit /></el-icon>
                批改
              </el-button>
              <el-button type="danger" size="small" @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑作业对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程名称" prop="courseName">
              <el-select v-model="form.courseName" placeholder="请选择课程" style="width: 100%">
                <el-option label="数据结构" value="数据结构" />
                <el-option label="算法设计" value="算法设计" />
                <el-option label="数据库原理" value="数据库原理" />
                <el-option label="软件工程" value="软件工程" />
                <el-option label="计算机网络" value="计算机网络" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="className">
              <el-select v-model="form.className" placeholder="请选择班级" style="width: 100%">
                <el-option label="一年级1班" value="一年级1班" />
                <el-option label="一年级2班" value="一年级2班" />
                <el-option label="二年级1班" value="二年级1班" />
                <el-option label="二年级2班" value="二年级2班" />
                <el-option label="三年级1班" value="三年级1班" />
                <el-option label="三年级2班" value="三年级2班" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="作业标题" prop="homeworkTitle">
          <el-input v-model="form.homeworkTitle" placeholder="请输入作业标题" />
        </el-form-item>
        <el-form-item label="作业描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入作业描述和要求"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发布时间" prop="publishDate">
              <el-date-picker
                v-model="form.publishDate"
                type="datetime"
                placeholder="选择发布时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="截止时间" prop="deadline">
              <el-date-picker
                v-model="form.deadline"
                type="datetime"
                placeholder="选择截止时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="附件">
          <el-upload
            class="upload-demo"
            drag
            action="#"
            multiple
            :auto-upload="false"
            :file-list="fileList"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持上传作业模板、参考资料等文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Download,
  View,
  Delete,
  UploadFilled
} from '@element-plus/icons-vue'

export default {
  name: 'HomeworkManagement',
  components: {
    Search,
    Refresh,
    Plus,
    Edit,
    Download,
    View,
    Delete,
    UploadFilled
  },
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref()
    const fileList = ref([])
    const selectedRows = ref([])

    // 搜索表单
    const searchForm = reactive({
      courseName: '',
      homeworkTitle: '',
      className: '',
      status: ''
    })

    // 分页
    const pagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })

    // 表单数据
    const form = reactive({
      homeworkId: '',
      courseName: '',
      className: '',
      homeworkTitle: '',
      description: '',
      publishDate: '',
      deadline: ''
    })

    // 表单验证规则
    const rules = {
      courseName: [
        { required: true, message: '请选择课程名称', trigger: 'change' }
      ],
      className: [
        { required: true, message: '请选择班级', trigger: 'change' }
      ],
      homeworkTitle: [
        { required: true, message: '请输入作业标题', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入作业描述', trigger: 'blur' }
      ],
      publishDate: [
        { required: true, message: '请选择发布时间', trigger: 'change' }
      ],
      deadline: [
        { required: true, message: '请选择截止时间', trigger: 'change' }
      ]
    }

    // 作业列表数据
    const homeworkList = ref([
      {
        homeworkId: 'HW001',
        courseName: '数据结构',
        homeworkTitle: '链表操作实验',
        className: '一年级1班',
        teacherName: '张老师',
        publishDate: '2024-01-15',
        deadline: '2024-01-22',
        totalStudents: 30,
        submittedCount: 28,
        gradedCount: 25,
        status: '进行中'
      },
      {
        homeworkId: 'HW002',
        courseName: '算法设计',
        homeworkTitle: '排序算法实现',
        className: '二年级1班',
        teacherName: '李老师',
        publishDate: '2024-01-10',
        deadline: '2024-01-20',
        totalStudents: 25,
        submittedCount: 25,
        gradedCount: 25,
        status: '已批改'
      },
      {
        homeworkId: 'HW003',
        courseName: '数据库原理',
        homeworkTitle: 'SQL查询练习',
        className: '三年级1班',
        teacherName: '王老师',
        publishDate: '2024-01-08',
        deadline: '2024-01-18',
        totalStudents: 28,
        submittedCount: 20,
        gradedCount: 15,
        status: '已截止'
      },
      {
        homeworkId: 'HW004',
        courseName: '软件工程',
        homeworkTitle: '需求分析文档编写',
        className: '三年级1班',
        teacherName: '赵老师',
        publishDate: '2024-01-12',
        deadline: '2024-01-25',
        totalStudents: 28,
        submittedCount: 25,
        gradedCount: 18,
        status: '进行中'
      },
      {
        homeworkId: 'HW005',
        courseName: '计算机网络',
        homeworkTitle: 'TCP/IP协议分析实验',
        className: '二年级2班',
        teacherName: '刘老师',
        publishDate: '2024-01-05',
        deadline: '2024-01-15',
        totalStudents: 32,
        submittedCount: 32,
        gradedCount: 32,
        status: '已批改'
      },
      {
        homeworkId: 'HW006',
        courseName: '数据结构',
        homeworkTitle: '栈和队列应用',
        className: '一年级2班',
        teacherName: '张老师',
        publishDate: '2024-01-18',
        deadline: '2024-01-28',
        totalStudents: 29,
        submittedCount: 12,
        gradedCount: 5,
        status: '进行中'
      },
      {
        homeworkId: 'HW007',
        courseName: '算法设计',
        homeworkTitle: '动态规划算法练习',
        className: '三年级2班',
        teacherName: '李老师',
        publishDate: '2024-01-03',
        deadline: '2024-01-12',
        totalStudents: 26,
        submittedCount: 24,
        gradedCount: 20,
        status: '已截止'
      },
      {
        homeworkId: 'HW008',
        courseName: '数据库原理',
        homeworkTitle: '数据库设计与ER图绘制',
        className: '二年级1班',
        teacherName: '王老师',
        publishDate: '2024-01-14',
        deadline: '2024-01-26',
        totalStudents: 25,
        submittedCount: 22,
        gradedCount: 15,
        status: '进行中'
      },
      {
        homeworkId: 'HW009',
        courseName: '软件工程',
        homeworkTitle: 'UML类图设计与实现',
        className: '一年级1班',
        teacherName: '赵老师',
        publishDate: '2024-01-01',
        deadline: '2024-01-10',
        totalStudents: 30,
        submittedCount: 30,
        gradedCount: 28,
        status: '已批改'
      },
      {
        homeworkId: 'HW010',
        courseName: '计算机网络',
        homeworkTitle: 'HTTP协议抓包实验',
        className: '三年级1班',
        teacherName: '刘老师',
        publishDate: '2024-01-20',
        deadline: '2024-02-05',
        totalStudents: 28,
        submittedCount: 8,
        gradedCount: 2,
        status: '进行中'
      },
      {
        homeworkId: 'HW011',
        courseName: '算法设计',
        homeworkTitle: '贪心算法解决背包问题',
        className: '一年级2班',
        teacherName: '李老师',
        publishDate: '2024-01-08',
        deadline: '2024-01-18',
        totalStudents: 29,
        submittedCount: 0,
        gradedCount: 0,
        status: '未开始'
      },
      {
        homeworkId: 'HW012',
        courseName: '数据结构',
        homeworkTitle: '二叉树遍历实现',
        className: '二年级2班',
        teacherName: '张老师',
        publishDate: '2024-01-06',
        deadline: '2024-01-13',
        totalStudents: 32,
        submittedCount: 31,
        gradedCount: 30,
        status: '已批改'
      },
      {
        homeworkId: 'HW013',
        courseName: '数据库原理',
        homeworkTitle: '事务处理与并发控制',
        className: '三年级2班',
        teacherName: '王老师',
        publishDate: '2024-01-16',
        deadline: '2024-01-30',
        totalStudents: 26,
        submittedCount: 18,
        gradedCount: 10,
        status: '进行中'
      },
      {
        homeworkId: 'HW014',
        courseName: '软件工程',
        homeworkTitle: '系统测试用例设计',
        className: '二年级1班',
        teacherName: '赵老师',
        publishDate: '2024-01-04',
        deadline: '2024-01-11',
        totalStudents: 25,
        submittedCount: 25,
        gradedCount: 23,
        status: '已批改'
      },
      {
        homeworkId: 'HW015',
        courseName: '计算机网络',
        homeworkTitle: '路由算法仿真实验',
        className: '一年级1班',
        teacherName: '刘老师',
        publishDate: '2024-01-22',
        deadline: '2024-02-08',
        totalStudents: 30,
        submittedCount: 5,
        gradedCount: 0,
        status: '进行中'
      },
      {
        homeworkId: 'HW016',
        courseName: '算法设计',
        homeworkTitle: '分治算法解决最大子数组问题',
        className: '三年级1班',
        teacherName: '李老师',
        publishDate: '2024-01-09',
        deadline: '2024-01-17',
        totalStudents: 28,
        submittedCount: 27,
        gradedCount: 25,
        status: '已批改'
      },
      {
        homeworkId: 'HW017',
        courseName: '数据库原理',
        homeworkTitle: '索引优化与查询性能分析',
        className: '二年级2班',
        teacherName: '王老师',
        publishDate: '2024-01-11',
        deadline: '2024-01-24',
        totalStudents: 32,
        submittedCount: 30,
        gradedCount: 28,
        status: '进行中'
      },
      {
        homeworkId: 'HW018',
        courseName: '软件工程',
        homeworkTitle: '敏捷开发实践报告',
        className: '一年级2班',
        teacherName: '赵老师',
        publishDate: '2024-01-02',
        deadline: '2024-01-09',
        totalStudents: 29,
        submittedCount: 29,
        gradedCount: 29,
        status: '已批改'
      },
      {
        homeworkId: 'HW019',
        courseName: '计算机网络',
        homeworkTitle: 'DNS查询实验报告',
        className: '三年级2班',
        teacherName: '刘老师',
        publishDate: '2024-01-17',
        deadline: '2024-02-03',
        totalStudents: 26,
        submittedCount: 15,
        gradedCount: 8,
        status: '进行中'
      },
      {
        homeworkId: 'HW020',
        courseName: '数据结构',
        homeworkTitle: '图论算法实现与可视化',
        className: '二年级1班',
        teacherName: '张老师',
        publishDate: '2024-01-07',
        deadline: '2024-01-14',
        totalStudents: 25,
        submittedCount: 24,
        gradedCount: 22,
        status: '已批改'
      },
      {
        homeworkId: 'HW021',
        courseName: '算法设计',
        homeworkTitle: '回溯算法解决N皇后问题',
        className: '一年级1班',
        teacherName: '李老师',
        publishDate: '2024-01-19',
        deadline: '2024-02-01',
        totalStudents: 30,
        submittedCount: 20,
        gradedCount: 12,
        status: '进行中'
      }
    ])

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '未开始': 'info',
        '进行中': 'warning',
        '已截止': 'danger',
        '已批改': 'success'
      }
      return statusMap[status] || 'info'
    }

    // 搜索
    const handleSearch = () => {
      loading.value = true
      // 模拟搜索
      setTimeout(() => {
        loading.value = false
        ElMessage.success('搜索完成')
      }, 1000)
    }

    // 重置
    const handleReset = () => {
      Object.keys(searchForm).forEach(key => {
        searchForm[key] = ''
      })
      handleSearch()
    }

    // 添加作业
    const handleAddHomework = () => {
      dialogTitle.value = '布置作业'
      resetForm()
      dialogVisible.value = true
    }

    // 批量批改
    const handleBatchGrade = () => {
      if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要批改的作业')
        return
      }
      ElMessage.success(`开始批量批改 ${selectedRows.value.length} 个作业`)
    }

    // 导出数据
    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    // 查看作业
    const handleView = (row) => {
      ElMessage.info(`查看作业: ${row.homeworkTitle}`)
    }

    // 批改作业
    const handleGrade = (row) => {
      ElMessage.info(`批改作业: ${row.homeworkTitle}`)
    }

    // 删除作业
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除作业 "${row.homeworkTitle}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('删除成功')
      }).catch(() => {
        ElMessage.info('已取消删除')
      })
    }

    // 选择变化
    const handleSelectionChange = (selection) => {
      selectedRows.value = selection
    }

    // 分页大小变化
    const handleSizeChange = (val) => {
      pagination.pageSize = val
      handleSearch()
    }

    // 当前页变化
    const handleCurrentChange = (val) => {
      pagination.currentPage = val
      handleSearch()
    }

    // 重置表单
    const resetForm = () => {
      Object.keys(form).forEach(key => {
        form[key] = ''
      })
      fileList.value = []
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }

    // 提交表单
    const handleSubmit = () => {
      if (!formRef.value) return
      
      formRef.value.validate((valid) => {
        if (valid) {
          ElMessage.success('作业布置成功')
          dialogVisible.value = false
          handleSearch()
        } else {
          ElMessage.error('请完善表单信息')
        }
      })
    }

    // 关闭对话框
    const handleDialogClose = () => {
      dialogVisible.value = false
      resetForm()
    }

    onMounted(() => {
      pagination.total = homeworkList.value.length
    })

    return {
      loading,
      dialogVisible,
      dialogTitle,
      formRef,
      fileList,
      selectedRows,
      searchForm,
      pagination,
      form,
      rules,
      homeworkList,
      getStatusType,
      handleSearch,
      handleReset,
      handleAddHomework,
      handleBatchGrade,
      handleExport,
      handleView,
      handleGrade,
      handleDelete,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      handleSubmit,
      handleDialogClose
    }
  }
}
</script>

<style scoped>
.homework-management {
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
.action-card,
.table-card {
  margin-bottom: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.upload-demo {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  padding: 7px 10px;
}
</style>
