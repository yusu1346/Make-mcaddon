# MC Addon Generator v2.0

Minecraft Bedrock Edition Addon 生成器 - 轻松创建自定义实体、方块、物品、配方和生物群系！

## ✨ 功能特性

- 🎮 **自定义实体** - 创建带有自定义属性的生物，支持Boss血条
- 🧱 **自定义方块** - 创建带有自定义硬度和发光等级的方块
- ⚔️ **自定义物品** - 创建武器、工具和食物
- 🧪 **自定义配方** - 创建合成配方
- 🌍 **自定义生物群系** - 创建带有自定义气候和天空颜色的生物群系
- 🎨 **纹理上传** - 直接上传纹理文件
- 📦 **一键打包** - 生成完整的Addon ZIP文件
- 📱 **响应式设计** - 支持手机和电脑使用

## 🚀 快速开始

### 在线使用
访问部署的网站即可直接使用。

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📱 打包成Android APK

### 方法一：GitHub Actions（推荐）

1. 将代码推送到GitHub仓库
2. GitHub Actions会自动构建APK
3. 在Actions页面下载APK

详细步骤见 `GITHUB_ACTIONS_GUIDE.md`

### 方法二：本地构建

```bash
# 构建网站
npm run build

# 安装Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 添加Android平台
npx cap add android

# 同步文件
npx cap sync

# 用Android Studio打开并构建APK
npx cap open android
```

## 📖 使用教程

### 1. 设置项目
- 填写Addon名称、描述、版本和作者

### 2. 添加实体
- 输入实体名称
- 设置生命值、移动速度、攻击力
- 开启Boss模式或飞行能力

### 3. 添加方块
- 输入方块名称
- 设置硬度和发光等级

### 4. 添加物品
- 输入物品名称
- 设置最大堆叠数量和耐久度

### 5. 上传纹理
- 切换到"资源"标签
- 上传PNG或JPG纹理文件

### 6. 添加生物群系
- 切换到"群系"标签
- 设置温度和降雨量

### 7. 下载Addon
- 点击"下载Addon"按钮
- 将ZIP文件解压到Minecraft行为包/资源包文件夹

## 📁 项目结构

```
mc-addon-generator/
├── .github/
│   └── workflows/
│       └── build-apk.yml    # GitHub Actions配置
├── src/
│   ├── components/          # UI组件
│   ├── hooks/              # React Hooks
│   ├── types/              # TypeScript类型
│   ├── lib/                # 工具函数
│   ├── App.tsx             # 主应用
│   ├── main.tsx            # 入口
│   └── index.css           # 样式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🛠️ 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Capacitor (Android)
- JSZip

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

Made with ❤️ for Minecraft Bedrock Edition
