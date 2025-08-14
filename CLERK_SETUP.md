# Clerk Setup Instructions

## Getting Your Clerk Keys

1. **Create a Clerk Account**:
   - Go to https://clerk.com and sign up/sign in
   - Create a new application for your project

2. **Get Your Keys**:
   - In your Clerk Dashboard, navigate to "API Keys"
   - Copy your **Publishable Key** (starts with `pk_`)
   - Copy your **Secret Key** (starts with `sk_`) - keep this private

3. **Add Keys to Environment**:
   - Open `.env.local` in your project root
   - Replace the placeholder values with your actual keys:
   
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
   CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
   ```

4. **Configure Social Providers (Optional)**:
   - In Clerk Dashboard, go to "User & Authentication" → "Social Connections"
   - Enable Google, GitHub, or other providers you want
   - Configure OAuth settings as needed

5. **Restart Development Server**:
   ```bash
   npm run dev
   ```

## Features Enabled

✅ **Sign In/Sign Up**: Beautiful pre-built auth forms
✅ **Social Login**: Google, GitHub, and more providers  
✅ **User Management**: Profile management through Clerk
✅ **Session Management**: Automatic session handling
✅ **Security**: Built-in protection against common attacks
✅ **Mobile Support**: Responsive authentication flows

## Important Notes

- The **Publishable Key** is safe to expose in your frontend code
- **Never** commit your Secret Key to version control
- Clerk handles all security, session management, and user data
- Users can manage their profiles directly through Clerk's UI components

## Support

- Clerk Documentation: https://clerk.com/docs
- Clerk React Guide: https://clerk.com/docs/quickstarts/react
