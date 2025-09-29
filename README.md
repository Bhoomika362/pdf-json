# PDF to JSON Converter

An intelligent PDF to JSON conversion application powered by AI. Upload any PDF document (invoices, bank statements, reports, etc.) and extract structured data using custom JSON schemas.

## Features

- **AI-Powered PDF Processing**: Intelligent extraction of text and data from PDF documents
- **Custom JSON Schema Support**: Define your own data structure for extraction
- **Drag & Drop Interface**: Easy file upload with visual feedback
- **Real-time Conversion**: Fast processing with loading indicators
- **Download Results**: Export converted data as JSON files
- **User Authentication**: Secure login system with email/password
- **Team Management**: Multi-user support with role-based access
- **Activity Logging**: Track conversion history and user activities
- **Modern UI**: Clean, responsive interface built with shadcn/ui

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **AI/ML**: [OpenAI API](https://openai.com/) for intelligent PDF processing
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: JWT with secure cookies
- **File Processing**: Base64 encoding with 10MB file size limit

## Getting Started

```bash
git clone <your-repository-url>
cd pdf2json
npm install
```

## Running Locally

### 1. Environment Setup

Use the included setup script to create your `.env` file:

```bash
npm run db:setup
```

This will help you set up MongoDB (local with Docker or remote) and generate necessary environment variables including:
- `MONGODB_URI`: Your MongoDB connection string
- `BASE_URL`: Your application URL (default: http://localhost:3000)
- `AUTH_SECRET`: Random string for JWT signing
- `OPENAI_API_KEY`: Your OpenAI API key for PDF processing

### 2. Database Seeding

Seed the database with a default user and team:

```bash
npm run db:seed
```

This will create the following test user:
- **Email**: `test@test.com`
- **Password**: `admin123`

You can also create new users through the `/sign-up` route.

### 3. Start Development Server

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the PDF to JSON converter.

## How It Works

1. **Upload PDF**: Drag and drop or select a PDF file (max 10MB)
2. **Define Schema** (Optional): Provide a JSON schema to structure the extracted data
3. **AI Processing**: The application uses OpenAI's API to intelligently parse the PDF
4. **Data Extraction**: Text and structured data are extracted based on your schema
5. **Download Results**: Get your structured JSON data ready for use

### Example Use Cases

- **Invoices**: Extract vendor info, line items, totals, dates
- **Bank Statements**: Parse transactions, balances, account details  
- **Reports**: Structure data from financial or business reports
- **Forms**: Convert filled forms into structured data
- **Receipts**: Extract purchase details, merchant info, amounts

## Going to Production

When you're ready to deploy your PDF to JSON converter:

1. **Set up production MongoDB database**
2. **Get OpenAI API key** with sufficient credits for PDF processing
3. **Deploy to your preferred platform** (Vercel, Netlify, Railway, etc.)
4. **Configure environment variables**:
   - `MONGODB_URI`: Production database connection
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `BASE_URL`: Your production domain
   - `AUTH_SECRET`: Secure random string for JWT signing

## Project Structure

```
pdf2json/
├── app/
│   ├── (login)/                 # Authentication pages
│   │   ├── login.tsx           # Login page
│   │   └── actions.ts          # Auth server actions
│   ├── (dashboard)/            # Protected dashboard area
│   │   └── dashboard/          # Main PDF conversion interface
│   │       ├── page.tsx        # Upload & conversion UI
│   │       ├── actions.ts      # PDF processing server actions
│   │       └── layout.tsx      # Dashboard layout
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── lib/
│   ├── db/                     # Database configuration
│   │   ├── mongodb.ts          # MongoDB connection
│   │   ├── models/             # Mongoose models
│   │   ├── setup.ts            # Environment setup script
│   │   └── seed.ts             # Database seeding
│   └── auth/                   # Authentication utilities
├── components/
│   └── ui/                     # Reusable UI components
└── public/                     # Static assets
```

## API Requirements

This application requires an **OpenAI API key** to function. The AI processes PDF content and extracts structured data based on your JSON schema. Make sure you have:

- An active OpenAI account
- Sufficient API credits for your usage
- API key with access to text processing models

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).