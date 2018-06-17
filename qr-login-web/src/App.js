import React, { Component } from 'react';
import logo from './loaded.gif';
import './App.css';
var base64 = require('base-64');
var QRCode = require('qrcode.react');

const SOCKET_SERVER = 'ws://localhost:8080';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {qrValue: 'filler',
            loaded: false};

    }

    componentDidMount() {
        let ws = new WebSocket(SOCKET_SERVER + "/ws/qr");


        ws.onopen = function()
        {
            // Web Socket is connected, send data using send()
//        ws.send("Hello Koshik");
//        alert("Message is sent...");
        };

        ws.onmessage = function (evt)
        {
            let context = this;
            let received_msg = evt.data;
            // alert(received_msg);
            received_msg = JSON.parse(received_msg);
            if (received_msg.type === 'qr')
            {
                let value = received_msg.value;

                let qrValue = base64.encode(JSON.stringify({
                    "type": "auth",
                    "session_id": value}));
                context.setState({qrValue: qrValue});

            }
            else if ((received_msg.type === 'auth')) {
                context.setState({loaded: true});
            }

        };

        ws.onclose = function()
        {
            // websocket is closed.
            // alert("Connection is closed...");
        };

        ws.onmessage = ws.onmessage.bind(this);



    }

    render() {
        return (
            <div className="App">

                <p className="App-intro">
                    {this.state.loaded ? <img src={logo} height={200}/> :
                        <QRCode
                            value={this.state.qrValue}
                            size={200}
                            bgColor={"#ffffff"}
                            fgColor={"#000000"}
                            level={"L"}
                        />

                    }
                </p>
            </div>
        );
    }
}

export default App;
