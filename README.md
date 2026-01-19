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

### 2. Start Development Server

The Vite dev server includes a proxy to handle CORS issues with the Webflow API:

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Configure Webflow Credentials

1. Click the "Settings" button in the app
2. Enter your Webflow API Token and Collection ID
3. Save credentials

### 4. Build for Production

```bash
npm run build
```

Then start the production server with the backend proxy:

```bash
npm start
```

The production server runs on `http://localhost:3001` and serves both the React app and the API proxy.

## CORS Solution

Webflow's API doesn't support direct browser calls due to CORS restrictions. This app solves this in two ways:

**Development:** Vite's built-in proxy forwards `/api/webflow/*` requests to `https://api.webflow.com`

**Production:** A lightweight Express server (`server/index.js`) acts as a proxy between your frontend and Webflow's API

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

## Deployment

### Option 1: Deploy to Vercel/Netlify with Serverless Functions

For platforms like Vercel or Netlify, you'll need to create serverless functions to proxy the Webflow API. Alternatively, use a separate backend service.

### Option 2: Deploy to Traditional Hosting (Heroku, DigitalOcean, etc.)

1. Build the React app:
   ```bash
   npm run build
   ```

2. Set environment variables:
   ```bash
   export NODE_ENV=production
   export PORT=3001
   ```

3. Start the server:
   ```bash
   npm start
   ```

The server will serve both the built React app and handle API proxying.

### Environment Variables

For production deployments, you can optionally set:
- `VITE_API_URL` - Backend API URL (defaults to `/api/webflow/v2`)
- `PORT` - Server port (defaults to `3001`)

## Troubleshooting

### CORS Errors

If you see CORS errors:
- **Development:** Make sure you're running `npm run dev` (not opening index.html directly)
- **Production:** Ensure the backend server is running and properly configured

### API Token Issues

- Verify your API token has the correct permissions in Webflow
- Make sure you're using a v2 API token (not v1)
- Check that the Collection ID is correct

## License

MIT
