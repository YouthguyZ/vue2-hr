<template>
  <div>
    <!-- on-success: 上传成功的回调 -->
    <!-- before-upload: 上传前的回调 -->
    <!-- http-request: 覆盖默认的上传行为, 自定义发请求的回调 -->
    <!-- :on-success="handleAvatarSuccess": 如果是自定义上传, 则该回调不会执行 -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <el-progress v-if="percent && percent < 100" type="circle" :percentage="percent" />
      <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
      <img v-if="value && percent === 0" :src="value" class="avatar">
      <i v-show="!percent" v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
// 下面的代码是固定写法
// const COS = require('cos-js-sdk-v5')
import COS from 'cos-js-sdk-v5'
// 填写自己腾讯云cos中的key和id (密钥)
const cos = new COS({
  SecretId: 'AKIDWrwlKceRyEDvNYS4QVJq76oFOHTO3TcU', // 身份识别ID
  SecretKey: 'cy3qMbbJkunPjmZ4IFvLTKuDF0ThdIgm' // 身份密钥
})
export default {
  name: 'UploadImg',
  // v-modl 语法糖 接受父组件传过来的value
  props: {
    value: {
      type: String,
      // required: true
      default: ''
    }
  },
  data() {
    return {
      // imageUrl: '',
      percent: 0 // 上传进度
      // showProgress: false // 是否展示进度条
    }
  },
  methods: {
    // upload(file) {
    //   console.log(file)
    // },
    upload(res) {
      if (!res.file) return
      // 执行上传操作
      cos.putObject({
        Bucket: 'vuehr-1312368083', /* 存储桶 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: res.file.name, /* 文件名 */
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: res.file, // 上传文件对象
        onProgress: (progressData) => {
          // console.log(progressData)
          // 进度条
          this.percent = parseInt(progressData.percent * 100)
        }
      }, (err, data) => {
        console.dir(err || data)
        // 上传成功之后
        if (data.statusCode === 200) {
          // 进度复位
          this.percent = 0
          // this.imageUrl = `https:${data.Location}`
          // 子组件触发父组件
          this.$emit('input', `https:${data.Location}`)
        }
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 头像上传成功之前
    beforeAvatarUpload(file) {
      const isImg = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImg) {
        this.$message.error('只能上传图片格式文件')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
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
  border-color: #409eff;
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
  /* width: 178px;
  height: 178px; */
  width: 160px;
  height: 160px;
  display: block;
}
.el-progress-circle {
  width: 160px !important;
  height: 160px !important;
}
</style>
