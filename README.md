# EcoTrace

EcoTrace is a modern plant identification application that leverages AI to help users identify, track, and learn about various plant species. Built with Next.js 15 and Tailwind CSS, it offers a seamless experience for nature enthusiasts to explore the botanical world.

[**Live Demo**](https://upeco.arpitray.me/)

## Features

- **AI-Powered Identification**: Instantly identify plants by uploading photos or using your camera, powered by the PlantNet API.
- **Detailed Insights**: Get comprehensive data including scientific names, common names, taxonomy (Family/Genus), and confidence scores.
- **Environmental Facts**: Discover unique environmental facts about each identified plant.
- **Personal Gallery**: Automatically saves your identification history locally, allowing you to revisit previous findings.
- **Plant Browser**: Explore a curated database of plants with search functionality and pagination.
- **User Dashboard**: Secure authentication and user management via Supabase.
- **Responsive Design**: A fully responsive interface featuring a vintage-inspired aesthetic with modern interactions.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: JavaScript / React 19
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **AI Service**: [PlantNet API](https://plantnet.org/)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecotrace.git
   cd ecotrace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   PLANTNET_API_KEY=your_plantnet_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── api/            # API routes for identification and data fetching
├── Components/     # Reusable UI components
├── Dashboard/      # User dashboard and profile
├── Gallery/        # Saved plant identifications
├── Login/          # Authentication pages
├── results/        # Identification results display
└── page.js         # Landing page
lib/
├── plantStorage.js # Local storage utilities for gallery
└── SupabaseClient.js # Supabase configuration
```

## License

This project is licensed under the MIT License.
