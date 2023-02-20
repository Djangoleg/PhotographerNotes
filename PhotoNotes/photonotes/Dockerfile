FROM python:3.11
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN mkdir -p /usr/local/photonotes
RUN pip3 install --upgrade pip
COPY ./ /usr/local/photonotes
RUN pip3 install -r /usr/local/photonotes/requirements.txt
RUN pip3 install gunicorn
