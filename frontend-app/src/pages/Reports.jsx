import React, { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';


export default function Reports() {
      const [events, setEvents] = useState([]);
      useEffect(() => {
            const es = new EventSourcePolyfill(
                  'https://iprep-project.onrender.com/api/reports',
                  {
                        withCredentials: true
                  }
            );

            es.onmessage = (e) => {
                  try {
                        const payload = JSON.parse(e.data);
                        setEvents(prev => [payload, ...prev].slice(0, 20));
                  } catch (err) {
                        console.error(err);
                  }
            };

            es.onerror = () => es.close();

            return () => es.close();
      }, []);


      return (
            <div>
                  <h2>Live Reports (SSE)</h2>
                  <div>
                        {events.map((ev, idx) => (
                              <div key={idx} className="card small">
                                    <div><strong>{ev.ts}</strong></div>
                                    <div>Active Users: {ev.activeUsers}</div>
                                    <div>Projects: {ev.projects}</div>
                              </div>
                        ))}
                  </div>
            </div>
      );
}
