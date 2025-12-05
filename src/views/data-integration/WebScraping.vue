<template>
  <div class="web-scraping">
    <div class="section-header">
      <h3>网页抓取</h3>
      <p>配置和管理网络爬虫对接规则</p>
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
          title="爬虫规则"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul>
              <li>支持网页数据抓取和解析</li>
              <li>支持定时任务和增量更新</li>
              <li>支持反爬虫机制和代理设置</li>
              <li>提供数据清洗和格式化</li>
              <li>支持多种数据源和API接口</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- 抓取任务配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>抓取任务配置</span>
          <el-button type="primary" @click="addTask">
            <el-icon><Plus /></el-icon>
            添加任务
          </el-button>
        </div>
      </template>

      <el-table :data="scrapingTasks" stripe>
        <el-table-column prop="name" label="任务名称" min-width="200" />
        <el-table-column prop="url" label="目标URL" min-width="300">
          <template #default="scope">
            <el-tooltip :content="scope.row.url" placement="top">
              <span>{{ scope.row.url.substring(0, 40) }}...</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="爬取类型" min-width="120">
          <template #default="scope">
            <el-tag :type="getTaskTypeColor(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="执行频率" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'running' ? 'success' : 'danger'">
              {{ scope.row.status === 'running' ? '运行中' : '已停止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastRun" label="最后执行" min-width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editTask(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="runTask(scope.row)">运行</el-button>
            <el-button size="small" type="danger" @click="deleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 抓取监控 -->
    <el-card class="monitor-card">
      <template #header>
        <div class="card-header">
          <span>抓取监控</span>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ monitorStats.totalTasks }}</div>
            <div class="stat-label">总任务数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ monitorStats.runningTasks }}</div>
            <div class="stat-label">运行中</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ monitorStats.totalData }}</div>
            <div class="stat-label">总数据量</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card">
            <div class="stat-number">{{ monitorStats.todayData }}</div>
            <div class="stat-label">今日新增</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑爬虫任务' : '添加爬虫任务'"
      width="900px"
      class="web-scraping-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <div class="header-title">
            <h3>{{ isEdit ? '编辑爬虫任务' : '添加爬虫任务' }}</h3>
            <p>{{ isEdit ? '修改网络爬虫任务配置信息' : '配置新的网络爬虫对接规则' }}</p>
          </div>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="task-form">
        <!-- 基础配置 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Setting /></el-icon>
            <span>基础配置</span>
          </div>
          <el-form-item label="任务名称" prop="name">
            <el-input 
              v-model="form.name" 
              placeholder="请输入任务名称，如：教育新闻抓取"
              clearable
            >
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="目标URL" prop="url">
            <el-input 
              v-model="form.url" 
              placeholder="请输入完整的URL地址，如：https://example.com"
              clearable
            >
              <template #prefix>
                <el-icon><Link /></el-icon>
              </template>
            </el-input>
            <div class="form-tip">支持 http:// 和 https:// 协议</div>
          </el-form-item>
          <el-form-item label="爬取类型" prop="type">
            <el-select 
              v-model="form.type" 
              placeholder="请选择爬取类型"
              style="width: 100%"
            >
              <el-option label="静态页面" value="static">
                <span style="float: left">静态页面</span>
                <span style="float: right; color: #8492a6; font-size: 13px">HTML静态内容</span>
              </el-option>
              <el-option label="动态页面" value="dynamic">
                <span style="float: left">动态页面</span>
                <span style="float: right; color: #8492a6; font-size: 13px">JavaScript渲染</span>
              </el-option>
              <el-option label="API接口" value="api">
                <span style="float: left">API接口</span>
                <span style="float: right; color: #8492a6; font-size: 13px">RESTful API</span>
              </el-option>
              <el-option label="RSS订阅" value="rss">
                <span style="float: left">RSS订阅</span>
                <span style="float: right; color: #8492a6; font-size: 13px">RSS Feed</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行频率" prop="frequency">
            <el-select 
              v-model="form.frequency" 
              placeholder="请选择执行频率"
              style="width: 100%"
            >
              <el-option label="实时" value="realtime">
                <span style="float: left">实时</span>
                <span style="float: right; color: #8492a6; font-size: 13px">立即执行</span>
              </el-option>
              <el-option label="每分钟" value="1min">
                <span style="float: left">每分钟</span>
                <span style="float: right; color: #8492a6; font-size: 13px">每1分钟执行</span>
              </el-option>
              <el-option label="每小时" value="1hour">
                <span style="float: left">每小时</span>
                <span style="float: right; color: #8492a6; font-size: 13px">每1小时执行</span>
              </el-option>
              <el-option label="每天" value="1day">
                <span style="float: left">每天</span>
                <span style="float: right; color: #8492a6; font-size: 13px">每天执行</span>
              </el-option>
              <el-option label="每周" value="1week">
                <span style="float: left">每周</span>
                <span style="float: right; color: #8492a6; font-size: 13px">每周执行</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="目标表" prop="targetTable">
            <el-select 
              v-model="form.targetTable" 
              placeholder="请选择数据存储的目标表"
              style="width: 100%"
              filterable
            >
              <el-option label="学生表" value="students">
                <span style="float: left">
                  <el-icon style="margin-right: 8px; color: #409eff"><User /></el-icon>
                  学生表
                </span>
              </el-option>
              <el-option label="课程表" value="courses">
                <span style="float: left">
                  <el-icon style="margin-right: 8px; color: #409eff"><Reading /></el-icon>
                  课程表
                </span>
              </el-option>
              <el-option label="教师表" value="teachers">
                <span style="float: left">
                  <el-icon style="margin-right: 8px; color: #409eff"><UserFilled /></el-icon>
                  教师表
                </span>
              </el-option>
            </el-select>
            <div class="form-tip">选择数据存储的目标数据表</div>
          </el-form-item>
        </div>

        <!-- 数据提取配置 -->
        <div class="form-section" v-if="form.type === 'static' || form.type === 'dynamic'">
          <div class="section-title">
            <el-icon><Grid /></el-icon>
            <span>数据提取配置</span>
          </div>
          <el-form-item label="CSS选择器" prop="selector">
            <el-input 
              v-model="form.selector" 
              placeholder="请输入CSS选择器，如：.article-list .item"
              clearable
            >
              <template #append>
                <el-button @click="testSelector" :disabled="!form.url || !form.selector">
                  <el-icon><Search /></el-icon>
                  测试
                </el-button>
              </template>
            </el-input>
            <div class="form-tip">用于定位页面中需要提取的数据元素</div>
          </el-form-item>
        </div>

        <!-- 高级配置 -->
        <el-collapse v-model="activeCollapse" class="advanced-config">
          <el-collapse-item name="advanced">
            <template #title>
              <div class="collapse-title">
                <el-icon><Setting /></el-icon>
                <span>高级配置</span>
              </div>
            </template>
            <div class="form-section-inner">
              <el-form-item label="用户代理">
                <el-input 
                  v-model="form.userAgent" 
                  placeholder="请输入User-Agent，留空使用默认值"
                  clearable
                >
                  <template #prefix>
                    <el-icon><Monitor /></el-icon>
                  </template>
                </el-input>
                <div class="form-tip">自定义浏览器标识，用于绕过某些反爬虫检测</div>
              </el-form-item>
              <el-form-item label="代理设置">
                <el-input 
                  v-model="form.proxy" 
                  placeholder="格式：http://host:port 或 https://host:port"
                  clearable
                >
                  <template #prefix>
                    <el-icon><Connection /></el-icon>
                  </template>
                </el-input>
                <div class="form-tip">代理服务器地址，格式：http://127.0.0.1:8080</div>
              </el-form-item>
              <el-form-item label="超时设置">
                <el-input-number 
                  v-model="form.timeout" 
                  :min="5" 
                  :max="300" 
                  :step="5"
                  placeholder="请求超时时间（秒）"
                  style="width: 100%"
                />
                <div class="form-tip">请求超时时间，默认30秒</div>
              </el-form-item>
              <el-form-item label="重试次数">
                <el-input-number 
                  v-model="form.retryCount" 
                  :min="0" 
                  :max="10" 
                  :step="1"
                  placeholder="失败重试次数"
                  style="width: 100%"
                />
                <div class="form-tip">请求失败后的重试次数，默认3次</div>
              </el-form-item>
              <el-form-item label="请求头设置">
                <el-input
                  v-model="form.headers"
                  type="textarea"
                  :rows="3"
                  placeholder='请输入JSON格式的请求头，如：{"Authorization": "Bearer token"}'
                />
                <div class="form-tip">自定义HTTP请求头，JSON格式</div>
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>

        <!-- 其他配置 -->
        <div class="form-section">
          <div class="section-title">
            <el-icon><Edit /></el-icon>
            <span>其他配置</span>
          </div>
          <el-form-item label="任务描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              placeholder="请输入任务描述，说明任务用途和注意事项"
              maxlength="500"
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
  Document, 
  Link, 
  Setting, 
  Grid, 
  Edit, 
  Check, 
  Search,
  User,
  UserFilled,
  Reading,
  Monitor,
  Connection
} from '@element-plus/icons-vue'

export default {
  name: 'WebScraping',
  components: {
    InfoFilled,
    Plus,
    Document,
    Link,
    Setting,
    Grid,
    Edit,
    Check,
    Search,
    User,
    UserFilled,
    Reading,
    Monitor,
    Connection
  },
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const activeCollapse = ref([])

    const form = reactive({
      name: '',
      url: '',
      type: '',
      frequency: '',
      targetTable: '',
      selector: '',
      userAgent: '',
      proxy: '',
      timeout: 30,
      retryCount: 3,
      headers: '',
      description: ''
    })

    // URL验证函数
    const validateUrl = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入目标URL'))
      } else {
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        if (!urlPattern.test(value) && !value.startsWith('http://') && !value.startsWith('https://')) {
          callback(new Error('请输入有效的URL地址，如：https://example.com'))
        } else {
          callback()
        }
      }
    }

    const rules = {
      name: [
        { required: true, message: '请输入任务名称', trigger: 'blur' },
        { min: 2, max: 50, message: '任务名称长度在 2 到 50 个字符', trigger: 'blur' }
      ],
      url: [
        { required: true, validator: validateUrl, trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择爬取类型', trigger: 'change' }
      ],
      frequency: [
        { required: true, message: '请选择执行频率', trigger: 'change' }
      ],
      targetTable: [
        { required: true, message: '请选择目标表', trigger: 'change' }
      ],
      selector: [
        {
          validator: (rule, value, callback) => {
            if (form.type === 'static' || form.type === 'dynamic') {
              if (!value || value.trim() === '') {
                callback(new Error('静态/动态页面类型需要填写CSS选择器'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }

    const scrapingTasks = ref([
      {
        id: 1,
        name: '教育新闻抓取',
        url: 'https://news.edu.cn',
        type: 'static',
        frequency: '1hour',
        status: 'running',
        lastRun: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '学校信息更新',
        url: 'https://api.schools.com/schools',
        type: 'api',
        frequency: '1day',
        status: 'running',
        lastRun: '2024-01-15 10:25:00'
      },
      {
        id: 3,
        name: '课程资源抓取',
        url: 'https://courses.example.com',
        type: 'dynamic',
        frequency: '1week',
        status: 'stopped',
        lastRun: '2024-01-14 16:45:00'
      }
    ])

    const monitorStats = ref({
      totalTasks: 12,
      runningTasks: 8,
      totalData: 156789,
      todayData: 1234
    })

    const getTaskTypeColor = (type) => {
      const colors = {
        'static': 'success',
        'dynamic': 'primary',
        'api': 'warning',
        'rss': 'info'
      }
      return colors[type] || 'info'
    }

    const addTask = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editTask = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const runTask = (row) => {
      ElMessage.success(`正在运行任务 "${row.name}"...`)
    }

    const deleteTask = (row) => {
      ElMessageBox.confirm(
        `确定要删除任务 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = scrapingTasks.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          scrapingTasks.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    const testSelector = () => {
      if (!form.url || !form.selector) {
        ElMessage.warning('请先填写URL和选择器')
        return
      }
      ElMessage.info('正在测试选择器...（此功能需要后端支持）')
      // TODO: 实现选择器测试功能
    }

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        url: '',
        type: '',
        frequency: '',
        targetTable: '',
        selector: '',
        userAgent: '',
        proxy: '',
        timeout: 30,
        retryCount: 3,
        headers: '',
        description: ''
      })
      activeCollapse.value = []
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            ElMessage.success('更新成功')
          } else {
            const newTask = {
              id: Date.now(),
              ...form,
              status: 'running',
              lastRun: new Date().toLocaleString()
            }
            scrapingTasks.value.unshift(newTask)
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
      scrapingTasks,
      monitorStats,
      activeCollapse,
      getTaskTypeColor,
      addTask,
      editTask,
      runTask,
      deleteTask,
      submitForm,
      testSelector
    }
  }
}
</script>

<style scoped>
.web-scraping {
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
.monitor-card {
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

.stat-card {
  text-align: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
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

/* 对话框样式优化 */
:deep(.web-scraping-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.web-scraping-dialog .el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.web-scraping-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.web-scraping-dialog .el-dialog__footer) {
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

.task-form {
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

.form-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.form-section-inner {
  padding: 10px 0;
}

/* 高级配置折叠面板样式 */
.advanced-config {
  margin: 20px 0;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.advanced-config :deep(.el-collapse-item__header) {
  padding: 0 20px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.advanced-config :deep(.el-collapse-item__content) {
  padding: 20px;
}

.collapse-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.collapse-title .el-icon {
  margin-right: 8px;
  color: #409eff;
}

/* 对话框底部样式 */
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

/* 表单项优化 */
:deep(.task-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.task-form .el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 16px;
}

:deep(.task-form .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.task-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.task-form .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.task-form .el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.task-form .el-textarea__inner) {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.task-form .el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.task-form .el-textarea__inner:focus) {
  border-color: #409eff;
}

:deep(.task-form .el-input__prefix) {
  color: #909399;
}

:deep(.task-form .el-input-number) {
  width: 100%;
}

:deep(.task-form .el-input-number .el-input__wrapper) {
  width: 100%;
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
