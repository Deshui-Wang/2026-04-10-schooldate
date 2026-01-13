<template>
  <div class="portal-config-panel">
    <el-transfer
      v-model="selectedIds"
      :data="data"
      :titles="['可用列表', '已选列表']"
      :props="{
        key: 'id',
        label: itemKey
      }"
      filterable
      filter-placeholder="请输入关键词搜索"
      style="width: 100%; height: 100%;"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  allItems: {
    type: Array,
    required: true
  },
  itemKey: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:items'])

const data = computed(() => {
  return props.allItems.map(item => ({
    id: item.id,
    [props.itemKey]: item[props.itemKey]
  }))
})

const selectedIds = ref(props.items.map(item => item.id))

watch(selectedIds, (newVal) => {
  const newItems = props.allItems.filter(item => newVal.includes(item.id))
  emit('update:items', newItems)
})

watch(() => props.items, (newItems) => {
    selectedIds.value = newItems.map(item => item.id)
})

</script>

<style scoped>
.portal-config-panel {
  height: calc(100vh - 200px);
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-transfer) {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-transfer-panel) {
  width: 40%;
  height: 100%;
}

:deep(.el-transfer-panel__body) {
    height: calc(100% - 40px);
}

:deep(.el-transfer-panel__list) {
    height: 100%;
}
</style>

