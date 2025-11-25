# SnapWiFi

A secure, privacy-focused web application for generating WiFi QR codes. Share your WiFi credentials easily by generating scannable QR codes that devices can use to connect instantly.

## Features

- **QR Code Generation**: Create WiFi QR codes for WPA/WPA2, WEP, and open networks
- **Secure Storage**: WiFi credentials are encrypted locally using AES encryption
- **Privacy First**: All data is stored locally in your browser - nothing is sent to any server
- **Dark Mode**: Built-in theme switcher for light and dark modes
- **Saved Networks**: Store multiple networks locally for quick access
- **Download Options**: Export QR codes as PNG or JPG images
- **Mobile Share**: Native share functionality on mobile devices
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [Reka UI](https://www.reka-ui.com/) (formerly Radix Vue) with custom shadcn-style components
- **QR Code Generation**: [@vueuse/integrations](https://vueuse.org/integrations/useQRCode.html) with qrcode library
- **Encryption**: [CryptoJS](https://cryptojs.gitbook.io/docs/) for AES encryption
- **Icons**: [Lucide Vue](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/) for form validation
- **TypeScript**: Full type safety throughout the application

## Prerequisites

- Node.js 18.x or higher
- npm, pnpm, yarn, or bun package manager

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd snap-wifi
```

2. Install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

3. Create environment variables (optional):

Create a `.env` file in the root directory:

```bash
VITE_CRYPTO_SECRET_KEY=your-secret-encryption-key-here
```

If not provided, the app will use a default encryption key. For production, it's recommended to set your own key.

## Development

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## How It Works

1. **Enter WiFi Details**: Input your network name (SSID), password, and security type
2. **Generate QR Code**: Click the generate button to create a WiFi QR code
3. **Scan & Connect**: Use any QR code scanner or camera app to scan and connect
4. **Save Networks**: Your networks are saved locally (encrypted) for future use
5. **Download**: Export QR codes as images to share or print

## Security & Privacy

- All WiFi credentials are encrypted using AES encryption before being stored locally
- Data never leaves your browser - no server-side storage or transmission
- Encryption keys are stored separately from encrypted data
- Networks are stored in browser's localStorage only
- Open source - you can verify the security yourself

## Project Structure

```
snap-wifi/
├── app/
│   ├── assets/css/         # Global styles
│   ├── components/
│   │   └── ui/             # Reusable UI components (Button, Card, Input, etc.)
│   ├── lib/
│   │   ├── crypto.ts       # Encryption/decryption utilities
│   │   └── utils.ts        # Helper functions
│   ├── pages/
│   │   └── index.vue       # Main application page
│   └── plugins/
│       └── theme.client.ts # Theme management plugin
├── public/                  # Static assets
└── package.json
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Deployment

This application can be deployed to any static hosting service:

- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)
- [GitHub Pages](https://pages.github.com/)

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
