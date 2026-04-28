# OpenClaw 7 Days 课程网站实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个 Next.js + MDX 静态网站，展示 8 课 OpenClaw 课程内容

**Architecture:** 使用 Next.js 14 App Router，创建 /courses/[slug] 动态路由，从本地文件读取 MDX 内容并渲染

**Tech Stack:** Next.js 14, MDX, Tailwind CSS, TypeScript

---

## 文件结构

```
openclaw-7-days-website/
├── app/
│   ├── layout.tsx          # 全局布局
│   ├── page.tsx            # 首页 - 课程列表
│   ├── globals.css         # 全局样式
│   └── courses/
│       └── [slug]/
│           └── page.tsx    # 课程详情页
├── content/
│   ├── lesson1-openclaw-basics.md
│   ├── lesson2-agent-management.md
│   ├── lesson3-channels.md
│   ├── lesson4-skills.md
│   ├── lesson5-memory.md
│   ├── lesson6-mcp.md
│   ├── lesson7-workflows.md
│   └── lesson8-deployment.md
├── lib/
│   └── courses.ts          # 课程数据读取
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Task 1: 创建 Next.js 项目结构

**Files:**
- Create: `openclaw-7-days-website/package.json`
- Create: `openclaw-7-days-website/next.config.js`
- Create: `openclaw-7-days-website/tailwind.config.js`
- Create: `openclaw-7-days-website/tsconfig.json`

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "openclaw-7-days-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "gray-matter": "^4.0.3",
    "next-mdx-remote": "^4.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: 创建 next.config.js**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

- [ ] **Step 3: 创建 tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 4: 创建 tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: 创建 postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## Task 2: 创建课程内容文件

**Files:**
- Create: `openclaw-7-days-website/content/lesson1-openclaw-basics.md`
- Create: `openclaw-7-days-website/content/lesson2-agent-management.md`
- Create: `openclaw-7-days-website/content/lesson3-channels.md`
- Create: `openclaw-7-days-website/content/lesson4-skills.md`
- Create: `openclaw-7-days-website/content/lesson5-memory.md`
- Create: `openclaw-7-days-website/content/lesson6-mcp.md`
- Create: `openclaw-7-days-website/content/lesson7-workflows.md`
- Create: `openclaw-7-days-website/content/lesson8-deployment.md`

- [ ] **Step 1: 创建 lesson1-openclaw-basics.md**

从 `/Users/zack/Documents/OpenClaw课程/Lesson1-OpenClaw基础与安装/README.md` 复制内容

- [ ] **Step 2: 创建其他 7 课内容文件**

依次复制其余课程内容到对应的 md 文件

---

## Task 3: 创建课程数据读取库

**Files:**
- Create: `openclaw-7-days-website/lib/courses.ts`

- [ ] **Step 1: 创建 lib/courses.ts**

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface Course {
  slug: string
  title: string
  description: string
  content: string
}

const courseSlugs = [
  'lesson1-openclaw-basics',
  'lesson2-agent-management',
  'lesson3-channels',
  'lesson4-skills',
  'lesson5-memory',
  'lesson6-mcp',
  'lesson7-workflows',
  'lesson8-deployment',
]

const courseTitles: Record<string, string> = {
  'lesson1-openclaw-basics': 'Lesson 1: OpenClaw 基础与环境搭建',
  'lesson2-agent-management': 'Lesson 2: Agent 创建与管理',
  'lesson3-channels': 'Lesson 3: 渠道集成配置',
  'lesson4-skills': 'Lesson 4: Skills 技能系统',
  'lesson5-memory': 'Lesson 5: 记忆与上下文管理',
  'lesson6-mcp': 'Lesson 6: MCP 工具集成',
  'lesson7-workflows': 'Lesson 7: 自定义工作流',
  'lesson8-deployment': 'Lesson 8: 生产部署与运维',
}

export function getAllCourses(): Course[] {
  return courseSlugs.map((slug) => {
    const fullPath = path.join(contentDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { content } = matter(fileContents)

    return {
      slug,
      title: courseTitles[slug],
      description: getDescription(content),
      content,
    }
  })
}

export function getCourseBySlug(slug: string): Course | undefined {
  const courses = getAllCourses()
  return courses.find((course) => course.slug === slug)
}

function getDescription(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.startsWith('## ')) {
      return line.replace('## ', '').trim()
    }
  }
  return ''
}
```

---

## Task 4: 创建全局样式和布局

**Files:**
- Create: `openclaw-7-days-website/app/globals.css`
- Create: `openclaw-7-days-website/app/layout.tsx`

- [ ] **Step 1: 创建 app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f9fafb;
  color: #111827;
}

.prose {
  max-width: 65ch;
}

.prose h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.75;
}

.prose ul, .prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}
```

- [ ] **Step 2: 创建 app/layout.tsx**

```tsx
import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'OpenClaw 7 Days 实战课程',
  description: '从零开始，掌握 AI Agent 开发与部署',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              OpenClaw 7 Days
            </Link>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8 text-center text-gray-500 text-sm">
            © 2026 OpenClaw Training Team
          </div>
        </footer>
      </body>
    </html>
  )
}
```

---

## Task 5: 创建首页

**Files:**
- Create: `openclaw-7-days-website/app/page.tsx`

- [ ] **Step 1: 创建 app/page.tsx**

```tsx
import Link from 'next/link'
import { getAllCourses } from '@/lib/courses'

export default function Home() {
  const courses = getAllCourses()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          OpenClaw 实战课程
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          从零开始，掌握 AI Agent 开发与部署
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span>8 节课</span>
          <span>•</span>
          <span>动手实战</span>
          <span>•</span>
          <span>生产级部署</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course, index) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {index + 1}
              </span>
              <h2 className="text-lg font-semibold text-gray-900">
                {course.title}
              </h2>
            </div>
            <p className="text-gray-600">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

---

## Task 6: 创建课程详情页

**Files:**
- Create: `openclaw-7-days-website/app/courses/[slug]/page.tsx`

- [ ] **Step 1: 创建 app/courses/[slug]/page.tsx**

```tsx
import Link from 'next/link'
import { getAllCourses, getCourseBySlug } from '@/lib/courses'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  const courses = getAllCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

export default function CoursePage({ params }: PageProps) {
  const course = getCourseBySlug(params.slug)

  if (!course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">课程不存在</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-8"
      >
        ← 返回课程列表
      </Link>

      <article className="prose prose-lg max-w-none">
        <h1>{course.title}</h1>
        <MDXRemote source={course.content} />
      </article>

      <div className="mt-16 pt-8 border-t">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          ← 返回课程列表
        </Link>
      </div>
    </div>
  )
}
```

---

## Task 7: 安装依赖并构建

**Files:**
- N/A

- [ ] **Step 1: 进入项目目录并安装依赖**

```bash
cd openclaw-7-days-website
npm install
```

- [ ] **Step 2: 构建项目**

```bash
npm run build
```

- [ ] **Step 3: 本地预览（可选）**

```bash
npm run start
```

---

## Task 8: 部署到 Vercel

**Files:**
- N/A

- [ ] **Step 1: 推送代码到 GitHub**

```bash
cd openclaw-7-days-website
git init
git add .
git commit -m "feat: OpenClaw 7 Days 课程网站"
gh repo create openclaw-7-days-website --public --source=. --push
```

- [ ] **Step 2: 部署到 Vercel**

```bash
vercel --yes --prod --scope zackzhangkais-projects
```

---

## 验收标准

- [ ] 首页显示 8 课课程卡片，每课有标题和描述
- [ ] 点击卡片进入课程详情页
- [ ] Markdown 内容正确渲染（标题、代码块、列表、表格）
- [ ] 顶部有导航栏，返回按钮正常工作
- [ ] 移动端正常显示
- [ ] 部署后可通过 Vercel URL 访问
