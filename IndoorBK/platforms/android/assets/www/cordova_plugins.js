cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
        "id": "com.pylonproducts.wifiwizard.DynamicUpdate",
        "clobbers": [
            "WifiWizard"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.pylonproducts.wifiwizard": "0.2.8"
}
// BOTTOM OF METADATA
});