<template>
  <div id="manageQuestionView">
    <a-row :gutter="[18, 18]">
      <a-col :md="24" :xs="24">
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
            total: total,
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
          <template #createTime="{ record }">
            {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
          <template #optional="{ record }">
            <a-space>
              <a-button type="primary" @click="doUpdate(record)">
                修改</a-button
              >
              <a-button status="danger" @click="doDelete(record)"
                >删除</a-button
              >
            </a-space>
          </template>
        </a-table>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const scrollbar = ref(true);
const scroll = {
  x: 1200,
  y: 500,
};

interface DataList {
  id: number;
  title: string;
  content: string;
  tags: [];
  answer: string;
}

const tableRef = ref();

const dataList = ref([]);
const total = ref<number>(0);
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    total.value = Number.parseInt(res.data.total);
    res.data.records.forEach((item: { tags: string }) => {
      item.tags = JSON.parse(item.tags);
    });
    dataList.value = res.data.records;
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

// /**
//  * 页面加载时，请求数据
//  */
// onMounted(() => {
//   loadData();
// });

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "id",
    dataIndex: "id",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
  },
  {
    title: "内容",
    dataIndex: "content",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "标签",
    slotName: "tags",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "答案",
    dataIndex: "answer",
    align: "center",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
    width: 80,
    align: "center",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    width: 80,
    align: "center",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "用户id",
    dataIndex: "userId",
    ellipsis: true,
    tooltip: true,
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createTime",
    align: "center",
  },
  {
    title: "操作",
    slotName: "optional",
    align: "center",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const doDelete = async (question: Question) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({
    id: question.id,
  });
  if (res.code === 0) {
    message.success("删除成功");
    await loadData();
  } else {
    message.error("删除失败");
  }
};

const router = useRouter();

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};
</script>

<style scoped>
#manageQuestionView {
  width: 100%;
  padding: 24px 24px 16px;
  max-width: 1200px;
}
</style>
