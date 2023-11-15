terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
  backend "s3" {
    bucket = "everfit-tf-backend"
    key    = "terraform.tfstate"
    region = "us-east-2"
  }
}

resource "aws_s3_bucket" "terraform_backend" {
  bucket = "everfit-tf-backend"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_acl" "terraform_backend" {
  bucket = aws_s3_bucket.terraform_backend.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "versioning_example" {
  bucket = aws_s3_bucket.terraform_backend.id
  versioning_configuration {
    status = "Enabled"
  }
}
