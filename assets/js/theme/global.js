import './global/jquery-migrate';
import './common/select-option-plugin';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import privacyCookieNotification from './global/cookieNotification';
import maintenanceMode from './global/maintenanceMode';
import carousel from './common/carousel';
import loadingProgressBar from './global/loading-progress-bar';
import svgInjector from './global/svg-injector';
import quickAddSkus from './f/quick-add-sku';
import accountMenu from './f/account-menu';
import autoHighlight from './f/auto-highlight';
import cardAddToCart from './f/card-add-to-cart';
import hoverNavigation from './f/hover-navigation';
import recentSellers from './f/recent-sellers';

export default class Global extends PageManager {
    onReady() {
        cartPreview(this.context.secureBaseUrl, this.context.cartId, this.context.disableMinicart, this.context.enableSideCart);
        quickSearch();
        currencySelector();
        foundation($(document));
        quickView(this.context);
        carousel();
        mobileMenuToggle();
        privacyCookieNotification();
        maintenanceMode(this.context.maintenanceMode);
        loadingProgressBar();
        quickAddSkus();
        autoHighlight();
        cardAddToCart();
        svgInjector();
        accountMenu();
        if (!/Mobi/i.test(navigator.userAgent) && this.context.enableRecentSellers) {
            recentSellers(this.context.recentSellersTimer, this.context.recentSellersHideAfter, this.context);
        }

        if (!/Mobi/i.test(navigator.userAgent) && this.context.enableHoverNavigation) {
            hoverNavigation();
        } else {
            menu();
        }

        if (window.ApplePaySession) {
            $('.apple-pay-checkout-button').show();
        }

        /* BundleB2B */
        const $body = $('body');
        // const B3StorefrontURL = 'https://cdn.bundleb2b.net/b3-auto-loader.js';
        const B3StorefrontURL = 'https://cdn.bundleb2b.net/bundleb2b.3.2.0.js';
        $body.append(`<script src="${B3StorefrontURL}"></script>`);
        window.b3themeConfig = window.b3themeConfig || {};
        window.b3themeConfig.keepSuperAdminMasquerade = true;
        window.b3themeConfig.useContainers = {
            'dashboard.endMasquerade.container': '.header .header__inner',
            'cartActions.container': '.cart__container',
        };
        window.b3themeConfig.useJavaScript = {
            login: {
                callback(instance) {
                    $('.body').show();
                    $('main.page').css({
                        width: '100%',
                    });
                    const { B3RoleId } = instance.utils.B3Storage;
                    const roleId = B3RoleId.value;

                    const hideWishList = () => {
                        $('.navUser-action[href="/wishlist.php"]').parents('.navUser-item').remove();
                        $('[href^="/wishlist.php"]').remove();
                        $('.add-to-list__controls').remove();
                        $('head').append(`<style>
                            [href^="/wishlist.php"] {
                                display: none!important;
                            }
                        </style>`);
                    };

                    const renderMobileNavs = () => {
                        if (!instance.isMobile) return;
                        $('#navPages-account .navPage-subMenu-list .b3-navs').remove();

                        instance.renderB3Navs({
                            containerSelector: '#navPages-account .navPage-subMenu-list',
                            navItemClassName: 'navPage-subMenu-item b3-navs',
                        });

                        hideWishList();
                    };

                    const renderDropDownMenu = () => {
                        $('.b3-dropdown-menu').remove();
                        instance.renderB3Navs({
                            containerSelector: '#accountOptions',
                            navItemClassName: 'dropdown-menu-item b3-dropdown-menu',
                            insertType: 'afterbegin',
                        });

                        // is show invoice in dropdown menu
                        if (instance.canShowB2BNav && instance.haveIPPermission) {
                            const invoiceEl = `<li class="dropdown-menu-item b3-dropdown-menu ">
                                                <a class="" href="/invoices/">Invoices</a>
                                          </li>`;
                            $('#accountOptions li:first-child').before(invoiceEl);
                            $('.dropdown-menu .navBar-action').removeClass('navBar-action');
                        }

                        const isSaleRep = roleId === '3';
                        const { B3CompanyId, B3AddressBookIsEnabled } = instance.utils.B3Storage;
                        const companyId = B3CompanyId.value;
                        const addressBookEnabled = B3AddressBookIsEnabled.value;

                        // b2b address book
                        if (addressBookEnabled === '1') {
                            $('#accountOptions .dropdown-menu-item [href="/account.php?action=address_book"]').remove();
                        }

                        hideWishList();

                        // restyle the end masquerade box
                        const timer = isSaleRep && companyId && setInterval(() => {
                            const $innerBox = $('.header__inner .salerep-infobox');
                            if ($innerBox.length) {
                                clearInterval(timer);
                                $('.header__inner').after($innerBox);
                                if (instance.isMobile) {
                                    $('.header__inner').css({
                                        paddingBottom: 40,
                                    });
                                    $('head').append(`<style>
                                        .salerep-infobox {
                                            top: 150px !important;
                                        }
                                        .salerep-infobox.saler-extends:before {
                                            border-top: 10px solid #ebebeb!important;
                                            border-bottom: 10px solid #ebebeb!important;
                                        }
                                    </style>`);
                                }
                                $innerBox.show();
                            }
                        });
                    };

                    const bindMasqueradAction = () => {
                        ((selectors) => {
                            selectors.forEach(selector => {
                                $('body').on('click', selector, async () => {
                                    await instance.getIsShowAddressBook();
                                    renderDropDownMenu();
                                    const { B3CompanyId } = instance.utils.B3Storage;
                                    const prevCompanyId = B3CompanyId.value;
                                    const timer = setInterval(() => {
                                        const { B3CompanyId } = instance.utils.B3Storage;
                                        const currCompanyId = B3CompanyId.value;
                                        if (prevCompanyId !== currCompanyId) {
                                            clearInterval(timer);
                                            renderDropDownMenu();
                                            renderMobileNavs();
                                        }
                                    });
                                });
                            });
                        })(['[action-begin-masquerade]', '[end-masquerade]']);
                    };

                    const hideJuniorSaw = () => {
                        const isJunior = roleId === '2';
                        if (isJunior) {
                            // cart add to cart
                            $('.card-section--buttons.card-section--quantity, .card-section--buttons ').remove();
                            // header quick add sku to cart
                            $('.sku-add.sku-add--sku').remove();
                            // side cart
                            $('#side-cart-container').remove();
                            $('.side-cart-enabled').removeClass('side-cart-enabled');
                        }
                    };

                    if (roleId) {
                        renderDropDownMenu();
                        bindMasqueradAction();
                        hideJuniorSaw();
                        renderMobileNavs();
                    }
                },
            },
        };
        /* BundleB2B */
    }
}
