terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.48.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.0"
}


provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "client" {
  bucket = var.bucket_name
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

data "aws_route53_zone" "zone" {
  name = var.zone
}

resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
  acl    = "public-read"
  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id

  policy = <<EOF
  {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::${var.bucket_name}/*"
            ]
        }
    ]
}
  EOF
}

resource "aws_cloudfront_distribution" "distribution" {
  price_class = "PriceClass_100"
  origin {
    domain_name = "${var.bucket_name}.s3.us-east-1.amazonaws.com"
    origin_id   = "website"
  }
  enabled         = true
  is_ipv6_enabled = true

  aliases = [
    "${var.s3_domain}"
  ]

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods = [
      "HEAD",
      "GET"
    ]
    cached_methods = [
      "HEAD",
      "GET"
    ]
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    default_ttl            = 0
    max_ttl                = 0
    min_ttl                = 0
    target_origin_id       = "website"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn      = var.certificate
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_page_path    = "/index.html"
    response_code         = 200
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_page_path    = "/index.html"
    response_code         = 200
  }
}

resource "aws_route53_record" "record" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = var.s3_domain
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "ipv6" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = var.s3_domain
  type    = "AAAA"
  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
