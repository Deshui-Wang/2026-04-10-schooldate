<template>
  <div class="api-integration">
    <div class="section-header">
      <h3>API接口对接</h3>
      <p>配置和管理外部API接口对接规则</p>
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
          title="API接口对接规则"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul>
              <li>支持RESTful API和GraphQL接口对接</li>
              <li>支持OAuth 2.0、API Key等认证方式</li>
              <li>支持数据格式转换和字段映射</li>
              <li>支持定时同步和实时推送</li>
              <li>提供接口调用日志和监控</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- API配置列表 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>API配置列表</span>
          <el-button type="primary" @click="addApiConfig">
            <el-icon><Plus /></el-icon>
            添加API配置
          </el-button>
        </div>
      </template>

      <el-table :data="apiConfigs" stripe>
        <el-table-column prop="name" label="配置名称" width="200" />
        <el-table-column prop="url" label="API地址" width="300" />
        <el-table-column prop="method" label="请求方法" width="100">
          <template #default="scope">
            <el-tag :type="getMethodType(scope.row.method)">
              {{ scope.row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authType" label="认证方式" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastSync" label="最后同步" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editConfig(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="testConnection(scope.row)">测试</el-button>
            <el-button size="small" type="danger" @click="deleteConfig(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑API配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑API配置' : '添加API配置'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="API地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入API地址" />
        </el-form-item>
        <el-form-item label="请求方法" prop="method">
          <el-select v-model="form.method" placeholder="请选择请求方法">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="认证方式" prop="authType">
          <el-select v-model="form.authType" placeholder="请选择认证方式">
            <el-option label="无认证" value="none" />
            <el-option label="API Key" value="apikey" />
            <el-option label="OAuth 2.0" value="oauth2" />
            <el-option label="Basic Auth" value="basic" />
          </el-select>
        </el-form-item>
        <el-form-item label="同步频率" prop="syncFrequency">
          <el-select v-model="form.syncFrequency" placeholder="请选择同步频率">
            <el-option label="实时" value="realtime" />
            <el-option label="每分钟" value="1min" />
            <el-option label="每小时" value="1hour" />
            <el-option label="每天" value="1day" />
          </el-select>
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
  name: 'ApiIntegration',
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()

    const form = reactive({
      name: '',
      url: '',
      method: 'GET',
      authType: 'none',
      syncFrequency: '1hour',
      description: ''
    })

    const rules = {
      name: [
        { required: true, message: '请输入配置名称', trigger: 'blur' }
      ],
      url: [
        { required: true, message: '请输入API地址', trigger: 'blur' }
      ],
      method: [
        { required: true, message: '请选择请求方法', trigger: 'change' }
      ],
      authType: [
        { required: true, message: '请选择认证方式', trigger: 'change' }
      ]
    }

    const apiConfigs = ref([
      {
        id: 1,
        name: '学生信息API',
        url: 'https://api.school.com/students',
        method: 'GET',
        authType: 'API Key',
        status: 'active',
        lastSync: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '教师信息API',
        url: 'https://api.school.com/teachers',
        method: 'GET',
        authType: 'OAuth 2.0',
        status: 'active',
        lastSync: '2024-01-15 10:25:00'
      },
      {
        id: 3,
        name: '课程信息API',
        url: 'https://api.school.com/courses',
        method: 'POST',
        authType: 'Basic Auth',
        status: 'disabled',
        lastSync: '2024-01-14 16:45:00'
      }
    ])

    const getMethodType = (method) => {
      const types = {
        'GET': 'success',
        'POST': 'primary',
        'PUT': 'warning',
        'DELETE': 'danger'
      }
      return types[method] || 'info'
    }

    const addApiConfig = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editConfig = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const testConnection = (row) => {
      ElMessage.success(`正在测试 ${row.name} 的连接...`)
    }

    const deleteConfig = (row) => {
      ElMessageBox.confirm(
        `确定要删除配置 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = apiConfigs.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          apiConfigs.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        url: '',
        method: 'GET',
        authType: 'none',
        syncFrequency: '1hour',
        description: ''
      })
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            ElMessage.success('更新成功')
          } else {
            const newConfig = {
              id: Date.now(),
              ...form,
              status: 'active',
              lastSync: new Date().toLocaleString()
            }
            apiConfigs.value.unshift(newConfig)
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
      apiConfigs,
      getMethodType,
      addApiConfig,
      editConfig,
      testConnection,
      deleteConfig,
      submitForm
    }
  }
}
</script>

<style scoped>
.api-integration {
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
