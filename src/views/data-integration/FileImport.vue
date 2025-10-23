<template>
  <div class="file-import">
    <div class="section-header">
      <h3>文件导入</h3>
      <p>配置和管理文件导入对接规则</p>
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
          title="文件导入规则"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <ul>
              <li>支持Excel、CSV、JSON、XML等格式文件导入</li>
              <li>支持字段映射和数据验证</li>
              <li>支持批量导入和增量更新</li>
              <li>提供导入进度和错误处理</li>
              <li>支持文件模板下载和示例</li>
            </ul>
          </template>
        </el-alert>
      </div>
    </el-card>

    <!-- 文件上传区域 -->
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <span>文件上传</span>
        </div>
      </template>
      
      <el-upload
        class="upload-demo"
        drag
        :action="uploadUrl"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-error="handleError"
        multiple
        accept=".xlsx,.xls,.csv,.json,.xml"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持 Excel、CSV、JSON、XML 格式文件，单个文件不超过10MB
          </div>
        </template>
      </el-upload>
    </el-card>

    <!-- 导入配置列表 -->
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>导入配置列表</span>
          <el-button type="primary" @click="addConfig">
            <el-icon><Plus /></el-icon>
            添加配置
          </el-button>
        </div>
      </template>

      <el-table :data="importConfigs" stripe>
        <el-table-column prop="name" label="配置名称" width="200" />
        <el-table-column prop="fileType" label="文件类型" width="120">
          <template #default="scope">
            <el-tag :type="getFileTypeColor(scope.row.fileType)">
              {{ scope.row.fileType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="targetTable" label="目标表" width="150" />
        <el-table-column prop="mappingFields" label="字段映射" width="200">
          <template #default="scope">
            <el-tooltip :content="scope.row.mappingFields" placement="top">
              <span>{{ scope.row.mappingFields.substring(0, 30) }}...</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastImport" label="最后导入" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editConfig(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="downloadTemplate(scope.row)">模板</el-button>
            <el-button size="small" type="danger" @click="deleteConfig(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑导入配置' : '添加导入配置'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="文件类型" prop="fileType">
          <el-select v-model="form.fileType" placeholder="请选择文件类型">
            <el-option label="Excel" value="excel" />
            <el-option label="CSV" value="csv" />
            <el-option label="JSON" value="json" />
            <el-option label="XML" value="xml" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标表" prop="targetTable">
          <el-select v-model="form.targetTable" placeholder="请选择目标表">
            <el-option label="学生表" value="students" />
            <el-option label="教师表" value="teachers" />
            <el-option label="课程表" value="courses" />
            <el-option label="班级表" value="classes" />
          </el-select>
        </el-form-item>
        <el-form-item label="字段映射" prop="mappingFields">
          <el-input
            v-model="form.mappingFields"
            type="textarea"
            :rows="4"
            placeholder="请输入字段映射规则，如：name:姓名,age:年龄"
          />
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
  name: 'FileImport',
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const uploadUrl = ref('/api/upload')

    const form = reactive({
      name: '',
      fileType: '',
      targetTable: '',
      mappingFields: '',
      description: ''
    })

    const rules = {
      name: [
        { required: true, message: '请输入配置名称', trigger: 'blur' }
      ],
      fileType: [
        { required: true, message: '请选择文件类型', trigger: 'change' }
      ],
      targetTable: [
        { required: true, message: '请选择目标表', trigger: 'change' }
      ],
      mappingFields: [
        { required: true, message: '请输入字段映射', trigger: 'blur' }
      ]
    }

    const importConfigs = ref([
      {
        id: 1,
        name: '学生信息导入',
        fileType: 'Excel',
        targetTable: 'students',
        mappingFields: 'name:姓名,age:年龄,class:班级,phone:电话',
        status: 'active',
        lastImport: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '教师信息导入',
        fileType: 'CSV',
        targetTable: 'teachers',
        mappingFields: 'name:姓名,subject:科目,department:部门',
        status: 'active',
        lastImport: '2024-01-15 10:25:00'
      },
      {
        id: 3,
        name: '课程信息导入',
        fileType: 'JSON',
        targetTable: 'courses',
        mappingFields: 'name:课程名,hours:课时,teacher:任课教师',
        status: 'disabled',
        lastImport: '2024-01-14 16:45:00'
      }
    ])

    const getFileTypeColor = (type) => {
      const colors = {
        'Excel': 'success',
        'CSV': 'primary',
        'JSON': 'warning',
        'XML': 'info'
      }
      return colors[type] || 'info'
    }

    const beforeUpload = (file) => {
      const isValidType = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/json', 'text/xml'].includes(file.type)
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isValidType) {
        ElMessage.error('只能上传 Excel、CSV、JSON、XML 格式的文件!')
        return false
      }
      if (!isLt10M) {
        ElMessage.error('文件大小不能超过 10MB!')
        return false
      }
      return true
    }

    const handleSuccess = (response, file) => {
      ElMessage.success(`${file.name} 上传成功`)
    }

    const handleError = (error, file) => {
      ElMessage.error(`${file.name} 上传失败`)
    }

    const addConfig = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editConfig = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const downloadTemplate = (row) => {
      ElMessage.success(`正在下载 ${row.name} 的模板文件...`)
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
        const index = importConfigs.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          importConfigs.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    const resetForm = () => {
      Object.assign(form, {
        name: '',
        fileType: '',
        targetTable: '',
        mappingFields: '',
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
              lastImport: new Date().toLocaleString()
            }
            importConfigs.value.unshift(newConfig)
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
      uploadUrl,
      importConfigs,
      getFileTypeColor,
      beforeUpload,
      handleSuccess,
      handleError,
      addConfig,
      editConfig,
      downloadTemplate,
      deleteConfig,
      submitForm
    }
  }
}
</script>

<style scoped>
.file-import {
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
.upload-card,
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

.upload-demo {
  width: 100%;
}
</style>
