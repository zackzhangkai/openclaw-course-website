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
    if (line.startsWith('## ') && !line.includes('动手实战') && !line.includes('课后作业') && !line.includes('知识卡片') && !line.includes('下节预告') && !line.includes('课程总结')) {
      return line.replace('## ', '').trim()
    }
  }
  return ''
}
