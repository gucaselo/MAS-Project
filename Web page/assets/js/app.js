(function ($) {
    "use strict";
    var mainApp = {

        main_fun: function () {
       
            /*====================================
            VAGAS SLIDESHOW SCRIPTS
            ======================================*/
            $(function () {
                $.vegas('slideshow', {
                    backgrounds: [
                      { src: 'assets/img/1.jpg', fade: 1000, delay: 9000 }, //CHANGE THESE IMAGES WITH YOUR ORIGINAL IMAGES
                      { src: 'assets/img/2.jpg', fade: 1000, delay: 9000 }, //THESE IMAGES ARE FOR DEMO PURPOSE ONLY YOU, CAN NOT USE THEM WITHOUT AUTHORS PERMISSION
                       { src: 'assets/img/3.jpg', fade: 1000, delay: 9000 }, 
                     
                    ]
                })('overlay', {
                    /** SLIDESHOW OVERLAY IMAGE **/
                    src: 'assets/plugins/vegas/overlays/01.png' // THERE ARE TOTAL 01 TO 15 .png IMAGES AT THE PATH GIVEN, WHICH YOU CAN USE HERE
                });

            });

       

            /*====================================
               SIDE MENU SCRIPTS BELOW 
           ======================================*/
            var menuLeft = document.getElementById('cbp-spmenu-s1'),
               menuRight = document.getElementById('cbp-spmenu-s2'),
           showLeftPush = document.getElementById('showLeftPush'),
           showRightPush = document.getElementById('showRightPush'),
           body = document.body;

            showLeftPush.onclick = function () {
                classie.toggle(this, 'active');
                classie.toggle(body, 'cbp-spmenu-push-toright');
                classie.toggle(menuLeft, 'cbp-spmenu-open');
                disableOther('showLeftPush');
            };
            showRightPush.onclick = function () {
                classie.toggle(this, 'active');
                classie.toggle(body, 'cbp-spmenu-push-toleft');
                classie.toggle(menuRight, 'cbp-spmenu-open');
                disableOther('showRightPush');
            };
            function disableOther(button) {

                if (button !== 'showLeftPush') {
                    classie.toggle(showLeftPush, 'disabled');
                }
                if (button !== 'showRightPush') {
                    classie.toggle(showRightPush, 'disabled');
                }
            }

        },

        initialization: function () {
            mainApp.main_fun();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.main_fun();
    });

}(jQuery));



