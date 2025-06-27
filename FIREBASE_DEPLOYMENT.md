# Firebase App Hosting Deployment Guide for ProperTiQ

This guide walks you through deploying ProperTiQ to Firebase App Hosting, which provides automatic builds, deployments, and scaling.

## Prerequisites

1. **Firebase CLI** (version 13.15.4 or later):
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Firebase Project** with these services enabled:
   - Firebase Authentication
   - Cloud Firestore
   - Firebase App Hosting

3. **GitHub Repository** with your ProperTiQ code

## Step 1: Set Up Firebase App Hosting Backend

### Quick Setup (Recommended)

Run the automated setup script:
```bash
./setup-firebase-hosting.sh
```

This script will:
- Check for Firebase CLI installation
- Help you log in to Firebase
- Create `apphosting.yaml` from template
- Guide you through the backend creation process

### Manual Setup

1. **Create the backend** (must be done by project Owner initially):
   ```bash
   firebase apphosting:backends:create --project YOUR_PROJECT_ID
   ```

2. **Follow the prompts**:
   - Choose a region (recommend `us-central1` for Tennessee users)
   - Connect your GitHub repository
   - Set root directory: `/` (or wherever your `package.json` is)
   - Set live branch: `main` (or your production branch)
   - Enable automatic rollouts: `Yes`
   - Name your backend: `propertiq-prod`

## Step 2: Configure Environment Variables

The `apphosting.yaml` file in your project root defines your environment variables:

```yaml
# Firebase App Hosting configuration for ProperTiQ
env:
  # Firebase configuration (get from Firebase Console > Project Settings)
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: "AIza..."  # Your actual API key
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: "your-project-id.firebaseapp.com"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: "your-project-id"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    value: "your-project-id.appspot.com"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    value: "123456789"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_APP_ID
    value: "1:123456789:web:abc123"
    availability: [BUILD, RUNTIME]

  # Set to false for production
  - variable: MVP_MODE
    value: "false"
    availability: [BUILD, RUNTIME]
```

### Getting Your Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ > Project Settings
4. Scroll down to "Your apps" section
5. Click on your web app or add a new one
6. Copy the configuration values to your `apphosting.yaml`

## Step 3: Configure Secrets (Optional)

For sensitive data like API keys, use Firebase secrets instead of plain environment variables:

```bash
# Create a secret
firebase apphosting:secrets:set RAPIDAPI_KEY --project YOUR_PROJECT_ID

# Reference in apphosting.yaml
env:
  - variable: RAPIDAPI_KEY
    secret: RAPIDAPI_KEY
```

## Step 4: Deploy

1. **Commit and push** your `apphosting.yaml` file:
   ```bash
   git add apphosting.yaml
   git commit -m "Add Firebase App Hosting configuration"
   git push origin main
   ```

2. **Automatic deployment** will trigger when you push to your live branch

3. **Monitor deployment** in Firebase Console:
   - Go to Build > App Hosting
   - Click on your backend
   - View build logs and deployment status

## Step 5: Custom Domain (Optional)

1. In Firebase Console > App Hosting > your backend
2. Click "Add custom domain"
3. Follow the DNS configuration steps
4. Your app will be available at your custom domain

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Yes | `AIzaSyC...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | Yes | `myproject.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Yes | `myproject-12345` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes | `myproject.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | FCM Sender ID | Yes | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | Yes | `1:123:web:abc` |
| `MVP_MODE` | Use mock data vs real APIs | No | `false` |

## Troubleshooting

### Build Failures

1. **Check build logs** in Firebase Console > App Hosting > your backend
2. **Common issues**:
   - Missing environment variables
   - TypeScript errors
   - Dependency issues

### Environment Variable Issues

1. **Verify syntax** in `apphosting.yaml` (YAML is whitespace-sensitive)
2. **Check availability** - use `[BUILD, RUNTIME]` for Next.js public variables
3. **Redeploy** after changing environment variables

### Firebase Connection Issues

1. **Verify Firebase configuration** values are correct
2. **Check Firestore rules** allow your app to read/write
3. **Ensure Authentication** is enabled with Email/Password provider

## Monitoring and Logs

- **Build logs**: Firebase Console > App Hosting > your backend > Builds
- **Runtime logs**: Firebase Console > App Hosting > your backend > Logs
- **Analytics**: Firebase Console > Analytics (if enabled)

## Scaling and Performance

Firebase App Hosting automatically:
- Scales based on traffic
- Provides global CDN
- Handles SSL certificates
- Monitors performance

## Cost Considerations

Firebase App Hosting pricing includes:
- Free tier with generous limits
- Pay-as-you-scale pricing
- No minimum charges
- Detailed usage monitoring in Firebase Console

## Support

- [Firebase App Hosting Documentation](https://firebase.google.com/docs/app-hosting)
- [Firebase Support](https://firebase.google.com/support)
- [GitHub Issues](https://github.com/your-username/propertiq/issues) 