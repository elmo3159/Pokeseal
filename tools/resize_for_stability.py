"""
Stability AI用に画像をリサイズするスクリプト
最大4,194,304ピクセル（約2048x2048）以内にリサイズ
"""

import cv2
import numpy as np
import os
from pathlib import Path

MAX_PIXELS = 4_194_304  # Stability AI制限

def resize_for_stability(input_path: str, output_path: str) -> str:
    """画像をStability AI制限内にリサイズ"""

    # 画像読み込み
    img = cv2.imread(input_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise FileNotFoundError(f"画像を読み込めません: {input_path}")

    height, width = img.shape[:2]
    current_pixels = height * width

    print(f"入力: {input_path}")
    print(f"  元サイズ: {width}x{height} = {current_pixels:,} pixels")

    if current_pixels <= MAX_PIXELS:
        print(f"  リサイズ不要（制限内）")
        # そのままコピー
        is_success, buffer = cv2.imencode('.png', img)
        if is_success:
            with open(output_path, 'wb') as f:
                f.write(buffer)
        return output_path

    # リサイズ比率計算
    scale = (MAX_PIXELS / current_pixels) ** 0.5
    new_width = int(width * scale)
    new_height = int(height * scale)

    print(f"  新サイズ: {new_width}x{new_height} = {new_width * new_height:,} pixels")

    # リサイズ実行
    resized = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

    # 保存
    is_success, buffer = cv2.imencode('.png', resized)
    if is_success:
        with open(output_path, 'wb') as f:
            f.write(buffer)
        print(f"  出力: {output_path}")

    return output_path


if __name__ == '__main__':
    import sys

    # コマンドライン引数があれば使用、なければデフォルト
    downloads = r"C:\Users\elmod\Downloads"
    output_dir = r"C:\Users\elmod\Downloads\resized"

    os.makedirs(output_dir, exist_ok=True)

    # しゅわぴー用の処理
    images = [
        ("Gemini_Generated_Image_3nd6dw3nd6dw3nd6.png", "shuwapii_bondro_resized.png"),
        ("Gemini_Generated_Image_olbws0olbws0olbw.png", "shuwapii_marshmallow_resized.png"),
    ]

    for input_name, output_name in images:
        input_path = os.path.join(downloads, input_name)
        output_path = os.path.join(output_dir, output_name)

        try:
            resize_for_stability(input_path, output_path)
            print()
        except Exception as e:
            print(f"エラー: {e}")
