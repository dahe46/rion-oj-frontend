import { RouteRecordRaw } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionView from "@/views/question/QuestionView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";
import ViewQuestionView from "@/views/question/ViewQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "/",
    redirect: "/questions",
    meta: {
      isHide: true,
    },
  },
  {
    path: "/user",
    name: "user",
    component: UserLayout,
    meta: {
      isHide: true,
    },
    children: [
      {
        path: "/user/login",
        name: "login",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "register",
        component: UserRegisterView,
      },
    ],
  },
  {
    path: "/questions",
    name: "题库",
    component: QuestionView,
  },
  {
    path: "/question_submit",
    name: "已提交",
    component: QuestionSubmitView,
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    component: ViewQuestionView,
    props: true,
    meta: {
      access: ACCESS_ENUM.USER,
      isHide: true,
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/update/question",
    name: "update",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
      isHide: true,
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  // {
  //   path: "/noAuthor",
  //   name: "noAuthor",
  //   component: NoAuthor,
  // },
  // {
  //   path: "/hide",
  //   name: "隐藏页面",
  //   component: AboutView,
  //   meta: {
  //     isHide: true,
  //   },
  // },
  // {
  //   path: "/about",
  //   name: "about",
  //   component: AboutView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
];
