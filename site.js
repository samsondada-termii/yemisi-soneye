const dialog = document.querySelector('.lightbox');
if (dialog) {
  const image = dialog.querySelector('img');
  document.querySelectorAll('[data-enlarge]').forEach(button => button.addEventListener('click', () => {
    image.src = button.dataset.enlarge;
    image.alt = button.querySelector('img').alt;
    dialog.showModal();
  }));
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
}
