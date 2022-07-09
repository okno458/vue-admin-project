<template>
  <div>
      <el-card style="margin:20px 0">
        <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
      </el-card>
      <el-card>
        <!-- 底部有三部分进行切换 -->
        <div v-show="scene == 0">
           <!-- 展示spu列表的结构 -->
           <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
           <el-table  style="width: 100%" border :data="records">
             <el-table-column type="index" label="序号" width="80px" align="center">
             </el-table-column>
             <el-table-column prop="spuName" label="SPU名称" width="width">
             </el-table-column>
             <el-table-column prop="description" label="SPU描述" width="width">
             </el-table-column>
             <el-table-column prop="prop" label="操作" width="width">
               <template slot-scope="{row}">
                  <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
                  <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
                  <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu列表" @click="handler(row)"></hint-button>
                  <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                    <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
                  </el-popconfirm>
               </template>
             </el-table-column>
           </el-table>
           <el-pagination 
              style="text-align:center" 
              :current-page="page" 
              :page-sizes="[3, 5, 10]" 
              :page-size="limit" 
              layout="prev, pager, next, jumper,->,total, sizes" 
              :total="total"
              @current-change="getSpuList"
              @size-change="handleSizeChange">
           </el-pagination>
        </div>
        <div>
          <spuFrom v-show="scene == 1" @changeScene="changeScene" ref="spu"></spuFrom>
        </div>
        <div>
          <skuFrom v-show="scene == 2" ref="sku" @changeScenes="changeScenes"></skuFrom>
        </div>
      </el-card>
      <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- 使用table展示sku列表 -->
        <el-table :data="skuList" border v-loading="loading">
          <el-table-column label="名称" prop="skuName"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="重量" prop="weight"></el-table-column>
          <el-table-column label="默认图片" prop="">
            <template slot-scope="{row}">
               <img :src="row.skuDefaultImg" width="100px"/>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
  </div>
</template>

<script>
import skuFrom from './skuFrom';
import spuFrom from './spuFrom';
export default {
    name:'spu',
    components: {
      skuFrom,
      spuFrom
    },
    data() {
      return {
        category1Id:'',
        category2Id:'',
        category3Id:'',
        page:1,//分页器当前第几页
        limit:3,//当前页展示多少条数据
        records:[],//存储spu列表的数据
        total:0,//分页器一共展示数据的条数
        scene:0,//0代表展示spu列表的数据 1代表添加与修改spu 2代表添加sku 
        dialogTableVisible:false,//控制对话框的显示与隐藏
        spu:{},
        skuList:[],//sku列表的数据
        loading:true,
      }
    },
    methods:{
      //三级联动的自定义事件，可以把子组件相应的id传递给父组件
      //categoryId用于获取一级二级三级的分类的id，level用于区分是哪一级的id
      getCategoryId({categoryId , level}){
        if(level == 1){
            this.category1Id = categoryId;
            //清除二级 三级分类的id
            this.category2Id = '';
            this.category3Id = '';
        }else if (level == 2){
            this.category2Id = categoryId;
            this.category3Id = '';
        }else {
            this.category3Id = categoryId;
            //获取spu类的列表展示
            this.getSpuList();
        }
      },
      //获取spu列表数据的方法
      async getSpuList(pages = 1){
        this.page = pages;
        //携带三个参数：page,当前第几页，limit，当前页展示多少条数据，三级分类的id category3Id
        const {page,limit,category3Id} = this;
        let result = await this.$API.spu.reqSpuList(page,limit,category3Id);
        if (result.code == 200) {
           this.records = result.data.records;
           this.total = result.data.total;
        }
      },
      //当分页器的某一个展示数据条数发生变化的回调
      handleSizeChange(limit){
        this.limit = limit;
        this.getSpuList();
      },
      //添加spu按钮的回调
      addSpu(){
         this.scene = 1;
         //通知子组件spufrom发请求
         this.$refs.spu.addSpuData(this.category3Id);
      },
      //修改某一个spu
      updateSpu(row){
         this.scene = 1;
         //在父组件中可以通过ref获取子组件spufrom
         this.$refs.spu.initSpuData(row); 
      },
      //自定义事件的回调
      changeScene({scene,flag}){
        //flag:为了区分保存按钮的功能是添加还是修改
        this.scene = scene;
        //子组件通知父组件切换场景，需要再次发请求获取数据进行展示
        if(flag == '修改'){
          this.getSpuList(this.page);
        }else {
          this.getSpuList();
        }
      },
      //删除spu按钮的回调
      async deleteSpu(row){
       let result = await this.$API.spu.reqDeleteSpu(row.id);
       if(result.code == 200){
         this.$message({type: "success", message: '删除成功'});
         //此处需判断当前页数据是否大于一条，如果为真留在当前页，否则返回上一页
         this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
       }
      },
      //添加sku按钮的回调
      addSku(row){
        this.scene = 2;
        //父组件调用子组件的方法，通知其发请求
        this.$refs.sku.getData(this.category1Id,this.category2Id,row);
      },
      //skufrom通知父组件修改场景
      changeScenes(scene){
        this.scene = scene;
      },
      //查看sku按钮的回调
      async handler(spu){
        this.dialogTableVisible = true;
        this.spu = spu;
        //获取sku列表的数据
        let res = await this.$API.spu.reqSkuList(spu.id);
        if(res.code == 200){
          this.skuList = res.data;
          //取消loading效果
          this.loading = false;
        }
      },
      //关闭对话框的回调
      close(done){
        //将loading属性再次变为真
        this.loading = true;
        //清除sku列表的数据
        this.skuList = [];
        //关闭对话框
        done();
      }
    }
}
</script>

<style>

</style>