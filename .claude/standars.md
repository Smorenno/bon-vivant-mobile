# Development Standards — Bon Vivant

Read this file at the start of every session.
Every line of code you write must follow these rules without exception.

---

## Security

### Authentication & data
- Never log passwords, tokens, JWTs or personal data
- Never expose raw third-party error messages to users
- Always map errors to generic user-facing messages
- Same error message for wrong email AND wrong password (prevents user enumeration)
- Same response for password reset whether email exists or not
- Sanitize all user inputs: email.trim().toLowerCase()
- Never trim passwords (spaces are valid characters)
- Min password length: 8 chars. Max: 128 chars
- detectSessionInUrl: false in all Supabase React Native clients
- Never store tokens in plain AsyncStorage without encryption
- Rate limit all auth forms: block if < 2000ms between attempts

### API & backend
- Never expose stack traces or internal errors in API responses
- All error responses follow one schema: { detail: string, code: string }
- All endpoints require authentication unless explicitly marked public
- Never put secrets in code — only in environment variables
- service_role key only in backend — never in frontend
- Validate all request bodies with Pydantic before processing
- Return 403 not 404 when resource exists but user has no access
  (404 leaks information about what exists)

### Database
- RLS enabled on all Supabase tables always
- Never build raw SQL strings with user input (use parameterized queries)
- Least privilege: frontend uses anon key, backend uses service_role

---

## Code quality

### General
- No any types in TypeScript — ever
- No implicit returns in async functions
- Handle all promise rejections — no unhandled async errors
- Delete dead code — never comment it out and leave it
- No hardcoded strings in UI — always use t() translation function
- No hardcoded colors — always use constants/colors.ts
- No magic numbers — use named constants

### React Native
- Every screen wrapped in SafeAreaView
- KeyboardAvoidingView only on screens with inputs
- No inline styles — use StyleSheet.create() or constants
- Always handle loading and error states in every async operation
- Never mutate Zustand state directly — always use actions
- Clean up subscriptions and listeners in useEffect return

### Python / FastAPI
- All functions have type hints
- All endpoints have response_model defined
- Services handle business logic — endpoints only handle HTTP
- Never catch bare Exception — always catch specific exceptions
- Use async functions for all database calls

---

## Scalability

- Business logic lives in services/ — never in endpoints or components
- No direct Supabase calls from screens — always through services/
- No direct API calls from components — always through stores or services/
- Reuse components — never duplicate UI code
- i18n from day one — no hardcoded text anywhere
- Environment-specific config in .env — never in code

---

## Git & workflow

- Commit messages follow Conventional Commits:
  feat: / fix: / chore: / docs: / refactor:
- Never commit .env files
- Never commit node_modules or __pycache__
- One concern per function — if a function does two things, split it

---

## Before writing any code, ask yourself:
1. Does this expose sensitive data?
2. Does this handle errors gracefully?
3. Is this reusable or am I duplicating something?
4. Will this work in English, Spanish and French?
5. What happens if the network fails?