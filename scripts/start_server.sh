#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
service httpd stop 
FILE=`/usr/local/bin/aws s3 ls $AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/ --recursive | sort | tail -n 1 | awk -F'/' '{print $2}'`
/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/$FILE"  "/var/www/html/" --recursive
service httpd restart 