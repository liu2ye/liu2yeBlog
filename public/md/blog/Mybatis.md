# Mybitas

## 1、简介

### 1.1 什么是Mybatis？

+   一款优秀的持久层框架
+   几乎避免了所有的JDBC代码

Maven依赖

```xml
<dependency>
  <groupId>org.mybatis</groupId>
  <artifactId>mybatis</artifactId>
  <version>x.x.x</version>
</dependency>
```



### 1.2 持久化

数据持久化

+   持久化就是将程序中的数据在持久状态和瞬时状态转化的过程
+   数据库持久化（JDBC）、IO文件持久化

假如内存容量无限大，同时能保证永远不会出故障和断电，那么就不需要持久层了



### 1.3 持久层

Dao层、Service层、Controller层。。。

+   完成持久化工作的代码块
+   层界限非常明显



### 1.4 为什么需要Mybatis？

+   帮助程序员将数据存入数据库中
+   方便
+   传统的JDBC太复杂了。



最重要的一点：**使用的人多**



## 2、第一个Mybatis程序

1.   搭建环境
2.   导入Mybatis
3.   编写代码
4.   测试



### 2.1 搭建环境

1.   搭建数据库

2.   新建一个普通的Maven项目

3.   删除src目录，将此项目作为父工程

4.   添加依赖

     ```xml
     	<!--导入依赖-->
         <dependencies>
             <!--mysql驱动-->
             <dependency>
                 <groupId>mysql</groupId>
                 <artifactId>mysql-connector-java</artifactId>
                 <version>8.0.25</version>
             </dependency>
     
             <!--mybatis-->
             <dependency>
                 <groupId>org.mybatis</groupId>
                 <artifactId>mybatis</artifactId>
                 <version>3.5.7</version>
             </dependency>
     
             <!--junit-->
             <dependency>
                 <groupId>junit</groupId>
                 <artifactId>junit</artifactId>
                 <version>4.12</version>
             </dependency>
         </dependencies>
     ```



### 2.2 创建模块

1.   创建配置文件mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<!--核心配置-->
<configuration>
    <!--环境-->
    <environments default="development">
        <!--环境一: 开发环境-->
        <environment id="development">
            <!--事务管理-->
            <transactionManager type="JDBC"/>
            <!--数据源-->
            <dataSource type="POOLED">
                <!--com.mysql.jdbc.Driver已经被弃用了-->
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>
</configuration>
```



2.   编写mybatis工具类，注意导包不要导错，使用org.apache.ibatis下的包。

     这一步是为了能更方便的获取和使用sqlSession，并不是必须的。

     同时，还有很多不同的方式来创建SqlSessionFactory和SqlSession，可以查看mybatis下的org.apache.ibatis.session包中的`SqlSessionFactoryBuilder`、`SqlSessionFactory`和`SqlSession`

```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

//sqlSessionFactory --> sqlSession
public class MybatisUtils {

    private static SqlSessionFactory sqlSessionFactory;

    static {
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //获取sqlSession
    public static SqlSession getSqlSession() {
        return sqlSessionFactory.openSession();
    }

}
```



### 2.3 编写代码

+   实体类

    User

+   Dao接口

    UserDao或者用新写法：UserMapper

+   接口实现类

    由原来的UserDaoImpl转为一个Mapper配置文件，原来需要编写一个实现类，现在只需要创建一个Mapper.xml文件即可

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE mapper
            PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    
    <!--namespace绑定一个对应的Dao/Mapper接口-->
    <!--相当于实现了它-->
    <mapper namespace="com.dao.UserDao">
        <!--id为: 实现的方法-->
        <!--resultType: 返回值类型-->
        <select id="getUserList" resultType="com.pojo.User">
            select * from user
        </select>
    </mapper>
    ```



### 2.4 测试

注意点：

+   mybatis-config.xml和Mapper.xml文件中中文字符的格式一定要是UTF-8，包括注释

+   org.apache.ibatis.binding.BindingException: Type interface com.dao.UserDao is not known to the MapperRegistry：原因是在mybatis-config.xml文件中没有为它设置映射，即缺少如下代码

    ```xml
        <mappers>
            <mapper resource="com/dao/UserMapper.xml"/>
        </mappers>
    ```

+   maven的资源导出问题，需要为在java目录下的文件设置导出

    ```xml
        <build>
            <resources>
                <resource>
                    <directory>src/main/resources</directory>
                    <includes>
                        <include>**/*.properties</include>
                        <include>**/*.xml</include>
                    </includes>
                    <filtering>true</filtering>
                </resource>
                <resource>
                    <directory>src/main/java</directory>
                    <includes>
                        <include>**/*.properties</include>
                        <include>**/*.xml</include>
                    </includes>
                    <filtering>true</filtering>
                </resource>
            </resources>
        </build>
    ```

    

Junit测试

```java
	@Test
    public void test() {
        //获取SqlSession对象
        SqlSession sqlSession = MybatisUtils.getSqlSession();

        //getMapper执行sql
        UserDao mapper = sqlSession.getMapper(UserDao.class);
        List<User> userList = mapper.getUserList();

        for (User user : userList) {
            System.out.println(user);
        }

        //关闭SqlSession
        sqlSession.close();
    }
```



## 3、XML映射文件Mapper.xml

该文件可以看为一个实现类，文件中有且只能有一个根标记`<mapper></mapper>`

这个文件在程序运行时会被编译为一个代理类：org.apache.ibatis.binding.MapperProxy

这个代理类会实现指定的接口，通过sqlSession.getMapper(xxx.class)；获取的就是这个类。

### `<mapper>`

有一个属性`namespace`（命名空间），属性值就是要实现的接口的全类名

例如：

```xml
<mapper namespace="com.dao.UserMapper">
  <!--子标签...-->
</mapper>
```

就代表着要实现UserMapper这个接口。



有八个子元素：

+   `select`
+   `insert`
+   `update`
+   `delect`
+   `resultMap`：描述如何从数据库结果集中加载对象，是最复杂也是最强大的元素
+   `sql`：可被其它语句引用的可重用语句块
+   `cache`：该命名空间的缓存配置
+   `cache-ref`：进入其他命名空间的缓存配置



### `<select>`

最常用的元素，一般项目都会有很多查询语句

常用属性有：（[完整的可在官网查看](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#select)）

+   `id`：命名空间的唯一标识符，应当是实现接口中的方法名。
+   `parameterType`：将会传入这条语句的参数的类全限定名或别名。这个属性是可选的，因为 MyBatis 可以通过类型处理器（TypeHandler）推断出具体传入语句的参数，默认值为未设置（unset）。
+   `resultType`：期望从这条语句中返回结果的类全限定名或别名。 注意，如果返回的是集合，那应该设置为集合包含的类型，而不是集合本身的类型。 resultType 和 resultMap 之间只能同时使用一个。
+   `resultMap`：对外部 resultMap 的命名引用。结果映射是 MyBatis 最强大的特性，如果你对其理解透彻，许多复杂的映射问题都能迎刃而解。 resultType 和 resultMap 之间只能同时使用一个。

使用例子：

```xml
	<!--使用resultType-->
	<select id="getUserList" resultType="com.pojo.User">
        select * from user
    </select>
```



### `<insert>`, `<update>` 和 `<delete>`

数据操纵语句DML使用基本一致

常用属性：

+   `id`：见上
+   `parameterType`：见上
+   `statementType`：可选 STATEMENT，PREPARED 或 CALLABLE。这会让 MyBatis 分别使用 Statement，PreparedStatement 或 CallableStatement，默认值：PREPARED。

例子：

```xml
	<insert id="addUser" parameterType="com.pojo.User">
        insert into mybatis.user (id, name, pwd) values (#{id}, #{name}, #{pwd})
    </insert>

    <update id="updateUser" parameterType="com.pojo.User">
        update user
        set name = #{name},
            pwd = #{pwd}
        where id = #{id};
    </update>

    <delete id="deleteUser" parameterType="int">
        delete
        from user
        where id = #{id};
    </delete>
```



注意：DML语句在执行后必须手动的提交，它不会向Mysql那样自动提交，**增删改需要提交事务**

**`sqlSession.commit()`**



### sql

这个元素可以用来定义可重用的 SQL 代码片段，以便在其它语句中使用。 参数可以静态地（在加载的时候）确定下来，并且可以在不同的 include 元素中定义不同的参数值。比如：

```
<sql id="userColumns"> ${alias}.id,${alias}.username,${alias}.password </sql>
```

这个 SQL 片段可以在其它语句中使用，例如：

```
<select id="selectUsers" resultType="map">
  select
    <include refid="userColumns"><property name="alias" value="t1"/></include>,
    <include refid="userColumns"><property name="alias" value="t2"/></include>
  from some_table t1
    cross join some_table t2
</select>
```



### `resultMap`

`resultMap` 元素是 MyBatis 中最重要最强大的元素。

对于`select`语句，通常我们需要处理数据库返回的结果集，将它转换成Java的对象集合，这是非常麻烦的

`resultMap`就是来帮助我们处理这部分工作。



对于一个简单的对象它会隐式的自动匹配，只要指定类型，例如：

```xml
    <select id="getUserList" resultType="com.pojo.User">
        select * from user
    </select>
```

它会自动将返回的结果集转换成`List<User>`，按照数据库表中的字段名来匹配`User`对象中的属性名



对于那些数据库表的字段名和Java对象中的属性名不一致（例如：password和pwd），或者多表联合查询的情况，就必须手动设置结果映射`resultMap`了，例如：

```xml
    <resultMap id="UserMap" type="User">
    	<!-- 一样的可以不用写
        <result column="id" property="id"/>
        <result column="name" property="name"/>
		-->
        <result column="password" property="pwd"/>
    </resultMap>

    <select id="getUserList" resultMap="UserMap">
        select * from user
    </select>
```



### 高级`resultMap`

[官网](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#Result_Maps)



### 使用步骤

1.   编写接口

     ```java
     	User getUserById(int id);
     ```

2.   编写对应的mapper中的sql语句

     ```xml
         <select id="getUserById" parameterType="int" resultType="com.pojo.User">
             select * from user where id = #{id}
         </select>
     ```

3.   测试

     ```java
         @Test
         public void getUserById() {
             SqlSession sqlSession = MybatisUtils.getSqlSession();
     
             UserMapper mapper = sqlSession.getMapper(UserMapper.class);
             User user = mapper.getUserById(1);
             System.out.println(user);
     
             sqlSession.close();
         }
     ```

     

### Map技巧

当一个对象很大时，可以传参为Map类型的，节省资源

多个参数，也可以用Map。



### #{}和${}

#{}和${}都可以用来插入值，不同的是，#{}更加安全，它会预编译SQL语句，防止注入。在使用时，如无特别需求，都应当使用#{}



## 4、配置解析mybatis-config.xml

### 简单配置

```xml
<configuration>
    <!--default用来设置使用哪个环境-->
    <environments default="development">
        <environment id="development">
            <!--事务管理器两种：JDBC和MANAGED，后一种基本不用-->
            <transactionManager type="JDBC"/>
            <!--数据源三种：UNPOLLED,POLLED,JNDI-->
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=UTF-8"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="com/dao/UserMapper.xml"/>
    </mappers>
</configuration>
```



### 引入外部配置文件

```xml
    <!--引入外部配置文件-->
    <properties resource="db.properties"/>

    <!--也可以在其中设置属性，但是如果和外部文件冲突了，优先使用外部文件-->
    <properties resource="db.properties">
        <property name="password" value="111111"/>
    </properties>

    <environments default="development">
        <environment id="development">
            <!--事务管理器两种：JDBC和MANAGED，后一种基本不用-->
            <transactionManager type="JDBC"/>
            <!--数据源三种：UNPOLLED,POLLED,JNDI-->
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
```



### 别名

```xml
	<typeAliases>
        <!--指定全类名-->
        <typeAlias type="com.pojo.User" alias="User"/>

        <!--指定包，等于这个包中的所有类都添加了别名，名字为首字母小写的类名-->
        <package name="com.dao"/>
    </typeAliases>
```



在实体类的数量较少时，使用typeAlias，数量较多时，建议使用package

第二种也可以使用注解@Alias来自定义别名



### 设置setting

这是Mybatis中极为重要的调整设置，会改变Mybatis的运行时行为, [具体见官网](https://mybatis.org/mybatis-3/zh/configuration.html)

|                设置名                | 有效值                                                       | 默认值                                                    |
| :----------------------------------: | :----------------------------------------------------------- | :-------------------------------------------------------- |
|             cacheEnabled             | true \| false                                                | true                                                      |
|          lazyLoadingEnabled          | true \| false                                                | false                                                     |
|        aggressiveLazyLoading         | true \| false                                                | false （在 3.4.1 及之前的版本中默认为 true）              |
|      multipleResultSetsEnabled       | true \| false                                                | true                                                      |
|            useColumnLabel            | true \| false                                                | true                                                      |
|           useGeneratedKeys           | true \| false                                                | False                                                     |
|         autoMappingBehavior          | NONE, PARTIAL, FULL                                          | PARTIAL                                                   |
| autoMappingUnknown<br>ColumnBehavior | NONE, WARNING, FAILING                                       | NONE                                                      |
|         defaultExecutorType          | SIMPLE REUSE BATCH                                           | SIMPLE                                                    |
|       defaultStatementTimeout        | 任意正整数                                                   | 未设置 (null)                                             |
|           defaultFetchSize           | 任意正整数                                                   | 未设置 (null)                                             |
|         defaultResultSetType         | FORWARD_ONLY \| SCROLL_SENSITIVE \| SCROLL_INSENSITIVE \| DEFAULT（等同于未设置） | 未设置 (null)                                             |
|         safeRowBoundsEnabled         | true \| false                                                | False                                                     |
|       safeResultHandlerEnabled       | true \| false                                                | True                                                      |
|       mapUnderscoreToCamelCase       | true \| false                                                | False                                                     |
|           localCacheScope            | SESSION \| STATEMENT                                         | SESSION                                                   |
|           jdbcTypeForNull            | JdbcType 常量，常用值：NULL、VARCHAR 或 OTHER。              | OTHER                                                     |
|        lazyLoadTriggerMethods        | 用逗号分隔的方法列表。                                       | equals,clone,hashCode,toString                            |
|       defaultScriptingLanguage       | 一个类型别名或全限定类名。                                   | org.apache.ibatis.scripting<br>.xmltags.XMLLanguageDriver |
|        defaultEnumTypeHandler        | 一个类型别名或全限定类名。                                   | org.apache.ibatis.type.EnumTypeHandler                    |
|          callSettersOnNulls          | true \| false                                                | false                                                     |
|      returnInstanceForEmptyRow       | true \| false                                                | false                                                     |
|              logPrefix               | 任何字符串                                                   | 未设置                                                    |
|               logImpl                | SLF4J \| LOG4J \| LOG4J2 \| JDK_LOGGING \| COMMONS_LOGGING \| STDOUT_LOGGING \| NO_LOGGING | 未设置                                                    |
|             proxyFactory             | CGLIB \| JAVASSIST                                           | JAVASSIST （MyBatis 3.3 以上）                            |
|               vfsImpl                | 自定义 VFS 的实现的类全限定名，以逗号分隔。                  | 未设置                                                    |
|          useActualParamName          | true \| false                                                | true                                                      |
|         configurationFactory         | 一个类型别名或完全限定类名。                                 | 未设置                                                    |
|        shrinkWhitespacesInSql        | true \| false                                                | false                                                     |
|        defaultSqlProviderType        | A type alias or fully qualified class name                   | Not set                                                   |

一个完整的setting元素示例

```xml
<settings>
  <setting name="cacheEnabled" value="true"/>
  <setting name="lazyLoadingEnabled" value="true"/>
  <setting name="multipleResultSetsEnabled" value="true"/>
  <setting name="useColumnLabel" value="true"/>
  <setting name="useGeneratedKeys" value="false"/>
  <setting name="autoMappingBehavior" value="PARTIAL"/>
  <setting name="autoMappingUnknownColumnBehavior" value="WARNING"/>
  <setting name="defaultExecutorType" value="SIMPLE"/>
  <setting name="defaultStatementTimeout" value="25"/>
  <setting name="defaultFetchSize" value="100"/>
  <setting name="safeRowBoundsEnabled" value="false"/>
  <setting name="mapUnderscoreToCamelCase" value="false"/>
  <setting name="localCacheScope" value="SESSION"/>
  <setting name="jdbcTypeForNull" value="OTHER"/>
  <setting name="lazyLoadTriggerMethods" value="equals,clone,hashCode,toString"/>
</settings>
```



### 映射器（mappers）

既然 MyBatis 的行为已经由上述元素配置完了，我们现在就要来定义 SQL 映射语句了。 但首先，我们需要告诉 MyBatis 到哪里去找到这些语句。 在自动查找资源方面，Java 并没有提供一个很好的解决方案，所以最好的办法是直接告诉 MyBatis 到哪里去找映射文件。 你可以使用相对于类路径的资源引用，或完全限定资源定位符（包括 `file:///` 形式的 URL），或类名和包名等。例如：

方法一：【推荐使用】

```xml
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>
```

方法二：

```xml
<!-- 使用完全限定资源定位符（URL） -->
<mappers>
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  <mapper url="file:///var/mappers/BlogMapper.xml"/>
  <mapper url="file:///var/mappers/PostMapper.xml"/>
</mappers>
```

方法三：

```xml
<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
```

+   接口和它的Mapper配置文件必须同名，且在同一个包下

方法四：

```xml
<!-- 将包内的映射器接口实现全部注册为映射器 -->
<mappers>
  <package name="org.mybatis.builder"/>
</mappers>
```

+   接口和它的Mapper配置文件必须同名，且在同一个包下



### 注意

在配置文件中标签是有顺序的

**properties**

**setting**

**typeAliases**

typeHandlers

objectFactory

objectWrapperFactory

reflectorFactory

plugins

**environments**

databaseIdProvider

**mappers**





## 5、日志

-   SLF4J
-   Apache Commons Logging
-   Log4j 2
-   Log4j
-   JDK logging



使用默认日志

```xml
    <settings>
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>
```



### LOG4J

使用LOG4J日志

1.   导包

     ```xml
             <!--LOG4J日志-->
             <dependency>
                 <groupId>log4j</groupId>
                 <artifactId>log4j</artifactId>
                 <version>1.2.17</version>
             </dependency>
     ```

2.   创建log4j.properties文件来配置log4j

     ```properties
     #将等级为DEBUG的日志信息输出到console和file这两个目的地，console和file的定义在下面的代码
     log4j.rootLogger=DEBUG,console,file
     
     #控制台输出的相关设置
     log4j.appender.console = org.apache.log4j.ConsoleAppender
     log4j.appender.console.Target = System.out
     log4j.appender.console.Threshold=DEBUG
     log4j.appender.console.layout = org.apache.log4j.PatternLayout
     log4j.appender.console.layout.ConversionPattern=[%c]-%m%n
     
     #文件输出的相关设置
     log4j.appender.file = org.apache.log4j.RollingFileAppender
     log4j.appender.file.File=./log/mybatis.log
     log4j.appender.file.MaxFileSize=10mb
     log4j.appender.file.Threshold=DEBUG
     log4j.appender.file.layout=org.apache.log4j.PatternLayout
     log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n
     
     #日志输出级别
     log4j.logger.org.mybatis=DEBUG
     log4j.logger.java.sql=DEBUG
     log4j.logger.java.sql.Statement=DEBUG
     log4j.logger.java.sql.ResultSet=DEBUG
     log4j.logger.java.sql.PreparedStatement=DEBUG
     ```

3.   配置log4j为Mybatis的日志实现

     ```xml
         <settings>
             <setting name="logImpl" value="LOG4J"/>
         </settings>
     ```

4.   log4j的使用

     ![image-20211006171603156](.\log4j使用效果.png)



#### 简单使用

1.   获取Logger对象，所在包为：org.apache.log4j.Logger，参数为当前类的class

     ```java
     	private static Logger logger = Logger.getLogger(UserMapperTest.class);
     ```

2.   输出日志

     ```java
         logger.info("进入了testLog4j");
         logger.debug("debug: 进入了testLog4j");
         logger.error("error: 进入了testLog4j");
     ```



## 6、分页

为什么要分页？

+   减少数据的处理量



### Limit分页

```xml
    <select id="getUserLimit" parameterType="map" resultType="com.pojo.User">
        select * from user limit #{startIndex}, #{endIntex}
    </select>
```



### RowBounds分页

```xml
    <select id="getUserByRowBounds" resultType="com.pojo.User">
        select * from user
    </select>
```

使用代码

```java
//RowBounds实现
RowBounds rowBounds = new RowBounds(1, 2);

List<User> userList =
    sqlSession.selectList("com.dao.UserMapper.getUserByRowBounds", null, rowBounds);
for (User user : userList) {
    System.out.println(user);
}

sqlSession.close();
```



### 分页插件PageHelper

[MybatisPageHelper](https://pagehelper.github.io/docs/howtouse/)



## 7、注解开发

简单的可以使用注解，对于复杂的应当使用xml配置

```java
public interface UserMapper {
    //查询所有用户
    @Select("select * from user")
    List<User> getUserList();
}
```



配置映射

```xml
<mappers>
    <mapper class="com.dao.UserMapper"/>
</mappers>
```



测试代码

```java
@Test
public void test() {
    SqlSession sqlSession = MybatisUtils.getSqlSession();

    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> userList = mapper.getUserList();

    for (User user : userList) {
        System.out.println(user);
    }

    sqlSession.close();
}
```



多个基本类型必须加上、引用类型不用加

```java
@Select("select * from user where id = #{id}")
User getUserById(@Param("id") int id);
```



## 8、Lombok

1.   在IDEA中安装插件【Lombok】

2.   在项目中导入lombok的jar包

     ```xml
     <dependency>
         <groupId>org.projectlombok</groupId>
         <artifactId>lombok</artifactId>
         <version>1.18.20</version>
     </dependency>
     ```

3.   在实体类上添加注解

     ```java
     @Data
     public class TestLombokPojo {
     
         private String name;
         private int age;
         private List<User> userList;
     
     }
     ```




不建议使用



## 9、多对一处理

问题：数据库中student表的字段与java中Student对象的属性不能一一对应。

java对象：

```java
public class Student {
    private int id;
    private String name;
    private Teacher teacher;
}
```

```java
public class Teacher {
    private int id;
    private String name;
}
```



数据库表：

```sql
CREATE TABLE `mybatis`.`student`( 
    `id` INT(11) NOT NULL, 
    `name` VARCHAR(80), 
    `tid` INT(11), 
    PRIMARY KEY (`id`)
) CHARSET=utf8; 
```

```sql
CREATE TABLE `mybatis`.`teacher`( 
    `id` INT(11) NOT NULL, 
    `name` VARCHAR(80), 
    PRIMARY KEY (`id`) 
) CHARSET=utf8; 
```



### 按照查询嵌套处理

思路：使用resultMap，将Student对象中的teacher属性与数据库中的字段tid映射起来，嵌套子查询来获取teacher属性的值。

```xml
<mapper namespace="com.dao.StudentMapper">

    <resultMap id="studentTeacher" type="student">
        <result property="id" column="id"/>
        <result property="name" column="name"/>
        <!--复杂的属性需要单独处理
            对象: association
            集合: collection
        -->
        <association property="teacher" column="tid" javaType="teacher" select="getTeacher"/>
    </resultMap>

    <select id="getAllStudent" resultMap="studentTeacher">
        select * from student
    </select>

    <select id="getTeacher" resultType="teacher">
        select * from teacher where id = #{id}
    </select>
</mapper>
```



### 按照结果嵌套处理

思路：在resultMap中为teacher属性也配置映射

```xml
<select id="getAllStudent2" resultMap="studentTeacher2">
    select s.id sid, s.name sname, t.id tid, t.name tname
    from student s, teacher t
    where s.tid = t.id
</select>

<resultMap id="studentTeacher2" type="student">
    <result property="id" column="sid"/>
    <result property="name" column="sname"/>
    <association property="teacher" javaType="teacher">
        <result property="id" column="tid"/>
        <result property="name" column="tname"/>
    </association>
</resultMap>
```



## 10、一对多处理

一个老师拥有多个学生

对老师而言就是一对多的关系

java：学生拥有属性tid，老师拥有属性studentList



### 按照结果嵌套

```xml
<resultMap id="getTeacher" type="teacher">
    <result property="id" column="tid"/>
    <result property="name" column="tname"/>
    <collection property="studentList" ofType="student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <result property="tid" column="tid"/>
    </collection>
</resultMap>

<select id="getTeacher" resultMap="getTeacher">
    select
    	s.id sid, s.name sname, t.id tid, t.name tname
    from
    	student s
    join teacher t
    on
    	t.id = s.tid
    where
    	s.tid = #{id};
</select>
```





## 11、动态SQL

动态SQL：根据不同的条件自动生成不同的SQL语句

使用以下四个标签：

+   if
+   choose（when，otherwise）
+   trim（where，set）
+   foreach



### 搭建环境

创建博客表

```sql
create table `blog` (
	`id` varchar(50) not null comment '博客id',
    `title` varchar(100) not null comment '博客标题',
    `author` varchar(30) not null comment '博客作者',
    `create_time` datetime not null comment '创建时间',
    `views` int(30) not null comment '浏览量'
) engine=InnoDB default charset=utf8
```



创建实体类

```java
public class Blog {
    private String id;
    private String title;
    private String author;
    private Date createTime;
    private int views;
}
```



创建Dao接口

创建mapper.xml



### IF

使用`<if>`来拼接语句

```xml
<select id="queryBlog" parameterType="map" resultType="blog">
    select * from blog where 1=1
    <if test="title != null">
        and title = #{title}
    </if>
    <if test="author != null">
        and author = #{author}
    </if>
</select>
```



### trim（where，set）

使用`<where>`来进行条件选择

```xml
<select id="queryBlog" parameterType="map" resultType="blog">
    select * from blog
    <where>
        <if test="title != null">
            and title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
    </where>
</select>

<update id="updateUser" parameterType="user">
    update user2
    <set>
        <if test="username != null">
            username = #{username},
        </if>
        <if test="birthday != null">
            birthday = #{birthday},
        </if>
        <if test="sex != null">
            sex = #{sex},
        </if>
        <if test="address != null">
            address = #{address}
        </if>
    </set>
    where id = #{id}
</update>
```



使用`<set>`来实现动态更新语句

```xml
<update id="updateBlog" parameterType="map">
    update blog
    <set>
        <if test="title != null">
            title = #{title},
        </if>
        <if test="author != null">
            author = #{author},
        </if>
    </set>
    where id = #{id}
</update>
```



### choose（when，otherwise）

使用`<choose>`、`<when>`和`<otherwise>`来实现类似switch的选择

```xml
<select id="queryBlogChoose" parameterType="map" resultType="blog">
    select * from blog
    <where>
        <choose>
            <when test="title != null">
                and title = #{title}
            </when>
            <when test="author != null">
                and author = #{author}
            </when>
            <otherwise>
                and views = #{views}
            </otherwise>
        </choose>
    </where>
</select>
```



### SQL片段（sql，include）

SQL片段就是将重复的部分抽取出来，使用`<include>`标签来引入。

```xml
<sql id="if-title-author">
    <if test="title != null">
        and title = #{title}
    </if>
    <if test="author != null">
        and author = #{author}
    </if>
</sql>

<include refid="if-title-author"/>
```



注意事项：

+   最好基于单表来定义SQL片段
+   不要存在where标签



### Foreach

使用`<foreach>`标签来对集合遍历

foreach标签的属性：

+   collection：要遍历的集合，应当为map的一个键
+   item：定义集合中的每一个元素
+   index：元素的下标
+   open：在元素之前拼接
+   separator：分割元素的符号
+   close：在元素之后拼接

```xml
<select id="queryBlogByIds" parameterType="map" resultType="blog">
    select * from blog
    where id in
    <foreach collection="ids" item="id" index="index" open="(" separator="," close=")">
        #{id}
    </foreach>
</select>
```



### bind

通过bind进行字符串的拼接

```xml
<bind name="xxxname" value="'%' + #{username} + '%'" />

select * from user where username=#{xxxname}
```







==动态SQL就是在拼接SQL==

建议：

+   先写出静态的SQL，然后在优化为动态的SQL





## 缓存

什么是缓存【Cache】？

+   存在内存中的临时数据
+   将用户经常查询的数据存放在缓存中，用户查询数据时就不用从磁盘上（数据库中）查询，而是从缓存中查询，从而提高查询效率，解决高并发系统的性能问题。



为什么使用缓存？

+   减少和数据库的交互，提高系统数据。



什么样的数据能使用缓存？

+   经常查询且不经常改变的数据



### Mybatis缓存

Mybatis包含一个非常强大的缓存特性。



Mybatis中有两级缓存：**一级缓存**和**二级缓存**

+   默认情况下，一级缓存自动开启。（SqlSession级别的缓存，也称为本地缓存）
+   二级缓存需要手动开启和配置，基于namespace级别的缓存
+   为了提高扩展性，Mybatis定义了缓存接口Cache。可以通过实现Cache接口来定义二级缓存



### 一级缓存

+   一级缓存也叫本地缓存：SqlSession
    +   与数据库同一次会话期间查询到的数据会放在本地缓存中
    +   如果以后需要获取相同的数据，直接从缓存中拿，没必要再去查询数据库



### 二级缓存

+   由于一级缓存作用域太低了，所以诞生了二级缓存
+   基于namespace级别的缓存，一个命名空间，对应一个二级缓存
+   工作机制
    +   一个会话查询一条数据，这个数据就会被放在当前会话的一级缓存中
    +   如果当前会话关闭了，即sqlSession.close()，这个会话对应的一级缓存就没了
    +   当会话关闭时，将一级缓存转存到二级缓存中
    +   新的会话查询信息可以从二级缓存中获取内容
    +   不同的mapper查出的数据会放在自己对应的缓存(map)中



步骤：

1.   开启全局缓存（这个属性默认开启）

     ```xml
     <settings>
         <setting name="cacheEnabled" value="true"/>
     </settings>
     ```

2.   在要使用二级缓存的Mapper中开启

     ```xml
     <cache/>
     ```

     可以自定义参数

     ```xml
     <cache eviction="FIFO"
            flushInterval="60000"
            size="512"
            readOnly="true"/>
     ```

3.   测试

     测试代码

     ```java
     @Test
     public void queryUserByIdTest() {
         SqlSession sqlSession = MybatisUtils.getSqlSession();
         SqlSession sqlSession1 = MybatisUtils.getSqlSession();
     
         User user = 
             (User) sqlSession.selectOne("com.dao.UserMapper.queryUserById", 1);
         System.out.println(user);
         sqlSession.close();
     
         User user1 = 
             (User) sqlSession1.selectOne("com.dao.UserMapper.queryUserById", 1);
         System.out.println(user1);
         sqlSession1.close();
     
         System.out.println(user == user1);
     }
     ```

     结果

     ```log
     [com.dao.UserMapper]-Cache Hit Ratio [com.dao.UserMapper]: 0.0
     [org.apache.ibatis.transaction.jdbc.JdbcTransaction]-Opening JDBC Connection
     [org.apache.ibatis.datasource.pooled.PooledDataSource]-Created connection 884452399.
     [com.dao.UserMapper.queryUserById]-==>  Preparing: select * from user where id =?
     [com.dao.UserMapper.queryUserById]-==> Parameters: 1(Integer)
     [com.dao.UserMapper.queryUserById]-<==      Total: 1
     User{id=1, name='张三', pwd='123456'}
     [org.apache.ibatis.transaction.jdbc.JdbcTransaction]-Closing JDBC Connection [com.mysql.cj.jdbc.ConnectionImpl@34b7ac2f]
     [org.apache.ibatis.datasource.pooled.PooledDataSource]-Returned connection 884452399 to pool.
     [com.dao.UserMapper]-Cache Hit Ratio [com.dao.UserMapper]: 0.5
     User{id=1, name='张三', pwd='123456'}
     true
     ```



提示：需要在mapper文件开启缓存中设置属性`readOnly="true"`，或者在实体类上添加序列化接口，否则不能开启缓存。

```log
org.apache.ibatis.cache.CacheException: Error serializing object.  Cause: java.io.NotSerializableException: com.pojo.User
```



### 缓存原理

+   Mybatis通过检查执行的Sql语句和参数与缓存中所保存的是否一致，是的话就说明缓存命中，取出对应的数据作为结果。
+   检查缓存时先检查二级缓存，再检查一级缓存，都没有的情况下才会和数据库建立连接查询



### 自定义缓存

```xml
EhCache 是一个纯Java的进程内缓存框架，具有快速、精干等特点，是Hibernate中默认的CacheProvider。
```





















