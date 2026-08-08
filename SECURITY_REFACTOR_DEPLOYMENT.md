# รายงาน Security Audit, Bug Fix, Refactor และคู่มือ Deployment

เอกสารนี้สรุปงานทั้งหมดที่ทำกับโปรเจกต์ Adidus, เหตุผลที่เพิ่ม Docker/Nginx, ผลการตรวจสอบ และขั้นตอนนำระบบขึ้น production แบบละเอียด

วันที่จัดทำ: 8 สิงหาคม 2026

## 1. สถานะโดยสรุป

งานที่ดำเนินการแล้ว:

- ตรวจโครงสร้าง frontend/backend, package, routes, controllers, services และฐานข้อมูลจริง
- ตรวจ dependency ด้วย `npm audit`
- แก้ช่องโหว่ authentication, authorization, IDOR, upload, price tampering และ transaction
- แก้บั๊ก frontend, route guard, API contract และ React warnings
- refactor backend ให้แยก middleware/validation/transaction ชัดเจนขึ้น
- เพิ่ม test, schema, migration, env template, Swagger, Dockerfile และ Nginx config
- เอา `backend/node_modules` จำนวน 1,635 ไฟล์ออกจาก Git index โดยไฟล์ติดตั้งในเครื่องไม่ได้ถูกลบ
- ตรวจ production build และเชื่อมต่อ PostgreSQL จริง

ผลตรวจรอบสุดท้าย:

| รายการ | ผลลัพธ์ |
| --- | --- |
| Backend tests | ผ่าน 9/9 |
| Backend syntax | ผ่าน |
| OpenAPI YAML | parse ผ่าน |
| Frontend ESLint | ผ่าน ไม่มี error/warning |
| Frontend production build | ผ่าน |
| Backend dependency audit | 0 vulnerabilities |
| Frontend dependency audit | 0 vulnerabilities |
| Database health endpoint | HTTP 200 |
| Public product API | HTTP 200 และคืน array |
| Product ID ที่ไม่มี | HTTP 404 |
| Admin API เมื่อไม่มี session | HTTP 401 |
| `.env` จริงที่ถูก Git track | 0 ไฟล์ |
| `backend/node_modules` ที่ยังถูก Git track | 0 ไฟล์ |

สิ่งที่ยังไม่ได้ทำกับระบบภายนอก:

- ยังไม่ได้ deploy ไปยัง server/cloud จริง เพราะยังไม่มี domain, server credential และ deployment target
- ยังไม่ได้ build Docker image จริงในเครื่องนี้ เพราะ Docker daemon ไม่ได้เปิด แม้ Docker CLI จะติดตั้งอยู่
- ยังไม่ได้ลบ cart กำพร้าในฐานข้อมูลเดิม เพราะเป็นข้อมูลจริงที่ต้องให้เจ้าของระบบตัดสินใจก่อน

## 2. ปัญหาที่พบก่อนแก้

### 2.1 ปัญหาระดับวิกฤต/สูง

1. Admin API ไม่มี authentication และ role authorization
   - บุคคลทั่วไปสามารถเรียก API จัดการ product, variant, user, cart และ order ได้โดยตรง

2. IDOR ผ่าน email และ cart ID
   - API เชื่อ `email` จาก URL/body
   - ผู้ใช้สามารถแก้ profile, password, cart หรืออ่าน order ของบัญชีอื่นได้

3. ระบบเชื่อราคาที่ browser ส่งมา
   - `price` ใน cart ถูกส่งจาก frontend
   - ผู้โจมตีสามารถแก้ request แล้วซื้อสินค้าในราคาที่กำหนดเอง

4. PostgreSQL transaction ทำงานผิด connection
   - เดิมเรียก `BEGIN`, query, `COMMIT` ผ่าน pool แยกกัน
   - แต่ละคำสั่งอาจใช้คนละ connection ทำให้ rollback ไม่รับประกัน

5. Address ถูกสร้างนอก transaction
   - checkout ล้มเหลวแล้วอาจเหลือ address กำพร้าในฐานข้อมูล

6. Upload ใช้ชื่อไฟล์จาก input โดยตรง
   - เสี่ยง path traversal, เขียนทับไฟล์ และปลอม email ของผู้ใช้อื่น
   - ไม่มี file size limit หรือ MIME restriction

7. API ส่ง `passwordhash` กลับ
   - register และ admin update ใช้ `RETURNING *`

8. Dependency มีช่องโหว่
   - Backend เริ่มต้น 6 vulnerabilities: 3 high, 3 moderate
   - Frontend เริ่มต้น 11 vulnerabilities: 1 critical, 9 high, 1 moderate

### 2.2 บั๊กและปัญหา production

- Cookie กำหนด `secure: true` ตายตัว ทำให้ local HTTP login ไม่สมบูรณ์
- JWT ถูกส่งกลับทั้ง HttpOnly cookie และ JSON โดยไม่จำเป็น
- Login ตอบต่างกันระหว่าง email ไม่มีและ password ผิด ทำให้ enumerate account ได้
- ไม่มี JSON body size limit
- ส่งข้อความ exception ภายในกลับ client หลาย endpoint
- `getProductId` โยน 500 เมื่อ product ไม่มี แทนที่จะเป็น 404
- ชื่อ path `services/swagger.yaml` ไม่ตรงกับโฟลเดอร์ `Services` และจะพังบน Linux
- Production script ใช้ `nodemon` แทน `node`
- CORS hard-code เฉพาะ localhost
- Admin frontend route ไม่มี guard
- หน้า profile ใช้ email ใหม่เป็น key ค้นหา record เดิม ทำให้อัปเดตผิด
- เปลี่ยน email แล้ว cart/order/avatar อาจไม่ตามไปด้วย
- Variant CRUD ไม่ sync stock รวมของ product
- Admin สามารถ hard-delete order history และ completed cart ได้
- React hooks มี dependency warning และ component บางส่วนยิง API ซ้ำทุก render
- React list บางจุดวาง `key` ผิดระดับ
- Frontend entry bundle เดิมประมาณ 676 KB
- Swagger เดิมไม่ตรงกับ API ที่ใช้งานจริง
- ไม่มี schema/migration สำหรับสร้างหรือ harden ฐานข้อมูล
- ไม่มี health endpoint และ graceful shutdown
- `backend/node_modules` ถูก commit เข้า repository

## 3. รายละเอียดสิ่งที่แก้ฝั่ง Backend

### 3.1 Authentication และ authorization

ไฟล์ `backend/Middleware/auth.js`:

- อ่าน JWT จาก HttpOnly cookie หรือ Bearer token
- บังคับ verify ด้วย `HS256`
- อ่าน user/role ปัจจุบันจากฐานข้อมูลทุก authenticated request
- account ที่ถูกลบหรือ session หมดอายุจะได้ HTTP 401
- `requireAdmin` คืน HTTP 403 เมื่อ role ไม่ใช่ admin
- role ใน JWT ไม่ถูกใช้เป็นแหล่งข้อมูลสุดท้าย จึงลดปัญหา role เก่าค้างใน token

ไฟล์ routes ทั้งหมดถูกจัดสิทธิ์ใหม่:

- `productRoute.js`: create/update/delete/admin list ต้องเป็น admin
- `variantRoute.js`: ทุก endpoint ต้องเป็น admin
- `userRoute.js`: profile ใช้ current session; user CRUD ต้องเป็น admin
- `cartRoute.js`: cart ของลูกค้าต้อง login และยึด owner จาก session
- `orderRoute.js`: order list admin ต้องเป็น admin

### 3.2 Session และ user security

ไฟล์ `backend/Controllers/userController.js` และ `backend/Services/userService.js`:

- JWT เก็บเฉพาะ email ที่จำเป็น
- ไม่ส่ง JWT กลับใน response JSON
- ไม่ส่ง `passwordhash` กลับจาก register/update
- normalize email เป็น lowercase
- validate email, name, lastname และ password
- password ต้องมีความยาว 8-128 ตัวอักษร
- login error ใช้ข้อความเดียวกันทั้ง email ไม่มีและ password ผิด
- successful login reset rate-limit counter
- cookie config เปลี่ยนตาม environment
- logout เปลี่ยนจาก GET เป็น POST
- profile/password/avatar ใช้ `/user/me` แทน email จาก URL
- เปลี่ยน email แล้ว update user/cart/order ใน transaction เดียว
- refresh session cookie เมื่อ email เปลี่ยน
- rename avatar เมื่อ email เปลี่ยน
- ป้องกัน admin ลดสิทธิ์หรือลบบัญชีตัวเอง
- user ที่มี order/cart history จะไม่ถูก hard-delete และตอบ HTTP 409

### 3.3 Cart, ราคา และ Checkout

ไฟล์ `backend/Services/cartService.js` และ `backend/Controllers/cartController.js`:

- ไม่รับ `customer_email` จาก browser สำหรับ customer cart
- ไม่รับ `price` จาก browser
- อ่านราคา variant จาก PostgreSQL
- validate variant ID และ quantity
- จำกัด customer quantity ต่อ request ไม่เกิน 20
- lock cart/variant row เพื่อป้องกัน race condition
- recheck cart หลังรอ variant lock เพื่อป้องกัน active cart ซ้ำ
- lock variant ตามลำดับ `variant_id` เพื่อลด deadlock
- update quantity เฉพาะ cart ที่เป็นของ current user และยัง active
- delete เฉพาะ cart ที่เป็นของ current user และยัง active
- admin ไม่สามารถแก้หรือลบ cart ที่ checkout แล้ว
- checkout อ่านราคาปัจจุบันจากฐานข้อมูล
- คำนวณยอดรวมด้วย PostgreSQL `NUMERIC` แทน floating point ใน JavaScript
- address, order, cart status, item price และ stock อยู่ใน transaction เดียว
- stock ถูก lock และตรวจซ้ำตอน checkout
- stock ไม่พอจะ rollback ทุกอย่าง
- product stock รวมถูก sync จากผลรวม variants
- completed cart เก็บราคาที่ใช้ซื้อจริงไว้เป็น snapshot

### 3.4 Database connection และ transaction

ไฟล์ `backend/Config/database.js`:

- รองรับ `DATABASE_URL` สำหรับ managed PostgreSQL
- ยังรองรับ `DBHOST`, `DBPORT`, `DBUSER`, `DBPWD`, `DB` สำหรับ local
- รองรับ SSL configuration
- กำหนด pool size, idle timeout และ connection timeout
- โหลด `.env` จาก path ของ backend โดยไม่ขึ้นกับ current working directory
- เพิ่ม `withTransaction()` ที่ใช้ client connection เดียวตั้งแต่ BEGIN ถึง COMMIT/ROLLBACK
- release connection ใน `finally` เสมอ

### 3.5 Upload security

ไฟล์ `productController.js` และ `userController.js`:

- รับเฉพาะ MIME `image/jpeg`
- ขนาดสูงสุด 5 MB
- รับไฟล์เดียว
- จำกัดจำนวน multipart fields/parts
- product image ใช้ UUID ที่ server สร้าง
- avatar filename ใช้ email จาก authenticated session
- path upload ใช้ absolute path จากตำแหน่ง source file
- ลบไฟล์ใหม่เมื่อ validation/database operation ล้มเหลว
- ลบ product image เก่าหลัง update สำเร็จ
- ปฏิเสธชื่อไฟล์ที่ไม่ผ่าน allowlist ก่อนลบ
- `/img_users` ต้อง authenticated เพื่อลดการ enumerate email/avatar

หมายเหตุ: ตรวจ MIME แล้ว แต่ยังไม่ได้ทำ image transcoding หรือ malware scan หากเปิดรับ upload ปริมาณมากควร decode/re-encode ภาพหรือใช้ image processing service เพิ่ม

### 3.6 Validation และ error handling

ไฟล์ `backend/Utils/validation.js`:

- email normalize/validation
- password length validation
- positive integer parser
- non-negative integer/number parser
- text trimming และ max length

ไฟล์ `backend/server.js`:

- JSON body limit 100 KB
- central error handler
- Multer error ไม่เผย stack trace
- payload ใหญ่ตอบ HTTP 413
- route ไม่พบตอบ HTTP 404 แบบ JSON
- production error ไม่ส่งรายละเอียดฐานข้อมูลกลับ client

### 3.7 Server hardening

ไฟล์ `backend/Middleware/security.js` และ `backend/server.js`:

- ปิด `X-Powered-By`
- เพิ่ม `X-Content-Type-Options: nosniff`
- เพิ่ม `X-Frame-Options: DENY`
- เพิ่ม `Referrer-Policy: no-referrer`
- เพิ่ม restrictive Permissions Policy
- CORS ใช้ exact origins จาก `CORS_ORIGINS`
- mutation request ที่มี Origin นอก allowlist ถูกปฏิเสธ
- login จำกัด 10 ครั้ง/IP/15 นาที
- rate-limit records ที่หมดอายุถูก cleanup
- รองรับ `TRUST_PROXY` สำหรับ deployment หลัง proxy
- production บังคับ `SECRET_KEY` อย่างน้อย 32 ตัวอักษร
- `COOKIE_SAME_SITE=none` ต้องใช้ secure cookie
- graceful shutdown เมื่อได้ SIGTERM/SIGINT
- `/health` ทดสอบเชื่อมต่อ PostgreSQL จริง
- Swagger ปิดโดย default ใน production
- static paths ใช้ absolute path และ cache policy

### 3.8 Product, Variant และ Order

- product input ตรวจ number/text ก่อน query
- product ไม่มีคืน HTTP 404
- product ที่ถูก reference อยู่จะไม่ลบและคืน HTTP 409
- variant stock/price ห้ามติดลบ
- variant create/update/delete sync product stock ใน transaction
- variant ที่ถูก cart reference จะไม่ลบ
- order history เปลี่ยนเป็น read-only ใน admin UI/API
- เอา hard-delete order endpoint ออก เพื่อไม่ทำลาย audit/history

## 4. รายละเอียดสิ่งที่แก้ฝั่ง Frontend

### 4.1 API contract

ไฟล์ `frontend/src/function/user.js`:

- เปลี่ยน profile API เป็น `/user/me`
- password เป็น `/user/me/password`
- avatar เป็น `/user/me/avatar`
- logout ใช้ POST
- ลด `async/await` ที่ return Axios โดยตรงได้

ไฟล์ `frontend/src/function/cart.js`:

- ใช้ `/cart`, `/cart/items`, `/cart/orders`, `/cart/checkout`
- ไม่ส่ง email และราคาในการเพิ่มสินค้า
- แยก `removeCart` ของ customer กับ `removeCartAdmin`

ไฟล์ `frontend/src/function/order.js`:

- เหลือเฉพาะการอ่าน order list
- เอา hard-delete ออก

### 4.2 Route guard และ code splitting

ไฟล์ `frontend/src/components/ProtectedRoute.jsx`:

- ตรวจ current session ก่อนเปิด user/admin routes
- ไม่ login ส่งไป `/login`
- role ไม่ตรงส่งกลับหน้า `/`

ไฟล์ `frontend/src/App.jsx`:

- แยก public, authenticated และ admin routes
- ใช้ `React.lazy` + `Suspense`
- โหลดแต่ละ page/layout ตาม route
- ลด initial JavaScript bundle จากประมาณ 676 KB เหลือประมาณ 280 KB

Frontend guard เป็น UX layer เท่านั้น ความปลอดภัยจริงยังบังคับที่ backend ทุกครั้ง

### 4.3 Profile และ upload UI

- profile update ส่ง record โดยไม่ใช้ email จาก URL
- password update ไม่ส่ง email
- upload avatar ไม่ส่ง email field
- file input รับ `image/jpeg`
- แก้ image checking dependency
- admin profile ไม่ยิง API ทุก render อีกแล้ว
- session เปลี่ยน email แล้ว frontend ใช้ cookie ใหม่ต่อได้

### 4.4 Cart และ Checkout UI

- add cart ส่งเฉพาะ `variant_id` กับ `quantity`
- cart/order API ไม่รับ email จาก component
- checkout ส่ง address/payment เท่านั้น
- customer delete เรียก customer cart endpoint
- admin delete เรียก admin cart endpoint
- แก้ list keys บางจุด

### 4.5 Admin และ component cleanup

- หน้า admin ถูกครอบด้วย role guard
- order table เป็น read-only
- แก้ typo `err.messaage`
- ลบ debug logs ที่พิมพ์ user/address/product response
- แก้ hooks dependencies
- แก้ API call loop ใน `ConsoleAdmin`
- วาง React `key` บน element ชั้นนอกที่ถูกต้อง
- product upload input ระบุ JPEG ให้ตรงกับ backend

## 5. รายการไฟล์ที่เปลี่ยนและหน้าที่

### 5.1 Root

| ไฟล์ | การเปลี่ยนแปลง |
| --- | --- |
| `README.md` | เขียนวิธี setup, production env, migration และ Docker build ใหม่ |
| `.dockerignore` | ไม่ส่ง `.git`, `.env`, node_modules, dist และ log เข้า Docker build context |
| `SECURITY_REFACTOR_DEPLOYMENT.md` | รายงานและคู่มือฉบับนี้ |

### 5.2 Backend: ไฟล์เดิมที่แก้

| ไฟล์ | การเปลี่ยนแปลง |
| --- | --- |
| `backend/.gitignore` | ignore `.env`, node_modules และ coverage |
| `backend/Config/database.js` | DATABASE_URL/SSL/pool/transaction helper |
| `backend/server.js` | production server config, CORS, cookie, headers, health, error handling, graceful shutdown |
| `backend/package.json` | production start ใช้ `node`, test ใช้ Node test runner, เอา direct body-parser ออก |
| `backend/package-lock.json` | อัปเดต dependency versions ที่แก้ advisory |
| `backend/Controllers/userController.js` | secure auth/profile/password/avatar/admin user operations |
| `backend/Controllers/cartController.js` | session-owned cart, validation และ atomic checkout |
| `backend/Controllers/productController.js` | safe upload, validation, 404/409 behavior |
| `backend/Controllers/variantController.js` | validation และ status code ที่ถูกต้อง |
| `backend/Controllers/orderController.js` | เหลือ read-only order list |
| `backend/Routes/userRoute.js` | public/self/admin route separation |
| `backend/Routes/cartRoute.js` | REST-style customer/admin cart routes พร้อม auth |
| `backend/Routes/productRoute.js` | admin guards สำหรับ mutation |
| `backend/Routes/variantRoute.js` | admin guard ทุก variant endpoint |
| `backend/Routes/orderRoute.js` | admin read-only route |
| `backend/Services/userService.js` | safe RETURNING และ email cascade transaction |
| `backend/Services/cartService.js` | server price, locks, exact total และ checkout transaction |
| `backend/Services/productService.js` | product lookup และ missing-product handling |
| `backend/Services/variantService.js` | transaction และ product stock synchronization |
| `backend/Services/orderService.js` | เอา hard-delete ออก |
| `backend/Services/swagger.yaml` | เขียน OpenAPI ให้ตรง API ใหม่ |

### 5.3 Backend: ไฟล์ใหม่

| ไฟล์ | หน้าที่ |
| --- | --- |
| `backend/.env.example` | template ตัวแปร local/production โดยไม่มี secret จริง |
| `backend/.dockerignore` | ลด Docker build context และป้องกัน `.env` เข้า image |
| `backend/Dockerfile` | สร้าง production Node image และรันเป็น non-root user |
| `backend/Middleware/auth.js` | authentication และ admin authorization |
| `backend/Middleware/security.js` | security headers และ login rate limit |
| `backend/Utils/validation.js` | validation utilities กลาง |
| `backend/database/schema.sql` | schema สำหรับฐานข้อมูลใหม่ |
| `backend/database/migrations/001_hardening.sql` | harden ฐานข้อมูลเดิมแบบไม่ลบ legacy row |
| `backend/test/validation.test.js` | tests สำหรับ validation |
| `backend/test/server-security.test.js` | tests auth, origin rejection และ security headers |

### 5.4 Frontend: ไฟล์เดิมที่แก้

| ไฟล์ | การเปลี่ยนแปลง |
| --- | --- |
| `frontend/package-lock.json` | อัปเดต dependency versions ที่แก้ advisory |
| `frontend/src/App.jsx` | lazy loading และ protected route groups |
| `frontend/src/function/user.js` | self-session API contract ใหม่ |
| `frontend/src/function/cart.js` | REST cart API และแยก customer/admin delete |
| `frontend/src/function/order.js` | read-only order API |
| `frontend/src/components/ConsoleAdmin.jsx` | แก้ request loop/profile loading |
| `frontend/src/components/EditProfileAdmin.jsx` | avatar upload ไม่ส่ง email และรับ JPEG |
| `frontend/src/components/HomeProduct.jsx` | ลบ debug response logs |
| `frontend/src/components/ModalProductAdmin.jsx` | จำกัด file picker เป็น JPEG |
| `frontend/src/components/Navbar.jsx` | ลบ user/search debug logs และ unused state |
| `frontend/src/components/ProductBrand.jsx` | แก้ hook dependency, cleanup และ React key |
| `frontend/src/components/ProductCategory.jsx` | แก้ hook dependency, cleanup และ React key |
| `frontend/src/layouts/LayoutHome.jsx` | ลบ role debug log |
| `frontend/src/layouts/LayoutAdminOrder.jsx` | แก้ error handling และ read-only table |
| `frontend/src/layouts/LayoutAdminProduct.jsx` | ลบ debug response logs |
| `frontend/src/layouts/LayoutAdminVariant.jsx` | ลบ debug response logs |
| `frontend/src/pages/Cart.jsx` | current-session cart API |
| `frontend/src/pages/CartOrder.jsx` | current-session order API และ key fix |
| `frontend/src/pages/CartTable.jsx` | ใช้ admin delete function ที่ถูกต้อง |
| `frontend/src/pages/OrderTable.jsx` | refactor เป็น read-only order history |
| `frontend/src/pages/PageUser.jsx` | profile/password/avatar API ใหม่ และ hook fix |
| `frontend/src/pages/Pay.jsx` | checkout ไม่ส่ง email/ราคาและลบ sensitive logs |
| `frontend/src/pages/ProductDetail.jsx` | add cart ไม่ส่ง email/ราคา, motion import fix |
| `frontend/src/pages/Register.jsx` | ลบ debug response log |

### 5.5 Frontend: ไฟล์ใหม่

| ไฟล์ | หน้าที่ |
| --- | --- |
| `frontend/.env.example` | template `VITE_API` |
| `frontend/.dockerignore` | ไม่ส่ง `.env`, node_modules และ dist เข้า build context |
| `frontend/Dockerfile` | build React แล้วนำ static output ไปใส่ Nginx image |
| `frontend/nginx.conf` | serve SPA, cache hashed assets และ security headers |
| `frontend/src/components/ProtectedRoute.jsx` | user/admin UI route guard |

## 6. Docker คืออะไร และไฟล์ที่สร้างไว้ทำอะไร

Docker ใช้ package application กับ runtime/dependencies เป็น image ทำให้ local, test server และ production รันสภาพแวดล้อมใกล้เคียงกัน

### 6.1 `backend/Dockerfile`

ขั้นตอนภายใน:

1. ใช้ `node:22-alpine`
2. ตั้ง `NODE_ENV=production`
3. copy package files ก่อนเพื่อใช้ Docker layer cache
4. ติดตั้งเฉพาะ production dependencies ด้วย `npm ci --omit=dev`
5. copy source code
6. เปลี่ยนไปรันด้วย user `node` แทน root
7. เปิดเผย port 3000
8. เริ่ม server ด้วย `node server.js`

### 6.2 `frontend/Dockerfile`

ใช้ multi-stage build:

1. Stage `build` ใช้ Node ติดตั้ง dependency และรัน `vite build`
2. `VITE_API` ถูกใส่ตอน build ผ่าน `--build-arg`
3. Stage สุดท้ายใช้ Nginx image
4. copy เฉพาะ `dist` ที่ build แล้วเข้า Nginx

ข้อดีคือ final frontend image ไม่มี Node compiler, source dependency และ build tools ที่ไม่จำเป็น แนวทางนี้ตรงกับคำแนะนำ multi-stage build ของ Docker

ข้อควรจำ: `VITE_API` ถูก compile เข้า JavaScript ตอน build ถ้าเปลี่ยน API URL ต้อง build frontend image ใหม่

### 6.3 `.dockerignore`

ป้องกันไฟล์ต่อไปนี้เข้า build context/image:

- `.git`
- `.env` และ secrets
- `node_modules`
- `dist`
- coverage/logs

## 7. Nginx คืออะไร และทำไม frontend ต้องใช้

React/Vite หลัง `npm run build` จะกลายเป็น static files เช่น HTML, CSS, JavaScript และรูปภาพ ไม่จำเป็นต้องใช้ Node server เพื่อเสิร์ฟไฟล์เหล่านี้ Nginx เหมาะกับงาน static file และ caching

`frontend/nginx.conf` ทำหน้าที่:

- serve ไฟล์จาก `/usr/share/nginx/html`
- `/assets/` cache 1 ปี เพราะชื่อไฟล์มี content hash
- `index.html` ใช้ `no-cache` เพื่อให้ผู้ใช้ได้ deployment รุ่นล่าสุด
- `try_files $uri $uri/ /index.html` ทำ SPA fallback
  - หากเปิด `/admin/products` โดยตรง Nginx จะคืน `index.html`
  - React Router จึงเป็นผู้เลือกหน้าที่ถูกต้อง
- เพิ่ม basic security headers

### Nginx สองชั้นที่อาจพบตอน deploy

1. Nginx ใน frontend container
   - serve React static files
   - config อยู่ใน repo แล้ว

2. Reverse proxy/load balancer ด้านหน้า
   - รับ domain และ HTTPS จาก internet
   - ส่ง `shop.example.com` ไป frontend container port 8080
   - ส่ง `api.example.com` ไป backend container port 3000
   - อาจเป็น host Nginx, Caddy, Traefik หรือ load balancer ของ cloud ก็ได้

NGINX อธิบายว่า reverse proxy จะรับ request แล้วส่งไป upstream application server และนำ response กลับให้ client

## 8. Architecture ที่แนะนำสำหรับ Production

```text
Browser
  | HTTPS
  v
Reverse Proxy / Cloud Load Balancer
  |-- shop.example.com --> frontend Nginx container :80
  |                         |-- React dist
  |
  |-- api.example.com  --> backend Node container :3000
                            |-- PostgreSQL (managed/private network)
                            |-- persistent image volumes
```

ค่าตัวอย่าง:

- Frontend: `https://shop.example.com`
- Backend: `https://api.example.com`
- `VITE_API=https://api.example.com`
- `CORS_ORIGINS=https://shop.example.com`
- `COOKIE_SECURE=true`
- `COOKIE_SAME_SITE=lax` สำหรับ subdomain ที่อยู่ภายใต้ site เดียวกัน
- `TRUST_PROXY=true` เมื่อ backend อยู่หลัง trusted reverse proxy

ถ้า frontend/backend อยู่คนละ root domain จริง ๆ ต้องใช้ `COOKIE_SAME_SITE=none` พร้อม HTTPS และ `COOKIE_SECURE=true`

## 9. ขั้นตอน Deploy แบบ Docker บน VPS/Server

ตัวอย่างนี้ใช้ Linux server, Docker Engine, domain สองชื่อ และ PostgreSQL ที่เตรียมไว้แล้ว เปลี่ยน `shop.example.com`, `api.example.com` และค่าฐานข้อมูลให้เป็นค่าจริง

### ขั้นที่ 1: เตรียม DNS และ HTTPS

สร้าง DNS records:

- `shop.example.com` ชี้ไป public IP ของ server/load balancer
- `api.example.com` ชี้ไป public IP เดียวกันหรือ API load balancer

Production ต้องใช้ HTTPS ทั้ง frontend และ backend เพราะ authentication cookie ใช้ `Secure`

### ขั้นที่ 2: นำ source code ขึ้น server

```bash
git clone <repository-url> /opt/adidus
cd /opt/adidus
```

ตรวจว่าไม่มี secret อยู่ใน Git:

```bash
git ls-files | grep -E '(^|/)\.env$'
```

คำสั่งควรไม่แสดงผล

### ขั้นที่ 3: Backup ฐานข้อมูลเดิม

```bash
export DATABASE_URL='postgresql://USER:PASSWORD@HOST:5432/DBNAME'
pg_dump "$DATABASE_URL" -Fc -f "adidus-before-deploy-$(date +%Y%m%d-%H%M%S).dump"
```

เก็บ backup ไว้นอก server หรือใน encrypted backup storage และทดสอบ restore เป็นระยะ

### ขั้นที่ 4: เตรียมฐานข้อมูล

กรณีฐานข้อมูลใหม่:

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/database/schema.sql
```

กรณีฐานข้อมูลเดิม:

1. ตรวจ duplicate/invalid legacy data
2. รัน migration hardening

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/database/migrations/001_hardening.sql
```

จากการตรวจฐานข้อมูลเดิมของโปรเจกต์ พบ cart กำพร้า 1 รายการ ตรวจด้วย:

```sql
SELECT c.cart_id, c.customer_email
FROM cart c
LEFT JOIN users u ON u.email = c.customer_email
WHERE u.email IS NULL;
```

ห้ามลบทันทีจนกว่าจะตรวจว่าเป็น test data หรือข้อมูลที่ไม่ต้องเก็บ หลังแก้ legacy row แล้วให้รัน `VALIDATE CONSTRAINT` ที่อยู่ท้าย migration

### ขั้นที่ 5: สร้าง backend production env

สร้างไฟล์นอก repository เช่น `/opt/adidus-config/backend.env`:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=true
DB_POOL_MAX=10
SECRET_KEY=ใส่-random-secret-อย่างน้อย-32-ตัวอักษร
CORS_ORIGINS=https://shop.example.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
TRUST_PROXY=true
ENABLE_API_DOCS=false
```

สร้าง secret ตัวอย่าง:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

จำกัด permission:

```bash
chmod 600 /opt/adidus-config/backend.env
```

### ขั้นที่ 6: รัน quality gates ก่อน build

```bash
cd /opt/adidus/backend
npm ci
npm test
npm audit --omit=dev

cd /opt/adidus/frontend
npm ci
npm run lint
npm run build
npm audit --omit=dev

cd /opt/adidus
```

ถ้าคำสั่งใดล้มเหลว ไม่ควร deploy revision นั้น

### ขั้นที่ 7: Build Docker images

```bash
docker build --pull -t adidus-api:2026-08-08 ./backend

docker build --pull \
  --build-arg VITE_API=https://api.example.com \
  -t adidus-web:2026-08-08 \
  ./frontend
```

ตรวจ image:

```bash
docker image ls adidus-api
docker image ls adidus-web
```

### ขั้นที่ 8: สร้าง persistent volumes สำหรับรูปภาพ

```bash
docker volume create adidus-product-images
docker volume create adidus-user-images
```

Docker volume อยู่แยกจาก lifecycle ของ container ดังนั้นลบ/recreate container แล้วรูปยังอยู่ หาก mount volume ว่างครั้งแรก Docker จะ copy รูปที่มีอยู่ใน image ไปยัง volume โดย default

### ขั้นที่ 9: รัน Backend container

```bash
docker rm -f adidus-api 2>/dev/null || true

docker run -d \
  --name adidus-api \
  --restart unless-stopped \
  --env-file /opt/adidus-config/backend.env \
  --mount type=volume,source=adidus-product-images,target=/app/img_products \
  --mount type=volume,source=adidus-user-images,target=/app/img_users \
  -p 127.0.0.1:3000:3000 \
  adidus-api:2026-08-08
```

ผูก port กับ `127.0.0.1` เพื่อไม่เปิด Node port ตรงสู่อินเทอร์เน็ต ให้ reverse proxy เป็นจุดรับ traffic

### ขั้นที่ 10: รัน Frontend container

```bash
docker rm -f adidus-web 2>/dev/null || true

docker run -d \
  --name adidus-web \
  --restart unless-stopped \
  -p 127.0.0.1:8080:80 \
  adidus-web:2026-08-08
```

### ขั้นที่ 11: ตั้ง Reverse Proxy

ตัวอย่าง host Nginx เฉพาะส่วน proxy; certificate paths และ TLS config ต้องปรับตามระบบ certificate ของ server:

```nginx
server {
    listen 443 ssl;
    server_name shop.example.com;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 443 ssl;
    server_name api.example.com;

    ssl_certificate     /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    client_max_body_size 6m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

เพิ่ม HTTP-to-HTTPS redirect ตามระบบ reverse proxy/certificate manager ที่ใช้ แล้วตรวจ config ก่อน reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

หากใช้ cloud load balancer, Render, Railway, Fly.io หรือ platform ที่ terminate TLS ให้ใช้ domain/HTTPS ของ platform แทน host Nginx ชั้นนอก

### ขั้นที่ 12: ตรวจหลัง Deploy

ตรวจ container:

```bash
docker ps --filter name=adidus
docker logs --tail 100 adidus-api
docker logs --tail 100 adidus-web
```

ตรวจ health/API:

```bash
curl -i https://api.example.com/health
curl -i https://api.example.com/products
curl -i https://api.example.com/products/999999999
curl -i https://api.example.com/products/admin
curl -I https://shop.example.com/
curl -I https://shop.example.com/admin/products
```

ผลที่คาดหวัง:

- `/health` = 200
- `/products` = 200
- product ไม่มี = 404
- admin API ไม่มี cookie = 401
- frontend route โดยตรง = 200 และคืน SPA

ทดสอบผ่าน browser เพิ่มเติม:

1. register ด้วย password อย่างน้อย 8 ตัว
2. login แล้ว refresh หน้า session ต้องยังอยู่
3. user เปิด `/admin/products` ต้องถูก redirect
4. admin เปิด admin page ได้
5. เพิ่มสินค้าเข้า cart แล้วราคาใน Network request ไม่มีผลต่อราคาจริง
6. checkout และตรวจ stock/order/cart ในฐานข้อมูล
7. upload JPEG เกิน 5 MB/ไฟล์ชนิดอื่นต้องถูกปฏิเสธ
8. logout แล้ว admin/customer API ต้องได้ 401

### ขั้นที่ 13: สร้าง Admin คนแรก

ระบบ register สร้างเฉพาะ role `user` เพื่อป้องกัน self-escalation ให้ promote ผ่าน trusted database session:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'owner@example.com';
```

## 10. วิธี Update Deployment รอบถัดไป

ใช้ immutable version tag ไม่ใช้ `latest` อย่างเดียว:

```bash
git pull --ff-only

docker build --pull -t adidus-api:2026-08-09 ./backend
docker build --pull \
  --build-arg VITE_API=https://api.example.com \
  -t adidus-web:2026-08-09 ./frontend
```

จากนั้นรัน test/migration ตามลำดับ แล้ว recreate containers ด้วย tag ใหม่ Volumes เดิมต้อง mount กลับทุกครั้ง

อย่าใช้ `docker volume rm` หรือ `docker volume prune` โดยไม่ตรวจ เพราะอาจลบรูป production

## 11. Rollback

เก็บ image tag รุ่นก่อนอย่างน้อยหนึ่งรุ่น เช่น:

- `adidus-api:2026-08-08`
- `adidus-web:2026-08-08`

ถ้ารุ่นใหม่มีปัญหา:

1. หยุด/recreate container ด้วย tag รุ่นก่อน
2. mount volumes เดิม
3. ถ้า migration ไม่ backward-compatible ให้ restore database backup
4. ตรวจ `/health`, login, cart และ order หลัง rollback

ตัวอย่าง rollback app โดยไม่แตะ volumes/database:

```bash
docker rm -f adidus-api adidus-web

docker run -d \
  --name adidus-api \
  --restart unless-stopped \
  --env-file /opt/adidus-config/backend.env \
  --mount type=volume,source=adidus-product-images,target=/app/img_products \
  --mount type=volume,source=adidus-user-images,target=/app/img_users \
  -p 127.0.0.1:3000:3000 \
  adidus-api:2026-08-08

docker run -d \
  --name adidus-web \
  --restart unless-stopped \
  -p 127.0.0.1:8080:80 \
  adidus-web:2026-08-08
```

## 12. Known limitations และงานที่ควรทำต่อ

1. Local image storage
   - ใช้ Docker named volume ได้สำหรับ single server
   - หาก backend หลาย instance ควรย้ายไป S3/R2/object storage

2. In-memory login rate limit
   - ใช้ได้กับ process/instance เดียว
   - หลาย instance ควรใช้ Redis/shared rate limiter

3. Automated tests
   - ปัจจุบันมี validation/security tests
   - ควรเพิ่ม integration tests สำหรับ login, role, cart concurrency และ checkout rollback บน test database แยก

4. Observability
   - ควรเพิ่ม structured logs, error tracking, uptime monitoring และ alerting

5. Backup
   - ต้องตั้ง automated PostgreSQL backup และ volume/object-storage backup
   - ต้องทดสอบ restore ไม่ใช่แค่สร้าง backup

6. Payment
   - payment UI ปัจจุบันยังไม่ใช่ payment gateway integration จริง
   - หากรับเงินจริงต้องใช้ provider webhook, signature verification และ idempotency

7. Upload inspection
   - production ขนาดใหญ่ควร re-encode รูป, strip metadata และ scan malware

8. Database migration lifecycle
   - migration ปัจจุบันเป็น SQL file
   - เมื่อทีมใหญ่ขึ้นควรใช้ migration tool และเก็บ migration history

## 13. Deployment checklist แบบสั้น

- [ ] Backup PostgreSQL และทดสอบว่าไฟล์ backup อ่านได้
- [ ] ตรวจและตัดสินใจ cart กำพร้า 1 รายการ
- [ ] รัน schema หรือ hardening migration
- [ ] Validate constraints หลัง cleanup legacy data
- [ ] ตั้ง `SECRET_KEY` แบบ random อย่างน้อย 32 ตัว
- [ ] ตั้ง exact `CORS_ORIGINS`
- [ ] เปิด HTTPS
- [ ] ตั้ง `COOKIE_SECURE=true`
- [ ] ตั้ง `TRUST_PROXY=true` เฉพาะเมื่ออยู่หลัง trusted proxy
- [ ] ปิด Swagger production หากไม่จำเป็น
- [ ] รัน tests/lint/build/audit
- [ ] Build images ด้วย version tag
- [ ] Mount product/user image volumes
- [ ] ตั้ง automated DB/volume backup
- [ ] ตรวจ health/API/browser smoke tests
- [ ] เก็บ image รุ่นก่อนสำหรับ rollback
- [ ] ตั้ง logs/monitoring/alerts

## 14. เอกสารอ้างอิงทางการ

- Docker multi-stage builds: https://docs.docker.com/build/building/multi-stage/
- Docker build command: https://docs.docker.com/reference/cli/docker/image/build/
- Docker volume lifecycle และ persistence: https://docs.docker.com/engine/storage/volumes/
- NGINX reverse proxy guide: https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy
