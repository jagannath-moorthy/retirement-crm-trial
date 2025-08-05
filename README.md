# CRM for Retirement Community

This project is a Customer Relationship Management (CRM) system tailored for the retirement community.

## Project Structure
- **Frontend**: React (Vite, TypeScript) — responsive for mobile and desktop
- **Backend**: Supabase (PostgreSQL, authentication, API)

## Getting Started

### Frontend
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```

### Backend (Supabase)
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Set up your database schema and authentication.
3. Store SQL scripts and backend docs in `/backend`.
4. Use your Supabase project URL and API keys in the frontend (see `.env` setup below).

### Environment Variables
Create a `.env` file in the root with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Accessibility
- The UI should be easy to use for older adults: large fonts, high contrast, and simple navigation.

## Next Steps
- Implement authentication and user flows.
- Design database schema for contacts, activities, and notes.
- Build responsive, accessible UI components.

---

For more details, see `/backend/README.md` and `.github/copilot-instructions.md`.

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
