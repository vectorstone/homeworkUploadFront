<template>
  <div class="dashboard-container">
    <div class="dashboard-text">welcome: {{ name }}</div>
    <!--  -->
    <!--<el-image
      style="width: 1150px; height: 650px"
      src="https://obsidiantuchuanggavin.oss-cn-beijing.aliyuncs.com/img/Tom-Hanks-900x500.jpg"
      :fit="fit"></el-image>-->

    <div>
      <el-select  placeholder="请选择要查看的作业的名称" v-model="homeworkName">
        <el-option :label="homework.name" :value="homework.name" v-for="homework in homeworkList"></el-option>
      </el-select>
      <!--<el-select v-model="value" placeholder="Select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>-->
    </div>
    <el-carousel :interval="6000" type="card" height="500px" >
      <el-carousel-item v-for="item,index in homeworkImages" >
        <h3 class="medium">{{index+1}} {{ item.username }}</h3>
        <el-image
          style="width: 400px; height: 400px"
          :src="item.url"
            @click="handleMagnify(item)"></el-image>
      </el-carousel-item>
    </el-carousel>

    <el-dialog title="作业列表" :visible.sync="dialogImagesRoleVisible">
      <el-form >
        <el-form-item align="center">
          <div class="demo-fit">
            <div class="block">
              <div>
                <span class="title">{{ image.username }}: {{ image.imageName }}</span>
              </div>
              <el-image
                style="width: 400px; height: 400px"
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
import { mapGetters } from 'vuex'
import api from "@/api/system/sysUpload";
export default {
  data(){
    return {
      homeworkList: [],
      homeworkName: '',
      homeworkImages: [],
      dialogImagesRoleVisible: false,
      image: {},
    }
  },
  methods: {
    //放大图片的方法
    handleMagnify(item){
      this.image = item
      this.dialogImagesRoleVisible = true
    },
    //查询所有的作业的集合
    queryHomework(){
      api.queryHomeworkName().then(res =>{
        this.homeworkList = res.data

        /* let index = this.homeworkList.length - 1
        this.homeworkName = this.homeworkList[index] */
      })
    },
    queryImages(){
      //当homeworkName发生变化的时候,加查询对应名称下的所有的图片
      api.queryImagesByName(this.homeworkName).then(res =>{
        this.homeworkImages = res.data
      })
    }
  },
  created(){
    //一进来页面的时候就查询最近的一次的作业的所有的图片的集合
    api.queryLatestImages().then(res => {
      this.homeworkImages = res.data.imatesList
      this.homeworkName = res.data.homeworkName
    })
    //查询所有的作业的集合,并给homeworkName进行初始的赋值
    this.queryHomework()
  },
  watch: {
    homeworkName(newValue){
      this.queryImages()
    }
  },
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
