// src/pages/index.tsx
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Layout } from '../components/common/layout';
import { toast } from 'react-toastify';
import { performJobMatch } from '../middleware/jobmatch';
import router from 'next/router';

// ... (keep the existing interfaces)

const HomePage = () => {
  const { t } = useTranslation();
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMatch = async () => {
    if (!resume || !jobDescription) {
      toast.warning(t('match.missingFields'));
      return;
    }

    setIsProcessing(true);
    try {
      const result = await performJobMatch(resume, jobDescription);
      setMatchResult(result);
      toast.success(t('match.success'));
    } catch (error) {
      console.error('Match error:', error);
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        toast.error(t('match.rateLimitError'), {
          onClick: () => router.push('/upgrade')
        });
      } else {
        toast.error(t('match.error'));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ... (keep the existing file upload handler)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* ... (keep the existing JSX for the title) */}

        {/* Upload/Paste Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              {t('home.uploadSection.resume.title')}
            </h2>
            
            <div className="mb-4">
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="hidden"
                id="resumeUpload"
              />
              <label
                htmlFor="resumeUpload"
                className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                {t('home.uploadSection.resume.dragDrop')}
              </label>
            </div>

            <div className="mb-2 text-sm text-gray-600 text-center">
              {t('home.uploadSection.resume.or')}
            </div>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder={t('home.uploadSection.resume.placeholder')}
              className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Job Description Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* ... (keep the existing job description section JSX) */}
          </div>
        </div>

        {/* Match Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleMatch}
            disabled={isProcessing}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('home.processing')}
              </span>
            ) : (
              t('home.matchButton')
            )}
          </button>
        </div>

        {/* Results Section */}
        {matchResult && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            {/* ... (keep the existing results display JSX) */}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
};

export default HomePage;