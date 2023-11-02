<template>
  <div id="questionSubmitView">
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
                <a-form-item field="questionId" label="题号">
                  <a-input
                    v-model="searchParams.questionId"
                    placeholder="请输入"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="7" :xs="24">
                <a-form-item field="language" label="编程语言">
                  <a-select
                    v-model="searchParams.language"
                    placeholder="选择编程语言"
                  >
                    <a-option>java</a-option>
                    <a-option>cpp</a-option>
                    <a-option>go</a-option>
                    <a-option>html</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="7" :xs="24">
                <a-form-item>
                  <a-button type="primary" @click="doSubmit">搜索</a-button>
                </a-form-item>
              </a-col>
            </a-form>
          </a-row>
          <a-row style="padding: 0 24px 16px">
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
                <template #status="{ record }">
                  <a-tag v-if="record.status === 1" color="gold">
                    <template #icon>
                      <icon-clock-circle />
                    </template>
                    判题中
                  </a-tag>
                  <a-tag v-else-if="record.status === 2" color="green">
                    <template #icon>
                      <icon-check-circle-fill />
                    </template>
                    完成
                  </a-tag>
                  <a-tag v-else color="red">
                    <template #icon>
                      <icon-close-circle-fill />
                    </template>
                    判题失败
                  </a-tag>
                </template>
                <template #judgeInfo="{ record }">
                  {{ JSON.stringify(record.judgeInfo) }}
                </template>
                <template #createTime="{ record }">
                  {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
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
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import { useRouter } from "vue-router";
import moment from "moment";
import message from "@arco-design/web-vue/es/message";
import QuestionSubmitPieChart from "@/views/question/echarts/QuestionSubmitPieChart.vue";

const tableRef = ref();
const scrollbar = ref(true);
const scroll = {
  x: 800,
  y: 450,
};
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = Number.parseInt(res.data.total);
  } else {
    message.error("加载失败，" + res.message);
  }
};

const chartData = ref<object[]>([
  { value: 800, name: "未通过" },
  { value: 735, name: "简单难度" },
  { value: 580, name: "中等难度" },
  { value: 484, name: "困难难度" },
]);

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  // todo，请求后端数据
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
    align: "center",
  },
  {
    title: "编程语言",
    dataIndex: "language",
    align: "center",
  },
  {
    title: "状态",
    slotName: "status",
    align: "center",
  },
  {
    title: "结果",
    slotName: "judgeInfo",
    align: "center",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
    align: "center",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

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
#questionSubmitView {
  /*!*display: flex;*!*/
  /*min-width: 1500px;*/
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
