<template>
  <div class="teacher-archive">
    <div class="section-header">
      <h3>教师档案</h3>
      <p>全校教职工的人事档案管理与全生命周期维护</p>
    </div>

    <!-- Dashboard / 数据概览 -->
    <el-row :gutter="20" class="dashboard-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">1,256</div>
            <div class="stat-label">教师总数</div>
          </div>
          <div class="stat-footer">
            <span class="success">在职: 1,180</span>
            <span class="info">离退: 76</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">32</div>
            <div class="stat-label">待办事项</div>
          </div>
          <div class="stat-footer">
            <span class="warning">审核: 12</span>
            <span class="danger">合同到期: 5</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-value">高级</div>
            <div class="stat-label">职称分布主体</div>
          </div>
          <div class="stat-footer">
            <span>正高: 245</span>
            <span>副高: 432</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card action-card" @click="handleAdd">
          <div class="action-content">
            <el-icon :size="32"><UserFilled /></el-icon>
            <div class="action-text">新教师建档</div>
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
              placeholder="搜索姓名/工号/部门"
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
      <el-table :data="filteredTeachers" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" min-width="100" fixed />
        <el-table-column prop="employeeId" label="工号" min-width="120" />
        <el-table-column prop="department" label="部门" min-width="150" />
        <el-table-column prop="title" label="职称" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在职' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinDate" label="入职时间" min-width="120" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="viewDetail(scope.row)">查看档案</el-button>
            <el-button link type="warning" @click="handleEdit(scope.row)">变更</el-button>
            <el-button link type="danger" @click="handleArchive(scope.row)">归档</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 档案详情弹窗 -->
    <el-drawer
      v-model="detailVisible"
      title="教师档案详情"
      size="70%"
      destroy-on-close
    >
      <div v-if="currentTeacher" class="archive-detail">
        <div class="detail-header">
          <el-avatar :size="64" :src="currentTeacher.avatar" />
          <div class="header-info">
            <h2>{{ currentTeacher.name }} <el-tag size="small">{{ currentTeacher.status }}</el-tag></h2>
            <p>工号：{{ currentTeacher.employeeId }} | 部门：{{ currentTeacher.department }} | 职称：{{ currentTeacher.title }}</p>
          </div>
        </div>

        <el-tabs v-model="activeTab" class="archive-tabs">
          <!-- Tab 1: 基本信息 -->
          <el-tab-pane label="基本信息" name="basic">
            <el-descriptions title="个人信息" :column="2" border>
              <el-descriptions-item label="姓名">{{ currentTeacher.name }}</el-descriptions-item>
              <el-descriptions-item label="性别">{{ currentTeacher.gender }}</el-descriptions-item>
              <el-descriptions-item label="民族">{{ currentTeacher.ethnicity }}</el-descriptions-item>
              <el-descriptions-item label="出生日期">{{ currentTeacher.birthDate }}</el-descriptions-item>
              <el-descriptions-item label="身份证号">{{ currentTeacher.idCard }}</el-descriptions-item>
              <el-descriptions-item label="政治面貌">{{ currentTeacher.politics }}</el-descriptions-item>
            </el-descriptions>
            <br />
            <el-descriptions title="联系方式" :column="2" border>
              <el-descriptions-item label="手机号">{{ currentTeacher.phone }}</el-descriptions-item>
              <el-descriptions-item label="电子邮箱">{{ currentTeacher.email }}</el-descriptions-item>
              <el-descriptions-item label="家庭住址" :span="2">{{ currentTeacher.address }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- Tab 2: 教育与工作经历 -->
          <el-tab-pane label="教育与工作" name="edu_work">
            <div class="timeline-section">
              <h4>教育背景</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(edu, index) in currentTeacher.education"
                  :key="index"
                  :timestamp="edu.period"
                  type="primary"
                >
                  <h4>{{ edu.school }}</h4>
                  <p>{{ edu.major }} | {{ edu.degree }}</p>
                </el-timeline-item>
              </el-timeline>
            </div>
            <el-divider />
            <div class="timeline-section">
              <h4>工作履历</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(work, index) in currentTeacher.workHistory"
                  :key="index"
                  :timestamp="work.period"
                  color="#0bbd87"
                >
                  <h4>{{ work.company }}</h4>
                  <p>{{ work.position }}</p>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>

          <!-- Tab 3: 合同管理 -->
          <el-tab-pane label="合同管理" name="contract">
            <el-table :data="currentTeacher.contracts" border>
              <el-table-column prop="type" label="合同类型" />
              <el-table-column prop="startDate" label="开始日期" />
              <el-table-column prop="endDate" label="结束日期" />
              <el-table-column prop="status" label="状态">
                <template #default="scope">
                  <el-tag :type="scope.row.status === '有效' ? 'success' : 'danger'">{{ scope.row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="附件">
                <template #default>
                  <el-button link type="primary">查看扫描件</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <!-- Tab 4: 职业发展 -->
          <el-tab-pane label="职业发展" name="development">
            <h4>科研成果</h4>
            <el-table :data="currentTeacher.research" border style="margin-bottom: 20px">
              <el-table-column prop="name" label="成果名称" />
              <el-table-column prop="type" label="类型" width="100" />
              <el-table-column prop="date" label="发表/获得时间" width="150" />
              <el-table-column prop="role" label="角色" width="100" />
            </el-table>
            
            <h4>年度考核</h4>
            <el-table :data="currentTeacher.assessments" border>
              <el-table-column prop="year" label="年度" width="100" />
              <el-table-column prop="result" label="考核结果">
                <template #default="scope">
                  <el-tag :type="getAssessmentTag(scope.row.result)">{{ scope.row.result }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="remarks" label="备注" />
            </el-table>
          </el-tab-pane>

          <!-- Tab 5: 薪酬社保 -->
          <el-tab-pane label="薪酬社保" name="salary">
            <el-alert title="敏感信息，操作已记录日志" type="warning" show-icon :closable="false" style="margin-bottom: 15px" />
            <el-descriptions title="当前薪酬等级" border>
              <el-descriptions-item label="岗位工资">等级 5</el-descriptions-item>
              <el-descriptions-item label="薪级工资">等级 12</el-descriptions-item>
              <el-descriptions-item label="社保基数">12000.00</el-descriptions-item>
              <el-descriptions-item label="公积金基数">12000.00</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <!-- Tab 6: 家庭关系 -->
          <el-tab-pane label="家庭关系" name="family">
            <el-table :data="currentTeacher.family" border>
              <el-table-column prop="relation" label="关系" width="100" />
              <el-table-column prop="name" label="姓名" width="120" />
              <el-table-column prop="workplace" label="工作单位" />
              <el-table-column prop="phone" label="联系电话" width="150" />
              <el-table-column prop="emergency" label="紧急联系人" width="100" align="center">
                <template #default="scope">
                  <el-icon v-if="scope.row.emergency" color="#67C23A"><Check /></el-icon>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, UserFilled, Check } from '@element-plus/icons-vue'

const searchQuery = ref('')
const detailVisible = ref(false)
const activeTab = ref('basic')
const currentTeacher = ref(null)

// Mock Data
const teachers = [
  {
    id: 1,
    name: '张教授',
    employeeId: 'T2005001',
    department: '计算机科学与技术学院',
    title: '教授',
    status: '在职',
    joinDate: '2005-09-01',
    gender: '男',
    ethnicity: '汉族',
    birthDate: '1975-05-20',
    idCard: '11010119750520xxxx',
    politics: '中共党员',
    phone: '13800138000',
    email: 'zhang@university.edu.cn',
    address: '教工宿舍3号楼501',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    education: [
      { period: '1993-1997', school: '北京大学', major: '计算机科学', degree: '学士' },
      { period: '1997-2000', school: '清华大学', major: '计算机体系结构', degree: '硕士' },
      { period: '2000-2004', school: 'MIT', major: '人工智能', degree: '博士' }
    ],
    workHistory: [
      { period: '2005-至今', company: '本校', position: '教授' },
      { period: '2004-2005', company: 'Google', position: '研究员' }
    ],
    contracts: [
      { type: '无固定期限', startDate: '2015-09-01', endDate: '长期', status: '有效' },
      { type: '固定期限', startDate: '2010-09-01', endDate: '2015-08-31', status: '已过期' }
    ],
    research: [
      { name: '基于深度学习的图像识别研究', type: '课题', date: '2022-01', role: '负责人' },
      { name: 'Advanced AI Algorithms', type: '论文', date: '2023-05', role: '第一作者' }
    ],
    assessments: [
      { year: '2023', result: '优秀', remarks: '科研成果突出' },
      { year: '2022', result: '合格', remarks: '' }
    ],
    family: [
      { relation: '配偶', name: '李女士', workplace: '市中心医院', phone: '13900139000', emergency: true },
      { relation: '子女', name: '张小明', workplace: '在读学生', phone: '', emergency: false }
    ]
  },
  {
    id: 2,
    name: '李讲师',
    employeeId: 'T2018005',
    department: '软件学院',
    title: '讲师',
    status: '在职',
    joinDate: '2018-07-15',
    gender: '女',
    ethnicity: '汉族',
    birthDate: '1990-03-12',
    idCard: '32010219900312xxxx',
    politics: '群众',
    phone: '13612345678',
    email: 'li@university.edu.cn',
    address: '青年公寓B栋1202',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    education: [
      { period: '2008-2012', school: '南京大学', major: '软件工程', degree: '学士' },
      { period: '2012-2018', school: '南京大学', major: '软件工程', degree: '博士' }
    ],
    workHistory: [
      { period: '2018-至今', company: '本校', position: '讲师' }
    ],
    contracts: [
      { type: '固定期限', startDate: '2021-07-15', endDate: '2024-07-14', status: '有效' },
      { type: '固定期限', startDate: '2018-07-15', endDate: '2021-07-14', status: '已过期' }
    ],
    research: [],
    assessments: [
      { year: '2023', result: '合格', remarks: '' }
    ],
    family: [
      { relation: '父亲', name: '李父', workplace: '退休', phone: '13500000001', emergency: true }
    ]
  }
]

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers
  const query = searchQuery.value.toLowerCase()
  return teachers.filter(t => 
    t.name.includes(query) || 
    t.employeeId.includes(query) || 
    t.department.includes(query)
  )
})

const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleExport = () => {
  ElMessage.success('正在导出Excel...')
}

const handleAdd = () => {
  ElMessage.info('打开新建档案向导')
}

const viewDetail = (row) => {
  currentTeacher.value = row
  activeTab.value = 'basic'
  detailVisible.value = true
}

const handleEdit = (row) => {
  ElMessage.info(`编辑 ${row.name} 的档案信息`)
}

const handleArchive = (row) => {
  ElMessage.warning(`归档 ${row.name} 的档案`)
}

const getAssessmentTag = (result) => {
  const map = {
    '优秀': 'success',
    '合格': 'primary',
    '基本合格': 'warning',
    '不合格': 'danger'
  }
  return map[result] || 'info'
}
</script>

<style scoped>
.teacher-archive {
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

.stat-footer .success { color: #67C23A; }
.stat-footer .warning { color: #E6A23C; }
.stat-footer .danger { color: #F56C6C; }
.stat-footer .info { color: #909399; }

.action-card {
  cursor: pointer;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.timeline-section {
  padding: 10px;
}

.timeline-section h4 {
  margin-bottom: 15px;
  color: #303133;
}
</style>
