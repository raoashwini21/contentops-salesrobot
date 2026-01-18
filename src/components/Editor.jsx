import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, Bold, Italic, List, Link as LinkIcon, Undo, Redo } from 'lucide-react'
import { applyMultipleSuggestions, removeHighlights, countChanges } from '../utils/applyChanges'

function Editor({ blogData, suggestions, onBack, onNext, onError }) {
  const [content, setContent] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const editorRef = useRef(null)

  useEffect(() => {
    // Apply all suggestions to the original content
    const contentWithHighlights = applyMultipleSuggestions(blogData.content, suggestions)
    setContent(contentWithHighlights)
    setHasChanges(countChanges(contentWithHighlights) > 0)
  }, [blogData.content, suggestions])

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
      setHasChanges(true)
    }
  }

  const handleNext = () => {
    if (!hasChanges) {
      onError('No changes have been made to the content')
      return
    }

    onError(null)
    // Remove highlights before sending
    const finalContent = removeHighlights(content)
    onNext(finalContent)
  }

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    handleContentChange()
  }

  const handleUndo = () => {
    document.execCommand('undo')
    handleContentChange()
  }

  const handleRedo = () => {
    document.execCommand('redo')
    handleContentChange()
  }

  const changeCount = countChanges(content)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 border border-purple-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Edit & Finalize
          </h2>
          <p className="text-gray-600">
            Review the suggested changes (highlighted in green) and make any additional edits
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-green-900">
                {changeCount} change{changeCount !== 1 ? 's' : ''} applied
              </p>
              <p className="text-sm text-green-700 mt-1">
                Green highlights show where changes were made. Edit the content as needed.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-gray-100 border border-gray-300 rounded-t-lg p-3 flex items-center space-x-2 flex-wrap gap-2">
          <button
            onClick={handleUndo}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Undo"
            type="button"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Redo"
            type="button"
          >
            <Redo size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <button
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Bold"
            type="button"
          >
            <Bold size={18} />
          </button>
          <button
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Italic"
            type="button"
          >
            <Italic size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Bullet List"
            type="button"
          >
            <List size={18} />
          </button>
          <button
            onClick={() => {
              const url = prompt('Enter URL:')
              if (url) execCommand('createLink', url)
            }}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Insert Link"
            type="button"
          >
            <LinkIcon size={18} />
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <select
            onChange={(e) => execCommand('formatBlock', e.target.value)}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-sm"
            defaultValue=""
          >
            <option value="">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
          </select>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          dangerouslySetInnerHTML={{ __html: content }}
          className="min-h-[500px] max-h-[600px] overflow-y-auto p-6 bg-white border border-gray-300 border-t-0 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-purple-500 prose max-w-none"
          style={{
            lineHeight: '1.6',
          }}
        />

        <p className="text-sm text-gray-500 mt-3">
          Click inside the editor to make changes. Green highlights will be removed when publishing.
        </p>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <button
            onClick={handleNext}
            disabled={!hasChanges}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Continue to Publish</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Editor
