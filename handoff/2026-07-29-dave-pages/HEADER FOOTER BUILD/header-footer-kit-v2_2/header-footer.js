// header turns white on scroll
const hdr=document.getElementById('hdr');
addEventListener('scroll',()=>{hdr.classList.toggle('scrolled',scrollY>40)},{passive:true});
