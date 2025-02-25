import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import verifyAdmin from '../../middleware/verifyAdmin.js';

const reportRoutes = (handler) => {
  const router = express.Router();

  router.post('/reports', verifyToken, verifyAdmin, handler.postReportHandler);
  router.get('/reports', verifyToken, verifyAdmin, handler.getAllReportHandler);
  router.get('/reports/:id', verifyToken, verifyAdmin, handler.getDetailReportHandler);
  router.get('/reports/:id/download', verifyToken, verifyAdmin, handler.getDownloadReportHandler);
  router.delete('/reports/:id', verifyToken, verifyAdmin, verifyToken, verifyAdmin, handler.deleteReportHandler);

  return router;
};

export default reportRoutes;
