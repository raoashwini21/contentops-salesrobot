import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { formatSuggestionForDisplay } from '../utils/parseClaudeResponse'

function SuggestionReview({ suggestions, selectedSuggestions, onBack, onNext, onError }) {
  const [selected, setSelected] = useState(new Set(selectedSuggestions))

  const handleToggle = (suggestionId) => {
    const newSelected = new Set(selected)
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId)
    } else {
      newSelected.add(suggestionId)
    }
    setSelected(newSelected)
  }

  const handleSelectAll = () => {
    setSelected(new Set(suggestions.map(s => s.id)))
  }

  const handleDeselectAll = () => {
    setSelected(new Set())
  }

  const handleNext = () => {
    if (selected.size === 0) {
      onError('Please select at least one suggestion to apply')
      return
    }

    onError(null)
    onNext(Array.from(selected))
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertCircle size={20} className="text-red-600" />
      case 'medium':
        return <Info size={20} className="text-orange-600" />
      case 'low':
        return <CheckCircle2 size={20} className="text-blue-600" />
      default:
        return <Info size={20} className="text-gray-600" />
    }
  }

  const groupedSuggestions = {
    high: suggestions.filter(s => s.severity === 'high'),
    medium: suggestions.filter(s => s.severity === 'medium'),
    low: suggestions.filter(s => s.severity === 'low')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Review Suggestions
          </h2>
          <p className="text-gray-600">
            Select which suggestions you want to apply to your blog post
          </p>
        </div>

        {/* Summary */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">{suggestions.length}</span> suggestions found
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {selected.size} selected to apply
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Suggestions by priority */}
        <div className="space-y-6 mb-8 max-h-[600px] overflow-y-auto">
          {/* High Priority */}
          {groupedSuggestions.high.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center space-x-2">
                <AlertCircle size={24} />
                <span>High Priority ({groupedSuggestions.high.length})</span>
              </h3>
              <div className="space-y-3">
                {groupedSuggestions.high.map(suggestion => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isSelected={selected.has(suggestion.id)}
                    onToggle={handleToggle}
                    icon={getSeverityIcon(suggestion.severity)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority */}
          {groupedSuggestions.medium.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center space-x-2">
                <Info size={24} />
                <span>Medium Priority ({groupedSuggestions.medium.length})</span>
              </h3>
              <div className="space-y-3">
                {groupedSuggestions.medium.map(suggestion => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isSelected={selected.has(suggestion.id)}
                    onToggle={handleToggle}
                    icon={getSeverityIcon(suggestion.severity)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Low Priority */}
          {groupedSuggestions.low.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-600 mb-3 flex items-center space-x-2">
                <CheckCircle2 size={24} />
                <span>Low Priority ({groupedSuggestions.low.length})</span>
              </h3>
              <div className="space-y-3">
                {groupedSuggestions.low.map(suggestion => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    isSelected={selected.has(suggestion.id)}
                    onToggle={handleToggle}
                    icon={getSeverityIcon(suggestion.severity)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button
            onClick={handleNext}
            disabled={selected.size === 0}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Apply {selected.size} Suggestion{selected.size !== 1 ? 's' : ''}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

function SuggestionCard({ suggestion, isSelected, onToggle, icon }) {
  const formatted = formatSuggestionForDisplay(suggestion)

  return (
    <div
      className={`suggestion-card cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-purple-600 bg-purple-50' : ''
      }`}
      onClick={() => onToggle(suggestion.id)}
    >
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggle(suggestion.id)}
          className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon}
            <span className={`text-sm font-semibold ${formatted.severityColor}`}>
              {formatted.severityLabel}
            </span>
            {suggestion.type && suggestion.type !== 'other' && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                {suggestion.type}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Original:</span>
              <p className="text-gray-900 bg-red-50 px-3 py-2 rounded mt-1 border border-red-200">
                "{suggestion.original}"
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase font-semibold">Suggested:</span>
              <p className="text-gray-900 bg-green-50 px-3 py-2 rounded mt-1 border border-green-200">
                "{suggestion.suggested}"
              </p>
            </div>
            {suggestion.reason && (
              <div>
                <span className="text-xs text-gray-500 uppercase font-semibold">Reason:</span>
                <p className="text-gray-700 text-sm mt-1">{suggestion.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuggestionReview
