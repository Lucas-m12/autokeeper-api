#!/bin/bash

echo "Creating SQS queues..."

awslocal sqs create-queue --queue-name autokeeper-emails-dlq

awslocal sqs create-queue \
  --queue-name autokeeper-emails \
  --attributes '{
    "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:000000000000:autokeeper-emails-dlq\",\"maxReceiveCount\":\"3\"}",
    "VisibilityTimeout": "30"
  }'

echo "SQS queues created with DLQ redrive policy"
awslocal sqs list-queues
