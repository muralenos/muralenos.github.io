
var shared = {

    code: {

        contains: function (txt, patt) {

            //
            return txt.indexOf(patt) != -1;

        },

        getPage: function (name, cb) {

            //
            var url = "pages/shared/" + name + ".html";

            //
            dmfns.fn.fetch(url, cb);

        },

        buildFood: function (id, style, cb) {

            //
            var page = "entry_food";
            if (shared.code.contains(style, "wide")) {
                page += "_wide";
            }

            // Get the page
            shared.code.getPage(page, function (data) {

                //
                var ds = "food";

                // Move
                gend = data;

                // Fetch entry
                var entry = dmfns.fn.getInfo(ds, id) || {};

                // Composite
                var header = null;
                if (shared.code.contains(style, "title")) {
                    header = "<h6>" + (entry.title || '') + "</h6>";
                    header += '<p class="reserve-description">' + (entry.desc || '') + '.</p>';
                }

                var image = null;
                delete dmfns.showCarousel;
                if (entry.image && shared.code.contains(style, "image")) {
                    // Default
                    var showimage = true;
                    var prefix = "pages/" + ds + "/entry" + id + "/";
                    // Carousel?
                    if (shared.code.contains(style, "carousel")) {
                        if (entry.carousel && Array.isArray(entry.carousel) && entry.carousel.length) {
                            // Reset
                            showimage = false;
                            // Build carousel
                            var height = dmfns.fn.isWide() ? (window.screen.height / 2) + "px;" : '200px';
                            //var height = (window.screen.height / 2) + "px;";
                            var width = dmfns.fn.isWide() ? '12' : '4';
                            image = '<div id="carousel" style="width:100%; height:' + height + '" class="col-md-' + width + '">';
                            // Set
                            var list = [prefix + entry.image];
                            entry.carousel.forEach(function (name) {
                                list.push(prefix + name);
                            });
                            list.forEach(function (path) {
                                image += '<img src="' + path + '" alt="">';
                            });
                            //
                            image += '</div>';

                            //
                            dmfns.showCarousel = true;

                        }
                    }
                    if (showimage) {
                        image = prefix + entry.image;
                        image = '<img src="' + image + '" class="img-fluid" alt="">';
                    }
                    image += "<hr/>";
                }

                var addr = null;
                var addrblock = entry.address;
                if (addrblock) {
                    addr = dmfns.fn.join(", ", addrblock.street1, addrblock.street2, addrblock.nhood, addrblock.district, addrblock.canton, addrblock.province);

                    var onclick = "dmfns.fn.showPage('detail', 'food', '" + id + "')";
                }

                var phone = entry.phone || '';
                var phoneref = null;
                if (phone) phoneref = "tel:" + phone;

                var mapref = null;
                if (entry.map) {
                    mapref = "dmfns.fn.showPage('map', '" + ds + "', '" + id + "')";
                }

                var wa = null;
                if (entry.whatsapp) {
                    wa = entry.whatsapp.replace(/[^\d]/g, "");
                    if (wa.length == 8) wa = "506" + wa;
                }

                // Replace
                gend = gend.replace("$$image$$", image || '');
                gend = gend.replace("$$header$$", header || '');

                //
                var oc = null;
                if (!shared.code.contains(style, "noclick")) {
                    oc = "dmfns.fn.showPage('detail','food','" + id + "')";
                }
                gend = gend.replace("$$onclick$$", oc || '');

                // Lines
                var lines = [];

                if (addr) {
                    var line = "<li><a";
                    if (mapref) line += ' onclick="' + mapref + '">';
                    line += '<span class="fa-solid fa-location-dot"></span>';
                    line += "<p>" + addr + "</p></a></li>";

                    lines.push(line);
                }

                if (phone) {
                    var line = "<li><a";
                    if (phoneref) line += ' href="' + phoneref + '">';
                    line += '<span class="fa-solid fa-phone"></span>';
                    line += "<p>" + phone + "</p></a></li>";

                    lines.push(line);
                }

                if (wa) {
                    var line = "<li><a";
                    line += ' href="https://wa.me/' + wa + '">';
                    line += '<span class="fa fa-whatsapp"></span>';
                    line += "<p>" + entry.whatsapp + "</p></a></li>";

                    lines.push(line);
                }

                if (entry.url) {
                    var line = "<li><a";
                    line += ' href="' + entry.url + '">';
                    line += '<span class="fa-solid fa-cloud"></span>';
                    line += "<p>" + entry.url + "</p></a></li>";

                    lines.push(line);
                }

                // Handle all the info
                if (shared.code.contains(style, "large")) {

                    if (entry.menu) {

                        var menuref = "dmfns.fn.showPage('menu','food','" + id + "')";
                        var line = "<li><a";
                        line += ' onclick="' + menuref + '">';
                        line += '<span class="fa-solid fa-table-list"></span>';
                        line += "<p>Menu</p></a></li>";

                        lines.push(line);

                    }

                }

                // Do we have?
                if (lines.length) {
                    gend = gend.replace("$$details$$", "<ul>" + lines.join('') + "</ul>");
                } else {
                    gend = gend.replace("$$details$$", "");
                }

                //
                if (cb) cb(gend);

            });

        }

    }
};