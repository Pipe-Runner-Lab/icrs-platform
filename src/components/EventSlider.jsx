import { useState } from 'react';
import {events} from '../lib/data';


const EventSlider = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let [currentMonth, setCurrentMonth] = useState(0);

  const serverEvents = events.map((event) => ({
    ...event,
    date: new Date(event.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  function showPreviousMonth() {
    const newCurrentMonth = (currentMonth - 1 + months.length) % months.length;
    setCurrentMonth(newCurrentMonth);
  }

  function showNextMonth() {
    const newCurrentMonth = (currentMonth + 1) % months.length;
    setCurrentMonth(newCurrentMonth);
  }

  return (
    <section className="max-w-screen-lg mx-auto p-4 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Events</h2>
        <div className="flex space-x-2" id="months-buttons">
        {months
      .map((month, index) => 
      <button className={`p-2 ${currentMonth === index ? "bg-customYellow text-gray-700" : "bg-gray-700"}`} key={index}>{month}</button>
      )}
        </div>
        <div className="flex space-x-2">
          <button id="previous-month" className="p-2 bg-gray-700 rounded" onClick={showPreviousMonth}>‹</button>
          <button id="next-month" className="p-2 bg-gray-700 rounded" onClick={showNextMonth}>›</button>
        </div>
      </div>
      <div id="events-list" className="grid grid-cols-2 gap-4">
        {
          serverEvents
          .map(
            (event) => 
            <a className="p-4 bg-gray-800 rounded" href={`/events/${event.id}`} key={event.id}>
              <span className="block text-customYellow">{event.date}</span>
              <span className="block text-xl font-bold">{event.title}</span>
            </a>
          )
        }
      </div>
    </section>
  )
};

export default EventSlider;