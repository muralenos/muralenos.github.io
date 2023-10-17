//
dm.fn.loadPage("???", "raw.html", {

    load: function(pageinfo, ds, dsinfo, id, entryinfo, cb) {

    if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        if (cb) cb(data);
    }

});