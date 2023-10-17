// Data
dm.fn.loadDataset("blog", {

    title: "Blog",

    "ids": ["1"],
    "show": ["1"],

    buildDetail: function (data, cb) {

        //
        shared.code.buildDetail(data, cb);

    }

});