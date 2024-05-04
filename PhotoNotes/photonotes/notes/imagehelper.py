from io import BytesIO
from PIL import Image, ImageOps
from PIL.Image import Resampling
from django.core.files.uploadedfile import InMemoryUploadedFile
import random
import string


def crop_to_aspect(image: Image, aspect, divisor=1, alignx=0.5, aligny=0.5) -> Image:
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
        new_width = int(image.height * (aspect / divisor))
        new_height = image.height
    else:
        new_width = image.width
        new_height = int(image.width / (aspect / divisor))
    img = image.crop((alignx * (image.width - new_width),
                      aligny * (image.height - new_height),
                      alignx * (image.width - new_width) + new_width,
                      aligny * (image.height - new_height) + new_height))
    return img


def check_and_resize_image_if_need(image, max_image_size):
    width, height = image.size
    if width > max_image_size or height > max_image_size:
        size = (max_image_size, max_image_size)
        image.thumbnail(size, resample=Resampling.LANCZOS)


def get_memory_upload_file(image, image_name, content_type, field_name):
    buffer = BytesIO()
    image.convert('RGB').save(buffer, filename=image_name, format="JPEG")
    new_picture_file = InMemoryUploadedFile(file=buffer, field_name=field_name, name=image_name,
                                            content_type=content_type, size=len(buffer.getvalue()),
                                            charset=None)
    return new_picture_file


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


def get_random_file_name(length, prefix, extension):
    letters = string.ascii_letters
    return prefix + ''.join((random.choice(letters)) for _ in range(length)) + extension
