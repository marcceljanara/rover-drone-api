import InvariantError from '../../../exceptions/InvariantError.js';
import ReportsValidator from '../index.js';

describe('ReportsValidator', () => {
  describe('Params Payload', () => {
    it('should throw error when payload did not contain needed property', () => {
      const payload = {};

      expect(() => ReportsValidator.validateParamsPayload(payload)).toThrowError(InvariantError);
    });

    it('should throw error when payload did not meet data type specification', () => {
      const payload = { id: 123 };

      expect(() => ReportsValidator.validateParamsPayload(payload)).toThrowError(InvariantError);
    });

    it('should not throw error because payload meets validation criteria', () => {
      const payload = { id: 'reports-123' };

      expect(() => ReportsValidator.validateParamsPayload(payload)).not.toThrowError();
    });
  });

  describe('Post Report Payload', () => {
    it('should throw error when payload did not contain needed property', () => {
      // Arrange
      const payload = { startDate: '2025-01-12' };

      // Action and Assert
      expect(() => ReportsValidator
        .validatePostReportPayload(payload)).toThrowError(InvariantError);
    });

    it('should throw error when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        startDate: '2025-01-12',
        endDate: '2025 Januari 15',
      };

      // Action and Assert
      expect(() => ReportsValidator
        .validatePostReportPayload(payload)).toThrowError(InvariantError);
    });

    it('should not throw error when payload meet criteria', () => {
      // Arrange
      const payload = {
        startDate: '2025-01-12',
        endDate: '2025-01-15',
      };

      // Action and Assert
      expect(() => ReportsValidator
        .validatePostReportPayload(payload)).not.toThrowError(InvariantError);
    });
  });
});
