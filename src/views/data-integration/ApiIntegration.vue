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
        <el-table-column prop="name" label="配置名称" min-width="120" />
        <el-table-column prop="url" label="API地址" min-width="130" />
        <el-table-column prop="method" label="请求方法" min-width="120">
          <template #default="scope">
            <el-tag :type="getMethodType(scope.row.method)">
              {{ scope.row.method }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authType" label="认证方式" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastSync" label="最后同步" min-width="130" />
        <el-table-column label="操作" width="200" fixed="right">
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
      width="700px"
      class="api-config-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon><Setting /></el-icon>
          </div>
          <div class="header-title">
            <h3>{{ isEdit ? '编辑API配置' : '添加API配置' }}</h3>
            <p>{{ isEdit ? '修改API接口配置信息' : '配置新的API接口对接规则' }}</p>
          </div>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="api-form">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>基本信息</span>
            </div>
            <el-form-item label="配置名称" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入配置名称，如：学生信息API"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="API地址" prop="url">
              <el-input 
                v-model="form.url" 
                placeholder="请输入完整的API地址，如：https://api.example.com/v1/data"
                clearable
              >
                <template #prefix>
                  <el-icon><Link /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="请求方法" prop="method">
              <el-select 
                v-model="form.method" 
                placeholder="请选择请求方法"
                style="width: 100%"
              >
                <el-option label="GET" value="GET">
                  <span style="float: left">
                    <el-tag type="success" size="small" style="margin-right: 8px">GET</el-tag>
                    <span>获取数据</span>
                  </span>
                </el-option>
                <el-option label="POST" value="POST">
                  <span style="float: left">
                    <el-tag type="primary" size="small" style="margin-right: 8px">POST</el-tag>
                    <span>创建数据</span>
                  </span>
                </el-option>
                <el-option label="PUT" value="PUT">
                  <span style="float: left">
                    <el-tag type="warning" size="small" style="margin-right: 8px">PUT</el-tag>
                    <span>更新数据</span>
                  </span>
                </el-option>
                <el-option label="DELETE" value="DELETE">
                  <span style="float: left">
                    <el-tag type="danger" size="small" style="margin-right: 8px">DELETE</el-tag>
                    <span>删除数据</span>
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 认证与同步 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Lock /></el-icon>
              <span>认证与同步</span>
            </div>
            <el-form-item label="认证方式" prop="authType">
              <el-select 
                v-model="form.authType" 
                placeholder="请选择认证方式"
                style="width: 100%"
              >
                <el-option label="无认证" value="none">
                  <span style="float: left">无认证</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">公开接口</span>
                </el-option>
                <el-option label="API Key" value="apikey">
                  <span style="float: left">API Key</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">密钥认证</span>
                </el-option>
                <el-option label="OAuth 2.0" value="oauth2">
                  <span style="float: left">OAuth 2.0</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">令牌认证</span>
                </el-option>
                <el-option label="Basic Auth" value="basic">
                  <span style="float: left">Basic Auth</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">基础认证</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="同步频率" prop="syncFrequency">
              <el-select 
                v-model="form.syncFrequency" 
                placeholder="请选择同步频率"
                style="width: 100%"
              >
                <el-option label="实时" value="realtime">
                  <span style="float: left">实时同步</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">数据变更即时同步</span>
                </el-option>
                <el-option label="每分钟" value="1min">
                  <span style="float: left">每分钟</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">每60秒同步一次</span>
                </el-option>
                <el-option label="每小时" value="1hour">
                  <span style="float: left">每小时</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">每60分钟同步一次</span>
                </el-option>
                <el-option label="每天" value="1day">
                  <span style="float: left">每天</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">每24小时同步一次</span>
                </el-option>
              </el-select>
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
                placeholder="请输入API配置的描述信息，包括用途、注意事项等"
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
import { Setting, Document, Lock, InfoFilled, Check, Edit, Link } from '@element-plus/icons-vue'

export default {
  name: 'ApiIntegration',
  components: {
    Setting,
    Document,
    Lock,
    InfoFilled,
    Check,
    Edit,
    Link
  },
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

/* 对话框样式优化 */
:deep(.api-config-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.api-config-dialog .el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.api-config-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.api-config-dialog .el-dialog__footer) {
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

.api-form {
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

:deep(.api-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.api-form .el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 16px;
}

:deep(.api-form .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.api-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.api-form .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.api-form .el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.api-form .el-textarea__inner) {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.api-form .el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.api-form .el-textarea__inner:focus) {
  border-color: #409eff;
}

:deep(.api-form .el-input__prefix) {
  color: #909399;
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
