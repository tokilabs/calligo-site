/**
 *             
 * <button type="button" 
		rel="popover" title=[title]" 
		data-text-align="left"
		data-callback-function="openModal"
		data-anchor-close="true"
		data-target="popover-select">
		[text button]
	</button>

	@param #rel
	With popover value to specify that it is a element with popover actions attached 
	@param #data-text-align
	To define the text position
	@param #data-callback-function
	To define a callback triggered by elements with `popover__anchor` class
	@param #data-anchor-close
	To define if when clicked in a achor trigger a method to close the popover
	@param #data-target
	The id of element that contains the content that will be attached at popover body

	The element that contain the `popover__anchor` actions need to have a class named `content-[attribute from target] to allow attached the events at correct `popover__anchor` elements.
 */


var customPopover = (function(){
	var init = function init(){
		cl('[customPopover] initializing...');

		$('[rel="popover"]').each(function() {
			var { target, textAlign, anchorClose, callbackFunction, position } = $(this).data();
			var callbackAction = eval(callbackFunction);
			var popoverBodyText = textAlign ? 'popover-body--' + textAlign : '';
			var placementPosition = position ? position : 'bottom-end';
			var popoverTemplate = '' + 
				'<div rel="sample" class="custom-popover popover" role="tooltip">' + 
					'<div class="popover-body ' + popoverBodyText + '"></div>' + 
				'</div>';

			var targetHTML = $('#' + target).html();
			var popoverAnchors = document.getElementById(target).querySelectorAll('.popover__anchor');
			var htmlContent = '<div class="popover__wrapper" rel="' + target + '">' + targetHTML + '</div>';

			$(this).popover({
				html: true,
				offset: [0,0],
				template: popoverTemplate,
				content: function(){
					return htmlContent
				},
				popperConfig: {
					placement: placementPosition
				}
			});
	
			if (anchorClose) {
				var self = $(this);
				$(this).on('shown.bs.popover', function() {
					var anchors = $('.popover__wrapper .content-' + target + ' .popover__anchor');
					anchors.each(function(index, item) {
						var popoverAnchor = popoverAnchors[index];

						$(item).on('click', function() {
							var data = popoverAnchor.dataset;
							callbackAction.apply(this, [data]);
							// self.popover('hide');
						});
					});
					$('body').on('click',function(){
						self.popover('hide');
						$('body').off('click');
					});
				});
			}
		});

		cl('[customPopover] initialized...');
	};

	return {
		init: init
	}
})();

var openModal = function(arguments) {
	var { id } = arguments;
};