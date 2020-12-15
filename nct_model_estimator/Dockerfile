FROM nvidia/cuda:11.1-base-ubuntu20.04
CMD nvidia-smi
#FROM ubuntu:18.04

RUN apt-get -y update
RUN apt-get install -y apt-utils 
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    python3.8 python3-pip python3.8-dev \
    nginx ca-certificates wget
#RUN apt-get install -y python3
#RUN apt-get -y update && apt-get install -y --no-install-recommends \
#        wget \
#        python3 \
#        nginx \
#		libgcc-5-dev \
#        ca-certificates \
#	    libevent-dev \
#	    python-all-dev \
#	    python3-dev \
#    && rm -rf /var/lib/apt/lists/*

#RUN apt-get install python3-pip
#RUN wget https://bootstrap.pypa.io/3.3/get-pip.py && python3.5 get-pip.py
#RUN apt-get install python-setuptools
RUN pip3 install --upgrade pip
RUN pip3 install numpy pandas torch flask clang sacrebleu
#RUN easy_install gevent
RUN pip3 install gevent
RUN pip3 install gunicorn && \
       # (cd /usr/local/lib/python3/dist-packages/scipy/.libs; rm *; ln ../../numpy/.libs/* .) && \
        rm -rf /root/.cache

ENV PYTHONUNBUFFERED=TRUE
ENV PYTHONDONTWRITEBYTECODE=TRUE
ENV PATH="/opt/program:${PATH}"

#RUN echo 'python --version'
#RUN echo '/usr/bin/env python --version'

COPY nct_scripts /opt/program
#COPY model /opt/ml

RUN chmod -R 775 /opt/program/
#RUN chmod -R 775 /opt/ml/

WORKDIR /opt/program
