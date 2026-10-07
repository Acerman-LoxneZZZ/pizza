"""Generate visitor credits from current asset provenance, retaining retired records."""
from pathlib import Path
import html, json

HERE = Path(__file__).resolve().parent
records = json.loads((HERE / 'photo-info.json').read_text(encoding='utf-8'))
for row in records:
    row['active'] = row['name'].startswith('prep-') if 'imageUrl' in row else row.get('active', True)
records = [row for row in records if row.get('kind') != 'generated-menu']
manifest = json.loads((HERE / 'media/menu-session/prompts.json').read_text(encoding='utf-8'))
for item in manifest:
    records.append(dict(name='menu-session/' + item['id'], active=True, kind='generated-menu',
        source='media/menu-session/prompts.json', author='Built-in OpenAI image generator',
        changes='Generated menu illustration; transparent 1254×1254 PNG source converted to WebP quality 94 without resizing.',
        reference=item['reference'], prompt=item['prompt']))
(HERE / 'photo-info.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
items = ''.join('<li><strong>' + html.escape(row['name']) + '</strong> — ' + html.escape(row['author']) +
    '. <a href="' + html.escape(row['source']) + '">Источник</a> · <a href="' + html.escape(row['licenseUrl']) + '">' +
    html.escape(row['license']) + '</a>. Изменения: уменьшение и WebP; кадрирование при показе.</li>'
    for row in records if row.get('active') and 'imageUrl' in row)
page = '''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Изображения и авторы — FARO</title><link rel="stylesheet" href="style.css"></head><body class="credits-page"><main><a href="index.html#menu">Вернуться к FARO</a><h1>Изображения<br>и авторы.</h1><p>FARO — демонстрационный ресторанный концепт. Изображения иллюстрируют блюда и приготовление; это не фотографии кухни или меню реальной пиццерии.</p><h2>3D-пицца и её рендеры</h2><p><a href="https://sketchfab.com/3d-models/pizza-40d50989fec1460f8838b608d999ccd0">Pizza</a> — <a href="https://sketchfab.com/rigsters">Rigsters</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Удалена доска, изменены масштаб, текстура и материалы. Постер, пицца в разделе приготовления и видеотизер созданы локальным рендером в Blender.</p><h2>Единая серия меню</h2><p>Шесть иллюстраций пицц созданы встроенным генератором изображений OpenAI: один ракурс, свет и формат, прозрачный фон. Образцом послужила выбранная владельцем фотография пепперони; её исходник сохранён. Это изображения для вымышленного меню. <a href="media/menu-session/prompts.json">Точные запросы и происхождение серии</a> сохранены вместе с WebP-файлами; редактируемые PNG находятся в репозитории.</p><h2>Фотографии приготовления</h2><ul>''' + items + '''</ul><h2>Шрифты</h2><p>Literata и Golos Text — SIL Open Font License. Оригинальные уведомления включены в папку fonts.</p></main></body></html>'''
(HERE / 'credits.html').write_text(page, encoding='utf-8')
print('Updated credits.html and photo-info.json; retired stock-menu provenance retained.')
