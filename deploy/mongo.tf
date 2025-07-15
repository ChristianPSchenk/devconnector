resource "aws_ecs_cluster" "cluster" {
  name = "mongo-cluster"


}

resource "aws_ecs_capacity_provider" "capacity_provider" {
  name = "mongo-capacity-provider"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs.arn


    managed_scaling {
      status                    = "ENABLED"
      target_capacity           = 1
      minimum_scaling_step_size = 1
      maximum_scaling_step_size = 1
      instance_warmup_period    = 180
    }
  }
}

resource "aws_ecs_cluster_capacity_providers" "ecs_capacity_providers" {
  cluster_name       = aws_ecs_cluster.cluster.name
  capacity_providers = [aws_ecs_capacity_provider.capacity_provider.name]
  default_capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.capacity_provider.name
    weight            = 1
    base              = 1
  }
}

resource "aws_launch_template" "ecs" {
  name_prefix   = "ecs-"
  image_id      = "ami-0a7f9fa6f8781184d"
  instance_type = "t2.micro"

  iam_instance_profile {
    name = aws_iam_instance_profile.ecs_instance.name
  }

  vpc_security_group_ids = [aws_security_group.ecs.id]

  user_data = base64encode(data.template_file.ecs_user_data.rendered)
}


resource "aws_autoscaling_group" "ecs" {
  name             = "ecs-asg"
  max_size         = 1
  min_size         = 0
  desired_capacity = 0
  launch_template {
    id      = aws_launch_template.ecs.id
    version = "$Latest"

  }

  vpc_zone_identifier = [aws_subnet.main.id]
  health_check_type   = "EC2"
  force_delete        = true
  tag {
    key                 = "Name"
    value               = "ecs-instance"
    propagate_at_launch = true
  }

  lifecycle {
    ignore_changes = [desired_capacity, tag]
  }
}

data "template_file" "ecs_user_data" {
  template = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${aws_ecs_cluster.cluster.name} >> /etc/ecs/ecs.config
echo ECS_AGENT_PID_NAMESPACE_HOST=false >> /etc/ecs/ecs.config

EOF
}

resource "aws_iam_instance_profile" "ecs_instance" {
  name = "ecs-instance-profile"
  role = aws_iam_role.ecs_instance_role.name
}

resource "aws_iam_role" "ecs_instance_role" {
  name               = "ecs-instance-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role_policy.json

}

data "aws_iam_policy_document" "ecs_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}
resource "aws_iam_role_policy" "ecs_instance_register" {
  name = "ecs-instance-register-policy"
  role = aws_iam_role.ecs_instance_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = "ecs:*"
        Resource = "*"
      }
    ]
  })
}

resource "aws_security_group" "ecs" {
  name        = "ecs-sg"
  description = "Allow ECS instance access"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "mongo" {
  name            = "mongodb"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.mongo.arn
  desired_count   = 1
  #iam_role        = aws_iam_role.foo.arn
  #depends_on      = [aws_iam_role_policy.foo]


}

resource "aws_ecs_task_definition" "mongo" {
  family                   = "mongo-task"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "mongo"
      image     = "mongodb/mongodb-community-server:latest"
      essential = true
      portMappings = [
        {
          containerPort = 27017
          hostPort      = 27017
          protocol      = "tcp"
        }
      ]
      environment = []
    }
  ])
}
