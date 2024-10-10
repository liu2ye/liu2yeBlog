# AOP

+ 面向切面编程
+ OOP(面向对象编程)的延续
+ 对业务逻辑的各个部分进行隔离，从而使业务逻辑的各个部分的耦合性降低

##### 例子: 登录流程

###### 当前逻辑

​	用户输入账户密码----->数据库查询----->判断------>登录成功/失败

###### 需要添加功能

​	判断用户权限

###### 原始方式

​	添加代码

```java
if (管理员){...} else {...}
```

###### 新方法

​	添加权限判断模块

​	用户输入账户密码----->数据库查询----->判断---->权限判断--->登录成功/失败

**通过不修改源代码的方式来添加新功能**

## 底层原理

1. AOP底层使用动态代理
   1. 有接口: 使用JDK动态代理 [代理模式](./代理模式.md)
   2. 无接口: 使用CGLIB动态代理

## 术语

+ **连接点**

  类里面哪些方法可以被增强，这些方法称为连接点

+ **切入点**

  实际被增强的方法被称为切入点

+ **通知（增强）**

  实际增强的逻辑部分称为通知（增强）

  通知有多种类型

  - 前置通知
  - 后置通知
  - 环绕通知
  - 异常通知
  - 最终通知

+ **切面**

  把通知应用到切入点的过程

## AOP操作（准备）

1. Spring框架一般基于AspectJ实现AOP操作

   （1）什么是AspectJ？

   ​		AspectJ不是Spring的组成部分，独立于AOP框架，一般把AspectJ和Spring框架一起使用，进行AOP操作

2. 基于AspectJ实现AOP操作

   （1）基于xml配置文件实现

   （2）基于注解方式实现（常用）

3. 在项目工程里面引入AOP相关依赖

4. 切入点表达式

   （1）切入点表达式的作用：知道对哪个类里面的哪个方法进行增强

   （2）语法结构：	

   ```java
   execution([权限修饰符?][返回值类型][类全路径][方法名称][参数列表])
   ```
   
   举例：
   
   1.   对com.xxx.dao.BookDao类里面的add进行增强
   
        execution(* com.xxx.dao.BookDao.add(..))	【两个点代表整个参数列表】
   
   2.   对com.xxx.dao.BookDao类里面所有方法进行增强
   
        execution(* com.xxx.dao.BookDao.*(..))
   
   3.   对com.xxx.dao包里面的所有类，类里面的所有方法进行增强
   
        execution(* com.xxx.dao.\*.\*(..))



## AOP操作

### Spring自带AOP实现

Spring官方都推荐AspectJ，同时Spring包中都提供AspectJ了，你还要学吗

### AspectJ注解实现

+   必须添加依赖

1. 创建类，在类里面定义方法（被增强类）

    ```java
    package com.aopanno;
    
    public class User {
        public void add(){
            System.out.println("add......");
        }
    }
    ```

2. 创建增强类（编写增强逻辑）

    1.   在增强类里面，创建方法，让不同方法代表不同通知类型

         ```java
         package com.aopanno;
         
         public class UserProxy {
             //前置通知
             public void before(){
                 System.out.println("before......");
             }
         }
         ```

         

3. 进行通知配置

   （1）在spring配置文件中，开启注解扫描

   ```xml
   <!--添加aop和context命名空间-->
   
   <!--开启注解扫描-->
   <context:component-scan base-package="com.aopanno"/>
   ```

   （2）注解创建对象（User和UserProxy）

   ​			在User和UserProxy上添加@Component

   （3）在增强类上面添加注解@Aspect

   ​			在UserProxy上添加@Aspect

   （4）在spring配置文件中开启生成代理对象

   ```xml
   <!--开启AspectJ生成代理对象-->
       <aop:aspectj-autoproxy/>
   ```

   

4.   配置不同类型的通知

     （1）在增强类的里面，在作为通知方法上面添加通知类型注解，使用切入点表达式配置

     ```java
     package com.aopanno;
     
     import org.aspectj.lang.ProceedingJoinPoint;
     import org.aspectj.lang.annotation.*;
     import org.springframework.stereotype.Component;
     
     @Component
     @Aspect //生成代理对象
     public class UserProxy {
         //前置通知
         @Before(value = "execution(* com.aopanno.User.add(..))") //vuale可省略
         public void before() {
             System.out.println("Before");
         }
     
         @After("execution(* com.aopanno.User.add(..))")
         public void after() {
             System.out.println("After");
         }
     
         @AfterReturning("execution(* com.aopanno.User.add(..))")
         public void afterReturning() {
             System.out.println("AfterReturning");
         }
     
         @AfterThrowing("execution(* com.aopanno.User.add(..))")
         public void afterThrowing() {
             System.out.println("AfterThrowing");
         }
     
         @Around("execution(* com.aopanno.User.add(..))")
         public void around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
             System.out.println("Around前");
     
             //执行增强方法
             proceedingJoinPoint.proceed();
     
             System.out.println("Around后");
         }
     
     }
     ```

5.   公共切入点抽取

     ```java
     	//相同切入点抽取
         @Pointcut("execution(* com.aopanno.User.add(..))")
         public void pointCut() {
     	}
     	
     	//使用
     	@After("pointCut()")
         public void after() {
             System.out.println("After");
         }
     ```

6.   多个增强类对同一个方法进行增强，对增强类设置优先级@Order(数字)，数字越小越先执行

     ```java
     @Order(1)
     public class xxxProxy(){
     }
     ```

     

### AspectJ配置文件实现

**基本不用，摆烂了**

## 总结

AOP是什么

是面向切面编程，是代理模式的集大成者。

起初，我们想要不修改源码的情况下增强某些方法，于是有了静态代理

然后，我们发现要增强一个方法就要实现接口的所有方法，并且如果是添加日志这类对所有方法进行相同处理的业务，增强类中的代码都是重复的了，于是我们利用反射机制，实现了动态代理

再然后。。。。。

总之，随着需求的增多，代理模式的框架也逐渐明确了

我们发现有些增强是在方法前执行，有些是在方法后执行，于是有了**通知**【@Before、@After、@AfterReturning、@AfterThrowing、@Around】和它们的执行顺序

我们发现有些增强的逻辑要对整个包生效，有的只需要对一个方法生效就行，于是我们有了**execution表达式**，它就像css选择器一样准确的指定我们想要的增强的方法

我们把发现出来的问题一一给出答案，然后把解题过程封装成一个个的jre包，等待着需要它的人来调用。

然后我们可以指着这些jre包说：“这就是AOP”
