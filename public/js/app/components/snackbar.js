var snackbar = (function(){
    var toastInstance;

    var init = function() {
        var toastElement = document.querySelector('.toast-element');

        if (!toastElement)
            initComponent();
    };

    var initComponent = function() {
        var content = `
            <div class="toast-container position-fixed bottom-0 end-0 p-3">
                <div class="toast align-items-center" id="toast-element" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <span class="material-icons-outlined toast-icon"></span>
                        <strong class="me-auto toast-title"></strong>
                        <button type="button" class="material-icons toast-close" data-bs-dismiss="toast" aria-label="Close">close</button>
                    </div>
                    <div class="toast-body"></div>
                </div>
            </div>
      `;

      $('body').append(content);

      var toastEl = document.getElementById('toast-element');
      new bootstrap.Toast(toastEl, {autohide: true});
      toastInstance = bootstrap.Toast.getInstance(toastEl);
    };

    var show = function(message, type) {
        var toastContainer = document.getElementsByClassName('toast-container');
        var toastEl = document.getElementById('toast-element');
        $(toastContainer).show();
        $(toastEl).removeClass('bg-success bg-danger text-white');
        $(toastEl).find('.toast-header').removeClass('text-danger text-success');

        if (type == 'error') {
            $(toastEl).find('.toast-title').html('Erro!');
            $(toastEl).find('.toast-icon').html('error_outline');
            $(toastEl).find('.toast-header').addClass('text-danger');
            $(toastEl).addClass('bg-danger text-white');
        }

        if (type == 'success') {
            $(toastEl).find('.toast-title').html('Successo!');
            $(toastEl).find('.toast-icon').html('check_circle');
            $(toastEl).find('.toast-header').addClass('text-success');
            $(toastEl).addClass('bg-success text-white');
        }

        $(toastEl).find('.toast-body').html(message);

        toastInstance.show();
    }

    return {
        init: function() {
            return init();
        },
        show: function(message, type) {
            return show(message, type);
        }
    }
})();