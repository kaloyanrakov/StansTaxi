import './App.css';
import BookingForm from './components/BookingForm/BookingForm';
import PhoneNumber from './components/PhoneNumber/PhoneNumber';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <PhoneNumber/>
          <BookingForm />
        </header>
      </div>
  );
}

export default App;