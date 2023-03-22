# <center>simple-docker-manage<center>
### <center>简单的docker管理平台<center>
# ✨概述
**simple-docker-manage**是基于vue和nodejs实现的一个简单docker管理平台,主要用到dockerode库实现简单的操作,创建之初也只是想简单管理docker一些常见的操作,让自己更好的去管理的docker,后续必然还会添加更多功能!!!!😏😏😏
# 📌功能
1. 支持连接多个docker服务器
2. docker相关信息和当前启动的容器,镜像等
3. 支持镜像拉取,搜索,删除
4. 镜像详情
5. 实时更新镜像拉取情况
6. 支持新建容器
7. 容器支持批量启动关闭移除,进入命令行

# ❗项目启动
## 后端
```shell
git clone https://github.com/OblivionTime/simple-docker-manage.git
cd simple-docker-manage/server
yarn
node index.js

```
浏览器输入`http://127.0.0.1:7888/#/index`进入网站
## 前端
```shell
# 进入ui
cd simple-docker-manage/ui
yarn
# 调试
yarn serve
# 打包
yarn build
```
# 🖼️ 项目截图
![在这里插入图片描述](https://img-blog.csdnimg.cn/fdd5115a65fc4d42a0153af04495b9b5.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/bae56b1de9a0441bb96758707719e573.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/a822dbbc3a2444b189f9418d52eb4329.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/2b96981dd69c4b1e807adbfce9f4b0ba.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/1f3b33698ccb4e0f88f1e7ebed479032.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/5af55734a5fe4079a2cc1933fd5725b3.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/ec762cdb9158403dbf6a6da68d74a63b.png)
![在这里插入图片描述](https://img-blog.csdnimg.cn/3951426d2967495f9bed5ec3ceec1397.png)
