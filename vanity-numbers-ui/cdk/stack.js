"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VanityUIStack = void 0;
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const origins = require("@aws-cdk/aws-cloudfront-origins");
const deploy = require("@aws-cdk/aws-s3-deployment");
const lambda = require("@aws-cdk/aws-lambda");
const apigateway = require("@aws-cdk/aws-apigateway");
const iam = require("@aws-cdk/aws-iam");
class VanityUIStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id, {
            env: {
                account: "807364992610",
                region: "us-east-1"
            }
        });
        // Create S3 bucket for static site
        const bucket = new s3.Bucket(this, "VanityUIBucket", {
            bucketName: "vanity-number-site-ui",
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY
        });
        // Create Cloud Distribution
        const distribution = new cloudfront.Distribution(this, "VanityUIDistribution", {
            defaultBehavior: {
                origin: new origins.S3Origin(bucket)
            }
        });
        // Bucket deployment of static react app
        new deploy.BucketDeployment(this, "VanityUIDeployment", {
            sources: [deploy.Source.asset("./build")],
            destinationBucket: bucket,
            distribution: distribution,
            distributionPaths: ["/*"]
        });
        // Lambda IAM Role to provide access to dynamoDB
        const lambdaAccessRole = new iam.Role(this, 'VanityLambdaRole', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
        });
        lambdaAccessRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));
        // Lambda for accessing the DynamoDB table
        const handler = new lambda.Function(this, "VanityNumberHandler", {
            runtime: lambda.Runtime.NODEJS_14_X,
            code: lambda.Code.fromAsset("build-lambda"),
            handler: "app.lambdaHandler",
            role: lambdaAccessRole
        });
        // API Gateway that represents the vanity numbers service
        const api = new apigateway.RestApi(this, "vanity-numbers-api", {
            restApiName: "Vanity Numbers Service",
            description: "This service produces recently contacted vantity numbers."
        });
        // API Gateway integration that represents the handler which produces the 
        const numbersIntegration = new apigateway.LambdaIntegration(handler, {
            requestTemplates: { "application/json": '{ "statusCode": "200" }' }
        });
        // API endpoint for lambda integration
        api.root.addMethod("GET", numbersIntegration);
    }
}
exports.VanityUIStack = VanityUIStack;
