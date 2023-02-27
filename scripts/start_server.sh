#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
service httpd stop 
FILE=`/usr/local/bin/aws s3 ls $AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/ --recursive | sort | tail -n 1 | awk '{print $4}'`
/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$FILE"  "/var/www/html/" --recursive

if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-QA" ]
then 
    service httpd restart 
fi    
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-Showcase" ]
then 
    service httpd restart 
fi    

