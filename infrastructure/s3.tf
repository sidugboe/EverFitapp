resource "aws_s3_bucket" "image_bucket" {
  bucket = "everfit-images"
}

resource "aws_s3_bucket_policy" "public_access" {
  bucket = aws_s3_bucket.image_bucket.id
  policy = data.aws_iam_policy_document.public_access.json
}

data "aws_iam_policy_document" "public_access" {
  statement {
    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.image_bucket.arn,
      "${aws_s3_bucket.image_bucket.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.image_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "example" {
  bucket = aws_s3_bucket.image_bucket.id

  cors_rule {
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
  }

  cors_rule {
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
  }
}