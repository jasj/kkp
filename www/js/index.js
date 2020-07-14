

 function getAllSMS(){
     alert("running")
     var putAll = document.getElementById("putAll")
     smsreader.getAllSMS()
    .then((sms)=>{
         putAll.innerHTML =  JSON.stringify(sms)
    },
    (err)=>{
        putAll.innerHTML =  "error :("
        console.error(err);
    });
    
 }

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
   
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
  
    onDeviceReady: function() {
       
        //app.receivedEvent('deviceready');
        getAllSMS();

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
