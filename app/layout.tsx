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
        <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                OpenClaw 7 Days
              </Link>
              <div className="flex items-center gap-4">
                <a
                  href="https://openclaw-course-silk.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-blue-600"
                >
                  网站
                </a>
                <a
                  href="https://github.com/zackzhangkai/openclaw-course-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29 1.02-2.68 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02 1.47 1.39 1.13 2.43 1.03 2.68.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">赞赏支持</h3>
                <div className="bg-white p-3 rounded-lg border shadow-sm inline-block">
                  <img src="/images/donation-qr.png" alt="赞赏码" className="w-32 h-32 object-contain" />
                </div>
                <p className="text-xs text-gray-500 mt-2">创作不易，请作者喝杯咖啡</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">个人微信</h3>
                <div className="bg-white p-3 rounded-lg border shadow-sm inline-block">
                  <img src="/images/wechat-qr.png" alt="个人微信二维码" className="w-32 h-auto object-contain" />
                </div>
                <p className="text-xs text-gray-500 mt-2">加入群聊请添加个人微信</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">技术自留地</h3>
                <div className="bg-white p-3 rounded-lg border shadow-sm inline-block">
                  <img src="/images/official-account-qr.png" alt="技术自留地公众号" className="w-32 h-32 object-contain" />
                </div>
                <p className="text-xs text-gray-500 mt-2">扫码关注公众号</p>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm">
              © 2026 OpenClaw Training Team
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
