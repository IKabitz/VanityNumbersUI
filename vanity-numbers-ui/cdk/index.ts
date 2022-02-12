import * as cdk from '@aws-cdk/core';
import { VanityUIStack } from './stack';

const app = new cdk.App();
new VanityUIStack(app, 'ReactAppStack');