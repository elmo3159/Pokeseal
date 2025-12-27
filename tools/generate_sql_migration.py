import json
import os
from urllib.parse import quote

base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load generated stickers
with open(os.path.join(base_path, 'generated_stickers.json'), 'r', encoding='utf-8') as f:
    stickers = json.load(f)

# Generate SQL migration
sql_lines = []

sql_lines.append('''-- =============================================
-- シールマスターデータの更新マイグレーション
-- 全45キャラクター × 合計1,156枚のシールを追加
-- =============================================

-- 既存のシールマスターデータを削除（user_stickersとの関連は維持）
-- 注意: user_stickersに存在しないsticker_idは外部キー制約違反になる可能性あり
-- そのため、既存データはUPSERTで更新し、新規データのみINSERTする

-- sticker_type カラムを追加（まだ存在しない場合）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'stickers' AND column_name = 'sticker_type'
  ) THEN
    ALTER TABLE stickers ADD COLUMN sticker_type TEXT DEFAULT 'classic';
  END IF;
END;
$$;

-- 全シールデータの投入（UPSERT）
''')

for s in stickers:
    # Build image URL
    if s.get('subfolder'):
        image_url = f"/stickers/{quote(s['folder'])}/{quote(s['subfolder'])}/{quote(s['fileName'])}"
    else:
        image_url = f"/stickers/{quote(s['folder'])}/{quote(s['fileName'])}"

    # Escape single quotes in strings
    name = s['name'].replace("'", "''")
    character = s['character'].replace("'", "''")
    series = s['series'].replace("'", "''")
    sticker_type = s['stickerType']

    sql_lines.append(f'''INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES ('{s['id']}', '{name}', '{image_url}', {s['rarity']}, '{s['type']}', '{series}', {s['baseRate']}, {s['gachaWeight']}, '{sticker_type}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();
''')

sql_lines.append('''
-- =============================================
-- 完了メッセージ
-- =============================================
DO $$
DECLARE
  sticker_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO sticker_count FROM stickers;
  RAISE NOTICE 'シールマスターデータ更新完了！ 合計: % 枚', sticker_count;
END;
$$;
''')

# Write SQL file
sql_content = ''.join(sql_lines)
output_path = os.path.join(base_path, 'supabase', 'migrations', '024_seed_all_stickers.sql')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(sql_content)

print(f'SQL migration generated: {output_path}')
print(f'Total INSERT statements: {len(stickers)}')
