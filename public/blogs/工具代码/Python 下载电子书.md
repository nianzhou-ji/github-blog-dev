# 电子书下载网站

# https://anyflip.com/



# 下载代码

```python
import requests
from PIL import Image
from io import BytesIO

import threading


def download_image(url, save_path):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful

        # Open the image and save it
        image = Image.open(BytesIO(response.content))
        image.save(save_path)

        print(f"Image successfully downloaded and saved to {save_path}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download image. Error: {e}")
    except IOError as e:
        print(f"Failed to save image. Error: {e}")


def run(start, end):
    # Example usage
    for i in range(start, end):
        # image_url = f"https://online.anyflip.com/ylolb/leri/files/mobile/{i}.jpg?1630322473"
        image_url = f"https://online.anyflip.com/tryyq/xkvu/files/mobile/{i}.jpg?1589996409"
        save_path = f"temp/images{i}.jpg"
        download_image(image_url, save_path)

pagesGroup = [[1,4], [4,6]]
for x,y in pagesGroup:
    t = threading.Thread(target=run, args=(x, y, ))
    t.start()




```



# 合并成PDF代码

```python
import os

import fitz  # PyMuPDF
import functools


def create_pdf_from_images(image_folder, output_pdf_path):
    doc = fitz.open()  # 创建一个新的 PDF 文档

    for image_path in image_folder:
        imgdoc = fitz.open(image_path)  # 打开图片
        pdfbytes = imgdoc.convert_to_pdf()  # 将图片转换为 PDF
        imgpdf = fitz.open("pdf", pdfbytes)
        doc.insert_pdf(imgpdf)  # 将当前图片的 PDF 插入到文档中

    doc.save(output_pdf_path)  # 保存 PDF 文档
    doc.close()


def comp(x, y):
    if int(x[6:-4]) < int(y[6:-4]):
        return -1
    if int(x[6:-4]) > int(y[6:-4]):
        return 1

    return 0


# 使用示例
root = 'temp/Expert Python Programming'
temps = os.listdir(root)
temps = sorted(temps, key=functools.cmp_to_key(comp))
image_folder = [os.path.join(root, i) for i in temps]  # 图片路径列表
output_pdf_path = "temp/output.pdf"  # 输出的 PDF 文件路径
create_pdf_from_images(image_folder, output_pdf_path)

```

