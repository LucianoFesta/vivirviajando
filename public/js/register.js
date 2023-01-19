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

    //Alert para verificar email.
    const form = document.querySelector('.formRegister');
    const btnRegister = document.querySelector('.btnRegister');
    btnRegister.addEventListener('click', (e) => {
        e.preventDefault();
        
        const alertRegister = Swal.mixin({
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger',
            padding: '1rem',
            margin: '1rem'
          },
          buttonsStyling: false
      })
  
      alertRegister.fire({
          title: 'Confirmá tu Correo Electrónico',
          text: 'Si completaste el formulario sin errores, revisá tu correo Spam para confirmar el email.',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
  
        }).then((result) => {
          if (result.isConfirmed) {
            form.submit()
          
          }
        })
    })

//Alerta cuando hace click en cancelar register
const btnCancelRegister = document.querySelector('.btnCancelRegister');

btnCancelRegister.addEventListener('click', e => {
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