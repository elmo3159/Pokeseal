"""
Sticker Processing Helper - シール処理ヘルパー
ミス防止のための一括処理スクリプト

使い方:
    python process_stickers.py <キャラ名> <ボンドロ透過画像> <マシュマロ透過画像>

例:
    python process_stickers.py ぷるるん bondro.png marshmallow.png
"""

import cv2
import numpy as np
import os
import sys
import shutil
from pathlib import Path
from collections import deque

# 出力先ベースディレクトリ
OUTPUT_BASE = r"C:\Users\elmod\Desktop\CursorApp\pokeseal\public\stickers"


def flood_fill_find_bounds(start_x: int, start_y: int, alpha: np.ndarray,
                           visited: np.ndarray, threshold: int) -> dict:
    """フラッドフィルで連結成分を探索"""
    height, width = alpha.shape
    min_x, max_x = start_x, start_x
    min_y, max_y = start_y, start_y

    queue = deque([(start_x, start_y)])
    visited[start_y, start_x] = 1

    neighbors = [(0, -1), (0, 1), (-1, 0), (1, 0)]

    while queue:
        x, y = queue.popleft()
        min_x = min(min_x, x)
        max_x = max(max_x, x)
        min_y = min(min_y, y)
        max_y = max(max_y, y)

        for dx, dy in neighbors:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height:
                if visited[ny, nx] == 0 and alpha[ny, nx] >= threshold:
                    visited[ny, nx] = 1
                    queue.append((nx, ny))

    return {'x': min_x, 'y': min_y, 'w': max_x - min_x + 1, 'h': max_y - min_y + 1}


def detect_and_extract_stickers(image: np.ndarray, threshold: int = 10,
                                 min_size: int = 100, padding: int = 5) -> list:
    """シールを検出して切り出す"""
    if image.shape[2] == 4:
        alpha = image[:, :, 3]
    else:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        alpha = np.where(gray < 250, 255, 0).astype(np.uint8)

    height, width = alpha.shape
    visited = np.zeros((height, width), dtype=np.uint8)
    stickers = []

    for y in range(height):
        for x in range(width):
            if visited[y, x] == 0 and alpha[y, x] >= threshold:
                box = flood_fill_find_bounds(x, y, alpha, visited, threshold)

                # 最小サイズチェック（小さすぎるのはゴミ）
                if box['w'] >= min_size and box['h'] >= min_size:
                    # パディングを含めて切り出し
                    x1 = max(0, box['x'] - padding)
                    y1 = max(0, box['y'] - padding)
                    x2 = min(width, box['x'] + box['w'] + padding)
                    y2 = min(height, box['y'] + box['h'] + padding)

                    sticker = image[y1:y2, x1:x2].copy()
                    stickers.append({
                        'image': sticker,
                        'width': sticker.shape[1],
                        'height': sticker.shape[0],
                        'area': sticker.shape[0] * sticker.shape[1]
                    })

    # 左上から右下の順にソート
    stickers.sort(key=lambda s: (s['height'], s['width']), reverse=True)

    # 上位15個を取得（大きい順）
    stickers = sorted(stickers, key=lambda s: s['area'], reverse=True)[:15]

    return stickers


def process_character(char_name: str, bondro_path: str, marshmallow_path: str):
    """キャラクターのシールを処理"""

    print(f"\n{'='*60}")
    print(f"キャラクター: {char_name}")
    print(f"{'='*60}")

    # 出力ディレクトリ作成
    char_dir = os.path.join(OUTPUT_BASE, char_name)
    bondro_dir = os.path.join(char_dir, "ボンドロ")
    marsh_dir = os.path.join(char_dir, "マシュマロ")

    # 既存フォルダがあれば削除して再作成
    if os.path.exists(char_dir):
        print(f"\n[WARNING] {char_dir} は既に存在します - 削除して再作成します")
        shutil.rmtree(char_dir)

    os.makedirs(bondro_dir, exist_ok=True)
    os.makedirs(marsh_dir, exist_ok=True)

    # ボンドロシール処理
    print(f"\n[BONDRO] ボンドロシール処理中...")
    print(f"   入力: {bondro_path}")

    bondro_img = cv2.imread(bondro_path, cv2.IMREAD_UNCHANGED)
    if bondro_img is None:
        raise FileNotFoundError(f"画像を読み込めません: {bondro_path}")

    bondro_stickers = detect_and_extract_stickers(bondro_img)
    print(f"   検出数: {len(bondro_stickers)}個")

    for i, sticker in enumerate(bondro_stickers, 1):
        filename = f"{char_name}_{i}.png"
        filepath = os.path.join(bondro_dir, filename)
        # 日本語パス対応: imencode + ファイル書き込み
        is_success, buffer = cv2.imencode('.png', sticker['image'])
        if is_success:
            with open(filepath, 'wb') as f:
                f.write(buffer)
        print(f"   OK: {filename} ({sticker['width']}x{sticker['height']})")

    # マシュマロシール処理
    print(f"\n[MARSHMALLOW] マシュマロシール処理中...")
    print(f"   入力: {marshmallow_path}")

    marsh_img = cv2.imread(marshmallow_path, cv2.IMREAD_UNCHANGED)
    if marsh_img is None:
        raise FileNotFoundError(f"画像を読み込めません: {marshmallow_path}")

    marsh_stickers = detect_and_extract_stickers(marsh_img)
    print(f"   検出数: {len(marsh_stickers)}個")

    # マシュマロは16から始まる
    start_num = len(bondro_stickers) + 1
    for i, sticker in enumerate(marsh_stickers, start_num):
        filename = f"{char_name}_{i}.png"
        filepath = os.path.join(marsh_dir, filename)
        # 日本語パス対応: imencode + ファイル書き込み
        is_success, buffer = cv2.imencode('.png', sticker['image'])
        if is_success:
            with open(filepath, 'wb') as f:
                f.write(buffer)
        print(f"   OK: {filename} ({sticker['width']}x{sticker['height']})")

    # サマリー
    print(f"\n{'='*60}")
    print(f"[DONE] 完了!")
    print(f"   ボンドロ: {len(bondro_stickers)}枚 → {bondro_dir}")
    print(f"   マシュマロ: {len(marsh_stickers)}枚 → {marsh_dir}")
    print(f"   合計: {len(bondro_stickers) + len(marsh_stickers)}枚")
    print(f"{'='*60}\n")


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        print("\n使用例:")
        print('  python process_stickers.py ぷるるん "C:/path/to/bondro.png" "C:/path/to/marshmallow.png"')
        sys.exit(1)

    char_name = sys.argv[1]
    bondro_path = sys.argv[2]
    marshmallow_path = sys.argv[3]

    # パスの確認
    print(f"\n処理開始:")
    print(f"  キャラクター名: {char_name}")
    print(f"  ボンドロ画像:   {bondro_path}")
    print(f"  マシュマロ画像: {marshmallow_path}")

    process_character(char_name, bondro_path, marshmallow_path)


if __name__ == '__main__':
    main()
