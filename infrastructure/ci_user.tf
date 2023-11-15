data "aws_caller_identity" "current" {}

resource "aws_iam_user" "ci_user" {
  name = "ci-docker"
}

resource "aws_iam_access_key" "access_key" {
  user = aws_iam_user.ci_user.name

  depends_on = [
    aws_iam_user.ci_user
  ]
}

data "aws_iam_policy_document" "ci_user_policy_document" {
  statement {
    effect = "Allow"
    actions = [
      "ecr:PutLifecyclePolicy",
      "ecr:PutImageTagMutability",
      "ecr:DescribeImageScanFindings",
      "ecr:StartImageScan",
      "ecr:GetLifecyclePolicyPreview",
      "ecr:GetDownloadUrlForLayer",
      "ecr:ListTagsForResource",
      "ecr:UploadLayerPart",
      "ecr:ListImages",
      "ecr:PutImage",
      "ecr:UntagResource",
      "ecr:BatchGetImage",
      "ecr:DescribeImages",
      "ecr:TagResource",
      "ecr:DescribeRepositories",
      "ecr:StartLifecyclePolicyPreview",
      "ecr:InitiateLayerUpload",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetRepositoryPolicy",
      "ecr:GetLifecyclePolicy",
      "ecr:GetAuthorizationToken",
      "ecr:CompleteLayerUpload"
    ]

    resources = [aws_ecr_repository.ecr_repo.arn]
  }
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability"
    ]

    resources = ["*"]
  }
}

resource "aws_iam_user_policy" "ci_user_policy" {
  name = "ci-user-policy"
  user = aws_iam_user.ci_user.name

  policy = data.aws_iam_policy_document.ci_user_policy_document.json
}
