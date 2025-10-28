<template>
  <div class="asset-management">
    <div class="section-header">
      <h3>资产管理</h3>
      <p>管理学校资产和设备以及电子类办公用品</p>
    </div>

    <!-- 筛选区域 -->
    <el-card class="filter-card">      
      <el-form :model="filterForm" inline>
        <el-form-item label="资产类型">
          <el-select v-model="filterForm.assetType" placeholder="请选择资产类型" clearable>
            <el-option
              v-for="type in assetTypeOptions"
              :key="type"
              :label="type"
              :value="type"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="使用部门">
          <el-select v-model="filterForm.department" placeholder="请选择使用部门" clearable>
            <el-option
              v-for="dept in departmentOptions"
              :key="dept"
              :label="dept"
              :value="dept"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="资产状态">
          <el-select v-model="filterForm.status" placeholder="请选择资产状态" clearable>
            <el-option label="正常使用" value="正常使用" />
            <el-option label="维修中" value="维修中" />
            <el-option label="报废" value="报废" />
            <el-option label="闲置" value="闲置" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="资产名称">
          <el-input
            v-model="filterForm.assetName"
            placeholder="请输入资产名称"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="责任人">
          <el-input
            v-model="filterForm.responsiblePerson"
            placeholder="请输入责任人姓名"
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="applyFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 资产列表 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>资产列表</span>
          <el-button type="primary" @click="addAsset">
            <el-icon><Plus /></el-icon>
            添加资产
          </el-button>
        </div>
      </template>

      <el-table :data="filteredAssets" stripe>
        <el-table-column prop="assetCode" label="资产编号" min-width="120" />
        <el-table-column prop="assetName" label="资产名称" min-width="180" />
        <el-table-column prop="assetType" label="资产类型" min-width="120" />
        <el-table-column prop="brand" label="品牌型号" min-width="150" />
        <el-table-column prop="purchaseDate" label="采购日期" min-width="120" />
        <el-table-column prop="purchasePrice" label="采购价格" min-width="100">
          <template #default="scope">
            <span>¥{{ scope.row.purchasePrice.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="使用部门" min-width="120" />
        <el-table-column prop="responsiblePerson" label="责任人" min-width="100" />
        <el-table-column prop="location" label="存放位置" min-width="120" />
        <el-table-column prop="status" label="状态" min-width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right" align="left">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button size="small" @click="viewAsset(scope.row)">查看</el-button>
              <el-button size="small" @click="editAsset(scope.row)">编辑</el-button>
              <el-button size="small" type="warning" @click="maintainAsset(scope.row)">维修</el-button>
              <el-button size="small" type="danger" @click="deleteAsset(scope.row)">删除</el-button>
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
  name: 'AssetManagement',
  setup() {
    const assets = ref([
      {
        id: 1,
        assetCode: 'PC-001',
        assetName: '联想ThinkPad E15',
        assetType: '笔记本电脑',
        brand: '联想ThinkPad E15',
        purchaseDate: '2023-03-15',
        purchasePrice: 5999,
        department: '计算机学院',
        responsiblePerson: '张明华',
        location: 'A101办公室',
        status: '正常使用'
      },
      {
        id: 2,
        assetCode: 'PC-002',
        assetName: '戴尔OptiPlex 7090',
        assetType: '台式电脑',
        brand: '戴尔OptiPlex 7090',
        purchaseDate: '2023-02-20',
        purchasePrice: 8999,
        department: '计算机学院',
        responsiblePerson: '李雅琴',
        location: 'A102实验室',
        status: '正常使用'
      },
      {
        id: 3,
        assetCode: 'PRJ-001',
        assetName: '爱普生CB-X06',
        assetType: '投影仪',
        brand: '爱普生CB-X06',
        purchaseDate: '2023-01-10',
        purchasePrice: 2999,
        department: '教务处',
        responsiblePerson: '王建国',
        location: 'B201教室',
        status: '正常使用'
      },
      {
        id: 4,
        assetCode: 'PRN-001',
        assetName: '惠普LaserJet Pro M404dn',
        assetType: '激光打印机',
        brand: '惠普LaserJet Pro M404dn',
        purchaseDate: '2022-12-05',
        purchasePrice: 1299,
        department: '行政办公室',
        responsiblePerson: '赵丽娟',
        location: '行政楼201',
        status: '维修中'
      },
      {
        id: 5,
        assetCode: 'NET-001',
        assetName: '华为S5720-28P-SI',
        assetType: '网络交换机',
        brand: '华为S5720-28P-SI',
        purchaseDate: '2023-04-12',
        purchasePrice: 3999,
        department: '网络中心',
        responsiblePerson: '陈志强',
        location: '网络机房',
        status: '正常使用'
      },
      {
        id: 6,
        assetCode: 'MON-001',
        assetName: '戴尔U2720Q',
        assetType: '显示器',
        brand: '戴尔U2720Q 27寸4K',
        purchaseDate: '2023-03-28',
        purchasePrice: 3299,
        department: '设计学院',
        responsiblePerson: '刘美玲',
        location: 'C301设计室',
        status: '正常使用'
      },
      {
        id: 7,
        assetCode: 'CAM-001',
        assetName: '佳能EOS R6',
        assetType: '数码相机',
        brand: '佳能EOS R6',
        purchaseDate: '2023-05-15',
        purchasePrice: 15999,
        department: '传媒学院',
        responsiblePerson: '孙建华',
        location: 'D201摄影棚',
        status: '正常使用'
      },
      {
        id: 8,
        assetCode: 'TAB-001',
        assetName: 'iPad Pro 12.9',
        assetType: '平板电脑',
        brand: '苹果iPad Pro 12.9',
        purchaseDate: '2023-06-01',
        purchasePrice: 8999,
        department: '艺术学院',
        responsiblePerson: '周晓敏',
        location: 'E301画室',
        status: '正常使用'
      },
      {
        id: 9,
        assetCode: 'AIR-001',
        assetName: '大疆Air 2S',
        assetType: '无人机',
        brand: '大疆Air 2S',
        purchaseDate: '2023-07-10',
        purchasePrice: 6499,
        department: '传媒学院',
        responsiblePerson: '吴志勇',
        location: 'D202器材室',
        status: '正常使用'
      },
      {
        id: 10,
        assetCode: 'SPK-001',
        assetName: 'JBL Charge 4',
        assetType: '蓝牙音箱',
        brand: 'JBL Charge 4',
        purchaseDate: '2023-08-20',
        purchasePrice: 899,
        department: '音乐学院',
        responsiblePerson: '郑丽华',
        location: 'F201音乐室',
        status: '正常使用'
      },
      {
        id: 11,
        assetCode: 'SCN-001',
        assetName: '爱普生V600',
        assetType: '扫描仪',
        brand: '爱普生V600',
        purchaseDate: '2022-11-15',
        purchasePrice: 1999,
        department: '图书馆',
        responsiblePerson: '马文涛',
        location: '图书馆201',
        status: '闲置'
      },
      {
        id: 12,
        assetCode: 'UPS-001',
        assetName: 'APC Smart-UPS 1500VA',
        assetType: 'UPS电源',
        brand: 'APC Smart-UPS 1500VA',
        purchaseDate: '2023-09-05',
        purchasePrice: 2499,
        department: '网络中心',
        responsiblePerson: '林雪梅',
        location: '网络机房',
        status: '正常使用'
      },
      {
        id: 13,
        assetCode: 'ROU-001',
        assetName: '华为AR6120',
        assetType: '路由器',
        brand: '华为AR6120',
        purchaseDate: '2023-10-12',
        purchasePrice: 5999,
        department: '网络中心',
        responsiblePerson: '黄志明',
        location: '网络机房',
        status: '正常使用'
      },
      {
        id: 14,
        assetCode: 'MIC-001',
        assetName: '舒尔SM58',
        assetType: '麦克风',
        brand: '舒尔SM58',
        purchaseDate: '2023-11-08',
        purchasePrice: 899,
        department: '音乐学院',
        responsiblePerson: '徐雅芳',
        location: 'F202录音室',
        status: '正常使用'
      },
      {
        id: 15,
        assetCode: 'PC-003',
        assetName: '苹果MacBook Pro 16',
        assetType: '笔记本电脑',
        brand: '苹果MacBook Pro 16',
        purchaseDate: '2023-12-01',
        purchasePrice: 19999,
        department: '设计学院',
        responsiblePerson: '何建军',
        location: 'C302设计室',
        status: '正常使用'
      }
    ])

    // 筛选表单
    const filterForm = reactive({
      assetType: '',
      department: '',
      status: '',
      assetName: '',
      responsiblePerson: ''
    })

    // 筛选选项
    const assetTypeOptions = ref([
      '笔记本电脑',
      '台式电脑',
      '投影仪',
      '激光打印机',
      '网络交换机',
      '显示器',
      '数码相机',
      '平板电脑',
      '无人机',
      '蓝牙音箱',
      '扫描仪',
      'UPS电源',
      '路由器',
      '麦克风'
    ])
    
    const departmentOptions = ref([
      '计算机学院',
      '教务处',
      '行政办公室',
      '网络中心',
      '设计学院',
      '传媒学院',
      '艺术学院',
      '音乐学院',
      '图书馆'
    ])

    // 筛选后的资产数据
    const filteredAssets = ref([])

    // 应用筛选
    const applyFilter = () => {
      filteredAssets.value = assets.value.filter(asset => {
        return (
          (!filterForm.assetType || asset.assetType === filterForm.assetType) &&
          (!filterForm.department || asset.department === filterForm.department) &&
          (!filterForm.status || asset.status === filterForm.status) &&
          (!filterForm.assetName || asset.assetName.includes(filterForm.assetName)) &&
          (!filterForm.responsiblePerson || asset.responsiblePerson.includes(filterForm.responsiblePerson))
        )
      })
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.assetType = ''
      filterForm.department = ''
      filterForm.status = ''
      filterForm.assetName = ''
      filterForm.responsiblePerson = ''
      filteredAssets.value = assets.value
    }

    // 初始化时显示所有资产
    filteredAssets.value = assets.value

    // 获取状态类型
    const getStatusType = (status) => {
      const statusMap = {
        '正常使用': 'success',
        '维修中': 'warning',
        '报废': 'danger',
        '闲置': 'info'
      }
      return statusMap[status] || 'info'
    }

    const addAsset = () => {
      ElMessage.info('添加资产功能开发中...')
    }

    const viewAsset = (row) => {
      ElMessage.info(`查看资产 ${row.assetName} 详细信息`)
    }

    const editAsset = (row) => {
      ElMessage.info(`编辑资产 ${row.assetName}`)
    }

    const maintainAsset = (row) => {
      ElMessage.info(`维修资产 ${row.assetName}`)
    }

    const deleteAsset = (row) => {
      ElMessageBox.confirm(
        `确定要删除资产 "${row.assetName}" 吗？`,
        '确认删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = assets.value.findIndex(item => item.id === row.id)
        if (index > -1) {
          assets.value.splice(index, 1)
          ElMessage.success('删除成功')
        }
      })
    }

    return {
      assets,
      filteredAssets,
      filterForm,
      assetTypeOptions,
      departmentOptions,
      applyFilter,
      resetFilter,
      getStatusType,
      addAsset,
      viewAsset,
      editAsset,
      maintainAsset,
      deleteAsset
    }
  }
}
</script>

<style scoped>
.asset-management {
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
