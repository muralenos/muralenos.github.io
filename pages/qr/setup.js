//
dmfns.fn.loadPage("qr", "raw.html", {
    load:function(pageinfo, ds, dsinfo, id, entryinfo, cb) {

    //
    dmfns.fn.showText("pagetitle", "QR");
    dmfns.fn.setOnClick("pagetitle", dmfns.clicks.goBack);

    // Get history
    var entry = dmfns.history[dmfns.history.length - 2]; 

    //
    var url =window.location.host + "?name=" + entry.name + "&ds="+(entry.ds ||'') + "&id=" + (entry.id || '');

    $('#qrcode').qrcode(url);

    if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        if (cb) cb(data);
    }

});