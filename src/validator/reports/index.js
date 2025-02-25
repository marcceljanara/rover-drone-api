import InvariantError from '../../exceptions/InvariantError.js';
import {
  paramsPayloadSchema,
  postReportPayloadSchema,
} from './schema.cjs';

const ReportsValidator = {
  validateParamsPayload: (payload) => {
    const validationResult = paramsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostReportPayload: (payload) => {
    const validationResult = postReportPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default ReportsValidator;
