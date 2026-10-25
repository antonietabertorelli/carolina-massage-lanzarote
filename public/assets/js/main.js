document.querySelectorAll('[data-scroll]').forEach((link)=>{
  link.addEventListener('click',(e)=>{
    const id=link.getAttribute('href');
    if(id && id.startsWith('#')){
      const el=document.querySelector(id);
      if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'});}
    }
  });
});
