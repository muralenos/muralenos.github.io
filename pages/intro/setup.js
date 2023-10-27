//
dm.fn.loadPage("intro", 'raw.html', {

    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dm.fn.showText("pagetitle", "Guia");
        dm.fn.setOnClick("pagetitle");

        dm.fn.showText("histtitle", dm.fn.getDatasetTitle("hist"));
        dm.fn.showText("histcount", dm.fn.getDatasetCount("hist"));

        dm.fn.showText("foodtitle", dm.fn.getDatasetTitle("food"));
        dm.fn.showText("foodcount", dm.fn.getDatasetCount("food"));

        dm.fn.showText("othertitle", dm.fn.getDatasetTitle("other"));
        dm.fn.showText("othercount", dm.fn.getDatasetCount("other"));

        dm.fn.showText("sporttitle", dm.fn.getDatasetTitle("sports"));
        dm.fn.showText("sportcount", dm.fn.getDatasetCount("sports"));

        dm.fn.showText("eventtitle", dm.fn.getDatasetTitle("events"));
        dm.fn.showText("eventcount", dm.fn.getDatasetCount("events"));

        if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        var ds = "food";

        //
        var tbd = ["1", "2", "3"];

        // List 
        var done = [];
        var picked = [];

        // Fill each
        tbd.forEach(function (inst, index) {

            // Setup
            var nxt = null;

            // Loop
            while (!nxt) {

                // Pick dataset
                var ds = dm.fn.pickRandomDataset();

                // Pick one
                nxt = dm.fn.pickRandomEntry(ds, picked);

                // Did we get one?
                if (nxt) {
                    // Save
                    tbd[index] = {
                        ds: ds,
                        id: nxt
                    };
                }
            }

        });

        // And do
        tbd.forEach(function (entry, index) {

            //
            var ds = entry.ds;
            var id = entry.id;
            var target = "$$feat" + index + "$$";
            var gend = "";

            if (id) {

                // Build 
                dm.fn.buildEntry(id, "small title image", function (gend) {

                    // Stuff
                    data = data.replace(target, gend);

                    //
                    done.push(entry);

                    // Done?
                    if (done.length >= tbd.length) {

                        // Passback
                        if (cb) cb(data);
                    }

                }, ds);

            } else {

                // Stuff
                data = data.replace(target, gend);

                //
                done.push(entry);

                // Done?
                if (done.length >= tbd.length) {

                    // Passback
                    if (cb) cb(data);
                }

            }
        });

    }

});