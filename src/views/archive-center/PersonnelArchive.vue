<template>
  <div class="archive-list">
    <div class="section-header">
      <h3>人事档案</h3>
      <p>教职工人事档案的数字化管理与维护</p>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="stat-row">
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">{{ teacherCount }}</div>
          <div class="stat-label">教职工档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">{{ cadreCount }}</div>
          <div class="stat-label">干部档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">{{ contractCount }}</div>
          <div class="stat-label">合同档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">{{ assessmentCount }}</div>
          <div class="stat-label">考核档案</div>
        </div>
      </el-col>
    </el-row>

    <!-- 搜索与操作栏 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <div class="left-panel">
            <el-input
              v-model="searchQuery"
              placeholder="搜索姓名/工号/部门"
              style="width: 300px; margin-right: 15px"
              clearable
              @keyup.enter="handleSearch"
              @clear="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="教职工档案" value="教职工档案" />
              <el-option label="干部档案" value="干部档案" />
              <el-option label="合同档案" value="合同档案" />
              <el-option label="考核档案" value="考核档案" />
            </el-select>
            <el-select v-model="selectedDepartment" placeholder="所属部门" style="width: 150px; margin-right: 15px" clearable @change="handleSearch">
              <el-option label="全部" value="" />
              <el-option label="计算机学院" value="计算机学院" />
              <el-option label="经济学院" value="经济学院" />
              <el-option label="材料学院" value="材料学院" />
              <el-option label="信息学院" value="信息学院" />
            </el-select>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleExport">导出</el-button>
          </div>
        </div>
      </template>

      <!-- 档案列表 -->
      <el-table :data="paginatedList" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="employeeNo" label="工号" min-width="120" fixed />
        <el-table-column prop="name" label="姓名" min-width="100" />
        <el-table-column prop="type" label="档案类型" min-width="120" />
        <el-table-column prop="department" label="所属部门" min-width="150" />
        <el-table-column prop="position" label="职务" min-width="120" />
        <el-table-column prop="entryDate" label="入职日期" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在职' ? 'success' : 'info'" size="small">
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="warning" @click="handleUpdate(scope.row)">更新</el-button>
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
      title="人事档案详情"
      size="70%"
      destroy-on-close
    >
      <div v-if="currentEmployee" class="archive-detail">
        <div class="detail-header">
          <el-avatar :size="64" :src="currentEmployee.avatar" />
          <div class="header-info">
            <h2>{{ currentEmployee.name }} <el-tag size="small" :type="getStatusType(currentEmployee.status)">{{ currentEmployee.status }}</el-tag></h2>
            <p>工号：{{ currentEmployee.employeeNo }} | {{ currentEmployee.department }} | {{ currentEmployee.position }}</p>
          </div>
        </div>

        <el-tabs v-model="activeTab" class="archive-tabs">
          <!-- Tab 1: 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions title="个人信息" :column="2" border>
              <el-descriptions-item label="姓名">{{ currentEmployee.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ currentEmployee.gender }}</el-descriptions-item>
              <el-descriptions-item label="民族">{{ currentEmployee.ethnicity }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ currentEmployee.birthDate }}</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ currentEmployee.idCard }}</el-descriptions-item>
              <el-descriptions-item label="政治面貌">{{ currentEmployee.politicalStatus }}</el-descriptions-item>
              <el-descriptions-item label="籍贯" :span="2">{{ currentEmployee.nativePlace }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="联系方式" :column="2" border>
              <el-descriptions-item label="手机号">{{ currentEmployee.phone }}</el-descriptions-item>
              <el-descriptions-item label="电子邮箱">{{ currentEmployee.email }}</el-descriptions-item>
              <el-descriptions-item label="办公电话">{{ currentEmployee.officePhone }}</el-descriptions-item>
              <el-descriptions-item label="家庭住址">{{ currentEmployee.address }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- Tab 2: 工作信息 -->
          <el-tab-pane label="工作信息" name="work">
            <el-descriptions title="入职信息" :column="2" border>
              <el-descriptions-item label="工号">{{ currentEmployee.employeeNo }}</el-descriptions-item>
              <el-descriptions-item label="入职时间">{{ currentEmployee.entryDate }}</el-descriptions-item>
              <el-descriptions-item label="所属部门">{{ currentEmployee.department }}</el-descriptions-item>
              <el-descriptions-item label="职务">{{ currentEmployee.position }}</el-descriptions-item>
              <el-descriptions-item label="职称">{{ currentEmployee.title }}</el-descriptions-item>
              <el-descriptions-item label="工作状态">{{ currentEmployee.status }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <h4>职位变动记录</h4>
            <el-timeline>
              <el-timeline-item
                v-for="(change, index) in currentEmployee.positionChanges"
                :key="index"
                :timestamp="change.date"
                :type="change.type === '入职' ? 'primary' : 'warning'"
              >
                <h4>{{ change.type }}</h4>
                <p>{{ change.department }} - {{ change.position }}</p>
                <p style="color: #909399; font-size: 12px;">{{ change.reason }}</p>
              </el-timeline-item>
            </el-timeline>
          </el-tab-pane>

          <!-- Tab 3: 合同信息 -->
          <el-tab-pane label="合同信息" name="contract">
            <el-descriptions title="当前合同" :column="2" border>
              <el-descriptions-item label="合同类型">{{ currentEmployee.contractType }}</el-descriptions-item>
              <el-descriptions-item label="合同编号">{{ currentEmployee.contractNo }}</el-descriptions-item>
              <el-descriptions-item label="签订日期">{{ currentEmployee.contractStartDate }}</el-descriptions-item>
              <el-descriptions-item label="到期日期">{{ currentEmployee.contractEndDate }}</el-descriptions-item>
              <el-descriptions-item label="合同期限">{{ currentEmployee.contractDuration }}</el-descriptions-item>
              <el-descriptions-item label="合同状态">
                <el-tag :type="currentEmployee.contractStatus === '有效' ? 'success' : 'warning'" size="small">
                  {{ currentEmployee.contractStatus }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
            <br />
            <div class="performance-section">
              <h4>考核记录</h4>
              <el-table :data="currentEmployee.evaluations" border>
                <el-table-column prop="year" label="年度" width="100" />
                <el-table-column prop="quarter" label="季度" width="80" />
                <el-table-column prop="score" label="考核分数" width="100" />
                <el-table-column prop="level" label="考核等级" width="100">
                  <template #default="scope">
                    <el-tag :type="getEvaluationType(scope.row.level)" size="small">
                      {{ scope.row.level }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="comment" label="评价" />
              </el-table>
            </div>
          </el-tab-pane>

          <!-- Tab 4: 培训发展 -->
          <el-tab-pane label="培训发展" name="training">
            <div class="performance-section">
              <h4>培训记录</h4>
              <el-table :data="currentEmployee.trainings" border>
                <el-table-column prop="date" label="培训日期" width="120" />
                <el-table-column prop="name" label="培训名称" />
                <el-table-column prop="type" label="培训类型" width="120" />
                <el-table-column prop="duration" label="培训时长" width="100" />
                <el-table-column prop="certificate" label="证书" width="150">
                  <template #default="scope">
                    <el-tag v-if="scope.row.certificate" type="success" size="small">已获得</el-tag>
                    <span v-else style="color: #909399;">无</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-divider />
            <div class="performance-section">
              <h4>资格证书</h4>
              <el-table :data="currentEmployee.certificates" border>
                <el-table-column prop="name" label="证书名称" />
                <el-table-column prop="issueDate" label="获得日期" width="120" />
                <el-table-column prop="issuer" label="颁发机构" />
                <el-table-column prop="validity" label="有效期" width="150" />
                <el-table-column prop="status" label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '有效' ? 'success' : 'info'" size="small">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
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
import { Search, OfficeBuilding } from '@element-plus/icons-vue'

const router = useRouter()
const searchQuery = ref('')
const selectedType = ref('')
const selectedDepartment = ref('')
const detailVisible = ref(false)
const activeTab = ref('basic')
const currentEmployee = ref(null)
const loading = ref(false)

const fullArchiveList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

const generateMockData = () => {
  const data = []
  const departments = ['计算机学院', '经济学院', '材料学院', '信息学院']
  const types = ['教职工档案', '干部档案', '合同档案', '考核档案']
  const positions = ['教授', '副教授', '讲师', '助教', '副院长']

  for (let i = 1; i <= 150; i++) {
    const year = 2005 + (i % 20)
    const month = String((i % 12) + 1).padStart(2, '0')
    const day = String((i % 28) + 1).padStart(2, '0')
    const hasPhysical = Math.random() > 0.4;
    
    data.push({
      employeeNo: `E${year}${String(i).padStart(4, '0')}`,
      name: `教职工_${i}`,
      type: types[i % types.length],
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      entryDate: `${year}-${month}-${day}`,
      status: '在职',
      physicalStatus: hasPhysical ? 'stocked' : 'only_digital',
      location: hasPhysical ? `三号库/人事区/${String(Math.floor(Math.random()*20)+1).padStart(2,'0')}柜` : ''
    })
  }
  return data
}

onMounted(() => {
  loading.value = true
  setTimeout(() => {
    fullArchiveList.value = generateMockData()
    loading.value = false
  }, 500)
})

const filteredList = computed(() => {
  return fullArchiveList.value.filter(item => {
    const query = searchQuery.value.toLowerCase()
    const searchMatch =
      item.name.toLowerCase().includes(query) ||
      item.employeeNo.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query)
    const typeMatch = selectedType.value ? item.type === selectedType.value : true
    const deptMatch = selectedDepartment.value ? item.department === selectedDepartment.value : true
    return searchMatch && typeMatch && deptMatch
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const teacherCount = computed(() => fullArchiveList.value.filter(i => i.type === '教职工档案').length)
const cadreCount = computed(() => fullArchiveList.value.filter(i => i.type === '干部档案').length)
const contractCount = computed(() => fullArchiveList.value.filter(i => i.type === '合同档案').length)
const assessmentCount = computed(() => fullArchiveList.value.filter(i => i.type === '考核档案').length)

const handleSearch = () => {
  currentPage.value = 1
}

const handleExport = () => {
  ElMessage.success('正在导出档案列表...')
}

const viewDetail = (row) => {
  // For mock data, we generate some placeholder details
  currentEmployee.value = {
    ...row,
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1985-01-01',
    idCard: '33010xxxxxxxxxxxxx',
    politicalStatus: '中共党员',
    nativePlace: '浙江省杭州市',
    phone: '13800000000',
    email: `${row.employeeNo}@university.edu.cn`,
    officePhone: '0571-88880000',
    address: '杭州市西湖区xxx路xxx号',
    title: row.position,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '长期合同',
    contractNo: `HT-${row.entryDate.split('-')[0]}-${row.employeeNo.slice(-3)}`,
    contractStartDate: row.entryDate,
    contractEndDate: '2035-12-31',
    contractDuration: '长期',
    contractStatus: '有效',
    positionChanges: [
      { date: row.entryDate, type: '入职', department: row.department, position: row.position, reason: '新员工入职' }
    ],
    evaluations: [
      { year: '2023', quarter: 'Q4', score: 90, level: '优秀', comment: '工作表现优异' },
    ],
    trainings: [
      { date: '2023-10-20', name: '教学能力提升培训', type: '教学培训', duration: '3天', certificate: true },
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: row.entryDate, issuer: '教育部', validity: '长期有效', status: '有效' },
    ]
  }
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleUpdate = (row) => {
  ElMessage.info(`更新档案: ${row.name}`)
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const goToSmartRoom = (row) => {
  router.push({
    path: '/archive-center/smart-room',
    query: { archiveNo: row.employeeNo }
  })
}

const getStatusType = (status) => {
  const map = {
    '在职': 'success',
    '离职': 'info',
    '退休': 'warning',
    '停薪留职': 'danger'
  }
  return map[status] || ''
}

const getEvaluationType = (level) => {
  const map = {
    '优秀': 'success',
    '良好': 'primary',
    '合格': 'info',
    '不合格': 'danger'
  }
  return map[level] || 'info'
}
</script>

<style scoped>
.archive-list {
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

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  text-align: center;
}

.stat-card.personnel {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-panel {
  display: flex;
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

.physical-location {
  cursor: pointer;
  transition: opacity 0.2s;
}
.physical-location:hover {
  opacity: 0.8;
}
</style>
