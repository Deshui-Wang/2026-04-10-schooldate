<template>
  <div class="student-archive">
    <div class="section-header">
      <h3>学生档案</h3>
      <p>全校学生的学籍档案管理与成长记录</p>
    </div>

    <!-- Dashboard / 数据概览 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">12,450</div>
            <div class="stat-label">在校生总数</div>
          </div>
          <div class="stat-footer">
            <span class="primary">本科: 8,500</span>
            <span class="success">研究生: 3,950</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">45</div>
            <div class="stat-label">学籍异动待办</div>
          </div>
          <div class="stat-footer">
            <span class="warning">休学: 12</span>
            <span class="info">复学: 8</span>
            <span class="danger">退学: 2</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">2,800</div>
            <div class="stat-label">应届毕业生</div>
          </div>
          <div class="stat-footer">
            <span>已就业: 1,200</span>
            <span>升学: 800</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card action-card" @click="handleAdd">
          <div class="action-content">
            <el-icon :size="32"><User /></el-icon>
            <div class="action-text">新生建档</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索与操作栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="left-panel">
            <el-input
              v-model="searchQuery"
              placeholder="搜索姓名/学号/专业"
              style="width: 300px; margin-right: 15px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出Excel</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="filteredStudents" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" min-width="100" fixed />
        <el-table-column prop="studentId" label="学号" min-width="120" />
        <el-table-column prop="college" label="学院" min-width="150" />
        <el-table-column prop="major" label="专业" min-width="150" />
        <el-table-column prop="grade" label="年级" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看档案</el-button>
            <el-button link type="warning" @click="handleEdit(scope.row)">异动</el-button>
            <el-button link type="success" @click="handlePrint(scope.row)">打印证明</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 档案详情弹窗 -->
    <el-drawer
      v-model="detailVisible"
      title="学生档案详情"
      size="70%"
      destroy-on-close
    >
      <div v-if="currentStudent" class="archive-detail">
        <div class="detail-header">
          <el-avatar :size="64" :src="currentStudent.avatar" />
          <div class="header-info">
            <h2>{{ currentStudent.name }} <el-tag size="small" :type="getStatusType(currentStudent.status)">{{ currentStudent.status }}</el-tag></h2>
            <p>学号：{{ currentStudent.studentId }} | {{ currentStudent.college }} | {{ currentStudent.major }}</p>
          </div>
        </div>

        <el-tabs v-model="activeTab" class="archive-tabs">
          <!-- Tab 1: 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions title="个人信息" :column="2" border>
              <el-descriptions-item label="姓名">{{ currentStudent.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ currentStudent.gender }}</el-descriptions-item>
              <el-descriptions-item label="民族">{{ currentStudent.ethnicity }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ currentStudent.birthDate }}</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ currentStudent.idCard }}</el-descriptions-item>
              <el-descriptions-item label="考生号">{{ currentStudent.candidateId }}</el-descriptions-item>
              <el-descriptions-item label="生源地" :span="2">{{ currentStudent.origin }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="联系方式" :column="2" border>
              <el-descriptions-item label="手机号">{{ currentStudent.phone }}</el-descriptions-item>
              <el-descriptions-item label="电子邮箱">{{ currentStudent.email }}</el-descriptions-item>
              <el-descriptions-item label="家庭电话">{{ currentStudent.familyPhone }}</el-descriptions-item>
              <el-descriptions-item label="家庭住址">{{ currentStudent.address }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- Tab 2: 学籍信息 -->
          <el-tab-pane label="学籍信息" name="status">
            <el-descriptions title="入学信息" :column="2" border>
              <el-descriptions-item label="入学时间">{{ currentStudent.enrollDate }}</el-descriptions-item>
              <el-descriptions-item label="学制">{{ currentStudent.duration }}年</el-descriptions-item>
              <el-descriptions-item label="班级">{{ currentStudent.class }}</el-descriptions-item>
              <el-descriptions-item label="预计毕业">{{ currentStudent.gradDate }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <h4>学籍异动记录</h4>
            <el-timeline>
              <el-timeline-item
                v-for="(change, index) in currentStudent.statusChanges"
                :key="index"
                :timestamp="change.date"
                :type="change.type === '入学' ? 'primary' : 'warning'"
              >
                <h4>{{ change.type }}</h4>
                <p>{{ change.reason }}</p>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>

          <!-- Tab 3: 在校表现 -->
          <el-tab-pane label="在校表现" name="performance">
            <div class="performance-section">
              <h4>学业成绩 (GPA: {{ currentStudent.gpa }})</h4>
              <el-table :data="currentStudent.grades" border height="250">
                <el-table-column prop="semester" label="学期" width="120" />
                <el-table-column prop="course" label="课程" />
                <el-table-column prop="score" label="成绩" width="80" />
                <el-table-column prop="credit" label="学分" width="80" />
              </el-table>
            </div>
            <el-divider />
            <div class="performance-section">
              <h4>奖惩记录</h4>
              <el-table :data="currentStudent.rewards" border>
                <el-table-column prop="date" label="日期" width="120" />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="type" label="类型" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.type === '奖励' ? 'success' : 'danger'">{{ scope.row.type }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="level" label="等级" width="100" />
              </el-table>
            </div>
          </el-tab-pane>

          <!-- Tab 4: 毕业信息 -->
          <el-tab-pane label="毕业信息" name="graduation">
            <div v-if="currentStudent.status === '毕业'">
              <el-descriptions title="证书信息" :column="2" border>
                <el-descriptions-item label="毕业证书编号">1000120240600123</el-descriptions-item>
                <el-descriptions-item label="学位证书编号">1000120240600456</el-descriptions-item>
                <el-descriptions-item label="学位授予">工学学士</el-descriptions-item>
                <el-descriptions-item label="授予日期">2024-06-20</el-descriptions-item>
              </el-descriptions>
              <br />
              <el-descriptions title="毕业去向" :column="1" border>
                <el-descriptions-item label="去向类型">升学</el-descriptions-item>
                <el-descriptions-item label="单位/学校">浙江大学</el-descriptions-item>
                <el-descriptions-item label="专业/职位">计算机科学与技术</el-descriptions-item>
              </el-descriptions>
            </div>
            <el-empty v-else description="该生尚未毕业" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, User } from '@element-plus/icons-vue'

const searchQuery = ref('')
const detailVisible = ref(false)
const activeTab = ref('basic')
const currentStudent = ref(null)

// Mock Data
const students = [
  {
    id: 1,
    name: '王小明',
    studentId: '2021001001',
    college: '计算机科学与技术学院',
    major: '计算机科学与技术',
    grade: '2021级',
    class: '计科2101班',
    status: '在读',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '2003-05-15',
    idCard: '33010620030515xxxx',
    candidateId: '21330101xxxx',
    origin: '浙江省杭州市',
    phone: '15800001111',
    email: 'wang@student.edu.cn',
    familyPhone: '13900002222',
    address: '杭州市西湖区xxx路xxx号',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    enrollDate: '2021-09-01',
    duration: 4,
    gradDate: '2025-06',
    statusChanges: [
      { date: '2021-09-01', type: '入学', reason: '新生报到' }
    ],
    gpa: 3.8,
    grades: [
      { semester: '2021-2022-1', course: '高等数学A', score: 95, credit: 5.0 },
      { semester: '2021-2022-1', course: '程序设计基础', score: 98, credit: 4.0 },
      { semester: '2021-2022-2', course: '线性代数', score: 92, credit: 3.0 }
    ],
    rewards: [
      { date: '2022-10', name: '国家奖学金', type: '奖励', level: '国家级' },
      { date: '2022-05', name: '优秀团员', type: '奖励', level: '校级' }
    ]
  },
  {
    id: 2,
    name: '赵丽',
    studentId: '2020002005',
    college: '软件学院',
    major: '软件工程',
    grade: '2020级',
    class: '软工2002班',
    status: '毕业',
    gender: '女',
    ethnicity: '汉族',
    birthDate: '2002-08-20',
    idCard: '32050120020820xxxx',
    candidateId: '20320501xxxx',
    origin: '江苏省苏州市',
    phone: '13700003333',
    email: 'zhao@student.edu.cn',
    familyPhone: '13600004444',
    address: '苏州市姑苏区xxx路xxx号',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    enrollDate: '2020-09-01',
    duration: 4,
    gradDate: '2024-06',
    statusChanges: [
      { date: '2020-09-01', type: '入学', reason: '新生报到' },
      { date: '2024-06-20', type: '毕业', reason: '修完学分，准予毕业' }
    ],
    gpa: 3.6,
    grades: [
      { semester: '2020-2021-1', course: '高等数学A', score: 88, credit: 5.0 }
    ],
    rewards: [
      { date: '2021-10', name: '校三好学生', type: '奖励', level: '校级' }
    ]
  },
  {
    id: 3,
    name: '孙强',
    studentId: '2022003010',
    college: '大数据学院',
    major: '数据科学',
    grade: '2022级',
    class: '数据2201班',
    status: '休学',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '2004-01-10',
    idCard: '31010120040110xxxx',
    candidateId: '22310101xxxx',
    origin: '上海市黄浦区',
    phone: '13900005555',
    email: 'sun@student.edu.cn',
    familyPhone: '13800006666',
    address: '上海市黄浦区xxx路xxx号',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    enrollDate: '2022-09-01',
    duration: 4,
    gradDate: '2026-06',
    statusChanges: [
      { date: '2022-09-01', type: '入学', reason: '新生报到' },
      { date: '2023-10-15', type: '休学', reason: '因病休学一年' }
    ],
    gpa: 3.2,
    grades: [],
    rewards: []
  }
]

const filteredStudents = computed(() => {
  if (!searchQuery.value) return students
  const query = searchQuery.value.toLowerCase()
  return students.filter(s => 
    s.name.includes(query) || 
    s.studentId.includes(query) || 
    s.major.includes(query)
  )
})

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleExport = () => {
  ElMessage.success('正在导出Excel...')
}

const handleAdd = () => {
  ElMessage.info('打开新生建档向导')
}

const viewDetail = (row) => {
  currentStudent.value = row
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleEdit = (row) => {
  ElMessage.info(`办理 ${row.name} 的学籍异动`)
}

const handlePrint = (row) => {
  ElMessage.success(`正在生成 ${row.name} 的在读证明...`)
}

const getStatusType = (status) => {
  const map = {
    '在读': 'success',
    '毕业': 'info',
    '休学': 'warning',
    '退学': 'danger',
    '结业': 'info'
  }
  return map[status] || ''
}
</script>

<style scoped>
.student-archive {
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

.dashboard-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-content {
  text-align: center;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-footer {
  display: flex;
  justify-content: space-around;
  font-size: 12px;
  padding: 0 10px;
}

.stat-footer .primary { color: #409EFF; }
.stat-footer .success { color: #67C23A; }
.stat-footer .warning { color: #E6A23C; }
.stat-footer .danger { color: #F56C6C; }
.stat-footer .info { color: #909399; }

.action-card {
  cursor: pointer;
  background: linear-gradient(135deg, #42d392 0%, #647eff 100%);
  color: white;
  border: none;
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.action-text {
  margin-top: 8px;
  font-weight: 500;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.header-info {
  margin-left: 20px;
}

.header-info h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.header-info p {
  margin: 0;
  color: #606266;
}

.performance-section {
  padding: 10px;
}

.performance-section h4 {
  margin-bottom: 15px;
  color: #303133;
}
</style>
