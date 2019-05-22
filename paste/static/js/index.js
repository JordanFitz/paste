(function() {
    var keyDown = false;

    var postLoading = document.getElementsByClassName("post-loading")[0];

    function createPaste(value) {
        postLoading.style.display = "flex";

        posting = true;

        var data = {};
        data.text = value;

        var csrf = document.getElementById("post-csrf").querySelectorAll("input")[0];

        data[csrf.name] = csrf.value;

        postData("/create-paste", data, function(error, result) {
            if(error) return;

            if(result.success) {
                localStorage.removeItem("paste_value");
                textarea.value = "";
                window.location.href = result.url;
            } else {
                postLoading.style.display = "none";
            }
        });
    }

    var textarea = document.getElementsByTagName("textarea")[0];
    var popup    = document.getElementsByClassName("post")[0];
    var submitButton = document.getElementById("submit-paste");

    if(localStorage["paste_value"]) {
        if(localStorage["paste_value"].trim().length > 0)
            popup.classList.remove("hidden");

        textarea.value = localStorage["paste_value"];
    }

    submitButton.onmousedown = submitButton.touchstart = function() {
        if(textarea.value.trim().length > 0) {
            createPaste(textarea.value);
        }
    };

    textarea.onkeydown = textarea.onkeyup = function(e) {
        if(keyDown && e.type == "keyup")
            keyDown = false;

        if(!keyDown && e.type === "keydown" && e.keyCode === 13 && e.ctrlKey) {
            keyDown = true;

            e.preventDefault();
            
            if(this.value.trim().length > 0) {
                createPaste(this.value);
            }

            return;
        }

        if(localStorage["paste_value"] !== this.value)
            localStorage["paste_value"] = this.value;

        if(this.value.trim().length > 0) {
            popup.classList.remove("hidden");
        } else {
            popup.classList.add("hidden");
        }
    };
})();