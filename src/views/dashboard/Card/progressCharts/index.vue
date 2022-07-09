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
           //最小值与最大值的设置
           min:0,
           max:100,
        },
        //y轴
        yAxis:{
            show: false,//隐藏y轴
            type:'category'//均分
        },
        //系列
        series:[{ 
           type: 'bar',
           data:[78],
           color:'blue',
           //柱状图宽度的设置
           barWidth:10, 
           showBackground:true,
           //设置北京颜色
           backgroundStyle:{color: '#eee'},
           //文本
           label:{
            show:true, 
            formatter:'|',//改变文本内容
            position:'right'//文本标签位置
           }
        }],
        //调试布局
        gird:{
          top: 0,
          left: 0,
          right:0,
          bottom: 0
        },
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