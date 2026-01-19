import { useState, useEffect } from 'react'
import { Copy, Check, ExternalLink, ArrowLeft, ArrowRight } from 'lucide-react'
import { extractTextContent } from '../utils/applyChanges'
import { parseClaudeResponse, validateSuggestions } from '../utils/parseClaudeResponse'

function AnalysisInstructions({ blogData, onBack, onNext, onError }) {
  const [copied, setCopied] = useState(false)
  const [claudeResponse, setClaudeResponse] = useState('')
  const [showResponseInput, setShowResponseInput] = useState(false)

  const analysisPrompt = `Please fact-check the following blog post and provide corrections in this format:

MUST FIX (high priority):
1. [Description] - Change "[original text]" to "[corrected text]" because [reason]

SHOULD FIX (medium priority):
1. [Description] - Change "[original text]" to "[corrected text]" because [reason]

CONSIDER (low priority):
1. [Description] - Change "[original text]" to "[corrected text]" because [reason]

Blog Title: ${blogData.name}

Blog Content:
${extractTextContent(blogData.content)}

Please analyze for:
- Factual errors
- Outdated information
- Grammar and spelling issues
- Clarity and readability improvements
- Style consistency`

  useEffect(() => {
    // Auto-copy on mount
    handleCopyPrompt()
  }, [])

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(analysisPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      onError('Failed to copy to clipboard')
    }
  }

  const handleOpenClaude = () => {
    const width = 1000
    const height = 800
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    window.open(
      'https://claude.ai',
      'claude-window',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    )

    // Show response input after opening Claude
    setTimeout(() => setShowResponseInput(true), 1000)
  }

  const handleResponseSubmit = () => {
    if (!claudeResponse.trim()) {
      onError('Please paste Claude\'s response')
      return
    }

    onError(null)

    const parsedSuggestions = parseClaudeResponse(claudeResponse)
    const validSuggestions = validateSuggestions(parsedSuggestions)

    if (validSuggestions.length === 0) {
      onError('No valid suggestions found in the response. Please make sure Claude provided corrections in the requested format.')
      return
    }

    onNext(validSuggestions)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Get AI Analysis from Claude
          </h2>
          <p className="text-gray-600">
            Follow these steps to get fact-checking suggestions from Claude AI
          </p>
        </div>

        {/* Blog Info */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-1">Analyzing:</h3>
          <p className="text-gray-700">{blogData.name}</p>
          <p className="text-sm text-gray-500 mt-1">
            Content length: {extractTextContent(blogData.content).length} characters
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Copy the analysis prompt</h4>
              <button
                onClick={handleCopyPrompt}
                className="btn-secondary flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <Check size={20} className="text-green-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={20} />
                    <span>Copy Prompt to Clipboard</span>
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                The prompt has been automatically copied to your clipboard
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Open Claude AI</h4>
              <button
                onClick={handleOpenClaude}
                className="btn-primary flex items-center space-x-2"
              >
                <ExternalLink size={20} />
                <span>Open Claude.ai in Popup</span>
              </button>
              <p className="text-sm text-gray-500 mt-2">
                This will open Claude.ai in a new popup window
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Paste and get response</h4>
              <p className="text-gray-600">
                Paste the prompt into Claude.ai and wait for the fact-checking analysis
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Copy Claude's response</h4>
              <p className="text-gray-600 mb-3">
                Copy the entire response from Claude and paste it below
              </p>

              {showResponseInput && (
                <div className="space-y-3">
                  <textarea
                    value={claudeResponse}
                    onChange={(e) => setClaudeResponse(e.target.value)}
                    placeholder="Paste Claude's response here..."
                    rows={10}
                    className="input-field font-mono text-sm"
                  />
                  <button
                    onClick={handleResponseSubmit}
                    disabled={!claudeResponse.trim()}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <span>Parse Suggestions</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {!showResponseInput && (
                <button
                  onClick={() => setShowResponseInput(true)}
                  className="btn-secondary"
                >
                  I have Claude's response
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Preview of prompt */}
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-purple-600">
            Preview analysis prompt
          </summary>
          <pre className="mt-3 p-4 bg-gray-50 rounded-lg text-xs overflow-x-auto border border-gray-200">
            {analysisPrompt}
          </pre>
        </details>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnalysisInstructions
