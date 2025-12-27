"""
Gray Background Remover - グレー背景除去ツール

Gemini生成画像のグレー背景(#808080)を透過させます。
"""

import cv2
import numpy as np
import os
import sys

def remove_gray_background(input_path: str, output_path: str,
                           gray_value: int = 128, tolerance: int = 30):
    """
    グレー背景を除去して透過PNGを作成

    Args:
        input_path: 入力画像パス
        output_path: 出力画像パス
        gray_value: 背景のグレー値 (0-255, デフォルト128=#808080)
        tolerance: 許容範囲 (デフォルト30)
    """
    print(f"\n入力: {input_path}")

    # 画像読み込み
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise FileNotFoundError(f"画像を読み込めません: {input_path}")

    print(f"サイズ: {img.shape[1]}x{img.shape[0]}")

    # BGRからBGRAに変換（アルファチャンネル追加）
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # グレー背景のマスクを作成
    # 各チャンネルがgray_value±toleranceの範囲にあるピクセルを検出
    b, g, r, a = cv2.split(img)

    # グレー背景の条件: R≒G≒B かつ 値がgray_value付近
    lower = gray_value - tolerance
    upper = gray_value + tolerance

    # 各チャンネルがグレー範囲内かチェック
    gray_mask = (
        (b >= lower) & (b <= upper) &
        (g >= lower) & (g <= upper) &
        (r >= lower) & (r <= upper) &
        # R,G,Bの差が小さい（グレーに近い）
        (np.abs(r.astype(int) - g.astype(int)) < 20) &
        (np.abs(g.astype(int) - b.astype(int)) < 20) &
        (np.abs(r.astype(int) - b.astype(int)) < 20)
    )

    # マスクを反転して背景を透過
    # 背景部分のアルファを0に
    a[gray_mask] = 0

    # 画像を再構成
    result = cv2.merge([b, g, r, a])

    # 出力ディレクトリ作成
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # 保存
    cv2.imwrite(output_path, result)
    print(f"出力: {output_path}")

    # 透過率を表示
    total_pixels = a.shape[0] * a.shape[1]
    transparent_pixels = np.sum(a == 0)
    print(f"透過率: {transparent_pixels/total_pixels*100:.1f}%")

    return output_path


def main():
    if len(sys.argv) < 3:
        print("使い方: python remove_gray_bg.py <入力画像> <出力画像> [グレー値] [許容範囲]")
        print("例: python remove_gray_bg.py input.png output.png 128 30")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]
    gray_value = int(sys.argv[3]) if len(sys.argv) > 3 else 128
    tolerance = int(sys.argv[4]) if len(sys.argv) > 4 else 30

    remove_gray_background(input_path, output_path, gray_value, tolerance)
    print("\n完了!")


if __name__ == '__main__':
    main()
