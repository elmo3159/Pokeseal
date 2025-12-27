import json
import os
from urllib.parse import quote

base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load generated stickers
with open(os.path.join(base_path, 'generated_stickers.json'), 'r', encoding='utf-8') as f:
    stickers = json.load(f)

# Generate batch SQL files
batch_size = 100
batch_dir = os.path.join(base_path, 'tools', 'sticker_batches')
os.makedirs(batch_dir, exist_ok=True)

batch_count = 0
for i in range(0, len(stickers), batch_size):
    batch = stickers[i:i+batch_size]
    values = []

    for s in batch:
        if s.get('subfolder'):
            image_url = f"/stickers/{quote(s['folder'])}/{quote(s['subfolder'])}/{quote(s['fileName'])}"
        else:
            image_url = f"/stickers/{quote(s['folder'])}/{quote(s['fileName'])}"

        # Escape single quotes
        name = s['name'].replace("'", "''")
        series = s['series'].replace("'", "''")

        values.append(f"('{s['id']}', '{name}', '{image_url}', {s['rarity']}, '{s['type']}', '{series}', {s['baseRate']}, {s['gachaWeight']}, '{s['stickerType']}')")

    values_str = ',\n'.join(values)
    sql = f'''INSERT INTO stickers (id, name, image_url, rarity, type, series, base_rate, gacha_weight, sticker_type)
VALUES
{values_str}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image_url = EXCLUDED.image_url,
  rarity = EXCLUDED.rarity,
  type = EXCLUDED.type,
  series = EXCLUDED.series,
  base_rate = EXCLUDED.base_rate,
  gacha_weight = EXCLUDED.gacha_weight,
  sticker_type = EXCLUDED.sticker_type,
  updated_at = NOW();'''

    batch_file = os.path.join(batch_dir, f'batch_{batch_count:02d}.sql')
    with open(batch_file, 'w', encoding='utf-8') as f:
        f.write(sql)

    batch_count += 1

print(f'Generated {batch_count} batch files in {batch_dir}')
print(f'Total stickers: {len(stickers)}')
