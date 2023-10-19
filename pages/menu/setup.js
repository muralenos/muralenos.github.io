//
dm.fn.loadPage("menu", 'raw.html', {
    load: function (pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        dm.fn.showText("pagetitle", "Menu");
        dm.fn.setOnClick("pagetitle", dm.clicks.goBack);

        if (cb) cb();

    },
    pre: function (data, pageinfo, ds, dsinfo, id, entryinfo, cb) {

        //
        var menu = entryinfo.menu || {};

        //
        var text = '<div class="tour-menu"><div class="row"><div class="responsive-wrap"><table class="tour-menu-table">';

        // Loop thru
        Object.keys(menu).forEach(function (section) {

            //
            text += '<tr><td colspan="2" class="tour-menu-group-heading">' + section + '</td></tr>';

            //
            var entries = menu[section] || [];
            entries.forEach(function (row) {

                //
                text += '<tr><td class="tour-menu-item-name">' + (row.name || '') + '</td>';
                text += '<td class="tour-menu-item-price">&#162;' + (row.price || '') + '</td></tr>';

                text += '<tr><td colspan="2" class="tour-menu-item-desc">' + (row.desc || '') + '</td></tr>';

                text += '<tr><td colspan="2"><hr/></td></tr>';

            });

        });

        //
        text += '</table></div></div></div >';

        //
        data = data.replace("$$menu$$", text);

        if (cb) cb(data);
    }

});