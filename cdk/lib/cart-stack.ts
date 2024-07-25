import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

export class CartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartServiceLambda = new lambda.Function(this, 'CartServiceLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'lambda.handler',
      code: lambda.Code.fromAsset(
        'C:/Users/skuze/OneDrive/Документы/Sergej/Kursi/AWS Cloud Developer/Task8_card/nodejs-aws-cart-api/dist',
      ),
      environment: {},
    });

    const api = new RestApi(this, 'CartServiceApi', {
      deploy: true,
      defaultMethodOptions: {
        apiKeyRequired: true,
      },
    });

    api.root.addProxy({
      defaultIntegration: new LambdaIntegration(cartServiceLambda, {
        proxy: true,
      }),
    });
  }
}
