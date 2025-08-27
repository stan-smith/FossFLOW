# FossFLOW - 等距图表工具 <img width="30" height="30" alt="fossflow" src="https://github.com/user-attachments/assets/56d78887-601c-4336-ab87-76f8ee4cde96" />

<p align="center">
 <a href="../README.md">English</a> | <a href="README.cn.md">简体中文</a>
</p>

FossFLOW 是一款功能强大的、开源的渐进式 Web 应用（PWA），专为创建精美的等距图表而设计。它基于 React 和 Isoflow（现已 fork 并以 fossflow 名称发布到 NPM）库构建，完全在浏览器中运行，并支持离线使用。

![Screenshot_20250630_160954](https://github.com/user-attachments/assets/e7f254ad-625f-4b8a-8efc-5293b5be9d55)

- **📝 [FOSSFLOW_TODO.md](https://github.com/stan-smith/FossFLOW/blob/master/ISOFLOW_TODO.md)** - 当前的问题和路线图，包含代码库映射，大多数问题都与 isoflow 库本身有关。
- **🤝 [CONTRIBUTORS.md](https://github.com/stan-smith/FossFLOW/blob/master/CONTRIBUTORS.md)** - 如何为项目做出贡献。

## 近期更新 (2025年8月)

### 连接器工具改进
- **点击创建** - 新的默认模式：点击第一个节点，再点击第二个节点即可连接
- **拖拽模式选项** - 原始的拖拽功能仍可通过设置使用
- **模式切换** - 在 Settings → Connectors 标签页中切换点击和拖拽模式
- **更高可靠性** - 点击模式让连接创建更加可预测

### 自定义图标导入
- **导入您的图标** - 上传自定义图标（PNG, JPG, SVG）并在图表中使用
- **自动缩放** - 图标会自动缩放至统一尺寸，确保专业外观
- **等距/平面切换** - 选择导入的图标是显示为 3D 等距效果还是平面 2D 效果
- **智能持久化** - 自定义图标会随图表一同保存，并在所有存储方式中有效
- **图标资源** - 寻找免费图标：
  - [Iconify Icon Sets](https://icon-sets.iconify.design/) - 数千个免费 SVG 图标
  - [Flaticon Isometric Icons](https://www.flaticon.com/free-icons/isometric) - 高质量的等距图标包

### 服务器存储支持
- **持久化存储** - 图表保存到服务器文件系统，在浏览器会话之间持久化
- **多设备访问** - 使用 Docker 部署时，可从任何设备访问您的图表
- **自动检测** - 当可用时，界面会自动显示服务器存储选项
- **防覆盖保护** - 使用重复名称保存时会弹出确认对话框
- **Docker 集成** - 在 Docker 部署中默认启用服务器存储

### 交互功能增强
- **可配置快捷键** - 三种配置文件（QWERTY, SMNRCT, 无）用于工具选择，并配有视觉指示器
- **高级平移控制** - 多种平移方式，包括空白区域拖拽、中键/右键点击、修饰键（Ctrl/Alt）以及键盘导航（方向键/WASD/IJKL）
- **切换连接器箭头** - 可选择显示或隐藏单个连接器上的箭头
- **持久化工具选择** - 创建连接后，连接器工具保持激活状态
- **设置对话框** - 集中配置快捷键和平移控制

### Docker & CI/CD 改进
- **自动化 Docker 构建** - 通过 GitHub Actions 工作流，在提交时自动部署到 Docker Hub
- **多架构支持** - 同时支持 `linux/amd64` 和 `linux/arm64` 架构的 Docker 镜像
- **预构建镜像** - 可在 `stnsmith/fossflow:latest` 获取

### Monorepo 架构
- **单一代码库** 用于库和应用程序
- **NPM Workspaces** 简化依赖管理
- **统一构建流程** 在根目录使用 `npm run build`

### UI 修复
- 修复了 Quill 编辑器工具栏图标显示问题
- 解决了上下文菜单中的 React key 警告
- 改进了 Markdown 编辑器样式

## 功能

- 🎨 **等距图表** - 创建令人惊叹的 3D 风格技术图表
- 💾 **自动保存** - 您的工作每 5 秒自动保存一次
- 📱 **PWA 支持** - 在 Mac 和 Linux 上安装为原生应用
- 🔒 **隐私优先** - 所有数据都存储在您的浏览器中
- 📤 **导入/导出** - 以 JSON 文件形式分享图表
- 🎯 **会话存储** - 快速保存，无需对话框
- 🌐 **离线支持** - 无需网络连接即可工作
- 🗄️ **服务器存储** - 使用 Docker 时可选的持久化存储（默认启用）

## 在线试用

访问 https://stan-smith.github.io/FossFLOW/

## 🐳 使用 Docker 快速部署

```bash
# 使用 Docker Compose（推荐 - 包含持久化存储）
docker compose up

# 或者直接从 Docker Hub 运行，并带有持久化存储
docker run -p 80:80 -v $(pwd)/diagrams:/data/diagrams stnsmith/fossflow:latest
```

在 Docker 中默认启用服务器存储。您的图表将保存到主机上的 `./diagrams` 目录。

要禁用服务器存储，请设置 `ENABLE_SERVER_STORAGE=false`：
```bash
docker run -p 80:80 -e ENABLE_SERVER_STORAGE=false stnsmith/fossflow:latest
```

## 快速开始 (本地开发)

```bash
# 克隆仓库
git clone https://github.com/stan-smith/FossFLOW
cd FossFLOW

# 安装依赖
npm install

# 构建库（首次需要）
npm run build:lib

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## Monorepo 结构

这是一个包含两个包的 monorepo：

- `packages/fossflow-lib` - 用于绘制网络图的 React 组件库（使用 Webpack 构建）
- `packages/fossflow-app` - 用于创建等距图表的渐进式 Web 应用（使用 RSBuild 构建）

### 开发命令

```bash
# 开发
npm run dev          # 启动应用开发服务器
npm run dev:lib      # 库开发的监听模式

# 构建
npm run build        # 构建库和应用
npm run build:lib    # 仅构建库
npm run build:app    # 仅构建应用

# 测试和代码检查
npm test             # 运行测试
npm run lint         # 检查代码规范错误

# 发布
npm run publish:lib  # 将库发布到 npm
```

## 使用方法

### 创建图表

1. **添加项目**：
   - 按下右上角菜单的 "+" 按钮，组件库将出现在左侧
   - 从库中拖放组件到画布上
   - 或者右键点击网格并选择 "Add node"

2. **连接项目**：
   - 选择连接器工具（按 'C' 键或点击连接器图标）
   - **点击模式**（默认）：点击第一个节点，再点击第二个节点
   - **拖拽模式**（可选）：点击并从第一个节点拖拽到第二个节点
   - 在 Settings → Connectors 标签页中切换模式

3. **保存您的工作**：
   - **快速保存** - 保存到浏览器会话
   - **导出** - 下载为 JSON 文件
   - **导入** - 从 JSON 文件加载

### 存储选项

- **会话存储**：在浏览器关闭时清除的临时保存
- **导出/导入**：以 JSON 文件形式永久存储
- **自动保存**：每 5 秒自动将更改保存到会话中

## 贡献

我们欢迎您的贡献！请参阅 [CONTRIBUTORS.md](../CONTRIBUTORS.md) 了解指南。

## 文档

- [ISOFLOW_ENCYCLOPEDIA.md](../ISOFLOW_ENCYCLOPEDIA.md) - 代码库的综合指南
- [ISOFLOW_TODO.md](../ISOFLOW_TODO.md) - 当前问题和路线图
- [CONTRIBUTORS.md](../CONTRIBUTORS.md) - 贡献指南

## 许可证

MIT