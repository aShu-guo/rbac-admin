# 中间件-middleware

中间件执行时机位于请求到服务时的第一层

nest 中的中间件等价于 express 中的中间件，有以下功能：

> - 执行任意代码
> - 改变 request 和 response 对象
> - 如果有下个中间件需要调用，则在当前中间件执行 next()调用；如果没有，则终止

![img.png](img.png)
