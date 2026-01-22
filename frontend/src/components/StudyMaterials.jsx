import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const StudyMaterials = ({ onBack }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    { kannada: 'ಮುದ್ರಣ ಹೇಳಿಕೆ', english: 'Print Statement', key: 'print' },
    { kannada: 'ಡೇಟಾಟೈಪ್ಸ್', english: 'Datatypes', key: 'datatypes' },
    { kannada: 'ವೇರಿಯಬಲ್', english: 'Variables', key: 'variables' },
    { kannada: 'ನಿರ್ವಹಕರಗಳು', english: 'Operators', key: 'operators' },
    { kannada: 'ಪರಿಕರಮಾಬದ್ದ ಹೇಳಿಕೆಗಳು', english: 'Conditional Statements', key: 'conditional' },
    { kannada: 'ಲೂಪ್ ಹೇಳಿಕೆಗಳು', english: 'Loop Statements', key: 'loop' },
    { kannada: 'ದೋಷ ಪ್ರಾವರಾಗಳು', english: 'Error Handling', key: 'error' }
  ];

  useEffect(() => {
    fetchStudyMaterials();
  }, []);

  const fetchStudyMaterials = async () => {
    try {
      setLoading(true);
      const data = await apiService.getStudyMaterials();
      setMaterials(data.materials || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching study materials:', err);
      setError('Failed to load study materials');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryMaterials = (categoryKey) => {
    return materials.filter(material => {
      const filename = material.filename?.toLowerCase() || '';
      const category = material.category?.toLowerCase() || '';

      // Match by filename or category
      if (categoryKey === 'loop') {
        return filename.includes('loop') || category.includes('loop');
      } else if (categoryKey === 'error') {
        return filename.includes('error') || category.includes('error');
      } else {
        return filename.includes(categoryKey) || category.includes(categoryKey);
      }
    });
  };

  const handleCategoryClick = (category) => {
    const categoryMaterials = getCategoryMaterials(category.key);
    if (categoryMaterials.length > 0) {
      // Download the first material in this category
      const material = categoryMaterials[0];
      apiService.downloadStudyMaterial(material.id);
    }
  };

  const handleDownload = (fileId, filename) => {
    try {
      apiService.downloadStudyMaterial(fileId);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes, k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 text-slate-600 dark:text-white flex items-center gap-2 hover:text-teal-600 dark:hover:text-cyan-400 transition"
        >
          ← ಹಿಂತಿರುಗಿ
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-kannada text-5xl font-bold text-slate-900 dark:text-white mb-4">ನಿಪಯೋಗಳು</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">
            Programming concepts and study materials
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Category Cards */}
          {categories.slice(0, 4).map((category, index) => {
            const categoryMaterials = getCategoryMaterials(category.key);
            return (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="font-kannada text-2xl font-bold text-white mb-2">{category.kannada}</h3>
                  <p className="text-cyan-100 text-sm">{category.english}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.slice(4).map((category, index) => {
            const categoryMaterials = getCategoryMaterials(category.key);
            return (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl p-6 shadow-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="text-center">
                  <h3 className="font-kannada text-2xl font-bold text-white mb-2">{category.kannada}</h3>
                  <p className="text-cyan-100 text-sm">{category.english}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudyMaterials;
