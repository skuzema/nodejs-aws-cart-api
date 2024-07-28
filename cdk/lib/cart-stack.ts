import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

import { config } from 'dotenv';

config();

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const environment: { [key: string]: string } = {
      DB_HOST: process.env.DB_HOST || '',
      DB_PORT: process.env.DB_PORT || '',
      DB_USERNAME: process.env.DB_USERNAME || '',
      DB_PASSWORD: process.env.DB_PASSWORD || '',
      DB_DATABASE: process.env.DB_DATABASE || '',
    };

    const cartServiceLambda = new lambda.Function(this, 'CartServiceLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(
        'C:/Users/skuze/OneDrive/Документы/Sergej/Kursi/AWS Cloud Developer/Task8_card/nodejs-aws-cart-api/dist',
      ),
      timeout: cdk.Duration.seconds(10),
      environment,
    });

    const api = new LambdaRestApi(this, 'cartServiceApi', {
      deploy: true,
      restApiName: 'CartServiceApi',
      handler: cartServiceLambda,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    new cdk.CfnOutput(this, 'cart', {
      value: api.url,
    });
  }
}
