<template>
  <div style="margin-left: 20px">
    <div class="tools-div" >
      <h3>请选择需要查看提交情况的作业</h3>
      <!--选择框-->
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="homework in homeworkList" :label="homework.name" :key="homework.name">{{homework.name}}</el-checkbox>
      </el-checkbox-group>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()" style="margin-top: 10px">搜索</el-button>
    </div>


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
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名" width="180"/>
      <el-table-column prop="unSubmit" label="未提交作业" />

      <!--<el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)" title="修改" :disabled="$hasBP('bnt.sysUser.update')  === false"/>&lt;!&ndash; :disabled="$hasBP('bnt.sysUser.update')  === false" &ndash;&gt;
        </template>
      </el-table-column>-->
    </el-table>



  </div>
</template>
<script>
const cityOptions = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'];
import api from "@/api/system/sysUpload";
export default {
  data() {
    return {
      checkAll: false,
      checkedCities: [], //选中的作业的列表
      isIndeterminate: true,

      title: '',
      //这个参数就是当前的作业的名称
      homeworkName: '',
      //控制上传的窗口的开启和关闭
      dialogFormVisible: false,
      //控制上传的文件传输的服务器的地址
      // uploadPath: "http://localhost:8800/api/oss/upload/", //如果这样写的话会出现跨域的问题,相当于没有经过前端直接向后端发起的请求
      // uploadPath: "/dev-api/api/oss/upload", //这样写就不会出现跨域的问题,前端里面已经配置过跨域了; 测试生产环境里面不行,会出问题
      uploadPath: "/prod-api/api/oss/upload", //这样写就不会出现跨域的问题,前端里面已经配置过跨域了; 测试生产环境里面不行,会出问题
      homeworkList: [], //要查询的没交的作业的对象的集合
      list: [],
    };
  },
  methods: {
    handleCheckAllChange(val) {
      console.log(val)
      // this.checkedCities = val ? cityOptions : [];

      // this.checkedCities = val ? this.homeworkList : []; 这个状态全选的是对象,而我们只想要里面的name
      this.checkedCities = val ? this.homeworkList.map(item => item.name) : [];
      console.log(this.checkedCities)
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      /* console.log(value)

      console.log('-------------------')
      console.log(this.homeworkList) */
      this.checkedCities = value
      console.log(this.checkedCities)
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.homeworkList.length; //是否显示全选的状态
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.homeworkList.length; //是否显示横杠的状态
    },
    fetchData(){
      api.querySubmitStatus(this.checkedCities).then(res => {
        this.list = res.data
      })
    },
    //查询所有的作业的集合
    queryHomework(){
      api.queryHomeworkName().then(res =>{
        this.homeworkList = res.data

        /* let index = this.homeworkList.length - 1
        this.homeworkName = this.homeworkList[index] */
      })
    }

  },
  created(){
    // this.fetchData()
    this.queryHomework()
  }
};
</script>

