<template>
  <div class="container">
  <!--<h3>深圳市广力精密五金订单管理系统</h3>-->
    <h3>xx</h3>
    <div class="container-right">
      <el-dropdown>
        <span>Admin
          <el-icon class="el-icon--right">
            <arrow-down/>
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="onLogout">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-avatar shape="circle" :src="avatar" :size="36"></el-avatar>
    </div>
  </div>
</template>
<script setup>
import {ArrowDown} from "@element-plus/icons-vue";
import {ElMessage, ElMessageBox} from "element-plus";
import avatar from "@/assets/logo.svg";
import {useUserStore} from "@/stores/modules/user";
import {useRouter} from "vue-router";

const router = useRouter();
const userStore = useUserStore();

const onLogout = () => {
  ElMessageBox.confirm("确定退出系统？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage({
      type: "success",
      message: "退出成功",
    });
    userStore.logout();
    router.push("/login");
  }).catch(() => {
  });
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}
.container-right {
  display: flex;
  align-items: center;
  color: #000000;
}
.el-avatar {
  margin-left: 20px;
}
.el-dropdown {
  color: #000000;
}
</style>
