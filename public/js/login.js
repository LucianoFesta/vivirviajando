window.addEventListener('load', () => {
    
    const inputPassword = document.getElementById('password');
    const eyePassword = document.getElementById('eyePassword');
    const eyePasswordNone = document.getElementById('eyePasswordNone');

    eyePassword.addEventListener('click', () => {
        eyePassword.style.display = 'none';
        eyePasswordNone.style.display = 'block';

        if(inputPassword.type = 'password'){
            inputPassword.type = 'text'
        }else{
            inputPassword.type = 'password'
        }
    })

    eyePasswordNone.addEventListener('click', () => {
        eyePassword.style.display = 'block';
        eyePasswordNone.style.display = 'none';
        
        if(inputPassword.type = 'text'){
            inputPassword.type = 'password'
        }else{
            inputPassword.type = 'text'
        }
    })
})