var passport_ipfs;
const ipfs = window.IpfsApi('localhost', 5001);

function myFunction() {
    var passport_number = document.getElementById("passport_number").value.trim();
    uploadPassport(document.getElementById("passport_file").files[0]);
    setTimeout(function () {
        DocuNetContract.methods.updateCredentials(passport_number, passport_ipfs)
            .send()
            .then(result => {
                if (result.status === true) {
                    alert("Success");
                    console.log(result);
                    window.location.reload();
                }
            });
    }, 4000)
}

function uploadPassport(fle) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(fle);
    reader.onloadend = function () {
        const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
        var buf = buffer.Buffer.from(reader.result);
        ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
            if (err) {
                console.error(err)
                return
            }
            let url = `https://ipfs.io/ipfs/${result[0].hash}`
            console.log(`Url --> ${url}`);
            passport_ipfs = result[0].hash;
        })
    }
}