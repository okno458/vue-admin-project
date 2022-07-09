<template>
  <div>
    <!-- 三级联动 -->
    <!-- 
        inline属性代表行内表单，代表一行内可以放置多个表单元素
     -->
    <el-form :inline="true"  class="demo-form-inline" :model="cFrom">
        <el-form-item label="一级分类">
            <el-select  placeholder="请选择" v-model="cFrom.category1Id" @change="handler1()" :disabled="show">
            <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="二级分类">
            <el-select  placeholder="请选择" v-model="cFrom.category2Id" @change="handler2()" :disabled="show">
            <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="三级分类">
            <el-select  placeholder="请选择" v-model="cFrom.category3Id" @change="handler3()" :disabled="show">
             <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
            </el-select>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name:'CategorySelect',
  props:['show'],
  //组件挂载完毕时，向服务器发请求获取一级分类的数据
  data() {
      return {
          list1:[],//一级分类的数据
          list2:[],//二级分类的数据
          list3:[],//三级分类的数据
          //收集相应的一级二级三级分类的id
          cFrom:{
             category1Id:'',
             category2Id:'',
             category3Id:'', 
          },
      }
  },
  mounted(){
      //获取一级分类数据的方法
      this.getCategory1List();
  },
  methods: {
      //获取一级分类数据的方法
      async getCategory1List(){
         let result = await this.$API.attr.reqCartgory1List();
         if (result.code == 200) {
             this.list1 = result.data;
         }  
      },
      //一级分类select事件的回调(当一级分类的option发生变化的时候获取相应的二级分类)
      async handler1(){
          //清除数据
           this.list2 = [];
           this.list3 = [];
           this.cFrom.category2Id = '';
           this.cFrom.category3Id = '';
          //解构出一级分类的id
          const {category1Id} = this.cFrom;
          //将category1Id传递给父组件
          this.$emit('getCategoryId',{categoryId:category1Id,level:1} )
          let result = await this.$API.attr.reqCartgory2List(category1Id);
          if (result.code == 200) {
             this.list2 = result.data;
          }  
      },
       //二级分类select事件的回调(当二级分类的option发生变化的时候获取相应的三级分类)
      async handler2(){
          //清除数据
          this.list3 = [];
          this.cFrom.category3Id = '';
          const {category2Id} = this.cFrom;
           //将category2Id传递给父组件
          this.$emit('getCategoryId',{categoryId:category2Id,level:2} )
          let result = await this.$API.attr.reqCartgory3List(category2Id);
          if (result.code == 200) {
             this.list3 = result.data;
          }   
      },
      //三级分类事件的回调
      handler3(){
          const {category3Id} = this.cFrom;
           //将category3Id传递给父组件
          this.$emit('getCategoryId',{categoryId:category3Id,level:3} )
      }
  },
}
</script>

<style>

</style>