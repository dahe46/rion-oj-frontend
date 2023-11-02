<template>
  <div class="menu-demo">
    <a-row class="grid-demo" align="center" :wrap="false">
      <a-col flex="auto">
        <div>
          <a-menu
            mode="horizontal"
            :selected-keys="selectKey"
            @menu-item-click="changeMenu"
          >
            <a-menu-item
              key="0"
              :style="{ padding: 0, marginRight: '38px' }"
              disabled
            >
              <div
                :style="{
                  width: '80px',
                  height: '30px',
                  borderRadius: '2px',
                  background: 'var(--color-fill-3)',
                  cursor: 'text',
                }"
              />
            </a-menu-item>
            <a-menu-item v-for="item in visibleRoutes" :key="item.path">
              {{ item.name }}
            </a-menu-item>
          </a-menu>
        </div>
      </a-col>
      <a-col flex="300px">
        <div class="time">
          <div class="timeStyle">
            {{ currentTime }}
          </div>
        </div>
      </a-col>
      <a-col flex="100px">
        <div class="div-avatar">
          <a-dropdown trigger="hover">
            <a-avatar
              v-if="loginUser && loginUser.userRole === ACCESS_ENUM.NOT_LOGIN"
            >
              <IconUser />
            </a-avatar>
            <a-avatar v-else>
              <img
                alt="avatar"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
              />
            </a-avatar>
            <template
              #content
              v-if="loginUser && loginUser.userRole !== ACCESS_ENUM.NOT_LOGIN"
            >
              <a-doption>
                <template #icon>
                  <icon-settings />
                </template>
                <template #default>
                  <a-anchor-link>设置</a-anchor-link>
                </template>
              </a-doption>
              <a-doption @click="loginOut">
                <template #icon>
                  <icon-import />
                </template>
                <template #default>
                  <a-anchor-link @click="loginOut">注销</a-anchor-link>
                </template>
              </a-doption>
            </template>
            <template #content v-else>
              <a-doption>
                <template #icon>
                  <icon-export />
                </template>
                <template #default>
                  <a-anchor-link
                    @click="
                      router.push({
                        path: `/user/login?replace=${route.path}`,
                      })
                    "
                    >登录
                  </a-anchor-link>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <icon-user-add />
                </template>
                <template #default>
                  <a-anchor-link>注册</a-anchor-link>
                </template>
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import router from "@/router";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import {
  IconUser,
  IconExport,
  IconImport,
  IconUserAdd,
  IconSettings,
} from "@arco-design/web-vue/es/icon";
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService, LoginUserVO } from "../../generated";
import { removeToken } from "@/common/token";
import { useRoute } from "vue-router";

const userStore = useStore();
const route = useRoute();
const loginUser = computed(
  () => userStore.state.user?.loginUser
) as LoginUserVO;

const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.isHide) {
      return false;
    }
    const needAccess: string = item.meta?.access as string;
    if (!checkAccess(userStore.state.user.loginUser, needAccess)) {
      return false;
    }
    return true;
  });
});

const selectKey = ref(["/"]);
router.afterEach((to, from, failure) => {
  selectKey.value = [to.path];
});

const changeMenu = (key: string) => {
  router.push({
    path: key,
  });
};
const loginOut = async () => {
  const res = await UserControllerService.userLogoutUsingPost();
  if (res.code === 0) {
    removeToken();
    location.reload();
  }
};

let timer: number | undefined;
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const time = now.toLocaleTimeString();
  return `${year}年${month}月${day}日 ${time}`;
};
const currentTime = ref(getCurrentDateTime());
const updateTime = () => {
  currentTime.value = getCurrentDateTime();
};

onMounted(() => {
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.menu-demo {
  width: 100%;
}

.arco-menu-light .arco-menu-item {
  background-color: transparent;
}

.arco-menu-light {
  background-color: transparent;
}

.time {
  display: flex;
  width: 100%;
  height: 50px;
  color: white;
  align-items: center;
  justify-content: center;
}

.timeStyle {
  font-size: 16px;
  background: linear-gradient(to right, #0a25af, #d9651c);
  -webkit-background-clip: text;
  color: transparent;
  background-size: 200% 100%;
  animation: gradientShift 4s linear infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 100% 0;
  }
  50% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 0;
  }
}

.div-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
