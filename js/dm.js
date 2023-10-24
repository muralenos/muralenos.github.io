var dm = {

    fn: {

        contains: function (txt, patt) {

            //
            return txt.indexOf(patt) != -1;

        },

        loadDataset: function (ds, data) {

            // Make room
            info = dm.datasets[ds] || {};
            // Save fixed
            info.title = data.title || ds;
            info.shorttitle = data.shorttitle || '';
            info.ids = data.ids || [];
            info.category = data.category || [];
            info.show = data.show || data.ids;
            info.name = ds;
            info.data = {};
            info.root = "pages/" + ds + "/";
            info.buildDetail = data.buildDetail || function (data, cb) { cb(); };

            dm.datasets[ds] = info;;

        },

        loadAllDatasets: function () {

            // Loop thru datasets
            Object.keys(dm.datasets).forEach(function (ds) {

                //
                setTimeout(dm.fn.loadOneDataset, 250, ds);

            });

        },

        loadOneDataset: function (ds) {
            //
            var dsinfo = dm.datasets[ds];
            // How many so far
            var cnt = 0;

            // Loop thru records
            dsinfo.ids.forEach(function (id) {
                // Load
                dm.fn.fetchEntry(ds, id, function () {
                    // Add one
                    cnt++;
                    // Done?
                    if (cnt >= dsinfo.ids.length) {
                        dsinfo.loaded = true;
                    }
                });

            });

        },

        runPageCode: function (page, pgm) {
            // Get page
            var pageinfo = dm.pages[page];
            if (pageinfo) {
                var code = pageinfo.callbacks[pgm];
                if (code) code();
            }
        },

        prepSearch: function (text) {
            return (text || '').toLowerCase();
        },

        pickRandomDataset: function () {

            // Get list
            var list = Object.keys(dm.datasets);
            dm.fn.arrayRemove(list, "blog");

            //
            var rnd = Math.random();
            var raw = rnd * list.length;
            var idx = Math.floor(raw);

            //
            return list[idx];
        },

        pickRandomEntry: function (ds, picked) {

            //
            var ans = null;

            // Get dataset
            var dsinfo = dm.datasets[ds];

            // Can try three times
            var cnt = 10;
            while (cnt && !ans) {

                //
                var rnd = Math.random();
                var raw = rnd * dsinfo.ids.length;
                var idx = Math.floor(raw);

                // Get from list
                var next = dsinfo.ids[idx];

                // 
                var prev = "ds:" + next;

                if (picked.indexOf(prev) == -1) {
                    ans = next;
                    picked.push(prev);
                }

                // One less
                cnt--;
            }

            return ans;

        },

        loadPage: function (name, text, cbs) {

            // Set
            dm.pages[name] = {
                body: text,
                callbacks: cbs
            }
        },

        getPage: function (name, cb) {

            //
            var url = "pages/shared/" + name + ".html";

            //
            dm.fn.fetch(url, cb);

        },

        showPage: function (name, ds, id) {

            // Defaults
            var pageinfo = dm.pages[name] || {};
            var dsinfo = {};
            var entryinfo = {};

            // History
            var history = {
                name: name,
                ds: ds || null,
                id: id || null
            };
            history.key = JSON.stringify(history);
            // Add new
            dm.history.push(history);

            // Buttons
            dm.fn.buttonShowHide("btns", false);

            dm.fn.buttonShowHide("btnback", dm.history.length > 2);
            dm.fn.buttonShowHide("btnhome", dm.history.length > 1);

            if (dm.fn.isWide()) {

                dm.fn.buttonShowHide("btnwho", ds != 'other' && id != '1' && !dm.static);
                dm.fn.buttonShowHide("btnblog", ds != 'blog' && !dm.static);

                dm.fn.buttonShowHide("btnx", false);


            } else {

                dm.fn.buttonShowHide("btnwho", false);
                dm.fn.buttonShowHide("btnblog", false);
                dm.fn.buttonShowHide("btnback", name == 'qr');

                dm.fn.buttonShowHide("btnx", dm.history.length > 1);

            }

            // Get the stuff
            dm.fn.fetchAll(ds, id, function (s, dsinfo, id, entryinfo) {

                // 
                var source = "/pages/" + name + "/" + pageinfo.body;

                // 
                dm.fn.fetch(source, function (data) {

                    //
                    if (pageinfo.callbacks.pre) {

                        pageinfo.callbacks.pre(data, pageinfo, ds, dsinfo, id, entryinfo, function (data) {

                            //
                            dm.fn.showText("pagebody", data);

                            //
                            var cb = pageinfo.callbacks.load;
                            if (cb) cb(pageinfo, ds, dsinfo, id, entryinfo, function () { });

                        });

                    } else {

                        //
                        dm.fn.showText("pagebody", data);

                        //
                        var cb = pageinfo.callbacks.load;
                        if (cb) cb(pageinfo, ds, dsinfo, id, entryinfo, function () { });

                    }

                });

                // Top
                window.scrollTo({ top: 0, behavior: 'smooth' });

            });

        },

        goHome: function () {

            //
            dm.fn.gotoPage(0);

        },

        goBack: function () {

            //
            dm.fn.gotoPage(dm.history.length - 2);

        },

        goLanding: function () {

            //
            dm.fn.showPage('intro');

        },

        historyName: function () {
            return dm.fn.historyLast().name;
        },

        historyDataset: function () {
            return dm.fn.historyLast().ds;
        },

        historyId: function () {
            return dm.fn.historyLast().id;
        },

        historyLast: function () {
            return dm.history[dm.history.length - 1];
        },

        isWide: function () {
            return window.screen.width >= 992;
        },

        gotoPage: function (id) {

            // Check to see if back
            if (id >= dm.history.length) id = dm.history.length - 1;
            if (id < 0) id = 0;

            // 
            var hist = dm.history[id];

            //
            if (id == 0) {
                dm.history = [];
            } else {
                dm.history = dm.history.slice(0, id);
            }

            //
            dm.fn.showPage(hist.name, hist.ds, hist.id);

        },

        showText: function (cmp, text) {

            //
            var ele = document.getElementById(cmp);
            if (ele) {
                ele.innerHTML = (text || '').replaceAll("ñ", "&#241;").replaceAll("Ñ", "&#209;");
            }

        },

        showTitle: function (dsinfo, cb) {

            //
            var title = dsinfo.title;
            if (!dm.fn.isWide()) {
                title = dsinfo.shorttitle || title;
            }

            //
            if (dm.static) {
                title = "";
                dm.fn.addClass("pagetitle", "fa-solid fa-location-dot");
            } else {
                dm.fn.removeClass("pagetitle", "fa-solid fa-location-dot");
            }

            //
            dm.fn.showText("pagetitle", title);
            if (cb) dm.fn.setOnClick("pagetitle", cb);
        },

        showImage: function (cmp, src) {

            //
            $("#" + cmp).attr("src", src);

        },

        setOnClick: function (cmp, cb) {

            //
            $("#" + cmp).attr("onclick", cb || dm.clicks.goHome);

        },

        buttonShowHide: function (id, show) {

            //
            var btn = $("#" + id);

            if (show) {
                btn.show();
            } else {
                btn.hide();
            }

        },

        addClass: function (cmp, cls) {

            //
            $("#" + cmp).addClass(cls);

        },

        removeClass: function (cmp, cls) {

            //
            $("#" + cmp).removeClass(cls);

        },

        fetch: function (url, cb, fcb) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'html',
                CORS: true,
                contentType: 'application/html',
                //secure: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + btoa(""));
                },
                success: function (data) {
                    if (cb) cb(data);
                },
                error: function () {
                    if (fcb) {
                        fcb();
                    } else {
                        if (cb) cb(data);
                    }
                }
            })
        },

        onLoad: function (cb) {

            // Loader
            $(window).on("load", cb);

        },

        getDatasetTitle: function (ds) {

            // Default
            var ans = null;
            // Get dataset
            var dsinfo = dm.datasets[ds];
            // Valid?
            if (dsinfo) {
                ans = dsinfo.title;
            }
            return ans;

        },

        getDatasetCount: function (ds) {

            // Default
            var ans = null;
            // Get dataset
            var dsinfo = dm.datasets[ds];
            // Valid?
            if (dsinfo) {
                ans = dsinfo.ids.length;
                if (ans) ans += " Listado" + (ans > 1 ? "s" : "");
            }
            return ans;

        },

        fetchAll: function (ds, id, cb) {

            //
            var dsinfo = {};
            var entryinfo = {};

            //
            if (ds) {
                // Fet the dataset
                var dsinfo = dm.datasets[ds] || {};
                // Do we have an id?
                if (id) {
                    // Get the entry
                    dm.fn.fetchEntry(ds, id, function (data) {
                        cb(ds, dsinfo, id, data || {});
                    });
                } else {
                    cb(ds, dsinfo, id, entryinfo);
                }

            } else {
                cb(ds, dsinfo, id, entryinfo);
            }

        },

        fetchEntry: function (ds, id, cb) {

            // Default
            var info = null;
            // Get dataset
            var dsinfo = dm.datasets[ds];
            // Valid?
            if (dsinfo) {
                // Get collection
                var coll = dsinfo.data;
                // Valid?
                if (coll) {
                    // Get entry
                    var data = dsinfo.data[id];
                    if (data) {
                        cb(data);
                    } else {
                        dm.fn.fetch(dsinfo.root + id + "/data.json", function (data) {
                            // As JSON
                            data = JSON.parse(data);
                            // Set
                            data.URL = "pages/" + ds + "/" + id;
                            data.imageURL = data.URL + "/" + data.image;
                            data.callPAGE = "dm.fn.showPage('detail','" + ds + "','" + id + "');";
                            // Save
                            dsinfo.data[id] = data;

                            // Call extra PRE
                            if (data.prehtml) {
                                dm.fn.fetch(data.url + "/" + data.prehtml, function (text) {
                                    // Add
                                    data.pre = dm.fn.getBody(text);
                                    // Call extra POST
                                    if (data.posthtml) {
                                        dm.fn.fetch(data.url + "/" + data.posthtml, function (text) {
                                            // Add
                                            data.post = dm.fn.getBody(text);
                                            //
                                            cb(data);
                                        }, function () {
                                            cb(data);
                                        });
                                    } else {
                                        cb(data);
                                    }
                                }, function () {
                                    if (data.posthtml) {
                                        // Call extra POST
                                        dm.fn.fetch(data.url + "/" + data.posthtml, function (text) {
                                            // Add
                                            data.post = dm.fn.getBody(text);
                                            //
                                            cb(data);
                                        }, function () {
                                            cb(data);
                                        });
                                    } else {
                                        cb(data);
                                    }
                                });
                            } else {
                                cb(data);
                            }
                        });
                    }
                } else {
                    cb({});
                }
            } else {
                cb({});
            }

        },

        getBody: function (text) {
            // 
            var ans = null;
            //
            if (text) {
                // Find start of <BODY>
                var pos = text.indexOf("<body");
                if (pos != -1) {
                    // Remove
                    text = text.substr(pos + 5);
                    // Find end of <BODY>
                    pos = text.indexOf(">");
                    if (pos != -1) {
                        // Remove
                        text = text.substr(pos + 1);
                        // Find start of </BODY>
                        pos = text.indexOf("</body");
                        if (pos != -1) {
                            // Remove
                            text = text.substr(0, pos);
                        }
                    }
                }
            }
            return ans || '';
        },

        buildEntry: function (id, style, cb, dsp) {

            //
            var page = "entry_food";
            if (dm.fn.contains(style, "wide")) {
                page += "_wide";
            }

            // Get the page
            dm.fn.getPage(page, function (data) {

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
                    if (dm.fn.contains(style, "title")) {
                        header = "<h6>" + (entry.title || '') + "</h6>";
                        header += '<p class="reserve-description">' + (entry.desc || '') + '.</p>';
                    }

                    var image = null;
                    delete dm.showCarousel;
                    if (entry.image && dm.fn.contains(style, "image")) {
                        // Default
                        var showimage = true;
                        var prefix = rawe.URL + "/";
                        // Carousel?
                        if (dm.fn.contains(style, "carousel")) {
                            if (entry.carousel && Array.isArray(entry.carousel) && entry.carousel.length) {
                                // Reset
                                showimage = false;
                                // Build carousel
                                var height = dm.fn.isWide() ? (window.screen.height / 2) + "px;" : '300px';
                                //var height = (window.screen.height / 2) + "px;";
                                var width = dm.fn.isWide() ? '12' : '4';
                                image = '<div id="carousel" style="width:100%; height:' + height + '" class="col-md-' + width + '">';
                                // Set
                                var list = [prefix + entry.image];
                                entry.carousel.forEach(function (name) {
                                    if (name.indexOf(".") == -1) {
                                        list.push(prefix + name + ".jpg");
                                    } else {
                                        list.push(prefix + name);
                                    }
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

                    var addr = null;
                    var addrblock = entry.address;
                    if (addrblock) {
                        addr = dm.fn.join(", ", addrblock.street1, addrblock.street2, addrblock.nhood, addrblock.district, addrblock.canton, addrblock.province);

                        var onclick = "dm.fn.showPage('detail', '" + ds + "', '" + id + "')";
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
                    if (!dm.fn.contains(style, "noclick")) {
                        oc = "dm.fn.showPage('detail','" + ds + "','" + id + "')";
                    }
                    gend = gend.replace("$$onclick$$", oc || '');

                    // Lines
                    var lines = [];

                    if (entry.post && dm.fn.contains(style, "large")) {
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
                        var line = "<li>";
                        line += '<a href="https://wa.me/' + wa + '">';
                        line += '<span class="fa fa-whatsapp"></span>';
                        line += "<p>" + entry.whatsapp + "</p></a></li>";

                        lines.push(line);
                    }

                    if (entry.url) {
                        var line = "<li>";
                        line += '<a href="' + entry.url + '" target="_blank">';
                        line += '<span class="fa-solid fa-cloud"></span>';
                        line += "<p>" + (entry.urllabel || entry.url) + "</p></a></li>";

                        lines.push(line);
                    }

                    // Handle all the info
                    if (dm.fn.contains(style, "large")) {

                        if (entry.date) {
                            var line = "<li>";
                            line += '<span class="fa-solid fa-calendar-days"></span><p>';
                            if (typeof entry.date == 'string') {
                                line += dm.fn.formatDate(entry.date);
                            } else {
                                var date = entry.date || {};
                                if (date.start) line += "De " + dm.fn.formatDate(date.start);
                                if (date.end) line += " A " + dm.fn.formatDate(date.end);
                            }
                            line += "</p></li>";

                            lines.push(line);
                        }

                        if (entry.hours) {
                            var line = "<li>";
                            line += '<span class="fa-solid fa-clock"></span>Horario<table>';

                            // 
                            Object.keys(entry.hours).forEach(function (day) {
                                var row = entry.hours[day];
                                line += '<tr><td><span class="ti-space"></span></td><td>' + day + '</td><td>&nbsp;&nbsp;</td><td>' + row[0] + '</td><td>-</td><td>' + row[1] + '</td></tr>';
                            });

                            line += "</table></li>";

                            lines.push(line);
                        }

                        if (entry.menu) {

                            var menuref = "dm.fn.showPage('menu','" + ds + "','" + id + "')";
                            var line = "<li><a";
                            line += ' onclick="' + menuref + '">';
                            line += '<span class="fa-solid fa-table-list"></span>';
                            line += "<p>Menu</p></a></li>";

                            lines.push(line);

                        }

                    }

                    // Do we have?
                    if (lines.length) {
                        lines = "<ul>" + lines.join('') + "</ul>";
                    } else {
                        lines = "";
                    }

                    if (dm.fn.contains(style, "large")) {
                        // Options
                        if (entry.options) {
                            //
                            lines += '<div class="row"><hr/>';
                            //
                            entry.options.forEach(function (option) {
                                //
                                lines += '<div class="col-md-4"><label class="custom-checkbox"><span class="ti-check-box"></span><span class="custom-control-description">';
                                lines += option;
                                lines += '</span></label></div>';
                            });

                            //
                            if (entry.wheelchair) {
                                //
                                lines += '<div class="col-md-4"><label class="custom-checkbox"><span class="ti-wheelchair"></span><span class="custom-control-description">';
                                lines += entry.wheelchair;
                                lines += '</span></label></div>';
                            }

                            lines += '</div>';
                        }

                        // Languages
                        if (entry.languages) {
                            var value = entry.languages;
                            if (!Array.isArray(value)) {
                                value = [value];
                            }

                            //
                            lines += '<div class="row"><hr/>';

                            //
                            value.forEach(function (lang) {
                                //
                                var def = dm.langnames[lang];
                                if (def) {
                                    //
                                    lines += '<div class="col-md-4"><label><span class="lang-icon lang-icon-' + lang + '"></span><span class="custom-control-description">';
                                    lines += def.nameNative;
                                    lines += '</span></label></div>';
                                }

                            });

                            lines += '</div>';
                        }
                    }

                    // Fill
                    gend = gend.replace("$$details$$", lines);

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

        },

        setImage: function (cmp, ds, id, entry) {

            //
            var name = ds + "/img_" + id;
            if (entry) name += "_" + entry;

            // Get the image area
            var area = $("#" + cmp);
            // Set
            area.attr("src", name + ".jpg");

        },

        getValue: function (cmp) {
            return $("#" + cmp).val();

        },

        setValue: function (cmp, value) {
            return $("#" + cmp).val(value);

        },

        ifEmpty: function (a, b) {

            var ans = a;
            if (!a) ans = b;

            return ans;

        },

        setFixedScroll: function () {

            $(window).on("scroll", function () {
                // 100 = The point you would like to fade the nav in.

                if ($(window).scrollTop() > 100) {

                    $('.fixed').addClass('is-sticky');

                } else {

                    $('.fixed').removeClass('is-sticky');

                };
            });

        },

        join: function () {

            //
            var ans = "";

            var delim = arguments[0];

            for (var idx = 1; idx < arguments.length; idx++) {
                var piece = arguments[idx];
                if (piece) {
                    if (ans) ans += delim;
                    ans += arguments[idx];
                }
            }

            return ans;

        },

        capWord: function (text) {

            const words = text.split(" ");

            for (var i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].substr(1);
            }

            return words.join(" ");
        },

        formatDate: function (date) {
            // Assure value
            date = date || '';
            // Assure time
            if (date.indexOf(":") == -1) date += " 0:0:0";
            // Convert
            return dm.fn.capWord(new Date(date).toLocaleDateString('es', { weekday: "long", year: "numeric", month: "long", day: "numeric" }));

        },

        arrayRemove: function (array, value) {
            var index = array.indexOf(value);
            if (index !== -1) {
                array.splice(index, 1);
            }
        }

    },

    datasets: {},

    pages: {},

    history: [],

    clicks: {

        goHome: "dm.fn.goHome()",
        goBack: "dm.fn.goBack()",
        goLanding: "dm.fn.goLanding()"

    }
};

// Parse params
dm.urlParams = new URLSearchParams(window.location.search);