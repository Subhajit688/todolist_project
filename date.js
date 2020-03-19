// jshint esversion:6




function getDate() {
    const date = new Date();
    const option = {
        weekday: "long",
        day: "numeric",
        month: "long",

    };

    return date.toLocaleDateString("en-US", option);
}
module.exports.getDate = getDate;


function getDay() {
    const date = new Date();
    const option = {
        weekday: "long",
    };

    return date.toLocaleDateString("en-US", option);
}
module.exports.getDay = getDay;

// console.log(module.exports);

// module.exports = "Hello World";