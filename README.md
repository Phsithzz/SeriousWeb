# Adidus Sneaker E-commerce

เว็บ e-commerce ตัวอย่างแบบ full stack: React/Vite frontend และ Express/PostgreSQL backend รองรับสินค้า variants, ตะกร้า, checkout, ประวัติคำสั่งซื้อ, บัญชีผู้ใช้ และหน้า admin

รายละเอียด security audit, รายการแก้ไขทุกไฟล์, คำอธิบาย Docker/Nginx และขั้นตอน deploy อยู่ที่ [`SECURITY_REFACTOR_DEPLOYMENT.md`](./SECURITY_REFACTOR_DEPLOYMENT.md)

## สิ่งที่ต้องมี

- Node.js 20 ขึ้นไป
- PostgreSQL 14 ขึ้นไป

## เริ่มใช้งานในเครื่อง

1. สร้างฐานข้อมูลและ schema

   ```bash
   createdb adidus
   psql -d adidus -f backend/database/schema.sql
   ```

2. คัดลอก `backend/.env.example` เป็น `backend/.env` แล้วใส่ค่า database และ `SECRET_KEY`
3. คัดลอก `frontend/.env.example` เป็น `frontend/.env`
4. ติดตั้งและรัน backend

   ```bash
   cd backend
   npm ci
   npm run dev
   ```

5. เปิด terminal อีกหน้าต่างแล้วรัน frontend

   ```bash
   cd frontend
   npm ci
   npm run dev
   ```

API จะอยู่ที่ `http://localhost:3000`, UI ที่ `http://localhost:5173` และ Swagger ที่ `http://localhost:3000/api-docs`

## คำสั่งตรวจคุณภาพ

```bash
cd backend && npm test
cd frontend && npm run lint
cd frontend && npm run build
npm audit --omit=dev
```

## ตั้งค่า production

Backend รองรับทั้ง `DATABASE_URL` ของ managed PostgreSQL และค่า `DBHOST`, `DBPORT`, `DBUSER`, `DBPWD`, `DB` แยกกัน ตัวแปรสำคัญมีดังนี้

- `NODE_ENV=production`
- `SECRET_KEY`: random secret อย่างน้อย 32 ตัวอักษร
- `CORS_ORIGINS`: origin ของ frontend แบบ exact match; หลายค่าให้คั่นด้วย comma
- `COOKIE_SECURE=true`
- `COOKIE_SAME_SITE=lax`: ใช้ได้เมื่อ frontend/API อยู่ same-site; ถ้า cross-site ต้องใช้ `none` และ HTTPS
- `TRUST_PROXY=true`: เปิดเมื่ออยู่หลัง reverse proxy ที่เชื่อถือได้
- `DB_SSL=true`: เปิดตามข้อกำหนดของผู้ให้บริการ PostgreSQL
- `ENABLE_API_DOCS=false`: production จะปิด Swagger โดย default

Frontend ต้อง build โดยกำหนด `VITE_API=https://api.example.com` ก่อน `npm run build` และ web server ต้อง fallback ทุก SPA route ไป `index.html`

มี Dockerfile แยกสำหรับทั้งสองส่วน:

```bash
docker build -t adidus-api ./backend
docker build --build-arg VITE_API=https://api.example.com -t adidus-web ./frontend
```

หลังสร้าง user คนแรก ให้เลื่อนสิทธิ์ admin ผ่าน SQL ที่เชื่อถือได้:

```sql
UPDATE users SET role = 'admin' WHERE email = 'owner@example.com';
```

ถ้าใช้ฐานข้อมูลเดิม ให้สำรองข้อมูลก่อนแล้วรัน migration hardening:

```bash
psql "$DATABASE_URL" -f backend/database/migrations/001_hardening.sql
```

ตรวจ cart ที่อ้างถึง user ซึ่งไม่มีอยู่ก่อน validate FK (อย่าลบจนกว่าจะยืนยันว่าไม่ต้องเก็บ):

```sql
SELECT c.cart_id, c.customer_email
FROM cart c
LEFT JOIN users u ON u.email = c.customer_email
WHERE u.email IS NULL;
```

เมื่อแก้ legacy rows แล้ว ให้รันคำสั่ง `VALIDATE CONSTRAINT` ท้ายไฟล์ migration

## Security model

- Session เก็บใน signed JWT ผ่าน HttpOnly cookie และ backend ตรวจ user/role ปัจจุบันจากฐานข้อมูลทุก request
- Admin API บังคับ authentication และ role; cart/profile ยึด email จาก session ไม่รับตัวตนจาก browser
- Checkout อ่านราคาจากฐานข้อมูล, lock stock และทำ address/order/cart/stock ใน transaction เดียว
- Upload รับ JPEG หนึ่งไฟล์ ขนาดไม่เกิน 5 MB และชื่อ product image สุ่มโดย server
- JSON body จำกัด 100 KB, login จำกัด 10 ครั้งต่อ IP ใน 15 นาที และ mutation ตรวจ allow-listed Origin

## ข้อควรรู้ก่อน scale

ภาพ upload ยังเก็บบน local filesystem (`backend/img_products` และ `backend/img_users`) จึงต้อง mount persistent volume เมื่อ deploy แบบ container/VPS หากจะรันหลาย instance ควรเปลี่ยนเป็น object storage เช่น S3/R2 และย้าย rate limiting ไป Redis หรือ shared store

ห้าม commit `.env`, secret หรือ `node_modules`; production ควรติดตั้งแบบ deterministic ด้วย `npm ci` จาก lockfile
