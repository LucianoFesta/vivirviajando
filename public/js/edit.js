//Alerta cuando hace click en cancelar edicion de usuario
const btnCancelEdit = document.querySelector('.btnCancelEdit');

btnCancelEdit.addEventListener('click', e => {
    e.preventDefault()

    const alertCancelEdit = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
          padding: '1rem',
          margin: '1rem'
        },
        buttonsStyling: false
    })

    alertCancelEdit.fire({
        title: '¿Seguro que deseas cancelar?',
        text: 'Si cancelas, volverás al Perfil',
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