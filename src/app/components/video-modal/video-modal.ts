import $ from 'jquery';

import 'bootstrap/js/dist/modal';

function init() {
  console.log('[play_video_modal] initializing...');

  $('.play_video').on('click', function () {
    console.log('CLICKED! Playing video');

    let id_modal = $(this).data().bsTarget;
    $(id_modal + ' video')[0].play();
  });

  $('video')
    .closest('.modal')
    .on('hidden.bs.modal', function () {
      $(this).find('video')[0].pause();
    });

  console.log('[play_video_modal] initiated.');
}

export default { init };
