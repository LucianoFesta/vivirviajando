//Alerta cuando hace click en cancelar el cierre de sesion
const btnCancelLogout = document.querySelector('.btnCancelLogout');

btnCancelLogout.addEventListener('click', e => {
    e.preventDefault()

    const alertCancelLogout = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
          padding: '1rem',
          margin: '1rem'
        },
        buttonsStyling: false
    })

    alertCancelLogout.fire({
        title: '¿Deseas cerrar tu sesión?',
        text: 'Volverás al inicio de sesión',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'

      }).then((result) => {
        if (result.isConfirmed) {
          location.href = '/users/profile/logout';
        
        }
      })

    })