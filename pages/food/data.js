// Data
dm.fn.loadDataset("food", {

    title: "Comida",

    "ids": ["1", "2"],
    "show": ["1", "2"],

    "category":["Soda","Pizza","Mariscos"],

    buildDetail: function (data, cb) {

        //
        shared.code.buildDetail(data, cb);

    }

});