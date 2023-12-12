var form_summernote = (function(){
	var loaded = false;

	var init = function init(){
		cl('[form_summernote] initializing...');
        
        $('[data-summernote]').each(function(){
            var buttons_summer = $(this);
            var id_summer = '#'+buttons_summer.data('summernote');
            $(id_summer).summernote({
                height: 200,
                toolbar: false,
                placeholder: $(id_summer).attr('placeholder'),
            });
            var lengSelect = 1;
            buttons_summer.find('span[data-button-summernote]').each(function(){
                var button_summer = $(this);
                button_summer.on('click',function(e) {
                    e.preventDefault();
                    var button = $(this).data('buttonSummernote');
                    setTimeout(function() {
                        $(id_summer).summernote('restoreRange');
                        cl('restoreRange');
                        setTimeout(function() {
                            cl(button);
                            if (lengSelect==0 && button=='removeFormat') {
                                var text = '<p>'+$(id_summer + ' + .note-editor').find('.note-editable').text()+'</p>';
                                $(id_summer + ' + .note-editor').find('.note-editable').html(text);
                                $(id_summer).val(text);
                            }
                            $(id_summer).summernote(button);
                        },100);
                    },100);
                });
            });
            buttons_summer.on('mouseenter',function(){
                $(id_summer).summernote('saveRange');
                lengSelect = Math.abs($(id_summer).summernote('createRange').eo-$(id_summer).summernote('createRange').so);
            })
        });
		
		cl('[form_summernote] initiated.');
	};

	return {
		init: init
	}
})();