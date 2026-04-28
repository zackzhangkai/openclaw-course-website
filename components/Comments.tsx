'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: number
  body: string
  user: { login: string; avatar_url: string }
  created_at: string
  html_url: string
}

interface CommentsProps {
  courseSlug: string
  courseTitle: string
}

const ISSUE_LABELS: Record<string, string> = {
  'lesson1-openclaw-basics': '问题',
  'lesson2-agent-management': '问题',
  'lesson3-channels': '问题',
  'lesson4-skills': '问题',
  'lesson5-memory': '问题',
  'lesson6-mcp': '问题',
  'lesson7-workflows': '问题',
  'lesson8-deployment': '问题',
}

export default function Comments({ courseSlug, courseTitle }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [isClicked, setIsClicked] = useState(false)

  useEffect(() => {
    async function fetchComments() {
      try {
        // 搜索与该课程相关的 issues
        const response = await fetch(
          `https://api.github.com/search/issues?q=repo:zackzhangkai/openclaw-course-website+label:${ISSUE_LABELS[courseSlug] || 'question'}+state:open&per_page=10`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        )
        if (response.ok) {
          const data = await response.json()
          setComments(data.items || [])
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [courseSlug])

  const handleComment = () => {
    const repo = 'zackzhangkai/openclaw-course-website'
    const title = encodeURIComponent(`课程反馈: ${courseTitle}`)
    const body = encodeURIComponent(`## 课程反馈\n\n**课程**: ${courseTitle}\n\n**问题/建议/疑问**:\n\n<!-- 请在这里描述您的问题或建议 -->\n\n---\n*来自 OpenClaw 课程网站`)
    const url = `https://github.com/${repo}/issues/new?title=${title}&body=${body}&labels=${ISSUE_LABELS[courseSlug] || 'question'}`
    window.open(url, '_blank')
    setIsClicked(true)
  }

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">课程讨论</h3>

      {/* 评论列表 */}
      <div className="mb-6">
        {loading ? (
          <p className="text-gray-500 text-sm">加载中...</p>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <a
                key={comment.id}
                href={comment.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg border hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={comment.user.avatar_url}
                    alt={comment.user.login}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {comment.user.login}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {comment.body?.slice(0, 150)}
                  {comment.body?.length > 150 && '...'}
                </p>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">暂无讨论，欢迎提问！</p>
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
          ✓ 感谢您的反馈！评论将记录在 GitHub Issues 中。
        </p>
      )}

      <p className="text-xs text-gray-400 mt-4">
        评论来自 GitHub Issues • 点击可查看完整内容
      </p>
    </div>
  )
}