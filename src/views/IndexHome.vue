<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="home">
    <header>
      <h1><i>liu2ye的个人网站</i></h1>
      <h4>Email: <a href="mailto:liu2ye@outlook.com">liu2ye@outlook.com</a></h4>
    </header>

    <nav>
      <RouterLink to="/proj" class="square-2">项目</RouterLink>
      <RouterLink to="/blog" class="rect-col-2">博客</RouterLink>
      <RouterLink to="/algorithm" class="rect-col-2">算法</RouterLink>
      <RouterLink to="/tools">工具</RouterLink>
      <RouterLink to="/game">小游戏</RouterLink>
    </nav>
  </div>
</template>
<style lang="scss" scoped>
.home {
  padding: 50px;
  background-color: #840092;
  color: #fff;
}
header {
  margin-bottom: 50px;
  h1 {
    text-decoration: underline;
  }
}

nav {
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(5, 100px);
  grid-template-rows: repeat(5, 100px);
  gap: 20px;

  a {
    padding: 20px;
    border-radius: 10px;
    background-color: blueviolet;
    font-size: larger;
  }
  a:hover {
    transform: scale(1.05);
    outline: 1px solid #fff;
  }
}

.square-2 {
  grid-column-start: span 2;
  grid-row-start: span 2;
}
.rect-col-2 {
  grid-column-start: span 2;
}
.rect-row-2 {
  grid-row-start: span 2;
}
</style>
