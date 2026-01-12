<template>
  <div class="data-center-view">
    <div class="section-header">
      <div class="header-left">
        <h3>知识中心</h3>
        <p>可视化展示知识点、实体（人、事、物）之间的关联关系，发现隐性知识关联</p>
      </div>
    </div>

    <el-card class="content-card">
      <el-tabs v-model="activeTab" class="horizontal-tabs">
        <el-tab-pane label="知识图谱" name="knowledge-graph">
          <div class="tab-container">
            <!-- 搜索区域 -->
            <div class="search-section">
              <el-input
                v-model="searchKeyword"
                placeholder="请输入教师姓名、项目名称或关键词进行搜索"
                class="search-input"
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
                <template #append>
                  <el-button type="primary" @click="handleSearch">搜索</el-button>
                </template>
              </el-input>
              
              <!-- 快捷搜索 -->
              <div class="quick-search">
                <span class="quick-label">快捷搜索：</span>
                <el-tag
                  v-for="item in quickSearchItems"
                  :key="item"
                  class="quick-tag"
                  @click="quickSearch(item)"
                >
                  {{ item }}
                </el-tag>
              </div>
            </div>

            <!-- 图谱展示区域 -->
            <div class="graph-container">
              <div v-if="!currentCenter" class="empty-state">
                <el-empty description="请搜索教师、项目或关键词以查看知识图谱">
                  <el-icon class="empty-icon"><Connection /></el-icon>
                </el-empty>
              </div>
              
              <div v-else class="graph-content">
                <!-- 工具栏 -->
                <div class="graph-toolbar">
                  <div class="toolbar-left">
                    <el-tag type="info" size="large">
                      <el-icon><Position /></el-icon>
                      当前中心：{{ currentCenter }}
                    </el-tag>
                  </div>
                  <div class="toolbar-right">
                    <el-button size="small" @click="resetGraph">
                      <el-icon><RefreshRight /></el-icon>
                      重置视图
                    </el-button>
                    <el-button size="small" @click="exportGraph">
                      <el-icon><Download /></el-icon>
                      导出图谱
                    </el-button>
                  </div>
                </div>

                <!-- ECharts 图谱 -->
                <div ref="graphRef" class="graph-chart"></div>

                <!-- 节点详情面板 -->
                <transition name="slide-fade">
                  <div v-if="selectedNode" class="node-detail-panel">
                    <div class="panel-header">
                      <h4>{{ selectedNode.name }}</h4>
                      <el-icon class="close-icon" @click="selectedNode = null"><Close /></el-icon>
                    </div>
                    <div class="panel-content">
                      <div class="detail-item">
                        <span class="label">类型：</span>
                        <el-tag :type="getNodeTypeColor(selectedNode.category)" size="small">
                          {{ selectedNode.category }}
                        </el-tag>
                      </div>
                      <div class="detail-item" v-if="selectedNode.description">
                        <span class="label">描述：</span>
                        <span class="value">{{ selectedNode.description }}</span>
                      </div>
                      <div class="detail-item" v-if="selectedNode.connections">
                        <span class="label">关联数：</span>
                        <span class="value">{{ selectedNode.connections }} 个</span>
                      </div>
                      <div class="detail-actions">
                        <el-button type="primary" size="small" @click="viewNodeDetail">
                          <el-icon><View /></el-icon>
                          查看详情
                        </el-button>
                        <el-button size="small" @click="expandNode">
                          <el-icon><Plus /></el-icon>
                          展开关联
                        </el-button>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </div>

            <!-- 图例说明 -->
            <div class="legend-section" v-if="currentCenter">
              <div class="legend-title">图例说明</div>
              <div class="legend-items">
                <div class="legend-item" v-for="legend in legendData" :key="legend.name">
                  <span class="legend-color" :style="{ background: legend.color }"></span>
                  <span class="legend-name">{{ legend.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="在线图书馆" name="online-library">
          <div class="tab-container">
            <div class="placeholder-content">
              <el-empty description="暂无在线图书馆数据" />
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Connection, Position, RefreshRight, Download, Close, View, Plus } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const activeTab = ref('knowledge-graph')
const searchKeyword = ref('')
const currentCenter = ref('')
const selectedNode = ref(null)
const graphRef = ref(null)
let graphInstance = null

// 快捷搜索项
const quickSearchItems = ref(['张教授', '李副教授', 'AI研究项目', '机器学习'])

// 图例数据
const legendData = ref([
  { name: '教师', color: '#667eea' },
  { name: '项目', color: '#f5576c' },
  { name: '学生', color: '#4facfe' },
  { name: '论文', color: '#43e97b' },
  { name: '文档', color: '#fa709a' },
  { name: '企业', color: '#feca57' }
])

// 模拟知识图谱数据
const graphDataMap = {
  '张教授': {
    nodes: [
      { id: '1', name: '张教授', category: '教师', symbolSize: 80, description: '计算机科学教授，AI专家', connections: 8 },
      { id: '2', name: 'AI研究项目', category: '项目', symbolSize: 60, description: '国家级AI研究项目', connections: 5 },
      { id: '3', name: '机器学习课程', category: '项目', symbolSize: 50, description: '研究生核心课程', connections: 3 },
      { id: '4', name: '王同学', category: '学生', symbolSize: 45, description: '博士研究生', connections: 4 },
      { id: '5', name: '李同学', category: '学生', symbolSize: 45, description: '硕士研究生', connections: 3 },
      { id: '6', name: '深度学习论文', category: '论文', symbolSize: 50, description: 'SCI一区论文', connections: 4 },
      { id: '7', name: '神经网络论文', category: '论文', symbolSize: 45, description: 'EI论文', connections: 2 },
      { id: '8', name: '项目文档', category: '文档', symbolSize: 40, description: '项目技术文档', connections: 2 },
      { id: '9', name: '华为技术', category: '企业', symbolSize: 55, description: '合作企业', connections: 3 }
    ],
    links: [
      { source: '1', target: '2', name: '主持', value: '项目负责人' },
      { source: '1', target: '3', name: '授课', value: '主讲教师' },
      { source: '1', target: '4', name: '指导', value: '博导' },
      { source: '1', target: '5', name: '指导', value: '硕导' },
      { source: '1', target: '6', name: '发表', value: '第一作者' },
      { source: '1', target: '7', name: '发表', value: '通讯作者' },
      { source: '2', target: '8', name: '产出', value: '技术文档' },
      { source: '2', target: '9', name: '合作', value: '产学研合作' },
      { source: '4', target: '6', name: '参与', value: '第二作者' },
      { source: '5', target: '7', name: '参与', value: '第三作者' },
      { source: '2', target: '4', name: '参与', value: '项目成员' },
      { source: '2', target: '5', name: '参与', value: '项目成员' }
    ]
  },
  '李副教授': {
    nodes: [
      { id: '10', name: '李副教授', category: '教师', symbolSize: 75, description: '经济学副教授', connections: 6 },
      { id: '11', name: '金融研究项目', category: '项目', symbolSize: 55, description: '省级研究项目', connections: 4 },
      { id: '12', name: '赵同学', category: '学生', symbolSize: 40, description: '硕士研究生', connections: 2 },
      { id: '13', name: '金融分析论文', category: '论文', symbolSize: 45, description: 'CSSCI论文', connections: 3 },
      { id: '14', name: '研究报告', category: '文档', symbolSize: 35, description: '政策研究报告', connections: 2 },
      { id: '15', name: '中国银行', category: '企业', symbolSize: 50, description: '合作银行', connections: 2 }
    ],
    links: [
      { source: '10', target: '11', name: '主持', value: '项目负责人' },
      { source: '10', target: '12', name: '指导', value: '硕导' },
      { source: '10', target: '13', name: '发表', value: '第一作者' },
      { source: '11', target: '14', name: '产出', value: '研究成果' },
      { source: '11', target: '15', name: '合作', value: '横向课题' },
      { source: '12', target: '13', name: '参与', value: '第二作者' }
    ]
  },
  'AI研究项目': {
    nodes: [
      { id: '1', name: '张教授', category: '教师', symbolSize: 70, description: '项目负责人', connections: 5 },
      { id: '2', name: 'AI研究项目', category: '项目', symbolSize: 80, description: '国家级AI研究项目', connections: 8 },
      { id: '4', name: '王同学', category: '学生', symbolSize: 45, description: '博士研究生', connections: 3 },
      { id: '5', name: '李同学', category: '学生', symbolSize: 45, description: '硕士研究生', connections: 3 },
      { id: '8', name: '项目文档', category: '文档', symbolSize: 50, description: '项目技术文档', connections: 4 },
      { id: '9', name: '华为技术', category: '企业', symbolSize: 60, description: '合作企业', connections: 4 },
      { id: '16', name: '算法设计文档', category: '文档', symbolSize: 45, description: '核心算法文档', connections: 2 },
      { id: '17', name: '测试报告', category: '文档', symbolSize: 40, description: '系统测试报告', connections: 2 }
    ],
    links: [
      { source: '2', target: '1', name: '负责人', value: '项目负责人' },
      { source: '2', target: '4', name: '成员', value: '核心成员' },
      { source: '2', target: '5', name: '成员', value: '项目成员' },
      { source: '2', target: '8', name: '产出', value: '技术文档' },
      { source: '2', target: '9', name: '合作', value: '产学研合作' },
      { source: '2', target: '16', name: '产出', value: '算法文档' },
      { source: '2', target: '17', name: '产出', value: '测试文档' },
      { source: '9', target: '8', name: '审核', value: '文档审核' }
    ]
  },
  '机器学习': {
    nodes: [
      { id: '1', name: '张教授', category: '教师', symbolSize: 70, description: '主讲教师', connections: 4 },
      { id: '3', name: '机器学习课程', category: '项目', symbolSize: 75, description: '研究生核心课程', connections: 6 },
      { id: '6', name: '深度学习论文', category: '论文', symbolSize: 55, description: 'SCI一区论文', connections: 3 },
      { id: '18', name: '课程课件', category: '文档', symbolSize: 45, description: '教学课件', connections: 2 },
      { id: '19', name: '实验指导书', category: '文档', symbolSize: 40, description: '实验教程', connections: 2 },
      { id: '20', name: '学习笔记', category: '文档', symbolSize: 35, description: '学生笔记集', connections: 1 }
    ],
    links: [
      { source: '3', target: '1', name: '授课', value: '主讲教师' },
      { source: '3', target: '6', name: '参考', value: '教学参考' },
      { source: '3', target: '18', name: '资料', value: '教学资料' },
      { source: '3', target: '19', name: '资料', value: '实验资料' },
      { source: '3', target: '20', name: '产出', value: '学习成果' },
      { source: '1', target: '18', name: '制作', value: '课件制作' }
    ]
  }
}

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  
  const keyword = searchKeyword.value.trim()
  if (graphDataMap[keyword]) {
    currentCenter.value = keyword
    nextTick(() => {
      initGraph(keyword)
    })
    ElMessage.success(`已加载"${keyword}"的知识图谱`)
  } else {
    ElMessage.info(`未找到"${keyword}"的相关数据，为您展示推荐内容`)
    currentCenter.value = '张教授'
    searchKeyword.value = '张教授'
    nextTick(() => {
      initGraph('张教授')
    })
  }
}

// 快捷搜索
const quickSearch = (keyword) => {
  searchKeyword.value = keyword
  handleSearch()
}

// 初始化图谱
const initGraph = (centerKey) => {
  if (!graphRef.value) return
  
  if (graphInstance) {
    graphInstance.dispose()
  }
  
  graphInstance = echarts.init(graphRef.value)
  
  const data = graphDataMap[centerKey]
  if (!data) return
  
  // 设置节点类别颜色
  const categories = [
    { name: '教师', itemStyle: { color: '#667eea' } },
    { name: '项目', itemStyle: { color: '#f5576c' } },
    { name: '学生', itemStyle: { color: '#4facfe' } },
    { name: '论文', itemStyle: { color: '#43e97b' } },
    { name: '文档', itemStyle: { color: '#fa709a' } },
    { name: '企业', itemStyle: { color: '#feca57' } }
  ]
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${params.data.name}</div>
              <div style="color: #666; font-size: 12px;">类型：${params.data.category}</div>
              ${params.data.description ? `<div style="color: #666; font-size: 12px; margin-top: 4px;">${params.data.description}</div>` : ''}
              <div style="color: #999; font-size: 12px; margin-top: 4px;">关联数：${params.data.connections}</div>
            </div>
          `
        } else if (params.dataType === 'edge') {
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold;">${params.data.name}</div>
              <div style="color: #666; font-size: 12px; margin-top: 4px;">${params.data.value}</div>
            </div>
          `
        }
      }
    },
    legend: {
      data: categories.map(c => c.name),
      orient: 'vertical',
      left: 'right',
      top: 'center',
      textStyle: {
        fontSize: 12
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: data.nodes.map(node => ({
        ...node,
        category: categories.findIndex(c => c.name === node.category)
      })),
      links: data.links,
      categories: categories,
      roam: true,
      label: {
        show: true,
        position: 'bottom',
        fontSize: 12,
        formatter: '{b}'
      },
      labelLayout: {
        hideOverlap: true
      },
      emphasis: {
        focus: 'adjacency',
        label: {
          fontSize: 14,
          fontWeight: 'bold'
        },
        lineStyle: {
          width: 3
        }
      },
      force: {
        repulsion: 300,
        edgeLength: 150,
        gravity: 0.1
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
        width: 2
      },
      edgeLabel: {
        show: true,
        fontSize: 10,
        formatter: '{c}'
      }
    }]
  }
  
  graphInstance.setOption(option)
  
  // 点击节点事件
  graphInstance.on('click', (params) => {
    if (params.dataType === 'node') {
      const originalNode = data.nodes.find(n => n.id === params.data.id)
      selectedNode.value = originalNode
    }
  })
  
  // 响应式调整
  window.addEventListener('resize', () => {
    graphInstance?.resize()
  })
}

// 重置图谱
const resetGraph = () => {
  if (graphInstance) {
    graphInstance.setOption({
      series: [{
        force: {
          layoutAnimation: true
        }
      }]
    })
    graphInstance.resize()
  }
  ElMessage.success('已重置视图')
}

// 导出图谱
const exportGraph = () => {
  if (graphInstance) {
    const url = graphInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    })
    const link = document.createElement('a')
    link.href = url
    link.download = `知识图谱_${currentCenter.value}_${Date.now()}.png`
    link.click()
    ElMessage.success('图谱导出成功')
  }
}

// 查看节点详情
const viewNodeDetail = () => {
  if (selectedNode.value) {
    ElMessage.info(`查看"${selectedNode.value.name}"的详细信息`)
    // 这里可以跳转到详情页面或打开详情对话框
  }
}

// 展开节点
const expandNode = () => {
  if (selectedNode.value) {
    ElMessage.info(`展开"${selectedNode.value.name}"的关联节点`)
    // 这里可以动态加载更多关联节点
  }
}

// 获取节点类型颜色
const getNodeTypeColor = (category) => {
  const colorMap = {
    '教师': 'primary',
    '项目': 'danger',
    '学生': 'info',
    '论文': 'success',
    '文档': 'warning',
    '企业': 'warning'
  }
  return colorMap[category] || 'info'
}

onMounted(() => {
  // 默认加载张教授的图谱
  // currentCenter.value = '张教授'
  // nextTick(() => {
  //   initGraph('张教授')
  // })
})
</script>

<style scoped>
.data-center-view {
  padding: 0;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 8px;
}

.section-header p {
  color: #718096;
  font-size: 14px;
}

.content-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.horizontal-tabs :deep(.el-tabs__header) {
  margin-bottom: 24px;
}

.horizontal-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
  background-color: #edf2f7;
}

.horizontal-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
  height: 50px;
  line-height: 50px;
}

.horizontal-tabs :deep(.el-tabs__item.is-active) {
  font-weight: 700;
}

.tab-container {
  padding: 10px 0;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 24px;
}

.search-input {
  max-width: 800px;
}

.quick-search {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.quick-label {
  color: #718096;
  font-size: 14px;
}

.quick-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* 图谱容器 */
.graph-container {
  position: relative;
  min-height: 600px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
}

.empty-icon {
  font-size: 64px;
  color: #cbd5e0;
  margin-bottom: 16px;
}

.graph-content {
  position: relative;
  height: 100%;
}

/* 工具栏 */
.graph-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 12px 12px 0 0;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

/* 图谱图表 */
.graph-chart {
  width: 100%;
  height: 600px;
  background: #fff;
}

/* 节点详情面板 */
.node-detail-panel {
  position: absolute;
  right: 16px;
  top: 80px;
  width: 300px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 10;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.panel-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-icon {
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.3s;
}

.close-icon:hover {
  transform: rotate(90deg);
}

.panel-content {
  padding: 16px;
}

.detail-item {
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-item .label {
  color: #718096;
  margin-right: 8px;
}

.detail-item .value {
  color: #2d3748;
}

.detail-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.detail-actions .el-button {
  flex: 1;
}

/* 图例区域 */
.legend-section {
  margin-top: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-name {
  font-size: 14px;
  color: #4a5568;
}

/* 占位内容 */
.placeholder-content {
  padding: 80px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 动画 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
