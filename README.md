# PF QR Code Generator
> A React app that generates a dynamic QR code for club pass access.

<!-- Javascript -->
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![GitHub issues](https://img.shields.io/github/issues/sealjay/pf-qrcode-gen)
![GitHub](https://img.shields.io/github/license/sealjay/pf-qrcode-gen)
![GitHub Repo stars](https://img.shields.io/github/stars/sealjay/pf-qrcode-gen?style=social)
[![TypeScript](https://img.shields.io/badge/--3178C6?logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/)
[![Azure](https://img.shields.io/badge/--3178C6?logo=microsoftazure&logoColor=ffffff)](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/?WT.mc_id=AI-MVP-5004204)
[![React](https://img.shields.io/badge/--3178C6?logo=react&logoColor=ffffff)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/--3178C6?logo=vite&logoColor=ffffff)](https://vitejs.dev/)

## Overview
The PF QR Code Generator is a web app that creates a digital club pass with a dynamically updating QR code. Built with React and TypeScript, this app simulates a fitness club membership card with a QR code that refreshes every 30 minutes for security.

This project is hosted on [Azure Static Web Apps](https://docs.microsoft.com/en-us/azure/static-web-apps/overview?WT.mc_id=AI-MVP-5004204) and displays a club pass with member information and a timestamp-based QR code.

## Features
- 🔄 Auto-refreshing QR code (updates every 30 minutes)
- 🕒 UTC timestamp encoding for secure access
- 📱 Mobile-friendly membership card display
- 🆔 Member ID and personal information display
- 🎨 Clean, modern interface

## Implementation Details
The QR code follows this format:
```
[MemberID]/mobile/[MMDDYYYy-HHMMSS]
```

Where:
- `MemberID` is the unique member identifier
- `mobile` is a fixed indicator for platform type
- `MMDDYYYy-HHMMSS` is the UTC timestamp in month-day-year-hour-minute-second format

The timestamp refreshes every 30 minutes to ensure security while allowing enough time for scanning.

## Tech Stack
- React
- TypeScript
- Vite
- CSS Modules
- Azure Static Web Apps
- react-qr-code library

## Licensing
This project is available under the [MIT License](./LICENCE).

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- [Azure Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/docs/use/install) (for local development)

### Installation
1. Clone the repo
   ```bash
   git clone https://github.com/sealjay/pf-qrcode-gen.git
   cd pf-qrcode-gen
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   # or with SWA CLI
   swa start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment
This app is set up to deploy to Azure Static Web Apps. The GitHub Actions workflow will handle deployment when changes are pushed to the main branch.

## Contact
Feel free to [open an issue](https://github.com/sealjay/pf-qrcode-gen/issues) for bugs or feature requests.

## Contributing
Contributions are welcome! This repo uses [GitHub flow](https://guides.github.com/introduction/flow/) with [Commitizen](https://github.com/commitizen/cz-cli) for semantic commits.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/qr-improvements`)
3. Commit changes using Commitizen (`git cz`)
4. Push to your branch (`git push origin feature/qr-improvements`)
5. Open a Pull Request
