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
            <div class="stat-value">{{ totalStudents }}</div>
            <div class="stat-label">在校生总数</div>
          </div>
          <div class="stat-footer">
            <span class="primary">本科: {{ undergraduateCount }}</span>
            <span class="success">研究生: {{ postgraduateCount }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ changesCount }}</div>
            <div class="stat-label">学籍异动</div>
          </div>
          <div class="stat-footer">
            <span class="warning">休学: {{ suspendedCount }}</span>
            <span class="danger">退学: {{ withdrawnCount }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">{{ graduateCount }}</div>
            <div class="stat-label">已毕业学生</div>
          </div>
           <div class="stat-footer">
            <span>总毕业人数</span>
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
              @keyup.enter="handleSearch"
              @clear="handleSearch"
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
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
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
        <el-table-column label="实体存放" min-width="200">
          <template #default="scope">
            <div v-if="scope.row.physicalStatus === 'stocked'" class="physical-location" @click="goToSmartRoom(scope.row)">
               <el-tag type="success" effect="plain" size="small"><el-icon><OfficeBuilding /></el-icon> {{ scope.row.location }}</el-tag>
            </div>
            <div v-else>
               <el-tag type="info" effect="plain" size="small">仅电子</el-tag>
            </div>
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

      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next, total, jumper"
        :total="filteredList.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
        style="margin-top: 20px; justify-content: flex-end;"
      />
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
                <el-descriptions-item label="毕业证书编号">10001{{ currentStudent.gradDate.split('-')[0] }}0600123</el-descriptions-item>
                <el-descriptions-item label="学位证书编号">10001{{ currentStudent.gradDate.split('-')[0] }}0600456</el-descriptions-item>
                <el-descriptions-item label="学位授予">工学学士</el-descriptions-item>
                <el-descriptions-item label="授予日期">{{ currentStudent.gradDate }}-20</el-descriptions-item>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, User, OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const detailVisible = ref(false)
const activeTab = ref('basic')
const currentStudent = ref(null)
const loading = ref(false)

const fullStudentList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const generateMockData = () => {
  const data = []
  const colleges = ['计算机科学与技术学院', '软件学院', '大数据学院', '信息学院']
  const majors = {
    '计算机科学与技术学院': ['计算机科学与技术', '网络工程'],
    '软件学院': ['软件工程', '数字媒体技术'],
    '大数据学院': ['数据科学', '人工智能'],
    '信息学院': ['电子信息工程', '通信工程']
  }
  const statuses = ['在读', '毕业', '休学', '退学']

  for (let i = 1; i <= 200; i++) {
    const college = colleges[i % colleges.length]
    const major = majors[college][i % majors[college].length]
    const enrollYear = 2020 + (i % 5)
    const gradYear = enrollYear + 4
    const status = statuses[i % statuses.length]
    const hasPhysical = Math.random() > 0.4;
    
    data.push({
      id: i,
      name: `学生_${i}`,
      studentId: `${enrollYear}${String(i).padStart(6, '0')}`,
      college,
      major,
      grade: `${enrollYear}级`,
      class: `${major.slice(0, 2)}${enrollYear % 100}0${(i % 3) + 1}班`,
      status,
      physicalStatus: hasPhysical ? 'stocked' : 'only_digital',
      location: hasPhysical ? `二号库/学籍区/${String(Math.floor(Math.random()*20)+1).padStart(2,'0')}柜` : '',
      gender: i % 2 === 0 ? '女' : '男',
      ethnicity: '汉族',
      birthDate: `${enrollYear - 18}-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      idCard: `330106${enrollYear - 18}${String((i % 12) + 1).padStart(2, '0')}${String((i % 28) + 1).padStart(2, '0')}xxxx`,
      candidateId: `${enrollYear % 100}330101xxxx`,
      origin: '浙江省杭州市',
      phone: `138${String(i).padStart(8, '0')}`,
      email: `student_${i}@student.edu.cn`,
      familyPhone: `139${String(i).padStart(8, '0')}`,
      address: '杭州市西湖区xxx路xxx号',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      enrollDate: `${enrollYear}-09-01`,
      duration: 4,
      gradDate: `${gradYear}-06`,
      statusChanges: [
        { date: `${enrollYear}-09-01`, type: '入学', reason: '新生报到' },
        ...(status === '休学' ? [{ date: `${enrollYear + 1}-10-15`, type: '休学', reason: '因病休学一年' }] : []),
        ...(status === '毕业' ? [{ date: `${gradYear}-06-20`, type: '毕业', reason: '修完学分，准予毕业' }] : []),
      ],
      gpa: (3.0 + (i % 10) / 10).toFixed(1),
      grades: [
        { semester: `${enrollYear}-${enrollYear + 1}-1`, course: '高等数学A', score: 80 + (i % 15), credit: 5.0 },
      ],
      rewards: [
        ...(i % 5 === 0 ? [{ date: `${enrollYear + 1}-10`, name: '校级奖学金', type: '奖励', level: '校级' }] : []),
      ]
    })
  }
  return data
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    fullStudentList.value = generateMockData()
    loading.value = false
  }, 500)
})

const filteredList = computed(() => {
  return fullStudentList.value.filter(s => {
    const query = searchQuery.value.toLowerCase()
    return s.name.toLowerCase().includes(query) || 
           s.studentId.includes(query) || 
           s.major.toLowerCase().includes(query)
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

// Computed properties for dashboard
const totalStudents = computed(() => fullStudentList.value.length)
const undergraduateCount = computed(() => fullStudentList.value.filter(s => s.grade.includes('202')).length) // Simple mock logic
const postgraduateCount = computed(() => totalStudents.value - undergraduateCount.value)
const changesCount = computed(() => fullStudentList.value.filter(s => s.status === '休学' || s.status === '退学').length)
const suspendedCount = computed(() => fullStudentList.value.filter(s => s.status === '休学').length)
const withdrawnCount = computed(() => fullStudentList.value.filter(s => s.status === '退学').length)
const graduateCount = computed(() => fullStudentList.value.filter(s => s.status === '毕业').length)

const handleSearch = () => {
  currentPage.value = 1
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

const handlePageChange = (page) => {
  currentPage.value = page
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

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.studentId }
  })
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
