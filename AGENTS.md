# AGENTS.md

## Project Overview

This is a **Next.js 14 static export website** for the OpenClaw 7 Days training course. It renders Markdown lessons as static pages with GitHub Issues-based comments.

## Key Facts

### Build System
- **Framework**: Next.js 14.2 with App Router
- **Output**: Static export (`output: 'export'` in `next.config.js`)
- **Build dir**: `out/` (deployed to Vercel)
- **Path aliases**: `@/*` maps to project root

### Development Commands
```bash
# Dev server (standard Next.js)
npm run dev          # localhost:3000

# Build for production
npm run build        # Generates static site to out/

# Start production build
npm run start        # Serves out/ directory
```

### Content Architecture
- **Lessons**: Markdown files in `content/*.md` (8 lessons total)
- **Static generation**: All course pages generated at build time via `generateStaticParams()`
- **Course order**: Hardcoded in `lib/courses.ts` (`courseSlugs` array)
- **MDX rendering**: Uses `next-mdx-remote/rsc` for Markdown → React

### Adding/Modifying Lessons
1. Add/edit `.md` file in `content/`
2. Update slug mapping in `lib/courses.ts` (both `courseSlugs` and `courseTitles`)
3. Add title mapping in `components/Comments.tsx` (`ISSUE_TITLES`)
4. Rebuild: `npm run build`

### Styling
- **Framework**: Tailwind CSS 3.4
- **Custom prose styles**: `app/globals.css` defines `.prose` class for Markdown
- **Customizations**: Code blocks (dark bg), blockquotes (blue border), tables, links

### Comments System
- Uses GitHub Issues as the comment backend
- Each lesson maps to a GitHub issue label via `ISSUE_TITLES` in `Comments.tsx`
- Issues created in: `zackzhangkai/openclaw-course-website`
- Client-side fetching from GitHub API (unauthenticated, rate limited)

### Deployment
- Platform: Vercel (production URL in README)
- Build output: `out/` directory
- No server-side rendering (static export)
- Images are unoptimized (`images.unoptimized: true`)

## Common Tasks

### Add a new lesson
```typescript
// 1. Create content/lessonX-topic.md
// 2. Add to lib/courses.ts
courseSlugs.push('lessonX-topic')
courseTitles['lessonX-topic'] = 'Lesson X: Title'

// 3. Add to components/Comments.tsx
ISSUE_TITLES['lessonX-topic'] = 'Lesson X'

// 4. Build and deploy
npm run build
```

### Update lesson content
Simply edit the `.md` file and rebuild. No hot reload for content files.

### Modify styles
- Global: `app/globals.css`
- Tailwind config: `tailwind.config.js`
- Component-specific: Use Tailwind utility classes

## Project Structure
```
app/
├── courses/[slug]/page.tsx    # Dynamic course page (SSG)
├── layout.tsx                  # Root layout with nav/footer
├── page.tsx                    # Homepage with course grid
globals.css                     # Tailwind + prose styles
content/                        # 8 lesson markdown files
lib/courses.ts                  # Content loading logic
components/Comments.tsx         # GitHub Issues comments
```

## Important Notes
- **No environment variables** currently used
- **No API routes** - pure static site
- **No tests** configured
- **No linter/formatter** configured (use external tools)
- Markdown parsing happens at build time only
- Chinese language content (zh-CN)
