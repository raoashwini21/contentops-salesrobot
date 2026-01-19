/**
 * Webflow API utilities for fetching and updating blog posts
 */

// Use proxy in development, direct API in production with backend
const WEBFLOW_API_BASE = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '/api/webflow/v2')
  : '/api/webflow/v2';

/**
 * Get Webflow credentials from localStorage
 */
export function getWebflowCredentials() {
  const apiToken = localStorage.getItem('webflow_api_token');
  const collectionId = localStorage.getItem('webflow_collection_id');

  return { apiToken, collectionId };
}

/**
 * Save Webflow credentials to localStorage
 */
export function saveWebflowCredentials(apiToken, collectionId) {
  localStorage.setItem('webflow_api_token', apiToken);
  localStorage.setItem('webflow_collection_id', collectionId);
}

/**
 * Extract slug from Webflow blog URL
 * Example: https://example.webflow.io/blog/my-post -> "my-post"
 */
export function extractSlugFromURL(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1];
  } catch (error) {
    throw new Error('Invalid URL format');
  }
}

/**
 * Fetch blog post from Webflow by URL
 */
export async function fetchBlogByURL(blogURL) {
  const { apiToken, collectionId } = getWebflowCredentials();

  if (!apiToken || !collectionId) {
    throw new Error('Webflow credentials not configured. Please go to Settings.');
  }

  const slug = extractSlugFromURL(blogURL);

  try {
    // Fetch all items from collection
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${collectionId}/items`,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API token. Please check your credentials in Settings.');
      }
      if (response.status === 404) {
        throw new Error('Collection not found. Please check your Collection ID in Settings.');
      }
      throw new Error(`Webflow API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Find the item matching the slug
    const blogPost = data.items?.find(item =>
      item.fieldData?.slug === slug || item.slug === slug
    );

    if (!blogPost) {
      throw new Error(`Blog post with slug "${slug}" not found in collection.`);
    }

    return {
      id: blogPost.id,
      slug: blogPost.fieldData?.slug || blogPost.slug,
      name: blogPost.fieldData?.name || blogPost.name,
      content: blogPost.fieldData?.['post-body'] || blogPost.fieldData?.content || '',
      fieldData: blogPost.fieldData,
      isDraft: blogPost.isDraft
    };

  } catch (error) {
    if (error.message.includes('Webflow')) {
      throw error;
    }
    throw new Error(`Failed to fetch blog: ${error.message}`);
  }
}

/**
 * Update blog post content in Webflow
 */
export async function updateBlogPost(itemId, updatedContent, fieldName = 'post-body') {
  const { apiToken, collectionId } = getWebflowCredentials();

  if (!apiToken || !collectionId) {
    throw new Error('Webflow credentials not configured. Please go to Settings.');
  }

  try {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${collectionId}/items/${itemId}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'accept': 'application/json',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          fieldData: {
            [fieldName]: updatedContent
          }
        })
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid API token. Please check your credentials in Settings.');
      }
      if (response.status === 404) {
        throw new Error('Blog post not found.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to update blog: ${errorData.message || response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    if (error.message.includes('credentials') || error.message.includes('Failed to update')) {
      throw error;
    }
    throw new Error(`Update failed: ${error.message}`);
  }
}

/**
 * Publish blog post (set isDraft to false)
 */
export async function publishBlogPost(itemId) {
  const { apiToken, collectionId } = getWebflowCredentials();

  if (!apiToken || !collectionId) {
    throw new Error('Webflow credentials not configured. Please go to Settings.');
  }

  try {
    const response = await fetch(
      `${WEBFLOW_API_BASE}/collections/${collectionId}/items/${itemId}/publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to publish: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    throw new Error(`Publish failed: ${error.message}`);
  }
}
