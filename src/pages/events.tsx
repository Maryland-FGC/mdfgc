import {useEffect, useState} from "react";
import {Box, Heading, Text} from '@chakra-ui/react'
import NextLink from 'next/link'
import {Link} from "@chakra-ui/next-js";

type Event = {
  kind: string,
  etag: string,
  id: string,
  status: string,
  htmlLink: string,
  created: string,
  updated: string,
  summary: string,
  description: string,
  creator: { email: string },
  organizer: {
    email: string,
    self: boolean,
  },
  start: {
    dateTime: string,
    timeZone: string,
  },
  end: {
    dateTime: string,
    timeZone: string,
  },
  iCalUID: string,
  sequence: number,
  reminders: {
    useDefault: boolean,
    overrides: any[],
  },
  eventType: string,
  location: string,
  attachments: any[],
}

export default function Events() {
  const [events, setEvents] = useState([] as Event[]);

  useEffect(() => {
    fetch("http://localhost:8080/events/list", {
      method: "GET",
    }).then((res) => res.json())
      .then((data: Event[]) => {
        setEvents([...data]);
        console.log(data);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {
        events.length > 0 &&
        events.map((event, index) => {
          const image = `https://lh3.googleusercontent.com/d/${event.attachments[0].fileId}`;
          return (
            <Box key={index} sx={{mb: 5}}>
              <Box display="grid" gridColumn={12} w="100%">
                <Box gridColumn={4}>
                  <img src={image} alt={event.attachments[0].title}/>
                </Box>
                <Box gridColumn={8}>
                  <Heading h={2}>{event.summary}</Heading>
                  <Text>{new Date(event.start.dateTime).toDateString()}</Text>
                  <Text>{event.description}</Text>
                  <Link variant="brandPrimary" as={NextLink} href={event.location} isExternal>Event</Link>
                </Box>
              </Box>
            </Box>
          );
        })
      }

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Templates{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Explore the Next.js 13 playground.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>
    </main>
  )
}
