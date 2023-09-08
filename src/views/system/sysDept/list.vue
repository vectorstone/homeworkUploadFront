<template>
  <div class="app-container">

    <el-table
      :data="sysDeptList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >

      <el-table-column prop="name" label="名称" />
      <el-table-column prop="leader" label="部门负责人" width="160" />
      <el-table-column prop="phone" label="部门电话" width="160" />
      <el-table-column label="状态" width="140">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status === 1"
            @change="switchStatus(scope.row)"
            :disabled="$hasBP('bnt.sysDept.update') === false"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="160" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="success" icon="el-icon-plus" size="mini" title="添加下级部门"  @click="add(scope.row)" :disabled="$hasBP('bnt.sysDept.add') === false"/><!-- -->
          <el-button type="primary" icon="el-icon-edit" size="mini" title="修改"  @click="edit(scope.row)" :disabled="$hasBP('bnt.sysDept.update') === false"/><!---->
          <el-button type="danger" icon="el-icon-delete" size="mini" title="删除"  @click="removeDataById(scope.row.id)" :disabled="scope.row.children || $hasBP('bnt.sysDept.remove') === false"/><!---->
        </template>
      </el-table-column>
    </el-table>

    <!--修改或者添加的弹窗-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-form ref="dataForm" :model="sysDept" :rules="validateRules" label-width="150px" size="small" style="padding-right: 40px;">
        <el-form-item v-if="sysDept.id === ''" label="上级部门">
          <el-input v-model="sysDept.parentName" disabled="true" />
        </el-form-item>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="sysDept.name" />
        </el-form-item>
        <el-form-item label="部门领导">
          <el-input v-model="sysDept.leader" />
        </el-form-item>
        <el-form-item label="部门电话">
          <el-input v-model="sysDept.phone" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" icon="el-icon-refresh-right" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" icon="el-icon-check" size="small" @click="saveOrUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/system/sysDept'
const defaultForm = {
  id: '',
  name: '',
  parentId: '',
  parentName: '',
  leader: '',
  phone: '',
  treePath: ''
}

export default {
  data() {
    return {
      sysDeptList: [], // 部门的list,用来遍历显示的
      expandKeys: [], // 需要自动展开的项
      treePath: [], // 这个暂时还不知道是做什么用的
      dialogVisible: false, // 用来显示新增或修改的窗口的
      saveBtnDisabled: false, // 防止重复提交的
      dialogTitle: '', // 窗口的标题
      validateRules: { name: [{ required: true, trigger: 'blur', message: '必须输入' }] },
      sysDept: defaultForm
    }
  },
  methods: {
    switchStatus(row){
      row.status = row.status === 1 ? 0 : 1
      api.edit(row)
      this.fetchData()
    },
    fetchData(){
      api.findNodes().then(res => {
        this.sysDeptList = res.data
      })
    },
    add(row) {
      // 打开修改或添加的窗口
      this.dialogVisible = true
      // 将当前的sysDpet清空,避免新增的时候窗口里面出现其他对象的信息
      this.sysDept = Object.assign({}, defaultForm)
      // 窗口的标题为新增部门
      this.dialogTitle = '添加下级部门'

      this.sysDept.id = ''
      this.sysDept.parentId = row.id
      this.sysDept.parentName = row.name
      this.sysDept.treePath = row.treePath + row.id + ','
    },
    saveOrUpdate() {
      // 这个按钮用来防止表单的重复提交
      this.dialogVisible = false
      this.saveBtnDisabled = true
      if (this.sysDept.id == null || this.sysDept.id === '') {
        // 进来这里面说明是新增
        api.save(this.sysDept).then(res => {
          this.$message(res.message || '新增成功')
          this.fetchData()
        })
      } else {
        // 说明是修改
        api.edit(this.sysDept).then(res => {
          this.$message(res.message || '修改成功')
          this.fetchData()
        })
      }

    },
    edit(row) {
      // 打开修改或添加的窗口
      this.dialogVisible = true
      // 将当前对象复制给sysDpet,用来实现数据的回显
      this.sysDept = row
      // 窗口的标题为修改部门
      this.dialogTitle = '修改部门'
    },
    removeDataById(id) {
      this.$confirm('该操作将永久删除数据,您确定吗','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.remove(id).then(res => {
          this.$message(res.message || '删除成功啦啦')
          this.fetchData()
        })
      }).catch(() => {
        this.$message('已取消操作')
      })
    }

  },
  created() {
    this.fetchData()
  }
}
</script>
