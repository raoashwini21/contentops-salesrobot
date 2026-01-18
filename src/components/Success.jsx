import { useState } from 'react'
import { ArrowLeft, Loader2, CheckCircle, ExternalLink, RotateCcw } from 'lucide-react'
import { updateBlogPost, publishBlogPost } from '../utils/webflowAPI'

function Success({ blogData, editedContent, onBack, onComplete, onError }) {
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishedURL, setPublishedURL] = useState('')

  const handlePublish = async () => {
    setPublishing(true)
    onError(null)

    try {
      // Update the blog post content
      await updateBlogPost(blogData.id, editedContent)

      // Optionally publish (set isDraft to false)
      if (blogData.isDraft) {
        await publishBlogPost(blogData.id)
      }

      setPublished(true)
      // Construct the published URL (you may need to adjust this based on your Webflow setup)
      setPublishedURL(`https://webflow.com/dashboard/sites/${blogData.id}`)
    } catch (error) {
      onError(error.message)
    } finally {
      setPublishing(false)
    }
  }

  const handleStartOver = () => {
    onComplete()
  }

  if (published) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <CheckCircle className="text-white" size={48} />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Successfully Published!
          </h2>

          <p className="text-gray-600 mb-8">
            Your fact-checked blog post has been updated and published to Webflow.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">What happened:</h3>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                <span>Blog content updated with fact-checked changes</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                <span>Changes published to your Webflow site</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-600 mr-2 flex-shrink-0 mt-0.5" size={20} />
                <span>All highlights and markup removed</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={publishedURL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <ExternalLink size={20} />
              <span>View in Webflow</span>
            </a>
            <button
              onClick={handleStartOver}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <RotateCcw size={20} />
              <span>Fact-Check Another Blog</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Publish
          </h2>
          <p className="text-gray-600">
            Review your changes and publish to Webflow
          </p>
        </div>

        {/* Blog Info */}
        <div className="bg-purple-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Publishing:</h3>
          <p className="text-gray-700 mb-1">{blogData.name}</p>
          <p className="text-sm text-gray-500">
            Slug: {blogData.slug}
          </p>
        </div>

        {/* What will happen */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">What will happen:</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">1.</span>
              <span>Your edited content will be uploaded to Webflow</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">2.</span>
              <span>All green highlights will be removed automatically</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">3.</span>
              <span>The blog post will be published (if it was in draft mode)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">4.</span>
              <span>Changes will be live on your website</span>
            </li>
          </ul>
        </div>

        {/* Preview stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {editedContent.length}
            </p>
            <p className="text-sm text-gray-600">characters</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {blogData.isDraft ? 'Draft' : 'Published'}
            </p>
            <p className="text-sm text-gray-600">current status</p>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This will overwrite the current blog content. Make sure you've reviewed all changes carefully.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {publishing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span>Publish to Webflow</span>
              </>
            )}
          </button>

          <button
            onClick={onBack}
            disabled={publishing}
            className="btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back to Editor</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Success
