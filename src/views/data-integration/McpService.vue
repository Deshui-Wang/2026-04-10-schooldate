<template>
  <div class="mcp-service">
    <div class="section-header">
      <h3>MCP服务</h3>
      <p>配置和管理MCP服务对接规则</p>
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
          title="MCP服务规则"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul>
              <li>支持MCP（Model Context Protocol）服务对接</li>
              <li>支持AI模型集成和智能数据处理</li>
              <li>支持自然语言查询和数据提取</li>
              <li>提供智能分析和预测功能</li>
              <li>支持多模型切换和负载均衡</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- MCP服务配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>MCP服务配置</span>
          <el-button type="primary" @click="addService">
            <el-icon><Plus /></el-icon>
            添加服务
          </el-button>
        </div>
      </template>

      <el-table :data="mcpServices" stripe>
        <el-table-column prop="name" label="服务名称" width="200" />
        <el-table-column prop="model" label="模型类型" width="150">
          <template #default="scope">
            <el-tag :type="getModelTypeColor(scope.row.model)">
              {{ scope.row.model }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="endpoint" label="服务端点" width="250" />
        <el-table-column prop="apiKey" label="API密钥" width="150">
          <template #default="scope">
            <span>{{ scope.row.apiKey ? '***' + scope.row.apiKey.slice(-4) : '未设置' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastUsed" label="最后使用" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editService(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="testService(scope.row)">测试</el-button>
            <el-button size="small" type="danger" @click="deleteService(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 智能查询测试 -->
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <span>智能查询测试</span>
        </div>
      </template>
      
      <el-form :model="queryForm" label-width="100px">
        <el-form-item label="选择服务">
          <el-select v-model="queryForm.serviceId" placeholder="请选择MCP服务">
            <el-option
              v-for="service in mcpServices"
              :key="service.id"
              :label="service.name"
              :value="service.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="查询内容">
          <el-input
            v-model="queryForm.query"
            type="textarea"
            :rows="4"
            placeholder="请输入自然语言查询，如：查询所有数学成绩大于90分的学生"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="executeQuery" :loading="queryLoading">
            <el-icon><Search /></el-icon>
            执行查询
          </el-button>
          <el-button @click="clearQuery">清空</el-button>
        </el-form-item>
      </el-form>

      <div v-if="queryResult" class="query-result">
        <h4>查询结果：</h4>
        <el-alert
          :title="queryResult.title"
          :type="queryResult.type"
          :description="queryResult.description"
          show-icon
        />
      </div>
    </el-card>

    <!-- 添加/编辑服务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑MCP服务' : '添加MCP服务'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="服务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入服务名称" />
        </el-form-item>
        <el-form-item label="模型类型" prop="model">
          <el-select v-model="form.model" placeholder="请选择模型类型">
            <el-option label="GPT-4" value="gpt-4" />
            <el-option label="GPT-3.5" value="gpt-3.5" />
            <el-option label="Claude" value="claude" />
            <el-option label="Gemini" value="gemini" />
          </el-select>
        </el-form-item>
        <el-form-item label="服务端点" prop="endpoint">
          <el-input v-model="form.endpoint" placeholder="请输入服务端点" />
        </el-form-item>
        <el-form-item label="API密钥" prop="apiKey">
          <el-input v-model="form.apiKey" type="password" placeholder="请输入API密钥" />
        </el-form-item>
        <el-form-item label="最大令牌" prop="maxTokens">
          <el-input-number v-model="form.maxTokens" :min="1" :max="4000" />
        </el-form-item>
        <el-form-item label="温度" prop="temperature">
          <el-slider v-model="form.temperature" :min="0" :max="2" :step="0.1" />
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
  name: 'McpService',
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const queryLoading = ref(false)

    const form = reactive({
      name: '',
      model: '',
      endpoint: '',
      apiKey: '',
      maxTokens: 1000,
      temperature: 0.7,
      description: ''
    })

    const queryForm = reactive({
      serviceId: '',
      query: ''
    })

    const queryResult = ref(null)

    const rules = {
      name: [
        { required: true, message: '请输入服务名称', trigger: 'blur' }
      ],
      model: [
        { required: true, message: '请选择模型类型', trigger: 'change' }
      ],
      endpoint: [
        { required: true, message: '请输入服务端点', trigger: 'blur' }
      ],
      apiKey: [
        { required: true, message: '请输入API密钥', trigger: 'blur' }
      ]
    }

    const mcpServices = ref([
      {
        id: 1,
        name: '学生数据分析',
        model: 'GPT-4',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: 'sk-1234567890abcdef',
        status: 'active',
        lastUsed: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '教师评估助手',
        model: 'Claude',
        endpoint: 'https://api.anthropic.com/v1/messages',
        apiKey: 'claude-1234567890',
        status: 'active',
        lastUsed: '2024-01-15 10:25:00'
      },
      {
        id: 3,
        name: '课程推荐系统',
        model: 'Gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
        apiKey: 'gemini-1234567890',
        status: 'disabled',
        lastUsed: '2024-01-14 16:45:00'
      }
    ])

    const getModelTypeColor = (model) => {
      const colors = {
        'GPT-4': 'success',
        'GPT-3.5': 'primary',
        'Claude': 'warning',
        'Gemini': 'info'
      }
      return colors[model] || 'info'
    }

    const addService = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editService = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const testService = (row) => {
      ElMessage.success(`正在测试 ${row.name} 服务...`)
    }

    const deleteService = (row) => {
      ElMessageBox.confirm(
        `确定要删除服务 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = mcpServices.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          mcpServices.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    const executeQuery = () => {
      if (!queryForm.serviceId || !queryForm.query) {
        ElMessage.warning('请选择服务并输入查询内容')
        return
      }

      queryLoading.value = true
      
      // 模拟查询
      setTimeout(() => {
        queryResult.value = {
          title: '查询成功',
          type: 'success',
          description: `找到 ${Math.floor(Math.random() * 100)} 条相关记录。查询内容：${queryForm.query}`
        }
        queryLoading.value = false
      }, 2000)
    }

    const clearQuery = () => {
      queryForm.serviceId = ''
      queryForm.query = ''
      queryResult.value = null
    }

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        model: '',
        endpoint: '',
        apiKey: '',
        maxTokens: 1000,
        temperature: 0.7,
        description: ''
      })
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            ElMessage.success('更新成功')
          } else {
            const newService = {
              id: Date.now(),
              ...form,
              status: 'active',
              lastUsed: new Date().toLocaleString()
            }
            mcpServices.value.unshift(newService)
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
      queryForm,
      queryResult,
      queryLoading,
      mcpServices,
      getModelTypeColor,
      addService,
      editService,
      testService,
      deleteService,
      executeQuery,
      clearQuery,
      submitForm
    }
  }
}
</script>

<style scoped>
.mcp-service {
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
.config-card,
.test-card {
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

.query-result {
  margin-top: 20px;
}

.query-result h4 {
  margin: 0 0 10px 0;
  color: #303133;
}
</style>
