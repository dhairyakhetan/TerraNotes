"""Link-preview pictures for the articles: public/og/<slug>.jpg, 1200x630 (the shape WhatsApp, Instagram, iMessage…
show big). The cover, whole, in the middle, over a soft blurred copy of itself.
Run after adding or changing a cover:  python3 tools/make-og.py   (needs Pillow: pip install pillow)"""
import glob, os
from PIL import Image, ImageFilter, ImageEnhance

W, H = 1200, 630
os.makedirs('public/og', exist_ok=True)
for src in sorted(glob.glob('public/articles/*.jpg')):
    slug = os.path.splitext(os.path.basename(src))[0]
    cover = Image.open(src).convert('RGB')
    # background: the cover, filling the frame, blurred and dimmed a little
    s = max(W / cover.width, H / cover.height)
    bg = cover.resize((round(cover.width * s), round(cover.height * s)), Image.LANCZOS)
    bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(28))).enhance(0.72)
    # the cover itself, whole, with a white mount and a hard shadow like the site's cards
    ch = H - 80
    cw = round(cover.width * ch / cover.height)
    art = cover.resize((cw, ch), Image.LANCZOS)
    x, y = (W - cw) // 2, 40
    shadow = Image.new('RGB', (cw + 24, ch + 24), (17, 17, 17))
    bg.paste(shadow, (x - 12 + 12, y - 12 + 12))
    bg.paste(Image.new('RGB', (cw + 24, ch + 24), (255, 255, 255)), (x - 12, y - 12))
    bg.paste(art, (x, y))
    bg.save(f'public/og/{slug}.jpg', quality=86, optimize=True, progressive=True)
    print(slug, os.path.getsize(f'public/og/{slug}.jpg') // 1024, 'KB')
