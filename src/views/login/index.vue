<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">学生作业上传查看系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <!--<el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button :loading="loading"  type="primary" style="width:40%;margin-bottom:30px;margin-right: 80px" >registry</el-button>-->
      <el-button :loading="loading"  type="primary" style="width:40%;margin-bottom:30px;margin-right: 80px" @click.native.prevent="handleregister">registry</el-button>
      <el-button :loading="loading"  type="primary" style="width:40%;margin-bottom:30px;" @click.native.prevent="handleLogin">login</el-button>

      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div> -->

      <!--注册的组件-->
      <el-dialog title="用户注册" :visible.sync="dialogRoleVisible" custom-class="registryDialog">
        <!--<el-form label-width="80px">
          <el-form-item label="用户名">
            <el-input  :value="sysUser.username"></el-input>
          </el-form-item>
          <div>
            <el-form-item label="密码">
              <el-input  :value="sysUser.password"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="真实姓名">
            <el-input  :value="sysUser.name"></el-input>
          </el-form-item>
          <el-form-item label="头像地址">
            <el-input  :value="sysUser.headUrl"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" @click="assignRole" size="small">保存</el-button>
          <el-button @click="dialogRoleVisible = false" size="small">取消</el-button>
        </div>-->
        <el-form :model="ruleForm" status-icon :rules="rules" ref="registryForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="username" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入数字字符组成的用户名"></el-input>
          </el-form-item>
          <el-form-item label="name" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入真实的姓名"></el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Confirm" prop="description">
            <el-input type="password" v-model="ruleForm.description" autocomplete="off"></el-input>
          </el-form-item>
          <!--<el-form-item label="组别" prop="phone">
            <el-input  v-model="ruleForm.phone" autocomplete="off" placeholder="组名,例如: 4"></el-input>
          </el-form-item>-->
          <el-form-item label="组别" prop="phone" >
            <el-select v-model="ruleForm.phone" placeholder="请选择组别">
              <el-option label="No.1" value="1"></el-option>
              <el-option label="No.2" value="2"></el-option>
              <el-option label="No.3" value="3"></el-option>
              <el-option label="No.4" value="4"></el-option>
              <el-option label="No.5" value="4"></el-option>
              <el-option label="No.6" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="头像链接" prop="headUrl">
            <el-input  v-model="ruleForm.headUrl" autocomplete="off" placeholder="头像的链接地址,不设置也可以,有默认值"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import api from '@/api/system/sysUser'
export default {
  name: 'Login',
  data() {

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password'));
      } else {
        /* if (this.ruleForm.description !== '') {
          this.$refs.ruleForm.validateField('description');
        } */
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('Two inputs don\'t match!'));
      } else {
        callback();
      }
    };
    //使用正则表达式来判断头像的url里面是否包含中文
    var validateHeadurl = (rule,value,callback) => {
      var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if(patrn.exec(value)){
        callback(new Error('请输入头像图片的链接'))
      } else {
        callback()
      }
    };

    const validateUsername = (rule, value, callback) => {
      var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;
      if (value.length < 5) {
        callback(new Error('请输入至少5个字符的用户名'))
      } else if(patrn.exec(value)){
        callback(new Error('用户名中不可以包含中文'))
      } else {
        callback()
      }
    };

    const validateName = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error('请输入用户名'))
      }  else {
        callback()
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入至少6个字符的密码'))
      } else {
        callback()
      }
    };
    const validateGroup = (rule, value, callback) => {
      var patrn = /[0-9]*/gi;
      if (!patrn.exec(value)) {
        callback(new Error('请输入数字组号'))
      } else {
        callback()
      }
    };
    return {
      dialogFormVisible: true,
      //-----------------表单校验相关的
      ruleForm: {
        username: '',
        password: '', //使用password替换pass,匹配后端的password字段
        description: '', //使用description替换checkPass,用户表里面并没有这个checkPass的字段
        name: '',
        headUrl: '',
        // phone: 0 //使用phone来作为组别
      },
      rules: {
        username: [{required: true,validator: validateUsername,trigger: 'blur'}],
        name: [{required: true,validator: validateName,trigger: 'blur'}],
        password: [{required: true,validator: validatePass, trigger: 'blur'}],
        description: [{required: true,validator: validatePass2, trigger: 'blur'}],
        headUrl: [{validator: validateHeadurl,trigger: 'blur'}],
        phone: [{required: true,validator: validateGroup,trigger: 'blur'}]
      },
      //----------------
      dialogRoleVisible: false,
      sysUser: {},
      loginForm: {
        username: 'admin',
        password: '111111'
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
    }
      },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    resetForm(){
      this.ruleForm = {}
    },
    submitForm(){

      this.$refs["registryForm"].validate((valid, msg) => {
        if (valid) {
          console.log("submit");
          console.log(this.ruleForm);
          api.addUser(this.ruleForm).then(res => {
            this.$message.success(res.message || 'succeed')
            this.dialogRoleVisible = false
          })
        } else {
          console.log("error submit!!");
          console.log(msg);
          for (let key in msg) {
            alert(msg[key][0].message);
            return false;
          }
        }
      });

    },
    handleregister(){
      this.dialogRoleVisible = true
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .registryDialog{
    border: 1px solid rgba(79, 52, 52, 0.1);
    //background: rgba(0, 0, 0, 0.1);
    background: #1b1c1c;
    border-radius: 5px;
    color: #774848;
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
