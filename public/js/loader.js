window.addEventListener('load', () => {
    //alert('pagina cargada')
    const loader = document.querySelector('.centrado');
    const body = document.querySelector('.hidden');

    loader.remove();
    body.classList.remove('hidden');

})