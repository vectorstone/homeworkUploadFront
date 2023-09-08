<template>
  <div class="app-container">

    <div class="search-div">
      <el-form label-width="70px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="岗位名称">
              <el-input style="width: 90%" v-model="searchObj.name" placeholder="岗位名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="岗位编码">
              <el-input style="width: 100%" v-model="searchObj.postCode" placeholder="岗位编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="searchObj.status" placeholder="状态">
                <el-option  label="正常" value="1"></el-option>
                <el-option  label="停用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="display:flex">
          <el-button type="primary" icon="el-icon-search" size="mini" :loading="loading" @click="fetchData()">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetData">重置</el-button>
        </el-row>
      </el-form>
    </div>

    <!-- 工具条 -->
    <div class="tools-div">
      <el-button type="success" icon="el-icon-plus" size="mini" @click="add" :disabled="$hasBP('bnt.sysPost.add') === false">添 加</el-button>
    </div>

    <!-- banner列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      stripe
      border
      style="width: 100%;margin-top: 10px;">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="岗位名称" />
      <el-table-column prop="postCode" label="岗位编码" />
      <el-table-column label="状态" width="140">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)" :disabled="$hasBP('bnt.sysPost.update') === false">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)" title="修改" :disabled="$hasBP('bnt.sysPost.update') === false"/>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeDataById(scope.row.id)" title="删除" :disabled="$hasBP('bnt.sysPost.remove') === false"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />

    <!-- 添加修改会弹出来的列表 -->
    <el-dialog title="添加/修改" :visible.sync="dialogVisible" width="40%" >
      <el-form ref="dataForm" :model="sysPost" :rules="validateRules" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="sysPost.name"/>
        </el-form-item>
        <el-form-item label="岗位编码">
          <el-input v-model="sysPost.postCode"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="sysPost.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
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
import api from '@/api/system/sysPost'
export default{
    data(){
        return {
            searchObj: {},
            list: [],
            page: 1,
            limit: 5,
            total: 0,
            dialogVisible: false,
            sysPost: {},
            listLoading: false,
            loading: false,
            validateRules: {name: [{ required: true, trigger: 'blur', message: '必须输入' }]}
        }
    },
    methods:{
        switchStatus(row){
            row.status = row.status === 1 ? 0 : 1
            api.edit(row)
            this.fetchData(this.page)
        },
        changeSize(value){
            console.log(value);
            debugger
            this.limit = value
            this.fetchData(1)
        },
        add() {
            this.dialogVisible = true
            this.sysPost = {}
        },
        fetchData(pageNum = 1) {
            this.page = pageNum
            api.getSysPostList(this.page,this.limit,this.searchObj).then(res=>{
                this.list = res.data.records
                this.page = res.data.current
                this.limit = res.data.size
                this.total = res.data.total
            })
        },
        edit(row) {
            this.dialogVisible = true
            this.sysPost = row
        },
        removeDataById(id) {
            this.$confirm('该操作将永久删除数据,您确定吗?','提示',{
                comfirmButtonText: '确认',
                cancelButtonText:  '取消',
                type: 'warning'
            }).then(()=>{
                api.remove(id).then(res=>{
                    this.$message(res.message || '删除成功')
                    this.fetchData(this.page)
                })
            }).catch(()=>{
                this.$message('取消成功')
            })
        },
        resetData() {
            this.searchObj = {}
            this.fetchData(this.page,this.searchObj)
        },
        saveOrUpdate(){
            this.dialogVisible = false
            if(this.sysPost.id == null){
                //id为空,说明是新增
                api.add(this.sysPost).then(res=>{
                    this.$message.success(res.message || '成功啦')
                    this.fetchData(this.page)
                })
            }else{
                //id不为空,说明是修改
                api.edit(this.sysPost).then(res=>{
                    this.$message.success(res.message || '成功啦')
                    this.fetchData(this.page)
                })
            }
        }
    },
    created() {
        this.fetchData(this.page,this.searchObj);
    }
}

</script>
