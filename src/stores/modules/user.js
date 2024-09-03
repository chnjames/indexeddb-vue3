import { defineStore } from "pinia";
import {
  getToken,
  setToken,
  removeToken,
  generateToken,
} from "@/utils/cookies";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    user: null,
  }),
  actions: {
    login(user) {
      const userName = user.userName;
      const password = user.password;
      return new Promise((resolve, reject) => {
        const token = generateToken(userName, password);
        if (token) {
          setToken(token);
          this.user = { userName, password };
          resolve();
        } else {
          reject(new Error("用户校验失败"));
        }
      });
    },
    logout() {
      return new Promise((resolve) => {
        removeToken(); // 清除存储的 token
        this.user = null; // 清除用户信息
        resolve();
      });
    },
  },
});
