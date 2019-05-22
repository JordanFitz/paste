(function() {
    
    var logInButton  = document.getElementById("log-in-button");
    var logInButton2  = document.getElementById("log-in-button2");
    var logInOverlay = document.getElementById("log-in-page");

    logInButton.onclick = logInButton2.onclick = function() {
        logInOverlay.style.display = "flex";
        signUpOverlay.style.display = "none";
        formError.classList.add("hidden");
    };

    var signUpButton  = document.getElementById("sign-up-button");
    var signUpOverlay = document.getElementById("sign-up-page");
    var formError = document.getElementsByClassName("form-error")[0];

    signUpButton.onclick = function() {
        signUpOverlay.style.display = "flex";
        logInOverlay.style.display = "none";
        formError.classList.add("hidden");
    };

    signUpOverlay.onmousedown = 
    logInOverlay.onmousedown  = 
    signUpOverlay.touchstart  = 
    logInOverlay.touchstart   = function(e) {
        if(e.target === this) {
            this.style.display = "none";
            formError.classList.add("hidden");
        }
    };

    window.onsubmit = function(e) {
        e.preventDefault();

        var form = e.target;
        var data = {};

        var children = form.querySelectorAll("input:not([type='submit'])");

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            data[child.name] = child.value;
            child.classList.remove("error");
        }

        form.parentNode.querySelectorAll(".loading")[0].style.display = "flex";

        postData(form.action, data, function(error, json) {
            if(error) return;

            if(json.success) {
                window.location = window.location;
            } else {

                form.parentNode.querySelectorAll(".loading")[0].style.display = "none";

                var messageParts = [];

                for(field in json.errors) {
                    for (var i = 0; i < json.errors[field].length; i++) {
                        var error = json.errors[field][i];

                        if(field === "__all__" && error === "invalid_login") {
                            messageParts.push("incorrect username or password");
                        } else if (field === "__all__" && error !== "invalid_login"){
                            return alert(error);
                        } else {
                            form.querySelectorAll("input[name='" + field + "']")[0].classList.add("error");

                            var label = field;

                            if(label === "password1")
                                label = "password";

                            if(label === "password2")
                                label = "password (again)"

                            if(error === "required") {
                                messageParts.push(label + " is required");
                            } else if (error === "unique") {
                                messageParts.push(label + " is already in use");
                            } else if (error.indexOf("password") === 0 && messageParts.indexOf("invalid password") === -1) {
                                messageParts.push("invalid password");
                                form.querySelectorAll("input[name='password1']")[0].classList.add("error");
                            }
                        }
                    }
                }

                formError.innerHTML = "<span>" + messageParts.join(", ") + "</span>";
                formError.classList.remove("hidden");

            }
        });
    };

})();