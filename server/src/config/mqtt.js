import mqtt from 'mqtt';
import { handleIncomingSignal } from '../services/signal.service.js';
import { mqttService } from './constant.js';

const options = {
  host: 'broker.emqx.io',
  port: 1883,
  username: 'admin',
  password: 'admin@123',
};

const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(mqttService.SUBSCRIPTION, (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log(`Subscribed to ${mqttService.SUBSCRIPTION}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const result = await handleIncomingSignal(data);
    console.log('Service response:', result);
  } catch (err) {
    console.error('Error handling MQTT message:', err.message);
  }
});

client.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

export { client };


