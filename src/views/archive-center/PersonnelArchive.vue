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
          <div class="stat-value">1,234</div>
          <div class="stat-label">教职工档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">856</div>
          <div class="stat-label">干部档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">423</div>
          <div class="stat-label">合同档案</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card personnel">
          <div class="stat-value">67</div>
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
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="selectedType" placeholder="档案类型" style="width: 150px; margin-right: 15px">
              <el-option label="全部" value="" />
              <el-option label="教职工档案" value="教职工档案" />
              <el-option label="干部档案" value="干部档案" />
              <el-option label="合同档案" value="合同档案" />
              <el-option label="考核档案" value="考核档案" />
            </el-select>
            <el-select v-model="selectedDepartment" placeholder="所属部门" style="width: 150px; margin-right: 15px">
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
      <el-table :data="archiveList" stripe style="width: 100%">
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
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看</el-button>
            <el-button link type="warning" @click="handleUpdate(scope.row)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
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
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const searchQuery = ref('')
const selectedType = ref('')
const selectedDepartment = ref('')
const detailVisible = ref(false)
const activeTab = ref('basic')
const currentEmployee = ref(null)

const archiveList = ref([
  { employeeNo: 'E2024001', name: '张教授', type: '教职工档案', department: '计算机学院', position: '教授', entryDate: '2010-09-01', status: '在职' },
  { employeeNo: 'E2024002', name: '李副教授', type: '干部档案', department: '经济学院', position: '副院长', entryDate: '2012-03-15', status: '在职' },
  { employeeNo: 'E2024003', name: '王老师', type: '教职工档案', department: '材料学院', position: '讲师', entryDate: '2018-07-01', status: '在职' },
  { employeeNo: 'E2023001', name: '赵教授', type: '教职工档案', department: '信息学院', position: '教授', entryDate: '2008-09-01', status: '在职' },
  { employeeNo: 'E2023002', name: '陈老师', type: '合同档案', department: '计算机学院', position: '助教', entryDate: '2020-09-01', status: '在职' },
  { employeeNo: 'E2023003', name: '刘副教授', type: '考核档案', department: '经济学院', position: '副教授', entryDate: '2015-03-01', status: '在职' }
])

// 详细数据映射
const employeeDetails = {
  'E2024001': {
    employeeNo: 'E2024001',
    name: '张教授',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1975-06-15',
    idCard: '33010619750615xxxx',
    politicalStatus: '中共党员',
    nativePlace: '浙江省杭州市',
    phone: '13800001111',
    email: 'zhang@university.edu.cn',
    officePhone: '0571-88881234',
    address: '杭州市西湖区xxx路xxx号',
    department: '计算机学院',
    position: '教授',
    title: '教授',
    entryDate: '2010-09-01',
    status: '在职',
    type: '教职工档案',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '长期合同',
    contractNo: 'HT-2010-001',
    contractStartDate: '2010-09-01',
    contractEndDate: '2030-08-31',
    contractDuration: '20年',
    contractStatus: '有效',
    positionChanges: [
      { date: '2010-09-01', type: '入职', department: '计算机学院', position: '讲师', reason: '新员工入职' },
      { date: '2015-09-01', type: '晋升', department: '计算机学院', position: '副教授', reason: '职称评定' },
      { date: '2020-09-01', type: '晋升', department: '计算机学院', position: '教授', reason: '职称评定' }
    ],
    evaluations: [
      { year: '2024', quarter: 'Q1', score: 95, level: '优秀', comment: '工作表现突出，教学科研成绩优异' },
      { year: '2023', quarter: 'Q4', score: 92, level: '优秀', comment: '教学评价优秀，科研项目进展顺利' },
      { year: '2023', quarter: 'Q3', score: 88, level: '良好', comment: '工作认真负责，学生评价良好' }
    ],
    trainings: [
      { date: '2024-03-15', name: '人工智能前沿技术培训', type: '专业培训', duration: '5天', certificate: true },
      { date: '2023-10-20', name: '教学能力提升培训', type: '教学培训', duration: '3天', certificate: true },
      { date: '2023-06-10', name: '科研项目管理培训', type: '管理培训', duration: '2天', certificate: false }
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: '2010-09-01', issuer: '教育部', validity: '长期有效', status: '有效' },
      { name: '计算机软件高级工程师', issueDate: '2015-06-20', issuer: '工信部', validity: '长期有效', status: '有效' }
    ]
  },
  'E2024002': {
    employeeNo: 'E2024002',
    name: '李副教授',
    gender: '女',
    ethnicity: '汉族',
    birthDate: '1980-03-20',
    idCard: '33010619800320xxxx',
    politicalStatus: '中共党员',
    nativePlace: '浙江省宁波市',
    phone: '13900002222',
    email: 'li@university.edu.cn',
    officePhone: '0571-88882345',
    address: '杭州市拱墅区xxx路xxx号',
    department: '经济学院',
    position: '副院长',
    title: '副教授',
    entryDate: '2012-03-15',
    status: '在职',
    type: '干部档案',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '长期合同',
    contractNo: 'HT-2012-002',
    contractStartDate: '2012-03-15',
    contractEndDate: '2032-03-14',
    contractDuration: '20年',
    contractStatus: '有效',
    positionChanges: [
      { date: '2012-03-15', type: '入职', department: '经济学院', position: '讲师', reason: '新员工入职' },
      { date: '2018-09-01', type: '晋升', department: '经济学院', position: '副教授', reason: '职称评定' },
      { date: '2023-09-01', type: '任命', department: '经济学院', position: '副院长', reason: '干部任命' }
    ],
    evaluations: [
      { year: '2024', quarter: 'Q1', score: 93, level: '优秀', comment: '管理工作到位，教学科研并重' },
      { year: '2023', quarter: 'Q4', score: 90, level: '优秀', comment: '领导能力突出，团队管理有效' }
    ],
    trainings: [
      { date: '2023-11-10', name: '高校管理能力提升培训', type: '管理培训', duration: '7天', certificate: true },
      { date: '2023-05-15', name: '经济学前沿理论培训', type: '专业培训', duration: '5天', certificate: true }
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: '2012-03-15', issuer: '教育部', validity: '长期有效', status: '有效' },
      { name: '经济师', issueDate: '2018-06-15', issuer: '人社部', validity: '长期有效', status: '有效' }
    ]
  },
  'E2024003': {
    employeeNo: 'E2024003',
    name: '王老师',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1990-08-10',
    idCard: '33010619900810xxxx',
    politicalStatus: '群众',
    nativePlace: '浙江省温州市',
    phone: '13700003333',
    email: 'wang@university.edu.cn',
    officePhone: '0571-88883456',
    address: '杭州市余杭区xxx路xxx号',
    department: '材料学院',
    position: '讲师',
    title: '讲师',
    entryDate: '2018-07-01',
    status: '在职',
    type: '教职工档案',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '固定期限合同',
    contractNo: 'HT-2018-003',
    contractStartDate: '2018-07-01',
    contractEndDate: '2028-06-30',
    contractDuration: '10年',
    contractStatus: '有效',
    positionChanges: [
      { date: '2018-07-01', type: '入职', department: '材料学院', position: '讲师', reason: '新员工入职' }
    ],
    evaluations: [
      { year: '2024', quarter: 'Q1', score: 85, level: '良好', comment: '教学工作认真，有待提升科研能力' },
      { year: '2023', quarter: 'Q4', score: 82, level: '良好', comment: '工作态度积极，学生评价良好' }
    ],
    trainings: [
      { date: '2024-01-20', name: '材料科学前沿技术培训', type: '专业培训', duration: '4天', certificate: false },
      { date: '2023-09-15', name: '青年教师教学能力培训', type: '教学培训', duration: '3天', certificate: true }
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: '2018-07-01', issuer: '教育部', validity: '长期有效', status: '有效' }
    ]
  },
  'E2023001': {
    employeeNo: 'E2023001',
    name: '赵教授',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1970-12-25',
    idCard: '33010619701225xxxx',
    politicalStatus: '中共党员',
    nativePlace: '浙江省绍兴市',
    phone: '13600004444',
    email: 'zhao@university.edu.cn',
    officePhone: '0571-88884567',
    address: '杭州市上城区xxx路xxx号',
    department: '信息学院',
    position: '教授',
    title: '教授',
    entryDate: '2008-09-01',
    status: '在职',
    type: '教职工档案',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '长期合同',
    contractNo: 'HT-2008-001',
    contractStartDate: '2008-09-01',
    contractEndDate: '2028-08-31',
    contractDuration: '20年',
    contractStatus: '有效',
    positionChanges: [
      { date: '2008-09-01', type: '入职', department: '信息学院', position: '副教授', reason: '人才引进' },
      { date: '2013-09-01', type: '晋升', department: '信息学院', position: '教授', reason: '职称评定' }
    ],
    evaluations: [
      { year: '2024', quarter: 'Q1', score: 96, level: '优秀', comment: '学术成果突出，教学科研双优' },
      { year: '2023', quarter: 'Q4', score: 94, level: '优秀', comment: '科研项目进展顺利，教学效果良好' }
    ],
    trainings: [
      { date: '2023-12-05', name: '信息科学前沿技术培训', type: '专业培训', duration: '5天', certificate: true }
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: '2008-09-01', issuer: '教育部', validity: '长期有效', status: '有效' },
      { name: '高级工程师', issueDate: '2013-06-20', issuer: '工信部', validity: '长期有效', status: '有效' }
    ]
  },
  'E2023002': {
    employeeNo: 'E2023002',
    name: '陈老师',
    gender: '女',
    ethnicity: '汉族',
    birthDate: '1992-05-18',
    idCard: '33010619920518xxxx',
    politicalStatus: '共青团员',
    nativePlace: '浙江省台州市',
    phone: '13500005555',
    email: 'chen@university.edu.cn',
    officePhone: '0571-88885678',
    address: '杭州市下城区xxx路xxx号',
    department: '计算机学院',
    position: '助教',
    title: '助教',
    entryDate: '2020-09-01',
    status: '在职',
    type: '合同档案',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '固定期限合同',
    contractNo: 'HT-2020-005',
    contractStartDate: '2020-09-01',
    contractEndDate: '2025-08-31',
    contractDuration: '5年',
    contractStatus: '有效',
    positionChanges: [
      { date: '2020-09-01', type: '入职', department: '计算机学院', position: '助教', reason: '新员工入职' }
    ],
    evaluations: [
      { year: '2024', quarter: 'Q1', score: 80, level: '良好', comment: '工作认真，需要继续提升' },
      { year: '2023', quarter: 'Q4', score: 78, level: '良好', comment: '积极配合工作，表现良好' }
    ],
    trainings: [
      { date: '2023-08-20', name: '新教师入职培训', type: '入职培训', duration: '5天', certificate: true }
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: '2021-06-15', issuer: '教育部', validity: '长期有效', status: '有效' }
    ]
  },
  'E2023003': {
    employeeNo: 'E2023003',
    name: '刘副教授',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1985-09-30',
    idCard: '33010619850930xxxx',
    politicalStatus: '中共党员',
    nativePlace: '浙江省金华市',
    phone: '13400006666',
    email: 'liu@university.edu.cn',
    officePhone: '0571-88886789',
    address: '杭州市江干区xxx路xxx号',
    department: '经济学院',
    position: '副教授',
    title: '副教授',
    entryDate: '2015-03-01',
    status: '在职',
    type: '考核档案',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '长期合同',
    contractNo: 'HT-2015-004',
    contractStartDate: '2015-03-01',
    contractEndDate: '2035-02-28',
    contractDuration: '20年',
    contractStatus: '有效',
    positionChanges: [
      { date: '2015-03-01', type: '入职', department: '经济学院', position: '讲师', reason: '新员工入职' },
      { date: '2021-09-01', type: '晋升', department: '经济学院', position: '副教授', reason: '职称评定' }
    ],
    evaluations: [
      { year: '2024', quarter: 'Q1', score: 91, level: '优秀', comment: '教学科研并重，表现优秀' },
      { year: '2023', quarter: 'Q4', score: 89, level: '良好', comment: '工作积极，成果显著' }
    ],
    trainings: [
      { date: '2023-07-10', name: '经济学研究方法培训', type: '专业培训', duration: '4天', certificate: true },
      { date: '2022-11-20', name: '教学技能提升培训', type: '教学培训', duration: '3天', certificate: true }
    ],
    certificates: [
      { name: '高等学校教师资格证', issueDate: '2015-03-01', issuer: '教育部', validity: '长期有效', status: '有效' },
      { name: '经济师', issueDate: '2021-06-20', issuer: '人社部', validity: '长期有效', status: '有效' }
    ]
  }
}

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleExport = () => {
  ElMessage.success('正在导出档案列表...')
}

const viewDetail = (row) => {
  currentEmployee.value = employeeDetails[row.employeeNo] || {
    ...row,
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1980-01-01',
    idCard: '33010619800101xxxx',
    politicalStatus: '群众',
    nativePlace: '浙江省',
    phone: '13800000000',
    email: 'employee@university.edu.cn',
    officePhone: '0571-88880000',
    address: '杭州市',
    title: row.position,
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    contractType: '固定期限合同',
    contractNo: 'HT-2020-001',
    contractStartDate: row.entryDate,
    contractEndDate: '2025-12-31',
    contractDuration: '5年',
    contractStatus: '有效',
    positionChanges: [
      { date: row.entryDate, type: '入职', department: row.department, position: row.position, reason: '新员工入职' }
    ],
    evaluations: [],
    trainings: [],
    certificates: []
  }
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleUpdate = (row) => {
  ElMessage.info(`更新档案: ${row.name}`)
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
</style>
