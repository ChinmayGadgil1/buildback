'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [project, setProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        
        if (!res.ok) {
          throw new Error('Failed to load project');
        }
        
        const data = await res.json();
        setProject(data);
        setFormData({
          name: data.name,
          code: data.code,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveMessage('');
    setError('');
    
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!res.ok) {
        throw new Error('Failed to update project');
      }
      
      const updatedProject = await res.json();
      setProject(updatedProject);
      setSaveMessage('Project saved successfully!');
      
      // Clear save message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  if (!project && !loading) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Project not found</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="py-2 px-4 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Back to Dashboard
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {saveMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {saveMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
            Your Code
          </label>
          <textarea
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            rows="20"
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </form>
    </div>
  );
}