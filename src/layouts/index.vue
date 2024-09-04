<template>
  <div>
    <el-container class="app-container">
      <el-header><Header /></el-header>
      <el-container style="overflow: auto">
        <el-aside><Aside /></el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>Copyright © 2022 后台管理系统</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import Header from "./components/Header.vue";
import Aside from "./components/Aside.vue";
</script>

<style scoped>
.app-container {
  position: absolute;
  height: 100%;
  top: 0px;
  left: 0px;
  width: 100%;
  background: #f2f3f5;
}

.el-aside {
  background: white;
  width: auto !important;
}

.el-footer {
  color: #cccccc;
  text-align: center;
  line-height: 60px;
}

.el-footer:hover {
  color: #2661ef;
}

.el-menu-item.is-active {
  color: #fff !important;
  font-size: 15px;
  font-weight: bold;
  background-color: #2661ef !important;
  border-radius: 2px;
  height: 50px;
  line-height: 50px;
  box-sizing: border-box;
  margin: 2px 5px 0px 2px;
}
</style>