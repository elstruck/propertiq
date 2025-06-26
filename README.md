# ProperTiQ - Real Estate Investment Analysis Tool

ProperTiQ is a free real estate investment analysis tool designed for Tennessee investors. It helps users find great investment deals by analyzing properties against customizable "buy box" criteria, similar to CarGurus for cars.

## Features

- **Smart Buy Box Creation**: Step-by-step wizard to define investment criteria
- **Property Analysis**: CarGurus-style deal ratings (Great Deal, Good Deal, Fair, Over-Priced)
- **Multiple Investment Strategies**: Support for Buy & Hold, Fix & Flip, BRRRR, STR, Land, and Commercial
- **Lead Generation**: Connect with licensed Tennessee REALTOR®
- **MVP Mode**: Test with mock data when API keys aren't available
- **Mobile Responsive**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **External APIs**: RapidAPI Zillow integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (for production)
- RapidAPI account with Zillow access (optional for MVP mode)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd propertiq
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:

```env
# Firebase Configuration (required for production)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# RapidAPI Zillow (optional - will use mock data if not set)
RAPIDAPI_ZILLOW_KEY=your_rapidapi_key

# Agent Contact Information
AGENT_EMAIL=agent@example.com

# Google Maps (optional)
GOOGLE_MAPS_KEY=your_google_maps_key

# MVP Mode - set to 'true' for testing with mock data
MVP_MODE=true
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MVP Mode

For quick testing and development, set `MVP_MODE=true` in your environment variables. This will:

- Use mock property data instead of calling Zillow API
- Skip Firebase requirements for basic functionality
- Provide 5 sample properties across Tennessee

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Add your web app to get the configuration keys
5. Update your `.env.local` file with the Firebase configuration

### Firestore Collections

The app uses these Firestore collections:

- `users` - User profiles
- `buyBoxes` - User-defined investment criteria
- `searches` - Search results and history
- `listingsCache` - Cached property listings (24h TTL)
- `leads` - Contact form submissions

## RapidAPI Zillow Setup

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to a Zillow API endpoint
3. Get your API key and add it to `.env.local`

## Investment Strategies Supported

- **Buy & Hold**: Long-term rental properties
- **Fix & Flip**: Properties for renovation and resale
- **BRRRR**: Buy, Rehab, Rent, Refinance, Repeat
- **Short-Term Rental (STR)**: Airbnb/VRBO properties
- **Land**: Raw land investment
- **Commercial**: Commercial real estate

## Buy Box Criteria

Users can define their investment criteria including:

- **Strategy**: Investment approach
- **Geography**: Target ZIP codes and cities
- **Price Range**: Min/max purchase price
- **Property Specs**: Beds, baths, square footage, year built, lot size, HOA
- **Financial Criteria**: Cap rate, cash-on-cash return, price per square foot
- **Kill Switches**: Automatic rejection criteria (no HOA, flood zones, school ratings)
- **Tolerance Band**: Flexibility percentage for criteria

## Scoring Algorithm

Properties are scored on a 0-100 scale across four categories:
- **Price Score** (30%): How well the price fits the criteria
- **Location Score** (20%): Geographic preferences and school ratings
- **Property Score** (20%): Physical characteristics match
- **Financial Score** (30%): Investment metrics and HOA costs

## Deal Badges

Based on the total score:
- **90-100**: Great Deal (Green)
- **75-89**: Good Deal (Blue)
- **60-74**: Fair (Gray)
- **0-59**: Over-Priced (Red)

## Deployment

The app is designed for deployment on DigitalOcean App Platform:

1. Connect your GitHub repository
2. Set environment variables in the App Platform dashboard
3. Deploy with automatic builds on push

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Disclaimer

ProperTiQ is a lead generation tool for licensed real estate professionals. All property data is provided "as-is" and may be inaccurate. This tool does not provide financial or investment advice. Please consult with qualified professionals for investment decisions.

## Support

For support, email support@propertiq.com or create an issue in the GitHub repository.
