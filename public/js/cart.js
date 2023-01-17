//Verificamos la existencia del localStorage para retornar si hay elementos para el numero del carrito.
function cartProducts(){
    return localStorage.cart ? JSON.parse(localStorage.cart).length : 0;
}

window.addEventListener('load', () => {

    const productsBuy = document.querySelectorAll('.cart_add');
    const cartNumber = document.querySelector('.cart_number');

    cartNumber.innerText = cartProducts();

    //Config de notificacion.
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }

    productsBuy.forEach(product => {
        product.addEventListener('click', e => {
            //console.log(e.target.dataset.id); Todo lo que tenga en data-"algo" en la etiqueta, lo capturo asi (e.target.dataset.id)

            if(localStorage.cart){
                let cart = JSON.parse(localStorage.cart);

                //El findIndex busca en un array si existe un elemento y devuelve el indice del array donde se encuetra. Sino devuelve -1;
                let index = cart.findIndex(item => item.id == e.target.dataset.id);
                if(index != -1){
                    cart[index].cantidad++
                }else{
                    cart.push({
                        id: e.target.dataset.id,
                        cantidad: 1
                    })
                }
                localStorage.setItem('cart', JSON.stringify(cart));

            }else{
                localStorage.setItem('cart', JSON.stringify([{
                    id: e.target.dataset.id,
                    cantidad: 1
                }]));
            }

            //Notificacion con toastr
            toastr.success("Producto agregado al carrito.")
            //Agregamos el número de productos en el carrito
            cartNumber.innerText = cartProducts();

        })
    })
})