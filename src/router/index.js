import { createRouter, createWebHistory } from "vue-router";
import { getToken, removeToken } from "@/utils/cookies";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import UserManagementView from "@/views/UserManagementView.vue";
import CustomerManager from "@/views/CustomerManager.vue";
import PurchaseOrder from "@/views/PurchaseOrder.vue";
import Layouts from "@/layouts/index.vue";

// 设置白名单
const whiteRouter = ["/login"];

const routes = [
  {
    path: "/login",
    component: LoginView,
    meta: {
      title: "登录"
    },
    hidden: true
  }, {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    meta: {
      title: "首页",
      icon: "HomeFilled"
    },
    children: [
      {
        path: "/dashboard",
        component: DashboardView,
        name: "dashboard",
        meta: {
          title: "工作台",
          icon: "Menu",
          affix: true,
          keepAlive: true
        }
      }
    ]
  }, {
    path: "/user-management",
    component: Layouts,
    redirect: "/user-info",
    meta: {
      title: "系统管理",
      icon: "Tools"
    },
    children: [
      {
        path: "/user-info",
        component: UserManagementView,
        name: "user-info",
        meta: {
          title: "用户管理",
          icon: "UserFilled",
          affix: true,
          keepAlive: true
        }
      }
    ]
  }, {
    path: "/customer-management",
    component: Layouts,
    redirect: "/customer-info",
    meta: {
      title: "客户管理",
      icon: "HelpFilled"
    },
    children: [
      {
        path: "/customer-info",
        component: CustomerManager,
        name: "customer-info",
        meta: {
          title: "客户信息",
          icon: "Promotion",
          affix: true,
          keepAlive: true
        }
      }, {
        path: "/purchase-order/:id",
        component: PurchaseOrder,
        name: "purchase-order",
        hidden: true,
        meta: {
          title: "采购订单",
          icon: "Management",
          affix: true,
          keepAlive: true
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || "后台管理系统"} - ${import.meta.env.VITE_APP_TITLE}`;
  const token = getToken();
  const isLoginPage = to.path === "/login";
  if (token) {
    if (isLoginPage) {
      removeToken();
      next("/");
    } else {
      next();
    }
  } else {
    if (whiteRouter.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
