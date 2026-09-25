"""Link-preview pictures for the articles: public/og/<slug>.jpg, 1200x630 (the shape WhatsApp, Instagram, iMessage…
show big). The cover fills the whole frame (WhatsApp shows previews only ~300px wide, so it has to be big to read):
it keeps each cover's top, where the title is. The Aquaterra / TerraNotes logo card
(tools/og-badge.png, the header logo on a cream card) sits small in the top-left corner.
Run after adding or changing a cover:  python3 tools/make-og.py   (needs Pillow: pip install pillow)"""
import glob, os
from PIL import Image

W, H = 1200, 630
os.makedirs('public/og', exist_ok=True)
badge = Image.open(os.path.join(os.path.dirname(__file__), 'og-badge.png')).convert('RGBA')
badge = badge.resize((250, round(badge.height * 250 / badge.width)), Image.LANCZOS)
for src in sorted(glob.glob('public/articles/*.jpg')):
    slug = os.path.splitext(os.path.basename(src))[0]
    cover = Image.open(src).convert('RGB')
    s = max(W / cover.width, H / cover.height)
    big = cover.resize((round(cover.width * s), round(cover.height * s)), Image.LANCZOS)
    top = min(round(big.height * 0.02), big.height - H)  # from just under the top edge, where the covers' titles are
    left = (big.width - W) // 2
    og = big.crop((left, top, left + W, top + H))
    og.paste(badge, (22, 20), badge)
    og.save(f'public/og/{slug}.jpg', quality=90, optimize=True, progressive=False, subsampling=0)
    print(slug, os.path.getsize(f'public/og/{slug}.jpg') // 1024, 'KB')
