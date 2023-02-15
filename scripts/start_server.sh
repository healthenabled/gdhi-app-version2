#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
service httpd stop 
/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/"  "/var/www/html/" --recursive

if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-QA" ]
then 
    service httpd restart 
fi    
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Frontend-v2-Showcase" ]
then 
    service httpd restart 
fi    

