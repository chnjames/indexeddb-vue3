<script setup>
import * as Icons from '@element-plus/icons-vue';
import {useRouter} from "vue-router";
import {ref, computed, onBeforeMount } from "vue";

const router = useRouter();
console.log(router);
const routers = router.options.routes;
const activePath = ref("");
const filteredRouters = computed(() => {
  return routers
      .filter(route => !route.hidden)
      .map(route => {
        route.children = route.children.filter(subRoute => !subRoute.hidden);
        return route;
      });
});
const getIconComponent = (iconName) => {
  return Icons[iconName] || null; // Fetch icon component dynamically from Icons
};
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

<template>
  <el-menu background-color="transparent" router>
    <el-sub-menu v-for="item in filteredRouters" :key="item.path" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="getIconComponent(item.meta.icon)"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item v-for="subItem in item.children" :key="`sub-item-${subItem.path}`" :index="subItem.path">
        <template #title>
          <el-icon>
            <component :is="getIconComponent(subItem.meta.icon)"></component>
          </el-icon>
          <span>{{ subItem.meta.title }}</span>
        </template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>

</style>