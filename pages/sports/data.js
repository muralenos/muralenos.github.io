// Data
dm.fn.loadDataset("sports", {

    title: "Deportes",

    "ids": ["1"],
    "show": ["1"],

    "category": ["Soccer","Beisbol"],

    buildDetail: function (data, cb) {

        //
        shared.code.buildDetail(data, cb);

    }

});