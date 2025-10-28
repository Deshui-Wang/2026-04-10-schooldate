<template>
  <div class="classroom-interaction">
    <div class="section-header">
      <h3>课堂互动</h3>
      <p>管理课堂互动活动、讨论和参与度统计</p>
    </div>

    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="课程名称">
          <el-input v-model="searchForm.courseName" placeholder="请输入课程名称" clearable />
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
        <el-form-item label="活动类型">
          <el-select v-model="searchForm.activityType" placeholder="请选择活动类型" clearable>
            <el-option label="课堂讨论" value="课堂讨论" />
            <el-option label="小组合作" value="小组合作" />
            <el-option label="问答互动" value="问答互动" />
            <el-option label="实验操作" value="实验操作" />
            <el-option label="案例分析" value="案例分析" />
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

    <!-- 操作按钮和互动统计合并区域 -->
    <el-row :gutter="20" class="action-stats-row">
      <!-- 互动统计卡片区域 -->
      <el-col :span="16">
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon discussion">
                  <el-icon><ChatDotRound /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ interactionStats.discussions }}</div>
                  <div class="stat-label">讨论次数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon participation">
                  <el-icon><User /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ interactionStats.participants }}</div>
                  <div class="stat-label">参与人数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon questions">
                  <el-icon><QuestionFilled /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ interactionStats.questions }}</div>
                  <div class="stat-label">提问次数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <div class="stat-icon answers">
                  <el-icon><ChatLineRound /></el-icon>
                </div>
                <div class="stat-info">
                  <div class="stat-value">{{ interactionStats.answers }}</div>
                  <div class="stat-label">回答次数</div>
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
            <el-button type="primary" @click="handleCreateActivity">
              <el-icon><Plus /></el-icon>
              创建活动
            </el-button>
            <el-button type="success" @click="handleStartDiscussion">
              <el-icon><ChatDotRound /></el-icon>
              发起讨论
            </el-button>
            <el-button type="warning" @click="handleParticipationAnalysis">
              <el-icon><TrendCharts /></el-icon>
              参与度分析
            </el-button>
            <el-button type="info" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出数据
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 互动活动列表 -->
    <el-card class="table-card">
      <el-table
        :data="interactionList"
        v-loading="loading"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="activityId" label="活动ID" min-width="90" />
        <el-table-column prop="courseName" label="课程名称" min-width="130" show-overflow-tooltip />
        <el-table-column prop="className" label="班级" min-width="110" />
        <el-table-column prop="activityType" label="活动类型" min-width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getActivityTypeColor(row.activityType)">
              {{ row.activityType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="activityTitle" label="活动标题" min-width="180" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" min-width="130" />
        <el-table-column prop="duration" label="持续时间" min-width="90" align="center" />
        <el-table-column prop="participantCount" label="参与人数" min-width="90" align="center" />
        <el-table-column prop="interactionCount" label="互动次数" min-width="90" align="center" />
        <el-table-column prop="teacherName" label="任课教师" min-width="110" />
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
              <el-button type="success" size="small" @click="handleJoin(row)">
                <el-icon><ChatDotRound /></el-icon>
                参与
              </el-button>
              <el-button type="warning" size="small" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
                编辑
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

    <!-- 创建活动对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
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
                <el-option label="二年级1班" value="二年级2班" />
                <el-option label="三年级1班" value="三年级1班" />
                <el-option label="三年级2班" value="三年级2班" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动类型" prop="activityType">
              <el-select v-model="form.activityType" placeholder="请选择活动类型" style="width: 100%">
                <el-option label="课堂讨论" value="课堂讨论" />
                <el-option label="小组合作" value="小组合作" />
                <el-option label="问答互动" value="问答互动" />
                <el-option label="实验操作" value="实验操作" />
                <el-option label="案例分析" value="案例分析" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="持续时间" prop="duration">
              <el-input-number
                v-model="form.duration"
                :min="10"
                :max="180"
                placeholder="分钟"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动标题" prop="activityTitle">
          <el-input v-model="form.activityTitle" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入活动描述和要求"
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="参与方式" prop="participationMode">
              <el-select v-model="form.participationMode" placeholder="请选择参与方式" style="width: 100%">
                <el-option label="全员参与" value="全员参与" />
                <el-option label="自愿参与" value="自愿参与" />
                <el-option label="分组参与" value="分组参与" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 参与度分析对话框 -->
    <el-dialog
      v-model="analysisDialogVisible"
      title="参与度分析"
      width="800px"
    >
      <div class="analysis-content">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">平均参与率</div>
                <div class="analysis-value">{{ analysisData.avgParticipationRate }}%</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">活跃学生数</div>
                <div class="analysis-value">{{ analysisData.activeStudents }}</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">互动频率</div>
                <div class="analysis-value">{{ analysisData.interactionFrequency }}</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="analysis-card">
              <div class="analysis-item">
                <div class="analysis-label">讨论深度</div>
                <div class="analysis-value">{{ analysisData.discussionDepth }}</div>
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
  ChatDotRound,
  User,
  QuestionFilled,
  ChatLineRound
} from '@element-plus/icons-vue'

export default {
  name: 'ClassroomInteraction',
  components: {
    Search,
    Refresh,
    Plus,
    Edit,
    Download,
    View,
    Delete,
    TrendCharts,
    ChatDotRound,
    User,
    QuestionFilled,
    ChatLineRound
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
      courseName: '',
      className: '',
      activityType: '',
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
      courseName: '',
      className: '',
      activityType: '',
      activityTitle: '',
      description: '',
      startTime: '',
      duration: 30,
      participationMode: ''
    })

    // 表单验证规则
    const rules = {
      courseName: [
        { required: true, message: '请选择课程名称', trigger: 'change' }
      ],
      className: [
        { required: true, message: '请选择班级', trigger: 'change' }
      ],
      activityType: [
        { required: true, message: '请选择活动类型', trigger: 'change' }
      ],
      activityTitle: [
        { required: true, message: '请输入活动标题', trigger: 'blur' }
      ],
      description: [
        { required: true, message: '请输入活动描述', trigger: 'blur' }
      ],
      startTime: [
        { required: true, message: '请选择开始时间', trigger: 'change' }
      ],
      duration: [
        { required: true, message: '请输入持续时间', trigger: 'blur' }
      ],
      participationMode: [
        { required: true, message: '请选择参与方式', trigger: 'change' }
      ]
    }

    // 互动统计
    const interactionStats = reactive({
      discussions: 45,
      participants: 128,
      questions: 67,
      answers: 89
    })

    // 互动活动列表数据
    const interactionList = ref([
      {
        activityId: 'ACT001',
        courseName: '数据结构',
        className: '一年级1班',
        activityType: '课堂讨论',
        activityTitle: '链表与数组的优缺点比较',
        startTime: '2024-01-15 08:00',
        duration: 30,
        participantCount: 28,
        interactionCount: 15,
        teacherName: '张老师',
        status: '进行中'
      },
      {
        activityId: 'ACT002',
        courseName: '算法设计',
        className: '二年级1班',
        activityType: '小组合作',
        activityTitle: '排序算法实现与优化',
        startTime: '2024-01-14 10:00',
        duration: 45,
        participantCount: 25,
        interactionCount: 22,
        teacherName: '李老师',
        status: '已完成'
      },
      {
        activityId: 'ACT003',
        courseName: '数据库原理',
        className: '三年级1班',
        activityType: '案例分析',
        activityTitle: '电商系统数据库设计',
        startTime: '2024-01-13 14:00',
        duration: 60,
        participantCount: 30,
        interactionCount: 18,
        teacherName: '王老师',
        status: '已完成'
      },
      {
        activityId: 'ACT004',
        courseName: '软件工程',
        className: '二年级2班',
        activityType: '问答互动',
        activityTitle: '需求分析实践演练',
        startTime: '2024-01-12 09:00',
        duration: 40,
        participantCount: 32,
        interactionCount: 28,
        teacherName: '赵老师',
        status: '已完成'
      },
      {
        activityId: 'ACT005',
        courseName: '计算机网络',
        className: '一年级2班',
        activityType: '课堂讨论',
        activityTitle: 'TCP/IP协议栈工作原理',
        startTime: '2024-01-11 14:00',
        duration: 35,
        participantCount: 27,
        interactionCount: 19,
        teacherName: '周老师',
        status: '已完成'
      },
      {
        activityId: 'ACT006',
        courseName: '算法设计',
        className: '三年级1班',
        activityType: '实验操作',
        activityTitle: '动态规划算法实现',
        startTime: '2024-01-10 10:00',
        duration: 50,
        participantCount: 29,
        interactionCount: 24,
        teacherName: '李老师',
        status: '已完成'
      },
      {
        activityId: 'ACT007',
        courseName: '数据结构',
        className: '二年级1班',
        activityType: '小组合作',
        activityTitle: '二叉树的遍历算法设计',
        startTime: '2024-01-09 08:30',
        duration: 45,
        participantCount: 26,
        interactionCount: 21,
        teacherName: '张老师',
        status: '已完成'
      },
      {
        activityId: 'ACT008',
        courseName: '软件工程',
        className: '三年级2班',
        activityType: '案例分析',
        activityTitle: '敏捷开发流程实践',
        startTime: '2024-01-16 09:00',
        duration: 55,
        participantCount: 30,
        interactionCount: 26,
        teacherName: '赵老师',
        status: '进行中'
      },
      {
        activityId: 'ACT009',
        courseName: '计算机网络',
        className: '三年级1班',
        activityType: '问答互动',
        activityTitle: 'HTTP协议深入解析',
        startTime: '2024-01-08 14:30',
        duration: 30,
        participantCount: 31,
        interactionCount: 17,
        teacherName: '周老师',
        status: '已完成'
      },
      {
        activityId: 'ACT010',
        courseName: '数据库原理',
        className: '一年级1班',
        activityType: '课堂讨论',
        activityTitle: 'SQL查询优化技巧',
        startTime: '2024-01-07 11:00',
        duration: 40,
        participantCount: 28,
        interactionCount: 16,
        teacherName: '王老师',
        status: '已完成'
      },
      {
        activityId: 'ACT011',
        courseName: '算法设计',
        className: '一年级2班',
        activityType: '实验操作',
        activityTitle: '贪心算法应用实践',
        startTime: '2024-01-06 10:00',
        duration: 50,
        participantCount: 27,
        interactionCount: 20,
        teacherName: '李老师',
        status: '已完成'
      },
      {
        activityId: 'ACT012',
        courseName: '数据结构',
        className: '三年级2班',
        activityType: '小组合作',
        activityTitle: '图的遍历算法实现',
        startTime: '2024-01-17 08:00',
        duration: 45,
        participantCount: 29,
        interactionCount: 23,
        teacherName: '张老师',
        status: '进行中'
      },
      {
        activityId: 'ACT013',
        courseName: '软件工程',
        className: '二年级1班',
        activityType: '案例分析',
        activityTitle: '系统设计模式应用',
        startTime: '2024-01-05 14:00',
        duration: 60,
        participantCount: 25,
        interactionCount: 19,
        teacherName: '赵老师',
        status: '已完成'
      },
      {
        activityId: 'ACT014',
        courseName: '计算机网络',
        className: '一年级1班',
        activityType: '问答互动',
        activityTitle: '网络安全防护措施讨论',
        startTime: '2024-01-18 09:30',
        duration: 35,
        participantCount: 30,
        interactionCount: 27,
        teacherName: '周老师',
        status: '进行中'
      },
      {
        activityId: 'ACT015',
        courseName: '数据库原理',
        className: '二年级2班',
        activityType: '课堂讨论',
        activityTitle: '数据库事务处理机制',
        startTime: '2024-01-04 15:00',
        duration: 40,
        participantCount: 28,
        interactionCount: 18,
        teacherName: '王老师',
        status: '已完成'
      },
      {
        activityId: 'ACT016',
        courseName: '算法设计',
        className: '三年级1班',
        activityType: '实验操作',
        activityTitle: '回溯算法经典应用',
        startTime: '2024-01-03 10:30',
        duration: 55,
        participantCount: 32,
        interactionCount: 25,
        teacherName: '李老师',
        status: '已完成'
      },
      {
        activityId: 'ACT017',
        courseName: '数据结构',
        className: '一年级2班',
        activityType: '小组合作',
        activityTitle: '哈希表实现与应用',
        startTime: '2024-01-19 08:30',
        duration: 45,
        participantCount: 26,
        interactionCount: 22,
        teacherName: '张老师',
        status: '进行中'
      },
      {
        activityId: 'ACT018',
        courseName: '软件工程',
        className: '三年级2班',
        activityType: '案例分析',
        activityTitle: '代码重构实战演练',
        startTime: '2024-01-02 14:00',
        duration: 50,
        participantCount: 29,
        interactionCount: 24,
        teacherName: '赵老师',
        status: '已完成'
      },
      {
        activityId: 'ACT019',
        courseName: '计算机网络',
        className: '二年级1班',
        activityType: '问答互动',
        activityTitle: 'Web服务器工作原理探讨',
        startTime: '2024-01-01 11:00',
        duration: 30,
        participantCount: 31,
        interactionCount: 16,
        teacherName: '周老师',
        status: '已完成'
      },
      {
        activityId: 'ACT020',
        courseName: '数据库原理',
        className: '三年级1班',
        activityType: '课堂讨论',
        activityTitle: '索引优化策略分析',
        startTime: '2024-01-20 09:00',
        duration: 35,
        participantCount: 30,
        interactionCount: 21,
        teacherName: '王老师',
        status: '进行中'
      }
    ])

    // 分析数据
    const analysisData = reactive({
      avgParticipationRate: 78.5,
      activeStudents: 45,
      interactionFrequency: 3.2,
      discussionDepth: 4.1
    })

    // 获取活动类型颜色
    const getActivityTypeColor = (type) => {
      const colorMap = {
        '课堂讨论': 'primary',
        '小组合作': 'success',
        '问答互动': 'warning',
        '实验操作': 'info',
        '案例分析': 'danger'
      }
      return colorMap[type] || 'info'
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '未开始': 'info',
        '进行中': 'warning',
        '已完成': 'success',
        '已取消': 'danger'
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

    // 创建活动
    const handleCreateActivity = () => {
      dialogTitle.value = '创建互动活动'
      resetForm()
      dialogVisible.value = true
    }

    // 发起讨论
    const handleStartDiscussion = () => {
      ElMessage.success('讨论功能开发中...')
    }

    // 参与度分析
    const handleParticipationAnalysis = () => {
      analysisDialogVisible.value = true
    }

    // 导出数据
    const handleExport = () => {
      ElMessage.success('导出功能开发中...')
    }

    // 查看活动
    const handleView = (row) => {
      ElMessage.info(`查看活动: ${row.activityTitle}`)
    }

    // 参与活动
    const handleJoin = (row) => {
      ElMessage.success(`参与活动: ${row.activityTitle}`)
    }

    // 编辑活动
    const handleEdit = (row) => {
      dialogTitle.value = '编辑互动活动'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    // 删除活动
    const handleDelete = (row) => {
      ElMessageBox.confirm(
        `确定要删除活动 "${row.activityTitle}" 吗？`,
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
        form[key] = key === 'duration' ? 30 : ''
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
          ElMessage.success('活动创建成功')
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
      pagination.total = interactionList.value.length
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
      interactionStats,
      interactionList,
      analysisData,
      getActivityTypeColor,
      getStatusType,
      handleSearch,
      handleReset,
      handleCreateActivity,
      handleStartDiscussion,
      handleParticipationAnalysis,
      handleExport,
      handleView,
      handleJoin,
      handleEdit,
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
.classroom-interaction {
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

.stat-icon.discussion {
  background: #e8f4fd;
  color: #409eff;
}

.stat-icon.participation {
  background: #e8f5e8;
  color: #67c23a;
}

.stat-icon.questions {
  background: #fdf6ec;
  color: #e6a23c;
}

.stat-icon.answers {
  background: #f0f9ff;
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
