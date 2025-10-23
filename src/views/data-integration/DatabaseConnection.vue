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
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="连接名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入连接名称" />
        </el-form-item>
        <el-form-item label="数据库类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择数据库类型">
            <el-option label="MySQL" value="mysql" />
            <el-option label="PostgreSQL" value="postgresql" />
            <el-option label="Oracle" value="oracle" />
            <el-option label="SQL Server" value="sqlserver" />
          </el-select>
        </el-form-item>
        <el-form-item label="主机地址" prop="host">
          <el-input v-model="form.host" placeholder="请输入主机地址" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input-number v-model="form.port" :min="1" :max="65535" />
        </el-form-item>
        <el-form-item label="数据库名" prop="database">
          <el-input v-model="form.database" placeholder="请输入数据库名" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'DatabaseConnection',
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
</style>
