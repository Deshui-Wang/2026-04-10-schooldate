<template>
  <div class="achievement-management">
    <div class="section-header">
      <h3>成果管理</h3>
      <p>管理学生学术成果：论文、专利、奖学金、竞赛获奖、技能证书</p>
    </div>

    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="学生姓名">
          <el-input v-model="searchForm.studentName" placeholder="请输入学生姓名" clearable />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="searchForm.studentId" placeholder="请输入学号" clearable />
        </el-form-item>
        <el-form-item label="成果类型">
          <el-select v-model="searchForm.achievementType" placeholder="请选择成果类型" clearable>
            <el-option label="论文发表" value="论文发表" />
            <el-option label="专利申请" value="专利申请" />
            <el-option label="奖学金" value="奖学金" />
            <el-option label="竞赛获奖" value="竞赛获奖" />
            <el-option label="技能证书" value="技能证书" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="searchForm.className" placeholder="请选择班级" clearable>
            <el-option label="一年级1班" value="一年级1班" />
            <el-option label="一年级2班" value="一年级2班" />
            <el-option label="二年级1班" value="二年级2班" />
            <el-option label="三年级1班" value="三年级1班" />
            <el-option label="三年级2班" value="三年级2班" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="searchForm.level" placeholder="请选择级别" clearable>
            <el-option label="国家级" value="国家级" />
            <el-option label="省级" value="省级" />
            <el-option label="市级" value="市级" />
            <el-option label="校级" value="校级" />
            <el-option label="院级" value="院级" />
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
        <el-button type="primary" @click="handleAddAchievement">
          <el-icon><Plus /></el-icon>
          添加成果
        </el-button>
        <el-button type="success" @click="handleBatchImport">
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button type="warning" @click="handleAchievementAnalysis">
          <el-icon><TrendCharts /></el-icon>
          成果分析
        </el-button>
        <el-button type="info" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
      </div>
    </el-card>

    <!-- 成果统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon paper">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ achievementStats.papers }}</div>
              <div class="stat-label">论文发表</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon patent">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ achievementStats.patents }}</div>
              <div class="stat-label">专利申请</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon scholarship">
              <el-icon><Medal /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ achievementStats.scholarships }}</div>
              <div class="stat-label">奖学金</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon competition">
              <el-icon><TrophyBase /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ achievementStats.competitions }}</div>
              <div class="stat-label">竞赛获奖</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 成果列表 -->
    <el-card class="table-card">
      <el-table
        :data="achievementList"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="studentName" label="姓名" width="100" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="achievementType" label="成果类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getAchievementTypeColor(row.achievementType)">
              {{ row.achievementType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="成果标题" width="250" />
        <el-table-column prop="level" label="级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="awardDate" label="获得日期" width="120" />
        <el-table-column prop="organization" label="颁发机构" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="积分" width="80" align="center" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button type="success" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="warning" size="small" @click="handleVerify(row)">
              <el-icon><Check /></el-icon>
              审核
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
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

    <!-- 添加/编辑成果对话框 -->
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
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" placeholder="请输入学生姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="班级" prop="className">
              <el-select v-model="form.className" placeholder="请选择班级" style="width: 100%">
                <el-option label="一年级1班" value="一年级1班" />
                <el-option label="一年级2班" value="一年级2班" />
                <el-option label="二年级1班" value="二年级2班" />
                <el-option label="三年级1班" value="三年级1班" />
                <el-option label="三年级2班" value="三年级2班" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成果类型" prop="achievementType">
              <el-select v-model="form.achievementType" placeholder="请选择成果类型" style="width: 100%">
                <el-option label="论文发表" value="论文发表" />
                <el-option label="专利申请" value="专利申请" />
                <el-option label="奖学金" value="奖学金" />
                <el-option label="竞赛获奖" value="竞赛获奖" />
                <el-option label="技能证书" value="技能证书" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="成果标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入成果标题" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="级别" prop="level">
              <el-select v-model="form.level" placeholder="请选择级别" style="width: 100%">
                <el-option label="国家级" value="国家级" />
                <el-option label="省级" value="省级" />
                <el-option label="市级" value="市级" />
                <el-option label="校级" value="校级" />
                <el-option label="院级" value="院级" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="获得日期" prop="awardDate">
              <el-date-picker
                v-model="form.awardDate"
                type="date"
                placeholder="选择获得日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="颁发机构" prop="organization">
          <el-input v-model="form.organization" placeholder="请输入颁发机构" />
        </el-form-item>
        <el-form-item label="成果描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入成果详细描述"
          />
        </el-form-item>
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
                支持上传证书、证明文件等
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

    <!-- 成果分析对话框 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="成果分析"
      width="800px"
    >
      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">总成果数</div>
                <div class="analysis-value">{{ analysisData.totalAchievements }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">平均积分</div>
                <div class="analysis-value">{{ analysisData.avgScore }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">优秀学生数</div>
                <div class="analysis-value">{{ analysisData.excellentStudents }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">成果增长率</div>
                <div class="analysis-value">{{ analysisData.growthRate }}%</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
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
  Upload,
  TrendCharts,
  Document,
  Trophy,
  Medal,
  TrophyBase,
  Check,
  UploadFilled
} from '@element-plus/icons-vue'

export default {
  name: 'AchievementManagement',
  components: {
    Search,
    Refresh,
    Plus,
    Edit,
    Download,
    View,
    Delete,
    Upload,
    TrendCharts,
    Document,
    Trophy,
    Medal,
    TrophyBase,
    Check,
    UploadFilled
  },
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const analysisDialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref()
    const fileList = ref([])
    const selectedRows = ref([])

    // 搜索表单
    const searchForm = reactive({
      studentName: '',
      studentId: '',
      achievementType: '',
      className: '',
      level: ''
    })

    // 分页
    const pagination = reactive({
      currentPage: 1,
      pageSize: 10,
      total: 0
    })

    // 表单数据
    const form = reactive({
      studentId: '',
      studentName: '',
      className: '',
      achievementType: '',
      title: '',
      level: '',
      awardDate: '',
      organization: '',
      description: ''
    })

    // 表单验证规则
    const rules = {
      studentId: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      studentName: [
        { required: true, message: '请输入学生姓名', trigger: 'blur' }
      ],
      className: [
        { required: true, message: '请选择班级', trigger: 'change' }
      ],
      achievementType: [
        { required: true, message: '请选择成果类型', trigger: 'change' }
      ],
      title: [
        { required: true, message: '请输入成果标题', trigger: 'blur' }
      ],
      level: [
        { required: true, message: '请选择级别', trigger: 'change' }
      ],
      awardDate: [
        { required: true, message: '请选择获得日期', trigger: 'change' }
      ],
      organization: [
        { required: true, message: '请输入颁发机构', trigger: 'blur' }
      ]
    }

    // 成果统计
    const achievementStats = reactive({
      papers: 12,
      patents: 8,
      scholarships: 25,
      competitions: 18
    })

    // 成果列表数据
    const achievementList = ref([
      {
        studentId: '2021001',
        studentName: '张三',
        className: '一年级1班',
        achievementType: '论文发表',
        title: '基于深度学习的图像识别算法研究',
        level: '国家级',
        awardDate: '2024-01-15',
        organization: '中国计算机学会',
        status: '已审核',
        score: 50
      },
      {
        studentId: '2021002',
        studentName: '李四',
        className: '一年级1班',
        achievementType: '竞赛获奖',
        title: '全国大学生程序设计竞赛',
        level: '国家级',
        awardDate: '2024-01-10',
        organization: '教育部',
        status: '已审核',
        score: 40
      },
      {
        studentId: '2021003',
        studentName: '王五',
        className: '一年级2班',
        achievementType: '奖学金',
        title: '国家励志奖学金',
        level: '国家级',
        awardDate: '2024-01-08',
        organization: '教育部',
        status: '待审核',
        score: 30
      },
      {
        studentId: '2021004',
        studentName: '赵六',
        className: '二年级1班',
        achievementType: '技能证书',
        title: 'Oracle数据库认证',
        level: '国际级',
        awardDate: '2024-01-05',
        organization: 'Oracle公司',
        status: '已审核',
        score: 25
      }
    ])

    // 分析数据
    const analysisData = reactive({
      totalAchievements: 63,
      avgScore: 36.2,
      excellentStudents: 15,
      growthRate: 23.5
    })

    // 获取成果类型颜色
    const getAchievementTypeColor = (type) => {
      const colorMap = {
        '论文发表': 'primary',
        '专利申请': 'success',
        '奖学金': 'warning',
        '竞赛获奖': 'danger',
        '技能证书': 'info'
      }
      return colorMap[type] || 'info'
    }

    // 获取级别类型
    const getLevelType = (level) => {
      const levelMap = {
        '国家级': 'danger',
        '省级': 'warning',
        '市级': 'primary',
        '校级': 'success',
        '院级': 'info',
        '国际级': 'danger'
      }
      return levelMap[level] || 'info'
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '待审核': 'warning',
        '已审核': 'success',
        '审核不通过': 'danger'
      }
      return statusMap[status] || 'info'
    }

    // 搜索
    const handleSearch = () => {
      loading.value = true
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

    // 添加成果
    const handleAddAchievement = () => {
      dialogTitle.value = '添加成果'
      resetForm()
      dialogVisible.value = true
    }

    // 批量导入
    const handleBatchImport = () => {
      ElMessage.success('批量导入功能开发中...')
    }

    // 成果分析
    const handleAchievementAnalysis = () => {
      analysisDialogVisible.value = true
    }

    // 导出数据
    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    // 查看成果
    const handleView = (row) => {
      ElMessage.info(`查看成果: ${row.title}`)
    }

    // 编辑成果
    const handleEdit = (row) => {
      dialogTitle.value = '编辑成果'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    // 审核成果
    const handleVerify = (row) => {
      ElMessageBox.confirm(
        `确定要审核通过成果 "${row.title}" 吗？`,
        '确认审核',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('审核通过')
      }).catch(() => {
        ElMessage.info('已取消审核')
      })
    }

    // 删除成果
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除成果 "${row.title}" 吗？`,
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
          ElMessage.success('成果保存成功')
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
      pagination.total = achievementList.value.length
    })

    return {
      loading,
      dialogVisible,
      analysisDialogVisible,
      dialogTitle,
      formRef,
      fileList,
      selectedRows,
      searchForm,
      pagination,
      form,
      rules,
      achievementStats,
      achievementList,
      analysisData,
      getAchievementTypeColor,
      getLevelType,
      getStatusType,
      handleSearch,
      handleReset,
      handleAddAchievement,
      handleBatchImport,
      handleAchievementAnalysis,
      handleExport,
      handleView,
      handleEdit,
      handleVerify,
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
.achievement-management {
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

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 24px;
}

.stat-icon.paper {
  background: #e8f4fd;
  color: #409eff;
}

.stat-icon.patent {
  background: #e8f5e8;
  color: #67c23a;
}

.stat-icon.scholarship {
  background: #fdf6ec;
  color: #e6a23c;
}

.stat-icon.competition {
  background: #fef0f0;
  color: #f56c6c;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.upload-demo {
  width: 100%;
}

.analysis-content {
  padding: 20px 0;
}

.analysis-card {
  text-align: center;
}

.analysis-item {
  padding: 20px;
}

.analysis-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.analysis-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}
</style>
