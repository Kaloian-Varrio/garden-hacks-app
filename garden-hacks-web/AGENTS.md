# Neon MCP Database Access Rules
-
Connect Neon MCP only to a database project
named `Garden Hacks` in my Neon account

# Garden Hacks Next.js app
  - Garden Hacks App is a community-driven platform for sharing sustainable, organic, and regenerative gardening hacks.The platform allows registered users and administrators to publish useful gardening tips, hacks, and real-life tested practices. The platform includes thematic gardening groups and communities where registered users can join discussions based on their interests, exchange experience, ask questions, and share useful knowledge.

   - Users can create profiles, publish gardening hacks, interact with other members, and participate in community groups. Each published gardening hack rewards the author with points that accumulate in the user profile as activity balance and community contribution.

# Technologies: 
Next.js + Neon DB + Drizzle ORM + React + Tailwind

# Architetural Guildlines:
   - **Service layer** - impelement app business logic used for RESTfull API and Server Actions
   - Use **modular design**: split the app into self-conteined components to avoid too long complex files with too much code
   - **Auth**: JWT tokens + bcrypt
   - **Database**: Neon DB + Drizzle ORM

# User Interface Guildlines:
  - Implement modern UI with responsive design, use server-rended components in Next.js and App Router
  - Use server-side rendering, only use client components for browser interaction and forms