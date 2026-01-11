
// Fondo de página al cargar
window.onload = function() {
  const bodyElement = document.body;
  bodyElement.style.backgroundImage = "url('https://e0.pxfuel.com/wallpapers/123/988/desktop-wallpaper-normal.jpg')";
  bodyElement.style.backgroundSize = "cover";
  bodyElement.style.backgroundRepeat = "no-repeat";
  bodyElement.style.backgroundAttachment = "fixed";
};

// =============================
// Semana 5 – script.js
// =============================
(function(){
  const urlInput = document.getElementById('imageUrl');
  const addBtn   = document.getElementById('addBtn');
  const delBtn   = document.getElementById('delBtn');
  const gallery  = document.getElementById('gallery');
  const feedback = document.getElementById('feedback');

  // Validación simple de URL (http/https) con extensión de imagen
  function isValidImageUrl(s){
    try {
      const u = new URL(s);
      if (!/^https?:$/.test(u.protocol)) return false;
      // Permite png/jpg/jpeg/gif/webp
      return /\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(u.pathname);
    } catch(e){ return false; }
  }

  function clearFeedback(){ feedback.textContent = ''; }
  function showFeedback(msg, ok=true){
    feedback.textContent = msg;
    feedback.style.color = ok ? '#93c5fd' : '#fca5a5';
  }

  function deselectAll(){
    for(const card of gallery.querySelectorAll('.gallery__item')){
      card.classList.remove('selected');
    }
  }

  // Crear tarjeta de imagen (figure)
  function createImageCard(url){
    const card = document.createElement('figure');
    card.className = 'gallery__item';
    card.tabIndex = 0; // accesible por teclado

    const img = document.createElement('img');
    // Evitar enviar Referer (algunos servidores bloquean hotlink)
    img.referrerPolicy = 'no-referrer';
    img.src = url;
    img.alt = 'Imagen de la galería';

    // Manejo de carga/errores
    img.addEventListener('load', ()=>{
      showFeedback('Imagen agregada correctamente.');
    });
    img.addEventListener('error', ()=>{
      showFeedback('No se pudo cargar la imagen. Verifica la URL o que el servidor no bloquee hotlink.', false);
      card.remove();
    });

    card.appendChild(img);
    return card;
  }

  // Agregar imagen a la galería
  function addImage(){
    const url = urlInput.value.trim();
    if(!isValidImageUrl(url)){
      showFeedback('Ingresa una URL válida (http/https) que termine en .png/.jpg/.jpeg/.gif/.webp', false);
      return;
    }
    clearFeedback();
    const card = createImageCard(url);
    gallery.appendChild(card);
    deselectAll();
    card.classList.add('selected');
    urlInput.value = '';
    urlInput.focus();
  }

  // Eliminar imagen seleccionada
  function removeSelected(){
    const selected = gallery.querySelector('.gallery__item.selected');
    if(!selected){
      showFeedback('No hay imagen seleccionada para eliminar.', false);
      return;
    }
    selected.classList.add('removing');
    setTimeout(()=>{
      selected.remove();
      showFeedback('Imagen eliminada.');
    }, 220);
  }

  // Delegación de eventos: seleccionar imagen al hacer click
  gallery.addEventListener('click', (ev)=>{
    const card = ev.target.closest('.gallery__item');
    if(!card) return;
    deselectAll();
    card.classList.add('selected');
  });

  // Controles
  addBtn.addEventListener('click', addImage);
  delBtn.addEventListener('click', removeSelected);

  // Validar URL mientras escribe y habilitar/deshabilitar botón
  urlInput.addEventListener('input', ()=>{
    addBtn.disabled = !isValidImageUrl(urlInput.value.trim());
    clearFeedback();
  });

  // Atajos de teclado: Enter para agregar (cuando el input está enfocado), Delete para eliminar
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' && document.activeElement === urlInput){
      e.preventDefault();
      addImage();
    }
    if(e.key === 'Delete'){
      e.preventDefault();
      removeSelected();
    }
  });
})();
