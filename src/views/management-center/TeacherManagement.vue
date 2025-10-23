<template>
  <div class="teacher-management">
    <div class="section-header">
      <div class="header-left">
        <h3>教师管理</h3>
        <p>管理教师基本信息和资料</p>
      </div>
      <div class="header-right">
      </div>
    </div>

    <!-- 搜索和操作栏 -->
    <div class="search-section">
      <el-card class="search-card">
        <el-form :model="searchForm" inline>
          <el-form-item label="姓名">
            <el-input v-model="searchForm.name" placeholder="请输入教师姓名" clearable />
          </el-form-item>
          <el-form-item label="科目">
            <el-select v-model="searchForm.subject" placeholder="请选择科目" clearable>
              <el-option label="语文" value="语文" />
              <el-option label="数学" value="数学" />
              <el-option label="英语" value="英语" />
              <el-option label="物理" value="物理" />
              <el-option label="化学" value="化学" />
              <el-option label="生物" value="生物" />
              <el-option label="历史" value="历史" />
              <el-option label="地理" value="地理" />
              <el-option label="政治" value="政治" />
            </el-select>
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="searchForm.department" placeholder="请选择部门" clearable>
              <el-option label="语文组" value="语文组" />
              <el-option label="数学组" value="数学组" />
              <el-option label="英语组" value="英语组" />
              <el-option label="理科组" value="理科组" />
              <el-option label="文科组" value="文科组" />
              <el-option label="综合组" value="综合组" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card class="pending-card" @click="openAuditDialog">
        <div class="pending-content">
          <el-icon class="pending-icon"><Clock /></el-icon>
          <span class="pending-text">待审核（{{ pendingCount }}）</span>
        </div>
      </el-card>
    </div>

    <!-- 教师列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>教师列表</span>
          <el-button type="primary" @click="addTeacher">
            <el-icon><Plus /></el-icon>
            添加教师
          </el-button>
        </div>
      </template>

      <el-table :data="filteredTeachers" stripe>
        <el-table-column prop="id" label="工号" width="100" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.gender === '男' ? 'primary' : 'success'">
              {{ scope.row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="100" />
        <el-table-column prop="education" label="学历" width="100" />
        <el-table-column prop="department" label="部门" width="120" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '在职' ? 'success' : 'danger'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="hireDate" label="入职日期" width="120" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="editTeacher(scope.row)">编辑</el-button>
            <el-button size="small" type="info" @click="viewDetails(scope.row)">详情</el-button>
            <el-button size="small" type="warning" @click="authorizeTeacher(scope.row)">授权修改</el-button>
            <el-button size="small" type="danger" @click="deleteTeacher(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[15, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; text-align: right;"
      />
    </el-card>

    <!-- 添加/编辑教师对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑教师信息' : '添加教师'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工号" prop="id">
              <el-input v-model="form.id" placeholder="请输入工号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-select v-model="form.subject" placeholder="请选择科目">
                <el-option label="语文" value="语文" />
                <el-option label="数学" value="数学" />
                <el-option label="英语" value="英语" />
                <el-option label="物理" value="物理" />
                <el-option label="化学" value="化学" />
                <el-option label="生物" value="生物" />
                <el-option label="历史" value="历史" />
                <el-option label="地理" value="地理" />
                <el-option label="政治" value="政治" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学历" prop="education">
              <el-select v-model="form.education" placeholder="请选择学历">
                <el-option label="博士" value="博士" />
                <el-option label="硕士" value="硕士" />
                <el-option label="本科" value="本科" />
                <el-option label="专科" value="专科" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-select v-model="form.department" placeholder="请选择部门">
                <el-option label="语文组" value="语文组" />
                <el-option label="数学组" value="数学组" />
                <el-option label="英语组" value="英语组" />
                <el-option label="理科组" value="理科组" />
                <el-option label="文科组" value="文科组" />
                <el-option label="综合组" value="综合组" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="在职" value="在职" />
                <el-option label="离职" value="离职" />
                <el-option label="休假" value="休假" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker
            v-model="form.hireDate"
            type="date"
            placeholder="选择入职日期"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 审核弹层 -->
    <el-dialog
      v-model="auditDialogVisible"
      title="教师信息审核"
      width="80%"
      :close-on-click-modal="false"
    >
      <div class="audit-content">
        <div class="audit-summary">
          <el-alert
            title="待审核教师信息修改"
            type="warning"
            :closable="false"
            show-icon
          >
            <template #default>
              共有 {{ pendingTeachers.length }} 位教师提交了信息修改申请，请仔细审核后决定是否通过。
            </template>
          </el-alert>
        </div>

        <el-table :data="pendingTeachers" style="width: 100%" max-height="500">
          <el-table-column prop="name" label="教师姓名" width="120" />
          <el-table-column prop="subject" label="科目" width="100" />
          <el-table-column prop="department" label="部门" width="120" />
          <el-table-column label="修改内容" min-width="200">
            <template #default="{ row }">
              <div class="change-content">
                <div v-for="change in row.changes" :key="change.field" class="change-item">
                  <span class="field-name">{{ change.fieldName }}：</span>
                  <span class="old-value">{{ change.oldValue }}</span>
                  <el-icon class="arrow-icon"><ArrowRight /></el-icon>
                  <span class="new-value">{{ change.newValue }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="150" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button type="success" size="small" @click="approveTeacher(row)">
                通过
              </el-button>
              <el-button type="danger" size="small" @click="rejectTeacher(row)">
                拒绝
              </el-button>
              <el-button type="primary" size="small" @click="viewTeacherDetail(row)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'TeacherManagement',
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const currentPage = ref(1)
    const pageSize = ref(15)
    const auditDialogVisible = ref(false)

    const searchForm = reactive({
      name: '',
      subject: '',
      department: ''
    })

    const form = reactive({
      id: '',
      name: '',
      gender: '',
      subject: '',
      education: '',
      department: '',
      status: '',
      phone: '',
      email: '',
      hireDate: '',
      remark: ''
    })

    const rules = {
      id: [
        { required: true, message: '请输入工号', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],
      subject: [
        { required: true, message: '请选择科目', trigger: 'change' }
      ],
      education: [
        { required: true, message: '请选择学历', trigger: 'change' }
      ],
      department: [
        { required: true, message: '请选择部门', trigger: 'change' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ],
      phone: [
        { required: true, message: '请输入电话', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
      ]
    }

    const teachers = ref([
      {
        id: 'T001',
        name: '张明华',
        gender: '男',
        subject: '数学',
        education: '硕士',
        department: '数学组',
        phone: '13800138001',
        email: 'zhangminghua@school.com',
        status: '在职',
        hireDate: '2020-09-01',
        remark: '数学教研组长'
      },
      {
        id: 'T002',
        name: '李雅琴',
        gender: '女',
        subject: '语文',
        education: '本科',
        department: '语文组',
        phone: '13800138002',
        email: 'liyaqin@school.com',
        status: '在职',
        hireDate: '2019-09-01',
        remark: '语文教研组长'
      },
      {
        id: 'T003',
        name: '王建国',
        gender: '男',
        subject: '英语',
        education: '硕士',
        department: '英语组',
        phone: '13800138003',
        email: 'wangjianguo@school.com',
        status: '在职',
        hireDate: '2021-09-01',
        remark: '英语教研组长'
      },
      {
        id: 'T004',
        name: '刘美玲',
        gender: '女',
        subject: '物理',
        education: '博士',
        department: '理科组',
        phone: '13800138004',
        email: 'liumeiling@school.com',
        status: '在职',
        hireDate: '2018-09-01',
        remark: '物理教研组长'
      },
      {
        id: 'T005',
        name: '陈志强',
        gender: '男',
        subject: '化学',
        education: '硕士',
        department: '理科组',
        phone: '13800138005',
        email: 'chenzhiqiang@school.com',
        status: '离职',
        hireDate: '2017-09-01',
        remark: '已离职'
      },
      {
        id: 'T006',
        name: '赵晓敏',
        gender: '女',
        subject: '生物',
        education: '本科',
        department: '理科组',
        phone: '13800138006',
        email: 'zhaoxiaomin@school.com',
        status: '在职',
        hireDate: '2022-09-01',
        remark: '生物教师'
      },
      {
        id: 'T007',
        name: '孙文博',
        gender: '男',
        subject: '历史',
        education: '硕士',
        department: '文科组',
        phone: '13800138007',
        email: 'sunwenbo@school.com',
        status: '在职',
        hireDate: '2019-09-01',
        remark: '历史教研组长'
      },
      {
        id: 'T008',
        name: '周丽娟',
        gender: '女',
        subject: '地理',
        education: '本科',
        department: '文科组',
        phone: '13800138008',
        email: 'zhouliujuan@school.com',
        status: '在职',
        hireDate: '2020-09-01',
        remark: '地理教师'
      },
      {
        id: 'T009',
        name: '吴建华',
        gender: '男',
        subject: '政治',
        education: '硕士',
        department: '文科组',
        phone: '13800138009',
        email: 'wujianhua@school.com',
        status: '在职',
        hireDate: '2018-09-01',
        remark: '政治教研组长'
      },
      {
        id: 'T010',
        name: '郑雪梅',
        gender: '女',
        subject: '数学',
        education: '本科',
        department: '数学组',
        phone: '13800138010',
        email: 'zhengxuemei@school.com',
        status: '在职',
        hireDate: '2021-09-01',
        remark: '数学教师'
      },
      {
        id: 'T011',
        name: '马志远',
        gender: '男',
        subject: '语文',
        education: '硕士',
        department: '语文组',
        phone: '13800138011',
        email: 'mazhiyuan@school.com',
        status: '在职',
        hireDate: '2017-09-01',
        remark: '语文教师'
      },
      {
        id: 'T012',
        name: '林小芳',
        gender: '女',
        subject: '英语',
        education: '本科',
        department: '英语组',
        phone: '13800138012',
        email: 'linxiaofang@school.com',
        status: '休假',
        hireDate: '2020-09-01',
        remark: '英语教师'
      },
      {
        id: 'T013',
        name: '黄大伟',
        gender: '男',
        subject: '物理',
        education: '博士',
        department: '理科组',
        phone: '13800138013',
        email: 'huangdawei@school.com',
        status: '在职',
        hireDate: '2016-09-01',
        remark: '物理教师'
      },
      {
        id: 'T014',
        name: '徐静怡',
        gender: '女',
        subject: '化学',
        education: '硕士',
        department: '理科组',
        phone: '13800138014',
        email: 'xujingyi@school.com',
        status: '在职',
        hireDate: '2019-09-01',
        remark: '化学教师'
      },
      {
        id: 'T015',
        name: '何志明',
        gender: '男',
        subject: '生物',
        education: '本科',
        department: '理科组',
        phone: '13800138015',
        email: 'hezhiming@school.com',
        status: '在职',
        hireDate: '2022-09-01',
        remark: '生物教师'
      },
      {
        id: 'T016',
        name: '宋雅婷',
        gender: '女',
        subject: '历史',
        education: '硕士',
        department: '文科组',
        phone: '13800138016',
        email: 'songyating@school.com',
        status: '在职',
        hireDate: '2021-09-01',
        remark: '历史教师'
      },
      {
        id: 'T017',
        name: '邓国强',
        gender: '男',
        subject: '地理',
        education: '本科',
        department: '文科组',
        phone: '13800138017',
        email: 'dengguoqiang@school.com',
        status: '在职',
        hireDate: '2018-09-01',
        remark: '地理教师'
      },
      {
        id: 'T018',
        name: '谢美华',
        gender: '女',
        subject: '政治',
        education: '硕士',
        department: '文科组',
        phone: '13800138018',
        email: 'xiemeihua@school.com',
        status: '在职',
        hireDate: '2020-09-01',
        remark: '政治教师'
      },
      {
        id: 'T019',
        name: '罗志军',
        gender: '男',
        subject: '数学',
        education: '博士',
        department: '数学组',
        phone: '13800138019',
        email: 'luozhijun@school.com',
        status: '在职',
        hireDate: '2015-09-01',
        remark: '数学教师'
      },
      {
        id: 'T020',
        name: '唐丽娜',
        gender: '女',
        subject: '语文',
        education: '本科',
        department: '语文组',
        phone: '13800138020',
        email: 'tanglina@school.com',
        status: '在职',
        hireDate: '2022-09-01',
        remark: '语文教师'
      }
    ])

    // 待审核教师数据
    const pendingTeachers = ref([
      {
        id: 'T001',
        name: '张明华',
        subject: '数学',
        department: '数学组',
        submitTime: '2024-01-15 14:30',
        changes: [
          {
            field: 'phone',
            fieldName: '联系电话',
            oldValue: '13800138001',
            newValue: '13900139001'
          },
          {
            field: 'email',
            fieldName: '邮箱',
            oldValue: 'zhangminghua@school.com',
            newValue: 'zhangminghua2024@school.com'
          }
        ]
      },
      {
        id: 'T003',
        name: '王建国',
        subject: '英语',
        department: '英语组',
        submitTime: '2024-01-15 16:20',
        changes: [
          {
            field: 'education',
            fieldName: '学历',
            oldValue: '硕士',
            newValue: '博士'
          },
          {
            field: 'remark',
            fieldName: '备注',
            oldValue: '英语教研组长',
            newValue: '英语教研组长，已获得博士学位'
          }
        ]
      },
      {
        id: 'T007',
        name: '孙文博',
        subject: '历史',
        department: '文科组',
        submitTime: '2024-01-16 09:15',
        changes: [
          {
            field: 'department',
            fieldName: '部门',
            oldValue: '文科组',
            newValue: '综合组'
          }
        ]
      },
      {
        id: 'T012',
        name: '林小芳',
        subject: '英语',
        department: '英语组',
        submitTime: '2024-01-16 11:45',
        changes: [
          {
            field: 'status',
            fieldName: '状态',
            oldValue: '休假',
            newValue: '在职'
          },
          {
            field: 'phone',
            fieldName: '联系电话',
            oldValue: '13800138012',
            newValue: '13800138112'
          }
        ]
      },
      {
        id: 'T015',
        name: '何志明',
        subject: '生物',
        department: '理科组',
        submitTime: '2024-01-16 15:30',
        changes: [
          {
            field: 'education',
            fieldName: '学历',
            oldValue: '本科',
            newValue: '硕士'
          },
          {
            field: 'remark',
            fieldName: '备注',
            oldValue: '生物教师',
            newValue: '生物教师，已获得硕士学位'
          }
        ]
      }
    ])

    const pendingCount = computed(() => pendingTeachers.value.length)

    const filteredTeachers = computed(() => {
      let result = teachers.value

      if (searchForm.name) {
        result = result.filter(teacher => 
          teacher.name.includes(searchForm.name)
        )
      }
      if (searchForm.subject) {
        result = result.filter(teacher => 
          teacher.subject === searchForm.subject
        )
      }
      if (searchForm.department) {
        result = result.filter(teacher => 
          teacher.department === searchForm.department
        )
      }

      return result
    })

    const total = computed(() => filteredTeachers.value.length)

    const handleSearch = () => {
      currentPage.value = 1
    }

    const resetSearch = () => {
      Object.assign(searchForm, {
        name: '',
        subject: '',
        department: ''
      })
      currentPage.value = 1
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const addTeacher = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editTeacher = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const viewDetails = (row) => {
      ElMessage.info(`查看 ${row.name} 的详细信息`)
    }

    const authorizeTeacher = (row) => {
      ElMessageBox.confirm(
        `确定要授权 ${row.name} 修改权限吗？`,
        '确认授权',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        ElMessage.success(`已授权 ${row.name} 修改权限`)
      })
    }

    const deleteTeacher = (row) => {
      ElMessageBox.confirm(
        `确定要删除教师 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = teachers.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          teachers.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    // 审核相关方法
    const openAuditDialog = () => {
      auditDialogVisible.value = true
    }

    const approveTeacher = (row) => {
      ElMessageBox.confirm(
        `确定要通过 ${row.name} 的信息修改申请吗？`,
        '确认通过',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success'
        }
      ).then(() => {
        // 更新教师信息
        const teacherIndex = teachers.value.findIndex(teacher => teacher.id === row.id)
        if (teacherIndex > -1) {
          // 应用修改
          row.changes.forEach(change => {
            if (change.field === 'phone') {
              teachers.value[teacherIndex].phone = change.newValue
            } else if (change.field === 'email') {
              teachers.value[teacherIndex].email = change.newValue
            } else if (change.field === 'education') {
              teachers.value[teacherIndex].education = change.newValue
            } else if (change.field === 'department') {
              teachers.value[teacherIndex].department = change.newValue
            } else if (change.field === 'status') {
              teachers.value[teacherIndex].status = change.newValue
            } else if (change.field === 'remark') {
              teachers.value[teacherIndex].remark = change.newValue
            }
          })
        }
        
        // 从待审核列表中移除
        const pendingIndex = pendingTeachers.value.findIndex(teacher => teacher.id === row.id)
        if (pendingIndex > -1) {
          pendingTeachers.value.splice(pendingIndex, 1)
        }
        
        ElMessage.success(`已通过 ${row.name} 的信息修改申请`)
      })
    }

    const rejectTeacher = (row) => {
      ElMessageBox.confirm(
        `确定要拒绝 ${row.name} 的信息修改申请吗？`,
        '确认拒绝',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        // 从待审核列表中移除
        const pendingIndex = pendingTeachers.value.findIndex(teacher => teacher.id === row.id)
        if (pendingIndex > -1) {
          pendingTeachers.value.splice(pendingIndex, 1)
        }
        
        ElMessage.warning(`已拒绝 ${row.name} 的信息修改申请`)
      })
    }

    const viewTeacherDetail = (row) => {
      ElMessage.info(`查看 ${row.name} 的详细信息`)
    }

    const resetForm = () => {
      Object.assign(form, {
        id: '',
        name: '',
        gender: '',
        subject: '',
        education: '',
        department: '',
        status: '',
        phone: '',
        email: '',
        hireDate: '',
        remark: ''
      })
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            ElMessage.success('更新成功')
          } else {
            teachers.value.unshift({ ...form })
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
      currentPage,
      pageSize,
      auditDialogVisible,
      searchForm,
      form,
      rules,
      teachers,
      pendingTeachers,
      pendingCount,
      filteredTeachers,
      total,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      addTeacher,
      editTeacher,
      viewDetails,
      authorizeTeacher,
      deleteTeacher,
      openAuditDialog,
      approveTeacher,
      rejectTeacher,
      viewTeacherDetail,
      submitForm
    }
  }
}
</script>

<style scoped>
.teacher-management {
  padding: 0;
}

.section-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 改为顶部对齐 */
}

.header-left {
  text-align: left; /* 确保左对齐 */
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.header-left h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  text-align: left; /* 标题左对齐 */
}

.header-left p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  text-align: left; /* 副标题左对齐 */
}

.header-right {
  display: flex;
  align-items: center;
}

.search-section {
  display: flex;
  gap: 20px;
  align-items: stretch; /* 让两个卡片高度一致 */
}

.search-card {
  flex: 1;
  display: flex;
  align-items: center; /* 让搜索卡片内容垂直居中 */
}

.search-card .el-form {
  width: 100%;
  display: flex;
  align-items: center; /* 让表单内容垂直居中 */
  flex-wrap: wrap; /* 允许换行 */
}

.search-card .el-form-item {
  margin-bottom: 0; /* 移除默认的下边距 */
  display: flex;
  align-items: center; /* 让表单项内容垂直居中 */
}

.pending-card {
  width: 200px !important; /* 恢复固定宽度 */
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e4e7ed;
  display: flex !important;
  align-items: center !important; /* 垂直居中内容 */
  height: 100% !important; /* 强制让右侧卡片高度与左侧保持一致 */
  justify-content: center;
}

.pending-card:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px 0 rgba(64, 158, 255, 0.1);
}

.pending-content {
  display: flex;
  align-items: center;
  padding: 6px 16px;
}

.pending-icon {
  color: #e6a23c;
  margin-right: 8px;
  font-size: 16px;
}

.pending-text {
  color: #e6a23c;
  font-weight: 500;
  font-size: 14px;
}

.search-card,
.table-card {
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

/* 审核弹层样式 */
.audit-content {
  padding: 0;
}

.audit-summary {
  margin-bottom: 20px;
}

.change-content {
  padding: 8px 0;
}

.change-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.change-item:last-child {
  margin-bottom: 0;
}

.field-name {
  color: #606266;
  font-weight: 500;
  min-width: 80px;
}

.old-value {
  color: #f56c6c;
  text-decoration: line-through;
  margin: 0 8px;
  background-color: #fef0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.new-value {
  color: #67c23a;
  background-color: #f0f9ff;
  padding: 2px 6px;
  border-radius: 4px;
}

.arrow-icon {
  color: #909399;
  margin: 0 8px;
  font-size: 12px;
}
</style>
