import pyautogui
import time
import os


# 1. Mở Terminal (macOS)
os.system("open -a Terminal")  # mở Terminal app
time.sleep(2)  # Đợi Terminal khởi động

# 2. Gõ lệnh chuyển vào thư mục dự án (thay đường dẫn phù hợp)
pyautogui.write('cd /Users/mac/graphql-prisma', interval=0.05)
pyautogui.press('enter')
time.sleep(1)

# 3. Gõ lệnh pull code
pyautogui.write('git pull origin main', interval=0.05)
pyautogui.press('enter')
