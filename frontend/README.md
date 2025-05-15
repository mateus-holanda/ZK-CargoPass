# zkCargoPass

A Next.js application that streamlines customs clearance with blockchain technology and zero-knowledge proofs.

## Overview

zkCargoPass is an innovative solution that revolutionizes the customs clearance process by leveraging blockchain technology and zero-knowledge proofs. It allows importers to securely share verification of their documentation with customs officials without revealing sensitive business information.

## Features

### Public Landing Page
- Informative hero section with clear value proposition
- Benefits highlighting cost savings (up to R$2,800 per container)
- Step-by-step explanation of the process (Upload → ZKP → Verify)
- Technology stack overview

### Admin Dashboard
- **Document Upload**: Support for .xml, .pdf, and .json files
- **ZK Proof Generation**: Create zero-knowledge proofs for documents
- **Submission History**: Track all document submissions and their status
- **Manual Validation**: Toggle validation status for documents

## Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, React
- **Styling**: TailwindCSS, shadcn/ui components
- **Authentication**: Simple token-based auth (localStorage)
- **Cryptography**: Web Crypto API for SHA-256 hashing
- **Blockchain Simulation**: Simulated with localStorage (Ethers.js integration ready)
- **State Management**: React hooks and localStorage

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm

### How to run

```bash
pnpm install
pnpm run dev
```