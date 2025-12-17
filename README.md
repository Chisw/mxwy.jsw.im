<img src="./public/assets/logo.png" style="height: 128px" />

## 蒙学文吟

https://mxwy.jsw.im

### 一、简介

教自己小孩拼音识字用的，开源分享给同好的家长们 ❤️

使用 [Netlify](https://www.netlify.com) 免费的自动部署服务，国内访问可能会卡顿，甚至音频无法加载，本地部署会好很多

现有 19 条音频（蒙学 7 部、选文 10 篇）已涵盖 2600+ 汉字，完全满足幼儿识字需求，因此不再增录，大佬们可自行 fork 处理

字幕拼音均为本人逐字听取校排，难免有错讹之处，欢迎指正

### 二、感谢

<img src="./public/assets/avatar.jpg" style="height: 64px;" />

在此由衷感谢 [白云出岫](https://www.ximalaya.com/zhubo/4228109) 老师，他在朗读经典上所浇筑的心血，普惠大众，功德无量 🙏🏻

### 三、扫码访问

<img src="./public/assets/qr-code.png" style="height: 200px" />

### 四、开发构建

```sh
# 安装依赖
yarn

# 启动
yarn dev

# 构建
yarn build

# 纠错用
# āáǎà ōóǒò ēéěè īíǐì ūúǔù ǖǘǚǜ
```

按需生成字体：

```sh
# 将字体文件重命名为 font.ttf 放入
./font-generator
```

```sh
# 首次安装
npm i -g font-spider

# 执行
cd font-generator
./gen.sh
```

### 五、自行增录

> 以《道德经》为例，注意 yml 文件的空格对齐

#### 1. 准备 .m4a 音频文件

```sh
# 放入位置
./public/assets/audios/dao-de-jing.m4a
```

#### 2. 准备 .yml 字幕

```sh
# 放入位置
./public/assets/books/dao-de-jing.yml
```

字段说明：

```yml
# 键值
key: dao-de-jing
# 区间列表：段落名称 @ 起始句序号 , 终止句序号
sections:
  - 一章@1,10
  - 二章@11,20
  # ...
# 句子列表
sentences:
  - time: 00:01.00 # 使用在线歌词编辑器打点生成
    text: 道可道，非常道。 # 文本
    pinyin: dào kě dào fēi cháng dào # 只有汉字拼音，标点符号、空格会自动忽略
    annotation: # 注解映射（插入位置: 注解内容）
      1: 注解
  # ...
```

#### 3. 更新 index.yml 文件，追加数据

```sh
# 编辑位置
./public/assets/books/index.yml
```

```yml
  - key: dao-de-jing
    group: 3 # 1: 辨音识字，2: 百家选文，3：自定义
    title: 道德经
    author: （春秋）老子
    sentences: 5000 # 句子数
    seconds: 500 # 音频秒数
    size: 50000 # 音频文件字节数
    sha256sum: sha256sum # 音频哈希值
    background: '#000000' # 封面底色
    intro: 文本介绍
```
