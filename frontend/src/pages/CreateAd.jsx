import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adsAPI, filesAPI } from '../api/services';
import Toast from '../components/Toast';
import FileUpload from '../components/FileUpload';
import { 
  Save, Send, AlertCircle, FileText, Image as ImageIcon,
  Link as LinkIcon, Scale, MapPin
} from 'lucide-react';

const CreateAd = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  
  // NEW: Category state
  const [adCategory, setAdCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    ad_category: 1,
    title: '',
    short_description: '',
    full_description: '',
    call_to_action: '',
    website_url: '',
    catalog_url: '',
    // REMOVED: whatsapp_link
    terms_conditions: '',
    placement_type: '', // 'main' or 'regional'
    region_city: '',
  });

  const [errors, setErrors] = useState({});

  // Category Selection Screen
  if (adCategory === null) {
    return (
      <div className="max-w-4xl mx-auto pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-800">Create New Advertisement</h1>
          <p className="text-dark-grey-600 mt-2">Choose your ad format</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Category 1: Webflyer */}
          <button
            onClick={() => {
              setAdCategory(1);
              setFormData(prev => ({ ...prev, ad_category: 1 }));
            }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-cyan-500 text-left"
          >
            <div className="flex items-center space-x-3 mb-4">
              <ImageIcon className="text-cyan-600" size={32} />
              <h2 className="text-2xl font-bold text-navy-800">Type 1</h2>
            </div>
            <p className="text-lg font-semibold text-cyan-600 mb-3">Webflyer Style (Recommended)</p>
            <p className="text-dark-grey-600 mb-4">Simple format focused on visuals and links</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Upload images (REQUIRED)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Add website link (REQUIRED)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Select placement & region</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>3 months minimum duration</span>
              </div>
            </div>
          </button>

          {/* Category 2: Full Format */}
          <button
            onClick={() => {
              setAdCategory(2);
              setFormData(prev => ({ ...prev, ad_category: 2 }));
            }}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-500 text-left"
          >
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="text-purple-600" size={32} />
              <h2 className="text-2xl font-bold text-navy-800">Type 2</h2>
            </div>
            <p className="text-lg font-semibold text-purple-600 mb-3">Irregular Format</p>
            <p className="text-dark-grey-600 mb-4">Full details with descriptions and CTAs</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Title & descriptions</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Images (optional)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Links (optional)</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                <span>Call to action</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (isSubmitting = false) => {
    const newErrors = {};
    
    if (adCategory === 1) {
      // Category 1 validation: Images + Link MANDATORY
      if (isSubmitting && uploadedFiles.length === 0) {
        newErrors.files = 'At least one image is required for Webflyer ads';
      }
      if (isSubmitting && !formData.website_url) {
        newErrors.website_url = 'Website link is required for Webflyer ads';
      }
      if (formData.website_url && !isValidUrl(formData.website_url)) {
        newErrors.website_url = 'Please enter a valid URL';
      }
      if (!formData.placement_type) {
        newErrors.placement_type = 'Please select placement type';
      }
      if (!formData.region_city) {
        newErrors.region_city = 'Please select region/city';
      }
    } else {
      // Category 2 validation: Title required
      if (!formData.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (formData.website_url && !isValidUrl(formData.website_url)) {
        newErrors.website_url = 'Please enter a valid URL';
      }
      if (formData.catalog_url && !isValidUrl(formData.catalog_url)) {
        newErrors.catalog_url = 'Please enter a valid URL';
      }
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
    if (errors.files && files.length > 0) {
      setErrors(prev => ({ ...prev, files: '' }));
    }
  };

  const handleSubmit = async (status = 'draft') => {
    const isSubmitting = status === 'submit';
    
    if (!validateForm(isSubmitting)) {
      showToastMessage('Please fix the errors in the form', 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const adData = {
        ...formData,
        status: status === 'submit' ? 'pending_review' : 'draft'
      };

      const response = await adsAPI.create(adData);
      const adId = response.data.id;

      if (uploadedFiles.length > 0) {
        const linkPromises = uploadedFiles.map(async (file) => {
          if (file.id) {
            try {
              await filesAPI.update(file.id, { ad: adId });
            } catch (err) {
              console.error(`Error linking file ${file.id}:`, err);
            }
          }
        });
        await Promise.all(linkPromises);
      }
      
      showToastMessage(
        status === 'submit' ? '🎉 Ad submitted for review!' : '✅ Ad saved as draft!',
        'success'
      );

      setTimeout(() => navigate('/dashboard/ads'), 2000);

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
        <Toast message={toastMessage} type={toastType} onClose={() => setShowToast(false)} />
      )}

      <div className="max-w-4xl mx-auto pb-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">
              Create Ad - Type {adCategory}
            </h1>
            <p className="text-dark-grey-600 mt-2">
              {adCategory === 1 ? 'Webflyer Style: Images + Link' : 'Irregular Format: Full Details'}
            </p>
          </div>
          <button
            onClick={() => setAdCategory(null)}
            className="text-cyan-600 hover:text-cyan-700 underline"
          >
            Change Type
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-8 space-y-10">
            
            {/* CATEGORY 1: Webflyer */}
            {adCategory === 1 && (
              <>
                {/* Images */}
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-purple-500">
                    <ImageIcon className="text-purple-600" size={28} />
                    <h2 className="text-2xl font-bold text-navy-800">Images</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-semibold text-navy-800 mb-2">
                        Upload Your Images <span className="text-red-500">*</span>
                      </h3>
                      <p className="text-sm text-dark-grey-600">
                        Upload product images or promotional graphics (max 3MB each)
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

                {/* Link */}
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-blue-500">
                    <LinkIcon className="text-blue-600" size={28} />
                    <h2 className="text-2xl font-bold text-navy-800">Website Link</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-dark-grey-600">
                        Provide your website URL (REQUIRED)
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Website URL <span className="text-red-500">*</span>
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
                  </div>
                </div>

                {/* Placement */}
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-cyan-500">
                    <MapPin className="text-cyan-600" size={28} />
                    <h2 className="text-2xl font-bold text-navy-800">Placement & Region</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Placement Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="placement_type"
                        value={formData.placement_type}
                        onChange={handleChange}
                        className={`input-field ${errors.placement_type ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select placement...</option>
                        <option value="main">Main</option>
                        <option value="regional">Regional</option>
                      </select>
                      {errors.placement_type && (
                        <p className="text-sm text-red-500 mt-1">{errors.placement_type}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Region / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="region_city"
                        value={formData.region_city}
                        onChange={handleChange}
                        className={`input-field ${errors.region_city ? 'border-red-500' : ''}`}
                        placeholder="Enter city or region"
                      />
                      {errors.region_city && (
                        <p className="text-sm text-red-500 mt-1">{errors.region_city}</p>
                      )}
                    </div>

                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <p className="text-sm text-navy-800">
                        <strong>Duration:</strong> All ads run for a minimum of 3 months
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* CATEGORY 2: Full Format */}
            {adCategory === 2 && (
              <>
                {/* Keep existing CreateAd sections for Category 2 */}
                {/* Ad Content section */}
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
                        placeholder="Enter a catchy title"
                        maxLength={200}
                      />
                      {errors.title && <span className="text-sm text-red-500">{errors.title}</span>}
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
                        className="input-field"
                        placeholder="Brief description"
                        maxLength={250}
                      />
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
                        placeholder="Detailed description..."
                        maxLength={2000}
                      />
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
                        placeholder="e.g., Shop Now, Learn More"
                        maxLength={100}
                      />
                    </div>
                  </div>
                </div>

                {/* Images (Optional for Cat 2) */}
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-purple-500">
                    <ImageIcon className="text-purple-600" size={28} />
                    <h2 className="text-2xl font-bold text-navy-800">Images (Optional)</h2>
                  </div>
                  <FileUpload onFilesUploaded={handleFilesUploaded} />
                </div>

                {/* Links (Optional for Cat 2) */}
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-blue-500">
                    <LinkIcon className="text-blue-600" size={28} />
                    <h2 className="text-2xl font-bold text-navy-800">Links (Optional)</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://www.yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Catalog URL
                      </label>
                      <input
                        type="url"
                        name="catalog_url"
                        value={formData.catalog_url}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="https://www.yourcatalog.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Placement for Cat 2 */}
                <div>
                  <div className="flex items-center space-x-3 mb-6 pb-3 border-b-2 border-cyan-500">
                    <MapPin className="text-cyan-600" size={28} />
                    <h2 className="text-2xl font-bold text-navy-800">Placement & Region</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Placement Type
                      </label>
                      <select
                        name="placement_type"
                        value={formData.placement_type}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select placement...</option>
                        <option value="main">Main</option>
                        <option value="regional">Regional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-navy-800 mb-2">
                        Region / City
                      </label>
                      <input
                        type="text"
                        name="region_city"
                        value={formData.region_city}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Enter city or region"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <button
              onClick={() => navigate('/dashboard/ads')}
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
        </div>
      </div>
    </>
  );
};

export default CreateAd;