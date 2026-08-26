# پلن پیاده‌سازی بهبودهای وبلاگ «خونه سمباده» (moein8668.ir)

> **این فایل برای هر ایجنت/دولوپری قابل اجراست.** نیازی به خواندن مکالمات قبلی نیست؛ همه‌چیز این‌جا مستند شده.
> دو پروپوزال در هم ادغام شده‌اند: (الف) پروپوزال ox-alpha شامل ۸ بهبود ساختاری/سئویی، (ب) ماکاپ Qwen شامل ایده‌های برندینگ.
> **قانون طلایی:** هویت بصری سایت عوض نمی‌شود. همان متغیرهای CSS فعلی، همان فونت‌ها، همان لحن. فقط ساختار و تجربه بهتر می‌شود.

---

## ۰) زمینه و محدودیت‌ها

| مورد | مقدار |
|---|---|
| دامنه | https://moein8668.ir |
| زبان/جهت | فارسی، `dir="rtl"`، `lang="fa"` |
| صفحات موجود | `/` (خانه)، `/tutorials` (لیست آموزش‌ها)، `/proxmox-installation`، `/openwrt-on-proxmox`، `/tools`، `/live-background` |
| فونت‌ها | Vazirmatn (متن فارسی) + Space Grotesk (برند/انگلیسی) — از Google Fonts |
| میزبانی | Cloudflare Pages/CDN (اسکریپت beacon در صفحات هست) |

### متغیرهای CSS مرجع (نباید تغییر کنند):
```css
--bg:#20211f; --bg-soft:#292a27; --surface:#282925; --surface-strong:#30312c;
--text:#f0eee7; --text-muted:#b7b2a8; --accent:#d87b52; --accent-soft:#513127;
--border:#4a4a43; --border-strong:#77766c; --code-bg:#111210; --radius:4px;
```

### قواعد کلی برای ایجنت:
1. قبل از هر تغییری، ساختار فعلی پروژه را کشف کن (`Glob` روی `*.html`, `css/`, `js/`). صفحات احتمالاً HTML استاتیک دستی هستند — همین‌طور نگه‌شان دار مگر خلافش مشخص شود.
2. اگر صفحه‌ای سیستم تم دارد (`/js/theme.js` + `data-theme`)، همهٔ استایل‌های جدید فقط با متغیرهای بالا بنویس تا با هر دو تم کار کند.
3. همه چیز باید RTL-safe باشد؛ از `inset-inline-*` و `margin-inline-*` استفاده کن نه left/right خام (به‌جز موارد LTR مثل بلوک کد).
4. انیمیشن‌ها همیشه داخل `@media (prefers-reduced-motion: reduce)` غیرفعال شوند (الگو در `style.css` موجود است).
5. هیچ فریم‌ورک/کتابخانه جدید اضافه نشود. CSS و vanilla JS خام.

---

## فاز A — ناوبری یکپارچه (اولویت: زیاد)

### A1. منوی ثابت مشترک بین همه صفحات
**مشکل:** خانه منوی بالا ندارد؛ صفحات داخلی تاپ‌بار جدا با فقط دکمه خانه دارند.

**کار:**
- یک کامپوننت تاپ‌بار واحد بساز (اگر سایت استاتیک دستی است، همان HTML تکراری در همه صفحات؛ اگر ابزار بیلد دارد، partial بساز).
- ساختار:
```html
<nav class="topbar" id="topbar">
  <a class="brand" href="/" dir="ltr">Sombade's <span>Home</span></a>
  <ul class="topbar-nav">
    <li><a href="/">خانه</a></li>
    <li><a href="/tutorials">آموزش‌ها</a></li>
    <li><a href="/tools">ابزارها</a></li>
    <li><a href="/live-background">لایو بک‌گراند</a></li>
  </ul>
</nav>
```
- رفتار اسکرول موجود (`is-scrolled` شیشه‌ای) حفظ شود.
- لینک صفحهٔ فعال کلاس `.active` بگیرد (رنگ accent + پس‌زمینه accent-soft).
- موبایل: اگر جا نشد، آیتم‌ها wrap شوند یا فقط «آموزش‌ها» بماند (بدون JS اضافه).
- در صفحه خانه، تاپ‌بار جایگزین `.banner-content` فعلی شود (همان موقعیت absolute بالای بنر).

### A2. Breadcrumb در مقاله‌های آموزشی
بالای `<h1>` هر مقاله:
```html
<nav class="breadcrumb" aria-label="مسیر">
  <a href="/">خانه</a> <span class="sep">/</span>
  <a href="/tutorials">آموزش‌ها</a> <span class="sep">/</span>
  <span aria-current="page">آموزش نصب Proxmox</span>
</nav>
```
CSS پیشنهادی: `font-size:.84rem; color:var(--text-muted); gap:8px;` — لینک‌ها accent، جداکننده با opacity کم.
(در فاز F با JSON-LD BreadcrumbList جفت می‌شود.)

**پذیرش:** از هر صفحه، با حداکثر یک کلیک به هر بخش دیگر سایت reachable باشی. breadcrumb در هر سه صفحه آموزشی دیده شود.

---

## فاز B — صفحه لیست آموزش‌ها `/tutorials` (اولویت: زیاد)

کارت‌های افقی Qwen را مبنا بگیر (عنوان/توضیح + تصویر کنارش)، اما متادیتای ox-alpha را اضافه کن:

```html
<article class="tut-card">
  <a class="tut-link" href="/proxmox-installation">
    <div class="tut-body">
      <div class="tool-meta">
        <span class="meta-chip hot">جدیدترین</span>
        <span class="meta-chip">⏱ ~۲۵ دقیقه</span>
        <span class="meta-chip" dir="ltr">v7.4 · 2026-08</span>
      </div>
      <h3>آموزش نصب Proxmox</h3>
      <p>نصب و راه‌اندازی هایپروایزر Bare-Metal روی فلش ونتوی.</p>
      <span class="open-cta">باز کردن <span class="arrow">←</span></span>
    </div>
    <div class="tut-media"><img src="..." alt="" loading="lazy"></div>
  </a>
</article>
```

- کل کارت کلیک‌پذیر (لینک دور کل `.tut-link`) → بجِ تکراری «باز کردن» به CTA داخل کارت تبدیل می‌شود.
- chips: زمان مطالعه تخمینی، تاریخ/نسخه، برچسب موضوعی (هایپروایزر، شبکه، هوم‌لب…). chip «جدیدترین» فقط روی جدیدترین آموزش.
- تصاویر بنر کوچک: از همان بنر مقاله‌ها (`/media/images/proxmox-installation/Banner.jpg` و …) با `loading="lazy"` و `width/height` صریح.
- کارت سوم dashed «به‌زودی» از ماکاپ Qwen اختیاری است — اگر اضافه شد بدون لینک باشد.
- شمارنده بالای لیست: «۲ آموزش منتشرشده» (از Qwen).
- موبایل: تصویر بالای متن بیاید (`order:-1` طبق ماکاپ Qwen).

**پذیرش:** hover روی کارت = border accent + translateY(-2px) + zoom ملایم عکس. بدون layout shift.

---

## فاز C — تجربه خواندن مقاله (اولویت: زیاد)

### C1. TOC چسبان + نوار پیشرفت خواندن
- در صفحات `/proxmox-installation` و `/openwrt-on-proxmox` (هر مقاله‌ای که ≥۴ تا h2/h3 دارد).
- دسکتاپ: ستون کنار مقاله (خارج از `.card` یا داخل آن با float/grid)، `position:sticky; top:~90px`.
- موبایل: `<details>` جمع‌شونده بالای مقاله با عنوان «در این آموزش».
- TOC از h2/h3 خود مقاله ساخته شود؛ هر عنوان `id` بگیرد (اگر ندارد، اسکریپت slug بسازد) و `scroll-margin-top` مناسب تاپ‌بار.
- آیتم فعال با IntersectionObserver هایلایت شود (کلاس `.on`: رنگ accent).
- نوار پیشرفت: یک `div` fixed بالای viewport (زیر تاپ‌بار)، عرضش = درصد اسکرول مقاله، گرادیان accent. با `scroll` passive آپدیت شود.

### C2. کال‌اوت‌های سه‌گانه
سه کلاس به `style.css` اضافه کن و در متن‌های موجود جایگزین نکته‌های inline کن:
```css
.co { padding:13px 16px; border-radius:var(--radius); color:var(--text-muted); }
.co b:first-child { display:block; margin-bottom:2px; }
.co-warn { background:rgba(224,130,58,.09); border-inline-start:3px solid #e0823a; }
.co-warn b:first-child { color:#e0823a; }
.co-tip  { background:rgba(127,176,105,.08); border-inline-start:3px solid #7fb069; }
.co-tip  b:first-child { color:#7fb069; }
.co-info { background:rgba(120,160,220,.08); border-inline-start:3px solid #78a0dc; }
.co-info b:first-child { color:#78a0dc; }
```
موارد مشخص در `/proxmox-installation`:
- ارور VT-x / KVM not enabled → `co-warn`
- «نکته دم‌دستی: Options ونتوی» → `co-tip`
- «No Valid Subscription» → `co-info`

### C3. بلوک کد با هدر (زبان + دکمه کپی)
- هر `<pre>` داخل `.code-wrapper` فعلی بپیچد (برخی از قبل هستند) و هدر اضافه شود: برچسب زبان/مقصد سمت چپ (LTR)، دکمه «کپی» سمت راست.
- JS کپی: `navigator.clipboard.writeText(pre.innerText)`، بعد از موفقیت متن دکمه ۱.۵ ثانیه «کپی شد ✓» شود.
- شماره‌گذاری خطوط اختیاری است؛ حداقل هدر + کپی پیاده شود.
- اگر بعداً هایلایت سینتکس خواستند: بدون کتابخانه، فقط چند کلاس دستی (`tok-k`, `tok-s`, `tok-c`) روی کدهای مهم.

### C4. ناوبری قبلی/بعدی انتهای مقاله
پایین هر مقاله، جایگزین لینک متنی «برگشت به لیست آموزش‌ها»:
```html
<nav class="pn-grid">
  <a class="pn" href="/openwrt-on-proxmox">
    <small>→ آموزش بعدی</small><span>🌐 نصب OpenWrt روی Proxmox</span>
  </a>
  <a class="pn pn-back" href="/tutorials">
    <small>← بازگشت به</small><span>📚 لیست آموزش‌های سمباده</span>
  </a>
</nav>
```
گرید دوستونه؛ در ≤560px تک‌ستونه. hover: border accent + translateY(-2px).

### C5. دکمه بازگشت به بالا
دکمه گرد گوشه پایین (سمت مقابل theme-toggle که چپ است → بگذار راست)، بعد از ~۶۰۰px اسکرول ظاهر شود، کلیک = smooth scroll به بالا. با `prefers-reduced-motion` فوری پرش کند.

**پذیرش فاز C:** در مقاله پراکسماکس: progress bar موقع اسکرول حرکت کند، TOC آیتم فعال را دنبال کند، سه کال‌اوت با نوع درست رندر شوند، دکمه کپی واقعاً کپی کند، پایین مقاله prev/next باشد.

---

## فاز D — صفحه اصلی (اولویت: متوسط)

### D1. سکشن «آخرین مطالب»
بین کارت معرفی و کارت لینک‌ها:
```html
<section class="card">
  <h2><span class="icon">✍️</span> آخرین نوشته‌ها</h2>
  <!-- ۲–۳ آیتم آخر، همان استایل .pn از فاز C4 -->
  <a class="pn" href="/proxmox-installation">
    <small>جدیدترین آموزش · 2026-08</small>
    <span>🖥️ آموزش نصب Proxmox — از صفر تا Web UI</span>
  </a>
</section>
```
- ترتیب جدیدترین اول. اگر سایت بیلد استاتیک دارد این لیست از داده تولید شود تا با انتشار مقاله جدید آپدیت بماند؛ اگر دستی است، کامنت `<!-- UPDATE: آخرین مطالب -->` بالایش بگذار.

### D2. المان‌های برندینگ از ماکاپ Qwen (اختیاری ولی توصیه‌شده)
- **Ken Burns بنر:** `animation:kenburns 18s ease-in-out infinite alternate` روی `.banner` (scale 1→1.08). فقط اگر `prefers-reduced-motion` نباشد.
- **hero-kicker:** خط کوچک `SOMBADE · HOME` با letter-spacing بالا بالای عنوان بنر.
- **grit-strip (نوار متحرک سنباده P120→P2000):** نوار marquee بین سکشن‌ها با محتوای تکرارشده دوباره برای loop بی‌درز؛ pause روی hover؛ `aria-hidden="true"`؛ داخل reduced-motion ثابت بماند. این امضای برند سایت است — اگر جایی اضافه شود، بین سکشن معرفی و لینک‌ها.
- توجه: با D1 جمعش نکن — اولویت با D1 است؛ grit-strip فقط اگر فضای بصری شلوغ نشد.

**پذیرش:** خانه هنوز سبک و سریع باشد؛ LCP بنر خراب نشود.

---

## فاز E — عملکرد و سئو (اولویت: زیاد)

### E1. تصاویر
- همهٔ `<img>`های محتوایی: `loading="lazy"` + `width`/`height` صریح (CLS=0). بنر hero استثناست: `loading="eager"` + `fetchpriority="high"` + preload در head:
```html
<link rel="preload" as="image" href="/media/images/Main_banner.jpg">
```
- alt فارسی معنادار برای اسکرین‌شات‌ها («صفحه EULA نصب پراکسماکس» و…).

### E2. Open Graph / Twitter Card (همه صفحات)
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="article"> <!-- مقاله‌ها -->
<meta property="og:url" content="https://moein8668.ir/proxmox-installation">
<meta property="og:image" content="https://moein8668.ir/media/images/proxmox-installation/Banner.jpg">
<meta property="og:locale" content="fa_IR">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="https://moein8668.ir/proxmox-installation">
```
og:image باید URL کامل مطلق باشد (تلگرام relative را نمی‌گیرد).

### E3. JSON-LD
- مقاله‌ها: `TechArticle` با headline، datePublished، author (Person: معین)، image.
- breadcrumb ها: `BreadcrumbList` مطابق A2.
- سایت: `WebSite` با نام Sombade's Home.

### E4. RSS
- فایل `/feed.xml` دستی (یا تولیدشده) با ۱۰ آیتم آخر؛ در head همه صفحات:
```html
<link rel="alternate" type="application/rss+xml" title="آموزش‌های سمباده" href="/feed.xml">
```

**پذیرش:** [validator.schema.org](https://validator.schema.org) بدون ارور؛ تست لینک در تلگرام پیش‌نمایش عکس بگیرد؛ PageSpeed CLS ≈ 0.

---

## فاز F — جزئیات دسترسی‌پذیری

- skip-link بالای همه صفحات: `<a class="skip-link" href="#main">پرش به محتوا</a>` (فقط با focus نمایان).
- `aria-label` مناسب برای دکمه‌های آیکونی (theme-toggle الان دارد ✓، دکمه کپی و back-to-top هم بگیرند).
- کنتراست muted-text روی surface چک شود (b7b2a8 روی 282925 حدود 6:1 — اوکی).
- همه تعامل‌های جدید focus-visible با outline accent داشته باشند (الگوی موجود حفظ شود).

---

## ترتیب اجرا و تخمین

| ترتیب | تسک | تخمین | اولویت |
|---|---|---|---|
| 1 | C4 prev/next | ۳۰ دقیقه | زیاد |
| 2 | A1+A2 ناوبری و breadcrumb | ۲ ساعت | زیاد |
| 3 | B کارت‌های tutorials | ۱.۵ ساعت | زیاد |
| 4 | C1 TOC + progress | ۲ ساعت | زیاد |
| 5 | E1+E2+E3 عملکرد/سئو | ۲ ساعت | زیاد |
| 6 | C2+C3 کال‌اوت و بلوک کد | ۱.۵ ساعت | متوسط |
| 7 | D1 آخرین مطالب | ۱ ساعت | متوسط |
| 8 | E4 RSS | ۳۰ دقیقه | متوسط |
| 9 | F دسترس‌پذیری | ۱ ساعت | متوسط |
| 10 | D2 برندینگ Qwen (kenburns/kicker/grit) | ۱.۵ ساعت | اختیاری |

## چک‌لیست تست نهایی
- [ ] هر دو تم (پیش‌فرض و black) در همه تغییرات سالم‌اند
- [ ] موبایل 360px: منو، کارت‌ها، TOC (details)، pn-grid تک‌ستونه
- [ ] prefers-reduced-motion: هیچ انیمیشنی نمی‌جنبد
- [ ] لینک تلگرامی مقاله → پیش‌نمایش با تصویر
- [ ] اسکرول کامل مقاله پراکسماکس بدون layout jump (CLS≈0)
- [ ] دکمه کپی در HTTP لوکال fallback execCommand دارد
- [ ] breadcrumb و JSON-LD با validator پاس می‌شوند

## چیزهایی که نباید انجام شود
- ❌ تغییر رنگ/فونت/هویت برند
- ❌ افزودن فریم‌ورک (Tailwind/React/jQuery/…)
- ❌ حذف سیستم تم، lightbox، display-settings موجود
- ❌ تغییر متن‌های فارسی موجود (فقط افزودن ساختار حولشان)
