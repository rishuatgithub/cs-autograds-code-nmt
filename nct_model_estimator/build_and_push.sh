#!/bin/bash

IMAGE_NAME="nct-model-ecr"

chmod +x nct_model/train
chmod +x nct_model/serve

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 639961517570.dkr.ecr.us-east-1.amazonaws.com
#docker build -t nct-model-ecr .
#docker tag nct-model-ecr:latest 639961517570.dkr.ecr.us-east-1.amazonaws.com/nct-model-ecr:latest
#docker push 639961517570.dkr.ecr.us-east-1.amazonaws.com/nct-model-ecr:latest

#full_image_name="639961517570.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:latest"

docker build -t ${IMAGE_NAME} .
docker tag ${IMAGE_NAME}:latest 639961517570.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:latest
docker push 639961517570.dkr.ecr.us-east-1.amazonaws.com/${IMAGE_NAME}:latest
