(function () {
    console.log("test");
    Office.initialize = function (reason) {
        // If you need to initialize something you can do so here. 
    };
})();
function logoutMe(event) {
    console.log('cokolwiek');
    event.completed();
}
