# Hệ thống Scoring & Confidence - Báo cáo

## Tổng quan

Hệ thống tính độ tin cậy (confidence) của một báo cáo dựa trên **4 tiêu chí**:

| Tiêu chí      | Nguồn dữ liệu                      | Mục đích                                          |
| ------------- | ---------------------------------- | ------------------------------------------------- |
| **Vị trí**    | GPS từ ảnh vs GPS báo cáo          | Xác thực người dùng có đến đúng nơi báo cáo không |
| **Nội dung**  | Từ khóa trong mô tả                | Đánh giá mức độ liên quan đến ổ gà                |
| **Thời gian** | EXIF DateTime vs thời gian báo cáo | Phát hiện báo cáo cũ, ảnh chụp từ lâu             |
| **AI Model**  | AI model phát hiện sự cố           | Xác thực hình ảnh có thực sự hay không            |

---

## 1. Location Score (Vị trí)

### Công thức

```
score = max(0, 100 - (distance_km / 5) × 100)
```

### Bảng điểm

| Khoảng cách | Điểm |
| ----------- | ---- |
| 0 m         | 100  |
| 500 m       | 90   |
| 1 km        | 80   |
| 2 km        | 60   |
| 3 km        | 40   |
| 4 km        | 20   |
| 5 km        | 0    |

### Quy tắc

- **Có GPS EXIF + GPS báo cáo:** Tính khoảng cách Haversine → điểm
- **Thiếu GPS EXIF:** Không tính tiêu chí này
- **Báo cáo dạng text địa chỉ:** 0 điểm (trong tương lai sẽ hỗ trợ geocoding)

---

## 2. Content Score (Nội dung)

### Danh sách từ khóa

| Loại       | Điểm  | Từ khóa                                                                                                                                           |
| ---------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mạnh**   | 2 pts | pothole, hole, hố, nứt, crack, gãy, broken, nguy hiểm, hazard, accident, tai nạn, damaged, hư hỏng                                                |
| **Thường** | 1 pt  | road, đường, asphalt, nhựa, pavement, vỉa hè, traffic, giao thông, repair, sửa chữa, unsafe, không an toàn, risk, rủi ro, deteriorated, suy thoái |

### Công thức

```
total_score = Σ(điểm từ khóa tìm thấy)
score = min(100, (total_score / 18) × 100)
```

_Giải thích: 18 là tổng điểm tối đa (9 từ khóa mạnh × 2 điểm)_

### Bảng điểm tham khảo

| Kịch bản                | Điểm |
| ----------------------- | ---- |
| 9 từ mạnh               | 100  |
| 6 từ mạnh               | 67   |
| 4 từ mạnh               | 44   |
| 3 từ mạnh + 2 từ thường | 50   |
| 2 từ mạnh               | 22   |
| 1 từ mạnh               | 11   |
| Không có từ nào         | 0    |

### Quy tắc

- Không phân biệt hoa/thường
- Tìm kiếm chính xác (word boundary)
- Từ khóa xuất hiện nhiều lần chỉ tính 1 lần
- Nội dung trống → 0 điểm

---

## 3. Time Score (Thời gian)

### Công thức

```
score = max(0, 100 - (hours_diff / 6) × 100)
```

### Bảng điểm

| Chênh lệch | Điểm |
| ---------- | ---- |
| 0 giờ      | 100  |
| 1.5 giờ    | 75   |
| 3 giờ      | 50   |
| 4.5 giờ    | 25   |
| 6+ giờ     | 0    |

### Quy tắc

- **Có DateTime EXIF:** Tính chênh lệch tuyệt đối với thời gian báo cáo
- **Thiếu DateTime:** Không tính tiêu chí này
- **Khác ngày:** Tính từ 24h trở lên (sẽ được 0 điểm)

---

## 4. AI Pothole Score (YOLO)

### Công thức (Option 3: Amplify + Floor Minimum)

```
amplified_damage = damage_percentage × 5
floor_minimum = num_potholes × 15
boosted = max(amplified_damage, floor_minimum)
score = min(100, boosted)
```

### Giải thích

- **Amplify 5x:** Vì damage_percentage từ YOLO thường rất nhỏ (0.7%), ta nhân với 5x để phóng đại
- **Floor Minimum:** Đảm bảo mỗi ổ gà phát hiện được tối thiểu 15 điểm
- **Max:** Lấy giá trị cao hơn (damage amplified hay floor minimum)
- **Cap at 100:** Không vượt quá 100%

### Bảng điểm

| Số ổ gà | Damage % | Amplified | Floor | Score |
| ------- | -------- | --------- | ----- | ----- |
| 0       | 0.7%     | 3.5%      | 0%    | 0     |
| 1       | 0.7%     | 3.5%      | 15%   | 15    |
| 1       | 5%       | 25%       | 15%   | 25    |
| 2       | 10%      | 50%       | 30%   | 50    |
| 2       | 50%      | 250%      | 30%   | 100   |

### Quy tắc

- **Không phát hiện ổ gà (0):** Score = 0
- **Phát hiện ≥1 ổ gà:** Tối thiểu 15% × số ổ gà
- **Damage nhỏ nhưng có phát hiện:** Được boost nhờ floor minimum
- **Damage lớn:** Score capped at 100%

---

## 5. Trọng số

### Trường hợp đầy đủ 4 tiêu chí

| Tiêu chí   | Trọng số |
| ---------- | -------- |
| Location   | 28%      |
| Content    | 28%      |
| Time       | 23%      |
| AI Pothole | 21%      |

### Trường hợp thiếu tiêu chí (tự động cân đối)

| Tình huống               | Location | Content | Time | AI Pothole |
| ------------------------ | -------- | ------- | ---- | ---------- |
| Đầy đủ 4 tiêu chí        | 28%      | 28%     | 23%  | 21%        |
| Thiếu AI Pothole         | 36%      | 36%     | 28%  | -          |
| Thiếu Time               | 35%      | 35%     | -    | 30%        |
| Thiếu Location           | -        | 40%     | 30%  | 30%        |
| Chỉ Content + AI Pothole | -        | 50%     | -    | 50%        |
| Chỉ Content              | -        | 100%    | -    | -          |

### Quy tắc

- Khi có 4 tiêu chí: Mỗi tiêu chí là 28%, 28%, 23%, 21%
- Khi thiếu tiêu chí: Tạm thời bỏ qua, chia lại trọng số cho các tiêu chí có sẵn
- Nếu chỉ có 1 tiêu chí: Tính confidence chỉ dựa trên tiêu chí đó (100%)

---

## 6. Công thức tổng hợp

```
confidence = Σ(score_i × weight_i)
confidence = round(confidence)
```

---

## 6. Đánh giá mức độ tin cậy

| Khoảng điểm | Mức độ             | Màu | Hành động                 |
| ----------- | ------------------ | --- | ------------------------- |
| 90-100%     | Rất tin cậy        | 🟢  | Tự động duyệt             |
| 80-89%      | Tin cậy cao        | 🟢  | Kiểm tra nhanh            |
| 70-79%      | Tin cậy trung bình | 🟡  | Xác minh thủ công         |
| 50-69%      | Tin cậy thấp       | 🟠  | Yêu cầu bổ sung thông tin |
| < 50%       | Không đủ tin cậy   | 🔴  | Từ chối                   |

---

## 7. Ví dụ minh họa

### Input

```
Báo cáo:
- Vị trí: 10.776234, 106.710049
- Nội dung: "Hố đường lớn trên Nguyễn Huệ, nứt gãy nguy hiểm"
- Thời gian: 2024-03-23 10:30

EXIF ảnh:
- GPS: 10.776300, 106.710100 (cách 100m)
- DateTime: 2024-03-23 08:45 (cách 1.75 giờ)
```

### Tính toán

| Tiêu chí       | Điểm | Trọng số | Thành phần     |
| -------------- | ---- | -------- | -------------- |
| Location       | 90   | 28%      | 25.2           |
| Content        | 100  | 28%      | 28.0           |
| Time           | 71   | 23%      | 16.3           |
| AI Model       | 18   | 21%      | 3.8            |
| **Confidence** |      |          | **73.3 → 73%** |

### Kết luận

**73% - Tin cậy trung bình** 🟡 → Xác minh thủ công

---

## 8. Các tham số có thể điều chỉnh

| Tham số              | Giá trị mặc định | Mục đích                              |
| -------------------- | ---------------- | ------------------------------------- |
| maxDistance          | 5 km             | Ngưỡng khoảng cách tối đa             |
| maxHoursDiff         | 6 giờ            | Ngưỡng thời gian tối đa               |
| maxKeywordScore      | 18 điểm          | Tổng điểm tối đa từ khóa              |
| weights              | 28/28/23/21      | Trọng số (Location/Content/Time/YOLO) |
| strongKeywordWeight  | 2 pts            | Điểm cho từ khóa mạnh                 |
| regularKeywordWeight | 1 pt             | Điểm cho từ khóa thường               |
| yoloAmplify          | 5x               | Hệ số nhân damage_percentage          |
| yoloFloorMinimum     | 15%              | Điểm tối thiểu mỗi ổ gà phát hiện     |
| yoloTimeout          | 30s              | Timeout cho YOLO API call             |
| yoloRetryCount       | 3                | Số lần retry nếu YOLO API lỗi         |

---

**Ghi chú:** Hệ thống này tích hợp 4 tiêu chí để tính độ tin cậy: vị trí GPS, nội dung mô tả, thời gian EXIF, và xác thực AI.
