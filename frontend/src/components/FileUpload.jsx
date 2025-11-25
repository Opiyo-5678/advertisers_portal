import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { filesAPI } from '../api/services';

const FileUpload = ({ onFilesUploaded }) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);

  const uploadToBackend = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('original_filename', file.name);

    try {
      const response = await filesAPI.upload(formData);
      return {
        id: response.data.id,
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        status: 'uploaded',
        backendData: response.data
      };
    } catch (error) {
      console.error('Upload error:', error);
      return {
        file,
        name: file.name,
        size: file.size,
        status: 'error',
        error: error.response?.data?.message || 'Upload failed'
      };
    }
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(({ file, errors }) => ({
        name: file.name,
        message: errors[0]?.message || 'File rejected'
      }));
      setErrors(newErrors);
    }

    if (acceptedFiles.length === 0) return;

    setUploading(true);

    // Upload files to backend one by one
    const uploadPromises = acceptedFiles.map(file => uploadToBackend(file));
    const uploadedFiles = await Promise.all(uploadPromises);

    setFiles(prev => [...prev, ...uploadedFiles]);
    onFilesUploaded([...files, ...uploadedFiles].filter(f => f.status === 'uploaded'));
    
    setUploading(false);
  }, [files, onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    disabled: uploading
  });

  const removeFile = async (index) => {
    const fileToRemove = files[index];
    
    // Delete from backend if uploaded
    if (fileToRemove.status === 'uploaded' && fileToRemove.id) {
      try {
        await filesAPI.delete(fileToRemove.id);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesUploaded(newFiles.filter(f => f.status === 'uploaded'));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          uploading 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : isDragActive
            ? 'border-cyan-500 bg-cyan-50'
            : 'border-gray-300 hover:border-cyan-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${
            uploading ? 'bg-gray-100' : isDragActive ? 'bg-cyan-100' : 'bg-gray-100'
          }`}>
            {uploading ? (
              <Loader className="text-cyan-600 animate-spin" size={40} />
            ) : (
              <Upload className={isDragActive ? 'text-cyan-600' : 'text-gray-600'} size={40} />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-navy-800">
              {uploading 
                ? 'Uploading files...' 
                : isDragActive 
                ? 'Drop files here' 
                : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-dark-grey-600 mt-1">
              {uploading ? 'Please wait...' : 'or click to browse'}
            </p>
          </div>
          <div className="text-sm text-dark-grey-600">
            <p>Supported formats: PNG, JPG, SVG, PDF, JPEG</p>
            <p>Maximum size: 3MB per file</p>
            <p className="text-cyan-600 font-medium mt-1">✓ Files are scanned for malware</p>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-medium text-red-800">{error.name}</p>
                <p className="text-sm text-red-600">{error.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-navy-800">Uploaded Files ({files.filter(f => f.status === 'uploaded').length})</h4>
          {files.map((fileObj, index) => (
            <div key={index} className={`bg-white border rounded-lg p-4 flex items-center justify-between ${
              fileObj.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                {fileObj.preview && fileObj.file.type.startsWith('image/') ? (
                  <img
                    src={fileObj.preview}
                    alt={fileObj.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    <Upload className="text-gray-600" size={24} />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-navy-800">{fileObj.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-dark-grey-600">
                      {(fileObj.size / 1024).toFixed(1)} KB
                    </p>
                    {fileObj.backendData?.virus_scan_status && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        fileObj.backendData.virus_scan_status === 'clean' 
                          ? 'bg-green-100 text-green-800'
                          : fileObj.backendData.virus_scan_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fileObj.backendData.virus_scan_status === 'clean' ? '✓ Clean' : 
                         fileObj.backendData.virus_scan_status === 'pending' ? 'Scanning...' : 
                         '⚠ Infected'}
                      </span>
                    )}
                  </div>
                  {fileObj.status === 'error' && (
                    <p className="text-xs text-red-600 mt-1">{fileObj.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {fileObj.status === 'uploaded' && (
                  <CheckCircle className="text-green-600" size={20} />
                )}
                {fileObj.status === 'error' && (
                  <AlertCircle className="text-red-600" size={20} />
                )}
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 hover:bg-red-50 rounded-full transition-colors"
                  disabled={uploading}
                >
                  <X className="text-red-600" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;