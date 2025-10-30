# Nuizoro Partner Web Portal

เว็บไซต์สำหรับสร้าง Deep Link ไปยัง Nuizoro Portal โดยใช้ Token ที่กำหนดเอง

## ฟีเจอร์

- 🔗 สร้าง Deep Link ไปยัง `https://nuizoro.xyz/deeplink?token=xxx`
- ✏️ แก้ไข Token ได้ผ่าน UI
- 💾 บันทึก Token ใน Local Storage
- 📱 รองรับ Responsive Design
- 🎨 UI ที่สวยงามและใช้งานง่าย

## การใช้งาน

### วิธีที่ 1: เปิดไฟล์ HTML โดยตรง
1. เปิดไฟล์ `index.html` ในเบราว์เซอร์
2. คลิกปุ่ม "แก้ไข Token" หรือ double-click ปุ่มสีน้ำเงิน
3. ใส่ Token ของคุณ
4. คลิกปุ่มสีน้ำเงินเพื่อเปิด Deep Link

### วิธีที่ 2: รันเซิร์ฟเวอร์ในเครื่อง

```bash
# ใช้ Python
python3 -m http.server 8000

# ใช้ Node.js (ต้องติดตั้ง http-server ก่อน)
npx http-server

# ใช้ PHP
php -S localhost:8000
```

จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:8000`

## โครงสร้างไฟล์

```
dummy-partner-web/
├── index.html              # หน้าเว็บหลัก
├── styles.css              # CSS สำหรับ styling
├── deeplink-manager.js     # JavaScript สำหรับจัดการ Deep Link
└── README.md               # ไฟล์นี้
```

## คุณสมบัติของ Deep Link Manager

### JavaScript Class: `DeeplinkManager`

- **generateDeeplinkUrl()** - สร้าง URL พร้อม token
- **saveTokenToStorage()** - บันทึก token ลง localStorage
- **getTokenFromStorage()** - ดึง token จาก localStorage  
- **updateTokenInPage()** - อัปเดต token ในหน้าเว็บ
- **validateToken()** - ตรวจสอบ token
- **promptForToken()** - แสดง dialog สำหรับใส่ token

### การจัดเก็บ Token

Token จะถูกบันทึกใน localStorage ของเบราว์เซอร์ด้วย key: `nuizoro_token`

### การปรับแต่ง

คุณสามารถแก้ไข URL ปลายทางได้ที่ไฟล์ `deeplink-manager.js`:

```javascript
this.baseUrl = 'https://nuizoro.xyz/deeplink';
```

## ตัวอย่าง URL ที่สร้างขึ้น

```
https://nuizoro.xyz/deeplink?token=your-actual-token-here
```

## เบราว์เซอร์ที่รองรับ

- Chrome (แนะนำ)
- Firefox
- Safari
- Edge

## การพัฒนาต่อ

หากต้องการเพิ่มฟีเจอร์:

1. แก้ไข `deeplink-manager.js` สำหรับ logic
2. แก้ไข `styles.css` สำหรับ styling
3. แก้ไข `index.html` สำหรับ HTML structure

## License

MIT License - ใช้งานได้ฟรี
