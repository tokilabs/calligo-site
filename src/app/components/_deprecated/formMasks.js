var formMasks = (function () {
  var loaded = false;

  var init = function init () {
    cl('[formMasks] initializing...');

    var SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
      },
      spOptions = {
        onKeyPress: function (val, e, field, options) {
          field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
      };

    $('.mask_phone').mask(SPMaskBehavior, spOptions);
    $('.mask_cnpj').mask('00.000.000/0000-00', {reverse: true});
    $('.mask_cep').mask('00000-000');
    $(".mask_cpf").mask('000.000.000-00');
    $(".mask_date").mask('00/00/0000');
    $('.mask_epsi').mask('00/000.000');
    $('.mask_cpf_cnpj').mask(
      (val) => {
        return val.replace(/\D/g, '').length === 11 ? '000.000.000.00' : '00.000.000/0000-00';
      },
      {
        onKeyPress: function (cpfcnpj, e, field, options) {
          var masks = ['000.000.000-000', '00.000.000/0000-00'];
          var mask = (cpfcnpj.length > 14) ? masks[1] : masks[0];
          $('.mask_cpf_cnpj').mask(mask, options);
        },
      });
    // $(".mask_date input").datepicker({language: 'pt-BR'});

    cl('[formMasks] initiated.');
  };

  return {
    init: init
  }
})();

formMasks.init();
