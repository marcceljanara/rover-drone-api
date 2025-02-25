const Joi = require('joi');

const paramsPayloadSchema = Joi.object({
  id: Joi.string().required(),
});

const postReportPayloadSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required(),
});

module.exports = {
  paramsPayloadSchema,
  postReportPayloadSchema,
};
