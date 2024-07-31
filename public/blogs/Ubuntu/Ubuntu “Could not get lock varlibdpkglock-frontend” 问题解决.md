# 摘要

Ubuntu “Could not get lock varlibdpkglock-frontend” 问题解决





# 正文

```shell
sudo killall apt apt-get
sudo rm /var/lib/apt/lists/lock
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock*
sudo dpkg --configure -a
sudo apt update
```



