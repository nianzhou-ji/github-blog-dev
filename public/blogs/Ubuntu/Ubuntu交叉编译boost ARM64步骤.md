# 摘要

在Ubuntu下交叉编译 arm64 架构的boost库，用于ar creator以及氛围灯项目的开发部署

# AMD64（X86_64）上交叉编译

## 环境准备

- 安装gnu环境

```shell
sudo apt update
sudo apt install build-essential
gcc --version
```

- 安装交叉编译器

```shell
sudo apt-get install gcc-aarch64-linux-gnu g++-aarch64-linux-gnu
```

- 下载boost库源码：[https://www.boost.org/](https://www.boost.org/）下载最新版本的Boost库源代码，并解压到一个目录中。)

# 编译

1.编译boost库

```shell
./bootstrap.sh --with-toolset=gcc --prefix=$libInstallPath$
```

其中，`--with-toolset=gcc`指定使用GCC编译器，`--prefix`指定编译后的Boost库安装路径。

2.修改Boost库编译配置文件：打开`project-config.jam`文件，添加以下内容：

```shell
using gcc : aarch64 : aarch64-linux-gnu-g++ ;

using gcc : aarch64 : 或者aarch64-linux-gnu-g++的绝对路径 ;
```

3.编译Boost库：执行以下命令开始编译Boost库：            

```shell
./b2 toolset=gcc-aarch64 link=static runtime-link=static
```

4.安装Boost库：执行以下命令将编译好的Boost库安装到指定路径：

```
./b2 install --prefix=$libInstallPath$
```



