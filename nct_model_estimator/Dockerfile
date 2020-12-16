#FROM nvidia/cuda:11.1-base-ubuntu20.04
#CMD nvidia-smi
FROM ubuntu:18.04

RUN apt-get -y update
RUN apt-get install -y apt-utils 
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    python3.8 python3-pip libpython3.6-dev python3.8-dev \
    ca-certificates libgcc-5-dev libevent-dev git build-essential \
    nginx \
    && rm -rf /var/lib/apt/lists/*
RUN apt-get install -y gcc g++
#RUN apt-get install -y nginx

RUN python3 -m pip install --upgrade pip setuptools wheel Cython

COPY requirements.txt .
RUN python3 -m pip install -r requirements.txt
RUN pip3 install fastBPE

RUN easy_install gevent
RUN pip3 install gunicorn && \
        rm -rf /root/.cache

#RUN git clone https://github.com/glample/fastBPE
#WORKDIR fastBPE
#RUN g++ -std=c++11 -pthread -O3 fastBPE/main.cc -IfastBPE -o fast
#RUN python3 setup.py install

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/program:${PATH}"

#EXPOSE 5000

COPY nct_scripts /opt/program

RUN chmod -R 775 /opt/program/

WORKDIR /opt/program

#CMD ["./predictor.py"]
