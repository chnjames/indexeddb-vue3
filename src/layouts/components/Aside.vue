<script setup>
import * as Icons from '@element-plus/icons-vue';
import {useRouter} from "vue-router";
import {ref, computed, onBeforeMount} from "vue";

// Vue Router实例
const router = useRouter();
const activePath = ref("");

// 获取路由表
const routers = router.options.routes;

// 过滤掉隐藏的路由
const filteredRouters = computed(() => {
  return routers
      .filter(route => !route.hidden)
      .map(route => {
        if (route.children) {
          route.children = route.children.filter(subRoute => !subRoute.hidden);
        }
        return route;
      });
});

// 获取图标组件
const getIconComponent = (iconName) => {
  return Icons[iconName] || null;
};

// 保存激活状态到 sessionStorage
const saveActiveNav = (path) => {
  sessionStorage.setItem("activePath", path);
  activePath.value = path;
}

// 页面加载时获取存储的路径状态
onBeforeMount(() => {
  activePath.value = sessionStorage.getItem("activePath") || router.currentRoute.value.path;
});
</script>

<template>
  <el-menu background-color="transparent" :default-active="activePath" @select="saveActiveNav" router>
    <template v-for="item in filteredRouters" :key="item.path">
      <el-menu-item v-if="item.children && item.children.length === 1" :index="item.children[0].path">
        <el-icon>
          <component :is="getIconComponent(item.meta.icon)"/>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
      <el-sub-menu v-else :index="item.path">
        <template #title>
          <el-icon>
            <component :is="getIconComponent(item.meta.icon)"/>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item v-for="subItem in item.children" :key="subItem.path" :index="subItem.path">
          <el-icon>
            <component :is="getIconComponent(subItem.meta.icon)"/>
          </el-icon>
          <span>{{ subItem.meta.title }}</span>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>