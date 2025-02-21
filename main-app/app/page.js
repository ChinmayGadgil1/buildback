import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 ">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Save Your Code</span>
            <span className="block text-indigo-600 animate-pulse">Share with the World</span>
          </h1>
          <p className="mt-5 max-w-lg mx-auto text-lg text-gray-600 sm:mt-7 md:text-xl">
            A platform for developers to save, organize,test and share their code snippets securely.
            Collaborate with peers and grow your knowledge.
          </p>
          <div className="mt-10 max-w-md mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:mt-12">
            <Link href="/login">
              <p className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md md:py-4 md:text-lg md:px-10">
                Get Started
              </p>
            </Link>
            
          </div>
        </div>

        
      </div>

      
    </div>
  );
}
