<template>
  <div>
     <el-table border :data="records">
       <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
       <el-table-column label="名称" prop="skuName" width=""></el-table-column>
       <el-table-column label="描述" prop="skuDesc"  width=""></el-table-column>
       <el-table-column label="默认图片">
         <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:80px;height:80px">
         </template>
       </el-table-column>
       <el-table-column label="重量(kg)" prop="weight" width="80"></el-table-column>
       <el-table-column label="价格(元)" prop="price" width="80"></el-table-column>
       <el-table-column label="操作" prop="" width="">
          <template slot-scope="{row}">
            <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale == 0" @click="sale(row)"></el-button>
            <el-button type="success" icon="el-icon-top" size="mini" v-else @click="cancel(row)"></el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
            <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
       </el-table-column>
     </el-table>
     <el-pagination 
        @current-change="getSkuList"
        @size-change="handleSizeChange"
        style="text-align:center" 
        :current-page="page" 
        :page-sizes="[3, 5, 10]" 
        :page-size="limit"
        layout="prev, pager, next, jumper,->,total, sizes" 
        :total="total"
        >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">
              {{attr.id}}-{{attr.valueId}}
            </el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
    name:'sku',
    data() {
      return {
        page:1,//代表当前第几页
        limit:10,//代表一页显示多少条数据
        records:[],//存储sku列表的数据
        total:0,//存储分页器一共展示的数据
        skuInfo:{},//存储sku信息
        show:false,//控制抽屉是否弹出
      }
    },
    mounted(){
      //获取列表的方法
      this.getSkuList();
    },
    methods: {
      async getSkuList(pages = 1){
        this.page = pages;
        const {page,limit} = this;
        let res = await this.$API.sku.reqSkuList(page,limit);
        if(res.code == 200){
          this.records = res.data.records;
          this.total = res.data.total;
        }
      },
      handleSizeChange(limit){
        this.limit = limit;
        this.getSkuList();
      },
      //上架
      async sale(row){
        let res = await this.$API.sku.reqSale(row.id);
        if(res.code == 200){
          row.isSale = 1;
          this.$message({type: "success",message:'上架成功'});
        }
      },
      //下架
      async cancel(row){
        let res = await this.$API.sku.reqCancel(row.id);
        if(res.code == 200){
          row.isSale = 0;
          this.$message({type: "success",message:'下架成功'});
        }
      },
      edit(){
        this.$message('正在开发中')
      },
      //获取sku详情的方法
      async getSkuInfo(sku){
         this.show = true;
         let res = await this.$API.sku.reqSkuById(sku.id);
         if(res.code == 200){
          this.skuInfo = res.data;
         }
      }
    }
}
</script>

<style>
  .el-row .el-col-5{
    text-align: right;
    font-size: 18px;
  }
  .el-col{
    margin: 10px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
 .el-carousel__button{
    width: 10px;
    height: 10px;
    background:red;
    border-radius: 50%;
  }
</style>