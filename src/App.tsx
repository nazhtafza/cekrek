// src/App.tsx

import { WebcamCapture } from "@/components/WebCapture";

function App() {
  return (
    <div className="container mx-auto p-4 sm:p-8 flex flex-col items-center min-h-screen">
      
      {/* Header Halaman */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Selfie Photobox
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Ambil foto keren langsung dari browser Anda!
        </p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-3xl grow">
        <WebcamCapture />
      </main>

      {/* Footer Sederhana */}
      <footer className="text-center mt-12 text-sm text-muted-foreground">
        Dibuat dengan ❤️ & Zensabbath
      </footer>

    </div>
  );
}

export default App;