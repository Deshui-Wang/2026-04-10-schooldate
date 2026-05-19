<template>
  <div class="campus-cockpit">
    <!-- 顶部欢迎区与大屏KPI数据 -->
    <div class="cockpit-header card-glow">
      <div class="header-info">
        <h1 class="cockpit-title">校园驾驶舱</h1>
        <p class="cockpit-subtitle">系统当前运行状态一览，点击下方页签进行子板块精细管理</p>
      </div>
      <div class="header-stats">
        <div class="stat-box">
          <div class="stat-icon-wrap bg-blue">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">今日在校生</span>
            <span class="stat-value">14,285 <span class="stat-unit">人</span></span>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-icon-wrap bg-purple">
            <el-icon><School /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">今日开课数</span>
            <span class="stat-value">312 <span class="stat-unit">门</span></span>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-icon-wrap bg-green">
            <el-icon><Cpu /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">设备运行率</span>
            <span class="stat-value">98.6 <span class="stat-unit">%</span></span>
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-icon-wrap bg-red">
            <el-icon><LocationInformation /></el-icon>
          </div>
          <div class="stat-content">
            <span class="stat-label">当前活跃区域</span>
            <span class="stat-value">6 <span class="stat-unit">大区</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 独立切换页签区 -->
    <el-tabs v-model="activeTab" class="cockpit-tabs animate-fade-in" type="border-card">
      
      <!-- 页签1: 今日校园大事件 -->
      <el-tab-pane name="events">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><Calendar /></el-icon> 今日校园大事件
            <span class="tab-badge-dot"></span>
          </span>
        </template>
        
        <div class="tab-content-panel">
          <div class="panel-header-row">
            <div class="panel-title-text">
              <el-icon><Calendar /></el-icon> 今日重大活动与日程联播
            </div>
            <span class="live-badge"><span class="pulse-dot"></span> 实时滚动中</span>
          </div>

          <div class="events-grid">
            <div class="event-card card-glow" v-for="event in events" :key="event.id">
              <div class="event-time-tag" :class="event.status">
                <span class="date">{{ event.date }}</span>
                <span class="time">{{ event.time }}</span>
              </div>
              <div class="event-content">
                <div class="event-header-row">
                  <el-tag :type="event.tagType" effect="dark" class="event-tag">{{ event.tag }}</el-tag>
                  <span class="event-status" :class="event.statusClass">{{ event.statusText }}</span>
                </div>
                <h3 class="event-name">{{ event.name }}</h3>
                <p class="event-desc">{{ event.desc }}</p>
                <div class="event-meta">
                  <span><el-icon><Location /></el-icon> {{ event.location }}</span>
                  <span><el-icon><User /></el-icon> 主办: {{ event.organizer }}</span>
                </div>
                <div class="event-progress-wrap" v-if="event.status === 'ongoing'">
                  <div class="progress-bar-label">
                    <span>进行进度</span>
                    <span>{{ event.progress }}%</span>
                  </div>
                  <el-progress :percentage="event.progress" :color="event.color" :show-text="false" />
                </div>
              </div>
              <div class="event-action">
                <el-button type="primary" :disabled="event.status === 'ended'" @click="handleEventAction(event)">
                  {{ event.status === 'ongoing' ? '查看实况' : event.status === 'upcoming' ? '预约席位' : '已结束' }}
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 页签2: 当前上课的教师 -->
      <el-tab-pane name="teachers">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><Avatar /></el-icon> 当前上课教师
            <span class="tab-count-badge">{{ filteredTeachers.length }}</span>
          </span>
        </template>

        <div class="tab-content-panel">
          <!-- 教师过滤栏 -->
          <div class="panel-header-row">
            <div class="panel-title-text">
              <el-icon><Avatar /></el-icon> 全校上课教师实时看板
            </div>
            <div class="filter-wrapper">
              <span class="filter-label">筛选学院:</span>
              <el-radio-group v-model="selectedCollege" size="small">
                <el-radio-button label="全部" />
                <el-radio-button label="计算机学院" />
                <el-radio-button label="电子信息学院" />
                <el-radio-button label="外国语学院" />
                <el-radio-button label="数理学院" />
              </el-radio-group>
            </div>
          </div>

          <div class="teachers-grid">
            <div class="teacher-card card-glow" v-for="teacher in filteredTeachers" :key="teacher.id">
              <div class="teacher-avatar-wrapper">
                <img :src="teacher.avatar" class="teacher-avatar" alt="教师头像" />
                <div class="status-indicator online"></div>
              </div>
              <div class="teacher-info">
                <div class="name-row">
                  <h3 class="teacher-name">{{ teacher.name }}</h3>
                  <el-tag size="small" type="info" effect="plain">{{ teacher.title }}</el-tag>
                </div>
                <p class="teacher-dept">{{ teacher.college }} · {{ teacher.dept }}</p>
                <div class="current-course-card">
                  <div class="course-header">
                    <span class="course-name">{{ teacher.course }}</span>
                    <span class="classroom-tag"><el-icon><Position /></el-icon>{{ teacher.classroom }}</span>
                  </div>
                  <div class="course-timeline">
                    <div class="timeline-row">
                      <span>{{ teacher.startTime }}</span>
                      <div class="timeline-bar">
                        <div class="timeline-progress" :style="{ width: teacher.progress + '%' }"></div>
                      </div>
                      <span>{{ teacher.endTime }}</span>
                    </div>
                    <div class="timeline-desc">已授课 {{ teacher.elapsedTime }} 分钟，剩余 {{ teacher.remainingTime }} 分钟</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 页签3: 当前使用中的教室 -->
      <el-tab-pane name="classrooms">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><School /></el-icon> 当前使用中教室
            <span class="tab-count-badge">{{ filteredClassrooms.length }}</span>
          </span>
        </template>

        <div class="tab-content-panel">
          <!-- 教室过滤栏与汇总统计 -->
          <div class="panel-header-row">
            <div class="panel-title-text">
              <el-icon><School /></el-icon> 全校活跃授课教室格栅监控
            </div>
            <div class="filter-wrapper">
              <span class="filter-label">筛选教学楼:</span>
              <el-radio-group v-model="selectedBuilding" size="small">
                <el-radio-button label="全部" />
                <el-radio-button label="第一教学楼" />
                <el-radio-button label="第二教学楼" />
                <el-radio-button label="综合实验楼" />
              </el-radio-group>
            </div>
          </div>

          <!-- 教室网格（超多数据 Mock） -->
          <div class="classrooms-grid">
            <div class="classroom-card card-glow" v-for="room in filteredClassrooms" :key="room.id">
              <div class="room-header">
                <div class="room-name-wrapper">
                  <span class="room-status-dot" :class="room.occupancyRate > 80 ? 'high' : 'normal'"></span>
                  <h3 class="room-name">{{ room.name }}</h3>
                </div>
                <el-tag :type="room.occupancyRate > 80 ? 'danger' : 'success'" size="small">
                  占用率 {{ room.occupancyRate }}%
                </el-tag>
              </div>
              
              <!-- 教室基本参数 -->
              <div class="room-metrics">
                <div class="metric">
                  <span class="metric-label">学生人数</span>
                  <span class="metric-value">{{ room.studentCount }}/{{ room.capacity }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">室内温度</span>
                  <span class="metric-value">{{ room.temperature }}℃</span>
                </div>
                <div class="metric">
                  <span class="metric-label">空气质量</span>
                  <span class="metric-value" :class="room.aqiClass">AQI {{ room.aqi }}</span>
                </div>
              </div>

              <!-- 教室座位模拟示意图 -->
              <div class="seating-map-wrapper">
                <div class="seating-title">模拟座位布局（前排方向 ↑）</div>
                <div class="seating-grid">
                  <div 
                    v-for="(seat, idx) in room.seats" 
                    :key="idx" 
                    class="seat-dot" 
                    :class="{ 'occupied': seat === 1, 'empty': seat === 0 }"
                    :title="seat === 1 ? '已占用' : '空闲'"
                  >
                    <!-- 人体小图标 -->
                    <svg viewBox="0 0 1024 1024" class="seat-svg" v-if="seat === 1">
                      <path d="M512 458.666667a149.333333 149.333333 0 1 0 0-298.666667 149.333333 149.333333 0 0 0 0 298.666667z m277.333333 256c0-64-117.333333-106.666667-277.333333-106.666667S234.666667 650.666667 234.666667 714.666667v42.666666h554.666666V714.666667z" fill="currentColor"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 教室设备状态 -->
              <div class="device-status-row">
                <span class="device-tag" :class="{ 'active': room.devices.projector }">
                  <el-icon><Monitor /></el-icon>投影
                </span>
                <span class="device-tag" :class="{ 'active': room.devices.ac }">
                  <el-icon><WindPower /></el-icon>空调
                </span>
                <span class="device-tag" :class="{ 'active': room.devices.light }">
                  <el-icon><Opportunity /></el-icon>照明
                </span>
                <span class="device-tag" :class="{ 'active': room.devices.mic }">
                  <el-icon><Microphone /></el-icon>扩音
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 页签4: 当前使用中的实验室 -->
      <el-tab-pane name="labs">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><Cpu /></el-icon> 当前使用中实验室
            <span class="tab-count-badge">{{ labs.length }}</span>
          </span>
        </template>

        <div class="tab-content-panel">
          <div class="panel-header-row">
            <div class="panel-title-text">
              <el-icon><Cpu /></el-icon> 重载科研实验室及设备状态监控
            </div>
            <span class="live-badge"><span class="pulse-dot"></span> 传感器全网连接中</span>
          </div>

          <div class="labs-grid">
            <div class="lab-card card-glow" v-for="lab in labs" :key="lab.id">
              <div class="lab-header">
                <div>
                  <h3 class="lab-name">{{ lab.name }}</h3>
                  <p class="lab-project">在研项目: {{ lab.project }}</p>
                </div>
                <div class="safety-indicator" :class="lab.safetyClass">
                  <span class="safety-dot"></span>{{ lab.safetyStatus }}
                </div>
              </div>

              <!-- 实验室仪表盘与波动监测 -->
              <div class="lab-dashboard">
                <div class="lab-chart-area">
                  <svg viewBox="0 0 300 80" class="lab-waveform">
                    <defs>
                      <linearGradient :id="'grad-' + lab.id" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" :stop-color="lab.color" stop-opacity="0.4" />
                        <stop offset="100%" :stop-color="lab.color" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path :d="lab.wavePath" fill="none" :stroke="lab.color" stroke-width="2" class="wave-stroke" />
                    <path :d="lab.waveAreaPath" :fill="'url(#grad-' + lab.id + ')'" />
                    <!-- 游标点 -->
                    <circle :cx="lab.pulseX" :cy="lab.pulseY" r="4" :fill="lab.color" class="pulse-point" />
                  </svg>
                  <div class="chart-label">数据吞吐/设备负载波动图 (实时)</div>
                </div>
                
                <div class="lab-gauges">
                  <div class="gauge-item">
                    <div class="gauge-value" :style="{ color: lab.color }">{{ lab.load }}%</div>
                    <div class="gauge-label">计算负载</div>
                  </div>
                  <div class="gauge-item">
                    <div class="gauge-value">{{ lab.temp }}℃</div>
                    <div class="gauge-label">核心温度</div>
                  </div>
                  <div class="gauge-item">
                    <div class="gauge-value">{{ lab.humidity }}%</div>
                    <div class="gauge-label">环境湿度</div>
                  </div>
                </div>
              </div>

              <!-- 设备清单及运行状态 -->
              <div class="lab-devices">
                <div class="lab-device-item" v-for="dev in lab.equipments" :key="dev.name">
                  <span class="device-indicator" :class="dev.status"></span>
                  <span class="device-name">{{ dev.name }}</span>
                  <span class="device-status-text">{{ dev.statusText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 页签5: 模拟校园布局与学生分布 -->
      <el-tab-pane name="layout">
        <template #label>
          <span class="tab-label-custom">
            <el-icon><LocationInformation /></el-icon> 校园学生分布
            <span class="tab-badge-dot" style="background-color: #67c23a;"></span>
          </span>
        </template>

        <div class="tab-content-panel">
          <div class="panel-header-row">
            <div class="panel-title-text">
              <el-icon><LocationInformation /></el-icon> 模拟校园实景热力与学生点位密度分布图
            </div>
          </div>

          <div class="campus-layout-card card-glow">
            <div class="layout-main">
              <!-- 模拟校园平面地图 -->
              <div class="campus-map">
                <div class="map-bg-grid"></div>
                
                <!-- 校园建筑区域 -->
                <div 
                  v-for="zone in campusZones" 
                  :key="zone.id" 
                  class="map-zone" 
                  :style="{ top: zone.top, left: zone.left, width: zone.width, height: zone.height }"
                  :class="['density-' + zone.densityLevel, { 'active': activeZone?.id === zone.id }]"
                  @click="selectZone(zone)"
                >
                  <div class="zone-label-wrap">
                    <span class="zone-name">{{ zone.name }}</span>
                    <span class="zone-count">{{ zone.students }} 人</span>
                  </div>
                  
                  <!-- 模拟的学生分布人形图案 -->
                  <div class="student-particles">
                    <div 
                      v-for="(pos, idx) in zone.studentPositions" 
                      :key="idx" 
                      class="student-particle"
                      :style="{ top: pos.y + '%', left: pos.x + '%' }"
                    >
                      <!-- 人形图标小图 -->
                      <svg viewBox="0 0 1024 1024" class="particle-human">
                        <path d="M512 458.666667a149.333333 149.333333 0 1 0 0-298.666667 149.333333 149.333333 0 0 0 0 298.666667z m277.333333 256c0-64-117.333333-106.666667-277.333333-106.666667S234.666667 650.666667 234.666667 714.666667v42.666666h554.666666V714.666667z" fill="currentColor"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <!-- 连线/道路网络效果 -->
                <svg class="map-roads">
                  <line x1="25%" y1="35%" x2="50%" y2="25%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                  <line x1="50%" y1="25%" x2="75%" y2="35%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                  <line x1="25%" y1="35%" x2="25%" y2="70%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                  <line x1="75%" y1="35%" x2="75%" y2="70%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                  <line x1="25%" y1="70%" x2="50%" y2="80%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                  <line x1="50%" y1="80%" x2="75%" y2="70%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                  <line x1="50%" y1="25%" x2="50%" y2="80%" stroke="rgba(255,255,255,0.15)" stroke-dasharray="5,5" />
                </svg>
              </div>

              <!-- 右侧区域详细数据分析 -->
              <div class="layout-detail-panel">
                <div v-if="activeZone" class="detail-content animate-fade-in">
                  <h3 class="detail-zone-title">{{ activeZone.name }} 详细状态</h3>
                  <div class="detail-stat-row">
                    <div class="detail-stat-box">
                      <span class="value">{{ activeZone.students }} 人</span>
                      <span class="label">当前聚集人数</span>
                    </div>
                    <div class="detail-stat-box">
                      <span class="value" :style="{ color: activeZone.densityColor }">{{ activeZone.densityText }}</span>
                      <span class="label">人群密集度</span>
                    </div>
                  </div>

                  <!-- 活跃指标分析 -->
                  <div class="detail-chart-simulation">
                    <h4 class="sim-chart-title">男女比例分布</h4>
                    <div class="gender-bar">
                      <div class="gender-male" :style="{ width: activeZone.malePercent + '%' }">
                        男生 {{ activeZone.malePercent }}%
                      </div>
                      <div class="gender-female" :style="{ width: (100 - activeZone.malePercent) + '%' }">
                        女生 {{ 100 - activeZone.malePercent }}%
                      </div>
                    </div>

                    <h4 class="sim-chart-title" style="margin-top: 16px;">近两小时人数流向趋势</h4>
                    <div class="flow-list">
                      <div class="flow-item" v-for="(flow, i) in activeZone.flows" :key="i">
                        <span class="flow-time">{{ flow.time }}</span>
                        <span class="flow-action">{{ flow.action }}</span>
                        <span class="flow-count" :class="flow.type">{{ flow.count }}人</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="detail-placeholder">
                  <el-icon size="48"><Pointer /></el-icon>
                  <p>请在左侧校园地图上点击具体区域查看详细人数分布与趋势监测</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  Location,
  User,
  Avatar,
  Position,
  School,
  Monitor,
  Cpu,
  LocationInformation,
  Pointer,
  WindPower,
  Opportunity,
  Microphone
} from '@element-plus/icons-vue'

// 激活的页签，默认展现第一个
const activeTab = ref('events')

// 过滤交互状态值
const selectedCollege = ref('全部')
const selectedBuilding = ref('全部')

// 1. 今日校园大事件模拟数据 (扩充至 4 个)
const events = ref([
  {
    id: 1,
    name: '2026国际人工智能与智慧教育前沿学术论坛',
    date: '今日',
    time: '09:00 - 17:30',
    tag: '学术论坛',
    tagType: 'danger',
    status: 'ongoing',
    statusText: '进行中',
    statusClass: 'status-live',
    desc: '大会邀请了来自国内外6位顶尖AI领域学者，共同探讨大模型在高校个性化教学与教科研档案管理中的创新实践。',
    location: '科技报告厅楼 · 多功能学术厅',
    organizer: '计算机科学与技术学院 / 科研处',
    progress: 65,
    color: '#f56c6c'
  },
  {
    id: 2,
    name: '“春华秋实”智慧校园卓越师资公开示范课',
    date: '今日',
    time: '14:30 - 16:10',
    tag: '公开示范课',
    tagType: 'primary',
    status: 'upcoming',
    statusText: '即将开始',
    statusClass: 'status-soon',
    desc: '国家教学名师张建国教授现场主讲《数据结构与算法前沿集成》，使用智能化多屏互动教室，展示探究式课堂实践。',
    location: '第一教学楼 · 智能课室 202',
    organizer: '教务处 / 教师发展中心',
    progress: 0,
    color: '#409eff'
  },
  {
    id: 3,
    name: '2026春季校园国际大学生文化艺术节盛典',
    date: '今日',
    time: '18:30 - 21:30',
    tag: '文化盛典',
    tagType: 'success',
    status: 'upcoming',
    statusText: '预告中',
    statusClass: 'status-soon',
    desc: '来自30多个国家和地区的留学生与本土社团同台演出，结合XR虚拟现实交互和多媒体音效设计，呈现世界文化交融之美。',
    location: '中心活动广场 / 体育馆多功能厅',
    organizer: '校团委 / 国际合作交流处',
    progress: 0,
    color: '#67c23a'
  },
  {
    id: 4,
    name: '“卓越杯”创新创业项目路演大赛决赛答辩',
    date: '今日',
    time: '08:30 - 12:00',
    tag: '项目路演',
    tagType: 'warning',
    status: 'ended',
    statusText: '已结束',
    statusClass: 'status-ended',
    desc: '32支进入决赛的大学生创客团队进行5分钟极速路演，涵盖高能光芯片、AI辅助诊疗、乡村数字化供应链等多元赛道。',
    location: '综合实验楼 · 双创演播大厅',
    organizer: '创新创业学院 / 产学研办公室',
    progress: 100,
    color: '#909399'
  }
])

// 2. 当前上课教师模拟数据 (扩充至 10 人，覆盖多个学院及内置头像)
const teachers = ref([
  {
    id: 1,
    name: '张建国',
    title: '教授 / 博士生导师',
    college: '计算机科学与技术学院',
    dept: '软件工程系',
    course: '高级算法设计与应用分析',
    classroom: '一教 202 (智能课室)',
    avatar: '/images/teacher/083.png',
    startTime: '14:00',
    endTime: '15:40',
    progress: 80,
    elapsedTime: 80,
    remainingTime: 20
  },
  {
    id: 2,
    name: '李美华',
    title: '副教授',
    college: '电子信息学院',
    dept: '通信工程系',
    course: '现代信号处理与深度学习应用',
    classroom: '二教 304',
    avatar: '/images/teacher/28.png',
    startTime: '14:00',
    endTime: '15:40',
    progress: 80,
    elapsedTime: 80,
    remainingTime: 20
  },
  {
    id: 3,
    name: 'Alexander Rostov',
    title: '外籍专家',
    college: '外国语学院',
    dept: '应用英语系',
    course: '学术英语写作与国际会议交流',
    classroom: '一教 507',
    avatar: '/images/teacher/cc.png',
    startTime: '14:30',
    endTime: '16:10',
    progress: 50,
    elapsedTime: 50,
    remainingTime: 50
  },
  {
    id: 4,
    name: '陈志远',
    title: '研究员',
    college: '计算机科学与技术学院',
    dept: '智能控制中心',
    course: '机器人路径规划与感知算法实验室课',
    classroom: '实验大楼 A302',
    avatar: '/images/teacher/66.jpg',
    startTime: '14:30',
    endTime: '16:10',
    progress: 50,
    elapsedTime: 50,
    remainingTime: 50
  },
  {
    id: 5,
    name: '马跃新',
    title: '教授',
    college: '数理学院',
    dept: '高等数学系',
    course: '高等偏微分方程数值解法',
    classroom: '一教 101',
    avatar: '/images/teacher/7b.jpeg',
    startTime: '14:00',
    endTime: '15:40',
    progress: 80,
    elapsedTime: 80,
    remainingTime: 20
  },
  {
    id: 6,
    name: '赵丽娜',
    title: '副研究员',
    college: '电子信息学院',
    dept: '微电子系',
    course: '微纳器件物理与光刻制造原理',
    classroom: '实验大楼 B208',
    avatar: '/images/dangan/fw6538.jpg',
    startTime: '14:00',
    endTime: '15:40',
    progress: 80,
    elapsedTime: 80,
    remainingTime: 20
  },
  {
    id: 7,
    name: '王树人',
    title: '教授',
    college: '数理学院',
    dept: '应用物理系',
    course: '量子力学前沿与计算物理实验',
    classroom: '二教 102',
    avatar: '/images/teacher/85.jpeg',
    startTime: '14:30',
    endTime: '16:10',
    progress: 50,
    elapsedTime: 50,
    remainingTime: 50
  },
  {
    id: 8,
    name: '孙晓雅',
    title: '讲师',
    college: '外国语学院',
    dept: '日语系',
    course: '跨文化交际与亚洲文学选读',
    classroom: '一教 308',
    avatar: '/images/teacher/c5.png',
    startTime: '14:30',
    endTime: '16:10',
    progress: 50,
    elapsedTime: 50,
    remainingTime: 50
  },
  {
    id: 9,
    name: '刘云深',
    title: '副教授',
    college: '计算机科学与技术学院',
    dept: '网络与安全系',
    course: '区块链底层技术与高并发密码学',
    classroom: '二教 405',
    avatar: '/images/dangan/fw658.jpg',
    startTime: '14:00',
    endTime: '15:40',
    progress: 80,
    elapsedTime: 80,
    remainingTime: 20
  },
  {
    id: 10,
    name: '郑国栋',
    title: '助理教授',
    college: '电子信息学院',
    dept: '物联网工程系',
    course: '低功耗广域网（LPWAN）设计实践',
    classroom: '实验大楼 A401',
    avatar: '/images/dangan/fw6587.jpg',
    startTime: '14:30',
    endTime: '16:10',
    progress: 50,
    elapsedTime: 50,
    remainingTime: 50
  }
])

// 教师按学院过滤的计算属性
const filteredTeachers = computed(() => {
  if (selectedCollege.value === '全部') {
    return teachers.value
  }
  return teachers.value.filter(t => t.college === selectedCollege.value)
})

// 3. 当前使用中的教室模拟数据 (大幅扩充至 15 个，并配有精美座位与温湿度、空调系统)
const classrooms = ref([
  {
    id: 1,
    name: '第一教学楼 202 智能课室',
    building: '第一教学楼',
    studentCount: 78,
    capacity: 90,
    occupancyRate: 86,
    temperature: 24.2,
    aqi: 38,
    aqiClass: 'text-success',
    seats: [
      1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
      1, 0, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
      0, 1, 1, 1, 1, 1, 1, 0, 1, 1,
      1, 1, 0, 1, 1, 1, 1, 1, 1, 0
    ],
    devices: { projector: true, ac: true, light: true, mic: true }
  },
  {
    id: 2,
    name: '第二教学楼 304 阶梯智慧教室',
    building: '第二教学楼',
    studentCount: 112,
    capacity: 120,
    occupancyRate: 93,
    temperature: 23.8,
    aqi: 45,
    aqiClass: 'text-success',
    seats: [
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
      1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: true }
  },
  {
    id: 3,
    name: '第一教学楼 507 研讨室',
    building: '第一教学楼',
    studentCount: 24,
    capacity: 40,
    occupancyRate: 60,
    temperature: 25.0,
    aqi: 22,
    aqiClass: 'text-success',
    seats: [
      1, 0, 1, 0, 1, 1, 0, 1, 0, 1,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0,
      1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      1, 0, 0, 1, 0, 1, 0, 1, 0, 0
    ],
    devices: { projector: false, ac: true, light: true, mic: false }
  },
  {
    id: 4,
    name: '第一教学楼 101 大阶梯报告厅',
    building: '第一教学楼',
    studentCount: 145,
    capacity: 180,
    occupancyRate: 80,
    temperature: 23.5,
    aqi: 48,
    aqiClass: 'text-success',
    seats: [
      1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
      0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      1, 1, 0, 1, 1, 1, 1, 0, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: true }
  },
  {
    id: 5,
    name: '第一教学楼 308 多媒体大课室',
    building: '第一教学楼',
    studentCount: 52,
    capacity: 80,
    occupancyRate: 65,
    temperature: 24.6,
    aqi: 26,
    aqiClass: 'text-success',
    seats: [
      1, 0, 1, 1, 0, 1, 1, 0, 1, 0,
      0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
      1, 0, 1, 1, 0, 1, 0, 1, 0, 1,
      1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
      0, 1, 1, 0, 1, 1, 0, 1, 0, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: true }
  },
  {
    id: 6,
    name: '第二教学楼 102 阶梯小讲堂',
    building: '第二教学楼',
    studentCount: 68,
    capacity: 100,
    occupancyRate: 68,
    temperature: 24.0,
    aqi: 31,
    aqiClass: 'text-success',
    seats: [
      1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
      1, 0, 1, 1, 0, 1, 1, 0, 1, 1,
      0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
      1, 1, 0, 1, 1, 0, 1, 1, 0, 1,
      1, 0, 1, 1, 0, 1, 1, 0, 1, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: false }
  },
  {
    id: 7,
    name: '第二教学楼 205 语言实验室',
    building: '第二教学楼',
    studentCount: 32,
    capacity: 60,
    occupancyRate: 53,
    temperature: 23.2,
    aqi: 18,
    aqiClass: 'text-success',
    seats: [
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      0, 1, 0, 1, 0, 1, 0, 1, 0, 0,
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1
    ],
    devices: { projector: false, ac: false, light: true, mic: true }
  },
  {
    id: 8,
    name: '第二教学楼 405 混合现实互动室',
    building: '第二教学楼',
    studentCount: 42,
    capacity: 50,
    occupancyRate: 84,
    temperature: 22.8,
    aqi: 35,
    aqiClass: 'text-success',
    seats: [
      1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
      1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 0, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: true }
  },
  {
    id: 9,
    name: '综合实验楼 A302 人工智能机房',
    building: '综合实验楼',
    studentCount: 56,
    capacity: 64,
    occupancyRate: 87,
    temperature: 21.5,
    aqi: 40,
    aqiClass: 'text-success',
    seats: [
      1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 1, 0, 1,
      1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 1, 0, 1, 1, 1, 1, 1, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: false }
  },
  {
    id: 10,
    name: '综合实验楼 B208 电子EDA设计室',
    building: '综合实验楼',
    studentCount: 38,
    capacity: 45,
    occupancyRate: 84,
    temperature: 22.0,
    aqi: 28,
    aqiClass: 'text-success',
    seats: [
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
      1, 1, 1, 1, 1, 0, 1, 1, 1, 1,
      1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1
    ],
    devices: { projector: true, ac: true, light: true, mic: false }
  },
  {
    id: 11,
    name: '综合实验楼 A401 物联网实验室',
    building: '综合实验楼',
    studentCount: 28,
    capacity: 40,
    occupancyRate: 70,
    temperature: 24.1,
    aqi: 22,
    aqiClass: 'text-success',
    seats: [
      1, 0, 1, 1, 0, 1, 1, 0, 1, 0,
      1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1
    ],
    devices: { projector: true, ac: false, light: true, mic: true }
  },
  {
    id: 12,
    name: '第一教学楼 402 外语沙龙互动室',
    building: '第一教学楼',
    studentCount: 18,
    capacity: 30,
    occupancyRate: 60,
    temperature: 24.8,
    aqi: 15,
    aqiClass: 'text-success',
    seats: [
      1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0, 0, 1,
      0, 1, 0, 0, 1, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 0, 1, 0, 1, 0, 1
    ],
    devices: { projector: false, ac: true, light: true, mic: false }
  },
  {
    id: 13,
    name: '第二教学楼 105 高频电磁机房',
    building: '第二教学楼',
    studentCount: 30,
    capacity: 50,
    occupancyRate: 60,
    temperature: 23.4,
    aqi: 25,
    aqiClass: 'text-success',
    seats: [
      1, 0, 1, 1, 0, 1, 1, 0, 1, 0,
      0, 1, 0, 1, 1, 0, 1, 0, 1, 1,
      1, 1, 0, 1, 0, 1, 0, 1, 1, 0,
      0, 1, 1, 0, 1, 1, 0, 1, 0, 1,
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0
    ],
    devices: { projector: true, ac: true, light: true, mic: false }
  },
  {
    id: 14,
    name: '综合实验楼 C102 生物化学基础室',
    building: '综合实验楼',
    studentCount: 41,
    capacity: 48,
    occupancyRate: 85,
    temperature: 22.1,
    aqi: 33,
    aqiClass: 'text-success',
    seats: [
      1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
      1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 1, 1,
      1, 0, 1, 1, 1, 1, 1, 0, 1, 1,
      1, 1, 1, 1, 1, 1, 0, 1, 1, 1
    ],
    devices: { projector: false, ac: true, light: true, mic: true }
  },
  {
    id: 15,
    name: '综合实验楼 C206 精密光学暗室',
    building: '综合实验楼',
    studentCount: 12,
    capacity: 20,
    occupancyRate: 60,
    temperature: 20.8,
    aqi: 14,
    aqiClass: 'text-success',
    seats: [
      1, 0, 1, 0, 1, 0, 1, 0, 1, 0,
      0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
      1, 0, 0, 1, 0, 1, 0, 0, 1, 0,
      0, 1, 0, 1, 0, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0, 0, 1
    ],
    devices: { projector: false, ac: true, light: true, mic: false }
  }
])

// 教室按教学楼过滤的计算属性
const filteredClassrooms = computed(() => {
  if (selectedBuilding.value === '全部') {
    return classrooms.value
  }
  return classrooms.value.filter(c => c.building === selectedBuilding.value)
})

// 4. 当前使用中的实验室模拟数据 (扩充至 4 个)
const labs = ref([
  {
    id: 1,
    name: '人工智能与机器人重点实验室 (A302)',
    project: '多智能体协同避障与集群控制试验',
    safetyStatus: '运行良好',
    safetyClass: 'status-ok',
    load: 76,
    temp: 22.5,
    humidity: 48,
    color: '#67c23a',
    pulseX: 180,
    pulseY: 35,
    wavePath: 'M 0 50 Q 30 30 60 45 T 120 20 T 180 35 T 240 55 T 300 40',
    waveAreaPath: 'M 0 50 Q 30 30 60 45 T 120 20 T 180 35 T 240 55 T 300 40 L 300 80 L 0 80 Z',
    equipments: [
      { name: 'Nvidia A100 GPU集群', status: 'high', statusText: '高负载计算中' },
      { name: '激光雷达避障小车 (x8)', status: 'active', statusText: '试验场路测中' },
      { name: '六轴高精工业机械臂', status: 'standby', statusText: '在线就绪' }
    ]
  },
  {
    id: 2,
    name: '电子信息工程集成芯片微纳工艺实验室',
    project: '微弱信号放大射频芯片抗干扰分析',
    safetyStatus: '核心预警',
    safetyClass: 'status-warning',
    load: 42,
    temp: 26.4,
    humidity: 35,
    color: '#e6a23c',
    pulseX: 180,
    pulseY: 55,
    wavePath: 'M 0 40 Q 30 60 60 50 T 120 40 T 180 55 T 240 30 T 300 48',
    waveAreaPath: 'M 0 40 Q 30 60 60 50 T 120 40 T 180 55 T 240 30 T 300 48 L 300 80 L 0 80 Z',
    equipments: [
      { name: '高性能高带宽示波器', status: 'active', statusText: '波形监测中' },
      { name: '芯片超声键合微焊机', status: 'standby', statusText: '待机待料' },
      { name: '超净恒温恒湿抽风机', status: 'high', statusText: '全力排风中' }
    ]
  },
  {
    id: 3,
    name: '智能网联汽车无人驾驶研发中心',
    project: '多源传感器融合与SLAM全景建图测试',
    safetyStatus: '运行良好',
    safetyClass: 'status-ok',
    load: 68,
    temp: 21.0,
    humidity: 50,
    color: '#409eff',
    pulseX: 100,
    pulseY: 28,
    wavePath: 'M 0 30 Q 40 10 80 30 T 160 40 T 240 20 T 300 35',
    waveAreaPath: 'M 0 30 Q 40 10 80 30 T 160 40 T 240 20 T 300 35 L 300 80 L 0 80 Z',
    equipments: [
      { name: '智能激光雷达3D扫面仪', status: 'active', statusText: '三维成像中' },
      { name: 'RTK高精度差分GPS站', status: 'active', statusText: '厘米定位中' },
      { name: '毫米波车载雷达测试台', status: 'standby', statusText: '待机预热' }
    ]
  },
  {
    id: 4,
    name: '重粒子高能计算与超算物理大厅',
    project: '暗物质衰变谱量子蒙特卡洛随机模拟',
    safetyStatus: '高负荷负载',
    safetyClass: 'status-danger',
    load: 94,
    temp: 28.5,
    humidity: 42,
    color: '#f56c6c',
    pulseX: 220,
    pulseY: 15,
    wavePath: 'M 0 60 Q 20 10 50 55 T 100 12 T 150 70 T 200 15 T 250 65 T 300 10',
    waveAreaPath: 'M 0 60 Q 20 10 50 55 T 100 12 T 150 70 T 200 15 T 250 65 T 300 10 L 300 80 L 0 80 Z',
    equipments: [
      { name: '天河级并行刀片超算机组', status: 'high', statusText: '94%算力全开' },
      { name: '液氮冷却超低温闭环泵', status: 'high', statusText: '液氮全压冷却' },
      { name: '多通道核脉冲符合测量仪', status: 'active', statusText: '计数监测中' }
    ]
  }
])

// 5. 模拟校园布局与学生分布地图数据
const campusZones = ref([
  {
    id: 1,
    name: '教学大楼区',
    students: 3420,
    densityLevel: 'high',
    densityColor: '#f56c6c',
    densityText: '高密度聚集',
    malePercent: 55,
    top: '15%',
    left: '12%',
    width: '32%',
    height: '24%',
    flows: [
      { time: '14:30', action: '二教下课人流涌出', count: 420, type: 'outflow' },
      { time: '14:40', action: '一教学生上课入场', count: 350, type: 'inflow' }
    ],
    studentPositions: generateRandomPositions(18)
  },
  {
    id: 2,
    name: '科技实验中心',
    students: 920,
    densityLevel: 'medium',
    densityColor: '#e6a23c',
    densityText: '中密度分布',
    malePercent: 68,
    top: '12%',
    left: '52%',
    width: '36%',
    height: '22%',
    flows: [
      { time: '14:00', action: '芯片班学生进驻实验', count: 48, type: 'inflow' },
      { time: '14:55', action: '机器人项目组测试完毕离开', count: 12, type: 'outflow' }
    ],
    studentPositions: generateRandomPositions(10)
  },
  {
    id: 3,
    name: '中心图书馆',
    students: 2150,
    densityLevel: 'high',
    densityColor: '#f56c6c',
    densityText: '高密度聚集',
    malePercent: 48,
    top: '46%',
    left: '32%',
    width: '36%',
    height: '26%',
    flows: [
      { time: '13:30', action: '自习高峰学生陆续入馆', count: 280, type: 'inflow' },
      { time: '15:00', action: '检索区完成借阅退馆', count: 65, type: 'outflow' }
    ],
    studentPositions: generateRandomPositions(22)
  },
  {
    id: 4,
    name: '西区宿舍与生活馆',
    students: 4520,
    densityLevel: 'high',
    densityColor: '#f56c6c',
    densityText: '高密度聚集',
    malePercent: 50,
    top: '48%',
    left: '5%',
    width: '22%',
    height: '35%',
    flows: [
      { time: '13:30', action: '宿舍午休后学生开始出楼', count: 620, type: 'outflow' },
      { time: '15:10', action: '无课生返回宿舍自修', count: 85, type: 'inflow' }
    ],
    studentPositions: generateRandomPositions(20)
  },
  {
    id: 5,
    name: '田径运动场',
    students: 840,
    densityLevel: 'medium',
    densityColor: '#e6a23c',
    densityText: '中密度分布',
    malePercent: 75,
    top: '46%',
    left: '74%',
    width: '21%',
    height: '32%',
    flows: [
      { time: '14:30', action: '户外体育排球专项课集合', count: 120, type: 'inflow' },
      { time: '15:15', action: '长跑测验结束退场', count: 45, type: 'outflow' }
    ],
    studentPositions: generateRandomPositions(10)
  },
  {
    id: 6,
    name: '湖畔美食广场',
    students: 310,
    densityLevel: 'low',
    densityColor: '#67c23a',
    densityText: '低密度分散',
    malePercent: 52,
    top: '78%',
    left: '35%',
    width: '30%',
    height: '15%',
    flows: [
      { time: '13:00', action: '午餐高峰期顺利度过', count: 1100, type: 'outflow' },
      { time: '15:00', action: '下午茶档期少量学生光顾', count: 60, type: 'inflow' }
    ],
    studentPositions: generateRandomPositions(6)
  }
])

const activeZone = ref(null)

// 随机点位生成器 (用于渲染人影分布)
function generateRandomPositions(count) {
  const positions = []
  for (let i = 0; i < count; i++) {
    positions.push({
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70
    })
  }
  return positions
}

// 选择区域
const selectZone = (zone) => {
  activeZone.value = zone
  ElMessage({
    message: `已切换监控区域：${zone.name}，实时在馆人数：${zone.students}人`,
    type: 'success',
    duration: 2000
  })
}

// 事件点击反馈
const handleEventAction = (event) => {
  if (event.status === 'ongoing') {
    ElMessage.success(`正在连接 [${event.location}] 的高清摄像云台实况直播...`)
  } else if (event.status === 'upcoming') {
    ElMessage.success(`预约成功！席位预留确认信息已发至您的手机与系统通知。`)
  }
}

// 定时模拟数据微调
let timer = null
onMounted(() => {
  activeZone.value = campusZones.value[0]

  timer = setInterval(() => {
    // 1. 模拟实验室负载和温度的起伏
    labs.value.forEach(lab => {
      const loadDiff = Math.floor(Math.random() * 7) - 3
      lab.load = Math.max(10, Math.min(100, lab.load + loadDiff))
      
      const tempDiff = (Math.random() * 0.4 - 0.2).toFixed(1)
      lab.temp = (parseFloat(lab.temp) + parseFloat(tempDiff)).toFixed(1)

      lab.pulseX = (lab.pulseX + 10) % 300
      lab.pulseY = 30 + Math.floor(Math.sin(lab.pulseX / 30) * 15 + Math.random() * 10)
    })

    // 2. 模拟上课时间慢慢流逝
    teachers.value.forEach(teacher => {
      if (teacher.progress < 100) {
        teacher.elapsedTime += 1
        teacher.remainingTime = Math.max(0, teacher.remainingTime - 1)
        teacher.progress = Math.floor((teacher.elapsedTime / (teacher.elapsedTime + teacher.remainingTime)) * 100)
      }
    })

    // 3. 模拟教室人数有细微人员进出
    classrooms.value.forEach(room => {
      if (Math.random() > 0.6) {
        const change = Math.random() > 0.5 ? 1 : -1
        room.studentCount = Math.max(0, Math.min(room.capacity, room.studentCount + change))
        room.occupancyRate = Math.floor((room.studentCount / room.capacity) * 100)
        
        const seatIdx = Math.floor(Math.random() * room.seats.length)
        room.seats[seatIdx] = room.seats[seatIdx] === 1 ? 0 : 1
      }
    })

    // 4. 模拟校园区域人数轻微增减
    campusZones.value.forEach(zone => {
      if (Math.random() > 0.5) {
        const change = Math.floor(Math.random() * 11) - 5
        zone.students = Math.max(100, zone.students + change)
      }
    })
  }, 4000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 全局页面样式 */
.campus-cockpit {
  padding: 16px 24px 32px 24px;
  background: transparent;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 渐变微光卡片统一基底 */
.card-glow {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.card-glow:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.2);
}

/* 顶部驾驶舱大屏KPI面板 */
.cockpit-header {
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,244,255,0.9) 100%);
}

.header-info {
  flex: 1;
  min-width: 250px;
}

.cockpit-title {
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #2b5876 0%, #4e4376 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.cockpit-subtitle {
  font-size: 13px;
  color: #7f8c8d;
}

.header-stats {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.stat-box {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 18px;
  border-radius: 12px;
  gap: 12px;
  border: 1.5px solid #ffffff;
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.stat-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.bg-blue { background: linear-gradient(135deg, #2193b0, #6dd5ed); }
.bg-purple { background: linear-gradient(135deg, #7f00ff, #e100ff); }
.bg-green { background: linear-gradient(135deg, #11998e, #38ef7d); }
.bg-red { background: linear-gradient(135deg, #ff416c, #ff4b2b); }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 11px;
  color: #95a5a6;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 20px;
  font-weight: 750;
  color: #2c3e50;
  font-family: 'SF Pro Display', sans-serif;
  line-height: 1.1;
}

.stat-unit {
  font-size: 11px;
  font-weight: 500;
  color: #7f8c8d;
}

/* 独立切换页签定制样式 */
.cockpit-tabs {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

:deep(.el-tabs__header) {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.05) !important;
  margin: 0 !important;
  padding: 10px 16px 0 16px;
}

:deep(.el-tabs__item) {
  height: 48px !important;
  line-height: 48px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #57606f !important;
  border-radius: 12px 12px 0 0 !important;
  border: 1px solid transparent !important;
  margin-right: 6px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

:deep(.el-tabs__item:hover) {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.05) !important;
}

:deep(.el-tabs__item.is-active) {
  color: #ffffff !important;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: 0 -4px 15px rgba(102, 126, 234, 0.2) !important;
  border: none !important;
}

:deep(.el-tabs__content) {
  padding: 24px !important;
  background: transparent !important;
}

/* 页签内的定制标签 */
.tab-label-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.tab-badge-dot {
  width: 6px;
  height: 6px;
  background-color: #ff4757;
  border-radius: 50%;
  position: absolute;
  top: -4px;
  right: -8px;
}

.tab-count-badge {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 1px 6px;
  border-radius: 10px;
  font-weight: 700;
  display: inline-block;
  line-height: 1.2;
}

:deep(.el-tabs__item:not(.is-active)) .tab-count-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

/* 板块内部公共布局 */
.tab-content-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1.5px solid rgba(0,0,0,0.04);
  padding-bottom: 14px;
}

.panel-title-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 750;
  color: #2c3e50;
}

.panel-title-text .el-icon {
  color: #667eea;
}

/* 过滤控制器 */
.filter-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #ff4757;
  background: rgba(255, 71, 87, 0.08);
  padding: 3px 12px;
  border-radius: 20px;
  font-weight: 600;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #ff4757;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 rgba(255, 71, 87, 0.7);
  animation: pulse 1.6s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 71, 87, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(255, 71, 87, 0); }
}

/* 1. 今日大事件样式 */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 20px;
}

.event-card {
  display: flex;
  padding: 20px;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.event-time-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  color: #fff;
  border-radius: 12px;
  flex-shrink: 0;
  text-align: center;
}

.event-time-tag.ongoing {
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  box-shadow: 0 4px 15px rgba(255, 65, 108, 0.3);
}

.event-time-tag.upcoming {
  background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
  box-shadow: 0 4px 15px rgba(33, 147, 176, 0.3);
}

.event-time-tag.ended {
  background: linear-gradient(135deg, #747d8c 0%, #2f3542 100%);
}

.event-time-tag .date {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 2px;
}

.event-time-tag .time {
  font-size: 10px;
  opacity: 0.9;
}

.event-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-tag {
  font-weight: 600;
  border-radius: 4px;
}

.event-status {
  font-size: 12px;
  font-weight: 600;
}

.status-live { color: #ff4757; }
.status-soon { color: #2f3542; }
.status-ended { color: #7f8c8d; }

.event-name {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.4;
}

.event-desc {
  font-size: 13px;
  color: #7f8c8d;
  line-height: 1.5;
}

.event-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #95a5a6;
  margin-top: 4px;
}

.event-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.event-progress-wrap {
  margin-top: 8px;
}

.progress-bar-label {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.event-action {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

/* 2. 教师模块样式 */
.teachers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.teacher-card {
  display: flex;
  padding: 18px;
  gap: 16px;
}

.teacher-avatar-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.teacher-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.status-indicator.online {
  background-color: #2ed573;
  box-shadow: 0 0 8px rgba(46, 213, 115, 0.8);
}

.teacher-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.teacher-name {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
}

.teacher-dept {
  font-size: 11px;
  color: #95a5a6;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.current-course-card {
  background: rgba(102, 126, 234, 0.04);
  border-radius: 10px;
  padding: 10px;
  border: 1px dashed rgba(102, 126, 234, 0.15);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 6px;
}

.course-name {
  font-size: 12px;
  font-weight: 700;
  color: #4e4376;
  line-height: 1.3;
}

.classroom-tag {
  font-size: 10px;
  color: #667eea;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.course-timeline {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.timeline-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  color: #95a5a6;
  gap: 6px;
}

.timeline-bar {
  flex: 1;
  height: 4px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.timeline-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.timeline-desc {
  font-size: 9px;
  color: #7f8c8d;
  text-align: center;
}

/* 3. 使用中教室样式 */
.classrooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.classroom-card {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.room-name-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.room-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.room-status-dot.normal {
  background-color: #2ed573;
  box-shadow: 0 0 6px rgba(46, 213, 115, 0.6);
}

.room-status-dot.high {
  background-color: #ff4757;
  box-shadow: 0 0 6px rgba(255, 71, 87, 0.6);
}

.room-name {
  font-size: 13.5px;
  font-weight: 750;
  color: #2c3e50;
}

.room-metrics {
  display: flex;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 8px 12px;
  justify-content: space-between;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.metric-label {
  font-size: 9px;
  color: #95a5a6;
}

.metric-value {
  font-size: 11px;
  font-weight: 700;
  color: #34495e;
}

.text-success { color: #2ed573; }

/* 座位表模拟 */
.seating-map-wrapper {
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.04);
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.seating-title {
  font-size: 9px;
  color: #95a5a6;
  text-align: center;
}

.seating-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 4px;
  justify-items: center;
}

.seat-dot {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.seat-dot.empty {
  background-color: rgba(0, 0, 0, 0.06);
  border: 0.5px solid rgba(0, 0, 0, 0.1);
}

.seat-dot.occupied {
  background-color: #2ed573;
  color: #fff;
  box-shadow: 0 1px 3px rgba(46, 213, 115, 0.4);
}

.seat-svg {
  width: 10px;
  height: 10px;
}

/* 设备状态小排标签 */
.device-status-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.device-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #bdc3c7;
  background: rgba(0, 0, 0, 0.03);
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.device-tag.active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.08);
}

.device-tag.active .el-icon {
  animation: pulse-icon 2s infinite;
}

@keyframes pulse-icon {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

/* 4. 实验室样式 */
.labs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 20px;
}

.lab-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.lab-name {
  font-size: 15px;
  font-weight: 700;
  color: #2c3e50;
}

.lab-project {
  font-size: 11px;
  color: #7f8c8d;
  margin-top: 2px;
}

.safety-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.safety-indicator.status-ok {
  color: #2ed573;
  background: rgba(46, 213, 115, 0.1);
}

.safety-indicator.status-ok .safety-dot {
  background-color: #2ed573;
  box-shadow: 0 0 6px #2ed573;
}

.safety-indicator.status-warning {
  color: #e6a23c;
  background: rgba(230, 162, 60, 0.1);
}

.safety-indicator.status-warning .safety-dot {
  background-color: #e6a23c;
  box-shadow: 0 0 6px #e6a23c;
}

.safety-indicator.status-danger {
  color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
}

.safety-indicator.status-danger .safety-dot {
  background-color: #ff4757;
  box-shadow: 0 0 6px #ff4757;
}

.safety-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.lab-dashboard {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(0,0,0,0.03);
}

.lab-chart-area {
  position: relative;
  width: 100%;
  height: 80px;
}

.lab-waveform {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.wave-stroke {
  animation: draw-wave 10s linear infinite;
}

.chart-label {
  position: absolute;
  bottom: 2px;
  left: 6px;
  font-size: 8px;
  color: #95a5a6;
}

.lab-gauges {
  display: flex;
  justify-content: space-around;
  border-top: 1px dashed rgba(0,0,0,0.06);
  padding-top: 10px;
}

.gauge-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gauge-value {
  font-size: 14px;
  font-weight: 750;
  color: #2c3e50;
  font-family: 'SF Pro Display', sans-serif;
}

.gauge-label {
  font-size: 9px;
  color: #95a5a6;
}

.lab-devices {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lab-device-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.01);
  border-radius: 6px;
  border-left: 2px solid rgba(0,0,0,0.05);
}

.device-indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.device-indicator.high {
  background-color: #ff4757;
  box-shadow: 0 0 4px #ff4757;
}

.device-indicator.active {
  background-color: #2ed573;
  box-shadow: 0 0 4px #2ed573;
}

.device-indicator.standby {
  background-color: #909399;
}

.device-name {
  color: #34495e;
  font-weight: 600;
  flex: 1;
}

.device-status-text {
  color: #7f8c8d;
}

/* 5. 校园分布样式 */
.campus-layout-card {
  padding: 20px;
  overflow: hidden;
}

.layout-main {
  display: flex;
  gap: 24px;
  height: 480px;
}

.campus-map {
  flex: 7;
  position: relative;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 40px rgba(0,0,0,0.4);
}

.map-bg-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 1;
}

.map-roads {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

.map-zone {
  position: absolute;
  border-radius: 8px;
  cursor: pointer;
  z-index: 3;
  padding: 8px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-sizing: border-box;
}

.map-zone:hover {
  transform: scale(1.02);
  z-index: 4;
}

.map-zone.active {
  box-shadow: 0 0 18px #fff, inset 0 0 8px rgba(255,255,255,0.6);
  border: 1.5px solid #ffffff;
  transform: scale(1.02);
  z-index: 4;
}

.density-low {
  background: rgba(46, 213, 115, 0.25);
  border: 1px solid rgba(46, 213, 115, 0.5);
  box-shadow: 0 4px 10px rgba(46, 213, 115, 0.2);
}

.density-medium {
  background: rgba(230, 162, 60, 0.25);
  border: 1px solid rgba(230, 162, 60, 0.5);
  box-shadow: 0 4px 10px rgba(230, 162, 60, 0.2);
}

.density-high {
  background: rgba(255, 71, 87, 0.25);
  border: 1px solid rgba(255, 71, 87, 0.5);
  box-shadow: 0 4px 10px rgba(255, 71, 87, 0.2);
}

.zone-label-wrap {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #ffffff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  font-weight: 700;
  margin-bottom: 6px;
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
}

.student-particles {
  position: relative;
  flex: 1;
  width: 100%;
}

.student-particle {
  position: absolute;
  width: 16px;
  height: 16px;
  color: #fff;
  transform: translate(-50%, -50%);
  animation: particle-hover 3s ease-in-out infinite alternate;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.particle-human {
  width: 100%;
  height: 100%;
}

@keyframes particle-hover {
  0% { transform: translate(-50%, -50%) translateY(0) scale(0.9); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) translateY(-2px) scale(1); opacity: 1; }
}

.layout-detail-panel {
  flex: 3;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 16px;
  overflow-y: auto;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-zone-title {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding-bottom: 8px;
}

.detail-stat-row {
  display: flex;
  gap: 12px;
}

.detail-stat-box {
  flex: 1;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  border: 0.5px solid rgba(0,0,0,0.05);
}

.detail-stat-box .value {
  font-size: 18px;
  font-weight: 750;
  color: #2c3e50;
}

.detail-stat-box .label {
  font-size: 10px;
  color: #95a5a6;
  margin-top: 4px;
}

.sim-chart-title {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
  margin-bottom: 8px;
}

.gender-bar {
  display: flex;
  height: 24px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 10px;
  color: #fff;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
}

.gender-male { background: linear-gradient(90deg, #36d1dc, #5b86e5); }
.gender-female { background: linear-gradient(90deg, #ff758c, #ff7eb3); }

.flow-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.flow-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  padding: 8px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.01);
}

.flow-time { color: #bdc3c7; }
.flow-action { color: #7f8c8d; flex: 1; margin-left: 10px; }
.flow-count { font-weight: 700; }
.flow-count.inflow { color: #2ed573; }
.flow-count.outflow { color: #ff4757; }

.detail-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #bdc3c7;
  text-align: center;
  gap: 12px;
  padding: 20px;
}

.detail-placeholder p {
  font-size: 12px;
  line-height: 1.5;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .cockpit-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-stats {
    width: 100%;
    justify-content: space-between;
  }
  .layout-main {
    flex-direction: column;
    height: auto;
  }
  .campus-map {
    height: 300px;
  }
  .layout-detail-panel {
    height: 250px;
  }
}
</style>
