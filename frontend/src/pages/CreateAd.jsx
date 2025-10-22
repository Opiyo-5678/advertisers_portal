import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsAPI, filesAPI } from '../api/services';
import Toast from '../components/Toast';
import FileUpload from '../components/FileUpload';
import { 
  Save, 
  Send, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Scale
} from 'lucide-react';

const CreateAd = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    full_description: '',
    call_to_action: '',
    website_url: '',
    catalog_url: '',
    whatsapp_link: '',
    terms_conditions: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (isSubmitting = false) => {
    const newErrors = {};
    
    // Title is always required
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    // Short description length check
    if (formData.short_description && formData.short_description.length > 250) {
      newErrors.short_description = 'Short description must be less than 250 characters';
    }

    // If submitting for review, check required fields
    if (isSubmitting) {
      // At least 1 image required
      if (uploadedFiles.length === 0) {
        newErrors.files = 'Please upload at least one image or logo';
      }

      // At least 1 link required
      const hasAtLeastOneLink = formData.website_url || formData.catalog_url || formData.whatsapp_link;
      if (!hasAtLeastOneLink) {
        newErrors.links = 'Please provide at least one link (Website, Catalog, or WhatsApp)';
      }
    }

    // URL validation
    if (formData.website_url && !isValidUrl(formData.website_url)) {
      newErrors.website_url = 'Please enter a valid URL';
    }

    if (formData.catalog_url && !isValidUrl(formData.catalog_url)) {
      newErrors.catalog_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleFilesUploaded = (files) => {
    setUploadedFiles(files);
    // Clear file error when files are uploaded
    if (errors.files && files.length > 0) {
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };

  const handleSubmit = async (status = 'draft') => {
    const isSubmitting = status === 'submit';
    
    if (!validateForm(isSubmitting)) {
      showToastMessage('Please fix the errors in the form', 'error');
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const adData = {
        ...formData,
        status: status === 'submit' ? 'pending_review' : 'draft'
      };

      // Step 1: Create the ad
      const response = await adsAPI.create(adData);
      const adId = response.data.id;

      // Step 2: Link uploaded files to the ad
      if (uploadedFiles.length > 0) {
        console.log(`Linking ${uploadedFiles.length} files to ad ID: ${adId}`);
        
        const linkPromises = uploadedFiles.map(async (file) => {
          if (file.id) {
            try {
              await filesAPI.update(file.id, { ad: adId });
              console.log(`✓ Linked file ${file.id} to ad ${adId}`);
            } catch (err) {
              console.error(`✗ Error linking file ${file.id}:`, err);
            }
          }
        });
        
        await Promise.all(linkPromises);
      }
      
      showToastMessage(
        status === 'submit' 
          ? '🎉 Ad submitted for review successfully!' 
          : '✅ Ad saved as draft!',
        'success'
      );

      setTimeout(() => {
        navigate('/ads');
      }, 2000);

    } catch (error) {
      console.error('Error creating ad:', error);
      showToastMessage(
        error.response?.data?.message || 'Failed to create ad. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-4xl mx-auto pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-800">Create New Advertisement</h1>
          <p className="text-dark-grey-600 mt-2">
            Fill in all the required information to create your advertisement
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-8 space-y-10">
            
            {/* Section 1: Ad Content */}
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-cyan-500">
                <FileText className="text-cyan-600" size={28} />
                <h2 className="text-2xl font-bold text-navy-800">Ad Content</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Ad Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`input-field ${errors.title ? 'border-red-500' : ''}`}
                    placeholder="Enter a catchy title for your ad"
                    maxLength={200}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-red-500">{errors.title}</span>
                    <span className="text-sm text-dark-grey-600">
                      {formData.title.length}/200
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleChange}
                    className={`input-field ${errors.short_description ? 'border-red-500' : ''}`}
                    placeholder="Brief description (shown in listings)"
                    maxLength={250}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-red-500">{errors.short_description}</span>
                    <span className="text-sm text-dark-grey-600">
                      {formData.short_description.length}/250
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Full Description
                  </label>
                  <textarea
                    name="full_description"
                    value={formData.full_description}
                    onChange={handleChange}
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Detailed description of your product or service..."
                    maxLength={2000}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-cyan-600">
                      <AlertCircle size={14} className="inline mr-1" />
                      Use this space to highlight key features and benefits
                    </span>
                    <span className="text-sm text-dark-grey-600">
                      {formData.full_description.length}/2000
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Call to Action
                  </label>
                  <input
                    type="text"
                    name="call_to_action"
                    value={formData.call_to_action}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Shop Now, Learn More, Get Started"
                    maxLength={100}
                  />
                  <p className="text-sm text-dark-grey-600 mt-1">
                    Text for your action button
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Images & Media */}
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-purple-500">
                <ImageIcon className="text-purple-600" size={28} />
                <h2 className="text-2xl font-bold text-navy-800">Images & Media</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-semibold text-navy-800 mb-2 flex items-center">
                    <ImageIcon className="inline mr-2" size={20} />
                    Upload Your Ad Images <span className="text-red-500 ml-1">*</span>
                  </h3>
                  <p className="text-sm text-dark-grey-600">
                    Upload logos, product images, or promotional graphics. At least 1 image is required.
                  </p>
                  <p className="text-xs text-purple-700 mt-2 font-medium">
                    Supported formats: PNG, JPG, SVG, PDF (max 10MB each)
                  </p>
                </div>

                <FileUpload onFilesUploaded={handleFilesUploaded} />

                {errors.files && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                    <AlertCircle className="text-red-600 mr-2 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-700">{errors.files}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Links & Contact */}
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-blue-500">
                <LinkIcon className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-navy-800">Links & Contact</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-navy-800 mb-2 flex items-center">
                    <LinkIcon className="inline mr-2" size={20} />
                    Add Your Links <span className="text-red-500 ml-1">*</span>
                  </h3>
                  <p className="text-sm text-dark-grey-600">
                    At least one link is required (Website, Catalog, or WhatsApp)
                  </p>
                </div>

                {errors.links && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                    <AlertCircle className="text-red-600 mr-2 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-sm text-red-700">{errors.links}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleChange}
                    className={`input-field ${errors.website_url ? 'border-red-500' : ''}`}
                    placeholder="https://www.yourwebsite.com"
                  />
                  {errors.website_url && (
                    <p className="text-sm text-red-500 mt-1">{errors.website_url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Catalog/Brochure URL
                  </label>
                  <input
                    type="url"
                    name="catalog_url"
                    value={formData.catalog_url}
                    onChange={handleChange}
                    className={`input-field ${errors.catalog_url ? 'border-red-500' : ''}`}
                    placeholder="https://www.yourcatalog.com/file.pdf"
                  />
                  {errors.catalog_url && (
                    <p className="text-sm text-red-500 mt-1">{errors.catalog_url}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    WhatsApp Link
                  </label>
                  <input
                    type="text"
                    name="whatsapp_link"
                    value={formData.whatsapp_link}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://wa.me/1234567890"
                  />
                  <p className="text-sm text-dark-grey-600 mt-1">
                    Format: https://wa.me/your-phone-number
                  </p>
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <p className="text-sm text-navy-800">
                    <AlertCircle className="inline mr-2" size={16} />
                    <strong>Tip:</strong> QR codes will be automatically generated for all your links!
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4: Terms & Conditions */}
            <div>
              <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-gray-500">
                <Scale className="text-gray-600" size={28} />
                <h2 className="text-2xl font-bold text-navy-800">Terms & Conditions</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-dark-grey-600">
                    Optional: Add any terms, conditions, or disclaimers for your advertisement
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-800 mb-2">
                    Terms & Conditions (Optional)
                  </label>
                  <textarea
                    name="terms_conditions"
                    value={formData.terms_conditions}
                    onChange={handleChange}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Any terms, conditions, or disclaimers..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={() => navigate('/ads')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>

            <div className="flex gap-4">
              <button
                onClick={() => handleSubmit('draft')}
                className="btn-secondary flex items-center space-x-2"
                disabled={loading}
              >
                <Save size={20} />
                <span>Save as Draft</span>
              </button>

              <button
                onClick={() => handleSubmit('submit')}
                className="btn-primary flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Submit for Review</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            <span className="text-red-500">*</span> Required fields must be completed before submitting for review
          </p>
        </div>
      </div>
    </>
  );
};

export default CreateAd;