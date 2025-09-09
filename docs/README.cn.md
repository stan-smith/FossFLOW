# FossFLOW - 等距图表工具 <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="../README.md">English</a> | <a href="README.cn.md">简体中文</a>
</p>

<b>嗨！</b> 我是 Stan，如果您使用过 FossFLOW 并觉得它对您有帮助，<b>我会非常感激您能捐助一点点 :)</b> 我全职工作，抽时间来维护这个项目已经很不容易了。
如果我为您实现了某个功能，或者修复了某个 bug，能得到您的支持将非常棒 :) 如果不能，也没关系，这个软件将永远免费！

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P61KBXA3)

<img width="30" height="30" alt="image" src="https://github.com/user-attachments/assets/dc6ec9ca-48d7-4047-94cf-5c4f7ed63b84" /> <b> https://buymeacoffee.com/stan.smith </b>

感谢，

-Stan


------------------------------------------------------------------------------------------------------------------------------
FossFLOW 是一款功能强大的、开源的渐进式 Web 应用（PWA），专为创建精美的等距图表而设计。它基于 React 和 Isoflow（现已 fork 并以 fossflow 名称发布到 NPM）库构建，完全在浏览器中运行，并支持离线使用。

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/master/ISOFLOW_TODO.md)** - 当前的问题和路线图，包含代码库映射，大多数问题都与 isoflow 库本身有关。
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - 如何为项目做出贡献。

## 功能

- 🎨 **等距图表** - 创建令人惊叹的 3D 风格技术图表
- 💾 **自动保存** - 您的工作每 5 秒自动保存一次
- 📱 **PWA 支持** - 在 Mac 和 Linux 上安装为原生应用
- 🔒 **隐私优先** - 所有数据都存储在您的浏览器中
- 📤 **导入/导出** - 以 JSON 文件形式分享图表
- 🎯 **会话存储** - 快速保存，无需对话框
- 🌐 **离线支持** - 无需网络连接即可工作

## 在线试用

访问 https://stan-smith.github.io/FossFLOW/

## 快速开始 (本地开发)

```bash
# 克隆仓库
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# 安装依赖
npm install

# 启动开发服务器
npm start
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 使用方法

### 创建图表

1. **添加项目**：
   - 按下右上角菜单的 "+" 按钮，组件库将出现在左侧。从库中拖放组件到画布上。
   - 或者右键点击网格并选择 "Add node"，然后点击新创建的节点并从左侧菜单自定义它。
2. **连接项目**：使用连接器显示组件之间的关系。
3. **自定义**：更改项目的颜色、标签和属性。
4. **导航**：平移和缩放以处理不同区域。

### 保存您的工作

- **自动保存**：图表每 5 秒自动保存到浏览器存储。
- **快速保存**：点击 "Quick Save (Session)" 进行即时保存，无需弹窗。
- **另存为**：使用 "Save New" 创建具有不同名称的副本。

### 管理图表

- **加载**：点击 "Load" 查看所有已保存的图表。
- **导入**：从他人分享的 JSON 文件加载图表。
- **导出**：将图表下载为 JSON 文件以分享或备份。
- **存储**：使用 "Storage Manager" 管理浏览器存储空间。

### 键盘快捷键

- `Delete` - 删除选中项
- 鼠标滚轮 - 放大/缩小
- 点击并拖动 - 平移画布
- ***新增*** Ctrl+Z 撤销，Ctrl+Y 重做

## 生产环境构建

```bash
# 创建优化后的生产环境构建
npm run build

# 本地运行生产环境构建
npx serve -s build
```

`build` 文件夹包含所有部署所需的文件。

如果需要将应用部署到自定义路径（例如非根路径），请使用以下命令：
```bash
# 为指定路径创建优化后的生产环境构建
PUBLIC_URL="https://mydomain.tld/path/to/app" npm run build
```
这会将定义的 `PUBLIC_URL` 添加为所有静态文件链接的前缀。

## 部署

### 静态托管

将 `build` 文件夹部署到任何静态托管服务：
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- 任何 Web 服务器

### 重要说明

1. **需要 HTTPS**：PWA 功能需要 HTTPS（localhost 除外）
2. **浏览器存储**：图表保存在浏览器的 localStorage 中（约 5-10MB 限制）
3. **备份**：定期将重要图表导出为 JSON 文件

## 浏览器支持

- Chrome/Edge（推荐）✅
- Firefox ✅
- Safari ✅
- 支持 PWA 的移动浏览器 ✅

## 问题排查

### 存储已满
- 使用存储管理器释放空间
- 导出并删除旧图表
- 清除浏览器数据（最后手段 - 会删除所有图表）

### 无法安装 PWA
- 确保使用 HTTPS
- 尝试使用 Chrome 或 Edge 浏览器
- 检查是否已安装

### 图表丢失
- 检查浏览器的 localStorage
- 查找自动保存的版本
- 始终导出重要工作

## 技术栈

- **React** - UI 框架
- **TypeScript** - 类型安全
- **Isoflow** - 等距图表引擎
- **PWA** - 离线优先的 Web 应用

## 贡献

欢迎贡献！请随时提交 Pull Request。

## 许可证

Isoflow 使用 MIT 许可证发布。

FossFLOW 使用 Unlicense 许可证发布，您可以随意使用。

## 鸣谢

基于 [Isoflow](https://github.com/markmanx/isoflow) 库构建。

x0z.co