//
dmfns.fn.loadPage("detail", 'raw.html', {

    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        var title = dsinfo.title;
        if (dmfns.static) {
            title = "";
            dmfns.fn.addClass("pagetitle", "fa-solid fa-location-dot");
        } else {
            dmfns.fn.removeClass("pagetitle", "fa-solid fa-location-dot");
        }
        dmfns.fn.showText("pagetitle", title);

        // Get info
        var info = dmfns.fn.getInfo(ds, id) || {};

        dmfns.fn.showText("entrytitle", info.title || '');
        dmfns.fn.showText("entrydesc", info.desc || '');
        dmfns.fn.showText("entrytext", info.text || '');

        if (info.header) dmfns.fn.showText("pagetitle", info.header);
        dmfns.fn.setOnClick("pagetitle", dmfns.clicks.goBack);

        //
        var owner = entryinfo.owner || {};
        var image = null;
        if (owner.image) {
            image = "pages/" + ds + "/entry" + id + "/" + owner.image;
        } else {
            image = "images/clear.gif";
        }
        dmfns.fn.showText("owner", owner.name || '');
        dmfns.fn.showImage("ownerimage", image || '');

        //
        if (dmfns.showCarousel) {

            var wide = dmfns.fn.isWide();

            simpleslider.getSlider({
                container: document.getElementById('carousel'),
                transitionTime: 1,
                delay: 3.5
            });

        }

        if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entry, cb) {

        // Setup
        var image = null;
        if (entry.image) {
            image = "pages/" + ds + "/entry" + id + "/" + entry.image;
            image = '<img src="' + image + '" class="img-fluid" alt="#">';
        }

        // Fill
        data = data.replace("$$image$$", image || '');

        // Build 
        shared.code.buildFood(id, "large image carousel wide noclick", function (gend) {

            // Stuff
            data = data.replace("$$info$$", gend);

            // Passback
            if (cb) cb(data);

        });

        //
        if (cb) cb(data);
    }

});