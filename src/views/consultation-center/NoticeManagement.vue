<template>
  <div class="notice-management">
    <div class="section-header">
      <h3>通知管理</h3>
      <p>管理系统通知、公告及消息推送</p>
    </div>

    <!-- 搜索与操作栏 -->
    <el-card class="search-card">
      <div class="card-header">
        <div class="left-panel">
          <el-input
            v-model="searchQuery"
            placeholder="搜索通知名称"
            style="width: 240px; margin-right: 15px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        
        <div class="right-panel">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            发布通知
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 通知列表 -->
    <el-card class="table-card">
      <el-table :data="filteredNotices" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="通知名称" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <span class="notice-title">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="intro" label="通知简介" min-width="250" show-overflow-tooltip />
        
        <el-table-column prop="publisher" label="发布人" min-width="120" align="left">
          <template #default="scope">
            <div class="publisher-info">
              <el-avatar :size="24" :src="scope.row.avatar" style="margin-right: 8px" />
              <span>{{ scope.row.publisher }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="receiver" label="接收人" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.receiverType === 'all'" type="danger" size="small">全体人员</el-tag>
            <span v-else>{{ scope.row.receiver }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="publishTime" label="发布时间" min-width="180" align="center" sortable />
        
        <el-table-column prop="status" label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status === '已发布' ? 'success' : 'info'" effect="plain">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="primary" @click="handlePreview(scope.row)">预览</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 通知编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '发布通知' : '编辑通知'"
      width="650px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="通知名称">
          <el-input v-model="form.title" placeholder="请输入通知名称" />
        </el-form-item>
        
        <el-form-item label="接收范围">
          <el-radio-group v-model="form.receiverType" @change="handleReceiverTypeChange">
            <el-radio label="all">全体人员</el-radio>
            <el-radio label="college">按学院</el-radio>
            <el-radio label="department">按系别</el-radio>
            <el-radio label="teacher">按教师</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="接收对象" v-if="form.receiverType !== 'all'">
          <el-select
            v-if="form.receiverType === 'college'"
            v-model="form.receivers"
            multiple
            placeholder="请选择学院"
            style="width: 100%"
          >
            <el-option label="计算机科学与技术学院" value="计算机科学与技术学院" />
            <el-option label="人工智能研究院" value="人工智能研究院" />
            <el-option label="软件学院" value="软件学院" />
            <el-option label="大数据学院" value="大数据学院" />
          </el-select>

          <el-select
            v-else-if="form.receiverType === 'department'"
            v-model="form.receivers"
            multiple
            placeholder="请选择系别"
            style="width: 100%"
          >
            <el-option label="计算机系" value="计算机系" />
            <el-option label="软件工程系" value="软件工程系" />
            <el-option label="网络工程系" value="网络工程系" />
            <el-option label="人工智能系" value="人工智能系" />
          </el-select>

          <el-select
            v-else-if="form.receiverType === 'teacher'"
            v-model="form.receivers"
            multiple
            filterable
            remote
            :remote-method="remoteSearchTeacher"
            placeholder="请输入教师姓名搜索"
            style="width: 100%"
          >
            <el-option
              v-for="item in teacherOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="通知简介">
          <el-input 
            v-model="form.intro" 
            type="textarea" 
            rows="3" 
            placeholder="请输入通知简介" 
          />
        </el-form-item>
        <el-form-item label="发布状态">
          <el-radio-group v-model="form.status">
            <el-radio label="已发布">立即发布</el-radio>
            <el-radio label="草稿">存为草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 状态定义
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' or 'edit'
const teacherOptions = ref([])

const form = reactive({
  title: '',
  intro: '',
  receiverType: 'all', // all, college, department, teacher
  receivers: [],
  status: '已发布'
})

// Mock数据
const mockData = [
  {
    id: 1,
    title: '关于系统维护升级的通知',
    intro: '为了提供更好的服务，系统将于本周六凌晨0:00-4:00进行维护升级，期间将无法访问。',
    publisher: '系统管理员',
    receiverType: 'all',
    receiver: '全体人员',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-20 10:00:00',
    status: '已发布'
  },
  {
    id: 2,
    title: '计算机学院全体教师会议通知',
    intro: '请计算机学院全体教师于本周三下午2:00在第一会议室参加教学研讨会。',
    publisher: '教务处',
    receiverType: 'college',
    receiver: '计算机科学与技术学院',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-18 09:30:00',
    status: '已发布'
  },
  {
    id: 3,
    title: '关于提交科研项目中期报告的提醒',
    intro: '请相关课题负责人于本月底前提交科研项目中期检查报告。',
    publisher: '科研处',
    receiverType: 'teacher',
    receiver: '张老师, 李教授, 王讲师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-15 14:00:00',
    status: '已发布'
  },
  {
    id: 4,
    title: '软件工程系新进教师培训通知',
    intro: '欢迎各位新老师加入！请参加本周五上午的新进教师入职培训。',
    publisher: '人事处',
    receiverType: 'department',
    receiver: '软件工程系',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-12 08:30:00',
    status: '已发布'
  },
  {
    id: 5,
    title: '2024年五一劳动节放假安排',
    intro: '根据国务院办公厅通知精神，现将2024年劳动节放假安排通知如下...',
    publisher: '校办',
    receiverType: 'all',
    receiver: '全体人员',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-10 09:00:00',
    status: '草稿'
  }
]

const notices = ref(mockData)

// 计算属性
const filteredNotices = computed(() => {
  let result = notices.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(query))
  }
  return result
})

// 方法
const handleSearch = () => {
  ElMessage.success('查询成功')
}

const handleReceiverTypeChange = () => {
  form.receivers = []
}

const remoteSearchTeacher = (query) => {
  if (query) {
    loading.value = true
    setTimeout(() => {
      loading.value = false
      teacherOptions.value = [
        { value: '张老师', label: '张老师 (计算机系)' },
        { value: '李教授', label: '李教授 (人工智能系)' },
        { value: '王讲师', label: '王讲师 (软件工程系)' },
        { value: '赵老师', label: '赵老师 (网络工程系)' }
      ].filter(item => item.label.includes(query))
    }, 200)
  } else {
    teacherOptions.value = []
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.title = ''
  form.intro = ''
  form.receiverType = 'all'
  form.receivers = []
  form.status = '已发布'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.title = row.title
  form.intro = row.intro
  form.receiverType = row.receiverType
  // 这里简化处理，实际应该解析 receiver 字符串回显
  form.receivers = row.receiverType === 'all' ? [] : row.receiver.split(', ')
  form.status = row.status
  
  // 如果是教师类型，预填充选项以便回显
  if (row.receiverType === 'teacher') {
    teacherOptions.value = row.receiver.split(', ').map(name => ({ value: name, label: name }))
  }
  
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除通知 "${row.title}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    notices.value = notices.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

const handlePreview = (row) => {
  ElMessage.info(`预览通知：${row.title}`)
}

const submitForm = () => {
  if (!form.title) {
    ElMessage.warning('请填写通知名称')
    return
  }
  
  if (form.receiverType !== 'all' && form.receivers.length === 0) {
    ElMessage.warning('请选择接收对象')
    return
  }
  
  let receiverStr = '全体人员'
  if (form.receiverType !== 'all') {
    receiverStr = form.receivers.join(', ')
  }

  if (dialogType.value === 'add') {
    const newNotice = {
      id: notices.value.length + 1,
      title: form.title,
      intro: form.intro || '暂无简介',
      publisher: '当前用户',
      receiverType: form.receiverType,
      receiver: receiverStr,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      publishTime: new Date().toLocaleString().replace(/\//g, '-'),
      status: form.status
    }
    notices.value.unshift(newNotice)
    ElMessage.success('发布成功')
  } else {
    ElMessage.success('修改成功')
  }
  dialogVisible.value = false
}

const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.notice-management {
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

.search-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-panel {
  display: flex;
  align-items: center;
}

.notice-title {
  font-weight: 500;
  color: #303133;
}

.publisher-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
