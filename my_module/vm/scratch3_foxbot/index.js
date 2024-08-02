const BlockType = require('../../extension-support/block-type');
const ArgumentType = require('../../extension-support/argument-type');
//const TargetType = require('../../extension-support/target-type');
const formatMessage = require('format-message');

const log = require('../../util/log');
const cast = require('../../util/cast');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');

const FoxLink = 'ws://localhost:5500';
//const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAZCAMAAACSL1cTAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAIcUExURTeO5jaN5jWN5jaO5lih4o6/22ys3ziO5jmP5lGc40OV5DiP5kCT5USV5LTU1v//zNfp0Veg4j6S5TuQ5Uya426t39jp0aHK2E2a43iy3sHc1KTM2Pb6zf3+zNLm0qLK2L3a1JjF2UGT5TqQ5Z/I2Nzs0Onyz/f7zdvr0czi01Wf4sfg0///y+v0z1+k4bDS1vj7zdnq0enzz+rzz1mh4TSM5q3R1/X6zfv8zUuZ42+t393s0KDJ2EqZ5Gur3+Pv0Pn8zZ/J2cPd1O/2zp/J2G+u34m829zr0Ofxz1+l4T2R5bTV1fT5zTCK58bf0+jyz1ag4q7R1pzH2XGv3v7+zMvi012j4dLl0rHT1lyj4YG43PX5zYq925XD2vP4zmiq4EeX5NTn0uv0zjSN5ney3uLv0P7/zH213TOM5laf4uLu0PD3zp3H2XGv346/2sDc1Nbo0ez0zrbV1U+c42On4N3r0GWo4EKU5VKd4vz+zIS63DyR5U+b43y13Ye72+Twz+Hu0IO53HOw3r/b1Ie73D+S5azQ193s0fz9zDKL5/v9zfr8zYC43D+T5TuQ5sLd1PD2zq/S1vH3zqXM2N7t0O31zt7s0O71zs3j0lGd4+Xxz6jO163Q10WW5Gep4FCc42qq39Xn0Xiz3qLL2KfN2Hax3nq03T2S5ZHB2uz0zzqQ5vf6zX+33VOe4oa73JLB2pDB2nmz3Xiz3f///8xM7TQAAAABYktHRLPabf9+AAAACXBIWXMAADK/AAAyvwF6t4D2AAAAB3RJTUUH6AEWBAojIVAjmAAAAdRJREFUOMtjYBikgJGJCVWAiRmXUmYGJhZWNnYGZoReDk4uJkasirl5GHj5+AUEmYWEoep5RUTFxCVEOLAplpSSlpLhl5WTV1BUAitXVlFV41fX0NRiwnQGl7YOPxTo6oHkmTn0dQwMjfiNTUwxzeYwA6qTNbcAkmKWILdyW1nL2tja2Ts48mJ4lYnLiZ/f2cXVzZ2f38MTaBqzlze/D5uvkJ+Ovye6U5gDAoFuDuIwNQ125g8JDQb5LCycPyIySjc6RgjdbKZYoAvi4k0ZGBMS+fl1/ID+ZGKI0AlJMtdRE0zGiJaU1DR+g/QMRtPMLH7+7BxhU4bc4Lz8Av5Cp6JizBDnKCnl5w8vK6/Qr+T3qaquqa2rb4hpbGpuaeXBFpHcbUC3+Ie2d/DzG1p2NkZ38fN3+/T09jFii3tmnn5YcPMbRTKxyk4InDipw40RezphFpqcPWUqUKnMtOkzZjbN4p8tXD2Hv8GVCatqBsa58+YvWKiT3VJcosW0SI1/MQP3En61pThUMzAmM5kum2GznAmYajlWyBo7iq/sYOVgwANWcS0H06ZVBrLAdLB6jSk+1QxQXzGuXbdezWNDy0xGBmIAIxP3xk3cTMQpBmsgXik1AAD6SlnCT+hhZgAAADF0RVh0Q29tbWVudABQTkcgcmVzaXplZCB3aXRoIGh0dHBzOi8vZXpnaWYuY29tL3Jlc2l6ZV5J2+IAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDEtMjJUMDQ6MDY6NTgrMDA6MDBi65rcAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTAxLTIyVDA0OjA2OjU4KzAwOjAwE7YiYAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wMS0yMlQwNDoxMDozNSswMDowMC+LxH8AAAASdEVYdFNvZnR3YXJlAGV6Z2lmLmNvbaDDs1gAAAAASUVORK5CYII='
const blockIconURI = 'data:image/png;base64,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';
const menuIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAtCAMAAADm86mrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALTUExURTeO5jaN5jWN5jaO5jOM5kqZ5IK43X223UmY5ECT5VCb4z+T5DSM5jeP5j+T5TiP5jiO5pDA2vD2zvD3zoW63DyR5TmQ5j2R5TuQ5UaW5FOe4o/A29Xn0Yq920eX5EmY4zSN5mip4LbV1qrQ17XV1ujyz/7/zP//zOXwz7DS1rLU1q/S1lui4brY1OTwz9nq0bbW1kiY5DWO5jiP5azR1/f6zP3+zKHK2UGT5TGL52Cl4dPm0f//y+72ztrr0c/k0kqY4zKL5pPC2vH3zvf7zfj7zf7+zPL4zou920iX5JjF2fP5zefxz4C33Ii72+z1z4u+26jO1/b6zfn8zbjX1Xiz3niz3b3a1Pv8zJ/J2TOL5mep39jp0czj0lGd4yuH6Fyj4dzr0NLl0kya45zH2OrzzrvZ1S+J51Kd4sHc1J3I2VCc44e73Oz0z+71zpvH2eTvz3ey3TCK54G43I6/25zH2fX5zYK43DOM51+k4f//yuz1zvn8zM7j0zKM5mep4NHl0vv9zKHJ2EOV5ECS5azQ1/v8zfz+zMvh02ip3zGK5k+b43Sx3nmz3Z/J2Mnh0+Pvz+Luz8Db1KPL10SW5DWM5lSf4sbe04S53ESV5Iq82+Pwz7zZ1Veg4j6S5WSn4H+23K3R1sLd1Hu03Yi827nX1XOv3zqP5jCL55LB2tHm0tTn0vL3zvP5zoy+27zZ1P3+zfz9zNPn0Wap36fN2J7J2TqQ5cjg09Tm0abN18bf093s0Gqq3+Tw0Ofyz+bwz+nyz4a73KvQ1+Hu0Hax3S6J58Lc1Fih4jGL5mKm4FSe4rbV1ff7zK/S116k4Vmh4U6b47LT1t7t0HCv3yqH6Fuj4s3i08rg012j4WGm4F6l4TKL512k4crh05fE2rvY1fv9zd/t0G+t30GU5ECT5DmP5r7b1GGm4UGT5Gys3/P3zsng04m923ey3lKe4jKM5wAAALVIE5gAAADxdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wCpCmekAAAACXBIWXMAADLAAAAywAEoZFrbAAAC30lEQVRIS5VVu43jMBB1tpGauIQFqAOHa0CAIjWwBBgQULyON1LMGtSAHGwPzoQFFKgBlXHvvSFlGXeBd0wOh/N5HM5I8mn9FZ3W6jd0qqo1rS+OCugkbF7hdE/avsIL+hcZlaTt//xLMUIfMNKwDcO6YX3m1GcRRPRhSJjgw0ZZuydOK8WCbvAAoZq7+sCzFYvQzQXAQDFIyln8Fx0SmA1MnUFcgzGejYYOoxB2OxMU8oOZGu604fZ0MC+GCEw1oWQGoVeIRLIqio7IEZpQ1AW+Rl/23A0lxRgO9YAigOsm8FJXDQQz1dvZ+TgkoXGk0M8xhQy/oyt26m5/vHO+u3XTWhM8dB6KubOjth1dUDe30w3FhGqanZ+9WwzxiI7484WeYtHyPnv/lqJ3kc045K6IFn7tOHYI6IlO8CX9BPBAPOawo4ceaXbQpw7593TYor98hN75t4yYu8q4yCwiA1tIqA/oc4bkmDvJ0O3BG6aFucCwMallwnnj+L7MKAy1Ozq6mtiIAH8UOTXAu4dtiq3r4th0E98b4qOr1UmRmvS7fKNwTIo3cO46F+eaTLmz5kyHSWT64FlL29Ed6TGgXoVe8RgFN7PH1YDo5xha50fEXFFDg2cn1CYItQKmFO5X14bwifa7efqZ5C5vDVWmoJPC/c7jefHr8o6YEeA0qc0FnTLfEZhwNB3gfkVm36WfBl4JPSuYJYnLNjV3vzSj/KjRW5DRSURXmBZQaADNE7mlAZ5EVzbyIIMZQ9O4nPl90HeG74luq5AyClMUVzbHnhkZoFKCXCUXRzPBCy+YFVL3KDHimSFkVzH19YQ/D22pKIYHwywtAS/oj9xzhFipinZ8suBuXZJZSJYXSRwMKioBbv8etmNE8aUsZHrbqh8LaZIgKBnTVHEkqTSP3OWF5zIbyZ5C8bPcM7r5SMrskBmRQSwk0fP7JGW+B8YhVi1VMqx7thcfVoc70OMEYqf1L0e9qrn/bSwvAAAAAElFTkSuQmCC';

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

        this.test = '디버깅용 값입니다.';
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

                let sensor_cmd = parts[6];
                if (sensor_cmd == '-1.0')
                {
                    this.sensor_m2_mode = 0;
                }
                else if (sensor_cmd == 'm2_imu')
                {
                    this.sensor_imu_acc_x = parseFloat(parts[7]);
                    this.sensor_imu_acc_y = parseFloat(parts[8]);
                    this.sensor_imu_acc_z = parseFloat(parts[9]);
                    this.sensor_imu_gyr_x = parseFloat(parts[10]);
                    this.sensor_imu_gyr_y = parseFloat(parts[11]);
                    this.sensor_imu_gyr_z = parseFloat(parts[12]);
                    this.sensor_m2_mode = 1; 

                }
                else if (sensor_cmd == 'm2_th')
                {
                    this.sensor_temp = parseFloat(parts[7]);
                    this.sensor_humid = parseFloat(parts[8]);
                    this.sensor_m2_mode = 2;
                }
                
            } catch (e) {
                console.error(`Failed to parse sensor value: ${e}`);
            }
        }
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
                            "menu": "OnOff"
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
                    opcode: 'CameraOnoff',                    
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        default: '센서 : 카메라 [ONOFF]',
                        description: 'Camera onoff'
                    }),
                    arguments: {
                        ONOFF: {
                            type: ArgumentType.STRING,
                            defaultValue: '0',
                            "menu": "OnOff"
                        }
                    }
                },
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
                    opcode: 'getTest',
                    blockType: BlockType.REPORTER,
                    text: formatMessage({
                        default: '테스트 값'
                    })
                    
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
                "OnOff": [{text:"ON",value:"1"},{text:"OFF",value:"0"}],
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

    CameraOnoff(args)
    {
        strDataSend = 'camera '+args.ONOFF;
        this._peripheral.send(strDataSend);
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

    getCurIMU (args)
    {
        if (this._peripheral.sensor_m2_mode==1)
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
        else
        {
            return 'IMU 센서 연결 안 됨'
        }  
    }

    getCurTemp (args)
    {
        if (this._peripheral.sensor_m2_mode==2)
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
        else
        {
            return '온습도 센서 연결 안 됨'
        }        
    }

    getTest ()
    {
        return this._peripheral.test;
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