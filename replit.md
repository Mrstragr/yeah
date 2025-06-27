# TashanWin Gaming Platform

## Overview

TashanWin is a comprehensive Indian real-money gaming platform that provides a complete casino and lottery experience. The platform is built with modern technologies and includes full payment integration, KYC verification, responsible gaming features, and a comprehensive admin dashboard.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom gaming-themed components
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI components with custom styling via shadcn/ui
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Session Management**: Express sessions with configurable timeouts
- **Real-time**: WebSocket support for live game updates

## Key Components

### Gaming Engine
- **WinGo Games**: 1/3/5/10 minute lottery-style prediction games
- **Crash Games**: Aviator-style multiplier games with real-time betting
- **Casino Games**: Dice, Blackjack, Dragon Tiger, Andar Bahar, Teen Patti
- **Lottery Systems**: K3 Lotre, 5D Lotre with blockchain integration
- **Mini Games**: Mines, Plinko, Limbo, Keno, Scratch Cards

### Payment Gateway Integration
- **Primary**: Razorpay for Indian market compliance
- **Backup**: Stripe for international card support
- **Alternative**: PayPal integration for additional payment options
- **Wallet System**: Comprehensive deposit/withdrawal with transaction tracking

### Security & Compliance
- **KYC Verification**: Document upload and verification system
- **Fraud Detection**: Real-time monitoring and risk assessment
- **Responsible Gaming**: Spending limits, time limits, self-exclusion tools
- **Session Security**: Timeout controls, idle detection, secure token management

### Administrative Features
- **User Management**: Complete user lifecycle management
- **Transaction Monitoring**: Real-time payment and withdrawal tracking
- **Game Analytics**: Performance metrics and player behavior analysis
- **Compliance Reporting**: Automated reporting for regulatory requirements

## Data Flow

### User Authentication Flow
1. User registration with phone/email verification
2. JWT token generation and secure storage
3. Session management with automatic refresh
4. KYC verification for withdrawal privileges

### Game Play Flow
1. User selects game and places bet
2. Bet validation against user balance
3. Game engine processes result using secure algorithms
4. Balance updates and transaction logging
5. Real-time result broadcasting via WebSocket

### Payment Flow
1. User initiates deposit/withdrawal request
2. Payment gateway integration (Razorpay/Stripe)
3. Transaction verification and status updates
4. Automatic balance adjustment
5. Compliance checks and fraud detection

## External Dependencies

### Payment Gateways
- **Razorpay**: Primary payment processor for Indian market
- **Stripe**: International payment processing
- **PayPal**: Alternative payment method

### Communication Services
- **SendGrid**: Email notifications and marketing
- **SMS Gateway**: Phone verification and alerts

### Analytics & Monitoring
- **Google Analytics**: User behavior tracking
- **Custom Analytics**: Gaming performance metrics
- **Real-time Monitoring**: Live player statistics

## Deployment Strategy

### Environment Configuration
- **Development**: Local development with hot reloading
- **Production**: Optimized builds with environment-specific configurations
- **Database**: PostgreSQL with connection pooling
- **CDN**: Static asset optimization for performance

### Security Measures
- **SSL/TLS**: Encrypted communication
- **Environment Variables**: Secure configuration management
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive data sanitization

### Scalability Considerations
- **Database Optimization**: Indexed queries and connection pooling
- **Caching**: Strategic caching for frequently accessed data
- **Load Balancing**: Horizontal scaling support
- **WebSocket Scaling**: Real-time communication optimization

## Changelog

### June 27, 2025 - Production Ready Gaming Platform - FINAL VERSION
- ✅ **Complete Production-Ready Platform**: Fully operational Perfect91Club gaming platform ready for real-world deployment
- ✅ **Enhanced Game Library**: All 7 professional games with attractive thumbnails and market-standard designs
  - Aviator: Animated real-time chart with multiplier visualization
  - Mines: Interactive grid-based gameplay with dynamic multipliers
  - Dragon Tiger: Card-based betting with visual card dealing animation
  - WinGo: Lottery-style color and number prediction games
  - Teen Patti: Traditional Indian card game with dealer vs player betting
  - Limbo: High-risk multiplier prediction game with infinite potential
  - Plinko: Physics-based ball drop game with risk level selection
- ✅ **Professional Game Thumbnails**: Custom SVG thumbnails for all games with gaming-industry aesthetics
- ✅ **Enhanced Bottom Navigation**: Fully functional navigation with balance display, notifications, and smooth animations
- ✅ **Razorpay Integration**: Complete payment gateway setup with secure real money transactions
- ✅ **Advanced Wallet System**: Deposit/withdrawal functionality with UPI integration and transaction history
- ✅ **KYC Verification**: Professional document verification system for regulatory compliance
- ✅ **Production Security**: Rate limiting, input validation, error handling, and fraud protection
- ✅ **PostgreSQL Database**: Complete schema with user management, transactions, and game history
- ✅ **Responsive Design**: Mobile-first design optimized for all device sizes
- ✅ **Loading Screens**: Professional animated loading screens with progress indicators
- ✅ **Error Handling**: Comprehensive error management with user-friendly messages

## User Preferences

Preferred communication style: Simple, everyday language.