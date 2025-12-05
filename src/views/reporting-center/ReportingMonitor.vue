<template>
  <div class="reporting-monitor">
    <div class="section-header">
      <h3>上报监控</h3>
      <p>实时监控各部门数据上报进度与状态</p>
    </div>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="overview-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ totalForms }}</div>
          <div class="stat-label">总表单数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value success">{{ completedForms }}</div>
          <div class="stat-label">已完成上报</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value warning">{{ inProgressForms }}</div>
          <div class="stat-label">上报进行中</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value danger">{{ abnormalForms }}</div>
          <div class="stat-label">异常/滞后</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <div class="search-container">
        <el-select v-model="searchForm.college" placeholder="按学院搜索" clearable style="width: 200px">
          <el-option v-for="item in collegeOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="searchForm.department" placeholder="按系别搜索" clearable style="width: 200px">
          <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input 
          v-model="searchForm.teacher" 
          placeholder="按教师姓名搜索" 
          clearable 
          style="width: 200px"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <!-- 部门监控卡片 -->
    <el-row :gutter="20">
      <el-col 
        v-for="dept in filteredDepartments" 
        :key="dept.name" 
        :xs="24" :sm="12" :md="8" :lg="6" 
        class="card-col"
      >
        <el-card class="monitor-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="dept-name">{{ dept.name }}</span>
              <el-tag :type="getStatusType(dept.status)" effect="dark" size="small">
                {{ dept.status }}
              </el-tag>
            </div>
          </template>
          
          <div class="card-content">
            <div class="info-item">
              <span class="label">涉及表单</span>
              <span class="value">{{ dept.formCount }} 张</span>
            </div>
            
            <div class="info-item">
              <span class="label">上报进度</span>
              <div class="progress-wrapper">
                <el-progress 
                  :percentage="dept.progress" 
                  :status="getProgressStatus(dept.progress)"
                  :stroke-width="8"
                />
              </div>
            </div>

            <div class="info-item">
              <span class="label">督办负责人</span>
              <div class="avatars">
                <el-tooltip :content="dept.managers[0]" placement="top">
                  <el-avatar :size="24" class="manager-avatar" :style="{ backgroundColor: stringToColor(dept.managers[0]) }">
                    {{ dept.managers[0][0] }}
                  </el-avatar>
                </el-tooltip>
                <el-tooltip :content="dept.managers[1]" placement="top">
                  <el-avatar :size="24" class="manager-avatar" :style="{ backgroundColor: stringToColor(dept.managers[1]) }">
                    {{ dept.managers[1][0] }}
                  </el-avatar>
                </el-tooltip>
                <span class="manager-names">{{ dept.managers.join(', ') }}</span>
              </div>
            </div>
          </div>
          
          <div class="card-footer">
            <el-button type="primary" link size="small" @click="handleDetail(dept)">查看详情</el-button>
            <el-button type="warning" link size="small" @click="handleRemind(dept)">一键催办</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 部门表单详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="currentDept?.name + ' - 上报表单列表'"
      size="60%"
    >
      <el-table :data="currentDeptForms" stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="tableNum" label="表单编号" width="120" align="center" />
        <el-table-column prop="displayName" label="表单名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="frequency" label="上报频率" width="100" align="center">
          <template #default="scope">
            <el-tag size="small" effect="plain">{{ scope.row.frequency }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="上报情况" width="100" align="center">
          <template #default="scope">
            <el-tag size="small" :type="getReportStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default>
            <el-button link type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import tablesData from './complete_98_tables.json'

// 模拟部门数据
const departments = ['教务处', '人事处', '学工处', '科研处', '资产处', '信息中心', '财务处', '团委']
const managersList = [
  ['张伟', '李娜'], ['王强', '刘洋'], ['赵敏', '孙杰'], 
  ['周涛', '吴倩'], ['郑勇', '陈静'], ['林峰', '徐婷'],
  ['马超', '韩梅'], ['朱波', '杨丽']
]

// 搜索相关
const searchForm = reactive({
  college: '',
  department: '',
  teacher: ''
})

const collegeOptions = ['计算机学院', '软件学院', '商学院', '外国语学院', '理学院']
const departmentOptions = ['计算机科学系', '软件工程系', '网络工程系', '大数据系', '人工智能系']

const drawerVisible = ref(false)
const currentDept = ref(null)
const currentDeptForms = ref([])

// 辅助数据
const frequencies = ['每日', '每周', '每月', '每学期', '每年', '实时']
const reportStatuses = ['已上报', '未上报', '逾期', '驳回']

// 辅助函数：从字段代码中提取表单编号（字母前缀）
const getFormNumber = (fields) => {
  if (!fields || fields.length === 0) return ''
  const validFields = fields.filter(f => f.code !== 'ZYGXX010101' && !f.code.startsWith('JCXX'))
  const targetField = validFields.length > 0 ? validFields[0] : fields[0]
  const match = targetField.code.match(/[A-Z]+/)
  return match ? match[0] : targetField.code
}

// 生成随机数据
const departmentStats = ref(departments.map((dept, index) => {
  const formCount = Math.floor(Math.random() * 20) + 5 // 5-25张表单
  const progress = Math.floor(Math.random() * 100)
  
  let status = '正常'
  if (progress < 60) status = '缓慢'
  if (progress < 30) status = '异常'
  
  return {
    name: dept,
    formCount,
    progress,
    status,
    managers: managersList[index % managersList.length]
  }
}))

// 过滤后的部门数据
const filteredDepartments = computed(() => {
  return departmentStats.value.filter(dept => {
    // 模拟搜索逻辑：如果选择了学院或系别，这里简单地假设所有部门都匹配（因为当前Mock数据是行政部门而非教学单位）
    // 实际项目中应根据部门所属的学院/系别进行过滤
    // 这里主要演示教师姓名搜索
    
    // 教师姓名搜索
    if (searchForm.teacher) {
      return dept.managers.some(manager => manager.includes(searchForm.teacher))
    }
    
    // 学院和系别搜索（模拟：如果有选择，则随机返回部分部门以展示过滤效果）
    if (searchForm.college || searchForm.department) {
      return Math.random() > 0.5
    }
    
    return true
  })
})

// 计算总览数据
const totalForms = computed(() => departmentStats.value.reduce((sum, d) => sum + d.formCount, 0))
const completedForms = computed(() => Math.floor(totalForms.value * 0.65)) // 模拟
const inProgressForms = computed(() => Math.floor(totalForms.value * 0.25)) // 模拟
const abnormalForms = computed(() => totalForms.value - completedForms.value - inProgressForms.value)

// 辅助函数
const getStatusType = (status) => {
  const map = {
    '正常': 'success',
    '缓慢': 'warning',
    '异常': 'danger'
  }
  return map[status] || 'info'
}

const getReportStatusType = (status) => {
  const map = {
    '已上报': 'success',
    '未上报': 'info',
    '逾期': 'danger',
    '驳回': 'warning'
  }
  return map[status] || ''
}

const getProgressStatus = (percentage) => {
  if (percentage >= 100) return 'success'
  if (percentage < 60) return 'exception'
  return ''
}

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + "00000".substring(0, 6 - c.length) + c;
}

// 操作处理
const handleSearch = () => {
  ElMessage.success('查询完成')
}

const handleReset = () => {
  searchForm.college = ''
  searchForm.department = ''
  searchForm.teacher = ''
  ElMessage.info('已重置查询条件')
}

const handleDetail = (dept) => {
  currentDept.value = dept
  
  // 从JSON数据中随机抽取 dept.formCount 个表单作为该部门的表单
  if (tablesData && tablesData.tables) {
    // 随机打乱数组
    const shuffled = [...tablesData.tables].sort(() => 0.5 - Math.random())
    // 取前N个
    const selected = shuffled.slice(0, dept.formCount)
    
    currentDeptForms.value = selected.map(table => ({
      tableNum: getFormNumber(table.fields),
      displayName: table.displayName || table.tableName,
      frequency: frequencies[Math.floor(Math.random() * frequencies.length)],
      status: reportStatuses[Math.floor(Math.random() * reportStatuses.length)]
    }))
  }
  
  drawerVisible.value = true
}

const handleRemind = (dept) => {
  ElMessage.success(`已向 ${dept.managers.join('、')} 发送催办提醒`)
}
</script>

<style scoped>
.reporting-monitor {
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

.overview-row {
  margin-bottom: 25px;
}

.stat-card {
  text-align: center;
  padding: 10px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-value.success { color: #67C23A; }
.stat-value.warning { color: #E6A23C; }
.stat-value.danger { color: #F56C6C; }

.stat-label {
  font-size: 13px;
  color: #909399;
}

.search-card {
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  gap: 15px;
  align-items: center;
}

.card-col {
  margin-bottom: 20px;
}

.monitor-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dept-name {
  font-weight: 600;
  font-size: 16px;
}

.card-content {
  flex: 1;
  padding: 10px 0;
}

.info-item {
  margin-bottom: 15px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.info-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.progress-wrapper {
  width: 100%;
}

.avatars {
  display: flex;
  align-items: center;
}

.manager-avatar {
  margin-right: -8px;
  border: 2px solid #fff;
  font-size: 12px;
  color: #fff;
}

.manager-names {
  margin-left: 15px;
  font-size: 13px;
  color: #606266;
}

.card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
  display: flex;
  justify-content: space-between;
}
</style>
