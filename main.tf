# Define the provider
provider "aws" {
  region = "us-east-1" # US East (N. Virginia)
}

# Create a VPC
resource "aws_vpc" "RDSvpc" {
  cidr_block = "10.0.0.0/16"
}
resource "aws_internet_gateway" "RDSigw" {
  vpc_id = aws_vpc.RDSvpc.id
}

# Create a subnet in US East A (us-east-1a)
resource "aws_subnet" "RDSA" {
  vpc_id            = aws_vpc.RDSvpc.id
  availability_zone = "us-east-1a"
  cidr_block        = "10.0.1.0/24"  # Adjust the CIDR block
}

# Create a subnet in US East B (us-east-1b)
resource "aws_subnet" "RDSB" {
  vpc_id            = aws_vpc.RDSvpc.id
  availability_zone = "us-east-1b"
  cidr_block        = "10.0.2.0/24"  # Adjust the CIDR block
}

# Create a security group allowing all traffic from anywhere
resource "aws_security_group" "RDSsgr" {
  name_prefix = "rdsgr"
  description = "Allow all inbound traffic"
  vpc_id = aws_vpc.RDSvpc.id
  
  ingress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Create a DB subnet group
resource "aws_db_subnet_group" "dbsubgroup" {
  name       = "rds-db-subnet-group"
  description = "Subnet group for RDS instance"
  subnet_ids = [aws_subnet.RDSA.id, aws_subnet.RDSB.id]
}

# Create an RDS instance (MySQL) with the free tier option
resource "aws_db_instance" "migrationDB" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  db_subnet_group_name = aws_db_subnet_group.dbsubgroup.name
  username             = "admin"
  password             = "password"
  parameter_group_name = "default.mysql5.7"
  skip_final_snapshot  = true

  vpc_security_group_ids = [aws_security_group.RDSsgr.id]
}

# Output the RDS endpoint for reference
output "rds_endpoint" {
  value = aws_db_instance.migrationDB.endpoint
}