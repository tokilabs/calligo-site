var play_video_modal = (function(){
	var loaded = false;

	var init = function init(){
		cl('[play_video_modal] initializing...');
		
		$('.play_video').on('click',function() {
			var id_modal = $(this).data().bsTarget;
			$(id_modal + ' video')[0].play();
		});

		$('video').closest('.modal').on('hidden.bs.modal', function () {
			$(this).find('video')[0].pause();
		});

		cl('[play_video_modal] initiated.');
	};

	return {
		init: init
	}
})();