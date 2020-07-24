
var iv  = aesjs.utils.hex.toBytes("1132a5670b8f2A19e8ab138d64f86a46")
var key = aesjs.utils.utf8.toBytes("AkLk5v6mUk1PmA6wH7uQFcNBSHsCM1DU")


var encrypt = (data) => {
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const dataBytes = aesjs.utils.utf8.toBytes(data);
    const paddedData = aesjs.padding.pkcs7.pad(dataBytes);
    const encryptedBytes = aesCbc.encrypt(paddedData);
    const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return encryptedHex;
};

function createHashAndKey(obj) {
    var aes = new aesjs.ModeOfOperation.cbc(key, iv)
    var plainText = JSON.stringify(obj)
    var hash = md5(plainText) 
    return {
        d: encrypt(hash),
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
                "bankDate": sms.date_sent.toString(),
                "reference": fields[4]
            }
    }catch(e){
        return false
    }
}

function getAllSMS() {

}

async function sendDeposits(deposits){
    var rawreps = await fetch('https://xp4krg8acl.execute-api.us-east-1.amazonaws.com/wallet/add', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createHashAndKey(deposits))
})

 return await rawreps.json();
}

function startSMSReciver() {
    SMS.startWatch(function () {
        alert("leyendo SMS")
    }, function () {
        alert("error leyendo SMS")
    });

    document.addEventListener('onSMSArrive', function (e) {
        var data = e.data;
        if(["+50687065014","+50660873882","+1222","1222"].indexOf(data.address)>-1){
            var deposit = createDeposit(data)
            if(deposit){
                sendDeposits([deposit])
                $(`<div c6ass="sms_payment">
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