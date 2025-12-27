"""
しゅわぴーシール処理スクリプト
"""

import cv2
import numpy as np
import os
import shutil
from collections import deque

OUTPUT_BASE = r"C:\Users\elmod\Desktop\CursorApp\pokeseal\public\stickers"


def flood_fill_find_bounds(start_x: int, start_y: int, alpha: np.ndarray,
                           visited: np.ndarray, threshold: int) -> dict:
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

                if box['w'] >= min_size and box['h'] >= min_size:
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

    stickers = sorted(stickers, key=lambda s: s['area'], reverse=True)[:15]
    return stickers


def process_both(char_name: str, bondro_path: str, marshmallow_path: str):
    """ボンドロ・マシュマロ両方処理"""

    print(f"\n{'='*60}")
    print(f"[FULL PROCESS] {char_name}")
    print(f"{'='*60}")

    char_dir = os.path.join(OUTPUT_BASE, char_name)
    bondro_dir = os.path.join(char_dir, "ボンドロ")
    marsh_dir = os.path.join(char_dir, "マシュマロ")

    # フォルダ削除・再作成
    if os.path.exists(char_dir):
        print(f"[DELETE] {char_dir}")
        shutil.rmtree(char_dir)
    os.makedirs(bondro_dir, exist_ok=True)
    os.makedirs(marsh_dir, exist_ok=True)

    # ボンドロ処理
    print(f"\n[BONDRO] {bondro_path}")
    bondro_img = cv2.imread(bondro_path, cv2.IMREAD_UNCHANGED)
    if bondro_img is None:
        raise FileNotFoundError(f"Cannot read: {bondro_path}")

    bondro_stickers = detect_and_extract_stickers(bondro_img)
    print(f"[DETECT] {len(bondro_stickers)} stickers")

    for i, sticker in enumerate(bondro_stickers, 1):
        filename = f"{char_name}_{i}.png"
        filepath = os.path.join(bondro_dir, filename)
        is_success, buffer = cv2.imencode('.png', sticker['image'])
        if is_success:
            with open(filepath, 'wb') as f:
                f.write(buffer)
        print(f"   OK: {filename}")

    # マシュマロ処理
    print(f"\n[MARSHMALLOW] {marshmallow_path}")
    marsh_img = cv2.imread(marshmallow_path, cv2.IMREAD_UNCHANGED)
    if marsh_img is None:
        raise FileNotFoundError(f"Cannot read: {marshmallow_path}")

    marsh_stickers = detect_and_extract_stickers(marsh_img)
    print(f"[DETECT] {len(marsh_stickers)} stickers")

    start_num = len(bondro_stickers) + 1
    for i, sticker in enumerate(marsh_stickers, start_num):
        filename = f"{char_name}_{i}.png"
        filepath = os.path.join(marsh_dir, filename)
        is_success, buffer = cv2.imencode('.png', sticker['image'])
        if is_success:
            with open(filepath, 'wb') as f:
                f.write(buffer)
        print(f"   OK: {filename}")

    print(f"\n[DONE] Total: {len(bondro_stickers) + len(marsh_stickers)} stickers")
    return len(bondro_stickers), len(marsh_stickers)


if __name__ == '__main__':
    resized_dir = r"C:\Users\elmod\Downloads\resized"

    # しゅわぴー処理
    print("\n" + "="*80)
    print("Processing: しゅわぴー")
    print("="*80)

    bondro = os.path.join(resized_dir, "shuwapii-bondro-transparent.png")
    marsh = os.path.join(resized_dir, "shuwapii-marshmallow-transparent.png")

    process_both("しゅわぴー", bondro, marsh)

    print("\n" + "="*80)
    print("ALL DONE!")
    print("="*80)
