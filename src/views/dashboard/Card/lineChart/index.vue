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
           type:'category'
        },
        //y轴
        yAxis:{
            show: false,//隐藏y轴
        },
        //系列
        series:[{ 
           type: 'line',
           data:[3,7,2,4,3,6],
           //拐点样式的设置
           itemStyle: {
              opacity: 0
           },
           //线条的样式
           lineStyle:{
             color: 'purple'
           },
           //填充颜色的设置
           areaStyle:{
            color:{
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'purple' // 0% 处的颜色
                }, {
                    offset: 1, color: '#fff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
                }
           }
        }],
        //调试布局
        gird:{
          top: 0,
          left: 0,
          right:0,
          bottom: 0
        }
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