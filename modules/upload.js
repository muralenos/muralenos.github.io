// Uploader to GitHub
dm.module.upload = {

    // Repo
    repo: "https://api.github.com/repos/muralenos/muralenos.github.io/contents/",

    // My key
    API_KEY: null,

    do: function (event) {

        // Get the files
        var files = event.target.files;
        // Must have at leaest one
        if (files.length) {

            // Key?
            if (!dm.module.upload.API_KEY && files.length == 1 && files[0].name === 'github.key') {

                // Load key
                dm.module.upload.setKey(files[0]);

            } else if (!!dm.module.upload.API_KEY) {

                //
                alert("MIST HAVE GITHUB API KEY!");

            } else {

                for (const file of files) {

                    // Skip key
                    if (file.name != 'github.key') {

                        // Upload
                        dm.module.upload.doFile(file);

                    }
                }
            }

        }

    },

    setKey: function (file) {

        // Must have correct name
        if (file.name === 'github.key') {

            // Load
            dm.module.upload.readFile(file, function (data) {

                //
                var decoder = new TextDecoder("utf-8");
                data = decoder.decode(data);

                // Save
                dm.module.upload.API_KEY = data;

                // Tell user
                alert("GitHub API key has been loaded");

            });

        }

    },

    doFile: function (file) {

        // Cannot load key
        if (file.name != 'github.key') {

            // Load
            dm.module.upload.readFile(file, function (data) {

                // Convert
                var binary = '';
                var len = data.byteLength;
                for (var i = 0; i < len; i++) {
                    binary += String.fromCharCode(data[i]);
                }
                var content = window.btoa(binary);

                // Upload
                var data = JSON.stringify({
                    "message": "txt file",
                    "content": content
                });

                var config = {
                    method: 'put',
                    url: dm.module.upload.repo + file.webkitRelativePath,
                    headers: {
                        'Authorization': `Bearer ` + dm.module.upload.API_KEY,
                        'Content-Type': file.type
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

            });

        }

    },

    readFile: function (file, cb) {

        // Make a reader
        const reader = new FileReader();
        // When done
        reader.addEventListener('load', (event) => {

            //
            cb(event.target.result);

        });

        reader.addEventListener('progress', (event) => {

            //
            if (event.loaded && event.total) {

                var percent = (event.loaded / event.total) * 100;
                console.log(`Progress: ${Math.round(percent)}`);

            }

        });

        // Do
        reader.readAsArrayBuffer(file);

    },

    click: function () {

        //
        $("#uploaderh").click();

    }

};

// Loader element
$("#uploaderh").bind("change", dm.module.upload.do);
$("#uploader").show();