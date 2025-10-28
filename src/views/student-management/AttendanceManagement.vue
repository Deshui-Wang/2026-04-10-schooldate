<template>
  <div class="attendance-management">
    <div class="section-header">
      <h3>出勤管理</h3>
      <p>管理学生课堂出勤记录和统计分析</p>
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
        <el-form-item label="班级">
          <el-select v-model="searchForm.className" placeholder="请选择班级" clearable>
            <el-option label="一年级1班" value="一年级1班" />
            <el-option label="一年级2班" value="一年级2班" />
            <el-option label="二年级1班" value="二年级2班" />
            <el-option label="三年级1班" value="三年级1班" />
            <el-option label="三年级2班" value="三年级2班" />
          </el-select>
        </el-form-item>
        <el-form-item label="出勤状态">
          <el-select v-model="searchForm.attendanceStatus" placeholder="请选择状态" clearable>
            <el-option label="出勤" value="出勤" />
            <el-option label="迟到" value="迟到" />
            <el-option label="早退" value="早退" />
            <el-option label="请假" value="请假" />
            <el-option label="缺勤" value="缺勤" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
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

    <!-- 操作按钮和出勤统计合并区域 -->
    <el-row :gutter="20" class="action-stats-row">

      <!-- 出勤统计卡片区域 -->
      <el-col :span="16">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon present">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ attendanceStats.present }}</div>
                  <div class="stat-label">出勤</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon late">
                  <el-icon><Clock /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ attendanceStats.late }}</div>
                  <div class="stat-label">迟到</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon absent">
                  <el-icon><Close /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ attendanceStats.absent }}</div>
                  <div class="stat-label">缺勤</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon leave">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ attendanceStats.leave }}</div>
                  <div class="stat-label">请假</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <!-- 操作按钮区域 -->
      <el-col :span="8">
        <el-card class="action-card">
          <div class="action-buttons">
            <el-button type="primary" @click="handleAddAttendance">
              <el-icon><Plus /></el-icon>
              记录出勤
            </el-button>
            <el-button type="success" @click="handleBatchRecord">
              <el-icon><Edit /></el-icon>
              批量记录
            </el-button>
            <el-button type="warning" @click="handleAttendanceAnalysis">
              <el-icon><TrendCharts /></el-icon>
              出勤分析
            </el-button>
            <el-button type="info" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出记录
            </el-button>
          </div>
        </el-card>
      </el-col>
      

    </el-row>

    <!-- 出勤记录列表 -->
    <el-card class="table-card">
      <el-table
        :data="attendanceList"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="studentId" label="学号" min-width="110" />
        <el-table-column prop="studentName" label="姓名" min-width="80" />
        <el-table-column prop="className" label="班级" min-width="110" />
        <el-table-column prop="courseName" label="课程名称" min-width="130" show-overflow-tooltip />
        <el-table-column prop="attendanceDate" label="日期" min-width="110" />
        <el-table-column prop="classTime" label="上课时间" min-width="130" />
        <el-table-column prop="attendanceStatus" label="出勤状态" min-width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getAttendanceStatusType(row.attendanceStatus)">
              {{ row.attendanceStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkInTime" label="签到时间" min-width="130" />
        <el-table-column prop="checkOutTime" label="签退时间" min-width="130" />
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
        <el-table-column prop="teacherName" label="任课教师" min-width="110" />
        <el-table-column label="操作" min-width="240" fixed="right">
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

    <!-- 添加/编辑出勤记录对话框 -->
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
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出勤日期" prop="attendanceDate">
              <el-date-picker
                v-model="form.attendanceDate"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出勤状态" prop="attendanceStatus">
              <el-select v-model="form.attendanceStatus" placeholder="请选择状态" style="width: 100%">
                <el-option label="出勤" value="出勤" />
                <el-option label="迟到" value="迟到" />
                <el-option label="早退" value="早退" />
                <el-option label="请假" value="请假" />
                <el-option label="缺勤" value="缺勤" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="签到时间" prop="checkInTime">
              <el-time-picker
                v-model="form.checkInTime"
                placeholder="选择签到时间"
                style="width: 100%"
                format="HH:mm"
                value-format="HH:mm"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签退时间" prop="checkOutTime">
              <el-time-picker
                v-model="form.checkOutTime"
                placeholder="选择签退时间"
                style="width: 100%"
                format="HH:mm"
                value-format="HH:mm"
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

    <!-- 出勤分析对话框 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="出勤分析"
      width="800px"
    >
      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">出勤率</div>
                <div class="analysis-value">{{ analysisData.attendanceRate }}%</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">迟到率</div>
                <div class="analysis-value">{{ analysisData.lateRate }}%</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">缺勤率</div>
                <div class="analysis-value">{{ analysisData.absentRate }}%</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">请假率</div>
                <div class="analysis-value">{{ analysisData.leaveRate }}%</div>
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
  TrendCharts,
  Check,
  Clock,
  Close,
  Document
} from '@element-plus/icons-vue'

export default {
  name: 'AttendanceManagement',
  components: {
    Search,
    Refresh,
    Plus,
    Edit,
    Download,
    View,
    Delete,
    TrendCharts,
    Check,
    Clock,
    Close,
    Document
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
      className: '',
      attendanceStatus: '',
      dateRange: []
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
      className: '',
      attendanceDate: '',
      attendanceStatus: '',
      checkInTime: '',
      checkOutTime: '',
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
      className: [
        { required: true, message: '请选择班级', trigger: 'change' }
      ],
      attendanceDate: [
        { required: true, message: '请选择出勤日期', trigger: 'change' }
      ],
      attendanceStatus: [
        { required: true, message: '请选择出勤状态', trigger: 'change' }
      ]
    }

    // 出勤统计
    const attendanceStats = reactive({
      present: 23,
      late: 4,
      absent: 3,
      leave: 3
    })

    // 出勤记录列表数据
    const attendanceList = ref([
      {
        studentId: '2021001',
        studentName: '张三',
        className: '一年级1班',
        courseName: '数据结构',
        attendanceDate: '2024-01-15',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:55',
        checkOutTime: '10:05',
        remark: '',
        teacherName: '张老师'
      },
      {
        studentId: '2021002',
        studentName: '李四',
        className: '一年级1班',
        courseName: '数据结构',
        attendanceDate: '2024-01-15',
        classTime: '08:00-10:00',
        attendanceStatus: '迟到',
        checkInTime: '08:15',
        checkOutTime: '10:00',
        remark: '交通堵塞',
        teacherName: '张老师'
      },
      {
        studentId: '2021003',
        studentName: '王五',
        className: '一年级2班',
        courseName: '算法设计',
        attendanceDate: '2024-01-15',
        classTime: '10:00-12:00',
        attendanceStatus: '请假',
        checkInTime: '',
        checkOutTime: '',
        remark: '病假',
        teacherName: '李老师'
      },
      {
        studentId: '2021004',
        studentName: '赵六',
        className: '一年级1班',
        courseName: '数据库原理',
        attendanceDate: '2024-01-16',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:58',
        checkOutTime: '10:03',
        remark: '',
        teacherName: '王老师'
      },
      {
        studentId: '2021005',
        studentName: '钱七',
        className: '一年级2班',
        courseName: '算法设计',
        attendanceDate: '2024-01-16',
        classTime: '10:00-12:00',
        attendanceStatus: '出勤',
        checkInTime: '09:58',
        checkOutTime: '12:02',
        remark: '',
        teacherName: '李老师'
      },
      {
        studentId: '2021006',
        studentName: '孙八',
        className: '一年级2班',
        courseName: '软件工程',
        attendanceDate: '2024-01-16',
        classTime: '14:00-16:00',
        attendanceStatus: '缺勤',
        checkInTime: '',
        checkOutTime: '',
        remark: '未到',
        teacherName: '赵老师'
      },
      {
        studentId: '2021007',
        studentName: '周九',
        className: '一年级1班',
        courseName: '计算机网络',
        attendanceDate: '2024-01-17',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:52',
        checkOutTime: '10:05',
        remark: '',
        teacherName: '刘老师'
      },
      {
        studentId: '2021008',
        studentName: '吴十',
        className: '一年级1班',
        courseName: '数据结构',
        attendanceDate: '2024-01-17',
        classTime: '14:00-16:00',
        attendanceStatus: '迟到',
        checkInTime: '14:08',
        checkOutTime: '16:00',
        remark: '睡过头',
        teacherName: '张老师'
      },
      {
        studentId: '2022001',
        studentName: '郑十一',
        className: '二年级1班',
        courseName: '算法设计',
        attendanceDate: '2024-01-18',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:56',
        checkOutTime: '10:04',
        remark: '',
        teacherName: '李老师'
      },
      {
        studentId: '2022002',
        studentName: '王十二',
        className: '二年级2班',
        courseName: '数据库原理',
        attendanceDate: '2024-01-18',
        classTime: '10:00-12:00',
        attendanceStatus: '请假',
        checkInTime: '',
        checkOutTime: '',
        remark: '事假',
        teacherName: '王老师'
      },
      {
        studentId: '2022003',
        studentName: '冯十三',
        className: '二年级1班',
        courseName: '软件工程',
        attendanceDate: '2024-01-18',
        classTime: '14:00-16:00',
        attendanceStatus: '早退',
        checkInTime: '13:58',
        checkOutTime: '15:20',
        remark: '家中有事',
        teacherName: '赵老师'
      },
      {
        studentId: '2022004',
        studentName: '陈十四',
        className: '二年级2班',
        courseName: '计算机网络',
        attendanceDate: '2024-01-19',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:55',
        checkOutTime: '10:03',
        remark: '',
        teacherName: '刘老师'
      },
      {
        studentId: '2022005',
        studentName: '褚十五',
        className: '二年级1班',
        courseName: '数据结构',
        attendanceDate: '2024-01-19',
        classTime: '10:00-12:00',
        attendanceStatus: '出勤',
        checkInTime: '09:58',
        checkOutTime: '12:05',
        remark: '',
        teacherName: '张老师'
      },
      {
        studentId: '2023001',
        studentName: '卫十六',
        className: '三年级1班',
        courseName: '算法设计',
        attendanceDate: '2024-01-20',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:53',
        checkOutTime: '10:04',
        remark: '',
        teacherName: '李老师'
      },
      {
        studentId: '2023002',
        studentName: '蒋十七',
        className: '三年级2班',
        courseName: '数据库原理',
        attendanceDate: '2024-01-20',
        classTime: '10:00-12:00',
        attendanceStatus: '缺勤',
        checkInTime: '',
        checkOutTime: '',
        remark: '旷课',
        teacherName: '王老师'
      },
      {
        studentId: '2023003',
        studentName: '沈十八',
        className: '三年级1班',
        courseName: '软件工程',
        attendanceDate: '2024-01-20',
        classTime: '14:00-16:00',
        attendanceStatus: '请假',
        checkInTime: '',
        checkOutTime: '',
        remark: '病假',
        teacherName: '赵老师'
      },
      {
        studentId: '2023004',
        studentName: '韩十九',
        className: '三年级2班',
        courseName: '计算机网络',
        attendanceDate: '2024-01-21',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:54',
        checkOutTime: '10:03',
        remark: '',
        teacherName: '刘老师'
      },
      {
        studentId: '2023005',
        studentName: '杨二十',
        className: '三年级1班',
        courseName: '数据结构',
        attendanceDate: '2024-01-21',
        classTime: '10:00-12:00',
        attendanceStatus: '迟到',
        checkInTime: '10:12',
        checkOutTime: '12:00',
        remark: '地铁延误',
        teacherName: '张老师'
      },
      {
        studentId: '2021009',
        studentName: '朱二十一',
        className: '一年级2班',
        courseName: '数据结构',
        attendanceDate: '2024-01-22',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:57',
        checkOutTime: '10:02',
        remark: '',
        teacherName: '张老师'
      },
      {
        studentId: '2022006',
        studentName: '秦二十二',
        className: '二年级2班',
        courseName: '算法设计',
        attendanceDate: '2024-01-22',
        classTime: '10:00-12:00',
        attendanceStatus: '出勤',
        checkInTime: '09:59',
        checkOutTime: '12:04',
        remark: '',
        teacherName: '李老师'
      },
      {
        studentId: '2022007',
        studentName: '尤二十三',
        className: '二年级1班',
        courseName: '数据库原理',
        attendanceDate: '2024-01-22',
        classTime: '14:00-16:00',
        attendanceStatus: '出勤',
        checkInTime: '13:58',
        checkOutTime: '16:03',
        remark: '',
        teacherName: '王老师'
      },
      {
        studentId: '2023006',
        studentName: '许二十四',
        className: '三年级2班',
        courseName: '软件工程',
        attendanceDate: '2024-01-23',
        classTime: '08:00-10:00',
        attendanceStatus: '早退',
        checkInTime: '07:55',
        checkOutTime: '09:30',
        remark: '身体不适',
        teacherName: '赵老师'
      },
      {
        studentId: '2023007',
        studentName: '何二十五',
        className: '三年级1班',
        courseName: '计算机网络',
        attendanceDate: '2024-01-23',
        classTime: '10:00-12:00',
        attendanceStatus: '出勤',
        checkInTime: '09:57',
        checkOutTime: '12:02',
        remark: '',
        teacherName: '刘老师'
      },
      {
        studentId: '2021010',
        studentName: '吕二十六',
        className: '一年级2班',
        courseName: '算法设计',
        attendanceDate: '2024-01-23',
        classTime: '14:00-16:00',
        attendanceStatus: '出勤',
        checkInTime: '13:58',
        checkOutTime: '16:01',
        remark: '',
        teacherName: '李老师'
      },
      {
        studentId: '2021011',
        studentName: '施二十七',
        className: '一年级1班',
        courseName: '数据库原理',
        attendanceDate: '2024-01-24',
        classTime: '08:00-10:00',
        attendanceStatus: '请假',
        checkInTime: '',
        checkOutTime: '',
        remark: '病假',
        teacherName: '王老师'
      },
      {
        studentId: '2022008',
        studentName: '张二十八',
        className: '二年级1班',
        courseName: '计算机网络',
        attendanceDate: '2024-01-24',
        classTime: '10:00-12:00',
        attendanceStatus: '出勤',
        checkInTime: '09:59',
        checkOutTime: '12:03',
        remark: '',
        teacherName: '刘老师'
      },
      {
        studentId: '2023008',
        studentName: '孔二十九',
        className: '三年级2班',
        courseName: '数据结构',
        attendanceDate: '2024-01-24',
        classTime: '14:00-16:00',
        attendanceStatus: '出勤',
        checkInTime: '13:57',
        checkOutTime: '16:04',
        remark: '',
        teacherName: '张老师'
      },
      {
        studentId: '2023009',
        studentName: '曹三十',
        className: '三年级1班',
        courseName: '算法设计',
        attendanceDate: '2024-01-25',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:56',
        checkOutTime: '10:02',
        remark: '',
        teacherName: '李老师'
      },
      {
        studentId: '2021001',
        studentName: '张三',
        className: '一年级1班',
        courseName: '软件工程',
        attendanceDate: '2024-01-25',
        classTime: '10:00-12:00',
        attendanceStatus: '出勤',
        checkInTime: '09:58',
        checkOutTime: '12:05',
        remark: '',
        teacherName: '赵老师'
      },
      {
        studentId: '2021002',
        studentName: '李四',
        className: '一年级1班',
        courseName: '计算机网络',
        attendanceDate: '2024-01-25',
        classTime: '14:00-16:00',
        attendanceStatus: '出勤',
        checkInTime: '13:59',
        checkOutTime: '16:03',
        remark: '',
        teacherName: '刘老师'
      },
      {
        studentId: '2022001',
        studentName: '郑十一',
        className: '二年级1班',
        courseName: '数据结构',
        attendanceDate: '2024-01-15',
        classTime: '08:00-10:00',
        attendanceStatus: '出勤',
        checkInTime: '07:54',
        checkOutTime: '10:04',
        remark: '',
        teacherName: '张老师'
      },
      {
        studentId: '2022002',
        studentName: '王十二',
        className: '二年级2班',
        courseName: '算法设计',
        attendanceDate: '2024-01-15',
        classTime: '10:00-12:00',
        attendanceStatus: '迟到',
        checkInTime: '10:13',
        checkOutTime: '12:01',
        remark: '堵车',
        teacherName: '李老师'
      },
      {
        studentId: '2023001',
        studentName: '卫十六',
        className: '三年级1班',
        courseName: '数据库原理',
        attendanceDate: '2024-01-15',
        classTime: '14:00-16:00',
        attendanceStatus: '出勤',
        checkInTime: '13:57',
        checkOutTime: '16:02',
        remark: '',
        teacherName: '王老师'
      }
    ])

    // 分析数据
    const analysisData = reactive({
      attendanceRate: 69.7,
      lateRate: 12.1,
      absentRate: 9.1,
      leaveRate: 9.1
    })

    // 获取出勤状态类型
    const getAttendanceStatusType = (status) => {
      const statusMap = {
        '出勤': 'success',
        '迟到': 'warning',
        '早退': 'warning',
        '请假': 'info',
        '缺勤': 'danger'
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
      searchForm.dateRange = []
      handleSearch()
    }

    // 添加出勤记录
    const handleAddAttendance = () => {
      dialogTitle.value = '记录出勤'
      resetForm()
      dialogVisible.value = true
    }

    // 批量记录
    const handleBatchRecord = () => {
      if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要记录的学生')
        return
      }
      ElMessage.success(`开始批量记录 ${selectedRows.value.length} 个学生的出勤`)
    }

    // 出勤分析
    const handleAttendanceAnalysis = () => {
      analysisDialogVisible.value = true
    }

    // 导出记录
    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    // 编辑出勤记录
    const handleEdit = (row) => {
      dialogTitle.value = '编辑出勤记录'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    // 查看详情
    const handleViewDetail = (row) => {
      ElMessage.info(`查看出勤详情: ${row.studentName} - ${row.courseName}`)
    }

    // 删除出勤记录
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除学生 "${row.studentName}" 的出勤记录吗？`,
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
      if (formRef.value) {
        formRef.value.resetFields()
      }
    }

    // 提交表单
    const handleSubmit = () => {
      if (!formRef.value) return
      
      formRef.value.validate((valid) => {
        if (valid) {
          ElMessage.success('出勤记录保存成功')
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
      pagination.total = attendanceList.value.length
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
      attendanceStats,
      attendanceList,
      analysisData,
      getAttendanceStatusType,
      handleSearch,
      handleReset,
      handleAddAttendance,
      handleBatchRecord,
      handleAttendanceAnalysis,
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
.attendance-management {
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
  flex-direction: row;
  gap: 10px;
  margin-top: 30px;
  margin-bottom: 30px;
}

.action-buttons .el-button {
  width: 100%;
  justify-content: flex-start;
}

.action-stats-row {
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

.stat-icon.present {
  background: #e8f5e8;
  color: #67c23a;
}

.stat-icon.late {
  background: #fdf6ec;
  color: #e6a23c;
}

.stat-icon.absent {
  background: #fef0f0;
  color: #f56c6c;
}

.stat-icon.leave {
  background: #f4f4f5;
  color: #909399;
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
