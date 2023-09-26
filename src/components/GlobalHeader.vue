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
      <a-col flex="100px">
        <!--        <div>{{ userStore.state.user?.loginUser?.userName ?? "未登录" }}</div>-->
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
                      path: '/user/login',
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
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes";
import router from "@/router";
import { computed, ref } from "vue";
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

const userStore = useStore();
const loginUser: LoginUserVO = computed(
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
    location.reload();
  }
};
</script>

<style scoped>
.menu-demo {
}

.arco-menu-inner {
}
</style>
