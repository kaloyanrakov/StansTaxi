import React from "react";

function BookingsPage() {
  const handleBack = () => {
    // Redirect back to home page
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Bookings Page</h1>
      <p className="mb-6">This is a placeholder page for bookings.</p>
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
