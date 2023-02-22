import os
from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.uploadedfile import InMemoryUploadedFile


def crop_to_aspect(image, aspect, divisor=1, alignx=0.5, aligny=0.5):
    """Crops an image to a given aspect ratio.
    Args:
        image (Image)
        aspect (float): The desired aspect ratio.
        divisor (float): Optional divisor. Allows passing in (w, h) pair as the first two arguments.
        alignx (float): Horizontal crop alignment from 0 (left) to 1 (right)
        aligny (float): Vertical crop alignment from 0 (left) to 1 (right)
    Returns:
        Image: The cropped Image object.
    """
    if image.width / image.height > aspect / divisor:
        newwidth = int(image.height * (aspect / divisor))
        newheight = image.height
    else:
        newwidth = image.width
        newheight = int(image.width / (aspect / divisor))
    img = image.crop((alignx * (image.width - newwidth),
                     aligny * (image.height - newheight),
                     alignx * (image.width - newwidth) + newwidth,
                     aligny * (image.height - newheight) + newheight))
    return img


def resize_image(file_content, image_name, content_type, max_image_size):
    target_image = Image.open(file_content)
    target_image = ImageOps.exif_transpose(target_image)
    width, height = target_image.size
    size = (max_image_size, max_image_size)

    if width > max_image_size or height > max_image_size:
        target_image.thumbnail(size, resample=Image.ANTIALIAS)
        buffer = BytesIO()
        target_image.save(buffer, format="JPEG")

        new_picture_file = InMemoryUploadedFile(file=buffer, field_name='imageminicard', name=image_name,
                                                content_type=content_type, size=len(buffer.getvalue()),
                                                charset=None)
        return new_picture_file
    else:
        return None


def crop_image(file_content, image_name, content_type, new_width, new_height):
    target_image = Image.open(file_content)
    target_image = ImageOps.exif_transpose(target_image)

    width, height = target_image.size  # Get dimensions

    left = (width - new_width) / 2
    top = (height - new_height) / 2
    right = (width + new_width) / 2
    bottom = (height + new_height) / 2

    area = (left, top, right, bottom)

    temp_file = target_image.crop(area)
    buffer = BytesIO()
    temp_file.save(buffer, format="JPEG")

    new_picture_filename = 'crop_' + image_name

    new_picture_file = InMemoryUploadedFile(file=buffer, field_name='imageminicard', name=new_picture_filename,
                                            content_type=content_type, size=len(buffer.getvalue()),
                                            charset=None)
    return new_picture_file
