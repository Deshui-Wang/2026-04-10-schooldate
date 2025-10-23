<template>
  <div class="web-scraping">
    <div class="section-header">
      <h3>爬虫</h3>
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

    <!-- 爬虫任务配置 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>爬虫任务配置</span>
          <el-button type="primary" @click="addTask">
            <el-icon><Plus /></el-icon>
            添加任务
          </el-button>
        </div>
      </template>

      <el-table :data="scrapingTasks" stripe>
        <el-table-column prop="name" label="任务名称" width="200" />
        <el-table-column prop="url" label="目标URL" width="300">
          <template #default="scope">
            <el-tooltip :content="scope.row.url" placement="top">
              <span>{{ scope.row.url.substring(0, 40) }}...</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="爬取类型" width="120">
          <template #default="scope">
            <el-tag :type="getTaskTypeColor(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="执行频率" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'running' ? 'success' : 'danger'">
              {{ scope.row.status === 'running' ? '运行中' : '已停止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastRun" label="最后执行" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editTask(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="runTask(scope.row)">运行</el-button>
            <el-button size="small" type="danger" @click="deleteTask(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 爬虫监控 -->
    <el-card class="monitor-card">
      <template #header>
        <div class="card-header">
          <span>爬虫监控</span>
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
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="任务名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="目标URL" prop="url">
          <el-input v-model="form.url" placeholder="请输入目标URL" />
        </el-form-item>
        <el-form-item label="爬取类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择爬取类型">
            <el-option label="静态页面" value="static" />
            <el-option label="动态页面" value="dynamic" />
            <el-option label="API接口" value="api" />
            <el-option label="RSS订阅" value="rss" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行频率" prop="frequency">
          <el-select v-model="form.frequency" placeholder="请选择执行频率">
            <el-option label="实时" value="realtime" />
            <el-option label="每分钟" value="1min" />
            <el-option label="每小时" value="1hour" />
            <el-option label="每天" value="1day" />
            <el-option label="每周" value="1week" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择器" prop="selector">
          <el-input v-model="form.selector" placeholder="请输入CSS选择器" />
        </el-form-item>
        <el-form-item label="用户代理">
          <el-input v-model="form.userAgent" placeholder="请输入用户代理" />
        </el-form-item>
        <el-form-item label="代理设置">
          <el-input v-model="form.proxy" placeholder="请输入代理地址" />
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
  name: 'WebScraping',
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()

    const form = reactive({
      name: '',
      url: '',
      type: '',
      frequency: '',
      selector: '',
      userAgent: '',
      proxy: '',
      description: ''
    })

    const rules = {
      name: [
        { required: true, message: '请输入任务名称', trigger: 'blur' }
      ],
      url: [
        { required: true, message: '请输入目标URL', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择爬取类型', trigger: 'change' }
      ],
      frequency: [
        { required: true, message: '请选择执行频率', trigger: 'change' }
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

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        url: '',
        type: '',
        frequency: '',
        selector: '',
        userAgent: '',
        proxy: '',
        description: ''
      })
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
      getTaskTypeColor,
      addTask,
      editTask,
      runTask,
      deleteTask,
      submitForm
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
</style>
