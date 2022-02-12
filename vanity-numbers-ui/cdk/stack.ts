import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as deploy from '@aws-cdk/aws-s3-deployment';


export class VanityUIStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string) {
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
        })

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
        })
    }
}