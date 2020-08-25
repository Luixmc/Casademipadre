var Style = (function () {

    var isMozilla = (navigator.userAgent.toLowerCase().indexOf('firefox') != -1);

    //---------------------- Device detection ----------------------//


    function isTouchDevice() {
        return !!('ontouchstart' in window); // works on most browsers
        // || !!('onmsgesturechange' in window); // works on ie10
    }


    /*---------- InyecciÃ³n de clase para dispositivos tÃ¡ctiles ---------*/


    var touchDevice = function () {
        var is_touch_device = 'ontouchstart' in document.documentElement;
        if (is_touch_device) {
            $('body').addClass('touchDevice');
        } else {
            $('body').addClass('noTouchDevice');
        }
    };


    /*--------------------------- Slider ----------------------------*/


    function startSlider() {

        var currentSlide;
        $('.module-slider').each(function (i, e) {
            slidesTotal = $(this).find('.slider-slide').length;
            currentSlide = $(this);
            $(this).data('slidesTotal', slidesTotal);
            var index = 1;
            for (index = 1; index <= slidesTotal; index++) {
                $(this).find('ul.slider-pagination').append('<li><a href="#"><span>' + index + '</span></a></li>');
                $(this).find('ul.textholder-carousel').append('<li>' + $(this).find('.slide-content:eq(' + (index - 1) + ')').html() + '</li>');
            }
            if (slidesTotal > 1) {
                $(this).find('ul.slider-pagination').show();

                //next and prev buttons
                $(this).find("a.module-slider-button").show();

                $(this).find("a.module-slider-next").on("click", function (e) {
                    currentSlide = $(this).closest(".module-slider");
                    e.preventDefault();
                    clearInterval(slidesTimer);
                    slideNext(false);
                });
                $(this).find("a.module-slider-prev").on("click", function (e) {
                    currentSlide = $(this).closest(".module-slider");
                    e.preventDefault();
                    clearInterval(slidesTimer);
                    slidePrev(false);
                });
            }
        });

        $('ul.slider-pagination').each(function (i, a) {
            $(a).find('li').each(function (index, b) {
                if (index === 0) {
                    $('.slider-slide:eq(' + index + ')').css({
                        'z-index': 20,
                        '-webkit-transition': 'opacity 0.5s',
                        '-moz-transition': 'opacity 0.5s',
                        '-ms-transition': 'opacity 0.5s',
                        '-o-transition': 'opacity 0.5s',
                        'opacity': '1'
                    });
                }
                $(b).find('a').click(function (ev, generated) {
                    ev.preventDefault();
                    generated = typeof generated !== 'undefined' ? generated : false; // Normal click: generated = undefined -> false
                    $slider = $(this).closest('.module-slider');
                    // Pagination
                    $(this)
                        .closest('li')
                        .addClass('active')
                        .siblings('li')
                        .removeClass("active")
                        .end()
                        .end();

                    //Hardware acelerated transitions for mobile devices
                    if ($('body').hasClass('max860')) {
                        $slider
                            .find('.slider-slide')
                            .css({
                                'z-index': 10,
                                '-webkit-transition': 'opacity 0.5s',
                                '-moz-transition': 'opacity 0.5s',
                                '-ms-transition': 'opacity 0.5s',
                                '-o-transition': 'opacity 0.5s',
                                'opacity': '0'
                            });
                        $slider
                            .find('.slider-slide:eq(' + index + ')')
                            .css({
                                'z-index': 20,
                                '-webkit-transition': 'opacity 0.5s',
                                '-moz-transition': 'opacity 0.5s',
                                '-ms-transition': 'opacity 0.5s',
                                '-o-transition': 'opacity 0.5s',
                                'opacity': '1'
                            });
                        // Smartphone text
                        $slider
                            .find('.textholder-carousel li')
                            .css({
                                'z-index': 10,
                                "opacity": 0,
                                "display": "none"
                            })
                            .children().fadeOut(500)
                            .parent()
                            .parent()
                            .children('.textholder-carousel li:eq(' + index + ')')
                            .css({
                                'z-index': 20,
                                "opacity": 1,
                                "display": "block"
                            })
                            .children()
                            .fadeIn(500);
                    } else {
                        //JS transitions for desktop
                        $slider
                            .find('.slider-slide').stop()
                            .css({
                                '-webkit-transition': 'none',
                                '-moz-transition': 'none',
                                '-ms-transition': 'none',
                                '-o-transition': 'none',
                            })
                            .animate({
                                'z-index': 10,
                                'opacity': '0'
                            });
                        $slider
                            .find('.slider-slide:eq(' + index + ')').stop()
                            .css({
                                '-webkit-transition': 'none',
                                '-moz-transition': 'none',
                                '-ms-transition': 'none',
                                '-o-transition': 'none',
                            })
                            .animate({
                                'z-index': 20,
                                'opacity': '1'
                            });
                        // Smartphone text
                        $slider
                            .find('.textholder-carousel li')
                            .css({
                                'z-index': 10,
                                "opacity": 0,
                                "display": "none"
                            })
                            .children().fadeOut(500)
                            .parent()
                            .parent()
                            .children('.textholder-carousel li:eq(' + index + ')')
                            .css({
                                'z-index': 20,
                                "opacity": 1,
                                "display": "block"
                            })
                            .children()
                            .fadeIn(500);

                    }

                });
            });
            $(a).find('li:first-child a').click();
            $(a).closest('.module-slider').data('slidesIndex', 0);
        });

        $('.module-slider').swipe({
            swipe: function (event, direction, distance, duration, fingerCount) {
                slidesTotal = $(this).find('.slider-slide').length;
                currentSlide = $(this);
                if (slidesTotal > 1) {
                    switch (direction) {
                        case 'left':
                            slideNext(false); // generated=false -> manual
                            break;
                        case 'right':
                            slidePrev(false); // generated=false -> manual
                            break;
                        default:
                            break;
                    }
                }
            },
            allowPageScroll: 'vertical'
        });

        $('.module-slider').on({ // Stop slider on rollover and resume on rollout

            mouseenter: function () {
                clearInterval(slidesTimer);
            },
            mouseleave: function () {
                slidesTimer = setInterval(function () {
                    automaticSlideNext(true)
                }, 6000);
            }

        });

        function slidePrev(generated) {
            generated = typeof generated !== 'undefined' ? generated : false;

            if (currentSlide == null) {
                currentSlide = $(".module-slider");
            }

            var slidesIndex = currentSlide.data('slidesIndex');
            var slidesTotal = currentSlide.data('slidesTotal');
            slidesIndex--;
            if (slidesIndex < 0) {
                slidesIndex = slidesTotal - 1;
            }
            currentSlide.data('slidesIndex', slidesIndex)
            currentSlide.find("ul.slider-pagination li:eq(" + slidesIndex + ") a").trigger('click', [generated]);
        };

        function slideNext(generated) {
            generated = typeof generated !== 'undefined' ? generated : false;

            if (currentSlide == null) {
                currentSlide = $(".module-slider");
            }

            var slidesIndex = currentSlide.data('slidesIndex');
            var slidesTotal = currentSlide.data('slidesTotal');
            slidesIndex++;
            if (slidesIndex == slidesTotal) {
                slidesIndex = 0;
            }
            currentSlide.data('slidesIndex', slidesIndex)
            currentSlide.find("ul.slider-pagination li:eq(" + slidesIndex + ") a").trigger('click', [generated]);
        };

        function automaticSlideNext(generated) {
            generated = typeof generated !== 'undefined' ? generated : false;

            $('.module-slider').each(function (i, e) {
                if ($(this).data('autoplay') == true) {
                    var slidesIndex = $(this).data('slidesIndex');
                    var slidesTotal = $(this).data('slidesTotal');
                    slidesIndex++;
                    if (slidesIndex == slidesTotal) {
                        slidesIndex = 0;
                    }
                    $(this).data('slidesIndex', slidesIndex)
                    $(this).find("ul.slider-pagination li:eq(" + slidesIndex + ") a").trigger('click', [generated]);
                }

            });
        };

        var launchAutomatic = false;
        var slidesTimer = false;

        $('.module-slider').each(function (i, e) {
            if ((currentSlide.data('slidesTotal') > 1) && (window.innerWidth > 640)) {
                launchAutomatic = true;
                slidesTimer = setInterval(function () {
                    automaticSlideNext(true);
                }, 6000);
                return false;
            }
        });

        //height ie8 fix
        if (!$('body').hasClass('max1280')) {
            $('#ie8 .slider-top .slider-visor').first().css('padding-top', '');
        }
    }

    var resizeSliderEvent = function () {
        if (!$('body').hasClass('max860')) {
            $('.slider-slide')
                .css({
                    '-webkit-transition': 'none',
                    '-moz-transition': 'none',
                    '-ms-transition': 'none',
                    '-o-transition': 'none',
                    'opacity': 1
                });
        }
        if (!$('body').hasClass('max1280')) {
            $('#ie8 .slider-top .slider-visor').css('padding-top', '');
        }

    }

    /*
     * absoluteOnTableCell - Plugin para jQuery que hace funcionar las positiones absolutas
     * dentro de un contenedor con display: table-cell;
     * @params {Object}
     *      beforeCreateDiv($(this): Callback que se ejecuta antes de crear el div de apoyo
     *      afterCreateDiv($(this): Callback que se ejecuta despuÃ©s de crear el div de apoyo
     */

    $.fn.absoluteOnTableCell = function (params) {
        var $el;
        return this.each(function () {
            $el = $(this);

            if (params.beforeCreateDiv)
                params.beforeCreateDiv($el);

            var newDiv = $("<div />", {
                "class": "innerWrapper",
                "css": {
                    "height": $el.height(),
                    "width": "100%",
                    "position": "relative"
                }
            });
            $el.wrapInner(newDiv);

            if (params.afterCreateDiv)
                params.afterCreateDiv($el);

        });
    };

    var mediaQuery = function () {
        $('body').removeClass('min1281 max1280 min1024 max1023 max768 min768 max860 min861 isMobile min480 max479');
        var ww = window.innerWidth;
        if (ww > 1281) {
            $('body').addClass('min1281');
        } else {
            $('body').addClass('max1280');
        }
        if (ww > 1023) {
            $('body').addClass('min1024');
        } else {
            $('body').addClass('max1023');
        }
        if (ww <= 768) {
            $('body').addClass('max768');
        } else {
            $('body').addClass('min768');
        }
        if (ww <= 860) {
            $('body').addClass('max860');
        } else {
            $('body').addClass('min861');
        }
        if (ww <= 640) {
            $("body").addClass("isMobile");
        }
        if (ww > 479) {
            $('body').addClass('min480');
        } else {
            $('body').addClass('max479');
        }
    };

    var fixNavigation = function () {
        //Sacamos los elementos que tienen la clase has-submenu del menu principal para hacer el dropdown.
        var menuWithSubmenus = $("ul.primary-menu .has-submenu");
        var showMenuButton = $(".show-menu");

        if ($('body').hasClass('min861')) {
            //$("body").css("background", "red");
            menuWithSubmenus.unbind().on("click", function (e) {
                e.preventDefault();
                var $el = $(this);
                var submenu = $("#" + $el.data("submenu"));
                var submenuContent = submenu.find(".container");
                if (submenu.is(":visible")) {
                    $el.find(".icon-up-open").removeClass("icon-up-open").addClass("icon-down-open");
                    submenuContent.animate({
                        "opacity": 0
                    }, 200);
                    submenu.stop(true, true).slideUp(300, function () {
                        submenuContent.css("opacity", "");
                    });
                    $el.parent().removeClass("open");
                } else {
                    $('.dropdown-submenu').stop(true, true).slideUp(300);
                    $('.primary-menu > li').removeClass("open");
                    $el.find(".icon-down-open").removeClass("icon-down-open").addClass("icon-up-open");
                    submenuContent.css("opacity", 0);
                    submenuContent.animate({
                        "opacity": 1
                    }, 800, function () {
                        submenuContent.css("opacity", "");
                    });
                    submenu.stop(true, true).slideDown(300);
                    $el.parent().addClass("open");
                }
            });
        } else {
            menuWithSubmenus.off("click");
            showMenuButton.unbind().on("click", function (e) {

                if ($(".header-dropdown").is(":visible")) {
                    $(".header-dropdown").slideUp(300);
                    $(".header-dropdown .conainer").animate({
                        "opacity": 0
                    }, 200);
                    $('.dropdown-header').removeClass('open');
                    $('.dropdown-header').find('i').removeClass('icon-up-open').addClass('icon-down-open');
                }

                if ($(".header-dropdown-other-webs").is(":visible")) {
                    $(".header-dropdown-other-webs").slideUp(300);
                    $(".header-dropdown-other-webs .conainer").animate({
                        "opacity": 0
                    }, 200);
                    $('.open-layer').removeClass('open');
                    $('.open-layer').find('i').removeClass('icon-up-open').addClass('icon-down-open');
                }

                if ($(".external-links-mobile").is(":visible")) {
                    $(".external-links-mobile").slideUp(300);
                    $('.groupLinks').removeClass('open');
                    $('.groupLinks').find('i').removeClass('icon-up-open').addClass('icon-down-open');
                }
                e.preventDefault();
                var $el = $(this);
                var menu = $("ul.primary-menu");
                var menuElements = menu.find("li");
                if (!menu.is(":visible")) {
                    $el.find(".icon-menu").removeClass("icon-menu").addClass("icon-close");
                    menuElements.css("opacity", "0");
                    menu.slideDown(300, function () {
                        menu.addClass("open");
                        menu.css("display", "");
                    });
                    menuElements.animate({
                        "opacity": 1
                    }, 400);
                } else {
                    $el.find(".icon-close").removeClass("icon-close").addClass("icon-menu");
                    menuElements.animate({
                        "opacity": 0
                    }, 300);
                    menu.slideUp(400, function () {
                        menu.removeClass("open");
                        menu.css("display", "");
                        menuElements.css("opacity", "");
                    });
                }
            });

            var touchMenu = $("nav.touch-menu-container ul.touch-menu");
            touchMenu.find(".parent-menu-element").unbind().on("click", function (e) {
                if ($(".header-dropdown").is(":visible")) {
                    $(".header-dropdown").slideUp(300);
                    $(".header-dropdown .conainer").animate({
                        "opacity": 0
                    }, 200);
                }
                e.preventDefault();
                var $el = $(this);
                var subMenu = $el.parent().find("ul");
                var menuIcon = $el.find(".menu-icon-container i");
                var menuElements = subMenu.find("li");
                if (subMenu.is(":visible")) {
                    menuElements.animate({
                        "opacity": 0
                    }, 300);
                    subMenu.slideUp(400);
                    menuIcon.removeClass("icon-close").addClass("icon-menu");

                } else {
                    menuElements.animate({
                        "opacity": 1
                    }, 400);
                    subMenu.slideDown(300);
                    menuIcon.removeClass("icon-menu").addClass("icon-close");
                }

            });
        }
        if ($('body').hasClass('isMobile')) {
            $('.groupLinks').unbind('click').bind('click', function (e) {
                e.preventDefault();

                var elem = $(this);

                if (!elem.hasClass('open')) {
                    elem.addClass('open');
                    elem.find('i').removeClass('icon-down-open').addClass('icon-up-open');
                    $('.external-links-mobile').stop().slideDown(300);
                    setTimeout(function () {
                        $('.external-links-mobile').find('> a').stop().animate({
                            "opacity": 1
                        }, 200);
                    }, 180);
                    if ($(".header-dropdown").is(":visible")) {
                        $(".header-dropdown").slideUp(300);
                        $('.dropdown-header').removeClass('open');
                        $('.dropdown-header').find('i').removeClass('icon-up-open').addClass('icon-down-open');
                    }
                    if ($(".primary-menu").is(":visible")) {
                        $(".primary-menu").slideUp(400, function () {
                            $(".primary-menu").removeClass("open");
                            $(".primary-menu").css("display", "");
                            $(".primary-menu li").css("opacity", "");
                            $(".primary-menu").unbind();
                        });
                    }
                } else {
                    elem.removeClass('open');
                    elem.find('i').removeClass('icon-up-open').addClass('icon-down-open');
                    $('.external-links-mobile').slideUp(300);
                    $('.external-links-mobile').find('> a').stop().animate({
                        "opacity": 0
                    }, 200);
                }
            })
        } else {
            $('.external-links-mobile').css({
                'display': 'none'
            });
            $('.groupLinks').removeClass('open');
        }
    };

    var cookiesClose = function () {
        /*
         * Acciones a realizar cuando se pulsa en botÃ³n de cerrar aviso de Cookies.
         * */
        var cookiesContainer = $(".cookies-advice");
        var closeButton = cookiesContainer.find(".close-container");
        closeButton.unbind().on("click", function () {
            cookiesContainer.find(".container").fadeOut(300);
            cookiesContainer.slideUp(400, function () {
                cookiesContainer.remove();
            });
        });
    };

    var searchActions = function () {
        /*
         * Acciones a relizar cuando se pulsa en el botÃ³n de bÃºsqueda en el escritorio.
         * Antes de bindear los eventos se hace unbind ya que a estas funciones se llama
         * en los resizes.
         * */
        var searchContainer = $(".header-search-container");
        var searchButton = $(".secondary-menu .option-search a");

        var closeSearch = function () {
            searchContainer.find(".container").fadeOut(300);
            searchContainer.slideUp(400, function () {
                searchContainer.find(".container").css({
                    "opacity": "",
                    "display": ""
                });
            });
            searchButton.parent().removeClass("selected");
        };

        searchButton.unbind().on("click", function () {
            if (searchContainer.is(":visible")) {
                closeSearch();
            } else {
                searchContainer.find(".container").css("opacity", "0");
                searchContainer.find(".container").animate({
                    "opacity": 1
                }, 400);
                searchContainer.slideDown(300, function () {
                    searchContainer.find("input.text").focus().trigger("click");
                });
                searchButton.parent().addClass("selected");
            }
        });
        searchContainer.find(".close-header-search-container").unbind().on("click", function (e) {
            e.preventDefault();
            closeSearch();
        });
    };

    var fixIE = function () {
        //Fix necesario para que la libreria de iconos funcione correctamente en IE
        if ($("html").is("#ie8")) {
            var head = document.getElementsByTagName('head')[0],
                style = document.createElement('style');
            style.type = 'text/css';
            style.styleSheet.cssText = ':before,:after{content:none !important';
            head.appendChild(style);
            setTimeout(function () {
                head.removeChild(style);
            }, 0);
        }
        // AÃ±adir checked a los input en ie8
        $('input[type="radio"], input[type="checkbox"]').each(function () {
            var elem = $(this);

            elem.on('change', function () {

                if (elem.is(':checked')) {
                    $('input[type="radio"]').each(function () {
                        var otherElem = $(this);

                        if (otherElem.not(elem).attr('name') === elem.attr('name')) {
                            otherElem.removeClass('checked');
                        }
                    });

                    elem.addClass('checked');
                    elem.blur();
                    elem.focus();
                } else {
                    elem.removeClass('checked');
                }
            });
        });
    };

    var dropdownHeader = function () {
        /*
         * Capturar el evento del dropdown de la cabecera para la capa de las redes sociales.
         * */
        $("header a.dropdown-header").click(function () {
            var $el = $(this);
            var target = $("#" + $el.data("target"));
            var targetContainer = target.find(".container");

            if ($(".primary-menu").is(":visible")) {
                $(".primary-menu").slideUp(400, function () {
                    $(".primary-menu").removeClass("open");
                    $(".primary-menu").css("display", "");
                    $(".primary-menu li").css("opacity", "");
                    $(".primary-menu").unbind();
                    $(".show-menu i").removeClass('icon-close');
                    $(".show-menu i").addClass('icon-menu');
                });
            }

            if ($(".external-links-mobile").is(":visible")) {
                $(".external-links-mobile").slideUp(300);
                $('.groupLinks').removeClass('open');
                $('.groupLinks').find('i').removeClass('icon-up-open').addClass('icon-down-open');
            }

            $el.removeClass("open");
            if (!target.is(":visible")) {

                if ($('.header-dropdown-other-webs').length) {
                    if ($('.header-dropdown-other-webs').hasClass('open')) {
                        $('.header-dropdown-other-webs').removeClass('open').slideUp(300, function () {
                            $('.open-layer').removeClass('open')
                            $('.open-layer').find(".icon-up-open").removeClass("icon-up-open").addClass("icon-down-open");
                            targetContainer.css("opacity", "0");
                            targetContainer.animate({
                                "opacity": 1
                            }, 500, function () {
                                targetContainer.css("opacity", 1);
                            });
                            target.slideDown(300, function () {
                                target.addClass("open");
                                target.css("display", "");
                            });
                            $el.addClass("open");
                            $el.find(".icon-down-open").removeClass("icon-down-open").addClass("icon-up-open");
                        })
                    } else {
                        targetContainer.css("opacity", "0");
                        targetContainer.animate({
                            "opacity": 1
                        }, 500, function () {
                            targetContainer.css("opacity", 1);
                        });
                        target.slideDown(300, function () {
                            target.addClass("open");
                            target.css("display", "");
                        });
                        $el.addClass("open");
                        $el.find(".icon-down-open").removeClass("icon-down-open").addClass("icon-up-open");
                    }

                } else {
                    targetContainer.css("opacity", "0");
                    targetContainer.animate({
                        "opacity": 1
                    }, 500, function () {
                        targetContainer.css("opacity", 1);
                    });
                    target.slideDown(300, function () {
                        target.addClass("open");
                        target.css("display", "");
                    });
                    $el.addClass("open");
                    $el.find(".icon-down-open").removeClass("icon-down-open").addClass("icon-up-open");
                }
            } else {
                targetContainer.animate({
                    "opacity": 0
                }, 200);
                target.slideUp(300);
                $el.find(".icon-up-open").removeClass("icon-up-open").addClass("icon-down-open");
            }
        });
    };

    var populateOnResponsive = function () {
        $("[data-populate]").each(function () {
            var $el = $(this);
            var populateContent = $("#" + $el.data("populate"));
            $el.html(populateContent.html());
        });
    };

    var gotoTop = function () {
        $(".go-top").click(function (e) {
            e.preventDefault();
            $("html, body").animate({
                scrollTop: "0"
            });
        });
    };

    var datePickerUI = function () {
        var datePicker = $(".do-datepicker");

        datePicker.each(function () {
            var $el = $(this);
            if ($el.hasClass("infobolsa")) {

            } else {
            $el.datepicker();
            }

            $el.closest(".form-block").find(".date-button").on("click", function () {
                console.warn(datePicker);
                $el.click().focus();
            });
        });
        if (!datePicker.hasClass("infobolsa")) {
            $(function ($) {
                $.datepicker.regional.es = {
                    closeText: 'Cerrar',
                    prevText: '',
                    nextText: '',
                    currentText: 'Hoy',
                    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    dayNames: ['Domingo', 'Lunes', 'Martes', 'MiÃ©rcoles', 'Jueves', 'Viernes', 'SÃ¡bado'],
                    dayNamesShort: ['Dom', 'Lun', 'Mar', 'MiÃ©', 'Juv', 'Vie', 'SÃ¡b'],
                    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
                    weekHeader: 'Sm',
                    dateFormat: 'dd/mm/yy',
                    firstDay: 1,
                    isRTL: false,
                    showMonthAfterYear: false,
                    yearSuffix: ''
                };
                $.datepicker.setDefaults($.datepicker.regional.es);
            });
        }
    };

    var startFancybox = function () {
        $(".fancybox").fancybox({
            'padding': 0,
            'scrolling': 'no',
            helpers: {
                overlay: {
                    locked: true
                }
            }
        });

        $(".fancybox-inline").fancybox({
            'padding': 0,
            'scrolling': 'yes',
            'title': null,
            wrapCSS: 'fancybox-inline',
            helpers: {
                overlay: {
                    locked: true
                }
            },
            afterShow: function () {
                $('body').addClass('locked');
            },
            beforeClose: function () {
                $('body').removeClass('locked');
            }
        });

        $(".googleMaps-inline").fancybox({
            'padding': 0,
            'scrolling': 'no',
            'title': null,
            wrapCSS: 'fancybox-inline',
            helpers: {
                overlay: {
                    locked: true
                }
            },
            afterShow: function () {
                $('body').addClass('locked');
                google.maps.event.trigger(map, 'resize');
                map.setCenter(spain);
                map.setZoom(5);
            },
            beforeClose: function () {
                $('body').removeClass('locked');
                $('#map-canvas').prependTo('.module-installationsMap').css('display', '');
            }
        });

        $(".fancybox-zoom").fancybox({
            'padding': 0,
            'scrolling': 'no',
            wrapCSS: 'fancybox-zoom',
            afterLoad: fancyZoom,
            helpers: {
                overlay: {
                    locked: true
                }
            }
        });

        $(".fancybox-iframe").fancybox({
            maxWidth: 800,
            maxHeight: 600,
            fitToView: false,
            width: '100%',
            height: '100%',
            autoSize: false,
            closeClick: false,
            'type': 'iframe',
            'iframe': { 'scrolling': 'no' }
        });

        $(".fancybox-scrollingiframe").fancybox({
            maxWidth: 800,
            maxHeight: 600,
            fitToView: false,
            width: '100%',
            height: '100%',
            autoSize: false,
            closeClick: false,
            'type': 'iframe',
            'iframe': { 'scrolling': 'yes' }
        });

        $(".fancybox-video").fancybox({
            'padding': 7,
            'overlayOpacity': 0.7,
            'autoDimensions': false,
            'width': 640,
            'height': 480,
            'type': 'ajax',
            afterShow: function () {
                fancyKewegoVideosFix();
                bussinessLinesActivity()
            },
            helpers: {
                overlay: {
                    locked: true
                }
            }
        });

        $(".fancybox-form2").fancybox({
            padding: 0,
            overlayOpacity: 0.7,
            autoDimensions: true,
           /* width: 632,
            height: 700,*/
            fitToView: true,
            autoSize: true,
            scrolling: 'no',
            type: 'iframe',
            helpers: {
                overlay: {
                    locked: true
                }
            }
        });


    };

    var fancyZoom = function () {
        $('.fancybox-zoom .fancybox-outer').on('click', function () {
            var objectZoomed = $(this);
            if (!objectZoomed.hasClass('onPan')) {
                if (objectZoomed.hasClass('maxZoom')) {
                    $(this).removeClass('maxZoom');
                    $('.fancybox-zoom .fancybox-outer').panzoom('zoom', 1);
                } else {
                    $(this).addClass('maxZoom');
                    $('.fancybox-zoom .fancybox-outer').panzoom('zoom', 3);
                }
            }
        });
        $('.fancybox-zoom .fancybox-outer').panzoom({
            increment: 0.4,
            duration: 500,
            disablePan: false,
            minScale: 1,
            maxScale: 3,
            contain: 'invert',
            cursor: '',
            onPan: function () {
                $('.fancybox-zoom .fancybox-outer').addClass('onPan');
            },
            onEnd: function () {
                setTimeout(function () {
                    $('.fancybox-zoom .fancybox-outer').removeClass('onPan');
                }, 100);
            }
        });
    };

    var owlChallenges = $("#owl-challenges");

    var startOwlCarousel = function () {
        var owl = $("#owl-demo");
        var owlSocial = $("#owl-social");
        var owlDate = $("#owl-date");
        var owlLogos = $("#owl-logos");
        var owlInmobiliaria = $('#owl-inmobiliaria');
        var owlc2t = $("#owl-c2t");

        var totalItemsDesktop;
        var totalItemsTablet;

        if ($('#owl-demo .item').length <= 9) {
            totalItemsDesktop = $('#owl-demo .item').length;
        } else {
            totalItemsDesktop = 9;
        }
        if ($('#owl-demo .item').length <= 7) {
            totalItemsTablet = $('#owl-demo .item').length;
        } else {
            totalItemsTablet = 7;
        }

        owl.owlCarousel({
            items: totalItemsDesktop, //10 items above 1000px browser width
            itemsCustom: false,
            itemsDesktop: [860, totalItemsTablet], //7 items between 1000px and 901px
            itemsDesktopSmall: false, // betweem 900px and 601px
            itemsTablet: [700, 5], //5 items between 600 and 0
            itemsMobile: [640, 3], // itemsMobile 641px and below
            singleItem: false,
            itemsScaleUp: false,

            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: false,
            paginationNumbers: false,

            // Responsive
            responsive: true,
            responsiveRefreshRate: 100,
            responsiveBaseWidth: window,
        });

        owlSocial.owlCarousel({
            items: 2,
            itemsCustom: false,
            itemsDesktop: [1000, 2],
            itemsDesktopSmall: false,
            itemsTablet: [800, 2],
            itemsMobile: [640, 1],
            singleItem: false,
            itemsScaleUp: false,
            autoPlay: 4000,

            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: true,
            paginationNumbers: false,

            // Responsive
            responsive: true,
            responsiveRefreshRate: 100,
            responsiveBaseWidth: window,

            scrollPerPage: true
        });

        owlc2t.owlCarousel({
            items: 1,
            itemsCustom: false,
            itemsDesktop: [1000, 1],
            itemsDesktopSmall: false,
            itemsTablet: [800, 2],
            itemsMobile: [640, 1],
            singleItem: false,
            itemsScaleUp: false,
            autoPlay: 4000,

            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: true,
            paginationNumbers: false,

            // Responsive
            responsive: true,
            responsiveRefreshRate: 100,
            responsiveBaseWidth: window,

            scrollPerPage: true
        });


        owlDate.owlCarousel({
            items: 2,
            itemsCustom: false,
            itemsDesktop: [1000, 2],
            itemsDesktopSmall: false,
            itemsTablet: [800, 2],
            itemsMobile: [640, 1],
            singleItem: false,

            itemsScaleUp: false,

            singleItem: true,

            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: false,
            paginationNumbers: false,

            scrollPerPage: true,
            rewindNav: true
        });
        owlLogos.owlCarousel({
            items: 5,
            itemsCustom: [
                [0, 1],
                [408, 2],
                [490, 3],
                [640, 4],
                [708, 5]
            ],
            singleItem: false,
            autoPlay: 4000,

            itemsScaleUp: false,

            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: false,
            paginationNumbers: false,

            scrollPerPage: true,
            rewindNav: true,

            // Responsive
            responsive: true,
            responsiveRefreshRate: 100,
            responsiveBaseWidth: window
        });
        owlChallenges.owlCarousel({
            items: 1,
            singleItem: true,
            autoPlay: false,
            autoHeight: true,

            itemsScaleUp: false,

            //Basic Speeds
            slideSpeed: 200,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: true,
            paginationNumbers: false,

            scrollPerPage: true,
            rewindNav: true,

            // Responsive
            responsive: true,
            responsiveRefreshRate: 100,
            responsiveBaseWidth: window
        });

        owlInmobiliaria.owlCarousel({
            items: 1,
            singleItem: true,
            autoPlay: false,
            autoHeight: true,

            itemsScaleUp: false,

            //Basic Speeds
            slideSpeed: 800,
            paginationSpeed: 800,
            rewindSpeed: 1000,

            //pagination
            pagination: true,
            paginationNumbers: false,

            scrollPerPage: true,
            rewindNav: true,

            // Responsive
            responsive: true,
            responsiveRefreshRate: 100,
            responsiveBaseWidth: window
        });

        // Custom Navigation Events
        $(".owl-next").click(function (e) {
            e.preventDefault();
            owl.trigger('owl.next');
        })
        $(".owl-prev").click(function (e) {
            e.preventDefault();
            owl.trigger('owl.prev');
        })
        $(".date-selector-next").click(function (e) {
            e.preventDefault();
            owlDate.trigger('owl.next');
        })
        $(".date-selector-prev").click(function (e) {
            e.preventDefault();
            owlDate.trigger('owl.prev');
        })
        $(".logo-carousel-next").click(function (e) {
            e.preventDefault();
            owlLogos.trigger('owl.next');
        })
        $(".logo-carousel-prev").click(function (e) {
            e.preventDefault();
            owlLogos.trigger('owl.prev');
        })
        $(".challenges-carousel-next").click(function (e) {
            e.preventDefault();
            owlChallenges.trigger('owl.next');
        })
        $(".challenges-carousel-prev").click(function (e) {
            e.preventDefault();
            owlChallenges.trigger('owl.prev');
        })
        $(".module-slider-inmobiliaria-prev").click(function (e) {
            e.preventDefault();
            owlInmobiliaria.trigger('owl.prev');
        })
        $(".module-slider-inmobiliaria-next").click(function (e) {
            e.preventDefault();
            owlInmobiliaria.trigger('owl.next');
        })
    }

    var bussinessLinesActivity = function () {
        /* ????
        $(document).on('click', function (e) {
        	//e.stopPropagation();
        	var container = $('.bl-activities');
        	if (container.has(e.target).length === 0) {
        		$(".bl-activity-content .bl-activity-content-inner").animate({"opacity": 0}, 300);
        		$(".bl-activity-content").slideUp(400, function(){
        			$(".bl-activity").removeClass("semi-hidden selected");
        		});
        		$("section.bl-activities .table-content").animate({"margin-bottom": 0}, 400);
        	}
        });
        */

        var bl_activities_close = $(".bl-activity-content-close");
        var bl_activities = $("section.bl-activities");


        //BOF - BOTON CLOSE
        bl_activities_close.unbind().on("click", function (e) {
            e.preventDefault();
            bl_activities.find(".bl-activity-content:visible").slideUp(300, function () {
                $(".bl-activity").removeClass("semi-hidden selected");
            }).closest(".table-content").animate({
                "margin-bottom": 0
            }, 300);
        });
        //EOF - BOTON CLOSE

        bl_activities.find(".bl-activity-link").unbind().on("click", function (e) {
            var $el = $(this);
            e.preventDefault();

            /*setTimeout(function(){
				$("html, body").animate({
	                scrollTop: $el.offset().top
	            });
			}, 300);*/

            var actSelected = $el.closest(".bl-activity");
            var actSelectedContent = actSelected.find(".bl-activity-content");

            if (!$("body").hasClass("max768")) {
                bl_activities.find(".bl-activity-content:visible").slideUp(300).closest(".table-content").animate({
                    "margin-bottom": 0
                }, 300);
                bl_activities.find(".bl-activity-content:visible").slideUp(300).closest(".bl-activity").animate({
                    "margin-bottom": 0
                }, 300);
            }

            if (!actSelectedContent.is(":visible")) {
                actSelectedContent.find(".bl-activity-content-inner").css("opacity", 0);
                actSelectedContent.find(".bl-activity-content-inner").animate({
                    "opacity": 1
                }, 600);
                if (!$("body").hasClass("max1023")) {
                    actSelectedContent.closest(".table-content").animate({
                        "margin-bottom": actSelectedContent.outerHeight()
                    }, 300);
                } else {
                    actSelectedContent.closest(".bl-activity").animate({
                        "margin-bottom": actSelectedContent.outerHeight()
                    }, 300);
                }
                actSelectedContent.stop().slideDown(300);
            }

            if (!$("body").hasClass("max768")) {
                if (actSelected.hasClass("selected")) {
                    bl_activities.find(".bl-activity").removeClass("selected semi-hidden");
                } else {
                    bl_activities.find(".bl-activity").removeClass("selected").addClass("semi-hidden");
                    actSelected.addClass("selected");
                }
            } else {
                if (actSelected.hasClass("selected")) {
                    $el.closest(".bl-activity").removeClass("selected semi-hidden");
                    $el.next(".bl-activity-content:visible").slideUp(300).closest(".bl-activity").animate({
                        "margin-bottom": 0
                    }, 300);
                } else {
                    $el.closest(".bl-activity").removeClass("selected").addClass("semi-hidden");
                    actSelected.addClass("selected");
                }
            }
        });
    };


    var fixAbsoluteLayerInTable = function () {
        // Aplica el fix "absoluteOnTableCell"
        var columnsAffected = $(".table-content .column");
        columnsAffected.each(function () {
            var $el = $(this);
            var $elPadding;

            if ($el.children(".innerWrapper").length <= 0) {
                if ($el.css("display") == "table-cell" && ($el.has(".button-ins").length || $el.has(".number-stat-velo").length)) {
                    $el.absoluteOnTableCell({
                        "beforeCreateDiv": function ($el) {
                            $elPadding = $el.css("padding-bottom");
                            if ($elPadding != null)
                                $el.css("padding-bottom", 0);
                        }
                    });
                }
                $(".innerWrapper").css("padding-bottom", $elPadding);
            } else {
                var currentHeight = $el.find(".module-graphic").height() + ($el.find(".pdd").height() + 100) + $el.find(".button-ins").height();
                var nextHeight = $el.next('.column').find(".module-graphic").height() + ($el.next('.column').find(".pdd").height() + 100) + $el.next('.column').find(".button-ins").height();
                var prevHeight = $el.prev('.column').find(".module-graphic").height() + ($el.prev('.column').find(".pdd").height() + 100) + $el.prev('.column').find(".button-ins").height();
                var containerHeight = $el.closest(".row").height();

                if (currentHeight > containerHeight) {
                    $el.children(".innerWrapper").css({
                        "height": 'auto',
                    });
                }
                if (currentHeight < containerHeight) {
                    $el.children(".innerWrapper").css({
                        "height": $(this).closest('.row').height(),
                    });
                }
                if ((currentHeight < containerHeight + 1 && nextHeight < containerHeight + 1) && (currentHeight < containerHeight + 1 && prevHeight < containerHeight + 1)) {
                    $el.children(".innerWrapper").css({
                        "height": 'auto',
                    });
                }

            }
        });
    };

    var accionaCyphersAppearEffect = function () {
        if (!isTouchDevice()) {
            if (!$('body').hasClass('isMobile')) {
                $(".cyphers-content .table-content").each(function () {
                    var module = $(this);
                    if (module.has(".number-stat-container")) {
                        if (module.position().top <= $(window).scrollTop() + ($(window).innerHeight() - 100)) {
                            module
                                .find(".number-stat-container")
                                .animate({
                                    "top": 0
                                }, 800)
                                .end()
                                .find(".text-stat-type")
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".number-stat-icon")
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".number-stat-title")
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".number-stat-value")
                                .delay(300)
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".number-stat-type")
                                .delay(600)
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".number-stat-same span")
                                .delay(900)
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".pdd h3")
                                .delay(1200)
                                .animate({
                                    "opacity": 1
                                })
                                .end()
                                .find(".pdd p")
                                .delay(1500)
                                .animate({
                                    "opacity": 1
                                })
                                .end();
                        }
                    }
                });
            }
        } else {
            $(".cyphers-content .table-content").each(function () {
                var module = $(this);
                if (module.has(".number-stat-container")) {
                    module
                        .find(".number-stat-container")
                        .css({
                            "top": 0
                        }, 800)
                        .end()
                        .find(".text-stat-type")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".number-stat-icon")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".number-stat-title")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".number-stat-value")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".number-stat-type")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".number-stat-same span")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".pdd h3")
                        .css({
                            "opacity": 1
                        })
                        .end()
                        .find(".pdd p")
                        .css({
                            "opacity": 1
                        })
                        .end();
                }
            });
        }
    }

    var playVideos = function () {
        $(".module-video-rollover").each(function () {
            $(this).on("mousedown", function () {
                $(this).find(".flash_kplayer iframe").css({ "height": "100%" });
                $(this).find(".flash_kplayer iframe").css({ "width": "100%" });
		        $(this).find(".flash_kplayer iframe").css({ "z-index": "10" });
		        $(this).find(".flash_kplayer").animate({ "opacity": 1 });
		        $(this).find(".module-show-video").animate({ "opacity": 0 })
            });
        })
    }

    var fancyKewegoVideosFix = function () {
        if (!$('body').hasClass('isMobile')) {
            if ($(window).innerWidth() < 1024) {
                $(".fancybox-wrap .flash_kplayer").css({
                    "width": $(window).innerWidth() - 100
                });
            } else {
                $(".fancybox-wrap .flash_kplayer").css({
                    "width": 1024
                });
            }
        } else {
            $(".fancybox-wrap .flash_kplayer").css({
                "width": $(window).innerWidth() - ($(window).innerWidth() * 0.21),
                "height": 300
            });
        }
    }

    var activateSelect = function () {
        $(".select01 select").change(function () {
            var nextSelect = $(this).closest('.input-search-container').next().find(".select01 select");
            var prevSelect = $(this).closest('.input-search-container').prev().find(".select01 select");

            if ($(this).val() > 0) {
                $(this)
                    .css("color", "#232323")
                    .closest(".form")
                    .find(".search-block-button")
                    .addClass("active")
                    .end()
                    .find(this)
                    .closest('.input-search-container')
                    .next()
                    .removeClass('deactivate')
                    .find('select')
                    .removeAttr('disabled');
            } else {
                if ((nextSelect.val() <= 0 || nextSelect.val() == null || nextSelect.is('#state-select')) && (prevSelect.val() <= 0 || prevSelect.val() == null)) {
                    $(this)
                        .css("color", "#7d7d7d")
                        .closest(".form")
                        .find(".search-block-button")
                        .removeClass("active");
                }
                if ($(this).val() <= 0) {
                    $(this).css("color", "#7d7d7d")
                }
                if (nextSelect.is('#state-select')) {
                    $(this)
                        .closest('.input-search-container')
                        .next()
                        .addClass('deactivate')
                        .find('select')
                        .attr('disabled', '');
                }
            }
        });
    }

    var activateSelectEnergy = function () {
        $(".select01 select").change(function () {
            var nextSelect = $(this).closest('.dropdown-submenu-featured-line').next().find(".select01 select");
            var prevSelect = $(this).closest('.dropdown-submenu-featured-line').prev().find(".select01 select");

            if ($(this).val() > 0) {
                $(this)
                    .css("color", "#232323")
                    .closest(".form")
                    .find(this)
                    .closest('.dropdown-submenu-featured-line')
                    .next()
                    .removeClass('deactivate')
                    .find('select')
                    .removeAttr('disabled');
            } else {
                if ((nextSelect.val() <= 0 || nextSelect.val() == null || nextSelect.is('#state-select')) && (prevSelect.val() <= 0 || prevSelect.val() == null)) {
                    $(this)
                        .css("color", "#7d7d7d")
                        .closest(".form")
                        .find(".search-block-button")
                        .removeClass("active");
                }
                if ($(this).val() <= 0) {
                    $(this).css("color", "#7d7d7d")
                }
                if (nextSelect.is('#state-select')) {
                    $(this)
                        .closest('.dropdown-submenu-featured-line')
                        .next()
                        .addClass('deactivate')
                        .find('select')
                        .attr('disabled', '');
                }
            }
        });
    }

    var downloadDropdown = function () {
        $('.newsroom-kit ul li.module-button-full a').off('click').on('click', function (e) {
            //e.preventDefault();
            var elem = $(this).closest('li');

            if (elem.hasClass('close')) {
                elem.addClass('open').removeClass('close');
                elem.closest('ul').addClass('open');
            } else if (elem.hasClass('open')) {
                elem.addClass('close').removeClass('open');
                elem.closest('ul').removeClass('open');
            }
        });
    };

    var initMasonry = function () {
        var $container = $('.newsroom');
        // initialize
        $container.masonry({
            columnWidth: '.half-module-notice',
            itemSelector: '.half-module-notice',
            "gutter": ($('.newsroom').width() * 0.03),
            transitionDuration: 0,
        });

        var $galleryContainer = $('.flickrBody ul');
        // initialize
        $galleryContainer.masonry({
            columnWidth: '.flickrRow',
            itemSelector: '.flickrRow',
            "gutter": ($('.flickr-gallery').width() * 0.0215),
            transitionDuration: 0,
        });
    }

    /*var initGallery = function(){
    	$('.flickr-gallery').flickrfeed('61542482@N04','', {
    	    limit: 12,
    	    imagesize: 'medium',
    	    title: false,
    	    date: false,
    	});
    }*/

    var changePositionAdvancedSearch = function () {
        if ($('body').hasClass('max860')) {
            if ($('.right-column').hasClass('final-content') == false) {
                $('.left-column .advanced-search-block')
                    .remove()
                    .clone()
                    .insertAfter('.primary-level-heading')
                    .find('.do-datepicker')
                    .removeClass("hasDatepicker")
                    .datepicker("destroy")
                    .datepicker()
                    .end()
                    .find('.form')
                    .css({
                        'display': 'none',
                        'opacity': '0'
                    })
                    .end()
                    .find('.module-aside-title')
                    .addClass('hide')
                    .find('span')
                    .switchClass("icon-arrowup", "icon-arrowdown", 500, "easeInOutQuad");
            } else {
                $('.left-column .advanced-search-block')
                    .find('.form')
                    .css({
                        'display': 'none',
                        'opacity': '0'
                    });
            }
            datePickerUI();
            //validationAdvancedSearch();
            mobileDatepicker();
            hideAdvancedSearch();
        } else {
            if ($('.right-column').hasClass('final-content') == false) {
                $('.advanced-search-block')
                    .remove()
                    .clone()
                    .prependTo('.left-column .content-group:first-of-type')
                    .find('.do-datepicker')
                    .removeClass("hasDatepicker")
                    .datepicker("destroy")
                    .datepicker()
                    .end()
                    .find('.form')
                    .css({
                        'display': 'block',
                        'opacity': '1'
                    });
                $('.infoBolsaViewerWrapper')
                    .find('.do-datepicker')
                    .removeClass("hasDatepicker")
                    .datepicker("destroy")
                    .datepicker()
                    .end();
            } else {
                $('.advanced-search-block')
                    .find('.form')
                    .css({
                        'display': 'block',
                        'opacity': '1'
                    });
            }
            datePickerUI();
            //validationAdvancedSearch();
            mobileDatepicker();
            hideAdvancedSearch();
        }
    }

    var validationAdvancedSearch = function () {
        $(".form-block .text").on({
            focus: function () {
                $(this).addClass('focus');
            },
            focusout: function () {
                $(this).removeClass('focus');
            },
            keyup: function () {
                var $el = $(this);

                var otherInputs;

                $(".form-block .text:not('.focus')").each(function () {
                    if ($(this).val() != "")
                        otherInputs = $(this).val();
                });

                if ($el.val().length == 0 && (otherInputs == "" || otherInputs == null)) {
                    $el
                        .closest('.form')
                        .find('.button')
                        .removeClass('active');
                } else {
                    $el
                        .closest('.form')
                        .find('.button')
                        .addClass('active');
                }
            },
            change: function () {
                var $el = $(this);

                var otherInputs;

                $(".form-block .text:not('.focus')").each(function () {
                    if ($(this).val() != "")
                        otherInputs = $(this).val();
                });

                if ($el.val().length == 0 && (otherInputs == "" || otherInputs == null)) {
                    $el
                        .closest('.form')
                        .find('.button')
                        .removeClass('active');
                } else {
                    $el
                        .closest('.form')
                        .find('.button')
                        .addClass('active');
                }
            }
        });
    }

    var mobileDatepicker = function () {
        if ($('body').hasClass('isMobile') && isTouchDevice()) {
            $('.input-date').each(function () {
                if ($(this).attr('type') != 'date') {
                    $(this).focus(function () {
                        $(this).removeAttr('type').attr('type', 'date').val("dd/mm/aa");
                        $('.ui-datepicker').addClass("hide-on-mobile");
                    });
                }
            })
        }
    }
    var hideAdvancedSearch = function () {
        if ($('body').hasClass('max860')) {
            $('.module-aside-title').not('.module-deactived').on('click', function () {
                if ($(this).closest('.column').find('.form').is(':visible'))
                    $(this)
                    .switchClass("", "hide", 500, "easeInOutQuad")
                    .find('span')
                    .removeClass("icon-arrowup").addClass("icon-arrowdown")
                    .closest('.column')
                    .find('.form')
                    .animate({
                        'opacity': 0
                    }, 200, "easeInOutQuad").end()
                    .closest('.column')
                    .find('.form')
                    .slideUp();
                else
                    $(this)
                    .switchClass("hide", "", 500, "easeInOutQuad")
                    .find('span')
                    .removeClass("icon-arrowdown").addClass("icon-arrowup")
                    .closest('.column')
                    .find('.form')
                    .animate({
                        'opacity': 1
                    }, 200, "easeInOutQuad").end()
                    .closest('.column')
                    .find('.form')
                    .slideDown();

            });
        }
    }
    var initAudiojs = function () {
        audiojs.events.ready(function () {
            var as = audiojs.createAll();
        });
    }
    var printPage = function () {
        $('.print-now').click(function () {
            window.print()
        });
    }
    var dropDownWebMap = function () {

        //Ocultamos las capas
        $('.expand-icon').each(function () {
            $(this).next().hide();
        });

        //Generamos el efecto al hacer click
        $('.expand-icon').click(function (e) {
            e.preventDefault();
            var el = $(this);
            var child = el.next();

            if (child.is(":visible")) {
                el.prev().removeClass('active');
                child
                    .slideUp();
                el.removeClass('icons-minus').addClass('icons-plus');
            } else {
                if (el.parent().is('.hasChild') && !isTouchDevice()) {
                    $('.hasChild').find('.dropdown-second-lvl').slideUp();
                    $('.hasChild').children('.expand-icon').removeClass('icons-minus').addClass('icons-plus').prev().removeClass('active');
                }

                el.prev().addClass('active');
                child
                    .slideDown();
                el.removeClass('icons-plus').addClass('icons-minus');
            }

        });
    }

    var checks = function () {
        // AÃ±adir checked a los input en ie8
        $('input[type="radio"], input[type="checkbox"]').each(function () {
            var elem = $(this);

            elem.on('change', function () {

                if (elem.is(':checked')) {
                    $('input[type="radio"]').each(function () {
                        var otherElem = $(this);

                        if (otherElem.not(elem).attr('name') === elem.attr('name')) {
                            otherElem.removeClass('checked');
                        }
                    });

                    elem.addClass('checked');
                    elem.blur();
                    elem.focus();
                } else {
                    elem.removeClass('checked');
                }
            });
        });
    };

    var projectFilter = function () {
        $('.projects-filter .dropdown-submenu-line-link').on('click', function () {
            var newPosition = $('.dropdown-lvl2').offset().top;
            if ($('body').hasClass('max860')) {
                $('.fancybox-wrap').animate({
                    scrollTop: newPosition
                });
            }
        });
    };

    // funciÃ³n que permite desplegar y plegar mÃ³dulos
    var accordion = function () {
        var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        $('.accordion_title').off('click').on('click', function () {
            var button = $(this);
            if (!button.hasClass('open')) {
                button.addClass('open');
                button.closest('.accordion').css('max-height', button.next('.accordion_content').outerHeight() + button.outerHeight());
            } else {
                button.removeClass('open');
                button.closest('.accordion').css('max-height', '');
            }
        });
        $('.accordion_title').each(function () {
            var button = $(this);
            if (button.hasClass('open')) {
                button.closest('.accordion').css('max-height', button.next('.accordion_content').outerHeight() + button.outerHeight());
            }
        });
    };

    var genericTabs = function () {
        var tabs = document.querySelectorAll('.genericTabs .module-developmentTabs_tab');
        var contents = document.querySelectorAll('.tabContent');

        [].forEach.call(tabs, function (tab, key) {
            tab.addEventListener('click', function () {
                [].forEach.call(tabs, function (tab) {
                    tab.classList.remove('active');
                });
                this.classList.add('active');
                [].forEach.call(contents, function (content) {
                    content.classList.remove('show');
                });
                contents[key].classList.add('show');
            });
        });
    }

    // funciÃ³n que permite mostrar distinto contenido al cambiar de tab
    var tabs = function () {
        var tab = $('.module-developmentTabs:not(.genericTabs) .module-developmentTabs_tab'),
            accionaDevs = $('#accionaDevelopments'),
            clientDevs = $('#clientDevelopments'),
            supplyTab = $('#supplyTabContent'),
            select = $('#tabsSelect:not(.static)');

        accionaDevs.children().css('opacity', 1);

        // Al clickar la tab, ocultamod un contenido y mostramos otro
        tab.off('click').on('click', function () {
            elem = $(this);
            tab.removeClass('active');
            $(this).addClass('active');

            if ($(this).hasClass('accionaTab')) {

                clientDevs.removeClass('show');
                supplyTab.removeClass('show');
                accionaDevs.addClass('show');
                clientDevs.children().css('opacity', 0);
                supplyTab.children().css('opacity', 0);
                // cambiamos la opacidad del elemento hijo para que se produzca la animaciÃ³n
                setTimeout(function () {
                    accionaDevs.children().css('opacity', 1);
                }, 100);

            } else if ($(this).hasClass('clientTab')) {

                accionaDevs.removeClass('show');
                supplyTab.removeClass('show');
                clientDevs.addClass('show');
                // cambiamos la opacidad del elemento hijo para que se produzca la animaciÃ³n
                accionaDevs.children().css('opacity', 0);
                supplyTab.children().css('opacity', 0);
                setTimeout(function () {
                    clientDevs.children().css('opacity', 1);
                }, 100);

            } else if ($(this).hasClass('supplyTab')) {

                accionaDevs.removeClass('show');
                clientDevs.removeClass('show');
                supplyTab.addClass('show');
                // cambiamos la opacidad del elemento hijo para que se produzca la animaciÃ³n
                accionaDevs.children().css('opacity', 0);
                clientDevs.children().css('opacity', 0);
                setTimeout(function () {
                    supplyTab.children().css('opacity', 1);
                }, 100);

            }

            // Actualizamos el combo para que se marque la misma opciÃ³n que en la pestaÃ±a
            select.find('option').each(function () {
                var opt = $(this);

                if (opt.val() === $('.module-developmentTabs_tab.active').attr('id').replace('_tab', '')) {
                    opt.attr("selected", "selected");
                }
            });
        });
    };

    var tabsCombo = function () {
        $('#tabsSelect.static').on('change', function () {
            elem = $(this);
            if (elem.attr('selected') === undefined) {
                window.location.href = elem.val();
            }
        });

        $('#tabsSelect:not(.static)').on('change', function () {
            var currentOption = $(this).find('option:selected').val(),
                tab = $('.module-developmentTabs_tab'),
                tabContent = $('.tabContent');

            // Ocultamos el contenido previo
            tabContent.removeClass('show');
            tab.removeClass('active');
            tabContent.find('> *').css('opacity', 0);

            // Mostramos el nuevo contenido
            $('#' + currentOption).addClass('show');
            $('#' + currentOption + '_tab').addClass('active');
            setTimeout(function () {
                $('#' + currentOption).children().css('opacity', 1);
            }, 100);
        });
    };

    var isDraggable = function () {
        // $('.module-installationsMap').swipe({
        //     swipeStatus: function(event, phase, direction, distance, duration) {
        //         console.log(phase);
        //         //$(this).addClass('noDraggable');
        //         if (duration > 1000) {
        //             console.log(duration);
        // 			$('#map-canvas').removeClass('noDraggable');
        //    			setTimeout(function() {
        //    				$('#map-canvas').trigger('drag');
        //    			}, 50);
        //         }
        //     },
        // longTap: function() {
        // 		console.log('LongTap!');
        // 		$('#map-canvas').removeClass('noDraggable');
        // 		setTimeout(function() {
        // 			$('#map-canvas').focus();
        // 		}, 50);
        // },
        // longTapThreshold: 50,
        //allowPageScroll: 'vertical'
        //});
    };

    var adjustHeight = function (element) {
        $(element).css('height', '');
        // Recorremos los mÃ³dulos
        $(element).each(function () {
            var module = $(this);
            var modulePos = module.offset().top;
            var row = [];
            var moduleHeight = 0;
            // Recorremos de nuevo los elementos para comparar las alturas
            $(element).each(function () {
                var module2 = $(this);
                var modulePos2 = module2.offset().top;
                // AÃ±adimos en un array los elementos con misma altura que pertenecen a la misma fila
                if (modulePos2 === modulePos) {
                    row.push(module2);
                }
            });
            // Recorremos el array de cada fila y guardamos el valor del item de mÃ¡s altura
            $.each(row, function (key, val) {
                if (val.outerHeight() > moduleHeight) {
                    moduleHeight = val.outerHeight();
                }
            });
            // Aplicamos la altura mÃ¡s alta a los elementos
            module.css('height', moduleHeight);
        });
    };

    var installationSearched = function () {
        $('.module-installationsSearch_check').off('click').on('click', function () {
            var moduleTitle = $('.module-installationsSearch_titleMobile');
            moduleTitle.addClass('open');
            $('.module-installationsSearch').css('max-height', $('.module-installationsSearch_container').outerHeight() + moduleTitle.outerHeight());
        });
    }

    var storyDropdown = function () {
        $('.story-dropdown-content').each(function () {
            var el = $(this);
            el.find('.pdd').hide();

            var module = el.closest('.standAloneMedia.withDropdownText');

            if (module.length != 0) {
                module.parent().next('hr.module-separator').attr('style', 'margin-top:' + ($(module).height() + 160) + 'px');
            }
        });

        

        $('.story-image-container').click(function (e) {
            e.preventDefault();
            var el = $(this);

            var layerToHide = el.closest('.story-dropdown-content').find('.pdd');
            var module = el.closest('.standAloneMedia.withDropdownText');

            var addedHeight = $('.story-dropdown-content').find('.pdd').height();

            if (!layerToHide.is(':visible')) {

                if (!isTouchDevice()) {
                    $('.story-dropdown-content')
                        .find('.pdd')
                        .slideUp()
                        .end()
                        .find('.call-to-action')
                        .removeClass('icons-circle-arrow-up')
                        .removeClass('open')
                        .addClass('icons-circle-arrow-down')
                        .end()
                        .find('.call-to-action:before').css({
                            'content': '\e009'
                        });

                    if (module.length != 0) {
                        
                        module.parent().next('hr.module-separator').attr('style', 'margin-top:' + ($(module).height() + addedHeight + 160) + 'px');
                    }
                }                

                layerToHide.slideDown(function () {
                    if (!isTouchDevice())
                        $("html, body").stop().animate({
                            scrollTop: el.closest('.story-dropdown-content').offset().top
                        });

                });

                layerToHide.closest('.story-dropdown-content')
                    .find('.call-to-action')
                    .removeClass('icons-circle-arrow-down open')
                    .addClass('icons-circle-arrow-up')
                    .addClass('open')
                    .end()
                    .find('.call-to-action:before').css({
                        'content': '\e008'
                    });

            } else {
                layerToHide.slideUp();

                if (isTouchDevice())
                    layerToHide.closest('.story-dropdown-content')
                    .find('.call-to-action')
                    .removeClass('icons-circle-arrow-up')
                    .removeClass('open')
                    .addClass('icons-circle-arrow-down');

                if (!isTouchDevice()) {
                    $('.story-dropdown-content')
                        .find('.call-to-action')
                        .removeClass('icons-circle-arrow-up')
                        .removeClass('open')
                        .addClass('icons-circle-arrow-down');

                    if (module.length != 0) {
                        addedHeight = -addedHeight;
                        module.parent().next('hr.module-separator').attr('style', 'margin-top:' + ($(module).height() + addedHeight +  160) + 'px');
                    }
                    
                } 

            }




        })


        $('.owl-item').click(function () {
            var el = $(this);
            var ageSelector = el.children().text();
            var parallelElement = $('.decade[data-year="' + ageSelector + '"]');

            $("html, body").animate({
                scrollTop: parallelElement.offset().top
            });
        });
    }

    // IGUALACION DE ALTURAS

    // Margins Fix
    var sameHeight = function (allScreen, affectedParent) {
        $('.module-distributorIcons_item').each(function () {
            var elem = $(this);
            var elemStyle = window.getComputedStyle(this);
            var parentPadding = (elem.parent().outerWidth() - elem.parent().width()) / 2;
            var firstElementLeftSpace = (elem.offset().left - parseFloat(elem.css('margin-left'))) - (elem.parent().offset().left + parentPadding);
            var elementsLeftSpace = elem.offset().left - (elem.parent().offset().left + parentPadding);
            var elementsRightSpace = elem.parent().width() - (elementsLeftSpace + elem.outerWidth());
            var row = [];

            elem.css({
                'margin-left': '',
                'margin-top': ''
            });

            // if(elem.offset().top - elem.parent().offset().top <= parseFloat(elem.css('margin-top'))) {
            // 	elem.css({
            // 		'margin-top': 0,
            // 	});
            // }

            // Si los bloques estÃ¡n flotados rompemos el flotado para conservar las filas alineadas
            if (elementsRightSpace <= 1) {
                elem.next().css('clear', 'left');
            } else {
                elem.next().css('clear', '');
            }

            // Si es el primer item le quitamos el margen izq
            if (firstElementLeftSpace <= 1) {
                if (parseFloat(elemStyle.marginLeft).toFixed(0) !== parseFloat(elemStyle.marginRight).toFixed(0)) {
                    elem.css('margin-left', 0);
                }
                // elem.insertAfter(elem.data('prevObject'));

                var topThis = elem.offset().top;

                // Comparamos el primer item con el resto para obtener el resto de items de su fila
                elem.parent().find('.module-distributorIcons_item').each(function () {
                    var elem2 = $(this);
                    var topOther = elem2.offset().top;
                    var elementsLeftSpace2 = elem2.offset().left - (elem2.parent().offset().left + parentPadding);
                    var elementsRightSpace2 = elem2.parent().width() - (elementsLeftSpace2 + elem2.outerWidth());

                    // Si estÃ¡n en la misma fila los guardamos en una array junto con el espacio que dejan por la derecha
                    if (topThis === topOther) {
                        row.push([elem2, elementsRightSpace2]);
                    }
                });

                // Recorremos los siguientes items para ver si encajan en los huecos
                elem.parent().find('.module-distributorIcons_item').each(function () {
                    var elem = $(this);

                    if (elem.offset().top > row[row.length - 1][0].offset().top) {
                        if (elem.width() <= row[row.length - 1][1]) {
                            if (elem.data('prevObject') === undefined) {
                                elem.data('prevObject', elem.prev());
                            }
                            // elem.insertAfter(row[row.length-1][0]);
                            // console.log(row[row.length-1][0], elem);

                            // Comprobamos de nuevo si queda espacio por la derecha
                            var newElementsLeftSpace = elem.offset().left - (elem.parent().offset().left + parentPadding);
                            var newElementsRightSpace = elem.parent().width() - (newElementsLeftSpace + elem.outerWidth());

                            // AÃ±adimos el elemento a la fila
                            row.push([elem, newElementsRightSpace]);

                            // Si ya se ha rellenado el hueco cancelamos el each
                            if (newElementsRightSpace < 1) {
                                return false;
                            }
                        }
                    }
                });
            }
        });

        // Full height

        var fullHeightLayer = $('.fullHeight');

        if (fullHeightLayer.length > 0) {
            fullHeightLayer.css('height', $(window).height());
        }

        // Auto height

        var element = $('.sameHeight > .module-distributorIcons_item');

        element.css('height', '');

        if (allScreen === null || allScreen === undefined) {
            allScreen = false;
        }
        if (affectedParent === null || affectedParent === undefined) {
            affectedParent = false;
        }

        $('body').addClass('resolved');

        function structure() {
            // Recorremos los mÃ³dulos
            element.each(function () {
                var module = $(this);
                var modulePos = module.offset().top;
                var row = [];
                var moduleHeight = 0;

                // Recorremos de nuevo los elementos para comparar las alturas
                element.each(function () {
                    var module2 = $(this);
                    var modulePos2 = module2.offset().top;

                    // AÃ±adimos en un array los elementos con misma altura que pertenecen a la misma fila
                    if (modulePos2 === modulePos) {
                        row.push(module2);
                    }
                });

                // Recorremos el array de cada fila y guardamos el valor del item de mÃ¡s altura
                $.each(row, function (key, val) {
                    if (val.outerHeight() > moduleHeight) {
                        moduleHeight = val.outerHeight();
                    }
                });

                // Aplicamos la altura mÃ¡s alta a los elementos
                module.css('height', moduleHeight);
                if (affectedParent === true) {
                    element.parent().css('height', moduleHeight);
                }
            });
        }

        if (allScreen === true) {
            structure();
        } else {
            if (!$('body').hasClass('phoneDevice')) {
                structure();
            }
        }
    };

    // CONSTRUCCIÃ“N

    var structureAdjust = function (element) {
        $(element).css('height', '');

        if (!$('body').hasClass('phoneDevice')) {

            // Recorremos los mÃ³dulos
            $(element).each(function () {
                var module = $(this);
                var modulePos = module.offset().top;
                var row = [];
                var moduleHeight = 0;

                // Recorremos de nuevo los elementos para comparar las alturas
                $(element).each(function () {
                    var module2 = $(this);
                    var modulePos2 = module2.offset().top;

                    // AÃ±adimos en un array los elementos con misma altura que pertenecen a la misma fila
                    if (modulePos2 === modulePos) {
                        row.push(module2);
                    }
                });

                // Recorremos el array de cada fila y guardamos el valor del item de mÃ¡s altura
                $.each(row, function (key, val) {
                    if (val.outerHeight() > moduleHeight) {
                        moduleHeight = val.outerHeight();
                    }
                });

                // Aplicamos la altura mÃ¡s alta a los elementos
                module.css('height', moduleHeight);
            });
        }
    }

    // DETECT BROWSER

    var detectBrowser = function () {
        // IE
        var isIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
        var ieversion = new Number(RegExp.$1);

        if (isIE && ieversion == 8) {
            $('html').attr('class', 'ie8');
        }
        if (isIE && ieversion == 9) {
            $('body').addClass('ie9');
        }
        if (isIE && ieversion == 10) {
            $('body').addClass('ie10');
        }

        // IE11
        if (navigator.appVersion.indexOf('Trident/') > 0) {
            $('body').addClass('ie11');
        }
    }

    // prueba textarea

    // var logAreaText = function() {
    // 	$('#prueba1').on('blur', function() {
    // 		console.log($(this).val().replace(/\n/g, "<p></p>"));
    // 	});
    // }

    // FUNCIONES DEL ACORDEÃ“N

    var setAccordionHeight = function () {
        $('.accordion-check').each(function () {

            // Si estÃ¡ checked, le asignamos al li laclase "checked"
            if ($(this).is(':checked')) {
                $(this).closest('li').addClass('checked');
            }

            $(this).on('change', function () {
                var list_content = $(this).parent().find('.label-info');
                if ($(this).is(':checked')) {
                    var new_height = list_content.find('.label-info-inner').outerHeight(true);
                    list_content.css('height', new_height).closest('li').addClass('checked');
                } else {
                    list_content.css('height', 0).closest('li').removeClass('checked');
                }
            });
        });
    }
    var updateAccordionHeight = function () {
        $('.accordion-check').each(function () {
            // para el elemento que ya estÃ© abierto por defecto, le damos su altura para que anime al cerrar la
            // primera vez, aparte, en el resize ajuste la altura de cada capa a la correspondiente si estÃ¡ abierta
            if ($(this).is(':checked')) {
                var list_content = $(this).parent().find('.label-info');
                var new_height = list_content.find('.label-info-inner').outerHeight(true);
                list_content.css('height', new_height);
            }
        });
    }

    var openShareButton = function () {
        if ((window.innerWidth <= 1024)) {
            $('.shared-click')
                .off()
                .on('click', function () {
                    var dataHref = $(this).data('href')
                    $.fancybox.open([{
                        type: 'ajax',
                        href: dataHref
                    }]);
                })
        } else {
            $('.shared-click').off()
            var $parent = $(this).closest('li')
            $parent.removeClass('open')
        }
    }

    var openHeaderLayer = function () {
        var $obj = $('.open-layer')
        $obj
            .off()
            .on('click', function () {
                if ($obj.hasClass('open')) {
                    internationalLayerClose($obj)
                } else {

                    if ($('.header-dropdown').length) {
                        if ($('.header-dropdown').hasClass('open')) {
                            $('.header-dropdown').slideUp(300, function () {
                                $('.dropdown-header')
                                    .removeClass('open')
                                    .find('i')
                                    .removeClass('icon-up-open')
                                    .addClass('icon-down-open');

                                internationalLayerOpen($obj)
                            })

                        } else {
                            internationalLayerOpen($obj)
                        }

                    } else {
                        internationalLayerOpen($obj)
                    }
                }

            })
    }

    var openRealEstateFilter = function () {
        var $el = $('.module-realEstate .module-installationsFilter_title')

        $el
            .off()
            .on('click', function () {
                $(this).toggleClass('open');

                if ($(this).hasClass('open')) {
                    $(this)
                        .next('.module-installationsFilter_inner')
                        .slideDown()
                    $(this)
                        .find('i')
                        .removeClass('icon-down-open')
                        .addClass('icon-up-open')
                } else {
                    $(this)
                        .next('.module-installationsFilter_inner')
                        .slideUp()
                    $(this)
                        .find('i')
                        .removeClass('icon-up-open')
                        .addClass('icon-down-open')
                }
            })
    }

    var internationalLayerOpen = function (el) {
        el.addClass('open');
        el.find(".icon-down-open").removeClass("icon-down-open").addClass("icon-up-open");
        $('.header-dropdown-other-webs').find('.container').css("opacity", "0");
        $('.header-dropdown-other-webs').find('.container').animate({
            "opacity": 1
        }, 500, function () {
            $('.header-dropdown-other-webs').find('.container').css("opacity", 1);
        });
        $('.header-dropdown-other-webs').addClass('open').slideDown()
    }

    var internationalLayerClose = function (el) {
        el.removeClass('open');
        el.find(".icon-up-open").removeClass("icon-up-open").addClass("icon-down-open");
        $('.header-dropdown-other-webs').removeClass('open').slideUp()
    }

    var positionNavBullet = function () {
        var el = $('#owl-inmobiliaria')
        var wrap = el.find('.module-graphic');
        first = el.find('owl-item').eq(0);
        nav = el.find('.owl-controls');

        if (window.innerWidth <= 640) {
            var ref = first.find('.icon-wrap').position(),
                ref_top = ref.top

            //var top = wrap.css('padding-top').replace("px", "")

            setTimeout(function () {
                nav.css('top', (ref_top - 50) + 'px')
            }, 200)

        } else {
            nav.removeAttr('style')
        }
    }

    var progressBar = function () {
        var el = $('.inmobiliaria-work-progress .progress-bar')

        if (el.length) {
            el.each(function (index, el) {
                var data = $(el).data('progress')
                $(el)
                    .find('i')
                    .animate({
                        'width': data + '%'
                    },
                        800
                    );
            });
        }
    }

    // funciÃ³n encargada de mostrar/ocultar las contraseÃ±as en los input password
    var showPassword = function () {
        var button = $('.field .icons-view');

        button.on('click', function (e) {
            e.preventDefault();
            var obj = $(this);
            var target = obj.closest('.field').find('input[type="password"], input[type="text"]');

            if (target.attr('type') === 'password') {
                target.attr('type', 'text');
            } else if (target.attr('type') === 'text') {
                target.attr('type', 'password');
            }
        });
    }

    var initCharts = function () {
        var chartJSON = [];
        var charts = document.querySelectorAll('.module-chart');
        var chartData = new Object;
        var chartConfig = new Object;

        [].forEach.call(charts, function (chart, key) {
            // Read JSON
            chart.readJSON = function () {
                $.getJSON(chart.getAttribute('data-json')).done(function (data) {
                    chartJSON = data;
                    chartData.childLabels = [];
                    chartData.labels = [];
                    chartData.val = [];
                    chartData.val.color = [];

                    chartJSON.forEach(function (parent, key) {
                        var childData = [];
                        chartData.labels.push(parent.name);
                        parent.data.forEach(function (child, childKey) {
                            childData.push(child.data);

                            if ((childKey + 1) === parent.data.length) {
                                chartData.val.push(childData);
                            }
                        });

                        // starts charts at reading JSON is complete
                        if ((key + 1) === chartJSON.length) {
                            parent.data.forEach(function (child) {
                                chartData.childLabels.push(child);
                            });

                            chart.constructCharts();
                        }
                    });
                });
            }

            // Chart constructor
            chart.constructCharts = function () {
                var ctx;
                chartConfig = {
                    type: chart.getAttribute('data-type'),
                    data: {
                        labels: [],
                        datasets: []
                    },
                    options: {
                        layout: {
                            padding: 100
                        },
                        legend: {
                            display: false
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    padding: 18,
                                    fontFamily: 'Bliss',
                                    fontStyle: 'bold',
                                    fontSize: 14
                                },
                                gridLines: {
                                    drawBorder: false,
                                    zeroLineWidth: 1,
                                    zeroLineColor: 'rgba(0, 0, 0, 0.1)',
                                    tickMarkLength: 0
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontFamily: 'Bliss',
                                    fontStyle: 'bold',
                                    fontSize: 14
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                }
                            }]
                        }
                    }
                }

                chartData.childLabels.forEach(function (data) {
                    chartConfig.data.labels.push(data.name);
                });

                chartJSON.forEach(function (data, key) {
                    var dataset = {
                        label: data.name,
                        data: chartData.val[key],
                        backgroundColor: data.color,
                        borderColor: data.color,
                        borderWidth: 4,
                        pointBorderWidth: 5,
                        lineTension: 0.0,
                        fill: false
                    };

                    chartConfig.data.datasets.push(dataset);
                });

                // Create chart
                ctx = chart.querySelector('canvas');
                if (!chart.chart) {
                    chart.chart = new Chart(ctx, chartConfig);
                } else {
                    chart.chart.destroy();
                    chart.chart = new Chart(ctx, chartConfig);
                }

                // Create legend
                if (chart.getAttribute('data-legend') === 'true') {
                    legend = document.createElement('div');
                    legend.classList.add('chart_footer');
                    legend.innerHTML = chart.chart.generateLegend();
                    if (chart.querySelectorAll('.chart_footer').length < 1) {
                        chart.querySelector('.chart_wrapper').appendChild(legend)
                    }
                }
            }

            chart.update = function () {
                chart.readJSON();
            }

            // Chart Buttons
            chart.addButtonListener = function () {
                var buttons = chart.querySelectorAll('.chart_buttons button');

                [].forEach.call(buttons, function (obj) {
                    if (obj.classList.contains('chart_button_lines')) {
                        obj.addEventListener('click', function () {
                            [].forEach.call(buttons, function (obj) {
                                obj.classList.remove('active');
                            });
                            this.classList.add('active');
                            chart.setAttribute('data-type', 'line');
                            chart.update();
                        });
                    } else if (obj.classList.contains('chart_button_bars')) {
                        obj.addEventListener('click', function () {
                            [].forEach.call(buttons, function (obj) {
                                obj.classList.remove('active');
                            });
                            this.classList.add('active');
                            chart.setAttribute('data-type', 'bar');
                            chart.update();
                        });
                    }
                });
            }

            // Chart Select
            chart.addSelectListener = function () {
                var selects = chart.querySelectorAll('.chart_selector select');

                [].forEach.call(selects, function (obj) {
                    obj.addEventListener('change', function () {
                        chart.setAttribute('data-json', this.value);
                        chart.update();
                    });
                });
            }

            chart.readJSON();
            chart.addButtonListener();
            chart.addSelectListener();
        });
    }

    var sliderStyles = function () {
        if ($('.slider-inmobiliaria').length > 0) {
            var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            var headerHeight = $('header').height();
            var totalHeight = windowHeight - headerHeight

            $('.slider-inmobiliaria .slider-visor').css('padding-top', totalHeight + 'px');
        }
    }

    /* ************************************************************ */
    /* **************** REAL ESTATE NEW CONCEPT ******************* */
    /* ************************************************************ */

    var menuHandle = function () {
        var parent = $('header'),
            nav = parent.find('.newMenuHandle'),
            window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (window_width <= 860) {
            // search item whit sub menu
            nav.find('.primary-menu > li > a.has-submenu').each(function (index, el) {
                var obj = $(el),
                    data = obj.data('submenu'),
                    icon = obj.find('.dropdown-icon'),
                    wrap = obj.parent('li'),
                    clonedParent = $(".dropdown-submenu#" + data + "");

                if (!(wrap.find(".dropdown-submenu#" + data + "").length)) {
                    clonedParent.clone().appendTo(wrap);
                    var newIcon = icon.clone().appendTo(wrap)
                    newIcon
                        .off()
                        .on('click', function () {
                            menuHandleAct($(this))
                        })

                    menuHandleInit($('.newMenuHandle .primary-menu > .activedMenu'))
                }
            });
        } else {
            nav.find('.primary-menu > li').each(function (index, el) {
                var obj = $(el)
                obj
                    .find(" >.dropdown-icon").remove()
                obj
                    .find(".dropdown-submenu").remove()

            });
        }
    }

    var menuHandleAct = function (el) {
        var obj = el

        obj.each(function (index, el) {
            if ($(el).closest('li').hasClass('activedMenu')) {
                $(el)
                    .closest('li')
                    .removeClass('activedMenu')
                    .find('.dropdown-submenu > .module-dropdownRealEstate_wrapper, .call-button-inner')
                    .slideUp()
            } else {
                $(el)
                    .closest('li')
                    .addClass('activedMenu')
                    .find('.dropdown-submenu > .module-dropdownRealEstate_wrapper, .call-button-inner')
                    .slideDown()
            }
        });
    }

    var menuHandleInit = function (el) {
        var obj = el;

        obj.each(function (index, el) {
            $(el)
                .find('.dropdown-submenu > .module-dropdownRealEstate_wrapper, .call-button-inner')
                .slideDown()
        })
    }

    var menuHandleHorizontal = function () {
        var menu = $('.module-NC_navigation'),
            label = $('.module-NC_navigation_title > label'),
            window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        if (menu.length) {
            var obj = $('.module-NC_navigation_title')
            obj.removeClass('opened')
            $('.module-NC_navigation_wrap').removeAttr('style');

            if (window_width <= 860) {
                var selected = $('.module-NC_navigation_wrap li.active').text()

                obj
                    .off()
                    .on('click', function (index, el) {
                        menuHandleHorizontalAct($(this))
                    })
                    .find('.label')
                    .html(selected)
            }
        }
    }

    var menuHandleHorizontalAct = function (el) {
        var obj = el

        if (obj.hasClass('opened')) {
            obj
                .removeClass('opened')
                .next('.module-NC_navigation_wrap')
                .slideUp()
        } else {
            obj
                .addClass('opened')
                .next('.module-NC_navigation_wrap')
                .slideDown()

        }
    }

    var parallaxEffectHandle = function () {
        var scroll = $(window).scrollTop(),
            objData = $('[data-parallax-check]')

        objData.each(function (index, el) {
            var content = $(this),
                p = content.offset(),
                top = p.top,
                m = (scroll - top),
                obj = content.find('.parallaxObj')

            if (m > 0) {
                obj.each(function (index, el) {
                    var o = $(this),
                        t = o.data('parallax-type');

                    parallaxMove(o, t, (scroll - top))
                });
            } else {
                parallaxDelete(content)
            }

        });
    }

    var parallaxMove = function (o, t, scroll) {
        if (windowWidth() > 1024) {
            switch (t) {
                case 'background':
                    var v = o.data('parallax-velocity')
                    o.css({
                        'background-attachment': 'fixed',
                        'background-position': 'center ' + -(scroll * v) + 'px',
                        'bbackground-size': 'cover'
                    })
                    break;

                case 'transform':
                    var tranform = o.data('transform-type');
                    parallaxTransform(tranform, scroll, o)

                    break;
            }
        }
    }

    var parallaxTransform = function (t, s, o) {
        var prop = '';

        $.each(t, function (index, value) {
            var mode = t[index][0],
                timing = Number(t[index][1]),
                c = s * timing


            // // transform switch case
            switch (mode) {

                // transform scale out
                case 'scaleOut':
                    if (c >= 0) {
                        c = 1 - ((c / 100).toFixed(2))
                    } else {
                        c = 1
                    }
                    var css = 'scale'
                    prop += css + '(' + c + ')'

                    break;

                    // transform scale in
                case 'scaleIn':
                    if (c >= 0) {
                        c = 1 + (Number((c / 100).toFixed(2)))
                    } else {
                        c = 1
                    }

                    var css = 'scale'
                    prop += css + '(' + c + ')'

                    break;

                    // transfor translateX
                case 'translateXIn':

                    if (c >= 1) {
                        c = -(c) + 'px'
                    } else {
                        c = 0
                    }

                    var css = 'translate'
                    prop += css + '(' + c + ')'

                    break;

                    // transfor translateX
                case 'translateXOut':

                    if (c >= 1) {
                        c = c + 'px'
                    } else {
                        c = 0
                    }

                    var css = 'translateX'
                    prop += css + '(' + c + ')'

                    break;

                    // transfor translateY IN
                case 'translateYIn':

                    if (c >= 1) {
                        c = -(c) + 'px'
                    } else {
                        c = 0
                    }

                    var css = 'translateY'
                    prop += css + '(' + c + ')'

                    break;

                    // transfor translateY OUT
                case 'translateYOut':

                    if (c >= 1) {
                        c = c + 'px'
                    } else {
                        c = 0
                    }

                    var css = 'translateY'
                    prop += css + '(' + c + ')'

                    break;

                    // transfor rotate X
                case 'rotateX':

                    if (c >= 1) {
                        c = c.toFixed(2) + 'deg'
                    } else {
                        c = 0
                    }

                    var css = mode
                    prop += css + '(' + c + ')'

                    break;

                    // transfor rotate Y
                case 'rotateY':

                    if (c >= 1) {
                        c = c.toFixed(2) + 'deg'
                    } else {
                        c = 0
                    }

                    var css = mode
                    prop += css + '(' + c + ')'

                    break;

                    // opacity
                case 'opacity':

                    if (c >= 0) {
                        c = 1 - ((c / 100).toFixed(2))
                    } else {
                        c = 1
                    }

                    o.css({
                        'opacity': c
                    })
                    break;

            }
        });

        prop += 'translateZ(0)'
        o.css({
            '-webkit-transform': prop,
            '-moz-transform': prop,
            '-ms-transform': prop,
            '-o-transform': prop,
            'transform': prop
        })
    }

    var parallaxDelete = function (o) {
        o
            .find('[data-parallax-type=background]')
            .css({
                'background-attachment': ''
                //'background-position' : 'center'
            })
        o
            .find('.parallaxObj')
            .not('[data-parallax-type=background]')
            .removeAttr('style')
    }

    var checkInView = function (obj) {
        obj.each(function (index, el) {
            if (inView($(el), .50)) {
                var o = $(el),
                    func = o.data('fn')
                eval(func)(o)
            }
        })
    }

    var inView = function (obj, time) {
        var windowH = windowHeight(),
            gridTop = windowH * time,
            //gridBottom = windowH * .6,
            thisTop = $(obj).offset().top - $(window).scrollTop();

        return (thisTop <= gridTop)
    }

    var counterLine = function (text) {
        var h = $(text).outerHeight(),
            lh = parseInt($(text).css('line-height')),
            lines = h / lh;
    }

    var splitText = function (obj) {
        if ($(obj).length) {
            $(obj).each(function (index, el) {
                var obj = $(el).find('textarea[name=hide-content]'),
                    arr = obj.val().split(' ');
                par = $(el).find('.counterLine'),
                wordSpan = ''

                $.each(arr, function (index, value) {
                    arr[index] = '<span>' + value + ' </span>';
                });


                par.html(arr.join(''));
                wordSpan = par.find('span');

                var lineArray = [],
                    lineIndex = 0,
                    lineStart = true,
                    lineEnd = false

                wordSpan.each(function (index, value) {
                    var pos = $(this).position(),
                        top = pos.top;

                    if (lineStart) {
                        lineArray[lineIndex] = [index];
                        lineStart = false;

                    } else {
                        var $next = $(this).next();

                        if ($next.length) {
                            if ($next.position().top > top) {
                                lineArray[lineIndex].push(index);
                                lineIndex++;
                                lineStart = true
                            }
                        } else {
                            lineArray[lineIndex].push(index);
                        }
                    }

                });
                $.each(lineArray, function (index, value) {
                    var start = lineArray[index][0],
                        end = lineArray[index][1] + 1;

                    if (!end) {
                        wordSpan.eq(start).wrap('<span class="line_wrap">')
                    } else {
                        wordSpan.slice(start, end).wrapAll('<span class="line_wrap">');
                    }
                })
            });
        }
    }

    var windowHeight = function () {
        var window_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return window_height
    }

    var windowWidth = function () {
        var window_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        return window_width
    }

    // witness FN
    var witness = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // gallery FN
    var gallery = function (o) {
        o.hasClass('offState') ? o.removeClass('offState') : null
    }

    // featured FN
    var featured = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // estate FN
    var estate = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // social FN
    var social = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // social FN
    var basic = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // distributor country FN
    var distributorCountry = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // highlight data FN
    var highlightData = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // promotion FN
    var promotion = function (o) {
        setTimeout(function () {
            o.hasClass('offState') ? o.removeClass('offState') : null
        }, 5);
    }

    // progress FN
    var promotionBar = function (o) {
        setTimeout(function () {
            animationBarProgress()
        }, 5);
    }

    var setGalleryHeight = function (el) {
        if ($(el).length) {
            var obj = $(el)

            obj.each(function (index, el) {
                if (windowWidth() <= 900) {
                    var getBig = $(el).find('.big'),
                        hBig = getBig.outerHeight(),
                        getSmall = $(el).find('.small')

                    if (getSmall.length) {
                        var size = getSmall.size()
                        if (size == 1) {
                            hSmall = getSmall.outerHeight() / 2
                        } else {
                            hSmall = getSmall.outerHeight()
                        }
                    } else {
                        hSmall = 0
                    }

                    var hNew = hBig + hSmall + 'px';

                    $(el)
                     .css({ 'height': hNew })
                     .addClass('reposition')

                }

                // desktop
                if (windowWidth() > 900) {
                    $(el)
                        .removeAttr('style')
                        .removeClass('reposition')
                }

                // smartphone
                if (windowWidth() <= 675) {
                    $(el)
                        .removeAttr('style');
                    createCarousel('.gallery_mobile')
                } else {
                    deleteCarousel('.gallery_mobile')
                }
            });
        }
    }

    var createCarousel = function (o) {
        var obj = $(o)
        if (obj.length) {
            if (!(obj.hasClass('slick-slider'))) {
                obj.slick({
                    arrows: false,
                    dots: true,
                    infinite: false,
                    responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }, {
                        breakpoint: 675,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                    ]
                });

                obj.on('afterChange', function (event, slick, currentSlide) {
                    if ($('.gallery_mobile_item').length) {
                        $('.gallery_mobile_item').eq(currentSlide + 1).find('.gallery_block').removeClass('offState')
                    }
                })
            }
        }
    }

    var deleteCarousel = function (o) {
        var obj = $(o)
        if (obj.length) {
            if (obj.hasClass('slick-slider')) {
                obj
                    .slick('unslick')
                    .find('.gallery_mobile_item')
                    .removeAttr('tabindex role aria-describedby style')
            }
        }
    }

    var createInstagramCarousel = function (o) {
        var obj = $(o)
        if (obj.length) {
            if (!(obj.hasClass('slick-slider'))) {
                obj.slick({
                    arrows: false,
                    dots: true,
                    infinite: false,
                    responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1
                        }
                    }, {
                        breakpoint: 500,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                    ]
                });

                obj.on('afterChange', function (event, slick, currentSlide) {
                    if ($('.gallery_mobile_item').length) {
                        $('.gallery_mobile_item').eq(currentSlide + 1).find('.gallery_block').removeClass('offState')
                    }
                })
            }
        }
    }

    var createBasicCarousel = function (o) {
        var obj = o
        if (obj.length) {
            if (!(obj.hasClass('slick-slider'))) {
                obj.slick({
                    arrows: false,
                    dots: true,
                    infinite: false,
                    centerPadding: '25px',
                    responsive: [
                    //{
                    //    breakpoint: 675,
                    //    settings: {
                    //        slidesToShow: 2,
                    //        slidesToScroll: 1
                    //    }
                        //}, 
                        {
                        breakpoint: 675,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1
                        }
                    }
                    ]
                });

                obj.on('afterChange', function (event, slick, currentSlide) {
                    if ($('.gallery_mobile_item').length) {
                        $('.gallery_mobile_item').eq(currentSlide + 1).find('.gallery_block').removeClass('offState')
                    }
                })
            }
        }
    }

    var createHighlightDataCarousel = function (o) {
        var obj = o
        if (obj.length) {
            if (!(obj.hasClass('slick-slider'))) {
                obj.slick({
                    arrows: false,
                    dots: true,
                    infinite: false,
                });
            }
        }
    }

    var galeryFancy = function () {
        $(".fancyGaleryImage").fancybox();
    }

    var startDigitCounter = function (obj, start, end, increase) {
        var s = parseInt(start),
            e = parseInt(end),
            i = parseInt(increase)

        setTimeout(function () {
            increaseDigitConunter(obj, s, e, i)
        }, 80)
    }

    var increaseDigitConunter = function (obj, start, end, increase) {

        if (start <= end) {
            start += increase
            obj.html(start.toLocaleString())
            startDigitCounter(obj, start, end, increase)
        } else {
            obj.html(end.toLocaleString())
        }
    }

    var instagramGallery = function () {
        // smartphone
        if (windowWidth() <= 1023) {
            createInstagramCarousel('.module-NC_social_instagram_gallery')
        } else {
            deleteCarousel('.module-NC_social_instagram_gallery')
        }
    }

    var setHighLightHeight = function () {
        var obj = $('.module-NC_distributor_highlight.header');
        //var obj2 = $('.fullHeight.slider-visor'),
            header = $('.header02');

        if (header.length) {
            headerHeight = header.outerHeight()
        } else {
            headerHeight = 0
        }
        var totalHeight = windowHeight() - headerHeight;

        console.log('altura:');
        console.log(totalHeight);
        obj.height = totalHeight;
        //obj2.height = totalHeight;
        obj.css('padding-top', totalHeight + 'px');
        //obj2.css('padding-top', totalHeight + 'px');
    }
    
    var openLocationSelect = function (el) {
        var trigger = el
        if (trigger.length) {
            trigger.each(function (index, el) {
                $(el)
                    .find('.location_select')
                    .off()
                    .on('change', function () {
                        changeLocationWrap($(this));
                        var index = $(this).prop('selectedIndex')
                        console.log($(this))
                        if ($(this).hasClass('location_choise')) {
                            selectCountryBySelect($(this))
                        }
                    })
            });
        }
    }

    var changeLocationWrap = function (obj) {
        obj.each(function (index, el) {
            var value = $(el).find('option:selected').text(),
                hidden = $(el).next('.hidden_value')
            hidden.text(value)
            var content_width = hidden.outerWidth(true)

            $(el)
                .closest('.select_box')
                .css({
                    'width': content_width + 'px',
                    'max-width': '100%'
                })
        });
    }

    var resetLocationWrap = function (obj, index) {
        obj.val(index).change();
        changeLocationWrap(obj);
        return true
    }

    var basicIconsGallery = function () {
        // smartphone
        var obj = $('.module-NC_basic_list')
        obj.each(function (index, el) {
            if (windowWidth() <= 900) {
                if (!($(el).hasClass('two_elements'))) {
                    createBasicCarousel($(el))
                }
                if (($(el).hasClass('three_elements'))) {
                    deleteCarousel($(el))
                }
            }
            if (windowWidth() <= 675) {
                if (!($(el).hasClass('two_elements'))) {
                    createBasicCarousel($(el))
                }
                if (($(el).hasClass('three_elements'))) {
                    deleteCarousel($(el))
                }
            }

            if (windowWidth() >= 900) {
                deleteCarousel($(el))
            }
        });
    }

    var parentWrapPadding,
        currentItemHighlight = 1
    var createCountryCarousel = function (o) {
        var obj = $(o)
        if (obj.length) {
            if (!(obj.hasClass('slick-slider'))) {
                obj.on('init', function (event, slick) {
                    parentWrapPadding = parseInt($('.module-NC_distributor_country').css("padding-bottom"))
                    navCountryFromButton()
                    highlightCountryFromSelect(0);
                    setTimeout(function () {
                        obj.slick('setPosition');
                        $('.gallery_mobile_item')
                            .eq(0)
                            .addClass('highlight')
                    }, 450)
                })

                obj.slick({
                    dots: false,
                    infinite: false,
                    variableWidth: true,
                    centerMode: true,
                    verticalSwiping: false,
                    speed: 400,
                    prevArrow: "<a class='slick-prev module-NC_distributor_country_nav'></a>",
                    nextArrow: "<a class='slick-next module-NC_distributor_country_nav'></a>"
                });

                obj.on('swipe', function (slick, direction) {
                    $('.gallery_mobile_item').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                        obj.slick('setPosition');
                    });
                })

                obj.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                    currentItemHighlight = nextSlide;
                    resetLocationWrap($('.module-NC_title_select_carousel_country .location_select'), (nextSlide + 1))
                });

                obj.on('afterChange', function (event, slick, currentSlide) {
                    if (windowWidth() < 1024) {
                        $('.gallery_mobile_item').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                            obj.slick('setPosition');
                        });
                    }

                    highlightCountryPadding($('.gallery_mobile_item').eq(currentSlide))

                })
            }
        }
    }

    var startSelectDefault = false
    var chooseCountryFromSelect = function (o) {
        var obj = $(o)
        if (obj.length) {
            var sel = parseInt(obj.find("option:selected").data('index'));

            obj.on('change', function () {
                var sel = $(this).find(":selected").data('index');
                goToCountryFromSelect(sel)
            })
        }
    }

    var goToCountryFromSelect = function (index) {
        if (!(index === undefined || index === null)) {

            if (index == currentItemHighlight) {
                $('.gallery_mobile_item').eq(index).removeClass('same')
            }

            $('.module-NC_distributor_country_list').slick('slickGoTo', index)
            highlightCountryFromSelect(index)
        }
    }

    var highlightCountryFromSelect = function (index) {
        if (!(index === undefined || index === null)) {
            $('.gallery_mobile_item.highlight')
                .removeClass('highlight')
            $('.gallery_mobile_item')
                .eq(index)
                .addClass('highlight')
            var obj = $('.gallery_mobile_item').eq(index)
            highlightCountryPadding(obj)
        }
    }

    var navCountryFromButton = function () {
        var bt = $('.module-NC_distributor_country_nav')
        if (bt.length) {
            bt
                .on('click', function () { })
        }
    }

    var highlightCountryPadding = function (obj) {
        var otherHighlight = obj.find('.module-NC_distributor_country_highlight')

        if (otherHighlight.length) {
            var otherItemSize = otherHighlight.find('>li').size(),
                otherItemHeight = otherHighlight.find('>li').outerHeight(true),
                otherHighlightHeight = otherItemSize * otherItemHeight
            $('.module-NC_distributor_country').css({ 'padding-bottom': (parentWrapPadding + otherHighlightHeight + 50) + 'px' })
        }
    }

    var highlightCountrySameItem = function (i) {
        if (startSelectDefault === false) {
            $('.gallery_mobile_item')
                .eq(i)
                .addClass('same')
                .delay(1200)
                .queue(function (next) {
                    $(this).removeClass("same");
                    next();
                });
        }
    }

    var highlightDataCheckMaxHeight = function () {
        var obj = $('.module-NC_highlight_datas_items')
        if (obj.length) {
            obj.each(function (index, el) {
                if ($(el).hasClass('two_elements')) {
                    if (windowWidth() > 675) {
                        highlightDataSetMaxHeight($(el))
                    } else {
                        $(el).find('.gallery_mobile_item').removeAttr('style')
                    }
                }

                if ($(el).hasClass('three_elements')) {
                    if (windowWidth() <= 675) {
                        highlightDataSetMaxHeight($(el))
                    } else {
                        $(el).find('.gallery_mobile_item').removeAttr('style')
                    }
                }
            });
        }
    }

    var highlightDataSetMaxHeight = function (obj) {
        obj.find('.gallery_mobile_item').removeAttr('style')
        var heights = obj.find('.gallery_mobile_item').map(function () {
            return $(this).outerHeight(true);
        }).get(),
            maxHeight = Math.max.apply(null, heights);
        obj.find('.gallery_mobile_item').css({ 'height': maxHeight + 'px' })
    }

    var highlightDataGallery = function () {
        // smartphone
        var obj = $('.module-NC_highlight_datas_items.three_elements')
        obj.each(function (index, el) {
            if (windowWidth() <= 675) {
                createHighlightDataCarousel($(el))
            } else {
                deleteCarousel($(el))
            }
        });
    }

    var openSearchLayer = function () {
        var obj = $('.module-NC_handle_search > a, .show-layer-search'),
            body = $('body')
        obj
            .off()
            .on('click', function () {
                var layer = $('.module-NC_search_layer')
                $('body')
                    .css({
                        'height': windowHeight(),
                        'overflow': 'hidden'
                    })

                if (layer.length) {

                    if (windowWidth() > 860) {
                        var ref = $(this).find('.openSearchLayer')
                        ref_offset = ref.offset(),
                        ref_w = ref.css('width'),
                        ref_h = ref.css('height'),
                        ref_t = ref_offset.top,
                        ref_l = ref_offset.left

                        layer
                            .css({
                                'display': 'block',
                                'top': ref_t + 'px',
                                'left': ref_l + 'px',
                                'width': ref_w,
                                'height': ref_h
                            })
                            .delay(80).queue(function (next) {
                                $(this)
                                    .addClass("active")
                                //.css({'height' : windowHeight() + 'px'});
                                next();
                            });

                    } else {
                        layer.addClass("active")
                    }

                    layer
                        .find('.close')
                        .off()
                        .on('click', function () {
                            if (windowWidth() > 860) {
                                layer
                                    .removeClass('active country_selected')
                                    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                                        layer.css({ 'display': 'none' })
                                    });
                            } else {
                                layer
                                .removeClass('active country_selected')
                            }

                            resetLocationWrap($('.module-NC_search_by_select .location_select'), 0)
                            $('body').removeAttr('style')
                        })

                    changeLocationWrap($('.select_box .location_select'));
                }
            })
    }

    var selectCategoryByItem = function () {
        var obj = $('.module-NC_search_layer_item')
        if (obj.length) {
            obj
                .off()
                .on('click', function () {
                    $('.module-NC_search_layer_item').removeClass('selected');
                    $(this).addClass('selected');
                    resetLocationWrap($('.module-NC_search_category_hidden .typology_select'), ($(this).closest('li').index() ))
                })
        }
    }

    var selectCountryBySelect = function (obj) {
        if (obj.length) {
            var value = obj.val()
            if (value != 0) {
                obj
                    .closest('.module-NC_search_layer, .module-NC_distributor_search')
                    .addClass('country_selected')
            } else {
                obj
                    .closest('.module-NC_search_layer, .module-NC_distributor_search')
                    .removeClass('country_selected')
            }
        }
    }

    var setPromotionHeight = function () {
        var obj = $('.module-NC_highlight_promotion_detail')
        if (obj.length) {
            var child = obj.find('> .container')
            if (windowWidth() <= 900) {
                var height = windowHeight();
                child.css({ 'min-height': height + 'px' })
            } else {
                child.removeAttr('style')
            }
        }
    }

    var getPromotionScroll = function () {
        var obj = $('.module-NC_highlight_promotion_detail_background')
        if (obj.length) {
            var fixedBar = obj.closest('.module-NC_highlight_promotion_detail').find('.module-NC_highlight_promotion_detail_fixed')
            height = obj.outerHeight(),
            off = obj.offset(),
            t = off.top,
            scroll = window.pageYOffset || document.documentElement.scrollTop

            if ((height + t) <= scroll) {
                if (!(fixedBar.hasClass('fixed'))) {
                    fixedBar.addClass('fixed')
                }
            } else {
                fixedBar.removeClass('fixed')
            }
        }
    }

    var handlePromotionMenu = function () {
        var obj = $('.module-NC_highlight_promotion_detail_nav_mobile');

        if (obj.length) {
            if (windowWidth() <= 900) {
                obj
                    .off()
                    .on('click', function () {
                        var parent = $(this).next('.module-NC_highlight_promotion_detail_nav_items')
                        if (parent.is(':visible')) {
                            parent.slideUp();
                            obj
                                .find('i')
                                .removeAttr('class')
                                .addClass('icon-menu')
                        } else {
                            parent.slideDown();
                            obj
                                .find('i')
                                .removeAttr('class')
                                .addClass('icon-close')
                        }
                    })
            }
        }
    }

    var handleBreadcrumb = function () {
        var obj = $('.breadcrumbs-container.trls')
        if (obj.length) {
            var next = obj.next('.module-NC'),
                off = next.offset(),
                t = off.top;

            obj.css({ 'top': t + 'px' })
        }
    }

    var animationBarProgress = function () {
        var obj = $('.module-NC_highlight_promotion_animation_bar')
        if (obj.length) {
            obj.find('> li').each(function (index, el) {
                var el = $(el),
                    progress = el.find('.bar_wrap').data('progress');

                el.find('.bar_wrap > span').css({ 'width': progress + '%' })
            });
        }
    }

    var setStandAloneMediaFullWidth = function () {

        $('section.standAloneMedia.full-width').each(function () {
            //var el = $(this);
            if ($(this).attr('data-parent') == '1050') {
                $(this).width($(window).width() - 5);
                $(this.parentElement).next().css('margin-bottom', $(this).height());
            } else {
                $(this).width($(window).width() - 5);
                $(this).next().css('margin-top', $(this).height());
            }
        });

    }



    /* ******************************************* */
    /* **************** EVENTS ******************* */
    /* ******************************************* */

    var onScrollPage = function () {
        accionaCyphersAppearEffect();
        parallaxEffectHandle();
        checkInView($('.inView'));
        getPromotionScroll()
    }

    var onReady = function () {
        touchDevice();
        fixIE();
        dropdownHeader();
        startSlider();
        gotoTop();
        downloadDropdown();
        populateOnResponsive();
        datePickerUI();
        //validationAdvancedSearch();
        startFancybox();
        bussinessLinesActivity();
        startOwlCarousel();
        playVideos();
        accionaCyphersAppearEffect();
        activateSelect();
        activateSelectEnergy();
        changePositionAdvancedSearch();
        hideAdvancedSearch();
        try {
            initGallery();
        } catch (err) { }
        initAudiojs();
        printPage();
        dropDownWebMap();
        storyDropdown();
        checks();
        projectFilter();
        installationSearched();
        setTimeout(function () {
            structureAdjust('.module-featuredBusinessLines .business-lines-line-title');
        }, 0);
        detectBrowser();
        // logAreaText();
        setAccordionHeight();
        showPassword();
        initCharts();
        menuHandle();
        menuHandleInit($('.newMenuHandle .primary-menu > .activedMenu'))
        menuHandleHorizontal();
        // sliderStyles();
        setStandAloneMediaFullWidth();

    };

    var onLoad = function () {
        initMasonry();
        fixAbsoluteLayerInTable();
        //Hacemos una segunda comprobaciÃ³n para iniciar masonry en ie8/9
        setTimeout(function () {
            initMasonry();
            fixAbsoluteLayerInTable();
        }, 1000);
        adjustHeight('.module-installation');
        tabs();
        // genericTabs();
        tabsCombo();
        isDraggable();
        openShareButton();
        openHeaderLayer()
        openRealEstateFilter()
        progressBar()
        checkInView($('.inView'))
        splitText('.module-NC_witness');
        splitText('.module-NC_featured');
        galeryFancy();
        instagramGallery();
        openLocationSelect($('.module-NC_title_select'));
        openLocationSelect($('.select_box'));
        changeLocationWrap($('.module-NC_title_select .location_select'));
        changeLocationWrap($('.select_box .location_select'));
        basicIconsGallery();
        createCountryCarousel('.module-NC_distributor_country_list');
        chooseCountryFromSelect('.module-NC_title_select_carousel_country');
        setHighLightHeight();
        highlightDataCheckMaxHeight();
        highlightDataGallery();
        openSearchLayer();
        selectCategoryByItem();
        setPromotionHeight();
        getPromotionScroll()
        handlePromotionMenu()
        handleBreadcrumb();
        //setStandAloneMediaFullWidth();
        //selectCountryBySelect()
    };

    var onResize = function () {
        mediaQuery();
        fixNavigation();
        cookiesClose();
        searchActions();
        fancyKewegoVideosFix();
        changePositionAdvancedSearch();
        accordion();
        adjustHeight('.module-installation');
        structureAdjust('.module-featuredBusinessLines .business-lines-line-title');
        updateAccordionHeight();
        sameHeight();

        openShareButton()
        //positionNavBullet()
        sliderStyles();
        menuHandle();
        menuHandleHorizontal()
        splitText('.module-NC_witness');
        splitText('.module-NC_featured');
        setGalleryHeight('.gallery_block');
        instagramGallery();
        basicIconsGallery();
        setHighLightHeight();
        changeLocationWrap($('.module-NC_title_select .location_select'));
        changeLocationWrap($('.select_box .location_select'));
        handlePromotionMenu()
        handleBreadcrumb();
        setStandAloneMediaFullWidth();
        //setPromotionHeight()

    };

    var onResizeWithoutInterval = function () {
        resizeSliderEvent();
        initMasonry();
        mobileDatepicker();
        fixAbsoluteLayerInTable();
        highlightDataCheckMaxHeight();
        highlightDataGallery();
        setStandAloneMediaFullWidth();
    };

    var init = function () {
        $(document).ready(function () {
            onReady();
            onResize();
            onResizeWithoutInterval();
            setTimeout(function () {
                //Owl autoHeight Fix
                owlChallenges.trigger('owl.next');
                owlChallenges.trigger('owl.prev');
            }, 50);
        });

        $(window).load(function () {
            onLoad();
        });

        $(window).resize(function () {
            onResizeWithoutInterval();
            clearTimeout(this.id);
            this.id = setTimeout(function () {
                onResize();
            }, 50);
        });
        $(window).scroll(function () {
            onScrollPage();
        });

    };

    return {
        init: init
    };

})($);

Style.init()    