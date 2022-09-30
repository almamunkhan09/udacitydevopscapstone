
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
The awscf.yaml file is the file for creating AWS CloudFormtion stack that will create a EKS cluster. Feel to change VPC parameters like CIDR and EKS cluster name in parameters file <parameters.json>.  

Command for creating AWS EKS cluster

```bash
    aws cloudformation create-stack --stack-name <stack name> --template-body file://awscf.yaml --parameters file://parameters.json --region=<AWS region> --capabilities CAPABILITY_NAMED_IAM
```

Once the cluster created you can have a list of cluster. Please wait until the cluster is created 

```bash
    aws eks list-clusters
```

## Integrate github into CircleCI
Build,Test is done automatically once we import config.yml file from github in CircleCI application. The work is just to sing in in CircleCI using github and navigate to config.yml file. Once it is done the a commit to github can set to trigger the pipeline. 
## Deployment
The steps defined in config file 
- Build 
- Test
- Lint
- Dockerize: 
``` bash
buildDocker:
    machine:
      image: ubuntu-2204:2022.04.2
    steps:
      - checkout
      # start proprietary DB using private Docker image
      # with credentials stored in the UI
      - run: |
          echo "$DOCKER_PASS" | docker login --username $DOCKER_USER --password-stdin
          

      # build the application image and check dockerlint by hadolint 
      - run: |
          docker run --rm -i ghcr.io/hadolint/hadolint < Dockerfile
          docker build -t mydockerapp .
          docker tag mydockerapp khanalmamun/capstone:new

      # deploy the image
      - run: docker push khanalmamun/capstone:new

```

You can modify the tag for doscker images name  (<mydockerapp>) and you haveto create a repository and change in the lines  docker tag mydockerapp khanalmamun/capstone:new (for me khanalmamun is my account name capstone is repository name and new is tag. This should be changed accordingly).Finaly it is pushed to docker hub.

- Deployment: 
First kubectl need to be installed in the machine. kctl.txt has the necessary repo lines that set kubernetes repo to look for installation. You can visit kubectl https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/

```bash
      - run:
          name: Install kubectl
          command: |
            yum install -y sudo 
            cat kctl.txt >> /etc/yum.repos.d/kubernetes.repo
            sudo yum install -y kubectl

```
- Deploy app to cluster
```bash
      - run:
          name: Join to EKS by kubectl  
          command: |
            
            aws eks --region us-east-1 update-kubeconfig --name EKSCluster
            kubectl cluster-info
      
      - run:
          name: Deploy app and service 
          command: |
            kubectl apply -f ./k8/deployment.yaml
            kubectl apply -f ./k8/service.yaml 
            kubectl get pod -w & kubectl get deployment
            sleep 4m 

```

Please set region and <EKSCluster> name as per your region and Kluster name. Also set images in deployment.yaml file according to your docker image.
Sleep 4m is set for waiting so that deployment is done and ready for next jon in config file.

- Rollback
```bash

      - run:
          name: Roll back to previous deployment if fail
          command: |
            sleep 1m 
            
            export URL=$(kubectl get svc capstoneapp -o jsonpath='{.status.loadBalancer.ingress[*].hostname}')
            
            if curl -s http://"${URL}":3000 | grep "React"
            then
              echo "All done"
            else
              kubectl rollout undo deployments/capstoneapp
            fi
            

``` 
Plesae change the service name here as per the service name given is service.yaml file. This sction will delete failed deployment and roll out to previous succesful deployment.


## Screenshots

Please navigate to Screenshots folder in github repo.


## Support

For support, email almmaunkhan09@gmail.com or khanalmamunfau@gmail.com

