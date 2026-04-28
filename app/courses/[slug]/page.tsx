import Link from 'next/link'
import { getAllCourses, getCourseBySlug } from '@/lib/courses'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Comments from '@/components/Comments'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  const courses = getAllCourses()
  return courses.map((course) => ({
    slug: course.slug,
  }))
}

function getNextCourse(currentSlug: string) {
  const courses = getAllCourses()
  const currentIndex = courses.findIndex(c => c.slug === currentSlug)
  if (currentIndex >= 0 && currentIndex < courses.length - 1) {
    return courses[currentIndex + 1]
  }
  return null
}

export default function CoursePage({ params }: PageProps) {
  const course = getCourseBySlug(params.slug)
  const nextCourse = getNextCourse(params.slug)

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
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回课程列表
      </Link>

      <article className="prose prose-lg max-w-none bg-white rounded-xl p-8 shadow-sm border">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-8"></div>
        <MDXRemote source={course.content} />
      </article>

      <Comments courseSlug={course.slug} courseTitle={course.title} />

      <div className="mt-8 pt-8 border-t">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            ← 返回课程列表
          </Link>

          {nextCourse && (
            <Link
              href={`/courses/${nextCourse.slug}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              下一节：{nextCourse.title.replace(/^Lesson \d+:\s*/, '')}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        <div className="mt-4 text-center">
          <a
            href="https://github.com/zackzhangkai/openclaw-course-website"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            在 GitHub 上查看源码 →
          </a>
        </div>
      </div>
    </div>
  )
}
