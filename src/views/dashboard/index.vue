<template>
  <div class="dashboard-container">
    <div class="dashboard-text">welcome: {{ name }}</div>
    <!--  -->
    <el-image
      style="width: 1150px; height: 650px"
      src="https://obsidiantuchuanggavin.oss-cn-beijing.aliyuncs.com/img/Tom-Hanks-900x500.jpg"
      :fit="fit"></el-image>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
