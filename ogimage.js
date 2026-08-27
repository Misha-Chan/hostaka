// ============================================================
//  ogimage.js — dynamic Open Graph preview images (1200x630 PNG)
//
//  Problem this solves: when a post/video/profile/app has no image of
//  its own (a text-only post, a user with no avatar, a video with no
//  thumbnail...), the site falls back to the plain Hostaka logo as the
//  og:image — so a shared link on Twitter/Instagram/Facebook always
//  looks the same no matter what was actually shared.
//
//  This module draws a branded "screenshot-like" card instead: it pulls
//  in the real avatar/icon/photo of whatever is being shared (when one
//  exists) and composes it with the right platform's watermark logo and
//  a small vector glyph that identifies the content type (post/video/
//  profile/app/wiki). It never renders the post's actual text — only
//  shapes and already-existing images — so it renders correctly no
//  matter the language of the content (Arabic, English, or anything
//  else) without needing to bundle extra fonts.
// ============================================================
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const W = 1200, H = 630;

// كل خدمة إلها لون براند + شعارها (من public/icon/، محلي، بدون شبكة)
const BRANDS = {
  hostaka:    { c1: '#1a1d23', c2: '#3a3f4b', logo: 'hostaka-icon.png' },
  aethercast: { c1: '#0b0b0d', c2: '#2a2a2e', logo: 'aethercast-icon.png' },
  apps:       { c1: '#141418', c2: '#33333a', logo: 'apps-icon.png' },
  wiki:       { c1: '#16181c', c2: '#343a42', logo: 'wiki-icon.png' },
};

function localIconBuffer(fileName) {
  try { return fs.readFileSync(path.join(__dirname, 'public', 'icon', fileName)); }
  catch (e) { return null; }
}

async function remoteImage(url) {
  if (!url) return null;
  try {
    const r = await fetch(url, { timeout: 6000 });
    if (!r.ok) return null;
    const buf = await r.buffer();
    return await loadImage(buf);
  } catch (e) { return null; }
}

function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// أيقونة صغيرة توضّح نوع المحتوى — رسم متجهي بحت (بدون خطوط/نصوص)
function drawTypeGlyph(ctx, type, cx, cy, size) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = size * 0.09;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (type === 'video') {
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.stroke();
    const t = size * 0.32;
    ctx.beginPath();
    ctx.moveTo(cx - t * 0.4, cy - t * 0.6);
    ctx.lineTo(cx - t * 0.4, cy + t * 0.6);
    ctx.lineTo(cx + t * 0.7, cy);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'profile' || type === 'page') {
    ctx.beginPath();
    ctx.arc(cx, cy - size * 0.16, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + size * 0.62, size * 0.42, Math.PI, 0, true);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - size / 2, cy - size / 2, size, size);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.92)';
    ctx.lineWidth = size * 0.07;
    ctx.stroke();
    ctx.restore();
  } else if (type === 'app') {
    const g = size * 0.16, s = size * 0.34;
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
      roundedRectPath(ctx, cx + dx * (s / 2 + g / 2) - s / 2, cy + dy * (s / 2 + g / 2) - s / 2, s, s, s * 0.28);
      ctx.fill();
    });
  } else if (type === 'wiki') {
    roundedRectPath(ctx, cx - size * 0.36, cy - size / 2, size * 0.72, size, size * 0.08);
    ctx.stroke();
    ctx.lineWidth = size * 0.05;
    [0.2, 0.02, -0.16, -0.34].forEach(f => {
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.2, cy - size * f);
      ctx.lineTo(cx + size * 0.2, cy - size * f);
      ctx.stroke();
    });
  } else { // post (default)
    roundedRectPath(ctx, cx - size / 2, cy - size / 2, size, size, size * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - size * 0.18, cy - size * 0.14, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.32, cy + size * 0.28);
    ctx.lineTo(cx - size * 0.02, cy - size * 0.02);
    ctx.lineTo(cx + size * 0.14, cy + size * 0.12);
    ctx.lineTo(cx + size * 0.32, cy - size * 0.08);
    ctx.lineTo(cx + size * 0.32, cy + size * 0.32);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/**
 * @param {object} opts
 * @param {'hostaka'|'aethercast'|'apps'|'wiki'} opts.brand
 * @param {'post'|'video'|'profile'|'page'|'app'|'wiki'} opts.type
 * @param {string} [opts.imageUrl] رابط الصورة الحقيقية (صورة منشور/فيديو مصغّر/أفاتار/أيقونة تطبيق) إن وُجد
 * @param {boolean} [opts.imageIsSquare] true للأفاتار/الأيقونات (تُرسم بحواف مدوّرة)، false/undefined لصور المنشورات (تُرسم بعرض كامل كخلفية)
 * @returns {Promise<Buffer>} PNG buffer
 */
async function generateOgImage({ brand = 'hostaka', type = 'post', imageUrl, imageIsSquare }) {
  const b = BRANDS[brand] || BRANDS.hostaka;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // خلفية متدرّجة بلون البراند
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, b.c1);
  grad.addColorStop(1, b.c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const img = await remoteImage(imageUrl);

  if (img && !imageIsSquare) {
    // صورة منشور/فيديو حقيقية — تُملأ كخلفية كاملة (تشبه "لقطة شاشة" فعلية للمشاركة)
    const scale = Math.max(W / img.width, H / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
    // تعتيم خفيف أسفل الصورة عشان الشعار يبقى واضح فوقها
    const vg = ctx.createLinearGradient(0, H - 220, 0, H);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, H - 220, W, 220);
  } else if (img && imageIsSquare) {
    // أفاتار/أيقونة تطبيق — دائرة/مربع مدوّر كبير بمنتصف الكرت
    const size = 360;
    const x = (W - size) / 2, y = (H - size) / 2 - 20;
    ctx.save();
    if (type === 'app') {
      roundedRectPath(ctx, x, y, size, size, 56);
    } else {
      ctx.beginPath();
      ctx.arc(W / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = 40;
    ctx.fillStyle = '#00000022';
    ctx.fill();
    ctx.clip();
    ctx.drawImage(img, x, y, size, size);
    ctx.restore();
    ctx.save();
    if (type === 'app') roundedRectPath(ctx, x, y, size, size, 56);
    else { ctx.beginPath(); ctx.arc(W / 2, y + size / 2, size / 2, 0, Math.PI * 2); }
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.stroke();
    ctx.restore();
  } else {
    // ما فيه صورة إطلاقاً — أيقونة نوع المحتوى بمنتصف الكرت
    drawTypeGlyph(ctx, type, W / 2, H / 2 - 20, 200);
  }

  // شعار الخدمة (watermark) بأسفل يمين الكرت
  const logoBuf = b.logo ? localIconBuffer(b.logo) : null;
  if (logoBuf) {
    try {
      const logoImg = await loadImage(logoBuf);
      const lw = 84, lh = 84, lx = W - lw - 44, ly = H - lh - 40;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 24;
      roundedRectPath(ctx, lx, ly, lw, lh, 20);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();
      ctx.save();
      roundedRectPath(ctx, lx, ly, lw, lh, 20);
      ctx.clip();
      ctx.drawImage(logoImg, lx, ly, lw, lh);
      ctx.restore();
    } catch (e) { /* تجاهل، الكرت يبقى صالحًا بدون الشعار */ }
  }

  try {
    return await canvas.encode('png');
  } catch (e) {
    // نسخ أقدم من @napi-rs/canvas ما فيها encode() غير المتزامنة — نرجع لـ toBuffer()
    return canvas.toBuffer('image/png');
  }
}

module.exports = { generateOgImage };
