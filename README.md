# Sombade's Home

وبلاگ شخصی معین (سمباده)، ساخته‌شده با Astro و MDX.

## اجرا در محیط توسعه

```bash
npm install
npm run dev
```

## ساخت نسخه‌ی production

```bash
npm run build
```

خروجی نهایی در پوشه‌ی `dist/` ساخته می‌شود.

## ساختار اصلی

- `src/pages/`: صفحات خانه، ابزارها، آموزش‌ها و دمو
- `src/content/blog/`: پست‌های MDX
- `src/components/`: کامپوننت‌های مشترک Astro
- `public/css/`: استایل اصلی سایت
- `public/js/`: منطق تم، تنظیمات نمایش، کپی کد و Lightbox
- `public/media/`: تصاویر و ویدیوها

## استقرار در Cloudflare Pages

- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`
- Node version: `22.12.0`

آدرس اصلی سایت: [moein8668.ir](https://moein8668.ir)
