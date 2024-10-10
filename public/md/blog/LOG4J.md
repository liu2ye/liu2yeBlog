# LOG4J

LOG4J，全称为log for java，即Java日志。它是一个提供灵活日志记录功能的框架，允许开发者控制日志信息的目的地、输出格式和生成过程。通过配置文件，开发者可以在不修改应用代码的情况下实现日志的灵活配置。



log4j日志分为三个部分：

1.   rootLogger：根，配置输出级别，声明Appender
2.   Appender：输出目的地
3.   layout：输出布局

rootLogger负责配置日志的**输出等级**，输出到哪

Appender负责详细配置在目的地

layout负责配置在目的地如何输出，事实上，layout并不会单独存在总是和Appender在一起



配置log4j有两种方式：

+   使用log4j.properties文件
+   使用log4j.xml文件

项目中配置log4j.xml或者log4j.properties文件，不需要配置读取log4j配置文件，程序运行后log4j配置文件会自动起作用，主要因为apache.log4j.java的源码中已经读取了这个配置文件(log4j配置文件必须放在根目录下)

优先读取log4j.xml配置，不存在则会去读取log4j.properties


## properties方式



### 配置rootLogger

```properties
log4j.rootLogger=[level],AppenderName1,AppenderName2...
```

#### level

日志的输出级别，设置低级别的会将高级别的也输出

目前log4j的输出级别共有八级：

+   OFF：关闭，不输出
+   FATAL：致命的，输出那些将会导致系统退出的严重的错误事件
+   ERROR：错误，虽然发生错误，但是不影响系统的继续运行
+   WARN：警告，会出现潜在错误的情形
+   INFO：消息在粗粒度级别上突出强调程序的运行过程
+   DEBUG：细粒度，对于调试非常有帮助
+   TRACE：粒度比DEBUG还要低
+   ALL：所有



#### AppenderName

用于指示日志的输出位置，名字是可以自定义的，但是要通过`log4j.appender.AppenderName=...`来指定类

它的值有以下几种：

+   org.apache.log4j.**ConsoleAppender**（控制台）

+   org.apache.log4j.FileAppender（文件）

+   org.apache.log4j.**DailyRollingFileAppender**（按时间产生日志文件）

+   org.apache.log4j.**RollingFileAppender**（文件大小到达指定尺寸的时候产生一个新的文件）

+   org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）

加黑的为常用的



以下是输出级别为DEBUG，有两个输出目的地名为console和file的配置

```properties
log4j.rootLogger=DEBUG,console,file
```



### 配置Appender

Appender要和相应的目的地配合

#### ConsoleAppender

```properties
log4j.appender.console = org.apache.log4j.ConsoleAppender # 指明要使用的类，一般不会变
log4j.appender.console.Target = System.out # 在控制台使用Sysytem.out还是Sysytem.err输出（err输出是红的）
log4j.appender.console.Encoding=UTF-8 # 设置编码所有Appender均有该属性
log4j.appender.console.Threshold=DEBUG # 单独设置输出级别
# ....输出格式的配置
```



#### DailyRollingFileAppender

```properties
log4j.rootLogger=DEBUG,console,file,D

log4j.appender.D = org.apache.log4j.DailyRollingFileAppender # 指定类
log4j.appender.D.File =D:/logs/log.log # 文件位置和默认文件名
log4j.appender.D.DatePattern= '-'yyyy-MM-dd-HH'.log' # 新产生文件的文件名和多长时间产生新文件
log4j.appender.D.Append = true # 多次启动程序是否追加
log4j.appender.D.Threshold = info # 单独设置输出级别
# ....输出格式的配置
```

DatePattern可选值：

+   yyyy-MM：每月
+   yyyy-ww：每周
+   yyyy-MM-dd：每天
+   yyyy-MM-dd-a：每半天
+   yyyy-MM-dd-HH：每小时
+   yyyy-MM-dd-HH-mm：每分钟



#### RollingFileAppender

```properties
log4j.appender.RollingFile = org.apache.log4j.RollingFileAppender
log4j.appender.RollingFile.File = C://log4.log # 文件位置
log4j.appender.RollingFile.MaxFileSize=1KB # 文件大小
log4j.appender.RollingFile.MaxBackupIndex=3 # 文件最多存在数量
```



### 配置layout

通过`log4j.appender.AppenderName.layout=...`来设置布局

Log4j提供的layout有以下几种：

+   org.apache.log4j.HTMLLayout：以HTML表格形式布局

+   org.apache.log4j.PatternLayout：可以灵活地指定布局模式

+   org.apache.log4j.SimpleLayout：包含日志信息的级别和信息字符串

+   org.apache.log4j.TTCCLayout：包含日志产生的时间、线程、类别等等信息



#### HTMLLayout

直须指定即可不需要额外配置，将会生成或者打印HTML格式的数据



#### PatternLayout（常用）

有ConversionPattern属性，可以灵活配置输出

```properties
log4j.appender.AppenderName.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n
```

+   %p：日志级别
+   %m：日志内容
+   %n：换行
+   %d：日期，默认格式为ISO8601
    +   %d{yyyy年MM月dd日 HH时mm分ss秒SSS毫秒}
    +   %d{DATE}：10 十一月 2021 22:36:39,846
    +   %d{ABSOLUTE}：22:38:06,549
+   %F：Java源文件名
+   %L：Java源码行数
+   %C：Java全类名
    +   %C{1}：只显示最后一个类名，即不显示包名
+   %M：Java方法名
+   %l：等同于%F%L%C%M
+   %t：线程名
+   %r：打印时应用运行时间



#### SimpleLayout

直须指定即可，只显示日志级别和日志内容



#### TTCCLayout

指定即可



## xml方式

暂时没用到