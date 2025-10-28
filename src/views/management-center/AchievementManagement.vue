<template>
  <div class="achievement-management">
    <div class="section-header">
      <h3>成果管理</h3>
      <p>管理教师科研、证书、认证、获奖情况等成果</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="成果类型">
          <el-select v-model="filterForm.achievementType" placeholder="请选择成果类型" clearable>
            <el-option
              v-for="type in achievementTypeOptions"
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
        
        <el-form-item label="成果状态">
          <el-select v-model="filterForm.status" placeholder="请选择成果状态" clearable>
            <el-option label="已发表" value="已发表" />
            <el-option label="已申请" value="已申请" />
            <el-option label="已获得" value="已获得" />
            <el-option label="审核中" value="审核中" />
            <el-option label="已过期" value="已过期" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="成果名称">
          <el-input
            v-model="filterForm.achievementName"
            placeholder="请输入成果名称"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="教师姓名">
          <el-input
            v-model="filterForm.teacherName"
            placeholder="请输入教师姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 成果列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>成果列表</span>
          <el-button type="primary" @click="addAchievement">
            <el-icon><Plus /></el-icon>
            添加成果
          </el-button>
        </div>
      </template>

      <el-table :data="filteredAchievements" stripe>
        <el-table-column prop="achievementCode" label="成果编号" min-width="120" />
        <el-table-column prop="achievementName" label="成果名称" min-width="200" />
        <el-table-column prop="achievementType" label="成果类型" min-width="120" />
        <el-table-column prop="teacherName" label="教师姓名" min-width="100" />
        <el-table-column prop="college" label="所属学院" min-width="120" />
        <el-table-column prop="publishDate" label="发表/获得日期" min-width="140" />
        <el-table-column prop="publisher" label="发表机构/颁发机构" min-width="180" />
        <el-table-column prop="level" label="级别" min-width="100">
          <template #default="scope">
            <el-tag :type="getLevelType(scope.row.level)">
              {{ scope.row.level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="积分" min-width="80" />
        <el-table-column label="操作" width="250" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="viewAchievement(scope.row)">查看</el-button>
              <el-button size="small" @click="editAchievement(scope.row)">编辑</el-button>
              <el-button size="small" type="warning" @click="verifyAchievement(scope.row)">审核</el-button>
              <el-button size="small" type="danger" @click="deleteAchievement(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AchievementManagement',
  setup() {
    const achievements = ref([
      {
        id: 1,
        achievementCode: 'PAP-001',
        achievementName: '基于深度学习的智能教学系统研究',
        achievementType: '学术论文',
        teacherName: '张明华',
        college: '计算机学院',
        publishDate: '2023-12-15',
        publisher: '计算机应用与软件',
        level: '核心期刊',
        status: '已发表',
        score: 15
      },
      {
        id: 2,
        achievementCode: 'PAT-001',
        achievementName: '一种智能教学辅助装置',
        achievementType: '发明专利',
        teacherName: '李雅琴',
        college: '计算机学院',
        publishDate: '2023-11-20',
        publisher: '国家知识产权局',
        level: '发明专利',
        status: '已申请',
        score: 20
      },
      {
        id: 3,
        achievementCode: 'CER-001',
        achievementName: '高级软件工程师',
        achievementType: '职业证书',
        teacherName: '王建国',
        college: '计算机学院',
        publishDate: '2023-10-10',
        publisher: '工业和信息化部',
        level: '国家级',
        status: '已获得',
        score: 10
      },
      {
        id: 4,
        achievementCode: 'AWARD-001',
        achievementName: '全国职业院校技能大赛优秀指导教师',
        achievementType: '教学成果',
        teacherName: '赵丽娟',
        college: '教务处',
        publishDate: '2023-09-15',
        publisher: '教育部',
        level: '国家级',
        status: '已获得',
        score: 25
      },
      {
        id: 5,
        achievementCode: 'BOOK-001',
        achievementName: 'Java程序设计基础教程',
        achievementType: '教材编写',
        teacherName: '陈志强',
        college: '计算机学院',
        publishDate: '2023-08-20',
        publisher: '清华大学出版社',
        level: '国家级',
        status: '已发表',
        score: 18
      },
      {
        id: 6,
        achievementCode: 'PROJ-001',
        achievementName: '基于云计算的智慧校园平台',
        achievementType: '科研项目',
        teacherName: '刘美玲',
        college: '计算机学院',
        publishDate: '2023-07-30',
        publisher: '省教育厅',
        level: '省级',
        status: '审核中',
        score: 12
      },
      {
        id: 7,
        achievementCode: 'CERT-001',
        achievementName: 'Oracle数据库管理员认证',
        achievementType: '行业认证',
        teacherName: '孙建华',
        college: '计算机学院',
        publishDate: '2023-06-25',
        publisher: 'Oracle公司',
        level: '国际级',
        status: '已获得',
        score: 8
      },
      {
        id: 8,
        achievementCode: 'PAP-002',
        achievementName: '职业教育信息化发展策略研究',
        achievementType: '学术论文',
        teacherName: '周晓敏',
        college: '教育学院',
        publishDate: '2023-05-18',
        publisher: '职业技术教育',
        level: '核心期刊',
        status: '已发表',
        score: 15
      },
      {
        id: 9,
        achievementCode: 'PAT-002',
        achievementName: '一种智能实训设备控制系统',
        achievementType: '实用新型专利',
        teacherName: '吴志勇',
        college: '机械工程学院',
        publishDate: '2023-04-12',
        publisher: '国家知识产权局',
        level: '实用新型',
        status: '已申请',
        score: 12
      },
      {
        id: 10,
        achievementCode: 'AWARD-002',
        achievementName: '省级教学名师',
        achievementType: '教学成果',
        teacherName: '郑丽华',
        college: '音乐学院',
        publishDate: '2023-03-20',
        publisher: '省教育厅',
        level: '省级',
        status: '已获得',
        score: 20
      },
      {
        id: 11,
        achievementCode: 'CERT-002',
        achievementName: 'Adobe认证专家',
        achievementType: '行业认证',
        teacherName: '马文涛',
        college: '设计学院',
        publishDate: '2023-02-15',
        publisher: 'Adobe公司',
        level: '国际级',
        status: '已过期',
        score: 6
      },
      {
        id: 12,
        achievementCode: 'PROJ-002',
        achievementName: '产教融合背景下人才培养模式创新',
        achievementType: '教改项目',
        teacherName: '林雪梅',
        college: '教务处',
        publishDate: '2023-01-10',
        publisher: '教育部',
        level: '国家级',
        status: '审核中',
        score: 15
      },
      {
        id: 13,
        achievementCode: 'BOOK-002',
        achievementName: 'Web前端开发技术',
        achievementType: '教材编写',
        teacherName: '黄志明',
        college: '计算机学院',
        publishDate: '2022-12-05',
        publisher: '人民邮电出版社',
        level: '国家级',
        status: '已发表',
        score: 18
      },
      {
        id: 14,
        achievementCode: 'PAP-003',
        achievementName: '人工智能在职业教育中的应用研究',
        achievementType: '学术论文',
        teacherName: '徐雅芳',
        college: '计算机学院',
        publishDate: '2022-11-20',
        publisher: '中国职业技术教育',
        level: '核心期刊',
        status: '已发表',
        score: 15
      },
      {
        id: 15,
        achievementCode: 'AWARD-003',
        achievementName: '全国职业院校信息化教学大赛一等奖',
        achievementType: '教学成果',
        teacherName: '何建军',
        college: '设计学院',
        publishDate: '2022-10-15',
        publisher: '教育部',
        level: '国家级',
        status: '已获得',
        score: 30
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      achievementType: '',
      college: '',
      status: '',
      achievementName: '',
      teacherName: ''
    })

    // 筛选选项
    const achievementTypeOptions = ref([
      '学术论文',
      '发明专利',
      '实用新型专利',
      '职业证书',
      '行业认证',
      '教学成果',
      '教材编写',
      '科研项目',
      '教改项目'
    ])
    
    const collegeOptions = ref([
      '计算机学院',
      '机械工程学院',
      '教育学院',
      '设计学院',
      '音乐学院',
      '教务处',
      '传媒学院',
      '艺术学院'
    ])

    // 筛选后的成果数据
    const filteredAchievements = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredAchievements.value = achievements.value.filter(achievement => {
        return (
          (!filterForm.achievementType || achievement.achievementType === filterForm.achievementType) &&
          (!filterForm.college || achievement.college === filterForm.college) &&
          (!filterForm.status || achievement.status === filterForm.status) &&
          (!filterForm.achievementName || achievement.achievementName.includes(filterForm.achievementName)) &&
          (!filterForm.teacherName || achievement.teacherName.includes(filterForm.teacherName))
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.achievementType = ''
      filterForm.college = ''
      filterForm.status = ''
      filterForm.achievementName = ''
      filterForm.teacherName = ''
      filteredAchievements.value = achievements.value
    }

    // 初始化时显示所有成果
    filteredAchievements.value = achievements.value

    // 获取级别类型
    const getLevelType = (level) => {
      const levelMap = {
        '国家级': 'danger',
        '省级': 'warning',
        '市级': 'info',
        '校级': 'success',
        '核心期刊': 'danger',
        '普通期刊': 'info',
        '发明专利': 'danger',
        '实用新型': 'warning',
        '国际级': 'danger'
      }
      return levelMap[level] || 'info'
    }

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '已发表': 'success',
        '已申请': 'warning',
        '已获得': 'success',
        '审核中': 'info',
        '已过期': 'danger'
      }
      return statusMap[status] || 'info'
    }

    const addAchievement = () => {
      ElMessage.info('添加成果功能开发中...')
    }

    const viewAchievement = (row) => {
      ElMessage.info(`查看成果 ${row.achievementName} 详细信息`)
    }

    const editAchievement = (row) => {
      ElMessage.info(`编辑成果 ${row.achievementName}`)
    }

    const verifyAchievement = (row) => {
      ElMessage.info(`审核成果 ${row.achievementName}`)
    }

    const deleteAchievement = (row) => {
      ElMessageBox.confirm(
        `确定要删除成果 "${row.achievementName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = achievements.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          achievements.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      achievements,
      filteredAchievements,
      filterForm,
      achievementTypeOptions,
      collegeOptions,
      applyFilter,
      resetFilter,
      getLevelType,
      getStatusType,
      addAchievement,
      viewAchievement,
      editAchievement,
      verifyAchievement,
      deleteAchievement
    }
  }
}
</script>

<style scoped>
.achievement-management {
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
