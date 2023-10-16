//
dmfns.fn.loadPage("intro", 'raw.html', {

    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dmfns.fn.showText("pagetitle", "Guia");
        dmfns.fn.setOnClick("pagetitle");

        dmfns.fn.showText("histtitle", dmfns.fn.getDatasetTitle("hist"));
        dmfns.fn.showText("foodtitle", dmfns.fn.getDatasetTitle("food"));
        dmfns.fn.showText("othertitle", dmfns.fn.getDatasetTitle("other"));
        dmfns.fn.showText("sporttitle", dmfns.fn.getDatasetTitle("sports"));
        dmfns.fn.showText("eventtitle", dmfns.fn.getDatasetTitle("events"));

        if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        var ds = "food";

        //
        var tbd = ["1", "2", "3"];

        // List of picjed
        var picked = [];

        // Fill each
        tbd.forEach(function (inst) {

            //
            var target = "$$feat" + inst + "$$";
            var gend = "";

            // Pick one
            var nxt = dmfns.fn.pickRandom(ds, picked);
            if (nxt) {

                // Save
                picked.push(nxt);

                // Build 
                shared.code.buildFood(nxt, "small title image", function (gend) {

                    // Stuff
                    data = data.replace(target, gend);

                    // Done?
                    if (picked.length >= tbd.length) {

                        // Passback
                        if (cb) cb(data);
                    }

                });

            } else {

                // Fake
                picked.push("0");

                // Stuff
                data = data.replace(target, gend);

                // Done?
                if (picked.length >= tbd.length) {

                    // Passback
                    if (cb) cb(data);
                }

                // Passback
                if (cb) cb(data);

            }
        });
    }

});