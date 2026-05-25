# Expo HAS CHANGED
Read the exact versioned docs at https://docs.expo.dev/versions/v55.0.0/ before writing any code.

# Garden Hacks app
- Garden Hacks App is a community-driven platform for sharing sustainable gardening hacks.The platform allows registered users and administrators to publish useful gardening tips, hacks, and real-life tested practices. The platform includes thematic gardening groups and communities where registered users can join discussions based on their interests, exchange experience, ask questions, and share useful knowledge.

   - Users can create profiles, publish gardening hacks, interact with other members, and participate in community groups. Each published gardening hack rewards the author with points that accumulate in the user profile as activity balance and community contribution.

# Tech Guidline: 
   - Technologies:React Native + Expo + Expo Router
   - Back-end: Garden Hacks RESTful API, with "Bearer token" auth
   - Back-end API documentation - http://localhos:3000/api/docs
   - Back-end API source code: `..garden-hacks-web\src\app\api`
   - Modular design: split the app into meaningfull components, to avoid too much code in a single file andreuse repiting code
    - RESTful API backend

# Mobile User interface Guildlines:
   - Implement user-friendly UI, stack navigation, responsive layout ( for tablets and smartphones)
   - Mobile UI Alerts: ensure all native alerts, confirms and other system dialogs have a fallback for Web (implemented as modal popups)
