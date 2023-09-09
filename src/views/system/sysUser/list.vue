<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="关 键 字">
              <el-input style="width: 95%" v-model="searchObj.keyword" placeholder="用户名/姓名/手机号码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-right: 10px;width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!--工具条-->
    <div class="tools-div">
      <!--添加的按钮-->
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysUser.add')  === false">添 加</el-button>
      <!-- 批量删除的按钮 -->
      <el-button class="btn-add" size="mini" @click="batchRemove()" >批量删除</el-button>
    </div>

    <!-- 列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;"
    @selection-change="handleSelectionChange">
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

      <el-table-column prop="username" label="用户名" width="180"/>
      <el-table-column prop="name" label="姓名" width="110"/>
      <el-table-column prop="phone" label="组别"/>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"/>

      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)" title="修改" :disabled="$hasBP('bnt.sysUser.update')  === false"/><!--  -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)"
                     title="删除" :disabled="$hasBP('bnt.sysUser.remove')  === false"/><!--  -->
          <el-button type="warning" icon="el-icon-baseball" size="mini" @click="showAssignRole(scope.row)" title="分配角色" :disabled="$hasBP('bnt.sysUser.assignRole')  === false"/><!--  -->
          <el-button type="primary" icon="el-icon-reading" size="mini" @click="showImages(scope.row)" title="查看作业" /><!--  -->
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

    <!--修改和新增共用的那个表格-->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysUser" label-width="100px" size="small" style="padding-right: 40px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="sysUser.username"/>
        </el-form-item>
        <el-form-item v-if="!sysUser.id" label="密码" prop="password">
          <el-input v-model="sysUser.password" type="password"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="sysUser.name"/>
        </el-form-item>
        <el-form-item label="组别" prop="phone">
          <el-input v-model="sysUser.phone"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small" icon="el-icon-refresh-right">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="saveOrUpdate()" size="small">确 定</el-button>
      </span>

    </el-dialog>

    <!--修改用户角色的组件-->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="sysUser.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="assignRole" size="small">保存</el-button>
        <el-button @click="dialogRoleVisible = false" size="small">取消</el-button>
      </div>
    </el-dialog>

    <!--显示用户的作业列表的弹窗-->
    <el-dialog title="作业列表" :visible.sync="dialogImagesRoleVisible">
      <el-form label-width="80px">
        <el-form-item label="学生姓名">
          <el-input disabled :value="sysUser.name"></el-input>
        </el-form-item>

        <el-form-item label="作业列表">
          <!--<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>-->
          <!--<div style="margin: 15px 0;"></div>-->
          <!--<el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="userImage in imagesList" :key="role.id" :label="role.id">{{role.roleName}}</el-checkbox>
          </el-checkbox-group>-->
          <div class="demo-fit">
            <div class="block" v-for="image in imagesList" :key="fit">
              <div>
                <span class="title">图片名称: {{ image.imageName }}</span>
              </div>
              <!--<el-form-item label="图片名称">
                <el-input disabled :value="image.imageName"></el-input>
              </el-form-item>-->
              <!--<el-avatar shape="square" :size="400" :fit="image" :src="image.url" z-index= 4000
                         :preview-src-list="[image.url]"></el-avatar>-->
              <el-image
                style="width: 300px; height: 300px"
                :src="image.url"
                :preview-src-list="[image.url]">
              </el-image>
            </div>
          </div>

        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogImagesRoleVisible = false" size="small">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import api from '@/api/system/sysUser.js'
import roleApi from '@/api/system/sysRole.js'

export default {
  data() {
    return {
      listLoading: true, //indicator data load status,true enable the circle,false disable the circle
      page: 1, //current page number
      limit: 9, // current page show data size
      list: [], // sysUser List
      searchObj: {}, // search bar condition object
      createTimes: [], //search bar time picker array,include createTimeBegin and createTimeEnd
      sysUser: {}, // update or add sysUser object
      dialogVisible: false, // control the update or add page display or hidden
      total: 0, //分页中显示总条数的属性
      multipleSelectionList: [], //批量删除相关的数组
      //下面的是和用户修改用户角色相关的vue数据
      dialogRoleVisible: false,
      userRoleIds: [],//当前用户所拥有的角色的id
      allRoles: [],//所有的角色的数组
      isIndeterminate: false,//控制checkbox里面的横杠的显示
      checkAll: false,//控制checkbox里面的是否打勾的状态
      imagesList: [], //用户作业的url路径的集合
      dialogImagesRoleVisible: false, //显示用户的作业的弹窗的
    }
  },
  methods: {
    showImages(sysUser){
      //根据用户的id去查询对应的作业的图片
      this.dialogImagesRoleVisible = true;
      this.sysUser = sysUser
      api.queryImagesByUserId(sysUser.id).then(res => {
        this.imagesList = res.data
      })
    },
    //1.下面的是和用户角色修改相关的方法
    // 1.1展示用户的角色修改的列表
    showAssignRole(row){
      this.sysUser = row
      //首先,显示分配角色的页面
      this.dialogRoleVisible = true
      // 根据用户的id,查询获取allRoles和userRoleIds信息

      roleApi.getAssign(row.id).then(res=>{
        this.userRoleIds = res.data.userRoleIds
        this.allRoles = res.data.allRoles
        this.checkAll = this.userRoleIds.length===this.allRoles.length
        this.isIndeterminate = this.userRoleIds.length>0 && this.userRoleIds.length<this.allRoles.length
      })
    },


    // 1.2 选中全部角色
    handleCheckAllChange(value){
      console.log(value);
      this.userRoleIds = []
      //如果去选框被选中,那么将所有角色的id,放到userRoleIds里面,否则,userRoleIds就是一个空数组
      if(value){
        this.allRoles.forEach(item=>{
          this.userRoleIds.push(item.id)
        })
      }
      // this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 能进来这里面,要么全选了,要么没全选,总之,横杠都不会也不应该出现
      this.isIndeterminate = false
    },
    // 1.3 部分选中相关角色
    handleCheckedChange(value){
      console.log(value);
      // this.userRoleIds = value
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },
    // 1.4保存修改
    assignRole(){
      roleApi.doAssign({
        userId: this.sysUser.id,
        roleIdList: this.userRoleIds
      }).then(res=>{
        this.$message.success(res.message || '成功啦')
        this.dialogRoleVisible = false
        this.fetchData(this.page)
      })
    },
    // 2.下面的是和用户信息相关的CRUD
    // reset search bar condition
    resetData() {
      //重置时间选择
      this.createTimes=[]
      //重置搜索的对象
      this.searchObj = {}
      //重新获取数据
      this.fetchData(this.page)
    },
    fetchData(pageNum = 1) {
      this.page = pageNum
      if (this.createTimes && this.createTimes.length === 2) {
        this.searchObj.createTimeBegin = this.createTimes[0]
        this.searchObj.createTimeEnd = this.createTimes[1]
      }

      api.getPageList(this.page, this.limit, this.searchObj).then(res => {
        this.list = res.data.records
        this.page = res.data.current
        this.limit = res.data.size
        // 数据加载完成,这个加载的小圈圈就可以关闭了
        this.listLoading = false
        this.total = res.data.total
      })
    },
    // add sysUser function
    add() {
      //show update or add page
      this.dialogVisible = true
      //清空sysUser对象,避免数据回显
      this.sysUser = {}
    },
    //修改的按钮
    edit(id) {
      //显示新增或添加的那个页面
      this.dialogVisible = true
      //根据id去查询要修改的对象的信息,然后进行数据回显
      api.getSysUserById(id).then(res => {
        this.sysUser = res.data
      })
    },
    //修改或新增结束后,点击saveOrUpdate按钮会执行接下来的这个方法
    saveOrUpdate() {
      if (this.sysUser.id) {
        //进来这里面,说明是修改的操作,因为有id
        api.editUser1(this.sysUser).then(res => {
          //提示成功的信息
          this.$message.success(res.message || 'succeed')
          //关闭新增或修改的那个页面
          this.dialogVisible = false
          //重新获取数据,更新页面,一定要把当前页的页码传过去,否则页面一直都显示的是第一页
          this.fetchData(this.page)
        })
      } else {
        //进来这里面,说明是新增的操作,因为没有id
        api.addUser(this.sysUser).then(res => {
          this.$message.success(res.message || 'succeed')
          this.dialogVisible = false
          this.fetchData(this.page)
        })
      }
      /*this.dialogVisible = false
      this.fetchData(this.page)*/
    },
    //改变用户的状态
    switchStatus(row) {
      //改变用户的status,如果status是1,则将它改成0,如果是0,则将它改成1
      row.status = row.status === 1 ? 0 : 1
      //修改后端数据库中的用户的status,保持同步
      api.editUser(row)
      //刷新数据
      this.fetchData(this.page)
    },
    //根据id删除用户
    removeDataById(id){
      this.$confirm('this operation will delete data permanently,are you sure','message',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        //进来这里面说明点击的是确定的按钮
        api.removeById(id).then(res=>{
          this.$message.success(res.message || '删除成功')
          //重新渲染数据
          this.fetchData(this.page)
        })
      }).catch(()=>{
        //进来这里面说明点击的是取消的按钮
        this.$message.info('取消成功')
      })
    },
    //
    handleSelectionChange(value){
      this.multipleSelectionList = value
      console.log(this.multipleSelectionList);
    },
    //批量删除用户
    batchRemove(){
      if(this.multipleSelectionList.length === 0){
        this.$message.warning('您还没选择任何数据')
      }else{
        this.$confirm('该操作将永久删除数据,您确定吗?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }).then(()=>{
          let idList = []
          this.multipleSelectionList.forEach(item=>{
            idList.push(item.id)
          })
          api.removeBatch(idList).then(res=>{
            this.$message.success(res.message || '删除成功')
            this.fetchData(this.page)
          })
        }).catch(()=>{
          this.$message.info('取消成功')
        })
      }
    }

  },
  created() {
    this.fetchData(this.page)
  }
}

</script>

