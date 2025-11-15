# DECHA Time - Decimal Chronological Harmony

**Time designed for the digital age**

DECHA (Decimal Chronological Harmony) is a revolutionary time system that simplifies timekeeping with a decimal-based structure. This Progressive Web App (PWA) provides a beautiful, feature-rich interface for experiencing and working with DECHA time.

## 🕐 What is DECHA Time?

DECHA time is a decimal time system where:
- **1 DECHA day = 10 hours**
- **1 DECHA hour = 100 minutes**
- **1 DECHA minute = 100 seconds**
- **Total: 100,000 DECHA seconds per day** (vs 86,400 Earth seconds)

This creates a clean, decimal-based time system that's easier to work with mathematically and more intuitive for digital applications.

## ✨ Features

### Core Functionality
- **Real-time DECHA Time Display** - Live clock showing current DECHA time
- **Earth Time Conversion** - See corresponding Earth time alongside DECHA time
- **Time Converter** - Convert between DECHA and Earth time formats
- **Multi-Timezone Converter** - Convert DECHA time across multiple timezones
- **Progress Bars** - Visual indicators for hour, minute, and day progress
- **Day Context** - Shows current day period (night, dawn, morning, midday, afternoon, evening)

### Alarms & Notifications
- **DECHA Alarms** - Set alarms in DECHA time with custom labels
- **Repeat Options** - Once, daily, weekdays, weekends, or custom days
- **Quiet Hours** - Configure quiet hours to suppress notifications
- **Hourly Notifications** - Optional hourly time announcements
- **Sound Alerts** - Audio notifications for alarms

### Calendar & Events
- **Event Calendar** - Create and manage events in DECHA time
- **Day/Week Views** - Multiple calendar view options
- **Event Management** - Add, edit, delete, and mark events as complete

### Personalization
- **Multiple Themes** - Navy, Sunset, Matrix, Cosmic, and Minimal themes
- **Display Formats** - Standard, percentage, or both
- **Customizable UI** - Toggle Earth time, progress bars, day context
- **24/12 Hour Format** - Choose Earth time display format
- **Reduced Motion** - Accessibility option for reduced animations

### Advanced Features
- **Statistics Panel** - Track usage and achievements
- **Keyboard Shortcuts** - Power user shortcuts for quick navigation
- **Share Functionality** - Share current DECHA time
- **Wake Lock** - Keep screen awake when alarms are active
- **PWA Support** - Install as a native app on mobile and desktop
- **Offline Support** - Works offline with service worker caching
- **App Badge** - Shows current DECHA hour on app icon

### Privacy & Analytics
- **Optional Analytics** - User-controlled analytics (GA4 & Microsoft Clarity)
- **Privacy-First** - All analytics are opt-in only

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run tests
npm test
```

### Development

The app runs on `http://localhost:5173` by default.

## 🏗️ Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom React hooks
├── stores/          # Zustand state management
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and calculations
└── analytics/       # Analytics integration
```

## 🎯 Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vite PWA Plugin** - Progressive Web App support
- **Vitest** - Testing framework

## 📱 PWA Features

DECHA Time is a fully functional Progressive Web App:
- Installable on mobile and desktop
- Offline support with service worker
- App shortcuts for quick actions
- Responsive design for all screen sizes

## ⌨️ Keyboard Shortcuts

- `S` - Settings
- `C` - Time Converter
- `A` - Alarms
- `L` - Calendar
- `D` - Stats
- `M` - Multi-Timezone Converter
- `?` - Help
- `Esc` - Close modal
- `Shift + S` - Share current time
- `T` - Toggle Earth time display

## 🔧 Configuration

### Analytics Setup

To enable analytics, update the following files with your IDs:

1. **Google Analytics 4** (`src/analytics/ga4.ts`):
   ```typescript
   const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```

2. **Microsoft Clarity** (`src/analytics/clarity.ts`):
   ```typescript
   const CLARITY_PROJECT_ID = 'YOUR_CLARITY_ID';
   ```

Analytics are disabled by default and can be toggled in settings.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Tests are written using Vitest and cover core DECHA time calculations.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For internal contributions, please follow the existing code style and ensure all tests pass.

## 📝 Notes

- DECHA time is synchronized with Earth time (UTC)
- All alarms and events are stored locally in the browser
- Settings persist across sessions
- The app works offline after initial load

---

**Built with ❤️ for the digital age**
