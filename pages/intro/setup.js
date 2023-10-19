//
dm.fn.loadPage("intro", 'raw.html', {

    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dm.fn.showText("pagetitle", "Guia");
        dm.fn.setOnClick("pagetitle");

        dm.fn.showText("histtitle", dm.fn.getDatasetTitle("hist"));
        dm.fn.showText("foodtitle", dm.fn.getDatasetTitle("food"));
        dm.fn.showText("othertitle", dm.fn.getDatasetTitle("other"));
        dm.fn.showText("sporttitle", dm.fn.getDatasetTitle("sports"));
        dm.fn.showText("eventtitle", dm.fn.getDatasetTitle("events"));

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

            // Pick one
            var nxt = dm.fn.pickRandom(ds, picked);
            // Save
            tbd[index] = nxt;
            // and no repeats
            if (nxt) picked.push(nxt);

        });

        // And do
        tbd.forEach(function (nxt, index) {

            //
            var id = nxt;
            var target = "$$feat" + index + "$$";
            var gend = "";

            if (id) {

                // Build 
                dm.fn.buildEntry(id, "small title image", function (gend) {

                    // Stuff
                    data = data.replace(target, gend);

                    //
                    done.push(nxt);

                    // Done?
                    if (done.length >= tbd.length) {

                        // Passback
                        if (cb) cb(data);
                    }

                });

            } else {

                // Stuff
                data = data.replace(target, gend);

                //
                done.push(nxt);

                // Done?
                if (done.length >= tbd.length) {

                    // Passback
                    if (cb) cb(data);
                }

            }
        });
    }

});