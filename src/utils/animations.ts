'use client'

/**
 * アニメーション用CSSクラスを動的に追加するユーティリティ
 */

// アニメーションCSSが追加済みかどうか
let animationsInjected = false

// アニメーションCSSをdocumentに注入
export function injectAnimationStyles(): void {
  if (typeof document === 'undefined' || animationsInjected) return

  const styleId = 'pokeseal-animations'
  if (document.getElementById(styleId)) {
    animationsInjected = true
    return
  }

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = `
    /* ペリペリ（シール剥がし）アニメーション */
    @keyframes stickerPeel {
      0% {
        transform: perspective(500px) rotateX(0deg) rotateY(0deg) scale(1);
        transform-origin: bottom center;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
      }
      15% {
        transform: perspective(500px) rotateX(-5deg) rotateY(2deg) scale(1.02);
        transform-origin: bottom center;
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
      }
      30% {
        transform: perspective(500px) rotateX(-15deg) rotateY(-3deg) scale(1.05);
        transform-origin: bottom center;
        filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2));
      }
      50% {
        transform: perspective(500px) rotateX(-25deg) rotateY(5deg) scale(1.08);
        transform-origin: bottom center;
        filter: drop-shadow(0 12px 24px rgba(139, 92, 246, 0.3));
      }
      70% {
        transform: perspective(500px) rotateX(-15deg) rotateY(-2deg) scale(1.05);
        transform-origin: bottom center;
        filter: drop-shadow(0 8px 16px rgba(139, 92, 246, 0.25));
      }
      100% {
        transform: perspective(500px) rotateX(0deg) rotateY(0deg) scale(1);
        transform-origin: center center;
        filter: drop-shadow(0 4px 8px rgba(139, 92, 246, 0.2));
      }
    }

    /* シール剥がしエフェクト用クラス */
    .animate-peel {
      animation: stickerPeel 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    /* 角からめくれるペリペリ効果 */
    @keyframes stickerPeelCorner {
      0% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        transform: perspective(400px) rotateX(0deg) rotateY(0deg);
      }
      20% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 95%);
        transform: perspective(400px) rotateX(3deg) rotateY(-2deg);
      }
      40% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 10% 85%);
        transform: perspective(400px) rotateX(8deg) rotateY(-5deg);
      }
      60% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 5% 90%);
        transform: perspective(400px) rotateX(5deg) rotateY(-3deg);
      }
      100% {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        transform: perspective(400px) rotateX(0deg) rotateY(0deg);
      }
    }

    .animate-peel-corner {
      animation: stickerPeelCorner 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
    }

    /* シール貼り付け効果 */
    @keyframes stickerPlace {
      0% {
        transform: scale(1.2) translateY(-20px);
        opacity: 0.8;
      }
      50% {
        transform: scale(0.95) translateY(2px);
        opacity: 1;
      }
      70% {
        transform: scale(1.02) translateY(-1px);
      }
      100% {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }

    .animate-place {
      animation: stickerPlace 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    /* キラキラエフェクト */
    @keyframes sparkle {
      0%, 100% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
      }
    }

    .animate-sparkle {
      animation: sparkle 0.6s ease-out forwards;
    }

    /* バウンス選択エフェクト */
    @keyframes selectBounce {
      0% {
        transform: scale(1);
      }
      30% {
        transform: scale(1.15);
      }
      50% {
        transform: scale(0.95);
      }
      70% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    .animate-select-bounce {
      animation: selectBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    /* 「ペリッ」テキストアニメーション */
    @keyframes peelText {
      0% {
        opacity: 0;
        transform: translateY(10px) scale(0.8);
      }
      30% {
        opacity: 1;
        transform: translateY(-5px) scale(1.1);
      }
      100% {
        opacity: 0;
        transform: translateY(-30px) scale(0.9);
      }
    }

    .animate-peel-text {
      animation: peelText 0.8s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
      pointer-events: none;
    }

    /* フェードイン（上から） */
    @keyframes fadeInUp {
      0% {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
    }

    /* フェードアウト（上へ） */
    @keyframes fadeOutUp {
      0% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -20px);
      }
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }

    .animate-fade-out-up {
      animation: fadeOutUp 0.3s ease-in forwards;
    }
  `
  document.head.appendChild(style)
  animationsInjected = true
}

// アニメーションをトリガーするヘルパー
export function triggerAnimation(
  element: HTMLElement,
  animationClass: string,
  duration: number = 400
): Promise<void> {
  return new Promise((resolve) => {
    element.classList.add(animationClass)
    setTimeout(() => {
      element.classList.remove(animationClass)
      resolve()
    }, duration)
  })
}
