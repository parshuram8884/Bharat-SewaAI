import visionService from '../services/visionService.js';

export const ocrController = {
  uploadAndExtract: async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const extractedData = await visionService.extractDocumentData(
        req.file.buffer,
        req.file.mimetype
      );

      return res.json({
        message: 'OCR Extraction complete',
        data: extractedData
      });
    } catch (err) {
      next(err);
    }
  },

  getSupportedDocs: async (req, res, next) => {
    try {
      return res.json({
        supported: ['Aadhaar Card', 'Ration Card', 'Domicile Certificate']
      });
    } catch (err) {
      next(err);
    }
  }
};

export default ocrController;
