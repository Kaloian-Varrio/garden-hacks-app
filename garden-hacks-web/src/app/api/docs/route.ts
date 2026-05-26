const docsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Garden Hacks REST API</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; color: #172018; background: #f7faf5; line-height: 1.55; }
      main { max-width: 1040px; margin: 0 auto; padding: 40px 20px 64px; }
      h1, h2, h3 { color: #12351f; line-height: 1.15; }
      h1 { font-size: 2rem; margin-bottom: 8px; }
      h2 { margin-top: 34px; padding-top: 18px; border-top: 1px solid #dbe8d4; }
      section { margin-top: 18px; }
      code, pre { background: #eef5e9; border-radius: 6px; }
      code { padding: 2px 5px; }
      pre { overflow-x: auto; padding: 14px; border: 1px solid #dbe8d4; }
      table { width: 100%; border-collapse: collapse; background: white; border: 1px solid #dbe8d4; }
      th, td { padding: 10px 12px; border-bottom: 1px solid #dbe8d4; text-align: left; vertical-align: top; }
      th { background: #eef5e9; color: #12351f; }
      .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #dcefd4; color: #12351f; font-size: 0.85rem; }
    </style>
  </head>
  <body>
    <main>
      <h1>Garden Hacks REST API</h1>
      <p>JSON API for the future Expo mobile app. Protected endpoints accept <code>Authorization: Bearer &lt;jwt&gt;</code>. Browser cookie auth is also supported.</p>

      <h2>Error Format</h2>
      <pre><code>{ "error": "Error message here" }</code></pre>
      <pre><code>{ "error": "Validation failed", "details": { "email": "Email is required." } }</code></pre>

      <h2>Endpoints</h2>
      <table>
        <thead><tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td>POST</td><td><code>/api/auth/login</code></td><td>Public</td><td>Login with email and password. Returns <code>token</code> and <code>user</code>.</td></tr>
          <tr><td>POST</td><td><code>/api/auth/register</code></td><td>Public</td><td>Create a user account. Body: <code>{ "name", "email", "password" }</code>.</td></tr>
          <tr><td>GET</td><td><code>/api/auth/me</code></td><td><span class="badge">JWT</span></td><td>Return the current authenticated user.</td></tr>
          <tr><td>GET</td><td><code>/api/groups?page=1&pageSize=10</code></td><td>Optional JWT</td><td>List groups with <code>isJoined</code> when authenticated.</td></tr>
          <tr><td>GET</td><td><code>/api/groups/{id}</code></td><td>Optional JWT</td><td>Group details, managers, recent published hacks, membership state.</td></tr>
          <tr><td>POST</td><td><code>/api/groups/{id}/join</code></td><td><span class="badge">JWT</span></td><td>Join a group as a member.</td></tr>
          <tr><td>POST</td><td><code>/api/groups/{id}/leave</code></td><td><span class="badge">JWT</span></td><td>Leave a group. Managers can leave only when another manager remains.</td></tr>
          <tr><td>GET</td><td><code>/api/hacks?page=1&pageSize=10&amp;groupId=1&amp;categoryId=1&amp;difficulty=easy&amp;sort=top</code></td><td>Optional JWT</td><td>List published hacks. Sort values: <code>newest</code>, <code>top</code>, <code>most_liked</code>.</td></tr>
          <tr><td>GET</td><td><code>/api/hacks/{id}?commentsOrder=newest</code></td><td>Optional JWT</td><td>Published hack details with comments and viewer state.</td></tr>
          <tr><td>POST</td><td><code>/api/hacks/{id}/like</code></td><td><span class="badge">JWT</span></td><td>Toggle like. Returns <code>isLiked</code> and <code>likesCount</code>.</td></tr>
          <tr><td>POST</td><td><code>/api/hacks/{id}/save</code></td><td><span class="badge">JWT</span></td><td>Toggle saved state.</td></tr>
          <tr><td>POST</td><td><code>/api/hacks/{id}/vote</code></td><td><span class="badge">JWT</span></td><td>Vote with <code>sweet_tomato</code> or <code>bitter_cucumber</code>.</td></tr>
          <tr><td>POST</td><td><code>/api/hacks/{id}/comments</code></td><td><span class="badge">JWT</span></td><td>Create a comment. Body: <code>{ "text": "Very useful hack." }</code>.</td></tr>
          <tr><td>PATCH</td><td><code>/api/hacks/{id}/comments/{commentId}</code></td><td><span class="badge">JWT</span></td><td>Edit an owned comment, or any comment as an admin.</td></tr>
          <tr><td>DELETE</td><td><code>/api/hacks/{id}/comments/{commentId}</code></td><td><span class="badge">JWT</span></td><td>Delete an owned comment, any comment as an admin, or group comments as a manager.</td></tr>
          <tr><td>GET</td><td><code>/api/dashboard/hacks?page=1&pageSize=10</code></td><td><span class="badge">JWT</span></td><td>List the current user's hacks with server-side pagination.</td></tr>
          <tr><td>GET</td><td><code>/api/categories</code></td><td>Public</td><td>List categories for filters and forms.</td></tr>
          <tr><td>GET</td><td><code>/api/mobile/dashboard</code></td><td><span class="badge">JWT</span></td><td>Compact profile, counts, recent hacks, and joined groups.</td></tr>
        </tbody>
      </table>

      <h2>Request Examples</h2>
      <h3>Login</h3>
      <pre><code>POST /api/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "pass1234" }</code></pre>
      <h3>Vote</h3>
      <pre><code>POST /api/hacks/1/vote
Authorization: Bearer jwt_token_here
Content-Type: application/json

{ "voteType": "sweet_tomato", "feedbackText": "This worked great in my balcony garden." }</code></pre>

      <h2>Response Examples</h2>
      <pre><code>{ "token": "jwt_token_here", "user": { "id": 1, "email": "user@example.com", "name": "User Name", "role": "user", "pointsBalance": 0, "photoUrl": null } }</code></pre>
      <pre><code>{ "userVote": "sweet_tomato", "sweetTomatoesCount": 10, "bitterCucumbersCount": 2, "ratingScore": 8 }</code></pre>
    </main>
  </body>
</html>`;

export async function GET() {
  return new Response(docsHtml, {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}
