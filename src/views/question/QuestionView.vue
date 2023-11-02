<template>
  <div id="questionsView">
    <a-row :gutter="[10, 18]">
      <a-col :md="17" :xs="24">
        <div class="my-table">
          <a-row
            style="padding: 24px 24px 16px"
            align="center"
            justify="center"
          >
            <a-form :model="searchParams" layout="inline">
              <a-col :md="10" :xs="24">
                <a-form-item
                  field="title"
                  label="名称"
                  style="min-width: 240px"
                >
                  <a-input
                    v-model="searchParams.title"
                    placeholder="请输入名称"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="7" :xs="24">
                <a-form-item field="tags" label="标签" style="min-width: 240px">
                  <a-input-tag
                    v-model="searchParams.tags"
                    placeholder="请输入标签"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="7" :xs="24">
                <a-form-item>
                  <a-button type="primary" @click="doSubmit">提交</a-button>
                </a-form-item>
              </a-col>
            </a-form>
          </a-row>
          <a-row style="padding: 0px 24px 16px">
            <a-col>
              <a-table
                :ref="tableRef"
                :columns="columns"
                :data="dataList"
                :scroll="scroll"
                :scrollbar="scrollbar"
                :pagination="{
                  showTotal: true,
                  pageSize: searchParams.pageSize,
                  current: searchParams.current,
                  total,
                }"
                @page-change="onPageChange"
              >
                <template #tags="{ record }">
                  <a-space wrap>
                    <a-tag
                      v-for="(tag, index) of record.tags"
                      :key="index"
                      color="green"
                      >{{ tag }}
                    </a-tag>
                  </a-space>
                </template>
                <template #acceptedRate="{ record }">
                  {{
                    `${
                      record.submitNum
                        ? record.acceptedNum / record.submitNum
                        : "0"
                    }% (${record.acceptedNum}/${record.submitNum})`
                  }}
                </template>
                <template #createTime="{ record }">
                  {{ moment(record.createTime).format("YYYY-MM-DD") }}
                </template>
                <template #optional="{ record }">
                  <a-space>
                    <a-button type="primary" @click="toQuestionPage(record)">
                      做题
                    </a-button>
                  </a-space>
                </template>
              </a-table>
            </a-col>
          </a-row>
        </div>
      </a-col>
      <a-col :md="7" :xs="24">
        <div class="my-chart">
          <QuestionSubmitPieChart :chart-data="chartData" />
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import QuestionSubmitPieChart from "@/views/question/echarts/QuestionSubmitPieChart.vue";
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";

const route = useRoute();
const router = useRouter();
const tableRef = ref();
const scrollbar = ref(true);
const scroll = {
  x: 800,
  y: 450,
};

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 8,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = Number.parseInt(res.data.total);
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

const chartData = ref<object[]>([
  { value: 800, name: "未通过" },
  { value: 735, name: "简单难度" },
  { value: 580, name: "中等难度" },
  { value: 484, name: "困难难度" },
]);

// router.beforeEach((to, from, next) => {
//   if (from.path === "/user/login") {
//     location.reload();
//   }
//   next();
// });

onMounted(() => {
  // todo, 请求后端数据
});

const columns = [
  {
    title: "题号",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "题目名称",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "标签",
    slotName: "tags",
    width: 300,
    align: "center",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    width: 120,
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    width: 120,
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    width: 120,
    align: "center",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionsView {
  width: 100%;
}

.my-table {
  background-color: white;
  border-radius: 8px;
}

.my-chart {
  background-color: white;
  border-radius: 8px;
}
</style>
