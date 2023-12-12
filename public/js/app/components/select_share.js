var select_share = (function(){
	var loaded = false;

	var init = function init(){
		cl('[select_share] initializing...');

        function change_icon() {
            var icon = $('.icon_select select option:selected').data().icon;
            $('.icon_select .icon').html(icon);
        }

        change_icon();

        $(document).on('change','.icon_select select',function(){
            change_icon();
        });
		
		cl('[select_share] initiated.');
	};

	return {
		init: init
	}
})();