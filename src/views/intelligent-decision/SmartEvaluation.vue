<template>
  <div class="smart-evaluation-container">
    <iframe 
      src="https://eval.cailian.net/" 
      frameborder="0" 
      class="evaluation-frame"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: 'SmartEvaluation'
}
</script>

<style scoped>
.smart-evaluation-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.evaluation-frame {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>
