<template>
  <div>
    <el-card class="box-card" style="margin:10px 0px">
      <div slot="header" class="clearfix">
        <!-- 左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 右侧内容 -->
        <div class="right">
          <span @click="setDay()">今日</span>
          <span @click="setWeek()">本周</span>
          <span @click="setMonth()">本月</span>
          <span @click="setYear()">本年</span>
          <el-date-picker
            v-model="date"
            class="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini">
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
          <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <div class="right1">
                <h3>门店{{title}}排名</h3>
                <ul>
                  <li>
                    <span class="index">1</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                  <li>
                    <span class="index">2</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                  <li>
                    <span class="index">3</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                  <li>
                    <span class="index">4</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                  <li>
                    <span class="index">5</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                  <li>
                    <span class="index">6</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                  <li>
                    <span class="index">7</span>
                    <span>肯德基</span>
                    <span class="value">123456</span>
                  </li>
                </ul>
            </div>
          </el-col>
        </el-row>
      </div>

    </el-card>
  </div>
</template>

<script>
//引入echarts
import * as echarts from "echarts"
import dayjs from "dayjs"
export default {
  name:'',
  data() {
    return {
      activeName:'sale',
      mycharts:null,
      date:[],//收集日历的数据
    }
  },
  computed:{
    title(){
      return this.activeName == 'sale' ? '销售额' : '访问量'
    }
  },
  watch:{
    title(){
      //监听title，给echarts的标题重新赋值
      this.mycharts.setOption({
        title:{
          text:`${this.title}趋势`,
        }
      })
    }
  },
  methods: {
    setDay(){
      const day = dayjs().format('YYYY-MM-DD');
      this.date = [day,day]
    },
    setWeek(){
      const start = dayjs().day(1).format('YYYY-MM-DD');
      const end = dayjs().day(7).format('YYYY-MM-DD');
      this.date = [start,end]
    },
    setMonth(){
      const start = dayjs().startOf('month').format('YYYY-MM-DD');
      const end = dayjs().endOf('month').format('YYYY-MM-DD');
      this.date = [start,end]
    },
    setYear(){
      const start = dayjs().startOf('year').format('YYYY-MM-DD');
      const end = dayjs().endOf('year').format('YYYY-MM-DD');
      this.date = [start,end]
    }
  },
  mounted(){
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text:  `${this.title}趋势`
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: [10, 52, 200, 334, 390, 330, 220, 10, 52, 200, 334, 390],
          color:'purple'
        }
      ]
    })
  },

}
</script>

<style scoped>
  .clearfix{
    position: relative;
    display:flex;
    justify-content:space-between;
  }
  .tab{
    width: 100%;
  }
  .right{
    position: absolute;
    right: 0;
  }
  .right span {
    margin: 0 10px;
  }
  .right1 span{
    margin: 0 10px;
  }
  .date{
    width: 300px;
    margin: 0 20px;
  }
  .charts{
    width: 100%;
    height: 250px;
  }
  ul{
    list-style: none;
    width: 100%;
    height: 250px;
    padding: 0;
  }
  ul li{
    height: 8%;
    margin: 10px 0;
  }
  .index{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background:black;
    color: white;
    text-align: center;
    float: left;
  }
  .value{
    float: right;
  }
</style>