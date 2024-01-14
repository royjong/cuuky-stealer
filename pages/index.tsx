import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { MenuIcon } from "lucide-react"; // Importing the MenuIcon

interface Session {
  siteName: string;
  cookies: Array<{ name: string; value: string }>;
  ip: string;
  showDetails?: boolean;
}

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get('/api/sessions')
      .then((response) => setSessions(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

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
      {/* Toggle Button with Lucid Icons Menu Icon, visible only on small screens */}
      <button
        className="md:hidden absolute top-5 right-5 z-20 text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 bg-gray-900 p-5 overflow-y-auto z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/5`}
      >
        <img className='max-w-full w-[150px] m-auto' src="https://i.postimg.cc/WpBSdzf5/i-NSECTSTEALER.png"></img>
        <ul className='text-center'>
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
      <div className={`flex-1 bg-gray-800 p-8 overflow-y-auto md:ml-1/5`}>
        <h2 className="text-2xl font-semibold mb-6">Hacked Cookies: </h2>
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
