---
layout: index
index: true
title: Nuxt后端架构搭建流程
cover: /images/posts/nuxt-server/nuxt-server.png
description: 基于 Nuxt 3 全栈框架，从零搭建一个具备分层架构、依赖注入、JWT 鉴权、Redis 缓存的后端服务，适合想用一套技术栈覆盖前后端的开发者。
category:
    - fullstack
tags:
    - name: Nuxt
      icon: logos:nuxt-icon
      color: #00DC82
      url: https://nuxt.com/
    - name: Prisma
      icon: simple-icons:prisma
      color: #2D3748
      url: https://www.prisma.io/
    - name: TypeScript
      icon: logos:typescript-icon
      color: #3178C6
      url: https://www.typescriptlang.org/
date: 2026-06-10
---

## 前言

传统的前后端分离项目需要维护两个独立仓库、两套构建流程、两次部署。而 Nuxt 3 内置的 Nitro 服务引擎让我们可以在同一个项目中编写前端页面和后端 API，共享类型定义、统一部署流程，大幅降低全栈开发的心智负担。

这篇文章以一个真实的博客系统（Jojo Blog）为例，完整记录从项目初始化到生产部署的后端架构搭建过程。如果你正在考虑用 Nuxt 做全栈项目，或者想了解一个中小型项目的后端如何组织代码，这篇文章应该能给你一些参考。

**适合读者**：有一定 Vue/Nuxt 基础，想了解如何用 Nuxt 搭建后端服务的前端开发者。

---

## 技术栈概览

| 技术            | 版本    | 用途                              |
| --------------- | ------- | --------------------------------- |
| Nuxt 3          | ^3.19.0 | 全栈框架，提供服务端 API（Nitro） |
| Prisma          | ^6.9.0  | ORM，数据库访问层                 |
| MySQL           | -       | 主数据库                          |
| Redis (ioredis) | ^5.8.2  | 缓存，防刷浏览量去重              |
| InversifyJS     | ^7.5.2  | IoC 容器，依赖注入                |
| Zod             | ^4.1.9  | 请求参数校验                      |
| jsonwebtoken    | ^9.0.2  | JWT 鉴权                          |
| nodemailer      | ^7.0.10 | 邮件发送                          |

---

## 零、整体目录结构

在展开每个模块之前，先看一下后端代码在 `server/` 目录下的组织方式，建立整体印象：

```
server/
├── api/                    # API 路由（Nitro 文件路由约定）
│   ├── blog/
│   │   ├── blogCreate.post.ts
│   │   ├── blogList.get.ts
│   │   ├── blogDelete.delete.ts
│   │   ├── blogUpdate.post.ts
│   │   └── blogAddView/
│   │       └── [id].put.ts
│   ├── user/
│   ├── tag/
│   ├── record/
│   ├── md/
│   ├── statistical/
│   ├── error/
│   └── sitemap/
├── core/                   # 基础设施单例
│   ├── prisma.ts
│   ├── redis.ts
│   └── container.ts        # IoC 容器
├── middleware/
│   └── auth.ts             # JWT 鉴权中间件
├── repositories/           # 数据访问层（业务逻辑在此）
│   ├── BlogRepository.ts
│   ├── UserRepository.ts
│   └── ...
├── services/               # Service 接口定义
│   ├── BlogService.ts
│   └── ...
├── serviceImpl/            # Service 接口实现（委托给 Repository）
│   ├── BlogServiceImpl.ts
│   └── ...
├── dto/                    # Zod 请求参数校验 Schema
│   ├── CreateBlogDto.ts
│   └── ...
└── utils/                  # 工具函数
    ├── jwt.ts
    ├── public.ts
    ├── error.ts
    ├── image-process.ts
    └── index.ts
```

这套分层结构参考了 Java Spring 的设计思路：Controller（api 路由）→ Service（接口）→ ServiceImpl（实现）→ Repository（数据访问）。在 TypeScript 项目里通过 InversifyJS 实现依赖注入，让各层之间保持松耦合、易测试。

---

## 一、项目初始化

```bash
npx nuxi init jojo-blog
cd jojo-blog
npm install
```

安装后端核心依赖：

```bash
npm install prisma @prisma/client mysql2 ioredis inversify reflect-metadata jsonwebtoken zod nodemailer sharp exifreader
npm install -D @types/jsonwebtoken @types/nodemailer
```

> `reflect-metadata` 是 InversifyJS 的必要依赖，用于在运行时读取 TypeScript 的装饰器元数据。需要在入口文件顶部 `import 'reflect-metadata'`。

另外，由于 InversifyJS 使用了装饰器，需要在 `tsconfig.json` 中开启以下选项：

```json
{
	"compilerOptions": {
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true
	}
}
```

---

## 二、数据库设计（Prisma Schema）

### 2.1 初始化 Prisma

```bash
npx prisma init
```

在 `.env` 中配置数据库连接：

```bash
DATABASE_URL="mysql://user:password@localhost:3306/jojo_blog"
```

### 2.2 数据模型设计

`prisma/schema.prisma` 定义了以下核心模型：

**用户与标签**

```prisma
model user_info {
    id         Int        @id @default(autoincrement())
    user_name  String     @db.VarChar(10)
    password   String     @db.VarChar(20)
    avatar_url String     @db.VarChar(255)
    pet_name   String     @db.VarChar(20)
    describe   String     @db.Text
    sign       String     @db.Text
    tags       user_tag[]
}

model tag {
    id       Int        @id @default(autoincrement())
    name     String     @db.VarChar(50)
    icon     String     @db.VarChar(255)
    url      String     @db.VarChar(255)
    type     TagType    @default(BLOG)
    color    String     @default("#000000") @db.VarChar(20)
    blog_tag blog_tag[]
    users    user_tag[]

    @@unique([name, type])
}

enum TagType {
    BLOG
    PERSON
}
```

**博客与浏览记录**

```prisma
model blog {
    id          Int        @id @default(autoincrement())
    title       String
    subtitle    String
    created_at  DateTime   @default(now())
    updated_at  DateTime   @updatedAt
    content     String     @db.Text
    date_path   String     @db.VarChar(255)
    front_cover String     @db.VarChar(255)
    views       Int        @default(0)
    tags        blog_tag[]
}

model blog_views_daily {
    id        Int      @id @default(autoincrement())
    blog_id   Int
    view_date DateTime
    views     Int      @default(0)

    @@unique([blog_id, view_date])
}
```

**日记模块（record）**：`record_groups` → `record_details` → `record_images`，三层级联结构。

**错误上报**：`error_report` 记录用户提交的 bug 反馈。

### 2.3 生成并迁移数据库

```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 三、基础设施层（server/core）

### 3.1 Prisma 单例

`server/core/prisma.ts` 通过挂载到 `globalThis` 避免开发热更新时重复实例化：

```typescript
const globalForPrisma = global as typeof globalThis & { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### 3.2 Redis 单例

`server/core/redis.ts` 同理，连接本地 Redis：

```typescript
export const redis = globalForRedis.redis || new Ioredis({ host: '127.0.0.1', port: 6379 });
```

### 3.3 IoC 容器（InversifyJS）

依赖注入（DI）的核心价值是解耦：API 路由不需要关心 `BlogService` 是怎么创建的，只需要向容器索取一个实现了 `BlogService` 接口的对象即可。这让后续替换实现、添加测试 Mock 都变得很简单。

`server/core/container.ts` 统一管理所有服务的依赖注入关系。每个业务模块按 Repository → ServiceImpl → Service 接口三层绑定：

```typescript
const container = new Container();

// 绑定 Repository（单例）
container.bind(BlogRepository).toSelf().inSingletonScope();

// 绑定 Service，手动注入 Repository 依赖
container
	.bind(BLOG_SERVICE)
	.toDynamicValue(() => {
		return new BlogServiceImpl(container.get(BlogRepository));
	})
	.inSingletonScope();
```

`inSingletonScope()` 确保整个应用生命周期内只创建一个实例，避免每次请求都重复实例化。

当前注册的业务模块：`User`、`Tag`、`Blog`、`Md`、`Group`、`RecordDetail`、`Error`、`Statistical`。

---

## 四、分层架构

### 4.1 整体层次

```
API 路由 (server/api/**)
    ↓ 调用
Service 接口 (server/services/*.ts)
    ↓ 实现
ServiceImpl (server/serviceImpl/*.ts)
    ↓ 委托
Repository (server/repositories/*.ts)
    ↓ 访问
Prisma / Redis / 文件系统
```

### 4.2 Service 接口定义

每个业务模块定义一个 Symbol Token 和接口，供容器和路由使用：

```typescript
// server/services/BlogService.ts
export const BLOG_SERVICE = Symbol('BlogService');

export interface BlogService {
	createBlog(data: CreateBlogDto): ReturnType<BlogRepository['createBlog']>;
	getBlogList(data: FindBlogParams): ReturnType<BlogRepository['getBlogList']>;
	deleteBlog(id: number): ReturnType<BlogRepository['deleteBlog']>;
	getBlogById(id: number): ReturnType<BlogRepository['getBlogById']>;
	updateBlog(data: Partial<CreateBlogDto>): ReturnType<BlogRepository['updateBlog']>;
	uploadfrontCover(
		files: ReturnFunction<typeof readMultipartFormData>,
	): ReturnType<BlogRepository['uploadfrontCover']>;
	addBlogView(id: number, ip: string, userAgent: string): ReturnType<BlogRepository['addBlogView']>;
}
```

### 4.3 ServiceImpl 实现

`ServiceImpl` 只做转发，不包含业务逻辑，业务逻辑统一下沉到 Repository：

```typescript
// server/serviceImpl/BlogServiceImpl.ts
export class BlogServiceImpl implements BlogService {
	constructor(private blogRepository: BlogRepository) {}

	createBlog(data: CreateBlogDto) {
		return this.blogRepository.createBlog(data);
	}
	// ... 其他方法同理
}
```

### 4.4 Repository 实现要点

Repository 是真正的业务逻辑层，以博客为例包含以下几个核心设计：

**事务处理**

创建/更新/删除博客时，博客记录与标签关联表（`blog_tag`）在同一 `$transaction` 内完成，保证数据一致性：

```typescript
async createBlog(data: CreateBlogDto) {
    return await prisma.$transaction(async (tx) => {
        const blog = await tx.blog.create({
            data: {
                title: data.title,
                content: data.content,
                // ...其他字段
            },
        });
        if (data.tags?.length) {
            await tx.blog_tag.createMany({
                data: data.tags.map((tagId) => ({ blog_id: blog.id, tag_id: tagId })),
            });
        }
        return blog;
    });
}
```

**文件系统联动**

删除博客时同步清理磁盘上的资源（封面图 + Markdown 内图片目录 `file-system/mdfile/{date_path}/`），避免产生孤儿文件。

**Redis 防刷浏览量**

浏览量增加使用 `IP + UA fingerprint` 的 MD5 作为 Redis Key，设置 24 小时过期，同一用户当天重复访问不计入：

```typescript
const fingerprint = md5(`${ip}-${userAgent}`);
const key = `blog:view:${id}:${fingerprint}`;
const exists = await redis.exists(key);
if (!exists) {
	await redis.setex(key, 86400, '1');
	await prisma.blog.update({ where: { id }, data: { views: { increment: 1 } } });
}
```

---

## 五、请求校验（Zod DTO）

Zod 的核心优势是"Schema 即类型"——一份 Schema 定义同时承担运行时校验和 TypeScript 类型推导两个职责，不需要重复写类型声明。

每个写操作对应一个 DTO Schema，位于 `server/dto/`：

```typescript
// server/dto/CreateBlogDto.ts
export const CreateBlogSchema = z.object({
	front_cover: z.string().trim().min(1, '封面不能为空'),
	title: z.string().trim().min(1, '标题不能为空'),
	subtitle: z.string().trim().min(1, '副标题不能为空'),
	content: z.string().trim().min(1, '内容不能为空'),
	date_path: z.string().trim().min(1, '日期路径不能为空'),
	id: z.number().optional(),
	views: z.number().optional(),
	tags: z.array(z.number()).optional().default([]),
});

export type CreateBlogDto = z.infer<typeof CreateBlogSchema>;
```

路由中通过 `validateData` 工具函数统一校验，校验失败直接返回 400：

```typescript
const result = validateData(CreateBlogSchema, body, (value) => {
	sendErrorWithMessage(event, 400, value);
	return null;
});
```

---

## 六、API 路由层（server/api）

Nitro 的文件路由约定非常直觉：文件名中的 `.get`、`.post`、`.put`、`.delete` 后缀直接决定 HTTP 方法，目录结构即路由路径，方括号 `[id]` 表示动态参数。不需要任何额外的路由注册代码。

| 文件名                         | HTTP 方法 | 路由路径                         |
| ------------------------------ | --------- | -------------------------------- |
| `blogCreate.post.ts`           | POST      | `/api/blog/blogCreate`           |
| `blogList.get.ts`              | GET       | `/api/blog/blogList`             |
| `blogDelete.delete.ts`         | DELETE    | `/api/blog/blogDelete`           |
| `blogUpdate.post.ts`           | POST      | `/api/blog/blogUpdate`           |
| `blogAddView/[id].put.ts`      | PUT       | `/api/blog/blogAddView/:id`      |
| `blogPublicDetail/[id].get.ts` | GET       | `/api/blog/blogPublicDetail/:id` |

每个路由处理函数遵循同一套模板：读取请求体 → Zod 校验 → 从容器取 Service → 调用业务方法 → 统一错误处理。

```typescript
// server/api/blog/blogCreate.post.ts
export default defineEventHandler(async (event) => {
	const body = await readBody<CreateBlogDto>(event);

	const result = validateData(CreateBlogSchema, body, (value) => {
		sendErrorWithMessage(event, 400, value);
		return null;
	});
	if (!result) return null;

	try {
		const blogService = container.get<BlogService>(BLOG_SERVICE);
		return await blogService.createBlog(result);
	} catch {
		sendErrorWithMessage(event, 500, '博客创建失败');
		return null;
	}
});
```

动态路由参数通过 `getRouterParam(event, 'id')` 获取：

```typescript
// server/api/blog/blogPublicDetail/[id].get.ts
export default defineEventHandler(async (event) => {
	const id = Number(getRouterParam(event, 'id'));
	if (isNaN(id)) {
		sendErrorWithMessage(event, 400, '无效的博客 ID');
		return null;
	}
	const blogService = container.get<BlogService>(BLOG_SERVICE);
	return await blogService.getBlogById(id);
});
```

---

## 七、鉴权中间件（server/middleware/auth.ts）

Nuxt 的 `server/middleware/` 目录下的文件会自动对所有请求生效，不需要显式挂载。鉴权中间件统一拦截 `/api/**` 请求，通过白名单机制区分公开接口和需要鉴权的接口。

**白名单配置（无需 Token 的接口）：**

```typescript
const whitelist = [
	'/api/user/userPublicQuery',
	'/api/blog/blogPublicQuery',
	'/api/user/user-login',
	'/api/user/user-register',
	'/api/record/recordPublicQuery',
	// ...
];

// 带动态参数的路由用正则匹配
const whitelistPatterns = [
	/^\/api\/blog\/blogPublicDetail(\/\d+)?(\?.*)?$/,
	/^\/api\/blog\/blogAddView(\/\d+)?(\?.*)?$/,
];
```

**Token 验证逻辑：**

同一套接口需要同时支持 SSR 和纯客户端两种调用场景：

- SSR 请求：Nuxt 在服务端执行 `useFetch` 时，浏览器 Cookie 会随请求带过来，从 Cookie `userState` 中解析 token
- 客户端请求（如 Admin 后台）：从请求头 `Authorization: Bearer <token>` 中获取

```typescript
export default defineEventHandler(async (event) => {
	const url = getRequestURL(event).pathname;

	// 白名单直接放行
	if (whitelist.includes(url)) return;
	if (whitelistPatterns.some((pattern) => pattern.test(url))) return;

	// 优先从 Cookie 取（SSR 场景）
	const cookies = parseCookies(event);
	let token = cookies.userState;

	// 其次从 Authorization 头取（客户端场景）
	if (!token) {
		const authHeader = getRequestHeader(event, 'Authorization');
		token = authHeader?.replace('Bearer ', '');
	}

	if (!token) {
		throw createError({ statusCode: 401, message: '未登录' });
	}

	const config = useRuntimeConfig();
	const payload = verifyToken(token, config.jwtSecret);
	if (!payload) {
		throw createError({ statusCode: 401, message: 'Token 已过期或无效' });
	}

	// 将用户信息挂载到 context，供下游路由使用
	event.context.user = payload;
});
```

---

## 八、工具函数（server/utils）

| 文件                | 职责                                            |
| ------------------- | ----------------------------------------------- |
| `jwt.ts`            | JWT 签发与验证（`signToken` / `verifyToken`）   |
| `public.ts`         | 统一返回格式 `returnData(code, message, data)`  |
| `error.ts`          | `sendErrorWithMessage` 封装 H3 错误响应         |
| `image-process.ts`  | 图片处理（sharp，格式转换）                     |
| `img-compress.ts`   | 图片压缩                                        |
| `image-metadata.ts` | 读取图片 EXIF 元数据（exifreader）              |
| `index.ts`          | 公共工具导出（`validateData`、`returnData` 等） |

---

## 九、文件存储

上传的文件统一存储在项目根目录的 `file-system/` 下，不纳入 Git 管理（`.gitignore` 中排除）：

```
file-system/
├── frontcover/          # 博客封面图片
└── mdfile/
    └── {date_path}/     # 每篇博客对应一个目录，存放 Markdown 内的图片
```

在 `nuxt.config.ts` 中将此目录配置为 Nitro 的 `publicAssets`，使其通过 `/file-system/**` 路径对外暴露：

```typescript
nitro: {
    publicAssets: [
        {
            baseURL: '/file-system',
            dir: './file-system',
            maxAge: 60 * 60 * 24 * 7, // 静态资源缓存 7 天
        },
    ],
},
```

图片上传时先用 `sharp` 做格式转换和压缩，再写入对应目录，控制磁盘占用。删除博客时通过 `fs.rmSync` 递归清理对应的 `mdfile/{date_path}/` 目录。

---

## 十、Nuxt 运行时配置

核心敏感配置在 `nuxt.config.ts` 的 `runtimeConfig` 中声明，实际值通过环境变量注入：

```typescript
runtimeConfig: {
    jwtSecret: 'jojo-blog',          // JWT 密钥
    accessTokenExpiresIn: '7d',      // Token 有效期
    expiresin: 604800,               // 秒数
    email: {
        host: '...',
        auth: { user: '...', pass: '...' },
    },
    public: {
        baseUrl: '/api',
        siteUrl: 'https://www.polnareff.me',
    },
},
```

生产环境在 `.env.production` 中覆盖对应的 `NUXT_*` 变量。

---

## 十一、部署

### 11.1 构建与进程管理

项目使用 PM2 管理进程，`ecosystem.config.cjs` 配置如下：

```javascript
// ecosystem.config.cjs
module.exports = {
	apps: [
		{
			name: 'jojo-blog',
			script: './.output/server/index.mjs',
			instances: 1,
			env: {
				NODE_ENV: 'production',
				PORT: 3000,
			},
		},
	],
};
```

```bash
# 构建生产产物
npm run build

# 首次启动
pm2 start ecosystem.config.cjs

# 重启
pm2 restart jojo-blog

# 查看日志
pm2 logs jojo-blog
```

### 11.2 Nitro 配置

`nuxt.config.ts` 中的关键生产配置：

```typescript
nitro: {
    preset: 'node-server',
    // 开启响应压缩
    compressPublicAssets: { gzip: true, brotli: true },
    // 静态文件目录
    publicAssets: [{ baseURL: '/file-system', dir: './file-system' }],
    // 路由规则
    routeRules: {
        '/admin/**': { ssr: false },  // Admin 后台纯 CSR
        '/api/**': { cors: true },
    },
},
```

Admin 后台关闭 SSR 的原因：后台页面无需 SEO，且需要频繁鉴权，纯客户端渲染可以避免服务端执行鉴权逻辑带来的复杂性。

---

## 十二、API 模块汇总

| 模块     | 路由前缀            | 主要功能                                |
| -------- | ------------------- | --------------------------------------- |
| 用户     | `/api/user/`        | 登录、注册、用户信息查询与更新          |
| 博客     | `/api/blog/`        | 增删改查、封面上传、浏览量统计          |
| 标签     | `/api/tag/`         | 增删改查（支持博客 / 个人标签两类）     |
| 日记     | `/api/record/`      | 分组 + 详情 + 图片三层结构管理          |
| Markdown | `/api/md/`          | 图片上传、图片删除                      |
| 统计     | `/api/statistical/` | 博客与日记浏览量数据图表                |
| 错误上报 | `/api/error/`       | 错误列表查询、删除、邮件通知            |
| Sitemap  | `/api/sitemap/urls` | 提供给 `@nuxtjs/sitemap` 的动态路由列表 |
