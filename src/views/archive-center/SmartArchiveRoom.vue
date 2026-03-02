<template>
  <div class="smart-archive-room-visual">
    <!-- 顶部导航与操作栏 -->
    <div class="visual-header">
      <div class="breadcrumb-nav">
        <el-icon class="nav-icon"><OfficeBuilding /></el-icon>
        <span 
          class="nav-item root" 
          :class="{ active: currentLevel === 'warehouse' }"
          @click="resetView"
        >
          全馆视图
        </span>
        
        <template v-if="currentWarehouse">
           <el-icon class="separator"><ArrowRight /></el-icon>
           <span 
             class="nav-item" 
             :class="{ active: currentLevel === 'area' }"
             @click="navigateToWarehouse(currentWarehouse)"
           >
             {{ currentWarehouse.label }}
           </span>
        </template>

        <template v-if="currentArea">
           <el-icon class="separator"><ArrowRight /></el-icon>
           <span class="nav-item active">{{ currentArea.label }}</span>
        </template>
      </div>

      <div class="header-right-tools">
        <!-- 搜索定位 -->
        <div class="search-box">
          <el-input 
            v-model="searchQuery" 
            placeholder="输入档号/题名定位..." 
            class="search-input"
            prefix-icon="Search"
            @keyup.enter="handleSearch"
            clearable
          />
        </div>

        <el-divider direction="vertical" />
        
        <!-- 操作按钮组 -->
        <el-button-group>
          <el-button type="primary" icon="Plus" @click="handleAddItem">
            {{ addItemButtonText }}
          </el-button>
          <el-button icon="List" @click="logsDrawerVisible = true">
            操作日志
          </el-button>
        </el-button-group>
        
        <el-button v-if="currentLevel === 'warehouse'" type="success" icon="DataLine" style="margin-left: 12px">全馆监控</el-button>
        <el-button v-if="currentLevel === 'shelf_list'" type="warning" icon="SetUp" style="margin-left: 12px">密集架控制</el-button>
      </div>
    </div>

    <!-- 主视图区域 -->
    <div class="visual-content">
      
      <!-- 层级1：库房总览视图 -->
      <transition name="fade-slide" mode="out-in">
        <div v-if="currentLevel === 'warehouse'" key="warehouse" class="view-container warehouse-view">
          <el-row :gutter="24">
            <el-col :span="6" v-for="wh in warehouseData" :key="wh.id">
              <div 
                class="visual-card warehouse-card" 
                :style="{ backgroundImage: `url(${wh.bgImage})` }"
                @click="enterWarehouse(wh)"
              >
                <div class="card-overlay"></div>
                <div class="card-status" :class="getEnvStatus(wh).class">
                  {{ getEnvStatus(wh).text }}
                </div>
                <!-- 移除原有 Icon 部分 -->
                <div class="info-section">
                  <h3>{{ wh.label }}</h3>
                  <div class="stats-row">
                    <div class="stat-item">
                      <span class="label">温度</span>
                      <span class="value">{{ wh.env?.temp || 24 }}°C</span>
                    </div>
                    <div class="stat-item">
                      <span class="label">湿度</span>
                      <span class="value">{{ wh.env?.humidity || 45 }}%</span>
                    </div>
                  </div>
                  <el-progress 
                    :percentage="wh.usageRate || 0" 
                    :color="customColors"
                    :stroke-width="8"
                    class="warehouse-progress"
                  >
                    <template #default="{ percentage }">
                      <span class="progress-label">占用 {{ percentage }}%</span>
                    </template>
                  </el-progress>
                </div>
                <div class="hover-tip">点击进入库房</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 层级2：区域分布视图 -->
        <div v-else-if="currentLevel === 'area'" key="area" class="view-container area-view">
          <div class="floor-plan">
             <div class="floor-title">{{ currentWarehouse.label }} - 平面布局示意图</div>
             <div class="zones-grid">
               <div 
                 v-for="area in currentWarehouse.children" 
                 :key="area.id" 
                 class="zone-block"
                 :class="{ 'high-density': (area.usageRate || 0) > 80 }"
                 @click="enterArea(area)"
               >
                 <div class="zone-header">
                   <el-icon><Grid /></el-icon>
                   <span>{{ area.label }}</span>
                 </div>
                 <div class="zone-body">
                   <div class="zone-metric">
                      <span>密集架组</span>
                      <strong>{{ area.children?.length || 0 }}</strong>
                   </div>
                   <div class="zone-metric">
                      <span>档案数</span>
                      <strong>{{ calculateArchivesCount(area) }}</strong>
                   </div>
                 </div>
                 <div class="zone-footer">
                   <span class="status-dot"></span> 监控正常
                 </div>
               </div>
               
               <!-- 空区域占位，用于添加 -->
               <div class="zone-block add-zone" @click="openAddDialog('area')">
                 <el-icon><Plus /></el-icon>
                 <span>规划新区域</span>
               </div>
             </div>
          </div>
        </div>

        <!-- 层级3：密集架排布视图 -->
        <div v-else-if="currentLevel === 'shelf_list'" key="shelf-list" class="view-container shelf-view">
           <div class="shelf-layout-container">
             <div class="layout-controls">
                <span class="guide-text">
                  <el-icon><InfoFilled /></el-icon> 密集架排列视图 ({{ currentArea.label }})
                </span>
                <div class="legend">
                  <span class="dot free"></span>空闲
                  <span class="dot medium"></span>适中
                  <span class="dot full"></span>接近满载
                  <span class="dot borrowed"></span>含借出
                </div>
             </div>
             
             <div class="shelves-rows">
               <div 
                  v-for="shelf in currentArea.children" 
                  :key="shelf.id" 
                  class="shelf-unit"
                  :class="getShelfStatusClass(shelf)"
                  @click="openShelfDetail(shelf)"
               >
                 <div class="shelf-face face-front">
                   <div class="handle"></div>
                   <div class="label-plate">{{ shelf.label }}</div>
                   <div class="vent-slots">
                     <span></span><span></span><span></span>
                   </div>
                 </div>
                 <div class="shelf-shadow"></div>
               </div>
               
               <!-- 添加密集架的虚线框 -->
               <div class="shelf-unit add-shelf" @click="openAddShelfDialog">
                 <el-icon><Plus /></el-icon>
                 <span>新增</span>
               </div>
             </div>
           </div>
        </div>
      </transition>
    </div>

    <!-- 抽屉：密集架拟真详情 -->
    <el-drawer
      v-model="drawerVisible"
      :title="currentShelf?.label + ' 详情'"
      size="70%"
      direction="rtl"
      :destroy-on-close="false"
      custom-class="shelf-drawer"
    >
      <div class="realistic-shelf-container" v-if="currentShelfMockData">
        <div class="shelf-info-bar">
           <div class="info-item">
             <span class="label">规格</span>
             <span class="val">{{ currentShelf?.config?.columns || 2 }}面 × {{ currentShelf?.config?.sections || 3 }}节 × {{ currentShelf?.config?.layers || 6 }}层</span>
           </div>
           <div class="info-item">
             <span class="label">总容量</span>
             <span class="val">{{ currentShelf?.totalCells }} 卷</span>
           </div>
           <div class="info-item">
             <span class="label">当前状态</span>
             <el-tag size="small" type="success">开启中</el-tag>
           </div>
        </div>

        <div class="shelf-3d-faces">
          <el-tabs type="border-card" class="shelf-tabs" v-model="activeTab">
            <el-tab-pane 
              v-for="col in currentShelfMockData.columns" 
              :key="col.id" 
              :label="col.name"
              :name="col.id"
            >
              <div class="face-grid">
                <!-- 节 (Section) -->
                <div v-for="section in col.sections" :key="section.id" class="section-column">
                  <div class="section-header-metal">第 {{ section.name }} 节</div>
                  <div class="layers-stack">
                     <!-- 层 (Layer) -->
                     <div v-for="layer in section.layers" :key="layer.id" class="layer-row">
                        <div class="layer-meta">{{ layer.number }}层</div>
                        <div class="cells-wrapper">
                          <div 
                             v-for="cell in layer.cells" 
                             :key="cell.id"
                             class="archive-box"
                             :class="{ 
                               'has-file': cell.status === 'occupied', 
                               'is-borrowed': cell.status === 'borrowed',
                               'has-digital': cell.hasDigital,
                               'is-highlighted': highlightedCellId === cell.id
                             }"
                             @click="handleCellInteraction(cell)"
                          >
                             <div class="spine" v-if="cell.status !== 'empty'">
                               <span class="spine-text">{{ cell.archiveCode || '未命名' }}</span>
                             </div>
                             <span class="empty-mark" v-else>{{ cell.position }}</span>
                             
                             <!-- 高亮指示器 -->
                             <div v-if="highlightedCellId === cell.id" class="highlight-ring"></div>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 底部操作面板 (替代原弹窗) -->
        <transition name="slide-up">
          <div class="bottom-action-panel" v-if="currentSelectedCell">
            <div class="panel-handle" @click="closeBottomPanel">
              <el-icon><ArrowDown /></el-icon>
            </div>
            
            <!-- 场景1: 入库操作 (空闲位) -->
            <div v-if="currentSelectedCell.status === 'empty'" class="panel-content inbound-mode">
               <div class="panel-header">
                 <h4><el-icon><Plus /></el-icon> 新档案入库</h4>
                 <span class="location-tag">{{ currentSelectedCellLocation }}</span>
               </div>
               <div class="inbound-form-inline">
                 <el-input v-model="inboundForm.code" placeholder="档号" style="width: 180px">
                   <template #prefix>档号</template>
                 </el-input>
                 <el-input v-model="inboundForm.title" placeholder="档案题名" style="width: 240px">
                   <template #prefix>题名</template>
                 </el-input>
                 <el-input v-model="inboundForm.operator" placeholder="操作人" style="width: 120px">
                    <template #prefix>操作人</template>
                 </el-input>
                 <el-button type="primary" @click="submitInbound">确认入库</el-button>
               </div>
            </div>

            <!-- 场景2: 档案详情与操作 (占用/借出位) -->
            <div v-else class="panel-content detail-mode">
               <div class="detail-left">
                  <div class="detail-icon">
                    <el-icon :color="currentSelectedCell.status === 'borrowed' ? '#E6A23C' : '#409EFF'" size="40">
                      <component :is="currentSelectedCell.status === 'borrowed' ? 'Timer' : 'Collection'" />
                    </el-icon>
                  </div>
                  <div class="detail-info">
                    <div class="main-info">
                       <span class="code">{{ currentSelectedCell.archiveCode }}</span>
                       <el-tag size="small" :type="currentSelectedCell.status === 'borrowed' ? 'warning' : 'success'">
                         {{ currentSelectedCell.status === 'borrowed' ? '已借出' : '在库' }}
                       </el-tag>
                    </div>
                    <div class="sub-info">{{ currentSelectedCell.archiveTitle || '无题名' }}</div>
                    <div class="borrow-info" v-if="currentSelectedCell.status === 'borrowed'">
                       借阅人: {{ currentSelectedCell.borrower }} | 归还期限: {{ currentSelectedCell.deadline || '未定' }}
                    </div>
                  </div>
               </div>
               
               <div class="detail-actions">
                 <!-- 新增：查看内容按钮 -->
                 <el-button 
                   v-if="currentSelectedCell.status !== 'empty' && currentSelectedCell.hasDigital" 
                   type="primary" 
                   icon="Document" 
                   @click="openDigitalPreview"
                 >
                   查看内容
                 </el-button>

                 <template v-if="currentSelectedCell.status === 'occupied'">
                    <el-button type="warning" plain icon="Timer" @click="openBorrowConfig">借阅登记</el-button>
                    <el-button type="danger" plain icon="TakeawayBox" @click="handleOutbound">永久出库</el-button>
                    <el-button type="success" plain icon="CircleCheck" @click="handleInventory">盘点确认</el-button>
                 </template>
                 
                 <template v-if="currentSelectedCell.status === 'borrowed'">
                    <el-button type="primary" icon="RefreshLeft" @click="handleReturn">档案归还</el-button>
                 </template>
               </div>
            </div>
          </div>
        </transition>

      </div>
    </el-drawer>

    <!-- 电子档案预览弹窗 -->
    <el-dialog 
      v-model="previewDialogVisible" 
      title="电子档案预览" 
      width="800px" 
      top="5vh"
      custom-class="preview-dialog"
    >
      <div class="preview-container" v-if="currentSelectedCell">
         <div class="preview-header">
           <h2>{{ currentSelectedCell.archiveTitle }}</h2>
           <div class="meta-row">
             <el-tag size="small">公开级</el-tag>
             <span>档号: {{ currentSelectedCell.archiveCode }}</span>
             <span>归档日期: 2023-12-01</span>
           </div>
         </div>
         <div class="preview-body">
           <div class="doc-outline">
             <h4>目录结构</h4>
             <ul>
               <li class="active">1. 实施方案概述</li>
               <li>2. 组织架构与人员</li>
               <li>2.1 领导小组名单</li>
               <li>3. 预算明细表</li>
               <li>4. 附件：现场照片</li>
             </ul>
           </div>
           <div class="doc-content">
              <div class="mock-page">
                 <h3>第一章 实施方案概述</h3>
                 <p>为贯彻落实上级指示精神，提升档案管理现代化水平，特制定本实施方案。本方案旨在通过引入智能密集架系统、环境监控系统及一体化档案管理平台，实现实体档案与数字档案的深度融合。</p>
                 <p>主要建设内容包括：...</p>
                 <p class="placeholder-text">[以下内容为模拟数据，仅供展示]</p>
                 <div class="watermark">内部资料 严禁外传</div>
              </div>
           </div>
         </div>
      </div>
      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="primary" icon="Download">下载原件</el-button>
      </template>
    </el-dialog>

    <!-- 抽屉：操作日志 -->
    <el-drawer v-model="logsDrawerVisible" title="档案操作日志" size="400px">
      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in operationLogs"
          :key="index"
          :timestamp="log.time"
          :type="log.type"
          placement="top"
        >
          <el-card class="log-card">
            <h4>{{ log.action }}</h4>
            <p>{{ log.detail }}</p>
            <p class="log-footer">操作人: {{ log.operator }}</p>
          </el-card>
        </el-timeline-item>
        <el-empty v-if="operationLogs.length === 0" description="暂无操作记录" />
      </el-timeline>
    </el-drawer>

    <!-- Dialog: 入库 (已废弃，逻辑移至底部面板) -->
    <!-- Dialog: 档案操作 (已废弃，逻辑移至底部面板) -->

    <!-- 借阅信息填写 Dialog -->
    <el-dialog v-model="borrowDialogVisible" title="借阅登记" width="300px" append-to-body>
       <el-form :model="borrowForm">
         <el-form-item label="借阅人">
           <el-input v-model="borrowForm.borrower" />
         </el-form-item>
         <el-form-item label="归还期限">
           <el-date-picker v-model="borrowForm.deadline" type="date" placeholder="选择日期" style="width:100%"/>
         </el-form-item>
       </el-form>
       <template #footer>
         <el-button type="primary" @click="submitBorrow">确认借出</el-button>
       </template>
    </el-dialog>
    
    <!-- 其他创建Dialog复用之前逻辑，此处省略部分代码以保持简洁，核心在上方逻辑 -->
    <!-- (此处为之前的新建库房/区域/密集架的Dialog，保留原样即可) -->
    
    <!-- Dialog: 新建库房/区域 (复用) -->
    <el-dialog v-model="commonDialogVisible" :title="dialogTitle" width="400px">
      <el-form :model="commonForm" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="commonForm.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="commonForm.description" type="textarea" />
        </el-form-item>
        <el-form-item label="环境" v-if="commonForm.type === 'warehouse'">
           <el-row :gutter="10">
             <el-col :span="12"><el-input v-model="commonForm.temp" placeholder="温度" ><template #append>°C</template></el-input></el-col>
             <el-col :span="12"><el-input v-model="commonForm.humidity" placeholder="湿度"><template #append>%</template></el-input></el-col>
           </el-row>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="commonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCommonForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- Dialog: 新增密集架 (复用) -->
    <el-dialog v-model="shelfDialogVisible" title="新增密集架" width="500px">
      <el-form :model="shelfForm" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="shelfForm.name" />
        </el-form-item>
        <div class="config-grid">
           <el-form-item label="面数(列)">
              <el-input-number v-model="shelfForm.columns" :min="1" :max="4" size="small"/>
           </el-form-item>
           <el-form-item label="每列节数">
              <el-input-number v-model="shelfForm.sections" :min="1" :max="10" size="small"/>
           </el-form-item>
           <el-form-item label="每节层数">
              <el-input-number v-model="shelfForm.layers" :min="1" :max="10" size="small"/>
           </el-form-item>
           <el-form-item label="每层格数">
              <el-input-number v-model="shelfForm.cells" :min="1" :max="20" size="small"/>
           </el-form-item>
        </div>
        <div class="preview-bar">
           预计容量：{{ shelfForm.columns * shelfForm.sections * shelfForm.layers * shelfForm.cells }} 卷
        </div>
      </el-form>
      <template #footer>
        <el-button @click="shelfDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShelfForm">创建</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { 
  OfficeBuilding, ArrowRight, School, DataLine, 
  ArrowDown, Document, Download
} from '@element-plus/icons-vue';
import { ElMessage, ElNotification } from 'element-plus';
import dayjs from 'dayjs';

// --- State ---
const currentLevel = ref('warehouse'); 
const currentWarehouse = ref(null);
const currentArea = ref(null);
const currentShelf = ref(null);
const currentShelfMockData = ref(null); 
const highlightedCellId = ref(null);
const activeTab = ref('');
const currentSelectedCell = ref(null); // Current selected cell for bottom panel

const drawerVisible = ref(false);
const logsDrawerVisible = ref(false);
const commonDialogVisible = ref(false);
const shelfDialogVisible = ref(false);
const borrowDialogVisible = ref(false);
const previewDialogVisible = ref(false);

const dialogTitle = ref('');
const searchQuery = ref('');
const route = useRoute();

// --- Caches & Storage ---
// Map<ShelfID, Object> - Store shelf internal structure to persist state
const shelfDataCache = reactive(new Map());
const operationLogs = ref([
  { time: '2024-01-14 09:30', type: 'primary', action: '入库', detail: '档号 A-2024-001 入库至 一号库房-文书区-01号柜', operator: '管理员' },
  { time: '2024-01-13 14:20', type: 'warning', action: '借阅', detail: '张教授 借阅了 B-2023-056 教学档案', operator: '李四' }
]);

// --- Data ---
const warehouseData = ref([
  {
    id: 1,
    label: '一号综合库房',
    type: 'warehouse',
    usageRate: 65,
    bgImage: '/images/dangan/fw6538.jpg',
    env: { temp: 23.5, humidity: 48 },
    children: [
      { id: 11, label: '文书档案区', type: 'area', usageRate: 85, children: generateShelves(8, 'WS') },
      { id: 12, label: '科技档案区', type: 'area', usageRate: 40, children: generateShelves(6, 'KJ') },
      { id: 13, label: '待整理区', type: 'area', usageRate: 10, children: [] }
    ]
  },
  {
    id: 2,
    label: '二号声像库房',
    type: 'warehouse',
    usageRate: 30,
    bgImage: '/images/dangan/fw658.jpg',
    env: { temp: 20.0, humidity: 40 },
    children: [
      { id: 21, label: '底片存放区', type: 'area', usageRate: 35, children: generateShelves(4, 'DP') },
      { id: 22, label: '光盘磁带区', type: 'area', usageRate: 25, children: generateShelves(4, 'GP') }
    ]
  },
  {
    id: 3,
    label: '三号实物库房',
    type: 'warehouse',
    usageRate: 12,
    bgImage: '/images/dangan/fw6587.jpg',
    env: { temp: 22.0, humidity: 45 },
    children: []
  }
]);

// --- Forms ---
const commonForm = reactive({ name: '', description: '', type: '', temp: 24, humidity: 45 });
const shelfForm = reactive({ name: '', columns: 2, sections: 3, layers: 6, cells: 10 });

const inboundForm = reactive({ code: '', title: '', operator: '管理员', remark: '' });

const borrowForm = reactive({ borrower: '', deadline: '' });

// --- Computed ---
const currentSelectedCellLocation = computed(() => {
  if (!currentSelectedCell.value) return '';
  return `${currentShelf.value.label} / ${activeTab.value}面 / 层${currentSelectedCell.value.id.split('-')[2]} / 格${currentSelectedCell.value.position}`;
});

const addItemButtonText = computed(() => {
   if (currentLevel.value === 'warehouse') return '新建库房';
   if (currentLevel.value === 'area') return '新建区域';
   return '添加密集架';
});

const customColors = [
  { color: '#67C23A', percentage: 40 },
  { color: '#E6A23C', percentage: 70 },
  { color: '#F56C6C', percentage: 90 },
];

// --- Helpers ---
function generateShelves(count, prefix) {
   return Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i + Math.random(),
      label: `${prefix}-${String(i+1).padStart(2,'0')}号柜`,
      type: 'shelf',
      totalCells: 360,
      usageRate: Math.floor(Math.random() * 90),
      config: { columns: 2, sections: 3, layers: 6, cells: 10 }
   }));
}

// Log Recorder
function addLog(type, action, detail, operator = '管理员') {
  operationLogs.value.unshift({
    time: dayjs().format('YYYY-MM-DD HH:mm'),
    type,
    action,
    detail,
    operator
  });
}

// --- Navigation Methods ---
const resetView = () => {
  currentLevel.value = 'warehouse';
  currentWarehouse.value = null;
  currentArea.value = null;
};

const enterWarehouse = (wh) => {
  currentWarehouse.value = wh;
  currentLevel.value = 'area';
};

const navigateToWarehouse = (wh) => {
  currentWarehouse.value = wh;
  currentArea.value = null;
  currentLevel.value = 'area';
};

const enterArea = (area) => {
  currentArea.value = area;
  currentLevel.value = 'shelf_list';
};

// --- Operations Logic ---

// 1. Search Logic
const handleSearch = () => {
  if (!searchQuery.value) return;
  
  // Mock search: Assume we found it in the first shelf of the first area of the first warehouse
  // In real app, query backend or local traverse
  ElMessage.info('正在定位档案...');
  
  setTimeout(() => {
    // Simulate finding logic
    const wh = warehouseData.value[0];
    const area = wh.children[0];
    const shelf = area.children[0];
    
    // Auto Navigate
    currentWarehouse.value = wh;
    currentArea.value = area;
    currentLevel.value = 'shelf_list';
    
    // Open Shelf
    openShelfDetail(shelf);
    
    // Highlight a cell (Simulate finding cell-0 at col 0, sec 1, layer 1)
    if (currentShelfMockData.value) {
       const targetCol = currentShelfMockData.value.columns[0];
       activeTab.value = targetCol.id; // Switch tab
       
       // Force a cell to be the result
       const targetSec = targetCol.sections[0];
       const targetLayer = targetSec.layers[2]; // Layer 4
       const targetC = targetLayer.cells[4]; // Cell 5
       
       // Mock it as occupied by search result
       if (targetC.status === 'empty') {
         targetC.status = 'occupied';
         targetC.archiveCode = searchQuery.value;
         targetC.archiveTitle = '搜索匹配档案';
       }
       
       highlightedCellId.value = targetC.id;
       targetC.isHighlighted = true;
       
       ElNotification({
         title: '定位成功',
         message: `已定位到：${wh.label} > ${area.label} > ${shelf.label}`,
         type: 'success'
       });
    }
  }, 800);
};

// 2. Cell Interaction
const handleCellInteraction = (cell) => {
  currentSelectedCell.value = cell;
  // Auto-focus logic for bottom panel
  if (cell.status === 'empty') {
    // Reset inbound form
    inboundForm.code = `ARC-${dayjs().format('MMDD')}-${Math.floor(Math.random()*1000)}`;
    inboundForm.title = '';
  }
};

const closeBottomPanel = () => {
  currentSelectedCell.value = null;
  highlightedCellId.value = null; // Also clear highlight
};

// 3. Inbound Submit
const submitInbound = () => {
  if (!inboundForm.title) {
    ElMessage.warning('请输入题名');
    return;
  }
  
  // Update Cell State
  currentSelectedCell.value.status = 'occupied';
  currentSelectedCell.value.archiveCode = inboundForm.code;
  currentSelectedCell.value.archiveTitle = inboundForm.title;
  
  addLog('primary', '入库上架', `档案 [${inboundForm.code}] 入库成功`, inboundForm.operator);
  
  // Keep panel open to show result, or close it? Let's keep it to show Detail Mode
  // But we need to force update if reactive issue
  ElMessage.success('入库成功');
};

// 4. Outbound / Inventory / Borrow
const handleInventory = () => {
  addLog('success', '盘点', `档案 [${currentSelectedCell.value.archiveCode}] 盘点确认正常`);
  ElMessage.success('盘点已确认');
};

const handleOutbound = () => {
  // Confirm
  const code = currentSelectedCell.value.archiveCode;
  currentSelectedCell.value.status = 'empty';
  currentSelectedCell.value.archiveCode = '';
  currentSelectedCell.value.archiveTitle = '';
  currentSelectedCell.value.borrower = null;
  
  addLog('danger', '永久出库', `档案 [${code}] 已移出库房`);
  
  currentSelectedCell.value = null; // Close panel as it's empty now (or switch to inbound mode)
  ElMessage.success('已出库');
};

const openBorrowConfig = () => {
  borrowForm.borrower = '';
  borrowForm.deadline = '';
  borrowDialogVisible.value = true;
};

const submitBorrow = () => {
  if (!borrowForm.borrower) return ElMessage.warning('填写借阅人');
  
  currentSelectedCell.value.status = 'borrowed';
  currentSelectedCell.value.borrower = borrowForm.borrower;
  currentSelectedCell.value.deadline = borrowForm.deadline ? dayjs(borrowForm.deadline).format('YYYY-MM-DD') : '';
  
  addLog('warning', '借阅登记', `档案 [${currentSelectedCell.value.archiveCode}] 被 ${borrowForm.borrower} 借出`);
  
  borrowDialogVisible.value = false;
  ElMessage.success('借阅登记成功');
};

const handleReturn = () => {
  currentSelectedCell.value.status = 'occupied';
  const borrower = currentSelectedCell.value.borrower;
  currentSelectedCell.value.borrower = null;
  currentSelectedCell.value.deadline = null;
  
  addLog('success', '归还', `档案 [${currentSelectedCell.value.archiveCode}] 由 ${borrower} 归还`);
  
  ElMessage.success('归还成功');
};

const openDigitalPreview = () => {
   previewDialogVisible.value = true;
};

// --- Shelf Management Logic ---
const openShelfDetail = (shelf) => {
  currentShelf.value = shelf;
  
  // Check Cache
  if (shelfDataCache.has(shelf.id)) {
    currentShelfMockData.value = shelfDataCache.get(shelf.id);
  } else {
    // Generate new and cache
    const newData = generateMockShelfDetail(shelf.config);
    shelfDataCache.set(shelf.id, newData);
    currentShelfMockData.value = newData;
  }
  
  // Reset select
  currentSelectedCell.value = null;
  highlightedCellId.value = null;
  if (currentShelfMockData.value.columns.length > 0) {
    activeTab.value = currentShelfMockData.value.columns[0].id; // Default first tab
  }
  
  drawerVisible.value = true;
};

function generateMockShelfDetail(config) {
   const cols = [];
   const colNames = ['A面', 'B面', 'C面', 'D面'];
   for (let c = 0; c < (config?.columns || 2); c++) {
      const sects = [];
      for (let s = 1; s <= (config?.sections || 3); s++) {
         const lays = [];
         for (let l = (config?.layers || 6); l >= 1; l--) {
            const cls = [];
            for (let p = 1; p <= (config?.cells || 10); p++) {
               // Initial random state
               const isOc = Math.random() > 0.7;
               cls.push({
                 id: `${c}-${s}-${l}-${p}`,
                 position: p,
                 status: isOc ? 'occupied' : 'empty', // 'empty' | 'occupied' | 'borrowed'
                 archiveCode: isOc ? `ARC-${Math.floor(Math.random()*10000)}` : '',
                 archiveTitle: isOc ? '数字化建设实施方案' : '',
                 hasDigital: isOc && Math.random() > 0.5, // 50% chance to have digital copy
                 isHighlighted: false
               });
            }
            lays.push({ id: `l-${l}`, number: l, cells: cls });
         }
         sects.push({ id: `s-${s}`, name: s, layers: lays });
      }
      cols.push({ id: `c-${c}`, name: colNames[c] || `面${c+1}`, sections: sects });
   }
   return { columns: cols };
}

// --- Common UI Logic ---
const handleAddItem = () => {
   if (currentLevel.value === 'shelf_list') {
     openAddShelfDialog();
   } else {
     openAddDialog(currentLevel.value === 'warehouse' ? 'warehouse' : 'area');
   }
};

const openAddDialog = (type) => {
   dialogTitle.value = type === 'warehouse' ? '新建库房' : '新建区域';
   commonForm.type = type;
   commonForm.name = '';
   commonForm.description = '';
   commonDialogVisible.value = true;
};

const openAddShelfDialog = () => {
  if (!currentArea.value) return;
  shelfForm.name = `${currentArea.value.label.slice(0,2)}-${String((currentArea.value.children?.length || 0) + 1).padStart(2, '0')}号柜`;
  shelfDialogVisible.value = true;
};

const submitCommonForm = () => {
  if (!commonForm.name) return ElMessage.warning('请输入名称');
  
  const newItem = {
    id: Date.now(),
    label: commonForm.name,
    type: commonForm.type,
    usageRate: 0,
    children: []
  };
  
  if (commonForm.type === 'warehouse') {
    newItem.env = { temp: commonForm.temp, humidity: commonForm.humidity };
    warehouseData.value.push(newItem);
  } else {
    if (!currentWarehouse.value.children) currentWarehouse.value.children = [];
    currentWarehouse.value.children.push(newItem);
  }
  
  commonDialogVisible.value = false;
  ElMessage.success('创建成功');
};

const submitShelfForm = () => {
  if (!shelfForm.name) return;
  const total = shelfForm.columns * shelfForm.sections * shelfForm.layers * shelfForm.cells;
  const newShelf = {
    id: Date.now(),
    label: shelfForm.name,
    type: 'shelf',
    totalCells: total,
    usageRate: 0,
    config: { ...shelfForm }
  };
  
  if (!currentArea.value.children) currentArea.value.children = [];
  currentArea.value.children.push(newShelf);
  shelfDialogVisible.value = false;
  ElMessage.success('密集架已添加');
};

const getEnvStatus = (wh) => {
  if (wh.env.temp > 28 || wh.env.humidity > 70) 
    return { text: '异常', class: 'status-error' };
  return { text: '正常', class: 'status-normal' };
};

const calculateArchivesCount = (area) => {
  return (area.children?.length || 0) * 150; 
};

const getShelfStatusClass = (shelf) => {
  if (shelf.usageRate > 90) return 'status-full';
  if (shelf.usageRate > 50) return 'status-medium';
  return 'status-free';
};

onMounted(() => {
  if (route.query.archiveNo) {
    searchQuery.value = route.query.archiveNo;
    setTimeout(() => {
      handleSearch();
    }, 500);
  }
});

</script>

<style scoped>
.smart-archive-room-visual {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding: 0;
  overflow: hidden;
}

/* 顶部导航 */
.visual-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #606266;
  gap: 8px;
}

.nav-icon {
  margin-right: 4px;
  font-size: 20px;
  color: #409EFF;
}

.nav-item {
  cursor: pointer;
  transition: color 0.2s;
}
.nav-item:hover { color: #409EFF; }
.nav-item.active {
  font-weight: 600;
  color: #303133;
  cursor: default;
}
.separator { margin: 0 4px; color: #909399; }

.header-right-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-box {
  width: 240px;
}

/* 主内容区 */
.visual-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  position: relative;
}

.view-container {
  height: 100%;
}

/* 库房卡片样式 */
.warehouse-card {
  background: #fff;
  border-radius: 12px;
  height: 220px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 24px;
  background-size: cover;
  background-position: center;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 1;
}

.warehouse-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  border-color: #409EFF;
}

.warehouse-card:hover .card-overlay {
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%);
}

.card-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.status-normal { background: rgba(225, 243, 216, 0.9); color: #67C23A; }
.status-error { background: rgba(253, 226, 226, 0.9); color: #F56C6C; }

/* 移除原有的 icon-section 样式 */

.info-section {
  width: 100%;
  text-align: center;
  z-index: 2;
  padding: 0 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  margin-top: 40px; /* Push info down slightly */
}
.info-section h3 { 
  margin: 0 0 12px; 
  color: #fff; 
  font-size: 20px;
  letter-spacing: 1px;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
  background: rgba(255,255,255,0.15);
  padding: 8px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}
.stat-item {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}
.stat-item .label { color: rgba(255,255,255,0.8); margin-bottom: 2px; }
.stat-item .value { font-weight: bold; color: #fff; }

.warehouse-progress :deep(.el-progress__text) {
  color: #fff !important;
}

.hover-tip {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(64, 158, 255, 0.9);
  color: #fff;
  text-align: center;
  padding: 8px 0;
  transform: translateY(100%);
  transition: transform 0.3s;
  font-size: 14px;
  z-index: 3;
}
.warehouse-card:hover .hover-tip {
  transform: translateY(0);
}

/* 区域分布图样式 */
.floor-plan {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  min-height: 500px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.floor-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 30px;
  color: #303133;
}

.zones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.zone-block {
  border: 2px dashed #dcdfe6;
  background: #fcfcfc;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.zone-block:hover {
  border-color: #409EFF;
  background: #ecf5ff;
}
.zone-block.high-density {
  background: #fef0f0;
  border-color: #fab6b6;
}
.zone-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #303133;
}
.zone-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.zone-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.zone-metric span { font-size: 12px; color: #909399; }
.zone-metric strong { font-size: 18px; color: #606266; }
.zone-footer {
  font-size: 12px;
  color: #67C23A;
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-dot {
  width: 8px;
  height: 8px;
  background: #67C23A;
  border-radius: 50%;
}

.add-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  border: 2px dashed #909399;
  opacity: 0.5;
}
.add-zone:hover { opacity: 1; color: #409EFF; border-color: #409EFF; }

/* 密集架排布视图样式 */
.shelf-layout-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: 100%;
}
.layout-controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}
.legend {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #606266;
}
.dot { width: 10px; height: 10px; display: inline-block; border-radius: 2px; margin-right: 4px; }
.dot.free { background: #f0f9eb; border:1px solid #b3e19d; }
.dot.medium { background: #fdf6ec; border:1px solid #f3d19e; }
.dot.full { background: #fef0f0; border:1px solid #fab6b6; }
.dot.borrowed { background: #fdf6ec; border:1px solid #e6a23c; }

.shelves-rows {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: flex-start;
}

.shelf-unit {
  width: 140px;
  height: 200px;
  perspective: 600px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}
.shelf-unit:hover {
  transform: scale(1.05);
  z-index: 10;
}

.shelf-face {
  width: 100%;
  height: 100%;
  background: #e6e8eb;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  position: relative;
  box-shadow: inset 5px 0 10px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background: linear-gradient(90deg, #f0f2f5 0%, #dcdfe6 20%, #f0f2f5 40%, #f0f2f5 100%);
}

.shelf-unit.status-free .shelf-face { border-bottom: 4px solid #67C23A; }
.shelf-unit.status-medium .shelf-face { border-bottom: 4px solid #E6A23C; }
.shelf-unit.status-full .shelf-face { border-bottom: 4px solid #F56C6C; }

.handle {
  width: 12px;
  height: 60px;
  background: #909399;
  border-radius: 6px;
  margin-top: 40px;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}
.label-plate {
  background: #fff;
  border: 1px solid #909399;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: bold;
  color: #303133;
  margin-top: 10px;
}
.vent-slots {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 10px;
}
.vent-slots span {
  width: 80px;
  height: 4px;
  background: rgba(0,0,0,0.1);
  border-radius: 2px;
}
.shelf-shadow {
  position: absolute;
  bottom: -10px;
  width: 100%;
  height: 10px;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%);
}

.add-shelf {
  border: 2px dashed #dcdfe6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  border-radius: 8px;
}
.add-shelf .shelf-face { display: none; }
.add-shelf:hover { border-color: #409EFF; color: #409EFF; }

/* Bottom Action Panel */
.bottom-action-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #dcdfe6;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  z-index: 100;
  animation: slideUp 0.3s ease-out;
}

.panel-handle {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 24px;
  background: #fff;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #909399;
}
.panel-handle:hover { color: #409EFF; }

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.panel-header h4 { margin: 0; display: flex; align-items: center; gap: 8px; color: #303133; }
.location-tag { color: #909399; font-size: 13px; background: #f5f7fa; padding: 2px 8px; border-radius: 4px; }

.inbound-form-inline {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* Detail Mode Layout */
.detail-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.detail-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.detail-icon {
  width: 64px;
  height: 64px;
  background: #f5f7fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-info { display: flex; flex-direction: column; gap: 4px; }
.main-info { display: flex; align-items: center; gap: 10px; }
.main-info .code { font-size: 18px; font-weight: bold; color: #303133; }
.sub-info { color: #606266; font-size: 14px; }
.borrow-info { color: #E6A23C; font-size: 12px; margin-top: 2px; }

.detail-actions {
  display: flex;
  gap: 12px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* 拟真详情 Drawer Internal */
.realistic-shelf-container {
  padding: 20px 20px 140px 20px; /* Add bottom padding for panel space */
  height: 100%;
  overflow-y: auto;
}
.shelf-info-bar {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}
.info-item {
  display: flex;
  flex-direction: column;
}
.info-item .label { font-size: 12px; color: #909399; }
.info-item .val { font-size: 16px; font-weight: 600; color: #303133; }

.face-grid {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0;
}

.section-column {
  border: 10px solid #d4d7de; /* Cabinet frame */
  background: #f0f2f5;
  border-radius: 4px;
}

.section-header-metal {
  background: linear-gradient(180deg, #d4d7de 0%, #b8bcc4 100%);
  color: #606266;
  text-align: center;
  font-size: 12px;
  padding: 4px;
  font-weight: bold;
}

.layers-stack {
  display: flex;
  flex-direction: column;
  border-top: 2px solid #909399; /* Top shadow */
}

.layer-row {
  display: flex;
  border-bottom: 8px solid #c0c4cc; /* Shelf thickness */
  height: 50px;
  align-items: center;
  background: #e4e7ed; /* Inner shelf color */
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.layer-meta {
  width: 30px;
  text-align: center;
  font-size: 10px;
  color: #909399;
  border-right: 1px solid #dcdfe6;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cells-wrapper {
  flex: 1;
  display: flex;
  padding: 0 4px;
  gap: 2px;
  height: 80%;
}

/* 档案盒拟真 */
.archive-box {
  flex: 1;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.1s;
}

.archive-box.has-file {
  background: #409EFF; /* File box color */
  border-left: 1px solid rgba(255,255,255,0.2);
  box-shadow: 1px 1px 2px rgba(0,0,0,0.2);
}
.archive-box.is-borrowed {
  background: #E6A23C;
}

.archive-box.has-file:hover, .archive-box.is-borrowed:hover {
  transform: scaleY(1.1);
  margin-top: -2px;
  z-index: 2;
}

/* 电子档案标识 */
.archive-box.has-digital::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  background: #67C23A;
  border-radius: 50%;
  box-shadow: 0 0 4px rgba(103, 194, 58, 0.5);
}

/* 搜索高亮效果 */
.archive-box.is-highlighted {
  box-shadow: 0 0 0 2px #F56C6C;
  z-index: 5;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7); }
  70% { box-shadow: 0 0 0 4px rgba(245, 108, 108, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0); }
}

.spine {
  width: 100%;
  text-align: center;
}
.spine-text {
  writing-mode: vertical-lr;
  font-size: 8px;
  color: #fff;
  opacity: 0.8;
  height: 20px;
}

.empty-mark {
  color: #c0c4cc;
  font-size: 10px;
  opacity: 0.5;
}

.config-grid .el-form-item {
  margin-bottom: 12px;
}
.preview-bar {
  background: #fdf6ec;
  color: #e6a23c;
  padding: 8px;
  text-align: center;
  border-radius: 4px;
  font-size: 12px;
}

.log-card {
  margin-bottom: 10px;
}
.log-card h4 { margin: 0 0 5px; color: #303133; }
.log-card p { margin: 0; font-size: 13px; color: #606266; }
.log-footer { margin-top: 8px !important; font-size: 12px !important; color: #909399 !important; text-align: right; }

.action-buttons-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.action-buttons-grid .el-button {
  margin-left: 0 !important;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
/* Preview Dialog Styles */
.preview-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}
.preview-header {
  border-bottom: 1px solid #EBEEF5;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.preview-header h2 { margin: 0 0 10px; font-size: 20px; color: #303133; }
.meta-row { display: flex; gap: 15px; align-items: center; color: #909399; font-size: 13px; }

.preview-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  border: 1px solid #DCDFE6;
}
.doc-outline {
  width: 200px;
  background: #F5F7FA;
  border-right: 1px solid #DCDFE6;
  padding: 15px;
  overflow-y: auto;
}
.doc-outline h4 { margin: 0 0 10px; color: #606266; }
.doc-outline ul { list-style: none; padding: 0; margin: 0; font-size: 13px; color: #606266; }
.doc-outline li { padding: 6px 0; cursor: pointer; }
.doc-outline li.active { color: #409EFF; font-weight: bold; }

.doc-content {
  flex: 1;
  background: #909399; /* Grey background for reader */
  padding: 20px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}
.mock-page {
  width: 100%;
  max-width: 600px;
  background: #fff;
  min-height: 800px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
  color: #303133;
}
.mock-page h3 { text-align: center; margin-bottom: 30px; }
.mock-page p { line-height: 1.8; margin-bottom: 15px; text-indent: 2em; }
.placeholder-text { color: #C0C4CC; font-style: italic; }
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 40px;
  color: rgba(0,0,0,0.05);
  pointer-events: none;
  white-space: nowrap;
}
</style>
