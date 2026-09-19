# 编码规则
- KISS：最直观可维护的实现
- 卫语句：early return 替代 else
- 缩进 ≤2 层：抽函数扁平化

# UI 规范
- 模板：Dimension by HTML5 UP (CCA 3.0)，`index.html:1` 单页模态
- 布局：`#wrapper` 居中 → `#header` logo+nav 4 链接 → `#main article` 弹窗 → `#footer` → `#bg` 固定层；`assets/sass/libs/_vars.scss:1` 定义
- 导航：`#header nav ul li a[href="#intro|#work|#about|#contact"]` 点击展开对应 `article`，背景 `scale(1.125→1.0825)+blur(0.2rem)` 切换
- 组件：`.image main/fit` 图片，`.fields .field half` 表单，`.icons` FontAwesome，`is-preload` 入场过渡 `0.325s`
- 交互：`assets/js/main.js:1` jquery+breakpoints+browser+util，ESC/点击背景关闭，随 `assets/sass/libs/_breakpoints.scss` 响应
- 资源：`assets/css/main.css` 编译自 `assets/sass`，`assets/background.webp` (image-to-webp 136KB) 覆盖 `images/bg.jpg`，`assets/IMG_2067.jpg` + `scenery/*.jpg` 替换 `images/pic01-03.jpg`

# 视觉风格
- 配色：`$palette bg #1b1f22, bg-alt #000, bg-overlay rgba(19,21,25,0.5), fg #fff, border #fff, border-bg rgba(255,255,255,0.075)`；`--gradient` 已移除，回归模板深色
- 排版：`Source Sans Pro 300/600`，`letter-spacing 0.2rem/0.5rem`，`border-radius 4px, border 1px`，`Source Sans Pro` 加载自 Google Fonts
- 背景：`#bg:after` `cover center` + `#bg:before` `overlay.png` 平铺 + 渐变遮罩，`bg.webp` 需保持 1920x1276
- 图标：`assets/css/fontawesome-all.min.css` + `assets/webfonts`，`fa-gem/fa-user/fa-github` 等
- 文案：`index.html:39` 四区已替换为 Tony Wang 自我介绍，缺失字段用“待补充”，不编造
