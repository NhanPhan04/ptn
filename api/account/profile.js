const express = require('express');
const router = express.Router();
const User = require('../../models/User'); // Điều chỉnh đường dẫn nếu cần
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Sử dụng cookie-parser
router.use(cookieParser());

// Route Lấy thông tin người dùng
router.get('/me', async (req, res) => {
  try {
    // Lấy token từ cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: 'Không tìm thấy token' });
    }

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password'); // Lấy thông tin người dùng trừ mật khẩu
    if (!user) {
      return res.status(404).json({ msg: 'Người dùng không tồn tại' });
    }

    // Trả về thông tin người dùng
    res.json(user);
  } catch (err) {
    console.error("Lỗi xác thực:", err.message);
    res.status(500).json({ msg: 'Lỗi server' });
  }
});
// API để đăng xuất
router.post('/logout', (req, res) => {
  // Xóa cookie chứa token
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Đảm bảo secure flag khi ở production
    sameSite: 'strict', 
  });

  // Trả về phản hồi thành công
  res.status(200).json({ msg: 'Đăng xuất thành công' });
});

module.exports = router;
