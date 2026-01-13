<template>
  <div class="knowledge-graph">
    <div class="section-header">
      <h3>知识图谱</h3>
      <p>可视化展示知识点、实体（人、事、物）之间的关联关系，发现隐性知识关联</p>
    </div>

    <el-card class="content-card">
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入文档名称、政策名称或关键词进行搜索"
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
        <div class="graph-content">
          <!-- 工具栏 -->
          <div class="graph-toolbar">
            <div class="toolbar-left">
              <el-tag type="info" size="large" v-if="currentCenter && viewType === 'force'">
                <el-icon><Position /></el-icon>
                当前中心：{{ currentCenter }}
              </el-tag>
            </div>
            <div class="toolbar-right">
              <!-- 视图切换按钮 -->
              <el-button-group>
                <el-button 
                  :type="viewType === 'force' ? 'primary' : ''" 
                  size="small"
                  @click="switchView('force')"
                >
                  力导向图
                </el-button>
                <el-button 
                  :type="viewType === 'tree' ? 'primary' : ''" 
                  size="small"
                  @click="switchView('tree')"
                >
                  树状图
                </el-button>
                <el-button 
                  :type="viewType === 'timeline' ? 'primary' : ''" 
                  size="small"
                  @click="switchView('timeline')"
                >
                  时间轴图
                </el-button>
                <el-button 
                  :type="viewType === 'sunburst' ? 'primary' : ''" 
                  size="small"
                  @click="switchView('sunburst')"
                >
                  太阳辐射图
                </el-button>
              </el-button-group>
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
            <div v-if="selectedNode && viewType === 'force'" class="node-detail-panel">
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
      <div class="legend-section" v-if="viewType === 'force' || viewType === 'tree'">
        <div class="legend-title">图例说明</div>
        <div class="legend-items">
          <div class="legend-item" v-for="legend in legendData" :key="legend.name">
            <span class="legend-color" :style="{ background: legend.color }"></span>
            <span class="legend-name">{{ legend.name }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Search, Position, RefreshRight, Download, Close, View, Plus } from '@element-plus/icons-vue';
import * as echarts from 'echarts';

const searchKeyword = ref('');
const currentCenter = ref('');
const selectedNode = ref(null);
const graphRef = ref(null);
const viewType = ref('force'); // 'force' | 'tree' | 'timeline' | 'sunburst'
let graphInstance = null;

const quickSearchItems = ref(['科研项目管理', '教学改革方案', '财务管理制度', '教师培训计划']);

// 根据截图定义图例
const legendData = ref([
  { name: '文档', color: '#4A90E2' }, // 蓝色
  { name: '案例', color: '#52C41A' }, // 绿色
  { name: '制度', color: '#FA8C16' }, // 橙色
  { name: '报告', color: '#F5222D' }, // 红色
  { name: '人员', color: '#722ED1' }  // 紫色
]);

// 根据截图定义的节点数据
const getAllNodes = () => {
  return [
    // 蓝色节点 - 管理制度类
    { id: '1', name: '科研项目管理', category: '管理制度', color: '#4A90E2', symbolSize: 80, description: '科研项目的全生命周期管理', connections: 10 },
    { id: '2', name: '财务管理制度', category: '管理制度', color: '#4A90E2', symbolSize: 70, description: '学校财务管理制度规范', connections: 3 },
    { id: '3', name: '质量评估标准', category: '管理制度', color: '#4A90E2', symbolSize: 60, description: '教学质量评估标准体系', connections: 2 },
    { id: '4', name: '教师培训计划', category: '管理制度', color: '#4A90E2', symbolSize: 65, description: '教师职业发展与培训计划', connections: 6 },
    { id: '5', name: '招生政策文件', category: '管理制度', color: '#4A90E2', symbolSize: 55, description: '招生政策与录取标准', connections: 3 },
    { id: '6', name: '教学改革方案', category: '管理制度', color: '#4A90E2', symbolSize: 50, description: '教学改革实施方案', connections: 0 },
    
    // 绿色节点 - 规划方案类
    { id: '7', name: '学术论文规范', category: '规划方案', color: '#52C41A', symbolSize: 70, description: '学术论文撰写与发表规范', connections: 5 },
    { id: '8', name: '资产管理办法', category: '规划方案', color: '#52C41A', symbolSize: 70, description: '学校资产管理制度', connections: 3 },
    { id: '9', name: '课程设计指南', category: '规划方案', color: '#52C41A', symbolSize: 60, description: '课程设计与开发指南', connections: 5 },
    { id: '10', name: '就业指导手册', category: '规划方案', color: '#52C41A', symbolSize: 55, description: '学生就业指导与服务', connections: 3 },
    { id: '11', name: '学科建设报告', category: '规划方案', color: '#52C41A', symbolSize: 55, description: '学科发展规划与建设', connections: 4 },
    { id: '12', name: '信息化建设规划', category: '规划方案', color: '#52C41A', symbolSize: 60, description: '校园信息化建设规划', connections: 3 },
    
    // 红色节点 - 政策文件类
    { id: '13', name: '创新创业指南', category: '政策文件', color: '#F5222D', symbolSize: 65, description: '创新创业政策与指导', connections: 5 },
    { id: '14', name: '学生工作手册', category: '政策文件', color: '#F5222D', symbolSize: 60, description: '学生工作管理手册', connections: 4 },
    { id: '15', name: '安全管理条例', category: '政策文件', color: '#F5222D', symbolSize: 70, description: '校园安全管理规定', connections: 3 },
    { id: '16', name: '人才培养方案', category: '政策文件', color: '#F5222D', symbolSize: 50, description: '人才培养目标与方案', connections: 0 },
    
    // 橙色节点 - 合作协议类
    { id: '17', name: '校企合作协议', category: '合作协议', color: '#FA8C16', symbolSize: 60, description: '校企合作框架协议', connections: 4 },
    { id: '18', name: '国际交流方案', category: '合作协议', color: '#FA8C16', symbolSize: 55, description: '国际交流与合作方案', connections: 2 },
    { id: '19', name: '教学评估报告', category: '合作协议', color: '#FA8C16', symbolSize: 70, description: '教学质量评估报告', connections: 3 },
    { id: '20', name: '实验室管理制度', category: '合作协议', color: '#FA8C16', symbolSize: 70, description: '实验室安全管理规定', connections: 2 },
    
    // 紫色节点 - 人员类
    { id: '21', name: '张教授', category: '人员', color: '#722ED1', symbolSize: 65, description: '计算机学院教授', connections: 5 },
    { id: '22', name: '李副教授', category: '人员', color: '#722ED1', symbolSize: 60, description: '经济学院副院长', connections: 4 },
    { id: '23', name: '王老师', category: '人员', color: '#722ED1', symbolSize: 55, description: '材料学院讲师', connections: 3 },
    { id: '24', name: '赵教授', category: '人员', color: '#722ED1', symbolSize: 65, description: '信息学院教授', connections: 4 }
  ];
};

// 根据截图定义的连接关系
const getAllLinks = () => {
  return [
    // 粗蓝色边 - 强关系
    { source: '1', target: '2', name: '关联', lineStyle: { color: '#4A90E2', width: 3 } },
    { source: '1', target: '3', name: '关联', lineStyle: { color: '#4A90E2', width: 3 } },
    
    // 浅蓝色边
    { source: '1', target: '12', name: '关联', lineStyle: { color: '#91D5FF', width: 2 } },
    { source: '1', target: '4', name: '关联', lineStyle: { color: '#91D5FF', width: 2 } },
    { source: '1', target: '7', name: '关联', lineStyle: { color: '#91D5FF', width: 2 } },
    { source: '2', target: '3', name: '关联', lineStyle: { color: '#91D5FF', width: 2 } },
    
    // 浅绿色边
    { source: '8', target: '2', name: '关联', lineStyle: { color: '#B7EB8F', width: 2 } },
    { source: '1', target: '9', name: '关联', lineStyle: { color: '#B7EB8F', width: 2 } },
    { source: '14', target: '10', name: '关联', lineStyle: { color: '#B7EB8F', width: 2 } },
    { source: '17', target: '11', name: '关联', lineStyle: { color: '#B7EB8F', width: 2 } },
    { source: '10', target: '11', name: '关联', lineStyle: { color: '#B7EB8F', width: 2 } },
    
    // 浅红色边
    { source: '4', target: '9', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '4', target: '5', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '4', target: '7', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '4', target: '13', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '9', target: '14', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '9', target: '15', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '9', target: '5', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '14', target: '15', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '15', target: '5', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    { source: '7', target: '13', name: '关联', lineStyle: { color: '#FFA39E', width: 2 } },
    
    // 浅橙色边
    { source: '8', target: '1', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '8', target: '12', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '1', target: '13', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '1', target: '17', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '13', target: '17', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '13', target: '20', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '11', target: '18', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '11', target: '19', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    { source: '20', target: '19', name: '关联', lineStyle: { color: '#FFD591', width: 2 } },
    
    // 紫色边 - 人员关联
    { source: '21', target: '1', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } },
    { source: '21', target: '7', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } },
    { source: '22', target: '13', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } },
    { source: '22', target: '9', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } },
    { source: '23', target: '12', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } },
    { source: '24', target: '17', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } },
    { source: '24', target: '19', name: '关联', lineStyle: { color: '#D3ADF7', width: 2 } }
  ];
};

// 根据截图构建树状图数据
const getTreeData = () => {
  return {
    name: '知识中心',
    itemStyle: { color: '#91D5FF' },
    children: [
      {
        name: '文档',
        itemStyle: { color: '#4A90E2' },
        children: [
          { name: '教学改革方案', value: 1 },
          { name: '科研项目管理', value: 1 },
          { name: '招生政策文件', value: 1 },
          { name: '财务管理制度', value: 1 },
          { name: '质量评估标准', value: 1 }
        ]
      },
      {
        name: '案例',
        itemStyle: { color: '#52C41A' },
        children: [
          { name: '课程设计指南', value: 1 },
          { name: '学术论文规范', value: 1 },
          { name: '就业指导手册', value: 1 },
          { name: '资产管理办法', value: 1 },
          { name: '学科建设报告', value: 1 }
        ]
      },
      {
        name: '制度',
        itemStyle: { color: '#FA8C16' },
        children: [
          { name: '教学评估报告', value: 1 },
          { name: '实验室管理制度', value: 1 },
          { name: '校企合作协议', value: 1 },
          { name: '信息化建设规划', value: 1 },
          { name: '国际交流方案', value: 1 }
        ]
      },
      {
        name: '报告',
        itemStyle: { color: '#F5222D' },
        children: [
          { name: '人才培养方案', value: 1 },
          { name: '学生工作手册', value: 1 },
          { name: '教师培训计划', value: 1 },
          { name: '安全管理条例', value: 1 },
          { name: '创新创业指南', value: 1 }
        ]
      }
    ]
  };
};

// 获取太阳辐射图数据（基于树状图数据）
const getSunburstData = () => {
  const treeData = getTreeData();
  return treeData.children.map(category => ({
    name: category.name,
    itemStyle: { color: category.itemStyle.color },
    children: category.children.map(item => ({
      name: item.name,
      value: item.value,
      itemStyle: { color: category.itemStyle.color }
    }))
  }));
};

// 获取时间轴数据
const getTimelineData = () => {
  const categories = ['文档', '案例', '制度', '报告'];
  const data = [];
  const allNodes = getAllNodes();
  
  allNodes.forEach((node, index) => {
    let category = '文档';
    if (node.category === '规划方案') category = '案例';
    else if (node.category === '政策文件') category = '报告';
    else if (node.category === '合作协议') category = '制度';
    
    data.push([
      index, // x轴：索引
      node.connections || Math.floor(Math.random() * 10), // y轴：关联数
      node.name, // 节点名称
      category,
      node.color
    ]);
  });
  
  return data;
};

const switchView = (type) => {
  viewType.value = type;
  selectedNode.value = null;
  initGraph();
};

const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    currentCenter.value = '';
    initGraph();
    return;
  }
  currentCenter.value = searchKeyword.value;
  initGraph();
  if (viewType.value === 'force') {
    ElMessage.success(`已为您展示"${searchKeyword.value}"的知识图谱`);
  }
};

const quickSearch = (keyword) => {
  searchKeyword.value = keyword;
  handleSearch();
};

const resetGraph = () => {
  currentCenter.value = '';
  searchKeyword.value = '';
  selectedNode.value = null;
  initGraph();
};

const exportGraph = () => {
  if (graphInstance) {
    const url = graphInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
    const link = document.createElement('a');
    link.download = `知识图谱-${viewType.value}.png`;
    link.href = url;
    link.click();
    ElMessage.success('图谱导出成功');
  }
};

const initGraph = () => {
  nextTick(() => {
    if (!graphRef.value) return;
    
    if (graphInstance) {
      graphInstance.dispose();
    }
    
    graphInstance = echarts.init(graphRef.value);
    
    let option = {};
    
    if (viewType.value === 'force') {
      option = initForceGraph();
    } else if (viewType.value === 'tree') {
      option = initTreeGraph();
    } else if (viewType.value === 'timeline') {
      option = initTimelineGraph();
    } else if (viewType.value === 'sunburst') {
      option = initSunburstGraph();
    }
    
    graphInstance.setOption(option);
    
    if (viewType.value === 'force') {
      graphInstance.on('click', (params) => {
        if (params.dataType === 'node') {
          const categories = legendData.value.map(item => ({ name: item.name }));
          selectedNode.value = {
            ...params.data,
            category: categories[params.data.category]?.name || '未知'
          };
        }
      });
    } else if (viewType.value === 'tree') {
      graphInstance.on('click', (params) => {
        if (params.dataType === 'node' && params.data.children) {
          // 点击有子节点的节点，可以展开/收起
        }
      });
    }
    
    // 窗口大小改变时自动调整
    window.addEventListener('resize', () => {
      if (graphInstance) {
        graphInstance.resize();
      }
    });
  });
};

const initForceGraph = () => {
  const allNodes = getAllNodes();
  const allLinks = getAllLinks();
  
  let nodes = allNodes;
  let links = allLinks;
  
  if (currentCenter.value) {
    const centerNode = allNodes.find(n => n.name === currentCenter.value);
    if (centerNode) {
      const relatedNodeIds = new Set([centerNode.id]);
      const relatedLinks = allLinks.filter(link => 
        link.source === centerNode.id || link.target === centerNode.id
      );
      relatedLinks.forEach(link => {
        relatedNodeIds.add(link.source);
        relatedNodeIds.add(link.target);
      });
      
      allLinks.forEach(link => {
        if (relatedNodeIds.has(link.source) || relatedNodeIds.has(link.target)) {
          relatedNodeIds.add(link.source);
          relatedNodeIds.add(link.target);
        }
      });
      
      nodes = allNodes.filter(n => relatedNodeIds.has(n.id));
      links = allLinks.filter(link => 
        relatedNodeIds.has(link.source) && relatedNodeIds.has(link.target)
      );
    }
  }
  
  const categories = legendData.value.map(item => ({ name: item.name }));
  const categoryMap = {};
  const categoryColorMap = {};
  legendData.value.forEach((item, index) => {
    categoryMap[item.name] = index;
    categoryColorMap[item.name] = item.color;
  });
  
  // 为每个节点设置分类索引和颜色
  nodes.forEach(node => {
    node.category = categoryMap[node.category] || 0;
    // 设置节点颜色 - 使用节点的color属性或根据分类获取颜色
    node.itemStyle = {
      color: node.color || categoryColorMap[Object.keys(categoryMap).find(key => categoryMap[key] === node.category)] || '#999',
      borderColor: '#fff',
      borderWidth: 2
    };
  });
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `<div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${params.data.name}</div>
            <div style="font-size: 12px; color: #666;">${params.data.description || ''}</div>
          </div>`;
        }
        return `${params.data.source} → ${params.data.target}`;
      }
    },
    series: [{
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: links,
      categories: categories,
      roam: true,
      label: {
        show: true,
        position: 'right',
        formatter: '{b}',
        fontSize: 12,
        color: '#333'
      },
      labelLayout: {
        hideOverlap: true
      },
      emphasis: {
        focus: 'adjacency',
        lineStyle: {
          width: 4
        }
      },
      lineStyle: {
        color: 'source',
        curveness: 0.3,
        opacity: 0.6
      },
      force: {
        repulsion: 2000,
        edgeLength: [100, 200],
        layoutAnimation: true,
        gravity: 0.1,
        friction: 0.8
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2
      }
    }]
  };
};

const initTreeGraph = () => {
  const treeData = getTreeData();
  
  return {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
      formatter: (params) => {
        return `<div style="padding: 8px;">
          <div style="font-weight: bold;">${params.data.name}</div>
        </div>`;
      }
    },
    series: [{
      type: 'tree',
      data: [treeData],
      left: '15%',
      right: '15%',
      top: '8%',
      bottom: '20%',
      symbol: 'emptyCircle',
      symbolSize: 6,
      layout: 'orthogonal',
      orient: 'LR',
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        fontSize: 10,
        distance: 5
      },
      leaves: {
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 10,
          distance: 5
        }
      },
      emphasis: {
        focus: 'descendant'
      },
      expandAndCollapse: true,
      animationDuration: 550,
      animationDurationUpdate: 750,
      initialTreeDepth: 3,
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1.5
      },
      lineStyle: {
        color: '#ccc',
        width: 1.5,
        curveness: 0.3
      },
      labelLayout: {
        hideOverlap: true
      }
    }]
  };
};

const initTimelineGraph = () => {
  const timelineData = getTimelineData();
  const categories = ['文档', '案例', '制度', '报告'];
  const colors = ['#4A90E2', '#52C41A', '#FA8C16', '#F5222D'];
  
  const series = categories.map((category, index) => {
    const data = timelineData.filter(item => item[3] === category);
    return {
      name: category,
      type: 'scatter',
      data: data.map(item => [item[0], item[1], item[2]]),
      symbolSize: (data) => {
        return Math.sqrt(data[1]) * 3 + 10;
      },
      itemStyle: {
        color: colors[index]
      },
      label: {
        show: true,
        formatter: (params) => {
          return params.data[2];
        },
        position: 'top',
        fontSize: 10
      }
    };
  });
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `<div style="padding: 8px;">
          <div style="font-weight: bold;">${params.data[2]}</div>
          <div style="font-size: 12px; color: #666;">关联数：${params.data[1]}</div>
        </div>`;
      }
    },
    legend: {
      data: categories,
      top: '5%'
    },
    grid: {
      left: '3%',
      right: '7%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: '索引',
      scale: true
    },
    yAxis: {
      type: 'value',
      name: '关联数',
      scale: true
    },
    series: series
  };
};

const initSunburstGraph = () => {
  const sunburstData = getSunburstData();
  
  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        return `<div style="padding: 8px;">
          <div style="font-weight: bold;">${params.name}</div>
          ${params.value ? `<div style="font-size: 12px; color: #666;">值：${params.value}</div>` : ''}
        </div>`;
      }
    },
    series: [{
      type: 'sunburst',
      data: sunburstData,
      radius: [0, '90%'],
      label: {
        rotate: 'radial'
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2
      },
      emphasis: {
        focus: 'ancestor'
      }
    }]
  };
};

const getNodeTypeColor = (category) => {
  const map = {
    '管理制度': 'primary',
    '规划方案': 'success',
    '政策文件': 'warning',
    '合作协议': 'danger',
    '文档': 'primary',
    '案例': 'success',
    '制度': 'danger',
    '报告': 'warning',
    '人员': 'info'
  };
  return map[category] || 'info';
};

const viewNodeDetail = () => {
  ElMessage.info(`查看详情: ${selectedNode.value.name}`);
};

const expandNode = () => {
  searchKeyword.value = selectedNode.value.name;
  handleSearch();
};

watch(viewType, () => {
  initGraph();
});

onMounted(() => {
  initGraph();
});
</script>

<style scoped>
.knowledge-graph {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  min-height: 600px;
}

.section-header {
  margin-bottom: 20px;
  flex-shrink: 0;
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

.content-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.content-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
  flex-shrink: 0;
}

.search-input {
  width: 100%;
  max-width: 600px;
}

.quick-search {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 14px;
  color: #606266;
}

.quick-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.quick-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.graph-container {
  position: relative;
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafafa;
  min-height: 500px;
  overflow: hidden;
}

.graph-content {
  width: 100%;
  height: 100%;
  position: relative;
}

.graph-toolbar {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  gap: 10px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.graph-chart {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.node-detail-panel {
  position: absolute;
  right: 20px;
  top: 70px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.panel-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.close-icon {
  cursor: pointer;
  font-size: 18px;
  color: #909399;
  transition: color 0.3s;
}

.close-icon:hover {
  color: #303133;
}

.panel-content {
  padding: 15px;
}

.detail-item {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.6;
}

.detail-item .label {
  color: #909399;
  margin-right: 8px;
}

.detail-item .value {
  color: #303133;
}

.detail-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.legend-section {
  margin-top: 20px;
  flex-shrink: 0;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
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
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.legend-name {
  font-size: 13px;
  color: #606266;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .node-detail-panel {
    width: 250px;
    right: 10px;
    top: 60px;
  }
  
  .graph-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
