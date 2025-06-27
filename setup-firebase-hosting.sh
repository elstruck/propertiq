#!/bin/bash

# ProperTiQ Firebase App Hosting Setup Script
# This script helps you set up Firebase App Hosting for ProperTiQ

echo "🏠 ProperTiQ Firebase App Hosting Setup"
echo "========================================"
echo

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "🔐 Please log in to Firebase:"
    firebase login
fi

echo
echo "📋 Available Firebase projects:"
firebase projects:list

echo
read -p "Enter your Firebase Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

# Create apphosting.yaml from template
if [ ! -f "apphosting.yaml" ]; then
    if [ -f "apphosting.yaml.template" ]; then
        echo "📄 Creating apphosting.yaml from template..."
        cp apphosting.yaml.template apphosting.yaml
        echo "✅ Created apphosting.yaml"
        echo "⚠️  Please edit apphosting.yaml and replace placeholder values with your actual Firebase configuration"
    else
        echo "❌ Template file not found"
        exit 1
    fi
else
    echo "✅ apphosting.yaml already exists"
fi

echo
echo "🚀 Ready to create Firebase App Hosting backend!"
echo "Run this command to create your backend:"
echo
echo "firebase apphosting:backends:create --project $PROJECT_ID"
echo
echo "📖 For detailed instructions, see FIREBASE_DEPLOYMENT.md"
echo
echo "🔧 Next steps:"
echo "1. Edit apphosting.yaml with your Firebase configuration"
echo "2. Run the firebase command above"
echo "3. Push your code to trigger deployment"
echo
echo "✨ Happy deploying!" 