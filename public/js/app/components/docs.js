var docs = (function () {
    var loaded = false;

    var init = function init() {
        cl('[docs] initializing...');

        $('#client-docs-search,#client-notes-search').on('keyup', function () {
            let search = this.value;
            if (search.length > 1) {
                docsTable.search(this.value).draw();
            } else {
                docsTable.search("").draw();
            }
        });

        $('.filter-table button').on('click', function () {
            $('.filter-table button.active').removeClass('active');
            $(this).addClass('active');
            if($('.filter-table button').length>1){
                let column = $(this).data('column');
                docsTable.column(column).search($(this).data('filter')).draw();
            }
        });
        // docsTable.column(3).visible(false);

        $('.table-records tbody tr').on('click', function () {
            $('.table-records tbody tr').removeClass('active');
            $(this).addClass('active');

            let tableActive = $('.table-records tbody tr.active');
            $('#actions-table').removeClass('d-none');
            $('#actions-table a.link').attr('href', tableActive.data('fileView'));
            $('#actions-table a.download').attr('href', tableActive.data('fileDownload'));
            $('#actions-table a.delete').data('delete_id', tableActive.data('id'));
            $('#actions-table a.modal-start').data('title', tableActive.data('title')).data('body', tableActive.data('body'));
        });

        $('#actions-table a.delete').on('click', function (e) {
            e.preventDefault();

            var action = $('#actions-table').data('action');
            cl(action);

            $('#confirmationModal').modal('show');
			$('#confirmationModal').data('confirmation',action);
			$('#confirmationModal [class^="confirm_"]').removeClass('d-inline');
			$('#confirmationModal .confirm_'+action).addClass('d-inline');
			$('#confirmationModal .confirm_name_'+action).text($('#'+action+'ModalName').text());
			$('#confirm_cancel,#confirm_delete').removeAttr('disabled');

            $('#confirm_cancel:not(:disabled)').on('click', function(e){
                e.preventDefault();
                $('#confirmationModal').modal('hide');
            });

            $('#confirm_delete:not(:disabled)').on('click', function(e){
                e.preventDefault();
                $('#confirm_delete').attr('disabled','');
                $('#confirm_cancel').attr('disabled','');

                let note_delete = $('#actions-table a.delete').data('delete_id');
                let url;

                switch (action) {
                    case 'newNote':
                        url = _BASE_URL_+'dashboard/notes/delete/'+note_delete;
                    break;
                    case 'docs':
                        url = _BASE_URL_+'dashboard/docs/delete/'+note_delete;
                    break;
                }
                
                cl('form iniciado');
                $.getJSON(url, function(msg){
                    if(msg === true) {
                        $('#confirmationModal').modal('hide');
                        docsTable.row('.active').remove().draw();
                        $('#actions-table').addClass('d-none');
                    }
                    cl(msg)
                });
            });
            
        });

        $('#actions-table a.modal-start').on('click', function (e) {
            e.preventDefault();
            let id = $(this).attr('href');
            let title = $(this).data('title');
            let body = $(this).data('body');
            $(id).find('.modal-title').text(title);
            $(id).find('.modal-body').html(body);

            $(id).modal('show');
        });

        cl('[docs] initiated.');
    };

    let docsTable = $('.table-records').DataTable({
        "paging": false,
        // "order": [[3, 'asc']],
        "columnDefs": [
            { "width": "20%", "targets": 0 }
        ],
        "language": {"decimal":"","emptyTable":"","info":"","infoEmpty":"","infoFiltered":"","infoPostFix":"","thousands":"","lengthMenu":"","loadingRecords":"","processing":"","search":"","zeroRecords":"","paginate":{"first":"","last":"","next":"","previous":""},"aria":{"sortAscending":"","sortDescending":""}},
        // "search": {
        //     "search": "erry"
        // },
        // "searching": false
    });
    $('#docs_filter,#notes_filter').addClass('d-none');

    return {
        init: init,
        // docsTable: docsTable
    }
})();