// Deeplink Manager for Nuizoro Portal
class DeeplinkManager {
    constructor() {
        this.baseUrl = 'https://nuizoro.xyz/deeplink';
        this.defaultToken = 'xxx';
        this.currentToken = this.getTokenFromStorage() || this.defaultToken;
    }

    // สร้าง URL พร้อม token
    generateDeeplinkUrl(token = this.currentToken) {
        return `${this.baseUrl}?token=${encodeURIComponent(token)}`;
    }

    // บันทึก token ลง localStorage
    saveTokenToStorage(token) {
        localStorage.setItem('nuizoro_token', token);
        this.currentToken = token;
    }

    // ดึง token จาก localStorage
    getTokenFromStorage() {
        return localStorage.getItem('nuizoro_token');
    }

    // อัปเดต token ในหน้าเว็บ
    updateTokenInPage(token) {
        this.saveTokenToStorage(token);
        const linkElement = document.querySelector('.deeplink-button');
        const tokenDisplay = document.querySelector('.token-info');
        
        if (linkElement) {
            linkElement.href = this.generateDeeplinkUrl(token);
        }
        
        if (tokenDisplay) {
            tokenDisplay.textContent = this.generateDeeplinkUrl(token);
        }
    }

    // เปิด deeplink ในแท็บใหม่
    openDeeplink(token = this.currentToken) {
        const url = this.generateDeeplinkUrl(token);
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // ตรวจสอบ token ว่าเป็น format ที่ถูกต้อง
    validateToken(token) {
        return token && token.trim().length > 0 && token !== 'xxx';
    }

    // แสดง dialog สำหรับใส่ token
    promptForToken() {
        const currentToken = this.currentToken !== 'xxx' ? this.currentToken : '';
        const newToken = prompt('กรุณาใส่ Token ของคุณ:', currentToken);
        
        if (newToken !== null) {
            if (this.validateToken(newToken)) {
                this.updateTokenInPage(newToken);
                alert('Token ถูกอัปเดตเรียบร้อยแล้ว!');
            } else {
                alert('กรุณาใส่ Token ที่ถูกต้อง');
            }
        }
    }

    // เริ่มต้นการทำงาน
    initialize() {
        // อัปเดต UI ตอนโหลดหน้า
        if (this.currentToken && this.currentToken !== 'xxx') {
            this.updateTokenInPage(this.currentToken);
        }

        // เพิ่ม event listeners
        this.setupEventListeners();
    }

    // ตั้งค่า event listeners
    setupEventListeners() {
        // Double click เพื่อแก้ไข token
        const linkButton = document.querySelector('.deeplink-button');
        if (linkButton) {
            linkButton.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.promptForToken();
            });
        }

        // เพิ่มปุ่มสำหรับแก้ไข token
        this.addTokenEditButton();
    }

    // เพิ่มปุ่มแก้ไข token
    addTokenEditButton() {
        const container = document.querySelector('.info');
        if (container) {
            const editButton = document.createElement('button');
            editButton.textContent = 'แก้ไข Token';
            editButton.className = 'edit-token-btn';
            editButton.style.cssText = `
                margin-top: 10px;
                padding: 8px 16px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            `;
            
            editButton.addEventListener('click', () => this.promptForToken());
            editButton.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#218838';
            });
            editButton.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#28a745';
            });
            
            container.appendChild(editButton);
        }
    }
}

// เริ่มต้นเมื่อโหลดหน้าเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    const deeplinkManager = new DeeplinkManager();
    deeplinkManager.initialize();
    
    // ทำให้สามารถเข้าถึงได้จาก global scope
    window.deeplinkManager = deeplinkManager;
});
