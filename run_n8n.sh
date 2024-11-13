#!/bin/bash

# Chuyển đến thư mục custom của n8n
cd ~/.n8n/custom || { echo "Không thể vào thư mục ~/.n8n/custom"; exit 1; }

# Ngắt liên kết gói n8n-nodes-friendgrid
npm unlink n8n-nodes-friendgrid

# Chuyển đến thư mục n8n-nodes-friendgrid
cd ~/n8n-nodes-friendgrid || { echo "Không thể vào thư mục ~/n8n-nodes-friendgrid"; exit 1; }

# Xóa các thư mục và file không cần thiết
rm -rf dist node_modules package-lock.json

# Cài đặt lại các gói
npm install

# Biên dịch lại gói
npm run build

# Liên kết gói
npm link

# Quay lại thư mục custom của n8n
cd ~/.n8n/custom || { echo "Không thể vào thư mục ~/.n8n/custom"; exit 1; }

# Liên kết gói n8n-nodes-friendgrid
npm link n8n-nodes-friendgrid

# Khởi động n8n
n8n start
