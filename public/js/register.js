window.addEventListener('load', () => {
    const state = document.getElementById('state');

    function city(provincia) {
        fetch(`https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&max=1000`)
            .then(response => response.json())
            .then(data => {
                let ciudades = data.municipios;              
                let options = () => {
                    let citiesList = []
                    ciudades.forEach(city => {
                        citiesList.push(`<option value='${city.nombre}'>${city.nombre}</option>`);
                    })
                    return citiesList;                    
                };
                const cities = document.getElementById('city');
                cities.innerHTML = options()
            })
            .catch(error => res.redirect('/error404'))
    }

    state.addEventListener('change', e => {
        city(e.target.value);
    })

    //Mensaje para confirmar mail al registrarse
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": 0,
        "extendedTimeOut": 0,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "tapToDismiss": false
      }

    const btnRegister = document.querySelector('.btnRegister');

    btnRegister.addEventListener('click', (e) => {
        e.preventDefault;
        toastr["success"]("Mail Enviado. Confirme su Email. Favor de revisar en la casilla de Spam.");

        e.submit()
    })

//Alerta cuando hace click en cancelar register
const btnCancelRegister = document.querySelector('.btnCancelRegister');

btnCancelRegister.addEventListener('click', e => {
  console.log(btnCancelRegister)
    e.preventDefault()

    const alertRegisterCnl = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
          padding: '1rem',
          margin: '1rem'
        },
        buttonsStyling: false
    })

    alertRegisterCnl.fire({
        title: '¿Seguro que deseas cancelar el Registro?',
        text: 'Si cancelas, volverás al Inicio',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'

      }).then((result) => {
        if (result.isConfirmed) {
          location.href = '/';
        
        }
      })

    })

})