import React, { useState } from 'react';
import { XIcon, UploadIcon, CheckCircleIcon, AlertCircleIcon, FileIcon } from 'lucide-react';
import PropTypes from 'prop-types';
import FileUpload from './FileUpload.jsx';

const InventoryUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStep, setUploadStep] = useState('select'); // select, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadStep('select');
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStep('uploading');
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the upload function
      const result = await onUpload(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadResult(result);
        setUploadStep(result.success ? 'success' : 'error');
      }, 500);

    } catch (error) {
      setUploadStep('error');
      setUploadResult({
        success: false,
        error: error.message || 'Upload failed'
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadStep('select');
    setUploadProgress(0);
    setUploadResult(null);
    onClose();
  };

  const handleStartOver = () => {
    setSelectedFile(null);
    setUploadStep('select');
    setUploadProgress(0);
    setUploadResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Upload Inventory File
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 sm:px-6 sm:pb-6">
            {uploadStep === 'select' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Upload Excel (.xlsx, .xls) or PDF files containing inventory data. 
                  The system will automatically detect and parse the content.
                </p>
                
                <FileUpload
                  onFileSelect={handleFileSelect}
                  acceptedTypes={['.xlsx', '.xls', '.pdf']}
                  maxSize={10 * 1024 * 1024}
                  multiple={false}
                />

                {selectedFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <FileIcon className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-xs text-blue-700">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {uploadStep === 'uploading' && (
              <div className="space-y-4">
                <div className="text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-blue-500 animate-pulse" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Uploading and processing...</p>
                  <p className="text-xs text-gray-500">Please wait while we process your file</p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-center text-sm text-gray-600">{uploadProgress}% complete</p>
              </div>
            )}

            {uploadStep === 'success' && uploadResult && (
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Upload Successful!</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-green-900">Processed Items:</p>
                      <p className="text-green-700">{uploadResult.processedItems || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Created Items:</p>
                      <p className="text-green-700">{uploadResult.createdItems || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Updated Items:</p>
                      <p className="text-green-700">{uploadResult.updatedItems || 0}</p>
                    </div>
                    <div>
                      <p className="font-medium text-green-900">Errors:</p>
                      <p className="text-green-700">{uploadResult.errors?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="font-medium text-yellow-900 mb-2">Warnings:</p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {uploadResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {uploadResult.errors.length > 5 && (
                        <li>• ... and {uploadResult.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {uploadStep === 'error' && uploadResult && (
              <div className="space-y-4">
                <div className="text-center">
                  <AlertCircleIcon className="mx-auto h-12 w-12 text-red-500" />
                  <p className="mt-2 text-sm font-medium text-gray-900">Upload Failed</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-700">
                    {uploadResult.error || 'An error occurred during upload'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {uploadStep === 'select' && (
              <>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </>
            )}

            {uploadStep === 'uploading' && (
              <button
                type="button"
                onClick={handleClose}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            )}

            {(uploadStep === 'success' || uploadStep === 'error') && (
              <>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={handleStartOver}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Upload Another
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

InventoryUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired
};

export default InventoryUploadModal;
