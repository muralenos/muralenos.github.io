// Uploader to GitHub
dm.module.upload = {

    // Repo
    repo: "https://api.github.com/repos/muralenos/muralenos.github.io/contents/",

    // My key
    API_KEY: "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x",

    prep: function (cmp) {
        // TBD 
    },

    do: function (file) {

        var ext = "TBD";
        var content = base64.encode(fs.readFileSync(file).toString());

        var data = JSON.stringify({
            "message": "txt file",
            "content": content
        });

        var config = {
            method: 'put',
            url: dm.module.upload.repo + file,
            headers: {
                'Authorization': `Bearer ` + dm.module.upload.API_KEY,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};