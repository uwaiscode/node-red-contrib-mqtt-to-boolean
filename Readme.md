# node-red-contrib-mqtt-to-boolean

A custom Node-RED node that sends a message to an MQTT broker and outputs a boolean status.

## Installation

To install this node, you can either:

1.  Install it from the Node-RED Palette Manager.
2.  Install it manually by cloning this repository and running `npm install` in your Node-RED user directory (`~/.node-red`):

    ```bash
    cd ~/.node-red
    git clone https://github.com/uwaiscode/node-red-contrib-mqtt-to-boolean.git
    cd node-red-contrib-mqtt-to-boolean
    npm install
    ```

    Then, restart Node-RED.

## How to Use

This node takes a message as input and sends it to the configured MQTT broker.

-   If the message is successfully sent, the node outputs a `msg` with `payload` set to `true`.
-   If the MQTT broker is disconnected, the node outputs a `msg` with `payload` set to `false`.

### Configuration

-   **Broker**: The MQTT broker to connect to.
-   **Topic**: The MQTT topic to publish the message to.
-   **QoS**: The Quality of Service level for the MQTT message.
-   **Name**: The name of the node.

## Example Flow

Here is an example flow that demonstrates how to use the `mqtt-to-boolean` node:

```json
[
    {
        "id": "some-flow-id",
        "type": "tab",
        "label": "MQTT to Boolean Example",
        "disabled": false,
        "info": ""
    },
    {
        "id": "some-inject-id",
        "type": "inject",
        "z": "some-flow-id",
        "name": "Send MQTT Message",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "test/topic",
        "payload": "Hello, world!",
        "payloadType": "str",
        "x": 150,
        "y": 100,
        "wires": [
            [
                "some-mqtt-id"
            ]
        ]
    },
    {
        "id": "some-mqtt-id",
        "type": "mqtt-to-boolean",
        "z": "some-flow-id",
        "name": "MQTT to Boolean",
        "topic": "test/topic",
        "qos": "1",
        "broker": "your-broker-id",
        "x": 350,
        "y": 100,
        "wires": [
            [
                "some-debug-id"
            ]
        ]
    },
    {
        "id": "some-debug-id",
        "type": "debug",
        "z": "some-flow-id",
        "name": "Debug Status",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 550,
        "y": 100,
        "wires": []
    },
    {
        "id": "your-broker-id",
        "type": "mqtt-broker",
        "name": "Your MQTT Broker",
        "broker": "localhost",
        "port": "1883",
        "clientid": "",
        "autoConnect": true,
        "usetls": false,
        "protocolVersion": "4",
        "keepalive": "60",
        "cleansession": true,
        "autoUnsubscribe": true,
        "sessionExpiry": ""
    }
]
```
