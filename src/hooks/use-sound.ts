'use client'

import { useCallback, useRef } from 'react'

// Base64 encoded short beep sounds (minimal size)
const SOUNDS = {
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleTM=',
  error: 'data:audio/wav;base64,UklGRl9vT19tQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABkAG1vbm9yZW1lbWJlcmVycmVxdWVzdHNwZWNpYWxjaGFyYWN0ZXJhbGxvd2Fpc3R1cGZvcndkcm9wZ',
  notification: 'data:audio/wav;base64,UklGRl9vT19tQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAAABkAG1vbm9yZW1lbWJlcmVycmVxdWVzdHNwZWNzaGFycGhhc2h0dXBmb3J3ZG',
}

type SoundType = 'success' | 'error' | 'notification'

export function useSoundEffects() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  const playSound = useCallback((type: SoundType) => {
    try {
      if (!audioRefs.current[type]) {
        audioRefs.current[type] = new Audio(SOUNDS[type])
      }
      audioRefs.current[type].currentTime = 0
      audioRefs.current[type].play().catch(() => {
        // Silently fail if audio play is blocked
      })
    } catch {
      // Audio not supported
    }
  }, [])

  return { playSound }
}
