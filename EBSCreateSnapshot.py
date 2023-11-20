import boto3
import datetime
import json

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    try:
        # Extract necessary information from the CloudWatch event
        volume_id = event['detail']['requestParameters']['volumeId']

        # Create EBS snapshot
        ec2_client = boto3.client('ec2')
        response = ec2_client.create_snapshot(
            VolumeId=volume_id,
            Description=f"EBS Backup - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
        )

        # Send success notification to SNS
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:035431961317:Ebs-create-topic',
            Subject='EBS Snapshot Creation Success',
            Message=json.dumps({'default': json.dumps({'Message': 'EBS Snapshot Created Successfully'})}),
            MessageStructure='json'
        )
    except Exception as e:
        # Send failure notification to SNS
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:035431961317:Ebs-create-topic',
            Subject='EBS Snapshot Creation Failure',
            Message=json.dumps({'default': json.dumps({'Error': str(e)})}),
            MessageStructure='json'
        )
        raise e
