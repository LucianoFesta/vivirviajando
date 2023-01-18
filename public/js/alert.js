//Alerta cuando hace click en cancelar editPassword
const btnCancelEditPassword = document.querySelector('.btnCancelEditPassword');

btnCancelEditPassword.addEventListener('click', e => {
    e.preventDefault()

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
          padding: '1rem',
          margin: '1rem'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: '¿Seguro que deseas cancelar?',
        text: 'Si cancelas, volverás a tu perfil',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'

      }).then((result) => {
        if (result.isConfirmed) {
          location.href = '/users/profile';
        
        }
      })

    })
