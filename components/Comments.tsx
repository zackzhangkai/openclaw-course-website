'use client'

import { useState, useEffect } from 'react'

interface Issue {
  id: number
  title: string
  body: string
  user: { login: string; avatar_url: string }
  created_at: string
  html_url: string
  comments: number
}

interface CommentsProps {
  courseSlug: string
  courseTitle: string
}

const ISSUE_TITLES: Record<string, string> = {
  'lesson1-openclaw-basics': 'Lesson 1',
  'lesson2-agent-management': 'Lesson 2',
  'lesson3-channels': 'Lesson 3',
  'lesson4-skills': 'Lesson 4',
  'lesson5-memory': 'Lesson 5',
  'lesson6-mcp': 'Lesson 6',
  'lesson7-workflows': 'Lesson 7',
  'lesson8-deployment': 'Lesson 8',
}

export default function Comments({ courseSlug, courseTitle }: CommentsProps) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    async function fetchIssues() {
      setLoading(true)
      setError(null)

      try {
        // 使用课程标题关键词搜索
        const keyword = ISSUE_TITLES[courseSlug] || courseSlug
        const response = await fetch(
          `https://api.github.com/repos/zackzhangkai/openclaw-course-website/issues?state=all&per_page=10`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()

        // 过滤包含对应课程标题的 issues
        const filtered = data.filter((issue: Issue) =>
          issue.title.includes(keyword)
        )

        setIssues(filtered)
      } catch (err) {
        console.error('Failed to fetch issues:', err)
        setError('无法加载评论')
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [courseSlug])

  const handleComment = () => {
    const repo = 'zackzhangkai/openclaw-course-website'
    const courseNum = ISSUE_TITLES[courseSlug] || ''
    const title = encodeURIComponent(`${courseNum} 课程反馈: ${courseTitle}`)
    const body = encodeURIComponent(`## 课程反馈

**课程**: ${courseTitle}

**问题/建议/疑问**:
请在这里描述您的问题或建议

---
*来自 OpenClaw 课程网站`)
    const url = `https://github.com/${repo}/issues/new?title=${title}&body=${body}`
    window.open(url, '_blank')
    setIsClicked(true)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        课程讨论 ({issues.length})
      </h3>

      {/* 评论列表 */}
      <div className="mb-6 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12s5.373 12 8 8V8a8 8 0 018 8" />
            </svg>
            <span className="text-sm">加载中...</span>
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : issues.length > 0 ? (
          issues.map((issue) => (
            <a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={issue.user.avatar_url}
                  alt={issue.user.login}
                  className="w-5 h-5 rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">
                  {issue.user.login}
                </span>
                <span className="text-xs text-gray-400">
                  {formatDate(issue.created_at)}
                </span>
                {issue.comments > 0 && (
                  <span className="text-xs text-gray-400">
                    💬 {issue.comments}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-800 mb-1">
                {issue.title}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {issue.body?.slice(0, 100) || '点击查看详情...'}
              </p>
            </a>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-2">暂无讨论</p>
            <p className="text-xs text-gray-400">
              欢迎提问，成为第一个讨论者！
            </p>
          </div>
        )}
      </div>

      {/* 评论按钮 */}
      <button
        onClick={handleComment}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
        发表评论
      </button>

      {isClicked && (
        <p className="text-sm text-green-600 mt-3">
          ✓ 感谢您的反馈！
        </p>
      )}

      <div className="mt-4 pt-4 border-t text-xs text-gray-400">
        💡 讨论将同步到 GitHub Issues • 点击可参与讨论
      </div>
    </div>
  )
}