//
dmfns.fn.loadPage("listing", 'raw.html', {
    load: function(pageinfo, ds, dsinfo, id, entryinfo, cb) {

    //
    dmfns.fn.showText("pagetitle", dsinfo.title);
    dmfns.fn.setOnClick("pagetitle", dmfns.clicks.goBack);

    if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        if (cb) cb(data);

    }

});