<template>
  <div>
    <el-container class="app-container">
      <el-header>
        <Header />
      </el-header>

      <el-container style="overflow: auto">
        <el-aside>
          <div class="toggle-button" @click="isCollapse = !isCollapse">
            <el-icon :size="20">
              <Expand v-if="isCollapse" />
              <Fold v-if="!isCollapse" />
            </el-icon>
          </div>
          <el-menu router :default-active="activePath" class="el-menu-vertical-demo" :collapse="isCollapse">
            <el-menu-item index="/dashboard" @click="saveActiveNav('/dashboard')">
              <el-icon>
                <house />
              </el-icon>
              <span>仪表盘</span>
            </el-menu-item>
            <el-sub-menu index="/user-management">
              <template #title>
                <el-icon>
                  <Setting />
                </el-icon>
                <span>系统设置</span>
              </template>
              <el-menu-item index="/user-info">权限管理</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/user-management" @click="saveActiveNav('/user-management')">
              <el-icon>
                <user />
              </el-icon>
              <span>用户管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
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
import { onBeforeMount, ref } from 'vue';
import Header from './components/Header.vue';
// 挂载 DOM 之前
onBeforeMount(() => {
  activePath.value = sessionStorage.getItem("activePath")
    ? sessionStorage.getItem("activePath")
    : "/index"
})
let isCollapse = ref(false);
let activePath = ref("");
// 保存链接的激活状态
const saveActiveNav = (path) => {
  sessionStorage.setItem("activePath", path);
  activePath.value = path;
}
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

.el-header {
  height: 48px;
  overflow: hidden;
  width: 100%;
  background-color: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.system-name {
  color: #fff;
  font-size: 18px;
}

.el-aside {
  background: white;
  width: auto !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-footer {
  color: #cccccc;
  text-align: center;
  line-height: 60px;
}

.el-footer:hover {
  color: #2661ef;
}

.toggle-button {
  background-color: #d9e0e7;
  font-size: 18px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  color: black;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
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