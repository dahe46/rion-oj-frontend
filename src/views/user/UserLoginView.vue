<template>
  <div id="UserLogin">
    <div class="userInput">
      <a-form
        ref="formRef"
        :model="form"
        :style="{ width: '320px' }"
        @submit="handleSubmit"
        label-align="left"
      >
        <a-form-item
          field="userAccount"
          label="账号"
          :rules="[
            { required: true, message: '请输入账号' },
            { minLength: 4, message: '账号过短' },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input
            v-model="form.userAccount"
            placeholder="请输入账号"
            :style="{ width: '320px' }"
          />
        </a-form-item>
        <a-form-item
          field="userPassword"
          label="密码"
          :rules="[
            { required: true, message: '请输入密码' },
            { minLength: 4, message: '密码过短' },
          ]"
          :validate-trigger="['change', 'input']"
        >
          <a-input-password
            v-model="form.userPassword"
            :style="{ width: '320px' }"
            placeholder="请输入密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit">登录</a-button>
        </a-form-item>
      </a-form>
      <!--      <a-form ref="formRef" :model="form" :style="{ width: '600px' }">-->
      <!--        <a-form-item field="userAccount" label="账号" :rules="rules">-->
      <!--          <a-input-->
      <!--            v-model="form.userAccount"-->
      <!--            placeholder="请输入账号"-->
      <!--            :style="{ width: '320px' }"-->
      <!--          />-->
      <!--        </a-form-item>-->
      <!--        <a-form-item field="userPassword" label="密码">-->
      <!--          <a-input-->
      <!--            v-model="form.userPassword"-->
      <!--            placeholder="请输入密码"-->
      <!--            :style="{ width: '320px' }"-->
      <!--          />-->
      <!--        </a-form-item>-->
      <!--        <a-form-item field="isRead">-->
      <!--          <a-checkbox v-model="form.isRead">-->
      <!--            I have read the manual-->
      <!--          </a-checkbox>-->
      <!--        </a-form-item>-->
      <!--        <a-form-item>-->
      <!--          <a-button @click="handleClick">Set Status</a-button>-->
      <!--        </a-form-item>-->
      <!--      </a-form>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { setToken } from "@/common/token";

const store = useStore();
const router = useRouter();
const formRef = ref();
const form = reactive({
  userAccount: "admin",
  userPassword: "12345678",
}) as UserLoginRequest;
const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  console.log(res);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    setToken(res.data.token);
    await router.push({
      path: "/",
    });
    message.success("登录成功");
  } else {
    message.error(res.message);
  }
};

// const formRef = ref();
// const form = reactive({
//   userAccount: "",
//   userPassword: "",
//   isRead: false,
// });
// const rules = [
//   {
//     validator: (value: string, cb: (arg0: string) => void) => {
//       return new Promise<void>((resolve) => {
//         window.setTimeout(() => {
//           if (value !== "admin") {
//             cb("name must be admin");
//           }
//           resolve();
//         }, 2000);
//       });
//     },
//   },
// ];
// const handleClick = () => {
//   formRef.value.setFields({
//     userAccount: {
//       status: "error",
//       message: "async name error",
//     },
//     userPassword: {
//       status: "error",
//       message: "valid post",
//     },
//   });
// };
</script>

<style>
#UserLogin {
  display: flex;
  justify-content: center;
  align-items: center;
}

.userInput {
  z-index: 1;
}
</style>
