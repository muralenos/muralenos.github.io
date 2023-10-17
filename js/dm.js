var dm = {

    fn: {

        loadDataset: function (ds, data) {

            // Make room
            info = dm.datasets[ds] || {};
            // Save fixed
            info.title = data.title || ds;
            info.ids = data.ids || [];
            info.show = data.show || data.ids;
            info.name = ds;
            info.data = {};
            info.root = "pages/" + ds + "/";
            info.buildDetail = data.buildDetail || function (data, cb) { cb(); };

            dm.datasets[ds] = info;;

        },

        pickRandom: function (ds, picked) {

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
            dm.pages[name] = {
                body: text,
                callbacks: cbs
            }
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
            var dsinfo = dm.datasets[ds];
            // Valid?
            if (dsinfo) {
                ans = dsinfo.title;
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

                            cb(data);
                        });
                    }
                } else {
                    cb({});
                }
            } else {
                cb({});
            }

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

        goHome: "dm.fn.goHome()",
        goBack: "dm.fn.goBack()",
        goLanding: "dm.fn.goLanding()"

    }
};

// Parse params
dm.urlParams = new URLSearchParams(window.location.search);

// Initialize
var dmfns = {

    fn: {

        loadDataset: function (ds, data) {

            // Make room
            dm.datasets[ds] = dm.datasets[ds] || {};
            // Save fixed
            dm.datasets[ds].title = data.title || ds;
            dm.datasets[ds].ids = [];
            dm.datasets[ds].name = ds;

            // Create collection
            dm.datasets[ds].data = dm.db.addCollection(ds, { indices: 'id' });
            Object.keys(data.data).forEach(function (id) {

                // Fetch block
                var block = data.data[id] || {};
                // Valid?
                if (block.title) {

                    // Add
                    dm.datasets[ds].ids.push(id);

                    // Set the id
                    block.id = id;
                    dm.datasets[ds].data.insert(block);

                }

            });
        },

        pickRandom: function (ds, picked) {

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
            dm.pages[name] = {
                body: text,
                callbacks: cbs
            }
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

            // Do we have a dataset?
            if (ds) {
                // Get
                dsinfo = dm.datasets[ds] || dsinfo;
                // Do we have an entry?
                if (id) {
                    entryinfo = dm.fn.getInfo(ds, id) || entryinfo;
                }
            }

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

        },

        goHome: function () {

            //
            dm.fn.gotoPage(0);

        },

        goBack: function () {

            //
            dm.fn.gotoPage(dm.history.length - 2);

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
            var dsinfo = dm.datasets[ds];
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
            var dsinfo = dm.datasets[ds];
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

        goHome: "dm.fn.goHome()",
        goBack: "dm.fn.goBack()"

    }
};

// Parse params
dm.urlParams = new URLSearchParams(window.location.search);