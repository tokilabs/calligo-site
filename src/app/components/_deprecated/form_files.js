var form_files = (function(){
	var loaded = false;

	var init = function init(){
		cl('[form_files] initializing...');

        function addfile(name,size) {
            return '<span class="file">'+name+' <b>('+size+'kb)</b> <button type="button" class="material-icons text__gray70 btn-delete-file">close</button></span>'
        }

        $("input.files_in_textarea").on('change',function() {
            var files = [];
            for (var i = 0; i < $(this)[0].files.length; ++i) {
                files.push({
                    'name':$(this)[0].files[i].name,
                    'size':Math.ceil($(this)[0].files[i].size/1024)
                });
            }
            //para somente 1 arquivo (NÃO funciona para MULTIFILE)
            $(this).parent().find('.files').html('').append(addfile(files[0].name,files[0].size));
        });

        // $("button.btn-delete-file").on('click',function() {
        $(document).on('click','button.btn-delete-file',function() {
            //para somente 1 arquivo (NÃO funciona para MULTIFILE)
            let form = $(this).closest('form');
            form.find('.files').html('');
            form.find('input.files_in_textarea').val('');
            cl('ae');
        });
		
		cl('[form_files] initiated.');
	};

	return {
		init: init
	}
})();