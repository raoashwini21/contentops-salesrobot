# Blog Fact-Checker Application

A production-ready React web application for fact-checking Webflow blog posts using Claude AI.

## Features

- 🔍 **Smart URL Input** - Fetch blog posts directly from Webflow
- 🤖 **Claude AI Integration** - Get intelligent fact-checking suggestions
- ✅ **Review Interface** - Select which suggestions to apply (high/medium/low priority)
- ✏️ **WYSIWYG Editor** - Edit content with a rich text editor
- 🎨 **Visual Highlights** - See changes highlighted in green
- 🚀 **One-Click Publishing** - Publish directly back to Webflow
- 💾 **Secure Credentials** - Store API keys locally in browser

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Webflow API v2** - Direct integration

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Webflow Credentials

1. Start the development server (see below)
2. Click the "Settings" button in the app
3. Enter your Webflow API Token and Collection ID
4. Save credentials

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## How to Use

### Step 1: Enter Blog URL
- Paste your Webflow blog post URL
- Click "Fetch Blog" to load the content

### Step 2: Get AI Analysis
- The analysis prompt is automatically copied to your clipboard
- Click "Open Claude.ai in Popup" to open Claude
- Paste the prompt and wait for Claude's response
- Copy Claude's response and paste it back into the app

### Step 3: Review Suggestions
- Review all fact-checking suggestions
- Suggestions are categorized by priority (high/medium/low)
- Select which suggestions you want to apply
- Click "Apply Suggestions"

### Step 4: Edit & Finalize
- Review changes (highlighted in green)
- Make additional edits using the WYSIWYG editor
- Use the toolbar for formatting (bold, italic, lists, links)
- Click "Continue to Publish"

### Step 5: Publish
- Review final details
- Click "Publish to Webflow" to update your blog
- All highlights are automatically removed
- Success! Your fact-checked blog is live

## Getting Webflow Credentials

### API Token
1. Go to [Webflow Account Settings](https://webflow.com/dashboard/account/apps)
2. Navigate to "Integrations" tab
3. Create a new API token
4. Copy and save in the app's Settings

### Collection ID
1. Open your site in Webflow Designer
2. Go to your blog collection (CMS)
3. Click on collection settings
4. Copy the Collection ID

## Project Structure

```
contentops-salesrobot/
├── src/
│   ├── components/
│   │   ├── URLInput.jsx           # Step 1: URL input
│   │   ├── AnalysisInstructions.jsx # Step 2: Claude instructions
│   │   ├── SuggestionReview.jsx   # Step 3: Review suggestions
│   │   ├── Editor.jsx             # Step 4: WYSIWYG editor
│   │   ├── Success.jsx            # Step 5: Publish
│   │   └── Settings.jsx           # Credentials management
│   ├── utils/
│   │   ├── webflowAPI.js          # Webflow API integration
│   │   ├── parseClaudeResponse.js # Parse natural language
│   │   └── applyChanges.js        # Apply changes with highlights
│   ├── App.jsx                    # Main state machine
│   ├── main.jsx                   # Entry point
│   └── index.css                  # Tailwind + custom styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Features in Detail

### Natural Language Parsing
The app parses Claude's natural language responses, supporting formats like:
- "Change 'X' to 'Y' because reason"
- "'X' should be 'Y' (reason)"
- "Description - 'X' -> 'Y'"

### HTML Preservation
- Maintains all HTML structure
- Only updates text content
- Preserves formatting, links, and styling

### Visual Feedback
- Green highlights show changes
- Priority-based color coding (red/orange/blue)
- Real-time change counter

### Error Handling
- Comprehensive error messages
- API error handling
- Validation at each step

## Security Notes

- API credentials are stored in browser localStorage
- Never commit credentials to version control
- Use environment variables for production deployments
- Credentials are never sent to third parties

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support

## License

MIT
