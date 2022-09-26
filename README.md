This capstone Project deploy an dockerized app in EKS cluster
Some defined name(These can easily be soft coded but for simplicity i am using name defined in .config file):
    cluster name: EKSCluster
    App Name: capstoneapp(if youchange your app name then you should replace this in config file,deployment.yaml file and service.yaml file)
    Region: us-east-1


Steps:
    1. EKS cluster with working nodes is created by the awscf.yaml ccloudformation file. The command for creating cluster is 
    aws cloudformation create-stack --stack-name Capproject --template-body file://awscf.yaml    --parameters file://parameters.json  --region=us-east-1 --capabilities CAPABILITY_NAMED_IAM

    The cluster name is EKSCluster and parameters like cidr block is defined in parameters.json file

    2. Creating The pipeline. Here Circle ci is Used. CircleCi is configured by .config.yaml file.
     pipelines include Build,Lint Test,Test, buildDocker and deploy state.
    
    3. Rolling Deployment is used in this pipeline. Rolling update is defined in deeployment.yaml file. Maximum unavialble server is defined to 25%
    4. Dockerfile is linted by hadolint docker image  and deployed in docker repository.
    5. Once Docker is successfully deployed to repo then the program make connection to cluster. As cluster name is hard coded the command for connection is used 
          aws eks --region us-east-1 update-kubeconfig --name EKSCluster
        once connection made the the application is deployed by kubectl command 

        If you change conatiner name and image or pod number  then the rolling update in console 

    6. once deployment happen then itsexposed by load balancer . You can access to app by load balancer at port number 3000
    7. If Successful deploy happen the it shows All done in last command . Else It will rolling back to last successful deployment.

    


