# Alphabet Learner (Powered by Gemini)

An interactive English alphabet learning application that uses Google's Gemini AI to generate real-time pronunciation.

## 🏗 Architecture: Frontend + Serverless

This is **not** a static website. It uses a hybrid architecture to protect your API Key:

1.  **Frontend (React + Vite)**: Renders the UI and handles user interactions.
2.  **Backend (Vercel Serverless Function)**: Located in `/api/tts.ts`. This secure function holds your `API_KEY` and communicates with Google Gemini.

## 🚀 How to Run Locally

Because this project uses Serverless Functions, standard `npm run dev` will verify the UI but **API calls will fail** unless you use the Vercel CLI.

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Setup Environment Variables**
    Create a `.env` file in the root directory:
    ```
    API_KEY=your_google_gemini_api_key_here
    ```

3.  **Run with Vercel (Recommended)**
    This simulates the cloud environment locally.
    ```bash
    npm run dev:api
    ```
    *(Note: You may be asked to log in to Vercel via the CLI)*

4.  **Run UI Only**
    If you only want to change styles/layout and don't need audio working:
    ```bash
    npm run dev
    ```

## 🌐 How to Deploy (Production)

The easiest way to deploy this app is with **Vercel**:

1.  Push this code to a GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and "Add New Project".
3.  Import your GitHub repository.
4.  **Important**: In the "Environment Variables" section, add:
    *   Key: `API_KEY`
    *   Value: `[Your Google AI Studio Key]`
5.  Click **Deploy**.

Vercel will automatically detect the `/api` directory and deploy it as a serverless function.
