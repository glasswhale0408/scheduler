import { useState, useMemo, useEffect } from 'react';
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
import { db } from './firebase'; 
import { collection, addDoc, getDocs, deleteDoc, doc, query } from "firebase/firestore";

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
  
  const handleSaveEvent = async (title) => {
    if (title && selectedSlot) {
      const newEvent = {
        id: events.length + 1,
        title,
        start: selectedSlot.start,
        end: selectedSlot.end,
      };
      try {
      // Firebase의 'events'라는 폴더(컬렉션)에 저장
      const docRef = await addDoc(collection(db, "events"), newEvent);
      
      // 화면에도 즉시 반영 (id는 Firebase가 생성한 아이디를 사용)
      setEvents((prevEvents) => [...prevEvents, { ...newEvent, id: docRef.id }]);
    } catch (e) {
      console.error("저장 실패: ", e);
    }
    }
    setIsModalOpen(false);
    setSelectedSlot(null);
  }; //일정 저장
  
  useEffect(() => {
  const fetchEvents = async () => {
    const q = query(collection(db, "events"));
    const querySnapshot = await getDocs(q);
    
    const eventsWithDates = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Firebase 날짜(Timestamp)를 자바스크립트 날짜 객체로 변환
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
    }));
    
    setEvents(eventsWithDates);
  };

  fetchEvents();
}, []);
  
  const handleDoubleClickEvent = (event) => {
    setSelectedEvent(event);  
    setIsDeleteModalOpen(true);
  }; //삭제할 일정 저장
  
  const handleDeleteEvent = async () => {
  if (selectedEvent) {
    try {
      // Firebase에서 해당 ID의 문서 삭제
      await deleteDoc(doc(db, "events", selectedEvent.id));
      
      // 화면에서도 삭제
      setEvents((prev) => prev.filter(e => e.id !== selectedEvent.id));
    } catch (e) {
      console.error("삭제 실패: ", e);
    }
  }
  setIsDeleteModalOpen(false);
  setSelectedEvent(null);
};
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
        let style = {
           backgroundColor: "#ffffff",
           color: "#333333",
        };
        if (date.getMonth() !==currentMonth || date.getFullYear() !== currentYear) {
        style.backgroundColor = "#f0f0f0"; 
        style.color = "#a0a0a0";           
        } else if (day === 0) {
        style.backgroundColor = "#ffe6e6"; 
        } else if (day === 6) {
        style.backgroundColor = "#e6f0ff"; 
        }
        return { style };}; //달력 색깔


  
  return (
     <div style={{ width:"95%", maxWidth: "600px", margin: "20px auto 0" }}>
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
