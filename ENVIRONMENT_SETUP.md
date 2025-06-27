# Environment Variables Setup for ProperTiQ

This document explains how environment variables are configured for both local development and Firebase App Hosting production deployment.

## 🏠 Local Development (.env.local)

For local development, environment variables are stored in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDprBIjQ6Lv4W_w-Dy-9ydbPg78HuQwtCA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=propertiq-7720a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=propertiq-7720a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=propertiq-7720a.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1067689806404
NEXT_PUBLIC_FIREBASE_APP_ID=1:1067689806404:web:b320574202810d8c9b4a11
MVP_MODE=false
```

### Usage
- Automatically loaded by Next.js during development
- Available in both client and server-side code (for NEXT_PUBLIC_ variables)
- File is gitignored for security

## 🚀 Production Deployment (apphosting.yaml)

For Firebase App Hosting, environment variables are configured in `apphosting.yaml`:

```yaml
env:
  - variable: NEXT_PUBLIC_FIREBASE_API_KEY
    value: "AIzaSyDprBIjQ6Lv4W_w-Dy-9ydbPg78HuQwtCA"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    value: "propertiq-7720a.firebaseapp.com"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_PROJECT_ID
    value: "propertiq-7720a"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    value: "propertiq-7720a.firebasestorage.app"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    value: "1067689806404"
    availability: [BUILD, RUNTIME]

  - variable: NEXT_PUBLIC_FIREBASE_APP_ID
    value: "1:1067689806404:web:b320574202810d8c9b4a11"
    availability: [BUILD, RUNTIME]

  - variable: MVP_MODE
    value: "false"
    availability: [BUILD, RUNTIME]
```

### Usage
- Automatically loaded by Firebase App Hosting during build and runtime
- YAML format with structured configuration
- File is gitignored to protect production credentials

## 🔄 Environment Variable Synchronization

Both configurations use the same values but different formats:

| Variable | Local (.env.local) | Production (apphosting.yaml) |
|----------|-------------------|------------------------------|
| Format | `KEY=value` | `- variable: KEY`<br>`  value: "value"` |
| Loading | Next.js automatic | Firebase App Hosting |
| Security | Gitignored | Gitignored |
| Availability | All environments | Configurable (BUILD/RUNTIME) |

## 🔧 Configuration Files

### Template Files (Committed)
- `apphosting.yaml.template` - Template for production config
- `.env.example` - Example for local config (if created)

### Actual Config Files (Gitignored)
- `.env.local` - Local development environment
- `apphosting.yaml` - Production deployment config

## 🛠️ Setup Process

### For New Developers

1. **Copy template to actual config**:
   ```bash
   cp apphosting.yaml.template apphosting.yaml
   ```

2. **Update values** in `apphosting.yaml` with your Firebase configuration

3. **For local development**, ensure `.env.local` exists with the same values

### For Production Deployment

1. **Ensure `apphosting.yaml`** has correct Firebase configuration
2. **Run setup script** (optional):
   ```bash
   ./setup-firebase-hosting.sh
   ```
3. **Deploy to Firebase App Hosting**:
   ```bash
   firebase apphosting:backends:create --project propertiq-7720a
   ```

## ✅ Testing Configuration

### Local Development Test
```bash
npm run dev
# Visit http://localhost:3000 and test Firebase authentication
```

### Production Build Test
```bash
npm run build
# Should complete without errors
```

### Environment Variable Verification
Create a temporary test page to verify all variables are loaded correctly.

## 🔐 Security Notes

1. **Never commit** `.env.local` or `apphosting.yaml` with real credentials
2. **Use templates** for sharing configuration structure
3. **Firebase App Hosting** automatically handles SSL and security
4. **API keys** are public for client-side Firebase SDK usage

## 🚨 Troubleshooting

### Common Issues

1. **Build failures**: Check environment variable syntax in `apphosting.yaml`
2. **Firebase connection errors**: Verify all Firebase config values are correct
3. **Local development issues**: Ensure `.env.local` exists and has correct values

### Debug Steps

1. Check if variables are loaded:
   ```javascript
   console.log('Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
   ```

2. Verify Firebase configuration:
   ```javascript
   import { db } from '@/lib/firebase';
   console.log('Firebase initialized:', !!db);
   ```

3. Test API endpoints:
   ```bash
   curl http://localhost:3000/api/buybox
   ```

## 📚 Related Documentation

- [Firebase App Hosting Configuration](https://firebase.google.com/docs/app-hosting/configure)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [ProperTiQ Firebase Deployment Guide](./FIREBASE_DEPLOYMENT.md) 