<template>
  <div class="student-management">
    <div class="section-header">
      <h3>学生管理</h3>
      <p>管理学生学籍资料和信息</p>
    </div>

    <!-- 搜索和操作栏 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入学生姓名" clearable />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="searchForm.studentId" placeholder="请输入学号" clearable />
        </el-form-item>
        <el-form-item label="学院">
          <el-select v-model="searchForm.college" placeholder="请选择学院" clearable>
            <el-option label="计算机学院" value="计算机学院" />
            <el-option label="机械工程学院" value="机械工程学院" />
            <el-option label="经济管理学院" value="经济管理学院" />
            <el-option label="外国语学院" value="外国语学院" />
            <el-option label="艺术设计学院" value="艺术设计学院" />
          </el-select>
        </el-form-item>
        <el-form-item label="专业">
          <el-select v-model="searchForm.major" placeholder="请选择专业" clearable>
            <el-option label="计算机科学与技术" value="计算机科学与技术" />
            <el-option label="软件工程" value="软件工程" />
            <el-option label="机械设计制造及其自动化" value="机械设计制造及其自动化" />
            <el-option label="工商管理" value="工商管理" />
            <el-option label="英语" value="英语" />
            <el-option label="视觉传达设计" value="视觉传达设计" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="searchForm.className" placeholder="请选择班级" clearable>
            <el-option label="一年级1班" value="一年级1班" />
            <el-option label="一年级2班" value="一年级2班" />
            <el-option label="二年级1班" value="二年级1班" />
            <el-option label="二年级2班" value="二年级2班" />
            <el-option label="三年级1班" value="三年级1班" />
            <el-option label="三年级2班" value="三年级2班" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="在读" value="在读" />
            <el-option label="毕业" value="毕业" />
            <el-option label="转学" value="转学" />
            <el-option label="休学" value="休学" />
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

    <!-- 学生列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>学生列表</span>
          <div>
            <el-button type="success" @click="batchImport">
              <el-icon><Upload /></el-icon>
              批量导入
            </el-button>
            <el-button type="primary" @click="addStudent">
              <el-icon><Plus /></el-icon>
              添加学生
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="pagedStudents" stripe>
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.gender === '男' ? 'primary' : 'success'">
              {{ scope.row.gender }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="college" label="学院" width="140" />
        <el-table-column prop="major" label="专业" width="180" />
        <el-table-column prop="className" label="班级" width="120" />
        <el-table-column prop="phone" label="电话" width="150" />
        <el-table-column prop="parentName" label="家长姓名" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="enrollDate" label="入学日期" width="120" />
        <el-table-column label="操作" width="220" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="viewDetails(scope.row)">查看</el-button>
              <el-button size="small" @click="editStudent(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteStudent(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[20, 15, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; text-align: right;"
      />
    </el-card>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑学生信息' : '添加学生'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="studentId">
              <el-input v-model="form.studentId" placeholder="请输入学号" />
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
            <el-form-item label="学院" prop="college">
              <el-select v-model="form.college" placeholder="请选择学院">
                <el-option label="计算机学院" value="计算机学院" />
                <el-option label="机械工程学院" value="机械工程学院" />
                <el-option label="经济管理学院" value="经济管理学院" />
                <el-option label="外国语学院" value="外国语学院" />
                <el-option label="艺术设计学院" value="艺术设计学院" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="专业" prop="major">
              <el-select v-model="form.major" placeholder="请选择专业">
                <el-option label="计算机科学与技术" value="计算机科学与技术" />
                <el-option label="软件工程" value="软件工程" />
                <el-option label="机械设计制造及其自动化" value="机械设计制造及其自动化" />
                <el-option label="工商管理" value="工商管理" />
                <el-option label="英语" value="英语" />
                <el-option label="视觉传达设计" value="视觉传达设计" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="className">
              <el-select v-model="form.className" placeholder="请选择班级">
                <el-option label="一年级1班" value="一年级1班" />
                <el-option label="一年级2班" value="一年级2班" />
                <el-option label="二年级1班" value="二年级1班" />
                <el-option label="二年级2班" value="二年级2班" />
                <el-option label="三年级1班" value="三年级1班" />
                <el-option label="三年级2班" value="三年级2班" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入学生电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="在读" value="在读" />
                <el-option label="毕业" value="毕业" />
                <el-option label="转学" value="转学" />
                <el-option label="休学" value="休学" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="家长姓名" prop="parentName">
              <el-input v-model="form.parentName" placeholder="请输入家长姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="入学日期" prop="enrollDate">
          <el-date-picker
            v-model="form.enrollDate"
            type="date"
            placeholder="选择入学日期"
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
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'StudentManagement',
  setup() {
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref()
    const currentPage = ref(1)
    const pageSize = ref(20)

    const searchForm = reactive({
      name: '',
      studentId: '',
      college: '',
      major: '',
      className: '',
      status: ''
    })

    const form = reactive({
      studentId: '',
      name: '',
      gender: '',
      college: '',
      major: '',
      className: '',
      phone: '',
      parentName: '',
      status: '',
      enrollDate: '',
      remark: ''
    })

    const rules = {
      studentId: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入姓名', trigger: 'blur' }
      ],
      gender: [
        { required: true, message: '请选择性别', trigger: 'change' }
      ],
      college: [
        { required: true, message: '请选择学院', trigger: 'change' }
      ],
      major: [
        { required: true, message: '请选择专业', trigger: 'change' }
      ],
      className: [
        { required: true, message: '请选择班级', trigger: 'change' }
      ],
      status: [
        { required: true, message: '请选择状态', trigger: 'change' }
      ],
      phone: [
        { required: true, message: '请输入电话', trigger: 'blur' }
      ],
      parentName: [
        { required: true, message: '请输入家长姓名', trigger: 'blur' }
      ]
    }

    const students = ref([
      {
        studentId: 'S2024001',
        name: '陈思远',
        gender: '男',
        college: '计算机学院',
        major: '计算机科学与技术',
        className: '计科2022-1班',
        phone: '13800138001',
        parentName: '陈建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '学习优秀'
      },
      {
        studentId: 'S2024002',
        name: '林雨萱',
        gender: '女',
        college: '外国语学院',
        major: '英语',
        className: '英语2022-1班',
        phone: '13800138002',
        parentName: '林美华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '文艺特长'
      },
      {
        studentId: 'S2024003',
        name: '王志强',
        gender: '男',
        college: '机械工程学院',
        major: '机械设计制造及其自动化',
        className: '机械2022-1班',
        phone: '13800138003',
        parentName: '王建军',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '体育特长'
      },
      {
        studentId: 'S2024004',
        name: '刘雅婷',
        gender: '女',
        college: '艺术设计学院',
        major: '视觉传达设计',
        className: '视传2022-1班',
        phone: '13800138004',
        parentName: '刘志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '绘画特长'
      },
      {
        studentId: 'S2024005',
        name: '张浩然',
        gender: '男',
        college: '计算机学院',
        major: '软件工程',
        className: '软工2022-1班',
        phone: '13800138005',
        parentName: '张建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '编程能力强'
      },
      {
        studentId: 'S2024006',
        name: '赵晓敏',
        gender: '女',
        college: '经济管理学院',
        major: '会计学',
        className: '会计2022-1班',
        phone: '13800138006',
        parentName: '赵明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '数学成绩优秀'
      },
      {
        studentId: 'S2024007',
        name: '李佳琪',
        gender: '女',
        college: '外国语学院',
        major: '日语',
        className: '日语2022-1班',
        phone: '13800138007',
        parentName: '李强',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '语言天赋突出'
      },
      {
        studentId: 'S2024008',
        name: '周文博',
        gender: '男',
        college: '机械工程学院',
        major: '车辆工程',
        className: '车辆2022-1班',
        phone: '13800138008',
        parentName: '周建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '动手能力强'
      },
      {
        studentId: 'S2024009',
        name: '吴梦瑶',
        gender: '女',
        college: '艺术设计学院',
        major: '环境设计',
        className: '环设2022-1班',
        phone: '13800138009',
        parentName: '吴志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '设计思维活跃'
      },
      {
        studentId: 'S2024010',
        name: '孙宇航',
        gender: '男',
        college: '计算机学院',
        major: '网络工程',
        className: '网工2022-1班',
        phone: '13800138010',
        parentName: '孙建军',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '网络技术专长'
      },
      {
        studentId: 'S2024011',
        name: '郑雨欣',
        gender: '女',
        college: '经济管理学院',
        major: '市场营销',
        className: '营销2022-1班',
        phone: '13800138011',
        parentName: '郑明华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '沟通能力强'
      },
      {
        studentId: 'S2024012',
        name: '马志豪',
        gender: '男',
        college: '机械工程学院',
        major: '材料科学与工程',
        className: '材料2022-1班',
        phone: '13800138012',
        parentName: '马建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '实验操作熟练'
      },
      {
        studentId: 'S2024013',
        name: '黄诗涵',
        gender: '女',
        college: '外国语学院',
        major: '法语',
        className: '法语2022-1班',
        phone: '13800138013',
        parentName: '黄志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '语言学习能力强'
      },
      {
        studentId: 'S2024014',
        name: '徐子轩',
        gender: '男',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        className: '数据2022-1班',
        phone: '13800138014',
        parentName: '徐建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '数据分析专长'
      },
      {
        studentId: 'S2024015',
        name: '何思雨',
        gender: '女',
        college: '艺术设计学院',
        major: '产品设计',
        className: '产品2022-1班',
        phone: '13800138015',
        parentName: '何志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '创新设计思维'
      },
      {
        studentId: 'S2024016',
        name: '郑雨桐',
        gender: '女',
        college: '外国语学院',
        major: '英语',
        className: '英语2022-2班',
        phone: '13800138016',
        parentName: '郑建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '口语流利'
      },
      {
        studentId: 'S2024017',
        name: '孙志明',
        gender: '男',
        college: '计算机学院',
        major: '网络工程',
        className: '网工2022-1班',
        phone: '13800138017',
        parentName: '孙建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '网络安全专长'
      },
      {
        studentId: 'S2024018',
        name: '马晓雯',
        gender: '女',
        college: '经济管理学院',
        major: '金融学',
        className: '金融2022-1班',
        phone: '13800138018',
        parentName: '马志强',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '数学建模优秀'
      },
      {
        studentId: 'S2024019',
        name: '黄俊杰',
        gender: '男',
        college: '机械工程学院',
        major: '材料科学与工程',
        className: '材料2022-1班',
        phone: '13800138019',
        parentName: '黄建军',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '实验能力强'
      },
      {
        studentId: 'S2024020',
        name: '徐雅静',
        gender: '女',
        college: '艺术设计学院',
        major: '产品设计',
        className: '产品2022-1班',
        phone: '13800138020',
        parentName: '徐志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '创意设计突出'
      },
      {
        studentId: 'S2024021',
        name: '宋文轩',
        gender: '男',
        college: '计算机学院',
        major: '数据科学与大数据技术',
        className: '数据2022-1班',
        phone: '13800138021',
        parentName: '宋建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '数据分析专长'
      },
      {
        studentId: 'S2024022',
        name: '韩雪儿',
        gender: '女',
        college: '外国语学院',
        major: '法语',
        className: '法语2022-1班',
        phone: '13800138022',
        parentName: '韩志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '语言天赋优秀'
      },
      {
        studentId: 'S2024023',
        name: '谢志鹏',
        gender: '男',
        college: '机械工程学院',
        major: '工业工程',
        className: '工业2022-1班',
        phone: '13800138023',
        parentName: '谢建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '管理能力强'
      },
      {
        studentId: 'S2024024',
        name: '邓诗涵',
        gender: '女',
        college: '经济管理学院',
        major: '市场营销',
        className: '营销2022-1班',
        phone: '13800138024',
        parentName: '邓志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '沟通能力突出'
      },
      {
        studentId: 'S2024025',
        name: '高子涵',
        gender: '男',
        college: '计算机学院',
        major: '人工智能',
        className: '智能2022-1班',
        phone: '13800138025',
        parentName: '高建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '算法思维优秀'
      },
      {
        studentId: 'S2024026',
        name: '梁思雨',
        gender: '女',
        college: '艺术设计学院',
        major: '数字媒体艺术',
        className: '数媒2022-1班',
        phone: '13800138026',
        parentName: '梁志强',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '数字创作专长'
      },
      {
        studentId: 'S2024027',
        name: '方志远',
        gender: '男',
        college: '机械工程学院',
        major: '自动化',
        className: '自动化2022-1班',
        phone: '13800138027',
        parentName: '方建军',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '控制系统专长'
      },
      {
        studentId: 'S2024028',
        name: '石梦琪',
        gender: '女',
        college: '外国语学院',
        major: '德语',
        className: '德语2022-1班',
        phone: '13800138028',
        parentName: '石志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '语言学习能力强'
      },
      {
        studentId: 'S2024029',
        name: '曹文博',
        gender: '男',
        college: '经济管理学院',
        major: '国际经济与贸易',
        className: '国贸2022-1班',
        phone: '13800138029',
        parentName: '曹建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '国际贸易专长'
      },
      {
        studentId: 'S2024030',
        name: '袁雅琳',
        gender: '女',
        college: '计算机学院',
        major: '信息安全',
        className: '信安2022-1班',
        phone: '13800138030',
        parentName: '袁志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '安全防护专长'
      },
      {
        studentId: 'S2024031',
        name: '史志豪',
        gender: '男',
        college: '机械工程学院',
        major: '能源与动力工程',
        className: '能动2022-1班',
        phone: '13800138031',
        parentName: '史建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '能源技术专长'
      },
      {
        studentId: 'S2024032',
        name: '白晓彤',
        gender: '女',
        college: '艺术设计学院',
        major: '服装与服饰设计',
        className: '服装2022-1班',
        phone: '13800138032',
        parentName: '白志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '时尚设计专长'
      },
      {
        studentId: 'S2024033',
        name: '潘志强',
        gender: '男',
        college: '计算机学院',
        major: '物联网工程',
        className: '物联网2022-1班',
        phone: '13800138033',
        parentName: '潘建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '物联网技术专长'
      },
      {
        studentId: 'S2024034',
        name: '田雨欣',
        gender: '女',
        college: '外国语学院',
        major: '俄语',
        className: '俄语2022-1班',
        phone: '13800138034',
        parentName: '田志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '语言天赋突出'
      },
      {
        studentId: 'S2024035',
        name: '康志伟',
        gender: '男',
        college: '经济管理学院',
        major: '工商管理',
        className: '工商2022-1班',
        phone: '13800138035',
        parentName: '康建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '管理思维优秀'
      },
      {
        studentId: 'S2024036',
        name: '孟晓雪',
        gender: '女',
        college: '机械工程学院',
        major: '测控技术与仪器',
        className: '测控2022-1班',
        phone: '13800138036',
        parentName: '孟志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '精密测量专长'
      },
      {
        studentId: 'S2024037',
        name: '侯志鹏',
        gender: '男',
        college: '计算机学院',
        major: '计算机科学与技术',
        className: '计科2022-2班',
        phone: '13800138037',
        parentName: '侯建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '算法竞赛获奖'
      },
      {
        studentId: 'S2024038',
        name: '龙雅婷',
        gender: '女',
        college: '艺术设计学院',
        major: '动画',
        className: '动画2022-1班',
        phone: '13800138038',
        parentName: '龙志强',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '动画制作专长'
      },
      {
        studentId: 'S2024039',
        name: '段志明',
        gender: '男',
        college: '经济管理学院',
        major: '人力资源管理',
        className: '人力2022-1班',
        phone: '13800138039',
        parentName: '段建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '组织管理专长'
      },
      {
        studentId: 'S2024040',
        name: '钱晓雯',
        gender: '女',
        college: '外国语学院',
        major: '英语',
        className: '英语2022-3班',
        phone: '13800138040',
        parentName: '钱志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '翻译能力突出'
      },
      {
        studentId: 'S2024041',
        name: '汤志远',
        gender: '男',
        college: '机械工程学院',
        major: '机械电子工程',
        className: '机电2022-1班',
        phone: '13800138041',
        parentName: '汤建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '机电一体化专长'
      },
      {
        studentId: 'S2024042',
        name: '尹梦瑶',
        gender: '女',
        college: '计算机学院',
        major: '软件工程',
        className: '软工2022-2班',
        phone: '13800138042',
        parentName: '尹志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '软件开发专长'
      },
      {
        studentId: 'S2024043',
        name: '黎志豪',
        gender: '男',
        college: '艺术设计学院',
        major: '工业设计',
        className: '工业设计2022-1班',
        phone: '13800138043',
        parentName: '黎建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '产品设计专长'
      },
      {
        studentId: 'S2024044',
        name: '易晓彤',
        gender: '女',
        college: '经济管理学院',
        major: '电子商务',
        className: '电商2022-1班',
        phone: '13800138044',
        parentName: '易志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '电商运营专长'
      },
      {
        studentId: 'S2024045',
        name: '常志强',
        gender: '男',
        college: '外国语学院',
        major: '英语',
        className: '英语2022-4班',
        phone: '13800138045',
        parentName: '常建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '英语教学专长'
      },
      {
        studentId: 'S2024046',
        name: '武雨欣',
        gender: '女',
        college: '机械工程学院',
        major: '机械设计制造及其自动化',
        className: '机械2022-2班',
        phone: '13800138046',
        parentName: '武志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '机械设计专长'
      },
      {
        studentId: 'S2024047',
        name: '乔志伟',
        gender: '男',
        college: '计算机学院',
        major: '网络工程',
        className: '网工2022-2班',
        phone: '13800138047',
        parentName: '乔建华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '网络架构专长'
      },
      {
        studentId: 'S2024048',
        name: '贺雅静',
        gender: '女',
        college: '艺术设计学院',
        major: '视觉传达设计',
        className: '视传2022-2班',
        phone: '13800138048',
        parentName: '贺志华',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '平面设计专长'
      },
      {
        studentId: 'S2024049',
        name: '严志鹏',
        gender: '男',
        college: '经济管理学院',
        major: '财务管理',
        className: '财务2022-1班',
        phone: '13800138049',
        parentName: '严建国',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '财务分析专长'
      },
      {
        studentId: 'S2024050',
        name: '万晓雪',
        gender: '女',
        college: '外国语学院',
        major: '日语',
        className: '日语2022-2班',
        phone: '13800138050',
        parentName: '万志明',
        status: '在读',
        enrollDate: '2022-09-01',
        remark: '日语翻译专长'
      }
    ])

    const filteredStudents = computed(() => {
      let result = students.value

      if (searchForm.name) {
        result = result.filter(student => 
          student.name.includes(searchForm.name)
        )
      }
      if (searchForm.studentId) {
        result = result.filter(student => 
          student.studentId.includes(searchForm.studentId)
        )
      }
      if (searchForm.college) {
        result = result.filter(student => 
          student.college === searchForm.college
        )
      }
      if (searchForm.major) {
        result = result.filter(student => 
          student.major === searchForm.major
        )
      }
      if (searchForm.className) {
        result = result.filter(student => 
          student.className === searchForm.className
        )
      }
      if (searchForm.status) {
        result = result.filter(student => 
          student.status === searchForm.status
        )
      }

      return result
    })

    const total = computed(() => filteredStudents.value.length)

    // 分页后的学生数据
    const pagedStudents = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredStudents.value.slice(start, end)
    })

    const getStatusType = (status) => {
      const types = {
        '在读': 'success',
        '毕业': 'info',
        '转学': 'warning',
        '休学': 'danger'
      }
      return types[status] || 'info'
    }

    const handleSearch = () => {
      currentPage.value = 1
    }

    const resetSearch = () => {
      Object.assign(searchForm, {
        name: '',
        studentId: '',
        college: '',
        major: '',
        className: '',
        status: ''
      })
      currentPage.value = 1
    }

    const handleSizeChange = (val) => {
      pageSize.value = val
    }

    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    const batchImport = () => {
      ElMessage.info('批量导入功能开发中...')
    }

    const addStudent = () => {
      isEdit.value = false
      resetForm()
      dialogVisible.value = true
    }

    const editStudent = (row) => {
      isEdit.value = true
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const viewDetails = (row) => {
      ElMessage.info(`查看 ${row.name} 的详细信息`)
    }

    const deleteStudent = (row) => {
      ElMessageBox.confirm(
        `确定要删除学生 "${row.name}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = students.value.findIndex(item => item.studentId === row.studentId)
        if (index > -1) {
          students.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    const resetForm = () => {
      Object.assign(form, {
        studentId: '',
        name: '',
        gender: '',
        college: '',
        major: '',
        className: '',
        phone: '',
        parentName: '',
        status: '',
        enrollDate: '',
        remark: ''
      })
    }

    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            ElMessage.success('更新成功')
          } else {
            students.value.unshift({ ...form })
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
      searchForm,
      form,
      rules,
      students,
      filteredStudents,
      pagedStudents,
      total,
      getStatusType,
      handleSearch,
      resetSearch,
      handleSizeChange,
      handleCurrentChange,
      batchImport,
      addStudent,
      editStudent,
      viewDetails,
      deleteStudent,
      submitForm
    }
  }
}
</script>

<style scoped>
.student-management {
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

.operation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-start;
}

.operation-buttons .el-button {
  margin: 0;
  flex-shrink: 0;
}
</style>
