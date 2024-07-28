#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CartStack } from '../lib/cart-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new CartStack(app, 'CartStack', {});
