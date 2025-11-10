<template>
  <div class="database-connection">
    <div class="section-header">
      <h3>数据库直连</h3>
      <p>配置和管理数据库直连对接规则</p>
    </div>

    <!-- 对接规则说明 -->
    <el-card class="rules-card">
      <template #header>
        <div class="card-header">
          <el-icon><InfoFilled /></el-icon>
          <span>对接规则说明</span>
        </div>
      </template>
      <div class="rules-content">
        <el-alert
          title="数据库直连规则"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul>
              <li>支持MySQL、PostgreSQL、Oracle、SQL Server等主流数据库</li>
              <li>支持连接池管理和连接监控</li>
              <li>支持数据表映射和字段转换</li>
              <li>提供数据同步和增量更新</li>
              <li>支持事务处理和回滚机制</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- 数据库连接配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>数据库连接配置</span>
          <el-button type="primary" @click="addConnection">
            <el-icon><Plus /></el-icon>
            添加连接
          </el-button>
        </div>
      </template>

      <el-table :data="connections" stripe>
        <el-table-column prop="name" label="连接名称" width="200" />
        <el-table-column prop="type" label="数据库类型" width="120">
          <template #default="scope">
            <el-tag :type="getDbTypeColor(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="host" label="主机地址" width="150" />
        <el-table-column prop="port" label="端口" width="80" />
        <el-table-column prop="database" label="数据库名" width="150" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'connected' ? 'success' : 'danger'">
              {{ scope.row.status === 'connected' ? '已连接' : '未连接' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastSync" label="最后同步" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editConnection(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="testConnection(scope.row)">测试</el-button>
            <el-button size="small" type="danger" @click="deleteConnection(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑连接对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑数据库连接' : '添加数据库连接'"
      width="700px"
      class="database-connection-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="header-title">
            <h3>{{ isEdit ? '编辑数据库连接' : '添加数据库连接' }}</h3>
            <p>{{ isEdit ? '修改数据库连接配置信息' : '配置新的数据库连接对接规则' }}</p>
          </div>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="db-form">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>基本信息</span>
            </div>
            <el-form-item label="连接名称" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入连接名称，如：学生数据库"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="数据库类型" prop="type">
              <el-select 
                v-model="form.type" 
                placeholder="请选择数据库类型"
                style="width: 100%"
              >
                <el-option label="MySQL" value="MySQL">
                  <span style="float: left">
                    <el-tag type="success" size="small" style="margin-right: 8px">MySQL</el-tag>
                    <span>MySQL数据库</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">默认端口: 3306</span>
                </el-option>
                <el-option label="PostgreSQL" value="PostgreSQL">
                  <span style="float: left">
                    <el-tag type="primary" size="small" style="margin-right: 8px">PostgreSQL</el-tag>
                    <span>PostgreSQL数据库</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">默认端口: 5432</span>
                </el-option>
                <el-option label="Oracle" value="Oracle">
                  <span style="float: left">
                    <el-tag type="warning" size="small" style="margin-right: 8px">Oracle</el-tag>
                    <span>Oracle数据库</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">默认端口: 1521</span>
                </el-option>
                <el-option label="SQL Server" value="SQL Server">
                  <span style="float: left">
                    <el-tag type="info" size="small" style="margin-right: 8px">SQL Server</el-tag>
                    <span>SQL Server数据库</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">默认端口: 1433</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 连接配置 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Link /></el-icon>
              <span>连接配置</span>
            </div>
            <el-form-item label="主机地址" prop="host">
              <el-input 
                v-model="form.host" 
                placeholder="请输入数据库主机地址，如：192.168.1.100"
                clearable
              >
                <template #prefix>
                  <el-icon><Monitor /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="端口" prop="port">
              <el-input-number 
                v-model="form.port" 
                :min="1" 
                :max="65535"
                placeholder="请输入端口号"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="数据库名" prop="database">
              <el-input 
                v-model="form.database" 
                placeholder="请输入数据库名称"
                clearable
              >
                <template #prefix>
                  <el-icon><Connection /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 认证信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Lock /></el-icon>
              <span>认证信息</span>
            </div>
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="form.username" 
                placeholder="请输入数据库用户名"
                clearable
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="form.password" 
                type="password" 
                placeholder="请输入数据库密码"
                show-password
                clearable
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 其他信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><InfoFilled /></el-icon>
              <span>其他信息</span>
            </div>
            <el-form-item label="描述">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="4"
                placeholder="请输入数据库连接的描述信息，包括用途、注意事项等"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false" size="large">取消</el-button>
          <el-button type="primary" @click="submitForm" size="large">
            <el-icon><Check /></el-icon>
            {{ isEdit ? '保存修改' : '确认添加' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  InfoFilled, 
  Plus, 
  Connection, 
  Document, 
  Edit, 
  Link, 
  Monitor, 
  Lock, 
  User, 
  Check 
} from '@element-plus/icons-vue'

export default {
  name: 'DatabaseConnection',
  components: {
    InfoFilled,
    Plus,
    Connection,
    Document,
    Edit,
    Link,
    Monitor,
    Lock,
    User,
    Check
  },
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()

    const form = reactive({
      name: '',
      type: '',
      host: '',
      port: 3306,
      database: '',
      username: '',
      password: '',
      description: ''
    })

    const rules = {
      name: [
        { required: true, message: '请输入连接名称', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择数据库类型', trigger: 'change' }
      ],
      host: [
        { required: true, message: '请输入主机地址', trigger: 'blur' }
      ],
      port: [
        { required: true, message: '请输入端口', trigger: 'blur' }
      ],
      database: [
        { required: true, message: '请输入数据库名', trigger: 'blur' }
      ],
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }

    const connections = ref([
      {
        id: 1,
        name: '学生数据库',
        type: 'MySQL',
        host: '192.168.1.100',
        port: 3306,
        database: 'student_db',
        status: 'connected',
        lastSync: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '教师数据库',
        type: 'PostgreSQL',
        host: '192.168.1.101',
        port: 5432,
        database: 'teacher_db',
        status: 'connected',
        lastSync: '2024-01-15 10:25:00'
      },
      {
        id: 3,
        name: '课程数据库',
        type: 'Oracle',
        host: '192.168.1.102',
        port: 1521,
        database: 'course_db',
        status: 'disconnected',
        lastSync: '2024-01-14 16:45:00'
      }
    ])

    const getDbTypeColor = (type) => {
      const colors = {
        'MySQL': 'success',
        'PostgreSQL': 'primary',
        'Oracle': 'warning',
        'SQL Server': 'info'
      }
      return colors[type] || 'info'
    }

    const addConnection = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editConnection = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const testConnection = (row) => {
      ElMessage.success(`正在测试 ${row.name} 的连接...`)
    }

    const deleteConnection = (row) => {
      ElMessageBox.confirm(
        `确定要删除连接 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = connections.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          connections.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        type: '',
        host: '',
        port: 3306,
        database: '',
        username: '',
        password: '',
        description: ''
      })
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            ElMessage.success('更新成功')
          } else {
            const newConnection = {
              id: Date.now(),
              ...form,
              status: 'connected',
              lastSync: new Date().toLocaleString()
            }
            connections.value.unshift(newConnection)
            ElMessage.success('添加成功')
          }
          dialogVisible.value = false
          resetForm()
        }
      })
    }

    return {
      dialogVisible,
      isEdit,
      formRef,
      form,
      rules,
      connections,
      getDbTypeColor,
      addConnection,
      editConnection,
      testConnection,
      deleteConnection,
      submitForm
    }
  }
}
</script>

<style scoped>
.database-connection {
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

.rules-card,
.config-card {
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

.rules-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.rules-content li {
  margin: 5px 0;
  color: #606266;
}

/* 对话框样式优化 */
:deep(.database-connection-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.database-connection-dialog .el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.database-connection-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.database-connection-dialog .el-dialog__footer) {
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
}

.dialog-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.header-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.header-icon .el-icon {
  font-size: 24px;
  color: #ffffff;
}

.header-title {
  flex: 1;
}

.header-title h3 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.header-title p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
}

.dialog-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.dialog-content::-webkit-scrollbar {
  width: 6px;
}

.dialog-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.dialog-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.db-form {
  padding: 0;
}

.form-section {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-of-type {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.section-title .el-icon {
  margin-right: 8px;
  color: #409eff;
  font-size: 18px;
}

:deep(.db-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.db-form .el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 16px;
}

:deep(.db-form .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.db-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.db-form .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.db-form .el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.db-form .el-textarea__inner) {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.db-form .el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.db-form .el-textarea__inner:focus) {
  border-color: #409eff;
}

:deep(.db-form .el-input__prefix) {
  color: #909399;
}

:deep(.db-form .el-input-number) {
  width: 100%;
}

:deep(.db-form .el-input-number .el-input__wrapper) {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  min-width: 100px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s;
}

.dialog-footer .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.dialog-footer .el-button--primary:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3d8f 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.dialog-footer .el-button--primary .el-icon {
  margin-right: 4px;
}

/* 下拉选项样式优化 */
:deep(.el-select-dropdown__item) {
  padding: 12px 20px;
  height: auto;
}

:deep(.el-select-dropdown__item:hover) {
  background-color: #f5f7fa;
}
</style>
