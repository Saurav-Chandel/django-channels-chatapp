let currentRecipient = '';
let chatInput = $('#chat-input');
let chatButton = $('#btn-send');
let userList = $('#user-list');
let messageList = $('#messages');


// 222222222222222222222222
function updateUserList() {
    $.getJSON('api/v1/user/', function (data) {
        userList.children('.user').remove();
        for (let i = 0; i < data.length; i++) {
            const userItem = `<a class="list-group-item user">${data[i]['username']}</a>`;
            $(userItem).appendTo('#user-list');
        }
        $('.user').click(function () {
            userList.children('.active').removeClass('active');
            let selected = event.target;
            $(selected).addClass('active');
            setCurrentRecipient(selected.text);   // selected.text is a parameter of setCurrentRecipient(selected.text)
            
            console.log('selected textttt')
            console.log(selected.text)  //In selected.text selected user name is kept.
            console.log('selected textttt')

        });
    });
}

//shows the text msg dynamically to both the screen sender as well as reciever. and retrieves the previous chat also.
function drawMessage(message) {
    let position = 'left';
    const date = new Date(message.timestamp);
    if (message.user === currentUser) position = 'right';
    const messageItem = `
            <li class="message ${position}">
                <div class="avatar">${message.user}</div>
                    <div class="text_wrapper">
                        <div class="text">${message.body}<br>
                            <span class="small">${date}</span>
                    </div>
                </div>
            </li>`;
    $(messageItem).appendTo('#messages');
}

//44444444444444444444444444
//this function triggered when click on particular user u want to chat and retrieve all the previous chat.
//takes parameter ricipient name.
function getConversation(recipient) {
    $.getJSON(`/api/v1/message/?target=${recipient}`, function (data) {
        messageList.children('.message').remove();
        for (let i = data['results'].length - 1; i >= 0; i--) {
            drawMessage(data['results'][i]);     //retrieves the previous chat.  
        }
        messageList.animate({scrollTop: messageList.prop('scrollHeight')});
    });

}

//55555555555555555555555555555
// this function is trigred after onmessage websocket propertiy.-------
//parameter takes id of message model..
function getMessageById(message) {
    id = JSON.parse(message).message
    console.log(id)
    $.getJSON(`/api/v1/message/${id}/`, function (data) {
        if (data.user === currentRecipient ||
            (data.recipient === currentRecipient && data.user == currentUser)) {
            drawMessage(data);     
        }
        messageList.animate({scrollTop: messageList.prop('scrollHeight')});
    });
}


//takes paramters currentrecipient,body of msg that we are input in input button.
function sendMessage(recipient, body) {
    $.post('/api/v1/message/', {
        recipient: recipient,
        body: body
    }).fail(function () {
        alert('Error! Check console!');
    });
}

//333333333333333333333333333333333
//this function runs after updateuserlist()
//parameters taken(username)  which comes from updateuserlist().
function setCurrentRecipient(username) {
    currentRecipient = username;
    console.log(currentRecipient)
    getConversation(currentRecipient);
    enableInput();
}


function enableInput() {
    chatInput.prop('disabled', false);
    chatButton.prop('disabled', false);
    chatInput.focus();
}

function disableInput() {
    chatInput.prop('disabled', true);
    chatButton.prop('disabled', true);
}


//1111111111111111111
$(document).ready(function () {
    updateUserList();    
    disableInput();

 
//    let socket = new WebSocket(`ws://127.0.0.1:8000/?session_key=${sessionKey}`);
    var socket = new WebSocket(
        'ws://' + window.location.host +
        '/ws?session_key=${sessionKey}')
        console.log(sessionKey)
    chatInput.keypress(function (e) {
        if (e.keyCode == 13)
            chatButton.click();
    });


    //this function is trigred when click on send button.
    chatButton.click(function () {
        if (chatInput.val().length > 0) {
            sendMessage(currentRecipient, chatInput.val());
            chatInput.val('');
        }
    });
    
    //44444444444444444
    // this function gets the msg from consumer receive function.------444444
    socket.onmessage = function (e) {

        console.log('onnnnnnnnnmssgggggggggggg')
        console.log(e)
        console.log(e.data)
        console.log('onnnnnnnnnmssgggggggggggg')

        getMessageById(e.data);
    };
});