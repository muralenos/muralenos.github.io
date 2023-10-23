//
dm.fn.loadPage("detail", 'raw.html', {

    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dm.fn.showTitle(dsinfo, cb);

        // Get info
        dm.fn.fetchEntry(ds, id, function (info) {

            // Assure
            info = info || {};

            dm.fn.showText("entrytitle", info.title || '');
            dm.fn.showText("entrydesc", info.desc || '');
            dm.fn.showText("entrytext", info.pre || '');

            if (info.header) dm.fn.showText("pagetitle", info.header);

            if (dm.static) {
                dm.fn.setOnClick("pagetitle", dm.clicks.goLanding);
            } else {
                dm.fn.setOnClick("pagetitle", dm.clicks.goBack);
            }

            //
            var owner = entryinfo.owner || {};
            var image = null;
            if (owner.image) {
                image = entryinfo.URL + "/"  + owner.image;
            }
            dm.fn.showText("owner", owner.name || '');
            dm.fn.showImage("ownerimage", image || "images/clear.gif");

            //
            if (dm.showCarousel) {

                var wide = dm.fn.isWide();

                simpleslider.getSlider({
                    container: document.getElementById('carousel'),
                    transitionTime: 1,
                    delay: 3.5
                });

            }

            cb();

        });

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entry, cb) {

        // Setup
        var image = null;
        if (entry.image) {
            image = "pages/" + ds + "/entry" + id + "/" + entry.image;
            image = '<img src="' + image + '" class="img-fluid">';
        }

        // Fill
        data = data.replace("$$image$$", image || '');

        // Build 
        dm.fn.buildEntry(id, "large image carousel wide noclick", function (gend) {

            // Stuff
            data = data.replace("$$info$$", gend);

            // Passback
            if (cb) cb(data);

        }, ds);

        //
        if (cb) cb(data);
    }

});