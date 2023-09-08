<template>
  <div>
    <div style="margin: 15px">
      <el-button type="primary" @click="handleUpload">upload<i class="el-icon-upload el-icon-right"></i></el-button>
      <!--<el-button type="primary" @click="handleDownload">download<i class="el-icon-download el-icon-right"></i></el-button>-->
    </div>


    <!-- 导入上传文件的对话框 -->
    <el-dialog title="上传作业" :visible.sync="dialogFormVisible">
      <el-input placeholder="请输入作业名称:" v-model="homeworkName" ></el-input>

      <el-upload class="upload-demo" drag :action="uploadPath"
      :data="{module: homeworkName }"
      :on-preview="handlePreview" :on-success="uploadSuccess"
        :on-error="uploadError" multiple style="margin-top: 10px">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          jpg/png files with a size less than 5MB
        </div>
      </el-upload>
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
      uploadPath: "/dev-api/api/oss/upload", //这样写就不会出现跨域的问题,前端里面已经配置过跨域了; 测试生产环境里面不行,会出问题
      // uploadPath: "/prod-api/api/oss/upload", //这样写就不会出现跨域的问题,前端里面已经配置过跨域了; 测试生产环境里面不行,会出问题
    };
  },
  methods: {
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
  }
};
</script>
