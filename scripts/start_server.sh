#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
service httpd stop 
FILE=`/usr/local/bin/aws s3 ls $AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/ --recursive | sort | tail -n 1 | awk -F'/' '{print $2}'`
/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/$FILE"  "/var/www/html/" --recursive
service httpd restart 
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Backend-v2-QA" ]
then
    source /opt/scripts/export_QA_env.sh
fi
# if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Backend-v2-Showcase" ]
# then
#     source /opt/scripts/export_Showcase_env.sh
# fi
# if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Backend-v2-Prod" ]
# then
#     source /opt/scripts/export_Prod_env.sh
# fi
psql postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST/$DB__SCHEMA_NAME -f $SQL_FILE_PATH
echo -n "Delete data from QA RDS executing "+$SQL_FILE_PATH