import jQuery from 'jquery';

import './header.scss';

type InitFunction = () => void;

const headerModule = ((): { init: InitFunction } => {
  let loaded: boolean = false;

  const cl: (message: string) => void = (message: string): void => {
    console.log(message);
  };

  const init: InitFunction = (): void => {
    cl('[header] initializing...');

    const navbar = jQuery('#navbar');
    const home = jQuery('#home');
    const windowElement = jQuery(window);
    const flyoutMenu = jQuery('.flyoutMenu');
    const hasFlyoutMenu = jQuery('.hasFlyoutMenu');
    const markAllAsRead = jQuery('#markAllAsRead');
    const btnResendEmail = jQuery('#btnResendEmail');
    const menuMobile = jQuery('#menu_mobile');
    const menuMobileContainer = jQuery('#menu_mobile_container');
    const closeMenuButton = jQuery('.close-menu-button');

    const toggleNavbarStyle = (): void => {
      if (window.scrollY > 100) {
        navbar.addClass('bg-primary').find('.logo').removeClass('primary');
        navbar
          .find('.nav-link')
          .removeClass('text-dark')
          .addClass('text-white');
        navbar
          .find('.justify-content-end > .btn-outline-primary')
          .removeClass('btn-outline-primary')
          .addClass('btn-outline-light');
        navbar
          .find('.justify-content-end > .btn-primary')
          .removeClass('btn-primary')
          .addClass('btn-light');
        navbar.find('.header-icon').addClass('text-white');
      } else {
        navbar.removeClass('bg-primary').find('.logo').addClass('primary');
        navbar
          .find('.nav-link')
          .addClass('text-dark')
          .removeClass('text-white');
        navbar
          .find('.justify-content-end > .btn-outline-light')
          .removeClass('btn-outline-light')
          .addClass('btn-outline-primary');
        navbar
          .find('.justify-content-end > .btn-light')
          .removeClass('btn-light')
          .addClass('btn-primary');
        navbar.find('.header-icon').removeClass('text-white');
      }
    };

    if (home.length) {
      windowElement.on('scroll', toggleNavbarStyle);
    } else {
      toggleNavbarStyle();
    }

    flyoutMenu.on('click', (e: JQuery.Event) => {
      e.stopPropagation();
    });

    hasFlyoutMenu.on('click', (e: JQuery.Event) => {
      e.stopPropagation();
      jQuery(e.currentTarget).toggleClass('open');
    });

    markAllAsRead.on('click', () => {
      cl('Marking all notifications as read...');
      jQuery('.notification').removeClass('notRead');
      cl('Marked all notifications as read!');
    });

    jQuery('body').on('click', () => {
      hasFlyoutMenu.removeClass('open');
    });

    btnResendEmail.on('click', () => {
      const mail: string = btnResendEmail.attr('data-email') as string;
      const baseUrl: string = _BASE_URL_; // Assume _BASE_URL_ is defined elsewhere in your codebase
      $.getJSON(`${baseUrl}users/resendmail?email=${mail}`, (response: any) => {
        cl(response);
      });
    });

    menuMobile.on('click', () => {
      menuMobileContainer.addClass('active');
    });

    closeMenuButton.on('click', () => {
      menuMobileContainer.removeClass('active');
    });

    cl('[header] initiated.');
  };

  return {
    init,
  };
})();

export default headerModule;
