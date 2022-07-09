<template>
  <div>
      <el-form ref="form"  label-width="80px" :model="spu">
          <el-form-item label="SPU名称">
              <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
          </el-form-item>
          <el-form-item label="品牌">
              <el-select placeholder="请选择品牌" v-model="spu.tmId">
                  <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="SPU描述">
            <el-input type="textarea" rows="4" placeholder="SPU描述" v-model="spu.description"></el-input>
          </el-form-item>
          <el-form-item label="SPU图片">
            <!--
              el-upload上传图片的组件
              action：图片上传的地址
              list-type：文件列表的类型  
              on-preview：图片预览时会触发的事件
              on-remove：删除图片时触发的事件
              file-list：照片墙展示的数据，返回的数据为一个数组，其中必须要有name和url属性
            -->
            <el-upload
                action="/dev-api/admin/product/fileUpload"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :file-list="spuImageList"
                :on-success="handlerSuccess">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" />
            </el-dialog>
          </el-form-item>
          <el-form-item label="销售属性">
             <el-select value="" :placeholder="`还有${unselectSaleAttr.length}个未选择`" v-model="addrIdAndAttrName">
                 <el-option :value=" `${unselect.id}:${unselect.name}`" :label="unselect.name" v-for="unselect in unselectSaleAttr" :key="unselect.id">
                 </el-option>
             </el-select>
             <el-button type="primary" icon="el-icon-plus" :disabled="!addrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
             <!-- 这个table展示的是SPU属于自己的销售属性 -->
             <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                 <el-table-column type="index" label="序号" width="80px" align="center">
                 </el-table-column>
                 <el-table-column prop="saleAttrName" label="属性名" width="width">
                 </el-table-column>
                 <el-table-column prop="prop" label="属性名称列表" width="width">
                   <template slot-scope="{row}">
                     <!--
                        el-tag组件：
                        closable：是否显示关闭按钮
                        disable-transitions：是否显示过渡动画
                        @close：点击关闭按钮的回调函数
                      -->
                      <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" 
                              @close="row.spuSaleAttrValueList.splice(index,1)">
                        <!-- el-tag用于展示已有的属性值列表的数据 -->
                        {{tag.saleAttrValueName}}
                      </el-tag>
                      <!-- 
                          @keyup.enter.native="handleInputConfirm"
                       -->
                      <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" 
                        size="small"  @blur="handleInputConfirm(row)">
                      </el-input>
                      <!-- @click="showInput" -->
                      <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                   </template>
                 </el-table-column>
                 <el-table-column prop="prop" label="操作" width="width">
                   <template slot-scope="{$index}">
                     <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                   </template>
                 </el-table-column>
             </el-table>
             <el-form-item>
                 <el-button type="primary" style="margin:10px 10px 0 0" @click="addOrUpdateSpu">保存</el-button>
                 <el-button @click="cancel">取消</el-button>
             </el-form-item>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
           dialogImageUrl: '',
           dialogVisible: false,
           //spu属性初始化的时候是一个空对象，在修改的时候，会向服务器发请求，返回spu信息(对象)
           //在修改时利用服务器返回的这个对象收集最新的数据提交给服务器
           //如果添加spu的时候，并没有向服务器发请求，数据将收集到spu里面
           spu:{
             //存储spu信息属性
             category3Id:0,//三级分类的id
             description:'',//描述
             spuName:'',//spu的名称
             tmId:'',//平台的id
             //收集spu图片的信息
             spuImageList:[{
               id:0,
               imgName:'',
               imgUrl:'',
               spuId:0,
             }],
             //平台属性与属性值的收集
             spuSaleAttrList:[
              //  spuSaleAttrValueList:[]
             ]
           },
           tradeMarkList:[],//存储品牌的信息
           spuImageList:[],//存储spu的图片
           saleAttrList:[],//存储spu平台全部销售属性
           addrIdAndAttrName:''//收集未选择的销售属性的id
        }
    },
    computed: {
      //计算出还未选择的销售属性
      unselectSaleAttr(){
        //整个平台的销售属性有三个 在saleAttrList中
        //当前spu拥有的属于自己的销售属性SPU 在spu.spuSaleAttrList中
        //数组的filter方法可以过滤出符合条件的元素，并且返回一个新的数组
        let result = this.saleAttrList.filter(item => {
          //数组的every方法返回一个布尔值
          return this.spu.spuSaleAttrList.every(item1 => {
            return item.name != item1.saleAttrName;
          })
        })
        return result;
      }
    },
    methods: {
      //添加新的销售属性
      addSaleAttr(){
        //把收集到的销售属性的数据进行分割
        const [baseSaleAttrId,saleAttrName]  = this.addrIdAndAttrName.split(':');
        //向spu对象的spuSaleAttrList属性中添加新的销售属性
        let newSaleAttr = {
          baseSaleAttrId,
          saleAttrName,
          spuSaleAttrValueList:[],
        };
        //添加新的销售属性
        this.spu.spuSaleAttrList.push(newSaleAttr);
        //添加后清空数据
        this.addrIdAndAttrName = '';
      },
      //照片墙图片上传成功的回调
      handlerSuccess(respone,file,fileList){
         //收集上传成功图片的信息
         this.spuImageList = fileList;
      },
      //照片墙删除图片时会触发
      handleRemove(file, fileList) {
        //file参数：删除某一张图片的信息
        //fileList参数：代表照片墙删除某一张图片后剩余的其他图片，需要收集
        //照片墙在删除图片时需要修改数据，因为需要知道删除的是哪一张
        //收集照片墙图片的数据
        //对于已有的图片，照片墙中显示的图片，有name和url字段，因为照片墙显示数据务必要有这两个属性，对于服务器则不需要
        this.spuImageList = fileList;
      },
      //照片墙图片预览的回调
      handlePictureCardPreview(file) {
        //照片墙在预览图片的时候，不需要收集数据，因为此时数据已经有了
        console.log(123);
        //将图片地址赋值给dialogImageUrl属性
        this.dialogImageUrl = file.url;
        //对话框显示
        this.dialogVisible = true;
      },
      //添加按钮的回调
      addSaleAttrValue(row){
        //点击销售属性值按钮的时候，需要展示为input，通过当前销售属性的inputVisible字段控制
        //挂载在销售属性身上的响应式数据inputVisible控制着button与input的切换
        this.$set(row,'inputVisible',true);
        //通过响应式数据inputValue字段收集新增的销售属性值
        this.$set(row,'inputValue','');
      },
      //el-input失去焦点的回调函数
      handleInputConfirm(row){
        //当失去焦点时，需要收集baseSaleAttrId和saleAttrValueName字段到spuSaleAttrValueList数组中
        //解构出属性当中收集的数据
        const {baseSaleAttrId,inputValue} = row;
        //新增的销售属性值不能为空
        if(inputValue.trim() ==''){
          this.$message('属性值不能为空');
          return;
        }
        //属性值不能重复
        let result = row.spuSaleAttrValueList.every(item => {
          return item.saleAttrValueName != inputValue
        })
        if(!result){
          this.$message('属性名不能重复');
          return;
        } 
        //定义新的销售属性值
        let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue};
        //新增
        row.spuSaleAttrValueList.push(newSaleAttrValue);
        //修改inputVisible为false，显示button
        row.inputVisible = false;
        
      },
      //初始化spu数据
      async initSpuData(spu){
        //获取spu信息的数据
        let spuResult = await this.$API.spu.reqSpu(spu.id);
        if(spuResult.code == 200){
          this.spu = spuResult.data;
        }
        //获取品牌的信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
        if(tradeMarkResult.code == 200){
          this.tradeMarkList = tradeMarkResult.data;
        }
        //获取spu图片的数据
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
        if(spuImageResult.code == 200){
          //由于照片墙显示的数据必须是数组，数组中必须要有name和url字段，需要把服务器返回的数据进行修改
          let listArr = spuImageResult.data;
          listArr.forEach(item => {
            item.name = item.imgName,
            item.url = item.imgUrl
          })
          //将整理好的数据赋值给spuImageList
          this.spuImageList = listArr;
        }
        //获取spu平台全部销售属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList();
        if(saleResult.code == 200){
          this.saleAttrList = saleResult.data;
        }
      },
      //保存按钮的回调
      async addOrUpdateSpu(){
        //整理参数：需要整理照片墙的数据
        //对于图片，需要携带参数imgName和imgUrl字段
       this.spu.spuImageList = this.spuImageList.map(item => {
          return {
            imgName: item.name,
            imgUrl:(item.response && item.response.data) || item.url,
          }
        })
        //整理参数后，向服务器发请求
       let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
       if(result.code == 200){
         this.$message({type: 'success',message:'保存成功'});
         //通知父组件，回到spu列表
         this.$emit('changeScene',{scene:0,flag:this.spu.id ? '修改' : '添加'});
       }
       //清除数据
       Object.assign(this._data,this.$options.data());
      },
      //点击SPU按钮的时候，发请求的函数
      async addSpuData(category3Id){
        //添加spu的时候收集三级分类的id
        this.spu.category3Id = category3Id;
        //获取品牌的信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
        if(tradeMarkResult.code == 200){
          this.tradeMarkList = tradeMarkResult.data;
        };
        //获取spu平台全部销售属性
        let saleResult = await this.$API.spu.reqBaseSaleAttrList();
        if(saleResult.code == 200){
          this.saleAttrList = saleResult.data;
        };
      },
      //取消按钮
      cancel(){
        //通知父组件切换场景为0
        this.$emit('changeScene',{scene:0,flag:''});
        //清除数据
        //Object.assign : ES6中新增语法，可以合并对象
        //组件实例的this._data可以操作data中的响应式数据
        //this.$options可以获取配置对象，配置对象的data()函数执行，返回的响应式数据为空
        Object.assign(this._data,this.$options.data());
      }
    },
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>