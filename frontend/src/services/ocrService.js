import apiClient from './apiClient';

export const ocrService = {
  /**
   * Uploads a document image/pdf for OCR processing
   * @param {File} file - The file to upload
   * @returns {Promise<Object>} The OCR response containing extracted fields and text
   */
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    const response = await apiClient.post('/ocr/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Fetches supported document structures and instructions
   */
  getSupportedDocuments: async () => {
    const response = await apiClient.get('/ocr/supported-docs');
    return response.data;
  }
};

export default ocrService;
