<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0 8px">
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或者修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="55px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row , $index }">
              <!--@keyup.native.enter:按回车键切换flag  -->
               <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" 
               @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
               <span v-else @click="toEdit(row,$index)" style="display:block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
             <template slot-scope="{row,$index}">
               <!--el-popconfirm 气泡确认框  -->
                <el-popconfirm :title="`确认删除${row.valueName}吗?`" @onConfirm="deleteAttrValue($index)">
                  <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: "attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [], //接收平台属性
      isShowTable: true, //控制table是否显示
      //收集新增属性或者修改属性
      attrInfo: {
        attrName: "",//属性名
        attrValueList: [],//相应属性值，属性值可以有多个，所以用数组，每个属性值都是一个对象
        categoryId: 0,//三级分类的id
        categoryLevel: 3,//因为服务器要区分是几级id
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //区分三级分类相应的id以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        //清空数据
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        //代表三级分类的id已经存储成功，需要向服务器发请求
        this.category3Id = categoryId;
        //发请求获取平台属性数据
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    //添加属性值的回调
    addAttrValue(){
       //向属性值的数组中添加元素
       this.attrInfo.attrValueList.push({
         //对于修改某一个属性时，可以在已有属性值的基础上再添加新的属性值，在新增属性时，需要添加已有属性的id
          attrId: this.attrInfo.id,//相应的属性名的id
          valueName: "",//相应的属性值名称
          flag:true,//给每一个属性值添加标记，用于切换查看模式与编辑模式
       })
       this.$nextTick(() => {
         this.$refs[this.attrInfo.attrValueList.length - 1].focus();
       })
    },
    //添加属性按钮的回调
    addAttr(){
      //切换table的显示和隐藏
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    //修改某一个属性
    updateAttr(row){
      this.isShowTable = false;
      //将选中的属性赋值给attrInfo
      //由于数据结构中存在复杂结构，因此需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row);
      //在修改某一个属性的时候，将相应的属性值元素添加上flag标记
      this.attrInfo.attrValueList.forEach(item => {
        //item.flag = false 的写法也可以添加flag字段，但是视图不会跟着变化(flag不是响应式数据)
        //要为对象添加响应式数据需使用组件实例上的$set方法
        //$set的参数：第一个参数为向哪一个对象添加属性，第二个参数为添加的字段名，第三个参数为添加字段名的默认值
        this.$set(item,'flag',false);
      })
    },
    //失去焦点的回调（切换为查看模式）
    toLook(row){
      //如果属性值为空，则不能添加新的属性值，需要给用户提示
      if(row.valueName.trim() == ''){
        return this.$message('请输入正常的属性值')
      }
      //新增的属性值不能与已有的属性值重复
      let isrepeat = this.attrInfo.attrValueList.some(item => {
        //需要将row从数组中判断的时候去除
        //判断的时候需要把已有的数组元素新增的这个属性值去除
        if(row !== item){
           return row.valueName == item.valueName;
        }
      });
      if (isrepeat)  return this.$message('属性名重复');
      //row：当前用户添加的最新属性值
      row.flag = false;
    },
    //点击span的回调，变为编辑模式
    toEdit(row,index){
      row.flag = true;
      //获取input节点，实现自动聚焦
      //点击span时，切换为input，变为编辑模式，对于浏览器而言，页面的重绘与重排是耗时间的，因此无法立刻获得input节点
      //这里需要使用$nextTick,当节点渲染完毕会执行一次,可以确定input已经渲染完成
      this.$nextTick(() => {
        //获取响应的Input元素实现聚焦
        this.$refs[index].focus();
      })
    },
    //气泡确认框点击确定按钮的回调
    deleteAttrValue(index){
      //当前删除属性值的操作不需要发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮，进行添加或修改属性
    async addOrUpdateAttr(){
      //整理参数
      //如果用户添加了很多属性值，且属性值为空，那么则不提交给服务器
      //提交给服务器的数据中，不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
        //过滤掉属性值不为空的
        if(item.valueName != ''){
          //删除掉flag属性
          delete item.flag;
          return true;
        }
      })
      //向服务器发送请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平台属性的信号量进行切换
        this.isShowTable = true;
        this.$message({type: 'success' , message:'保存成功'});
        //保存成功后，再次获取平台属性的数据
        this.getAttrList();
      } catch (error) {
        this.$message({type: 'success' , message:'保存失败'});
      }
    }
  },
};
</script>

<style>
</style>