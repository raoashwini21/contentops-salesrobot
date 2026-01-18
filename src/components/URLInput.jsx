import { useState } from 'react'
import { Link2, Loader2 } from 'lucide-react'
import { fetchBlogByURL } from '../utils/webflowAPI'

function URLInput({ onSubmit, onError }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!url.trim()) {
      onError('Please enter a blog URL')
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch (err) {
      onError('Please enter a valid URL')
      return
    }

    setLoading(true)
    onError(null)

    try {
      const blogData = await fetchBlogByURL(url)
      onSubmit(url, blogData)
    } catch (error) {
      onError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4">
            <Link2 className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Start Fact-Checking
          </h2>
          <p className="text-gray-600">
            Enter your Webflow blog URL to begin the fact-checking process
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Blog URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.webflow.io/blog/my-post"
              className="input-field"
              disabled={loading}
            />
            <p className="mt-2 text-sm text-gray-500">
              Example: https://yoursite.webflow.io/blog/post-slug
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Fetching blog...</span>
              </>
            ) : (
              <>
                <span>Fetch Blog</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Before you start:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>Make sure your Webflow API credentials are configured in Settings</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>The blog must exist in your Webflow collection</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>You'll need access to Claude.ai for fact-checking analysis</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default URLInput
