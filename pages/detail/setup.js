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
                image = entryinfo.URL + "/" + owner.image;
            }
            dm.fn.showText("owner", owner.name || '');
            dm.fn.showImage("ownerimage", image || "images/clear.gif");

            //
            var carousel = document.getElementById('carousel');
            if (carousel) {

                var wide = dm.fn.isWide();

                simpleslider.getSlider({
                    container: carousel,
                    transitionTime: 1,
                    delay: 3.5
                });

            }

            cb();

        });

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entry, cb) {

        // Setup
        var cbx = cb;
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

            // Do we have near?
            if (entry.near) {

                // Read
                dm.fn.fetch("pages/detail/near.html", function (nearpage) {

                    //
                    var neartitle = "Otros locales cercano";
                    if (entry.near.length === 1) neartitle = "Otro locale cercano";
                    nearpage = nearpage.replace("$$neartitle$$", neartitle);

                    // Empty out extras
                    if (entry.near.length <= 2) {
                        nearpage = nearpage.replace("$$nearfeat2$$", "");
                    }
                    if (entry.near.length <= 1) {
                        nearpage = nearpage.replace("$$neareat1$$", "");
                    }
                    if (entry.near.length <= 0) {
                        nearpage = nearpage.replace("$$nearfeat0$$", "");
                    }

                    // And fill data
                    data += nearpage;

                    var done = [];

                    // And do
                    entry.near.forEach(function (entryx, index) {

                        //
                        var target = "$$nearfeat" + index + "$$";
                        var gend = "";

                        if (entryx) {

                            // Build 
                            dm.fn.buildEntry(entryx, "small title image noclick", function (gend) {

                                // Stuff
                                data = data.replace(target, gend);

                                //
                                done.push(entry);

                                // Done?
                                if (done.length >= entry.near.length) {

                                    // Passback
                                    if (cbx) cbx(data);
                                }

                            }, ds);

                        } else {

                            // Stuff
                            data = data.replace(target, gend);

                            //
                            done.push(entry);

                            // Done?
                            if (done.length >= entry.near.length) {

                                // Passback
                                if (cbx) cbx(data);
                            }

                        }
                    });

                });


            } else {

                // Passback
                if (cbx) cbx(data);

            }

        }, ds);

        //
        //if (cb) cb(data);
    }

});