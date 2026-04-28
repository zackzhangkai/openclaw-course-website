'use client'

import { useState } from 'react'

interface CommentsProps {
  courseSlug: string
  courseTitle: string
}

export default function Comments({ courseSlug, courseTitle }: CommentsProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleComment = () => {
    const repo = 'zackzhangkai/openclaw-course-website'
    const title = encodeURIComponent(`课程反馈: ${courseTitle}`)
    const body = encodeURIComponent(`## 课程反馈\n\n**课程**: ${courseTitle}\n\n**问题/建议/疑问**:\n\n<!-- 请在这里描述您的问题或建议 -->\n\n---\n*来自 OpenClaw 课程网站`)
    const url = `https://github.com/${repo}/issues/new?title=${title}&body=${body}&labels=question`
    window.open(url, '_blank')
    setIsClicked(true)
  }

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl border">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">课程讨论</h3>
      <p className="text-gray-600 text-sm mb-4">
        对课程有问题或建议？欢迎在 GitHub Issues 中提出！
      </p>
      <button
        onClick={handleComment}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        在 GitHub 上评论
      </button>
      {isClicked && (
        <p className="text-sm text-green-600 mt-3">
          ✓ 感谢您的反馈！评论将自动记录在 GitHub Issues 中。
        </p>
      )}
    </div>
  )
}
