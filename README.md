
# Deploying a React app to EKS cluster by CircleCI and CloudFormation

This projects aims to implement a CICD pipeline to integrate and deploy and React app in AWS EKS cluster using CircleCI and IAC toll cloudFormation. A fully automated and scalable system is coded so a  a few commands can make your app live in AWS cloud. 




## Authors

- [@Al Mamun Khan](https://www.github.com/almamunkhan09)


## Environment Variables

To run this project, you will need to add the following environment variables to your CircleCi Settings. To naviagate to the Environment => Project Setting -> Environment Variables -> Add Variables 

`AWS_ACCESS_KEY_ID`
`AWS_DEFAULT_REGION`
`AWS_SECRET_ACCESS_KEY`
`DOCKER_PASS`
`DOCKER_USER`





## Installation

Inorder to create a cluster you should have installed aws cli in your sytem. You can Install AWS cli you can visit https://aws.amazon.com/cli/ 

    
## AWS Cluster Creation

First We need to create EKS cluster in AWS. Cluster can be created automatically in CirclrCI.But it will take time to create the whole stack and exceed the default times for of running a singel task in CircleCi. Moreover for not overlapping with other VPC configurations its should do separately.
The awscf.yaml file is the file for creating AWS CloudFormtion stack that will create a EKS cluster. Feel to change VPC parameters like CIDR and EKS cluster name, Working node numbers,working Node configurations parameters.  

Command for creating AWS EKS cluster

```bash
  aws cloudformation create-stack --stack-name <stack name> --template-body file://awscf.yaml --parameters file://parameters.json --region=<AWS region> --capabilities CAPABILITY_NAMED_IAM
```

