"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VanityUIStack = void 0;
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const origins = require("@aws-cdk/aws-cloudfront-origins");
const deploy = require("@aws-cdk/aws-s3-deployment");
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
    }
}
exports.VanityUIStack = VanityUIStack;
