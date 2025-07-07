# API Configuration for Celebrity Photos

## TMDb API Setup (Recommended)

To enable real celebrity photos, you'll need to set up The Movie Database (TMDb) API:

### Step 1: Get TMDb API Key
1. Go to [TMDb website](https://www.themoviedb.org/)
2. Create a free account
3. Go to [API Settings](https://www.themoviedb.org/settings/api)
4. Request an API key (it's free!)

### Step 2: Configure Environment Variables
1. Create a `.env` file in your project root
2. Add your API key:
```
VITE_TMDB_API_KEY=your_api_key_here
```

### Step 3: Restart Your Development Server
```bash
npm start
```

## Alternative Options

### Option 1: Use Without API Key
- The app will fallback to colorful blocks with initials
- No setup required
- Works immediately

### Option 2: Use with Unsplash Fallback
- Import `CelebrityImageWithUnsplash` instead of `CelebrityImage`
- Uses Unsplash as fallback for unknown celebrities
- No API key required for Unsplash

### Option 3: Static Images
- Store celebrity photos in `src/assets/celebrities/`
- Create a mapping object with celebrity names to image files
- Guaranteed to work offline

## Testing

Test the setup by:
1. Upload a photo in the Celebrity Match section
2. Check if real celebrity photos load
3. If not, check the browser console for errors

## Current Implementation

The project now uses `CelebrityImageMultiSource` component which tries multiple sources:

1. **TMDb API** (if API key is configured)
2. **Static celebrities** (for common names like "Ryan Reynolds", "Emma Stone")
3. **Unsplash** (as fallback for any name)
4. **Colored blocks** (if all else fails)

## Quick Start Without API Key

The app works immediately without any setup! It will:
- Show placeholder images for known celebrities
- Use Unsplash for unknown celebrities
- Fall back to colored blocks with initials

## Troubleshooting

- **"TMDb API key not configured"**: Add your API key to `.env` as `VITE_TMDB_API_KEY=your_key`
- **"process is not defined"**: Use `VITE_TMDB_API_KEY` instead of `REACT_APP_TMDB_API_KEY`
- **CORS errors**: TMDb API should work from localhost
- **404 errors**: Celebrity might not be in TMDb database
- **Rate limiting**: Wait a moment and try again

## API Limits

- TMDb: 40 requests per 10 seconds (free tier)
- Unsplash: 5000 requests per month (free tier)
- Both are sufficient for normal usage 