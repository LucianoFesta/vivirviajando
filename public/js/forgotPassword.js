window.addEventListener('load', () => {

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

    const btnRegister = document.querySelector('.btnSubmit');

    btnRegister.addEventListener('click', (e) => {
        e.preventDefault;
        toastr["success"]("Favor de revisar tu correo Spam.");

        e.submit()
    })

})