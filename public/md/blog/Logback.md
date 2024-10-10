# Logback

Logback是一个为Java应用程序设计的日志框架，它提供了高性能、灵活性和可扩展性。Logback的配置文件通常采用XML格式（通常命名为logback.xml），允许用户以声明式的方式配置日志输出。

### Logback配置详解

1. **根节点`<configuration>`**：

	* `scan`：当此属性设置为true时，如果配置文件发生改变，将会被重新加载。默认值为true。
	* `scanPeriod`：设置监测配置文件是否有修改的时间间隔。默认的时间间隔为1分钟，时间单位可以指定为秒（如“60 seconds”）。当`scan`为true时，此属性生效。
	* `debug`：当此属性设置为true时，将打印出logback内部日志信息，可以实时查看logback运行状态。默认值为false。

2. **子节点**：

	* `<contextName>`：设置logger上下文名称，用于区分不同应用程序的记录。一旦设置，不能修改。
	* `<property>`：定义变量值，包含`name`和`value`两个属性。通过`<property>`定义的值会被插入到logger上下文中，之后可以使用`${}`来使用这些变量。
	* `<timestamp>`：获取时间戳字符串，包含`key`和`datePattern`两个属性。`key`用于标识此`<timestamp>`的名字，`datePattern`用于设置将当前时间转换为字符串的模式，遵循`java.text.SimpleDateFormat`的格式。
	* `<logger>`：用来设置某一个包或者具体的某一个类的日志打印级别，以及指定`<appender>`。`<logger>`仅有一个`name`属性，一个可选的`level`和一个可选的`additivity`属性。`level`用于设置打印级别（TRACE、DEBUG、INFO、WARN、ERROR、ALL、OFF），如果未设置，则当前logger将会继承上级的级别。`additivity`属性用于指定是否向上级logger传递打印信息，默认是true。`<logger>`可以包含零个或多个`<appender-ref>`元素，表示这个appender将会添加到这个logger。
	* `<root>`：根logger，只有一个`level`属性，不能设置为INHERITED或者同义词NULL。默认是DEBUG级别。`<root>`可以包含零个或多个`<appender-ref>`元素。
	* `<appender>`：配置日志输出的目的地，如控制台、文件、数据库等。`<appender>`可以有多个，每个`<appender>`都需要指定一个唯一的`name`和一个`class`（表示appender的具体实现类）。`<appender>`内部通常包含一个`<encoder>`，用于指定日志的输出格式。

### 可用配置示例

下面是一个可用的配置，直接添加到项目中即可。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration scan="true" scanPeriod="30 seconds" debug="false">
    <!-- 日志文件的保存路径 -->
    <property name="LOG_HOME" value="/data/logs/sys_admin"/>
    <!-- 日志输出格式 -->
    <property name="ENCODER_PATTERN" value="%d{yyyy-MM-dd HH:mm:ss.SSS} %X{traceId} %level %logger{0} [%t] %m%n"/>

    <!-- 控制台输出 -->
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>${ENCODER_PATTERN}</pattern>
        </encoder>
    </appender>

    <!-- INFO日志输出到文件 -->
    <appender name="INFO_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <Append>true</Append>
        <file>${LOG_HOME}/sys_info.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${LOG_HOME}/sys_info.log.%d{yyyy-MM-dd}</FileNamePattern>
            <MaxHistory>30</MaxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${ENCODER_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>INFO</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- ERROR日志输出到文件 -->
    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <Append>true</Append>
        <file>${LOG_HOME}/sys_error.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${LOG_HOME}/sys_error.log.%d{yyyy-MM-dd}</FileNamePattern>
            <MaxHistory>30</MaxHistory>
        </rollingPolicy>
        <encoder>
            <pattern>${ENCODER_PATTERN}</pattern>
            <charset>UTF-8</charset>
        </encoder>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <!-- 系统模块日志级别控制 -->
    <logger name="cn.example" level="info"/>

    <!-- Spring日志级别控制 -->
    <logger name="org.springframework" level="warn"/>

    <!-- 根日志级别控制 -->
    <root level="info">
        <appender-ref ref="STDOUT"/>
        <appender-ref ref="INFO_FILE"/>
    </root>
</configuration>
```

在这个配置示例中：

* 日志文件的保存路径被设置为`/data/logs/sys_admin`。
* 日志输出格式包含了日期、traceId、日志级别、日志记录事件所在类名（只保留类名的最后一部分）、线程名和日志消息。
* 控制台输出被配置为一个名为`STDOUT`的appender。
* INFO级别的日志被输出到一个名为`INFO_FILE`的文件appender中，并且日志文件会基于时间滚动，保留30天的历史日志。
* ERROR级别的日志被输出到一个名为`ERROR_FILE`的文件appender中，并且也基于时间滚动，保留30天的历史日志。
* `cn.example`包下的日志级别被设置为INFO。
* Spring框架的日志级别被设置为WARN。
* 根日志级别被设置为INFO，并且引用了`STDOUT`和`INFO_FILE`两个appender。

