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
            .catch(error => console.log(error))
    }

    state.addEventListener('change', e => {
        city(e.target.value);
    })
})