'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '../components/Editor';
import axios from 'axios';

export default function NewProject() {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [executing, setExecuting] = useState(false);
  const [output, setOutput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const router = useRouter();

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript', ext: 'js' },
    { value: 'python', label: 'Python', ext: 'py' },
    { value: 'java', label: 'Java', ext: 'java' },
    { value: 'cpp', label: 'C++', ext: 'cpp' },
    { value: 'c', label: 'C', ext: 'c' }
  ];

  const getMonacoLanguage = (lang) => {
    const languageMap = {
      'javascript': 'javascript',
      'python': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c'
    };
    return languageMap[lang] || 'plaintext';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return false;
    }
    if (!formData.code.trim()) {
      setError('Code cannot be empty');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create project');
      }
      
      router.push(`/projects/${data._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async () => {
    setExecuting(true);
    setOutput('');
    
    const currentLang = languageOptions.find(lang => lang.value === selectedLanguage);
    
    const url = "https://onecompiler-apis.p.rapidapi.com/api/v1/run";
    const payload = {
      language: selectedLanguage,
      stdin: codeInput,
      files: [
        {
          name: `index.${currentLang.ext}`,
          content: formData.code
        }
      ]
    };

    const headers = {
      "x-rapidapi-key": "2a74e3e334msh0db50ec3c449d12p1a724fjsne66e507288c4",
      "x-rapidapi-host": "onecompiler-apis.p.rapidapi.com",
      "Content-Type": "application/json"
    };

    try {
      const response = await axios.post(url, payload, { headers });
      const { stdout, stderr } = response.data;
      setOutput(`Output:\n${stdout}\n\nErrors:\n${stderr}`);
    } catch (error) {
      setOutput('Error executing code: ' + error.message);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-md bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Project Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Programming Language
              </label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {languageOptions.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Your Code
              </label>
              <Editor
                language={getMonacoLanguage(selectedLanguage)}
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="codeInput" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Input
              </label>
              <Editor
                language="plaintext"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                height="15vh"
              />
            </div>

            {output && (
              <div className="rounded-md bg-gray-50 dark:bg-gray-900 p-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Output
                </label>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700 overflow-auto max-h-60">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-gray-100">
                    {output}
                  </pre>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={handleRun}
                disabled={executing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {executing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Running...
                  </>
                ) : 'Run Code'}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Creating...
                  </>
                ) : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}