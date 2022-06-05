<template>
  <div style="margin-top:70px">
    <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
// 导入格式时间函数
import { formatExcelDate } from '../../utils'
import { importEmployee } from '../../api/employees'
export default {
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    async handleSuccess({ results, header }) {
      console.log('这是中文的结果', results, header)
      console.log('这是转英文的结果', this.transExcel(results))
      // this.tableData = results
      // this.tableHeader = header
      try {
        const data = this.transExcel(results)
        const res = await importEmployee(data)
        console.log(res)
        // 根据结果提示用户信息
        this.$message.success(res.message)

        // 后退页面到employee
        this.$router.back()
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    // excel表格处理
    transExcel(reslut) {
      // 把一个对象数组中的每个对象的属性名，从中文改成英文
      // 思路：对于原数组每个对象来说
      //    （1） 找出所有的中文key
      //     (2)  得到对应的英文key
      //     (3)  拼接一个新对象： 英文key:值
      const mapInfo = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      return reslut.map(zhObj => {
        const enObj = {}
        // 获取中文数组的所有键值
        // 1. 拿到所有的中文 key
        // Object.keys() 获取对象所有的属性名
        // zhKeys: ['入职日期', '姓名', '工号', '手机号', '转正日期', '部门']
        const zhKeys = Object.keys(zhObj)
        // 2. 将中文 key 转为英文 key
        zhKeys.forEach(zhKey => {
          // 根据入职日期中文, 取出对应的英文 timeOfEntry
          const enkey = mapInfo[zhKey]
          if (enkey === 'timeOfEntry' || enkey === 'currectionTime') {
            // 3. 拼装成英文对象
            enObj[enkey] = new Date(formatExcelDate(zhObj[zhKey]))
          } else {
            enObj[enkey] = zhObj[zhKey]
          }
        })
        return enObj
      })
    }
  }
}
</script>

<style>

</style>
