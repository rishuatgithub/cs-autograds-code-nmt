import os
import io
import boto3
import json
import base64


MODEL_ENDPOINT=os.environ['ENDPOINT_NAME']
runtime = boto3.client('runtime.sagemaker')

def lambda_handler(event, context):
    print('calling lambda_handler')
    
    data = json.dumps(event)
    
    #payload = data
    #print(payload)
    
    response = runtime.invoke_endpoint(EndpointName=MODEL_ENDPOINT,
                                   ContentType='application/json',
                                   Body=data)

    result = response['Body'].read().decode()
    
    return {
        'statusCode': 200,
        'body': result
    }