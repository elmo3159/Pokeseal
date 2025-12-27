"""
Sticker Splitter - シール一括切り出しツール (Python版)

背景透過画像から各パーツを自動検出して切り出します。
Gemini版と同等の機能をローカルで実行できます。

使い方:
    python sticker_splitter.py <入力画像> [オプション]

オプション:
    --output, -o    出力ディレクトリ (デフォルト: 入力画像と同じ場所)
    --prefix, -p    ファイル名の接頭辞 (デフォルト: sticker)
    --padding       余白のピクセル数 (デフォルト: 0)
    --threshold     アルファしきい値 1-254 (デフォルト: 10, 低いほど高感度)
    --min-size      最小サイズ (デフォルト: 20)
"""

import cv2
import numpy as np
import os
import argparse
from pathlib import Path
from collections import deque


def flood_fill_find_bounds(start_x: int, start_y: int, alpha: np.ndarray,
                           visited: np.ndarray, threshold: int) -> dict:
    """
    フラッドフィル（BFS）で連結成分を探索し、バウンディングボックスを返す
    """
    height, width = alpha.shape
    min_x, max_x = start_x, start_x
    min_y, max_y = start_y, start_y

    queue = deque([(start_x, start_y)])
    visited[start_y, start_x] = 1

    # 4方向の隣接ピクセル
    neighbors = [(0, -1), (0, 1), (-1, 0), (1, 0)]

    while queue:
        x, y = queue.popleft()

        # バウンディングボックス更新
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)

        # 隣接ピクセルをチェック
        for dx, dy in neighbors:
            nx, ny = x + dx, y + dy

            # 範囲チェック
            if 0 <= nx < width and 0 <= ny < height:
                if visited[ny, nx] == 0 and alpha[ny, nx] >= threshold:
                    visited[ny, nx] = 1
                    queue.append((nx, ny))

    return {
        'x': min_x,
        'y': min_y,
        'w': max_x - min_x + 1,
        'h': max_y - min_y + 1
    }


def detect_stickers(image: np.ndarray, threshold: int = 10,
                    min_size: int = 20) -> list:
    """
    画像内のシール（連結成分）を検出してバウンディングボックスのリストを返す
    """
    # アルファチャンネルを取得
    if image.shape[2] == 4:
        alpha = image[:, :, 3]
    else:
        # アルファチャンネルがない場合は白を透明として扱う
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        alpha = np.where(gray < 250, 255, 0).astype(np.uint8)

    height, width = alpha.shape
    visited = np.zeros((height, width), dtype=np.uint8)
    boxes = []

    print(f"画像サイズ: {width}x{height}")
    print(f"しきい値: {threshold}, 最小サイズ: {min_size}px")

    # 全ピクセルをスキャン
    for y in range(height):
        for x in range(width):
            # 未訪問で、しきい値以上のアルファ値を持つピクセル
            if visited[y, x] == 0 and alpha[y, x] >= threshold:
                # 新しい島を発見
                box = flood_fill_find_bounds(x, y, alpha, visited, threshold)

                # 最小サイズチェック
                if box['w'] >= min_size and box['h'] >= min_size:
                    boxes.append(box)

    # 左上から右下の順にソート（読み順）
    boxes.sort(key=lambda b: (b['y'] // 100, b['x']))

    return boxes


def extract_stickers(image: np.ndarray, boxes: list, padding: int = 0) -> list:
    """
    検出したボックスからシール画像を切り出す
    """
    stickers = []
    height, width = image.shape[:2]

    for box in boxes:
        # パディングを含めた範囲を計算
        x1 = max(0, box['x'] - padding)
        y1 = max(0, box['y'] - padding)
        x2 = min(width, box['x'] + box['w'] + padding)
        y2 = min(height, box['y'] + box['h'] + padding)

        # 切り出し
        sticker = image[y1:y2, x1:x2].copy()
        stickers.append(sticker)

    return stickers


def save_stickers(stickers: list, output_dir: str, prefix: str = "sticker"):
    """
    シール画像を保存する
    """
    os.makedirs(output_dir, exist_ok=True)

    saved_files = []
    for i, sticker in enumerate(stickers, 1):
        filename = f"{prefix}_{i}.png"
        filepath = os.path.join(output_dir, filename)
        cv2.imwrite(filepath, sticker)
        saved_files.append(filepath)
        print(f"  保存: {filename} ({sticker.shape[1]}x{sticker.shape[0]})")

    return saved_files


def split_stickers(input_path: str, output_dir: str = None, prefix: str = "sticker",
                   padding: int = 0, threshold: int = 10, min_size: int = 20) -> list:
    """
    メイン処理：画像からシールを検出して切り出し、保存する

    Args:
        input_path: 入力画像のパス
        output_dir: 出力ディレクトリ（Noneの場合は入力画像と同じ場所にprefixフォルダを作成）
        prefix: ファイル名の接頭辞
        padding: 余白のピクセル数
        threshold: アルファしきい値（1-254, 低いほど高感度）
        min_size: 最小サイズ（これより小さいものはゴミとして除外）

    Returns:
        保存したファイルパスのリスト
    """
    print(f"\n{'='*50}")
    print(f"Sticker Splitter - シール切り出しツール")
    print(f"{'='*50}")

    # 画像読み込み（アルファチャンネル付き）
    print(f"\n入力: {input_path}")
    image = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)

    if image is None:
        raise FileNotFoundError(f"画像を読み込めません: {input_path}")

    print(f"チャンネル数: {image.shape[2] if len(image.shape) > 2 else 1}")

    # 出力ディレクトリの設定
    if output_dir is None:
        input_dir = os.path.dirname(input_path)
        output_dir = os.path.join(input_dir, prefix)

    print(f"出力先: {output_dir}")

    # シール検出
    print(f"\nシールを検出中...")
    boxes = detect_stickers(image, threshold, min_size)
    print(f"検出数: {len(boxes)}個")

    if len(boxes) == 0:
        print("シールが見つかりませんでした。しきい値を調整してみてください。")
        return []

    # シール切り出し
    print(f"\n切り出し中...")
    stickers = extract_stickers(image, boxes, padding)

    # 保存
    print(f"\n保存中...")
    saved_files = save_stickers(stickers, output_dir, prefix)

    print(f"\n{'='*50}")
    print(f"完了！ {len(saved_files)}個のシールを保存しました")
    print(f"{'='*50}\n")

    return saved_files


def main():
    parser = argparse.ArgumentParser(
        description='Sticker Splitter - 背景透過画像からシールを自動切り出し'
    )
    parser.add_argument('input', help='入力画像のパス')
    parser.add_argument('-o', '--output', help='出力ディレクトリ')
    parser.add_argument('-p', '--prefix', default='sticker', help='ファイル名の接頭辞')
    parser.add_argument('--padding', type=int, default=0, help='余白(px)')
    parser.add_argument('--threshold', type=int, default=10, help='アルファしきい値(1-254)')
    parser.add_argument('--min-size', type=int, default=20, help='最小サイズ(px)')

    args = parser.parse_args()

    split_stickers(
        input_path=args.input,
        output_dir=args.output,
        prefix=args.prefix,
        padding=args.padding,
        threshold=args.threshold,
        min_size=args.min_size
    )


if __name__ == '__main__':
    main()
