FROM nvidia/cuda:11.1-base-ubuntu16.04
#FROM ubuntu:16.04

RUN apt-get -y update
RUN apt-get install -y apt-utils
RUN apt-get install -y python3
RUN apt-get install -y wget nginx libgcc-5-dev ca-certificates libevent-dev python-all-dev python3-dev

#RUN apt-get install python3-pip
RUN wget https://bootstrap.pypa.io/3.3/get-pip.py && python3.5 get-pip.py
RUN pip install --upgrade pip
RUN pip install numpy pandas torch flask clang sacrebleu==1.2.11
RUN easy_install gevent
RUN pip install gunicorn && \
       # (cd /usr/local/lib/python3/dist-packages/scipy/.libs; rm *; ln ../../numpy/.libs/* .) && \
        rm -rf /root/.cache

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/program:${PATH}"

#RUN echo 'python --version'
#RUN echo '/usr/bin/env python --version'

COPY nct_scripts /opt/program
COPY model /opt/ml

RUN chmod -R 775 /opt/program/
RUN chmod -R 775 /opt/ml/

WORKDIR /opt/program
