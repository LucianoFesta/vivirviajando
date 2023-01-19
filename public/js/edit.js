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