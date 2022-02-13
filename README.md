# Vanity Numbers UI
This repository contains the serverless static react site that I used to make a simple UI to read the 5 latest callers to the Vanity Numbers Application.

To quickly summarize, this application uses AWS CDK to deploy a react static site to and S3 bucket, constructs a lambda function that reads the latest callers from the VanityNumbers DynamoDB database, and an API Gateway Rest service with a lambda proxy integration for the vanity numbers retrieval lambda.

 1. The Static React Site
 2. The CloudFront Distribution and S3 Bucket
 3. The API Gateway and the Lambda
 4. Improvements
 5. Why CDK?

### The Static React Site
Here, I wrote a simple react ui that is built and hosted statically on amazon S3. What it lacks in elegance, it makes up for with simplicity! The site has a component, VanityNumberSearch, that utilizes React's 'useEffect' hook to load the list of numbers from the DynamoDB database by using the axios library to call the API Gateway lambda proxy integration described in the cdk 'stack.ts' file.

### The CloudFront Distribution and S3 bucket
When the react site is built using `npm build`, it places the built assets into the build/ directory of the application. When we deploy the application on CDK using `npm deploy`, the application is uploaded to the S3 bucket defined in 'stack.ts', and the CloudFront Distribution and Origin are created or updated to point to the 'index.html' file of the containing bucket. This makes for an instantly deployed, no dns name, no certificate required secure serverless react site. This site has the ability to handle extremely high throughput, as it is completely hosted through AWS S3.

The simplicity of the CDK tooling allows us to deploy the application again and again without needing to manually adjust infrastructure. Deploying a new version of the website is as easy as running two console commands.

### The API Gateway Rest api and Lambda
As a part of the UI, we need to have the ability to securely access the DynamoDB table results. But, we can't just access them using JavaScript on the site page! That could result in us insecurely storing access credentials for the sdk. We needed a way to access the Vanity Number results securely.

The API Gateway Rest api, and the lambda integration allows us to scan for the 5 latest entries into the table, just by performing a GET to the API Gateway URL belonging to it's prod stage.

### Improvements
Unfortunately, due to time restraints (and the fact that the web ui is considered 'extra credit') the web UI application itself could use remediation in a few problem areas.

 1. Secure Site access: The site and API Gateway need to be secured using AWS Cognito for sign up and login, and then in turn utilizing an Authorizer lambda to check the security JWT token issued by cognito when the user requests the list of numbers.
 2. General UI improvements: I am no css picasso, but we could have used a simple react UI framework like Material UI to make the site more pleasing to the eye, given a little more time.
 3. Unit tests for the lambda.
 4. Error handling for the React site request which displays error messages to the console or screen if there is an issue with the site.

### Why CDK?
In the end, I chose to deploy the UI application using the AWS CDK because of the few options provided for the deployment package in the requirements, AWS SAM and AWS CDK were the two I had never before used, and I wanted to demonstrate my ability to learn new tools quickly. Luckily, there are no shortages of examples and documentation about using the AWS CDK!

The CDK is extremely useful for configuring and deploying cloud applications and even more complicated workloads. The fact that we can use it to instrument any number of resources leaves a lot of implementation details up to the developer, which is ideal. Here, I utilized a single stack to produce all of the elements of the solution, but we could hypothetically deploy multiple stacks, one just for the site, and one for the API Gateway and Lambda integration. This allows us to easily manage the different pieces of the solution, without possibly deploying changes for other pieces that we aren't ready to modify.
