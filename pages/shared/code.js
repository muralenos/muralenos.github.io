/// <reference path="../../js/dm.js" />

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
            dm.fn.fetch(url, cb);

        },

        buildEntry: function (id, style, cb, dsp) {

            //
            var page = "entry_food";
            if (shared.code.contains(style, "wide")) {
                page += "_wide";
            }

            // Get the page
            shared.code.getPage(page, function (data) {

                //
                var ds = dsp || "food";

                // Move
                var gend = data;

                // Fetch entry
                dm.fn.fetchEntry(ds, id, function (rawe) {

                    // Localize
                    var entry = rawe;

                    // Composite
                    var header = null;
                    if (shared.code.contains(style, "title")) {
                        header = "<h6>" + (entry.title || '') + "</h6>";
                        header += '<p class="reserve-description">' + (entry.desc || '') + '.</p>';
                    }

                    var image = null;
                    delete dm.showCarousel;
                    if (entry.image && shared.code.contains(style, "image")) {
                        // Default
                        var showimage = true;
                        var prefix = rawe.URL + "/";
                        // Carousel?
                        if (shared.code.contains(style, "carousel")) {
                            if (entry.carousel && Array.isArray(entry.carousel) && entry.carousel.length) {
                                // Reset
                                showimage = false;
                                // Build carousel
                                var height = dm.fn.isWide() ? (window.screen.height / 2) + "px;" : '200px';
                                //var height = (window.screen.height / 2) + "px;";
                                var width = dm.fn.isWide() ? '12' : '4';
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
                                dm.showCarousel = true;

                            }
                        }
                        if (showimage) {
                            image = prefix + entry.image;
                            image = '<img src="' + image + '" class="img-fluid" alt="">';
                        }
                        image += "<hr/>";
                    }

                    //
                    //image = image || '';
                    //if (entry.pre) {
                    //    image = '<p>' + entry.pre + '</p><hr/>' + image;
                    //}

                    var addr = null;
                    var addrblock = entry.address;
                    if (addrblock) {
                        addr = dm.fn.join(", ", addrblock.street1, addrblock.street2, addrblock.nhood, addrblock.district, addrblock.canton, addrblock.province);

                        var onclick = "dm.fn.showPage('detail', 'food', '" + id + "')";
                    }

                    var phone = entry.phone || '';
                    var phoneref = null;
                    if (phone) phoneref = "tel:" + phone;

                    var mapref = null;
                    if (entry.map) {
                        mapref = "dm.fn.showPage('map', '" + ds + "', '" + id + "')";
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
                        oc = "dm.fn.showPage('detail','food','" + id + "')";
                    }
                    gend = gend.replace("$$onclick$$", oc || '');

                    // Lines
                    var lines = [];

                    if (entry.post && shared.code.contains(style, "large")){
                        lines.push("<p>" + entry.post + "</p><hr/>");
                    }

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

                            var menuref = "dm.fn.showPage('menu','food','" + id + "')";
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
                    gend = gend.replaceAll("\r", "");
                    gend = gend.replaceAll("\n", "");

                    //
                    cb(gend);

                });

            });

        },

        buildDetail: function (data, cb) {

            //
            var line = ''; 

            line += '<div class="tour-stat stat" ><img src="' + data.imageURL + '" class="tour-stat stat"></img></div>';

            line += '<div class="tour-stat stat"><h6>' + data.title + '</h6></div>';

            line += '<div class="tour-stat stat"><p class="reserve-description">' + data.desc + '</div>';

            line += '<hr/>';

            //
            cb(line);

        }

    }
};