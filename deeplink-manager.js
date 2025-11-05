// Deeplink Manager for Nuizoro Portal
class DeeplinkManager {
    constructor() {
        this.baseUrl = 'https://nuizoro.xyz/deeplink';
        this.defaultToken = 'xxx';
        this.currentToken = this.getTokenFromStorage() || this.defaultToken;
    }

    // ตรวจสอบว่าเป็นอุปกรณ์ Huawei หรือไม่
    isHuaweiDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        const vendor = navigator.vendor?.toLowerCase() || '';
        
        // ตรวจสอบจาก User Agent
        const huaweiKeywords = [
            'huawei',
            'honor',
            'hms',
            'harmonyos',
            'emui',
            'hisilicon',
            'kirin'
        ];
        
        // ตรวจสอบจาก User Agent string
        const isHuaweiUA = huaweiKeywords.some(keyword => 
            userAgent.includes(keyword) || vendor.includes(keyword)
        );
        
        // ตรวจสอบจาก platform หรือ hardware information (ถ้ามี)
        const platform = navigator.platform?.toLowerCase() || '';
        const isHuaweiPlatform = huaweiKeywords.some(keyword => 
            platform.includes(keyword)
        );
        
        // ตรวจสอบว่ามี Huawei Mobile Services (HMS) หรือไม่
        const hasHMS = typeof window.HMSCore !== 'undefined' || 
                      typeof window.huawei !== 'undefined' ||
                      typeof window.hms !== 'undefined';
        
        console.log('Device Detection Debug:', {
            userAgent: userAgent,
            vendor: vendor,
            platform: platform,
            isHuaweiUA: isHuaweiUA,
            isHuaweiPlatform: isHuaweiPlatform,
            hasHMS: hasHMS
        });
        
        return isHuaweiUA || isHuaweiPlatform || hasHMS;
    }

    // แสดงหรือซ่อนปุ่ม Huawei ตามอุปกรณ์
    toggleHuaweiElements() {
        const isHuawei = this.isHuaweiDevice();
        
        const huaweiButton = document.getElementById('huawei-button');
        const huaweiInfo = document.getElementById('huawei-info');
        const huaweiInstruction = document.getElementById('huawei-instruction');
        
        if (isHuawei) {
            if (huaweiButton) huaweiButton.style.display = 'inline-flex';
            if (huaweiInfo) huaweiInfo.style.display = 'block';
            if (huaweiInstruction) huaweiInstruction.style.display = 'list-item';
            
            console.log('✅ Huawei device detected - showing Huawei elements');
        } else {
            if (huaweiButton) huaweiButton.style.display = 'none';
            if (huaweiInfo) huaweiInfo.style.display = 'none';
            if (huaweiInstruction) huaweiInstruction.style.display = 'none';
            
            console.log('❌ Non-Huawei device - hiding Huawei elements');
        }
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

    // รวบรวมข้อมูลอุปกรณ์และ browser
    collectDeviceInfo() {
        const info = {
            // Operating System
            os: this.getOperatingSystem(),
            
            // Browser Information
            browser: this.getBrowserInfo(),
            
            // User Agent
            userAgent: navigator.userAgent,
            
            // Network Information
            network: this.getNetworkInfo(),
            
            // Store & Services
            storeServices: this.checkStoreAndServices(),
            
            // HTTP Headers (simulated from available data)
            headers: this.getAvailableHeaders()
        };
        
        return info;
    }

    // ตรวจสอบ Operating System
    getOperatingSystem() {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        
        let os = 'Unknown';
        let version = '';
        
        if (/iPhone|iPad|iPod/.test(ua)) {
            os = 'iOS';
            const match = ua.match(/OS (\d+_\d+)/);
            if (match) version = match[1].replace('_', '.');
        } else if (/Android/.test(ua)) {
            os = 'Android';
            const match = ua.match(/Android (\d+\.?\d*)/);
            if (match) version = match[1];
        } else if (/Windows NT/.test(ua)) {
            os = 'Windows';
            const match = ua.match(/Windows NT (\d+\.?\d*)/);
            if (match) version = match[1];
        } else if (/Mac OS X/.test(ua)) {
            os = 'macOS';
            const match = ua.match(/Mac OS X (\d+_\d+)/);
            if (match) version = match[1].replace('_', '.');
        } else if (/Linux/.test(ua)) {
            os = 'Linux';
        }
        
        return {
            name: os,
            version: version,
            platform: platform,
            architecture: navigator.platform
        };
    }

    // ข้อมูล Browser
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = '';
        
        if (/Chrome/.test(ua) && !/Edge|OPR/.test(ua)) {
            browser = 'Chrome';
            const match = ua.match(/Chrome\/(\d+\.?\d*)/);
            if (match) version = match[1];
        } else if (/Firefox/.test(ua)) {
            browser = 'Firefox';
            const match = ua.match(/Firefox\/(\d+\.?\d*)/);
            if (match) version = match[1];
        } else if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
            browser = 'Safari';
            const match = ua.match(/Safari\/(\d+\.?\d*)/);
            if (match) version = match[1];
        } else if (/Edge/.test(ua)) {
            browser = 'Edge';
            const match = ua.match(/Edge\/(\d+\.?\d*)/);
            if (match) version = match[1];
        } else if (/OPR/.test(ua)) {
            browser = 'Opera';
            const match = ua.match(/OPR\/(\d+\.?\d*)/);
            if (match) version = match[1];
        }
        
        return {
            name: browser,
            version: version,
            vendor: navigator.vendor || 'Unknown',
            language: navigator.language,
            languages: navigator.languages || [],
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            javaEnabled: typeof navigator.javaEnabled === 'function' ? navigator.javaEnabled() : 'Unknown'
        };
    }

    // ข้อมูล Network
    getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        return {
            effectiveType: connection?.effectiveType || 'Unknown',
            downlink: connection?.downlink || 'Unknown',
            rtt: connection?.rtt || 'Unknown',
            saveData: connection?.saveData || false,
            type: connection?.type || 'Unknown'
        };
    }

    // ตรวจสอบ Store และ Services
    checkStoreAndServices() {
        const ua = navigator.userAgent;
        
        // Google Play Services
        const hasGooglePlay = /\bcom\.android\.vending\b/.test(ua) || 
                             /\bGooglePlayServicesUpdater\b/.test(ua) ||
                             /\bGmsCore\b/.test(ua);
        
        // Google Services Framework
        const hasGoogleServices = /\bGSF\b/.test(ua) || 
                                 /\bGoogleServicesFramework\b/.test(ua);
        
        // Huawei Mobile Services
        const hasHMS = typeof window.HMSCore !== 'undefined' || 
                      typeof window.huawei !== 'undefined' ||
                      /\bHMS\b/.test(ua);
        
        // App Store (iOS)
        const hasAppStore = /iPhone|iPad|iPod/.test(ua);
        
        // Samsung Galaxy Store
        const hasSamsungStore = /\bSM-\b/.test(ua) || /\bSamsung\b/.test(ua);
        
        return {
            googlePlay: hasGooglePlay,
            googleServices: hasGoogleServices,
            huaweiMobileServices: hasHMS,
            appStore: hasAppStore,
            samsungStore: hasSamsungStore,
            webView: /\bwv\b/.test(ua) || /\bWebView\b/.test(ua)
        };
    }

    // ข้อมูล Headers ที่หาได้
    getAvailableHeaders() {
        return {
            'User-Agent': navigator.userAgent,
            'Accept-Language': navigator.language,
            'Accept-Languages': (navigator.languages || []).join(', '),
            'Platform': navigator.platform,
            'Vendor': navigator.vendor || 'Not available',
            'Do-Not-Track': navigator.doNotTrack || 'Not set',
            'Hardware-Concurrency': navigator.hardwareConcurrency || 'Unknown',
            'Max-Touch-Points': navigator.maxTouchPoints || 'Unknown',
            'Screen-Resolution': `${screen.width}x${screen.height}`,
            'Screen-Color-Depth': `${screen.colorDepth}-bit`,
            'Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Referrer': document.referrer || 'Direct'
        };
    }

    // แสดงข้อมูลอุปกรณ์ใน UI
    displayDeviceInfo() {
        const info = this.collectDeviceInfo();
        
        // OS Information
        const osInfo = document.getElementById('os-info');
        if (osInfo) {
            osInfo.innerHTML = `
                <strong>OS:</strong> ${info.os.name} ${info.os.version}<br>
                <strong>Platform:</strong> ${info.os.platform}<br>
                <strong>Architecture:</strong> ${info.os.architecture}
            `;
        }
        
        // Browser Information
        const browserInfo = document.getElementById('browser-info');
        if (browserInfo) {
            browserInfo.innerHTML = `
                <strong>Browser:</strong> ${info.browser.name} ${info.browser.version}<br>
                <strong>Vendor:</strong> ${info.browser.vendor}<br>
                <strong>Language:</strong> ${info.browser.language}<br>
                <strong>Languages:</strong> ${info.browser.languages.join(', ')}<br>
                <strong>Cookies:</strong> ${info.browser.cookieEnabled ? 'Enabled' : 'Disabled'}<br>
                <strong>Online:</strong> ${info.browser.onLine ? 'Yes' : 'No'}<br>
                <strong>Java:</strong> ${info.browser.javaEnabled}
            `;
        }
        
        // User Agent
        const userAgent = document.getElementById('user-agent');
        if (userAgent) {
            userAgent.textContent = info.userAgent;
        }
        
        // Network Information
        const networkInfo = document.getElementById('network-info');
        if (networkInfo) {
            networkInfo.innerHTML = `
                <strong>Connection Type:</strong> ${info.network.effectiveType}<br>
                <strong>Downlink:</strong> ${info.network.downlink} Mbps<br>
                <strong>RTT:</strong> ${info.network.rtt} ms<br>
                <strong>Save Data:</strong> ${info.network.saveData ? 'Yes' : 'No'}<br>
                <strong>Type:</strong> ${info.network.type}
            `;
        }
        
        // Store & Services
        const storeServices = document.getElementById('store-services');
        if (storeServices) {
            const services = info.storeServices;
            storeServices.innerHTML = `
                <span class="status-badge ${services.googlePlay ? 'status-available' : 'status-unavailable'}">
                    Google Play: ${services.googlePlay ? 'Available' : 'Not Available'}
                </span><br>
                <span class="status-badge ${services.googleServices ? 'status-available' : 'status-unavailable'}">
                    Google Services: ${services.googleServices ? 'Available' : 'Not Available'}
                </span><br>
                <span class="status-badge ${services.huaweiMobileServices ? 'status-available' : 'status-unavailable'}">
                    HMS: ${services.huaweiMobileServices ? 'Available' : 'Not Available'}
                </span><br>
                <span class="status-badge ${services.appStore ? 'status-available' : 'status-unavailable'}">
                    App Store: ${services.appStore ? 'Available' : 'Not Available'}
                </span><br>
                <span class="status-badge ${services.webView ? 'status-available' : 'status-unavailable'}">
                    WebView: ${services.webView ? 'Yes' : 'No'}
                </span>
            `;
        }
        
        // HTTP Headers
        const httpHeaders = document.getElementById('http-headers');
        if (httpHeaders) {
            const headersText = Object.entries(info.headers)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
            httpHeaders.textContent = headersText;
        }
    }

    // เริ่มต้นการทำงาน
    initialize() {
        // อัปเดต UI ตอนโหลดหน้า
        if (this.currentToken && this.currentToken !== 'xxx') {
            this.updateTokenInPage(this.currentToken);
        }

        // ตรวจสอบและแสดง/ซ่อนปุ่ม Huawei
        this.toggleHuaweiElements();

        // แสดงข้อมูลอุปกรณ์
        this.displayDeviceInfo();

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
