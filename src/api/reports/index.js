import ReportsHandler from './handler.js';
import reportRoutes from './routes.js';

const reportsPlugin = ({
  app, reportsService, validator,
}) => {
  const handler = new ReportsHandler({
    reportsService, validator,
  });
  app.use(reportRoutes(handler));
};

export default reportsPlugin;
