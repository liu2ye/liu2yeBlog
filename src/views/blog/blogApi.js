export function getBlogs() {
  return new Promise((resolve, reject) => {
    resolve([
      {
        title: '设计模式',
        desc: '设计模式（Design pattern）是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结。使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性。 毫无疑问，设计模式于己于他人于系统都是多赢的，设计模式使代码编制真正工程化，设计模式是软件工程的基石，如同大厦的一块块砖石一样。项目中合理的运用设计模式可以完美的解决很多问题，每种模式在现在中都有相应的原理来与之对应，每一个模式描述了一个在我们周围不断重复发生的问题，以及该问题的核心解决方案，这也是它能被广泛应用的原因。',
        cover: '',
        link: '/blog/设计模式'
      },
      {
        title: 'Mybatis',
        desc: 'MyBatis是一款优秀的持久层框架，它支持定制化SQL、存储过程以及高级映射。几乎避免了所有的JDBC代码',
        cover: 'https://avatars.githubusercontent.com/u/1483254?s=200&v=4',
        link: '/blog/Mybatis'
      },
      {
        title: '色彩配色设计',
        desc: '无论是网页还是海报，甚至是穿搭，了解色彩能有效提高审美',
        cover: '/img/color.jpeg',
        link: '/blog/色彩设计'
      },

      {
        title: '项目热部署',
        desc: 'IDEA SpringBoot项目修改代码后自动重新启动的设置过程',
        cover: '',
        link: '/blog/项目热部署'
      },
      {
        title: 'Java日志框架',
        desc: '在Java日志框架出现之前，开发人员通常使用System.out.println()方法来输出日志信息。这种方法简单易行，但缺乏灵活性和控制力，例如无法对日志进行分级、格式化或输出到不同的目标（如文件、控制台等）。',
        cover: '',
        link: '/blog/Java日志框架'
      },
      {
        title: 'Logback配置',
        desc: 'Logback是一个为Java应用程序设计的日志框架，它提供了高性能、灵活性和可扩展性。Logback的配置文件通常采用XML格式（通常命名为logback.xml），允许用户以声明式的方式配置日志输出。',
        cover: '',
        link: '/blog/Logback'
      },
      {
        title: 'LOG4J配置',
        desc: 'LOG4J，全称为log for java，即Java日志。它是一个提供灵活日志记录功能的框架，允许开发者控制日志信息的目的地、输出格式和生成过程。通过配置文件，开发者可以在不修改应用代码的情况下实现日志的灵活配置。',
        cover: '',
        link: '/blog/LOG4J'
      },
      {
        title: '数据库中的事务',
        desc: '数据库事务（Transaction）是数据库管理系统（DBMS）中用于保证数据一致性和完整性的重要机制。事务是指作为单个逻辑工作单元执行的一系列操作，这些操作要么全都成功，要么全都失败，从而确保数据从一个一致状态转换到另一个一致状态。事务具有四个关键特性，通常称为ACID特性',
        cover: '',
        link: '/blog/数据库事务'
      },
      {
        title: 'AOP',
        desc: 'AOP（Aspect Oriented Programming，面向切面编程）是一种编程范式，它是对面向对象编程（OOP）的一种补充和完善。',
        cover: '',
        link: '/blog/AOP'
      },
      {
        title: 'IOC',
        desc: 'IOC（Inversion of Control，控制反转）是一种设计原则，也是一种设计模式，它通过将控制权从应用程序代码中转移到框架或容器中，实现了对象之间的解耦，提高了代码的灵活性和可测试性。',
        cover: '',
        link: '/blog/IOC'
      },
      {
        title: '安全框架 Shiro',
        desc: 'Shiro是一个强大且易于使用的Java安全框架，提供了认证、授权、加密、会话管理、与Web集成、缓存等核心安全功能。',
        cover: 'https://shiro.apache.org/images/apache-shiro-logo.png',
        link: '/blog/Shiro'
      }
    ])
  })
}

// {
//   title: '',
//   desc: '',
//   cover: '',
//   link: '/blog/'
// }
