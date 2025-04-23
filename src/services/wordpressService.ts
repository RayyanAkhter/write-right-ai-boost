
/**
 * Placeholder service to publish content to WordPress via REST API.
 * In production, store WordPress access tokens securely in Supabase.
 * The user must provide their WordPress site URL and REST API credentials/token.
 */

export interface PublishParams {
  siteUrl: string; // e.g. https://yourdomain.com
  token: string;   // WordPress REST API JWT or Application Password
  title: string;
  content: string;
}

export async function publishToWordPress({
  siteUrl,
  token,
  title,
  content,
}: PublishParams): Promise<{ success: boolean; postUrl?: string; error?: string }> {
  try {
    const response = await fetch(`${siteUrl.replace(/\/$/, "")}/wp-json/wp/v2/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // For JWT token. For App Password, use Basic Auth as per WP docs.
      },
      body: JSON.stringify({
        title,
        content,
        status: "publish",
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      return { success: false, error: data.message || "Failed to publish to WordPress" };
    }
    const data = await response.json();
    return { success: true, postUrl: data.link };
  } catch (error: any) {
    return { success: false, error: error.message || "An unknown error occurred." };
  }
}
