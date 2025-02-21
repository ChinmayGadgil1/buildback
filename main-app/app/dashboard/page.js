'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        
        if (res.status === 401) {
          router.replace('/login');
          return;
        }
        
        if (!res.ok) {
          throw new Error('Failed to load projects');
        }
        
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-50">
        <div className="text-2xl text-indigo-600 font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-100 to-purple-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Your Projects</h1>
          <div className="space-x-4">
            <Link
              href="/new-project"
              className="py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md font-medium"
            >
              New Project
            </Link>
            <button
              onClick={handleLogout}
              className="py-3 px-6 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white/90 transition duration-300 shadow-md font-medium"
            >
              Logout
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {projects.length === 0 ? (
          <div className="text-center p-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl">
            <p className="text-xl text-gray-600 mb-6">You don't have any projects yet</p>
            <Link
              href="/new-project"
              className="py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 shadow-md font-medium inline-block"
            >
              Create your first project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link 
                href={`/projects/${project._id}`}
                key={project._id}
                className="block p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-3 text-gray-900">{project.name}</h2>
                <p className="text-sm text-gray-600">
                  Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}