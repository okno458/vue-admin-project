<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" @click="showDialog">添加</el-button>
    <!-- el-table 表格组件的属性
        data:表格组件将来需要展示的数据，为数组类型
        border:给表格添加边框
        label:el-table-column的属性，显示标题文字
        width:对应列的宽度
        align:文字对齐方式
        type="index":展示序号
        prop:对应列内容的字段名
        注意事项：elementui中的 tabel组件 数据是以一列进行展示的
      -->
    <el-table :data="list"  style="width: 100%" border >
      <el-table-column prop="prop" label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌logo" width="width">
        <!-- 
          作用域插槽  
          row:是当前数组的每一条数据
          $index:当前数组的索引
        -->
        <template slot-scope="{row}">
          <img :src="row.logoUrl" style="width:250px;height:120px"/>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row}">
            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
            <el-button type="danger" icon="el-icon-edit" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 
      current-page：当前第几页
      total：数据总条数
      page-size：每一页展示多少条数据
      page-sizes:设置每一页展示多少条数据
      layout：可以实现分页器的布局
      page-count:连续页码数
      pager-count：按钮的数量 如果数字为9，则连续页码为7
      @current-change：当前页码发生改变时触发
      @size-change:当每一页展示多少条数据变化时会触发
    -->
    <el-pagination
      @current-change="getPageList"
      @size-change="handleSizeChange"
      style="margin-top:20px;text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      :page-count="5"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total">
    </el-pagination>
    <!-- 
      对话框 
      visible.sync：用于控制对话框显示与隐藏
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
    -->
    <el-dialog :title="tmFrom.id ? '修改品牌' : '添加品牌' " :visible.sync="dialogFormVisible">
      <!-- 
        el-form：表单元素
        model：把表单的数据收集到对象身上，表单验证也需要这个属性
        label-width：设置标题的宽度
       -->
      <el-form style="width:80%" :model="tmFrom" :rules="rules" ref="roleFrom">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input  autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 
            上传照片的组件
            :on-success="handleAvatarSuccess" 可以检测到图片是否上传成功
            :before-upload="beforeAvatarUpload" 图片上传之前会执行一次
            action: 设置图片上传的地址
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
       </div>
</el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    var validateTmName = (rule, value, callback) => {
       //rule：校验规则
       //value：用户输入的文本
       //callback：放行
       if(value.length < 2 || value.length > 10){
          callback(new Error("名称需要2到10位"))
       }else{
         callback();
       }
    };
    return {
      page:1,//分页器当前页数
      limit:3,//当前页展示数据的条数
      list:[], //列表展示的数据
      total:0,//总共数据的条数
      dialogFormVisible:false,//控制对话框显示与隐藏
      //收集品牌的信息
      tmFrom:{
        // id:'',//品牌的id
        tmName:'', //品牌的名字
        logoUrl:'',//品牌的图片
      },
      //表单验证的规则
      rules:{
        //品牌名称的验证规则
        tmName: [
          //require：true 必须要校验的字段，代表这个字段必须填写
          //message: 提示信息
          //trigger：用户行为的设置
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
          //自定义校验规则
          { validator: validateTmName, trigger: 'change' }
        ],
        //品牌logo的验证规则
        logoUrl: [
          { required: true, message: '请选择品牌图片' }
        ],
      }
    }
  },
  mounted() {
    //获取列表数据的函数
    this.getPageList();
  },
  methods: {
    //获取品牌列表数据
   async getPageList(pager = 1){
       this.page = pager;
       const {page,limit} = this;
       let result = await this.$API.trademark.reqTradeMark(page,limit);
       if(result.code == 200){
          this.total = result.data.total;
          this.list = result.data.records;
       }
    },
    //当分页器某一页需要展示数据条数发生变化的时候触发 
    handleSizeChange(limit){
      this.limit = limit;
      this.getPageList();
    },
    //点击添加品牌的按钮
    showDialog(){
      //显示对话框
      this.dialogFormVisible = true;
      //清除数据
      this.tmFrom = {
        tmName:'',
        logoUrl:'',
      };
    },
    //修改某一个品牌
    updateTradeMark(row){
      //row是当前用户的品牌数据
      this.tmFrom = {...row};//将已有的信息赋值给tmfrom进行展示，这里需要进行浅拷贝，否则会直接修改数据
      this.dialogFormVisible = true;
    },
    //上传图片成功的回调
      handleAvatarSuccess(res, file) {
        //res:上传成功之后返回图片在服务器的地址
        //file:上传成功之后返回的图片相关数据 
        this.tmFrom.logoUrl = res.data;
      },
      //图片上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //添加或修改品牌
      addOrUpdateTradeMark(){
        //当表单全部验证字段通过后，再去书写业务逻辑
        this.$refs.roleFrom.validate(async (success) => {
          //如果全部字段符合条件
          if(success){
             this.dialogFormVisible = false;
            //向服务器发送请求
            let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmFrom);
            if (result.code == 200) {
              //弹出信息
              this.$message({
                type:'success',
                message:this.tmFrom.id ? '修改品牌成功' : '添加品牌成功' 
              });
              //添加或者修改成功后，再次发送请求获取品牌列表进行展示
              //如果是添加品牌：停留在第一页，如果是修改品牌，则留在当前页
              this.getPageList(this.tmFrom.id ? this.page : 1);
            }
          }else{
             console.log('error');
             return false;
          }
        })
      },
      //删除品牌的操作
      deleteTradeMark(row){
        this.$confirm(`你确定删除${row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          //当用户点击确定按钮时会触发
          //向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if(result.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //此处需要判断，若当前页还有数据，则停留在当前页，若当前页没有数据，则返回上一页
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1 );
          }
        }).catch(() => {
           //当用户点击取消按钮时会触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
     }
    }
    
  }
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>