const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
//const TargetType = require('../../extension-support/target-type');
const formatMessage = require('format-message');

const log = require('../../util/log');
const cast = require('../../util/cast');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

const FoxLink = 'ws://localhost:5500';
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAZCAMAAACSL1cTAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIcUExURTeO5jaN5jWN5jaO5lih4o6/22ys3ziO5jmP5lGc40OV5DiP5kCT5USV5LTU1v//zNfp0Veg4j6S5TuQ5Uya426t39jp0aHK2E2a43iy3sHc1KTM2Pb6zf3+zNLm0qLK2L3a1JjF2UGT5TqQ5Z/I2Nzs0Onyz/f7zdvr0czi01Wf4sfg0///y+v0z1+k4bDS1vj7zdnq0enzz+rzz1mh4TSM5q3R1/X6zfv8zUuZ42+t393s0KDJ2EqZ5Gur3+Pv0Pn8zZ/J2cPd1O/2zp/J2G+u34m829zr0Ofxz1+l4T2R5bTV1fT5zTCK58bf0+jyz1ag4q7R1pzH2XGv3v7+zMvi012j4dLl0rHT1lyj4YG43PX5zYq925XD2vP4zmiq4EeX5NTn0uv0zjSN5ney3uLv0P7/zH213TOM5laf4uLu0PD3zp3H2XGv346/2sDc1Nbo0ez0zrbV1U+c42On4N3r0GWo4EKU5VKd4vz+zIS63DyR5U+b43y13Ye72+Twz+Hu0IO53HOw3r/b1Ie73D+S5azQ193s0fz9zDKL5/v9zfr8zYC43D+T5TuQ5sLd1PD2zq/S1vH3zqXM2N7t0O31zt7s0O71zs3j0lGd4+Xxz6jO163Q10WW5Gep4FCc42qq39Xn0Xiz3qLL2KfN2Hax3nq03T2S5ZHB2uz0zzqQ5vf6zX+33VOe4oa73JLB2pDB2nmz3Xiz3f///8xM7TQAAAABYktHRLPabf9+AAAACXBIWXMAADK/AAAyvwF6t4D2AAAAB3RJTUUH6AEWBAojIVAjmAAAAdRJREFUOMtjYBikgJGJCVWAiRmXUmYGJhZWNnYGZoReDk4uJkasirl5GHj5+AUEmYWEoep5RUTFxCVEOLAplpSSlpLhl5WTV1BUAitXVlFV41fX0NRiwnQGl7YOPxTo6oHkmTn0dQwMjfiNTUwxzeYwA6qTNbcAkmKWILdyW1nL2tja2Ts48mJ4lYnLiZ/f2cXVzZ2f38MTaBqzlze/D5uvkJ+Ovye6U5gDAoFuDuIwNQ125g8JDQb5LCycPyIySjc6RgjdbKZYoAvi4k0ZGBMS+fl1/ID+ZGKI0AlJMtdRE0zGiJaU1DR+g/QMRtPMLH7+7BxhU4bc4Lz8Av5Cp6JizBDnKCnl5w8vK6/Qr+T3qaquqa2rb4hpbGpuaeXBFpHcbUC3+Ie2d/DzG1p2NkZ38fN3+/T09jFii3tmnn5YcPMbRTKxyk4InDipw40RezphFpqcPWUqUKnMtOkzZjbN4p8tXD2Hv8GVCatqBsa58+YvWKiT3VJcosW0SI1/MQP3En61pThUMzAmM5kum2GznAmYajlWyBo7iq/sYOVgwANWcS0H06ZVBrLAdLB6jSk+1QxQXzGuXbdezWNDy0xGBmIAIxP3xk3cTMQpBmsgXik1AAD6SlnCT+hhZgAAADF0RVh0Q29tbWVudABQTkcgcmVzaXplZCB3aXRoIGh0dHBzOi8vZXpnaWYuY29tL3Jlc2l6ZV5J2+IAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDEtMjJUMDQ6MDY6NTgrMDA6MDBi65rcAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTAxLTIyVDA0OjA2OjU4KzAwOjAwE7YiYAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wMS0yMlQwNDoxMDozNSswMDowMC+LxH8AAAASdEVYdFNvZnR3YXJlAGV6Z2lmLmNvbaDDs1gAAAAASUVORK5CYII='
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAtCAMAAADm86mrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALTUExURTeO5jaN5jWN5jaO5jOM5kqZ5IK43X223UmY5ECT5VCb4z+T5DSM5jeP5j+T5TiP5jiO5pDA2vD2zvD3zoW63DyR5TmQ5j2R5TuQ5UaW5FOe4o/A29Xn0Yq920eX5EmY4zSN5mip4LbV1qrQ17XV1ujyz/7/zP//zOXwz7DS1rLU1q/S1lui4brY1OTwz9nq0bbW1kiY5DWO5jiP5azR1/f6zP3+zKHK2UGT5TGL52Cl4dPm0f//y+72ztrr0c/k0kqY4zKL5pPC2vH3zvf7zfj7zf7+zPL4zou920iX5JjF2fP5zefxz4C33Ii72+z1z4u+26jO1/b6zfn8zbjX1Xiz3niz3b3a1Pv8zJ/J2TOL5mep39jp0czj0lGd4yuH6Fyj4dzr0NLl0kya45zH2OrzzrvZ1S+J51Kd4sHc1J3I2VCc44e73Oz0z+71zpvH2eTvz3ey3TCK54G43I6/25zH2fX5zYK43DOM51+k4f//yuz1zvn8zM7j0zKM5mep4NHl0vv9zKHJ2EOV5ECS5azQ1/v8zfz+zMvh02ip3zGK5k+b43Sx3nmz3Z/J2Mnh0+Pvz+Luz8Db1KPL10SW5DWM5lSf4sbe04S53ESV5Iq82+Pwz7zZ1Veg4j6S5WSn4H+23K3R1sLd1Hu03Yi827nX1XOv3zqP5jCL55LB2tHm0tTn0vL3zvP5zoy+27zZ1P3+zfz9zNPn0Wap36fN2J7J2TqQ5cjg09Tm0abN18bf093s0Gqq3+Tw0Ofyz+bwz+nyz4a73KvQ1+Hu0Hax3S6J58Lc1Fih4jGL5mKm4FSe4rbV1ff7zK/S116k4Vmh4U6b47LT1t7t0HCv3yqH6Fuj4s3i08rg012j4WGm4F6l4TKL512k4crh05fE2rvY1fv9zd/t0G+t30GU5ECT5DmP5r7b1GGm4UGT5Gys3/P3zsng04m923ey3lKe4jKM5wAAALVIE5gAAADxdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCpCmekAAAACXBIWXMAADLAAAAywAEoZFrbAAAC30lEQVRIS5VVu43jMBB1tpGauIQFqAOHa0CAIjWwBBgQULyON1LMGtSAHGwPzoQFFKgBlXHvvSFlGXeBd0wOh/N5HM5I8mn9FZ3W6jd0qqo1rS+OCugkbF7hdE/avsIL+hcZlaTt//xLMUIfMNKwDcO6YX3m1GcRRPRhSJjgw0ZZuydOK8WCbvAAoZq7+sCzFYvQzQXAQDFIyln8Fx0SmA1MnUFcgzGejYYOoxB2OxMU8oOZGu604fZ0MC+GCEw1oWQGoVeIRLIqio7IEZpQ1AW+Rl/23A0lxRgO9YAigOsm8FJXDQQz1dvZ+TgkoXGk0M8xhQy/oyt26m5/vHO+u3XTWhM8dB6KubOjth1dUDe30w3FhGqanZ+9WwzxiI7484WeYtHyPnv/lqJ3kc045K6IFn7tOHYI6IlO8CX9BPBAPOawo4ceaXbQpw7593TYor98hN75t4yYu8q4yCwiA1tIqA/oc4bkmDvJ0O3BG6aFucCwMallwnnj+L7MKAy1Ozq6mtiIAH8UOTXAu4dtiq3r4th0E98b4qOr1UmRmvS7fKNwTIo3cO46F+eaTLmz5kyHSWT64FlL29Ed6TGgXoVe8RgFN7PH1YDo5xha50fEXFFDg2cn1CYItQKmFO5X14bwifa7efqZ5C5vDVWmoJPC/c7jefHr8o6YEeA0qc0FnTLfEZhwNB3gfkVm36WfBl4JPSuYJYnLNjV3vzSj/KjRW5DRSURXmBZQaADNE7mlAZ5EVzbyIIMZQ9O4nPl90HeG74luq5AyClMUVzbHnhkZoFKCXCUXRzPBCy+YFVL3KDHimSFkVzH19YQ/D22pKIYHwywtAS/oj9xzhFipinZ8suBuXZJZSJYXSRwMKioBbv8etmNE8aUsZHrbqh8LaZIgKBnTVHEkqTSP3OWF5zIbyZ5C8bPcM7r5SMrskBmRQSwk0fP7JGW+B8YhVi1VMqx7thcfVoc70OMEYqf1L0e9qrn/bSwvAAAAAElFTkSuQmCC'

/**************************************************/
// has an websocket message already been received
let alerted = false;

let connection_pending = false;

// general outgoing websocket message holder
let msg = null;

// flag to indicate if the user connected to a board
let connected = false;

// flag to indicate if a websocket connect was
// ever attempted.
let connect_attempt = false;
let wait_open = [];

let the_locale = null;

let ws_ip_address = '127.0.0.1';

/**************************************************/

let foxConnected = true;

/*** WEB ***/
let strDataReceved = '';
let strDataSend = '';
let startTime = Date.now();

/*** BLE ***/
const BLETimeout = 4500;
const BLESendInterval = 100;
const BLEDataStoppedError = 'foxbot extension stopped receiving data';
const BLEUUID = {
    service: '018dc080-cddb-7bc5-b08f-8761c95e0509',
    rxChar: '018dc082-cddb-7bc5-b08f-8761c95e0509',
    txChar: '018dc082-cddb-7bc5-b08f-8761c95e0509'
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


        // /*** WEB ***/
        // this.ws = new WebSocket(FoxLink);
        // this.ws.binaryType = 'string'; //'arraybuffer';
        
        // this.ws.onopen = this.ws_openSocket;
        // this.ws.onclose = this.ws_closeSocket;
        // this.ws.onerror = this.ws_errorSocket;
        // this.ws.onmessage = this.ws_getData;

        // this.ws_sendData = this.ws_sendData.bind(this);
        // this.ws_getData = this.ws_getData.bind(this);
        // this.ws_openSocket = this.ws_openSocket.bind(this);
        // this.ws_closeSocket = this.ws_closeSocket.bind(this);
        // this.ws_errorSocket = this.ws_errorSocket.bind(this);
        
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

        this.motor_set_1 = '180';
        this.motor_set_2 = '180';

        this.motor_cur_1 = '';
        this.motor_cur_2 = '';

        this.sensor_button = false;
        this.sensor_touch = false;
        this.sensor_impact = false;

        // module 1
        this.sensor_adc_val = 0;
        this.sensor_adc_vol = 0.0;
        
        // module 2
        this.sensor_m2_mode = 0; //0:noting, 1:tempHumid, 2:IMU
        this.sensor_temp = 0.0;
        this.sensor_humid = 0.0;
        this.sensor_imu_acc_x = 0.0;
        this.sensor_imu_acc_y = 0.0;
        this.sensor_imu_acc_z = 0.0;
        this.sensor_imu_gyr_x = 0.0;
        this.sensor_imu_gyr_y = 0.0;
        this.sensor_imu_gyr_z = 0.0;
        
    }

    // /*** WEB ***/
    // ws_ConnectBot() {
    //     this.ws=new WebSocket(FoxLink);
    //     this.ws.binaryType = 'string';

    //     this.ws.onopen = this.ws_openSocket;
    //     this.ws.onclose = this.ws_closeSocket;
    //     this.ws.onerror = this.ws_errorSocket;
    //     this.ws.onmessage = this.ws_getData;    
    // }

    // ws_isConnected () {
    //     let connected = false;
    //     if (this.ws.readyState === WebSocket.OPEN) {
    //         connected = true;
    //     }
    //     return connected;
    // }

    // ws_openSocket () {
    //     //  console.log('WebSocket connection: ', this.ws.readyState);
    //     console.log('WebSocket connection Opened');
	// 	ws.send("WebSocket connection Opened");
    // }

    // ws_closeSocket () {
    //     console.log('WebSocket connection Closed!');
    // }

    // ws_errorSocket (err) {
    //     console.log(err);
    //     this.ws.close();
    // }

    // ws_sendData (msg) {
    //    this.ws.send(msg);
    // }

    // /* get called whenever there is new Data from the ws server. */
    // ws_getData (msg) {
    //     strDataReceved = '';
    //     strDataReceved = msg.data;            
    //     return strDataReceved;
    // }


    /*** BLE ***/
    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, this._extensionId, {
            filters: [
                //{name : "foxbot" }, 
                {services: [BLEUUID.service]}
            ]
        }, this._onConnect, this.disconnect);
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
    
    /* Send a message to the peripheral BLE socket. */
    send (message) {
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

        // const output = new Uint8Array(message.length);
        // for (let i = 0; i < message.length; i++) {
        //     output[i] = message[i];
        // }
        // const data = Base64Util.uint8ArrayToBase64(output);
        
        var output = new TextEncoder().encode(message)
        const data = Base64Util.uint8ArrayToBase64(output);

        this._ble.write(BLEUUID.service, BLEUUID.txChar, data, 'base64', true).then(
            () => {
                this._busy = false;
                window.clearTimeout(this._busyTimeoutID);
            }
        );
    }
    
    /* Starts reading data from peripheral after BLE has connected to it. */
    _onConnect () {
        this._ble.startNotifications(
            BLEUUID.service,
            BLEUUID.rxChar,
            this._onMessage
        );
    }

     /* Process the sensor data from the incoming BLE characteristic.*/
    _onMessage(base64) {

        const pre_data = Base64Util.base64ToUint8Array(base64);
        const data = new TextDecoder("utf-8").decode(pre_data);

        if (data.startsWith("motor an ")) {
            try {
                let parts = data.split(" ");
                let angle1 = parseFloat(parts[2]);
                let angle2 = parseFloat(parts[3]);
                this.motor_cur_1 = angle1; //.toString();
                this.motor_cur_2 = angle2; //.toString();                
            } catch (e) {
                console.error(`Failed to parse angles: ${e}`);
            }
        }
        else if(data.startsWith("sensors ")) {
            try {
                let parts = data.split(" ");
                this.sensor_button = !!parseInt(parts[1]);
                this.sensor_touch = !!parseInt(parts[2]);
                this.sensor_impact = !!parseInt(parts[3]);
                this.sensor_adc_val = parseInt(parts[4]);
                this.sensor_adc_vol = parseFloat(parts[5]);

                
            } catch (e) {
                console.error(`Failed to parse sensor value: ${e}`);
            }
        }

        // this._sensors.tiltX = data[1] | (data[0] << 8);
        // if (this._sensors.tiltX > (1 << 15)) this._sensors.tiltX -= (1 << 16);
        // this._sensors.tiltY = data[3] | (data[2] << 8);
        // if (this._sensors.tiltY > (1 << 15)) this._sensors.tiltY -= (1 << 16);

        // this._sensors.buttonA = data[4];
        // this._sensors.buttonB = data[5];

        // // cancel disconnect timeout and start a new one
        // window.clearInterval(this._timeoutID);
        // this._timeoutID = window.setInterval(
        //     () => this._ble.handleDisconnectError(BLEDataStoppedError),
        //     BLETimeout
        // );
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
                    opcode: 'ChangeFace',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '감정 표현 : [MODE]',
                        description: 'Change Foxbot Face'
                    }),
                    arguments: {
                        MODE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'blink',
                            "menu": "ChangeFaceMenu"
                        }
                    }
                },
                '---',
                // {
                //     opcode: 'SetMotorAngle',
                //     blockType: BlockType.COMMAND,
                //     text: formatMessage({
                //         default: '모터 목표값 세팅 : [ID]번, [VAL]도',
                //         description: 'Set Motor Angle'
                //     }),
                //     arguments: {
                //         ID: {
                //             type: ArgumentType.STRING,
                //             defaultValue: '1',
                //             "menu": "MotorIDMenu"
                //         },
                //         VAL: {
                //             type: ArgumentType.STRING,
                //             defaultValue: '180'
                //         }
                //     }
                // },
                {
                    opcode: 'ChangeMotorAngle',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '모터 움직이기 : 1번 위치 [VAL1]도, 2번 위치 [VAL2]도',
                        description: 'Change Motor Angle'
                    }),
                    arguments: {
                        VAL1: {
                            type: ArgumentType.STRING,
                            defaultValue: '180'
                        },
                        VAL2: {
                            type: ArgumentType.STRING,
                            defaultValue: '180'
                        }
                    }
                },
                {
                    opcode: 'MotorOrigin',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '모터 움직이기 : 정면 바라보기',
                        description: 'Motor Origin'
                    })
                },
                {
                    opcode: 'MotorTorque',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '모터 토크 : 토크 [ONOFF]',
                        description: 'Motor torque'
                    }),
                    arguments: {
                        ONOFF: {
                            type: ArgumentType.STRING,
                            defaultValue: '1',
                            "menu": "MotorTorque"
                        }
                    }
                },
                // {
                //     opcode: 'getSetMotorValue',
                //     text: formatMessage({
                //         default: '[ID]번 모터 목표값'
                //     }),
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ID: {
                //             type: ArgumentType.STRING,
                //             defaultValue: '1',
                //             "menu": "MotorIDMenu"
                //         }
                //     }
                // },
                // {
                //     opcode: 'getCurMotorValue',
                //     text: formatMessage({
                //         default: '모터 현재값 : [ID]번'
                //     }),
                //     blockType: BlockType.REPORTER,
                //     arguments: {
                //         ID: {
                //             type: ArgumentType.STRING,
                //             defaultValue: '1',
                //             "menu": "MotorIDMenu"
                //         }
                //     }
                // },
                {
                    opcode: 'getCurMotorValue_1',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '모터 : 1번 모터 현재 위치'
                    })
                    
                },
                {
                    opcode: 'getCurMotorValue_2',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '모터 : 2번 모터 현재 위치'
                    })
                    
                },
                '---',
                {
                    opcode: 'getCurbutton',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '센서 : 버튼 눌림 감지됨?'
                    })
                },
                {
                    opcode: 'getCurtouch',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '센서 : 터치 감지됨?'
                    })
                },
                {
                    opcode: 'getCurimpact',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '센서 : 충격 감지됨?'
                    })
                },
                {
                    opcode: 'getCurAdcVal',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '센서 : 1번 모듈 [AdcVol]값'
                    }),
                    arguments: {
                        AdcVol: {
                            type: ArgumentType.STRING,
                            defaultValue: '1',
                            "menu": "Module1_AdcVol"
                        }
                    }
                },
                {
                    opcode: 'getCurTemp',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '센서 : 2번 모듈 [TH]값'
                    }),
                    arguments: {
                        TH: {
                            type: ArgumentType.STRING,
                            defaultValue: '1',
                            "menu": "Module2_TempHumid"
                        }
                    }
                },
                {
                    opcode: 'getCurIMU',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '센서 : 2번 모듈 IMU [AG]의 [XYZ]값'
                    }),
                    arguments: {
                        AG: {
                            type: ArgumentType.STRING,
                            defaultValue: '1',
                            "menu": "Module2_IMU"
                        },
                        XYZ: {
                            type: ArgumentType.STRING,
                            defaultValue: '1',
                            "menu": "Module2_XYZ"
                        }
                    }
                },
                '---',
                {
                    opcode: 'PlaySound',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '소리 재생 : [FILE] 효과음',
                        description: 'Play Sound'
                    }),
                    arguments: {
                        FILE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'happy',
                            "menu": "PlaySoundMenu"
                        }
                    }
                },
                {
                    opcode: 'SoundVolume',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '소리 크기 : 원래 소리 + [VOL]dB',
                        description: 'Sound Volume'
                    }),
                    arguments: {
                        VOL: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        }
                    }
                },
                {
                    opcode: 'RecordSound',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '소리 녹음 : [SEC]초 동안 녹음하기',
                        description: 'Record Sound'
                    }),
                    arguments: {
                        SEC: {
                            type: ArgumentType.STRING,
                            defaultValue: '5'
                        }
                    }
                },
                {
                    opcode: 'RecordSoundPlay',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '소리 녹음 : 녹음된 소리 재생하기',
                        description: 'Play Recorded Sound'
                    })
                },        
            ],
            "menus": {
                "PlaySoundMenu": [{text:"happy",value:"happy"}, {text:"sad",value:"sad"}, {text:"anger",value:"anger"}, {text:"test",value:"test"}],
                "ChangeFaceMenu": [{text:"blink",value:"blink"}, {text:"happy",value:"happy"}, {text:"sad",value:"sad"}, {text:"anger",value:"anger"}, {text:"R-Fox",value:"RFox"}],
                "MotorIDMenu": [{text:"1",value:"1"},{text:"2",value:"2"}],
                "MotorTorque": [{text:"ON",value:"1"},{text:"OFF",value:"0"}],
                "Module1_AdcVol": [{text:"ADC",value:"1"},{text:"전압",value:"2"}],
                "Module2_TempHumid": [{text:"온도",value:"1"},{text:"습도",value:"2"}],
                "Module2_IMU": [{text:"가속도",value:"1"},{text:"각속도",value:"2"}],
                "Module2_XYZ": [{text:"X",value:"1"},{text:"Y",value:"2"},{text:"Z",value:"3"}],
            }  
        };
    }

    /**
     * implementation of the block with the opcode that matches this name
     *  this will be called when the block is used
     */

    ChangeFace (args) {
        strDataSend = 'eye '+args.MODE+ ' 1';
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }

    MotorOrigin()
    {
        strDataSend = 'motorOri'
        this._peripheral.send(strDataSend);
    }

    // SetMotorAngle (args) {

    //     if (args.ID=='1')
    //     {
    //         this._peripheral.motor_vel_1 = args.VAL;
    //     }
    //     else if (args.ID=='2')
    //     {
    //         this._peripheral.motor_vel_2 = args.VAL;
    //     }
    // }

    ChangeMotorAngle (args) {
        this._peripheral.motor_vel_1 = args.VAL1;
        this._peripheral.motor_vel_2 = args.VAL2;

        strDataSend = 'motor an '+this._peripheral.motor_vel_1+' '+this._peripheral.motor_vel_2+' sp 50 50';
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }

    // getSetMotorValue (args)
    // {
    //     if (args.ID=='1')
    //     {
    //         return this._peripheral.motor_set_1;
    //     }
    //     else if (args.ID=='2')
    //     {
    //         return this._peripheral.motor_set_1;
    //     }
    // }

    MotorTorque(args)
    {
        strDataSend = 'motor tq '+args.ONOFF+' '+args.ONOFF;
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }

    getCurMotorValue_1 ()
    {
        return this._peripheral.motor_cur_1;
    }

    getCurMotorValue_2 ()
    {
        return this._peripheral.motor_cur_2;
    }

    getCurbutton ()
    {
        return this._peripheral.sensor_button;
    }

    getCurtouch ()
    {
        return this._peripheral.sensor_touch;
    }

    getCurimpact ()
    {
        return this._peripheral.sensor_impact;
    }

    getCurAdcVal (args)
    {
        if (args.AdcVol=='1')
        {
            return this._peripheral.sensor_adc_val;
        }
        else if (args.AdcVol=='2')
        {
            return this._peripheral.sensor_adc_vol;
        }
    }

    getCurTemp (args)
    {
        if (args.TH=='1')
        {
            return this._peripheral.sensor_temp;
        }
        else if (args.TH=='2')
        {
            return this._peripheral.sensor_humid;
        }
    }

    getCurIMU (args)
    {        
        if (args.AG=='1')
        {
            if (args.XYZ=='1')
            {
                return this._peripheral.sensor_imu_acc_x;
            }
            else if (args.XYZ=='2')
            {
                return this._peripheral.sensor_imu_acc_y;
            }
            else if (args.XYZ=='3')
            {
                return this._peripheral.sensor_imu_acc_z;
            }
            
        }
        else if (args.AG=='2')
        {
            if (args.XYZ=='1')
            {
                return this._peripheral.sensor_imu_gyr_x;
            }
            else if (args.XYZ=='2')
            {
                return this._peripheral.sensor_imu_gyr_y;
            }
            else if (args.XYZ=='3')
            {
                return this._peripheral.sensor_imu_gyr_z;
            }
        }
    }

    PlaySound (args) {
        // code here
        strDataSend = 'sound '+args.FILE;
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }

    SoundVolume (args) {
        // code here
        strDataSend = 'volume '+args.VOL;
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }

    RecordSound (args) {
        // code here
        strDataSend = 'record '+'output'+' '+args.SEC;
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }

    RecordSoundPlay (args) {
        // code here
        strDataSend = 'sound '+'output';
        //this._peripheral.ws_sendData (strDataSend);
        //window.socketr.send(strDataSend);
        this._peripheral.send(strDataSend);
    }
}

module.exports = Scratch3FoxBotExtension;