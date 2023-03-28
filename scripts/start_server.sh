#!/bin/bash
set -xe
pwd
source /opt/scripts/export_aws_vars.sh
service httpd stop 

if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Backend-v2-QA" ]
then
    source /opt/scripts/export_QA_env.sh
    FILE=`/usr/local/bin/aws s3 ls $AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/ --recursive | sort | tail -n 1 | awk -F'/' '{print $2}'`
    # ---------------------------
    # Delete the data from QA RDS
    # ---------------------------
    psql postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST/$DB__SCHEMA_NAME -f $SQL_FILE_PATH_FRONTEND
    echo -n "Delete data from QA RDS executing "+$SQL_FILE_PATH_FRONTEND
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Backend-v2-Showcase" ]
then
    source /opt/scripts/export_Showcase_env.sh
    FILE=`/usr/local/bin/aws ssm get-parameters --name "buildNumberForApp" --query "Parameters[0].Value" | tr -d '"'`
    # ---------------------------
    # Delete the data from Showcase RDS
    # ---------------------------
    psql postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST/$DB__SCHEMA_NAME -f $SQL_FILE_PATH_FRONTEND
    echo -n "Delete data from Showcase RDS executing "+$SQL_FILE_PATH_FRONTEND
fi
if [ "$DEPLOYMENT_GROUP_NAME" == "GDHI-Backend-v2-Prod" ]
then
    source /opt/scripts/export_Prod_env.sh
    FILE=`/usr/local/bin/aws ssm get-parameters --name "buildNumberForApp" --query "Parameters[0].Value" | tr -d '"'`
fi

/usr/local/bin/aws s3 cp "s3://$AWS_S3_BUCKET_NAME/$AWS_S3_FOLDER_FRONTEND/$FILE"  "/var/www/html/" --recursive
service httpd restart 
