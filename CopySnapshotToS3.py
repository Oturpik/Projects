import boto3
import json
import os

def lambda_handler(event, context):
    temp_file_path = ''  # Initialize the variable
    sns_client = boto3.client('sns')  # Initialize sns_client outside the try block

    try:
        # Print the event for debugging
        print("Event:", json.dumps(event))

        # Extract necessary information from the CloudWatch event
        snapshot_id = event.get('detail', {}).get('responseElements', {}).get('snapshotId')

        if not snapshot_id:
            # If snapshot_id is not available, log an error and raise an exception
            raise ValueError("Snapshot ID not found in the event")

        # Generate a temporary file path and name
        temp_file_path = f'/tmp/{snapshot_id}.txt'

        # Create an empty file (you may customize this step based on your needs)
        with open(temp_file_path, 'w') as temp_file:
            temp_file.write('Snapshot content goes here.')

        # Copy snapshot to S3 bucket in us-west-2 region
        s3_client = boto3.client('s3', region_name='us-east-2')
        s3_client.upload_file(
            Filename=temp_file_path,
            Bucket='dr-backup-ebs',
            Key=f'snapshots/{snapshot_id}.txt'
        )

        # Send success notification to SNS
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:035431961317:snapshot-in-S3',
            Subject='Snapshot Copy to S3 Success',
            Message=json.dumps({'default': json.dumps({'Message': 'Snapshot Copied to S3 Successfully'})}),
            MessageStructure='json'
        )
    except Exception as e:
        # Send failure notification to SNS
        sns_client.publish(
            TopicArn='arn:aws:sns:us-east-1:035431961317:snapshot-in-S3',
            Subject='Snapshot Copy to S3 Failure',
            Message=json.dumps({'default': json.dumps({'Error': str(e)})}),
            MessageStructure='json'
        )
        raise e
    finally:
        if temp_file_path:
            # Delete the temporary file after upload
            os.remove(temp_file_path)
