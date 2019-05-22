(function() {
   
    var pastes = document.querySelectorAll("#pastes-list .item");

    for (var i = 0; i < pastes.length; i++) {
        var item = pastes[i];

        item.onclick = function() {
            window.location.href = this.getAttribute("data-url");
        };
    }

})();