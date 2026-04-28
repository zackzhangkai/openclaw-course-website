'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'openclaw-course-progress'

interface ProgressData {
  [courseSlug: string]: {
    completed: boolean
    checklist: { [key: string]: boolean }
  }
}

function getProgress(): ProgressData {
  if (typeof window === 'undefined') return {}
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function saveProgress(data: ProgressData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

interface ProgressButtonProps {
  courseSlug: string
}

export function ProgressButton({ courseSlug }: ProgressButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const progress = getProgress()
    if (progress[courseSlug]) {
      setIsCompleted(progress[courseSlug].completed)
    }
  }, [courseSlug])

  const toggleCompleted = () => {
    const progress = getProgress()
    const newCompleted = !isCompleted
    progress[courseSlug] = {
      ...progress[courseSlug],
      completed: newCompleted,
    }
    saveProgress(progress)
    setIsCompleted(newCompleted)
  }

  return (
    <button
      onClick={toggleCompleted}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isCompleted
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {isCompleted ? '✓ 已完成' : '标记为完成'}
    </button>
  )
}

export function useOverallProgress() {
  const [progress, setProgress] = useState<ProgressData>({})

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const totalCourses = 8
  const completedCourses = Object.values(progress).filter(c => c.completed).length
  const progressPercent = Math.round((completedCourses / totalCourses) * 100)

  return {
    progress,
    completedCourses,
    totalCourses,
    progressPercent,
  }
}
