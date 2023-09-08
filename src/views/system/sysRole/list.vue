<template>
    <div class="app-container">
    <!--查询表单-->
    <div class="search-div">
        <el-form label-width="70px" size="small">
            <el-row>
            <el-col :span="24">
                <el-form-item label="角色名称">
                <el-input style="width: 100%" v-model="searchObj.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
            </el-col>
            </el-row>
            <el-row style="display:flex">
            <el-button type="primary" icon="el-icon-search" size="mini"  @click="fetchData()">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
            </el-row>
        </el-form>
    </div>

    <!-- 添加的按钮 -->
    <div class="tools-div">
      <!-- 添加角色的按钮 -->
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysRole.add')  === false">添 加</el-button><!--  -->
      <!-- 批量删除的按钮 -->
      <el-button class="btn-add" size="mini" @click="batchRemove()" :disabled="$hasBP('bnt.sysRole.remove')  === false">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange">
      <!-- 和批量删除相关的复选框,包括上面的selection-change的那个方法 -->
      <el-table-column type="selection"/>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="createTime" label="创建时间" width="160"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" /><!-- :disabled="$hasBP('bnt.sysRole.update')  === false" -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" /><!-- :disabled="$hasBP('bnt.sysRole.remove')  === false" -->
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignAuth(scope.row)" title="分配权限" /><!-- :disabled="$hasBP('bnt.sysRole.assignAuth')  === false" -->
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
    <!-- 添加或修改的表单 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
          <el-form ref="dataForm" :model="sysRole" label-width="150px" size="small" style="padding-right: 40px;">
            <el-form-item label="角色名称">
              <el-input v-model="sysRole.roleName"/>
            </el-form-item>
            <el-form-item label="角色编码">
              <el-input v-model="sysRole.roleCode"/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
            <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
          </span>
    </el-dialog>
  </div>
  </template>

<script>
import api from '@/api/system/sysRole.js'

const defaultForm = {
  id: '',
  roleName: '',
  roleCode: ''
}

export default {
  // 定义数据模型
  data() {
    return {

        listLoading:true, // 数据是否正在加载
        list: [], // 角色列表
        total: 0, // 总记录数
        page: 1, // 页码
        limit: 5, // 每页记录数
        searchObj: {}, // 查询条件
        dialogVisible:false,//添加或修改的表单,默认隐藏
        sysRole:{},
        multipleSelection: [], //批量删除前选中的行的数组
    }
  },
    // 定义方法
  methods: {
    // 显示分配菜单的页面
    showAssignAuth(row) {
      this.$router.push('/system/assignAuth?id='+row.id+'&roleName='+row.roleName);
    },
    // 重置表单
    resetData() {
        console.log('重置查询表单')
        this.searchObj = {}
        this.fetchData()
    },
    fetchData(pageNum=1) { //表示pageNum如果没有传值，那么默认值就是1
        this.page = pageNum
        // 调用api
        api.getPageList(this.page, this.limit, this.searchObj).then(response => {
            //debugger
            this.listLoading = false
            this.list = response.data.records
            this.total = response.data.total
        })
    },
    //删除用户
    removeDataById(id){
      //先弹窗确认是否删除
      this.$confirm('此操作将永久删除该记录,是否继续?','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        //用户点击确定的时候执行这里面的代码
        api.removeById(id).then(response=>{
        this.fetchData(this.page)
        this.$message.success(response.message || '删除成功')
      })

      }).catch(()=>{
        //用户点击取消的时候执行这里面的代码
        this.$message.info('取消删除')
      })
    },

    //点击添加用户,调出添加或修改用户的页面
    add(){
      //调出添加或修改用户的页面
      this.dialogVisible = true;
      //清空之前旧的用户的信息
      this.sysRole = {}
    },


    //修改用户,调出添加或修改用户的页面
    edit(id){
      this.dialogVisible = true;
      //根据id查询一下这个用户的信息,用来回显
      api.getById(id).then((response)=>{
        this.sysRole = response.data;
        console.log(this.sysRole);
      })
    },

    //真正实现添加或者修改功能的方法是下面的这个
    saveOrUpdate(){
      //判读角色的id是否存在
      if(this.sysRole.id){
        //进来这里面,角色id存在,说明是修改的方法
        api.updateById(this.sysRole).then((response)=>{
          this.$message.success(response.message||'修改成功')
          this.dialogVisible = false;
          this.fetchData(this.page);
        })

      }else{
        //新增角色
        api.save(this.sysRole).then((response)=>{
          this.$message.success((response).message||'添加成功');
          this.dialogVisible = false;
          this.fetchData(this.page);
        })
      }
       /*this.dialogVisible = false;
      this.fetchData(this.page);*/
      console.log('代码为什么不走到这里来呢');
    },

    //批量删除
    handleSelectionChange(value){
      //将选中的要删除的数组赋值给multipleSelection
      this.multipleSelection = value;
    },

    batchRemove(){
      console.log('您选择了批量删除');
      console.log(this.multipleSelection);
      if(this.multipleSelection.length === 0){
        //如果数组的长度是零,则弹窗提示,请选择数据
        this.$message.warning('请先选择数据')
      }else{


        this.$confirm('该操作将永久删除数据,您确定吗?','提示',{
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          //这里面是点击了确认操作后执行的代码

          //遍历获得数组里面的元素的id
          let idList = [];
          this.multipleSelection.forEach(item=>{
            idList.push(item.id)
          })
          //调用方法执行批量删除
          api.batchRemove(idList).then(res=>{
            this.fetchData(this.page);
            this.$message.success(res.message || '删除成功')
          })

        }).catch(()=>{
          //这里面是点击了取消操作后执行的代码
          this.$message.info('取消操作成功')
        })

      }
    }

},
  //页面渲染之前获取数据
  created() {
    this.fetchData()
  }
}
</script>
