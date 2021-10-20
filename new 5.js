// initializing configuration
var keystation = new Keystation();
keystation.client = "https://scan.orai.io";
keystation.lcd = "https://lcd.orai.io";
keystation.path = "44/118/0/0/0";

// The account parameter is required for users having multiple keychain accounts.
var keystationAccount = "";

// open popup window for sign-in
var prefix = "cosmos";  // Cosmos prefix: cosmos, Iris prefix: iaa
var popup = keystation.openWindow("signin", prefix);

// generate a transaction
// You can get account_number and sequence from https://lcd-cosmos-free.cosmostation.io/auth/accounts/[YOUR_COSMOS_ADDRESS]
var txJson = {"account_number":"18012","chain_id":"cosmoshub-3","fee":{"amount":[{"amount":"5000","denom":"uatom"}],"gas":"200000"},"memo":"","msgs":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"10000","denom":"uatom"}],"from_address":"cosmos1z67fshyr48pa9a6htdz4qd0zullfk6y0fgvxv7","to_address":"cosmos10nv3yj0jdxf02vxyc0tavf97fdvppdth6wmcn3"}}],"sequence":"24"};

var txJsonStr = JSON.stringify(txJson);
var popup = keystation.openWindow("transaction", txJsonStr, keystationAccount);

// add an EventListener
window.addEventListener("message", function(e) {
    if (e.origin != "https://keystation.cosmostation.io") return;
    console.log(e.data);
    // e.data.account : User's keychain account. Remember this account!
    keystationAccount = e.data.account;
} , false);