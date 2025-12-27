import json
import os

# Character rarity assignments
RARITY_CONFIG = {
    # Old format characters (original rarity)
    'もっちも': {'rarity': 5, 'type': 'sparkle', 'series': 'レジェンドコレクション', 'baseRate': 500, 'gachaWeight': 1},
    'ウールン': {'rarity': 5, 'type': 'sparkle', 'series': 'レジェンドコレクション', 'baseRate': 500, 'gachaWeight': 1},
    'トイラン': {'rarity': 5, 'type': 'sparkle', 'series': 'レジェンドコレクション', 'baseRate': 500, 'gachaWeight': 1},
    'ルミナ・スターダスト': {'rarity': 5, 'type': 'sparkle', 'series': 'レジェンドコレクション', 'baseRate': 500, 'gachaWeight': 1},
    'スタラ': {'rarity': 4, 'type': 'puffy', 'series': 'スーパーレアコレクション', 'baseRate': 200, 'gachaWeight': 5},
    'チャックン': {'rarity': 4, 'type': 'puffy', 'series': 'スーパーレアコレクション', 'baseRate': 200, 'gachaWeight': 5},
    'ドロル': {'rarity': 3, 'type': 'normal', 'series': 'レアコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'サニたん': {'rarity': 3, 'type': 'normal', 'series': 'レアコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'コケボ': {'rarity': 2, 'type': 'normal', 'series': 'アンコモンコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'キノぼう': {'rarity': 2, 'type': 'normal', 'series': 'アンコモンコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'ポフン': {'rarity': 1, 'type': 'normal', 'series': 'コモンコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ポリ': {'rarity': 1, 'type': 'normal', 'series': 'コモンコレクション', 'baseRate': 20, 'gachaWeight': 55},

    # New format characters - R5 Legend (sparkle)
    'ビー玉にゃんこ': {'rarity': 5, 'type': 'sparkle', 'series': 'スイーツコレクション', 'baseRate': 500, 'gachaWeight': 1},
    'クリームソーダちゃん': {'rarity': 5, 'type': 'sparkle', 'series': 'スイーツコレクション', 'baseRate': 500, 'gachaWeight': 1},

    # New format characters - R4 Super Rare (puffy)
    'ふわふわコットンキャンディねこ': {'rarity': 4, 'type': 'puffy', 'series': 'ふわもこコレクション', 'baseRate': 200, 'gachaWeight': 5},
    'ゆめくらげ': {'rarity': 4, 'type': 'puffy', 'series': 'ゆめかわコレクション', 'baseRate': 200, 'gachaWeight': 5},
    'きらきらシャボンうさぎ': {'rarity': 4, 'type': 'puffy', 'series': 'きらきらコレクション', 'baseRate': 200, 'gachaWeight': 5},
    'ねこマカロン': {'rarity': 4, 'type': 'puffy', 'series': 'スイーツコレクション', 'baseRate': 200, 'gachaWeight': 5},
    'リボンちゃん': {'rarity': 4, 'type': 'puffy', 'series': 'ガーリーコレクション', 'baseRate': 200, 'gachaWeight': 5},

    # New format characters - R3 Rare
    'しゃぼんちゃん': {'rarity': 3, 'type': 'normal', 'series': 'きらきらコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'もふもふポップコーンぴよ': {'rarity': 3, 'type': 'normal', 'series': 'ふわもこコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'とろりんプリンひよこ': {'rarity': 3, 'type': 'normal', 'series': 'スイーツコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'けいとにゃん': {'rarity': 3, 'type': 'normal', 'series': 'ふわもこコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'ゆめひつじ': {'rarity': 3, 'type': 'normal', 'series': 'ゆめかわコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'ねりあめちゃん': {'rarity': 3, 'type': 'normal', 'series': 'スイーツコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'きらぼし': {'rarity': 3, 'type': 'normal', 'series': 'きらきらコレクション', 'baseRate': 100, 'gachaWeight': 15},
    'にじたま': {'rarity': 3, 'type': 'normal', 'series': 'きらきらコレクション', 'baseRate': 100, 'gachaWeight': 15},

    # New format characters - R2 Uncommon
    'ふわもくん': {'rarity': 2, 'type': 'normal', 'series': 'ふわもこコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'いちごにゃん': {'rarity': 2, 'type': 'normal', 'series': 'フルーツコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'さくらんぼーず': {'rarity': 2, 'type': 'normal', 'series': 'フルーツコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'ころりんご': {'rarity': 2, 'type': 'normal', 'series': 'フルーツコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'くまグミ': {'rarity': 2, 'type': 'normal', 'series': 'スイーツコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'ぷにねこ': {'rarity': 2, 'type': 'normal', 'series': 'ぷにぷにコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'もちぷに': {'rarity': 2, 'type': 'normal', 'series': 'ぷにぷにコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'ふわりぼん': {'rarity': 2, 'type': 'normal', 'series': 'ガーリーコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'しゅわぴー': {'rarity': 2, 'type': 'normal', 'series': 'きらきらコレクション', 'baseRate': 50, 'gachaWeight': 30},
    'ゆめくも': {'rarity': 2, 'type': 'normal', 'series': 'ゆめかわコレクション', 'baseRate': 50, 'gachaWeight': 30},

    # New format characters - R1 Common
    'ぷちぷちにゃん': {'rarity': 1, 'type': 'normal', 'series': 'ぷにぷにコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ぷりんぬ': {'rarity': 1, 'type': 'normal', 'series': 'スイーツコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ぷるるん': {'rarity': 1, 'type': 'normal', 'series': 'ぷにぷにコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ほわほわん': {'rarity': 1, 'type': 'normal', 'series': 'ふわもこコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ぽよたまご': {'rarity': 1, 'type': 'normal', 'series': 'ぽよぽよコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ぽよまる': {'rarity': 1, 'type': 'normal', 'series': 'ぽよぽよコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'もこたんぽぽ': {'rarity': 1, 'type': 'normal', 'series': 'ふわもこコレクション', 'baseRate': 20, 'gachaWeight': 55},
    'ふわもちパン': {'rarity': 1, 'type': 'normal', 'series': 'スイーツコレクション', 'baseRate': 20, 'gachaWeight': 55},
}

def main():
    # Load character data
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    with open(os.path.join(base_path, 'all_characters.json'), 'r', encoding='utf-8') as f:
        characters = json.load(f)

    # Generate sticker data
    all_stickers = []

    for char in characters:
        name = char['name']
        config = RARITY_CONFIG.get(name)

        if not config:
            print(f"Warning: No config for {name}, using default R1")
            config = {'rarity': 1, 'type': 'normal', 'series': 'その他コレクション', 'baseRate': 20, 'gachaWeight': 55}

        if char['format'] == 'old':
            # Old format: files directly in character folder
            for i in range(1, char['file_count'] + 1):
                sticker_id = f"{name.lower()}-{i}"
                # Special case for ポフン which uses 'sticker_' prefix
                if name == 'ポフン':
                    file_name = f"sticker_{i}.png"
                else:
                    file_name = f"{name}_{i}.png"

                all_stickers.append({
                    'id': sticker_id,
                    'name': f"{name} #{i}",
                    'character': name,
                    'variant': i,
                    'stickerType': 'classic',
                    'rarity': config['rarity'],
                    'type': config['type'],
                    'series': config['series'],
                    'baseRate': config['baseRate'],
                    'gachaWeight': config['gachaWeight'],
                    'folder': name,
                    'fileName': file_name,
                    'format': 'old'
                })
        else:
            # New format: ボンドロ and マシュマロ subfolders
            # ボンドロ stickers (1-15)
            for i in range(1, char['bondro_count'] + 1):
                sticker_id = f"{name.lower()}-bondro-{i}"
                file_name = f"{name}_{i}.png"

                all_stickers.append({
                    'id': sticker_id,
                    'name': f"{name} ボンドロ#{i}",
                    'character': name,
                    'variant': i,
                    'stickerType': 'bondro',
                    'rarity': config['rarity'],
                    'type': config['type'],
                    'series': config['series'],
                    'baseRate': config['baseRate'],
                    'gachaWeight': config['gachaWeight'],
                    'folder': name,
                    'subfolder': 'ボンドロ',
                    'fileName': file_name,
                    'format': 'new'
                })

            # マシュマロ stickers (16-30)
            for i in range(1, char['marshmallow_count'] + 1):
                variant_num = 15 + i
                sticker_id = f"{name.lower()}-marshmallow-{i}"
                file_name = f"{name}_{variant_num}.png"

                all_stickers.append({
                    'id': sticker_id,
                    'name': f"{name} マシュマロ#{i}",
                    'character': name,
                    'variant': variant_num,
                    'stickerType': 'marshmallow',
                    'rarity': config['rarity'],
                    'type': config['type'],
                    'series': config['series'],
                    'baseRate': config['baseRate'],
                    'gachaWeight': config['gachaWeight'],
                    'folder': name,
                    'subfolder': 'マシュマロ',
                    'fileName': file_name,
                    'format': 'new'
                })

    print(f"Total stickers generated: {len(all_stickers)}")

    # Save to JSON
    with open(os.path.join(base_path, 'generated_stickers.json'), 'w', encoding='utf-8') as f:
        json.dump(all_stickers, f, ensure_ascii=False, indent=2)

    print("Saved to generated_stickers.json")

    # Print rarity distribution
    rarity_counts = {}
    for s in all_stickers:
        r = s['rarity']
        rarity_counts[r] = rarity_counts.get(r, 0) + 1

    print("\nRarity distribution:")
    for r in sorted(rarity_counts.keys(), reverse=True):
        print(f"  R{r}: {rarity_counts[r]} stickers")

if __name__ == '__main__':
    main()
