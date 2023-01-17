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
    
                                    <td> <button class='btn btn-danger btn-sm' onClick=removeItem(${index})><i class="bi bi-trash3"></i></button> </td>
                                </tr>
                            `  
                        //Pusheo los productos en un array creado para calcular el monto total de la compra.
                        products.push({
                            productID: product.id,
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
    }

    //Capturamos las info del formulario confirmar la compra
    const checkoutCart = document.querySelector('.checkoutCart');
    
    checkoutCart.addEventListener('submit', (e) => {
        e.preventDefault()

        const formData = {
            orderItems: products,
            paymentMethod: checkoutCart.paymentMethod.value,
            total: calcularTotal(products)
        };

        console.log(formData)

        fetch('/api/checkoutCart', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => console.log(data))
            
        })
}) //VIDEO: 1:38