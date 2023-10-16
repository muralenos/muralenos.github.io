var dmfns = {

    fn: {

        loadDataset: function (ds, data) {

            // Make room
            dmfns.datasets[ds] = dmfns.datasets[ds] || {};
            // Save fixed
            dmfns.datasets[ds].title = data.title || ds;
            dmfns.datasets[ds].ids = [];
            dmfns.datasets[ds].name = ds;

            // Create collection
            dmfns.datasets[ds].data = dmfns.db.addCollection(ds, { indices: 'id' });
            Object.keys(data.data).forEach(function (id) {

                // Fetch block
                var block = data.data[id] || {};
                // Valid?
                if (block.title) {

                    // Add
                    dmfns.datasets[ds].ids.push(id);

                    // Set the id
                    block.id = id;
                    dmfns.datasets[ds].data.insert(block);

                }

            });
        },

        pickRandom: function (ds, picked) {

            //
            var ans = null;

            // Get dataset
            var dsinfo = dmfns.datasets[ds];

            // Can try three times
            var cnt = 10;
            while (cnt && !ans) {

                //
                var rnd = Math.random();
                var raw = rnd * dsinfo.ids.length;
                var idx = Math.floor(raw);

                // Get from list
                var next = dsinfo.ids[idx];
                if (picked.indexOf(next) == -1) {
                    ans = next;
                }

                // One less
                cnt--;
            }

            return ans;

        },

        loadPage: function (name, text, cbs) {

            // Set
            dmfns.pages[name] = {
                body: text,
                callbacks: cbs
            }
        },

        showPage: function (name, ds, id) {

            // Defaults
            var pageinfo = dmfns.pages[name] || {};
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
            dmfns.history.push(history);

            // Buttons
            dmfns.fn.buttonShowHide("btns", false);

            dmfns.fn.buttonShowHide("btnback", dmfns.history.length > 2);
            dmfns.fn.buttonShowHide("btnhome", dmfns.history.length > 1);

            if (dmfns.fn.isWide()) {

                dmfns.fn.buttonShowHide("btnwho", ds != 'other' && id != '1' && !dmfns.static);
                dmfns.fn.buttonShowHide("btnblog", ds != 'blog' && !dmfns.static);

                dmfns.fn.buttonShowHide("btnx", false);


            } else {

                dmfns.fn.buttonShowHide("btnwho", false);
                dmfns.fn.buttonShowHide("btnblog", false);
                dmfns.fn.buttonShowHide("btnback", name == 'qr');

                dmfns.fn.buttonShowHide("btnx", dmfns.history.length > 1);

            }

            // Do we have a dataset?
            if (ds) {
                // Get
                dsinfo = dmfns.datasets[ds] || dsinfo;
                // Do we have an entry?
                if (id) {
                    entryinfo = dmfns.fn.getInfo(ds, id) || entryinfo;
                }
            }

            // 
            var source = "/pages/" + name + "/" + pageinfo.body;

            // 
            dmfns.fn.fetch(source, function (data) {

                //
                if (pageinfo.callbacks.pre) {

                    pageinfo.callbacks.pre(data, pageinfo, ds, dsinfo, id, entryinfo, function (data) {

                        //
                        dmfns.fn.showText("pagebody", data);

                        //
                        var cb = pageinfo.callbacks.load;
                        if (cb) cb(pageinfo, ds, dsinfo, id, entryinfo, function () { });

                    });

                } else {

                    //
                    dmfns.fn.showText("pagebody", data);

                    //
                    var cb = pageinfo.callbacks.load;
                    if (cb) cb(pageinfo, ds, dsinfo, id, entryinfo, function () { });

                }

            });

            // Top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        },

        goHome: function () {

            //
            dmfns.fn.gotoPage(0);

        },

        goBack: function () {

            //
            dmfns.fn.gotoPage(dmfns.history.length - 2);

        },

        isWide: function () {
            return window.screen.width >= 992;
        },

        gotoPage: function (id) {

            // Check to see if back
            if (id >= dmfns.history.length) id = dmfns.history.length - 1;
            if (id < 0) id = 0;

            // 
            var hist = dmfns.history[id];

            //
            if (id == 0) {
                dmfns.history = [];
            } else {
                dmfns.history = dmfns.history.slice(0, id);
            }

            //
            dmfns.fn.showPage(hist.name, hist.ds, hist.id);

        },

        showText: function (cmp, text) {

            //
            var ele = document.getElementById(cmp);
            if (ele) {
                ele.innerHTML = (text || '').replaceAll("ñ", "&#241;").replaceAll("Ñ", "&#209;");
            }

        },

        showImage: function (cmp, src) {

            //
            $("#" + cmp).attr("src", src);

        },

        setOnClick: function (cmp, cb) {

            //
            $("#" + cmp).attr("onclick", cb || dmfns.clicks.goHome);

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

        fetch: function (url, cb) {
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
                    cb(data);
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
            var dsinfo = dmfns.datasets[ds];
            // Valid?
            if (dsinfo) {
                ans = dsinfo.title;
            }
            return ans;

        },

        getInfo: function (ds, id) {

            // Default
            var info = null;
            // Get dataset
            var dsinfo = dmfns.datasets[ds];
            // Valid?
            if (dsinfo) {
                // Get collection
                var coll = dsinfo.data;
                // Valid?
                if (coll) {
                    // Get first
                    info = coll.findOne({ id: id });
                }
            }

            return info;

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

    },

    datasets: {},

    pages: {},

    history: [],

    clicks: {

        goHome: "dmfns.fn.goHome()",
        goBack: "dmfns.fn.goBack()"

    }
};

// Create database
dmfns.db = new loki('data');

// Parse params
dmfns.urlParams = new URLSearchParams(window.location.search);

// Initialize
var dmfns = {

    fn: {

        loadDataset: function (ds, data) {

            // Make room
            dmfns.datasets[ds] = dmfns.datasets[ds] || {};
            // Save fixed
            dmfns.datasets[ds].title = data.title || ds;
            dmfns.datasets[ds].ids = [];
            dmfns.datasets[ds].name = ds;

            // Create collection
            dmfns.datasets[ds].data = dmfns.db.addCollection(ds, { indices: 'id' });
            Object.keys(data.data).forEach(function (id) {

                // Fetch block
                var block = data.data[id] || {};
                // Valid?
                if (block.title) {

                    // Add
                    dmfns.datasets[ds].ids.push(id);

                    // Set the id
                    block.id = id;
                    dmfns.datasets[ds].data.insert(block);

                }

            });
        },

        pickRandom: function (ds, picked) {

            //
            var ans = null;

            // Get dataset
            var dsinfo = dmfns.datasets[ds];

            // Can try three times
            var cnt = 10;
            while (cnt && !ans) {

                //
                var rnd = Math.random();
                var raw = rnd * dsinfo.ids.length;
                var idx = Math.floor(raw);

                // Get from list
                var next = dsinfo.ids[idx];
                if (picked.indexOf(next) == -1) {
                    ans = next;
                }

                // One less
                cnt--;
            }

            return ans;

        },

        loadPage: function (name, text, cbs) {

            // Set
            dmfns.pages[name] = {
                body: text,
                callbacks: cbs
            }
        },

        showPage: function (name, ds, id) {

            // Defaults
            var pageinfo = dmfns.pages[name] || {};
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
            dmfns.history.push(history);

            // Buttons
            dmfns.fn.buttonShowHide("btns", false);

            dmfns.fn.buttonShowHide("btnback", dmfns.history.length > 2);
            dmfns.fn.buttonShowHide("btnhome", dmfns.history.length > 1);

            if (dmfns.fn.isWide()) {

                dmfns.fn.buttonShowHide("btnwho", ds != 'other' && id != '1' && !dmfns.static);
                dmfns.fn.buttonShowHide("btnblog", ds != 'blog' && !dmfns.static);

                dmfns.fn.buttonShowHide("btnx", false);


            } else {

                dmfns.fn.buttonShowHide("btnwho", false);
                dmfns.fn.buttonShowHide("btnblog", false);
                dmfns.fn.buttonShowHide("btnback", name == 'qr');

                dmfns.fn.buttonShowHide("btnx", dmfns.history.length > 1);

            }

            // Do we have a dataset?
            if (ds) {
                // Get
                dsinfo = dmfns.datasets[ds] || dsinfo;
                // Do we have an entry?
                if (id) {
                    entryinfo = dmfns.fn.getInfo(ds, id) || entryinfo;
                }
            }

            // 
            var source = "/pages/" + name + "/" + pageinfo.body;

            // 
            dmfns.fn.fetch(source, function (data) {

                //
                if (pageinfo.callbacks.pre) {

                    pageinfo.callbacks.pre(data, pageinfo, ds, dsinfo, id, entryinfo, function (data) {

                        //
                        dmfns.fn.showText("pagebody", data);

                        //
                        var cb = pageinfo.callbacks.load;
                        if (cb) cb(pageinfo, ds, dsinfo, id, entryinfo, function () { });

                    });

                } else {

                    //
                    dmfns.fn.showText("pagebody", data);

                    //
                    var cb = pageinfo.callbacks.load;
                    if (cb) cb(pageinfo, ds, dsinfo, id, entryinfo, function () { });

                }

            });

            // Top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        },

        goHome: function () {

            //
            dmfns.fn.gotoPage(0);

        },

        goBack: function () {

            //
            dmfns.fn.gotoPage(dmfns.history.length - 2);

        },

        isWide: function () {
            return window.screen.width >= 992;
        },

        gotoPage: function (id) {

            // Check to see if back
            if (id >= dmfns.history.length) id = dmfns.history.length - 1;
            if (id < 0) id = 0;

            // 
            var hist = dmfns.history[id];

            //
            if (id == 0) {
                dmfns.history = [];
            } else {
                dmfns.history = dmfns.history.slice(0, id);
            }

            //
            dmfns.fn.showPage(hist.name, hist.ds, hist.id);

        },

        showText: function (cmp, text) {

            //
            var ele = document.getElementById(cmp);
            if (ele) {
                ele.innerHTML = (text || '').replaceAll("ñ", "&#241;").replaceAll("Ñ", "&#209;");
            }

        },

        showImage: function (cmp, src) {

            //
            $("#" + cmp).attr("src", src);

        },

        setOnClick: function (cmp, cb) {

            //
            $("#" + cmp).attr("onclick", cb || dmfns.clicks.goHome);

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

        fetch: function (url, cb) {
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
                    cb(data);
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
            var dsinfo = dmfns.datasets[ds];
            // Valid?
            if (dsinfo) {
                ans = dsinfo.title;
            }
            return ans;

        },

        getInfo: function (ds, id) {

            // Default
            var info = null;
            // Get dataset
            var dsinfo = dmfns.datasets[ds];
            // Valid?
            if (dsinfo) {
                // Get collection
                var coll = dsinfo.data;
                // Valid?
                if (coll) {
                    // Get first
                    info = coll.findOne({ id: id });
                }
            }

            return info;

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

    },

    datasets: {},

    pages: {},

    history: [],

    clicks: {

        goHome: "dmfns.fn.goHome()",
        goBack: "dmfns.fn.goBack()"

    }
};

// Create database
dmfns.db = new loki('data');

// Parse params
dmfns.urlParams = new URLSearchParams(window.location.search);