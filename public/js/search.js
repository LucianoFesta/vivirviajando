window.addEventListener('load', () => {

    const ctnBarSearch = document.querySelector('.ctn-bars-search');
    const coverCtnSearch = document.querySelector('.cover-ctn-search');
    const inputSearch = document.querySelector('.inputSearch');
    const btnIconSearch = document.querySelector('.btn-icon-search');
    const carousel = document.querySelector('.carousel');
    const btnNavBar = document.querySelector('.navbar-toggler');
    const mediaqueryList = window.matchMedia("(max-width: 992px)");

    btnIconSearch.addEventListener('click', () => {
        mostrarBuscador();
    })

    coverCtnSearch.addEventListener('click', () => {
        ocultarBuscador();
    })

    carousel.addEventListener('click', () => {
        ocultarBuscador();
    })

    function mostrarBuscador(){

        if(mediaqueryList.matches){
            btnNavBar.click();
        }

        ctnBarSearch.style.display = 'block';
        inputSearch.focus();
        ctnBarSearch.style.top = '135px';
        coverCtnSearch.style.display = 'block';

    }

    function ocultarBuscador(){

        ctnBarSearch.style.top = '-10px';
        coverCtnSearch.style.display = 'none';
        ctnBarSearch.style.display = 'none';
        inputSearch.value = '';
        
    }

})