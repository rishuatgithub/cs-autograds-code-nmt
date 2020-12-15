#!/bin/bash

IMAGE_NAME="nct-model-ecr"
ACCOUNT="639961517570"
REGION="us-east-1"

chmod +x nct_scripts/train
chmod +x nct_scripts/serve

aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT}.dkr.ecr.us-east-1.amazonaws.com

docker build -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME}:latest ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${IMAGE_NAME}:latest
#docker push ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${IMAGE_NAME}:latest
