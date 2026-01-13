<template>
  <div class="classification-tree-wrapper">
    <div class="tree-toolbar">
      <el-input
        v-model="filterText"
        placeholder="搜索分类"
        style="margin-bottom: 10px"
        clearable
        size="small"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" size="small" @click="$emit('add-category')">新增分类</el-button>
    </div>
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="{ children: 'children', label: 'label' }"
      :filter-node-method="filterNode"
      default-expand-all
      draggable
      @node-click="handleNodeClick"
      @node-drop="handleNodeDrop"
    />
    <div class="tree-actions">
        <el-button-group>
            <el-button size="small" @click="handleBatchMove">批量移动</el-button>
            <el-button size="small" @click="handleMerge">合并</el-button>
        </el-button-group>
        <el-button-group>
            <el-button size="small" @click="handleImport">导入</el-button>
            <el-button size="small" @click="handleExport">导出</el-button>
        </el-button-group>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const props = defineProps({
  treeData: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['node-click', 'add-category'])

const filterText = ref('')
const treeRef = ref(null)

watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (data) => {
  emit('node-click', data)
}

const handleNodeDrop = (draggingNode, dropNode, dropType, ev) => {
  console.log('tree drop: ', draggingNode.label, dropNode.label, dropType)
  ElMessage.success(`节点 ${draggingNode.label} 已移动`)
}

const handleBatchMove = () => {
    ElMessage.info('触发批量移动操作');
}

const handleMerge = () => {
    ElMessage.info('触发合并操作');
}

const handleImport = () => {
    ElMessage.info('触发导入操作');
}

const handleExport = () => {
    ElMessage.info('触发导出操作');
}

</script>

<style scoped>
.classification-tree-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tree-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.el-tree {
  flex: 1;
  overflow-y: auto;
}

.tree-actions {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e4e7ed;
    display: flex;
    justify-content: space-between;
}
</style>

