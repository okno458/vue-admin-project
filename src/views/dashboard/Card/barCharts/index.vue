<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts"
export default {
    name:'',
    mounted() {
      //初始化echarts实例
      let lineCharts = echarts.init(this.$refs.charts);
      //配置数据
      lineCharts.setOption({
        //x轴
        xAxis:{
           show: false,//隐藏x轴
           type:'category'//均分
        },
        //y轴
        yAxis:{
            show: false,//隐藏y轴
        },
        //系列
        series:[{ 
           type: 'bar',
           data:[3,7,2,4,3,6,2,4,2,3,4,5],
           color:'pink'
        }],
        //调试布局
        gird:{
          top: 0,
          left: 0,
          right:0,
          bottom: 0
        },
        tooltip: {}
      })
    },
}
</script>

<style>
    .charts {
       width: 100%;
       height: 100%;
    }
</style>