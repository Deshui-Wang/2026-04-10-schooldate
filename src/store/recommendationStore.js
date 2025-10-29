import { ref } from 'vue'

// 全局共享的“智能推荐”候选人列表（跨页面联动）
// 结构要求：{ id, name, department, title, score, avatar }
const recommendedCandidates = ref([])

function findIndexById(id) {
  return recommendedCandidates.value.findIndex(c => c.id === id)
}

export function setRecommendedCandidates(candidates) {
  if (!Array.isArray(candidates)) return
  // 去重后覆盖
  const seen = new Set()
  recommendedCandidates.value = candidates.filter(c => {
    const key = c.id ?? c.name
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function addRecommendedCandidate(candidate) {
  if (!candidate) return
  const id = candidate.id ?? candidate.name
  if (findIndexById(id) === -1) {
    recommendedCandidates.value.push(candidate)
  }
}

export function clearRecommendedCandidates() {
  recommendedCandidates.value = []
}

export function useRecommendedCandidates() {
  return recommendedCandidates
}


