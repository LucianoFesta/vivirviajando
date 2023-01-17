function removeItem(index){
    const cartItems = JSON.parse(localStorage.cart);
    const itemDelete = cartItems.find(item => item.id == index)
    const i = cartItems.indexOf(itemDelete)
    cartItems.splice(i, 1);

    localStorage.setItem('cart', JSON.stringify(cartItems));

    if(cartItems.length === 0){
        localStorage.removeItem('cart')
    }

    location.href = '/users/cart'
}

window.addEventListener('load', () => {
    
    function calcularTotal(products){
        return products.reduce((acumulador, product) => (
            acumulador += product.precio * product.cantidad
        ),0
    )};

    const cartRow = document.querySelector('.cartRow');
    const products = [];
    

    if(localStorage.cart){ 
        let cartItems = JSON.parse(localStorage.cart);
        let productExist = [];
    
        cartItems.forEach((item, index) => {
            fetch(`/api/product/${item.id}`)
                .then(res => res.json())
    
                .then(product => {
                    //Si el producto viene (puede pasar que lo hayan borrado de la db y me quedo en el localStorage)
                    if(product){
                        
                        productExist.push(item); //Pusheo item ya que es el elemento del localStorage que tiene solo id y cantidad para que actualice el numero del carrito.
    
                        cartRow.innerHTML += `
                                <tr id='row${index}'>
                                    <th scope="row">${index + 1}</th>
                                    <td>${product.nombre} - ${product.servicio}</td>
                                    <td>${item.cantidad}</td>
                                    <td>$ ${parseFloat(product.precio).toFixed(2)}</td>
                                    <td>$ ${parseFloat(item.cantidad * product.precio).toFixed(2)}</td>
    
                                    <td> <button class='btn btn-danger btn-sm' onClick=removeItem(${item.id})><i class="bi bi-trash3"></i></button> </td>
                                </tr>
                            `  
                            
                        //Pusheo los productos en un array creado para calcular el monto total de la compra.
                        products.push({
                            id_producto: product.id,
                            nombre: product.nombre,
                            servicio: product.servicio,
                            precio: product.precio,
                            cantidad: item.cantidad
                        });

                        
                    }
                    localStorage.setItem('cart', JSON.stringify(productExist)); //Seteo el nuevo carrito sin el elemento eliminado.
                })  
    
                .then( () => {
                    document.querySelector('.cartTotal').innerText = `$ ${calcularTotal(products)}`
                })
                
        });
    }else{
        const emptyCart = document.querySelector('.emptyCart');
    
        emptyCart.innerHTML = `
        <div class="alert alert-warning" role="alert">
            No hay productos en el carrito de compras.
        </div>
        `
    }


    //Capturamos las info del formulario confirmar la compra
    const checkoutCart = document.querySelector('.checkoutCart');

    if(!localStorage.cart){
        checkoutCart.addEventListener('submit', e => {
            e.preventDefault()+
            alert('Su carrito se encuentra vacío.')
        })
    }else{

        checkoutCart.addEventListener('submit', (e) => {
            e.preventDefault()
    
            const formData = {
                orderItems: products,
                formaPago: checkoutCart.paymentMethod.value,
                totalCompra: calcularTotal(products)
            };
    
            fetch('/api/checkoutCart', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(res => res.json())
                .then(data => {
                    //Si, del json existe el ok:true, elimino el localStorage
                    if(data.ok){
                        localStorage.removeItem('cart');
                        location.href = '/users/profile'
                    }
                })
                .catch(error => console.log(error))           
            })
    }
    
}) 