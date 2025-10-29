<template>
  <div class="smart-monitoring">
    <!-- 页面头部 -->
    <div class="section-header">
      <h3>智能监测</h3>
      <p>教师成长过程数据多维管理与智能异常检测</p>
    </div>

    <!-- 监测概览 -->
    <el-row :gutter="20" class="overview-cards">
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon normal">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.normal }}</div>
              <div class="card-label">正常状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon warning">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.warning }}</div>
              <div class="card-label">预警状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon danger">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.danger }}</div>
              <div class="card-label">异常状态</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="overview-card" shadow="never">
          <div class="card-content">
            <div class="card-icon total">
              <el-icon><DataAnalysis /></el-icon>
            </div>
            <div class="card-info">
              <div class="card-value">{{ overviewStats.total }}</div>
              <div class="card-label">总教师数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    

    <!-- 异常检测结果 -->
    <el-card class="anomaly-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Warning /></el-icon>
          <span>异常教师</span>
          <el-tag type="danger" class="ml-2">{{ anomalyList.length }} 个异常</el-tag>
        </div>
      </template>
      
      <div v-if="anomalyList.length === 0" class="empty-state">
        <el-empty description="暂无异常检测结果">
          <el-button type="primary" @click="startDetection">开始检测</el-button>
        </el-empty>
      </div>

      <div v-else class="anomaly-list">
        <div 
          v-for="anomaly in anomalyList" 
          :key="anomaly.id"
          class="anomaly-item"
          :class="anomaly.level"
        >
          <div class="anomaly-header">
            <div class="anomaly-info">
              <div class="teacher-name">
                <h4>{{ anomaly.teacherName }}</h4>
                <el-tag :type="anomaly.level === 'danger' ? 'danger' : 'warning'">
                  {{ anomaly.level === 'danger' ? '严重异常' : '预警' }}
                </el-tag>
              </div>
              <div class="anomaly-time">{{ anomaly.detectedTime }}</div>
            </div>
            <div class="anomaly-score">
              <div class="score-value">{{ anomaly.anomalyScore }}</div>
              <div class="score-label">异常评分</div>
            </div>
          </div>
          
          <div class="anomaly-details">
            <div class="anomaly-type">
              <span class="label">异常类型：</span>
              <span class="value">{{ anomaly.type }}</span>
            </div>
            <div class="anomaly-description">
              <span class="label">异常描述：</span>
              <span class="value">{{ anomaly.description }}</span>
            </div>
            <div class="anomaly-factors">
              <span class="label">影响因素：</span>
              <div class="factors-list">
                <el-tag 
                  v-for="factor in anomaly.factors" 
                  :key="factor"
                  size="small"
                  class="factor-tag"
                >
                  {{ factor }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div class="anomaly-trend">
            <div class="trend-chart">
              <div class="trend-line">
                <div 
                  v-for="(point, index) in anomaly.trendData" 
                  :key="index"
                  class="trend-point"
                  :style="{ 
                    left: `${(index / (anomaly.trendData.length - 1)) * 100}%`,
                    bottom: `${point}%`
                  }"
                ></div>
              </div>
            </div>
            <div class="trend-label">趋势变化</div>
          </div>
          
          <div class="anomaly-actions">
            <el-button size="small" @click="viewDetails(anomaly)">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button size="small" type="primary" @click="handleAnomaly(anomaly)">
              <el-icon><Tools /></el-icon>
              处理异常
            </el-button>
            <el-button size="small" type="success" @click="ignoreAnomaly(anomaly)">
              <el-icon><Check /></el-icon>
              忽略异常
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 预警设置 -->
    <el-card class="alert-settings-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon><Bell /></el-icon>
          <span>监测任务</span>
          <div style="margin-left: auto;">
            <el-button type="primary" @click="showConfigDialog = true">
              监测配置
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table :data="alertSettings" stripe table-layout="auto" style="width: 100%">
        <el-table-column prop="name" label="监测名称" :min-width="160">
          <template #default="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dimension" label="监测维度" :min-width="260">
          <template #default="scope">
            <div v-if="Array.isArray(scope.row.dimension)" class="dimension-tags">
              <el-tag 
                v-for="(dim, idx) in scope.row.dimension" 
                :key="idx"
                size="small"
                class="dimension-tag"
              >
                {{ dim }}
              </el-tag>
            </div>
            <span v-else>{{ scope.row.dimension }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="threshold" label="预警阈值" :min-width="140" align="center">
          <template #default="scope">
            <el-input-number 
              v-model="scope.row.threshold" 
              :min="0" 
              :max="100" 
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="启用状态" :min-width="120" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.enabled" />
          </template>
        </el-table-column>
        <el-table-column prop="alertMethods" label="预警方式" :min-width="260">
          <template #default="scope">
            <el-checkbox-group v-model="scope.row.alertMethods">
              <el-checkbox label="system">系统通知</el-checkbox>
              <el-checkbox label="email">邮件</el-checkbox>
              <el-checkbox label="sms">短信</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="140" fixed="right">
          <template #default="scope">
            <el-button size="small" type="danger" plain @click="deleteAlertSetting(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 监测配置对话框 -->
    <el-dialog v-model="showConfigDialog" width="680px" class="config-dialog" :show-close="false">
      <div class="config-dialog-content">
        <h3 class="config-dialog-title">监测配置</h3>
        
        <div class="config-form">
          <div class="form-item">
            <label class="form-label">监测名称</label>
            <el-input 
              v-model="config.monitoringName" 
              placeholder="监测名称" 
              class="form-input"
              clearable
              @blur="checkNameDuplicate"
              @input="clearNameError"
            />
            <div v-if="nameError" class="error-hint">{{ nameError }}</div>
          </div>

          <div class="form-item">
            <label class="form-label">监测维度</label>
            <el-select 
              v-model="config.monitoringDimensions" 
              multiple 
              placeholder="监测维度"
              class="form-input"
              clearable
            >
              <el-option 
                v-for="dim in dimensionOptions" 
                :key="dim" 
                :label="dim" 
                :value="dim" 
              />
            </el-select>
          </div>

          <div class="form-item">
            <label class="form-label">异常阈值</label>
            <el-input-number 
              v-model="config.threshold" 
              :min="0" 
              :max="100" 
              class="form-input"
              placeholder="异常阈值"
            />
          </div>

          <div class="form-item">
            <label class="form-label">监测频率</label>
            <el-select 
              v-model="config.frequency" 
              placeholder="监测频率"
              class="form-input"
            >
              <el-option label="实时监测" value="realtime" />
              <el-option label="每日监测" value="daily" />
              <el-option label="每周监测" value="weekly" />
            </el-select>
          </div>

          <div class="form-item">
            <label class="form-label">预警方式</label>
            <el-select 
              v-model="config.alertMethod" 
              multiple 
              placeholder="预警方式"
              class="form-input"
            >
              <el-option label="系统通知" value="system" />
              <el-option label="邮件通知" value="email" />
              <el-option label="短信通知" value="sms" />
            </el-select>
          </div>
        </div>

        <div class="config-dialog-footer">
          <el-button class="btn-cancel" @click="handleCancelConfig">取消</el-button>
          <el-button class="btn-save" @click="handleSaveConfig">保存配置</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 异常详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="异常详情" width="800px">
      <div v-if="selectedAnomaly" class="anomaly-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="教师姓名">{{ selectedAnomaly.teacherName }}</el-descriptions-item>
          <el-descriptions-item label="异常类型">{{ selectedAnomaly.type }}</el-descriptions-item>
          <el-descriptions-item label="异常评分">{{ selectedAnomaly.anomalyScore }}</el-descriptions-item>
          <el-descriptions-item label="检测时间">{{ selectedAnomaly.detectedTime }}</el-descriptions-item>
          <el-descriptions-item label="异常等级">
            <el-tag :type="selectedAnomaly.level === 'danger' ? 'danger' : 'warning'">
              {{ selectedAnomaly.level === 'danger' ? '严重异常' : '预警' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处理状态">
            <el-tag :type="selectedAnomaly.status === 'handled' ? 'success' : 'info'">
              {{ selectedAnomaly.status === 'handled' ? '已处理' : '待处理' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div class="detail-description">
          <h4>详细描述：</h4>
          <p>{{ selectedAnomaly.detailedDescription }}</p>
        </div>
        
        <div class="detail-suggestions">
          <h4>处理建议：</h4>
          <ul>
            <li v-for="suggestion in selectedAnomaly.suggestions" :key="suggestion">
              {{ suggestion }}
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'SmartMonitoring',
  setup() {
    const dimensionOptions = ref([
      '教学表现',
      '科研产出',
      '工作态度',
      '成长轨迹',
      '工作量',
      '学生作业合格率',
      '学生成绩合格率',
      '学生出勤率',
      '学生课堂互动情况',
      '课件生产量',
      '课程生产量',
      '智能数字作品量',
      '学生评价平均分值',
      '督导评价平均分值'
    ])

    const config = reactive({
      monitoringName: '',
      monitoringDimensions: ['教学表现', '科研产出', '工作态度', '成长轨迹'],
      threshold: 75,
      frequency: 'daily',
      alertMethod: ['system', 'email']
    })

    const overviewStats = reactive({
      normal: 156,
      warning: 12,
      danger: 3,
      total: 171
    })

    const anomalyList = ref([
      {
        id: 1,
        teacherName: '李老师',
        type: '教学表现异常',
        level: 'warning',
        anomalyScore: 68,
        detectedTime: '2024-01-15 14:30',
        status: 'pending',
        description: '最近一周教学评价分数持续下降，学生满意度降低',
        detailedDescription: '李老师在过去一周的教学评价中，学生满意度从之前的92分下降到68分，主要问题集中在课堂互动不足、教学内容更新滞后等方面。',
        factors: ['课堂互动', '内容更新', '学生反馈'],
        trendData: [92, 89, 85, 78, 68],
        suggestions: [
          '建议增加课堂互动环节，提高学生参与度',
          '更新教学内容，结合最新案例和实践',
          '加强与学生的沟通，了解学习需求',
          '参加教学培训，提升教学技能'
        ]
      },
      {
        id: 2,
        teacherName: '王老师',
        type: '科研产出异常',
        level: 'danger',
        anomalyScore: 45,
        detectedTime: '2024-01-14 09:15',
        status: 'pending',
        description: '科研产出严重不足，论文发表数量急剧下降',
        detailedDescription: '王老师在过去3个月中，论文发表数量为0，相比去年同期下降了100%。科研项目进展缓慢，可能影响职称评定。',
        factors: ['论文发表', '项目进展', '学术活动'],
        trendData: [85, 78, 65, 52, 45],
        suggestions: [
          '制定科研计划，明确阶段性目标',
          '寻求合作机会，参与团队研究',
          '参加学术会议，拓展学术网络',
          '考虑申请科研资助，获得资源支持'
        ]
      },
      {
        id: 3,
        teacherName: '陈老师',
        type: '工作态度异常',
        level: 'warning',
        anomalyScore: 72,
        detectedTime: '2024-01-13 16:45',
        status: 'pending',
        description: '工作积极性下降，任务完成质量降低',
        detailedDescription: '陈老师最近工作积极性明显下降，任务完成质量不如以往，同事反馈其工作态度有所变化。',
        factors: ['工作积极性', '任务质量', '同事反馈'],
        trendData: [88, 85, 82, 76, 72],
        suggestions: [
          '了解工作压力来源，提供必要支持',
          '调整工作安排，避免过度负荷',
          '提供职业发展指导和建议',
          '加强团队沟通，改善工作环境'
        ]
      }
    ])

    const alertSettings = ref([
      {
        name: '教学质量监测',
        dimension: ['教学表现', '学生评价平均分值'],
        threshold: 75,
        enabled: true,
        alertMethods: ['system', 'email']
      },
      {
        name: '科研效率监测',
        dimension: ['科研产出', '课程生产量'],
        threshold: 70,
        enabled: true,
        alertMethods: ['system', 'email', 'sms']
      },
      {
        name: '工作态度监测',
        dimension: ['工作态度'],
        threshold: 80,
        enabled: true,
        alertMethods: ['system']
      },
      {
        name: '学生成长监测',
        dimension: ['成长轨迹', '学生出勤率'],
        threshold: 65,
        enabled: false,
        alertMethods: ['system']
      },
      {
        name: '教学负荷监测',
        dimension: ['工作量', '课件生产量'],
        threshold: 75,
        enabled: true,
        alertMethods: ['system', 'email']
      },
      {
        name: '出勤与成绩监测',
        dimension: ['学生作业合格率', '学生成绩合格率', '学生出勤率'],
        threshold: 80,
        enabled: true,
        alertMethods: ['system', 'email']
      },
      {
        name: '综合表现监测',
        dimension: ['督导评价平均分值', '学生课堂互动情况'],
        threshold: 80,
        enabled: true,
        alertMethods: ['system', 'email']
      }
    ])

    const showDetailDialog = ref(false)
    const selectedAnomaly = ref(null)
    const showConfigDialog = ref(false)
    const nameError = ref('')

    const refreshMonitoring = () => {
      ElMessage.success('监测数据已刷新')
    }

    const exportReport = () => {
      ElMessage.success('监测报告已导出')
    }

    const startDetection = () => {
      ElMessage.info('正在启动异常检测...')
    }

    const viewDetails = (anomaly) => {
      selectedAnomaly.value = anomaly
      showDetailDialog.value = true
    }

    const handleAnomaly = (anomaly) => {
      ElMessage.success(`已处理异常：${anomaly.teacherName}`)
      anomaly.status = 'handled'
    }

    const ignoreAnomaly = (anomaly) => {
      ElMessage.success(`已忽略异常：${anomaly.teacherName}`)
      const index = anomalyList.value.findIndex(item => item.id === anomaly.id)
      if (index > -1) {
        anomalyList.value.splice(index, 1)
      }
    }

    const PERSIST_ALERT_KEY = 'smart_monitoring_alert_settings'
    const PERSIST_CONFIG_KEY = 'smart_monitoring_config'

    const persistAlertSettings = () => {
      try {
        localStorage.setItem(PERSIST_ALERT_KEY, JSON.stringify(alertSettings.value))
      } catch (e) {
        // ignore
      }
    }

    const persistConfig = () => {
      try {
        localStorage.setItem(PERSIST_CONFIG_KEY, JSON.stringify(config))
      } catch (e) {
        // ignore
      }
    }

    const loadPersisted = () => {
      try {
        const rawAlert = localStorage.getItem(PERSIST_ALERT_KEY)
        if (rawAlert) {
          const parsed = JSON.parse(rawAlert)
          if (Array.isArray(parsed)) {
            // 兼容性处理：将旧的字符串格式 dimension 转换为数组格式
            parsed.forEach(item => {
              if (item.dimension && !Array.isArray(item.dimension)) {
                item.dimension = [item.dimension]
              } else if (!item.dimension) {
                item.dimension = []
              }
            })
            alertSettings.value = parsed
          }
        }
      } catch (e) {
        // ignore
      }
      try {
        const rawCfg = localStorage.getItem(PERSIST_CONFIG_KEY)
        if (rawCfg) {
          const parsedCfg = JSON.parse(rawCfg)
          Object.assign(config, parsedCfg || {})
        }
      } catch (e) {
        // ignore
      }
    }

    const validateConfig = () => {
      const hasName = !!(config.monitoringName && String(config.monitoringName).trim().length)
      const hasDims = Array.isArray(config.monitoringDimensions) && config.monitoringDimensions.length > 0
      if (!hasName && !hasDims) {
        ElMessage.warning('请输入监测名称或至少选择一个监测维度')
        return false
      }
      if (!Array.isArray(config.alertMethod) || config.alertMethod.length === 0) {
        ElMessage.warning('请至少选择一种预警方式')
        return false
      }
      if (config.threshold < 0 || config.threshold > 100) {
        ElMessage.warning('阈值需在 0-100 之间')
        return false
      }
      return true
    }

    const saveAlertSetting = (setting) => {
      // 简单校验单行
      if (setting.threshold < 0 || setting.threshold > 100) {
        ElMessage.warning('阈值需在 0-100 之间')
        return
      }
      if (!Array.isArray(setting.alertMethods) || setting.alertMethods.length === 0) {
        ElMessage.warning('请至少选择一种预警方式')
        return
      }
      persistAlertSettings()
      ElMessage.success('预警设置已保存')
    }

    const deleteAlertSetting = (index, row) => {
      if (index > -1) {
        alertSettings.value.splice(index, 1)
        persistAlertSettings()
        ElMessage.success('已删除该预警设置')
      }
    }

    const seedAlertNamesAndExpandDimensions = () => {
      const sampleNames = [
        '教学质量监测',
        '课堂互动监测',
        '科研效率监测',
        '学生成长监测',
        '教学负荷监测',
        '出勤与成绩监测',
        '课程资源监测',
        '综合表现监测'
      ]
      const usedPairs = new Set(
        alertSettings.value.map(it => `${it.name || ''}@@${it.dimension}`)
      )

      // 为缺少名称的行补充模拟名称
      let nameIdx = 0
      alertSettings.value.forEach(item => {
        if (!item.name || !String(item.name).trim().length) {
          item.name = sampleNames[nameIdx % sampleNames.length]
          nameIdx += 1
        }
      })

      // 适当为每个名称增加更多维度的行（1-2条），避免重复
      const allDims = dimensionOptions.value
      const extraRows = []
      const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
      const byName = {}
      alertSettings.value.forEach(it => {
        byName[it.name] = byName[it.name] || new Set()
        byName[it.name].add(it.dimension)
      })
      Object.keys(byName).forEach(name => {
        const existingDims = byName[name]
        const candidateDims = allDims.filter(d => !existingDims.has(d))
        const toAdd = Math.min(getRandomInt(1, 2), candidateDims.length)
        for (let i = 0; i < toAdd; i++) {
          const dim = candidateDims[i]
          const pairKey = `${name}@@${dim}`
          if (!usedPairs.has(pairKey)) {
            usedPairs.add(pairKey)
            extraRows.push({
              name,
              dimension: dim,
              threshold: 70,
              enabled: true,
              alertMethods: ['system', 'email']
            })
          }
        }
      })
      if (extraRows.length) {
        alertSettings.value.push(...extraRows)
      }
      persistAlertSettings()
    }

    const checkNameDuplicate = () => {
      const name = (config.monitoringName || '').trim()
      if (!name) {
        nameError.value = ''
        return false
      }
      const exists = alertSettings.value.some(it => it.name === name)
      if (exists) {
        nameError.value = `监测名称"${name}"已存在，请使用其他名称`
        return true
      }
      nameError.value = ''
      return false
    }

    const clearNameError = () => {
      nameError.value = ''
    }

    const handleCancelConfig = () => {
      nameError.value = ''
      showConfigDialog.value = false
    }

    const handleSaveConfig = () => {
      // 先检查重名
      if (checkNameDuplicate()) {
        ElMessage.warning('监测名称重复，请修改后再保存')
        return
      }
      // 验证配置
      if (!validateConfig()) {
        return
      }
      // 执行保存
      const success = saveMonitoringConfig()
      if (success) {
        // 保存成功后关闭弹窗并清空错误
        nameError.value = ''
        showConfigDialog.value = false
        // 清空配置表单（可选）
        config.monitoringName = ''
        config.monitoringDimensions = []
      }
    }

    const saveMonitoringConfig = () => {
      const name = (config.monitoringName || '').trim()
      const dimensions = config.monitoringDimensions || []
      
      // 如果填写了监测名称，将所有选中的维度作为数组保存为一条记录
      if (name && dimensions.length > 0) {
        // 再次检查监测名称是否已存在（双重校验）
        const exists = alertSettings.value.some(it => it.name === name)
        if (exists) {
          nameError.value = `监测名称"${name}"已存在，请使用其他名称`
          ElMessage.warning(`监测名称"${name}"已存在，请使用其他名称`)
          return false
        }
        // 新增记录（将所有维度作为数组保存）
        alertSettings.value.unshift({
          name: name,
          dimension: [...dimensions],
          threshold: config.threshold,
          enabled: true,
          alertMethods: [...config.alertMethod]
        })
      } else if (dimensions.length > 0) {
        // 如果没有填写监测名称，但有选择维度，创建一个默认名称（带时间戳确保唯一）
        const defaultName = `监测配置 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        const exists = alertSettings.value.some(it => it.name === defaultName)
        if (exists) {
          // 如果默认名称也重复（理论上不会），添加时间戳确保唯一
          const uniqueName = `监测配置 ${Date.now()}`
          alertSettings.value.unshift({
            name: uniqueName,
            dimension: [...dimensions],
            threshold: config.threshold,
            enabled: true,
            alertMethods: [...config.alertMethod]
          })
        } else {
          alertSettings.value.unshift({
            name: defaultName,
            dimension: [...dimensions],
            threshold: config.threshold,
            enabled: true,
            alertMethods: [...config.alertMethod]
          })
        }
      } else {
        return false
      }
      persistAlertSettings()
      persistConfig()
      ElMessage.success('监测配置已保存并应用到预警设置')
      return true
    }

    onMounted(() => {
      loadPersisted()
      // 若存在空名称，进行一次模拟补全
      const hasEmptyName = alertSettings.value.some(it => !it.name || !String(it.name).trim().length)
      if (hasEmptyName) {
        const sampleNames = [
          '教学质量监测',
          '课堂互动监测',
          '科研效率监测',
          '学生成长监测',
          '教学负荷监测',
          '出勤与成绩监测',
          '综合表现监测'
        ]
        let nameIdx = 0
        alertSettings.value.forEach(item => {
          if (!item.name || !String(item.name).trim().length) {
            item.name = sampleNames[nameIdx % sampleNames.length]
            nameIdx += 1
          }
        })
        persistAlertSettings()
      }
    })

    return {
      config,
      dimensionOptions,
      overviewStats,
      anomalyList,
      alertSettings,
      showDetailDialog,
      selectedAnomaly,
      refreshMonitoring,
      exportReport,
      startDetection,
      viewDetails,
      handleAnomaly,
      ignoreAnomaly,
      saveAlertSetting,
      showConfigDialog,
      nameError,
      deleteAlertSetting,
      checkNameDuplicate,
      clearNameError,
      handleCancelConfig,
      handleSaveConfig
    }
  }
}
</script>

<style scoped>
.smart-monitoring {
  min-height: 100vh;
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

.overview-cards {
  margin-bottom: 24px;
}

.overview-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.card-icon.normal {
  background: linear-gradient(135deg, #43e97b 0%, #38d9a9 100%);
}

.card-icon.warning {
  background: linear-gradient(135deg, #ffd43b 0%, #ffa726 100%);
}

.card-icon.danger {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
}

.card-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-info {
  flex: 1;
}

.card-value {
  font-size: 28px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 4px;
}

.card-label {
  font-size: 14px;
  color: #718096;
}

.config-card, .anomaly-card, .alert-settings-card {
  margin-bottom: 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2d3748;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
}

.anomaly-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.anomaly-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #e2e8f0;
  transition: all 0.3s ease;
}

.anomaly-item.warning {
  border-left-color: #ffd43b;
}

.anomaly-item.danger {
  border-left-color: #ff6b6b;
}

.anomaly-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.anomaly-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.anomaly-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.teacher-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.teacher-name h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.anomaly-time {
  color: #718096;
  font-size: 14px;
}

.anomaly-score {
  text-align: center;
}

.score-value {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b6b;
}

.score-label {
  font-size: 12px;
  color: #718096;
}

.anomaly-details {
  margin-bottom: 16px;
}

.anomaly-type, .anomaly-description {
  margin-bottom: 8px;
}

.label {
  font-weight: 500;
  color: #4a5568;
}

.value {
  color: #2d3748;
}

.anomaly-factors {
  margin-top: 12px;
}

.factors-list {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.factor-tag {
  margin-right: 8px;
}

.anomaly-trend {
  margin-bottom: 16px;
}

.trend-chart {
  height: 60px;
  background: #f8fafc;
  border-radius: 8px;
  position: relative;
  margin-bottom: 8px;
}

.trend-line {
  position: relative;
  height: 100%;
}

.trend-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  transform: translate(-50%, 50%);
}

.trend-label {
  font-size: 12px;
  color: #718096;
  text-align: center;
}

.anomaly-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1px;
}

.anomaly-detail {
  padding: 20px 0;
}

.detail-description, .detail-suggestions {
  margin-top: 20px;
}

.detail-description h4, .detail-suggestions h4 {
  margin-bottom: 12px;
  color: #2d3748;
}

.detail-description p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
}

.detail-suggestions ul {
  margin: 0;
  padding-left: 20px;
}

.detail-suggestions li {
  margin-bottom: 8px;
  color: #4a5568;
  line-height: 1.6;
}

.ml-2 {
  margin-left: 8px;
}

.dimension-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dimension-tag {
  margin: 0;
}

/* 监测配置弹窗样式 */
.config-dialog :deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

.config-dialog :deep(.el-dialog__header) {
  display: none;
}

.config-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.config-dialog-content {
  background: white;
  padding: 40px 40px 32px;
}

.config-dialog-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a237e;
  margin: 0 0 32px 0;
  letter-spacing: 0.5px;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
}

.form-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: none;
  transition: all 0.3s;
  min-height: 42px;
}

.form-input :deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc;
}

.form-input :deep(.el-input__wrapper.is-focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-input :deep(.el-input__inner) {
  padding: 0 16px;
  font-size: 14px;
  color: #303133;
}

.form-input :deep(.el-select__wrapper) {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  box-shadow: none;
  transition: all 0.3s;
  min-height: 42px;
}

.form-input :deep(.el-select__wrapper:hover) {
  border-color: #c0c4cc;
}

.form-input :deep(.el-select.is-focused .el-select__wrapper) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.form-input :deep(.el-input-number) {
  width: 100%;
}

.form-input :deep(.el-input-number__input) {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  min-height: 42px;
}

.form-input :deep(.el-input-number__input:hover) {
  border-color: #c0c4cc;
}

.form-input :deep(.el-input-number.is-focus .el-input-number__input) {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.error-hint {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1.5;
  padding-top: 4px;
  margin-top: 2px;
}

.config-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel {
  background: white;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #f5f7fa;
  border-color: #c0c4cc;
  color: #303133;
}

.btn-save {
  background: #667eea;
  border: none;
  color: white;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-save:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-save:active {
  transform: translateY(0);
}
</style>
