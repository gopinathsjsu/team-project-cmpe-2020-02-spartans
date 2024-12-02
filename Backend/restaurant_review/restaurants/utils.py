import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError, ClientError
from django.conf import settings
import uuid
from PIL import Image
from io import BytesIO

def upload_to_s3(file):
    """
    Upload a file to S3 and return the object key.

    Args:
        file (InMemoryUploadedFile): The file object from the request.

    Returns:
        str: The S3 object key of the uploaded file.

    Raises:
        Exception: If upload fails for any reason.
    """
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            endpoint_url='http://localhost:9004',
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

        bucket_name = settings.AWS_S3_BUCKET_NAME
        file_extension = file.name.split('.')[-1]
        object_key = f"restaurant_photos/{uuid.uuid4()}.{file_extension}"  # Unique file key

        # Upload file
        s3_client.upload_fileobj(
            file,
            bucket_name,
            object_key,
            ExtraArgs={
                'ContentType': file.content_type,
                'ACL': 'public-read'  # Optional: Make file publicly readable
            }
        )

        return object_key

    except (NoCredentialsError, PartialCredentialsError) as e:
        raise Exception("AWS credentials are not configured properly.") from e

    except Exception as e:
        raise Exception("Failed to upload file to S3.") from e
    


def delete_s3_object(s3_key):
    """
    Deletes an object from the S3 bucket.

    Args:
        s3_key (str): The key of the object to delete in the S3 bucket.

    Returns:
        bool: True if the deletion was successful, False otherwise.
    """
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            endpoint_url='http://localhost:9004',
            region_name=settings.AWS_REGION,
        )
        s3_client.delete_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=s3_key)
        return True
    except ClientError as e:
        # Log the error for debugging
        print(f"Error deleting object {s3_key}: {e}")
        return False

def generate_thumbnail(self, photo_file):
        image = Image.open(photo_file)
        image.thumbnail((150, 150))  # Resize the image to a thumbnail

        buffer = BytesIO()
        image.save(buffer, format='JPEG')
        buffer.seek(0)

        return buffer