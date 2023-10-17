//
dm.fn.loadPage("listing", 'raw.html', {
    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dm.fn.showText("pagetitle", dsinfo.title);
        dm.fn.setOnClick("pagetitle", dm.clicks.goBack);

        cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        var lines = [];

        // Fetch data
        dsinfo.show.forEach(function (id, index) {

            //
            dm.fn.fetchEntry(ds, id, function (raw) {

                // Build
                dsinfo.buildDetail(raw, function (fmtd) {

                    // Assure
                    fmtd = '<div class="row"><div class="col-md-12"><div onclick="' + raw.callPAGE + '")><div class="tour-stats">' + (fmtd || '') + '</div></div></div></div>';

                    // Add
                    lines.push(fmtd);

                    //
                    if (lines.length >= dsinfo.show.length) {

                        // FIll
                        data = data.replace("$$detail$$", lines.join(''));

                        // And return
                        cb(data);
                    }

                }, ds);

            });

        });

        if (cb) cb(data);

    }

});