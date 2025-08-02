# TashanWin Gaming Platform

## Overview
TashanWin is a comprehensive Indian real-money gaming platform offering a complete casino and lottery experience. It aims to provide familiar, market-tested games and interfaces, replicating popular Indian gaming platforms to build user trust and facilitate customer acquisition. The platform includes full payment integration, KYC verification, responsible gaming features, and a comprehensive admin dashboard. Its vision is to be a leading skill-based gaming platform in the Indian market, ensuring legal compliance and a focus on user experience.

## User Preferences
Preferred communication style: Simple, everyday language.

### Business Strategy & Design Philosophy
- **Market Competition Focus**: Create exact replicas of existing popular games rather than innovative designs
- **Customer Acquisition Strategy**: Build familiar interfaces that users already know and trust from other platforms
- **Design Constraint**: Avoid futuristic animations or innovative features - stick to proven, market-tested designs
- **Target Audience**: Users who already play on existing Indian gaming platforms and expect familiar gameplay
- **Success Metric**: Games must look and feel identical to what users are accustomed to on competitor platforms

## System Architecture
### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom gaming-themed components, Radix UI components via shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Handling**: React Hook Form with Zod validation
- **UI/UX**: Emphasis on premium gradient backgrounds, animated elements, professional branding, and mobile optimization. Design is clean and professional, focusing on authenticity to popular Indian gaming platform aesthetics, including specific color schemes and visual feedback.

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based, bcrypt password hashing, Express sessions, and OTP-based verification (for signup, login, password recovery).
- **Real-time**: WebSocket support for live game updates.

### Key Features & Design Decisions
- **Gaming Engine**: Includes WinGo (1/3/5/10 minute lottery-style), Crash (Aviator-style), Casino (Dice, Blackjack, Dragon Tiger, Andar Bahar, Teen Patti), Lottery (K3 Lotre, 5D Lotre with blockchain integration), and Mini Games (Mines, Plinko, Limbo, Keno, Scratch Cards). Games are designed as pixel-perfect replicas of popular Indian platform games.
- **Payment & Wallet System**: Comprehensive deposit/withdrawal with transaction tracking. Real-money betting is integrated across games with balance management.
- **Security & Compliance**:
    - **KYC Verification**: Document upload and verification system (Aadhar, PAN, bank). Contextual KYC (required only for withdrawals/financial ops).
    - **Fraud Detection**: Real-time monitoring and risk assessment.
    - **Responsible Gaming**: Spending limits (daily, weekly, monthly), time limits, self-exclusion tools.
    - **Legal Compliance**: Geo-blocking for restricted states (e.g., Tamil Nadu, Andhra Pradesh, Odisha, Assam) and warnings for gray zone states. Terminology updated to "skill-based gaming" to meet legal requirements ("bet" -> "challenge").
- **Administrative Features**: User management, transaction monitoring, game analytics, and compliance reporting.
- **Performance Optimization**: Focus on reduced API calls, optimized component architecture using `React.memo`, `useCallback`, `useMemo`, smart caching, and efficient state management for fast load times and reduced memory usage.
- **Comprehensive Ecosystem**: Includes tournament systems (live tournaments, global leaderboards), VIP member system, daily bonus rewards, and a 5-tier referral commission program.

## External Dependencies
- **Payment Gateways**: Razorpay (primary for India), Stripe (international), PayPal (alternative).
- **Communication Services**: SendGrid (email notifications), SMS Gateway (phone verification and alerts).
- **Analytics & Monitoring**: Google Analytics (user behavior), Custom Analytics (gaming performance metrics), real-time monitoring for live player statistics.