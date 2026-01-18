import { useState } from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import URLInput from './components/URLInput'
import AnalysisInstructions from './components/AnalysisInstructions'
import SuggestionReview from './components/SuggestionReview'
import Editor from './components/Editor'
import Success from './components/Success'
import Settings from './components/Settings'

const STEPS = {
  URL_INPUT: 'url_input',
  ANALYSIS_INSTRUCTIONS: 'analysis_instructions',
  SUGGESTION_REVIEW: 'suggestion_review',
  EDITOR: 'editor',
  SUCCESS: 'success'
}

function App() {
  const [currentStep, setCurrentStep] = useState(STEPS.URL_INPUT)
  const [showSettings, setShowSettings] = useState(false)

  // Application state
  const [blogURL, setBlogURL] = useState('')
  const [blogData, setBlogData] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestions, setSelectedSuggestions] = useState([])
  const [editedContent, setEditedContent] = useState('')
  const [error, setError] = useState(null)

  // Step 1: URL submitted
  const handleURLSubmit = (url, data) => {
    setBlogURL(url)
    setBlogData(data)
    setError(null)
    setCurrentStep(STEPS.ANALYSIS_INSTRUCTIONS)
  }

  // Step 2: User has Claude's response
  const handleClaudeResponseSubmit = (parsedSuggestions) => {
    setSuggestions(parsedSuggestions)
    setSelectedSuggestions(parsedSuggestions.map(s => s.id)) // All selected by default
    setError(null)
    setCurrentStep(STEPS.SUGGESTION_REVIEW)
  }

  // Step 3: User confirms which suggestions to apply
  const handleSuggestionsConfirmed = (selected) => {
    setSelectedSuggestions(selected)
    setError(null)
    setCurrentStep(STEPS.EDITOR)
  }

  // Step 4: User finalizes edits
  const handleEditorComplete = (finalContent) => {
    setEditedContent(finalContent)
    setError(null)
    setCurrentStep(STEPS.SUCCESS)
  }

  // Handle publish success
  const handlePublishSuccess = () => {
    // Reset to start
    setCurrentStep(STEPS.URL_INPUT)
    setBlogURL('')
    setBlogData(null)
    setSuggestions([])
    setSelectedSuggestions([])
    setEditedContent('')
    setError(null)
  }

  // Navigate back to previous step
  const handleBack = () => {
    setError(null)
    if (currentStep === STEPS.ANALYSIS_INSTRUCTIONS) {
      setCurrentStep(STEPS.URL_INPUT)
    } else if (currentStep === STEPS.SUGGESTION_REVIEW) {
      setCurrentStep(STEPS.ANALYSIS_INSTRUCTIONS)
    } else if (currentStep === STEPS.EDITOR) {
      setCurrentStep(STEPS.SUGGESTION_REVIEW)
    } else if (currentStep === STEPS.SUCCESS) {
      setCurrentStep(STEPS.EDITOR)
    }
  }

  // Step indicator
  const getStepNumber = () => {
    switch (currentStep) {
      case STEPS.URL_INPUT:
        return 1
      case STEPS.ANALYSIS_INSTRUCTIONS:
        return 2
      case STEPS.SUGGESTION_REVIEW:
        return 3
      case STEPS.EDITOR:
        return 4
      case STEPS.SUCCESS:
        return 5
      default:
        return 1
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case STEPS.URL_INPUT:
        return 'Enter Blog URL'
      case STEPS.ANALYSIS_INSTRUCTIONS:
        return 'Get AI Analysis'
      case STEPS.SUGGESTION_REVIEW:
        return 'Review Suggestions'
      case STEPS.EDITOR:
        return 'Edit & Finalize'
      case STEPS.SUCCESS:
        return 'Publish'
      default:
        return ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Blog Fact-Checker</h1>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white backdrop-blur-sm"
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-8">
            <Settings onClose={() => setShowSettings(false)} />
          </div>
        )}

        {/* Step Indicator */}
        {!showSettings && (
          <div className="mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 border border-white/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">
                  Step {getStepNumber()} of 5: {getStepTitle()}
                </h2>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      step <= getStepNumber()
                        ? 'bg-white'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-500/90 backdrop-blur-sm text-white p-4 rounded-lg border border-red-600">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Step Components */}
        {!showSettings && (
          <>
            {currentStep === STEPS.URL_INPUT && (
              <URLInput onSubmit={handleURLSubmit} onError={setError} />
            )}

            {currentStep === STEPS.ANALYSIS_INSTRUCTIONS && (
              <AnalysisInstructions
                blogData={blogData}
                onBack={handleBack}
                onNext={handleClaudeResponseSubmit}
                onError={setError}
              />
            )}

            {currentStep === STEPS.SUGGESTION_REVIEW && (
              <SuggestionReview
                suggestions={suggestions}
                selectedSuggestions={selectedSuggestions}
                onBack={handleBack}
                onNext={handleSuggestionsConfirmed}
                onError={setError}
              />
            )}

            {currentStep === STEPS.EDITOR && (
              <Editor
                blogData={blogData}
                suggestions={suggestions.filter(s => selectedSuggestions.includes(s.id))}
                onBack={handleBack}
                onNext={handleEditorComplete}
                onError={setError}
              />
            )}

            {currentStep === STEPS.SUCCESS && (
              <Success
                blogData={blogData}
                editedContent={editedContent}
                onBack={handleBack}
                onComplete={handlePublishSuccess}
                onError={setError}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-white/80">
        <p className="text-sm">
          Powered by Claude AI • Webflow Integration
        </p>
      </footer>
    </div>
  )
}

export default App
