import React, { useEffect, useState } from "react";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/bookings") // change later 
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, []);

  const handleBack = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings Page</h1>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table-auto border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Pickup</th>
              <th className="border px-2 py-1">Dropoff</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Time</th>
              <th className="border px-2 py-1">Passengers</th>
              <th className="border px-2 py-1">Pets</th>
              <th className="border px-2 py-1">Phone</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td className="border px-2 py-1">{b.bookingId}</td>
                <td className="border px-2 py-1">{b.pickUpLocation}</td>
                <td className="border px-2 py-1">{b.dropOffLocation}</td>
                <td className="border px-2 py-1">{b.pickupDate}</td>
                <td className="border px-2 py-1">{b.pickupTime}</td>
                <td className="border px-2 py-1">{b.passengers}</td>
                <td className="border px-2 py-1">{b.pets ? "Yes" : "No"}</td>
                <td className="border px-2 py-1">{b.phoneNumber}</td>
                <td className="border px-2 py-1">{b.status}</td>
                <td className="border px-2 py-1 space-x-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                    Accept
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                    Turn Down
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleBack}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Back to Home
      </button>
    </div>
  );
}

export default BookingsPage;
