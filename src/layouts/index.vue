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
          <el-menu :default-active="activePath" class="el-menu-vertical-demo" :collapse="isCollapse">
            <template v-for="route in filteredRoutes" :key="route.path">
              <el-menu-item
                  v-if="!route.children || route.children.length === 0"
                  :index="route.path"
                  @click="saveActiveNav(route.path)"
              >
                <el-icon><component :is="route.meta.icon" /></el-icon>
                <span>{{ route.meta.title }}</span>
              </el-menu-item>
              <el-sub-menu v-else :index="route.path">
                <template #title>
                  <el-icon><component :is="route.meta.icon" /></el-icon>
                  <span>{{ route.meta.title }}</span>
                </template>
                <template v-for="child in route.children" :key="child.path">
                  <el-menu-item :index="child.path" @click="saveActiveNav(child.path)">
                    <el-icon><component :is="child.meta.icon" /></el-icon>
                    <span>{{ child.meta.title }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
            </template>
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
import { onBeforeMount, ref, computed } from 'vue';
import Header from './components/Header.vue';
import { useRouter } from 'vue-router';
let isCollapse = ref(false);
let activePath = ref("");

const router = useRouter();
const routes = router.options.routes;

// 过滤动态路由
const filteredRoutes = computed(() => {
  return routes.filter(route => route.children && route.children.length > 0);
});

// 保存链接的激活状态
const saveActiveNav = (path) => {
  sessionStorage.setItem("activePath", path);
  activePath.value = path;
}

// 获取存储的路径状态
onBeforeMount(() => {
  activePath.value = sessionStorage.getItem("activePath") || "/dashboard";
});
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