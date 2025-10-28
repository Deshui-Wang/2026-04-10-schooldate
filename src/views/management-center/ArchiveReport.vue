<template>
  <div class="archive-report">
    <div class="section-header">
      <h3>档案报告</h3>
      <p>管理学生档案和各类报告</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="档案类型">
          <el-select v-model="filterForm.archiveType" placeholder="请选择档案类型" clearable>
            <el-option
              v-for="type in archiveTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="所属学院">
          <el-select v-model="filterForm.college" placeholder="请选择所属学院" clearable>
            <el-option
              v-for="college in collegeOptions"
              :key="college"
              :label="college"
              :value="college"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="档案状态">
          <el-select v-model="filterForm.status" placeholder="请选择档案状态" clearable>
            <el-option label="正常" value="正常" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已归档" value="已归档" />
            <el-option label="已销毁" value="已销毁" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="年级">
          <el-select v-model="filterForm.grade" placeholder="请选择年级" clearable>
            <el-option
              v-for="grade in gradeOptions"
              :key="grade"
              :label="grade"
              :value="grade"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="学生姓名">
          <el-input
            v-model="filterForm.studentName"
            placeholder="请输入学生姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="学号">
          <el-input
            v-model="filterForm.studentId"
            placeholder="请输入学号"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 档案列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>档案列表</span>
          <el-button type="primary" @click="addArchive">
            <el-icon><Plus /></el-icon>
            新建档案
          </el-button>
        </div>
      </template>

      <!-- 查看详情弹层 -->
      <el-dialog 
        v-model="dialogVisible" 
        :title="''"
        width="90%"
        class="archive-dialog"
        :show-close="false"
        append-to-body
        modal-append-to-body
      >
        <div class="archive-detail">
          <!-- 顶部标题栏 -->
          <div class="dialog-header">
            <h2>2025下学期教学工作计划</h2>
            <div class="header-actions">
              <el-button text @click="handlePrint">
                <el-icon><Printer /></el-icon>
                打印
              </el-button>
              <el-button text @click="handleDownload">
                <el-icon><Download /></el-icon>
                下载
              </el-button>
              <el-button text @click="dialogVisible = false">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 信息栏 -->
          <div class="dialog-info">
            <div class="info-left">
              <el-icon><Calendar /></el-icon>
              <span>创建时间: {{ currentDate }}</span>
            </div>
            <div class="info-right">
              <el-icon><Grid /></el-icon>
              <span>共3个模块</span>
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="dialog-content">
            <!-- 模块1: 成果奖励 -->
            <div class="content-module">
              <div class="module-header">
                <el-icon><Trophy /></el-icon>
                <span>成果奖励</span>
              </div>
              <div class="module-body">
                <div class="chart-section">
                  <div class="chart-header">
                    <h4>成果奖励统计</h4>
                    <span class="chart-type">柱状图</span>
                  </div>
                  <div class="chart-container">
                    <div class="bar-chart">
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 85%; background: #409EFF;">
                            <span class="bar-value">85%</span>
                          </div>
                        </div>
                        <span class="bar-label">论文</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 65%; background: #67C23A;">
                            <span class="bar-value">65%</span>
                          </div>
                        </div>
                        <span class="bar-label">专利</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 90%; background: #E6A23C;">
                            <span class="bar-value">90%</span>
                          </div>
                        </div>
                        <span class="bar-label">证书</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 75%; background: #F56C6C;">
                            <span class="bar-value">75%</span>
                          </div>
                        </div>
                        <span class="bar-label">项目</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="summary-section">
                  <div class="summary-header">
                    <el-icon><Document /></el-icon>
                    <span>模块总结</span>
                  </div>
                  <p class="summary-text">
                    本模块记录了教师在教学、科研、管理等方面取得的突出成果。包括国家级奖项2项、省级奖项5项、市级奖项5项，总计12项。发表学术论文8篇，其中核心期刊3篇。申请专利3项，其中2项已获得授权。这些成果充分展现了教师的专业能力和工作水平。
                  </p>
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">总计奖项</div>
                      <div class="metric-value">12项</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">核心论文</div>
                      <div class="metric-value">3篇</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">授权专利</div>
                      <div class="metric-value">2项</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">完成度</div>
                      <div class="metric-value">85%</div>
                    </div>
                  </div>
                  <div class="module-tag">模块1</div>
                </div>
              </div>
            </div>

            <!-- 模块2: 工作量统计 -->
            <div class="content-module">
              <div class="module-header">
                <el-icon><DataAnalysis /></el-icon>
                <span>工作量统计</span>
              </div>
              <div class="module-body">
                <div class="chart-section">
                  <div class="chart-header">
                    <h4>工作量分布</h4>
                    <span class="chart-type">柱状图</span>
                  </div>
                  <div class="chart-container">
                    <div class="bar-chart">
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 78%; background: #409EFF;">
                            <span class="bar-value">78%</span>
                          </div>
                        </div>
                        <span class="bar-label">教学</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 82%; background: #67C23A;">
                            <span class="bar-value">82%</span>
                          </div>
                        </div>
                        <span class="bar-label">科研</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 68%; background: #E6A23C;">
                            <span class="bar-value">68%</span>
                          </div>
                        </div>
                        <span class="bar-label">管理</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 72%; background: #F56C6C;">
                            <span class="bar-value">72%</span>
                          </div>
                        </div>
                        <span class="bar-label">服务</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="summary-section">
                  <div class="summary-header">
                    <el-icon><Document /></el-icon>
                    <span>模块总结</span>
                  </div>
                  <p class="summary-text">
                    本学期共完成教学学时368学时，超额完成20%。科研工作占总工作量的28%，参与或承担科研项目5项，其中主持2项，参与3项。承担班主任工作及系部管理工作，各项工作安排合理，完成质量高。
                  </p>
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">教学学时</div>
                      <div class="metric-value">368时</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">科研项目</div>
                      <div class="metric-value">5项</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">管理工作</div>
                      <div class="metric-value">2项</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">超额完成</div>
                      <div class="metric-value">20%</div>
                    </div>
                  </div>
                  <div class="module-tag">模块2</div>
                </div>
              </div>
            </div>

            <!-- 模块3: 数字素养 -->
            <div class="content-module">
              <div class="module-header">
                <el-icon><Monitor /></el-icon>
                <span>数字素养</span>
              </div>
              <div class="module-body">
                <div class="chart-section">
                  <div class="chart-header">
                    <h4>数字素养能力</h4>
                    <span class="chart-type">柱状图</span>
                  </div>
                  <div class="chart-container">
                    <div class="bar-chart">
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 88%; background: #409EFF;">
                            <span class="bar-value">88%</span>
                          </div>
                        </div>
                        <span class="bar-label">信息技术</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 92%; background: #67C23A;">
                            <span class="bar-value">92%</span>
                          </div>
                        </div>
                        <span class="bar-label">数据分析</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 85%; background: #E6A23C;">
                            <span class="bar-value">85%</span>
                          </div>
                        </div>
                        <span class="bar-label">工具应用</span>
                      </div>
                      <div class="bar-item">
                        <div class="bar-wrapper">
                          <div class="bar" style="height: 80%; background: #F56C6C;">
                            <span class="bar-value">80%</span>
                          </div>
                        </div>
                        <span class="bar-label">创新能力</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="summary-section">
                  <div class="summary-header">
                    <el-icon><Document /></el-icon>
                    <span>模块总结</span>
                  </div>
                  <p class="summary-text">
                    熟练掌握多种数字化教学软件和平台，积极探索智慧课堂教学模式，获得高级教育技术应用能力认证证书。在教学数据分析与可视化方面表现突出，能够运用现代信息技术手段优化教学过程。自主开发数字化教学工具3个，得到师生广泛好评。
                  </p>
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">掌握工具</div>
                      <div class="metric-value">15种</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">开发应用</div>
                      <div class="metric-value">3个</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">培训证书</div>
                      <div class="metric-value">高级</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">综合评分</div>
                      <div class="metric-value">88分</div>
                    </div>
                  </div>
                  <div class="module-tag">模块3</div>
                </div>
              </div>
            </div>

            <!-- 报告总体总结 -->
            <div class="content-module summary-module">
              <div class="module-header">
                <el-icon><Document /></el-icon>
                <span>报告总体总结</span>
                <span class="report-date">{{ currentDate }}</span>
              </div>
              <div class="summary-content-wrapper">
                <div class="summary-content">
                <div class="summary-section-item">
                  <h5>概述</h5>
                  <p>
                    本报告全面梳理了2025下学期教学工作计划执行情况，从成果奖励、工作量统计、数字素养三个维度进行了深入分析。通过数据统计和质性分析相结合的方式，客观呈现了教学工作的主要进展和突出成绩，为后续教学管理和专业发展提供了有力支撑。
                  </p>
                </div>
                <div class="summary-section-item">
                  <h5>关键亮点</h5>
                  <ul class="highlight-list">
                    <li>
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span>成果奖励丰硕，获得国家级和省级多项认可</span>
                    </li>
                    <li>
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span>工作量饱满且分布合理，超额完成教学任务</span>
                    </li>
                    <li>
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span>数字素养能力突出，掌握多种现代化教学工具</span>
                    </li>
                    <li>
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span>论文发表质量高，核心期刊占比优秀</span>
                    </li>
                    <li>
                      <el-icon><CircleCheckFilled /></el-icon>
                      <span>专利申请与授权进展良好，科研成果丰富</span>
                    </li>
                  </ul>
                </div>
                <div class="summary-section-item">
                  <h5>改进建议</h5>
                  <ol class="suggestion-list">
                    <li>继续保持科研工作的高投入，争取更多高水平成果产出</li>
                    <li>加强跨学科交流与合作，拓展学术视野和研究领域</li>
                    <li>进一步提升数字化教学创新能力，探索更多创新教学模式</li>
                    <li>注重工作与生活平衡，保持身心健康和持续发展动力</li>
                    <li>积极参与学术会议和专业培训，不断更新知识结构</li>
                  </ol>
                </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部 -->
          <div class="dialog-footer-custom">
            <span>AI教师档案管理系统</span>
            <span>报告生成时间: 2025/10/28 09:36:24</span>
          </div>
        </div>
      </el-dialog>

      <el-table :data="filteredArchives" stripe>
        <el-table-column prop="archiveCode" label="档案编号" min-width="120" />
        <el-table-column prop="studentName" label="学生姓名" min-width="100" />
        <el-table-column prop="studentId" label="学号" min-width="120" />
        <el-table-column prop="archiveType" label="档案类型" min-width="120" />
        <el-table-column prop="college" label="所属学院" min-width="140" />
        <el-table-column prop="grade" label="年级" min-width="80" />
        <el-table-column prop="major" label="专业" min-width="160" show-overflow-tooltip />
        <el-table-column prop="createDate" label="创建日期" min-width="120" />
        <el-table-column prop="updateDate" label="更新日期" min-width="120" />
        <el-table-column prop="fileCount" label="文件数量" min-width="100" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="viewArchive(scope.row)">查看</el-button>
              <el-button size="small" type="success" @click="downloadArchive(scope.row)">下载</el-button>
              <el-button size="small" type="warning" @click="auditArchive(scope.row)">审核</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, 
  Printer, 
  Download, 
  Close, 
  Calendar, 
  Grid, 
  Trophy, 
  DataAnalysis, 
  Monitor, 
  Document, 
  CircleCheckFilled 
} from '@element-plus/icons-vue'

export default {
  name: 'ArchiveReport',
  components: {
    Plus,
    Printer,
    Download,
    Close,
    Calendar,
    Grid,
    Trophy,
    DataAnalysis,
    Monitor,
    Document,
    CircleCheckFilled
  },
  setup() {
    const dialogVisible = ref(false)
    
    // 当前日期
    const currentDate = computed(() => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })
    const archives = ref([
      {
        id: 1,
        archiveCode: 'ARCH-001',
        studentName: '张小明',
        studentId: '2021001001',
        archiveType: '学籍档案',
        college: '计算机学院',
        grade: '2021级',
        major: '计算机科学与技术',
        createDate: '2021-09-01',
        updateDate: '2023-12-15',
        fileCount: 15,
        status: '正常'
      },
      {
        id: 2,
        archiveCode: 'ARCH-002',
        studentName: '李小红',
        studentId: '2021001002',
        archiveType: '成绩档案',
        college: '计算机学院',
        grade: '2021级',
        major: '软件工程',
        createDate: '2021-09-01',
        updateDate: '2023-12-10',
        fileCount: 8,
        status: '正常'
      },
      {
        id: 3,
        archiveCode: 'ARCH-003',
        studentName: '王小强',
        studentId: '2022002001',
        archiveType: '奖惩档案',
        college: '机械工程学院',
        grade: '2022级',
        major: '机械设计制造及其自动化',
        createDate: '2022-09-01',
        updateDate: '2023-11-20',
        fileCount: 5,
        status: '待审核'
      },
      {
        id: 4,
        archiveCode: 'ARCH-004',
        studentName: '赵小丽',
        studentId: '2022002002',
        archiveType: '实习档案',
        college: '计算机学院',
        grade: '2022级',
        major: '网络工程',
        createDate: '2022-09-01',
        updateDate: '2023-12-05',
        fileCount: 12,
        status: '正常'
      },
      {
        id: 5,
        archiveCode: 'ARCH-005',
        studentName: '陈小军',
        studentId: '2020001001',
        archiveType: '毕业档案',
        college: '计算机学院',
        grade: '2020级',
        major: '计算机科学与技术',
        createDate: '2020-09-01',
        updateDate: '2023-06-30',
        fileCount: 25,
        status: '已归档'
      },
      {
        id: 6,
        archiveCode: 'ARCH-006',
        studentName: '刘小芳',
        studentId: '2021003001',
        archiveType: '学籍档案',
        college: '设计学院',
        grade: '2021级',
        major: '视觉传达设计',
        createDate: '2021-09-01',
        updateDate: '2023-12-12',
        fileCount: 18,
        status: '正常'
      },
      {
        id: 7,
        archiveCode: 'ARCH-007',
        studentName: '孙小华',
        studentId: '2022003001',
        archiveType: '成绩档案',
        college: '设计学院',
        grade: '2022级',
        major: '环境设计',
        createDate: '2022-09-01',
        updateDate: '2023-12-08',
        fileCount: 10,
        status: '正常'
      },
      {
        id: 8,
        archiveCode: 'ARCH-008',
        studentName: '周小敏',
        studentId: '2021004001',
        archiveType: '奖惩档案',
        college: '音乐学院',
        grade: '2021级',
        major: '音乐表演',
        createDate: '2021-09-01',
        updateDate: '2023-11-25',
        fileCount: 6,
        status: '待审核'
      },
      {
        id: 9,
        archiveCode: 'ARCH-009',
        studentName: '吴小勇',
        studentId: '2022004001',
        archiveType: '实习档案',
        college: '机械工程学院',
        grade: '2022级',
        major: '机械电子工程',
        createDate: '2022-09-01',
        updateDate: '2023-12-18',
        fileCount: 14,
        status: '正常'
      },
      {
        id: 10,
        archiveCode: 'ARCH-010',
        studentName: '郑小丽',
        studentId: '2020002001',
        archiveType: '毕业档案',
        college: '设计学院',
        grade: '2020级',
        major: '产品设计',
        createDate: '2020-09-01',
        updateDate: '2023-06-25',
        fileCount: 22,
        status: '已归档'
      },
      {
        id: 11,
        archiveCode: 'ARCH-011',
        studentName: '马小涛',
        studentId: '2021005001',
        archiveType: '学籍档案',
        college: '传媒学院',
        grade: '2021级',
        major: '广播电视学',
        createDate: '2021-09-01',
        updateDate: '2023-12-20',
        fileCount: 16,
        status: '正常'
      },
      {
        id: 12,
        archiveCode: 'ARCH-012',
        studentName: '林小雪',
        studentId: '2022005001',
        archiveType: '成绩档案',
        college: '传媒学院',
        grade: '2022级',
        major: '新闻学',
        createDate: '2022-09-01',
        updateDate: '2023-12-14',
        fileCount: 9,
        status: '正常'
      },
      {
        id: 13,
        archiveCode: 'ARCH-013',
        studentName: '黄小明',
        studentId: '2021006001',
        archiveType: '奖惩档案',
        college: '艺术学院',
        grade: '2021级',
        major: '美术学',
        createDate: '2021-09-01',
        updateDate: '2023-11-30',
        fileCount: 7,
        status: '待审核'
      },
      {
        id: 14,
        archiveCode: 'ARCH-014',
        studentName: '徐小芳',
        studentId: '2022006001',
        archiveType: '实习档案',
        college: '艺术学院',
        grade: '2022级',
        major: '绘画',
        createDate: '2022-09-01',
        updateDate: '2023-12-22',
        fileCount: 13,
        status: '正常'
      },
      {
        id: 15,
        archiveCode: 'ARCH-015',
        studentName: '何小军',
        studentId: '2020003001',
        archiveType: '毕业档案',
        college: '音乐学院',
        grade: '2020级',
        major: '音乐学',
        createDate: '2020-09-01',
        updateDate: '2023-06-20',
        fileCount: 28,
        status: '已归档'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      archiveType: '',
      college: '',
      status: '',
      grade: '',
      studentName: '',
      studentId: ''
    })

    // 筛选选项
    const archiveTypeOptions = ref([
      '学籍档案',
      '成绩档案',
      '奖惩档案',
      '实习档案',
      '毕业档案',
      '健康档案',
      '家庭档案'
    ])
    
    const collegeOptions = ref([
      '计算机学院',
      '机械工程学院',
      '设计学院',
      '音乐学院',
      '传媒学院',
      '艺术学院'
    ])

    const gradeOptions = ref([
      '2020级',
      '2021级',
      '2022级',
      '2023级'
    ])

    // 筛选后的档案数据
    const filteredArchives = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredArchives.value = archives.value.filter(archive => {
        return (
          (!filterForm.archiveType || archive.archiveType === filterForm.archiveType) &&
          (!filterForm.college || archive.college === filterForm.college) &&
          (!filterForm.status || archive.status === filterForm.status) &&
          (!filterForm.grade || archive.grade === filterForm.grade) &&
          (!filterForm.studentName || archive.studentName.includes(filterForm.studentName)) &&
          (!filterForm.studentId || archive.studentId.includes(filterForm.studentId))
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.archiveType = ''
      filterForm.college = ''
      filterForm.status = ''
      filterForm.grade = ''
      filterForm.studentName = ''
      filterForm.studentId = ''
      filteredArchives.value = archives.value
    }

    // 初始化时显示所有档案
    filteredArchives.value = archives.value

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '正常': 'success',
        '待审核': 'warning',
        '已归档': 'info',
        '已销毁': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const addArchive = () => {
      ElMessage.info('新建档案功能开发中...')
    }

    const viewArchive = (row) => {
      dialogVisible.value = true
      ElMessage.info(`查看档案 ${row.studentName} 详细信息`)
    }
    
    const handlePrint = () => {
      window.print()
    }
    
    const handleDownload = () => {
      ElMessage.success('下载功能开发中...')
    }

    const editArchive = (row) => {
      ElMessage.info(`编辑档案 ${row.studentName}`)
    }

    const downloadArchive = (row) => {
      ElMessage.info(`下载档案 ${row.studentName}`)
    }

    const auditArchive = (row) => {
      ElMessage.info(`审核档案 ${row.studentName}`)
    }

    const deleteArchive = (row) => {
      ElMessageBox.confirm(
        `确定要删除档案 "${row.studentName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = archives.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          archives.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      dialogVisible,
      currentDate,
      archives,
      filteredArchives,
      filterForm,
      archiveTypeOptions,
      collegeOptions,
      gradeOptions,
      applyFilter,
      resetFilter,
      getStatusType,
      addArchive,
      viewArchive,
      handlePrint,
      handleDownload,
      editArchive,
      downloadArchive,
      auditArchive,
      deleteArchive
    }
  }
}
</script>

<style scoped>
.archive-report {
  padding: 0;
}

.section-header {
  margin-bottom: 20px;
}

/* 弹层样式 */
:deep(.archive-dialog) {
  .el-dialog__header {
    padding: 0;
  }
  
  .el-dialog__body {
    padding: 0;
    background: #f5f7fa;
  }
}

.archive-detail {
  background: #fff;
}

/* 顶部标题栏 */
.dialog-header {
  background: #303133;
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.header-actions .el-button {
  color: white;
}

.header-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 信息栏 */
.dialog-info {
  background: #e6f3ff;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #606266;
}

.info-left,
.info-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 内容区域 */
.dialog-content {
  padding: 30px;
}

.content-module {
  background: white;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.module-header {
  background: #f0f2f5;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.module-body {
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* 图表区域 */
.chart-section {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 15px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.chart-header h4 {
  margin: 0;
  font-size: 14px;
  color: #303133;
}

.chart-type {
  font-size: 12px;
  color: #909399;
}

.chart-container {
  height: 200px;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bar-wrapper {
  height: 100%;
  width: 60%;
  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;
  position: relative;
  border-radius: 4px 4px 0 0;
  min-height: 20%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 5px;
}

.bar-value {
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.bar-label {
  font-size: 13px;
  color: #606266;
}

/* 模块总结区域 */
.summary-section {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  padding: 15px;
  position: relative;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.summary-text {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.metric-card {
  border: 1px solid #b3d8ff;
  border-radius: 6px;
  padding: 12px;
  background: #f0f9ff;
}

.metric-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.module-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  color: #909399;
}

/* 报告总体总结 */
.summary-module {
  margin-top: 30px;
}

.summary-module .module-body {
  grid-template-columns: 1fr;
}

.module-header .report-date {
  margin-left: auto;
  font-size: 14px;
  font-weight: normal;
  color: #909399;
}

.summary-content-wrapper {
  padding: 20px;
}

.summary-content {
  max-width: none;
}

.summary-section-item {
  margin-bottom: 25px;
}

.summary-section-item h5 {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #303133;
  font-weight: 600;
}

.summary-section-item p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.highlight-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlight-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}

.highlight-list li .el-icon {
  color: #67c23a;
  font-size: 18px;
}

.suggestion-list {
  padding-left: 20px;
  margin: 0;
}

.suggestion-list li {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.suggestion-list li::marker {
  color: #e6a23c;
  font-weight: 600;
}

/* 底部 */
.dialog-footer-custom {
  background: #f5f7fa;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #909399;
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

.filter-card {
  margin-bottom: 20px;
}

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
