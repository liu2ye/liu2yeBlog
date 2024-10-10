<script setup></script>
<template>
  <div class="page-A4">
    <div class="base-info">
      <div class="info">
        <div class="text-xl font-bold mb-1">王双龙</div>
        <div>电话: 19071468225丨邮箱: liu2ye@outlook.com丨现居城市: 郑州</div>
        <div>当前状态: 离职丨求职意向: Java后端开发、前端开发</div>
      </div>

      <img src="/img/cv.jpg" class="avater" />
    </div>

    <div class="section">
      <div class="title">教育经历</div>
      <div class="col-2">
        <span class="font-bold">河南科技大学</span>
        <span>2019年09月 - 2023年06月</span>
      </div>
      <div class="col-2"><span>软件工程 本科</span><span>洛阳</span></div>
    </div>

    <div class="section relative">
      <div class="title">专业技能</div>
      <p>熟悉JavaSE，基础扎实，编码规范，熟悉基本类库</p>
      <p>熟练使用Eclips、IDEA、vscode等编程工具</p>
      <p>掌握SSM框架、SpringBoot，了解SpringCould及相关微服务组件</p>
      <p>熟练使用MybatisPlus、Hutool工具包等工具类库</p>
      <p>了解Redis、RabbitMQ等中间件</p>
      <p>熟练使用Maven、SVN、Git等项目管理工具</p>
      <p>熟练使用html、css、js等前端技术</p>
      <p>熟悉Vue3框架，拥有组件化思想，能熟练使用ElementUI或AntDesign构建前端页面</p>

      <div class="absolute bottom-0 right-0 flex flex-col justify-center items-center">
        <span>我的个人网站👇</span>
        <img class="w-30 h-30" src="/img/网站二维码.png" />
        <span>http://123.57.145.93</span>
      </div>
    </div>

    <div class="section">
      <div class="title">工作经历</div>
      <div class="subsection">
        <div class="col-2">
          <span class="font-bold">河南爱弥儿教育有限公司</span>
          <span>2024年04月 - 2024年09月</span>
        </div>
        <div class="col-2"><span>java开发工程师</span><span>郑州</span></div>
        <p>
          负责“漫展票务”和“单身联盟”两个项目的开发工作，主要内容是根据客户需求实现相关功能。“漫展票务”的主要功能有售票、验票、退票，对接银行的支付接口完成付费和退款，生成报表。“单身联盟”的主要功能有会员积分、推广和朋友推荐。
        </p>
      </div>
      <div class="subsection">
        <div class="col-2">
          <span class="font-bold">中山志源电子科技有限公司</span>
          <span>2023年06月 - 2024年02月</span>
        </div>
        <div class="col-2">
          <span>软件开发工程师 云编译组</span>
          <span>广东中山</span>
        </div>
        <p>
          云编译系统迁移，将原先使用Django框架构建的云编译系统使用Vue+SpringBoot重构。我作为组长负责领导组员梳理需求，沟通其他部门，设计前后端交互方式，与小组成员沟通设计API接口文档。对前后端的整体框架进行设计和实现。大大减少了了老项目中用户需求编译出错的情况。
        </p>
      </div>
    </div>

    <div class="section">
      <div class="title">开源项目及作品</div>
      <div class="col-2"><span>码农笔记</span><span>2022年07月 - 2023年05月</span></div>
      <div>毕设作品</div>
      <p>一个桌面端的Markdown编辑器+技术论坛。</p>
      <p>前端：Vue3+TypeScript、Electron、Vite、Pinia、ElementPlus、Axios、vue-router</p>
      <p>后端：SpringBoot、ElasticSearch、Shiro、MybatisPlus</p>
      <p>主要功能有：笔记的本地编辑保存、上传。论坛功能，同时集成ChatGPT-API3.5。</p>
      <p>
        本项目可以认为是一个前端项目，后端除了ElasticSearch基本都是简单的增删改查配合MP很快就可以完成。ElasticSearch主要用在笔记搜索和论坛帖子搜索上，用来实现快速的全文搜索。
      </p>
      <p>
        前端难点在于Vue3+ts和Electron的整合，对于当时的我来说是一项不小的挑战。除基本功能外还制作了一键换肤、音乐播放、AI聊天等提高用户体验的小功能。
      </p>
    </div>

    <div class="section">
      <div class="title">个人总结</div>
      <p>
        有一定的沟通协调能力、问题解决能力和团队合作精神。积极了解专业前沿动态，始终保持对新技术的好奇心和学习热情，善于学习新技术，喜欢在个人项目中尝试使用新技术。经常使用编程技术解决生活中的问题。
      </p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page-A4 {
  width: 210mm;
  height: 297mm;
  padding: 12mm 13mm;
  background: #fff;
  line-height: 1.5rem;
  // font-size: 0.75rem;
}

.base-info {
  min-height: 96px;
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avater {
    position: absolute;
    width: 80px;
    height: 96px;
    right: 0;
    top: 0;
    z-index: 2;
  }
}

.section {
  margin-top: 1rem;

  .title {
    font-size: large;
    font-weight: bold;
    border-bottom: 1.5px solid #000;
    margin-bottom: 0.25rem;
  }
  .subsection {
    margin-bottom: 0.5rem;
  }
  p {
    margin: 0;
  }
}

.col-2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
