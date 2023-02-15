#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
FILE=`/usr/local/bin/aws s3api list-objects-v2 --bucket "$AWS_S3_BUCKET_NAME" --query 'reverse(sort_by(Contents[?contains(Key, \`.jar\`)], &LastModified))[:1].Key' --output=text`;

/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$FILE"  /var/www/html
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-QA" ]
then 
    echo "Execute for QA"
fi    
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-Showcase" ]
then 
    echo "Execute for Showcase"
fi    

