<template>
  <div class="app-purchase">
    <div class="section-header">
      <h3>应用采购</h3>
      <p>管理应用采购订单和授权</p>
    </div>

    <!-- 采购统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ purchaseStats.totalOrders }}</div>
            <div class="stat-label">总订单数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ purchaseStats.totalAmount }}</div>
            <div class="stat-label">总金额(元)</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ purchaseStats.activeApps }}</div>
            <div class="stat-label">已授权应用</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ purchaseStats.pendingOrders }}</div>
            <div class="stat-label">待处理订单</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 采购订单列表 -->
    <el-card class="orders-card">
      <template #header>
        <div class="card-header">
          <span>采购订单</span>
          <el-button type="primary" @click="createOrder">
            <el-icon><Plus /></el-icon>
            创建订单
          </el-button>
        </div>
      </template>

      <el-table :data="orders" stripe>
        <el-table-column prop="orderId" label="订单号" width="150" />
        <el-table-column prop="appName" label="应用名称" width="200" />
        <el-table-column prop="licenseType" label="授权类型" width="120">
          <template #default="scope">
            <el-tag :type="getLicenseType(scope.row.licenseType)">
              {{ scope.row.licenseType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userCount" label="用户数" width="100" />
        <el-table-column prop="price" label="价格(元)" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" label="下单日期" width="120" />
        <el-table-column prop="expireDate" label="到期日期" width="120" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="viewOrder(scope.row)">查看</el-button>
            <el-button size="small" type="success" @click="renewOrder(scope.row)">续费</el-button>
            <el-button size="small" type="danger" @click="cancelOrder(scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 创建订单对话框 -->
    <el-dialog
      v-model="orderDialogVisible"
      title="创建采购订单"
      width="600px"
    >
      <el-form :model="orderForm" :rules="orderRules" ref="orderFormRef" label-width="100px">
        <el-form-item label="应用名称" prop="appName">
          <el-select v-model="orderForm.appName" placeholder="请选择应用">
            <el-option label="在线考试系统" value="在线考试系统" />
            <el-option label="智能排课系统" value="智能排课系统" />
            <el-option label="在线学习平台" value="在线学习平台" />
            <el-option label="数据分析工具" value="数据分析工具" />
          </el-select>
        </el-form-item>
        <el-form-item label="授权类型" prop="licenseType">
          <el-radio-group v-model="orderForm.licenseType">
            <el-radio label="年度授权">年度授权</el-radio>
            <el-radio label="永久授权">永久授权</el-radio>
            <el-radio label="按需付费">按需付费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户数量" prop="userCount">
          <el-input-number v-model="orderForm.userCount" :min="1" :max="10000" />
        </el-form-item>
        <el-form-item label="授权期限" prop="duration">
          <el-input-number v-model="orderForm.duration" :min="1" :max="60" />
          <span style="margin-left: 10px;">个月</span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="orderForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="orderDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitOrder">创建订单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  name: 'AppPurchase',
  setup() {
    const orderDialogVisible = ref(false)
    const orderFormRef = ref()

    const purchaseStats = ref({
      totalOrders: 15,
      totalAmount: 125800,
      activeApps: 8,
      pendingOrders: 2
    })

    const orderForm = reactive({
      appName: '',
      licenseType: '',
      userCount: 1,
      duration: 12,
      remark: ''
    })

    const orderRules = {
      appName: [
        { required: true, message: '请选择应用', trigger: 'change' }
      ],
      licenseType: [
        { required: true, message: '请选择授权类型', trigger: 'change' }
      ],
      userCount: [
        { required: true, message: '请输入用户数量', trigger: 'blur' }
      ],
      duration: [
        { required: true, message: '请输入授权期限', trigger: 'blur' }
      ]
    }

    const orders = ref([
      {
        orderId: 'ORD202401001',
        appName: '在线考试系统',
        licenseType: '年度授权',
        userCount: 100,
        price: 12000,
        status: '已授权',
        orderDate: '2024-01-01',
        expireDate: '2025-01-01'
      },
      {
        orderId: 'ORD202401002',
        appName: '智能排课系统',
        licenseType: '永久授权',
        userCount: 50,
        price: 50000,
        status: '已授权',
        orderDate: '2024-01-05',
        expireDate: '永久'
      },
      {
        orderId: 'ORD202401003',
        appName: '在线学习平台',
        licenseType: '年度授权',
        userCount: 200,
        price: 24000,
        status: '待处理',
        orderDate: '2024-01-10',
        expireDate: '2025-01-10'
      },
      {
        orderId: 'ORD202401004',
        appName: '数据分析工具',
        licenseType: '按需付费',
        userCount: 30,
        price: 3000,
        status: '已授权',
        orderDate: '2024-01-12',
        expireDate: '2024-02-12'
      }
    ])

    const getLicenseType = (type) => {
      const types = {
        '年度授权': 'primary',
        '永久授权': 'success',
        '按需付费': 'warning'
      }
      return types[type] || 'info'
    }

    const getStatusType = (status) => {
      const types = {
        '已授权': 'success',
        '待处理': 'warning',
        '已取消': 'danger',
        '已过期': 'info'
      }
      return types[status] || 'info'
    }

    const createOrder = () => {
      orderDialogVisible.value = true
    }

    const viewOrder = (row) => {
      ElMessage.info(`查看订单 ${row.orderId} 详情`)
    }

    const renewOrder = (row) => {
      ElMessage.success(`正在为 ${row.appName} 续费...`)
    }

    const cancelOrder = (row) => {
      ElMessageBox.confirm(
        `确定要取消订单 "${row.orderId}" 吗？`,
        '确认取消',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const index = orders.value.findIndex(item => item.orderId === row.orderId)
        if (index > -1) {
          orders.value[index].status = '已取消'
          ElMessage.success('订单已取消')
        }
      })
    }

    const submitOrder = () => {
      orderFormRef.value.validate((valid) => {
        if (valid) {
          const newOrder = {
            orderId: `ORD${Date.now()}`,
            ...orderForm,
            price: orderForm.userCount * 120, // 模拟价格计算
            status: '待处理',
            orderDate: new Date().toISOString().split('T')[0],
            expireDate: new Date(Date.now() + orderForm.duration * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
          orders.value.unshift(newOrder)
          ElMessage.success('订单创建成功')
          orderDialogVisible.value = false
          resetOrderForm()
        }
      })
    }

    const resetOrderForm = () => {
      Object.assign(orderForm, {
        appName: '',
        licenseType: '',
        userCount: 1,
        duration: 12,
        remark: ''
      })
    }

    return {
      orderDialogVisible,
      orderFormRef,
      purchaseStats,
      orderForm,
      orderRules,
      orders,
      getLicenseType,
      getStatusType,
      createOrder,
      viewOrder,
      renewOrder,
      cancelOrder,
      submitOrder
    }
  }
}
</script>

<style scoped>
.app-purchase {
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

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 20px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.orders-card {
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
</style>
