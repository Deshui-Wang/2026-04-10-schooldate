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
      width="680px"
      class="mcp-service-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="header-title">
            <h3>{{ isEdit ? '编辑MCP服务' : '添加MCP服务' }}</h3>
            <p>{{ isEdit ? '修改MCP服务配置信息' : '配置新的AI模型服务对接规则' }}</p>
          </div>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="mcp-service-form">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>基本信息</span>
            </div>
            <el-form-item label="服务名称" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入服务名称，如：学生数据分析"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="模型类型" prop="model">
              <el-select 
                v-model="form.model" 
                placeholder="请选择模型类型"
                style="width: 100%"
              >
                <el-option label="GPT-4" value="GPT-4">
                  <span style="float: left">
                    <el-tag type="success" size="small" style="margin-right: 8px">GPT-4</el-tag>
                    <span>OpenAI GPT-4</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">最强大</span>
                </el-option>
                <el-option label="GPT-3.5" value="GPT-3.5">
                  <span style="float: left">
                    <el-tag type="primary" size="small" style="margin-right: 8px">GPT-3.5</el-tag>
                    <span>OpenAI GPT-3.5</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">性价比高</span>
                </el-option>
                <el-option label="Claude" value="Claude">
                  <span style="float: left">
                    <el-tag type="warning" size="small" style="margin-right: 8px">Claude</el-tag>
                    <span>Anthropic Claude</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">长文本</span>
                </el-option>
                <el-option label="Gemini" value="Gemini">
                  <span style="float: left">
                    <el-tag type="info" size="small" style="margin-right: 8px">Gemini</el-tag>
                    <span>Google Gemini</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">多模态</span>
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
            <el-form-item label="服务端点" prop="endpoint">
              <el-input 
                v-model="form.endpoint" 
                placeholder="请输入API端点URL，如：https://api.openai.com/v1/chat/completions"
                clearable
              >
                <template #prefix>
                  <el-icon><Link /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="API密钥" prop="apiKey">
              <el-input 
                v-model="form.apiKey" 
                type="password" 
                placeholder="请输入API密钥"
                show-password
                clearable
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- 高级设置 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Setting /></el-icon>
              <span>高级设置</span>
            </div>
            <el-form-item label="最大令牌" prop="maxTokens">
              <el-input-number 
                v-model="form.maxTokens" 
                :min="1" 
                :max="4000"
                style="width: 100%"
                placeholder="最大响应令牌数"
              />
              <div class="form-tip">设置生成响应的最大令牌数，建议范围：1000-4000</div>
            </el-form-item>
            <el-form-item label="温度参数" prop="temperature">
              <div class="slider-wrapper">
                <el-slider 
                  v-model="form.temperature" 
                  :min="0" 
                  :max="2" 
                  :step="0.1"
                  show-stops
                  :marks="temperatureMarks"
                />
                <div class="slider-value">{{ form.temperature }}</div>
              </div>
              <div class="form-tip">控制输出随机性：0=确定性，2=创造性（建议0.7）</div>
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
                :rows="3"
                placeholder="请输入服务描述信息，包括用途、注意事项等"
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  InfoFilled, 
  Plus, 
  Search,
  Connection,
  Document,
  Edit,
  Link,
  Lock,
  Setting,
  Check
} from '@element-plus/icons-vue'

export default {
  name: 'McpService',
  components: {
    InfoFilled,
    Plus,
    Search,
    Connection,
    Document,
    Edit,
    Link,
    Lock,
    Setting,
    Check
  },
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

    const temperatureMarks = computed(() => ({
      0: '确定性',
      0.7: '平衡',
      1: '创造性',
      2: '高创造性'
    }))

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
      temperatureMarks,
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

/* 对话框样式优化 */
:deep(.mcp-service-dialog .el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.mcp-service-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.mcp-service-dialog .el-dialog__footer) {
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

.mcp-service-form {
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

:deep(.mcp-service-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.mcp-service-form .el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 16px;
}

:deep(.mcp-service-form .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.mcp-service-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.mcp-service-form .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.mcp-service-form .el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.mcp-service-form .el-textarea__inner) {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.mcp-service-form .el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.mcp-service-form .el-textarea__inner:focus) {
  border-color: #409eff;
}

:deep(.mcp-service-form .el-input__prefix) {
  color: #909399;
}

.form-tip {
  margin-top: 16px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.slider-wrapper .el-slider {
  flex: 1;
}

.slider-value {
  min-width: 60px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  background: #ecf5ff;
  padding: 4px 12px;
  border-radius: 4px;
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

/* 滑块样式优化 */
:deep(.el-slider__marks-text) {
  font-size: 12px;
  color: #909399;
}
</style>
