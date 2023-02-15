#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
FILE=`/usr/local/bin/aws s3api list-objects-v2 --bucket "$AWS_S3_BUCKET_NAME" --query 'reverse(sort_by(Contents[?contains(Key, \`.jar\`)], &LastModified))[:1].Key' --output=text`;
service httpd stop 
/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$FILE"  /var/www/html


if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-QA" ]
then 
    service httpd restart 
fi    
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-Showcase" ]
then 
    service httpd restart 
fi    

