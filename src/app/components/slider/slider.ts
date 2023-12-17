import jQuery from 'jquery';

import 'slick-carousel';

import './slider.scss';

type SliderOptions = {
  dots: boolean;
  arrows: boolean;
  infinite: boolean;
  fade: boolean;
  cssEase: string;
  autoplay: boolean;
  autoplaySpeed: number;
  pauseOnHover: boolean;
  adaptiveHeight: boolean;
};

const sliders: { init: () => void } = (function () {
  let loaded: boolean = false;

  const init: () => void = function init() {
    console.log('[sliders] initializing...');

    const sliderOptions: SliderOptions = {
      dots: true,
      arrows: false,
      infinite: true,
      fade: true,
      cssEase: 'linear',
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: false,
      adaptiveHeight: true,
    };

    // slick()
    (jQuery('.intro-slider') as any).slick(sliderOptions);

    console.log('[sliders] initiated.');
  };

  return {
    init,
  };
})();

export default sliders;
