import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { EventFormData } from '../app/components/HostEventModal';

export const createEvent = async (eventData: EventFormData) => {
  try {
    const eventsRef = collection(firestore, 'events');
    const newEvent = {
      ...eventData,
      createdAt: new Date(),
      date: eventData.date.toISOString(),
    };
    const docRef = await addDoc(eventsRef, newEvent);
    return { id: docRef.id, ...newEvent };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const eventsRef = collection(firestore, 'events');
    const q = query(eventsRef, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: new Date(doc.data().date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));
    
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
