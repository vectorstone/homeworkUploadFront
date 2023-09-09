<template>
  <div>
    <div style="margin: 15px">
      <el-button type="primary" @click="handleUpload">upload<i class="el-icon-upload el-icon-right"></i></el-button>
      <!--<el-button type="primary" @click="handleDownload">download<i class="el-icon-download el-icon-right"></i></el-button>-->
    </div>


    <!-- 导入上传文件的对话框 -->
    <el-dialog title="上传作业" :visible.sync="dialogFormVisible">
      <!--<el-input placeholder="请输入作业名称:" v-model="homeworkName" ></el-input>-->
      <el-select  placeholder="请选择作业的名称" v-model="homeworkName">
        <el-option :label="homework.name" :value="homework.name" v-for="homework in homeworkList"></el-option>
      </el-select>

      <el-upload class="upload-demo" drag :action="uploadPath"
      :data="{module: homeworkName }"
      :on-preview="handlePreview" :on-success="uploadSuccess"
        :on-error="uploadError" multiple style="margin-top: 10px"
      :before-upload="checkHomeworkName">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          jpg/png files with a size less than 5MB
        </div>
      </el-upload>
    </el-dialog>

    <!-- 列表 -->
    <el-table
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      >
      <!--批量删除相关的checkbox-->
      <el-table-column type="selection"/>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="图片id" width="180"/>
      <el-table-column prop="userId" label="用户id" width="110"/>
      <el-table-column prop="username" label="用户姓名"/>
      <el-table-column prop="imageName" label="图片名称"/>
      <el-table-column prop="createTime" label="创建时间"/>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)" title="修改" :disabled="$hasBP('bnt.sysUser.update')  === false"/><!-- :disabled="$hasBP('bnt.sysUser.update')  === false" -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />


    <!--修改的那个表格-->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="image" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="图片名称" prop="imageName">
          <el-input v-model="image.imageName"/>
        </el-form-item>
        <el-image
          style="width: 300px; height: 300px"
          :src="image.url"
          :preview-src-list="[image.url]">
        </el-image>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="updateImageName()" size="small">确 定</el-button>
      </span>

    </el-dialog>

  </div>
</template>
<script>
import api from "@/api/system/sysUpload";
export default {
  data() {
    return {
      title: '',
      //这个参数就是当前的作业的名称
      homeworkName: '',
      //控制上传的窗口的开启和关闭
      dialogFormVisible: false,
      //控制上传的文件传输的服务器的地址
      // uploadPath: "http://localhost:8800/api/oss/upload/", //如果这样写的话会出现跨域的问题,相当于没有经过前端直接向后端发起的请求
      // uploadPath: "/dev-api/api/oss/upload", //这样写就不会出现跨域的问题,前端里面已经配置过跨域了; 测试生产环境里面不行,会出问题
      uploadPath: "/prod-api/api/oss/upload", //这样写就不会出现跨域的问题,前端里面已经配置过跨域了; 测试生产环境里面不行,会出问题
      homeworkList: [], //所有作业的集合
      list: [],
      image: {},
      dialogVisible: false,
      page: 1,//当前页码
      total: 0,//总记录条数
      limit: 10,//分页的记录的大小
    };
  },
  watch: {
    homeworkName(newValue){
      console.log(newValue)
    }
  },
  methods: {
    fetchData(pageNum){
      //如果pageNum没有值的话,那么就赋值为1,如果pageNum有值的话,那么就是pageNum的值
      this.page = pageNum
      console.log(this.page)
      this.queryAllImaes()
    },
    edit(image){
      this.image = image
      this.dialogVisible = true
    },
    //查询用户的所有的图片
    queryAllImaes(){
      api.queryAllImages(this.page,this.limit).then(res=>{
        this.list = res.data.records
        this.page = res.data.current
        this.limit = res.data.size
        this.total = res.data.total
      })
    },
    //修改用户的图片
    updateImageName(){
      api.saveImages(this.image).then(res=>{
        this.$message.success('修改成功')
        this.dialogVisible = false
        //刷新页面
       this.queryAllImaes()
      })
    },
    checkHomeworkName(file){
      //上传文件之前的钩子,参数为上传的文件,如果返回false或者返回promise且被reject,则停止上传
      if (this.homeworkName.length === 0){
        //如果没有选择任何的作业的名称,则弹出提示信息并阻止上传
        this.$message.warning('请选择本次上传的图片的作业的名称,否则无法上传');
        return false;
      }
    },
    //文件上传成功后应该执行的方法
    uploadSuccess(response, file, fileList) {
      if (response.code === 0) {
        //说明上传成功
        this.$message.success(response.message || "上传成功");
      } else {
        //说明上传失败,这个地方服务器响应的报文的状态码仍是200
        this.$message.error("上传失败!!!");
      }
      this.dialogFormVisible = false;
    },
    //这个地方的失败是,服务器响应报文的状态码不是200的时候回调的方法
    uploadError(err, file, fileList) {
      this.$message.error("上传失败");
      this.dialogFormVisible = false;
    },
    //真正的上传的按钮执行的方法
    handlePreview() { },
    //单击外面的上传按钮后执行的动作,让上传框弹出来
    handleUpload() {
      this.dialogFormVisible = true;
    },
    /* handleDownload() {
      //点击下载按钮后执行的动作
      window.location = process.env.VUE_APP_BASE_API + "/admin/dict/export";
    }, */
  },
  created(){
    //一进来的时候就去查询所有的作业的名称
    api.queryHomeworkName().then(res =>{
      this.homeworkList = res.data
    })
    //查询所有的用户的所有的图片的信息
    this.queryAllImaes()
  }
};
</script>
