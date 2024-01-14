import axios from 'axios';
import { useState, useEffect } from 'react';

interface Session {
  siteName: string;
  cookies: Array<{ name: string; value: string }>;
  ip: string;
  showDetails?: boolean;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    axios
      .get('/api/sessions')
      .then((response) => setSessions(response.data))
      .catch((error) => console.error(error));
  }, []);

  const toggleContent = (index: number) => {
    const updatedSessions = sessions.map((session, i) => {
      if (i === index) {
        return { ...session, showDetails: !session.showDetails };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  return (
    <div className="flex h-screen text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 p-5 overflow-y-auto">
        <h1 className="text-xl font-semibold text-indigo-600 mb-5">CreepStealer</h1>
        <ul>
          <li className="mb-3 hover:text-indigo-600">
            <a href="#">Dashboard</a>
          </li>
          <li className="mb-3 hover:text-indigo-600">
            <a href="#">Sessions</a>
          </li>
          <li className="mb-3 hover:text-indigo-600">
            <a href="#">Settings</a>
          </li>
          <li className="mb-3 hover:text-indigo-600">
            <a href="#">Logout</a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-800 p-8 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Session Details</h2>
        {sessions.map((session, index) => (
          <div key={index} className="mb-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {session.siteName} (IP: {session.ip})
                </h3>
                <button
                  onClick={() => toggleContent(index)}
                  className="px-4 py-2 text-sm bg-indigo-600 rounded hover:bg-indigo-700 transition-colors"
                >
                  Toggle Details
                </button>
              </div>
              {session.showDetails && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="text-xs text-gray-400">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.cookies.map((cookie, cookieIndex) => (
                        <tr key={cookieIndex} className="text-sm border-b border-gray-600">
                          <td className="px-4 py-2">{cookie.name}</td>
                          <td className="px-4 py-2">{cookie.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}