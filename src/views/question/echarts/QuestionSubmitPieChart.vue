<template>
  <div id="questionSubmitPieChart">
    <a-row>
      <a-col :span="24">
        <div class="pie-chart" ref="myChart"></div>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { getCurrentInstance, onMounted, ref } from "vue";
import { defineProps, withDefaults } from "vue/dist/vue";
import { ChartData } from "@/views/question/echarts/types";

interface Props {
  chartData: ChartData[];
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => [],
});

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | PieSeriesOption
>;
const myChart = ref(null) as any;
onMounted(() => {
  const chartDom = myChart.value;
  // 绘图
  const chart = echarts.init(chartDom);
  let option: EChartsOption;
  // 新建一个promise对象
  option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      icon: "circle",
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: "50%",
        center: ["50%", "65%"],
        label: {
          formatter: "{b}:{d}%",
        },
        // data: [
        //   { value: 800, name: "未通过" },
        //   { value: 735, name: "简单难度" },
        //   { value: 580, name: "中等难度" },
        //   { value: 484, name: "困难难度" },
        // ],
        data: props.chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  option && chart.setOption(option);
  // 监听窗口变化，重新绘图，响应式图形
  window.onresize = () => {
    chart.resize();
  };
});
</script>

<style scoped>
#questionSubmitPieChart {
  width: 100%;
}

.pie-chart {
  z-index: 1;
  width: 100%;
  height: 20vw;
}
</style>
