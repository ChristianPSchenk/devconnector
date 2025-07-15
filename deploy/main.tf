
# Configure the AWS provider
provider "aws" {
  region = "eu-west-1"

  default_tags {
    tags = {
      devconnector = "dev"

    }
  }
}


resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "main"
  }
}

resource "aws_s3_bucket" "main" {
  bucket = "cks2si-devconnector-bucket"

}
