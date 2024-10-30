// src/pages/BookingStatusPage.js
import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'flowbite-react';
import BookingCard from '../components/BookingStatus/BookingCard'; // Giả sử bạn sẽ tạo BookingCard
import axios from 'axios';

const BookingStatusPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/booking');
        setBookings(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Có lỗi xảy ra: {error}</div>;
  }

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-semibold mb-5">Trạng thái Đặt phòng</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingStatusPage;
