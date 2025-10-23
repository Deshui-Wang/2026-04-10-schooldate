<template>
  <div class="app-authorization">
    <div class="section-header">
      <h3>应用授权</h3>
      <p>管理已安装应用的授权和权限</p>
    </div>

    <!-- 授权统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ authStats.totalApps }}</div>
            <div class="stat-label">已安装应用</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ authStats.activeApps }}</div>
            <div class="stat-label">已授权应用</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ authStats.expiredApps }}</div>
            <div class="stat-label">即将过期</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ authStats.totalUsers }}</div>
            <div class="stat-label">授权用户数</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 应用授权列表 -->
    <el-card class="apps-card">
      <template #header>
        <div class="card-header">
          <span>应用授权列表</span>
          <el-button type="primary" @click="addAuthorization">
            <el-icon><Plus /></el-icon>
            添加授权
          </el-button>
        </div>
      </template>

      <el-table :data="authorizations" stripe>
        <el-table-column prop="appName" label="应用名称" width="200" />
        <el-table-column prop="version" label="版本" width="120" />
        <el-table-column prop="licenseType" label="授权类型" width="120">
          <template #default="scope">
            <el-tag :type="getLicenseType(scope.row.licenseType)">
              {{ scope.row.licenseType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="用户数" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="installDate" label="安装日期" width="120" />
        <el-table-column prop="expireDate" label="到期日期" width="120" />
        <el-table-column prop="lastUsed" label="最后使用" width="150" />
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="viewDetails(scope.row)">详情</el-button>
            <el-button size="small" type="success" @click="renewAuth(scope.row)">续费</el-button>
            <el-button size="small" type="warning" @click="manageUsers(scope.row)">用户</el-button>
            <el-button size="small" type="danger" @click="revokeAuth(scope.row)">撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 用户权限管理对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="`${selectedApp?.appName} - 用户权限管理`"
      width="800px"
    >
      <div v-if="selectedApp" class="user-management">
        <div class="user-stats">
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ selectedApp.userCount }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ selectedApp.activeUsers }}</div>
                <div class="stat-label">活跃用户</div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <div class="stat-number">{{ selectedApp.maxUsers }}</div>
                <div class="stat-label">最大用户数</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <el-divider />

        <div class="user-list">
          <div class="list-header">
            <span>用户列表</span>
            <el-button type="primary" size="small" @click="addUser">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
          </div>
          
          <el-table :data="selectedApp.users" stripe>
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="role" label="角色" width="120">
              <template #default="scope">
                <el-tag :type="getRoleType(scope.row.role)">
                  {{ scope.row.role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="permissions" label="权限" width="200">
              <template #default="scope">
                <el-tag
                  v-for="permission in scope.row.permissions"
                  :key="permission"
                  size="small"
                  style="margin-right: 5px;"
                >
                  {{ permission }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastLogin" label="最后登录" width="150" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="removeUser(scope.row)">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AppAuthorization',
  setup() {
    const userDialogVisible = ref(false)
    const selectedApp = ref(null)

    const authStats = ref({
      totalApps: 8,
      activeApps: 6,
      expiredApps: 2,
      totalUsers: 156
    })

    const authorizations = ref([
      {
        id: 1,
        appName: '在线考试系统',
        version: 'v2.1.0',
        licenseType: '年度授权',
        userCount: 50,
        status: '已授权',
        installDate: '2024-01-01',
        expireDate: '2025-01-01',
        lastUsed: '2024-01-15 10:30',
        activeUsers: 45,
        maxUsers: 100,
        users: [
          {
            username: 'admin',
            name: '管理员',
            role: '管理员',
            permissions: ['全部权限'],
            lastLogin: '2024-01-15 09:30'
          },
          {
            username: 'teacher001',
            name: '张老师',
            role: '教师',
            permissions: ['创建考试', '查看成绩', '导出报告'],
            lastLogin: '2024-01-15 08:45'
          },
          {
            username: 'teacher002',
            name: '李老师',
            role: '教师',
            permissions: ['创建考试', '查看成绩'],
            lastLogin: '2024-01-14 16:20'
          }
        ]
      },
      {
        id: 2,
        appName: '智能排课系统',
        version: 'v3.0.1',
        licenseType: '永久授权',
        userCount: 20,
        status: '已授权',
        installDate: '2024-01-05',
        expireDate: '永久',
        lastUsed: '2024-01-15 09:15',
        activeUsers: 18,
        maxUsers: 50,
        users: [
          {
            username: 'admin',
            name: '管理员',
            role: '管理员',
            permissions: ['全部权限'],
            lastLogin: '2024-01-15 09:15'
          },
          {
            username: 'scheduler',
            name: '排课员',
            role: '排课员',
            permissions: ['排课管理', '课表查看'],
            lastLogin: '2024-01-15 08:30'
          }
        ]
      },
      {
        id: 3,
        appName: '在线学习平台',
        version: 'v4.2.0',
        licenseType: '年度授权',
        userCount: 200,
        status: '即将过期',
        installDate: '2023-01-10',
        expireDate: '2024-01-20',
        lastUsed: '2024-01-14 15:45',
        activeUsers: 180,
        maxUsers: 300,
        users: []
      }
    ])

    const getLicenseType = (type) => {
      const types = {
        '年度授权': 'primary',
        '永久授权': 'success',
        '按需付费': 'warning'
      }
      return types[type] || 'info'
    }

    const getStatusType = (status) => {
      const types = {
        '已授权': 'success',
        '即将过期': 'warning',
        '已过期': 'danger',
        '已撤销': 'info'
      }
      return types[status] || 'info'
    }

    const getRoleType = (role) => {
      const types = {
        '管理员': 'danger',
        '教师': 'primary',
        '学生': 'success',
        '排课员': 'warning'
      }
      return types[role] || 'info'
    }

    const addAuthorization = () => {
      ElMessage.info('添加授权功能开发中...')
    }

    const viewDetails = (row) => {
      ElMessage.info(`查看 ${row.appName} 的详细信息`)
    }

    const renewAuth = (row) => {
      ElMessage.success(`正在为 ${row.appName} 续费...`)
    }

    const manageUsers = (row) => {
      selectedApp.value = row
      userDialogVisible.value = true
    }

    const revokeAuth = (row) => {
      ElMessageBox.confirm(
        `确定要撤销 "${row.appName}" 的授权吗？`,
        '确认撤销',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = authorizations.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          authorizations.value[index].status = '已撤销'
          ElMessage.success('授权已撤销')
        }
      })
    }

    const addUser = () => {
      ElMessage.info('添加用户功能开发中...')
    }

    const editUser = (row) => {
      ElMessage.info(`编辑用户 ${row.name} 的权限`)
    }

    const removeUser = (row) => {
      ElMessageBox.confirm(
        `确定要移除用户 "${row.name}" 吗？`,
        '确认移除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success('用户已移除')
      })
    }

    return {
      userDialogVisible,
      selectedApp,
      authStats,
      authorizations,
      getLicenseType,
      getStatusType,
      getRoleType,
      addAuthorization,
      viewDetails,
      renewAuth,
      manageUsers,
      revokeAuth,
      addUser,
      editUser,
      removeUser
    }
  }
}
</script>

<style scoped>
.app-authorization {
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

.card-header .el-icon {
  margin-right: 8px;
}

.user-management {
  padding: 0;
}

.user-stats {
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-item .stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.stat-item .stat-label {
  font-size: 12px;
  color: #606266;
}

.user-list {
  margin-top: 20px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.list-header .el-icon {
  margin-right: 5px;
}
</style>
