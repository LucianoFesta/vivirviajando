window.addEventListener('load', () => {

    const btnSubmit = document.querySelector('.btnSubmit');
    const form = document.querySelector('form');

    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault();

        const alertSubmit = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-success',
              cancelButton: 'btn btn-danger',
              padding: '1rem',
              margin: '1rem'
            },
            buttonsStyling: false
        })
    
        alertSubmit.fire({
            title: 'Confirmá tu Correo Electrónico',
            text: 'Si el mail es correcto, revisá tu correo Spam para crear tu nueva contraseña.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
    
          }).then((result) => {
            if (result.isConfirmed) {
              form.submit()
            
            }
          })
    })

})