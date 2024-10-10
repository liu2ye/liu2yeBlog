# IOC(Inversion of Control)

## 控制反转

+ 控制反转是一种思想、是面对对象的一种设计原则
+ 实现控制反转有多种方法，常用的有：
    + 依赖注入（Dependency Injection，简称**DI**）Spring使用这种方式
    + 依赖查找（Dependency Lookup）
+ 通过控制反转，对象在被创建的时候，由一个调控系统内所有对象的外界实体将其所依赖的对象的引用传递给它。也可以说，依赖被注入到对象中。

控制反转是：**依赖对象的获得被反转了**

因为大多数应用程序都是由两个或是更多的类通过彼此的合作来实现企业逻辑，这使得每个对象都需要获取与其合作的对象（也就是它所依赖的对象）的引用。如果这个获取过程要靠自身实现，那么这将导致代码高度耦合并且难以维护和调试。

### 控制反转的作用（以三层架构为例）

#### 使用控制反转前

```java
//Dao包

//UserDao接口
public interface UserDao {
    void getUser();
}

//默认的UserDao实现类
public class UserDaoImpl implements UserDao{
    @Override
    public void getUser() {
        System.out.println("默认获取用户数据");
    }
}

//mysql实现
public class UserDaoMysqlImpl implements UserDao {
    @Override
    public void getUser() {
        System.out.println("Mysql获取用户数据");
    }
}
```

```java
//service包

//用户业务接口
public interface UserService {
    void getUser();
}

//UserService接口
public class UserServiceImpl implements UserService{

    private UserDao userDao = new UserDaoImpl();

    @Override
    public void getUser() {
        userDao.getUser();
    }
}

```

```java
//调用UserService的语句
UserService userService = new UserServiceImpl();
userService.getUser();
```

明显看到：由于在UserServiceImpl中UserDao的接口已经被写死(service包第11行)，当我们需要切换使用的数据库时，必须修改service层的代码：

```java
private UserDao userDao = new UserDaoMysqlImpl(); //修改后的service包第11行
```

这样的话代码之间的耦合性过强，牵一发而动全身，而且在实际项目中我们往往无法修改源代码。

#### 使用控制反转

为了解决上面的问题，我们修改UserServiceImpl的代码如下：

```java
public class UserServiceImpl implements UserService{

    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void getUser() {
        userDao.getUser();
    }
}
```

同时，我们调用UserService时的代码也要做些修改：

```java
UserService userService = new UserServiceImpl();
((UserServiceImpl) userService).setUserDao(new UserDaoImpl());//通过set传入接口实现类
userService.getUser();
```

可以看到，这时UserServiceImpl中UserDao已经不是写死的了，而是通过在调用接口时使用set方法为其赋值，这样传入的是哪一个实现类，就会使用哪个实现类的具体方法。

通过这种方法实现了控制反转：使用哪个UserDao实现类来获取数据不再是固定的由UserServiceImpl决定，而是由调用UserServiceImpl时为其传入的值来决定了。

#### 总结

在使用三层架构时，service层依赖于dao层，原本依赖的对象由service自己获得(**new UserDaoImpl**)，控制反转后，依赖的对象由调用时赋值传入(**setUserDao(new UserDaoImpl())**)。

打个比方：

手机需要有电话卡才能打电话，（手机 ---依赖--->电话卡）

我想借用别人的手机打电话，但是我有自己的电话卡

老式手机：电话卡槽在手机里，必须关机拔掉电池才能换电话卡。

新式手机（使用控制反转）：电话卡槽在手机外，插入就可以用。谁想用手机，谁就把自己的电话卡插进去



# Spring实现控制反转

在上面三层架构的例子中，被依赖对象的创建还是写在源代码里的，当我们业务需要使用一个新的UserDao实现类（比如一种新的数据库），这个实现类我们已经写完了，但是我们还是要修改代码才能使用它，任何修改代码的代价都是昂价的。此时我们可以通过反射机制来使我们不再需要改动代码。

1. 创建一个文件，文件中保存实现类的类全名
2. 通过反射机制读取到类名并加载
3. 将加载的类赋值给依赖它的对象

这样，当我们需要更改新的实现类时，只要将实现类加入到相应的包中，然后修改文件中的类全名就行了。

**通过反射，不用修改代码就可以使用新的实现类，我们修改的只是一个文件**。进一步降低了耦合，增强了扩展性。

但是又出现了新的问题：我们需要为每一个接口创建一个文件来保存它的实现类的类全名，使用时还需要用到IO流和反射，这是重复且易出错的工作。

于是，Spring为我们封装了这部分功能（这就是框架的好处）。

+ 使用一个applicationContext.xml文件来保存所有的类全名，并有一套规则（bean）来明确如何使用
+ 只需调用它的API就可以获取类实例。

![](.\IOC.png)



## 使用spring框架

在上面三层架构的基础上，创建一个applicationContext.xml文件，目录结构如下：

<img src=".\目录结构.png" style="zoom:50%;" />

applicationContext.xml文件内容如下

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="MysqlImpl" class="com.dao.UserDaoMysqlImpl"/>
    <bean id="DaoImpl" class="com.dao.UserDaoImpl"/>

    <bean id="UserServiceImpl" class="com.service.UserServiceImpl">
        <!--
        ref: 引用Spring容器中创建好的对象
        value: 具体的值, 基本数据类型
        -->
        <property name="userDao" ref="DaoImpl"/>
    </bean>
</beans>
```

当我们要修改依赖对象时，只要修改第14行--->ref="MysqlImpl"，就可以了

MyTest测试类如下

```java
public class MyTest {
    public static void main(String[] args) {
        //不使用Spring框架
        /*UserService userService = new UserServiceImpl();
        ((UserServiceImpl) userService).setUserDao(new UserDaoImpl());
        userService.getUser();*/
		
        //使用Spring框架
        //获取ApplicationContext对象, 拿到spring容器
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

        //需要什么就拿什么
        UserServiceImpl userServiceImpl = (UserServiceImpl) context.getBean("UserServiceImpl");
        userServiceImpl.getUser();
    }
}
```

结果：

```java
"C:\Program Files\Java\jdk1.8.0_121\bin\java.exe" "-javaagent:D:\Program\IntelliJ IDEA 2021.1.3\lib\idea_rt.jar=54911:D:\Program\IntelliJ IDEA 2021.1.3\bin" -Dfile.encoding=UTF-8 -classpath "C:\Program Files\Java\jdk1.8.0_121\jre\lib\charsets.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\deploy.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\access-bridge-64.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\cldrdata.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\dnsns.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\jaccess.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\jfxrt.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\localedata.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\nashorn.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\sunec.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\sunjce_provider.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\sunmscapi.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\sunpkcs11.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\ext\zipfs.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\javaws.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\jce.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\jfr.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\jfxswt.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\jsse.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\management-agent.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\plugin.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\resources.jar;C:\Program Files\Java\jdk1.8.0_121\jre\lib\rt.jar;D:\Lenraing\Code\idea\Spring-maven-study\spring-01-ioc1\target\test-classes;D:\Lenraing\Code\idea\Spring-maven-study\spring-01-ioc1\target\classes;D:\Program\apache-maven-repository\org\springframework\spring-webmvc\5.3.9\spring-webmvc-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-aop\5.3.9\spring-aop-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-beans\5.3.9\spring-beans-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-context\5.3.9\spring-context-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-core\5.3.9\spring-core-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-jcl\5.3.9\spring-jcl-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-expression\5.3.9\spring-expression-5.3.9.jar;D:\Program\apache-maven-repository\org\springframework\spring-web\5.3.9\spring-web-5.3.9.jar;D:\Program\apache-maven-repository\junit\junit\4.12\junit-4.12.jar;D:\Program\apache-maven-repository\org\hamcrest\hamcrest-core\1.3\hamcrest-core-1.3.jar" MyTest
默认获取用户数据

进程已结束，退出代码为 0
```



## applicationContext

基本内容

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
	<!--bean...-->
</beans>
```

`<beans></beans>`标签中可以插入多个`<bean>`标签，一个`<bean>`标签代表着一个可以被实例化的类



## bean的常用属性

- id：唯一标识
- class：类路径(完整路径)
- name：可以加特殊符号的id
- scope：作用域六种（Spring 5.3.9版本）
    - 单例模式(Spring默认) **singleton**
    - 原型模式 **prototype**
    - 其余的：**request session application** **websocket**(新增) 只能在web开发中使用



## 实例化bean的三种方式

1.   构造器【最常用、最标准】（以下均使用这种方式）
2.   静态工厂
3.   实例工厂

```xml
<!--构造器实例化-->
<bean id="user" class="com.pojo.User"/>

<!--静态工厂实例化-->
<bean id="user" class="com.pojo.StaticFactoryBean" factory-method="staticFactoryMethod"/>

<!--实例工厂实例化-->
<bean id="instanceFactory" class="com.pojo.InstanceFactory"/>
<bean id="user" class="com.pojo.User" factory-bean="instanceFactory" factory-method="getUser"/>

```

## 注入

注入又称装配，就是实例化bean后为其赋值的操作

三种装配方式：

1. 在xml中显示的配置（即下面的构造器注入和setter注入）
2. 在java中显示的配置
3. 隐式的自动装配bean【重要】

### 基于xml注入

#### 构造器注入

利用构造方法的参数注入依赖

```xml
	<!--第一种: 下标赋值-->
	<bean id="user" class="com.pojo.User">
    	<constructor-arg index="0" value="下标赋值"/>
	</bean>

    <!--第二种: 类型赋值(参数类型可能相同, 不建议使用)-->
    <bean id="user" class="com.pojo.User">
        <constructor-arg type="java.lang.String" value="参数赋值"/>
    </bean>

    <!--第三种参数名赋值(常用)-->
    <bean id="user" class="com.pojo.User">
        <constructor-arg name="name" value="参数名赋值"/>
    </bean>
```



#### setter注入

又称属性注入，调用Setter的方法注入依赖，要注入的属性必须有Setter方法

```xml
	<bean id="address" class="com.pojo.Address">
        <property name="address" value="西安"/>
    </bean>
    <bean id="student" class="com.pojo.Student">
        <!--普通值注入-->
        <property name="name" value="张三"/>

        <!--bean注入-->
        <property name="address" ref="address"/>

        <!--数组注入-->
        <property name="books">
            <array>
                <value>《红楼梦》</value>
                <value>《西游记》</value>
                <value>《水浒传》</value>
                <value>《三国演义》</value>
            </array>
        </property>

        <!--List注入-->
        <property name="hobbys">
            <list>
                <value>听歌</value>
                <value>打游戏</value>
                <value>看电影</value>
            </list>
        </property>

        <!--Map注入-->
        <property name="card">
            <map>
                <entry key="身份证" value="111111111"/>
                <entry key="银行卡" value="23541222"/>
                <entry key="学生卡" value="4445245353"/>
            </map>
        </property>

        <!--Set注入-->
        <property name="game">
            <!--

			引用类型注入

			<set>
                <ref bean="weapon1"/>
                <ref bean="weapon2"/>
            </set>
			
			-->
            <set>
                <value>LOL</value>
                <value>CF</value>
                <value>DOTA</value>
            </set>
        </property>

        <!--Null注入-->
        <property name="wife">
            <null/>
        </property>

        <!--Properties注入-->
        <property name="info">
            <props>
                <prop key="学号">20190525</prop>
                <prop key="姓名">张三</prop>
            </props>
        </property>
    </bean>
```



### 自动装配

根据指定的装配类型，Spring自动的将匹配的属性值进行注入。

自动装配类型：

+ byName：id唯一，id需要和自动注入的属性的set方法的值一致
+ byType：class唯一，class需要和自动注入的属性的类型一致

People类

```java
public class People {
    private Dog dog;
    private Cat cat;
    private String name;
    
    //set/get方法
}
```

applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
">

    <bean class="com.pojo.Cat"/>
    <bean class="com.pojo.Dog"/>
    <bean id="people" class="com.pojo.People" autowire="byType"/>

</beans>
```

这种方式单独使用并不多，更多的是搭配注解使用

### 基于注解注入

+   注解是代码的特殊标记，格式：@注解名称(属性名称="属性值", 属性名称="属性值", ...)
+   使用注解，注解作用在**类、方法、属性**上面
+   使用注解的目的是简化xml配置

Spring针对Bean管理中创建对象提供注解



#### 类注解（自造名词）

在类上添加以下注解，等价于在xml中添加了`<bean id="类名" class="类路径"/>`

+   @Component
+   @Repositroy    **dao**
+   @Service    **service**
+   @Controller    **controller**

四个注解功能一样，都将类注册到Spring中，只是标识三层架构中的不同层，@Component通用

@Scope：设置作用域



#### 字段注解（自造名词）

在字段上添加以下注解，就是为这个字段**自动装配**符合条件的值

+   @AutoWired：根据属性类型进行自动注入
+   @Qualifier：根据属性名称进行自动注入，和@AutoWired一起使用
+   @Resource：可以根据类型注入，也可以根据名称注入【由java本身提供，推荐使用】
+   @Value：注入普通类型属性（String、int......）



#### 注解开发

1. 导入spring-aop包

2. 导入context约束

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context 
            http://www.springframework.org/schema/context/spring-context.xsd
    ">
    
        <!--指定要扫描的包，这个包下的所有注解都生效-->
        <context:component-scan base-package="com.pojo"/>
    
        <!--指定要扫描的包，这个包下只有@Component注解才会生效-->
        <context:component-scan base-package="com.pojo" use-default-filters="false">
            <!--指定型-->
            <context:include-filter type="annotation" expression="org.springframework.stereotype.Component"/>
        </context:component-scan>
        
        <!--指定要扫描的包，这个包下不扫描@Component注解-->
        <context:component-scan base-package="com.pojo">
            <!--排除型-->
            <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Component"/>
        </context:component-scan>
    </beans>
    ```

3.   在类和字段上添加相应的注解

#### 纯注解开发

纯注解开发可以不需要applicationContext.xml文件

1.   添加一个配置类

     ```java
     @Configuration
     @ComponentScan(basePackages = {"要扫描的包名"})
     public class BeanConfig {
     }
     ```

2.   添加相应注解

3.   获取Spring容器的代码变为

     ```java
     //之前
     ApplicationContext context = new 
         ClassPathXmlApplicationContext("applicationContext.xml");
     
     //纯注解开发
     ApplicationContext context = new 
         AnnotationConfigApplicationContext(BeanConfig.class);
     
     ```

     

### xml与注解

xml与注解对比：

+ xml更加万能，适用于任何场合，维护方便
+ 注解 不是自己的类用不了，维护相对复杂

xml与注解最佳实践：

+ xml用来管理bean
+ 注解只负责完成属性的注入

