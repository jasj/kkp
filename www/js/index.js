
var iv = [17, 50, 165, 103, 11, 143, 42, 25, 232, 171, 19, 141, 100, 248, 106, 70]
var key = [65, 107, 76, 107, 53, 118, 54, 109, 85, 107, 49, 80, 109, 65, 54, 119, 72, 55, 117, 81, 70, 99, 78, 66, 83, 72, 115, 67, 77, 49, 68, 85]
var aes = new aesjs.ModeOfOperation.cbc(key, iv)

function createHashAndKey(obj) {
    var plainText = JSON.stringify(obj)
    var hash = md5(plainText)
    var textBytes = aesjs.utils.utf8.toBytes(hash);
    var encryptedBytes = aes.encrypt(textBytes)
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return {
        k: hash,
        d: encryptedHex,
        r: obj
    }
}

var createDeposit = (sms) => {
    try{
        var fields = sms.body.match(/Ha recibido (.*?) Colones de (.*?) por SINPE Movil, (.*?)\. Comprobante (.*?)$/)
            return {
                "__action": "POST",
                "accountId": fields[3],
                "depositor": fields[2],
                "amount": parseFloat(fields[1]),
                "bankDate": sms.date_sent,
                "reference": fields[4]
            }
    }catch(e){
        return false
    }
}

function getAllSMS() {

}

function sendDeposits(deposits){
    $.post("https://xp4krg8acl.execute-api.us-east-1.amazonaws.com/wallet/add",createHashAndKey(deposits),function(data){
        console.log(data)
    },"json")
}

function startSMSReciver() {
    SMS.startWatch(function () {
        alert("leyendo SMS")
    }, function () {
        alert("error leyendo SMS")
    });

    document.addEventListener('onSMSArrive', function (e) {
        var data = e.data;
        if(["+5068705014","+50660873882","+1222"].indexOf(data.address)>-1){
            var deposit = createDeposit(data)
            if(deposit){
                sendDeposits([deposit])
                $(`<div class="sms_payment">
                <div class="sms_payment_datieme">`+(new Date(deposit.bankDate))+`</div>
                <div class="depositor">`+deposit.depositor+`<div>
                <div class="amount">`+deposit.amount+`<div>
                <div class="amount">`+deposit.reference+`<div>
                </div>`).appendTo("#body")
            }
           
        }
       
    });


}

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {

        //app.receivedEvent('deviceready');
        if (SMS) startSMSReciver();
        getAllSMS();

    }
};

app.initialize()