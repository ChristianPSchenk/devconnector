
# Configure the AWS provider
provider "aws" {
  region = "eu-west-1"

  default_tags {
    tags = {
      devconnector = "dev"

    }
  }
}

# Create a key pair (replace with your public key or use aws_key_pair resource)
resource "tls_private_key" "mykey" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "deployer" {
  key_name   = "deployer-key"
  public_key = tls_private_key.mykey.public_key_openssh
}

# Create a security group allowing SSH and HTTP
resource "aws_security_group" "vm_sg" {
  name        = "vm_sg"
  description = "Allow SSH and HTTP"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create an EC2 instance
resource "aws_instance" "vm" {
  ami = "ami-01f23391a59163da9" # Ubuntu 24
  # ami                    = "ami-05c0f5389589545b7" # Amazon Linux 2 AMI (eu-west-1)
  instance_type          = "t3.micro"
  key_name               = aws_key_pair.deployer.key_name
  vpc_security_group_ids = [aws_security_group.vm_sg.id]

  user_data = <<-EOF
              #!/bin/bash
              set -eou pipefail
              echo "Hello from Terraform at `date`" > tmp/hello.txt
              echo "Start"
              apt-get update -y
              apt-get install -y git nodejs npm
              EOF
  tags = {
    Name        = "cks2si"
    Application = "devconnector"
  }
}


resource "aws_ssm_association" "chef_managed" {
  name = "AWS-ApplyChefRecipes"

  targets {
    key    = "tag:Application"
    values = ["devconnector"]
  }

  schedule_expression = "cron(0/30 * ? * * *)"

  parameters = {
    SourceType : "GitHub",
    SourceInfo : "{ \"owner\": \"ChristianPSchenk\",\"repository\": \"devconnector\",\"path\": \"deploy/chef/cookbooks\",\"getOptions\": \"branch:refs/heads/main\"}",
    RunList : "recipe[maincookbook::baseinstalls]"


  }

  association_name    = "chef-managed-update"
  compliance_severity = "MEDIUM"
  max_concurrency     = "1" # Run on one instance at a time
  max_errors          = "0" # Stop if any instance fails

}
