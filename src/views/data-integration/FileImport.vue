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
      width="700px"
      class="file-import-dialog"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="dialog-header">
          <div class="header-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="header-title">
            <h3>{{ isEdit ? '编辑导入配置' : '添加导入配置' }}</h3>
            <p>{{ isEdit ? '修改文件导入配置信息' : '配置新的文件导入对接规则' }}</p>
          </div>
        </div>
      </template>
      
      <div class="dialog-content">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="import-form">
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Document /></el-icon>
              <span>基本信息</span>
            </div>
            <el-form-item label="配置名称" prop="name">
              <el-input 
                v-model="form.name" 
                placeholder="请输入配置名称，如：学生信息导入"
                clearable
              >
                <template #prefix>
                  <el-icon><Edit /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="文件类型" prop="fileType">
              <el-select 
                v-model="form.fileType" 
                placeholder="请选择文件类型"
                style="width: 100%"
              >
                <el-option label="Excel" value="Excel">
                  <span style="float: left">
                    <el-tag type="success" size="small" style="margin-right: 8px">Excel</el-tag>
                    <span>Excel表格文件</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">.xlsx, .xls</span>
                </el-option>
                <el-option label="CSV" value="CSV">
                  <span style="float: left">
                    <el-tag type="primary" size="small" style="margin-right: 8px">CSV</el-tag>
                    <span>CSV文本文件</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">.csv</span>
                </el-option>
                <el-option label="JSON" value="JSON">
                  <span style="float: left">
                    <el-tag type="warning" size="small" style="margin-right: 8px">JSON</el-tag>
                    <span>JSON数据文件</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">.json</span>
                </el-option>
                <el-option label="XML" value="XML">
                  <span style="float: left">
                    <el-tag type="info" size="small" style="margin-right: 8px">XML</el-tag>
                    <span>XML标记文件</span>
                  </span>
                  <span style="float: right; color: #8492a6; font-size: 13px">.xml</span>
                </el-option>
              </el-select>
            </el-form-item>
          </div>

          <!-- 数据配置 -->
          <div class="form-section">
            <div class="section-title">
              <el-icon><Grid /></el-icon>
              <span>数据配置</span>
            </div>
            <el-form-item label="目标表" prop="targetTable">
              <el-select 
                v-model="form.targetTable" 
                placeholder="请选择目标表"
                style="width: 100%"
              >
                <el-option label="学生表" value="students">
                  <span style="float: left">
                    <el-icon style="margin-right: 8px; color: #409eff"><User /></el-icon>
                    <span>学生表 (students)</span>
                  </span>
                </el-option>
                <el-option label="教师表" value="teachers">
                  <span style="float: left">
                    <el-icon style="margin-right: 8px; color: #67c23a"><UserFilled /></el-icon>
                    <span>教师表 (teachers)</span>
                  </span>
                </el-option>
                <el-option label="课程表" value="courses">
                  <span style="float: left">
                    <el-icon style="margin-right: 8px; color: #e6a23c"><Reading /></el-icon>
                    <span>课程表 (courses)</span>
                  </span>
                </el-option>
                <el-option label="班级表" value="classes">
                  <span style="float: left">
                    <el-icon style="margin-right: 8px; color: #f56c6c"><Grid /></el-icon>
                    <span>班级表 (classes)</span>
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="字段映射" prop="mappingFields">
              <el-input
                v-model="form.mappingFields"
                type="textarea"
                :rows="4"
                placeholder="请输入字段映射规则，格式：name:姓名,age:年龄,class:班级"
                maxlength="500"
                show-word-limit
              />
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
                placeholder="请输入配置的描述信息，包括用途、注意事项等"
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
import { 
  InfoFilled, 
  Plus, 
  UploadFilled,
  Document, 
  Edit, 
  User,
  UserFilled,
  Reading,
  Grid,
  Check 
} from '@element-plus/icons-vue'

export default {
  name: 'FileImport',
  components: {
    InfoFilled,
    Plus,
    UploadFilled,
    Document,
    Edit,
    User,
    UserFilled,
    Reading,
    Grid,
    Check
  },
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

/* 对话框样式优化 */
:deep(.file-import-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.file-import-dialog .el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.file-import-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.file-import-dialog .el-dialog__footer) {
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

.import-form {
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

:deep(.import-form .el-form-item) {
  margin-bottom: 20px;
}

:deep(.import-form .el-form-item__label) {
  font-weight: 500;
  color: #606266;
  padding-right: 16px;
}

:deep(.import-form .el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  transition: all 0.3s;
}

:deep(.import-form .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.import-form .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #409eff inset;
}

:deep(.import-form .el-select .el-input__wrapper) {
  cursor: pointer;
}

:deep(.import-form .el-textarea__inner) {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

:deep(.import-form .el-textarea__inner:hover) {
  border-color: #c0c4cc;
}

:deep(.import-form .el-textarea__inner:focus) {
  border-color: #409eff;
}

:deep(.import-form .el-input__prefix) {
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
