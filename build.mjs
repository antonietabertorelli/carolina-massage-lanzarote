import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const read=(p)=>JSON.parse(fs.readFileSync(path.join(__dirname,p),'utf8'));
const site=read('content/site.json');
const en=read('content/en.json');
const es=read('content/es.json');
const esc=(s='')=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
const attr=esc;
function waUrl(lang){
  const n=(site.whatsappNumber||'').replace(/\D/g,'');
  const msg=encodeURIComponent(lang.finalCta.message||'');
  return n?`https://wa.me/${n}?text=${msg}`:`mailto:${site.email}?subject=${encodeURIComponent('Massage booking enquiry')}`;
}
function schema(lang, url){
  const offers=[lang.signature,...lang.services].map(s=>({"@type":"Offer","itemOffered":{"@type":"Service","name":s.title||s.name,"description":s.body||s.description}}));
  const data={"@context":"https://schema.org","@type":"HealthAndBeautyBusiness","name":site.businessName,"url":url,"email":site.email,"areaServed":site.serviceArea,"availableLanguage":["English","Spanish"],"openingHoursSpecification":[{"@type":"OpeningHoursSpecification","dayOfWeek":["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"opens":"10:00","closes":"21:00"}],"hasOfferCatalog":{"@type":"OfferCatalog","name":"Massage treatments","itemListElement":offers}};
  if(site.whatsappNumber) data.telephone=`+${site.whatsappNumber.replace(/\D/g,'')}`;
  return JSON.stringify(data);
}
function page(lang, code){
 const isEs=code==='es';
 const assetPrefix=isEs?'../':'./';
 const homeHref=isEs?'../':'./';
 const esHref=isEs?'./':'./es/';
 const localAsset=(value='')=>assetPrefix+String(value).replace(/^\//,'');
 const base=site.domain.replace(/\/$/,'');
 const url=isEs?`${base}/es/`:`${base}/`;
 const alt=isEs?`${base}/`:`${base}/es/`;
 const whatsapp=waUrl(lang);
 const googleBtn=site.googleBusinessUrl?`<a class="btn btn-light" href="${attr(site.googleBusinessUrl)}" target="_blank" rel="noopener">${esc(lang.reviews.cta)}</a>`:'';
 const services=lang.services.map(s=>`<article class="service"><div><div class="meta">${esc(s.duration)}</div><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p></div></article>`).join('');
 const trust=lang.trust.map(t=>`<div class="trustitem">${esc(t)}</div>`).join('');
 const hours=isEs?site.openingHoursEs:site.openingHoursEn;
 const contact=[site.phoneDisplay,site.studioLocation,hours,site.email].filter(Boolean).map(esc).join(' · ');
 return `<!doctype html><html lang="${code}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(lang.seo.title)}</title><meta name="description" content="${attr(lang.seo.description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="en" href="${base}/"><link rel="alternate" hreflang="es" href="${base}/es/"><link rel="alternate" hreflang="x-default" href="${base}/"><meta property="og:type" content="website"><meta property="og:title" content="${attr(lang.seo.title)}"><meta property="og:description" content="${attr(lang.seo.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}${attr(site.ogImage)}"><link rel="icon" href="${localAsset('/favicon.svg')}" type="image/svg+xml"><link rel="stylesheet" href="${localAsset('/assets/css/styles.css')}"><script type="application/ld+json">${schema(lang,url)}</script></head><body>
<header class="site-header"><div class="wrap header-inner"><a class="brand" href="${homeHref}">${esc(site.businessName)}</a><nav class="nav"><a data-scroll href="#treatments">${esc(lang.nav.services)}</a><a data-scroll href="#mobile">${esc(lang.nav.mobile)}</a><a data-scroll href="#about">${esc(lang.nav.about)}</a><a class="lang" href="${isEs?homeHref:esHref}">${isEs?'EN':'ES'}</a><a class="nav-cta" href="${whatsapp}" target="_blank" rel="noopener">${esc(lang.nav.book)}</a></nav></div></header>
<main>
<section class="hero"><div class="hero-copy"><div class="hero-inner"><div class="eyebrow">${esc(lang.hero.eyebrow)}</div><h1>${esc(lang.hero.title)}</h1><p>${esc(lang.hero.body)}</p><div class="actions"><a class="btn btn-dark" href="${whatsapp}" target="_blank" rel="noopener">${esc(lang.hero.primaryCta)}</a><a class="btn btn-light" data-scroll href="#treatments">${esc(lang.hero.secondaryCta)}</a></div></div></div><div class="hero-media" style="background-image:url('${attr(localAsset(site.heroImage))}')" role="img" aria-label="${attr(site.businessName)}"></div></section>
<section class="trustbar"><div class="wrap trustgrid">${trust}</div></section>
<section class="section"><div class="wrap intro-grid"><div><div class="eyebrow">${esc(lang.intro.eyebrow)}</div><h2>${esc(lang.intro.title)}</h2></div><div><div class="quote-mark">“</div><p class="lead">${esc(lang.intro.body)}</p></div></div></section>
<section class="section signature"><div class="wrap signature-grid"><div><div class="eyebrow">${esc(lang.signature.eyebrow)}</div><h2>${esc(lang.signature.title)}</h2><div class="duration">${esc(lang.signature.duration)}</div></div><div class="signature-card"><p class="lead">${esc(lang.signature.body)}</p><div class="actions"><a class="btn btn-dark" style="background:#f6f1e8;color:#24231f;border-color:#f6f1e8" href="${whatsapp}" target="_blank" rel="noopener">${esc(lang.signature.cta)}</a></div></div></div></section>
<section class="section" id="treatments"><div class="wrap"><div class="eyebrow">${esc(lang.servicesHeading.eyebrow)}</div><h2>${esc(lang.servicesHeading.title)}</h2><p class="lead">${esc(lang.servicesHeading.body)}</p><div class="services-grid">${services}</div></div></section>
<section class="section mobile-section" id="mobile"><div class="wrap split"><div class="image-panel" style="background-image:url('${attr(localAsset(site.mobileImage))}')"></div><div><div class="eyebrow">${esc(lang.mobile.eyebrow)}</div><h2>${esc(lang.mobile.title)}</h2><p class="lead">${esc(lang.mobile.body)}</p><p class="note">${esc(lang.mobile.note)}</p><a class="btn btn-dark" href="${whatsapp}" target="_blank" rel="noopener">${esc(lang.mobile.cta)}</a></div></div></section>
<section class="section about-section" id="about"><div class="wrap split"><div><div class="eyebrow">${esc(lang.about.eyebrow)}</div><h2>${esc(lang.about.title)}</h2><p class="lead">${esc(lang.about.body)}</p><p class="contactline">${esc(lang.about.note)}</p></div><div class="image-panel" style="background-image:url('${attr(localAsset(site.aboutImage))}')"></div></div></section>
<section class="section reviews"><div class="wrap reviewbox"><div><div class="eyebrow">${esc(lang.reviews.eyebrow)}</div><h2>${esc(lang.reviews.title)}</h2><p class="lead">${esc(lang.reviews.body)}</p></div><div class="review-note">${googleBtn || esc(lang.reviews.body)}</div></div></section>
<section class="section final"><div class="wrap"><div class="eyebrow">${esc(lang.finalCta.eyebrow)}</div><h2>${esc(lang.finalCta.title)}</h2><p class="lead">${esc(lang.finalCta.body)}</p><a class="btn btn-dark" href="${whatsapp}" target="_blank" rel="noopener">${esc(lang.finalCta.button)}</a><div class="contactline">${contact}</div></div></section>
</main>
<footer class="site-footer"><div class="wrap footer-grid"><div><div class="brand">${esc(site.businessName)}</div><div class="footer-small">${esc(lang.footer.tagline)}</div></div><div class="footer-small">${esc(lang.footer.legal)}</div><div class="footer-links">${site.instagramUrl?`<a href="${attr(site.instagramUrl)}" target="_blank" rel="noopener">Instagram</a>`:''}<a href="mailto:${attr(site.email)}">Email</a><a href="${isEs?homeHref:esHref}">${isEs?'English':'Español'}</a></div></div></footer>
<a class="whatsapp-float" href="${whatsapp}" target="_blank" rel="noopener">WhatsApp</a><script src="${localAsset('/assets/js/main.js')}"></script></body></html>`;
}
function copyDir(src,dst){fs.mkdirSync(dst,{recursive:true});for(const item of fs.readdirSync(src,{withFileTypes:true})){const a=path.join(src,item.name),b=path.join(dst,item.name);item.isDirectory()?copyDir(a,b):fs.copyFileSync(a,b)}}
const dist=path.join(__dirname,'dist');fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(path.join(dist,'es'),{recursive:true});
copyDir(path.join(__dirname,'public'),dist);fs.writeFileSync(path.join(dist,'index.html'),page(en,'en'));fs.writeFileSync(path.join(dist,'es','index.html'),page(es,'es'));
const base=site.domain.replace(/\/$/,'');fs.writeFileSync(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}/</loc></url><url><loc>${base}/es/</loc></url></urlset>`);
console.log('Built English and Spanish static pages in dist/');
