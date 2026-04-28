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

export function useProgress(courseSlug: string) {
  const [isCompleted, setIsCompleted] = useState(false)
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const progress = getProgress()
    if (progress[courseSlug]) {
      setIsCompleted(progress[courseSlug].completed)
      setChecklist(progress[courseSlug].checklist || {})
    }
  }, [courseSlug])

  const toggleCompleted = () => {
    const progress = getProgress()
    const newCompleted = !isCompleted
    progress[courseSlug] = {
      ...progress[courseSlug],
      completed: newCompleted,
      checklist: checklist,
    }
    saveProgress(progress)
    setIsCompleted(newCompleted)
  }

  const toggleChecklistItem = (index: number) => {
    const progress = getProgress()
    const key = `${courseSlug}-item-${index}`
    const newChecklist = { ...checklist }
    newChecklist[key] = !newChecklist[key]
    progress[courseSlug] = {
      completed: isCompleted,
      checklist: newChecklist,
    }
    saveProgress(progress)
    setChecklist(newChecklist)
  }

  return {
    isCompleted,
    toggleCompleted,
    checklist,
    toggleChecklistItem,
  }
}

export function useOverallProgress() {
  const [progress, setProgress] = useState<ProgressData>({})

  useEffect(() => {
    setProgress(getProgress())
  }, [])

  const totalCourses = 8 // 总课程数
  const completedCourses = Object.values(progress).filter(c => c.completed).length
  const progressPercent = Math.round((completedCourses / totalCourses) * 100)

  return {
    progress,
    completedCourses,
    totalCourses,
    progressPercent,
  }
}
