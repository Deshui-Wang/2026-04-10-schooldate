<template>
  <div class="reporting-forms">
    <div class="section-header">
      <h3>全部上报表单（共98张）</h3>
      <p>职业院校数字基座高职数据标准及接口规范</p>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card">
      <div class="card-header">
        <div class="left-panel">
          <el-input
            v-model="searchQuery"
            placeholder="搜索表单名称/编号"
            style="width: 250px; margin-right: 15px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-select v-model="filterSource" placeholder="部门" style="width: 150px; margin-right: 15px" clearable>
            <el-option v-for="dept in sources" :key="dept" :label="dept" :value="dept" />
          </el-select>
          <el-select v-model="filterPullStatus" placeholder="拉取状态" style="width: 150px; margin-right: 15px" clearable>
            <el-option label="数据待入库" value="数据待入库" />
            <el-option label="部分字段映射中" value="部分字段映射中" />
            <el-option label="数据拉取成功" value="数据拉取成功" />
          </el-select>
          <el-select v-model="filterReportStatus" placeholder="上报状态" style="width: 150px; margin-right: 15px" clearable>
            <el-option label="正常上报中" value="正常上报中" />
            <el-option label="上报缓慢" value="上报缓慢" />
          </el-select>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        <div class="right-panel">
          <el-button type="primary" @click="handleSourceConfig" style="margin-right: 10px">
            <el-icon><Setting /></el-icon>
            表单来源配置
          </el-button>
          <el-button type="primary" @click="handleSync">
            <el-icon><Refresh /></el-icon>
            同步表单
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 表单列表 -->
    <el-card class="table-card">
      <el-table :data="filteredForms" stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" min-width="50" align="center" />
        <el-table-column prop="tableNum" label="表单编号" min-width="100" align="center" />
        <el-table-column prop="displayName" label="表单名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="subset" label="数据子集" min-width="120" show-overflow-tooltip />
        <el-table-column prop="category" label="数据类" min-width="120" show-overflow-tooltip />
        <el-table-column prop="source" label="数据来源/部门" min-width="120" show-overflow-tooltip />
        <el-table-column prop="pullStatus" label="数据拉取状态" min-width="130" align="center">
          <template #default="scope">
            <el-tag size="small" :type="getPullStatusType(scope.row.pullStatus)">
              {{ scope.row.pullStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportStatus" label="数据上报状态" min-width="130" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.reportStatus && scope.row.reportStatus !== '-'" size="small" :type="getReportStatusType(scope.row.reportStatus)">
              {{ scope.row.reportStatus }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="上报频率" min-width="100" align="center">
          <template #default="scope">
            <el-tag size="small" effect="plain">{{ scope.row.frequency }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="scope" label="上报范围" min-width="100" align="center" />
        <el-table-column prop="method" label="上报方式" min-width="100" align="center">
          <template #default="scope">
            <el-tag size="small" :type="scope.row.method === '自动抓取' ? 'success' : 'warning'">
              {{ scope.row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="handleView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>


    </el-card>

    <!-- 表单详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="currentForm?.displayName"
      size="50%"
    >
      <div v-if="currentForm" class="form-detail">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="表单编号">{{ currentForm.tableNum }}</el-descriptions-item>
          <el-descriptions-item label="表单名称">{{ currentForm.displayName }}</el-descriptions-item>
          <el-descriptions-item label="数据子集">{{ currentForm.subset }}</el-descriptions-item>
          <el-descriptions-item label="数据类">{{ currentForm.category }}</el-descriptions-item>
          <el-descriptions-item label="数据来源">{{ currentForm.source }}</el-descriptions-item>
          <el-descriptions-item label="上报频率">{{ currentForm.frequency }}</el-descriptions-item>
          <el-descriptions-item label="上报范围">{{ currentForm.scope }}</el-descriptions-item>
          <el-descriptions-item label="上报方式">{{ currentForm.method }}</el-descriptions-item>
          <el-descriptions-item label="数据拉取状态">
            <el-tag :type="getPullStatusType(currentForm.pullStatus)">{{ currentForm.pullStatus }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据上报状态">
            <el-tag v-if="currentForm.reportStatus && currentForm.reportStatus !== '-'" :type="getReportStatusType(currentForm.reportStatus)">
              {{ currentForm.reportStatus }}
            </el-tag>
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h4>包含字段</h4>
        <el-table :data="currentForm.fields" border style="margin-top: 10px">
          <el-table-column prop="code" label="字段代码" width="150" />
          <el-table-column prop="displayName" label="字段名称" width="150" />
          <el-table-column prop="type" label="类型" width="80" align="center" />
          <el-table-column prop="length" label="长度" width="80" align="center" />
          <el-table-column prop="constraint" label="约束" width="80" align="center" />
          <el-table-column prop="explanation" label="说明" show-overflow-tooltip />
        </el-table>
      </div>
    </el-drawer>

    <!-- 部门调整弹窗 -->
    <el-dialog
      v-model="deptDialogVisible"
      title="调整数据来源/部门"
      width="400px"
    >
      <el-form :model="deptForm" label-width="80px">
        <el-form-item label="当前部门">
          <el-input v-model="deptForm.currentDept" disabled />
        </el-form-item>
        <el-form-item label="新部门">
          <el-select v-model="deptForm.newDept" placeholder="请选择新部门" style="width: 100%">
            <el-option v-for="dept in sources" :key="dept" :label="dept" :value="dept" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deptDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveDeptChange">确认调整</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表单来源配置弹窗 -->
    <el-dialog
      v-model="sourceConfigVisible"
      title="表单来源配置"
      width="800px"
      top="5vh"
    >
      <div class="config-header" style="margin-bottom: 15px;">
        <el-input
          v-model="sourceConfigSearch"
          placeholder="搜索表单名称/编号"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <span style="margin-left: 10px; color: #909399; font-size: 13px;">共 {{ allForms.length }} 张表单，可批量调整不同学校的归属部门</span>
      </div>
      
      <el-table :data="filteredConfigForms" border height="500px" stripe>
        <el-table-column prop="tableNum" label="表单编号" width="120" align="center" />
        <el-table-column prop="displayName" label="表单名称" min-width="200" show-overflow-tooltip />
        <el-table-column label="归属部门" width="200" align="center">
          <template #default="scope">
            <el-select v-model="scope.row.source" size="small" style="width: 100%">
              <el-option v-for="dept in sources" :key="dept" :label="dept" :value="dept" />
            </el-select>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sourceConfigVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveSourceConfig">保存配置</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Setting } from '@element-plus/icons-vue'
import tablesData from './complete_98_tables.json'

const loading = ref(false)
const searchQuery = ref('')
const filterPullStatus = ref('')
const filterReportStatus = ref('')
const filterSource = ref('')
const total = ref(0)
const drawerVisible = ref(false)
const currentForm = ref(null)

// 部门调整相关
const deptDialogVisible = ref(false)
const deptForm = reactive({
  currentDept: '',
  newDept: '',
  row: null
})

// 表单来源配置相关
const sourceConfigVisible = ref(false)
const sourceConfigSearch = ref('')

const filteredConfigForms = computed(() => {
  if (!sourceConfigSearch.value) return allForms.value
  const query = sourceConfigSearch.value.toLowerCase()
  return allForms.value.filter(item => 
    item.displayName.toLowerCase().includes(query) || 
    item.tableNum.toString().includes(query)
  )
})

const allForms = ref([])

// 辅助函数：生成随机元数据以丰富展示效果
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

const subsets = ['公共数据子集', '教学数据子集', '科研数据子集', '人事数据子集', '学生数据子集', '资产数据子集']
const categories = ['基础数据', '业务数据', '统计数据', '监测数据']
const sources = ['教务处', '人事处', '学工处', '科研处', '资产处', '信息中心']
const frequencies = ['每日', '每周', '每月', '每学期', '每年', '实时']
const methods = ['接口对接', '自动抓取', '文件导入', '手工填报']
const pullStatuses = ['数据待入库', '部分字段映射中', '数据拉取成功']
const reportStatuses = ['正常上报中', '上报缓慢']

// 辅助函数：从字段代码中提取表单编号（字母前缀）
const getFormNumber = (fields) => {
  if (!fields || fields.length === 0) return ''
  
  // 过滤掉通用字段 (主键、学校代码等)
  // ZYGXX010101: 主键
  // JCXX...: 基础信息/学校代码
  const validFields = fields.filter(f => 
    f.code !== 'ZYGXX010101' && 
    !f.code.startsWith('JCXX')
  )
  
  // 如果过滤后还有字段，取第一个；否则取原始字段第一个
  const targetField = validFields.length > 0 ? validFields[0] : fields[0]
  
  // 提取第一个连续的大写字母序列（忽略前面的中文、换行符等干扰字符）
  const match = targetField.code.match(/[A-Z]+/)
  return match ? match[0] : targetField.code
}

// 初始化数据
onMounted(() => {
  if (tablesData && tablesData.tables) {
    allForms.value = tablesData.tables.map(table => {
      const pullStatus = getRandomItem(pullStatuses)
      let reportStatus = '-'
      if (pullStatus === '数据拉取成功') {
        reportStatus = getRandomItem(reportStatuses)
      }
      return {
        tableNum: getFormNumber(table.fields), // 使用提取的字母前缀作为编号
        displayName: table.displayName || table.tableName,
        // 由于JSON中缺少以下字段，这里使用随机生成或默认值来模拟真实效果
        subset: getRandomItem(subsets),
        category: getRandomItem(categories),
        source: getRandomItem(sources),
        frequency: getRandomItem(frequencies),
        scope: "全校",
        method: getRandomItem(methods),
        pullStatus,
        reportStatus,
        fields: table.fields
      }
    })
    total.value = allForms.value.length
  }
})

// 计算属性：过滤和分页
const filteredForms = computed(() => {
  let result = allForms.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.displayName.toLowerCase().includes(query) || 
      item.tableNum.toString().includes(query)
    )
  }

  if (filterPullStatus.value) {
    result = result.filter(item => item.pullStatus === filterPullStatus.value)
  }

  if (filterReportStatus.value) {
    result = result.filter(item => item.reportStatus === filterReportStatus.value)
  }

  if (filterSource.value) {
    result = result.filter(item => item.source === filterSource.value)
  }

  total.value = result.length
  
  return result
})

// 方法
const handleSearch = () => {
  ElMessage.success('查询完成')
}

const handleSync = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success(`成功同步 ${allForms.value.length} 张表单结构`)
  }, 1000)
}

const handleSourceConfig = () => {
  sourceConfigVisible.value = true
}

const handleSaveSourceConfig = () => {
  sourceConfigVisible.value = false
  ElMessage.success('表单来源配置已保存')
}

const getPullStatusType = (status) => {
  const map = {
    '数据拉取成功': 'success',
    '部分字段映射中': 'warning',
    '数据待入库': 'info'
  }
  return map[status] || ''
}

const getReportStatusType = (status) => {
  const map = {
    '正常上报中': 'success',
    '上报缓慢': 'danger'
  }
  return map[status] || ''
}

const handleView = (row) => {
  currentForm.value = row
  drawerVisible.value = true
}

const handleEditDept = (row) => {
  deptForm.row = row
  deptForm.currentDept = row.source
  deptForm.newDept = ''
  deptDialogVisible.value = true
}

const saveDeptChange = () => {
  if (!deptForm.newDept) {
    ElMessage.warning('请选择新部门')
    return
  }
  
  // 更新数据
  if (deptForm.row) {
    deptForm.row.source = deptForm.newDept
    ElMessage.success(`已将表单 "${deptForm.row.displayName}" 的部门调整为 ${deptForm.newDept}`)
  }
  
  deptDialogVisible.value = false
}
</script>

<style scoped>
.reporting-forms {
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

.search-card {
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

.table-card {
  margin-bottom: 20px;
}



.form-detail {
  padding: 20px;
}
</style>
