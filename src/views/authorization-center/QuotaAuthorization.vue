<template>
  <div class="quota-authorization">
    <div class="section-header">
      <h3>额度授权</h3>
      <p>管理教师的大模型Token额度授权与使用情况</p>
    </div>

    <!-- 额度统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ quotaStats.authorizedTeachers }}</div>
            <div class="stat-label">已授权教师</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ formatToken(quotaStats.totalAllocated) }}</div>
            <div class="stat-label">总发放额度 (Tokens)</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ formatToken(quotaStats.totalUsed) }}</div>
            <div class="stat-label">总消耗额度 (Tokens)</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ quotaStats.usageRate }}%</div>
            <div class="stat-label">平均使用率</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 教师额度列表 -->
    <el-card class="apps-card">
      <template #header>
        <div class="card-header">
          <span>教师额度列表</span>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索教师姓名/工号"
              style="width: 200px; margin-right: 10px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="grantQuota">
              <el-icon><Plus /></el-icon>
              新增授权
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredTeachers" stripe style="width: 100%">
        <el-table-column prop="name" label="教师姓名" min-width="100" />
        <el-table-column prop="employeeId" label="工号" min-width="100" />
        <el-table-column prop="department" label="所属部门" min-width="120" show-overflow-tooltip />
        <el-table-column prop="totalQuota" label="总额度" min-width="120">
          <template #default="scope">
            {{ formatToken(scope.row.totalQuota) }}
          </template>
        </el-table-column>
        <el-table-column prop="usedQuota" label="已用额度" min-width="120">
          <template #default="scope">
            {{ formatToken(scope.row.usedQuota) }}
          </template>
        </el-table-column>
        <el-table-column label="使用进度" min-width="150">
          <template #default="scope">
            <el-progress 
              :percentage="calculatePercentage(scope.row.usedQuota, scope.row.totalQuota)" 
              :status="getProgressStatus(scope.row.usedQuota, scope.row.totalQuota)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastGrantDate" label="最近授权" min-width="120" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="viewHistory(scope.row)">记录</el-button>
            <el-button size="small" type="primary" @click="adjustQuota(scope.row)">调整</el-button>
            <el-button size="small" type="danger" @click="revokeQuota(scope.row)">回收</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 额度调整对话框 -->
    <el-dialog
      v-model="adjustDialogVisible"
      :title="`调整额度 - ${selectedTeacher?.name}`"
      width="500px"
    >
      <el-form v-if="selectedTeacher" :model="adjustForm" label-width="100px">
        <el-form-item label="当前额度">
          <span>{{ formatToken(selectedTeacher.totalQuota) }} Tokens</span>
        </el-form-item>
        <el-form-item label="调整类型">
          <el-radio-group v-model="adjustForm.type">
            <el-radio label="add">增加</el-radio>
            <el-radio label="reduce">减少</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量">
          <el-input-number v-model="adjustForm.amount" :min="1000" :step="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="adjustForm.remark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="adjustDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdjust">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

export default {
  name: 'QuotaAuthorization',
  components: { Search, Plus },
  setup() {
    const adjustDialogVisible = ref(false)
    const selectedTeacher = ref(null)
    const searchQuery = ref('')
    
    const adjustForm = reactive({
      type: 'add',
      amount: 10000,
      remark: ''
    })

    const quotaStats = ref({
      authorizedTeachers: 45,
      totalAllocated: 50000000,
      totalUsed: 12500000,
      usageRate: 25
    })

    const teachers = ref([
      {
        id: 1,
        name: '张老师',
        employeeId: 'T2024001',
        department: '计算机科学与技术学院',
        totalQuota: 1000000,
        usedQuota: 450000,
        status: '正常',
        lastGrantDate: '2024-03-01'
      },
      {
        id: 2,
        name: '李教授',
        employeeId: 'T2024002',
        department: '人工智能研究院',
        totalQuota: 5000000,
        usedQuota: 4800000,
        status: '额度不足',
        lastGrantDate: '2024-02-15'
      },
      {
        id: 3,
        name: '王讲师',
        employeeId: 'T2024003',
        department: '软件学院',
        totalQuota: 500000,
        usedQuota: 12000,
        status: '正常',
        lastGrantDate: '2024-03-10'
      },
      {
        id: 4,
        name: '赵老师',
        employeeId: 'T2024004',
        department: '大数据学院',
        totalQuota: 2000000,
        usedQuota: 1980000,
        status: '已耗尽',
        lastGrantDate: '2024-01-20'
      },
      {
        id: 5,
        name: '钱老师',
        employeeId: 'T2024005',
        department: '网络空间安全学院',
        totalQuota: 1000000,
        usedQuota: 100000,
        status: '正常',
        lastGrantDate: '2024-03-05'
      }
    ])

    const filteredTeachers = computed(() => {
      if (!searchQuery.value) return teachers.value
      const query = searchQuery.value.toLowerCase()
      return teachers.value.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.employeeId.toLowerCase().includes(query)
      )
    })

    const formatToken = (num) => {
      return num.toLocaleString()
    }

    const calculatePercentage = (used, total) => {
      if (!total) return 0
      return Math.min(Math.round((used / total) * 100), 100)
    }

    const getProgressStatus = (used, total) => {
      const percentage = calculatePercentage(used, total)
      if (percentage >= 90) return 'exception'
      if (percentage >= 75) return 'warning'
      return 'success'
    }

    const getStatusType = (status) => {
      const types = {
        '正常': 'success',
        '额度不足': 'warning',
        '已耗尽': 'danger',
        '已冻结': 'info'
      }
      return types[status] || 'info'
    }

    const grantQuota = () => {
      ElMessage.info('新增授权功能开发中...')
    }

    const viewHistory = (row) => {
      ElMessage.info(`查看 ${row.name} 的使用记录`)
    }

    const adjustQuota = (row) => {
      selectedTeacher.value = row
      adjustForm.type = 'add'
      adjustForm.amount = 10000
      adjustForm.remark = ''
      adjustDialogVisible.value = true
    }

    const confirmAdjust = () => {
      if (!selectedTeacher.value) return
      
      const teacher = teachers.value.find(t => t.id === selectedTeacher.value.id)
      if (teacher) {
        if (adjustForm.type === 'add') {
          teacher.totalQuota += adjustForm.amount
          ElMessage.success(`已为 ${teacher.name} 增加 ${formatToken(adjustForm.amount)} Tokens`)
        } else {
          teacher.totalQuota = Math.max(0, teacher.totalQuota - adjustForm.amount)
          ElMessage.success(`已为 ${teacher.name} 减少 ${formatToken(adjustForm.amount)} Tokens`)
        }
      }
      adjustDialogVisible.value = false
    }

    const revokeQuota = (row) => {
      ElMessageBox.confirm(
        `确定要回收 "${row.name}" 的所有额度授权吗？`,
        '确认回收',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = teachers.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          teachers.value[index].status = '已冻结'
          teachers.value[index].totalQuota = 0
          ElMessage.success('额度已回收')
        }
      })
    }

    return {
      adjustDialogVisible,
      selectedTeacher,
      searchQuery,
      adjustForm,
      quotaStats,
      filteredTeachers,
      formatToken,
      calculatePercentage,
      getProgressStatus,
      getStatusType,
      grantQuota,
      viewHistory,
      adjustQuota,
      confirmAdjust,
      revokeQuota
    }
  }
}
</script>

<style scoped>
.quota-authorization {
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

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.apps-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-actions {
  display: flex;
  align-items: center;
}

.card-header .el-icon {
  margin-right: 8px;
}
</style>
