var SEROPP = require("./lib/sero-pp");
var seropp = new SEROPP();

if (typeof window !== 'undefined' && typeof window.seropp === 'undefined') {
    window.seropp = seropp;
}

module.exports = seropp;