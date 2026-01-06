/**
 * Root page - this should not be directly accessed
 * All traffic should be rewritten to /_tenant/[slug]/[lang] by middleware
 * This page is a fallback for direct access without proper host resolution
 */
export default function RootPage() {
  return (
    <main>
      <h1>DJ Presskit Capsule Core</h1>
      <p>Multi-tenant presskit engine.</p>
      <p>
        This page is displayed when no tenant can be resolved from the request
        host.
      </p>
    </main>
  );
}
