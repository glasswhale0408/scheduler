import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ko from "date-fns/locale/ko";
import './App.css';
import Modal from "./Modal";
import DeleteModal from './DeleteModal';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: {ko},
});


function App() {
  const [events, setEvents] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView,setCurrentView] =useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const handleSelectSlot = ({start, end})=> {setSelectedSlot({ start, end });
    setIsModalOpen(true);
  }; //일정 입력
  const handleSaveEvent = (title) => {
    if (title && selectedSlot) {
      const newEvent = {
        id: events.length + 1,
        title,
        start: selectedSlot.start,
        end: selectedSlot.end,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
  }; //일정 저장
  useEffect(()=>{
    const saved = localStorage.getItem("events");
    if (saved) {
      const parsedEvents = JSON.parse(saved);
      const eventsWithDates= parsedEvents.map(event=> ({...events, 
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(eventsWithDates);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]); //시작 시 불러오기 
  useEffect(()=>{
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]); // 변경사항 저장
  const handleDoubleClickEvent = (event) => {
    setSelectedEvent(event);  
    setIsDeleteModalOpen(true);
  }; //삭제할 일정 저장
  const handleDeleteEvent = () => {
     if (selectedEvent) {
    setEvents((prev) => prev.filter(e => e.id !== selectedEvent.id));
    } 
    setIsDeleteModalOpen(false);
    setSelectedEvent(null);
  }; //삭제
  const formats = useMemo(() => ({
   monthHeaderFormat: 'yyyy년 M월', 
   dayHeaderFormat: 'M/d (eee)',
   weekdayFormat: 'eee',   
   }), []); //날짜 한글화
  const messages = {
    previous: '지난 달',
    next: '다음 달',
    today: '이번 달',
  }; //글자 한글화
  const setColor= (date) => {
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const day = date.getDay();
        let style = {};
        if (date.getMonth() !==currentMonth || date.getFullYear() !== currentYear) {
        style.backgroundColor = "#f0f0f0"; // 지난달/다음달 날짜 회색
        style.color = "#a0a0a0";           // 글자도 회색
        } else if (day === 0) {
        style.backgroundColor = "#ffe6e6"; // 일요일 빨강
        } else if (day === 6) {
        style.backgroundColor = "#e6f0ff"; // 토요일 파랑
        }
        return { style };}


  
  return (
     <div style={{ width: "120%", maxWidth: 600, margin: "0 auto" }}>
      <h1 className='title'>❗수행평가 달력❗</h1>
      <Calendar
        
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '90vh', width: '100%' }}
        locale={ko}
        formats={formats}
        selectable={true} 
        onSelectSlot={handleSelectSlot}
        views={['month']}
        view={currentView}
        onView={setCurrentView}
        defaultView="month"
        onDoubleClickEvent={handleDoubleClickEvent}
        date={currentDate}        
        onNavigate={setCurrentDate}
        messages={messages}
        eventPropGetter={(event) => ({className: "my-event",})}
        dayPropGetter={setColor}
      />
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEvent} 
      />
      <DeleteModal 
       isOpen={isDeleteModalOpen}
       onClose={() => setIsDeleteModalOpen(false)}
       onDelete={handleDeleteEvent}
       eventTitle={selectedEvent?.title}
      />
    </div>
  );
}

export default App;
