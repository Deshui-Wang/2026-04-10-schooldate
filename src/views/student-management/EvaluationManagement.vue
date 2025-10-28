<template>
  <div class="evaluation-management">
    <div class="section-header">
      <h3>评价管理</h3>
      <p>管理学生综合评价、教师评价和学生自评</p>
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
        <el-form-item label="评价类型">
          <el-select v-model="searchForm.evaluationType" placeholder="请选择评价类型" clearable>
            <el-option label="学期评价" value="学期评价" />
            <el-option label="课程评价" value="课程评价" />
            <el-option label="综合表现评价" value="综合表现评价" />
            <el-option label="实习评价" value="实习评价" />
            <el-option label="毕业评价" value="毕业评价" />
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
        <el-form-item label="评价状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待评价" value="待评价" />
            <el-option label="已评价" value="已评价" />
            <el-option label="已确认" value="已确认" />
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

    <!-- 操作按钮和评价统计卡片 -->
    <el-row :gutter="20" class="action-stats-row">
      <!-- 评价统计卡片区域 -->
      <el-col :span="16">
        <el-row :gutter="15">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon pending">
                  <el-icon><Clock /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ evaluationStats.pending }}</div>
                  <div class="stat-label">待评价</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon completed">
                  <el-icon><Check /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ evaluationStats.completed }}</div>
                  <div class="stat-label">已评价</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon confirmed">
                  <el-icon><CircleCheck /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ evaluationStats.confirmed }}</div>
                  <div class="stat-label">已确认</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon total">
                  <el-icon><Document /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ evaluationStats.total }}</div>
                  <div class="stat-label">总评价数</div>
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
            <el-button type="primary" @click="handleCreateEvaluation">
              <el-icon><Plus /></el-icon>
              创建评价
            </el-button>
            <el-button type="success" @click="handleBatchEvaluation">
              <el-icon><Edit /></el-icon>
              批量评价
            </el-button>
            <el-button type="warning" @click="handleEvaluationAnalysis">
              <el-icon><TrendCharts /></el-icon>
              评价分析
            </el-button>
            <el-button type="info" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出报告
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 评价列表 -->
    <el-card class="table-card">
      <el-table
        :data="evaluationList"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="studentId" label="学号" min-width="110" />
        <el-table-column prop="studentName" label="姓名" min-width="90" />
        <el-table-column prop="className" label="班级" min-width="110" />
        <el-table-column prop="evaluationType" label="评价类型" min-width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getEvaluationTypeColor(row.evaluationType)">
              {{ row.evaluationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="evaluationPeriod" label="评价周期" min-width="140" show-overflow-tooltip />
        <el-table-column prop="overallScore" label="综合得分" min-width="90" align="center">
          <template #default="{ row }">
            <span :class="getScoreClass(row.overallScore)">{{ row.overallScore }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="gradeLevel" label="等级" min-width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getGradeLevelType(row.gradeLevel)">{{ row.gradeLevel }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="evaluator" label="评价人" min-width="110" />
        <el-table-column prop="evaluationDate" label="评价日期" min-width="110" />
        <el-table-column prop="status" label="状态" min-width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="operation-buttons">
              <el-button type="primary" size="small" @click="handleView(row)">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button type="success" size="small" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button type="warning" size="small" @click="handleConfirm(row)">
                <el-icon><CircleCheck /></el-icon>
                确认
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

    <!-- 创建/编辑评价对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      :before-close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
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
            <el-form-item label="评价类型" prop="evaluationType">
              <el-select v-model="form.evaluationType" placeholder="请选择评价类型" style="width: 100%">
                <el-option label="学期评价" value="学期评价" />
                <el-option label="课程评价" value="课程评价" />
                <el-option label="综合表现评价" value="综合表现评价" />
                <el-option label="实习评价" value="实习评价" />
                <el-option label="毕业评价" value="毕业评价" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="评价周期" prop="evaluationPeriod">
          <el-input v-model="form.evaluationPeriod" placeholder="请输入评价周期" />
        </el-form-item>
        
        <!-- 评价维度 -->
        <el-divider content-position="left">评价维度</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="学习态度" prop="learningAttitude">
              <el-rate v-model="form.learningAttitude" :max="5" show-text />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课堂表现" prop="classroomPerformance">
              <el-rate v-model="form.classroomPerformance" :max="5" show-text />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业质量" prop="homeworkQuality">
              <el-rate v-model="form.homeworkQuality" :max="5" show-text />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="团队合作" prop="teamwork">
              <el-rate v-model="form.teamwork" :max="5" show-text />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创新能力" prop="innovation">
              <el-rate v-model="form.innovation" :max="5" show-text />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实践能力" prop="practicalAbility">
              <el-rate v-model="form.practicalAbility" :max="5" show-text />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="综合评价" prop="overallComment">
          <el-input
            v-model="form.overallComment"
            type="textarea"
            :rows="4"
            placeholder="请输入综合评价内容"
          />
        </el-form-item>
        <el-form-item label="改进建议" prop="improvementSuggestions">
          <el-input
            v-model="form.improvementSuggestions"
            type="textarea"
            :rows="3"
            placeholder="请输入改进建议"
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

    <!-- 评价分析对话框 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="评价分析"
      width="800px"
    >
      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">平均得分</div>
                <div class="analysis-value">{{ analysisData.avgScore }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">优秀率</div>
                <div class="analysis-value">{{ analysisData.excellentRate }}%</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">良好率</div>
                <div class="analysis-value">{{ analysisData.goodRate }}%</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">待改进率</div>
                <div class="analysis-value">{{ analysisData.improvementRate }}%</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
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
  Clock,
  Check,
  CircleCheck,
  Document
} from '@element-plus/icons-vue'

export default {
  name: 'EvaluationManagement',
  components: {
    Search,
    Refresh,
    Plus,
    Edit,
    Download,
    View,
    Delete,
    TrendCharts,
    Clock,
    Check,
    CircleCheck,
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
      evaluationType: '',
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
      studentId: '',
      studentName: '',
      className: '',
      evaluationType: '',
      evaluationPeriod: '',
      learningAttitude: 0,
      classroomPerformance: 0,
      homeworkQuality: 0,
      teamwork: 0,
      innovation: 0,
      practicalAbility: 0,
      overallComment: '',
      improvementSuggestions: ''
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
      evaluationType: [
        { required: true, message: '请选择评价类型', trigger: 'change' }
      ],
      evaluationPeriod: [
        { required: true, message: '请输入评价周期', trigger: 'blur' }
      ]
    }

    // 评价统计
    const evaluationStats = reactive({
      pending: 15,
      completed: 20,
      confirmed: 15,
      total: 50
    })

    // 评价列表数据
    const evaluationList = ref([
      { studentId: '2021001', studentName: '张三', className: '一年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 85, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-09-15', status: '已评价' },
      { studentId: '2021002', studentName: '李四', className: '一年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 92, gradeLevel: 'A', evaluator: '张老师', evaluationDate: '2024-09-15', status: '已确认' },
      { studentId: '2021003', studentName: '王五', className: '一年级2班', evaluationType: '课程评价', evaluationPeriod: '数据结构课程', overallScore: 78, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-10-10', status: '待评价' },
      { studentId: '2021004', studentName: '赵六', className: '一年级2班', evaluationType: '综合表现评价', evaluationPeriod: '2024年3月', overallScore: 88, gradeLevel: 'B', evaluator: '王老师', evaluationDate: '2024-03-20', status: '已确认' },
      { studentId: '2021005', studentName: '陈七', className: '二年级1班', evaluationType: '学期评价', evaluationPeriod: '2023-2024学年第二学期', overallScore: 91, gradeLevel: 'A', evaluator: '刘老师', evaluationDate: '2024-07-05', status: '已确认' },
      { studentId: '2021006', studentName: '周八', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '算法设计课程', overallScore: 83, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-11-05', status: '已评价' },
      { studentId: '2021007', studentName: '吴九', className: '一年级2班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 76, gradeLevel: 'C', evaluator: '王老师', evaluationDate: '2024-09-20', status: '待评价' },
      { studentId: '2021008', studentName: '郑十', className: '三年级1班', evaluationType: '实习评价', evaluationPeriod: '2024年暑期实习', overallScore: 89, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-08-25', status: '已确认' },
      { studentId: '2021009', studentName: '孙十一', className: '二年级1班', evaluationType: '综合表现评价', evaluationPeriod: '2024年4月', overallScore: 94, gradeLevel: 'A', evaluator: '刘老师', evaluationDate: '2024-04-15', status: '已确认' },
      { studentId: '2021010', studentName: '黄十二', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '操作系统课程', overallScore: 80, gradeLevel: 'B', evaluator: '陈老师', evaluationDate: '2024-10-20', status: '已评价' },
      { studentId: '2021011', studentName: '林十三', className: '一年级2班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 87, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-09-18', status: '待评价' },
      { studentId: '2021012', studentName: '吴十四', className: '三年级2班', evaluationType: '毕业评价', evaluationPeriod: '2024-2025学年毕业评价', overallScore: 85, gradeLevel: 'B', evaluator: '赵老师', evaluationDate: '2024-12-01', status: '待评价' },
      { studentId: '2021013', studentName: '钱十五', className: '二年级1班', evaluationType: '实习评价', evaluationPeriod: '2024年春季实习', overallScore: 90, gradeLevel: 'A', evaluator: '王老师', evaluationDate: '2024-05-30', status: '已确认' },
      { studentId: '2021014', studentName: '许十六', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '计算机网络课程', overallScore: 82, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-11-10', status: '已评价' },
      { studentId: '2021015', studentName: '马十七', className: '二年级2班', evaluationType: '学期评价', evaluationPeriod: '2023-2024学年第一学期', overallScore: 86, gradeLevel: 'B', evaluator: '刘老师', evaluationDate: '2024-01-15', status: '已确认' },
      { studentId: '2021016', studentName: '朱十八', className: '一年级2班', evaluationType: '综合表现评价', evaluationPeriod: '2024年2月', overallScore: 79, gradeLevel: 'C', evaluator: '李老师', evaluationDate: '2024-02-28', status: '待评价' },
      { studentId: '2021017', studentName: '胡十九', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '数据库原理课程', overallScore: 91, gradeLevel: 'A', evaluator: '陈老师', evaluationDate: '2024-10-25', status: '已评价' },
      { studentId: '2021018', studentName: '冯二十', className: '二年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 88, gradeLevel: 'B', evaluator: '王老师', evaluationDate: '2024-09-25', status: '待评价' },
      { studentId: '2021019', studentName: '彭二一', className: '三年级1班', evaluationType: '实习评价', evaluationPeriod: '2024年秋季实习', overallScore: 87, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-11-20', status: '已确认' },
      { studentId: '2021020', studentName: '蒋二二', className: '一年级2班', evaluationType: '课程评价', evaluationPeriod: '软件工程课程', overallScore: 84, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-11-05', status: '已评价' },
      { studentId: '2021021', studentName: '韩二三', className: '一年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 93, gradeLevel: 'A', evaluator: '刘老师', evaluationDate: '2024-09-30', status: '已确认' },
      { studentId: '2021022', studentName: '唐二四', className: '二年级2班', evaluationType: '综合表现评价', evaluationPeriod: '2024年5月', overallScore: 81, gradeLevel: 'B', evaluator: '陈老师', evaluationDate: '2024-05-20', status: '待评价' },
      { studentId: '2021023', studentName: '梁二五', className: '三年级2班', evaluationType: '毕业评价', evaluationPeriod: '2024-2025学年毕业评价', overallScore: 90, gradeLevel: 'A', evaluator: '赵老师', evaluationDate: '2024-12-05', status: '待评价' },
      { studentId: '2021024', studentName: '袁二六', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '程序设计基础课程', overallScore: 77, gradeLevel: 'C', evaluator: '张老师', evaluationDate: '2024-10-10', status: '已评价' },
      { studentId: '2021025', studentName: '于二七', className: '二年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 89, gradeLevel: 'B', evaluator: '王老师', evaluationDate: '2024-09-28', status: '待评价' },
      { studentId: '2021026', studentName: '徐二八', className: '一年级2班', evaluationType: '实习评价', evaluationPeriod: '2024年寒假实习', overallScore: 86, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-03-01', status: '已确认' },
      { studentId: '2021027', studentName: '薛二九', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '计算机组成原理课程', overallScore: 92, gradeLevel: 'A', evaluator: '陈老师', evaluationDate: '2024-11-15', status: '已确认' },
      { studentId: '2021030', studentName: '叶三十', className: '三年级1班', evaluationType: '学期评价', evaluationPeriod: '2023-2024学年第二学期', overallScore: 85, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-07-10', status: '已评价' },
      { studentId: '2021031', studentName: '叶三一', className: '一年级2班', evaluationType: '综合表现评价', evaluationPeriod: '2024年6月', overallScore: 83, gradeLevel: 'B', evaluator: '刘老师', evaluationDate: '2024-06-20', status: '已评价' },
      { studentId: '2021032', studentName: '张四五', className: '二年级2班', evaluationType: '课程评价', evaluationPeriod: '人工智能课程', overallScore: 88, gradeLevel: 'B', evaluator: '王老师', evaluationDate: '2024-11-20', status: '已评价' },
      { studentId: '2021033', studentName: '李五六', className: '一年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 90, gradeLevel: 'A', evaluator: '李老师', evaluationDate: '2024-10-05', status: '已确认' },
      { studentId: '2021034', studentName: '王六七', className: '一年级2班', evaluationType: '实习评价', evaluationPeriod: '2024年暑期实习', overallScore: 84, gradeLevel: 'B', evaluator: '陈老师', evaluationDate: '2024-08-15', status: '待评价' },
      { studentId: '2021035', studentName: '刘七八', className: '三年级2班', evaluationType: '毕业评价', evaluationPeriod: '2024-2025学年毕业评价', overallScore: 87, gradeLevel: 'B', evaluator: '赵老师', evaluationDate: '2024-12-10', status: '待评价' },
      { studentId: '2021036', studentName: '陈八九', className: '二年级1班', evaluationType: '课程评价', evaluationPeriod: '编译原理课程', overallScore: 81, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-10-30', status: '已评价' },
      { studentId: '2021037', studentName: '杨九一', className: '一年级1班', evaluationType: '综合表现评价', evaluationPeriod: '2024年7月', overallScore: 95, gradeLevel: 'A', evaluator: '王老师', evaluationDate: '2024-07-25', status: '已确认' },
      { studentId: '2021038', studentName: '黄九二', className: '一年级2班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 82, gradeLevel: 'B', evaluator: '刘老师', evaluationDate: '2024-09-22', status: '待评价' },
      { studentId: '2021039', studentName: '周九三', className: '二年级2班', evaluationType: '实习评价', evaluationPeriod: '2024年秋季实习', overallScore: 89, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-11-28', status: '已评价' },
      { studentId: '2021040', studentName: '吴九四', className: '一年级1班', evaluationType: '课程评价', evaluationPeriod: '移动应用开发课程', overallScore: 86, gradeLevel: 'B', evaluator: '陈老师', evaluationDate: '2024-11-12', status: '已评价' },
      { studentId: '2021041', studentName: '郑九五', className: '三年级1班', evaluationType: '学期评价', evaluationPeriod: '2023-2024学年第一学期', overallScore: 88, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-01-20', status: '已确认' },
      { studentId: '2021042', studentName: '孙九六', className: '一年级2班', evaluationType: '综合表现评价', evaluationPeriod: '2024年8月', overallScore: 79, gradeLevel: 'C', evaluator: '王老师', evaluationDate: '2024-08-30', status: '待评价' },
      { studentId: '2021043', studentName: '张七一', className: '二年级1班', evaluationType: '课程评价', evaluationPeriod: 'Web开发技术课程', overallScore: 91, gradeLevel: 'A', evaluator: '刘老师', evaluationDate: '2024-10-28', status: '已确认' },
      { studentId: '2021044', studentName: '李七二', className: '一年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 93, gradeLevel: 'A', evaluator: '李老师', evaluationDate: '2024-10-02', status: '待评价' },
      { studentId: '2021045', studentName: '王七三', className: '三年级2班', evaluationType: '毕业评价', evaluationPeriod: '2024-2025学年毕业评价', overallScore: 85, gradeLevel: 'B', evaluator: '赵老师', evaluationDate: '2024-12-12', status: '待评价' },
      { studentId: '2021046', studentName: '刘七四', className: '一年级2班', evaluationType: '实习评价', evaluationPeriod: '2024年春季实习', overallScore: 87, gradeLevel: 'B', evaluator: '陈老师', evaluationDate: '2024-06-01', status: '已评价' },
      { studentId: '2021047', studentName: '陈七五', className: '二年级2班', evaluationType: '课程评价', evaluationPeriod: '信息安全课程', overallScore: 83, gradeLevel: 'B', evaluator: '张老师', evaluationDate: '2024-11-08', status: '已评价' },
      { studentId: '2021048', studentName: '杨七六', className: '一年级1班', evaluationType: '学期评价', evaluationPeriod: '2024-2025学年第一学期', overallScore: 94, gradeLevel: 'A', evaluator: '王老师', evaluationDate: '2024-09-27', status: '已确认' },
      { studentId: '2021049', studentName: '黄七七', className: '二年级1班', evaluationType: '综合表现评价', evaluationPeriod: '2024年9月', overallScore: 81, gradeLevel: 'B', evaluator: '刘老师', evaluationDate: '2024-09-30', status: '已评价' },
      { studentId: '2021050', studentName: '周七八', className: '一年级2班', evaluationType: '课程评价', evaluationPeriod: '云计算技术课程', overallScore: 89, gradeLevel: 'B', evaluator: '李老师', evaluationDate: '2024-11-25', status: '待评价' }
    ])

    // 分析数据
    const analysisData = reactive({
      avgScore: 86.2,
      excellentRate: 22.0,
      goodRate: 62.0,
      improvementRate: 16.0
    })

    // 计算综合得分
    const overallScore = computed(() => {
      const scores = [
        form.learningAttitude,
        form.classroomPerformance,
        form.homeworkQuality,
        form.teamwork,
        form.innovation,
        form.practicalAbility
      ]
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
      return Math.round(avgScore * 20) // 转换为100分制
    })

    // 获取评价类型颜色
    const getEvaluationTypeColor = (type) => {
      const colorMap = {
        '学期评价': 'primary',
        '课程评价': 'success',
        '综合表现评价': 'warning',
        '实习评价': 'info',
        '毕业评价': 'danger'
      }
      return colorMap[type] || 'info'
    }

    // 获取等级类型
    const getGradeLevelType = (level) => {
      const levelMap = {
        'A': 'success',
        'B': 'primary',
        'C': 'warning',
        'D': 'danger'
      }
      return levelMap[level] || 'info'
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '待评价': 'warning',
        '已评价': 'primary',
        '已确认': 'success'
      }
      return statusMap[status] || 'info'
    }

    // 获取得分样式类
    const getScoreClass = (score) => {
      if (score >= 90) return 'score-excellent'
      if (score >= 80) return 'score-good'
      if (score >= 70) return 'score-average'
      if (score >= 60) return 'score-pass'
      return 'score-fail'
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

    // 创建评价
    const handleCreateEvaluation = () => {
      dialogTitle.value = '创建评价'
      resetForm()
      dialogVisible.value = true
    }

    // 批量评价
    const handleBatchEvaluation = () => {
      if (selectedRows.value.length === 0) {
        ElMessage.warning('请选择要评价的学生')
        return
      }
      ElMessage.success(`开始批量评价 ${selectedRows.value.length} 个学生`)
    }

    // 评价分析
    const handleEvaluationAnalysis = () => {
      analysisDialogVisible.value = true
    }

    // 导出报告
    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    // 查看评价
    const handleView = (row) => {
      ElMessage.info(`查看评价: ${row.studentName} - ${row.evaluationType}`)
    }

    // 编辑评价
    const handleEdit = (row) => {
      dialogTitle.value = '编辑评价'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    // 确认评价
    const handleConfirm = (row) => {
      ElMessageBox.confirm(
        `确定要确认评价 "${row.studentName}" 的评价结果吗？`,
        '确认评价',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('评价确认成功')
      }).catch(() => {
        ElMessage.info('已取消确认')
      })
    }

    // 删除评价
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除评价 "${row.studentName}" 的评价记录吗？`,
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
        if (key.includes('Score') || key.includes('Rate')) {
          form[key] = 0
        } else {
          form[key] = ''
        }
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
          ElMessage.success('评价保存成功')
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
      pagination.total = evaluationList.value.length
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
      evaluationStats,
      evaluationList,
      analysisData,
      overallScore,
      getEvaluationTypeColor,
      getGradeLevelType,
      getStatusType,
      getScoreClass,
      handleSearch,
      handleReset,
      handleCreateEvaluation,
      handleBatchEvaluation,
      handleEvaluationAnalysis,
      handleExport,
      handleView,
      handleEdit,
      handleConfirm,
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
.evaluation-management {
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

.stats-row {
  margin-bottom: 0;
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

.stat-icon.pending {
  background: #fdf6ec;
  color: #e6a23c;
}

.stat-icon.completed {
  background: #e8f4fd;
  color: #409eff;
}

.stat-icon.confirmed {
  background: #e8f5e8;
  color: #67c23a;
}

.stat-icon.total {
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

/* 得分样式 */
.score-excellent {
  color: #67c23a;
  font-weight: 600;
}

.score-good {
  color: #409eff;
  font-weight: 600;
}

.score-average {
  color: #e6a23c;
  font-weight: 600;
}

.score-pass {
  color: #909399;
  font-weight: 600;
}

.score-fail {
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
