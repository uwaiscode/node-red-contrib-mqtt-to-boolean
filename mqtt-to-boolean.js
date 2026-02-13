module.exports = function(RED) {
    function MqttToBooleanNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        // Get configuration from UI
        node.topic = config.topic;
        node.qos = parseInt(config.qos) || 0;
        node.broker = config.broker;

        // Get Broker Connection object
        node.brokerConn = RED.nodes.getNode(node.broker);

        if (node.brokerConn) {
            // Set initial visual status
            node.status({fill:"red",shape:"ring",text:"disconnected"});

            // Register node to broker to synchronize status
            node.brokerConn.register(this);

            this.on('input', function(msg, send, done) {

                if (node.brokerConn.connected) {
                    // 1. Prepare the payload to be sent to MQTT
                    // We clone the msg so as not to damage the original msg that will be sent to the node output
                    var mqttMsg = RED.util.cloneMessage(msg);

                    // 2. Set Topic & QoS (Priority: Msg > Config, or Config > Msg depending on needs)
                    // Here I made it: If there is a topic in msg, use it. If not, use it from config.
                    if (!mqttMsg.topic && node.topic) {
                        mqttMsg.topic = node.topic;
                    }
                    // If you want Config to ALWAYS overwrite msg.topic, uncomment the line below:
                    // mqttMsg.topic = node.topic || mqttMsg.topic;

                    mqttMsg.qos = Number(node.qos);
                    mqttMsg.retain = false;

                    // 3. PUBLISH TO BROKER
                    // CORRECTION: Just send the msg object. The broker will extract the topic/payload from it.
                    node.brokerConn.publish(mqttMsg);

                    // 4. Output TRUE to the flow (Successfully sent request)
                    msg.payload = true;
                    send(msg);
                    if (done) done();

                } else {
                    // If disconnected, give FALSE feedback
                    //node.warn("MQTT Disconnected: Message not sent");
                    msg.payload = false;
                    send(msg);
                    if (done) done();
                }
            });

            // Listener to update visual status (green/red dot under the node)
            node.brokerConn.on('status', function(status) {
                node.status(status);
            });

        } else {
            node.error("No MQTT Broker configuration found!");
        }
    }
    RED.nodes.registerType("mqtt-to-boolean", MqttToBooleanNode);
}
