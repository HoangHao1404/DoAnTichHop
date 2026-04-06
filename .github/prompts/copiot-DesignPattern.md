Sử dụng 3 design pattern này viết code cho tối ưu + generics

1. Repository Pattern
   Mục tiêu
   Tách controller khỏi database. Không được phép viết query (find(), updateOne(), aggregate()) trực tiếp trong controller.

2. Service Layer Pattern
   Mục tiêu
   Chứa toàn bộ nghiệp vụ xử lý.
   Controller chỉ request/response. Database chỉ CRUD.

3. Observer / Pub-Sub Pattern (Socket Real-time)
   Mục tiêu
   Xử lý real-time đúng cách:
   Controller không emit socket → chỉ emit event nội bộ.
