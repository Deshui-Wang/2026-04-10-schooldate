<template>
  <div class="article-management">
    <div class="section-header">
      <h3>文章管理</h3>
      <p>管理校园新闻、评选章程及评教规则等资讯内容</p>
    </div>

    <!-- 搜索与操作栏 -->
    <el-card class="search-card">
      <div class="card-header">
        <div class="left-panel">
          <el-input
            v-model="searchQuery"
            placeholder="搜索文章标题"
            style="width: 240px; margin-right: 15px"
            clearable
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select 
            v-model="filterType" 
            placeholder="文章类型" 
            style="width: 160px; margin-right: 15px"
            clearable
            @change="handleSearch"
          >
            <el-option label="全部类型" value="" />
            <el-option label="校园新闻" value="校园新闻" />
            <el-option label="评选章程" value="评选章程" />
            <el-option label="评教规则" value="评教规则" />
          </el-select>

          <el-button type="primary" @click="handleSearch">查询</el-button>
        </div>
        
        <div class="right-panel">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            发布文章
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 文章列表 -->
    <el-card class="table-card">
      <el-table :data="filteredArticles" stripe style="width: 100%" v-loading="loading">
        <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <span class="article-title">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="type" label="类型" min-width="120" align="center">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">
              {{ scope.row.type }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="intro" label="简介" min-width="250" show-overflow-tooltip />
        
        <el-table-column prop="publisher" label="发布人" min-width="100" align="left">
          <template #default="scope">
            <div class="publisher-info">
              <el-avatar :size="24" :src="scope.row.avatar" style="margin-right: 8px" />
              <span>{{ scope.row.publisher }}</span>
            </div>
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

    <!-- 文章编辑/新增对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '发布文章' : '编辑文章'"
      width="650px"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="文章标题">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章类型">
          <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="校园新闻" value="校园新闻" />
            <el-option label="评选章程" value="评选章程" />
            <el-option label="评教规则" value="评教规则" />
          </el-select>
        </el-form-item>
        <el-form-item label="文章简介">
          <el-input 
            v-model="form.intro" 
            type="textarea" 
            rows="3" 
            placeholder="请输入文章简介" 
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
const filterType = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const dialogVisible = ref(false)
const dialogType = ref('add') // 'add' or 'edit'

const form = reactive({
  title: '',
  type: '',
  intro: '',
  status: '已发布'
})

// Mock数据
const mockData = [
  {
    id: 1,
    title: '关于2024年度优秀教师评选的通知',
    type: '评选章程',
    intro: '为表彰先进，树立典型，进一步激发广大教师的积极性和创造性，经学校研究决定，开展2024年度优秀教师评选活动。',
    publisher: '教务处',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-15 09:00:00',
    status: '已发布'
  },
  {
    id: 2,
    title: '我校在全国大学生创新创业大赛中斩获佳绩',
    type: '校园新闻',
    intro: '在刚刚结束的第十届全国大学生创新创业大赛总决赛中，我校代表队凭借出色的表现，荣获金奖2项、银奖3项。',
    publisher: '宣传部',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-14 14:30:00',
    status: '已发布'
  },
  {
    id: 3,
    title: '2024春季学期学生评教工作实施细则',
    type: '评教规则',
    intro: '为进一步完善教学质量监控体系，客观评价教师教学效果，现制定2024春季学期学生评教工作实施细则。',
    publisher: '质管办',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-10 10:00:00',
    status: '已发布'
  },
  {
    id: 4,
    title: '图书馆关于延长开馆时间的通知',
    type: '校园新闻',
    intro: '应广大师生要求，为更好地服务教学科研，图书馆决定自即日起将闭馆时间延长至晚上22:30。',
    publisher: '图书馆',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-08 08:00:00',
    status: '已发布'
  },
  {
    id: 5,
    title: '第十五届校园文化艺术节开幕式隆重举行',
    type: '校园新闻',
    intro: '3月5日晚，我校第十五届校园文化艺术节开幕式在体育馆隆重举行，校领导及师生代表3000余人参加。',
    publisher: '团委',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-06 19:00:00',
    status: '已发布'
  },
  {
    id: 6,
    title: '关于开展2024年科研项目申报工作的通知',
    type: '评选章程',
    intro: '各学院、各部门：2024年度校级科研项目申报工作现已启动，请按照申报指南要求积极组织申报。',
    publisher: '科研处',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-03-01 09:30:00',
    status: '已发布'
  },
  {
    id: 7,
    title: '本科教学工作审核评估整改方案',
    type: '评教规则',
    intro: '根据教育部评估专家组反馈意见，结合我校实际，特制定本科教学工作审核评估整改方案。',
    publisher: '教务处',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    publishTime: '2024-02-28 15:00:00',
    status: '草稿'
  }
]

const articles = ref(mockData)

// 计算属性
const filteredArticles = computed(() => {
  let result = articles.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => item.title.toLowerCase().includes(query))
  }
  
  if (filterType.value) {
    result = result.filter(item => item.type === filterType.value)
  }
  
  return result
})

// 方法
const getTypeTag = (type) => {
  const map = {
    '校园新闻': 'primary',
    '评选章程': 'warning',
    '评教规则': 'success'
  }
  return map[type] || 'info'
}

const handleSearch = () => {
  // 实际项目中这里会调用API
  ElMessage.success('查询成功')
}

const handleAdd = () => {
  dialogType.value = 'add'
  form.title = ''
  form.type = ''
  form.intro = ''
  form.status = '已发布'
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.title = row.title
  form.type = row.type
  form.intro = row.intro
  form.status = row.status
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除文章 "${row.title}" 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    articles.value = articles.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  })
}

const handlePreview = (row) => {
  ElMessage.info(`预览文章：${row.title}`)
}

const submitForm = () => {
  if (!form.title || !form.type) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  if (dialogType.value === 'add') {
    const newArticle = {
      id: articles.value.length + 1,
      title: form.title,
      type: form.type,
      intro: form.intro || '暂无简介',
      publisher: '当前用户',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      publishTime: new Date().toLocaleString().replace(/\//g, '-'),
      status: form.status
    }
    articles.value.unshift(newArticle)
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
.article-management {
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

.article-title {
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
