//
dmfns.fn.loadPage("map", 'raw.html', {
    load:function(pageinfo, ds, dsinfo, id, entryinfo, cb) {

    //
    dmfns.fn.showText("pagetitle", "Mapa");
    dmfns.fn.setOnClick("pagetitle", dmfns.clicks.goBack);

    if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        var iframe = '<iframe src="$$map$$" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
        iframe = iframe.replace("$$map$$", entryinfo.map);

        //
        data = data.replace("$$map$$", iframe);

        if (cb) cb(data);
    }

});