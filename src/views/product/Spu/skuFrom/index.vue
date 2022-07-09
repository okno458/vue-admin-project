<template>
  <div>
      <el-form label-width="80px" ref="from">
        <el-form-item label="SPU名称" >
          {{spu.spuName}}
        </el-form-item>
         <el-form-item label="SKU名称">
          <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
         <el-form-item label="价格(元)">
          <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
        </el-form-item>
         <el-form-item label="重量(千克)">
          <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
          <el-input placeholder="规格描述" type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
           <el-form :inline="true" label-width="80px">
              <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
                <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                  <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue) in attr.attrValueList" :key="attrValue.id"></el-option>
                </el-select>
              </el-form-item>
           </el-form>
        </el-form-item>
          <el-form-item label="销售属性">
           <el-form :inline="true" label-width="80px">
              <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr) in spuSaleAttrList" :key="saleAttr.id">
                <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                  <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
                </el-select>
              </el-form-item>
           </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
           <el-table border style="width:100%" :data="spuImageList" @selection-change="handleSelectionChange">
             <el-table-column label="" width="80px" type="selection">
             </el-table-column>
             <el-table-column label="图片">
               <template slot-scope="{row}">
                  <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
               </template>
             </el-table-column>
             <el-table-column label="名称" prop="imgName"></el-table-column>
             <el-table-column label="操作">
               <template slot-scope="{row}">
                  <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
                  <el-button type="" v-else>默认</el-button>
               </template>
             </el-table-column>
           </el-table>
        </el-form-item>
        <el-form-item label="">
           <el-button type="primary" @click="save">保存</el-button>
           <el-button type="" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name:'sku',
  data() {
    return {
      spuImageList:[],//存储图片的信息
      spuSaleAttrList:[],//存储销售属性的数据
      attrInfoList:[],//存储平台属性的数据
      //收集sku信息的字段
      skuInfo:{
        //第一类收集的数据：由父组件提供
        category3Id:0,
        spuId:0,
        tmId:0,
        //第二类收集的数据，需要用v-model双向绑定收集
        skuName:'',
        price:0,
        weight:'',
        skuDesc:'',
        //第三类收集的数据：需要自己书写代码的
        //收集图片的字段
        skuImageList:[],
        //默认图片
        skuDefaultImg:'',
        //收集销售属性列表的数据
        skuSaleAttrValueList:[],
        //平台属性
        skuAttrValueList:[],
      },
      spu:{},
      //收集图片数据的字段
      imageList:[],
    }
  },
  methods:{
    //获取skufrom的数据
    async getData(category1Id,category2Id,spu){
        //收集父组件传递过来的数据
        this.skuInfo.category3Id = spu.category3Id;
        this.skuInfo.spuId = spu.id;
        this.skuInfo.tmId = spu.tmId;
        this.spu = spu;
       //获取图片的数据
       let result = await this.$API.spu.reqSpuImageLIst(spu.id);
       if(result.code == 200){
         let list = result.data;
         list.forEach(item => {
           item.isDefault = 0;//给当前图片信息添加isDefault字段，0代表设置默认，1代表默认
         })
         this.spuImageList = list;
       }
       //获取销售属性的数据
       let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
       if(result1.code == 200){
         this.spuSaleAttrList = result1.data;
       }
       //获取平台属性的数据
       let result2 = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id);
       if(result2.code == 200){
         this.attrInfoList = result2.data;
       }
    },
    //table表格复选框按钮的事件
    handleSelectionChange(params){
      //获取到用户选中图片信息的数据，当前带给服务器的数据中缺少isDefalut字段
      this.imageList = params;
    },
    //排他操作
    changeDefault(row){
      //图片列表所有数据的isDefault字段值变为0
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      })
      //只有点击该图片的isDefault值为1
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮的回调
    cancel(){
      //触发自定义事件
      this.$emit('changeScenes',0);
      //清除数据
      Object.assign(this._data,this.$options.data());
    },
    //保存按钮的回调
    async save(){
       //整理参数
       //整理平台属性
       const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this;
       //方法1：使用forEach
      //  //新建一个数组
      //  let arr = [];
      //  //把收集到的数据整理一下
      //  attrInfoList.forEach(item => {
      //    //判断当前平台属性用户的选择
      //    if(item.attrIdAndValueId){
      //      const [attrId,valueId] = item.attrIdAndValueId.split(':');
      //      //携带给服务器的参数应该是对象
      //      let obj = {attrId,valueId};
      //      arr.push(obj);
      //    }
      //  });
      //  //将整理后的参数赋值
      //  this.skuInfo.skuAttrValueList = arr;
      //方法2：使用reduce
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item) => {
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':');
          prev.push({attrId,valueId})
        }
        return prev;
      },[]);
      //整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':');
          prev.push({saleAttrId,saleAttrValueId});
        }
        return prev;
      },[])
      //整理图片的数据
     skuInfo.skuImageList = imageList.map(item => {
       return {
        imgName: item.imgName,
        imgUrl:item.imgUrl,
        isDefault:item.isDefault,
        spuImgId:item.id,
       }
     })
     //向服务器发送请求
     let result = await this.$API.spu.reqAddSku(skuInfo);
     if(result.code == 200){
      this.$message({type: "success", message:'添加sku成功'})
      this.$emit('changeScenes',0);
     }
    }
  }
}
</script>

<style>

</style>