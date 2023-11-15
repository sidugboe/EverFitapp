data "aws_caller_identity" "s3_current" {}

resource "aws_iam_user" "s3_user" {
  name = "everfit-s3-user"
}

resource "aws_iam_access_key" "s3_user_access_key" {
  user = aws_iam_user.s3_user.name

  depends_on = [
    aws_iam_user.s3_user
  ]
}

data "aws_iam_policy_document" "s3_user_policy_document" {
  statement {
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]

    resources = [
      "${aws_s3_bucket.image_bucket.arn}/*"
    ]
  }
}

resource "aws_iam_user_policy" "s3_user_policy" {
  name = "everfit-s3-user-policy"
  user = aws_iam_user.s3_user.name

  policy = data.aws_iam_policy_document.s3_user_policy_document.json
}

output "s3_user_id" {
  value = aws_iam_access_key.s3_user_access_key.id
}

output "s3_user_secret" {
  value = aws_iam_access_key.s3_user_access_key.secret
  sensitive = true
}
