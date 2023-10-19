//
dm.fn.loadPage("qr", "raw.html", {
    load:function(pageinfo, ds, dsinfo, id, entryinfo, cb) {

    //
    dm.fn.showText("pagetitle", "QR");
    dm.fn.setOnClick("pagetitle", dm.clicks.goBack);

    // Get history
    var entry = dm.history[dm.history.length - 2]; 

    //
    var url = "https://dondemingo.com" + "?name=" + entry.name + "&ds="+(entry.ds ||'') + "&id=" + (entry.id || '');

    $('#qrcode').qrcode(url);

    if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        if (cb) cb(data);
    }

});