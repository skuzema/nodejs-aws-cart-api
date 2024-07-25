import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import serverlessExpress from '@vendia/serverless-express';
import { Context, Handler, APIGatewayProxyEvent } from 'aws-lambda';
import express from 'express';
import { AppModule } from './app.module';

let cachedServer: Handler;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors();

    await nestApp.init();

    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer;
}

interface CustomAuthorizerResponse {
  principalId: string;
  policyDocument: {
    Version: string;
    Statement: {
      Action: string;
      Effect: string;
      Resource: string;
    }[];
  };
}

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
): CustomAuthorizerResponse => {
  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  };

  return {
    principalId,
    policyDocument,
  };
};

const validateToken = (token: string): boolean => {
  return true;
};

const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: any,
) => {
  if (!event.headers.Authorization) {
    return callback(
      null,
      generatePolicy('user', 'Deny', event.requestContext.resourceId),
    );
  }

  const token = event.headers.Authorization.split(' ')[1];
  if (!validateToken(token)) {
    return callback(
      null,
      generatePolicy('user', 'Deny', event.requestContext.resourceId),
    );
  }

  const server = await bootstrap();
  return server(event, context, callback);
};

module.exports.handler = handler;
