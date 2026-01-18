import { useState, useEffect } from 'react'
import { Save, X, Settings as SettingsIcon, Eye, EyeOff } from 'lucide-react'
import { getWebflowCredentials, saveWebflowCredentials } from '../utils/webflowAPI'

function Settings({ onClose }) {
  const [apiToken, setApiToken] = useState('')
  const [collectionId, setCollectionId] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const credentials = getWebflowCredentials()
    if (credentials.apiToken) {
      setApiToken(credentials.apiToken)
    }
    if (credentials.collectionId) {
      setCollectionId(credentials.collectionId)
    }
  }, [])

  const handleSave = () => {
    saveWebflowCredentials(apiToken, collectionId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all saved credentials?')) {
      setApiToken('')
      setCollectionId('')
      localStorage.removeItem('webflow_api_token')
      localStorage.removeItem('webflow_collection_id')
    }
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-6">
        {/* API Token */}
        <div>
          <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 mb-2">
            Webflow API Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              id="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              placeholder="Enter your Webflow API token"
              className="input-field pr-12"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Get your API token from{' '}
            <a
              href="https://webflow.com/dashboard/account/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              Webflow Account Settings
            </a>
          </p>
        </div>

        {/* Collection ID */}
        <div>
          <label htmlFor="collectionId" className="block text-sm font-medium text-gray-700 mb-2">
            Blog Collection ID
          </label>
          <input
            type="text"
            id="collectionId"
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            placeholder="Enter your blog collection ID"
            className="input-field"
          />
          <p className="mt-2 text-sm text-gray-500">
            Find your collection ID in the Webflow Designer or API documentation
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">How to get your credentials:</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <span>
                Go to{' '}
                <a
                  href="https://webflow.com/dashboard/account/apps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Webflow Account Settings
                </a>
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <span>Navigate to the "Integrations" tab and create a new API token</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <span>Open your site in Webflow Designer</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <span>Go to your blog collection and copy the Collection ID from the settings</span>
            </li>
          </ol>
        </div>

        {/* Security Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Security Note:</strong> Your credentials are stored locally in your browser's localStorage.
            Never share your API token with others.
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <button
            onClick={handleSave}
            disabled={!apiToken || !collectionId}
            className="btn-primary flex-1 flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>{saved ? 'Saved!' : 'Save Credentials'}</span>
          </button>
          <button
            onClick={handleClear}
            className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Storage Info */}
        <div className="text-center text-xs text-gray-500 pt-2">
          Credentials are stored securely in your browser's local storage
        </div>
      </div>
    </div>
  )
}

export default Settings
