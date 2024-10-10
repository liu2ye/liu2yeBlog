# Shiro

 

## 什么是Shiro

+   一款主流的Java安全框架
+   不依赖容器，可以运行再JavaSE和JavaEE中
+   主要功能是对访问系统的用户进行统一的身份验证、授权



## Shiro核心组件

三大核心组件：

+   SecurityManager  Shiro核心，对所有Suject进行认证、授权

+   Suject 主体：访问系统的用户，可以是用户或者程序
+   Realm 开发者自定义模块
    +   数据库读取
    +   认证、授权功能具体实现



常用calss：

1.   UsernamePasswordToken
2.   AuthentionInfo （认证）用户角色信息集合
3.   AuthorzationInfo （授权）角色的权限信息
4.   DefaultWebSecurityDManager 安全管理器
5.   ShiroFilterFactoryBean



## Realm



## ShiroFilter





## Shiro-springboot-web-starter做了哪些工作

### 项目启动时

1.   项目启动时，将自定义的shiroFilterFactoryBean通过filterRegistrationBean加载到springboot中

2.   shiroFilterFactoryBean中包含了过滤规则（ShiroFilterChainDefinition）和过滤器

3.   除了自定义的过滤规则，shiro还有它默认的11个过滤器

     ```java
         anon(AnonymousFilter.class),
         authc(FormAuthenticationFilter.class),
         authcBasic(BasicHttpAuthenticationFilter.class),
         logout(LogoutFilter.class),
         noSessionCreation(NoSessionCreationFilter.class),
         perms(PermissionsAuthorizationFilter.class),
         port(PortFilter.class),
         rest(HttpMethodPermissionFilter.class),
         roles(RolesAuthorizationFilter.class),
         ssl(SslFilter.class),
         user(UserFilter.class);
     ```

4.   在前后端分离项目中，一般我们自定义jwt过滤器用来过滤所有接口("/**")，然后再将获取token的接口和其他开放接口设置用anon("/loging", "anon")



### 请求进来时

1.   将请求路径和过滤规则（ShiroFilterChainDefinition）进行匹配，匹配成功则用指定的过滤器再进行过滤，匹配不到直接放行
2.   匹配到后执行相应过滤器的isAccessAllowed方法，这里就是我们自己写的内容了，返回布尔值来决定执行拒绝方法(onAccessDenied)，还是放行。
3.   放行后，就会进入到springboot的拦截器中，一般不会出现问题，然后再到Controller层中，此后再发生的问题就会被@ControllerAdvice处理了^^。
4.   如果接口上有Shiro的权限或者角色注解，还会去执行Realm中的授权方法来验证权限，不符合要求的就会抛出UnauthorizedException，符合要求的终于进入到控制器的方法中了。





## 最佳实践（前后端分离：JWT+shiro）

首先依赖

```xml
<!--Shiro-->
<dependency>
    <groupId>org.apache.shiro</groupId>
    <artifactId>shiro-spring-boot-web-starter</artifactId>
    <version>1.4.0</version>
</dependency>
<!--JWT-->
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.4.1</version>
</dependency>
```



### JwtUtils JWT工具类

```java
@Slf4j
public class JwtUtils {

    private static final long EXPIRES_TIME = 7 * 24 * 60 * 60 * 1000L; // token超时时间: 7天
    private static final String SECRET = "WSL!@#123"; // 密码

    public static String createJwtToken(int userId, String username, int structureId){
        Date expireDate = new Date(System.currentTimeMillis() + EXPIRES_TIME);
        Algorithm algorithm = Algorithm.HMAC256(SECRET);

        return JWT.create() // 需要哪些载荷自己加
                .withClaim("userId", userId)
                .withClaim("username", username)
                .withClaim("structureId", structureId)
                .withExpiresAt(expireDate)
                .sign(algorithm);
    }

    /**
     * 对token验签，若失败返回null
     * @param token 客户端传入的token
     * @return decodeJWT
     */
    public static DecodedJWT verify(String token){
        DecodedJWT decodedJWT = null;
        try {
            decodedJWT = JWT.require(Algorithm.HMAC256(SECRET)).build().verify(token);
        } catch (JWTVerificationException e) {
            log.info("token失效");
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        }

        return decodedJWT;
    }

    /**
     * 获得载荷
     * @param token
     * @param key
     * @return
     */
    public static Claim getClaim(String token, String key){
        Claim claim = null;
        try {
            claim =  JWT.decode(token).getClaim(key);
        }catch (Exception e) {
            log.warn("token无效: " + token);
        }
        return claim;
    }

    /**
     * 获得载荷，同时验证token有效性
     * @param token
     * @param key
     * @return
     */
    public static Claim getClaimSercure(String token, String key){
        DecodedJWT decodedJWT = verify(token);
        if (decodedJWT == null){
            return null;
        }
        return decodedJWT.getClaim(key);
    }

}

```



### JwtToken 用来对接Shiro

通过实现AuthenticationToken接口来让Shiro接受我们的token字符串

```java
public class JwtToken implements AuthenticationToken {
    private final String token;

    public JwtToken(String token) {
        this.token = token;
    }

    @Override
    public Object getPrincipal() {
        return token;
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public String toString() {
        return token;
    }
}
```



### JwtReaml 自定义Reaml

```java
public class JwtRealm extends AuthorizingRealm {
    @Autowired
    private UserMapper userMapper;

    @Override	// 用来授权
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        String token = (String)principals.getPrimaryPrincipal();

        String username = JwtUtils.getClaim(token, "username").asString();
        User queryUser = userMapper.queryUser(username);
        if (queryUser == null){
            return null;
        }
        SimpleAuthorizationInfo simpleAuthorizationInfo = new SimpleAuthorizationInfo();
        simpleAuthorizationInfo.addRoles(Arrays.asList(queryUser.getRoles().split(",")));
        return simpleAuthorizationInfo;
    }

    @Override	// 用来认证
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        String jwtToken = token.toString();
        log.debug("开始认证---token:" + jwtToken);

        Claim userIdClaim = JwtUtils.getClaimSercure(jwtToken, "userId");
        Claim usernameClaim = JwtUtils.getClaimSercure(jwtToken, "username");
        if (userIdClaim == null || usernameClaim == null){
            throw new AuthenticationException("token错误");
        }

        log.debug(usernameClaim.asString() + "---认证通过");

        return new SimpleAuthenticationInfo(jwtToken, jwtToken, "JwtRealm");
    }

    @Override
    public boolean supports(AuthenticationToken token) {
        return token instanceof JwtToken;
    }
}
```



### JwtFilter 自定义Filter

```java
@Slf4j
public class JwtFilter extends BasicHttpAuthenticationFilter {
    private static final String TOKEN_HEADER = "token"; // 请求头的key


    @Override
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        HttpServletRequest httpRequest = WebUtils.toHttp(request);

        // 很重要！！！预检请求不会携带我们的token直接通过
        // 预检请求
        if (httpRequest.getMethod().equals(RequestMethod.OPTIONS.name())){
            return true;
        }

        String token = httpRequest.getHeader(TOKEN_HEADER);

        if (token == null){
            return false;
        }

        JwtToken jwtToken = new JwtToken(token);
        try {
            // 验证token
            SecurityUtils.getSubject().login(jwtToken);
        } catch (AuthenticationException e) {
            log.debug(e.getMessage());
            return false;
        }
        return true;
    }

    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
        // 未登录
        // 向前端返回401
        response.setCharacterEncoding("utf-8");
        RespResult<Object> result = RespResult.unAuthentication();

        ObjectMapper objectMapper = new ObjectMapper();
        String resultJSON = objectMapper.writeValueAsString(result);
        PrintWriter writer = response.getWriter();
        writer.write(resultJSON);

        return false;
    }
}

```



### ShiroConfig 将配置注入到springboot中

```java
@Configuration
public class ShiroConfig {

    @Bean
    public ShiroFilterFactoryBean shiroFilterFactoryBean(SecurityManager securityManager){
        ShiroFilterFactoryBean factoryBean = new ShiroFilterFactoryBean();
        factoryBean.setSecurityManager(securityManager);

        factoryBean.getFilters().put("jwt", new JwtFilter());


        factoryBean.setFilterChainDefinitionMap(shiroFilterChainDefinition().getFilterChainMap());
        return factoryBean;
    }


    @Bean
    public ShiroFilterChainDefinition shiroFilterChainDefinition(){
        DefaultShiroFilterChainDefinition chainDefinition = new DefaultShiroFilterChainDefinition();
		// 自定义
        chainDefinition.addPathDefinition("/login", "anon");
        chainDefinition.addPathDefinition("/register", "anon");
        chainDefinition.addPathDefinition("/img/**", "anon");
        chainDefinition.addPathDefinition("/**", "jwt");

        return chainDefinition;
    }

}
```

