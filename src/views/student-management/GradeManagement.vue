<template>
  <div class="grade-management">
    <div class="section-header">
      <h3>成绩管理</h3>
      <p>管理学生各科成绩录入、查询和统计分析</p>
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
        <el-form-item label="课程名称">
          <el-select v-model="searchForm.courseName" placeholder="请选择课程" clearable>
            <el-option label="数据结构" value="数据结构" />
            <el-option label="算法设计" value="算法设计" />
            <el-option label="数据库原理" value="数据库原理" />
            <el-option label="软件工程" value="软件工程" />
            <el-option label="计算机网络" value="计算机网络" />
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-select v-model="searchForm.semester" placeholder="请选择学期" clearable>
            <el-option label="2023-2024学年第一学期" value="2023-2024-1" />
            <el-option label="2023-2024学年第二学期" value="2023-2024-2" />
            <el-option label="2024-2025学年第一学期" value="2024-2025-1" />
            <el-option label="2024-2025学年第二学期" value="2024-2025-2" />
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
        <el-button type="primary" @click="handleAddGrade">
          <el-icon><Plus /></el-icon>
          录入成绩
        </el-button>
        <el-button type="success" @click="handleBatchImport">
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button type="warning" @click="handleGradeAnalysis">
          <el-icon><TrendCharts /></el-icon>
          成绩分析
        </el-button>
        <el-button type="info" @click="handleExport">
          <el-icon><Download /></el-icon>
          导出成绩
        </el-button>
      </div>
    </el-card>

    <!-- 成绩列表 -->
    <el-card class="table-card">
      <el-table
        :data="gradeList"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="studentId" label="学号" min-width="110" />
        <el-table-column prop="studentName" label="姓名" min-width="90" />
        <el-table-column prop="className" label="班级" min-width="110" />
        <el-table-column prop="courseName" label="课程名称" min-width="130" />
        <el-table-column prop="semester" label="学期" min-width="160" show-overflow-tooltip />
        <el-table-column prop="usualGrade" label="平时成绩" min-width="90" align="center">
          <template #default="{ row }">
            <span :class="getGradeClass(row.usualGrade)">{{ row.usualGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="examGrade" label="考试成绩" min-width="90" align="center">
          <template #default="{ row }">
            <span :class="getGradeClass(row.examGrade)">{{ row.examGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="finalGrade" label="总成绩" min-width="90" align="center">
          <template #default="{ row }">
            <span :class="getGradeClass(row.finalGrade)">{{ row.finalGrade }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gradeLevel" label="等级" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getGradeLevelType(row.gradeLevel)">{{ row.gradeLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="任课教师" min-width="100" />
        <el-table-column prop="updateTime" label="更新时间" min-width="140" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="success" size="small" @click="handleViewDetail(row)">
                <el-icon><View /></el-icon>
                详情
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

    <!-- 添加/编辑成绩对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
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
            <el-form-item label="学期" prop="semester">
              <el-select v-model="form.semester" placeholder="请选择学期" style="width: 100%">
                <el-option label="2023-2024学年第一学期" value="2023-2024-1" />
                <el-option label="2023-2024学年第二学期" value="2023-2024-2" />
                <el-option label="2024-2025学年第一学期" value="2024-2025-1" />
                <el-option label="2024-2025学年第二学期" value="2024-2025-2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="平时成绩" prop="usualGrade">
              <el-input-number
                v-model="form.usualGrade"
                :min="0"
                :max="100"
                placeholder="0-100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="考试成绩" prop="examGrade">
              <el-input-number
                v-model="form.examGrade"
                :min="0"
                :max="100"
                placeholder="0-100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总成绩" prop="finalGrade">
              <el-input-number
                v-model="form.finalGrade"
                :min="0"
                :max="100"
                placeholder="0-100"
                style="width: 100%"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 成绩分析对话框 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="成绩分析"
      width="800px"
    >
      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-label">平均分</div>
                <div class="stat-value">{{ analysisData.average }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-label">及格率</div>
                <div class="stat-value">{{ analysisData.passRate }}%</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-label">优秀率</div>
                <div class="stat-value">{{ analysisData.excellentRate }}%</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-label">最高分</div>
                <div class="stat-value">{{ analysisData.maxScore }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-label">最低分</div>
                <div class="stat-value">{{ analysisData.minScore }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="stat-card">
              <div class="stat-item">
                <div class="stat-label">标准差</div>
                <div class="stat-value">{{ analysisData.standardDeviation }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, watch } from 'vue'
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
  TrendCharts
} from '@element-plus/icons-vue'

export default {
  name: 'GradeManagement',
  components: {
    Search,
    Refresh,
    Plus,
    Edit,
    Download,
    View,
    Delete,
    Upload,
    TrendCharts
  },
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const analysisDialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref()
    const selectedRows = ref([])

    // 搜索表单
    const searchForm = reactive({
      studentName: '',
      studentId: '',
      courseName: '',
      semester: '',
      className: ''
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
      courseName: '',
      semester: '',
      usualGrade: null,
      examGrade: null,
      finalGrade: null,
      remark: ''
    })

    // 表单验证规则
    const rules = {
      studentId: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      studentName: [
        { required: true, message: '请输入学生姓名', trigger: 'blur' }
      ],
      courseName: [
        { required: true, message: '请选择课程名称', trigger: 'change' }
      ],
      semester: [
        { required: true, message: '请选择学期', trigger: 'change' }
      ],
      usualGrade: [
        { required: true, message: '请输入平时成绩', trigger: 'blur' }
      ],
      examGrade: [
        { required: true, message: '请输入考试成绩', trigger: 'blur' }
      ]
    }

    // 成绩列表数据
    const gradeList = ref([
      {
        studentId: '2021001',
        studentName: '张三',
        className: '一年级1班',
        courseName: '数据结构',
        semester: '2023-2024学年第一学期',
        usualGrade: 85,
        examGrade: 78,
        finalGrade: 80,
        gradeLevel: 'B',
        teacherName: '张老师',
        updateTime: '2024-01-15 10:30'
      },
      {
        studentId: '2021002',
        studentName: '李四',
        className: '一年级1班',
        courseName: '数据结构',
        semester: '2023-2024学年第一学期',
        usualGrade: 92,
        examGrade: 88,
        finalGrade: 89,
        gradeLevel: 'A',
        teacherName: '张老师',
        updateTime: '2024-01-15 10:30'
      },
      {
        studentId: '2021003',
        studentName: '王五',
        className: '一年级2班',
        courseName: '算法设计',
        semester: '2023-2024学年第一学期',
        usualGrade: 76,
        examGrade: 82,
        finalGrade: 80,
        gradeLevel: 'B',
        teacherName: '李老师',
        updateTime: '2024-01-14 15:20'
      },
      {
        studentId: '2021004',
        studentName: '赵六',
        className: '一年级1班',
        courseName: '数据结构',
        semester: '2023-2024学年第一学期',
        usualGrade: 95,
        examGrade: 92,
        finalGrade: 93,
        gradeLevel: 'A',
        teacherName: '张老师',
        updateTime: '2024-01-15 10:32'
      },
      {
        studentId: '2021005',
        studentName: '钱七',
        className: '一年级2班',
        courseName: '算法设计',
        semester: '2023-2024学年第一学期',
        usualGrade: 88,
        examGrade: 85,
        finalGrade: 86,
        gradeLevel: 'B',
        teacherName: '李老师',
        updateTime: '2024-01-14 15:25'
      },
      {
        studentId: '2021006',
        studentName: '孙八',
        className: '一年级2班',
        courseName: '数据库原理',
        semester: '2023-2024学年第一学期',
        usualGrade: 70,
        examGrade: 75,
        finalGrade: 74,
        gradeLevel: 'C',
        teacherName: '王老师',
        updateTime: '2024-01-13 09:15'
      },
      {
        studentId: '2021007',
        studentName: '周九',
        className: '一年级1班',
        courseName: '计算机网络',
        semester: '2023-2024学年第一学期',
        usualGrade: 82,
        examGrade: 88,
        finalGrade: 86,
        gradeLevel: 'B',
        teacherName: '刘老师',
        updateTime: '2024-01-12 14:30'
      },
      {
        studentId: '2021008',
        studentName: '吴十',
        className: '一年级1班',
        courseName: '软件工程',
        semester: '2023-2024学年第一学期',
        usualGrade: 90,
        examGrade: 93,
        finalGrade: 92,
        gradeLevel: 'A',
        teacherName: '赵老师',
        updateTime: '2024-01-11 11:20'
      },
      {
        studentId: '2022001',
        studentName: '郑十一',
        className: '二年级1班',
        courseName: '数据结构',
        semester: '2024-2025学年第一学期',
        usualGrade: 98,
        examGrade: 96,
        finalGrade: 97,
        gradeLevel: 'A',
        teacherName: '张老师',
        updateTime: '2024-01-20 10:00'
      },
      {
        studentId: '2022002',
        studentName: '王十二',
        className: '二年级2班',
        courseName: '算法设计',
        semester: '2024-2025学年第一学期',
        usualGrade: 78,
        examGrade: 80,
        finalGrade: 79,
        gradeLevel: 'C',
        teacherName: '李老师',
        updateTime: '2024-01-19 16:45'
      },
      {
        studentId: '2022003',
        studentName: '冯十三',
        className: '二年级1班',
        courseName: '数据库原理',
        semester: '2024-2025学年第一学期',
        usualGrade: 87,
        examGrade: 82,
        finalGrade: 84,
        gradeLevel: 'B',
        teacherName: '王老师',
        updateTime: '2024-01-18 09:30'
      },
      {
        studentId: '2022004',
        studentName: '陈十四',
        className: '二年级2班',
        courseName: '软件工程',
        semester: '2024-2025学年第一学期',
        usualGrade: 75,
        examGrade: 68,
        finalGrade: 70,
        gradeLevel: 'C',
        teacherName: '赵老师',
        updateTime: '2024-01-17 14:20'
      },
      {
        studentId: '2022005',
        studentName: '褚十五',
        className: '二年级1班',
        courseName: '计算机网络',
        semester: '2024-2025学年第一学期',
        usualGrade: 93,
        examGrade: 90,
        finalGrade: 91,
        gradeLevel: 'A',
        teacherName: '刘老师',
        updateTime: '2024-01-16 11:10'
      },
      {
        studentId: '2023001',
        studentName: '卫十六',
        className: '三年级1班',
        courseName: '数据结构',
        semester: '2023-2024学年第二学期',
        usualGrade: 88,
        examGrade: 85,
        finalGrade: 86,
        gradeLevel: 'B',
        teacherName: '张老师',
        updateTime: '2024-06-20 10:30'
      },
      {
        studentId: '2023002',
        studentName: '蒋十七',
        className: '三年级2班',
        courseName: '算法设计',
        semester: '2023-2024学年第二学期',
        usualGrade: 92,
        examGrade: 95,
        finalGrade: 94,
        gradeLevel: 'A',
        teacherName: '李老师',
        updateTime: '2024-06-19 15:00'
      },
      {
        studentId: '2023003',
        studentName: '沈十八',
        className: '三年级1班',
        courseName: '数据库原理',
        semester: '2023-2024学年第二学期',
        usualGrade: 65,
        examGrade: 58,
        finalGrade: 60,
        gradeLevel: 'D',
        teacherName: '王老师',
        updateTime: '2024-06-18 09:45'
      },
      {
        studentId: '2023004',
        studentName: '韩十九',
        className: '三年级2班',
        courseName: '软件工程',
        semester: '2023-2024学年第二学期',
        usualGrade: 85,
        examGrade: 88,
        finalGrade: 87,
        gradeLevel: 'B',
        teacherName: '赵老师',
        updateTime: '2024-06-17 13:30'
      },
      {
        studentId: '2023005',
        studentName: '杨二十',
        className: '三年级1班',
        courseName: '计算机网络',
        semester: '2023-2024学年第二学期',
        usualGrade: 91,
        examGrade: 89,
        finalGrade: 90,
        gradeLevel: 'A',
        teacherName: '刘老师',
        updateTime: '2024-06-16 10:15'
      },
      {
        studentId: '2021009',
        studentName: '朱二十一',
        className: '一年级2班',
        courseName: '数据结构',
        semester: '2023-2024学年第一学期',
        usualGrade: 55,
        examGrade: 52,
        finalGrade: 53,
        gradeLevel: 'F',
        teacherName: '张老师',
        updateTime: '2024-01-15 10:35'
      },
      {
        studentId: '2022006',
        studentName: '秦二十二',
        className: '二年级2班',
        courseName: '算法设计',
        semester: '2024-2025学年第一学期',
        usualGrade: 89,
        examGrade: 91,
        finalGrade: 90,
        gradeLevel: 'A',
        teacherName: '李老师',
        updateTime: '2024-01-19 16:50'
      },
      {
        studentId: '2022007',
        studentName: '尤二十三',
        className: '二年级1班',
        courseName: '数据库原理',
        semester: '2024-2025学年第一学期',
        usualGrade: 72,
        examGrade: 70,
        finalGrade: 71,
        gradeLevel: 'C',
        teacherName: '王老师',
        updateTime: '2024-01-18 09:35'
      },
      {
        studentId: '2023006',
        studentName: '许二十四',
        className: '三年级2班',
        courseName: '软件工程',
        semester: '2023-2024学年第二学期',
        usualGrade: 96,
        examGrade: 98,
        finalGrade: 97,
        gradeLevel: 'A',
        teacherName: '赵老师',
        updateTime: '2024-06-17 13:35'
      },
      {
        studentId: '2023007',
        studentName: '何二十五',
        className: '三年级1班',
        courseName: '计算机网络',
        semester: '2023-2024学年第二学期',
        usualGrade: 68,
        examGrade: 62,
        finalGrade: 64,
        gradeLevel: 'D',
        teacherName: '刘老师',
        updateTime: '2024-06-16 10:20'
      },
      {
        studentId: '2021010',
        studentName: '吕二十六',
        className: '一年级2班',
        courseName: '算法设计',
        semester: '2023-2024学年第一学期',
        usualGrade: 83,
        examGrade: 86,
        finalGrade: 85,
        gradeLevel: 'B',
        teacherName: '李老师',
        updateTime: '2024-01-14 15:30'
      },
      {
        studentId: '2021011',
        studentName: '施二十七',
        className: '一年级1班',
        courseName: '数据库原理',
        semester: '2023-2024学年第一学期',
        usualGrade: 79,
        examGrade: 74,
        finalGrade: 76,
        gradeLevel: 'C',
        teacherName: '王老师',
        updateTime: '2024-01-13 09:20'
      },
      {
        studentId: '2022008',
        studentName: '张二十八',
        className: '二年级1班',
        courseName: '计算机网络',
        semester: '2024-2025学年第一学期',
        usualGrade: 94,
        examGrade: 97,
        finalGrade: 96,
        gradeLevel: 'A',
        teacherName: '刘老师',
        updateTime: '2024-01-16 11:15'
      },
      {
        studentId: '2023008',
        studentName: '孔二十九',
        className: '三年级2班',
        courseName: '数据结构',
        semester: '2023-2024学年第二学期',
        usualGrade: 81,
        examGrade: 84,
        finalGrade: 83,
        gradeLevel: 'B',
        teacherName: '张老师',
        updateTime: '2024-06-20 10:35'
      },
      {
        studentId: '2023009',
        studentName: '曹三十',
        className: '三年级1班',
        courseName: '算法设计',
        semester: '2023-2024学年第二学期',
        usualGrade: 56,
        examGrade: 55,
        finalGrade: 55,
        gradeLevel: 'F',
        teacherName: '李老师',
        updateTime: '2024-06-19 15:05'
      }
    ])

    // 分析数据
    const analysisData = reactive({
      average: 83.0,
      passRate: 95.2,
      excellentRate: 28.6,
      maxScore: 98,
      minScore: 65,
      standardDeviation: 8.5
    })

    // 监听平时成绩和考试成绩变化，自动计算总成绩
    watch([() => form.usualGrade, () => form.examGrade], ([usual, exam]) => {
      if (usual !== null && exam !== null) {
        form.finalGrade = Math.round(usual * 0.3 + exam * 0.7)
      }
    })

    // 获取成绩等级类型
    const getGradeLevelType = (level) => {
      const levelMap = {
        'A': 'success',
        'B': 'primary',
        'C': 'warning',
        'D': 'danger',
        'F': 'danger'
      }
      return levelMap[level] || 'info'
    }

    // 获取成绩样式类
    const getGradeClass = (grade) => {
      if (grade >= 90) return 'grade-excellent'
      if (grade >= 80) return 'grade-good'
      if (grade >= 70) return 'grade-average'
      if (grade >= 60) return 'grade-pass'
      return 'grade-fail'
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

    // 添加成绩
    const handleAddGrade = () => {
      dialogTitle.value = '录入成绩'
      resetForm()
      dialogVisible.value = true
    }

    // 批量导入
    const handleBatchImport = () => {
      ElMessage.success('批量导入功能开发中...')
    }

    // 成绩分析
    const handleGradeAnalysis = () => {
      analysisDialogVisible.value = true
    }

    // 导出成绩
    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    // 编辑成绩
    const handleEdit = (row) => {
      dialogTitle.value = '编辑成绩'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    // 查看详情
    const handleViewDetail = (row) => {
      ElMessage.info(`查看成绩详情: ${row.studentName} - ${row.courseName}`)
    }

    // 删除成绩
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除学生 "${row.studentName}" 的 "${row.courseName}" 成绩吗？`,
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
        form[key] = key.includes('Grade') ? null : ''
      })
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }

    // 提交表单
    const handleSubmit = () => {
      if (!formRef.value) return
      
      formRef.value.validate((valid) => {
        if (valid) {
          ElMessage.success('成绩保存成功')
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
      pagination.total = gradeList.value.length
    })

    return {
      loading,
      dialogVisible,
      analysisDialogVisible,
      dialogTitle,
      formRef,
      selectedRows,
      searchForm,
      pagination,
      form,
      rules,
      gradeList,
      analysisData,
      getGradeLevelType,
      getGradeClass,
      handleSearch,
      handleReset,
      handleAddGrade,
      handleBatchImport,
      handleGradeAnalysis,
      handleExport,
      handleEdit,
      handleViewDetail,
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
.grade-management {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.analysis-content {
  padding: 20px 0;
}

.stat-card {
  text-align: center;
}

.stat-item {
  padding: 20px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

/* 成绩样式 */
.grade-excellent {
  color: #67c23a;
  font-weight: 600;
}

.grade-good {
  color: #409eff;
  font-weight: 600;
}

.grade-average {
  color: #e6a23c;
  font-weight: 600;
}

.grade-pass {
  color: #909399;
  font-weight: 600;
}

.grade-fail {
  color: #f56c6c;
  font-weight: 600;
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
