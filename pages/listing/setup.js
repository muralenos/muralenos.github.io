//
dm.fn.loadPage("listing", 'raw.html', {

    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dm.fn.showText("pagetitle", dsinfo.title);
        dm.fn.setOnClick("pagetitle", dm.clicks.goBack);

        // Reset
        var lines = [];
        var tbd = dsinfo.show || dsinfo.ids;

        // Fetch data
        tbd.forEach(function (id, index) {

            //
            dm.fn.fetchEntry(ds, id, function (raw) {

                // Build
                dsinfo.buildDetail(raw, function (fmtd) {

                    // Assure
                    fmtd = '<div class="row"><div class="col-md-12"><div onclick="' + raw.callPAGE + '")><div class="tour-stats">' + (fmtd || '') + '</div></div></div></div>';

                    // Add
                    lines.push(fmtd);

                    //
                    if (lines.length >= tbd.length) {

                        // FIll
                        dm.fn.showText("entries", lines.join(''));

                    }

                }, ds);

            });

        });

        cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        var lines = ["Preferido", "Todo"];

        // Normal
        if (dsinfo.category) {
            // Fill
            lines = lines.concat(dsinfo.category);
        }

        // Make list
        lines.forEach(function (key, index) {
            lines[index] = "<option value='" + key + "'>" + key + "</option>";
        });

        // Fill
        data = data.replace("$$category$$", lines.join(""));

        cb(data);

    },

    refresh: function () {

        // Get the values
        var category = dm.fn.getValue("searchtype");
        var patt = dm.fn.getValue("searchtext");

        //
        var pattarray = null;
        if (patt) {
            pattarray = patt.split(' ');
        }

        // Get dataset
        var ds = dm.fn.historyDataset();
        var dsinfo = dm.datasets[ds];

        // List
        var list = [];
        var target = [];
        var cnt = 0;

        // Set the category
        switch (category) {
            case "Todo":
                list = dsinfo.ids;
                category = null;
                break;

            case "Preferido":
                list = dsinfo.show || dsindo.ids;
                category = null;
                break;

            default:
                list = dsinfo.ids;
                break;
        }

        // Loop thru list
        list.forEach(function (id) {
            // Fetch
            dm.fn.fetchEntry(dsinfo.name, id, function (raw) {
                // Assume OK
                var ok = true;

                // Category?
                if (category) {
                    // Switch
                    ok = false;
                    // Do we have a category list
                    if (raw.category) {
                        // Check it
                        ok = raw.category.indexOf(category) != -1;
                    }
                }

                // Check text?
                if (ok && pattarray) {

                    // Search text
                    var text = dm.fn.prepSearch(raw.title) + " " + dm.fn.prepSearch(raw.desc) + " " + dm.fn.prepSearch(raw.pre);

                    // Loop
                    pattarray.forEach(function (key) {
                        if (ok) ok = text.indexOf(key) != -1;
                    });

                }

                // Add to result?
                if (ok) {

                    // Build
                    dsinfo.buildDetail(raw, function (fmtd) {

                        // Assure
                        fmtd = '<div class="row"><div class="col-md-12"><div onclick="' + raw.callPAGE + '")><div class="tour-stats">' + (fmtd || '') + '</div></div></div></div>';

                        // Add
                        target.push(fmtd);

                        // Add to count
                        cnt++;

                        //
                        if (cnt >= list.length) {

                            // FIll
                            dm.fn.showText("entries", target.join(''));

                        }

                    }, ds);

                }

                // Add to count
                cnt++;

                //
                if (cnt >= list.length) {

                    // FIll
                    dm.fn.showText("entries", target.join(''));

                }
            });

        });

    }

});