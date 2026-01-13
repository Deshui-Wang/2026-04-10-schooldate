<template>
  <div class="archive-workbench">
    <div class="section-header">
      <h3>档案工作台</h3>
      <p>档案管理综合工作台，提供档案统计、查询、借阅等一站式服务</p>
    </div>

    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6" v-for="(card, index) in summaryData" :key="index">
        <el-card shadow="hover" class="stat-card">
          <div class="card-content">
            <div class="icon-wrapper" :style="{ backgroundColor: card.bgColor }">
              <el-icon :size="32" :color="card.iconColor"><component :is="card.icon" /></el-icon>
            </div>
            <div class="text-content">
              <div class="value">{{ card.value.toLocaleString() }}</div>
              <div class="label">{{ card.label }}</div>
              <div class="trend" :class="card.trend === 'up' ? 'up' : 'down'">
                <el-icon><component :is="card.trend === 'up' ? 'CaretTop' : 'CaretBottom'" /></el-icon>
                <span>{{ card.percentage }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中部图表和信息 -->
    <el-row :gutter="20">
      <!-- 左侧主要图表 -->
      <el-col :span="18">
        <el-card shadow="never" class="chart-card full-height">
          <template #header>
            <div class="card-header">
              <span>各院校档案总量</span>
            </div>
          </template>
          <div ref="totalArchivesChart" class="chart-container"></div>
        </el-card>

        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="16">
             <el-card shadow="never" class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>年度新增趋势</span>
                   <el-date-picker
                    v-model="selectedYear"
                    type="year"
                    placeholder="选择年份"
                    style="width: 120px;"
                  />
                </div>
              </template>
              <div ref="yearlyTrendChart" class="chart-container" style="height: 300px;"></div>
            </el-card>
          </el-col>
          <el-col :span="8">
             <el-card shadow="never" class="chart-card">
               <template #header>
                <div class="card-header">
                  <span>各院校数字化率</span>
                </div>
              </template>
              <div ref="digitizationRateChart" class="chart-container" style="height: 300px;"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <!-- 右侧信息面板 -->
      <el-col :span="6">
        <el-card shadow="never" class="info-panel-card">
          <template #header><span>存储空间使用情况</span></template>
          <div ref="storageChart" style="height: 180px; width: 100%;"></div>
        </el-card>

        <el-card shadow="never" class="info-panel-card">
          <template #header>
            <div class="card-header">
                <span>待办事项</span>
                <el-badge :value="4" type="danger" />
            </div>
          </template>
          <ul class="todo-list">
            <li v-for="item in todoItems" :key="item.id">
              <el-tag :type="item.type" size="small">{{ item.tag }}</el-tag>
              <span>{{ item.content }}</span>
              <span class="time">{{ item.time }}</span>
            </li>
          </ul>
        </el-card>

        <el-card shadow="never" class="info-panel-card">
           <template #header>
            <div class="card-header">
                <span>跨校借阅申请</span>
                <el-badge :value="2" type="warning" />
            </div>
          </template>
          <ul class="request-list">
            <li v-for="req in loanRequests" :key="req.id">
              <div class="user-info">
                <el-avatar :size="40">{{ req.user.charAt(0) }}</el-avatar>
                <div class="details">
                  <span class="name">{{ req.user }}</span>
                  <span class="desc">{{ req.description }}</span>
                </div>
              </div>
              <div class="actions">
                <el-button type="success" size="small">同意</el-button>
                <el-button type="danger" plain size="small">拒绝</el-button>
              </div>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>

     <!-- 底部列表和动态 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="18">
        <el-card shadow="never">
          <template #header><span>近期档案利用情况</span></template>
          <el-table :data="recentUsage" stripe style="width: 100%">
            <el-table-column type="index" label="排名" width="80" />
            <el-table-column prop="school" label="院校" />
            <el-table-column prop="title" label="档案标题" />
            <el-table-column prop="count" label="次数" width="100" />
            <el-table-column prop="trend" label="趋势" width="100">
              <template #default="{ row }">
                <span :class="row.trend > 0 ? 'up' : 'down'">{{ row.trend > 0 ? '+' : '' }}{{ row.trend }}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <template #header><div class="card-header"><span>最新动态</span><el-button text type="primary">更多</el-button></div></template>
          <el-timeline class="latest-updates">
            <el-timeline-item v-for="(item, index) in latestUpdates" :key="index" :timestamp="item.time" :color="item.color">
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>

    <!-- 年度归档工作 -->
    <el-card shadow="never" style="margin-top: 20px;">
      <template #header><span>各校年度归档工作完成情况</span></template>
      <el-row :gutter="20">
        <el-col :span="12" v-for="item in archivingStatus" :key="item.school" class="archive-status-col">
          <div class="archive-status-item">
            <div class="school-info">
              <span>{{ item.school }}</span>
              <span>{{ item.completed }}/{{ item.total }}</span>
            </div>
            <el-progress :percentage="(item.completed / item.total) * 100" :stroke-width="10" :color="item.color" />
          </div>
        </el-col>
      </el-row>
    </el-card>

  </div>
</template>

<script setup>
import { ref, onMounted, shallowRef } from 'vue';
import * as echarts from 'echarts';
import { Folder, Upload, View, Document, CaretTop, CaretBottom } from '@element-plus/icons-vue';

const summaryData = ref([
  { label: '馆藏总量', value: 128456, trend: 'up', percentage: 12, icon: 'Folder', bgColor: '#e7f3ff', iconColor: '#409EFF' },
  { label: '本月新增', value: 2456, trend: 'up', percentage: 8, icon: 'Upload', bgColor: '#e9fbf0', iconColor: '#67C23A' },
  { label: '数字化率', value: 87.5, trend: 'up', percentage: 3, icon: 'Document', bgColor: '#fef3e7', iconColor: '#E6A23C' },
  { label: '本月利用', value: 3892, trend: 'up', percentage: 15, icon: 'View', bgColor: '#fdeeee', iconColor: '#F56C6C' },
]);

const selectedYear = ref(new Date());

// ECharts 实例
const totalArchivesChart = shallowRef(null);
const yearlyTrendChart = shallowRef(null);
const digitizationRateChart = shallowRef(null);
const storageChart = shallowRef(null);

const initTotalArchivesChart = () => {
  const chart = echarts.init(totalArchivesChart.value);
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: { data: ['云南工商', '洛阳科技', '广西英华', '郑州城市', '湖北恩施', '贵州工商', '兰州信息', '哈尔滨德'] },
    yAxis: {},
    series: [{
      name: '档案总量',
      type: 'bar',
      data: [45000, 39000, 33000, 29000, 24000, 22000, 19000, 17000],
      itemStyle: { color: '#409EFF' }
    }]
  };
  chart.setOption(option);
};

const initYearlyTrendChart = () => {
  const chart = echarts.init(yearlyTrendChart.value);
  const option = {
    tooltip: { trigger: 'axis' },
    xAxis: { data: Array.from({ length: 12 }, (_, i) => `${i + 1}月`) },
    yAxis: {},
    series: [{
      name: '新增量',
      type: 'line',
      data: [500, 600, 800, 1200, 1500, 1800, 2200, 2100, 1900, 1600, 1300, 1000],
      smooth: true,
      itemStyle: { color: '#67C23A' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#67C23A' }, { offset: 1, color: '#fff' }]) }
    }]
  };
  chart.setOption(option);
};

const initDigitizationRateChart = () => {
  const chart = echarts.init(digitizationRateChart.value);
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', boundaryGap: [0, 0.01] },
    yAxis: { 
      type: 'category', 
      data: ['云南工商', '洛阳科技', '广西英华', '郑州城市', '湖北恩施', '贵州工商', '兰州信息', '哈尔滨德'],
      inverse: true
    },
    series: [{
      name: '数字化率',
      type: 'bar',
      data: [92, 88, 85, 82, 78, 75, 72, 68],
      itemStyle: { color: '#E6A23C' }
    }]
  };
  chart.setOption(option);
};

const initStorageChart = () => {
  const chart = echarts.init(storageChart.value);
  const option = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left', top: 'center' },
    series: [{
      name: '存储空间',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: { show: true, position: 'center', formatter: '{d}%\n已使用', fontSize: 20, fontWeight: 'bold' },
      emphasis: { label: { show: true } },
      data: [
        { value: 7.2, name: '已使用' },
        { value: 2.8, name: '剩余' },
      ]
    }]
  };
  chart.setOption(option);
};

const todoItems = ref([
  { id: 1, tag: '紧急', type: 'danger', content: '审核云南工商学院借阅申请', time: '10分钟前' },
  { id: 2, tag: '待办', type: 'warning', content: '确认2024年度归档计划', time: '30分钟前' },
  { id: 3, tag: '异常', type: 'info', content: '处理四性检测异常数据', time: '1小时前' },
  { id: 4, tag: '审批', type: 'primary', content: '审批跨校档案借阅申请', time: '2小时前' },
]);

const loanRequests = ref([
  { id: 1, user: '张三', description: '申请查阅 洛阳科技 的档案' },
  { id: 2, user: '李四', description: '申请查阅 广西英华 的档案' },
]);

const recentUsage = ref([
  { school: '云南工商学院', title: '2024年招生简章', count: 256, trend: 15 },
  { school: '洛阳科技', title: '教学管理制度汇编', count: 198, trend: 8 },
  { school: '广西英华', title: '校企合作协议模板', count: 167, trend: -3 },
  { school: '郑州城市', title: '人才培养方案', count: 145, trend: 12 },
  { school: '湖北恩施学院', title: '科研项目申报指南', count: 123, trend: 5 },
]);

const latestUpdates = ref([
  { time: '10分钟前', content: '云南工商学院 上传了 2024教学大纲', color: '#409EFF' },
  { time: '30分钟前', content: '张三 申请跨校借阅 洛阳科技档案', color: '#E6A23C' },
  { time: '2小时前', content: '系统自动完成 每日数据备份', color: '#67C23A' },
  { time: '4小时前', content: '湖北恩施学院 完成了年度归档任务', color: '#909399' },
]);

const archivingStatus = ref([
  { school: '云南工商学院', completed: 4600, total: 5000, color: '#67C23A' },
  { school: '洛阳科技', completed: 3400, total: 4000, color: '#67C23A' },
  { school: '广西英华', completed: 2340, total: 3000, color: '#409EFF' },
  { school: '郑州城市', completed: 1650, total: 3000, color: '#E6A23C' },
  { school: '湖北恩施学院', completed: 900, total: 2000, color: '#F56C6C' },
]);

onMounted(() => {
  initTotalArchivesChart();
  initYearlyTrendChart();
  initDigitizationRateChart();
  initStorageChart();
});

</script>

<style scoped>
.archive-workbench {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.stats-cards .stat-card .card-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stats-cards .icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-cards .text-content .value {
  font-size: 28px;
  font-weight: bold;
}

.stats-cards .text-content .label {
  color: #606266;
  margin-bottom: 5px;
}

.stats-cards .text-content .trend {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.trend.up { color: #67C23A; }
.trend.down { color: #F56C6C; }

.chart-card.full-height {
  height: 400px;
}

.chart-container {
  width: 100%;
  height: 320px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-panel-card {
  margin-bottom: 20px;
}
.info-panel-card:last-child {
  margin-bottom: 0;
}

.todo-list, .request-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.todo-list li:last-child { border-bottom: none; }
.todo-list .time { margin-left: auto; color: #909399; font-size: 12px; }

.request-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
.request-list li:last-child { border-bottom: none; }

.request-list .user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.request-list .details {
  display: flex;
  flex-direction: column;
}
.request-list .details .name { font-weight: bold; }
.request-list .details .desc { font-size: 12px; color: #909399; }

.latest-updates {
  padding-left: 10px;
}

.archive-status-col {
  margin-bottom: 15px;
}

.archive-status-item .school-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #606266;
}
</style>
