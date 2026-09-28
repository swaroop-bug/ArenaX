# ArenaX - Campus E-Sports Registration Platform

A modern web application for managing e-sports tournament registrations. Built with **React** and **Vite**, this platform allows teams to register for multiple games (BGMI, Valorant, Free Fire), manage player details, handle payments, and stay connected through WhatsApp group links.

## 🎮 Features

- **Team Registration**: Easy-to-use multi-step registration form
- **Game Support**: BGMI, Valorant, and Free Fire
- **Player Management**: Register multiple players per team with game-specific IDs
- **Payment Integration**: UPI payment support with screenshot verification
- **WhatsApp Integration**: Automatic group links for registered teams
- **Data Storage**: SheetDB integration for secure data storage
- **Responsive Design**: Glassmorphism UI with smooth animations
- **FAQ & Support**: Built-in FAQ section and contact information

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/[username]/arenax.git
cd arenax-web
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Update the following constants in `src/App.jsx`:
     - `WHATSAPP_LINKS` - Add WhatsApp group invitation links
     - `LFT_WHATSAPP_LINK` - Add Looking For Team group link
     - `PAYMENT_INFO` - Add your UPI ID and payment QR codes
     - `SHEETDB_URL` - Add your SheetDB API endpoint
     - Google Drive rulebook link
     - Terms & Conditions URL
     - Contact information

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Create production build
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

### Project Structure

```
src/
├── App.jsx          # Main application component
├── App.css          # Application styles
├── main.jsx         # Application entry point
├── index.css        # Global styles
└── assets/          # Static assets
```

## 🔧 Configuration Guide

### WhatsApp Links
Add your WhatsApp group invitation links:
```javascript
const WHATSAPP_LINKS = {
  BGMI: "https://chat.whatsapp.com/YOUR_LINK",
  Valorant: "https://chat.whatsapp.com/YOUR_LINK",
  "Free Fire": "https://chat.whatsapp.com/YOUR_LINK",
};
```

### Payment Information
Configure UPI IDs and QR codes for each game:
```javascript
const PAYMENT_INFO = {
  BGMI: {
    feeLabel: "Registration Fee: ₹400 per team",
    upiId: "your_upi_id@upi",
    qrImage: "bgmi qr.jpg",
  },
  // ... other games
};
```

### SheetDB Setup
1. Create a SheetDB account at https://sheetdb.io
2. Add your API endpoint:
```javascript
const SHEETDB_URL = "https://sheetdb.io/api/v1/YOUR_SHEET_ID";
```

## 📱 Registration Flow

1. **Step 1**: Team & Game Selection
   - Enter team name, college/institute name
   - Provide team leader email and phone number
   - Select game (BGMI, Valorant, Free Fire)

2. **Step 2**: Player Details & Payment
   - Enter player details (name, IGN, game ID)
   - Add payment transaction ID and screenshot
   - Accept terms & conditions

3. **Step 3**: Success
   - Registration confirmed
   - Automatic WhatsApp group link

## 🎨 Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite (using Rolldown)
- **Styling**: CSS with Glassmorphism effects
- **Backend**: SheetDB for data storage
- **Linting**: ESLint with React plugins

## 📋 Requirements

- React 19.2.0+
- Vite with Rolldown
- Node.js 16+
- Active SheetDB account
- WhatsApp group links
- UPI payment setup

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## ⚠️ Important Notes

- **Fake Transaction IDs**: Any registration with a fake transaction ID will result in immediate disqualification
- **Payment Screenshots**: Required for all registrations
- **Team Size**: Varies by game (BGMI: 4, Valorant: 5, Free Fire: 4)
- **Substitutes**: Each team can register one substitute player

## 🆘 Support

For issues, feature requests, or questions:
- [Add organizer name and contact here]
- Email: [organization@domain.com]

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Vercel
1. Import project from GitHub
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy
