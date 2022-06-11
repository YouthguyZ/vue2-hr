<template>
  <!-- 放置一个图标 -->
  <div style="display:inline-block">
    <!-- :icon-class="isFullScreen ? 'exit-fullscreen' : 'fullscreen'" -->
    <svg-icon
      icon-class="fullscreen"
      class="fullscreen"
      @click="toggle"
    />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'ScreenFull',
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    toggle() {
      screenfull.toggle()
      // this.isFullscreen = !this.isFullscreen
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
