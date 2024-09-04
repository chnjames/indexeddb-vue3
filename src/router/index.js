import { createRouter, createWebHistory } from "vue-router";
import store from "@/stores/index";
import { getToken, removeToken } from "@/utils/cookies";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import UserManagementView from "@/views/UserManagementView.vue";
import CustomerManager from "@/views/CustomerManager.vue";
import Layouts from "@/layouts/index.vue";

// 设置白名单
const whiteRouter = ["/login"];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: LoginView,
      meta: {
        title: "登录",
      },
      hidden: true,
    },
    {
      path: "",
      component: Layouts,
      redirect: "/dashboard",
      meta: {
        title: "仪表盘",
        icon: "DataBoard",
      },
      children: [
        {
          path: "/dashboard",
          component: DashboardView,
          name: "dashboard",
          meta: {
            title: "工作台",
            icon: "DataBoard",
            affix: true,
            keepAlive: true,
          },
        },
      ],
    },
    {
      path: "/user-management",
      component: Layouts,
      redirect: "/user-info",
      meta: {
        title: "用户管理",
        icon: "User",
      },
      children: [
        {
          path: "/user-info",
          component: UserManagementView,
          name: "user-info",
          meta: {
            title: "用户信息",
            icon: "User",
            affix: true,
            keepAlive: true,
          },
        },
      ],
    }, {
      path: "/customer-management",
      component: Layouts,
      redirect: "/customer-info",
      meta: {
        title: "客户管理",
        icon: "User",
      },
      children: [
        {
          path: "/customer-info",
          component: CustomerManager, // 使用客户管理页面组件
          name: "customer-info",
          meta: {
            title: "客户信息",
            icon: "User", // 根据需要替换为合适的图标
            affix: true,
            keepAlive: true,
          },
        },
      ],
    }
  ],
});

router.beforeEach((to, from, next) => {
  // 设置路由标题
  document.title = `${to.meta.title || "后台管理系统"} - ${
    import.meta.env.VITE_APP_TITLE
  }`;

  const token = getToken();

  if (token) {
    if (to.path === "/login") {
      removeToken();
      store.commit("login/SET_TOKEN", "");
      next("/");
    } else {
      next();
    }
  } else {
    console.log('token', token);
    
    if (whiteRouter.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
