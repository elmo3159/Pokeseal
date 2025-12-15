'use client'

/**
 * サウンドエフェクトユーティリティ
 * 音声ファイル再生 + Web Audio API合成音をサポート
 */

// AudioContextはユーザー操作後に初期化する必要がある
let audioContext: AudioContext | null = null

// 音声ファイルのキャッシュ
const audioCache: Map<string, HTMLAudioElement> = new Map()

// 音声ファイルのパス設定
const SOUND_FILES: Partial<Record<SoundType, string>> = {
  flip: '/sounds/flip.mp3',
  peel: '/sounds/peel.mp3',
}

// AudioContextを初期化（ユーザー操作時に呼び出し）
export function initAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio APIがサポートされていません:', e)
      return null
    }
  }

  // suspended状態の場合はresumeする
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  return audioContext
}

// 効果音の種類
export type SoundType = 'peel' | 'place' | 'pop' | 'swoosh' | 'sparkle' | 'flip'

// 音声ファイルを再生する
function playAudioFile(path: string, volume: number): boolean {
  console.log('[Sound] playAudioFile:', path, volume)
  if (typeof window === 'undefined') {
    console.log('[Sound] window is undefined, skipping')
    return false
  }

  try {
    // キャッシュから取得、なければ新規作成
    let audio = audioCache.get(path)
    if (!audio) {
      audio = new Audio(path)
      audioCache.set(path, audio)
    }

    // 再生中の場合はクローンして再生（重複再生対応）
    if (!audio.paused) {
      const clone = audio.cloneNode() as HTMLAudioElement
      clone.volume = volume
      clone.play().catch(() => {})
      return true
    }

    audio.volume = volume
    audio.currentTime = 0
    audio.play()
      .then(() => console.log('[Sound] Audio played successfully'))
      .catch((e) => console.error('[Sound] Audio play failed:', e))
    return true
  } catch (e) {
    console.error('[Sound] 音声ファイルの再生に失敗:', e)
    return false
  }
}

// 効果音を再生する（ファイルがあればファイル、なければ合成音）
export function playSound(type: SoundType, volume: number = 0.3): void {
  console.log('[Sound] playSound called:', type, volume)
  // 音声ファイルがあれば優先的に再生
  const filePath = SOUND_FILES[type]
  if (filePath) {
    console.log('[Sound] Playing audio file:', filePath)
    playAudioFile(filePath, volume)
    return
  }

  // ファイルがない場合は合成音にフォールバック
  const ctx = initAudioContext()
  if (!ctx) return

  try {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    const now = ctx.currentTime

    switch (type) {
      case 'peel':
        // ペリペリ音（高→低の周波数スイープ + ノイズ風）
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(800, now)
        oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15)
        gainNode.gain.setValueAtTime(volume * 0.4, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
        oscillator.start(now)
        oscillator.stop(now + 0.2)

        // 追加の「パキッ」音
        setTimeout(() => {
          const ctx2 = initAudioContext()
          if (!ctx2) return
          const osc2 = ctx2.createOscillator()
          const gain2 = ctx2.createGain()
          osc2.connect(gain2)
          gain2.connect(ctx2.destination)
          osc2.type = 'square'
          osc2.frequency.setValueAtTime(1200, ctx2.currentTime)
          osc2.frequency.exponentialRampToValueAtTime(400, ctx2.currentTime + 0.05)
          gain2.gain.setValueAtTime(volume * 0.2, ctx2.currentTime)
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx2.currentTime + 0.08)
          osc2.start(ctx2.currentTime)
          osc2.stop(ctx2.currentTime + 0.08)
        }, 50)
        break

      case 'place':
        // ペタッ音（短い低音）
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(150, now)
        oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.1)
        gainNode.gain.setValueAtTime(volume * 0.5, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        oscillator.start(now)
        oscillator.stop(now + 0.15)
        break

      case 'pop':
        // ポップ音（短い高音）
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(600, now)
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.08)
        gainNode.gain.setValueAtTime(volume * 0.4, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        oscillator.start(now)
        oscillator.stop(now + 0.1)
        break

      case 'swoosh':
        // スウッシュ音（ノイズ風スイープ）
        oscillator.type = 'sawtooth'
        oscillator.frequency.setValueAtTime(300, now)
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2)
        gainNode.gain.setValueAtTime(volume * 0.2, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
        oscillator.start(now)
        oscillator.stop(now + 0.25)
        break

      case 'sparkle':
        // キラキラ音（高音の連続）
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(1200, now)
        oscillator.frequency.setValueAtTime(1600, now + 0.05)
        oscillator.frequency.setValueAtTime(2000, now + 0.1)
        gainNode.gain.setValueAtTime(volume * 0.3, now)
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
        oscillator.start(now)
        oscillator.stop(now + 0.2)
        break
    }
  } catch (e) {
    console.warn('効果音の再生に失敗しました:', e)
  }
}

// 効果音の有効/無効を管理
let soundEnabled = true

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled
}

export function isSoundEnabled(): boolean {
  return soundEnabled
}

// 効果音を条件付きで再生
export function playSoundIfEnabled(type: SoundType, volume?: number): void {
  console.log('[Sound] playSoundIfEnabled:', type, 'enabled:', soundEnabled)
  if (soundEnabled) {
    playSound(type, volume)
  }
}
