

function getAllSMS() {

}

function startSMSReciver() {
    SMS.startWatch(function(){
        alert("leyendo SMS")
    }, function(){
        alert("error leyendo SMS")
    });

    document.addEventListener('onSMSArrive', function(e){
        var data = e.data;
         $('<div class="sms_payment"></div>').html(JSON.stringify( data )).appendTo("#body") ;
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
        if(SMS) startSMSReciver();
        getAllSMS();

    }
};
