import boto3
import json
from datetime import datetime, timedelta, timezone

def lambda_handler(event, context):
    sns_client = boto3.client('sns')  # Initialize sns_client outside the try block

    try:
        # List objects in the S3 bucket
        s3_client = boto3.client('s3', region_name='us-west-2')
        objects = s3_client.list_objects(Bucket='dr-backup-ebs')['Contents']

        # Find and delete snapshots older than 2 weeks
        two_weeks_ago = datetime.now(timezone.utc) - timedelta(days=14)
        for obj in objects:
            if obj['LastModified'].replace(tzinfo=timezone.utc) < two_weeks_ago:
                s3_client.delete_object(Bucket='dr-backup-ebs', Key=obj['Key'])

        # Send success notification to SNS
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:035431961317:old-snapshot-purged',
            Subject='Delete Old Snapshots Success',
            Message=json.dumps({'default': json.dumps({'Message': 'Old Snapshots Deleted Successfully'})}),
            MessageStructure='json'
        )
    except Exception as e:
        # Send failure notification to SNS
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:035431961317:old-snapshot-purged',
            Subject='Delete Old Snapshots Failure',
            Message=json.dumps({'default': json.dumps({'Error': str(e)})}),
            MessageStructure='json'
        )
        raise e
