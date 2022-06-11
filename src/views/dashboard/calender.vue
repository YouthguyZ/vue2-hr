<template>
  <el-calendar v-model="value">
    <!-- <template
      slot="dateCell"
      slot-scope="{date, data}" -->
    <!-- #dateCell="{date, data}" -->
    <template
      #dateCell="{date}"
    >
      {{ date.getDate() }} <span class="rest">{{ isRest(date)?'休':'' }}</span>
    </template>
  </el-calendar>
</template>

<script>
export default {
  data() {
    return {
      value: new Date()
    }
  },
  methods: {
    isRest(date) {
      return date.getDay() === 0 || date.getDay() === 6
    }
  }
}
</script>

<style lang='scss' scoped>
.rest{
  background-color: red;
  border-radius: 50%;
  color: aliceblue;
}
</style>
