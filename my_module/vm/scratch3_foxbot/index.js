const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
//const TargetType = require('../../extension-support/target-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const FoxLink = 'ws://localhost:5500';


let foxConnected = 'no';
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAZCAMAAACSL1cTAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIcUExURTeO5jaN5jWN5jaO5lih4o6/22ys3ziO5jmP5lGc40OV5DiP5kCT5USV5LTU1v//zNfp0Veg4j6S5TuQ5Uya426t39jp0aHK2E2a43iy3sHc1KTM2Pb6zf3+zNLm0qLK2L3a1JjF2UGT5TqQ5Z/I2Nzs0Onyz/f7zdvr0czi01Wf4sfg0///y+v0z1+k4bDS1vj7zdnq0enzz+rzz1mh4TSM5q3R1/X6zfv8zUuZ42+t393s0KDJ2EqZ5Gur3+Pv0Pn8zZ/J2cPd1O/2zp/J2G+u34m829zr0Ofxz1+l4T2R5bTV1fT5zTCK58bf0+jyz1ag4q7R1pzH2XGv3v7+zMvi012j4dLl0rHT1lyj4YG43PX5zYq925XD2vP4zmiq4EeX5NTn0uv0zjSN5ney3uLv0P7/zH213TOM5laf4uLu0PD3zp3H2XGv346/2sDc1Nbo0ez0zrbV1U+c42On4N3r0GWo4EKU5VKd4vz+zIS63DyR5U+b43y13Ye72+Twz+Hu0IO53HOw3r/b1Ie73D+S5azQ193s0fz9zDKL5/v9zfr8zYC43D+T5TuQ5sLd1PD2zq/S1vH3zqXM2N7t0O31zt7s0O71zs3j0lGd4+Xxz6jO163Q10WW5Gep4FCc42qq39Xn0Xiz3qLL2KfN2Hax3nq03T2S5ZHB2uz0zzqQ5vf6zX+33VOe4oa73JLB2pDB2nmz3Xiz3f///8xM7TQAAAABYktHRLPabf9+AAAACXBIWXMAADK/AAAyvwF6t4D2AAAAB3RJTUUH6AEWBAojIVAjmAAAAdRJREFUOMtjYBikgJGJCVWAiRmXUmYGJhZWNnYGZoReDk4uJkasirl5GHj5+AUEmYWEoep5RUTFxCVEOLAplpSSlpLhl5WTV1BUAitXVlFV41fX0NRiwnQGl7YOPxTo6oHkmTn0dQwMjfiNTUwxzeYwA6qTNbcAkmKWILdyW1nL2tja2Ts48mJ4lYnLiZ/f2cXVzZ2f38MTaBqzlze/D5uvkJ+Ovye6U5gDAoFuDuIwNQ125g8JDQb5LCycPyIySjc6RgjdbKZYoAvi4k0ZGBMS+fl1/ID+ZGKI0AlJMtdRE0zGiJaU1DR+g/QMRtPMLH7+7BxhU4bc4Lz8Av5Cp6JizBDnKCnl5w8vK6/Qr+T3qaquqa2rb4hpbGpuaeXBFpHcbUC3+Ie2d/DzG1p2NkZ38fN3+/T09jFii3tmnn5YcPMbRTKxyk4InDipw40RezphFpqcPWUqUKnMtOkzZjbN4p8tXD2Hv8GVCatqBsa58+YvWKiT3VJcosW0SI1/MQP3En61pThUMzAmM5kum2GznAmYajlWyBo7iq/sYOVgwANWcS0H06ZVBrLAdLB6jSk+1QxQXzGuXbdezWNDy0xGBmIAIxP3xk3cTMQpBmsgXik1AAD6SlnCT+hhZgAAADF0RVh0Q29tbWVudABQTkcgcmVzaXplZCB3aXRoIGh0dHBzOi8vZXpnaWYuY29tL3Jlc2l6ZV5J2+IAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDEtMjJUMDQ6MDY6NTgrMDA6MDBi65rcAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTAxLTIyVDA0OjA2OjU4KzAwOjAwE7YiYAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wMS0yMlQwNDoxMDozNSswMDowMC+LxH8AAAASdEVYdFNvZnR3YXJlAGV6Z2lmLmNvbaDDs1gAAAAASUVORK5CYII='
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAtCAMAAADm86mrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALTUExURTeO5jaN5jWN5jaO5jOM5kqZ5IK43X223UmY5ECT5VCb4z+T5DSM5jeP5j+T5TiP5jiO5pDA2vD2zvD3zoW63DyR5TmQ5j2R5TuQ5UaW5FOe4o/A29Xn0Yq920eX5EmY4zSN5mip4LbV1qrQ17XV1ujyz/7/zP//zOXwz7DS1rLU1q/S1lui4brY1OTwz9nq0bbW1kiY5DWO5jiP5azR1/f6zP3+zKHK2UGT5TGL52Cl4dPm0f//y+72ztrr0c/k0kqY4zKL5pPC2vH3zvf7zfj7zf7+zPL4zou920iX5JjF2fP5zefxz4C33Ii72+z1z4u+26jO1/b6zfn8zbjX1Xiz3niz3b3a1Pv8zJ/J2TOL5mep39jp0czj0lGd4yuH6Fyj4dzr0NLl0kya45zH2OrzzrvZ1S+J51Kd4sHc1J3I2VCc44e73Oz0z+71zpvH2eTvz3ey3TCK54G43I6/25zH2fX5zYK43DOM51+k4f//yuz1zvn8zM7j0zKM5mep4NHl0vv9zKHJ2EOV5ECS5azQ1/v8zfz+zMvh02ip3zGK5k+b43Sx3nmz3Z/J2Mnh0+Pvz+Luz8Db1KPL10SW5DWM5lSf4sbe04S53ESV5Iq82+Pwz7zZ1Veg4j6S5WSn4H+23K3R1sLd1Hu03Yi827nX1XOv3zqP5jCL55LB2tHm0tTn0vL3zvP5zoy+27zZ1P3+zfz9zNPn0Wap36fN2J7J2TqQ5cjg09Tm0abN18bf093s0Gqq3+Tw0Ofyz+bwz+nyz4a73KvQ1+Hu0Hax3S6J58Lc1Fih4jGL5mKm4FSe4rbV1ff7zK/S116k4Vmh4U6b47LT1t7t0HCv3yqH6Fuj4s3i08rg012j4WGm4F6l4TKL512k4crh05fE2rvY1fv9zd/t0G+t30GU5ECT5DmP5r7b1GGm4UGT5Gys3/P3zsng04m923ey3lKe4jKM5wAAALVIE5gAAADxdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCpCmekAAAACXBIWXMAADLAAAAywAEoZFrbAAAC30lEQVRIS5VVu43jMBB1tpGauIQFqAOHa0CAIjWwBBgQULyON1LMGtSAHGwPzoQFFKgBlXHvvSFlGXeBd0wOh/N5HM5I8mn9FZ3W6jd0qqo1rS+OCugkbF7hdE/avsIL+hcZlaTt//xLMUIfMNKwDcO6YX3m1GcRRPRhSJjgw0ZZuydOK8WCbvAAoZq7+sCzFYvQzQXAQDFIyln8Fx0SmA1MnUFcgzGejYYOoxB2OxMU8oOZGu604fZ0MC+GCEw1oWQGoVeIRLIqio7IEZpQ1AW+Rl/23A0lxRgO9YAigOsm8FJXDQQz1dvZ+TgkoXGk0M8xhQy/oyt26m5/vHO+u3XTWhM8dB6KubOjth1dUDe30w3FhGqanZ+9WwzxiI7484WeYtHyPnv/lqJ3kc045K6IFn7tOHYI6IlO8CX9BPBAPOawo4ceaXbQpw7593TYor98hN75t4yYu8q4yCwiA1tIqA/oc4bkmDvJ0O3BG6aFucCwMallwnnj+L7MKAy1Ozq6mtiIAH8UOTXAu4dtiq3r4th0E98b4qOr1UmRmvS7fKNwTIo3cO46F+eaTLmz5kyHSWT64FlL29Ed6TGgXoVe8RgFN7PH1YDo5xha50fEXFFDg2cn1CYItQKmFO5X14bwifa7efqZ5C5vDVWmoJPC/c7jefHr8o6YEeA0qc0FnTLfEZhwNB3gfkVm36WfBl4JPSuYJYnLNjV3vzSj/KjRW5DRSURXmBZQaADNE7mlAZ5EVzbyIIMZQ9O4nPl90HeG74luq5AyClMUVzbHnhkZoFKCXCUXRzPBCy+YFVL3KDHimSFkVzH19YQ/D22pKIYHwywtAS/oj9xzhFipinZ8suBuXZJZSJYXSRwMKioBbv8etmNE8aUsZHrbqh8LaZIgKBnTVHEkqTSP3OWF5zIbyZ5C8bPcM7r5SMrskBmRQSwk0fP7JGW+B8YhVi1VMqx7thcfVoc70OMEYqf1L0e9qrn/bSwvAAAAAElFTkSuQmCC'

/*** WEB ***/
let strDataReceved = '';
let strDataSend = '';
let startTime = Date.now();

/*** BLE ***/
const BLETimeout = 2500;
const BLESendInterval = 100;
const BLEDataStoppedError = 'foxbot extension stopped receiving data';
const BLEUUID = {
    service: 0xf005,
    rxChar: '5261da01-fa7e-42ab-850b-7c80220097cc',
    txChar: '5261da02-fa7e-42ab-850b-7c80220097cc'
};

class FoxBot {

    /**
     * Construct a EduBoyt communication object.
     * @param {Runtime} runtime - the Scratch 3.0 runtime
     * @param {string} extensionId - the id of the extension
     */

    constructor (runtime, extensionId) {

        this._runtime = runtime;
        this._runtime.registerPeripheralExtension(extensionId, this);
        this._extensionId = extensionId;        
        this._timeoutID = null;


        /*** WEB ***/
        this.ws = new WebSocket(FoxLink);
        this.ws.binaryType = 'string'; //'arraybuffer';
        
        this.ws.onopen = this.ws_openSocket;
        this.ws.onclose = this.ws_closeSocket;
        this.ws.onerror = this.ws_errorSocket;
        this.ws.onmessage = this.ws_getData;

        this.ws_sendData = this.ws_sendData.bind(this);
        this.ws_getData = this.ws_getData.bind(this);
        this.ws_openSocket = this.ws_openSocket.bind(this);
        this.ws_closeSocket = this.ws_closeSocket.bind(this);
        this.ws_errorSocket = this.ws_errorSocket.bind(this);
        
        /*** BLE ***/
        this._ble = null;

        /* A flag that is true while we are busy sending data to the BLE socket. */
        this._busy = false;
        /* ID for a timeout which is used to clear the busy flag if it has been true for a long time. */
        this._busyTimeoutID = null;
        
        //this.disconnect = this.disconnect.bind(this);
        this.reset = this.reset.bind(this);
        this._onConnect = this._onConnect.bind(this);
        this._onMessage = this._onMessage.bind(this);
    }

    /*** WEB ***/
    ws_ConnectBot() {
        const myws = new WebSocket(FoxLink);
		this.ws=myws;

        this.ws.onopen = this.ws_openSocket;
        this.ws.onclose = this.ws_closeSocket;
        this.ws.onerror = this.ws_errorSocket;
        this.ws.onmessage = this.ws_getData;

        this.ws_sendData = this.ws_sendData.bind(this);
        this.ws_getData = this.ws_getData.bind(this);
        this.ws_openSocket = this.ws_openSocket.bind(this);
        this.ws_closeSocket = this.ws_closeSocket.bind(this);
        this.ws_errorSocket = this.ws_errorSocket.bind(this);        
    }


    ws_openSocket () {
        //  console.log('WebSocket connection: ', this.ws.readyState);
        console.log('WebSocket connection Opened');
		ws.send("WebSocket connection Opened");
        foxConnected = 'yes';
    }

    ws_closeSocket () {
        console.log('WebSocket connection Closed!');
        foxConnected = 'no';
    }

    ws_errorSocket (err) {
        console.log(err);
        this.ws.close();
    }

    ws_sendData (msg) {
       this.ws.send(msg);
    }

    /* get called whenever there is new Data from the ws server. */
    ws_getData (msg) {
        strDataReceved = '';
        strDataReceved = msg.data;            
        return strDataReceved;
    }


    /*** BLE ***/
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                {services: [BLEUUID.service]}
            ]
        }, this._onConnect, this.reset);
    }

    /* Called by the runtime when user wants to connect to a certain peripheral.*/    
    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        //window.clearInterval(this._timeoutID);
        if (this._ble) {
            this._ble.disconnect();
        }

        this.reset();
    }

    reset () {
        if (this._timeoutID) {
            window.clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }
    
    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }
    
    _onConnect () {
        this._ble.read(BLEUUID.service, BLEUUID.rxChar, true, this._onMessage);
        this._timeoutID = window.setTimeout(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

     /* Process the sensor data from the incoming BLE characteristic.*/
    _onMessage(base64) {
        const data = Base64Util.base64ToUint8Array(base64);

        // this._sensors.tiltX = data[1] | (data[0] << 8);
        // if (this._sensors.tiltX > (1 << 15)) this._sensors.tiltX -= (1 << 16);
        // this._sensors.tiltY = data[3] | (data[2] << 8);
        // if (this._sensors.tiltY > (1 << 15)) this._sensors.tiltY -= (1 << 16);

        // this._sensors.buttonA = data[4];
        // this._sensors.buttonB = data[5];

        // cancel disconnect timeout and start a new one
        window.clearInterval(this._timeoutID);
        this._timeoutID = window.setInterval(
            () => this._ble.handleDisconnectError(BLEDataStoppedError),
            BLETimeout
        );
    }

    /* Send a message to the peripheral BLE socket. */
    send (command, message) {
        if (!this.isConnected()) return;
        if (this._busy) return;

        // Set a busy flag so that while we are sending a message and waiting for
        // the response, additional messages are ignored.
        this._busy = true;

        // Set a timeout after which to reset the busy flag. This is used in case
        // a BLE message was sent for which we never received a response, because
        // e.g. the peripheral was turned off after the message was sent. We reset
        // the busy flag after a while so that it is possible to try again later.
        this._busyTimeoutID = window.setTimeout(() => {
            this._busy = false;
        }, 5000);

        const output = new Uint8Array(message.length + 1);
        output[0] = command; // attach command to beginning of message
        for (let i = 0; i < message.length; i++) {
            output[i + 1] = message[i];
        }
        const data = Base64Util.uint8ArrayToBase64(output);

        this._ble.write(BLEUUID.service, BLEUUID.txChar, data, 'base64', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }

}

class Scratch3FoxBotExtension {
    
    static get EXTENSION_NAME () {
        return 'foxbot';
    }
    
    static get EXTENSION_ID () {
        return 'foxbot';
    }

    constructor (runtime) {
        this.runtime = runtime;
        this._peripheral = new FoxBot(this.runtime, Scratch3FoxBotExtension.EXTENSION_ID);
        //startTime = Date.now();
    }
    
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: Scratch3FoxBotExtension.EXTENSION_ID,
            name: Scratch3FoxBotExtension.EXTENSION_NAME,
            color1: '#378ee6',
            color2: '#f8fac8',
            
            // icons to display
            blockIconURI: blockIconURI,
            menuIconURI: menuIconURI,
            showStatusButton: true,

            // your Scratch blocks
            blocks: [                
                {
                    opcode: 'ConnectFoxBot',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'Connect Foxbot',
                        description: 'Connect Foxbot via websocket'
                    })
                },
                {
                    opcode: 'getConnected',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: 'Connection state'
                    })
                },
                '---',
                {
                    opcode: 'ChangeFace',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'Change Foxbot Face : [MODE]',
                        description: 'Change Foxbot Face'
                    }),
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'blink'
                        }
                    }
                },
                {
                    opcode: 'ChangeMotorAngle',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'Change Motor Angle : Motor id [ID], angle [VAL]',
                        description: 'Change Motor Angle'
                    }),
                    arguments: {
                        ID: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },
                        VAL: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'sendMessage',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: 'send Message [MSG]',
                        description: 'send string message'
                    }),
                    arguments: {
                        MSG: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Hi!'
                        }
                    }
                },
                {
                    opcode: 'getLastMessageReceived',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: 'last massage'
                        // default: 'get last incoming message: [MESSAGE]',
                    })
                }           
            ]
        };
    }

    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */
    
    ChangeFace (args) {
        strDataSend = 'eye both '+args.MODE+ ' 1';
        this._peripheral.ws_sendData (strDataSend);
    }

    ChangeMotorAngle (args) {
        strDataSend = 'motor an '+args.ID+' '+args.VAL;
        this._peripheral.ws_sendData (strDataSend);
    }

    sendMessage (args) {
        strDataSend = '';
        strDataSend = args.MSG;
        this._peripheral.ws_sendData (strDataSend);
    }

    getLastMessageReceived () {
        // refresh message
        return strDataReceved;
    }

    getConnected () {
        return foxConnected;
    }
}

module.exports = Scratch3FoxBotExtension;