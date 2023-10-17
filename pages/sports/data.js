// Data
dm.fn.loadDataset("sports", {

    title: "Deportes",

    "ids": ["1"],
    "show": ["1"],

    buildDetail: function (data, cb) {

        //
        shared.code.buildDetail(data, cb);

    }

});