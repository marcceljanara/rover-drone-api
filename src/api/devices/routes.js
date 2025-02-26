import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import verifyAdmin from '../../middleware/verifyAdmin.js';

const deviceRoutes = (handler) => {
  const router = express.Router();

  // Admin
  router.post('/devices', verifyToken, verifyAdmin, handler.postAddDeviceHandler);
  router.put('/devices/:id', verifyToken, verifyAdmin, handler.deleteDeviceHandler);
  router.put('/devices/:id/status', verifyToken, verifyAdmin, handler.putStatusDeviceHandler);
  router.put('/devices/:id/mqttsensor', verifyToken, verifyAdmin, handler.putMqttSensorHandler);
  router.put('/devices/:id/mqttcontrol', verifyToken, verifyAdmin, handler.putMqttControlHandler);

  // User (same id) & admin (all device)
  router.get('/devices', verifyToken, handler.getAllDeviceHandler);
  router.get('/devices/:id', verifyToken, handler.getDeviceHandler);
  router.put('/devices/:id/control', verifyToken, handler.putDeviceControlHandler);
  router.get('/devices/:id/sensors/intervals', verifyToken, handler.getSensorDataHandler);
  router.get('/devices/:id/sensors/limits', verifyToken, handler.getSensorDataLimitHandler);
  router.get('/devices/:id/sensors/downloads', verifyToken, handler.getSensorDataDownloadHandler);

  return router;
};

export default deviceRoutes;
