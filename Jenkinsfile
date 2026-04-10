// Jenkinsfile.frontend

pipeline {
    agent any

    parameters {
        booleanParam(name: 'SKIP_TESTS',
                    defaultValue: false,
                    description: 'Skip tests for emergency deploys only')
    }

    triggers {
        githubPush()
    }

    environment {
        AWS_REGION   = "ap-south-1"

        ECR_REGISTRY = "024258572315.dkr.ecr.ap-south-1.amazonaws.com"
        ECR_REPO     = "himanshu22/task-manager-application-r-frontend"

        IMAGE_TAG    = "production-${BUILD_NUMBER}"
        ECS_CLUSTER  = "task-manager-production"
        ECS_SERVICE  = "Task-Manager-Application-FrontEnd-Task-service-ywqg7vfx"

        NOTIFY_EMAIL = "himanshupawar2203@gmail.com"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-credentials-new',
                    url: 'https://github.com/Pawarhimanshu22/Task-Manager-Application-R-Frontend.git'

                echo "Checked out — building ${IMAGE_TAG}"
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Build React App') {
            steps {
                sh "REACT_APP_ENV=production npm run build"
            }
        }

        stage('Docker Build') {
            steps {
                sh """
                    docker build \
                        -f Dockerfile.nginx \
                        -t ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG} \
                        -t ${ECR_REGISTRY}/${ECR_REPO}:production-latest \
                        .
                """
            }
        }

        //  AWS Credentials used ONLY here
        stage('Push to ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        aws ecr get-login-password --region ${AWS_REGION} | \
                        docker login --username AWS \
                        --password-stdin ${ECR_REGISTRY}

                        docker push ${ECR_REGISTRY}/${ECR_REPO}:${IMAGE_TAG}
                        docker push ${ECR_REGISTRY}/${ECR_REPO}:production-latest
                    """
                }
            }
        }

        stage('Approval') {
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    input message: "🚦 Deploy frontend #${BUILD_NUMBER} to PRODUCTION?",
                          ok: 'Yes, Deploy Now'
                }
            }
        }

        // AWS Credentials used here also
        stage('Deploy to ECS') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-credentials'
                ]]) {
                    sh """
                        aws ecs update-service \
                            --cluster  ${ECS_CLUSTER} \
                            --service  ${ECS_SERVICE} \
                            --force-new-deployment \
                            --region   ${AWS_REGION}

                        aws ecs wait services-stable \
                            --cluster  ${ECS_CLUSTER} \
                            --services ${ECS_SERVICE} \
                            --region   ${AWS_REGION}
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                retry(3) {
                    sh """
                        sleep 10
                        curl -f http://task-manager-alb-284349267.ap-south-1.elb.amazonaws.com
                    """
                }
            }
        }
    }

    post {
        success {
            mail to: "${NOTIFY_EMAIL}",
                subject: "Frontend deployed — #${BUILD_NUMBER}",
                body: "Image: ${IMAGE_TAG}\n${BUILD_URL}"
        }
        failure {
            mail to: "${NOTIFY_EMAIL}",
                subject: "Frontend FAILED — #${BUILD_NUMBER}",
                body: "${BUILD_URL}console"
        }
        always {
            sh 'docker image prune -f'
            cleanWs()
        }
    }
}